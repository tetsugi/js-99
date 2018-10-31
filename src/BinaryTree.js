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
  constructor(value = null, left = null, right = null) {
    if (Array.isArray(value)) {
      [value, left, right] = value
    } 

    this.value = value
    this.left = Array.isArray(left) ? new BinaryTree(left) : left
    this.right = Array.isArray(right) ? new BinaryTree(right) : right
  }

  /**
   * 二分木が対称かどうかを返す
   * @returns {boolean} 対称かどうか
   */
  get isSymmetric() {
    const mirror = (x, y) => {
      if (x === null && y === null) return true
      if (typeof(x) !== 'object' && typeof(y) !== 'object') return true
      
      if (x !== null && y !== null && typeof(x) === 'object' && typeof(y) === 'object') {
        return mirror(x.left, y.right) && mirror(x.right, y.left)
      }
      return false
    }
    return mirror(this, this)
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
