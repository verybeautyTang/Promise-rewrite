

// 利用 util.promisify将回调函数风格的方法转变成promise风格的函数
const util = require('util')
const fs = require('fs')
let fileUpload = util.promisify(fs.readFile);
fileUpload('./resource/content.txt').then(value => {
  console.log(value.toString())
})