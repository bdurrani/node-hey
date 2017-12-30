const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

class DatabaseOrm {
    constructor(path) {
        this._path = path;
        this._sequelize = new Sequelize('data.db', '', '', {
            dialect: 'sqlite',
            // SQLite only
            storage: this._path
        });

    }

}

class Database {
    constructor() {
        this._sequelize = new Sequelize('database', '', null, {
            dialect: 'sqlite',
            // default ':memory:'
            storage: path.join(__dirname, 'data.db'),
            operatorsAliases: false
        });

        const delimiter = ";";
        this._Interruption = this._sequelize.define('interruption', {
            who: {
                type: Sequelize.STRING,
                allowNull: false,
                set(val) {
                    const combined = val.join(delimiter).toLowerCase();
                    this.setDataValue('who', combined);
                },
                get() {
                    const rawTag = this.getDataValue('who');
                    return rawTag.split(delimiter);
                },
            },
            when: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            tags: {
                type: Sequelize.STRING,
                get() {
                    const rawTag = this.getDataValue('tags');
                    return rawTag.split(delimiter);
                },
                set(val) {
                    const combined = val.join(delimiter).toLowerCase();
                    this.setDataValue('tags', combined);
                }
            },
            comment: {
                type: Sequelize.STRING
            }
        });
        this._Interruption.sync();
    }

    addInterruption(name, tags) {
        let useObj = { who: name };
        if (tags) {
            useObj = Object.assign(useObj, { tags: tags })
        }

        let interruption = this._Interruption.create(useObj);
        interruption.save();
    }

    addComments(eventId, comment) {

    }

    addTag(eventId, tags) {

    }

    retag(eventId, tags) {

    }

    listInterruptions {

    }

    close() {
        this._sequelize.close();
    }
}

module.exports = Database;
