var assert = require('assert');
var should = require('should');
var { Database, DatabaseUtils } = require('../database');

describe('database library tests', function() {

    before(function(done) {
        this._database = new Database(true);
        this._database
            .init()
            .then(() => {
                done();
            });
    });

    after(function() {
        this._database.close();
    });

    beforeEach(function(done) {
        this._database
            .clearAll()
            .then(() => {
                done();
            });
    });

    afterEach(function() {

    });

    it('list interruptions for the day', function(done) {
        const firstUser = "bilal";
        const secondUser = "tim";
        let interruptions = [];
        interruptions.push(this._database.addInterruption([firstUser]));
        interruptions.push(this._database.addInterruption([secondUser]));
        DatabaseUtils.all(interruptions)
            .then(() => {
                interruptions = [];
                interruptions.push(this._database.listInterruptions());
                interruptions.push(DatabaseUtils.dumpData(this._database));
                return DatabaseUtils.all(interruptions);
            })
            .then(results => {
                let todaysInterruptions = results[0];
                let dbDump = results[1];
                todaysInterruptions.should.have.length(2);
                dbDump.should.have.length(2);
                done();
            });
    });

    it('save interruption', function(done) {
        const username = "bilal";
        this._database
            .addInterruption([username])
            .then(() => {
                return DatabaseUtils.dumpData(this._database);
            })
            .then(result => {
                result.should.have.length(1);
                validateSingleUserWithoutCommandsOrTags(result[0], username, 1);

                //                 id.should.be.exactly(1);
                //                 firstUser.get('who').should.be.exactly("Bilal");
                //                 let tags = firstUser.get('tags');
                //                 tags.should.be.an.Array();
                //                 tags.should.containDeepOrdered(['one', 'two']);
                //                 firstUser.get('when').getTime()
                //                     .should.be.exactly(currentTime.getTime());
                done();
            })
    });

    function validateSingleUserWithoutCommandsOrTags(entry, username, id) {
        entry.id.should.be.exactly(id);
        entry.who.should.be.an.Array();
        entry.who.should.containDeepOrdered([username]);
        should(entry.tags).be.null();
        should(entry.comment).be.null();
    }

});
