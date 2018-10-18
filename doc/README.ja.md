# JavaScriptの問題集(99 Haskell Problemsの翻訳)と解答例・解説

[H-99: Ninety-Nine Haskell Problems](https://wiki.haskell.org/H-99:_Ninety-Nine_Haskell_Problems)というHaskellの問題集があります。元はPrologの問題集だったそうです。  
二番煎じかもしれませんが、今回はこの問題集を少し改変して、JavaScriptで解いていくことにします。  
一応、基本的な構文の学習を一通り終えた初心者に向けた記事として書いています。
  
問題と解答例を分けておくので、問題を解いてから解答例を見るようにすると、より理解が深まるかと思います。  
解答例には解説もつけていきます。

## 環境構築  

### Node.jsとYarnのインストール

[Node.js](https://nodejs.org/ja/)を使いますので、インストールしてください。  
インストール後にコンソールを開いて以下のコマンドを実行し、バージョンが表示されればPATHが通っています。  
執筆時点では、Node.jsは`v8.12.0`、npmは`6.4.1`を使用しています。

```sh
$ node -v
$ npm -v
```

[Yarn](https://yarnpkg.com/lang/ja/)もインストールします。  
Yarnはnpmよりも高速なパッケージマネージャです。  

```sh
$ npm i -g yarn
```

### パッケージ作成

問題を解いていくためのパッケージを作成しましょう。  
以下のコマンドを実行します。

```sh
$ mkdir js-99
$ cd js-99
$ yarn init -y
```

`js-99`ディレクトリに`package.json`が生成されます。

### Webpack

問題の解答をライブラリとしてビルドできるようにしましょう。  
たくさん解けば、最終的には[lodash](https://lodash.com/docs/)みたいな感じになりそうですね！

Webpackは分割したモジュールを一つのファイルにまとめてくれるバンドラです。  
最新のJavaScriptの構文をIE11などの古いブラウザでも使えるように変換(トランスパイル)してくれるBabelもインストールします。  
以下のコマンドを実行しましょう。これらのモジュールは`node_modules`ディレクトリが作成されて、そこに格納されます。

```sh
$ yarn add -D @babel/core @babel/preset-env @babel/register babel-loader webpack@4.x webpack-cli
```

プロジェクト直下に`.babelrc`を作成し、以下のように設定します。

```json
{ 
  "presets": ["@babel/preset-env"]
}
```

`webpack.config.babel.js`を作成し、webpackの設定を書いていきます。  
`output`はバンドルしたJSファイルをライブラリとして使えるようにするための設定です。

```js
import path from 'path'

export default {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    library: 'js99',
    libraryTarget: 'umd',
    globalObject: 'this',
    filename: 'js-99.js',
    path: path.join(__dirname, 'dist')
  }
}
```

`package.json`に`scripts`を追記します。  
これはnpm-scriptsというもので、スクリプトを書いておくと`yarn <script名>`で実行できるようになります。

```json
{
  ...
  "scripts": {
    "build": "webpack"
  },
  ...
}
```

`src`ディレクトリを作成し、`index.js`を以下のような内容で作成してみましょう。

```js
export default { hoge: 'fuga' }
```

次のコマンドを実行して`dist/js-99.js`が出力されれば成功です。  
REPLで`require`して確かめることもできます。

```sh
$ yarn build
```

```sh
$ node
> require('./dist/js-99')
{ default: { hoge: 'fuga' } }
```

### Jest

問題が解けたかどうか確かめるために、ユニットテストができる環境を作りましょう。  
ユニットテストをするためにJestを導入します。

```sh
$ yarn add -D jest babel-jest babel-core@^7.0.0-bridge.0 regenerator-runtime
```

`package.json`の`scripts`に`test`を追記します。

```json
{
  ...
  "scripts": {
    "build": "webpack",
    "test": "jest"
  },
  ...
}
```

動作確認してみましょう。  
`test`ディレクトリを作成し、`index.test.js`にユニットテストを書いていきます。

```js
import hoge from '../src'

test('動作確認', () => {
  expect(hoge.hoge).toBe('fuga')
})
```

以下のコマンドでユニットテストを実行できます。

```sh
$ yarn test
```

次のような出力になれば成功です。

```
[PASS] test/index.test.js
  √ 動作確認 (3ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.425s
Ran all test suites.
Done in 2.16s.
```


### 試しに1問解いてみる

H-99の22問目の「指定された範囲内のすべての整数を含む配列を生成する関数`range`を実装する」という問題を試しに解いてみます。  
Haskellには`[4..9]`のように書くと`[4,5,6,7,8,9]`が生成される構文があるため、それと同様の結果を返す`range`は面白そうだと思ったからです。  
初回なので、とりあえずそれなりにテストも書いてみます。

`range`関数は以下のような動作になるはずです。

```js
range(4, 9) // [4,5,6,7,8,9]
```

まずはテストから書いてみます。`range(5, 1)`のような引数を渡すと空の配列が返ってくることを想定します。  
`test/index.test.js`を次のように編集します。

```js
import { range } from '../src'

describe('問22: 指定された範囲内のすべての整数を含む配列を生成する', () => {
  test('4から9までの整数の配列', () => {
    expect(range(4, 9)).toEqual([4, 5, 6, 7, 8, 9])
  })

  test('5から1までの整数の配列（空の配列）', () => {
    expect(range(5, 1)).toEqual([])
  })
})
```

まだ未実装なので`yarn test`をすると失敗します。  
このテストをパスできるように`src/index.js`に実装していきましょう。  

```js
/**
 * 指定された範囲内のすべての整数を含む配列を生成する
 * @param {number} start 開始
 * @param {number} end 終了
 * @returns {number[]} 範囲内のすべての整数を含む配列
 */
export const range = (start, end) => {
  const list = []
  
  for (let i = start; i <= end; i++) {
    list.push(i)
  }

  return list
}
```

これで`yarn test`をパスできるようになりました！書いたテストが全て緑色になるのは気持ちいいですね。  
ついでに、「指定された範囲内のすべての文字を含む配列」も`range`関数で返すようにしてみます。  
Haskellでは`['a'..'z']`で小文字のアルファベットの配列を表現できるからです。

関数に変更を加えても先ほど書いたテストは当然通るようにしなければなりません。  
逆に、変更によってバグが生じた場合は、ユニットテストをパスしなくなってすぐに分かるわけです。

`test/index.test.js`にテストを追加しましょう。

```js
describe('問22: 指定された範囲内のすべての整数または文字を含む配列を生成する', () => {
  /* 省略 */

  test('aからzまでの文字の配列', () => {
    expect(range('a', 'z')).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
  })

  test('引数の型が異なる（エラー）', () => {
    expect(() => range(1, 'a')).toThrowError()
  })

  test('引数が文字列のとき、長さが2以上ある（エラー）', () => {
    expect(() => range('aa', 'b')).toThrowError()
  })
})
```

`src/index.js`の`range`関数に機能を追加しましょう。

```js
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
```

少し長くなってしまいました。`yarn test`で全てパスされていれば成功です。


## 問題(99 JavaScript Problems)

問題をJavaScript用に改変しているところがあります。  
これによって難易度にバラつきが出ていますが、ご了承ください。  

一部の問題は統合しているため、本当に99問あるわけではありません。

### 問1～10: 配列

#### 問1: 配列や文字列の最後の要素を取り出す`last`関数を実装せよ。

```js
last([1, 2, 3, 4]) // 4
last('xyz') // z
```

#### 問2: 配列や文字列の最後の一つ前の要素を取り出す`butLast`関数を実装せよ。

```js
butLast([1, 2, 3, 4]) // 3
butLast('abcdefghijklmnopqrstuvwxyz') // y
```

#### 問3: 配列や文字列のn番目の要素を取り出す`elementAt`関数を実装せよ。

ただし、最初の要素は0番目ではなく、1番目と数えます。

```js
elementAt([1, 2, 3], 2) // 2
elementAt('JavaScript', 5) // S
```

#### 問4: 配列や文字列の長さを返す`length`関数を実装せよ。

`Array.length`や`String.length`は使用しないこと。  
また、絵文字の長さは`1`と数えるようにすること。

```js
length([123, 456, 789]) // 3
length('💃Hello, World!💃') // 15
```

#### 問5: 配列や文字列を逆順にして返す`reverse`関数を実装せよ。

`Array.reverse`は使用しないこと。  
また、絵文字の長さは`1`と数えるようにすること。

```js
reverse('A man, a plan, a canal, panama!💃') // 💃!amanap ,lanac a ,nalp a ,nam A
reverse([1, 2, 3, 4]) // [4, 3, 2, 1]
```

#### 問6: 配列や文字列が回文かどうかを返す`isPalindrome`関数を実装せよ。

```js
isPalindrome([1, 2, 3]) // false
isPalindrome('たけやぶやけた') // true
isPalindrome([1, 2, 4, 8, 16, 8, 4, 2, 1]) // true
```

#### 問7: ネストしている配列を平坦（一次元配列）にして返す`flatten`関数を実装せよ。

`Array.flat`は使用しないこと。

```js
flatten([1, [2, [3, 4], 5]]) // [1, 2, 3, 4, 5]
```

#### 問8: 配列や文字列から同じ要素の繰り返しを排除して返す`compress`関数を実装せよ。

```js
compress([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [ 1, 2, 1, 2, 3 ]
compress('aaaabccaadeeee') // abcade
```

#### 問9: 配列や文字列の同じ要素の繰り返しを配列としてまとめて返す`pack`関数を実装せよ。

```js
pack([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [[1, 1], [2], [1], [2, 2], [3, 3, 3, 3]]
pack('aaaabccaadeeee') // ['aaaa', 'b', 'cc', 'aa', 'd', 'eeee']
```

#### 問10: `pack`関数を用いて、配列や文字列をランレングス圧縮する`encode`関数を実装せよ。

```js
encode([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [[2, 1], [1, 2], [1, 1], [2, 2], [4, 3]]
encode('aaaabccaadeeee')
// [[4, 'a'], [1, 'b'], [2, 'c'], [2, 'a'], [1, 'd'], [4, 'e']]
```

### 問11～20: 配列の続き

#### 問11: 問10の結果を変更し、重複が無ければランレングス圧縮せずに要素を格納する`encodeModified`関数を実装せよ。

```js
encodeModified([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [[2, 1], 2, 1, [2, 2], [4, 3]]
encodeModified('aaaabccaadeeee')
// [[4, 'a'], 'b', [2, 'c'], [2, 'a'], 'd', [4, 'e']]
```

#### 問12: ランレングス圧縮した配列をデコードする`decodeModified`関数を実装せよ。

```js
decodeModified([[2, 1], 2, 1, [2, 2], [4, 3]]) // [1, 1, 2, 1, 2, 2, 3, 3, 3, 3]
decodeModified([[4, 'a'], 'b', [2, 'c'], [2, 'a'], 'd', [4, 'e']]) // aaaabccaadeeee
```

#### 問13: `pack`関数のように重複を含む配列を作らずに、直接ランレングス圧縮する`encodeDirect`関数を実装せよ。

```js
encodeDirect([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [[2, 1], 2, 1, [2, 2], [4, 3]]
encodeDirect('aaaabccaadeeee')
// [[4, 'a'], 'b', [2, 'c'], [2, 'a'], 'd', [4, 'e']]
```

#### 問14: 配列や文字列の要素を複製する`dupli`関数を実装せよ。

```js
dupli([1, 2, 3]) // [1, 1, 2, 2, 3, 3]
dupli('abc') // aabbcc
```

#### 問15: 指定された回数だけ配列や文字列の要素を複製する`repli`関数を実装せよ。

```js
repli([1, 2, 3], 3) // [1, 1, 1, 2, 2, 2, 3, 3, 3]
repli('abc', 3) // aaabbbccc
```

#### 問16: nの倍数の位置の要素を配列や文字列から削除する`drop`関数を実装せよ。

```js
drop([1, 2, 3, 4], 2) // [1, 3] 
drop('abcdefghik', 3) // 'abdeghk'
```

#### 問17: 配列や文字列を指定した位置で分ける`split`関数を実装せよ。

```js
split([1, 2, 3, 4], 2) // [[1, 2], [3, 4]]
split('abcdefghik', 3) // ['abc', 'defghik']
```

#### 問18: 選択した範囲を配列や文字列から取り出す`slice`関数を実装せよ。

`Array.slice`は使用しないこと。

```js
slice([1, 2, 3, 4], 2, 4) // [2, 3, 4]
slice('abcdefghik', 3, 7) // cdefg
```

#### 問19: 配列や文字列の要素を左にn個ずらす`rotate`関数を実装せよ。

負の数を渡したら右にずらすようにしてください。

```js
rotate([1, 2, 3], 1) // [2, 3, 1]
rotate('abcdefgh', 3) // defghabc
rotate('abcdefgh', -2) // ghabcdef
```

#### 問20: 配列や文字列のn番目の要素を削除する`removeAt`関数を実装せよ。

削除した要素と処理後の配列を、配列に格納して返してください。

```js
removeAt(3, [1, 2, 3]) // [3, [1, 2]]
removeAt(2, 'abcd') // ['b', 'acd']
```

### 問21～28: 配列、再び

#### 問21: 配列や文字列の指定した位置に要素を挿入する`insertAt`関数を実装せよ。

```js
insertAt(5, [1, 2, 3, 4], 3) // [1, 2, 5, 3, 4]
insertAt('X', 'abcd', 2) // aXbcd
```

#### 問22: 指定された範囲内のすべての整数または文字を含む配列を生成する`range`関数を実装せよ。

```js
range(4, 9) // [4, 5 ,6, 7, 8, 9]
range('a', 'z') // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
```

#### 問23: 配列や文字列から指定された数ぶんだけランダムに要素を取り出す`rndSelect`関数を実装せよ。

```js
rndSelect('abcdefgh', 3) // eda など
```

#### 問24: 長さnの1以上m以下の乱数列を生成する`diffSelect`関数を実装せよ。

```js
diffSelect(6, 49) // [23, 1, 17, 33, 21, 37] など
```

#### 問25: 配列や文字列をランダムに並び替える`rndPermu`関数を実装せよ。

```js
rndPermu('abcdef') // badcef など
```

#### 問26: m個の要素からn個を選んだ組み合わせを返す`combinations`関数を実装せよ。

```js
combinations('abcdef', 2) // ['ab', 'ac', 'ad', 'ae', 'af', 'bc', 'bd', 'be', 'bf', 'cd', 'ce', 'cf', 'de', 'df', 'ef']
```

#### 問27: 配列の要素を互いに素な配列にグループ化して返す`group`関数を実装せよ。

```js
group(["aldo","beat","carla","david","evi","flip","gary","hugo","ida"], 2, 3, 4)
// [[["aldo","beat"],["carla","david","evi"],["flip","gary","hugo","ida"]],...] 1260個の解
group(["aldo","beat","carla","david","evi","flip","gary","hugo","ida"], 2, 2, 5)
// [[["aldo","beat"],["carla","david"],["evi","flip","gary","hugo","ida"]],...] 756個の解
```

#### 問28: 配列の配列を、要素の長さでソートする`lsort`関数を実装せよ。また、要素の長さの頻度順にソートする`lfsort`関数を実装せよ。

```js
lsort(["abc","de","fgh","de","ijkl","mn","o"]) // ["o","de","de","mn","abc","fgh","ijkl"]
```

```js
lfsort(["abc", "de", "fgh", "de", "ijkl", "mn", "o"]) // ["ijkl","o","abc","fgh","de","de","mn"]
```

### 問31～41: 算術

#### 問31: 引数が素数かどうかを返す`isPrime`関数を実装せよ。

```js
isPrime(7) // true
```

#### 問32: 拡張されたユークリッドの互除法(`gcd`)を実装せよ。

```js
gcd(36, 63) // 9
```

#### 問33: 渡した2つの整数が互いに素かどうかを返す`coprime`関数を実装せよ。

```js
coprime(35, 64) // true
```

#### 問34: オイラーのφ関数`totient`を実装せよ。

```js
totient(10) // 4
```

#### 問35: 引数を素因数分解する`primeFactors`関数を実装せよ。

結果は昇順にソートすること。

```js
primeFactors(315) // [3, 3, 5, 7]
```

#### 問36: 問35の結果を累乗で表現する`primeFactorsMult`関数を実装せよ。

`3 ** 2`なら`[3, 2]`と表現します。

```js
primeFactorsMult(315) // [[3, 2], [5, 1], [7, 1]]
```

#### 問37: オイラーのφ関数を改良した`phi`関数を実装せよ。

問36の結果を`[[p1, m1], [p2, m2], [p3, m3], ...]`としたとき、オイラーのφ関数は次のようにして計算できます。

```
phi(m) = (p1 - 1) * p1 ** (m1 - 1) * 
         (p2 - 1) * p2 ** (m2 - 1) * 
         (p3 - 1) * p3 ** (m3 - 1) * ...
```

```js
phi(10) // 4
```

#### 問38: 問34と問37の実行時間を比較せよ。

`totient(10090)`と`phi(10090)`を実行して、`phi`関数のほうが効率的であることを確かめてください。  
せっかくなので、関数の実行時間を計測する`time`関数を実装して調べましょう。

```js
time(totient(10090)) < time(phi(10090)) // true
```

#### 問39: 与えられた範囲内の素数の配列を返す`primesR`関数を実装せよ。

```js
primesR(10, 20) // [11, 13, 17, 19]
```

#### 問40: ゴールドバッハの予想を確かめる`goldbach`関数を実装せよ。

ゴールドバッハの予想は「全ての2よりも大きな偶数は2つの素数の和として表すことができる」という予想です。

```js
goldbach(28) // [5, 23]
```

#### 問41: 与えられた範囲内の`goldbach`の結果を出力する`goldbachList`関数を実装せよ。

第三引数を与えた場合、2つの素数がその値より大きいもののみを出力するようにしてください。

```js
goldbachList(9, 20) // [[3, 7], [5, 7], [3, 11], [3, 13], [5, 13], [3,17]]
goldbachList(4, 2000, 50) // [[73, 919], [61, 1321], [67, 1789], [61, 1867]]
```

### 問46～50: 論理と符号

#### 問46: 真理値表を作成する`table`関数を実装せよ。

```js
table((a, b) => a && (a || b))
/*
[
  [[true, true], true],
  [[true, false], true],
  [[false, true], false],
  [[false, false], false]
]
*/
```

`table((a, b, c) => a && (b || c))`のように、引数が増えても真理値表を出力できるようにしてください。

#### 問49: 与えられたbit数のグレイコードの配列を求める`gray`関数を実装せよ。

```js
gray(3) // ["000","001","011","010","110","111","101","100"]
```

#### 問50: ハフマン符号化をする`huffman`関数を実装せよ。

符号化する要素は`[記号, 出現頻度]`で表されます。

```js
huffman([['a', 45], ['b', 13], ['c', 12], ['d', 16], ['e', 9], ['f', 5]])
// [['a', '0'], ['b', '101'], ['c', '100'], ['d', '111'], ['e', '1101'], ['f', '1100']]
```

### 問54～60: 二分木

#### 問54: 二分木クラス`BinaryTree`を実装せよ。

二分木は、あるノードが持つ子の数が2個以下の木構造です。  

以下のようにコンストラクタに二分木にしたい配列を渡すと、二分木として表現できるようにします。  
引数とする配列は、`[値, 左部分木, 右部分木]`で表現することにします。

```js
const tree = new BinaryTree(['a', ['b', 'd', 'e'], ['c', null, ['f', 'g', null]]])
console.log(tree)
/*
{
  "value": "a",
  "left": {
    "value": "b",
    "left": "d",
    "right": "e"
  },
  "right": {
    "value": "c",
    "left": null,
    "right": {
      "value": "f",
      "left": "g",
      "right": null
    }
  }
}
*/
```

#### 問55: 左部分木と右部分木のノードの数の差が1以下である二分木を全て生成する`cbalTree`関数を実装せよ。

```js

```

#### 問56: 二分木が対称かどうかを返す`isSymmetric`関数を実装せよ。

ノードの値は比較しません。あくまで、構造が対称かどうかを調べます。

#### 問57: 二分探索木を生成する`searchTree`関数を実装せよ。

引数は一次元配列とします。

```js
BinaryTree.searchTree([3, 2, 5, 7, 1])
// TODO 結果
BinaryTree.searchTree([5, 3, 18, 1, 4, 12, 21]).isSymmetric() // true
BinaryTree.searchTree([3, 2, 5, 7, 4]).isSymmetric() // false
```

#### 問58: 問55のように平衡で、かつ対称な二分木があれば返す`symCbalTrees`関数を実装せよ。

引数はノード数で、そのような二分木が見つからなければ`[]`を返します。  

#### 問59: 左部分木と右部分木の高さの差が1以下である二分木を全て生成する`hbalTree`関数を実装せよ。


#### 問60: 与えられた数のノードを持つ問59のような二分木を全て生成する`hbalTreeNodes`関数を実装せよ。


### 問61～69: 二分木、続き

#### 問61: 二分木の葉の数を数える`countLeaves`関数を実装せよ。

#### 問61A: 二分木の葉のリストを返す`leaves`関数を実装せよ。

#### 問62: 二分木の内部ノード（葉以外の節）を返す`internals`関数を実装せよ。

#### 問62B: 指定された深さのノードのリストを返す`atLevel`関数を実装せよ。

#### 問63: 完全二分木を生成する`completeBinaryTree`関数と、完全二分木かどうかを返す`isCompleteBinaryTree`関数を実装せよ。

完全二分木は、根からすべての葉までの深さの差が1以下で、葉が左詰めになっている二分木です。

```js

```

#### 問64: 次の図のように、各ノードに座標を付与する`layout`関数を実装せよ。

![問64](./img/p64.gif)

次のようにノードに座標を割り振ります。

- x座標は、通りがけ順に走査したときの順番
- y座標は、そのノードがある深さ

#### 問65: 次の図のように、各ノードに座標を付与する`wideLayout`関数を実装せよ。

![問65](./img/p65.gif)

配置ルールは図を見て考えてください。  
ヒント：ある深さの隣接するノードの水平距離が一定なことに着目しましょう。

#### 問66: 次の図のように、各ノードに座標を付与する`compactLayout`関数を実装せよ。

![問66](./img/p66.gif)

このレイアウトを用いると、全てのノードにおいて一定の対称性を保ちつつ、コンパクトに二分木を表現できます。  
配置ルールは図を見て考えてください。  

ヒント：ノードと後継ノード間の水平距離に着目しましょう。  
左部分木と右部分木をまとめて結合していけば、構築できるのではないでしょうか。

```js

```

#### 問67: 文字列をパースして二分木にする`fromString`関数を実装せよ。

文字列表現は`x(y,a(,b))`のようにして与えられます。


#### 問68: 二分木を行きがけ順に走査する`treeToPreorder`関数と、通りがけ順に走査する`treeToInorder`関数を実装せよ。また、行きがけ順と通りがけ順に走査した結果を用いて二分木を生成する`preInTree`関数を実装せよ。

#### 問69: 次のような文字列を二分木に変換する`ds2tree`関数と、逆変換する`tree2ds`関数を実装せよ。

二分木は`'abd..e..c.fg...'`のような文字列で表現されて渡されます。`.`は`null`とし、各ノードには1文字しか入りません。  
これをパースして、次のような結果になるようにしてください。

```js
```

### 問70～73: 多分木

#### 問70: 多分木クラス`MultiwayTree`を実装せよ。ノードの数を返す`count`関数を実装せよ。また、次のような文字列表現を変換する`stringToTree`関数と、逆変換する`treeToString`関数を実装せよ。

#### 問71: 根から全ノードまでの経路長の総和を求める`ipl`関数を実装せよ。

#### 問72: ボトムアップ式にノードを列挙する`bottomUp`関数を実装せよ。

#### 問73: Lispのような木構造の文字列表現を返す`lisp`関数を実装せよ。


### 問80～89: グラフ

### 問90～94: その他の問題

#### 問90: [N-クイーン問題](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%82%A4%E3%83%88%E3%83%BB%E3%82%AF%E3%82%A4%E3%83%BC%E3%83%B3)を解く`queens`関数を実装せよ。

#### 問91: [ナイト・ツアー問題](https://ja.wikipedia.org/wiki/%E3%83%8A%E3%82%A4%E3%83%88%E3%83%BB%E3%83%84%E3%82%A2%E3%83%BC)を解く`knightsTour`関数を実装せよ。

n * nのチェス盤の上を指定したマスに置かれたナイトが全てのマスを巡回し、その辿った経路を配列として返します。

### 問95～99: その他の問題、続き


## 解答例・解説

解答例の解き方は短く書こうとしていたり、丁寧に書こうとしていたりで、その時の気分によってまちまちです。  
パフォーマンスも考慮していません。  
実際に解くときは無理して短く書くよりも、読み手が分かりやすいコードを書くようにしましょう。

### 問1～10: 配列

#### 問1: 配列や文字列の最後の要素を取り出す`last`関数を実装せよ。

```js
const last = list => list[list.length - 1]

last([1, 2, 3, 4]) // 4
last('xyz') // z
```

配列の`index`は`0`から開始するため、`配列の長さ - 1`で最後の要素が取れます。  
JavaScriptの場合、定義していない要素を参照すると`undefined`が返ってくるので、空文字や空配列のことはあまり考えなくてもいいでしょう。

#### 問2: 配列や文字列の最後の一つ前の要素を取り出す`butLast`関数を実装せよ。

```js
const butLast = list => list[list.length - 2]

butLast([1, 2, 3, 4]) // 3
butLast('abcdefghijklmnopqrstuvwxyz') // y
```

問1と大体同じ。

#### 問3: 配列や文字列のn番目の要素を取り出す`elementAt`関数を実装せよ。

ただし、最初の要素は0番目ではなく、1番目と数えます。

```js
const elementAt = (list, index) => list[index - 1]

elementAt([1, 2, 3], 2) // 2
elementAt('JavaScript', 5) // S
```

普通に配列の要素を参照しているだけなので、`elementAt`関数を作る意味は無いですね。  
JavaScriptなので`index out of bounds`のようなエラーも投げられません。

#### 問4: 配列や文字列の長さを返す`length`関数を実装せよ。

`Array.length`や`String.length`は使用しないこと。  
また、絵文字の長さは`1`と数えるようにすること。

```js
const length = list => [...list].fill(1).reduce((a, c) => a + c, 0)

length([123, 456, 789]) // 3
length('💃Hello, World!💃') // 15
```

文字列の方には絵文字が混ざっています。  
**絵文字はサロゲートペアで表現されているため、`length`で2文字扱いになります。**  
スプレッド演算子を用いると、`[...'💃Hello!💃']`を`[ '💃', 'H', 'e', 'l', 'l', 'o', '!', '💃' ]`にできるため、`length`で正しい長さを返すことができます。

さて、`length`の使用が禁止されているため、その代わりとなる方法を考えなければなりません。  
`fill`は配列の要素を全て引数の値に変更して返します。`reduce`は配列の要素を左から右に読んでいき、何か処理をすることができます。  
つまり、`fill(1)`してから`reduce`で足せば、配列の長さが取得できます。

#### 問5: 配列や文字列を逆順にして返す`reverse`関数を実装せよ。

`Array.reverse`は使用しないこと。  
また、絵文字の長さは`1`と数えるようにすること。

```js
const reverse = list => [...list].reduceRight(
  (a, c) => a.concat(c), Array.isArray(list) ? [] : '')

reverse('A man, a plan, a canal, panama!💃') // 💃!amanap ,lanac a ,nalp a ,nam A
reverse([1, 2, 3, 4]) // [4, 3, 2, 1]
```

絵文字の処理は問4と同様です。  
配列の要素を右から左に結合していけば逆になるため、`reduceRight`を用います。  
引数が配列のときと文字列のときで結果を変えたいので、初期値を`Array.isArray(list) ? [] : ''`で分岐させ、`Array.concat`または`String.concat`で結合させています。


#### 問6: 配列や文字列が回文かどうかを返す`isPalindrome`関数を実装せよ。

```js
const isPalindrome = list => list.toString() === reverse(list).toString()

isPalindrome([1, 2, 3]) // false
isPalindrome('たけやぶやけた') // true
isPalindrome([1, 2, 4, 8, 16, 8, 4, 2, 1]) // true
```

問5の`reverse`を使うと楽に書けます。  
配列の厳密な比較は面倒なので、`toString`して同じ文字列になればよしとします。

#### 問7: ネストしている配列を平坦（一次元配列）にして返す`flatten`関数を実装せよ。

`Array.flat`は使用しないこと。

```js
const flatten = list => list.reduce(
  (a, c) => a.concat(Array.isArray(c) ? flatten(c) : c), [])

flatten([1, [2, [3, 4], 5]]) // [1, 2, 3, 4, 5]
```

`reduce`を使います。要素が配列なら再帰的に`flatten`を呼んで一次元配列を返し、`concat`で結合します。

#### 問8: 配列や文字列から同じ要素の繰り返しを排除して返す`compress`関数を実装せよ。

```js
const compress = list => [...list].reduce(
  (a, c) => a.concat(a[a.length - 1] !== c ? c : []), 
  Array.isArray(list) ? [] : '')

compress([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [ 1, 2, 1, 2, 3 ]
compress('aaaabccaadeeee') // abcade
```

`reduce`を使います。  
アキュムレータ`a`の最後の要素が現在値`c`と等しくなければ`c`を結合し、等しければ何も結合しないようにします。

#### 問9: 配列や文字列の同じ要素の繰り返しを配列としてまとめて返す`pack`関数を実装せよ。

```js
const pack = list => {
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

pack([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [[1, 1], [2], [1], [2, 2], [3, 3, 3, 3]]
pack('aaaabccaadeeee') // ['aaaa', 'b', 'cc', 'aa', 'd', 'eeee']
```

少々長くなっています。もっといい解法があるかもしれません。  
結果の配列`result`に格納したい要素`element`と、現在対象としている値`current`を宣言します。  
`forEach`でループさせ、`current`と要素が等しければ`element`と結合させ、等しくなければ`current`と`element`に新しい値をセットします。  
ループが末尾のときは、`element`を`result`に格納するのを忘れずに。

#### 問10: `pack`関数を用いて、配列や文字列をランレングス圧縮する`encode`関数を実装せよ。

```js
const encode = list => pack(list).map(e => [e.length, e[0]])

encode([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [[2, 1], [1, 2], [1, 1], [2, 2], [4, 3]]
encode('aaaabccaadeeee')
// [[4, 'a'], [1, 'b'], [2, 'c'], [2, 'a'], [1, 'd'], [4, 'e']]
```

`map`で各要素の長さと最初の要素を格納した配列に変換します。

### 問11～20: 配列の続き

#### 問11: 問10の結果を変更し、重複が無ければランレングス圧縮せずに要素を格納する`encodeModified`関数を実装せよ。

```js
const encodeModified = list => encode(list).map(e => e[0] === 1 ? e[1] : e)

encodeModified([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [[2, 1], 2, 1, [2, 2], [4, 3]]
encodeModified('aaaabccaadeeee')
// [[4, 'a'], 'b', [2, 'c'], [2, 'a'], 'd', [4, 'e']]
```

#### 問12: ランレングス圧縮した配列をデコードする`decodeModified`関数を実装せよ。

```js
const decodeModified = list => {
  const result = []
  
  list.forEach(e => {
    if (Array.isArray(e)) for (let i = 0; i < e[0]; i++) {
      result.push(e[1])
    } else {
      result.push(e)
    }
  })
  
  return typeof(result[0]) === 'string' ? result.join('') : result
}

decodeModified([[2, 1], 2, 1, [2, 2], [4, 3]]) // [1, 1, 2, 1, 2, 2, 3, 3, 3, 3]
decodeModified([[4, 'a'], 'b', [2, 'c'], [2, 'a'], 'd', [4, 'e']]) // aaaabccaadeeee
```

配列なら1番目の要素を長さの分だけ格納し、そうでないなら要素をそのまま配列に格納します。  
文字の配列だった場合は、最後に`join`で文字列にします。文字と数値の混在には対応していません。  

文字列かどうかの判定は`typeof`を使っています。  
`typeof`は、引数の型を文字列で返してくれます。

#### 問13: `pack`関数のように重複を含む配列を作らずに、直接ランレングス圧縮する`encodeDirect`関数を実装せよ。

```js
const encodeDirect = list => {
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

encodeDirect([1, 1, 2, 1, 2, 2, 3, 3, 3, 3]) // [[2, 1], 2, 1, [2, 2], [4, 3]]
encodeDirect('aaaabccaadeeee')
// [[4, 'a'], 'b', [2, 'c'], [2, 'a'], 'd', [4, 'e']]
```

`pack`関数を改造して直接エンコードできるようにします。  
要素の数をカウントして、1個しかないならその要素自体を、2個以上あるならランレングス圧縮した結果を格納します。

#### 問14: 配列や文字列の要素を複製する`dupli`関数を実装せよ。

```js
dupli([1, 2, 3]) // [1, 1, 2, 2, 3, 3]
dupli('abc') // aabbcc
```

`repli`関数のデフォルトを`dupli`関数の動作にするのでスキップします。

#### 問15: 指定された回数だけ配列や文字列の要素を複製する`repli`関数を実装せよ。

```js
const repli = (list, n = 2) => {
  const isStr = typeof(list) === 'string'
  list = [...list]
  const result = []

  list.forEach(e => { for (let i = 0; i < n; i++) result.push(e) })

  return isStr ? result.join('') : result
}

repli([1, 2, 3], 3) // [1, 1, 1, 2, 2, 2, 3, 3, 3]
repli('abc', 3) // aaabbbccc
```

`for`文で指定された回数分だけ配列に要素を繰り返し`push`します。  
デフォルト引数を与えているため、第二引数を渡さなければ`dupli`の動作になります。

#### 問16: 配列や文字列からnの倍数の位置の要素を削除する`drop`関数を実装せよ。

```js
const drop = (list, n) => ((ret = [...list].filter((_, i) => (i + 1) % n !== 0)) => 
  typeof(list) === 'string' ? ret.join('') : ret)()

drop([1, 2, 3, 4], 2) // [1, 3] 
drop('abcdefghik', 3) // 'abdeghk'
```

1行で書く必要は全くありませんが、デフォルト引数とアロー関数を利用すれば1行で色々な処理をさせることができます。  
`filter`で`index + 1`が`n`で割り切れるなら除外するようにしています。

#### 問17: 配列や文字列を指定した位置で分ける`split`関数を実装せよ。

```js
const split = (list, n) => ((x = [...list], ret = [x, x.splice(n)]) => 
  typeof(list) === 'string' ? ret.map(e => e.join('')) : ret)()

split([1, 2, 3, 4], 2) // [[1, 2], [3, 4]]
split('abcdefghik', 3) // ['abc', 'defghik']
```

`splice`を使えば簡単に二つに分けることができます。  
元の配列にも変更を加えてしまうので、使う際はスプレッド演算子などで配列をコピーしておいたほうが安全です。  
その性質を利用して、`[x, x.splice(n)]`で二つに分けています。

#### 問18: 配列や文字列から選択した範囲を取り出す`slice`関数を実装せよ。

`Array.slice`、`Array.splice`は使用しないこと。

```js
const slice = (list, start, end = list.length) => {
  let result = Array.isArray(list) ? [] : ''

  for (let i = start - 1; i < end; i++) {
    result = result.concat(list[i])
  }
  return result
}

slice([1, 2, 3, 4], 2, 4) // [2, 3, 4]
slice('abcdefghik', 3, 7) // cdefg
```

#### 問19: 配列や文字列の要素を左にn個ずらす`rotate`関数を実装せよ。

負の数を渡したら右にずらすようにしてください。

```js
const rotate = (list, n) => ((x = [...list], _ = x.unshift(...x.splice(n))) =>
  typeof(list) === 'string' ? x.join('') : x)()

rotate([1, 2, 3], 1) // [2, 3, 1]
rotate('abcdefgh', 3) // defghabc
rotate('abcdefgh', -2) // ghabcdef
```

先頭に要素を追加する`unshift`と、配列から要素を取り除く`splice`を組み合わせれば簡単に実装できます。

#### 問20: 配列や文字列のn番目の要素を削除する`removeAt`関数を実装せよ。

削除した要素と処理後の配列を、配列に格納して返してください。

```js
const removeAt = (n, list) => ((x = [...list], removed = x.splice(n - 1, 1)[0]) => 
  [removed, typeof(list) === 'string' ? x.join('') : x])()

removeAt(3, [1, 2, 3]) // [3, [1, 2]]
removeAt(2, 'abcd') // ['b', 'acd']
```

`splice`の第二引数に数値を渡すと、その数だけ開始位置から取り除かれます。

### 問21～28: 配列、再び

#### 問21: 配列や文字列の指定した位置に要素を挿入する`insertAt`関数を実装せよ。

```js
const insertAt = (element, list, n) => ((x = [...list], ret = x.concat(element, x.splice(n - 1))) => 
  typeof(list) === 'string' ? ret.join('') : ret)()

insertAt(5, [1, 2, 3, 4], 3) // [1, 2, 5, 3, 4]
insertAt('X', 'abcd', 2) // aXbcd
```

`concat`と`splice`を組み合わせて、指定位置に`element`を挿入します。

#### 問22: 指定された範囲内のすべての整数または文字を含む配列を生成する`range`関数を実装せよ。

```js
const range = (start, end) => {
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

range(4, 9) // [4, 5 ,6, 7, 8, 9]
range('a', 'z') // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
```

[試しに1問解いてみる](#試しに1問解いてみる)で解答済みです。  
文字列の場合は`String.charCodeAt`で数値化し、`start`と`end`の範囲内の文字を配列に格納します。

#### 問23: 配列や文字列から指定された数ぶんだけランダムに要素を取り出す`rndSelect`関数を実装せよ。

```js
const rndSelect = (list, n) => {
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

rndSelect('abcdefgh', 3) // eda など
```

`Math.floor(Math.random() * n)`で、0以上n未満の乱数を生成することができます。  
あとは`splice`で除去しながら結果の配列に格納していきます。  
この場合、条件文に`list.length > 0`を加えないと、`rndSelect([1, 2, 3], 10)`などの場合に`undefined`を含む長さ10の配列が返ってきてしまいます。

#### 問24: 長さnの1以上m以下の乱数列を生成する`diffSelect`関数を実装せよ。

```js
const diffSelect = (length, max) => {
  if (max < 1) { throw new Error('最大値は1以上の値を指定してください') }
  const result = []

  for (let i = 0; i < length; i++) {
    result.push(Math.floor(Math.random() * max) + 1)
  }
  return result
}

diffSelect(6, 49) // [23, 1, 17, 33, 21, 37] など
```

問題23で扱った`Math.floor(Math.random() * max)`に1を足すと1以上`max`以下の乱数になります。

#### 問25: 配列や文字列をランダムに並び替える`rndPermu`関数を実装せよ。

```js
const rndPermu = list => rndSelect(list, list.length)
rndPermu('abcdef') // badcef など
```

定義済みの`rndSelect`を使えばすぐに定義できます。

#### 問26: m個の要素からn個を選んだ組み合わせを返す`combinations`関数を実装せよ。

```js
const combinations = (list, n) => {
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

combinations('abcdef', 3) 
// ['abc', 'abd', 'abe', 'abf', 'acd', 'ace', 'acf', 'ade', 'adf', 'aef', 'bcd', 'bce', 'bcf', 'bde', 'bdf', 'bef', 'cde', 'cdf', 'cef', 'def']
```

高校一年生くらいで習う組み合わせです。  

`0`の場合は、何も選ばないので`null`を入れた配列を返します。  
`1`の場合は各要素を選ぶので、スプレッド演算子でバラします。  

`2`以上の場合は再帰的に`combinations`を適用しましょう。  
例えば`abcd`で`2`のとき、`a`に`b, c, d`、`b`に`c, d`、`c`に`d`を結合すれば組み合わせ`['ab', 'ac', 'ad', 'bc', 'bd', 'cd']`が出ます。  
`3`のとき、`a`に`b, c, d`から`2`個選んだ組み合わせ`bc, bd, cd`と、`b`に`c, d`から`2`個選んだ組み合わせ`cd`を結合すれば`['abc', 'abd', 'acd', 'bcd']`が出ます。  
つまり、`i`番目の要素に後続(`i + 1`以降)の要素を`n - 1`個選んだ組み合わせを結合すれば、組み合わせを導出できます。

#### 問27: 配列の要素を互いに素な配列にグループ化して返す`group`関数を実装せよ。

```js
const exCombinations = (list, n) => {
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

const group = (list, ...numbers) => {
  if (list.length === 0) return [[]]

  const [n, ...ns] = numbers
  const result = []

  exCombinations(list, n).forEach(([g, rs]) =>
    group(rs, ...ns).forEach(e => result.push([g].concat(e))))

  return result
}

group(["aldo","beat","carla","david","evi","flip","gary","hugo","ida"], 2, 3, 4)
// [[["aldo","beat"],["carla","david","evi"],["flip","gary","hugo","ida"]],...] 1260個の解
group(["aldo","beat","carla","david","evi","flip","gary","hugo","ida"], 2, 2, 5)
// [[["aldo","beat"],["carla","david"],["evi","flip","gary","hugo","ida"]],...] 756個の解
```

まず、選択されなかった要素も一緒に返す`exCombinations`関数を定義します。  
結果は`[選んだものの配列, 選ばなかったものの配列]`の構造にします。

再帰させるので、再帰を抜けるための条件文は最初に書いておきましょう。  
`n === 1`のときは、配列の全ての要素が選択されるようにします。

`exCombinations`は、最初の要素を選ぶ場合と、選ばない場合を考慮して再帰させます。  
`exCombinations`がどう呼ばれるのか例を見てみましょう。

```js
exCombinations([1,2,3,4], 2)
exCombinations([2,3,4], 1) // [ [ [ 2 ], [ 3, 4 ] ], [ [ 3 ], [ 2, 4 ] ], [ [ 4 ], [ 2, 3 ] ] ]
exCombinations([2,3,4], 2) // [ [ [ 2, 3 ], [ 4 ] ], [ [ 2, 4 ], [ 3 ] ], [ [ 3, 4 ], [ 2 ] ] ]
```

最初の要素を`x`、後続する要素を`xs`とします。  
最初の要素`x`を選んだ場合、`xs`から残りの`n - 1`個の要素を選択すれば`n`個選んだことになります。  
結果は`[選んだものの配列, 選ばなかったものの配列]`になっているため、結果の0番目に`x`を結合させます。

`x`を選ばなかった場合、`xs`から残りの`n`個の要素を選択すれば`n`個選んだことになります。  
`x`は結果の配列の1番目に結合させます。

これを再帰的に呼ぶと、配列から`n`個選んだ組み合わせと選ばなかった組み合わせを取得できます。

肝心の`group`ですが、選んだ組み合わせに、選ばなかった組み合わせのグループを結合していけば生成できます。  

#### 問28: 配列の配列を、要素の長さでソートする`lsort`関数を実装せよ。また、要素の長さの頻度順にソートする`lfsort`関数を実装せよ。

```js
const lsort = list => list.sort((a, b) => a.length - b.length)
lsort(["abc","de","fgh","de","ijkl","mn","o"]) // ["o","de","de","mn","abc","fgh","ijkl"]
```

```js
const lfsort = list => {
  const map = new Map(encode(list.map(e => e.length).sort()).map(([value, key]) => [key, value]))
  return list.sort((a, b) => map.get(a.length) - map.get(b.length))
}
lfsort(["abc", "de", "fgh", "de", "ijkl", "mn", "o"]) // ["ijkl","o","abc","fgh","de","de","mn"]
```

`sort`を使えば簡単に長さの昇順にソートできます。  
`sort`には比較関数を渡すのですが、この関数の戻り値が0未満なら`a`を`b`より前に、0なら変更なし、0より大きいなら`b`を`a`より前に移動します。  
つまり、前の要素の長さから次の要素の長さを引けば、どちらが長いか分かります。

頻度順にソートするには、前に作ったランレングス圧縮する`encode`関数を使うと楽にできます。長さの配列を昇順ソートしたものをランレングス圧縮しましょう。  
長さを`key`、頻度を`value`にして`Map`に格納したいので、そのように入れ替えておきます。  
あとは生成した`Map`から、長さを`key`にして頻度を参照しながらソートすればよいでしょう。


#### 問66: 次の図のように、各ノードに座標を付与する`compactLayout`関数を実装せよ。

あるノードの左→右、右→左を常に見ながら座標を決めていく


## GitHub

各問題のテストも実行できるようになっています。  
ライブラリとしてバンドルする設定になっているため、自分用のJSライブラリの作り方が分からないときは参考になるかもしれません。
