/**
 * 配列の最後の要素を取り出す
 * @param {any[]|string} list 
 * @returns {any} 最後の要素
 */
export const last = list => list[list.length - 1]

/**
 * 配列の最後の一つ前の要素を取り出す
 * @param {any[]|string} list
 * @returns {any} 最後の一つ前の要素 
 */
export const butLast = list => list[list.length - 2]

/**
 * 配列のn番目の要素を取り出す
 * @param {any[]|string} list 
 * @param {number} index
 * @returns {any} 指定位置の要素 
 */
export const elementAt = (list, index) => list[index - 1]

/**
 * 配列の長さを返す
 * @param {any[]|string} list 
 * @returns {number} 配列の長さ
 */
export const length = list => [...list].fill(1).reduce((a, c) => a + c, 0)

/**
 * 配列や文字列を逆順にして返す
 * @param {any[]|string} list 
 * @returns {any[]|string} 逆順にした配列
 */
export const reverse = list => [...list].reduceRight(
  (a, c) => a.concat(c), Array.isArray(list) ? [] : '')

/**
 * 配列が回文かどうかを返す
 * @param {any[]|string} list 
 * @returns {boolean} 回文かどうか
 */
export const isPalindrome = list => list.toString() === reverse(list).toString()

/**
 * ネストしている配列を平坦にして返す
 * @param {any[]} list
 * @returns {any[]} 一次元配列 
 */
export const flatten = list => list.reduce(
  (a, c) => a.concat(Array.isArray(c) ? flatten(c) : c), [])

/**
 * 配列から同じ要素の繰り返しを排除して返す
 * @param {any[]|string} list 
 * @returns {any[]|string} 重複排除後の配列
 */
export const compress = list => [...list].reduce(
  (a, c) => a.concat(a[a.length - 1] !== c ? c : []), 
  Array.isArray(list) ? [] : '')

/**
 * 配列や文字列の同じ要素の繰り返しを配列としてまとめて返す
 * @param {any[]|string} list 
 * @returns {any[][]|string[]} 処理後の配列
 */
export const pack = list => {
  const isArray = Array.isArray(list)
  list = [...list]

  const result = []
  let element = null
  let current = null

  list.forEach((e, i) => {
    if (current === e) {
      element = element.concat(e)

    } else {
      if (element) { result.push(element) }
      current = e
      element = isArray ? [e] : e
    }

    if (i === (list.length - 1)) {
      result.push(element)
    }
  })

  return result
}

/**
 * 配列や文字列をランレングス圧縮する
 * @param {any[]|string} list 
 * @returns {any[][]} 処理後の配列
 */
export const encode = list => pack(list).map(e => [e.length, e[0]])

/**
 * 配列や文字列をランレングス圧縮する  
 * 要素が重複していない場合は圧縮しない
 * @param {any[]|string} list
 * @returns {any[]} 処理後の配列 
 */
export const encodeModified = list => encode(list).map(e => e[0] === 1 ? e[1] : e)

/**
 * ランレングス圧縮した配列や文字列をデコードする
 * @param {any[]} list ランレングス圧縮した配列
 * @returns {any[]|string} 元の配列や文字列
 */
export const decodeModified = list => {
  const result = []
  
  list.forEach(e => {
    if (Array.isArray(e)) for (let i = 0; i < e[0]; i++) {
      result.push(e[1])
    } else {
      result.push(e)
    }
  })
  
  return result
}

/**
 * 配列や文字列をランレングス圧縮する  
 * 要素が重複していない場合は圧縮しない
 * @param {any[]|string} list
 * @returns {any[]} 処理後の配列 
 */
export const encodeDirect = list => {
  list = [...list]

  const result = []
  let count = 1
  let current = null

  const push = () => result.push(count > 1 ? [count, current] : current)

  list.forEach((e, i) => {
    if (current === e) {
      count++

    } else {
      if (current) { push() }
      count = 1
      current = e
    }

    if (i === (list.length - 1)) { push() }
  })

  return result
}

