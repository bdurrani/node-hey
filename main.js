#!/usr/bin/env node

//console.log('hello console')
// var index = require("./index");
var Database = require("./database");
var Parser = require('./parser');

var database = new Database();
var args = process.argv.slice(2);
var parser = new Parser(args);

// for (let i = 0; i < args.length; i++) {
//     let current = args[i];
//     if (current === 'list') {

//     }
//     else {

//     }
// }

// database.addInterruption('bilal');
database.close();

