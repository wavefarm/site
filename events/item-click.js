var api = require('../api')


module.exports = function (ev) {
  if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return
  ev.preventDefault()
  api.get(ev.currentTarget.id, function (err, item) {
    if (err) return console.error(err)
    
    /*
    if (item.type.indexOf('show')!=-1 || item.type.indexOf('broadcast')!=-1) {
    	window.location.href='/wgxc/schedule/'+item.id
    	return
    } else if (item.type.indexOf('event')!=-1) {
    	window.location.href='/wgxc/calendar/'+item.id
    	return
    } 
    */
    		
    state.scrollX.set(window.scrollX)
    state.scrollY.set(window.scrollY)
    history.replaceState(state(), 'scrolled results')
    state.archive.params.set(null)
    state.archive.results.set(null)
    state.archive.item.set(item)
    state.title.set(item.main)
    history.pushState(state(), '', '/archive/' + item.id)
    window.scroll(0, 0)
  })
}
