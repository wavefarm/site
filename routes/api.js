var http = require('http');
var url = require('url');


var u = url.parse(process.env.APIURL || 'http://wavefarm.org/api');

module.exports = function (req, res) {
  var clientReq = http.request({
    hostname: u.hostname,
    port: u.port,
    auth: u.auth,
    path: u.pathname + req.parsedUrl.path.replace(/^\/api/, ''),
    // Only allow GET requests for now
    //method: req.method,
    // Do we need to pass headers?
    //headers: req.headers
  }, function (clientRes) {
    res.writeHead(clientRes.statusCode, clientRes.headers)
    clientRes.pipe(res)
  })
  clientReq.on('error', function (err) {
    console.error('Error: Cannot connect to ' + u.href)
    res.writeHead(502)
    res.end('Bad Gateway')
  })
  req.pipe(clientReq)
};
