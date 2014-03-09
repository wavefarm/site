var cheerio = require('cheerio')
, fs = require('fs')

var templates = {}

var loadTemplate = function (name, cb) {
  fs.readFile(__dirname + '/../templates/' + name + '.html', {encoding: 'utf8'}, function (err, data) {
    if (err) console.error(err)
    templates[name] = data
    cb()
  })
}

module.exports = function (req, res) {
  var pending = 3
  , sendRes = function () {
    if (--pending) return
    var $ = cheerio.load(templates.item)
    , $layout = cheerio.load(templates.layout)
    $('.item-title').text('Item title')
    $layout('.head').html(templates.head)
    $layout('.main').html($.html())
    res.setHeader('Content-Type', 'text/html');
    res.end($layout.html())
  }
  loadTemplate('layout', sendRes)
  loadTemplate('item', sendRes)
  loadTemplate('head', sendRes)
}

