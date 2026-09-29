const path = require('path')

module.exports = [
  {
    mode: 'production',
    entry: './dist/card/heatger-card.js',
    output: {
      filename: 'heatger-card.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
]
