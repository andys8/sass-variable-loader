import sass from 'node-sass';
import capitalize from 'lodash.capitalize';
import camelCase from 'lodash.camelcase';

const CSS_UNITS = ['cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'vh', 'vw', 'vmin'];
const REGEX_SASS_VARIABLE = /\.(.+) { value: (.+); }/;
const REGEX_UNIT_NUMBER = /(\d*\.?\d*)(.*)/;

function constructSassString(variables) {
  const asVariables = variables
    .map(variable => `$${variable.name}: ${variable.value};`)
    .join('\n');
  const asClasses = variables
    .map(variable => `.${variable.name} { value: ${variable.value} }`)
    .join('\n');

  return `${asVariables}\n${asClasses}`;
}

export default function parseVariables(variables) {
  const result = sass.renderSync({
    data: constructSassString(variables),
    outputStyle: 'compact',
  }).css.toString();

  const parsedVariables = result.split(/\n/)
    .filter(line => line && line.length)
    .map(variable => {
      const [, name, value] = REGEX_SASS_VARIABLE.exec(variable);
      const obj = {};
      const propName = camelCase(name);
      const [, parsedValue, unit] = value.match(REGEX_UNIT_NUMBER);

      // case where variable numeric with css unit
      if (CSS_UNITS.includes(unit)) {
        obj[`${propName}${capitalize(unit)}`] = value;
        obj[propName] = parseFloat(parsedValue);
        return obj;
      }

      // case where variable is anything else
      obj[propName] = isNaN(value) ? value : parseFloat(value);
      return obj;
    });

  return Object.assign.apply(this, parsedVariables);
}
