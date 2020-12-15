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
  function resolve (data) {
    console.log(this); // 这里的this指向window，提前保存实例对象的this
    // 设置promise状态只能修改一次
    if (_this.PromiseState !== 'pending') return
    // 进入resolve两大步骤
    //1、将PromiseState状态从pending改为fulfilled
    _this.PromiseState = 'fulfilled'
    // 2、将参数返回给promiseResult
    _this.PromiseResult = data
    // 3、状态改变之后执行回调
    _this.callback.forEach(item => {
      item.onfulfilled(data)
    })
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
    _this.callback.forEach(item => {
      item.onrejected(data)
    })
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
  // 调用回调函数
  // 状态为成功则是调用第一个回调函数
  if (this.PromiseState === 'fulfilled') {
    onfulfilled(this.PromiseResult)
  }
  // 状态为失败则是调用第二个回调函数
  if (this.PromiseState === 'rejected') {
    onrejected(this.PromiseResult)
  } 
  // 状态为未改变的时候保存回调函数[这里有可能有多个回调]
  // 所以运用遍历的方式进行读取
  if (this.PromiseState === 'pending') {
    this.callback.push({
      onfulfilled,
      onrejected
    })
  }
} 
// Promise.prototype.catch = function (error) {
  
// }