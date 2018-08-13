var express = require('express')
var app = express()

var mid = function(req, res,next){
    req.body = 'mark'
    next()
    res.send(req.body+' done')
}
app.use(mid)
app.use(function (req, res, next){
    req.body += 'saved'
    next()
})

app.listen(3000)