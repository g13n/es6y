var expect = require('chai').expect;

describe('visitAmdYui3', function () {
    beforeEach(function () {
        this.jsTransform = require('jstransform');
        this.yui3        = require('../visitors/amd-yui3-visitors.js');
        this.arrow       = require('jstransform/visitors/es6-arrow-function-visitors.js');
    });

    describe('#visitAmdYui3', function () {
        it('should convert amd to yui3', function () {
            var amd      = 'define("test", ["yui"], function (Y) { console.log("hello, world"); });';
                code     = this.jsTransform.transform(this.yui3.visitorList, amd).code,
                expected = 'YUI.add("test", function (Y) { ' +
                           'console.log("hello, world"); }, \'1.0.0\', { requires: [  ] });';
            expect(code).to.equal(expected);
        });
    });

    describe('#visitAmdYui3', function () {
        it('should convert amd and arrow function to yui3', function () {
            var amd      = 'define("test", ["yui"], function (Y) { ' +
                           '[3, 1, 2].sort((a, b) => { return b - a; }); });',
                visitor  = this.yui3.visitorList.concat(this.arrow.visitorList);
                code     = this.jsTransform.transform(visitor, amd).code,
                expected = 'YUI.add("test", function (Y) { ' +
                           '[3, 1, 2].sort(function(a, b)  { return b - a; }); }, ' +
                           '\'1.0.0\', { requires: [  ] });';
            expect(code).to.equal(expected);
        });
    });
});
