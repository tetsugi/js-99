/**
 * 二分木を表現する
 * @author tetsugi
 */
export default class BinaryTree {
  
  /**
   * 二分木を生成する  
   * 第一引数が配列のときはそれを用いて木構造を構築し、それ以外のときは引数に応じて木構造を構築する
   * @param {any} value ノードに入る値もしくは木構造の配列表現
   * @param {any} left 左部分木
   * @param {any} right 右部分木
   */
  constructor(value, left = null, right = null) {
    if (Array.isArray(value)) { [value, left, right] = value } 
    else if (value instanceof BinaryTree) { ({value, left, right} = value) }

    this.value = value
    this.left = left !== null ? new BinaryTree(left) : left
    this.right = right !== null ? new BinaryTree(right) : right
  }

  /**
   * 二分木が対称かどうかを返す
   * @returns {boolean} 対称かどうか
   */
  get isSymmetric() {
    const mirror = (x, y) => {
      if (x === null && y === null) return true
      if (x !== null && y !== null) return mirror(x.left, y.right) && mirror(x.right, y.left)
      return false
    }
    return mirror(this, this)
  }

  /**
   * 合計ノード数を返す
   * @returns {number} 合計ノード数
   */
  get countNodes() {
    const count = tree => tree === null ? 0 : count(tree.left) + count(tree.right) + 1
    return count(this)
  }

  /**
   * 葉の数を返す
   * @returns {number} 葉の数
   */
  get countLeaves() {
    const count = tree => {
      if (tree === null) return 0
      const { left, right } = tree
      return left === null && right === null ? 1 : count(left) + count(right)
    }
    return count(this)
  }

  /**
   * 葉のリストを返す
   * @returns {any[]} 葉のリスト
   */
  get leaves() {
    const take = tree => {
      if (tree === null) return []
      const { value, left, right } = tree
      return left === null && right === null ? [value] : [...take(left), ...take(right)]
    }
    return take(this)
  }

  /**
   * 内部ノードのリストを返す
   * @returns {any[]} 内部ノードのリスト
   */
  get internals() {
    const take = tree => {
      if (tree === null) return []
      const { value, left, right } = tree
      return left === null && right === null ? [] : [value, ...take(left), ...take(right)]
    }
    return take(this)
  }

  /**
   * 指定した深さのノードのリストを返す
   * @param {number} level 深さ
   * @returns {any[]} ノードのリスト
   */
  atLevel(level) {
    if (level === 1) return [this.value]

    if (level > 1) {
      const left = this.left === null ? [] : this.left.atLevel(level - 1)
      const right = this.right === null ? [] : this.right.atLevel(level - 1)
      return [...left, ...right]
    }
    return []
  }

  /**
   * 完全二分木かどうかを返す
   * @returns {boolean} 完全二分木かどうか
   */
  get isCompleteBinaryTree() {
    const equals = (x, y) => {
      if (x === null && y === null) return true
      if (x !== null && y !== null) return equals(x.left, y.left) && equals(x.right, y.right)
      return false
    }
    return equals(this, BinaryTree.completeBinaryTree(this.countNodes))
  }

  /**
   * 各ノードの座標のリストを返す
   * @returns {{ value: any, x: number, y: number }[]} ノードの座標のリスト
   */
  get positions() {
    const f = tree => {
      if (tree === null) return []
      const { value, x, y } = tree
      return [{ value, x, y }, ...f(tree.left), ...f(tree.right)]
    }
    return f(this)
  }

  /**
   * ノードに座標を割り振る  
   * x座標は通りがけ順に走査したときの順番、y座標はそのノードがある深さとする
   * @returns {BinaryTree} this
   */
  layout() {
    const f = (x, y, tree) => {
      if (tree === null) return x
      
      const lx = f(x, y + 1, tree.left)
      tree.x = lx
      tree.y = y

      return f(lx + 1, y + 1, tree.right)
    }
    
    f(1, 1, this)
    return this
  }

  /**
   * 二分木の高さを返す
   * @returns {number} 高さ
   */
  get height() {
    const f = tree => tree === null ? 0 : Math.max(f(tree.left), f(tree.right)) + 1
    return f(this)
  }

  /**
   * 左部分木だけで二分木の高さを測る
   * @returns {number} 高さ
   */
  get leftHeight() {
    const f = tree => tree === null ? 0 : f(tree.left) + 1
    return f(this)
  }

