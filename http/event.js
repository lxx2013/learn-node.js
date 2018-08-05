var EventEmitter = require('events').EventEmitter
var life = new EventEmitter()

life.on('click',(a,b)=>console.error('click '+a+b))

life.emit('click','this ','button')