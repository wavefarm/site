var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')


module.exports = function () {
  // Noop if no .schedule
  var schedule = $('.schedule');
  if (!schedule.length) return;

  // Fill in existing .day with today's shows, but also use it
  // as a template for future days.
  var date = moment();
  var day = $('.day');
  var dayTemplate = day.clone();
  var showTemplate = day.find('.show').detach().clone();
  var daysToGet = 7;
  var today = true;

  function renderDay () {
    http.get({
      path: '/api/wgxc/schedule/' + date.format('YYYY-MM-DD')
    }, function (res) {
      res.pipe(concat(function (data) {
        var result = JSON.parse(data);
        console.log(result)
        if (today) {
          today = false;
        } else {
          day = dayTemplate.clone();
          schedule.append(day);
          day.find('.weekday').html(date.format('dddd'));
        }
        day.find('.month').html(date.format('MMMM'));
        day.find('.monthday').html(date.format('DD'));
        var showList = day.find('.show-list');
        result.hits.forEach(function (hit) {
          var show = showTemplate.clone();
          show.find('.show-time').html(moment(hit.start).format('h:mma'));
          show.find('.show-name').html(hit.name);
          showList.append(show);
        });

        // And around again!
        date = date.add('days', 1);
        if (--daysToGet) {
          renderDay();
        }
      }));
    });
  }

  // Run on page load
  renderDay();

  $('#more').on('click', function () {
    daysToGet = 7;
    renderDay();
  });
};
