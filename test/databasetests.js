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

        this.sequelize = new Sequelize('database', '', '', {
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

    it('parser should parse names', function() {
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
                type: Sequelize.STRING
            },
        });

        Interruption.sync({ force: true })
            .then(() => {
                // table created
                return Interruption.create({
                    who: 'Bilal',
                    tags: 'One;Two'
                });
            });

        // Interruption.findAll().then(users => {
        //     console.log('printing all users');
        //     console.log(users);
        // });

    });
});
