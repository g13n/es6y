# ES6Y

An ES6 to ES5 transformer, optionally convert AMD module to YUI3 style using the Facebook's
[recast](https://github.com/benjamn/recast) module.

The following program:

		define('yui-module-greeter', [ 'yui', 'node' ], function (Y, node) {
	    	console.log(Y.one('#greet').setHTML('hello, world'));
		});

gets transformed into:

		YUI.add('yui-module-greeter', function (Y) {
		    console.log(Y.one('#greet').setHTML('hello, world'));
		}, { version: '1.0.0', requires: [ 'node' ] });
