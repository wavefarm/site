var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')


module.exports = function () {
  // Noop if no .schedule
  var schedule = $('.schedule');
  if (!schedule.length) return;

  var now = moment();
  http.get({
    // TODO Extend API with endpoint to return a day's schedule sorted by time
    path: '/api/search?q=type%3Aevent+startDate%3A' + now.format('YYYY-MM-DD') + '+categories%3A"WGXC%3A+Hands-on+Radio"'
  }, function (res) {
    res.pipe(concat(function (data) {
      var result = JSON.parse(data);
      var day = $('.day');
      day.find('.month').html(now.format('MMMM'));
      day.find('.monthday').html(now.format('DD'));
      var showList = day.find('.show-list');
      var showTemplate = day.find('.show').detach().clone();
      result.hits.forEach(function (hit) {
        var show = showTemplate.clone();
        var start = moment(hit.start);
        show.find('.show-time').html(start.format('h:mma'));
        show.find('.show-name').html(hit.name);
        showList.append(show);
      });
    }));
  });
};
