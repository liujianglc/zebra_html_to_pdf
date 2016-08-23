jQuery.noConflict();
jQuery(document).ready(function($) {
	var IE7 = ( $.browser.msie && ( Math.floor($.browser.version) === 7 ) ), IE8 = ( $.browser.msie && ( Math.floor($.browser.version) === 8 ) );
    var RELOAD_FLOWPLAYER = false;	
    
    initFunc = function() {
    	changeMultiNavActionCountryDropdown();
        $('.news-scroller').newsScroll();       
        $("SELECT").selectBox();
        $("a#inline").fancybox();
        $("a#share-email-link").fancybox();
        $("a.btn-360").fancybox({'transitionIn': 'none', 'transitionOut':'none'});
        $('input').bind('keydown', function(event) {      //prevent Enter key from triggering form submit
            if (event.keyCode == 13) { 
				if(($(this).hasClass('search-input'))||($(this).hasClass('allow-submit'))||($(this).hasClass('allow-enter'))){
                    //allows item with class to no block submit - like search in the header. 
                }else{
                    event.preventDefault();
                    return false;
				}
            }
        });
        //search form input validation. If the input is blank, dont do action
        $("form[name='searchForm']").submit(function() {
        		  if(!$.trim(this.q.value)){	
        	          return false;
        		  } else {
        			  var regex = /(<([^>]+)>)/ig;
	        		  qVal = this.q.value;
	        		  this.q.value = qVal.replace(regex,"");
        		  }
        });
        //        if($('.year').length){filterTable($('.year'));}
        if($('.investor-relations').length){ investorWidget($);} //function located inline in .investor-relations widget
        
        /* Disable news scroller if featured news item */
         $(".news-scroller").each(function() {
            if ( $(this).children().hasClass("featured-news") ) {
                $(this).trigger('stopScroll');
            }
         });
         
         if(IE7 || IE8) {
        	 $(".btnHomePageMainStory").css('background',"#174978 url('/etc/designs/zebra/reskinning/images/arrow-btn-white-1.png') no-repeat right 0");
         }

    }
    
    
    /* Home Blue Dots & Blue Overlays */
    /* Blue Dots Trigger */
    $(".overlay-container").mouseenter(function(event){
        $(this).children(".blue-dot").addClass("active");
        //console.log('1. Placing button on top');
        $(this).children('.btnHomePageMainStory').removeClass('homepage-normalbtn-order').addClass("btnHomePageMainStoryActive");
        //console.log('2. Adjusting blue-overlay width with respect to button width');
        bwidth = $(this).children(".btnHomePageMainStory").width();
        if(IE7||IE8) {
        	$(this).children(".blue-overlay").css('min-width',bwidth+24);
            $(this).children(".blue-overlay").css('width',bwidth+24);
        } else {
        	$(this).children(".blue-overlay").css('min-width',bwidth+44);
            $(this).children(".blue-overlay").css('width',bwidth+44);
        }
        //console.log('3. Firing blue overlay animation');
        if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
        	$(this).children(".blue-overlay").show('fast');
        } else {
	        $(this).children(".blue-overlay").slideUp('fast');
	        $(this).children(".blue-overlay").slideDown('fast');
        }
        //console.log('4. Bringing blue overlay to middle ')
        $(this).children(".blue-overlay").css('left','0px');
        $(this).children(".blue-overlay").addClass("bringtop");
        if(IE7 || IE8) {
        	//console.log('5. Displaying right side  arrow on old ie browsers ')
        	$(this).children(".btnHomePageMainStoryActive").css('background',"#174978 url('/etc/designs/zebra/reskinning/images/arrow-btn-yellow-1.png') no-repeat right 0");
        }
    }).mouseleave(function(event){
    	var overlay = $(this);
    	$(this).children(".blue-overlay").hide('fast',function(){
    		overlay.children(".blue-dot").removeClass("active");
    		overlay.children(".bringtop").removeClass("bringtop");
    		overlay.children('.btnHomePageMainStoryActive').removeClass("btnHomePageMainStoryActive").addClass('homepage-normalbtn-order');
    		if(IE7 || IE8) {
	        	overlay.children(".btnHomePageMainStory").css('background',"#174978 url('/etc/designs/zebra/reskinning/images/arrow-btn-white-1.png') no-repeat right 0");
    		}
    	});
    });
    
    $(".btnHomePageMainStoryActive, .bringtop").on("click",function(event){
    	event.stopPropagation();
    	if (!$(event.target).is('.bringtop div a')) {
    		$('.bringtop div a').trigger('click');
    	}
    });

    // If user is from China, show message in header
    if (window.ipInfo && ipInfo.getStoredData()) {
        window.searchParams.lat = ipInfo.getStoredData().lat;
        window.searchParams.lng = ipInfo.getStoredData().lng;
        window.searchParams.countryCode = ipInfo.getStoredData().eVar69; //eVar69 : 'registry_country_code',
        var userCountryCode = ipInfo.getStoredData().eVar69; //eVar69 : 'registry_country_code',
        
        if (userCountryCode == "CN") {
          if ($.cookie('ChinaNote') == "closed") {
            $(".chinaNote").hide();
          } else {
            $(".chinaNote").show();    
          }
        }

        // if ($.cookie('ChinaNote') == "closed") {
        //   $(".homepageNote").hide();
        // } else {
        //   $(".homepageNote").show();    
        // }
    }

    // Currently for use with China only, will make it work for multiple countries.
    $("#hideCountryNote").on('click', function() {
      $.cookie('ChinaNote', 'closed', { expires: 365 });
      $(".chinaNote").hide();
    });

    if (IE7 || IE8) {
      $('.browserNote').show();

      if ($.cookie('BrowserNote') == "hideBrowserNote") {
        $(".browserNote").hide();
      } else {
        $(".browserNote").show();    
      }

    }

    // IE8 Note
    $("#hideBrowserNote").on('click', function() {
        $.cookie('BrowserNote', 'hideBrowserNote', { expires: 365 });
        $(".browserNote").hide();
    });


    
    /* Image Map Trigger */
    $("map").mouseenter(function(){
        //console.log("im entering");
        var name = $(this).attr('name');
        //console.log(name);
        $(".blue-dot." + name).addClass("active");
        $(".blue-overlay." + name).show('fast');
    }).mouseleave(function(){
        var name = $(this).attr('name');
        //console.log("im leaving");
        $(".blue-dot." + name).removeClass("active");
        $(".blue-overlay." + name).hide('fast');
    });
    
    
    /* Move Home Banner Elements */
    $(".hotspot.left").mouseenter(function(){
        var currentPosition = $(".layer1").position();
        if (currentPosition.left < 100) {
            /*
            $(".layer1").animate({"left":"+=100px"}, 3000, "linear");
            $(".layer3").animate({"left":"+=100px"}, 3000, "linear");
            $(".layer2").animate({"left":"+=100px"}, 6000, "linear");
            $(".layer4").animate({"left":"+=100px"}, 6000, "linear");
            */
        }
    }).mouseleave(function(){
        $(".layer1, .layer3, .layer2, .layer4").stop();
    });
    
    
    $(".hotspot.right").mouseover(function(){
        var currentPosition = $(".layer2").position();
        if (currentPosition.left < 100) {
            $(".layer2").animate({"left":"-=100px"}, 5000, "linear");
        }
    });
        
/* Progress Bar */
    $(".tab").click(
		function() {
			$('.loadingDiv').hide().ajaxStart(function() {
				$(this).show();
			}).ajaxStop(function() {
				$(this).hide();
			});
	
			// delay ajax content loading
			setTimeout(function() {
	
				// load ajax content
				$("#ajax-content-area").load(
						"examples/ajax-content.html");
			}, 4000);

	});
   
    
    /* This function is called from the script below which builds the tabs */
    function progressBar() {
        $('.loadingDiv').show();
        // delay ajax content loading
        setTimeout(function(){
            
            // load ajax content
            $("#ajax-content-area").load("examples/ajax-content.html");
        }, 4000);   
        
        // recognize ajax load end, hide loading div
        $('.loadingDiv').ajaxStop(function() {
            $(this).hide();
        });
    }
    
    
    

    
    
  /* Form validation */
    /* examples and instructions: http://docs.jquery.com/Plugins/Validation */
    
    // Login - Form Validation
    $("#login-form").validate();
    
   
   
    
  /*^Form validation^*/ 
    
    /* Main navigation - wrapping */
    // add up width of all nav items
    //var nav = $(".nav");
    //var navItems = $(".nav > ul > li > a");
    //var totalNavWidth = 0;
    //navItems.each( function () { totalNavWidth += $(this).outerWidth(true); });
    //// compare the width of all nav items to the width of the container; if sum of items is wider, adjust item widths
    //if ( totalNavWidth > nav.width() ) {
    //    // find all nav items that can be shortened via wrapping text and store array - aka find text with a space
    //    var navItemsToShorten = new Array();
    //    navItems.each( function(index) {
    //        if($(this).html().indexOf(" ") != -1){
    //            navItemsToShorten.push(index);
    //        }
    //    });
    //
    //    // loop through each nav item in shorten array
    //    for(t=0; t<navItemsToShorten.length; t++){
    //        navItem = navItems.eq(parseInt(navItemsToShorten[t]));
    //
    //        /* get the width of the text and reduce by 2px to force natural wrapping */
    //        navItem.css("width", ((navItem.width()-2)+"px"));
    //        /* get new width of wrapped text add 2px for IE fix and set new width */
    //        navItem.css("width", (navItem.textWidth()+2)+"px");
    //    }
    //
    //    navItems.each( function () {
    //        $(this).addClass('twoline');
    //    });
    //
    //}





    /* Main navigation - mega dropdown code */
    /*  includes check for active select dropdown and rollout */
    $('.nav > ul > li').mouseenter(function(){

        $(this).addClass("hover");


        if($(this).children('.main-nav-dropdown-container').length > 0){  // checks for existance of mega-dropdown

            $('.main-nav-dropdown-bg').show();

            $('.main-nav-dropdown-bg').css('height', $('.main-nav-dropdown-container', this).height()+20+'px');
            $(this).children("a").addClass("hover");

            if((!$(this).hasClass('hovered')) && ($('.nav li').hasClass('hovered'))){
                $('.selectBox-dropdown-menu').css('display', 'none');
                $('.nav li').each(function(index){
                    if($(this).hasClass('hovered')){
                        $(this).removeClass('hovered')
                        $(this).children("a").removeClass("hover");
                        $(this).children('.main-nav-dropdown-container').hide();
                    }
                });

            }
            else if($('.selectBox', this).hasClass('selectBox-menuShowing')){
                $('.selectBox-dropdown-menu').css('display', 'block');
            }

            $(this).children("a").each(function(index){
                if($(this).hasClass('hover')){
                    $(this).parent().children('.main-nav-dropdown-container').show();
                }
            });
        }
        else{ // if no mega-dropdown
            $(this).children("a").addClass("hover").addClass("no-mega");
            $(this).children(".man-nav-dropdown-container").remove();
        }

    });
    $('.nav > ul > li').mouseleave(function(){
        if($('.selectBox', this).hasClass('selectBox-menuShowing')){
            $(this).addClass('hovered');
        }
        else{
            $('.main-nav-dropdown-container').hide();
            $('.main-nav-dropdown-bg').hide();
            $(this).removeClass('hovered');
            $(this).children("a").removeClass("hover");
            $(this).removeClass("hover");
        }
    });
  
    
    
    /* Left-Rail Accordion: Hide all accordion elements on page load, except for first child */
    $("ul.accordion li").siblings("li").children("ul").hide();
    $("ul.accordion").show();    
    $("ul.accordion li.active").children("ul").show();
    $("ul.accordion li").addClass("expander");
    $("a", "ul.accordion").parent("li").addClass("link").removeClass("expander");
    //ldolan 4/19/12
    //this dynamic-class setting is inefficient, unnatural. Fixing up so the first levels are always expanders...
    $("ul.accordion>li").addClass("expander").removeClass("link");
    //respect the left navigation category tag on the page properties
    $("ul.accordion .left-nav-item").addClass("expander").removeClass("link");
    /* Left-Rail Accordion */
    $("ul.accordion li").click(function (event) { 
            $(this).siblings("li").removeClass("active").children("ul").not(":hidden").slideToggle();
            $(this).toggleClass("active").children("ul").slideToggle();
            //click on child <li> triggers click on parent <li> as well. Stopping the event as we focus just on current <li>
            if (event.stopPropagation) { // W3C/addEventListener()
                event.stopPropagation();
            } else { // Older IE.
                event.cancelBubble = true;
            }
    });
     
     
     /* Tab Container Accordion */
     /*
     << This code will only allow one accordion tab to be open at a time >>
     
     $("ul.tab-accordion li").siblings("li").children(".accordion-tab-content").hide();
     $("ul.tab-accordion li.active").children(".accordion-tab-content").show();
     $("ul.tab-accordion li .accordion-tab-title").click(function () { 
        if ( $(this).siblings().is(":hidden") ) { 
            $(this).parent().siblings().removeClass("active").children(".accordion-tab-content").not(":hidden").slideToggle();
            $(this).parent().toggleClass("active").children(".accordion-tab-content").slideToggle();
        }
     });
     */
     
     /*
     << This code treats each accordion independently >>
     */
     $("ul.tab-accordion li").siblings("li").children(".accordion-tab-content").hide();
     $("ul.tab-accordion li .accordion-tab-title").click(function () { 
        $(this).parent().toggleClass("active");
        $(this).siblings().toggle(function(){ $(this).addClass('floatfix');}); //Adding a class fixes an IE7 repaint issue
     });
     
     
 	$('.tablesorter').each(function () {
		$(this).initTableSort();
	});
     
     /* Table Filter */
     
     function filter(selector, query) {  
       query =   $.trim(query); //trim white space  
       query = query.replace(/ /gi, '|'); //add OR for regex query  
       
       $(selector).each(function() {  
         ($(this).text().search(new RegExp(query, "i")) < 0) ? $(this).parent().hide().removeClass('visible') : $(this).parent().show().addClass('visible');  
       });  
     } 

     //default each row to visible  
     $('.table-bind-select').each(function() {
        tableObject = $(this);
       $('tbody tr', tableObject).addClass('visible'); 
       
       filterTable = function(x) {
         //if esc is pressed or nothing is entered  
         if ($(x).val() == 'All') {  
           //if esc is pressed we want to clear the value of search box  
           $(x).val('');  
       
           //we want each row to be visible because if nothing  
           //is entered then all rows are matched.  
           $('tbody tr', tableObject).removeClass('visible').show().addClass('visible');  
         }  
       
         //if there is text, lets filter  
         else {  
        	 filter('.tablesorter tbody tr .sortby', $(x).val());  
         }  
       
         //reapply zebra rows  
         $('tr.visible', tableObject).removeClass('highlight');  
         $('tr.visible:odd', tableObject).addClass('highlight'); 
        }
       
       //TODO make this more precise to a specific class or ID that only applies to the select
       //	used for this exact press release table.  Currently it will apply to every select box
       //	on the page.
       $('SELECT').selectBox().change( function(){
        filterTable($(this));
       });
     });
     
     
     /* Checkbox clicked */
     $(".top-content-container.solutions-detail-segment input:checkbox").click(function() { 
            var filterList = [];            
            /* Put all checked filter values into an array */
            $(".top-content-container.solutions-detail-segment input:checkbox:checked").each(function() {
                    filterList.push(this.value);
            });
        
            /* Show all solutions (no filter items selected) */
            if (filterList.length == 0) {   
                    /* Show all containers */
                    $(".filterable .tab-content-container .tab-content-item").show();   
            }
            /* Filter solutions */
            else {
                    /* Hide all containers */
                    $(".filterable .tab-content-container .tab-content-item").hide();
                    
                    /* Loop through filter list */
                    for (i=0; i<=filterList.length; i++) {  
                        /* Show container */
                        $("."+filterList[i]).show();        
                    } // end for
            }
     });
     
     
     
     /* News Stripe Reveal More */
    $(".news-stripe .btn-more").click(function() {
        
        $newsColTotalHeight = $(this).siblings().children("ul").outerHeight() + 50; // get total list height
        $newsColIndHeight = $(this).siblings().find("li").outerHeight(); // get individual news item height
        
        // Expand list
        if ( !$(this).hasClass("active") ) {
            $(this).siblings(".news-content-col").animate( {
                height: $newsColTotalHeight
            });
            $('.news-scroller').trigger('stopScroll');
        } 
        
        // Collapse list
        else {
            $(this).siblings(".news-content-col").animate( {
                height: $newsColIndHeight
            });
            /* Disable news scroller if featured news item */
             $(".news-scroller").each(function() {
                if ( $(this).children().hasClass("featured-news") ) {
                    $(this).trigger('stopScroll');
                }
                else {
                    $('.news-scroller').trigger('startScroll');
                }
             });
            
        }
        $(this).toggleClass("active"); // set arrow btn to active
     
     });
     
    
     /* News Scroller */
     $.fn.newsScroll = function(options) {  
      
        // For each item in the wrapped set, perform the following.  
        return this.each(function() {     
      
            var  $this = $(this),   
      
              defaults = {  
                speed: 600, 
                delay: 5000,
                list_item_height: $this.children('li').outerHeight()
             },  
              // Create a new object that merges the defaults and the user's "options".  The latter takes precedence.  
              settings = $.extend({}, defaults, options),
              interval = null, 
              scrolling = function() {  
                // Get the very first list item in the wrapped set.  
                $this.children('li:first')  
                    // Animate it  
                        .animate({  
                            marginTop : '-' + settings.list_item_height, // Shift this first item upwards.  
                            opacity: 'hide' }, // Fade the li out.  
      
                            // Over the course of however long is passed in. (settings.speed)  
                            settings.speed,   
      
                            // When complete, run a callback function.  
                            function() {  
      
                                // Get that first list item again.  
                                $this.children('li:first')  
                                     .appendTo($this) // Move it the very bottom of the ul.  
      
                                     // Reset its margin top back to 0. Otherwise, it will still contain the negative value that we set earlier.  
                                     .css('marginTop', 0)  
                                     .fadeIn(300); // Fade in back in.  
                            }  
                        ); // end animate  
            };  
            
            interval = setInterval(scrolling, settings.delay); // end setInterval  
            $this.bind('stopScroll', function() {
                clearInterval(interval);
            });
            $this.bind('startScroll', function() {
                interval = setInterval(scrolling, settings.delay); // end setInterval  
            });
            });  
    }  // end function newscroll
     
     
     
     
     
     /* Open & Close 'All' popup */
     $(".open-list-window").click(function() {
        
        $(this).siblings(".pop-up-list-container").slideToggle(function() {
            
            $(this).children('.open-list-window').click(function() {
                $(this).parent(".pop-up-list-container").slideToggle("slow");
                $(this).parents(".pop-up-list-container").clearQueue();
            });
            
            $(this).find('.close-x').click(function() {
                $(this).parents(".pop-up-list-container").slideToggle("slow");
                $(this).parents(".pop-up-list-container").clearQueue();
            });
        });
     
     });
     
     /* Print Window */
     $(".print-me").click(function() {
        window.print();
        return false; 
     });
     
     /* Image Cycler*/
    imageCycler = function(){
         $('.cycler').each(function(){
             icCount = $('img', this).length;
             $('img', this).each(function(index){
                if(index+1 != icCount){
                    $(this).css({'z-index': 1, 'display':'none'});
                }
                else{
                    $(this).css('z-index', 10);
                }
             });
             ic = $(this);
             setInterval ( "cycle(ic)", 5000 );
             
             cycle = function(x)
             {
                var indexHolder;
               $('img', x).each(function(index){
                    if($(this).css('z-index') == 10){
                        indexHolder = index;
                    }
               });
                if(indexHolder == (icCount-1)){
                    imgHolder = $('img', x).get(0); 
                }
                else{
                    tmp = (indexHolder+1);
                    imgHolder = $('img', x).get(tmp);
                }
                $(imgHolder).css('z-index', 10).fadeIn('slow');
                oldImg = $('img', x).get(indexHolder);
                $(oldImg).css({'display': 'none', 'z-index':1});
                    
               
             }
         });
    }
    imageCycler();
     /* ^Image Cycler^ */
     /* Open Facebook, Twitter, & LinedIn Share icons in new window */
     $('a[rel="external"]').click( function() {
        
        var w = 600;
        var h = 450;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        
        window.open( $(this).attr('href'), "shareWindow", "width="+w+",height="+h+",left="+left+",top="+top );
        return false;
     });
    
	/* check for mal formed buttons */
    $("span.zebra-btn a").closest("span.zebra-btn").each(function(){
        $(this).removeClass('zebra-btn');
        $(this).find('a').addClass('zebra-btn');
    });
	
    /* prepare input buttons */
    inputButtonize = function(){    
      btn = $("input.zebra-btn-input");
      btn.each(function(index){
        if(($(this).is("input"))&&($('.search-form-container input').length == 0)){
            if($(this).attr("type") == "submit"){
                $(this).wrap("<span class='zebra-input zebra-btn "+$(this).attr('class')+"' />");
                submitText = $(this).attr('value');
                $(this).before(submitText);
            }
            else{
                $(this).removeClass("zebra-btn");
                $(this).wrap("<span class='zebra-input "+$(this).attr('class')+"' />");
                $(this).after("<a href='javascript://' class='zebra-btn'>"+$(this).attr('value')+"</a>");
                inputAnchor = $(this).siblings('a');
                inputAnchor.click(function(){
                    $(this).submit();
                });
                $(this).hide();
            }
        }
       });
    
    };
    
    $(".main-content-wrapper input:submit").addClass("zebra-btn-input");
    $(".addToListBtn").removeClass("zebra-btn").addClass("zebra-btn-input");
    $(".btn-submit").removeClass("zebra-btn-input");
    inputButtonize();
    
    /* initialize buttons */
    $(".zebra-btn").buttonize();
    
    /* banner slider */
    $(".banner-slider").each( function () {
        var bannerSlider = $(this), slides = bannerSlider.children(".slide"), imgWidth = slides.children(".img").width(), slidesText,
            slidesNav, slidesNavTop = 0, slidePrev, slideNext, slideBtns = false, slideIdx,
            requiredHeight = bannerSlider.height();
        //added to determine what mode
        var editModeHolder = bannerSlider.attr('mode');
        var delay = bannerSlider.attr('delay');
        // transition slide functions
        function showSlideAtIndex(idx) {
            var outSlide = slides.filter(".active").removeClass("active").show(), outImg = outSlide.children(".img"), outTxt = outSlide.children(".txt"),
                inSlide = slides.eq(idx).addClass("active").show(), inImg = inSlide.children(".img"), inTxt = inSlide.children(".txt");
            
                if(editModeHolder == 'edit'){
                    var richtextPath = outTxt.attr("richtextPath");
                    if(richtextPath!=null){
                            var editable = CQ.WCM.getEditable(richtextPath);
                            editable.hide();
                    }
                }

            // IE doesn't like the fading effects, so transition the slides as whole pieces for each
            if (IE7 || IE8) {
                outSlide.css({"position":"absolute", "left": 0, "width": bannerSlider.width(), "height": bannerSlider.height()}).animate({"left": -1 * bannerSlider.width() }, 600);
                inSlide.css({"position":"absolute", "left": -1 * bannerSlider.width(), "width": bannerSlider.width(), "height": bannerSlider.height()}).animate({"left": 0}, 600);
            }
            else {
                // transition the former active slide out
                outImg.animate({"left": "" + imgWidth + "px", "opacity": "0"}, 600, function () { outImg.hide(); });
                outTxt.animate({"left": "" + (-1*outTxt.width()) + "px", "opacity": "0"}, 800);
                
                // transition the new active slide in
                inImg.show().css({"left": "" + imgWidth + "px", "opacity": "0"}).animate({"left":"0", "opacity":"1"}, 600);
                inTxt.css({"left": "" + (-1*inTxt.width()) + "px", "opacity": "0"}).animate({"left": "" + imgWidth + "px", "opacity": "1"}, 800);
            }
            
            if(editModeHolder == 'edit'){
                var inrichtextPath = inTxt.attr("richtextPath");
                if(inrichtextPath !=null){
                        var inEditable = CQ.WCM.getEditable(inrichtextPath);
                        inEditable.show();
                        if ( inEditable.xtype == "editbar" )
                            inEditable.setWidth( inEditable.element.getWidth() );
                }
            }//END IF EDIT MODE
        
            // change the selector buttons
            if (slideBtns) { slideBtns.removeClass("active").eq( slides.index(inSlide) ).addClass("active"); }
            
        }
        
        // slide setup
        slides.show();
        // set width of text areas
        slidesText = slides.children(".txt");
        slidesText.width( bannerSlider.width() - imgWidth - (slidesText.outerWidth() - slidesText.width()) ).css({ "left": "" + imgWidth + "px" });
        
        // set height of slider to tallest element
        slides.each( function () {
            var slide = $(this), reqHeight = slide.children(".img").outerHeight(), txtHeight = slide.children(".txt").outerHeight();
            if (txtHeight > reqHeight) { reqHeight = txtHeight; }
            if (reqHeight > requiredHeight) { requiredHeight = reqHeight; }
        });
        bannerSlider.height(requiredHeight);
        
        // select first slide
        slides.eq(0).addClass("active");
        //slides.not(slides.eq(0)).hide();
        slides.not(slides.eq(0)).hide();

        // build navigation
        if (slides.length > 1) {
            // create DOM objects
            slidesNav = $("<div>", {"class":"slide-nav"});
            slidePrev = $("<a>", {"href":"", "class":"go-prev ir"});
            slideNext = $("<a>", {"href":"", "class":"go-next ir"});
            
            // decrement the index of the slide from the current active class side, wrapping it to last slide if at first
            slidePrev.click( function () {
                slideIdx = slides.index( slides.filter(".active") ) - 1;
                if (slideIdx < 0) { slideIdx = slides.length - 1; }
                showSlideAtIndex(slideIdx);
                return false;
            } );
            // increment the index of the slide from the current active class slide, wrapping it to first slide if at last
            slideNext.click( function () {
                slideIdx = slides.index( slides.filter(".active") ) + 1;
                if (slideIdx >= slides.length) { slideIdx = 0; }
                showSlideAtIndex(slideIdx);
                return false;
            } );
            
            // attach the slide navigation DOM element to the banner slider widget
            bannerSlider.append(slidesNav);
            // attach previous button
            slidesNav.append( slidePrev );
            // create a button for each slide and append to navigation element
            slides.each( function (idx) {
                var btn = $("<a>", {"href":"", "class":"selector ir"});
                
                slidesNav.append(btn);
                btn.click( function () {
                    if ( !slides.eq(idx).hasClass("active") ) { showSlideAtIndex(idx); }    
                    return false;
                });
            });
            // add the active class to the first button and store jQuery object for the buttons
            slideBtns = slidesNav.children(".selector").eq(0).addClass("active").end();
            // append next button at end of navigation element
            slidesNav.append( slideNext );
            
            // position nav to lowest text bottom
            slidesText.each( function () {
                var thisTop = $(this).outerHeight();
                if (thisTop > slidesNavTop) { slidesNavTop = thisTop; }
            });
            slidesNav.css({"top":"" + slidesNavTop + "px"});
            
        }
        if(editModeHolder=='design' || editModeHolder=='edit' || delay=='0'){
            //don't animate
        }else{
            window.setInterval(function(){
                    slideIdx = slides.index( slides.filter(".active") ) + 1;
                    if (slideIdx >= slides.length) { slideIdx = 0; }
                    showSlideAtIndex(slideIdx);
                }, parseInt(delay));
        }
        
        
    });
    
    
    
    /* Generate the product image hotspots */
    $(".product-360view").each( function () {
    	
    	$('area').each(function( ){
    		var refString = $(this).attr('ref');
    		var tootipId = '#tooltip_' + refString;
    		var imageId = '#hotspot_' + refString;
 			var hovered = false;
 	 		  function checkNotHovered() {
 	                if (!hovered) {
 	                	$(imageId).removeClass("hovered");
 	                    $(tootipId).hide();
 	                }
 	            }
 			$(this).click( function () { return false; } );
            // area hover show tooltip, hover off check for hovered off both area and tooltip on timer
            $(this).hover(
            	 function () {
                	$(imageId).addClass("hovered");
                	$(tootipId).show();
                    hovered = true;
                },
                function () {
                    hovered = false;
                    setTimeout(checkNotHovered, 200);
                }
            );
 		});
 		
 		$('.product-tooltip').each( function(){
 			$(this).hover(
                function () {
                    hovered = true;
                },
                function () {
                    hovered = false;
                    setTimeout(checkNotHovered, 200);
                }
        	);
 		});
 	
});
    
    setTabContentHeight = function(tabContainerSet){
        var minHeight = 0;
        tabContainerSet.find('.tab-content').each(function(){
            if($(this).height() > minHeight){
                minHeight = $(this).height()+2;
            }
        });
        tabContainerSet.find('.tab-content:first').siblings().andSelf().each(function(){
            $(this).css('min-height', minHeight);
        });
    };
    
    // gets and sets tab content containers to be all the same height.
    setTabContentHeight = function(tabContainerSet){
        var minHeight = 0;
        tabContainerSet.find('.tab-content').each(function(){
            if($(this).height() > minHeight){      
                minHeight = $(this).height() + 2;
            }
        });
        tabContainerSet.find('.tab-content:first').siblings().andSelf().each(function(){
            $(this).css('min-height', minHeight);
        });
    };
    
    $('.tab-container').each(function(){
        //Check for sub tabs
        if($(this).find('.tab-container').length >0){
            if($(this).find('.tab-container').attr("data-fixed-height") == "true"){
                setTabContentHeight($(this).find('.tab-container'));
            }
        }
        //Outer most tabs
        if($(this).attr("data-fixed-height") == "true"){
            setTabContentHeight($(this));
        }
    });
    
    /*IE7 and 8 hack for fixing menu arrow issue*/
    if (IE7 || IE8){
    	$('.main-nav-dropdown-container .content-col LI A').after('<img src="/etc/designs/zebra/reskinning/images/bg-link-arrow-white.png">');
    }
    
    /* Equal Column Heights */
    
    $.fn.equalizeHeights = function(){
        var maxColHeight = 0;
        
        $(this).each(function() {
            if($('img', this).length > 0){
                $('img', this).load(function(){
                    if ( $(this).height() > maxColHeight ) {
                        maxColHeight = $(this).height();
                    }
                }).error(function(){});
            }
        });
        if(maxColHeight != 0){  // jquery returns zero if the elements parent is hidden
            return this.height( maxColHeight );
        }
    }
    $(".make-equal-heights").each(function(index, value) {
         $(this).children(".col").equalizeHeights();
         $(this).children("li").equalizeHeights();
    });
    initFunc();
});

