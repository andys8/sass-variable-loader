'use strict';

var _getVariables = require('./get-variables');

var _getVariables2 = _interopRequireDefault(_getVariables);

var _parseVariables = require('./parse-variables');

var _parseVariables2 = _interopRequireDefault(_parseVariables);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function sassVariableLoader(content) {
  this.cacheable(); // Flag loader as cacheable
  var variables = (0, _parseVariables2.default)((0, _getVariables2.default)(content));
  return 'module.exports = ' + JSON.stringify(variables) + ';';
};