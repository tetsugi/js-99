import { permutations, range } from './array'

/**
 * Nクイーン問題を解く
 * @param {number} size 盤面のサイズ
 * @returns {number[][]} クイーンの位置のリスト
 */
export function* queens(size = 8) {
  const board = []

  for (let i = 0; i < size; i++) { 
    board.push(Array(size).fill(0)) 
  }

  /**
   * 盤面にクイーンを置き、配置できない場所を塞ぐ  
   * 取り除く場合は逆の操作を行う
   * @param {number[][]} board 盤面
   * @param {number} row 行
   * @param {number} column 列
   * @param {boolean} isRemove trueならクイーンを取り除く
   */
  const block = (row, column, isRemove = false) => {
    const n = isRemove ? -1 : 1

    // 横と縦
    for (let i = 0; i < size; i++) {
      board[row][i] += n
      board[i][column] += n
    }

    // 右斜め下
    if (row > column) {
      for (let i = 0; i < size - (row - column); i++) {
        board[i + row - column][i] += n
      }
    } else {
      for (let i = 0; i < size - (column - row); i++) {
        board[i][i + column - row] += n
      }
    }

    // 左斜め下
    const condition = row + column < size
    const start = condition ? 0 : row + column - size + 1
    const max = condition ? row + column + 1 : size

    for (let i = start; i < max; i++) {
      board[row + column - i][i] += n
    }
  }

  /**
   * クイーンを配置・検査していき、最後の行まで達したら結果を格納する
   * @param {number} row 行 
   * @param {number[]} queens 現在までのクイーンの位置
   * @param {number[][]} board 盤面
   * @returns {IterableIterator<number[]>} 確定したクイーンの位置
   */
  function* generate(row = 0, queens = []) {
    if (row === size) {
      yield queens.map(e => e + 1)
      return
    }

    for (let column = 0; column < size; column++) if (board[row][column] === 0) {
      queens[row] = column
      block(row, column)
      yield* generate(row + 1, queens, board)
      block(row, column, true)
    }
  }

  yield* generate()
}

/**
 * ナイト・ツアー問題を解く
 * @param {number[]} param0 座標
 * @param {number[]} param1 盤の大きさ(横, 縦)
 * @param {{isClosed: boolean, isWarnsdorf: boolean}} param2 検索オプション
 * @returns {IterableIterator<number[][]>} ナイトの辿った経路
 */
export function* knightsTour([x, y] = [1, 1], [width, height] = [8, 8], {isClosed, isWarnsdorf} = {isClosed: false, isWarnsdorf: true}) {
  if (width < 1 || height < 1) throw new Error('不正な盤面のサイズです')
  if (!(x >= 1 && y >= 1 && x <= width && y <= height)) throw new Error('ナイトの初期位置が盤外です')

  x -= 1
  y -= 1
  const board = []

  for (let i = 0; i < height + 4; i++) { 
    board.push(Array(width + 4).fill(1)) 
  }

  /**
   * 次のナイトの行先を列挙する
   * @param {number} i y座標
   * @param {number} j x座標
   */
  const destinations = (i, j) => [
    [i - 2, j - 1], [i - 2, j + 1], [i - 1, j - 2], [i - 1, j + 2],
    [i + 1, j - 2], [i + 1, j + 2], [i + 2, j - 1], [i + 2, j + 1]
  ]

  /**
   * 次のナイトの行先を決定する
   * @param {number} i y座標
   * @param {number} j x座標
   */
  const next = (i, j) => destinations(i, j)
    .filter(([y, x]) => x >= 0 && x < width && y >= 0 && y < height && board[y][x] >= 0)

  /**
   * ナイトを巡歴させる
   * @param {number} i y座標
   * @param {number} j x座標
   * @param {number[][]} route 現在までにナイトが辿った経路
   * @param {number} count 何巡目か
   * @returns {IterableIterator<number[][]>} ナイトの辿った経路
   */
  function* generate(i = y, j = x, route = [], count = 0) {
    route[count++] = [j, i]

    if (!isClosed && count === width * height) {
      yield route.map(([x, y]) => [x + 1, y + 1])
      return
    }

    board[i][j] = -1
    const dests = destinations(i, j)
    let nextRoutes = next(i, j)

    if (isWarnsdorf) {
      nextRoutes = nextRoutes.map(([y, x]) => [[y, x], next(y, x).length])
        .sort(([,a], [,b]) => a - b)
        .map(([e,]) => e)
    }

    if (isClosed && count === width * height && nextRoutes.length === 0) {
      const found = dests.some(([i, j]) => i === y && j === x)
      if (found) yield route.map(([x, y]) => [x + 1, y + 1])
    } 
    else for (const [nextY, nextX] of nextRoutes) {
      yield* generate(nextY, nextX, route, count)
    }

    board[i][j] = 1
  }

  yield* generate()
}