/* JSON if not available */
typeof JSON!="object"&&(JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}()
// For IE8 and earlier version.
if (!Date.now) {
  Date.now = function() {
    return new Date().valueOf();
  }
} 

window.ipInfo={};
window.searchParams ={};

ipInfo.mapping={
		eVar55: "audience",
		eVar56: "audience_segment",
		eVar57: "company_name",
		eVar58: "industry",
		eVar59: "sub_industry",
		eVar60: "employee_range",
		eVar61: "revenue_range",
		eVar62: "city",
		eVar63: "state",
		eVar64: "zip",
		eVar65: "country",
		eVar66: "registry_area_code",
		eVar67: "registry_city",
		eVar68: "registry_company_name",
		eVar69: "registry_country_code",
		eVar70: "registry_zip_code'",
		eVar71: "demandbase_sid",
		lat: "registry_latitude",
		lng: "registry_longitude",
		countryName: "registry_country"
};

ipInfo.local="Internal Testing";
ipInfo.sess={};
ipInfo.key;
ipInfo.value;
ipInfo._hasProp={}.hasOwnProperty;
ipInfo.isExternalIP=true;
ipInfo.isDetailed;
ipInfo.arrayWL;
ipInfo.inThirtyMinutes=(function(){var d=new Date();d.setTime(d.getTime()+18E5);return d.toUTCString();})();
ipInfo.cWrite=function(name,value){var expires="; expires="+ipInfo.inThirtyMinutes;document.cookie=name+"="+value+expires+"; path=/";};
ipInfo.cRead=function(name){var ca,i,c;name=name+"=";ca=document.cookie.split(';');for(i=0;i<ca.length;i++){c=ca[i];while(c.charAt(0)==' '){c=c.substring(1,c.length);}if(c.indexOf(name)==0){return c.substring(name.length,c.length)}}return null};
ipInfo.exists=function(check){if(typeof(check)!=='undefined'){return true;}else{return false;}};
ipInfo.supportSessionStorage=ipInfo.exists(window.Storage);
ipInfo.stringData=ipInfo.supportSessionStorage?sessionStorage.ipdata:ipInfo.cRead('ipdata');
ipInfo.getStringData=function(){return ipInfo.stringData;};
ipInfo.setStringData=function(newVal){ipInfo.stringData=newVal;};
ipInfo.MetricsAssigned=[];	
ipInfo.isDefinedAndNotEmpty=function(variableToCheck){if((typeof(variableToCheck)!=='undefined')&&variableToCheck!==''&&variableToCheck!== null){return true;}else{return false;}}
ipInfo.inspect=function(variableToCheck,isDetailed,undefinedBasic,undefinedDetailed){undefinedBasic=(ipInfo.isDefinedAndNotEmpty(undefinedBasic))?undefinedBasic:"ISP Visitor";undefinedDetailed=(ipInfo.isDefinedAndNotEmpty(undefinedDetailed))?undefinedDetailed:"Error";if(ipInfo.isDefinedAndNotEmpty(variableToCheck)){return variableToCheck}else{if(isDetailed){return undefinedDetailed}else{return undefinedBasic}}};
ipInfo.testResultForExternal=function(dbData){if(dbData.error&&dbData.status){if(dbData.error==='Not Found'&&dbData.status==='404'){return false;}}return true;};

