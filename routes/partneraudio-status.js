var url = require('url')

var u = url.parse(process.env.PARTNERAUDIOSTATUSURL || 'http://partneraudio.wavefarm.org:8000/status-json.xsl')

module.exports = function (req, res) {
  var clientReq = require(u.protocol.replace(':', '')).request({
    hostname: u.hostname,
    port: u.port,
    auth: u.auth,
    path: u.path,
    method: req.method,
  }, function (clientRes) {
    res.writeHead(clientRes.statusCode, clientRes.headers)
    clientRes.pipe(res)
  })
  clientReq.on('error', function (err) {
    console.error('Error: Cannot connect to ' + u.href)
    console.error(err)
    res.writeHead(502)
    res.end('Bad Gateway')
  })
  req.pipe(clientReq)
}
