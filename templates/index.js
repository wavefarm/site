var fs = require('fs');

module.exports = function (templateName) {
  return fs.readFileSync(__dirname + templateName, {encoding: 'utf8'});
};
