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
                return this._database.listInterruptions();
            })
            .then((interruptions) => {
                return DatabaseUtils.dumpData(this._database);
            })
            .then(results => {
                results.should.have.length(2);
                const first = results[0];
                first.who.should.containDeepOrdered([firstUser]);
                should(first.tags).be.null();
                should(first.comment).be.null();
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
                const firstItem = result[0];
                firstItem.id.should.be.exactly(1);
                const who = firstItem.who;
                who.should.be.an.Array();
                who.should.containDeepOrdered([username]);
                should(firstItem.tags).be.null();
                should(firstItem.comment).be.null();
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

});
