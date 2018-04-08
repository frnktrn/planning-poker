const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const WP_PORT = process.env.WP_PORT;
const WS_PORT = process.env.WS_PORT;

module.exports = {
  entry: {
    app: './lib/index.js'
  },
  devtool: 'cheap-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase:        '/_build/dist',
    publicPath:         `http://localhost:${WP_PORT}/`,
    hot:                true,
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: '/_build'
    }),
    new HtmlWebpackPlugin({
      title:    'Planning-Poker',
      template: './static/index.html'
    }),
    new webpack.DefinePlugin({
      WS_PORT: WS_PORT,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader', options: { ignore: '/node_modules/' } },
        ]
      },
      {
        test: /\.module\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true } },
        ]
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://localhost:${WP_PORT}/`,
  }
};
