[![Build Status](https://travis-ci.org/g13n/es6y.png)](https://travis-ci.org/g13n/es6y)

# ES6Y

An ES6 to ES5 [transpiler](http://en.wikipedia.org/wiki/Source-to-source_compiler) optionally convert AMD module to YUI3 style using the Facebook's
[jstransform](https://github.com/facebook/jstransform) module.

The following program:

		define('yui-module-test', [ 'yui', 'node' ], function (Y, node) {
		    console.log(Y.one('#node').setHTML([3, 1, 2].sort((a, b) => { return b - a; })));
		});

gets transformed into:

		YUI.add('yui-module-test', function (Y) {
		    console.log(Y.one('#node').setHTML([3, 1, 2].sort(function(a, b)  { return b - a; })));
		}, '1.0.0', { requires: [ 'node' ] });

Run `es6y --help` to get started.

# Running

		shell$ es6y --yui3 -- input.js
		# creates compiled/input.js
		shell$ es6y --yui3 <input.js
		# outputs the converted file on standard output
		shell$ es6y --outdir=/tmp/js --yui3 -- file1.js file2.js
		# creates /tmp/js/file1.js, /tmp/js/file2.js with the converted output
