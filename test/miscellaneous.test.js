import {
  queens, knightsTour, fullWords, vonKoch, puzzle, regular, crossword, identifier
} from '../src/miscellaneous'

import fs from 'fs'
import {isEqual} from 'lodash'

describe('', () => {
  test('', () => {
    //console.log([...queens(8)][0])
    //console.log(knightsTour().next().value)
    //console.log(fullWords(175))
    //console.log([...vonKoch([[4,1],[1,2],[1,7],[2,3],[2,5],[5,6]])])
    //console.log(vonKoch([[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [5, 7], [5, 8], [8, 9], [5, 10], [10, 11], [11, 12], [11, 13], [13, 14]]).next())
    console.log([...regular(7, 4)])
    
    //console.log(crossword("ALPHA\nARES\nPOPPY\n\n  .  \n  .  \n.....\n  . .\n  . .\n    .\n"))
    //console.log(crossword(fs.readFileSync('./test/crossword/no_solution.dat', 'utf8')))
    //console.log(crossword(fs.readFileSync('./test/crossword/0.dat', 'utf8')))
    //console.log(crossword(fs.readFileSync('./test/crossword/1.dat', 'utf8')))
    //console.log(crossword(fs.readFileSync('./test/crossword/2.dat', 'utf8')))
    //console.log(crossword(fs.readFileSync('./test/crossword/3.dat', 'utf8')))
  })

  test('算数パズル', () => {
    expect([...puzzle([2, 3, 5, 7, 11])]).toEqual([ 
      '2 = 3 - (5 + 7 - 11)',
      '2 = 3 - 5 - (7 - 11)',
      '2 = 3 - (5 + 7) + 11',
      '2 = 3 - 5 - 7 + 11',
      '2 = (3 * 5 + 7) / 11',
      '2 * (3 - 5) = 7 - 11',
      '2 - (3 - (5 + 7)) = 11',
      '2 - (3 - 5 - 7) = 11',
      '2 - (3 - 5) + 7 = 11',
      '2 - 3 + 5 + 7 = 11' 
    ])
  })
})