/**
 * コッホ予想を解く  
 * 小さい木の場合しか解けない
 * @param {number[][]|string[][]} edges 辺のリスト
 * @returns {[number[], number[]][]} 頂点のラベルと各辺のコスト
 */
export function* vonKoch(edges) {
  for (const nodes of permutations(range(1, edges.length + 1))) {
    const degrees = edges.map(([from, to]) => Math.abs(nodes[from - 1] - nodes[to - 1]))
    const isFound = degrees.filter((e, i, self) => self.indexOf(e) === i).length === edges.length

    if (isFound) yield [nodes, degrees]
  }
}

/**
 * 四則演算と等号と括弧を使って与えられた数列内で等式が成り立つものを見つける  
 * 数列の順番は固定する
 * @param {number[]} numbers 数列
 * @returns {IterableIterator<string>} 等式
 */
export function* puzzle(numbers) {
  const add = (a, b) => a + b
  const sub = (a, b) => a - b
  const mul = (a, b) => a * b
  const div = (a, b) => a / b

  /**
   * 配列を指定位置で分ける
   * @param {number[]} list 
   * @param {number} n 
   */
  const splitAt = (list, n) => {
    list = [...list]
    return [list, list.splice(n)]
  }

  /**
   * 
   * @param {number[]} numbers
   * @returns {IterableIterator<[string, number, string]>}
   */
  function* generate(numbers) {
    if (numbers.length === 1) {
      yield [numbers[0] + '', numbers[0], '_']
      return
    }

    for (const i of range(1, numbers.length - 1)) {
      const [left, right] = splitAt(numbers, i).map(e => [...generate(e)])
      const operators = [['+', add], ['-', sub], ['*', mul], ['/', div]]

      for (const [sl, vl, opsl] of left) for (const [sr, vr, opsr] of right) for (const [ops, op] of operators) {
        if ((ops === '/' && vr === 0) || 
          (ops === '+' && (opsr === '+' || opsr === '-')) || 
          (ops === '*' && (opsr === '*' || opsr === '/'))) continue

        const expression = `${ 
          (opsl !== '_' && 
          (ops === '*' || ops === '/') && 
          (opsl === '+' || opsl === '-')) ? `(${sl})` : sl 
        } ${ ops } ${
          (opsr !== '_' && 
          ((ops === '-' && opsr !== '*' && opsr !== '/') || (ops === '*' && (opsr === '+' || opsr === '-')) 
          || ops === '/')) ? `(${sr})` : sr
        }`

        yield [expression, op(vl, vr), ops]
      }
    }
  }

  for (const i of range(1, numbers.length - 1)) {
    const [left, right] = splitAt(numbers, i).map(e => [...generate(e)])
    
    for (const [sl, vl,] of left) for (const [sr, vr,] of right) {
      if (vl === vr) yield `${sl} = ${sr}`
    }
  }
}

export const regular = (n, degree) => {

}

/**
 * 数字を英単語に変換する
 * @param {number} number 数字
 * @returns {string} 英単語に変換された数字
 */
export const fullWords = number => [...(number + '')].map(e => {
  switch (e) {
    case '0': return 'zero'
    case '1': return 'one'
    case '2': return 'two'
    case '3': return 'three'
    case '4': return 'four'
    case '5': return 'five'
    case '6': return 'six'
    case '7': return 'seven'
    case '8': return 'eight'
    case '9': return 'nine'
    default: return 'unknown'
  }
}).join('-')

/**
 * Adaの識別子かどうかを返す
 * @param {string} str 文字列
 * @returns Adaの識別子かどうか
 */
export const identifier = str => /^[a-zA-Z](-?[a-zA-Z0-9])*$/.test(str)

export const crossword = filePath => {

}