// Need map because browserify can't handle dynamic requires
var renderMap = {
  audio: require('./audio')
  //broadcast: require('./broadcast'),
  //show: require('./show'),
  //text: require('./text'),
}

module.exports = function (item) {
  return item ? renderMap[item.type](item) : ''
}
