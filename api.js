var http = require('http');
var url = require('url');


var u = url.parse(process.env.API_URL || 'http://localhost:1039');

module.exports = function (req, res) {
  var clientReq = http.request({
    hostname: u.hostname,
    port: u.port,
    auth: u.auth,
    // Only allow GET requests for now
    //method: req.method, 
    path: req.url.replace(/^\/api/, ''),
    headers: req.headers
  }, function (clientRes) {
    res.writeHead(clientRes.statusCode, clientRes.headers)
    clientRes.pipe(res)
  })
  req.pipe(clientReq)
};
