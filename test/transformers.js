var expect = require('chai').expect;

describe('Transformers', function () {
    beforeEach(function () {
        this.transformers = require('../lib/transformers.js');
    });

    describe('#getTransformers()', function () {
        it('should return visitors array', function (done) {
            this.transformers.getTransformers()
                    .then(function (visitors) {
                        expect(visitors).to.be.a('array');
                        done();
                    });
        });

        it('should have at least one visitor', function (done) {
            this.transformers.getTransformers()
                    .then(function (visitors) {
                        expect(visitors.length).to.be.least(1);
                        done();
                    });
        });
    });

    describe('#getTransformers(yuify)', function () {
        it('should have amd-yui3-visitors in visitors', function (done) {
            this.transformers.getTransformers(true)
                    .then(function (visitors) {
                        var yui3 = require('../visitors/amd-yui3-visitors.js').visitorList[0];
                        expect(visitors).to.include(yui3);
                        done();
                    });
        });
    });
});
