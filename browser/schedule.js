var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')
var strip = require('strip')


module.exports = function () {
  // Noop if no .schedule
  var schedule = $('.schedule');
  if (!schedule.length) return;

  // Fill in existing .day with today's shows, but also use it
  // as a template for future days.
  var now = moment();
  var date = moment(); // This one will be changed for each get
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
          var name = show.find('.show-name');
          var description = show.find('.show-description');
          var start = moment(hit.start);
          var hd = strip(hit.description);
          if (hd.length > 140) hd = hd.substr(0, 140) + '...';
          show.find('.show-time').html(start.format('h:mma'));
          name.find('span').html(hit.name).on('click', function () {
            description.slideToggle();
          });
          description.find('p').html(hd);

          // Highlight the broadcast happening now
          if (start.isBefore(now) && moment(hit.end).isAfter(now)) {
            name.addClass('current');
            description.addClass('current');
          }

          showList.append(show);
        });

        // And around again!
        date = date.add('days', 1);
        if (--daysToGet > 0) renderDay();
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
