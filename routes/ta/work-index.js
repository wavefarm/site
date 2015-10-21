module.exports = function (req, res) {	
  res.render({title: 'Transmission Arts Work Index'}, {
    head: 'ta/head.html',
    nav: 'ta/nav.html',
    listen: 'listen.html',
    main: 'ta/work-index.html'
  })
}
