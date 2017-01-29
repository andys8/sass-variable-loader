'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getVariables;

var _stripJsonComments = require('strip-json-comments');

var _stripJsonComments2 = _interopRequireDefault(_stripJsonComments);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getVariables(content) {
  var variableRegex = /\$(.+):\s+(.+);/;
  var variables = [];

  (0, _stripJsonComments2.default)(content).split('\n').forEach(function (line) {
    var variable = variableRegex.exec(line);
    if (!variable) return;

    var name = variable[1].trim();
    var value = variable[2].replace(/!default|!important/g, '').trim();

    variables.push({ name: name, value: value });
    return;
  });

  return variables;
}