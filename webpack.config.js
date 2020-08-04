/* 
  开发环境配置：能让代码运行
    运行项目指令：
      1. webpack 会将打包结果输出
      2. npx webpack-dev-server 只会在内存中编译打包，没有输出
*/


const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置nodejs环境变量
// process.env.NODE_ENV = development

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/built.js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // loader配置
      /*
        js兼容性处理：babel-loader @babel/core @babel/preset-env
        1. 基本js兼容性处理 --> @babel/preset-env
        问题：只能转换基本语法，如Promise等
        2. 全部js兼容性处理 --> @babel/polyfill: import '@babel/polyfill'
        问题：引入全部兼容性代码，体积太大
        3. 需要做兼容性处理：按需加载 --> core-js
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        option: {
          // 预设：指示babel做什么样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: { version: 3 },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      },
      {
        /*
          语法检查：eslint-loader  eslint
          注意：只检查自己写的代码，第三方的库是不检查的。
          设置检查规则：在package.json中eslintConfig中设置: "eslintConfig": 
            {"extends": "airbnb-base"}
          推荐airbnb风格：
          1. eslint-config-airbnb-base
          2. eslint-plugin-import
          3. eslint
        */
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        option: {
          fix: true
        }
      },
      {
        // 处理css
        test: /\.css$/i,
        use: [
          // 'style-loader',
          // 取代style-loader。作用：提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          'css-loader',
          // css兼容性处理：postcss --> postcss-loader postcss-preset-env
          // 帮postcss找到package.json中browserslist里的配置，通过配置加载指定css兼容性形式
          // "browserslist": {
          // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
          //   "development": [
          //     "last 1 chrome version",
          //     "last 1 firefox version",
          //     "last 1 safari version"
          //   ],
          // 生产环境：默认是看生产环境
          //   "production": [
          //     ">0.2%",
          //     "not dead",
          //     "not op_mini all"
          //   ]
          // }
          // 使用loader的默认配置
          // 'postcss-loader
          // 修改loader的配置
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss插件
                require('postcss-preset-env')()
              ]
            }
          }

        ]
      },
      {
        // 处理less
        test: /\.less$/i,
        use: [
          // 创建style标签，将样式放入
          'style-loader',
          // 将css文件整合到js文件中
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
      template: './src/index.html',
      // HTML压缩：
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    // 提取css文件成单独文件
    new MiniCssExtractPlugin({
      filename: 'css/built.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin()
  ],
  // 模式
  mode: 'development',
  // production mode自动压缩js代码
  // mode: 'production'
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true,
    hot: true
  }
}