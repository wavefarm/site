var api = require('../api');
var h = require('hyperscript');
var qs = require('querystring');
var url = require('url');

module.exports = function () {
  var q = qs.parse(window.location.search.substr(1)).q
  //var q = url.parse(window.location.href, true).query.q;
  console.log(q)
  //api.search(q, function (err, results) {
  //  if (err) return console.error(err);
  //  $total.html(results.total);
  //  $main.html('');
  //  for (var i = 0; i < results.hits.length; i++) {
  //    item = results.hits[i];
  //    $item = $(require('../render/archive/item/wrap')(item));
  //    $item.append(require('../render/archive/item/link')(item));
  //    $main.append($item);
  //  }
  //});
};
