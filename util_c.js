var http = require('http');
var fileUrl = require('./fileUrl');
var url0 = 'http://esf.sz.soufun.com/';
var iconv = require('iconv-lite');
var zlib = require('zlib');
var lineReader = require('line-reader');
var async = require('async');
var db = require('./db');


async.waterfall([
function(callback){
fileUrl.read(function (line)
{
 callback(null,line);
})
},
function(line,callback){
//console.log('url: '+line);
http.get(line,function(res,data){
    var chunks = [];
    var size = 0;
    var gunzip = zlib.createGunzip();
console.log(res.statusode);
if(res.headers['content-encoding']=='gzip')
{    	
    gunzip.on('data',function(chunk){
	size += chunk.length;
	chunks.push(chunk);
    });
    gunzip.on('end',function(){
    	data = Buffer.concat(chunks,size);
	data = iconv.decode(data,'GBK');
   	console.log("data1: "+data);
	callback(null,data,line);
    });
    res.pipe(gunzip);
}
else{
    res.on('data',function(chunk){
    	size += chunk.length;
	chunks.push(chunk);
    });
    res.on('end',function(){
    	data = Buffer.concat(chunks,size);
	data = iconv.decode(data,'GBK');
	console.log('data2: '+data);
	callback(null,data,line);
    });
}
}).on('error',function(e){
    console.log('Got error: '+e.message);
});
},
function(data,line,callback) {
 console.log(data);
 var cheerio = require('cheerio'),
 $ = cheerio.load(data);
 links = $('a');
 for(var i=0;i<links.length;i++){
        var url = links[i].attribs['href'];
	//console.log(url);
	var v1 = /^\/?(house|house1|house2|school)?-/;
	if(v1.test(url)){
	 url = line + url;
       // console.log(url);
 }
 callback(null,url);
 }
},
function(url,callback){
 //var v1 = /^\/?(house|house1|house2|school)?-/;
 var v2 = /esf\.(\w+\.)*soufun\.com\/(chushou|house|house1|house2|school)\/(\w|_)+\.(htm|html)/;
 var v3 =  /esf\.(\w+\.)*soufun\.com\/(chushou|house|house1|house2|school)+?(-)*/;
 var v4 = /^http\:\/\//;
 // console.log(url);
 //db.Conn(); 
 if(v2.test(url)){
	db.Insert(url,2); 
 }else if(v3.test(url)){
	db.Insert(url,1);
 }else if(v4.test(url)){
 	db.Insert(url,3);
 }
 //db.Close();
 callback(null);
}
],function(err){
if(err) 
 console.log('error: '+err);
 //console.log('finished!');
});
//db.Close();
