;(function ($) {
  var querystring = location.search.substr(1);
  var query = $.deparam(querystring);
  $('#q2').val(query.q);
  $('#date').val(query.date);
  $('#date2').val(query.date2);

  var template, data;
  var resultsDiv = $('#results');

  function renderResults () {
    if (!template || !data) return;
    $('#summary').html('<b>' + data.total + '</b> items.');
    data.hits.forEach(function (hit) {
      hit.when = when(hit);
      hit.desc = hit.description || hit.briefDescription || hit.longDescription || '';
      hit.desc = hit.desc.replace(/<[^>]*>/g, '')
      hit.itemUrl = itemUrl(hit);
      if (hit.desc.length > 160) hit.desc = hit.desc.substr(0, 160) + '...';
      //console.log(hit);
      resultsDiv.append(Mustache.render(template, hit));
    });

    query.from = (query.from && 10 + query.from) || 10;
    if (data.total > query.from) {
      var moreButton = $('#more');
      moreButton.one('click', function (e) {
        e.preventDefault();
        $.ajax({
          url: '/api/search',
          data: $.param(query),
          success: function (d) {
            data = d;
            renderResults();
          }
        });
      });
      moreButton.show();
    } else {
      moreButton.hide();
    }
  }

  $.get('/templates/search-result.html', function (t) {
    template = t;
    renderResults();
  });

  $.ajax({
    url: '/api/search',
    data: querystring,
    success: function (d) {
      data = d;
      renderResults();
    }
  });
})(jQuery);
