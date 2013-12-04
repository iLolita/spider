var http = require('http');
var data = 0;
var tag = true;
var async = require('async');
var fileUrl = require('./fileUrl');
var iconv = require('iconv-lite');
 var zlib = require('zlib');

var GetProxy = function(callback,results){
	if(tag == false){
		return;
	}
	tag = false;
	var size = 0;
	var chunks = [];
	http.get("http://219.223.215.185:31288/alloc_proxy",function(res){
		res.on('data',function(chunk){
			size += chunk.length;
			chunks.push(chunk);
			});
		res.on('end',function(){
			data = Buffer.concat(chunks,size);
			data = data.toString();
			var host = port =0;
			var index = data.indexOf(':');
			host = data.substring(0,index);
			port = data.substring(index+1,data.length);
			port = parseInt(port);
			tag = true;
			//console.log('host: '+host+"  port: "+port);
			callback(null,host,port);
			});
		}).on('error',function(e){
			console.log('Got error: '+e.message);
			})
		  }

var GetPath = function(callback,results){
		fileUrl.read(function (line)
				{
				//console.log(line);
				callback(null,line);
				})
	}

var UsePath = function (callback,results){
		  var option = {host:results.getProxy[0],port:results.getProxy[1],path:results.getPath};
		  console.log(option);
		  //console.log(results);
		  request_timer = setTimeout(function(){
				  req.abort();
				 // console.log('Request out');
				  callback(new Error('Request timeout'));
				  return;
				  },3000);

		  req = http.request(option,function(res){
				  clearTimeout(request_timer);
				  console.log(res.statusCode);
				  var statu = res.statusCode;
				  callback(null,statu,option);
				  }).on('error',function(e){
					  if(request_timer){
					  clearTimeout(request_timer);
					 // callback(e);
					  return ;
					  }
					  console.log('Get error: '+e.message);
					  callback(e);
					  });
		  req.end();
	  }
var ReturnProxy = function(callback,results){
	var option = {host:results.usePath[1].host,port:results.usePath[1].port,path:results.usePath[1].path};
	var statu = results.usePath[0];
	var line = results.usePath[1].path;
	if(statu == 200){
		console.log(option);
		http.request(option,function(res,data){
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
			}).end();

	}
	callback(statu,option);
};

var i = 0;
async.whilst(
	function(){ console.log('new'); return i!=200;},
	function(callback){
	async.auto({
		getProxy: GetProxy,
		getPath: GetPath,
		usePath: ['getProxy','getPath',UsePath],
		returnProxy: ['usePath',ReturnProxy]
		},function(err){
	//	console.log('ErrorAuto :'+err);
		if(err == 200)
	                i = 200;
        	else{
			callback(err);
		}
	})
	setTimeout(callback,2000);
	},
	function(err){
	if(err)
		console.log('AsyncWhilst_Error :'+err);
	}
);
