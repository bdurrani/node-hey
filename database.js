const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
    constructor(db) {
        this._db = db;
    }

    static createHandle(dbPath) {
        return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    }

    static setupDb() {
        const subFolder = 'default';
        const defaultDbName = 'default.db';
        const resultDbName = 'data.db';
        const destinationDbName = path.join('.', resultDbName);
        if (!fs.existsSync('./' + resultDbName)) {
            const sourceDbName = path.join('.', subFolder, defaultDbName);
            Database._copyFile(sourceDbName, destinationDbName);
        }

        return Database.createHandle(destinationDbName);
    }

    addInterruption(name) {
        const currentTimeSeconds = Date.now();
        const insert = `INSERT INTO interruptions ( who, [when], tags ) VALUES (? ,?, ?)`;
        this._db.run(insert, [name, currentTimeSeconds, '']);
    }

    close() {
        this._db.close();
    }

    static _copyFile(src, dest) {
        fs.writeFileSync(dest, fs.readFileSync(src));
    }

    _getCurrentTime() {
        const currentTimeSeconds = Date.now();
        // const currentDate = new Date(currentTimeSeconds);
    }
}

module.exports = Database;

// CREATE TABLE interruptions (
//     id     INT      PRIMARY KEY
// NOT NULL,
//     who    STRING,
//     [when] DATETIME,
//     tags   STRING
// );
