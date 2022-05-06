const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const options = {
    cache: true,        
}
const config = {
  resolve: {
    modules: [path.resolve('./src'), path.resolve('./node_modules')],
  },
  entry: {
    main: ['./src/renderers/dom.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.(ts|tsx|css)$/, exclude: [/node_modules/,/public/], use: ['ts-loader']}
    ]
  },
  plugins: [new ESLintPlugin(options)],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts', '.css']
  }
};
module.exports = config