/**
 * 指定された回数だけ配列や文字列の要素を複製する
 * @param {any[]} list 
 * @param {number} n 何倍にするか
 * @returns {any[]|string} 処理後の配列
 */
export const repli = (list, n = 2) => {
  const isStr = typeof(list) === 'string'
  list = [...list]
  const result = []

  list.forEach(e => { for (let i = 0; i < n; i++) result.push(e) })

  return isStr ? result.join('') : result
}

/**
 * 配列や文字列からnの倍数の位置の要素を削除する
 * @param {any[]} list 
 * @param {number} n 
 * @returns {any[]|string} 要素削除後の配列
 */
export const drop = (list, n) => ((ret = [...list].filter((_, i) => (i + 1) % n !== 0)) => 
  typeof(list) === 'string' ? ret.join('') : ret)()

/**
 * 配列や文字列を指定した位置で分ける
 * @param {any[]|string} list 
 * @param {number} n 区切る位置
 * @returns {[any[]|string, any[]|string]} 区切られた配列
 */
export const split = (list, n) => ((x = [...list], ret = [x, x.splice(n)]) => 
  typeof(list) === 'string' ? ret.map(e => e.join('')) : ret)()

/**
 * 配列や文字列から選択した範囲を取り出す
 * @param {any[]|string} list 
 * @param {number} start 開始位置
 * @param {number} end 終了位置
 * @returns {any[]|string} 取り出した結果
 */
export const slice = (list, start, end = list.length) => {
  let result = Array.isArray(list) ? [] : ''

  for (let i = start - 1; i < end; i++) {
    result = result.concat(list[i])
  }
  return result
}

/**
 * 配列や文字列の要素を左にn個ずらす
 * @param {any[]|string} list 
 * @param {number} n ずらす数
 * @returns {any[]|string} ずらした後の配列
 */
export const rotate = (list, n) => ((x = [...list], _ = x.unshift(...x.splice(n))) =>
  typeof(list) === 'string' ? x.join('') : x)()

/**
 * 配列や文字列のn番目の要素を削除する
 * @param {number} n 削除する要素の位置
 * @param {any[]|string} list 
 * @returns {[any, any[]]} 削除した要素と、処理後の配列 
 */
export const removeAt = (n, list) => ((x = [...list], removed = x.splice(n - 1, 1)[0]) => 
  [removed, typeof(list) === 'string' ? x.join('') : x])()

/**
 * 配列や文字列の指定した位置に要素を挿入する
 * @param {any} element 挿入する要素
 * @param {any[]|string} list 挿入対象
 * @param {number} n 挿入する位置
 * @returns {any[]|string} 処理後の配列
 */
export const insertAt = (element, list, n) => ((x = [...list], ret = x.concat(element, x.splice(n - 1))) => 
  typeof(list) === 'string' ? ret.join('') : ret)()

/**
 * 指定された範囲内のすべての整数または文字を含む配列を生成する
 * @param {number|string} start 開始位置の要素
 * @param {number|string} end 終了位置の要素
 * @returns {number[]|string[]} 範囲内のすべての要素を含む配列
 */
export const range = (start, end) => {
  if (typeof(start) !== typeof(end)) {
    throw new Error('引数は同じ型にしてください')
  }

  const isStr = typeof(start) === 'string'

  if (isStr && (start.length !== 1 || end.length !== 1)) {
    throw new Error('引数にする文字列の長さは1にしてください')
  }

  const list = []
  
  if (isStr) {
    start = start.charCodeAt(0)
    end = end.charCodeAt(0)
  }  

  for (let i = start; i <= end; i++) {
    list.push(isStr ? String.fromCharCode(i) : i)
  }

  return list
}

/**
 * 配列や文字列から指定された数ぶんだけランダムに要素を取り出す
 * @param {any[]|string} list リスト
 * @param {number} n 選ぶ個数
 * @returns {any[]|string} 選ばれた要素
 */
export const rndSelect = (list, n) => {
  const isStr = typeof(list) === 'string'
  list = [...list]
  const result = []

  for (let i = 0; i < n && list.length > 0; i++) {
    const target = Math.floor(Math.random() * list.length)
    const removed = list.splice(target, 1)[0]
    result.push(removed)
  }
  return isStr ? result.join('') : result
}

