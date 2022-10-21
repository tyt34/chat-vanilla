const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const { CleanWebpackPlugin } = require('clean-webpack-plugin') 
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: { 
    index: './src/pages/index/index.js', 
    main: './src/pages/main/main.js' 
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    assetModuleFilename: 'src/images/[name].[ext]',
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
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'images/[name][ext]'
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
        chunks: ['index'],
      }
    ),
    new HtmlWebpackPlugin(
      {
        filename: 'main.html',
        template: './src/main.html',
        minify: false, 
        chunks: ['main']
      }
    ),
    new FaviconsWebpackPlugin('./src/images/favicon.png'),
    new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin() 
  ] 
}