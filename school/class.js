var student = require('./student.js')
var teacher = require("./teacher.js")

function add(t,s){
  teacher.add(t);
  s.forEach((item,index)=>{student.add(item)});
}


//exports.add = add;
module.exports = { add }