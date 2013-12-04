var lineReader = require('line-reader');
var fileUrl = require('./fileUrl');
var db = require('./db');
fileUrl.read(function(url){
 console.log('fileread: '+url);
});
/*lineReader.eachLine('url.txt',function(line,last){
 db.Insert(line,1);
 console.log(line);
}
)*/


/*db.GetData_All(function(count){
console.log('count: '+count);
});*/
