
var wgxc = require('../lib/wgxc')
var moment = require('moment')

module.exports = function () {
	
	var itemArchiveList = $('.item-archive-list');
	if (!itemArchiveList.length) return;

	// event archive is a list of media of a certain type, e.g. image, audio, etc
	var itemArchiveSection = $('.item-archive-section');
	var itemArchiveSectionTemplate = itemArchiveSection.clone();
	// event archive item is an individual media item
	
	itemArchiveList.html('');
	
	var idRe = /\/wgxc\/([calednar|schedule]+)\/(\w{6})/
	var idReMatches = idRe.exec(location.pathname);
	var id = idReMatches[2];
	
	$.getJSON( '/api/'+id, function( eventJson ) {

		//$('.event-dates strong').html(wgxc.formatDates(eventJson));

		if ( idReMatches[1]=='calendar') {
			// only events get addresses
			if (typeof(eventJson.locations)!='undefined' && eventJson.locations.length>0) {			
				$.getJSON( '/api/'+eventJson.locations[0].id, function( locationJson ) {
					$('.event-location p').html(locationJson.address);
				});			
			}
		}
		
		
		if (typeof(eventJson.audio)!='undefined' && eventJson.audio.length>0) {
			renderAssociated('AUDIO',eventJson.audio);
		}
		if (typeof(eventJson.video)!='undefined' && eventJson.video.length>0) {
			renderAssociated('VIDEO',eventJson.video);
		}
		if (typeof(eventJson.image)!='undefined' && eventJson.image.length>0) {			
			renderAssociated('IMAGE',eventJson.image);
		}
		if (typeof(eventJson.text)!='undefined' && eventJson.text.length>0) {
			renderAssociated('TEXT',eventJson.text);
		}		
		if (typeof(eventJson.broadcasts)!='undefined' && eventJson.broadcasts.length>0) {
			renderAssociated('TUNE IN',eventJson.broadcasts);
		}
		if (typeof(eventJson.events)!='undefined' && eventJson.events.length>0) {
			renderAssociated('TURN OUT',eventJson.events);
		}
			
		
	});
	
	function renderAssociated(type,associated) {
		
		var archive = itemArchiveSectionTemplate.clone();
		itemArchiveList.append(archive);
				
		var itemArchiveEntry = archive.find('.item-archive-entry');
		var itemArchiveEntryTemplate = itemArchiveEntry.clone();
		archive.find('.item-archive-entry-list').html('');

				
		archive.find('h2').prepend(type);			
		archive.find('h2').click(function() {
			var open = $(this).parent().find(".item-archive-entry-list").css('display')!='none';
			$(this).parent().find(".item-archive-entry-list").toggle('fast');
			if (open)
				$(this).find('span').html('click to expand');
			else
				$(this).find('span').html('click to hide');
	    });
		
		
		var count = 0;
        $.each( associated, function( i, hit ) {

			$.getJSON( '/api/'+hit.id, function( associatedJson ) {
				
				//count++;
				
				if (typeof(associatedJson.id)!='undefined') {
					// special case for IMAGE: render first one to main <img />;
					// this is here to avoid another request elsewhere
					if (type=='IMAGE' && i==0) {
	          			$('.item-main-image').attr('src',associatedJson.url);
					}
									
					itemArchiveEntry = itemArchiveEntryTemplate.clone();
					archive.find('.item-archive-entry-list').append(itemArchiveEntry);
					itemArchiveEntry.find('.item-archive-entry-main a').html(associatedJson.main);
					itemArchiveEntry.find('.item-archive-entry-main a').attr('href','/archive/'+associatedJson.id);
	
					// used for sorting; note dates are in reverse chron order
					
					var dataName = associatedJson.main;
					var theFuture = moment('2500-01-01');
					if (typeof(associatedJson.date)!='undefined') {
						var d = moment(associatedJson.date,'YYYY-MM-DD');
						dataName = theFuture.diff(d,'days') + ' ' + dataName;
					}
					else if (typeof(associatedJson.startDate)!='undefined') {
						var d = moment(associatedJson.startDate,'YYYY-MM-DD');
						dataName =  theFuture.diff(d,'days') + ' ' + dataName;
					}
						
					itemArchiveEntry.attr('data-name',dataName);
									
					if (type=='TURN OUT') {
						// events get the location and complete date info
						var dateDesc = wgxc.formatDates(associatedJson);
						if (dateDesc!='')
							dateDesc = ':&nbsp;'+dateDesc;
						itemArchiveEntry.find('.item-archive-entry-main span').html(dateDesc);
						if (typeof(associatedJson.locations)!='undefined' && associatedJson.locations.length>0) {
							itemArchiveEntry.find('.item-archive-entry-detail').html(associatedJson.locations[0].main);						
						}
					}
					else {
						var dateDesc = wgxc.formatArchiveDate(associatedJson);
						if (dateDesc!='')
							dateDesc = ':&nbsp;'+dateDesc;
						itemArchiveEntry.find('.item-archive-entry-main span').html(dateDesc);
						itemArchiveEntry.find('.item-archive-entry-detail').html(
								typeof(associatedJson.credit)!='undefined'?associatedJson.credit:'');
					}
				}
				

				
			})
			.always(function() {
				count++;
				if (count==associated.length && type!='IMAGE')
					sortEntries(archive);
			});
        	
        });
        
        
        function sortEntries(archive) {
        	
			// sort them; TODO: only on first opening...
			
			var list = archive.find('.item-archive-entry-list');
			var entries = list.children('div');
			
			entries.sort(function(a,b) {
				var an = $(a).attr('data-name');
				var bn = $(b).attr('data-name');
				
				if(an > bn) {
					return 1;
				}
				if(an < bn) {
					return -1;
				}
				return 0;				
			});
			
			entries.detach().appendTo(list);        	        	
        }        		
	}	
	
	
};

