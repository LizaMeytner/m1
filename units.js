const sqlite3 = require('sqlite3');

class Database {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        img TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)
    })
  }

  add(unitInfo) {
    const { name, img } = unitInfo;
    const sql = `INSERT INTO files (name, img) VALUES (?, ?)`;

    this.db.run(sql, [name, img], (err) => {
      if (err) {
        console.log('Error: ', err.message);
      }
      else {
        console.log('Unit inserted');
      }
    });
  }

  getAll() {
    const sql = `SELECT * FROM files`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.log('Error: ', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getOne(id) {
    const sql = `SELECT * FROM files WHERE id = ?`;

    return new Promise((resolve, reject) => {
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          console.log('Error: ', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  update(id, unitInfo) {
    const { name, img } = unitInfo;
    const sql = `UPDATE files SET name = ?, img = ? WHERE id = ?`;

    this.db.run(sql, [name, img, id], (err) => {
      if (err) {
        console.log('Error: ', err.message);
      }
      else {
        console.log(`User updated`);
      }
    });
  }

  delete(id) {
    const sql = `DELETE FROM files WHERE id = ?`;

    this.db.run(sql, [id], function (err) {
      if (err) {
        console.log('Error: ', err.message);
      }
      else {
        console.log(`User deleted`);
      }
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.log('Error: ', err.message);
      }
      else {
        console.log(`Db closed`);
      }
    });
  }
}

module.exports = Database;