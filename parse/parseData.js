var http = require('http');
var zlib = require('zlib');
var iconv = require('iconv-lite');
var async = require('async');
var db = require('./mysql');
var lineReader = require('line-reader');


var urls = ["http://esf.sz.soufun.com/chushou/3_34363098.htm","http://esf.sz.soufun.com/chushou/3_36893129.htm"];

var getUrl = function(callback){
	lineReader.eachLine('url.txt',function(line,last){
	 	console.log('url'+line);
		callback(null,line);
	});
}

var getData = function(line,callback){
	var data = null;
//	var url = results.GetUrl;
	var url = line;
	console.log(url);
	http.get(url,function(res,data){
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
				//console.log("data1: "+data);
				callback(null,data);
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
					//console.log('data2: '+data);
					callback(null,data);
					});
			}
	}).on('error',function(e){
		console.log('Got error: '+e.message);
		});

}

var fetch = function(data,callback) {
	//var data = results.Get;
	//console.log(data);
	var cheerio = require('cheerio');
	$ = cheerio.load(data);
	var title = $('h1').text();
	var price = $('.info .red20b').text();
	var phone = $('#mobilecode').text();
	var description = $("div.house_detail div.describe.mt10 div[onselectstart='return false;']").text();	
	$("div.house_detail div.describe.mt10 img").each(function(i,e){
	//	console.log($(e).attr("src"));
	})
	var values = [title,phone,price,description];
	console.log(values); 
//	console.log($("div.house_detail div.describe.mt10 img").attr("src"));
	callback(null,values);
}

var insertDB = function(values,callback){
	//var values = results.Fetch;
//	console.log(values);
	db.insertInfo(values);
	callback(null,values);
}

var closeDB = function(values,callback){
	db.close();
}

/*async.auto({
	GetUrl:getUrl,	
	Get:['GetUrl',getData],
	Fetch:['Get',fetch],
	InsertDB:['Fetch',insertDB]
},function(err){
	if(err)
		console.log(err);
})*/
async.waterfall([
	getUrl,getData,fetch,insertDB],function(err){
});






