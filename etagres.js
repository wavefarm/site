var crypto = require('crypto');
var stream = require('stream');
var util = require('util');


util.inherits(ETagRes, stream.Writable);

function ETagRes (req, res) {
  stream.Writable.call(this);
  this._h = crypto.createHash('sha1');
  this._buffer = new Buffer(0);

  // Listen on finish since writables have no _flush
  // See https://github.com/joyent/node/issues/5315
  this.on('finish', function () {
    var etag = '"' + this._h.digest('base64') + '"';
    if (req.headers['if-none-match'] === etag) {
      res.statusCode = 304;
      res.end();
    } else {
      res.statusCode = 200;
      res.setHeader('ETag', etag);
      res.end(this._buffer);
    }
  });
}

ETagRes.prototype._write = function(chunk, enc, cb) {
  this._h.update(chunk);
  this._buffer = Buffer.concat([this._buffer, chunk]);
  cb();
};

module.exports = function etagres (req, res) {
  return new ETagRes(req, res);
};
