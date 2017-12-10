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

    it('should return -1 when the value is not present', function() {
        assert.equal([1, 2, 3].indexOf(4), -1);
    });
});
