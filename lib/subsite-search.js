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
	else if (window.location.pathname.indexOf('/ta/')==0 || window.location.pathname=='/ta') {
		$('.search form').submit(function(){
			var val = $('#q').val();
			if (val.indexOf('sites:')==-1) {
				$('#q').val(val + ' sites:transmissionarts');
			}
		});
	}
	
	// default to type:news if coming from newsroom
	if (window.location.pathname.indexOf('/newsroom')>=0) {
		$('.search form').submit(function(){
			var val = $('#q').val();
			if (val.indexOf('type:')==-1) {
				$('#q').val(val + ' type:news');
			}
		});
	}	
	

};
