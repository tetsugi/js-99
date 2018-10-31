/**
 * 真理値表で用いる真理値の組み合わせを生成する
 * @param {number} n 真理値表で用いる引数の数
 * @returns {[boolean[]][]} 真理値の組み合わせ
 */
export const truth = n => {
  if (n < 1) return []
  if (n === 1) return [[true], [false]]
  
  const result = []
  
  truth(n - 1).forEach(e => {
    result.push(e.concat(true))
    result.push(e.concat(false))
  })
  return result
}

/**
 * 渡した関数から生成した真理値表を返す
 * @param {Function} f 真理値表を出したい関数
 * @returns {[boolean[], boolean][]} 真理値表
 */
export const table = f => truth(f.length).map(e => [e, f(...e)])

/**
 * グレイコードを出力する
 * @param {number} n bit数
 * @returns {string[]} グレイコード
 */
export const gray = n => [...Array(2 ** n)].map((_, i) => Number(i ^ (i >> 1)).toString(2).padStart(n, '0'))

/**
 * 配列や文字列をハフマン符号化する
 * @param {[string, number][] | string} raws 指定された形式の配列または文字列
 * @returns {[string, string][]} ハフマン符号化の結果
 */
export const huffman = raws => {
  if (typeof(raws) === 'string') {
    const characters = [...raws]
    raws = characters.filter((e, i, self) => self.indexOf(e) === i).map(e => [e, characters.filter(v => e === v).length])
  }
  if (raws.length < 2) throw new Error('この配列はハフマン符号化できません')

  const sort = list => list.sort(([, a], [, b]) => a - b)

  while (raws.length >= 2) {
    raws = sort(raws)
    const [xValues, xFreq] = raws.shift()
    const [yValues, yFreq] = raws.shift()
    raws.unshift([[xValues, yValues], xFreq + yFreq])
  } 

  const result = []

  const encode = ([left, right], prefix = '') => {
    if (Array.isArray(left)) { encode(left, `${prefix}0`) } else { result.push([left, `${prefix}0`]) }
    if (Array.isArray(right)) { encode(right, `${prefix}1`) } else { result.push([right, `${prefix}1`]) }
  }
  encode(raws[0][0])

  return result.sort(([a,], [b,]) => a.codePointAt() - b.codePointAt())
}
