var assert = require('assert');
var Parser = require('../parser');

describe('Parser', function() {

    before(function() {
        // runs before all tests in this block
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

    // it('parser should parse list', function(done) {
    //     let input = ['list'];
    //     let parser = new Parser(input);
    //     parser.registerAction({
    //         list: function(token, parser) {
    //             // console.log(`register action ${token}`);
    //             assert.equal(token, 'list', 'expected token should be list');
    //             done();
    //         }
    //     });
    //     parser.parse();
    // });

    it('parser should parse tags', function(done) {
        let input = ['tag', '2', 'one', 'two'];
        let parser = new Parser(input);
        parser.registerAction({
            tag: function(token, parser) {
                // assert.equal(token, 'list', 'expected token should be list');
                done();
            }
        });
        parser.parse();
    });
});
