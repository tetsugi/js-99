import { 
  /* 1～10 */
  last, butLast, elementAt, length, reverse, isPalindrome, flatten, compress, pack, encode,
  /* 11～20 */
  encodeModified,
  range, lfsort
} from '../src/array'

describe('問1～10: 配列', () => {
  describe('問1: 配列や文字列の最後の要素を取り出す', () => {
    test('配列', () => {
      expect(last([1, 2, 3, 4])).toBe(4)
    })
  
    test('文字列', () => {
      expect(last('xyz')).toBe('z')
    })
  })
  
  describe('問2: 配列や文字列の最後の一つ前の要素を取り出す', () => {
    test('配列', () => {
      expect(butLast([1, 2, 3, 4])).toBe(3)
    })
  
    test('文字列', () => {
      expect(butLast('abcdefghijklmnopqrstuvwxyz')).toBe('y')
    })
  
    test('一つしか要素が無い配列', () => {
      expect(butLast([1])).toBe(undefined)
    })
  })
  
  describe('問3: 配列や文字列のn番目の要素を取り出す', () => {
    test('配列', () => {
      expect(elementAt([1, 2, 3], 2)).toBe(2)
    })
  
    test('文字列', () => {
      expect(elementAt('JavaScript', 5)).toBe('S')
    })
  })
  
  describe('問4: 配列や文字列の長さを返す', () => {
    test('配列', () => {
      expect(length([123, 456, 789])).toBe(3)
    })
  
    test('絵文字入り文字列', () => {
      expect(length('💃Hello, World!💃')).toBe(15)
    })
  
    test('空の配列', () => {
      expect(length([])).toBe(0)
    })
  })

  describe('問5: 配列や文字列を逆順にして返す', () => {
    test('配列', () => {
      expect(reverse([1, 2, 3, 4])).toEqual([4, 3, 2, 1])
    })

    test('文字列', () => {
      expect(reverse('A man, a plan, a canal, panama!💃')).toBe('💃!amanap ,lanac a ,nalp a ,nam A')
    })
  })

  describe('問6: 配列や文字列が回文かどうかを返す', () => {
    test('配列', () => {
      expect(isPalindrome([1, 2, 3])).toBe(false)
      expect(isPalindrome([1, 2, 4, 8, 16, 8, 4, 2, 1])).toBe(true)
    })

    test('文字列', () => {
      expect(isPalindrome('たけやぶやけた')).toBe(true)
    })
  })

  describe('問7: ネストしている配列を平坦（一次元配列）にして返す', () => {
    test('', () => {
      expect(flatten([1, [2, [3, 4], 5]])).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('問8: 配列や文字列から同じ要素の繰り返しを排除して返す', () => {
    test('配列', () => {
      expect(compress([1, 1, 2, 1, 2, 2, 3, 3, 3, 3])).toEqual([1, 2, 1, 2, 3])
    })

    test('文字列', () => {
      expect(compress('aaaabccaadeeee')).toBe('abcade')
    })
  })

  describe('問9: 配列や文字列の同じ要素の繰り返しを配列としてまとめて返す', () => {
    test('配列', () => {
      expect(pack([1, 1, 2, 1, 2, 2, 3, 3, 3, 3])).toEqual([[1, 1], [2], [1], [2, 2], [3, 3, 3, 3]])
    })

    test('文字列', () => {
      expect(pack('aaaabccaadeeee')).toEqual(['aaaa', 'b', 'cc', 'aa', 'd', 'eeee'])
    })
  })

  describe('問10: pack関数を用いて、配列や文字列をランレングス圧縮する', () => {
    test('配列', () => {
      expect(encode([1, 1, 2, 1, 2, 2, 3, 3, 3, 3])).toEqual([[2, 1], [1, 2], [1, 1], [2, 2], [4, 3]])
    })

    test('文字列', () => {
      expect(encode('aaaabccaadeeee')).toEqual([[4, 'a'], [1, 'b'], [2, 'c'], [2, 'a'], [1, 'd'], [4, 'e']])
    })
  })
})

describe('問11～20: 配列の続き', () => {
  describe('問11: 問10のencode関数を変更し、重複が無ければランレングス圧縮せずに要素を格納する', () => {
    test('配列', () => {
      expect(encodeModified([1, 1, 2, 1, 2, 2, 3, 3, 3, 3])).toEqual([[2, 1], 2, 1, [2, 2], [4, 3]])
    })

    test('文字列', () => {
      expect(encodeModified('aaaabccaadeeee')).toEqual([[4, 'a'], 'b', [2, 'c'], [2, 'a'], 'd', [4, 'e']])
    })
  })
})

describe('問21～28: 配列、再び', () => {
  describe('問22: 指定された範囲内のすべての整数または文字を含む配列を生成する', () => {
    test('4から9までの整数の配列', () => {
      expect(range(4, 9)).toEqual([4, 5, 6, 7, 8, 9])
    })
  
    test('5から1までの整数の配列（空の配列）', () => {
      expect(range(5, 1)).toEqual([])
    })
  
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

  describe('問28: 配列の配列を要素の長さでソートする', () => {
    test('lfsort', () => {
      expect(lfsort(["abc", "de", "fgh", "de", "ijkl", "mn", "o"])).toEqual(["ijkl","o","abc","fgh","de","de","mn"])
    })
  })
})


