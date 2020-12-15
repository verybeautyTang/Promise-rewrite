const fs = require('fs')
//  回调函数读取文件
// fs.readFile('./resource/content.txt',(err, data) => {
//   if (err) throw err
//   else {
//     console.log(data.toString())
//   }
// })

// promise读取文件
const p = new Promise((resolve,reject) => {
  fs.readFile('./resource/content.txt',(err,data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data.toString())
    }
  })
})
p.then((value) => {
  console.log(value)
},(reason)=> {
  console.log(reason)
})