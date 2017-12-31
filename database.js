const path = require('path');
const Sequelize = require('sequelize');

class Database {
    constructor(forTesting) {
        this._sequelize = new Sequelize('database', '', null, {
            dialect: 'sqlite',
            storage: forTesting ? ":memory:" : path.join(__dirname, 'data.db'),
            operatorsAliases: false
        });

        const delimiter = ";";
        this._Interruption = this._sequelize.define('interruption', {
            who: {
                type: Sequelize.STRING,
                allowNull: false,
                set(val) {
                    let result;
                    if (val) {
                        result = val.join(delimiter).toLowerCase();
                    } else {
                        result = null;
                    }

                    this.setDataValue('who', result);
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
                    if (rawTag) {
                        return rawTag.split(delimiter);
                    } else {
                        return rawTag;
                    }
                },
                set(val) {
                    let result;
                    if (val) {
                        result = val.join(delimiter).toLowerCase();
                    } else {
                        result = null;
                    }
                    this.setDataValue('tags', result);
                }
            },
            comment: {
                type: Sequelize.STRING
            }
        });
    }

    init() {
        return this._Interruption.sync();
    }

    addInterruption(name, tags) {
        let useObj = { who: name };
        if (tags) {
            useObj = Object.assign(useObj, { tags: tags });
        }

        return this._Interruption.create(useObj)
            .then(interruption => {
                return interruption.save();
            });
    }

    addComments(eventId, comment) {

    }

    addTag(eventId, tags) {

    }

    retag(eventId, tags) {

    }

    listInterruptions() {
        const Op = Sequelize.Op;
        const morning = new Date();
        morning.setHours(0, 0, 0, 0);

        const midnight = new Date();
        midnight.setHours(23, 59, 59);

        // when < [timestamp] AND when > [timestamp]
        return this._Interruption.findAll({
            where: {
                when: {
                    [Op.lt]: morning,
                    [Op.gt]: midnight
                }
            }
        });
    }

    dumpData() {
        return this._Interruption
            .findAll({
                attributes: ['id', 'who', 'when', 'tags', 'comment']
            })
            .then(results => {
                const plainResults = results.map(x => x.get({ plain: true }));
                return Sequelize.Promise.resolve(plainResults);
            })
    }

    clearAll() {
        return this._sequelize.sync({ force: true });
    }

    close() {
        this._sequelize.close();
    }
}

module.exports = Database;
