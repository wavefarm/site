(function ($) {
  var querystring = location.search.substr(1)
  var query = $.deparam(querystring)
  $('#q2').val(query.q)
  $('#date').val(query.date)
  $('#date2').val(query.date2)

  var template = $('#result-template').html()
  Mustache.parse(template)

  function results (data) {
    console.log(data)
    $('#total').text(data.total)
    var $results = $('#results')
    data.hits.forEach(function (hit) {
      $results.append(Mustache.render(template, hit))
    })
  }

  $.ajax({
    url: '/api/search',
    data: querystring,
    success: results
  })
})(jQuery)
