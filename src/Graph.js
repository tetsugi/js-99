/**
 * グラフを表現するクラス
 * @author tetsugi
 */
export default class Graph {

  /**
   * コンストラクタ
   * @param {string[]|[string, string, number][]} nodes 頂点（ラベル）のリスト、もしくは辺のリスト
   * @param  {[string, string, number][]} edges 辺のリスト（`[from, to, cost]`の配列）
   */
  constructor(nodes, edges = null) {
    if (edges) { 
      nodes.forEach(label => this[label] = { from: [], to: [] })
      edges.forEach(edge => this.connect(...edge))

    } else nodes.forEach(e => {
      if (!Array.isArray(e)) { 
        this[e] = { from: [], to: [] }

      } else {
        let [from, to, cost] = e
        cost = cost || Infinity
        
        if (!this[from]) { this[from] = { from: [], to: [] } }
        if (!this[to]) { this[to] = { from: [], to: [] } }
        
        this[from].to.push([to, cost])
        this[to].from.push([from, cost])
      }
    })
  }

  /**
   * 頂点と頂点を辺で繋ぐ
   * @param {string} from 出発元の頂点のラベル
   * @param {string} to 行先の頂点のラベル
   * @param {number} cost コスト
   */
  connect(from, to, cost = Infinity) {
    if (!this[from] || !this[to]) throw new Error('missing node')
    this[from].to.push([to, cost])
    this[to].from.push([from, cost])
  }

  /**
   * 頂点から頂点までの全ての経路を返す
   * @param {string} from 出発元の頂点のラベル
   * @param {string} to 行先の頂点のラベル
   * @param {string[]} already 既に見た頂点のリスト
   * @returns {string[][]} 全ての経路
   */
  paths(from, to, already = []) {
    const targets = this[from].to

    if (targets.length === 0 || already.find(e => e === from)) return []
    if (targets.find(([e,]) => e === to)) return [[from, to]]
    
    return targets
      .map(([e,]) => {
        const result = this.paths(e, to, already.concat(from))
        return result.length ? [from].concat(...result) : []
      })
      .filter(e => e.length)
  }

  /**
   * 対象の頂点についての全ての閉路を返す
   * @param {string} target 閉路を探す頂点のラベル
   * @returns {string[][]} 全ての閉路
   */
  cycle(target) { 
    return this.paths(target, target)
  }
}