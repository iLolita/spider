var mysql = require('mysql');

var conn = mysql.createConnection({
 host:'localhost',
 user:'myn',
 password:'myn123',
 database:'nodejs',
 port:53306
});

exports.Conn = function(){
 conn.connect();	
};

exports.Insert = function(ucontent,utype)
{
 var values = [ucontent,utype];
 conn.query('insert into url set ucontent=?,utype=?',values,function(error,results){
	if(error){
	console.log('insert error: '+error.message);
	throw err;	
	}	
	console.log('Insert 1 row');	
});
}

exports.GetData = function(limit,callback)
{
 var selectSql = 'select * from url '+limit;
 conn.query(selectSql,function selectCb(err,rows,field){
 	if(err){
	 throw err;
	}
 	for(var i in rows){
 	// console.log(rows[i].ucontent);
  	callback(rows[i].ucontent);
 	}
 })
}


exports.GetData_All = function(condition,callback)
{
 var selectSql = 'select count(*) as count from url '+condition;
 conn.query(selectSql,function selectCb(err,rows,field){
        if(err){
         throw err;
        }
        for(var i in rows){
	 //console.log(rows[i].count);
         callback(rows[i].count);
	}
 })
}


exports.Update_tag = function(ucontent)
{
 var values = ucontent;
 conn.query('update url set utag=1 where ucontent = ?',values,function(error,results){
        if(error){
        console.log('update error: '+error.message);
        throw err;
        }
        console.log('update 1 row');
});
}



exports.Delete_ucon = function(ucontent)
{
 var values = ucontent;
 conn.query('delete from url where ucontent=?',values,function(error,results){
        if(error){
        console.log('delete error: '+error.message);
        throw err;
        }
        console.log('delete 1 row');
});
}


exports.Close = function(){
 conn.end();
}
