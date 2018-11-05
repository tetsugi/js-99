/**
 * 多分木を表現するクラス
 * @author tetsugi
 */
export default class MultiwayTree {

  /**
   * 多分木を生成する
   * @param {any} value ノードの値
   * @param  {...any} args 部分木
   */
  constructor(value, ...args) {
    if (Array.isArray(value)) { [value, ...args] = value } 
    else if (value instanceof MultiwayTree) { args = [...value]; ({ value } = value) }

    this.value = value
    args.forEach((e, i) => this[i] = e !== null ? new MultiwayTree(e) : e)
  }

  * [Symbol.iterator]() {
    for (let i = 0; typeof(this[i]) !== 'undefined'; i++) {
      yield this[i]
    }
  }

  /**
   * ノード数を返す
   * @returns {number} ノード数
   */
  get count() {
    const f = x => [...x].map(f).reduce((a, c) => a + c, 1)
    return f(this)
  }

  /**
   * 新たに子ノードを挿入する
   * @param {any} child 子ノード
   * @returns {number} 挿入後の子ノードの数
   */
  push(child) {
    let i = 0

    while (true) if (this[i]) { i++ } else {
      this[i] = new MultiwayTree(child)
      return i + 1
    }
  }

  /**
   * 根から全ノードまでの経路長の総和を返す
   * @returns {number} 根から全ノードまでの経路長の総和
   */
  get internalPathLength() {
    const f = (tree, depth = 0) => [...tree].map(e => f(e, depth + 1)).reduce((a, c) => a + c, depth)
    return f(this)
  }

  /**
   * 多分木を後順に走査する
   * @returns {any[]} ノードのリスト
   */
  get postorder() {
    const f = tree => [...[...tree].map(f).reduce((a, c) => a.concat(c), []), tree.value]
    return f(this)
  }

  /**
   * Lispのような多分木の配列表現を返す
   * @returns {any[]} 多分木の配列表現
   */
  get lisp() {
    const f = tree => tree[0] ? [tree.value, ...[...tree].map(f)] : tree.value
    return f(this)
  }

  /**
   * 多分木を文字列表現に変換する
   * @returns {string} 多分木の文字列表現
   */
  toString() {
    return `${ this.value }${ [...this].join('') }^`
  }
}

/**
 * 多分木の文字列表現を多分木に変換する
 * @param {string} str 多分木の文字列表現
 * @returns {MultiwayTree} 多分木
 */
MultiwayTree.stringToTree = str => {
  if (str.length === 0) return null
  const trees = []
  
  for (const s of str) if (s === '^') { 
    const parent = trees[trees.length - 2]
    if (parent) { parent.push(trees.pop()) } else break

  } else {
    trees.push(new MultiwayTree(s))
  }

  return trees[0]
}
