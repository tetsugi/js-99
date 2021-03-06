import { combinations, permutations } from './array'
import { uniqWith, isEqual } from 'lodash'

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
  constructor(nodes = [], edges = null) {
    if (edges) { 
      nodes.forEach(label => this[label] = { from: {}, to: {} })
      edges.forEach(edge => this.connect(...edge))

    } else nodes.forEach(e => {
      if (!Array.isArray(e)) { 
        this[e] = { from: {}, to: {} }

      } else {
        let [from, to, cost] = e
        cost = cost || 1
        this.connect(from, to, cost, true)
      }
    })
  }

  /**
   * 頂点と頂点を辺で繋ぐ
   * @param {string} from 出発元の頂点のラベル
   * @param {string} to 行先の頂点のラベル
   * @param {number} cost コスト
   * @param {boolean} isInsert trueだと頂点が無いときに新規作成する
   */
  connect(from, to, cost = 1, isInsert = false) {
    if (!isInsert && (!this[from] || !this[to])) throw new Error('missing node')
    
    if (!this[from]) { this[from] = { from: {}, to: {} } }
    if (!this[to]) { this[to] = { from: {}, to: {} } }

    this[from].to[to] = cost
    this[to].from[from] = cost
  }

  /**
   * 全ての辺を返す
   * @returns {[string, string, number][]} 全ての辺
   */
  get edges() {
    return Object.keys(this).flatMap(from => {
      const target = this[from].to
      const edges = []

      for (const to in target) {
        edges.push([from, to, target[to]])
      }
      return edges
    })
  }

  /**
   * コストの総和を返す
   * @returns {number} コストの総和
   */
  get totalCost() {
    return this.edges.map(([,,cost]) => cost).reduce((a, b) => a + b, 0)
  }

  /**
   * 頂点から頂点までの全ての経路を返す
   * @param {string} from 出発元の頂点のラベル
   * @param {string} to 行先の頂点のラベル
   * @param {Set<string>} already 既に見た頂点のセット
   * @returns {[string, string, number][][]} 全ての経路
   */
  paths(from, to, already = new Set()) {
    const target = this[from].to
    const keys = Object.keys(target)

    if (keys.length === 0 || already.has(from)) return []
    if (target[to]) return [[[from, to, target[to]]]]

    return keys.flatMap(key => this.paths(key, to, new Set([...already, from])).map(e => [[from, key, target[key]], ...e]))
  }

  /**
   * 対象の頂点についての全ての閉路を返す
   * @param {string} target 閉路を探す頂点のラベル
   * @returns {string[][]} 全ての閉路
   */
  cycle(target) { 
    return this.paths(target, target)
  }

  /**
   * スパニングツリーを全て探して返す
   * @returns {Graph[]} スパニングツリーのリスト
   */
  get spanningTrees() {
    const keys = Object.keys(this)
    const { edges } = this
    if (!keys.length || edges.length < keys.length - 1) return []

    return combinations(edges, keys.length - 1)
      .filter(x => {
        for (const key of keys) {
          let find = false

          for (const [from, to,] of x) if (key === from || key === to) {
            find = true
            break
          }
          if (!find) return false
        }
        return true
      })
      .map(e => new Graph(e))
  }

  /**
   * グラフをコピーする  
   * 引数に辺を与えるとコピー後に辺を追加する
   * @param {[string, string, number]} edge 辺
   * @returns {Graph} コピーしたグラフ
   */
  copy(edge = null) {
    const graph = new Graph(Object.keys(this), this.edges)
    if (edge) { graph.connect(...edge, true) }
    return graph
  }

  /**
   * Prim法でMSTを全て探して返す
   * @returns {Graph[]} MSTのリスト
   */
  get prim() {
    const keys = Object.keys(this)
    const { edges } = this
    if (!keys.length || edges.length < keys.length - 1) return []

    /**
     * 次の頂点へ行くために最小コストの辺を探す
     * @param {Graph} graph 調べるグラフ
     * @returns {[string, string, number][]} 最小コストの辺のリスト
     */
    const min = (graph) => {
      const labels = Object.keys(graph)
      const result = []

      labels.forEach(e => {
        const { from, to } = this[e]
        const fromEdges = Object.keys(from).filter(k => !labels.includes(k)).map(k => [k, e, from[k]])
        if (fromEdges.length) { result.push(...fromEdges) }
        
        const toEdges = Object.keys(to).filter(k => !labels.includes(k)).map(k => [e, k, to[k]])
        if (toEdges.length) { result.push(...toEdges) }
      })

      return result.sort(([,,a], [,,b]) => a - b).filter(([,,cost], _, self) => cost <= self[0][2])
    }

    /**
     * MSTを探す
     * @param {Graph} graph 調べるグラフ
     * @returns {Graph[]} MSTのリスト
     */
    const search = (graph) => {
      const edges = min(graph)
      return edges.length ? edges.flatMap(e => search(graph.copy(e))) : [graph]
    }
    
    // 探した後、全ての頂点が含まれているかどうか調べる
    const result = search(new Graph([keys[0]]))
      .filter(x => {        
        for (const key of keys) if (!x[key]) return false
        return true
      })

    return uniqWith(result, isEqual)
  }

  /**
   * グラフ同士が同型かどうかを比較して対応表を返す
   * @param {Graph} graph 比較するグラフ
   * @returns {boolean} 同型ならこのグラフを与えたグラフに変換する対応表　同型でなければnull 
   */
  isomorphism(graph) {
    const xKeys = Object.keys(this)
    const { edges: xEdges } = this

    const yKeys = Object.keys(graph)
    const yEdges = graph.edges.map(([from, to,]) => [from, to])

    if (xKeys.length !== yKeys.length) return null
    if (xEdges.length !== yEdges.length) return null

    for (const perm of permutations(yKeys)) {
      const table = {}
      perm.forEach((e, i) => table[xKeys[i]] = e)
      const edges = xEdges.map(([from, to,]) => [table[from], table[to]])

      const result = yEdges.every(x => edges.some(y => isEqual(x, y)))
      if (result) return table
    }
    return null
  }

  /**
   * ある頂点の次数を返す
   * @param {string} label 頂点のラベル
   * @returns {number} 次数
   */
  degree(label) {
    const { from, to } = this[label]
    return Object.keys(from).length + Object.keys(to).length
  }

  /**
   * Welsh-Powellの頂点彩色アルゴリズムで彩色する
   * @returns {any} 彩色後のノードと対応する数字の対応表
   */
  paint() {
    const result = {}
    const keys = Object.keys(this).sort((a, b) => this.degree(a) - this.degree(b))

    keys.forEach(key => {
      const { from, to } = this[key]
      let color = 1

      const neighbors = [...Object.keys(from), ...Object.keys(to)]
        .filter((e, i, self) => self.indexOf(e) === i)
        .map(e => result[e])
      
      while (neighbors.includes(color)) { color++ }

      result[key] = color
    })

    return result
  }

  /**
   * 深さ優先探索でグラフを探索する
   * @param {string} start 開始する頂点のラベル
   * @returns {string[]} 頂点のラベルのリスト
   */
  depthFirst(start) {
    const visited = []

    const f = label => {
      visited.push(label)

      const { from, to } = this[label]
      const keysForEach = obj => Object.keys(obj).forEach(key => {
        if (!visited.includes(key)) { f(key) }
      })

      keysForEach(to)
      keysForEach(from)
    }
    f(start)
    
    return visited
  }

  /**
   * グラフを連結している頂点で分離する
   * @returns {string[][]} 繋がっている頂点のラベルのリスト
   */
  get connectedComponents() {
    const keys = Object.keys(this)
    const set = new Set()
    const result = []

    keys.forEach(key => {
      if (set.has(key)) return
      
      const connected = this.depthFirst(key)
      connected.forEach(e => set.add(e))
      result.push(connected)
    })
    return result
  }

  /**
   * グラフが2部グラフであれば頂点をグループ分けする
   * @returns {string[][]} グループ分けされた頂点のラベルのリスト
   */
  get bipartite() {
    const keys = Object.keys(this)
    if (keys.length < 2) return null

    const colors = {}

    const paint = (key, color) => {
      colors[key] = color
      const { from, to } = this[key]

      for (const k of Object.keys(to)) {
        if (colors[k] === color) return false
        if (!colors[k] && !paint(k, -color)) return false
      }

      for (const k of Object.keys(from)) {
        if (colors[k] === color) return false
        if (!colors[k] && !paint(k, -color)) return false
      }

      return true
    }

    const key = keys[0]
    if (!paint(key, 1)) return null

    const painted = Object.keys(colors)
    if (keys.length !== painted.length) return null 

    const result = [[], []]
    painted.forEach(k => result[colors[k] === 1 ? 0 : 1].push(k))

    return result
  }

  f(label) {
    const { from, to } = this[label]
    return Object.keys(from).length
  }
}