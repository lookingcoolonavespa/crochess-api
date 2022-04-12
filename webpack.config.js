const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  devtool: 'eval-source-map',
  devServer: {
    static: './dist'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js|tsx|ts)$/,
        use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'main.js',
    library: 'croChess',
    libraryTarget: 'umd',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist')
  }
};
