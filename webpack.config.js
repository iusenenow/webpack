/* 
  开发环境配置：能让代码运行
    运行项目指令：
      1. webpack 会将打包结果输出
      2. npx webpack-dev-server 只会在内存中编译打包，没有输出
*/

/*
  HMR: hot module replacement 热模块替换 / 模块热替换。
  作用：一个模块发生变化，只重新打包这一个模块，而不是打包所有（模块），极大提高构建速度。

  样式文件：可以使用HMR功能：通过style-loader内部实现。
  js文件：默认不适用HMR功能。--> 需要修改js代码，添加支持HMR功能的代码。
    注意：HMR功能对js的处理，只能处理非入口js文件的其他文件。
  html文件：默认不能使用HMR功能，同事会导致问题：html文件不能热更新了。
    解决：entry改为array，把js文件和html文件同时引入：['./src/js/index.js', './src/index.html']
*/


const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置nodejs环境变量，决定使用browserslist的哪个环境
// process.env.NODE_ENV = development

/* 
  正常来讲，一个文件只能被一个loader处理，当一个文件要被多个load而处理时，一定要指定loader执行的先后顺序：先执行eslint，再执行babel
*/


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/built.js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // js语法检查: eslint
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
        enforce: 'pre', // 优先执行
        // 自动修复
        option: { fix: true }
      },
      // oneOf: 以下loader只会匹配一个，注意不能有两个配置处理同一个文件
      {
        oneOf: [
          // loader配置：
          /*
            js兼容性处理：babel-loader @babel/core @babel/preset-env
            1. 基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如Promise等；
            2. 全部js兼容性处理 --> @babel/polyfill: import '@babel/polyfill'
            问题：引入全部兼容性代码，体积太大；
            3. 需要做兼容性处理：按需加载 --> core-js；
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

          // js压缩：将mode调成production模式，文件将自动压缩

          // 处理css
          {
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

          // 处理less
          {
            test: /\.less$/i,
            use: [
              // 创建style标签，将样式放入'style-loader',
              // 取代style-loader。作用：提取js中的css成单独文件
              MiniCssExtractPlugin.loader,
              // 将css文件整合到js文件中
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    // postcss插件
                    require('postcss-preset-env')()
                  ]
                }
              },
              'less-loader'
            ]
          },

          // 处理样式图片资源
          {
            test: /\.(png|jpg|gif)$/i,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              esModule: false,//关闭es6
              name: '[hash:10].[ext]',
              outputPath: 'imgs'
            }
          },

          // 处理html中的img资源
          {
            test: /\.html$/,
            loader: 'html-loader'
          },

          // 处理其他资源
          {
            exclude: /\.(css|js|html|json|less|jpg|png|gif)$/,
            loader: 'file-loader',
            options: {
              name: '[hash10].[ext]',
              outputPath: 'medias'
            }
          }
        ]
      }
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
    hot: true // 开启HMR功能。当修改了webpack配置，新配置想要生效，必须重启webpack。
  },

  /*
    source-map: 一种提供源代码到构建后代码映射技术（如果构建后代码出错了，通过映射可以追踪源代码错误）:
      [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map:
      
      source-map: 外部
        错误代码准确信息 和 源代码的错误位置
      inline-source-map: 内联
        只生成一个内联source-map
        错误代码准确信息 和 源代码的错误位置
      hidden-source-map：外部
        错误代码错误原因，但是没有错误位置，不能追踪源代码错误，只能提示到构建后代码的错误位置
      eval-source-map：内联
        每个文件都生成对应的source-map，都在eval
        错误代码准确信息 和 源代码的错误位置
      nosources-source-map：外部
        错误代码准确信息，但是没有任何源代码信息
      cheap-source-map：外部
        错误代码准确信息 和 源代码的错误位置
        只能精确到行，不能精确到列
      cheap-module-source-map：外部
        module会将loader的source map加入

      内联和外部的区别：1. 外部生成了文件，内联没有；2.内联构建速度更快。

      开发环境：速度快，调试更友好
        速度（eval > inline > cheap > ...)
          eval-cheap-sourse-map
          eval-sourse-map
        调试更友好
          source-map
          cheap-module-source-map
          cheap-source-map

      --> eval-source-map(react & vue默认) / eval-cheap-module-source-map

      生产环境：源代码要不要隐藏？调试要不要更友好:
        内联会让代码体积变大，所以生产环境不用内联
        nosources-source-map（全部隐藏）
        hidden-source-map（只隐藏源代码，不隐藏构建代码）

        --> source-map / cheap-module-source-map
  */
  devtool: 'eval-source-map' // 开发模式
  // devtool: 'source-map' 生产模式
}