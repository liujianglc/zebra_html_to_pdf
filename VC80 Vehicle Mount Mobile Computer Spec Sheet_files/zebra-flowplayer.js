jQuery.noConflict();
jQuery(document).ready(function($) {

	initvideoPlayer = function(){
		var isMobileDevice = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPod/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobileDevice.Android() || isMobileDevice.BlackBerry() || isMobileDevice.iOS() || isMobileDevice.Windows());
			    }
			};    
	/* INITIALIZATION OF ALL THE ELEMENTS CONTAINED IN 
	* THE PAGE
	
	* Use flowplayer API for standard videos
	* Use YouTube API for YT videos 
	
	* Embedded players must have one flowplayer instance each
	* Fancybox players can share the same instance
	*/ 
		if(isMobileDevice.any()){
			jQuery( 'a.video_link' ).each(function( index ) {
				var urlVal = jQuery(this).attr('data-url');
				jQuery(this).removeAttr("data-url").attr("href", urlVal).addClass("video_link_mobile").removeClass('video_link');
				 
			});
			jQuery( 'a.yt_video_link' ).each(function( index ) {
				var urlVal = jQuery(this).attr('data-url');
				jQuery(this).removeAttr("data-url").attr("href", 'http://www.youtube.com/watch?v='+urlVal).addClass("yt_video_link_mobile").removeClass('yt_video_link');
				 
			});
			getEmbeddedPlayers().each(function(index) {
				var urlVal = jQuery(this).attr('data-url');
				var vheight = jQuery(this).attr('data-vheight');
				var vwidth = jQuery(this).attr('data-vwidth');
				vplayer = $("<a>", {"class":"embededplayer"});
				vplayer.attr("id","embededplayer");
				vplayer.attr("href",urlVal);
				vplayer.attr("style","display:block;width:"+vwidth+"px;height:"+vheight+"px;");
				jQuery(this).append(vplayer);
				jQuery(this).addClass("embededplayer-container");
				$f("embededplayer", opts.playerPath).ipad();
			});
		}
		else{
			getEmbeddedPlayers().each(initPlayer);
			getYtEmbeddedPlayers().each(initYtPlayer);
	
			getFancyboxPlayers().each(initFancybox);
			getYtFancyboxPlayers().each(initYtFancybox);
		}
	
}

	initvideoPlayer();
/* Initialization of flowplayer 
*  Used for both fancybox and embedded
*  player but not for youtube videos
*/

function initPlayer(args) {
	/* If it is a fancybox player, args already
	have been retrieved, otherwise we need to
	retrieve them */
//	alert("init player called");
	if(args == 0) args = getArgs($(this), false);

	/* Build the clipObject from the arguments */
	newClip = buildClip(args);
	
	/* Starts a flowplayer instance in the HTML elem
	args.id with the flowplayer's file contained at opts.playerPath
	and with the wmode contained in opts.playerWmode */
	
	/* If any plugins need to be added, or if the flowplayer
	configuration needs to be changed, it is in the exact
	call */
	
	$f(args.id, {src:opts.playerPath, wmode:opts.playerWmode },  { 
		clip: newClip
	}).ipad();
	
	/* Sets the right size to the element */
	resizeElem($(args.HTMLid), args.width, args.height);
}

/* Initialization of the YouTube player 
*  Used for both fancybox and embedded
*  yt player but not for normal videos
*/

function initYtPlayer(args) {
	/* If it is a fancybox player, args already
	have been retrieved, otherwise we need to
	retrieve them */
	if(args == 0) args = getArgs($(this), false);
	
	/* Adds the YouTube iframe into the HTML Element */
	$(this).append(getYtModel()
			.attr('src', opts.ytUrlModel + args.clipUrl)
			.attr('id', ''));
}

/* Updates the player with the new clip URL */

function updatePlayer(args) {
//	alert("update player called");
	$f().setClip(buildClip(args == 0 ? getArgs($(this)) : args));
	resizeElem($(args.HTMLid), args.width, args.height);
	$('object[type="application/x-shockwave-flash"]').show();
}

/* Initialization of a fancybox element */

