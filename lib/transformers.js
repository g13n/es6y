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

/*jslint nomen: true */

var path    = require('path'),
    Promise = require('bluebird');

function Transformers() {}

Transformers.VISITOR_PATH = path.join(path.dirname(__dirname), 'node_modules/jstransform/visitors');

/**
 * Return the list of ES6 transformers under VISITOR_PATH.
 *
 * @param  {Boolean} yuify     rewrite AMD module as YUI3
 * @return {Object}            a Promise that resolves to return the list of ES6 transformers
 */
Transformers.getTransformers = function (yuify) {
    'use strict';

    var readdir  = Promise.promisify(require('fs').readdir),
        modpath  = Transformers.VISITOR_PATH,
        visitor;

    return new Promise(function (resolve, reject) {
        readdir(modpath)
            .then(function (files) {
                files.forEach(function (name) {
                    var mod;

                    if (/\.js$/.test(name)) {
                        mod     = require(path.join(modpath, name)).visitorList;
                        visitor = visitor ? visitor.concat(mod) : mod;
                    }
                });

                if (yuify) {
                    visitor = visitor.concat(require('./amd-yui3-visitors.js').visitorList);
                }

                if (visitor) {
                    resolve(visitor);
                } else {
                    reject();
                }
            });
    });
};

module.exports = Transformers;
