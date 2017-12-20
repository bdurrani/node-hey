#!/usr/bin/env node

//console.log('hello console')
// var index = require("./index");
var Database = require("./database");
var Parser = require('./parser');

var dbConnection = Database.setupDb();
var database = new Database(dbConnection);
var args = process.argv.slice(2);
var parser = new Parser(args);


// database.addInterruption('bilal');
database.close();
