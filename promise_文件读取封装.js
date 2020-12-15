const fs = require('fs')

function fileUpload(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err,data) => {
      if(err) reject(err)
      resolve(data.toString())
    }) 
  })
}
// fileUpload('./resource/content.txt').then(value => {
//   console.log(value);
// },reason => {
//   console.log(reason)
// })