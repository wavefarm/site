module.exports = function (req, res) {	
  res.render({title: 'Transmission Arts Artist Index'}, {
    head: 'ta/head.html',
    nav: 'ta/nav.html',
    listen: 'listen.html',
    main: 'ta/artist-index.html'
  })
}
