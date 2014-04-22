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

/*jslint unparam: true */

var fs      = require('fs'),
    path    = require('path'),
    Promise = require('bluebird');

function File() {}

/** Standard input (typically the terminal) */
File.STDIN = 0;

/** Standard output (typically the terminal) */
File.STDOUT = 1;

/** Default output directory */
File.DEF_OUT_DIR = path.join(process.cwd(), 'compiled');

/**
 * Read the contents of fileName and return contents as a promise.
 *
 * @param fileName {String} the file name to read
 * @return                  a promise with the file contents
 */
File.getContents = function (fileName) {
    'use strict';

    var readFile = Promise.promisify(fs.readFile);

    if (fileName === this.STDIN) {
        process.stdin.setEncoding('utf8');
        return new Promise(function (resolve) {
            var contents = [];

            process.stdin.on('data', function (chunk) {
                contents.push(chunk);
            });
            process.stdin.on('end', function () {
                resolve(contents.join(''));
            });
        });
    }

    return readFile(fileName, 'utf8');
};

/**
 * Write the contents of the file into fileName.
 *
 * @param contents     {String}  the contents to write to the file
 * @param fileName     {String}  the file to create
 * @param dirName      {String}  the directory under which fileName should be created
 */
File.putContents = Promise.method(function (contents, fileName, dirName) {
    'use strict';

    var exists    = Promise.promisify(fs.exists),
        mkdir     = Promise.promisify(fs.mkdir),
        writeFile = Promise.promisify(fs.writeFile),
        newFileName;

    if (fileName === this.STDOUT) {
        process.stdout.write(contents);
        return true;
    }

    dirName     = dirName || this.DEF_OUT_DIR;
    newFileName = path.basename(fileName);

    newFileName = dirName ? path.join(dirName, newFileName) : newFileName;
    exists(newFileName).then(function (fileExists) {
        throw new Error('refusing to overwrite existing file: ' + newFileName);
    }).catch(function () {
       /*
        * Don't worry about error, attempt to create the file under the directory.
        * Checking if the directory exists to call mkdir or not is an anti-pattern since their
        * could be some other process that can create a directory in between.
        */
        mkdir(dirName);
        writeFile(newFileName, contents).then(function () {
            return true;
        }).catch(function () {
            throw new Error('error writing to ' + newFileName);
        });
    });

});

module.exports = File;
