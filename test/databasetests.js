var assert = require('assert');
var should = require('should');
const fs = require('fs');
const path = require('path');
var Database = require('../database');
const Sequelize = require('sequelize');

describe('database tests', function() {

    before(function() {
        this.sequelize = new Sequelize('database', '', null, {
            dialect: 'sqlite',
            // default ':memory:'
            // storage: __dirname + '/data.db',
            operatorsAliases: false
        });

        this.sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

        this.Interruption = this.sequelize.define('interruption', {
            who: {
                type: Sequelize.STRING,
                allowNull: false
            },
            when: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            tags: {
                type: Sequelize.STRING,
                get() {
                    const rawTag = this.getDataValue('tags');
                    return rawTag.split(";");
                },
                set(val) {
                    const combined = val.join(";").toLowerCase();
                    this.setDataValue('tags', combined);
                }
            },
            comment: {
                type: Sequelize.STRING
            }
        });
    });

    after(function() {
        // runs after all tests in this block
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    // nextEventId() {
    //     return this.Interruption.max("eventId");
    // }

    it('save user with tags', function(done) {
        let currentTime = new Date(2017, 12, 2, 12, 5, 5);
        this.Interruption
            .sync({ force: true })
            // .then(() => {
            //     return this.Interruption.max("eventId");
            // })
            // .then(id => {
            //     console.log("event id" + id);
            //     return Sequelize.Promise.resolve();
            // })
            // this.Interruption
            .then(() => {
                // table created
                return this.Interruption.create({
                    who: 'Bilal',
                    tags: ['One', 'Two'],
                    when: currentTime,
                    eventId: 1
                });
            })
            .then(() => {
                return this.Interruption.findAll();
            })
            .then(user => {
                user.should.have.length(1);
                const firstUser = user[0];
                const id = firstUser.get('id');
                id.should.be.exactly(1);
                firstUser.get('who').should.be.exactly("Bilal");
                let tags = firstUser.get('tags');
                tags.should.be.an.Array();
                tags.should.containDeepOrdered(['one', 'two']);
                firstUser.get('when').getTime()
                    .should.be.exactly(currentTime.getTime());
                done();
            });
    });
});
