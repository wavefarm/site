module.exports = function () {
	// default WGXC archive search to include sites:wgxc in query parameter
	if (window.location.pathname.indexOf('/wgxc')==0) {
		$('.search form').submit(function(){
			var val = $('#q').val();
			if (val.indexOf('sites:')==-1) {
				$('#q').val(val + ' sites:wgxc');
			}
		});
	}	
};
