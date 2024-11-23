module.exports = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "Szjszj0326",
  database: "test",
  connectionLimit: 5,
};

// const mysql = require('mysql2');
//
// // 创建数据库连接池
// const pool = mysql.createPool({
//   host: '127.0.0.1',        // 数据库主机
//   user: 'root',    // 数据库用户名
//   password: 'Szjszj0326',// 数据库密码
//   database: 'test',// 数据库名称
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
//
// // 导出带 Promise 的连接池
// module.exports = pool.promise();