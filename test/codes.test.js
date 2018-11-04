import {
  table
} from '../src/codes'

describe('問46～50: 論理と符号', () => {
  test('問46: 真理値表を作成する', () => {
    expect(table((a, b) => a && (a || b))).toEqual([
      [[true, true], true],
      [[true, false], true],
      [[false, true], false],
      [[false, false], false]
    ])
  })
})