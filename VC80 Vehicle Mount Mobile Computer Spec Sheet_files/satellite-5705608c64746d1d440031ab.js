/* Start: Eloqua */
var _elqQ=_elqQ||[];
_elqQ.push(['elqSetSiteId','1879417329'],['elqTrackPageView']);
(function()
{
	function async_load()
	{
		var eloqua=document.createElement('script');
		eloqua.type='text/javascript';
		eloqua.async=true;        
//		eloqua.src=('https:'==document.location.protocol?'https':'http')+'://'+document.location.host+'/apps/zebra-www/reskinning-docroot/js/elqCfg.min.js';
//		eloqua.src='https://www.zebra.com/apps/zebra-www/reskinning-docroot/js/elqCfg.min.js';
		eloqua.src='https://img.en25.com/i/elqCfg.min.js';

    
		var x=document.getElementsByTagName('script')[0];
		x.parentNode.insertBefore(eloqua,x);
	}
	if(window.addEventListener)
	{
		window.addEventListener('DOMContentLoaded',async_load,false)
	}
	else if(window.attachEvent)
	{
		window.attachEvent('onload',async_load)
	}
})();
/* End: Eloqua */

