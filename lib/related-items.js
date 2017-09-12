
var util = require('../lib/util')
var moment = require('moment')

var relatedItemSectionTemplate;
var itemId,itemType;

module.exports = function () {
	
	var relatedItemSectionList = $('.related-item-section-list');
	if (!relatedItemSectionList.length) return;
		
	// event archive is a list of media of a certain type, e.g. image, audio, etc
	var relatedItemSection = $('.related-item-section');
	relatedItemSectionTemplate = relatedItemSection.clone();
	// event archive item is an individual media item
	
	relatedItemSectionList.html('');
	
	var idRe = /(\/wgxc|\/ta)?\/(calendar|schedule|artists|works|archive|newsroom)\/(\w{6})/
	var idReMatches = idRe.exec(location.pathname);
	var id = idReMatches[3];
	
	$.getJSON( '/api/'+id, function( itemJson ) {
		
		// stash for use below
		itemId = itemJson.id;
		itemType = itemJson.type;

		// load location details
		var itemLocation = $('.item-location');
		if (itemLocation.length>0) {
			if (typeof(itemJson.locations)!='undefined') {				
				for (i=0; i<itemJson.locations.length; i++) {
					$.getJSON( '/api/'+itemJson.locations[i].id, function( locationJson ) {
							itemLocation.find('p#location-address-'+locationJson.id)
								.html(util.formatLocationContactInfo(locationJson))
							if (locationJson.url) {
								itemLocation.find('#location-name-'+locationJson.id).html(
	  						'<a target="_blank" href="'+locationJson.url+'">' + locationJson.main + '</a>');
							}
					});			
				}
			}
		}
		
		// load show credits if broadcast
		if ( itemType == 'broadcast') {			
			var itemCredits = $('.item-credits');
			if (itemCredits && itemCredits.length>0) {
				if (typeof(itemJson.shows)!='undefined') {				
					$.getJSON( '/api/'+itemJson.shows[0].id, function( showResult ) {
	          var creditsText = typeof(showResult.credit)!='undefined'?showResult.credit:'';          
	          itemCredits.find('p').text(creditsText);
	       	});    		    						
				}
				else {
					itemCredits.remove();
				}
			}	
		}
		
		
		// load main image
		var itemMainImage = $('.item-main-image');
		if (itemMainImage.length>0) {
			if (typeof(itemJson.image)!='undefined' && itemJson.image.length>0) {
				$.getJSON( '/api/'+itemJson.image[0].id, function( imageJson ) {
					itemMainImage.attr('src',imageJson.url);
				});			
			}
		}
				
		if (itemJson.type=='work') {
			if (typeof(itemJson.artists)!='undefined' && itemJson.artists.length>0) {
				renderSection('ARTISTS');
			}
		}
		if (typeof(itemJson.works)!='undefined' && itemJson.works.length>0) {
			renderSection('WORKS');
		}
		if (typeof(itemJson.shows)!='undefined' && itemJson.shows.length>0) {
			renderSection('SHOWS');
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
		if (itemJson.type!='news') {
			if (typeof(itemJson.news)!='undefined' && itemJson.news.length>0) {
				renderSection('NEWS');
			}
		}
		
		
	});
		
	function renderSection(sectionName) {
		
		var archive = relatedItemSectionTemplate.clone();
		relatedItemSectionList.append(archive);
				
		archive.find('h2').prepend(sectionName);			
		
		var targetType;		
		if (sectionName=='ARTISTS') targetType = 'artist';
		if (sectionName=='WORKS') targetType = 'work';
		if (sectionName=='AUDIO') targetType = 'audio';
		if (sectionName=='VIDEO') targetType = 'video';
		if (sectionName=='IMAGE') targetType = 'image';
		if (sectionName=='TEXT') targetType = 'text';
		if (sectionName=='TUNE IN') targetType = 'broadcast';
		if (sectionName=='TURN OUT') targetType = 'event';
		if (sectionName=='SHOWS') targetType = 'show';
		if (sectionName=='NEWS') targetType = 'news';
		
		// pass the related item type via <h2>
		archive.find('h2').attr('id',targetType);
		archive.find('h2').click(function() {
			associatedClick($(this));
	  });		
	}		
		
	
	function associatedClick(clickedElement) {

		var archive = clickedElement.parent();
		
		var open = clickedElement.parent().find(".related-item-list").css('display')!='none';
		clickedElement.parent().find(".related-item-list").toggle('fast');
		if (open)
			clickedElement.find('span').html('click to expand');
		else
			clickedElement.find('span').html('click to hide');
				
		// mark it as loaded
		if (archive.hasClass('loaded')) return;
		
		archive.addClass('loaded');
		
		var relatedItem = archive.find('.related-item');
		var relatedItemTemplate = relatedItem.clone();
		archive.find('.related-item-list').html('');
				
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
		else if (targetType=='news') sort = '-date,sort,main';
				
		var relation;
		if (itemType=='artist') relation = 'artists';
		else if (itemType=='work') relation = 'works';
		else if (itemType=='audio') relation = 'audio';
		else if (itemType=='video') relation = 'video';
		else if (itemType=='image') relation = 'image';
		else if (itemType=='text') relation = 'text';
		else if (itemType=='broadcast') relation = 'broadcasts';
		else if (itemType=='event') relation = 'events';
		else if (itemType=='show') relation = 'shows';
		else if (itemType=='news') relation = 'news';
		
		// site filter
		var siteFilter = '';
		/*
		if (location.pathname.indexOf('/wgxc')===0)
			siteFilter = 'sites:wgxc%20';
		else if (location.pathname.indexOf('/ta')===0)
			siteFilter = 'sites:transmissionarts%20';
		*/
	
		if (!relation || !targetType) return;
		
		var searchUrl = '/api/search?q='+siteFilter+'public:true%20type:'+targetType+'%20'+relation+'.id:'+itemId +'&size=500&sort='+sort;
		
		console.log(searchUrl);
		
		$.getJSON( searchUrl, function( result ) {
		
			if (!result.hits || result.hits.length==0) {
				relatedItem = relatedItemTemplate.clone();
				archive.find('.related-item-list').append(relatedItem);
				relatedItem.find('.related-item-main').html('No Results');
			}
			else {			
	      $.each( result.hits, function( i, associatedJson ) {
	      					
					if (typeof(associatedJson.id)!='undefined') {
										
						relatedItem = relatedItemTemplate.clone();
						archive.find('.related-item-list').append(relatedItem);
						relatedItem.find('.related-item-main a').html(associatedJson.main);					
						relatedItem.find('.related-item-main a').attr('href',itemUrl(associatedJson));
		
						if (targetType=='event') {
							// events get the location and complete date info
							var dateDesc = util.formatDates(associatedJson);
							if (dateDesc!='')
								dateDesc = ':&nbsp;'+dateDesc;
							relatedItem.find('.related-item-main span').html(dateDesc);
							if (typeof(associatedJson.locations)!='undefined' && associatedJson.locations.length>0) {
								relatedItem.find('.related-item-detail').html(associatedJson.locations[0].main);						
							}
						}
						else {
							var dateDesc = (targetType=='broadcast')?
									util.formatDates(associatedJson):util.formatArchiveDate(associatedJson);
							if (dateDesc!='')
								dateDesc = ':&nbsp;'+dateDesc;
							if (targetType!='show')
								relatedItem.find('.related-item-main span').html(dateDesc);
							relatedItem.find('.related-item-detail').html(
									typeof(associatedJson.credit)!='undefined'?associatedJson.credit:'');
						}
					}
	      });
			}
		});	
	};
};
