/* 
  开发环境配置：能让代码运行
    运行项目指令：
      1. webpack 会将打包结果输出
      2. npx webpack-dev-server 只会在内存中编译打包，没有输出
*/


const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/build.js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // loader配置
      {
        // 处理css
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        // 处理less
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        // 处理样式图片资源
        test: /\.(png|jpg|gif)$/i,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          esModule: false,//关闭es6
          name: '[hash:10].[ext]',
          outputPath: 'imgs'
        }
      },
      {
        // 处理html中的img资源
        test: /\.html$/,
        loader: 'html-loader'
      },
      // {
      // 处理其他资源
      //   exclude: /\.(css|js|html|json|less|jpg|png|gif)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[hash10].[ext]',
      //     outputPath: 'medias'
      //   }
      // }
    ]
  },
  plugins: [
    // plugins配置
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  // 模式
  mode: 'development',
  // mode: 'production'
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true,
    hot: true
  }
}