//var api = require('../api');


module.exports = function (req, res, next) {
  res.render('index.html', {
    '.head': {_html: res.template('head.html')}
  });
};
