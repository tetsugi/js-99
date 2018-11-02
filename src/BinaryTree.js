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
    else if (BinaryTree.isBinaryTree(value)) { ({value, left, right} = value) }

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
   * 木構造をJSONにして返す
   * @returns {string} JSON
   */
  toString() {
    return JSON.stringify(this, null, 2)
  }
}

/**
 * BinaryTreeオブジェクトかどうかを返す
 * @param {any} obj 調べる対称
 * @returns {boolean} BinaryTreeオブジェクトかどうか
 */
BinaryTree.isBinaryTree = v => v !== null && typeof(v) === 'object' && v.hasOwnProperty('value') && v.hasOwnProperty('left') && v.hasOwnProperty('right')

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

