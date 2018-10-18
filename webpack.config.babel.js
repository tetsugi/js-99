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