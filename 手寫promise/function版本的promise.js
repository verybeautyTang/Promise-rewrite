// 声明构造函数
function Promise(props) {
  // PromiseState、promiseResult都是实例对象的数据
  // 声明实例对象属性
  this.PromiseState = 'pending'
  this.PromiseResult = null
  // 声明一个回调
  this.callback = []
  let _this = this
  // 声明resolve 函数并传递参数
  function resolve(data) {
    // 这里的this指向window，提前保存实例对象的this
    // 设置promise状态只能修改一次
    if (_this.PromiseState !== 'pending') return
    // 进入resolve两大步骤
    //1、将PromiseState状态从pending改为fulfilled
    _this.PromiseState = 'fulfilled'
    // 2、将参数返回给promiseResult
    _this.PromiseResult = data
    // 3、状态改变之后执行回调
    setTimeout(() => {
      _this.callback.forEach(item => {
        item.onfulfilled(data)
      })
    });
  }
  // 声明reject函数并传递参数
  function reject(data) {
    // 设置promise状态只能修改一次
    if (_this.PromiseState !== 'pending') return
    // 进入reject两大步骤
    //1、将PromiseState状态从pending改为rejected
    _this.PromiseState = 'rejected'
    // 2、将参数返回给promiseResult
    _this.PromiseResult = data
    // 3、状态改变之后执行回调
    setTimeout(() => {
      _this.callback.forEach(item => {
        item.onrejected(data)
      })
    });
  }
  // 利用try-catch处理throw抛出的异常[返回失败的promise实例]
  try {
    // 同步调用
    props(resolve, reject)
  }
  catch (e) {
    reject(e)
  }
  // 这里的reject、resolve与html中的参数并没有必然的对应关系
}
// 声明then方法【他的this指向实例对象】,
// then方法执行是在状态改变之后才去执行的
Promise.prototype.then = function (onfulfilled, onrejected) {
  const _this = this

  if (typeof onrejected !== 'function') {
      onrejected = reason => {
        throw reason
      }
  }
  if (typeof onfulfilled !== 'function') {
      onrejected = value => value
  }
  // then方法返回结果
  return new Promise((resolve, reject) => {
    // 代码封装
    function callback(item) {
      try {
        let result = item(_this.PromiseResult)
        if (result instanceof Promise) {
          result.then(v => {
            resolve(v)
          }, r => {
            reject(r)
          })
        } else {
          resolve(result)
        }
      } catch (e) {
        reject(e)
      }
    }
    // 调用回调函数
    // 状态为成功则是调用第一个回调函数
    if (this.PromiseState === 'fulfilled') {
      setTimeout(() => {
        callback(onfulfilled)
      });
    }
    // 状态为失败则是调用第二个回调函数
    if (this.PromiseState === 'rejected') {
      setTimeout(() => {
        callback(onrejected)
      });
    }
    // 状态为未改变的时候保存回调函数[这里有可能有多个回调]
    // 所以运用遍历的方式进行读取
    if (this.PromiseState === 'pending') {
      this.callback.push({
        onfulfilled: function() {
          callback(onfulfilled)
        },
        onrejected:function () {
          callback(onrejected)
        }
      })
    }
  })
}

// catch方法
Promise.prototype.catch = function (onrejected) {
  return this.then(undefined, onrejected)
  
}
// resolve
// 1、如果輸入為非promise類型，那麽就返回resolve的返回
// 2、如果輸入為promise類型，那麽就返回promise類型返回的數據
Promise.resolve = function (value) {
  return new Promise((resolve,reject) => {
    if (value instanceof Promise) {
      value.then(v => {
        resolve(v)
      }, r => {
        reject(r)
      })
    } else {
      resolve(value)
    }
  })
}
// reject事件 無論輸入什麽返回的都是reject
Promise.reject = function (reason) {
  return new Promise ((resolve, reject) => {
    reject(reason)
  })
}
// all
// 只有狀態全部為fulfilled才能執行resolve函數
// 不然就是reject函數
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0
    let arr = []
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(v => {
        count++
        arr[i] = v
        if (count == promises.length) {
          resolve(arr)
        }
      }, r => {
        reject(r)
      })
    }
  })
}
// race
// 誰的狀態先改變誰就可以控制改變哦
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(v => {
        resolve(v)
      },r => {
        reject(r)
      })
      
    }
  })
}