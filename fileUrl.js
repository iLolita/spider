var lineReader = require('line-reader');
var db = require('./db.js');
var async = require('async');

exports.read = function(callback){
var i = 0;
async.whilst(
	function(){return i!=0;},
	function(callback){
	async.waterfall([
			function(callback){db.GetData_All(('where utag = 0 or utag = 1'),function(count){
						console.log(count);	
				callback(null,count);
				})},
			function(count,callback){
			if(count == 0){
			lineReader.eachLine('url.txt',function(line,last){
				db.Insert(line,1);
				//	 	console.log('line'+line);
				})
			}
			callback(null,count);
			},
			function(count,callback){db.GetData_All(('where utype = 1 and utag = 0'),function(num){
				callback(null,num);
				})},
			function(num,callback){
				console.log(num);
				if(num == 0)
					i = 0;
					//db.Close();
				else{
				db.GetData(('where utype = 1 and utag = 0'),function(url){
					callback(null,url);
				})
			}}
			
	],function(err,results){
		//	console.log(results);
		callback(results);}
	)
	setTimeout(callback,200);
	},
	function(err,results){
		if(err)
			console('Error: '+err);
		callback(results);
	}
);
}
