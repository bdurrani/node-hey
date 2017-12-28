var assert = require('assert');
var should = require('should');
const fs = require('fs');
const path = require('path');
var Database = require('../database');
const Sequelize = require('sequelize');

describe('database tests', function() {

    const subFolder = 'default';
    const defaultDbName = 'default.db';
    const resultDbName = 'data.db';

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

    it('save user with tags', function(done) {
        const Interruption = this.sequelize.define('interruption', {
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
        });

        let currentTime = new Date(2017, 12, 2, 12, 5, 5);
        Interruption.sync({ force: true })
            .then(() => {
                // table created
                return Interruption.create({
                    who: 'Bilal',
                    tags: ['One', 'Two'],
                    when: currentTime
                });
            })
            .then(() => {
                Interruption.findAll()
                    .then(user => {
                        user.should.have.length(1);
                        const firstUser = user[0];
                        firstUser.get('who').should.be.exactly("Bilal");
                        console.log(firstUser.get('tags'));
                        firstUser.get('when').getTime()
                            .should.be.exactly(currentTime.getTime());
                        done();
                    });
            });
    });
});