  /**
   * なるべく対称となるように、幅を広めにとってノードに座標を割り振る
   * @returns {BinaryTree} this
   */
  wideLayout() {
    const f = (x, y, sep, tree) => {
      if (tree === null) return

      tree.x = x
      tree.y = y
      f(x - sep, y + 1, sep / 2, tree.left)
      f(x + sep, y + 1, sep / 2, tree.right)
    }

    const h = this.height
    const lh = this.leftHeight
    const x = 2 ** (h - 1) - 2 ** (h - lh) + 1
    const sep = 2 ** (h - 2)

    f(x, 1, sep, this)
    return this
  }

  /**
   * なるべく対称性を保ちつつ、コンパクトになるようにノードに座標を割り振る
   * @returns {BinaryTree} this
   */
  compactLayout() {
    const margin = (left, right) => {
      if (left === null || right === null) return 1
      if (left.right === null || right.left === null) return 1
      return margin(left.right, right.left) + 1
    }

    const layout = (x, y, tree) => {
      if (tree === null) return
      tree.x = x
      tree.y = y
      
      const m = margin(tree.left, tree.right)
      layout(x - m, y + 1, tree.left)
      layout(x + m, y + 1, tree.right)
    }

    const leftX = tree => tree.positions.sort(({x: a}, {x: b}) => a - b)[0].x

    layout(0, 1, this)
    const x = Math.abs(leftX(this)) + 1
    layout(x, 1, this)

    return this
  }

  /**
   * 前順で走査してノードの配列を返す
   * @returns {any[]} ノードの配列
   */
  get preorder() {
    const f = tree => tree === null ? [] : [tree.value, ...f(tree.left), ...f(tree.right)]
    return f(this)
  }

  /**
   * 中順で走査してノードの配列を返す
   * @returns {any[]} ノードの配列
   */
  get inorder() {
    const f = tree => tree === null ? [] : [...f(tree.left), tree.value, ...f(tree.right)]
    return f(this)
  }

  /**
   * 木構造を文字とドットで表現した文字列として返す  
   * 全てのノードの値がstringかつ一文字の場合でないと正しく動作しない
   * @returns {string} 木構造を文字とドットで表現した文字列
   */
  toDotstr() {
    const f = tree => tree === null ? '.' : tree.value + f(tree.left) + f(tree.right)
    return f(this)
  }

  /**
   * 木構造をJSONにして返す
   * @returns {string} JSON
   */
  toString() {
    return JSON.stringify(this, null, 2)
  }
}

/**
 * 左部分木と右部分木のノードの数の差が1以下である二分木を全て生成する
 * @param {number} n 全ノード数
 * @returns {BinaryTree[]} 二分木のリスト
 */
BinaryTree.cbalTree = n => {
  n = Math.floor(n)
  if (n <= 0) return [null]
  if (n === 1) return [new BinaryTree('x')]
  
  const result = []

  if (n % 2 === 1) {
    const trees = BinaryTree.cbalTree((n - 1) / 2)
    trees.forEach(left => trees.forEach(right => result.push(new BinaryTree('x', left, right))))

  } else {
    const left = BinaryTree.cbalTree(n / 2 - 1)
    const right = BinaryTree.cbalTree(n / 2)

    left.forEach(l => right.forEach(r => result.push(...[new BinaryTree('x', l, r), new BinaryTree('x', r, l)])))
  }

  return result
}

/**
 * 数値の配列から二分探索木を生成する
 * @param {number[]} numbers 数値の配列
 * @returns {BinaryTree} 二分探索木
 */
BinaryTree.searchTree = numbers => {
  if (numbers.length === 0) return null
  const [x, ...xs] = numbers

  const tree = new BinaryTree(x)
  let target = tree

  const insert = n => {
    const property = n < target.value ? 'left' : 'right'

    if (target[property] !== null) {
      target = target[property]
      insert(n)
    } else {
      target[property] = new BinaryTree(n)
      target = tree
    }
  }
  xs.forEach(insert)
  
  return tree
}

/**
 * 平衡かつ対称な二分木があれば返す
 * @param {number} n ノード数
 * @returns {BinaryTree[]} 二分木のリスト
 */
BinaryTree.symCbalTrees = n => BinaryTree.cbalTree(n).filter(e => e.isSymmetric)

/**
 * AVL木（左部分木と右部分木の高さの差が1以下である二分木）のリストを生成する
 * @param {number} maxHeight 木の最大の高さ
 * @returns {BinaryTree[]} AVL木のリスト
 */
