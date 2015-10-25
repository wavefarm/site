function api (method, path, data, cb) {
  if (!cb) {
    cb = data
    data = {}
  }

  var xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return
    var data = JSON.parse(xhr.responseText)
    if (xhr.status !== 200) {
      return cb({status: xhr.status, message: data.message})
    }
    cb(null, data)
  }
  xhr.open(method, '/api/' + path)
  xhr.setRequestHeader('Content-Type', 'application/json')
  if (cache.token) {
    xhr.setRequestHeader('Authorization', cache.token)
  }
  xhr.send(JSON.stringify(data))
}
