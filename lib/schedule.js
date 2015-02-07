var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')
var strip = require('strip')


module.exports = function () {
  // Noop if no .schedule
  var schedule = $('.schedule');
  if (!schedule.length) return;

  // Grab .day as a template for future days, then fill it in with
  // today's broadcasts
  var now = moment();
  var date = moment(); // This one will be changed for each get
  var day = $('.day');
  var dayTemplate = day.clone();
  var broadcastTemplate = day.find('.broadcast').detach().clone();
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
        var broadcastList = day.find('.broadcast-list');
        result.hits.forEach(function (hit) {
          var broadcast = broadcastTemplate.clone();
          var name = broadcast.find('.broadcast-name');
          var description = broadcast.find('.broadcast-description');
          var start = moment(hit.start);
          var hd = hit.description || '';
          hd = strip(hd);
          if (hd.length > 140) hd = hd.substr(0, 140) + '...';
          broadcast.find('.broadcast-time').html(start.format('h:mma'));
          name.find('span').html(hit.name).on('click', function () {
            description.slideToggle();
          });
          description.find('p').html(hd);
          broadcast.find('.more').attr('href', '/wgxc/schedule/' + hit.id)

          // Highlight the broadcast happening now
          if (start.isBefore(now) && moment(hit.end).isAfter(now)) {
            name.addClass('current');
            description.addClass('current');
          }

          broadcastList.append(broadcast);
        });

        // And around again!
        date = date.add(1, 'days');
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
