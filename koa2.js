const Koa = require('koa')
const app = new Koa()
const fs = require('fs')
const Router = require('koa-router')
const serve = require('koa-static')

var router = new Router()
router.get('/', ctx => {
    console.log(ctx.request)
    console.log(`path${ctx.request.path}`)
    if (ctx.request.accepts('html')) {
        ctx.response.type = 'text/html'
        var t = fs.readFileSync('./images/touma2.jpg')
        ctx.response.body = "<img src = '/images/touma2.jpg'>"
    }
})
router.get('/wechat-hear', (ctx) => {
  const token = "imooctest"
  console.log(ctx.query)
  const {
    signature,
    nonce,
    timestamp,
    echostr
  } = ctx.query
  const str = [token, timestamp, nonce].sort().join('')
  const sha = str//sha1(str)
  console.log(sha)
  if (sha === signature) {
    ctx.body = echostr
  } else {
    ctx.body = 'Failed'
  }
})
app.use(router.routes())
app.use(router.allowedMethods())
app.use(serve(__dirname))
app.listen(3000)