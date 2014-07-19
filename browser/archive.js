var api = require('../api');
var h = require('virtual-dom/h');
var qs = require('querystring');
var create = require('virtual-dom/create-element');

module.exports = function () {
  var q = qs.parse(window.location.search.substr(1)).q
  api.search(q, function (err, results) {
    if (err) return console.error(err);
    console.log(results);

    // TODO Generate layout with h
    // TODO databind results

    $('.total').html('Total: ' + results.total);
    $results = $('.results').html('');
    for (var i = 0; i < results.hits.length; i++) {
      item = results.hits[i];
      $item = $(require('../render/archive/item/wrap')(item));
      $item.append(require('../render/archive/item/link')(item));
      $results.append($item);
    }
  });
};
