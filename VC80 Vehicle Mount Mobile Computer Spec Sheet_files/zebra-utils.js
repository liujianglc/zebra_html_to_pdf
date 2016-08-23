/**
 * This Javascript File Keeps the zebra Util functionalities
 * It leverages Module and Prototype JS patterns for Maintenance.
 * 
 * More specifically, it is following 'The revealing module pattern'
 * 
 * -This pattern allows the syntax of our scripts to be more consistent. 
 * It also makes it more clear at the end of the module which of our functions 
 * and variables may be accessed publicly which eases readability.
 * 
 * So if you want to access any of the methods put inside this JS file, make sure you return it at the end of 
 * ZebraUtilsModule() function, so it can be accessed publicly
 * 
 */
ZebraUtilsModule = (function($) {
	var JSON_TYPE = "json";
	var IE7 = false;
	var IE8 = false;
	var isIE = false;
	var isMobile = false;
	
	var init = function() {
		if ((navigator.userAgent.indexOf('MSIE') != -1)) this.isIE = true;
		if(this.isIE && (parseInt(navigator.userAgent.match(/MSIE ([\d.]+)/)[1], 10) === 7 )) this.IE7 =  true;
		if(this.isIE && (parseInt(navigator.userAgent.match(/MSIE ([\d.]+)/)[1], 10) === 8 )) this.IE8 =  true;
		if((navigator.userAgent.match(/iPad|iPhone|Android/i) && (screen !== null && screen !== undefined && screen.width <= 480 ))) this.isMobile = true;
	}
	
   /**
	* Post Request 
	*/
	var postRequest = function(url,inputData,callback) {
		$.ajax({
			  url: url,
			  data: inputData,
			  contentType: 'text/plain',
			  type: 'POST',
			  dataType: 'json'
		}).done(function(data) {
			 if(callback !== undefined) {
				  callback(data);
			  }
		});
	};
	
	/**
	 * Get Request 
	 */
	var getRequest = function(url,inputData,callback) {
		$.getJSON(url).done(function(data) {
			 if(callback !== undefined) {
				  callback(data);
			   }
		}).error(function(e){
			if(console){
				console.log("Error while processing Request.." + url);
			}
		});
	};
	
	return {
		init : init,
		IE7 : IE7,
		IE8 : IE8,
		isIE : isIE,
		isMobile : isMobile,
		getRequest : getRequest,
		postRequest : postRequest
	};
})(jQuery);

jQuery(function ($) {
	ZebraUtilsModule.init();
});