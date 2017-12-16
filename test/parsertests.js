var assert = require('assert');
var should = require('should');
var Parser = require('../parser');

describe('Parser tests', function() {

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

    it('parser should parse list', function() {
        let input = ['list'];
        let parser = new Parser(input);
        parser.registerAction({
            list: function(token, result) {
                result.should.have.property('list');
            }
        });
        parser.parse();
    });

    it('parser should parse tags', function() {
        let input = ['tag', '2', 'one', 'two'];
        let parser = new Parser(input);
        parser.registerAction({
            tag: function(token, result) {
                // assert.equal(token, 'list', 'expected token should be list');
                // result contains a tag property whose value is an array of 3 elements
                // each element is an object. 
                //  tag: Array [
                //     Object { eventid: '2' },
                //     Object { tagValue: 'one' },
                //     Object { tagValue: 'two' }
                //   ]
                result.should.have.property('tag');
                let data = result['tag'];
                data.should.array;
                data.should.length(3, 'array should have 3 objects');

                let eventIdObj = data[0];
                const eventidPropName = 'eventid';
                eventIdObj.should.have.property(eventidPropName);
                eventIdObj[eventidPropName].should.equal('2');

                let val1 = data[1];
                const tagValPropName = 'tagValue';
                val1.should.have.property(tagValPropName);
                val1[tagValPropName].should.equal('one');

                let val2 = data[2];
                val2.should.have.property(tagValPropName);
                val2[tagValPropName].should.equal('two');
            }
        });
        parser.parse();
    });
});
