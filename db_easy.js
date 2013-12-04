var Client = require('easymysql');

var mysql = Client.create(
{
 'maxconnections':10
});

mysql.addserver({
 'host':'127.0.0.1',
 'user':'myn',
 'password':'myn123'
});

mysql.addserver({
 'host':'127.0.0.1',
 'user':'myn',
 'password':'myn123'
});

mysql.on('busy',function(queuesize,maxconnections,which){
 console.log('error busy');
});

mysql.query({
 sql:'select';});

