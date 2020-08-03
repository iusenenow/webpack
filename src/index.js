
// development: webpack ./src/index.js -o ./build/build.js --mode=development
// production: webpack ./src/index.js -o ./build/build.js --mode=production

import data from './data.json'
import './style.css'
import './style.less'

if (module.hot) {
  module.hot.accept()
}

const { age, name } = data

console.log(`His name is ${name}, he's ${age} years old.`)

console.log(data)

const add = (x, y) => x + y;

console.log(add(1, 2))
console.log(add(3, 4))