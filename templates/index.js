var fs = require('fs');

var tPath;
module.exports = function (tName) {
  tPath = __dirname + tName;
  return fs.existsSync(tPath) && fs.createReadStream(tPath, {encoding: 'utf8'});
};