/**
 * 乱数列を得る
 * @param {number} length 長さ
 * @param {number} max 最大値
 * @returns {number[]}
 */
export const diffSelect = (length, max) => {
  if (max < 1) { throw new Error('最大値は1以上の値を指定してください') }
  const result = []

  for (let i = 0; i < length; i++) {
    result.push(Math.floor(Math.random() * max) + 1)
  }
  return result
}

/**
 * 配列や文字列をランダムに並び替える
 * @param {any[]|string} list 並び替える配列
 * @returns {any[]|string} 並び替えた配列
 */
export const rndPermu = list => rndSelect(list, list.length)

/**
 * 組み合わせを返す
 * @param {any[]|string} list 
 * @param {number} n いくつ選ぶか
 * @returns {any[][]|string[]} 組み合わせ 
 */
export const combinations = (list, n) => {
  if (n < 0 || list.length < n) throw new Error('不正な引数です')
  if (n === 0) return [null]

  const isStr = typeof(list) === 'string'
  if (n === 1) return isStr ? [...list] : [...list].map(e => [e])
  
  const result = []
  n--

  for (let i = 0; i < list.length - n; i++) {
    const combi = combinations(list.slice(i + 1), n)

    for (let j = 0; j < combi.length; j++){
      const concatenated = [list[i]].concat(combi[j])
      result.push(isStr ? concatenated.join('') : concatenated)
    }
  }

  return result
}

/**
 * 組み合わせと選ばれなかった組を返す
 * @param {any[]|string} list 
 * @param {number} n いくつ選ぶか
 * @returns {[any[], any[]]} [選んだもの, 選ばなかったもの]
 */
export const exCombinations = (list, n) => {
  const isStr = typeof(list) === 'string'

  if (n === 0) return [isStr ? '' : [], list]
  if (list.length === 0) return []

  if (n === 1) return [...list].map((_, i) => {
    let r = [...list]
    r = [r.splice(i, 1), r]
    return isStr ? r.map(e => e.join('')) : r
  })

  const result = []
  const [x, ...xs] = list
  
  exCombinations(isStr ? xs.join('') : xs, n - 1).forEach(
    ([ys, zs]) => result.push([isStr ? x + ys : [x].concat(ys), zs]))

  exCombinations(isStr ? xs.join('') : xs, n).forEach(
    ([ys, zs]) => result.push([ys, isStr ? x + zs : [x].concat(zs)]))

  return result
}

/**
 * 配列の要素を互いに素な配列にグループ化して返す
 * @param {any[]} list グループ化したい配列
 * @param {...number} numbers グループの分け方
 * @returns {any[][]} 全グループ
 */
export const group = (list, ...numbers) => {
  if (list.length === 0) return [[]]

  const [n, ...ns] = numbers
  const result = []

  exCombinations(list, n).forEach(([g, rs]) => {
    group(rs, ...ns).forEach(e => result.push([g].concat(e)))
  })

  return result
}

/**
 * 配列の配列を要素の長さでソートする
 * @param {any[][]|string[]} list 
 * @returns {any[][]|string[]} ソートされた配列
 */
export const lsort = list => list.sort((a, b) => a.length - b.length)

/**
 * 配列の配列を要素の長さの頻度順にソートする
 * @param {any[][]|string[]} list 
 * @returns {any[][]|string[]} ソートされた配列
 */
export const lfsort = list => {
  const map = new Map(encode(list.map(e => e.length).sort()).map(([value, key]) => [key, value]))
  return list.sort((a, b) => map.get(a.length) - map.get(b.length))
}


/**
 * 全ての要素を使った順列を返す
 * @param {any[]} list 順列を求めるリスト
 * @returns {any[][]} 全ての要素を使った順列
 */
export const permutations = list => {
  if (list.length < 1) return []
  if (list.length === 1) return [list]
  return list.flatMap((elem, i) => permutations(list.filter((_, j) => i !== j)).map(e => [elem, ...e]))
}