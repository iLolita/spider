var http = require('http');
var zlib = require('zlib');
var line = 'http://esf.sz.soufun.com/chushou/3_35392592.htm';
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var async = require('async');

async.waterfall([
function(callback){
http.get('http://esf.sz.soufun.com/chushou/3_35392592.htm',function(res,data){
    var chunks = [];
    var size = 0;
    var gunzip = zlib.createGunzip();
if(res.headers['content-encoding']=='gzip')
{
    gunzip.on('data',function(chunk){
        size += chunk.length;
        chunks.push(chunk);
    });
    gunzip.on('end',function(){
        data = Buffer.concat(chunks,size);
        data = iconv.decode(data,'GBK');
       // console.log("data1: "+data);
	callback(null,data);
    });
    res.pipe(gunzip);
 } else{
    res.on('data',function(chunk){
        size += chunk.length;
        chunks.push(chunk);
    });
    res.on('end',function(){
        data = Buffer.concat(chunks,size);
        data = iconv.decode(data,'GBK');
        //console.log('data2: '+data);
	callback(null,data);
        });
    }
}).on('error',function(e){
        console.log('Got error: '+e.message);
   });
},
function(data,callback){
 //console.log(data);
 var $ = cheerio.load(data);
 var info = $('.phone_top').text();
 console.log(info) ;
}
])









