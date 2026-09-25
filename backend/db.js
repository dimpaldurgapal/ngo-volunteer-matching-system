const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",   // ✅ EMPTY (यह final है)
  database: "ngo_platform",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

module.exports = db;