if(ipInfo.supportSessionStorage){
	ipInfo.setExpires=function(strSetExpire){return strSetExpire.replace('{','{"expires":"'+Date.parse(ipInfo.inThirtyMinutes)+'",');};
	ipInfo.getExpires=function(strGetExpire){return strGetExpire.substr(ipInfo.getStringData().indexOf('expires')+10,13);};
	ipInfo.storeData=function(dataObject){ipInfo.setStringData(ipInfo.setExpires(JSON.stringify(dataObject)));sessionStorage.ipdata=ipInfo.getStringData();};
	ipInfo.dataIsStored=function(){if(ipInfo.getStringData()){return(ipInfo.getExpires(ipInfo.getStringData())<Date.now())?false:true;}else{return false;}};
	ipInfo.getStoredData=function(){if(sessionStorage.ipdata){return JSON.parse(sessionStorage.ipdata);}};	
}else{
	ipInfo.storeData=function(dataObject){ipInfo.setStringData(JSON.stringify(dataObject));ipInfo.cWrite('ipdata',ipInfo.getStringData());};
	ipInfo.dataIsStored=function(){if(ipInfo.cRead('ipdata')){return true;}return false;};
	ipInfo.getStoredData=function(){if(ipInfo.cRead('ipdata')){return JSON.parse(ipInfo.cRead('ipdata'));}};
}

