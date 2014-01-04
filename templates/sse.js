var sse = new EventSource('/_sse')
sse.onmessage = function (e) {
  console.log(e.data)
  if (e.data == 'reload') window.location.reload()
}
