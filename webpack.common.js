const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OutputDir = path.resolve(__dirname, 'wwwroot');
const IndexTemplate = path.resolve(__dirname, 'src/index.template.html');

module.exports = {  
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: OutputDir,  
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      }
    ]
  },
  plugins: [    
    new HtmlWebpackPlugin({
      template: IndexTemplate
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
};