ipInfo.demandbaseParse=function(dbInfo){
try{
	ipInfo.isDetailed=(dbInfo.information_level==='Detailed')?true:false;	
	ipInfo.isExternalIP=ipInfo.testResultForExternal(dbInfo);
	ipInfo.sess.isExternalIP = ipInfo.isExternalIP;
	for(ipInfo.key in ipInfo.mapping){
		if(!ipInfo._hasProp.call(ipInfo.mapping,ipInfo.key)&&ipInfo.key.length<7)
		continue;
		ipInfo.value=ipInfo.mapping[ipInfo.key];
		if(ipInfo.value.toLowerCase().match(/^wl:/)){
			if('undefined'!==typeof(dbInfo.watch_list)&&dbInfo.watch_list!==''){
				ipInfo.arrayWL=ipInfo.value.substr(ipInfo.value.indexOf(':')+1).split(',');
				ipInfo.sess[ipInfo.key]=ipInfo.inspect(dbInfo.watch_list[ipInfo.arrayWL[0]],ipInfo.isDetailed,ipInfo.arrayWL[1],ipInfo.arrayWL[2]);
			}
		}else{
			if(ipInfo.isExternalIP===false){
				ipInfo.sess[ipInfo.key]=ipInfo.inspect(dbInfo[ipInfo.value],ipInfo.isDetailed);
			}else if(ipInfo.isExternalIP){
				ipInfo.sess[ipInfo.key]=ipInfo.inspect(dbInfo[ipInfo.value],ipInfo.isDetailed);
			}else{
				ipInfo.sess[ipInfo.key]=ipInfo.local;
			}
		}
		if(ipInfo.value==='audience_segment'&&ipInfo.isExternalIP){
			if(ipInfo.isDefinedAndNotEmpty(dbInfo.audience_segment)&&ipInfo.isDefinedAndNotEmpty(dbInfo.audience)) {
				ipInfo.sess[ipInfo.key]=dbInfo.audience+'->'+dbInfo.audience_segment;
			}
		}
		ipInfo.MetricsAssigned.push('s.'+ipInfo.key+"="+ipInfo.sess[ipInfo.key]+"("+ipInfo.value+")");
	}
	ipInfo.storeData(ipInfo.sess);
	// IM-2376 : Make call to Partner Locator to fetch results after getting User Information from Demand Base, It should trigger on first page load only.
	if (jQuery("input#searchTextField").size() > 0 && jQuery("#pl-search").size() > 0 ) {
		if (window.ipInfo && ipInfo.getStoredData()) {
			window.searchParams.lat = ipInfo.getStoredData().lat;
			window.searchParams.lng = ipInfo.getStoredData().lng;
			window.searchParams.countryCode = ipInfo.getStoredData().eVar69; //eVar69 : 'registry_country_code',
			var userCity = ipInfo.getStoredData().eVar67; //eVar67 : 'registry_city',
			var userCountryCode = ipInfo.getStoredData().eVar69; //eVar69 : 'registry_country_code',
			jQuery("input#searchTextField").val(userCity + ", " + userCountryCode);
			ZebraPartnerModule.googleMapInitialize();
			ZebraPartnerModule.triggerNewPartnerLocatorSearch();    
        }
	}
	
}catch(err){
	wasErrorInDemandbasePlugin=true;
	ipInfo.ERROR = err;
}
};


