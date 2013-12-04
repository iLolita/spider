var async = require('async');
var db = require('./mysql');
var lineReader = require('line-reader');


var urls = ["http://esf.sz.soufun.com/chushou/3_34363098.htm","http://esf.sz.soufun.com/chushou/3_36893129.htm"];

var getUrl = function(callback,results){
        lineReader.eachLine('url.txt',function(line,last){
                console.log('url'+line);
                callback(null,line);
        });
}

var out = function(callback,results){
	console.log(results.getUrl[0]);
}

async.auto({
	getUrl:getUrl,
	out:['getUrl',out]},function(err,results){
});
