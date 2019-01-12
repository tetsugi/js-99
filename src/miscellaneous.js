import { isEqual, cloneDeep, findIndex } from 'lodash'

import { permutations, combinations, lfsort } from './array'
import Graph from './Graph'

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
    if (row === size) return yield queens.map(e => e + 1)

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

  /** 現在までにナイトが辿った経路 */
  const route = []

  /**
   * ナイトを巡歴させる
   * @param {number} i y座標
   * @param {number} j x座標
   * @param {number} count 何巡目か
   * @returns {IterableIterator<number[][]>} ナイトの辿った経路
   */
  function* generate(i = y, j = x, count = 0) {
    route[count++] = [j, i]

    if (!isClosed && count === width * height) {
      return yield route.map(([x, y]) => [x + 1, y + 1])
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
      yield* generate(nextY, nextX, count)
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
  const numbers = [...Array(edges.length + 1)].map((_, i) => i + 1)

  for (const nodes of permutations(numbers)) {
    const costs = edges.map(([from, to]) => Math.abs(nodes[from - 1] - nodes[to - 1]))
    const isFound = costs.filter((e, i, self) => self.indexOf(e) === i).length === edges.length

    if (isFound) yield [nodes, costs]
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
   * @param {number[]} list 配列
   * @param {number} n 添え字
   */
  const splitAt = (list, n) => {
    list = [...list]
    return [list, list.splice(n)]
  }

  /**
   * 四則演算のパターンを生成する
   * @param {number[]} numbers 数列
   * @returns {IterableIterator<[string, number, string]>} [数式, 数値, 演算子]
   */
  function* generate(numbers) {
    if (numbers.length === 1) return yield [numbers[0] + '', numbers[0], '_']

    for (let i = 1; i < numbers.length; i++) {
      const [left, right] = splitAt(numbers, i).map(e => [...generate(e)])
      const operators = [['+', add], ['-', sub], ['*', mul], ['/', div]]

      for (const [sl, vl, opsl] of left) for (const [sr, vr, opsr] of right) for (const [ops, op] of operators) {
        if ((ops === '/' && vr === 0) || 
          (ops === '+' && (opsr === '+' || opsr === '-')) || 
          (ops === '*' && (opsr === '*' || opsr === '/'))) continue

        const expression = `${ 
          ((ops === '*' || ops === '/') && 
          (opsl === '+' || opsl === '-')) ? `(${sl})` : sl 
        } ${ ops } ${
          (((ops === '-' || ops === '*') && (opsr === '+' || opsr === '-'))
          || (ops === '/' && opsr !== '_')) ? `(${sr})` : sr
        }`

        yield [expression, op(vl, vr), ops]
      }
    }
  }

  for (let i = 1; i < numbers.length; i++) {
    const [left, right] = splitAt(numbers, i).map(e => [...generate(e)])
    
    for (const [sl, vl,] of left) for (const [sr, vr,] of right) {
      if (vl === vr) yield `${sl} = ${sr}`
    }
  }
}

/**
 * k-正則単純グラフを探す  
 * なるべくグラフ同型なものを排除しているが、完全には排除しきれていない
 * @param {number} n 頂点数
 * @param {number} k 次数
 * @returns {IterableIterator<Graph>} k-正則単純グラフのリスト
 */
export function* regular(n, k) {
  // n * kが2で割り切れないと辺が余るのでk-正則になり得ない
  if (n * k % 2 === 1 || n <= k || n < 0 || k < 0) return

  /**
   * k-正則グラフを探す
   * @param {Graph} graph 操作中のグラフ
   * @param {number} target 頂点のラベル
   * @param {number[]} rest 残りの頂点のラベル
   * @returns {IterableIterator<Graph>} k-正則グラフ
   */
  function* generate(graph, rest) {
    const [target, ...rs] = rest
    const degree = graph.degree(target)
    const done = degree === k

    if (!rs.length) { 
      if (done) yield graph
      return
    }

    if (done) { return yield* generate(graph, rs) }
    if (k - degree > rs.length) return

    const combi = combinations(rs, k - degree)
      .map(x => [x, x.map(y => graph.degree(y))])
      .filter(([,x], i, self) => self.findIndex(([,y]) => isEqual(x, y)) === i)
      .map(([e,]) => e)

    for (const selections of combi) {
      const g = graph.copy()
      selections.forEach(selection => g.connect(target, selection))
      yield* generate(g, rs)
    }
  }

  const labels = [...Array(n)].map((_, i) => i + 1)
  const graph = new Graph(labels)
  for (let i = 2; i < k + 2; i++) { graph.connect(1, i) }

  const [, ...rest] = labels
  yield* generate(graph, rest)
}

/** 数字の英単語 */
const numberNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

/**
 * 数字を英単語に変換する
 * @param {number} number 数字
 * @returns {string} 英単語に変換された数字
 */
export const fullWords = number => [...(number + '')].map(e => numberNames[e]).join('-')

/**
 * Adaの識別子かどうかを返す
 * @param {string} str 文字列
 * @returns Adaの識別子かどうか
 */
export const identifier = str => /^[a-zA-Z](_?[a-zA-Z0-9])*$/.test(str)

/**
 * クロスワードパズルを解く
 * @param {string} file クロスワードパズルの文字列表現
 * @returns {string} 完成したクロスワードパズル（解けなければnull）
 */
export const crossword = file => {
  const [words, puzzle] = file.split('\n\n').filter(e => e).map(e => e.split('\n').filter(e => e))
  lfsort(words)

  const lines = []

  for (let i = 0; i < puzzle.length; i++) {
    const row = puzzle[i]

    for (let j = 0; j < row.length; j++) {
      const char = row[j]
      if (char !== '.') continue

      // 横に繋がっているマスを探す
      if (row[j - 1] !== '.' && row[j + 1] === '.') {
        let count = 0
        for (; row[j + count] === '.'; count++) {}
        lines.push({ direction: 0, x: j, y: i, count })
      }
      // 縦に繋がっているマスを探す
      if ((!puzzle[i - 1] || puzzle[i - 1][j] !== '.') && (puzzle[i + 1] && puzzle[i + 1][j] === '.')) {
        let count = 0
        for (; puzzle[i + count] && puzzle[i + count][j] === '.'; count++) {}
        lines.push({ direction: 1, x: j, y: i, count })
      }
    }
  }

  if (words.length !== lines.length) return null

  /**
   * クロスワードパズルを解く
   * @param {string[]} restWords 残りの単語
   * @param {{ direction: number, x: number, y: number, count: number }[]} restLines 残りのマス
   * @param {string[][]} result 結果が格納される
   * @return {string[][]} 結果
   */
  const solve = (restWords = words, restLines = lines, result = [...Array(puzzle.length)].map(() => Array(puzzle[0].length).fill(' '))) => {
    if (!restWords.length) return result

    const [w, ...ws] = restWords
    let index = -1

    outer: while ((index = findIndex(restLines, ({ count }) => w.length === count, index + 1)) !== -1) {
      const { direction, x, y, count } = restLines[index]
      const board = cloneDeep(result)

      if (direction === 0) for (let i = 0; i < count; i++) {
        if (board[y][x + i] !== ' ' && w[i] !== board[y][x + i]) { continue outer } 
        board[y][x + i] = w[i]
      }
      else for (let i = 0; i < count; i++) {
        if (board[y + i][x] !== ' ' && w[i] !== board[y + i][x]) { continue outer }
        board[y + i][x] = w[i]
      }

      const found = solve(ws, restLines.filter((_, i) => i !== index), board)
      if (found) return found
    }

    return null
  }

  const result = solve()
  return result ? result.map(e => e.join('')).join('\n') : null
}