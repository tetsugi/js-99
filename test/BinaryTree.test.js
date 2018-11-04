import BinaryTree from '../src/BinaryTree'

describe('問61～69: 二分木、続き', () => {
  test('問64: 各ノードに座標を付与する', () => {
    const actual = (new BinaryTree(['n', ['k', ['c', 'a', ['h', ['g', 'e', null], null]], 'm'], ['u', ['p', null, ['s', 'q', null]], null]])).layout().positions
    expect(actual).toEqual([ 
      { value: 'n', x: 8, y: 1 },
      { value: 'k', x: 6, y: 2 },
      { value: 'c', x: 2, y: 3 },
      { value: 'a', x: 1, y: 4 },
      { value: 'h', x: 5, y: 4 },
      { value: 'g', x: 4, y: 5 },
      { value: 'e', x: 3, y: 6 },
      { value: 'm', x: 7, y: 3 },
      { value: 'u', x: 12, y: 2 },
      { value: 'p', x: 9, y: 3 },
      { value: 's', x: 11, y: 4 },
      { value: 'q', x: 10, y: 5 } 
    ])
  })

  test('問65: 各ノードに座標を付与する', () => {
    const actual = (new BinaryTree(['n', ['k', ['c', 'a', ['e', 'd', 'g']], 'm'], ['u', ['p', null, 'q'], null]])).wideLayout().positions
    expect(actual).toEqual([ 
      { value: 'n', x: 15, y: 1 },
      { value: 'k', x: 7, y: 2 },
      { value: 'c', x: 3, y: 3 },
      { value: 'a', x: 1, y: 4 },
      { value: 'e', x: 5, y: 4 },
      { value: 'd', x: 4, y: 5 },
      { value: 'g', x: 6, y: 5 },
      { value: 'm', x: 11, y: 3 },
      { value: 'u', x: 23, y: 2 },
      { value: 'p', x: 19, y: 3 },
      { value: 'q', x: 21, y: 4 } 
    ])
  })

  test('問66: 各ノードに座標を付与する', () => {
    const actual = (new BinaryTree(['n', ['k', ['c', 'a', ['e', 'd', 'g']], 'm'], ['u', ['p', null, 'q'], null]])).compactLayout().positions
    expect(actual).toEqual([ 
      { value: 'n', x: 5, y: 1 },
      { value: 'k', x: 3, y: 2 },
      { value: 'c', x: 2, y: 3 },
      { value: 'a', x: 1, y: 4 },
      { value: 'e', x: 3, y: 4 },
      { value: 'd', x: 2, y: 5 },
      { value: 'g', x: 4, y: 5 },
      { value: 'm', x: 4, y: 3 },
      { value: 'u', x: 7, y: 2 },
      { value: 'p', x: 6, y: 3 },
      { value: 'q', x: 7, y: 4 } 
    ])
  })

  test('', () => {
    const t = (new BinaryTree(['n', ['k', ['c', null, ['e', ['d', 'a', null], 'g']], 'm'], ['u', ['p', null, 'q'], null]])).compactLayout().positions
    console.log(t)
  })
})