BinaryTree.hbalTree = maxHeight => {
  if (maxHeight <= 0) return [null]
  if (maxHeight === 1) return [new BinaryTree('x')]

  const highers = BinaryTree.hbalTree(maxHeight - 1)
  const lowers = BinaryTree.hbalTree(maxHeight - 2)

  const result = []
  lowers.forEach(lower => highers.forEach(higher => result.push(new BinaryTree('x', lower, higher))))
  highers.forEach(x => highers.forEach(y => result.push(new BinaryTree('x', x, y))))
  highers.forEach(higher => lowers.forEach(lower => result.push(new BinaryTree('x', higher, lower))))

  return result
}

/**
 * AVL木の最大の高さを求める
 * @param {number} n ノード数
 * @param {number} prev 数列の前の値
 * @param {number} ac アキュムレータ
 * @param {number} height 現在の高さ
 */
const hbalTreeMaxHeight = (n, prev = 0, ac = 1, height = 1) => {
  if (n < 1) return 0
  const value = prev + ac + 1
  return n < value ? height : hbalTreeMaxHeight(n, ac, value, height + 1)
}

/**
 * 合計ノード数を引数として、AVL木のリストを生成する
 * @param {number} n ノード数
 * @returns {BinaryTree[]} AVL木のリスト
 */
BinaryTree.hbalTreeNodes = n => {
  if (n <= 0) return [null]

  const minHeight = Math.ceil(Math.log2(n + 1))
  const maxHeight = hbalTreeMaxHeight(n)
  const result = []

  for (let i = minHeight; i <= maxHeight; i++) {
    const trees = BinaryTree.hbalTree(i).filter(e => e.countNodes === n)
    result.push(...trees)
  }
  return result
}

/**
 * 指定されたノード数の完全二分木を生成する
 * @param {number} n ノード数
 * @returns {BinaryTree} 完全二分木
 */
BinaryTree.completeBinaryTree = n => ((f = x => x > n ? null : new BinaryTree('x', f(x * 2), f(x * 2 + 1))) => f(1))()

/**
 * 二分木の文字列表現を二分木に変換する
 * @param {string} str 二分木の文字列表現
 * @returns {BinaryTree} 二分木
 */
BinaryTree.stringToTree = str => {
  if (str === null) return null

  const regex = /^([^\(\,]+)\((.+)\)$/
  const groups = regex.exec(str)
  
  if (groups === null) {
    if (str.indexOf('(') !== -1 || str.indexOf(')') !== -1 || str.indexOf(',') !== -1) throw new Error('parse error')
    return new BinaryTree(str)
  }
  
  const [, id, arg] = groups
  const args = []
  let value = null
  let brace = 0

  for (let i = 0; i < arg.length; i++) {
    const current = arg[i]

    if (current === ',' && brace === 0) {
      args.push(value)
      value = null
    } else {
      value = (value || '') + current
    
      brace = current === '(' ? brace + 1 
        : current === ')' ? brace - 1 
        : brace
    }

    if (i === arg.length - 1) { args.push(value) }
  }
  if (args.length !== 2) throw new Error('parse error')

  const [left, right] = args
  return new BinaryTree(id, BinaryTree.stringToTree(left), BinaryTree.stringToTree(right))
}

/**
 * 前順と中順で走査して生成された配列から二分木を構築する
 * @param {any[]} preorder 前順
 * @param {any[]} inorder 中順
 * @returns {BinaryTree} 二分木
 */
BinaryTree.preInTree = (preorder, inorder) => {
  if (preorder.length === 0 || inorder.length === 0) return null
  if (inorder.length === 1) return new BinaryTree(inorder[0])

  const [x, ...xs] = preorder
  const index = inorder.indexOf(x)
  if (index === -1) return BinaryTree.preInTree(xs, inorder)

  const left = inorder.slice(0, index)
  const right = inorder.slice(index + 1, inorder.length)

  return new BinaryTree(x, BinaryTree.preInTree(xs, left), BinaryTree.preInTree(xs, right))
}

/**
 * 文字とドットで表現した二分木を変換する
 * @param {string} 文字とドットで表現した二分木
 * @returns {BinaryTree} 二分木
 */
BinaryTree.dotstrToTree = ds => {
  const f = str => {
    if (str.length === 0) return [null, '']

    let [x, ...xs] = [...str]
    xs = xs.join('')

    if (x === '.') return [null, xs]
    
    const [left, ys] = f(xs)
    const [right, rest] = f(ys)
    return [new BinaryTree(x, left, right), rest]
  }
  return f(ds)[0]
}
