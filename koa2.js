const Koa = require('koa')
const app = new Koa()
const fs = require('fs')
const Router = require('koa-router')
const serve = require('koa-static')
const sha1 = require('sha1')

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
  console.log('begin sha1')
  const sha = sha1(str)
  console.log('sha: '+sha)
  if (sha === signature) {
    ctx.body = echostr
  } else {
    ctx.body = 'Failed'
  }
})
router.get('/api/food',(ctx)=>{
  ctx.body = {food1:'food1',food2:'food2'}
})
app.use(async function (ctx,next) {
  ctx.res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")
  await next()
})
app.use(router.routes())
app.use(router.allowedMethods())
app.use(serve(__dirname))
app.listen(3000)