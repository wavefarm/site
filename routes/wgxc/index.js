module.exports = function (req, res, next) {
  res.render('wgxc/index.html', {
    '.head': {_html: res.template('wgxc/head.html')},
    '.nav': {_html: res.template('wgxc/nav.html')}
  });
};
