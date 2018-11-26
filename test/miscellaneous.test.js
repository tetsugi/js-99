import {
  queens, knightsTour, fullWords, vonKoch, puzzle
} from '../src/miscellaneous'

describe('', () => {
  test('', () => {
    //console.log([...queens(8)])
    //console.log(knightsTour().next())
    //console.log(fullWords(175))
    //console.log(vonKoch([[4,1],[1,2],[1,7],[2,3],[2,5],[5,6]]).next())
    //console.log(vonKoch([[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [5, 7], [5, 8], [8, 9], [5, 10], [10, 11], [11, 12], [11, 13], [13, 14]]).next())
    console.log([...puzzle([2, 3, 5, 7, 11])])
  })
})