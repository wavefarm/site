module.exports = function () {
	// default WGXC archive search to include sites:wgxc in query parameter
	if (window.location.pathname.indexOf('/wgxc')==0) {
		$('form#nav-search ').submit(function(){
			var val = $('#nav-search #q').val();
			if (val.indexOf('sites:')==-1) {
				//$('#q').val(val + ' sites:wgxc');
				$('#nav-search #sites').val('wgxc');
			}
		});
	}
	else if (window.location.pathname.indexOf('/ta/')==0 || window.location.pathname=='/ta') {
		$('form#nav-search').submit(function(){
			var val = $('#nav-search #q').val();
			if (val.indexOf('sites:')==-1) {
				//$('#q').val(val + ' sites:transmissionarts');
				$('#nav-search #sites').val('transmissionarts');
			}
		});
	}
	
	// default to type:news if coming from newsroom
	if (window.location.pathname.indexOf('/newsroom')>=0) {
		$('form#nav-search').submit(function(){
			var val = $('#nav-search #q').val();
			if (val.indexOf('type:')==-1) {
				//$('#q').val(val + ' type:news');
				$('#nav-search #types').val('news');
			}
		});
	}	
	

};
