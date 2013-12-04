var http = require('http');
var option = {host:'220.165.13.141',port:80,path:'http://esf.soufun.com/house/'};
http.request(option,function(res){
console.log(option);
console.log(res.statusCode);
}).on('error',function(e){
console.log('Get error: '+e.message);
}).end();
