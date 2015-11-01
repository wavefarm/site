function when (item) {
  var m, m2, f, f2;

  // For shows just display airtime
  if (item.type == 'show') return item.airtime;

  if (item.date) {
    m = moment(item.date);
    f = item.yearOnly ? m.format('YYYY') : m.format('ll');
    return '<time datetime="' + item.date + '">' + f + '</time>';
  }

  if (item.start) {
    m = moment(item.start);
    f = item.allDay ? m.format('ll') : m.format('lll');

    if (!item.end || item.end == item.start) {
      return '<time datetime="' + item.start + '">' + f + '</time>';
    }

    m2 = moment(item.end);
    f2 = item.allDay ? m2.format('ll') : m2.format('lll');

    if (f == f2) {
      return '<time datetime="' + item.start + '">' + f + '</time>';
    }

    return '<time datetime="' + item.start + '">' + f + '</time>' +
      '–' +
      ((!item.allDay && m.format('ll') == m2.format('ll')) ?
        '<time datetime="' + item.end + '">' + m2.format('LT') + '</time>' :
        '<time datetime="' + item.end + '">' + f2 + '</time>');
  }

  return '';
}