function initFancybox() {
	var theElem = $(this);
	var args 	= getArgs(theElem, opts.fancyboxPlayer, true);
	args.autoPlay = true;
	var content = $(opts.fancyboxPlayer);
	
	$(this).fancybox({
		/* Content has to be in the HTML already */
		'content' : content,
		onStart : function() {
			//the object tags are removed as they will be newly added
			content.css({width: args.width, height: args.height });
			/* We resize the player and fancybox before */
		},
		onComplete : function() {
			/* We can retrieve the arguments now, helps differenciating
			a fancybox player from an embedded one and also we have the
			HTML element in our hands right here */
			

			/* If flowplayer is already instantiated then we just want to
			pass on the new clip Url, if not we need to instantiate obviously */
			//RELOAD_FLOWPLAYER - for ajax reloads, the flow player needs to be instantiated again to render
			//RELOAD_FLOWPLAYER - the flag is set on homepage mainstories
			//the video properly
				initPlayer(args);
	
		},
		onClosed: function() {
			$(opts.fancyboxPlayer).find(opts.overlayClass).remove();
			jQuery('#home-video-background').hide();
		},
		onCleanup: function() {
			var s = $(this);
			/* If there was an overlay, it needs removal */
			if ( $f().isLoaded() ) {
				$f().stop();
				$f().unload(function() {
					// do something to close that again !
					setTimeout(function() {
						$.fancybox.close();
					}, 50);
				});
				return false;
			}
			
			$(opts.overlayClass).hide();
//			$(opts.overlayClass + opts.overlayModel +':not').remove();
		}
	});
}

/* Initialization of a YT fancybox element */

function initYtFancybox() {
	var theElem = $(this);
	var args 	= getArgs(theElem, opts.fancyboxPlayer, true);
	var content = getYtModel();
	//setting initial size of the youtube iframe to 0
	content.css({width: 0, height: 0 });
	
	$(this).fancybox({
		'content' : content,
		onStart : function() {
			content.css({width: args.width, height: args.height });
		},
		onComplete : function() {
			content.attr('src', opts.ytUrlModel + args.clipUrl+"?autoplay=1");
		}
	});
}

/* Build a clip from the datas */

function buildClip(datas, isFancy)	{
	var percentageWatched = 0;
	clip = {
		autoPlay: 		datas.autoPlay,
        autoBuffering: 	datas.autoBuffering,
		url: 			datas.clipUrl,
		// track start event for this clip
        onStart: function(clip) {
//            _tracker._trackEvent("Videos", "Play", clip.url);
            _gaq.push(["main._setAccount", "UA-2314567-10"],["main._trackEvent", "Videos", "Play", clip.url]);
            s.tl(this,'o',clip.url,{linkTrackVars:'events',linkTrackEvents:'event18',events:'event18'});
        },
 
        // track pause event for this clip. time (in seconds) is also tracked
        onPause: function(clip) {
        	if(clip.fullDuration > 0){
        		percentageWatched=(parseInt(this.getTime())/parseInt(clip.fullDuration))*100;
        	}
        	_gaq.push(["main._setAccount", "UA-2314567-10"],["main._trackEvent", "Videos", "Pause", clip.url, parseInt(percentageWatched)]);
        },
 
        // track stop event for this clip. time is also tracked
        onStop: function(clip) {
        	if(clip.fullDuration > 0){
        		percentageWatched=(parseInt(this.getTime())/parseInt(clip.fullDuration))*100;
        	}
        	_gaq.push(["main._setAccount", "UA-2314567-10"],["main._trackEvent", "Videos", "Stop", clip.url, parseInt(percentageWatched)]);
        },
 
        // track finish event for this clip
        onFinish: function(clip) {
        	_gaq.push(["main._setAccount", "UA-2314567-10"],["main._trackEvent", "Videos", "Finish", clip.url]);
        }
	}
	
	if(datas.overlayHeading) clip = addOverlay(clip, datas);
	
	/* 
	* Updates the window / video size from the metadata, causes a snapp effect with
	* fancybox at the moment, so needs some kind of fix before it can be used !
	*
	if(isFancy && (datas.height == datas.defaultHeight || datas.width == datas.defaultWidth))
		clip.onMetaData = function() {
			if(this.getClip().width && this.getClip().height) {
				resizeElem($(this.getParent()), this.getClip().width, this.getClip().height);
				resizeElem($('.fancybox-wrap'), this.getClip().width, this.getClip().height);
				$.fancybox.update();
			}
		}
	*/
	
	return clip;
}

