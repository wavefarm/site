module.exports = function (req, res, next) {
  res.render('ta/index.html', {
    '.head': {_html: res.template('ta/head.html')},
    '.nav': {_html: res.template('ta/nav.html')}
  });
};
