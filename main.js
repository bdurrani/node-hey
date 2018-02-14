#!/usr/bin/env node

//console.log('hello console')
// var index = require("./index");
const Database = require('./database');
const Parser = require('./parser');

const dbConnection = Database.setupDb();
const database = new Database(dbConnection);
const args = process.argv.slice(2);
// var parser = new Parser(args);

// database.addInterruption('bilal');
database.close();
