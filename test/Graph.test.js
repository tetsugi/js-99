import Graph from '../src/Graph'

describe('', () => {
  /*
  test('', () => {
    let graph = new Graph(['b', 'c', 'd', 'f', 'g', 'h', 'k'], [['b', 'c', 1], ['b', 'f', 2], ['c', 'f', 5], ['f', 'k', 3], ['g', 'h']])
    console.log(graph)
    graph = new Graph([['b', 'c', 1], ['b', 'f', 2], ['c', 'f', 5], ['f', 'k', 3], ['g', 'h'], 'd'])
    console.log(graph)
  })
  */
  test('', () => {
    let graph = new Graph([[1, 2], [2, 3], [1, 3], [3, 4], [4, 2], [5, 6]])
    console.log(graph.paths(1, 4))
    console.log(graph.cycle(2))
  })
})
