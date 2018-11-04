import {
  isPrime
} from '../src/arithmetic'

describe('問31～41: 算術', () => {
  test('問31: 引数が素数かどうかを返す', () => {
    expect(isPrime(7)).toBe(true)
  })
})