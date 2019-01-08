/**
 * ミラー–ラビン素数判定法に基づいて素数判定する
 * @param {number} n 自然数
 * @returns {boolean} 素数かどうか
 */
export const isPrime = (n, loop = 100) => {
  if (n === 2) return true
  if (n <= 1 || n % 2 === 0) return false

  let d = (n - 1) >> 1
  while (d % 2 === 0) { d >>= 1 }

  const pow = (base, power, mod) => {
    let result = 1
    
    while (power > 0) {
      if (power % 2 === 1) { result = (result * base) % mod }
      base = (base ** 2) % mod
      power >>= 1
    }
    return result
  }

  for (let i = 0; i < loop; i++) {
    const rand = Math.floor(Math.random() * (n - 1) + 1)
    let t = d
    let y = pow(rand, t, n)

    while ((t !== (n - 1)) && (y !== 1) && (y !== (n - 1))) {
      y = (y ** 2) % n
      t <<= 1
    }

    if ((y !== (n - 1)) && (t % 2 === 0)) return false
  }

  return true
}

/**
 * ユークリッドの互除法で最大公約数を求める
 * @param {number} a 整数
 * @param {number} b 整数
 * @returns {number} 最大公約数
 */
export const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b)

/**
 * 二つの整数が互いに素かどうかを返す
 * @param {number} a 整数
 * @param {number} b 整数
 * @returns {boolean} 互いに素かどうか 
 */
export const coprime = (a, b) => gcd(a, b) === 1

/**
 * オイラーのφ関数
 * @param {number} n 自然数
 * @returns {number} 1からnまでの自然数のうち、nと互いに素なものの個数
 */
export const totient = n => n === 1 ? 1 : [...Array(n - 1)].map((_, i) => i + 1).filter(e => coprime(n, e)).length

/**
 * 素因数分解をする
 * @param {number} n 自然数
 * @returns {number[]} 素因数分解の結果
 */
export const primeFactors = n => ((f = ((a, b = 2) =>
  (a < b ** 2) ? [a] 
  : (a % b === 0) ? [b].concat(f(a / b, b))
  : f(a, b + 1)
)) => f(n))()

/**
 * 素因数分解をし、結果を累乗の形式にして返す
 * @param {number} n 自然数
 * @returns {number[][]} 素因数分解の結果。[底, 指数]の配列
 */
export const primeFactorsMult = n => ((factors = primeFactors(n)) => 
  factors.filter((e, i, self) => self.indexOf(e) === i)
    .map(e => [e, factors.filter(v => e === v).length])
)()

/**
 * オイラーのφ関数（改良版）
 * @param {number} n 自然数
 * @returns {number} 1からnまでの自然数のうち、nと互いに素なものの個数
 */
export const phi = n => primeFactorsMult(n).map(([p, m]) => (p - 1) * p ** (m - 1)).reduce((a, c) => a * c)

/**
 * 関数の実行時間を計測する
 * @param {Function} f 実行する関数
 * @param  {...any} args 関数に渡す引数
 * @returns {number} 実行時間
 */
export const time = process.env.NODE_ENV !== 'production' 
? (f, ...args) => {
  const perf = typeof(performance) === 'undefined' ? require('perf_hooks').performance : performance

  const t0 = perf.now()
  f(...args)
  const t1 = perf.now()
  
  return t1 - t0
} 
: (f, ...args) => {
  const t0 = performance.now()
  f(...args)
  const t1 = performance.now()
  
  return t1 - t0
} 

/**
 * 範囲内の素数を返す
 * @param {number} min 下限
 * @param {number} max 上限
 * @returns {number[]} 範囲内の素数 
 */
export const primesR = (min, max) => [...Array(max - min + 1)].map((_, i) => i + min).filter(e => isPrime(e))

/**
 * 偶数を二つの素数の和として表現する
 * @param {number} n 偶数 
 * @returns {number[]} 素数に分解した結果
 */
export const goldbach = n => {
  if (n < 4 || n % 2 === 1) return []
  if (n === 4) return [2, 2]

  return [...Array(Math.floor(n / 2))]
    .map((_, i) => i + 1)
    .filter(e => e % 2 === 1)
    .map(e => [e, n - e])
    .find(([x, y]) => isPrime(x) && isPrime(y))
}

/**
 * ゴールドバッハの予想を範囲内の偶数に適用する
 * @param {*} min 下限
 * @param {*} max 上限
 * @param {number} gt この数値より大きいペアのみ抽出する
 * @returns {number[][]} 素数に分解した結果
 */
export const goldbachList = (min, max, gt) => {
  const result = [...Array(max - min + 1)]
    .map((_, i) => i + min)
    .filter(e => e % 2 === 0)
    .map(e => goldbach(e))

  return gt ? result.filter(([x, y]) => x > gt && y > gt) : result
}
