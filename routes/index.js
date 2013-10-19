var templates = require('../templates');


module.exports = function (req, res, next) {
  res.render('index.html', {
    '.head': {_html: templates('head.html')}
  });
};
