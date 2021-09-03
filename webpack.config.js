const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: '/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
    ],
  },
  // Allow await not only in functions but on top level
  experiments: {
    topLevelAwait: true,
  },
}
