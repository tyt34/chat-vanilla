const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: { main: './src/pages/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '',
    environment: { 
      module: true,
      dynamicImport: true, 
    }
  },
  mode: 'development',
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'app'),
      },
      compress: true,
      port: 8080,
      open: true
    },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash][ext]',
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash][ext]',
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        filename: 'index.html',
        template: './src/index.html',
        minify: false, 
      }
    ),
    new HtmlWebpackPlugin(
      {
        filename: 'main.html',
        template: './src/main.html',
        minify: false, 
      }
    ),
    new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin() 
  ] 
};
