/**
 * Copyright (c) 2014, Gopal Venkatesan <gv@g13n.me>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials provided
 * with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/*jslint nomen: true, unparam: true */

'use strict';

var esprimaHarmony = require('esprima'),
    file           = require('./lib/file'),
    parseArgs      = require('minimist'),
    transformers   = require('./lib/transformers'),
    util           = require('util'),
    args           = parseArgs(process.argv.slice(2)),
    inputFiles     = args._,
    PROGNAME       = 'es6y';

function transformInput(code, fileName, dirName, yuify) {
    var jsTransform = require('jstransform');

    transformers.getTransformers(yuify)
        .then(function (visitors) {
            file.putContents(jsTransform.transform(visitors, code).code, fileName, dirName)
                .catch(Error, function (e) {
                    console.error(e);
                });
        }).error(function (e) {
            console.error(e);
        });
}

/**
 * Print usage information and die.
 */
function usageExit() {
    var helpText = [
        'Transform ES6 files to current ES5 versions optionally converting AMD modules to YUI3',
        '',
        'usage: ' + PROGNAME + ' [--help] [--outdir=OUTPUT-DIRECTORY] [file ...]',
        '',
        '--help                     Print this help text',
        '--outdir=OUTPUT-DIRECTORY  Write transformed files into this directory',
        '--yui3                     Rewrite AMD module as YUI3',
        '',
        'Without any arguments, reads standard input and writes to standard output',
        ''
    ];
    process.stderr.write(helpText.join('\n'));
    process.exit(1);
}

if (args.help) {
    usageExit();
}

if (inputFiles.length === 0) {
    file.getContents(file.STDIN).then(function (contents) {
        transformInput(contents, file.STDOUT, undefined, args.yui3);
    });
} else {
    inputFiles.forEach(function (fileName) {
        file.getContents(fileName)
            .then(function (contents) {
                transformInput(contents, fileName, args.outdir, args.yui3);
            })
            .error(function (e) {
                console.error(PROGNAME + ': cannot transform ' + fileName +
                              '. Reason: ' + e.message);
            });
    });
}
