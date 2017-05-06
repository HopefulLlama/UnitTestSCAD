var os = require('os');

var TestSuite = require('../src/test/TestSuite');

describe('TestSuite', function() {
    describe('getHeader()', function() {
        var name = "getHeader";
        var use = ['Use1', 'Foo', 'Bar'];
        var include = ['Include1', 'Foil', 'Bazro'];

        var directory = 'directory';

        it('should "use" correctly', function() {
            var testSuite = new TestSuite(name, use, []);
            var header = testSuite.getHeader(directory);

            var expected = use.reduce(function(previousValue, currentValue) {
                previousValue += 'use <' + directory + '/' + currentValue + '>;' + os.EOL;
                return previousValue;
            }, '');
            expected += os.EOL;

            expect(header).toBe(expected);
        });

        it('should "include" correctly', function() {
            var testSuite = new TestSuite(name, [], include);
            var header = testSuite.getHeader(directory);

            var expected = include.reduce(function(previousValue, currentValue) {
                previousValue += 'include <' + directory + '/' + currentValue + '>;' + os.EOL;
                return previousValue;
            }, '');
            expected += os.EOL;

            expect(header).toBe(expected);
        });

        it('should "use" and "include" correctly', function() {
            var testSuite = new TestSuite(name, use, include);
            var header = testSuite.getHeader(directory);

            var expected = use.reduce(function(previousValue, currentValue) {
                previousValue += 'use <' + directory + '/' + currentValue + '>;' + os.EOL;
                return previousValue;
            }, '');
            expected = include.reduce(function(previousValue, currentValue) {
                previousValue += 'include <' + directory + '/' + currentValue + '>;' + os.EOL;
                return previousValue;
            }, expected);
            expected += os.EOL;

            expect(header).toBe(expected);
        });
    });
});