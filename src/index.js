import getVariables from './get-variables';
import parseVariables from './parse-variables';

module.exports = function sassVariableLoader(content) {
  this.cacheable(); // Flag loader as cacheable
  const variables = parseVariables(getVariables(content), process.env.NODE_ENV);
  return `module.exports = ${JSON.stringify(variables)};`;
};
