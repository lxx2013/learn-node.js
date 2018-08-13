var koa = require('koa')
var app = new koa()

var asyncIO = function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve()
        },500)
    })
}
var mid = ()=>{
    return function *(next){
        this.body = 'mark' //1
        yield next          //2
        this.body+= ' done'
    }
}
app.use(mid)
app.use(function* (next) {
    yield asyncIO() //3
    this.body += ' saved' //4
    yield next
})
app.listen(3000)