var Client = require('easymysql');

var mysql = Client.create({
  'maxconnections' : 10
});

mysql.addserver({
  'host' : '127.0.0.1',
  'user' : 'myn',
  'password' : 'myn123',
  'database' : 'nodejs',
  'port' : 53306
});
mysql.query({
  sql: 'select phone from houseInfo',
  //params: {user: 'xxoo'}
}, function (err, rows) {
  console.log(rows);
});