/* Start: Demandbase API Call */
if(!ipInfo.dataIsStored()){
	var dbs=document.createElement('script');	
	dbs.src=('https:'==document.location.protocol?'https':'http')+'://api.demandbase.com/api/v2/ip.json?key=a93401e75ae4f248d09e8dee0e4b004e54d76d82&var=dbInfo&callback=ipInfo.demandbaseParse';
	document.getElementsByTagName('head')[0].appendChild(dbs);
}

/* tab text width plugin */
(function ($){
    $.fn.textWidth = function(){
      var html_org = $(this).html();
      var html_calc = '<span>' + html_org + '</span>';
      $(this).html(html_calc);
      var width = $(this).find('span:first').width();
      $(this).html(html_org);
      return width;
    };
    
})(jQuery);


function getUserLocationParams() {
	var userLat = 0.0;
	var userLng = 0.0;
	var userCity = null;
	var userCountryCode = null;
	var userCountryName = null;
	var isReady = false;


	if(window.ipInfo && ipInfo.getStoredData()) {
		//Grab the user's location info from local storage from DemandBase
		userLat = ipInfo.getStoredData().lat;
		userLng = ipInfo.getStoredData().lng;
		userCity = ipInfo.getStoredData().eVar67; //eVar67 : 'registry_city',
		userCountryCode = ipInfo.getStoredData().eVar69; //eVar69 : 'registry_country_code',
		userCountryName = ipInfo.getStoredData().countryName;
		isReady = true;
	} else {
		
		//Fire a custom event into analytics to get an idea how often this 
		//	happens that we can't get any user location info
		
//		_gaq.push(['main._trackEvent', 'Partner Locator', 'User Location Undetected']);
	}
	
	return {
		"lat":userLat,
		"lng":userLng,
		"city":userCity,
		"countryCode":userCountryCode,
		"countryName":userCountryName,
		"isReady":isReady
	};

}
function handleMultiNavAction() {
	var countryvalue="";
	// Instantiating Demandbase IP API object from hosted script
	selectedValue = jQuery('#multilinkdropdown').val();
	//if navigation link is defined for the user country, set up the link in <a> for navigation
	 if(jQuery('#multilink-'+selectedValue).length){
		jQuery('#multilinkNavigator').attr('href', jQuery('#multilink-'+selectedValue).attr('value'));
	}
	//if the navigation linke is not defined, user must be directed to default link 
	else{
		jQuery('#multilinkNavigator').attr('href', jQuery('#multilink-DEFAULT').attr('value'));
	} 
	//if user changes the preselected / default value
	jQuery('#multilinkdropdown').change(function(){
		countryvalue = jQuery(this).val();
		//if navigation link is defined for the user country, set up the link in <a> for navigation
		 if(jQuery('#multilink-'+countryvalue).length){
			jQuery('#multilinkNavigator').attr('href', jQuery('#multilink-'+countryvalue).attr('value'));
		}
		//if the navigation linke is not defined, user must be directed to default link 
		else{
			jQuery('#multilinkNavigator').attr('href', jQuery('#multilink-DEFAULT').attr('value'));
		} 
		});
	
}
function changeMultiNavActionCountryDropdown() {
	var userLocation = getUserLocationParams();
	if(userLocation.isReady) {
		countryvalue = userLocation.countryCode;
		jQuery("#multilinkdropdown option[value="+countryvalue+"]").attr("selected",true);
	}
}
/* Table Sorter Initializiation
 *		Called on the table to have sorting initialized.  This should be broken out
 *			into a real plugin so it doesn't clutter zebra-tagfilters.js
 *		Example:  theTableEl.initTableSort();
*/
(function ($) {
	$.fn.initTableSort = function (config) {
		$('thead th.sortable', this).each(function (columnIndex) {
			$(this).click(function () {
				
				/*
				 *	The pagination module doesn't render the non-viewable elements.
				 *	Thus, the code below can't properly sort since it only finds the 
				 *	elements that have been rendered thus far.
				 */	
				if(config && config.usePaginationModuleToSort) {
					//console.log("initTableSort using sort queue publish");
					//Use the counter index columnIndex since the keys are in a zero based array in order of column
					jQuery.publish(config.usePaginationModuleToSort, [this, columnIndex]);
					return;
				}
				
				//console.log("initTableSort continuing, not using sort queue");
				
				//Get the index for this version so none sorted columns are counted in the index
				var column = $(this).index();
				
				//step back up the tree and get the rows with data for sorting
				var $rows = $(this).parent().parent().parent().find('tbody tr').get();
				//TODO test if this works instead of calling parent over and over:
				//var $rows = $(this).parentsUntil('table', 'tbody').get();
				
				//loop through all the rows and find sort keys
				$.each($rows, function (index, row) {
					row.sortKey = $(row).children('td').eq(column).getSortKey();
				});
				
				var sortDirection = $(this).is('.sorted-asc') ? -1 : 1;
				
				//compare and sort the rows
				$rows.sort(function (a, b) {
					if (a.sortKey < b.sortKey)
						return -sortDirection;
					if (a.sortKey > b.sortKey)
						return sortDirection;
					return 0;
				});
				
				//add the rows in the correct order to the bottom of the table
				$.each($rows, function (index, row) {
					$('.tablesorter tbody').append(row);
					row.sortKey = null;
				});
				
				
				//TODO limit scope of this remove
				//identify the column sort order
				$('th').removeClass('sorted-asc sorted-desc');
				
				//TODO can't you get the column header to set the class from $(this)?
				var $sortHead = $('th').filter(':nth-child(' + (column + 1) + ')');
				sortDirection == 1 ? $sortHead.addClass('sorted-asc') : $sortHead.addClass('sorted-desc');
			});
		});
	};
})(jQuery);

/* Common way to get keys for sorting from an element */
(function ($) {
	$.fn.getSortKey = function () {
		$el = $(this);
		if($el.find(".date-sort-key").length) {
			// add check for date sorting, note the cell must only contain the date in the following format
			var re = new RegExp('^[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]$');
			var m = re.exec($el.text());
			if (m != null) {
				return Date.parse($el.text());
			}
		} else if($el.find(".int-sort-key").length) {
			var intKey = parseInt($el.find('.int-sort-key').text());
			if(intKey) {
				return intKey;
			}
		} else if($el.find(".float-sort-key").length) {
			var floatKey = parseFloat($el.find('.float-sort-key').text());
			if(floatKey) {
				return floatKey;
			}
		} else if($el.find(".sort-key").length) {
			var sortKey = $el.find(".sort-key").text().toUpperCase();
			if(sortKey) {
				return sortKey;
			}
		}
		
		//Default to whatever text it can find in the cell
		return $el.text().toUpperCase();
	};
})(jQuery);

/* zebra button plugin */
(function ($){
    
    $.fn.buttonize = function() {
        
        return this.each(function() {
            
            
            var btn = $(this),
                body = $("body"), placeholder = $("<span>"), notDisplayed = (!btn.is(":visible")), notDisplayStyle = false,
                text,
                arrow = $("<span>", {"class":"arrow"}),
                shadow = $("<span>", {"class":"shadow"}),
                shadowLeft = $("<span>", {"class":"shadow-left"}),
                shadowRight = $("<span>", {"class":"shadow-right"}),
                shadowMid = $("<span>", {"class":"shadow-mid"}),
                btnWidth, btnMidShadowWidth, btnSideShadowWidth,
                BTN_SIDE_SHADOW_MAX_WIDTH = 70;
                
            // only handle if button is not yet processed
            if (!btn.hasClass("buttonized")) {
                
                // add the class indicating this link has been processed
                btn.addClass("buttonized");
                
                // mark the place of the button & show it if no displayed or pop it out of any no display container
                if (notDisplayed) {
                    btn.show();
                    if (btn.is(":visible")) { notDisplayStyle = true; }
                    else {
                        btn.after(placeholder);
                        body.append(btn);
                    }
                }

                // reformat button
                btn.html("<span class='text'>" + btn.html() + "</span>");
                text = btn.children(".text");
                // insert absolutely positioned right hand arrow
                text.prepend( arrow.height( text.height() + 3 ) );
                // put the placeholder for the shadow after the text
                btn.append(shadow);

                // build button shadow
                // -- find size of left and right shadow hang
                btnWidth = btn.width();
                if ( btnWidth < BTN_SIDE_SHADOW_MAX_WIDTH*2 ) { btnSideShadowWidth = Math.floor( btnWidth/2 ); }
                else { btnSideShadowWidth = BTN_SIDE_SHADOW_MAX_WIDTH; }
                // -- build shadow
                btnMidShadowWidth = btnWidth - (2*btnSideShadowWidth);
                shadow.append( shadowLeft.width(btnSideShadowWidth) );
                if (btnMidShadowWidth > 0) { shadow.append( shadowMid.width(btnMidShadowWidth) ); }
                shadow.append( shadowRight.width(btnSideShadowWidth - 1) );

                // rehide button if should be not displayed or restore button in DOM if in no display container
                if (notDisplayed) {
                    if (notDisplayStyle) { btn.hide(); }
                    else {
                        placeholder.before(btn);
                        placeholder.remove();
                    }
                }
            
            }
        });
        
    };
    
})(jQuery);
/* end zebra button plugin */

