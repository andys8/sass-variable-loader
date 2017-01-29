'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = parseVariables;

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

var _lodash = require('lodash.capitalize');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.camelcase');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CSS_UNITS = ['cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'vh', 'vw', 'vmin'];
var REGEX_SASS_VARIABLE = /\.(.+) { value: (.+); }/;
var REGEX_UNIT_NUMBER = /(\d*\.?\d*)(.*)/;

function constructSassString(variables) {
  var asVariables = variables.map(function (variable) {
    return '$' + variable.name + ': ' + variable.value + ';';
  }).join('\n');
  var asClasses = variables.map(function (variable) {
    return '.' + variable.name + ' { value: ' + variable.value + ' }';
  }).join('\n');

  return asVariables + '\n' + asClasses;
}

function parseVariables(variables) {
  var result = _nodeSass2.default.renderSync({
    data: constructSassString(variables),
    outputStyle: 'compact'
  }).css.toString();

  var parsedVariables = result.split(/\n/).filter(function (line) {
    return line && line.length;
  }).map(function (variable) {
    var _REGEX_SASS_VARIABLE$ = REGEX_SASS_VARIABLE.exec(variable),
        _REGEX_SASS_VARIABLE$2 = _slicedToArray(_REGEX_SASS_VARIABLE$, 3),
        name = _REGEX_SASS_VARIABLE$2[1],
        value = _REGEX_SASS_VARIABLE$2[2];

    var obj = {};
    var propName = (0, _lodash4.default)(name);

    var _value$match = value.match(REGEX_UNIT_NUMBER),
        _value$match2 = _slicedToArray(_value$match, 3),
        parsedValue = _value$match2[1],
        unit = _value$match2[2];

    // case where variable numeric with css unit


    if (CSS_UNITS.includes(unit)) {
      obj['' + propName + (0, _lodash2.default)(unit)] = value;
      obj[propName] = parseFloat(parsedValue);
      return obj;
    }

    // case where variable is anything else
    obj[propName] = isNaN(value) ? value : parseFloat(value);
    return obj;
  });

  return Object.assign.apply(this, parsedVariables);
}