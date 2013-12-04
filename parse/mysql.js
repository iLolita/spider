var mysql = require("mysql");
var async = require("async");

var conn = mysql.createConnection({
	host:"localhost",
	user:"myn",
	password:"myn123",
	database:"nodejs",
	port:53306,
}); 

exports.getData = function(){
	conn.query('select * from url',function(err,rows){
		for(var i in rows)
			console.log(rows[i]);
	})
};


exports.insertInfo = function(values){
//var values = ["凯瑞","16328739478","123","精装修"];
	conn.query('insert into houseInfo set title=?,phone=?,price=?,description=?',values,function(err,rows){
		if(err)
		{
			if(err.code === 'PROTOCOL_CONNECTION_LOST')
				//connect();
			console.log(err);
			connnect();
		}
		else
			console.log("Insert 1");
		conn.end();
	})
};

exports.close = function(){
	conn.end();
}