/*
    
    jQuery selectBox (version 1.0.7)
    
        A cosmetic, styleable replacement for SELECT elements.
    
        Homepage:   http://abeautifulsite.net/blog/2011/01/jquery-selectbox-plugin/
        Demo page:  http://labs.abeautifulsite.net/projects/js/jquery/selectBox/
        
        Copyright 2011 Cory LaViska for A Beautiful Site, LLC.
        
    Features:

        - Supports OPTGROUPS
        - Supports standard dropdown controls
        - Supports multi-select controls (i.e. multiple="multiple")
        - Supports inline controls (i.e. size="5")
        - Fully accessible via keyboard
        - Shift + click (or shift + enter) to select a range of options in multi-select controls
        - Type to search when the control has focus
        - Auto-height based on the size attribute (to use, omit the height property in your CSS!)
        - Tested in IE7-IE9, Firefox 3-4, recent webkit browsers, and Opera
    
    
    License:
        
        Licensed under both the MIT license and the GNU GPLv2 (same as jQuery: http://jquery.org/license)
    
    
    Usage:
        
        Link to the JS file:
            
            <script src="jquery.selectbox.min.js" type="text/javascript"></script>
        
        Add the CSS file (or append contents to your own stylesheet):
        
            <link href="jquery.selectbox.min.css" rel="stylesheet" type="text/css" />
        
        To create:
            
            $("SELECT").selectBox([settings]);
    
    
    Settings:
        
        To specify settings, use this syntax: $("SELECT").selectBox('settings', { settingName: value, ... });
            
            menuTransition: ['default', 'slide', 'fade'] - the show/hide transition for dropdown menus
            menuSpeed: [integer, 'slow', 'normal', 'fast'] - the show/hide transition speed
            loopOptions: [boolean] - flag to allow arrow keys to loop through options
    
    
    Methods:
        
        To call a method use this syntax: $("SELECT").selectBox('methodName', [options]);
        
            create - Creates the control (default method)
            destroy - Destroys the selectBox control and reverts back to the original form control
            disable - Disables the control (i.e. disabled="disabled")
            enable - Enables the control
            value - if passed with a value, sets the control to that value; otherwise returns the current value
            options - pass in either a string of HTML or a JSON object to replace the existing options
            control - returns the selectBox control element (an anchor tag) for working with directly
    
    
    Events:
        
        Events are fired on the original select element. You can bind events like this:
            
            $("SELECT").selectBox().change( function() { alert( $(this).val() ); } );
            
            focus - Fired when the control gains focus
            blur - Fired when the control loses focus
            change - Fired when the value of a control changes
    
    
    Change Log:
        
        v1.0.0 (2011-04-03) - Complete rewrite with added support for inline and multi-select controls
        v1.0.1 (2011-04-04) - Fixed options method so it doesn't destroy/recreate the control when called.
                            - Added a check for iOS devices (their native controls are much better for 
                              touch-based devices; you can still use selectBox API methods for theme)
                            - Fixed issue where IE window would lose focus on XP
                            - Fixed premature selection issue in Webkit browsers
        v1.0.2 (2011-04-13) - Fixed auto-height for inline controls when control is invisible on load
                            - Removed auto-width for dropdown and inline controls; now relies 100% on CSS
                              for setting the width
                            - Added 'control' method for working directly with the selectBox control
        v1.0.3 (2011-04-22) - Fixed bug in value method that errored if the control didn't exist
        v1.0.4 (2011-04-22) - Fixed bug where controls without any options would render with incorrect heights
        v1.0.5 (2011-04-22) - Removed 'tick' image in lieu of background colors to indicate selection
                            - Clicking no longer toggles selected/unselected in multi-selects; use CTRL/CMD and 
                              SHIFT like in normal browser controls
                            - Fixed bug where inline controls would not receive focus unless tabbed into
        v1.0.6 (2011-04-29) - Fixed bug where inline controls could be "dragged" when selecting an empty area
        v1.0.7 (2011-05-18) - Expanded iOS check to include Android devices as well
                            - Added autoWidth option; set to false on init to use CSS widths for dropdown menus
                              
    Known Issues:
    
        - The blur and focus callbacks are not very reliable in IE7. The change callback works fine.
    
*/
if(jQuery) (function($) {
    
    $.extend($.fn, {
        
        selectBox: function(method, data) {
            
            var typeTimer, typeSearch = '';
            
            
            //
            // Private methods
            //
            
            
            var init = function(select, data) {
                
                // Disable for iOS devices (their native controls are more suitable for a touch device)
                if( navigator.userAgent.match(/iPad|iPhone|Android/i) ) return false;
                
                // Element must be a select control
                if( select.tagName.toLowerCase() !== 'select' ) return false;
                
                select = $(select);
                if( select.data('selectBox-control') ) return false;
                
                var control = $('<a class="selectBox" />'),
                    inline = select.attr('multiple') || parseInt(select.attr('size')) > 1;
                
                var settings = data || {};
                if( settings.autoWidth === undefined ) settings.autoWidth = true;
                
                // Inherit class names, style, and title attributes
                control
                    .addClass(select.attr('class'))
                    .attr('style', select.attr('style') || '')
                    .attr('title', select.attr('title') || '')
                    .attr('tabindex', parseInt(select.attr('tabindex')) || '0')
                    .css('display', 'inline-block')
                    .bind('focus.selectBox', function() {
                        if( this !== document.activeElement ) $(document.activeElement).blur();
                        if( control.hasClass('selectBox-active') ) return;
                        control.addClass('selectBox-active');
                        select.trigger('focus');
                    })
                    .bind('blur.selectBox', function() {
                        if( !control.hasClass('selectBox-active') ) return;
                        control.removeClass('selectBox-active');
                        select.trigger('blur');
                    });
                
                if( select.attr('disabled') ) control.addClass('selectBox-disabled');
                
                // Generate control
                if( inline ) {
                    
                    //
                    // Inline controls
                    //
                    var options = getOptions(select, 'inline');
                    
                    control
                        .append(options)
                        .data('selectBox-options', options)
                        .addClass('selectBox-inline')
                        .addClass('selectBox-menuShowing')
                        .bind('keydown.selectBox', function(event) {
                            handleKeyDown(select, event);
                        })
                        .bind('keypress.selectBox', function(event) {
                            handleKeyPress(select, event);
                        })
                        .bind('mousedown.selectBox', function(event) {
                            if( $(event.target).is('A.selectBox-inline') ) event.preventDefault();
                            if( !control.hasClass('selectBox-focus') ) control.focus();
                        })
                        .insertAfter(select);
                    
                    // Auto-height based on size attribute
                    if( !select[0].style.height ) {
                        
                        var size = select.attr('size') ? parseInt(select.attr('size')) : 5;
                        
                        // Draw a dummy control off-screen, measure, and remove it
                        var tmp = control
                            .clone()
                            .removeAttr('id')
                            .css({
                                position: 'absolute',
                                top: '-9999em'
                            })
                            .show()
                            .appendTo('body');
                        tmp.find('.selectBox-options').html('<li><a>\u00A0</a></li>');
                        optionHeight = parseInt(tmp.find('.selectBox-options A:first').html('&nbsp;').outerHeight());
                        tmp.remove();
                        
                        control.height(optionHeight * size);
                        
                    }
                    
                    disableSelection(control);
                    
                } else {
                    
                    //
                    // Dropdown controls
                    //
                    
                    var label = $('<span class="selectBox-label" />'),
                        arrow = $('<span class="selectBox-arrow" />');
                    
                    label.text( $(select).find('OPTION:selected').text() || '\u00A0' );
                    
                    var options = getOptions(select, 'dropdown');
                    options.appendTo('BODY');
                    
                    control
                        .data('selectBox-options', options)
                        .addClass('selectBox-dropdown')
                        .append(label)
                        .append(arrow)
                        .bind('mousedown.selectBox', function(event) {
                            if( control.hasClass('selectBox-menuShowing') ) {
                                hideMenus();
                            } else {
                                event.stopPropagation();
                                // Webkit fix to prevent premature selection of options
                                options.data('selectBox-down-at-x', event.screenX).data('selectBox-down-at-y', event.screenY);
                                showMenu(select);
                            }
                        })
                        .bind('keydown.selectBox', function(event) {
                            handleKeyDown(select, event);
                        })
                        .bind('keypress.selectBox', function(event) {
                            handleKeyPress(select, event);
                        })
                        .insertAfter(select);
                    
                    disableSelection(control);
                        
                }
                
                // Store data for later use and show the control
                select
                    .addClass('selectBox')
                    .data('selectBox-control', control)
                    .data('selectBox-settings', settings)
                    .hide();
                
            };
            
            
            var getOptions = function(select, type) {
                
                var options;
                
                switch( type ) {
                    
                    case 'inline':
                        

                        options = $('<ul class="selectBox-options" />');
                        
                        if( select.find('OPTGROUP').length ) {
                            
                            select.find('OPTGROUP').each( function() {
                                
                                var optgroup = $('<li class="selectBox-optgroup" />');
                                optgroup.text($(this).attr('label'));
                                options.append(optgroup);
                                
                                $(this).find('OPTION').each( function() {
                                    var li = $('<li />'),
                                        a = $('<a />');
                                    li.addClass( $(this).attr('class') );
                                    a.attr('rel', $(this).val()).text( $(this).text() );
                                    li.append(a);
                                    if( $(this).attr('disabled') ) li.addClass('selectBox-disabled');
                                    if( $(this).attr('selected') ) li.addClass('selectBox-selected');
                                    options.append(li);
                                });
                                
                            });
                        
                        } else {
                        
                            select.find('OPTION').each( function() {
                                var li = $('<li />'),
                                    a = $('<a />');
                                li.addClass( $(this).attr('class') );
                                a.attr('rel', $(this).val()).text( $(this).text() );
                                li.append(a);
                                if( $(this).attr('disabled') ) li.addClass('selectBox-disabled');
                                if( $(this).attr('selected') ) li.addClass('selectBox-selected');
                                options.append(li);
                            });
                            
                        }
                        
                        options
                            .find('A')
                                .bind('mouseover.selectBox', function(event) {
                                    addHover(select, $(this).parent());
                                })
                                .bind('mouseout.selectBox', function(event) {
                                    removeHover(select, $(this).parent());
                                })
                                .bind('mousedown.selectBox', function(event) {
                                    event.preventDefault(); // Prevent options from being "dragged"
                                    if( !select.selectBox('control').hasClass('selectBox-active') ) select.selectBox('control').focus();
                                })
                                .bind('mouseup.selectBox', function(event) {
                                    hideMenus();
                                    selectOption(select, $(this).parent(), event);
                                });
                        
                        disableSelection(options);
                        
                        return options;
                    
                    case 'dropdown':
                        
                        options = $('<ul class="selectBox-dropdown-menu selectBox-options" />');
                        
                        if( select.find('OPTGROUP').length ) {
                            
                            select.find('OPTGROUP').each( function() {
                                
                                var optgroup = $('<li class="selectBox-optgroup" />');
                                optgroup.text($(this).attr('label'));
                                options.append(optgroup);
                                
                                $(this).find('OPTION').each( function() {
                                    var li = $('<li />'),
                                        a = $('<a />');
                                    li.addClass( $(this).attr('class') );
                                    a.attr('rel', $(this).val()).text( $(this).text() );
                                    li.append(a);
                                    if( $(this).attr('disabled') ) li.addClass('selectBox-disabled');
                                    if( $(this).attr('selected') ) li.addClass('selectBox-selected');
                                    options.append(li);
                                });
                                
                            });
                            
                        } else {
                            
                            if( select.find('OPTION').length > 0 ) {
                                select.find('OPTION').each( function() {
                                    var li = $('<li />'),
                                        a = $('<a />');
                                    li.addClass( $(this).attr('class') );
                                    a.attr('rel', $(this).val()).text( $(this).text() );
                                    li.append(a);
                                    if( $(this).attr('disabled') ) li.addClass('selectBox-disabled');
                                    if( $(this).attr('selected') ) li.addClass('selectBox-selected');
                                    options.append(li);
                                });
                            } else {
                                options.append('<li>\u00A0</li>');
                            }
                            
                        }
                        
                        options
                            .data('selectBox-select', select)
                            .css('display', 'none')
                            .appendTo('BODY')
                            .find('A')
                                .bind('mousedown.selectBox', function(event) {
                                    event.preventDefault(); // Prevent options from being "dragged"
                                    if( event.screenX === options.data('selectBox-down-at-x') && event.screenY === options.data('selectBox-down-at-y') ) {
                                        options.removeData('selectBox-down-at-x').removeData('selectBox-down-at-y');
                                        hideMenus();
                                    }
                                })
                                .bind('mouseup.selectBox', function(event) {
                                    if( event.screenX === options.data('selectBox-down-at-x') && event.screenY === options.data('selectBox-down-at-y') ) {
                                        return;
                                    } else {
                                        options.removeData('selectBox-down-at-x').removeData('selectBox-down-at-y');
                                    }
                                    selectOption(select, $(this).parent());
                                    hideMenus();
                                }).bind('mouseover.selectBox', function(event) {
                                    addHover(select, $(this).parent());
                                })
                                .bind('mouseout.selectBox', function(event) {
                                    removeHover(select, $(this).parent());
                                });
                        
                        disableSelection(options);
                        
                        return options;
                    
                }
                
            };
            
            
            var destroy = function(select) {
                
                select = $(select);
                
                var control = select.data('selectBox-control');
                if( !control ) return;
                var options = control.data('selectBox-options');
                
                options.remove();
                control.remove();
                select
                    .removeClass('selectBox')
                    .removeData('selectBox-control')
                    .removeData('selectBox-settings')
                    .show();
                
            };
            
            
            var showMenu = function(select) {
                
                select = $(select);
                var control = select.data('selectBox-control'),
                    settings = select.data('selectBox-settings'),
                    options = control.data('selectBox-options');
                if( control.hasClass('selectBox-disabled') ) return false;
                
                hideMenus();
                
                // Auto-width
                if( settings.autoWidth ) options.css('width', control.innerWidth());
                else if(options.innerWidth() < control.innerWidth()) {
                    options.css('width', control.innerWidth() - parseInt(options.css('padding-left')) - parseInt(options.css('padding-right')))
                }
                
                var borderBottomWidth = isNaN(control.css('borderBottomWidth')) ? 0 : parseInt(control.css('borderBottomWidth'));
                // Menu position
                options.css({
                    top: control.offset().top + control.outerHeight() - borderBottomWidth,
                    left: control.offset().left
                });
                
                // Show menu
                switch( settings.menuTransition ) {
                    
                    case 'fade':
                        options.fadeIn(settings.menuSpeed);
                        break;
                    
                    case 'slide':
                        options.slideDown(settings.menuSpeed);
                        break;
                    
                    default:
                        options.show(settings.menuSpeed);
                        break;
                    
                }
                
                // Center on selected option
                var li = options.find('.selectBox-selected:first');
                keepOptionInView(select, li, true);
                addHover(select, li);
                
                control.addClass('selectBox-menuShowing');
                
                $(document).bind('mousedown.selectBox', function(event) {
                    if( $(event.target).parents().andSelf().hasClass('selectBox-options') ) return;
                    hideMenus();
                });
                
            };
            
            
            var hideMenus = function() {
                
                if( $(".selectBox-dropdown-menu").length === 0 ) return;
                $(document).unbind('mousedown.selectBox');
                
                $(".selectBox-dropdown-menu").each( function() {
                    try {
                    var options = $(this),
                        select = options.data('selectBox-select'),
                        control = select.data('selectBox-control'),
                        settings = select.data('selectBox-settings');
                    
                    switch( settings.menuTransition ) {
                        
                        case 'fade':
                            options.fadeOut(settings.menuSpeed);
                            break;
                        
                        case 'slide':
                            options.slideUp(settings.menuSpeed);
                            break;
                            
                        default:
                            options.hide(settings.menuSpeed);
                            break;
                        
                    }
                    
                    control.removeClass('selectBox-menuShowing');
                                        } catch (e) {
                                            //this probably means that the select function
                                            //hasn't been loaded yet
                                        }
                });
                
            };
            
            
            var selectOption = function(select, li, event) {
                
                select = $(select);
                li = $(li);
                var control = select.data('selectBox-control'),
                    settings = select.data('selectBox-settings');
                
                if( control.hasClass('selectBox-disabled') ) return false;
                if( li.length === 0 || li.hasClass('selectBox-disabled') ) return false;
                
                if( select.attr('multiple') ) {
                    
                    // If event.shiftKey is true, this will select all options between li and the last li selected
                    if( event.shiftKey && control.data('selectBox-last-selected') ) {
                        
                        li.toggleClass('selectBox-selected');
                        
                        var affectedOptions;
                        if( li.index() > control.data('selectBox-last-selected').index() ) {
                            affectedOptions = li.siblings().slice(control.data('selectBox-last-selected').index(), li.index());
                        } else {
                            affectedOptions = li.siblings().slice(li.index(), control.data('selectBox-last-selected').index());
                        }
                        
                        affectedOptions = affectedOptions.not('.selectBox-optgroup, .selectBox-disabled');
                        
                        if( li.hasClass('selectBox-selected') ) {
                            affectedOptions.addClass('selectBox-selected');
                        } else {
                            affectedOptions.removeClass('selectBox-selected');
                        }
                        
                    } else if( event.metaKey ) {
                        li.toggleClass('selectBox-selected');
                    } else {
                        li.siblings().removeClass('selectBox-selected');
                        li.addClass('selectBox-selected');
                    }
                    
                } else {
                    li.siblings().removeClass('selectBox-selected');
                    li.addClass('selectBox-selected');
                }
                
                if( control.hasClass('selectBox-dropdown') ) {
                    control.find('.selectBox-label').text(li.text());
                }
                
                // Update original control's value
                var i = 0, selection = [];
                if( select.attr('multiple') ) {
                    control.find('.selectBox-selected A').each( function() {
                        selection[i++] = $(this).attr('rel');
                    });
                } else {
                    selection = li.find('A').attr('rel');
                }
                
                // Remember most recently selected item
                control.data('selectBox-last-selected', li);
                
                // Change callback
                if( select.val() !== selection ) {
                    select.val(selection);
                    select.trigger('change');
                }
                
                return true;
                
            };
            
            
            var addHover = function(select, li) {
                select = $(select);
                li = $(li);
                var control = select.data('selectBox-control'),
                    options = control.data('selectBox-options');
                
                options.find('.selectBox-hover').removeClass('selectBox-hover');
                li.addClass('selectBox-hover');
            };
            
            
            var removeHover = function(select, li) {
                select = $(select);
                li = $(li);
                var control = select.data('selectBox-control'),
                    options = control.data('selectBox-options');
                options.find('.selectBox-hover').removeClass('selectBox-hover');
            };
            
            
            var keepOptionInView = function(select, li, center) {
                
                if( !li || li.length === 0 ) return;
                
                select = $(select);
                var control = select.data('selectBox-control'),
                    options = control.data('selectBox-options'),
                    scrollBox = control.hasClass('selectBox-dropdown') ? options : options.parent(),
                    top = parseInt(li.offset().top - scrollBox.position().top),
                    bottom = parseInt(top + li.outerHeight());
                
                if( center ) {
                    scrollBox.scrollTop( li.offset().top - scrollBox.offset().top + scrollBox.scrollTop() - (scrollBox.height() / 2) );
                } else {
                    if( top < 0 ) {
                        scrollBox.scrollTop( li.offset().top - scrollBox.offset().top + scrollBox.scrollTop() );
                    }
                    if( bottom > scrollBox.height() ) {
                        scrollBox.scrollTop( (li.offset().top + li.outerHeight()) - scrollBox.offset().top + scrollBox.scrollTop() - scrollBox.height() );
                    }
                }
                
            };
            
            
            var handleKeyDown = function(select, event) {
                
                //
                // Handles open/close and arrow key functionality
                //
                
                select = $(select);
                var control = select.data('selectBox-control'),
                    options = control.data('selectBox-options'),
                    settings = select.data('selectBox-settings'),
                    totalOptions = 0,
                    i = 0;
                
                if( control.hasClass('selectBox-disabled') ) return;
                
                switch( event.keyCode ) {
                    
                    case 8: // backspace
                        event.preventDefault();
                        typeSearch = '';
                        break;
                    
                    case 9: // tab
                    case 27: // esc
                        hideMenus();
                        removeHover(select);
                        break;
                    
                    case 13: // enter
                        if( control.hasClass('selectBox-menuShowing') ) {
                            selectOption(select, options.find('LI.selectBox-hover:first'), event);
                            if( control.hasClass('selectBox-dropdown') ) hideMenus();
                        } else {
                            showMenu(select);
                        }
                        break;
                        
                    case 38: // up
                    case 37: // left
                        
                        event.preventDefault();
                        
                        if( control.hasClass('selectBox-menuShowing') ) {
                            
                            var prev = options.find('.selectBox-hover').prev('LI');
                            totalOptions = options.find('LI:not(.selectBox-optgroup)').length;
                            i = 0;
                            
                            while( prev.length === 0 || prev.hasClass('selectBox-disabled') || prev.hasClass('selectBox-optgroup') ) {
                                prev = prev.prev('LI');
                                if( prev.length === 0 ) {
                                    if (settings.loopOptions) {
                                        prev = options.find('LI:last');
                                    } else {
                                        prev = options.find('LI:first');    
                                    }
                                }
                                if( ++i >= totalOptions ) break;
                            }
                            
                            addHover(select, prev);
                            selectOption(select, prev, event);
                            keepOptionInView(select, prev);
                            
                        } else {
                            showMenu(select);
                        }
                        
                        break;
                        
                    case 40: // down
                    case 39: // right
                    
                        event.preventDefault();
                        
                        if( control.hasClass('selectBox-menuShowing') ) {
                            
                            var next = options.find('.selectBox-hover').next('LI');
                            totalOptions = options.find('LI:not(.selectBox-optgroup)').length;
                            i = 0;
                            
                            while( next.length === 0 || next.hasClass('selectBox-disabled') || next.hasClass('selectBox-optgroup') ) {
                                next = next.next('LI');
                                if( next.length === 0 ) {
                                    if (settings.loopOptions) {
                                        next = options.find('LI:first');
                                    } else {
                                        next = options.find('LI:last');
                                    }
                                }
                                if( ++i >= totalOptions ) break;
                            }
                            
                            addHover(select, next);
                            selectOption(select, next, event);
                            keepOptionInView(select, next);
                            
                        } else {
                            showMenu(select);
                        }
                        
                        break;
                        
                }
                
            };
            
            //
            // Is user pressed consecutive keys like uuuu
            //
            var isConsequitiveKeys = function(text)  {
            	l = text.length;
            	if(l>1) {
	            	for(i=0;i<l-1;i++) {
	            		if(text.substr(i,1) != text.substr(i+1,1)) {
	            			return -1;
	            		}
	            	}
	            	return l;
            	}
            	return 1;
            };
            
            var handleKeyPress = function(select, event) {
                
                //
                // Handles type-to-find functionality
                //
                
                select = $(select);
                var control = select.data('selectBox-control'),
                    options = control.data('selectBox-options');
                
                if( control.hasClass('selectBox-disabled') ) return;
                
                switch( event.keyCode ) {
                    
                    case 9: // tab
                    case 27: // esc
                    case 13: // enter
                    case 38: // up
                    case 37: // left
                    case 40: // down
                    case 39: // right
                        // Don't interfere with the keydown event!
                        break;
                    
                    default: // Type to find
                        
                        if( !control.hasClass('selectBox-menuShowing') ) showMenu(select);
                        
                        event.preventDefault();
                        
                        clearTimeout(typeTimer);
                        typeSearch += String.fromCharCode(event.charCode || event.keyCode);
                        keyseq = isConsequitiveKeys(typeSearch);
                        matchCnt = 0;
                        options.find('A').each( function() {
                        	//
                        	// Handle if consecutive keys pressed like uuuu
                        	//
                            if(keyseq != -1) {
                            	if($(this).text().substr(0, 1).toLowerCase() === typeSearch.toLowerCase().substr(0, 1) ) {
                            		matchCnt++;
                            		if(keyseq == matchCnt) {
		                                addHover(select, $(this).parent());
		                                keepOptionInView(select, $(this).parent());
		                                return false;
                            		}
	                            }
                            } else  {
	                        	if( $(this).text().substr(0, typeSearch.length).toLowerCase() === typeSearch.toLowerCase() ) {
	                                addHover(select, $(this).parent());
	                                keepOptionInView(select, $(this).parent());
	                                return false;
	                            }
                            }
                        });
                        
                        // Clear after a brief pause
                        typeTimer = setTimeout( function() { typeSearch = ''; }, 2000);//increased delay for clear text
                        
                        break;
                        
                }
                
            };
            
            
            var enable = function(select) {
                select = $(select);
                select.attr('disabled', false);
                var control = select.data('selectBox-control');
                if( !control ) return;
                control.removeClass('selectBox-disabled');
            };
            
            
            var disable = function(select) {
                select = $(select);
                select.attr('disabled', true);
                var control = select.data('selectBox-control');
                if( !control ) return;
                control.addClass('selectBox-disabled');
            };
            
            
            var setValue = function(select, value) {
                select = $(select);
                select.val(value);
                value = select.val();
                var control = select.data('selectBox-control');
                if( !control ) return;
                var settings = select.data('selectBox-settings'),
                    options = control.data('selectBox-options');
                
                // Update label
                control.find('.selectBox-label').text( $(select).find('OPTION:selected').text() || '\u00A0' );
                
                // Update control values
                options.find('.selectBox-selected').removeClass('selectBox-selected');
                options.find('A').each( function() {
                    if( typeof(value) === 'object' ) {
                        for( var i = 0; i < value.length; i++ ) {
                            if( $(this).attr('rel') == value[i] ) {
                                $(this).parent().addClass('selectBox-selected');
                            }
                        }
                    } else {
                        if( $(this).attr('rel') == value ) {
                            $(this).parent().addClass('selectBox-selected');
                        }
                    }
                });
                
                if( settings.change ) settings.change.call(select);
                
            };
            
            
            var setOptions = function(select, options) {
                
                select = $(select);
                var control = select.data('selectBox-control'),
                    settings = select.data('selectBox-settings');
                
                switch( typeof(data) ) {
                    
                    case 'string':
                        select.html(data);
                        break;
                        
                    case 'object':
                        select.html('');
                        for( var i in data ) {
                            if( data[i] === null ) continue;
                            if( typeof(data[i]) === 'object' ) {
                                var optgroup = $('<optgroup label="' + i + '" />');
                                for( var j in data[i] ) {
                                    optgroup.append('<option value="' + j + '">' + data[i][j] + '</option>');
                                }
                                select.append(optgroup);
                            } else {
                                var option = $('<option value="' + i + '">' + data[i] + '</option>');
                                select.append(option);
                            }
                        }
                        break;
                    
                }
                
                if( !control ) return;
                
                // Remove old options
                control.data('selectBox-options').remove();
                
                // Generate new options
                var type = control.hasClass('selectBox-dropdown') ? 'dropdown' : 'inline',
                    options = getOptions(select, type);
                control.data('selectBox-options', options);
                
                switch( type ) {
                    case 'inline':
                        control.append(options);
                        break;
                    case 'dropdown':
                        control.find('.selectBox-label').text( $(select).find('OPTION:selected').text() || '\u00A0' );
                        $("BODY").append(options);
                        break;
                }
                
            };
            
            
            var disableSelection = function(selector) {
                $(selector)
                    .css('MozUserSelect', 'none')
                    .bind('selectstart', function(event) {
                        event.preventDefault();
                    });
            };
            
            
            //
            // Public methods
            //
            
            
            switch( method ) {
                
                case 'control':
                    return $(this).data('selectBox-control');
                    break;
                
                case 'settings':
                    if( !data ) return $(this).data('selectBox-settings');
                    $(this).each( function() {
                        $(this).data('selectBox-settings', $.extend(true, $(this).data('selectBox-settings'), data));
                    });
                    break;
                
                case 'options':
                    $(this).each( function() {
                        setOptions(this, data);
                    });
                    break;
                
                case 'value':
                    // Empty string is a valid value
                    if( data === undefined ) return $(this).val();
                    $(this).each( function() {
                        setValue(this, data);
                    });
                    break;
                
                case 'enable':
                    $(this).each( function() {
                        enable(this);
                    });
                    break;
                
                case 'disable':
                    $(this).each( function() {
                        disable(this);
                    });
                    break;
                
                case 'destroy':
                    $(this).each( function() {
                        destroy(this);
                    });
                    break;
                
                default:
                    $(this).each( function() {
                        init(this, method);
                    });
                    break;
                
            }
            
            return $(this);
            
        }
        
    });
    
})(jQuery);