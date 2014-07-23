var api = require('../api');
var create = require('virtual-dom/create-element');
var h = require('virtual-dom/h');
var qs = require('querystring');
var o = require('observ');

module.exports = function (state) {
  state.q = o();
  state.results = o();

  state.results(function (curr) {
    $('.total').html('Total: ' + curr.total);
    $results = $('.results').html('');
    for (var i = 0; i < curr.hits.length; i++) {
      item = curr.hits[i];
      $item = $(require('../render/archive/item/wrap')(item));
      $item.append(require('../render/archive/item/link')(item));
      $results.append($item);
    }
  });

  state.q(function (curr) {
    console.log('q', curr);
    api.search(curr, function (err, results) {
      if (err) return console.error(err);
      console.log(results);
      state.results.set(results);
    });
  });

  // Set q from window.location on page load
  state.q.set(qs.parse(window.location.search.substr(1)).q);

};
