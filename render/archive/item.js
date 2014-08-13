// Need map because browserify can't handle dynamic requires
var renderMap = {
  artist: require('./artist'),
  audio: require('./audio'),
  broadcast: require('./broadcast'),
  event: require('./event'),
  image: require('./image'),
  location: require('./location'),
  show: require('./show'),
  text: require('./text'),
  video: require('./video'),
  work: require('./work')
}

module.exports = function (item) {
  //console.log(item)
  return (item && item.type && renderMap[item.type]) ?
    renderMap[item.type](item) : ''
}
