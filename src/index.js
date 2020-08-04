
// development: webpack ./src/index.js -o ./build/build.js --mode=development
// production: webpack ./src/index.js -o ./build/build.js --mode=production

import data from './data.json'
import './style.css'
import './style.less'
// import '@babel/polyfill'

if (module.hot) {
  module.hot.accept()
}

const { age, name } = data

console.log(`His name is ${name}, he's ${age} years old.`)

console.log(data)

const add = (x, y) => x + y;

// 下一行eslint所有规则都失效（下一行不进行eslint检查）
// eslint-disable-next-line

console.log(add(1, 2))
console.log(add(3, 4))

const promise = new Promise(resolve => {
  setTimeout(() => {
    console.log('定时器执行完毕。')
    resolve()
  }, 1000)
})

console.log(promise)