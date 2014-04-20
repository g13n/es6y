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

/*jslint unparam: true, plusplus: true */

/**
 * Creates a custom transformation visitor that prefixes all calls to the
 * `eval()` function with a call to `alert()` saying how much of a clown you are
 * for using eval.
 */
var path = require('path');
var requirePath = path.join(process.cwd(), 'node_modules/jstransform/node_modules');

var jstransform = require('jstransform');
var Syntax = require(path.join(requirePath, 'esprima-fb')).Syntax;
var utils = require('jstransform/src/utils');

/**
 * Render YUI requires list
 * 
 * @param  {Object} node
 * @param  {Object} path
 * @param  {Object} state
 */
function renderRequires(node, path, state) {
    'use strict';

    var el, i, len;

    utils.append(', requires: [ ', state);
    // i === 0 is YUI itself
    for (i = 1, el = node.elements, len = el.length; i < len; i++) {
        utils.append(el[i].raw, state);
        if (i < len - 1) {
            utils.append(', ', state);
        }
    }
    utils.append(' ]', state);
}

/**
 * Render the function body
 * 
 * @param  {Object} node
 * @param  {Object} path
 * @param  {Object} state
 */
function renderFunction(node, path, state) {
    'use strict';

    // move to the beginning of the function expression
    utils.move(node.body.range[0] + 1, state);
    utils.catchup(node.body.range[1], state);
}

/**
 * The AMD -> YUI3 transformer visitor
 * 
 * @param  {Object} traverse
 * @param  {Object} node
 * @param  {Object} path
 * @param  {Object} state
 */
function visitAmdYui3(traverse, node, path, state) {
    'use strict';

    utils.append('YUI.add(', state);
    // node.arguments[0] is the module name
    utils.append(node.arguments[0].raw, state);
    utils.append(', function (Y) {', state);

    // the function block
    if (utils.containsChildOfType(node, Syntax.FunctionExpression)) {
        renderFunction(node.arguments[2], path, state);
    }

    utils.append(", { version: '1.0.0'", state);

    // the requires list
    if (utils.containsChildOfType(node, Syntax.ArrayExpression)) {
        renderRequires(node.arguments[1], path, state);
    }

    utils.append(' }', state);
}

/**
 * Check if the source is an AMD module
 * 
 * @param  {Object} node
 * @param  {Object} path
 * @param  {Object} state
 */
visitAmdYui3.test = function (node, path, state) {
    'use strict';

    return node.type === Syntax.CallExpression &&
            node.callee.type === Syntax.Identifier &&
            node.callee.name === 'define';
};

exports.visitorList = [
    visitAmdYui3
];
