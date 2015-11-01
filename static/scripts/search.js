;(function ($) {
  var querystring = location.search.substr(1);
  var query = $.deparam(querystring);
  $('#q2').val(query.q);
  $('#date').val(query.date);
  $('#date2').val(query.date2);

  var template, data;

  function renderResults () {
    if (!template || !data) return;
    $('#summary').html('<b>' + data.total + '</b> items.');
    var $results = $('#results');
    data.hits.forEach(function (hit) {
      hit.when = when(hit);
      hit.desc = hit.description || hit.briefDescription || hit.longDescription || '';
      hit.desc = hit.desc.replace(/<[^>]*>/g, '')
      hit.itemUrl = itemUrl(hit);
      if (hit.desc.length > 160) hit.desc = hit.desc.substr(0, 160) + '...';
      console.log(hit);
      $results.append(Mustache.render(template, hit));
    });
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
