
var util = require('../lib/util')
var moment = require('moment')

var itemArchiveSectionTemplate;
var itemId,itemType;

module.exports = function () {
	
	var itemArchiveList = $('.item-archive-list');
	if (!itemArchiveList.length) return;
		
	// event archive is a list of media of a certain type, e.g. image, audio, etc
	var itemArchiveSection = $('.item-archive-section');
	itemArchiveSectionTemplate = itemArchiveSection.clone();
	// event archive item is an individual media item
	
	itemArchiveList.html('');
	
	var idRe = /[\/wgxc|\/ta]?\/(calendar|schedule|artists|works)\/(\w{6})/
	var idReMatches = idRe.exec(location.pathname);
	var id = idReMatches[2];
	

	$.getJSON( '/api/'+id, function( itemJson ) {
		
		// stash for use below
		itemId = itemJson.id;
		itemType = itemJson.type;

		// load location details
		if (typeof(itemJson.locations)!='undefined' && itemJson.locations.length>0) {			
			$.getJSON( '/api/'+itemJson.locations[0].id, function( locationJson ) {
				if (typeof(locationJson.address)!='undefined')
					$('.item-location p').html(locationJson.address);
			});			
		}
		
		// load main image
		if (typeof(itemJson.images)!='undefined' && itemJson.images.length>0) {			
			$.getJSON( '/api/'+itemJson.images[0].id, function( imageJson ) {
				$('.item-main-image').attr('src',imageJson.url);
			});			
		}
				
		if (itemJson.type=='work') {
			if (typeof(itemJson.artists)!='undefined' && itemJson.artists.length>0) {
				renderSection('ARTISTS');
			}
		}
		if (typeof(itemJson.works)!='undefined' && itemJson.works.length>0) {
			renderSection('WORKS');
		}
		if (typeof(itemJson.audio)!='undefined' && itemJson.audio.length>0) {
			renderSection('AUDIO');
		}
		if (typeof(itemJson.video)!='undefined' && itemJson.video.length>0) {
			renderSection('VIDEO');
		}
		if (typeof(itemJson.image)!='undefined' && itemJson.image.length>0) {			
			renderSection('IMAGE');
		}
		if (typeof(itemJson.text)!='undefined' && itemJson.text.length>0) {
			renderSection('TEXT');
		}		
		if (typeof(itemJson.broadcasts)!='undefined' && itemJson.broadcasts.length>0) {
			renderSection('TUNE IN');
		}
		if (typeof(itemJson.events)!='undefined' && itemJson.events.length>0) {
			renderSection('TURN OUT');
		}			
		if (itemJson.type!='work') {
			if (typeof(itemJson.artists)!='undefined' && itemJson.artists.length>0) {
				renderSection('ARTISTS');
			}
		}
		
	});
		
	function renderSection(sectionName) {
		
		var archive = itemArchiveSectionTemplate.clone();
		itemArchiveList.append(archive);
				

				
		archive.find('h2').prepend(sectionName);			

		/*
		archive.find('h2').click(function() {
			var open = $(this).parent().find(".item-archive-entry-list").css('display')!='none';
			$(this).parent().find(".item-archive-entry-list").toggle('fast');
			if (open)
				$(this).find('span').html('click to expand');
			else
				$(this).find('span').html('click to hide');
	  });
	  */
		
		var targetType;		
		if (sectionName=='ARTISTS') targetType = 'artist';
		if (sectionName=='WORKS') targetType = 'work';
		if (sectionName=='AUDIO') targetType = 'audio';
		if (sectionName=='VIDEO') targetType = 'video';
		if (sectionName=='IMAGE') targetType = 'image';
		if (sectionName=='TEXT') targetType = 'text';
		if (sectionName=='TUNE IN') targetType = 'broadcast';
		if (sectionName=='TURN OUT') targetType = 'event';
		
		archive.find('h2').attr('id',targetType);
		archive.find('h2').click(function() {
			associatedClick($(this));
	  });
		
	}		
		
	function associatedClick(clickedElement) {

		var archive = clickedElement.parent();
		
		var open = clickedElement.parent().find(".item-archive-entry-list").css('display')!='none';
		clickedElement.parent().find(".item-archive-entry-list").toggle('fast');
		if (open)
			clickedElement.find('span').html('click to expand');
		else
			clickedElement.find('span').html('click to hide');
				
		// mark it as loaded
		if (archive.hasClass('loaded')) return;
		
		archive.addClass('loaded');
		
		var itemArchiveEntry = archive.find('.item-archive-entry');
		var itemArchiveEntryTemplate = itemArchiveEntry.clone();
		archive.find('.item-archive-entry-list').html('');
		

		
		var targetType = clickedElement.attr('id');
		
		var sort;
		if (targetType=='artist') sort = 'sort,main';
		else if (targetType=='work') sort = 'sort,main';
		else if (targetType=='audio') sort = '-date,sort,main';
		else if (targetType=='video') sort = '-date,sort,main';
		else if (targetType=='image') sort = '';
		else if (targetType=='text') sort = 'sort,main';
		else if (targetType=='broadcast') sort = '-start,sort,main';
		else if (targetType=='event') sort = '-start,sort,main';
		else if (targetType=='show') sort = 'sort,main';
				
		var relation;
		if (itemType=='artist') relation = 'artists';
		else if (itemType=='work') relation = 'works';
		else if (itemType=='audio') relation = 'audio';
		else if (itemType=='video') relation = 'video';
		else if (itemType=='image') relation = 'images';
		else if (itemType=='text') relation = 'text';
		else if (itemType=='broadcast') relation = 'broadcasts';
		else if (itemType=='event') relation = 'events';
		else if (itemType=='show') relation = 'shows';
	
		if (!relation || !targetType) return;
		
		var searchUrl = '/api/search?q=type:'+targetType+'%20'+relation+'.id:'+itemId +'&size=500&sort='+sort;
		
		$.getJSON( searchUrl, function( result ) {
		
      $.each( result.hits, function( i, associatedJson ) {
      					
				if (typeof(associatedJson.id)!='undefined') {
									
					itemArchiveEntry = itemArchiveEntryTemplate.clone();
					archive.find('.item-archive-entry-list').append(itemArchiveEntry);
					itemArchiveEntry.find('.item-archive-entry-main a').html(associatedJson.main);					
					itemArchiveEntry.find('.item-archive-entry-main a').attr('href',util.getItemLink(associatedJson));
	
					// used for sorting; note dates are in reverse chron order
					
					/*
					var dataName = associatedJson.main;
					var theFuture = moment('2500-01-01');
					if (typeof(associatedJson.date)!='undefined') {
						var d = moment(associatedJson.date,'YYYY-MM-DD');
						dataName = theFuture.diff(d,'days') + ' ' + dataName;
					}
					else if (typeof(associatedJson.start)!='undefined') {
						var d = moment(associatedJson.start,'YYYY-MM-DD');
						dataName =  theFuture.diff(d,'days') + ' ' + dataName;
					}
					else if (typeof(associatedJson.startDate)!='undefined') {
						var d = moment(associatedJson.startDate,'YYYY-MM-DD');
						dataName =  theFuture.diff(d,'days') + ' ' + dataName;
					}
					itemArchiveEntry.attr('data-name',dataName);
					*/
						
									
					if (targetType=='event') {
						// events get the location and complete date info
						var dateDesc = util.formatDates(associatedJson);
						if (dateDesc!='')
							dateDesc = ':&nbsp;'+dateDesc;
						itemArchiveEntry.find('.item-archive-entry-main span').html(dateDesc);
						if (typeof(associatedJson.locations)!='undefined' && associatedJson.locations.length>0) {
							itemArchiveEntry.find('.item-archive-entry-detail').html(associatedJson.locations[0].main);						
						}
					}
					else {
						var dateDesc = util.formatArchiveDate(associatedJson);
						if (dateDesc!='')
							dateDesc = ':&nbsp;'+dateDesc;
						itemArchiveEntry.find('.item-archive-entry-main span').html(dateDesc);
						itemArchiveEntry.find('.item-archive-entry-detail').html(
								typeof(associatedJson.credit)!='undefined'?associatedJson.credit:'');
					}
				}
      });

		});	
	};
};