/* If there's an overlay configured, we need to add it */

function addOverlay(clip, datas) {
	/* Easiest way is to add that overlay when the clip
	is finished ! */
	clip.onFinish = function(event) {
		/* We retrieve the player's size and its container */
		width 	= $(this._api()).width();
		height 	= $(this._api()).height();
//		parent  = $(this._api()).parent();
		
		/* Hide the player now */
		$(this._api()).hide();
		
		/* Retrieve the overlay model, clone it and removes the id */
		elem = $(opts.overlayModel).clone().attr('id', '');

		/* Sets the overlay to the right size */
		$(elem).width(width + 'px').height(height + 'px').show();

		/* Add the overlays datas */
		$(elem).find('.heading').html(datas.overlayHeading);
		$(elem).find('.description').html(datas.overlayDescription);
		$(elem).find('.button-url').html(datas.overlayButtonText).attr('href', datas.overlayButtonUrl).addClass("zebra-btn").click(function(){
			  window.location = datas.overlayButtonUrl;
		}).buttonize();
		$(elem).find('.overlay-img').attr('src', datas.overlayImage);
		$(".play-again", elem ).click(function(){
			$(opts.overlayClass).hide();
			//flash object starts with name fp_"
			$('object[name^="fp_"]').show();
        });
		
		/* Add the overlay into the container */
		$(opts.fancyboxPlayer).append(elem);
			
		$(opts.overlayClass).show();
		
		_gaq.push(["main._setAccount", "UA-2314567-10"],["main._trackEvent", "Videos", "Finish", clip.url]);
	}
	
	return clip;
}

/* Retrieve the clip arguments from the HTML */

function getArgs(el, id, isFancy)		{
	args		 	= {};
	args.fancy		= isFancy;
	
	args.id 	 	= id ? id : $(el).attr(opts.idAttribute);
	args.HTMLid		= id ? id : '#' + $(el).attr(opts.idAttribute);
	args.clipUrl 	= $(el).attr(opts.clipUrlAttribute);
	
	args.height  	= $(el).attr(opts.heightAttribute) ? $(el).attr(opts.heightAttribute) 	: opts.defaultHeight;
	args.width   	= $(el).attr(opts.widthAttribute)  ? $(el).attr(opts.widthAttribute) 	: opts.defaultWidth;
	
	args.autoPlay		= stringToBoolean($(el).attr(opts.autoPlayAttribute) 		? $(el).attr(opts.autoPlayAttribute) 		: 'false');
	args.autoBuffering	= stringToBoolean($(el).attr(opts.autoBufferingAttribute) 	? $(el).attr(opts.autoBufferingAttribute) 	: 'false');
	
	args.overlayHeading 		= $(el).attr(opts.overlayHeadingAttribute);
	args.overlayDescription 	= $(el).attr(opts.overlayDescriptionAttribute);
	args.overlayButtonText 		= $(el).attr(opts.overlayButtonTextAttribute);
	args.overlayButtonUrl		= $(el).attr(opts.overlayButtonUrlAttribute);
	args.overlayImage			= $(el).attr(opts.overlayImageAttribute);
	args.overlayStoryname		= $(el).attr(opts.overlayStorynameAttribute);
	
		
	return args;
}

/* Resize an element with css properties in px */
function resizeElem(elem, width, height) {
	$(elem).width(width + 'px').height(height + 'px');
}

/* Util funcs */
function stringToBoolean(str) 		{	return str == 'true' ? true : false;	}
function getYtModel()				{ 	return $(opts.htmlYtModel); 			}
function getYtEmbeddedPlayers() 	{	return $(opts.htmlYtEmbeddedClass);		}
function getYtFancyboxPlayers() 	{	return $(opts.htmlYtFancyboxClass);		}
function getEmbeddedPlayers() 		{	return $(opts.htmlEmbeddedClass);		}
function getFancyboxPlayers() 		{ 	return $(opts.htmlFancyboxClass);		}
});