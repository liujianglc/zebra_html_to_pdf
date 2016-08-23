var zebralib = {};//namespace
zebralib.Tabs = {
    
    initSubTabsComplete : false ,
    
    initTabs: function(containerDivId , resourcePath , parsysBase, isAuthor , subTabs) {
        
        jQuery(document).ready(function($) {
            /*** Tab Builder ***/
            $('.tab-container').each(function(){
                //filter out those not matching the containingDivId we're targeting.
                //We can't select on an ID in the first place and still use each(),
                //but each is the only way to get a this reference.
                //TODO: Try refactoring all "This" references into one variable 
                //so that we may select on the containerDivId insead of doing each() 
                //and then filtering by ID in the following if condition
                if ( $(this).attr('id') == null || $(this).attr('id') == '' || containerDivId != $(this).attr('id')) {
                    return;
                }
                
                
                
                var tabContainer = $(this), maxTabHeight = 0, tabs, totalTabWidth = 0, maxTabWidth;
                // This checks to see if there are nested tabs
                tabChildTest = tabContainer.find(".tab-content .tab-content");
                if(tabChildTest.length > 0){
                    tabContentSet = tabContainer.find(".tab-content").not(".tab-content .tab-content");
                }
                else{
                    tabContentSet = tabContainer.find(".tab-content");
                }

                $('<div class="tabs clearfix"></div>').prependTo(this);
                tabSet = tabContainer.find(".tabs:first");
        
                var initialActiveTabIndex = 0;
                var initialActiveTabId = null;
                /* 
                    initialActiveTabIndex variable is used only by  the authormode-only code to
                    toggle editables
                 */
                    
                // checks for initial selected tab
                tabSelectedCheck = false;
                tabContentSet.each(function(index){
                    if($(this).attr("data-tab-selected") == "true"){
                        tabSelectedCheck = true;
                        initialActiveTabIndex = index;
                        initialActiveTabId = $(this).attr( "data-tab-id" );
                    }
                });
                // if no default set - set the first
                if(tabSelectedCheck == false){
                    tabContentSet.eq(0).attr("data-tab-selected","true");
                    initialActiveTabIndex = 0;
                    initialActiveTabId = tabContentSet.eq(0).attr( "data-tab-id" );
                }
                
                
        
                tabContentSet.each(function(index){
                    var tooltipHTML = '';
                    if($(this).attr('data-tab-tooltip').length > 0 ) {
                        tooltipHTML = '<span class="tooltip-icon"><span class="tooltip"><span class="txt">'+$(this).attr("data-tab-tooltip")+'</span></span></span>';
                    }
                    $('<div class="tab" id="' + $(this).attr("data-tab-id") + '" ' + '>' + $(this).attr("data-tab-label") + tooltipHTML + '</div>').appendTo(tabSet);
                    if($(this).attr("data-tab-selected") == "true"){
                        $(this).addClass('active');
                        activeTab = tabSet.children(".tab").get(index); 
                    }
                });
        
        
                tabs = tabSet.children(".tab");
        
                // tab click handling within the closure to scope to this tab set
                tabs.click( function() {
                    
                    var tab = $(this), tabIdx = tabs.index(tab);
                    
                    //switch the clicked on tab to the active tab
                    tabs.removeClass("active");
                    $(this).addClass("active");
                    
                    //switch the content which is being presented
                    tabContainer.children( ".tab-content" ).removeClass( "active" );
                    tabContainer.children( ".tab-content[data-tab-id=" + $(this).attr( 'id' ) + "]" ).addClass( "active" ).find( ".col" ).equalizeHeights();
                    
                    //handle editables in author mode
                    if ( isAuthor ) {
                        toggleTabEditables( resourcePath, $(this).attr( "id" ), "" );
                        
                        if ( subTabs && subTabs.length && subTabs.length > 0 ) {
                            tabContainer.children( ".tab-content[data-tab-id=" + $(this).attr( 'id' ) + "]" ).find( '.tab-container .tabs .tab' ).eq(0).click();
                        } 
                        
                    }
                    
                    //Update pages hash data to keep track of what has been clicked in the current context
                    if ( ! isAuthor ) { 
                        HashData.put( $(this).parent().parent().attr('id'), $(this).attr('id') );
                    }
                    
                }); //end of tabs.click function definition
                
                if (isAuthor) {
                    CQ.WCM.on("editablesready", function() {
                        var initialActiveTabNum = initialActiveTabIndex +1;
                        if (subTabs!=null && subTabs.length > 0 ) {
                            //there is a sub tab container, click its first tab
                            //so to toggle its parsyss
                            tabContainer.find('.tab-container .tabs .tab').eq(0).click();
                        }
                        ////toggleTabEditables(resourcePath, initialActiveTabNum , parsysBase);
                        toggleTabEditables(resourcePath, initialActiveTabId , "");
                        
                    });
                }
        
                /* safety for tab widths if tabs would wrap */
                // add up width of all tabs
                tabs.each( function () {
                    totalTabWidth += $(this).outerWidth(true);
                });
                // compare the width of all tabs to the width of the container; if sum of tabs is wider, adjust tab widths
                if ( totalTabWidth > tabContainer.width() ) {
                    // find all tabs that can be shortened via wrapping text and store array - aka find text with a space
                    var tabsToShorten = new Array();
                    tabs.each( function(index) {
                        if($(this).html().indexOf(" ") != -1){
                            tabsToShorten.push(index);
                        }
                    });
            
                    // loop through each tab in shorten array
                    for(t=0; t<tabsToShorten.length; t++){
                        tab = tabs.eq(parseInt(tabsToShorten[t]));
                
                        /* get the width of the text and reduce by 2px to force natural wrapping */ 
                        tab.css("width", ((tab.width()-2)+"px"));
                        /* get new width of wrapped text add 2px for IE fix and set new width */
                        tab.css("width", (tab.textWidth()+2)+"px");
                    }
            
                }
        
                /* tab height normalizer */
                // first, use this loop to find the tallest tab
                tabs.each( function () {
                    // get this tab height
                    var tabHeight = $(this).height();
                    /*
                        if the max tab height has been set (is not still 0), and this tab height doesn't equal that value,
                        there are tabs of differing lines and a class should be added to the tab container to indicate that.
                        The last check is just to see if it's not there already, if it's not, it should be added
                     */
                    if ( (maxTabHeight !== 0) && (tabHeight !== maxTabHeight) && (!tabSet.hasClass("multiline")) ) {
                        tabSet.addClass("multiline");
                    }
                    // record the largest height value
                    if (tabHeight > maxTabHeight) {
                        maxTabHeight = tabHeight;
                    }
                } );
                tabs.each( function (){
                    var tab = $(this), tabHeight = tab.height(), tabContent;
                    /*
                        if this tab is not already naturally at the largest height value, pad it out vertically to center it,
                        and to make the total height equal the largest height value
                     */
                    if (tabHeight < maxTabHeight) {
                        tab.html( "<div style='padding: " + Math.floor( (maxTabHeight - tabHeight)/2 ) + "px 0 " + Math.ceil( (maxTabHeight - tabHeight)/2 ) + "px'>" + tab.html() + "</div>" );
                    }
                });
        
                /* now select active tab for IE7's height calculation problems */
                $(activeTab).addClass('active');
        
                /* IE corner fix */
                // if it's IE7-8, explicitly put rounded corner absolutely positioned images in top left and right corners of tabs
                if ( ($.browser.msie) && ($.browser.version < 9) ) {
                    tabs.each( function () {
                        $(this).append( $("<span>", {
                            "class":"tab-left-corner"
                        }) ).append( $("<span>", {
                            "class":"tab-right-corner"
                        }) );
                    } );
                }
                
                /*
                 * Check if the user already has a tab selected via hash deep linking
                 */
                var deepLinkTab = HashData.get( tabContainer.attr('id') );
                if ( deepLinkTab.length && deepLinkTab.length > 0 ) { 
                    //force a click action on the deep linked tab
                    $( '#' + deepLinkTab[0], tabContainer ).click();
                }
                
                
            }); //end of tab container each function definition

        }); //End of document(ready)
    /***^Tab Builder^***/
    } ,
    
    initSubTabs: function(containerDivId , resourcePath , parsysBase, isAuthor) {
        jQuery(document).ready(function($) {
            
            /*** Tab Builder ***/
            $('.tab-container .tab-container').each(function(){
                //filter out those not matching the containingDivId we're targeting.
                //We can't select on an ID in the first place and still use each(),
                //but each is the only way to get a this reference.
                //TODO: Try refactoring all "This" references into one variable 
                //so that we may select on the containerDivId
                if ( $(this).attr('id') == null || $(this).attr('id') == '' || containerDivId != $(this).attr('id')) {
                    return;
                }
                               
                var tabContainer = $(this), maxTabHeight = 0, tabs, totalTabWidth = 0, maxTabWidth;
                // This checks to see if there are nested tabs
                tabChildTest = tabContainer.find(".tab-content .tab-content");
                if(tabChildTest.length > 0){
                    tabContentSet = tabContainer.find(".tab-content").not(".tab-content .tab-content");
                }
                else{
                    tabContentSet = tabContainer.find(".tab-content");
                }

               
                tabSet = tabContainer.find(".tabs:first");
        
                var initialActiveTabIndex = 0;
                var initialActiveTabId = null;
                /* 
                    initialActiveTabIndex variable is used only by  the authormode-only code to
                    toggle editables
                 */
                    
                // checks for initial selected tab
                tabSelectedCheck = false;
                tabContentSet.each(function(index){
                    if($(this).attr("data-tab-selected") == "true"){
                        tabSelectedCheck = true;
                        initialActiveTabIndex = index;
                        initialActiveTabId = $(this).attr( "data-tab-id" );
                    }
                });
                // if no default set - set the first
                if(tabSelectedCheck == false){
                    tabContentSet.eq(0).attr("data-tab-selected","true");
                    initialActiveTabIndex = 0;
                    initialActiveTabId = tabContentSet.eq(0).attr( "data-tab-id" );
                }
                
                if (isAuthor) {
                    CQ.WCM.on("editablesready", function() {
                        var initialActiveTabNum = initialActiveTabIndex +1;
                        toggleTabEditables(resourcePath, initialActiveTabId , "" );
                    });
                }
        
        
                tabContentSet.each(function(index){
                    if($(this).attr("data-tab-selected") == "true"){
                        $(this).addClass('active');
                        activeTab = tabSet.children("#" + $(this).attr( "data-tab-id" ) ); 
                    }
                });
                //tabContentSet.wrapAll('<div class="tab-contents" />');
        
        
                tabs = tabSet.children(".tab");
        
                // tab click handling within the closure to scope to this tab set
                tabs.click( function() {
                    var tab = $(this), tabIdx = tabs.index(tab);
                    var tabId = $(this).attr( "id" );
                    
                    //establish the active tab
                    tabs.removeClass("active");
                    $(this).addClass("active");
                    
                    tabContainer.children(".tab-content").removeClass("active");
                    tabContainer.children(".tab-content[data-tab-id=" + tabId + "]").addClass("active").find(".col").equalizeHeights();
            
                    // AA > insert loading function here
                    //progressBar(); TODO: This progress bar was probably put here by manifest digital for a reason. Should research which functionality we broke, but this script no longer executes inside
                    if (isAuthor) {
                        //hide or show CQ editables in other tabs
                        tabNumber = tabIdx + 1;
                        toggleTabEditables(resourcePath, tabId , "");
                    }
                    
                });
                
                
        
                /* safety for tab widths if tabs would wrap */
                // add up width of all tabs
                tabs.each( function () {
                    totalTabWidth += $(this).outerWidth(true);
                });
                // compare the width of all tabs to the width of the container; if sum of tabs is wider, adjust tab widths
                if ( totalTabWidth > tabContainer.width() ) {
                    // find all tabs that can be shortened via wrapping text and store array - aka find text with a space
                    var tabsToShorten = new Array();
                    tabs.each( function(index) {
                        if($(this).html().indexOf(" ") != -1){
                            tabsToShorten.push(index);
                        }
                    });
            
                    // loop through each tab in shorten array
                    // IM-2514 changes for  WIDTH ISSUE
                    for(t=0; t<tabsToShorten.length; t++){
                        tab = tabs.eq(parseInt(tabsToShorten[t]));
                        var tabTextWidth = '<span id="tab-width" style="display:none">' + tab.text() + '</span>';
                        $('body').append(tabTextWidth);
                        var width = $('body').find('#tab-width').width();
                        $('body').find('#tab-width').remove();
                         //get the width of the text and reduce by 2px to force natural wrapping  
                        tab.css("width", ((width-2)+"px"));
                         //get new width of wrapped text add 2px for IE fix and set new width 
                        tab.css("width", (width+2)+"px");
                    }
            
                }
        
                /* tab height normalizer */
                // first, use this loop to find the tallest tab
                tabs.each( function () {
                    // get this tab height
                    var tabHeight = $(this).height();
                    /*
                        if the max tab height has been set (is not still 0), and this tab height doesn't equal that value,
                        there are tabs of differing lines and a class should be added to the tab container to indicate that.
                        The last check is just to see if it's not there already, if it's not, it should be added
                     */
                    if ( (maxTabHeight !== 0) && (tabHeight !== maxTabHeight) && (!tabSet.hasClass("multiline")) ) {
                        tabSet.addClass("multiline");
                    }
                    // record the largest height value
                    if (tabHeight > maxTabHeight) {
                        maxTabHeight = tabHeight;
                    }
                } );
                tabs.each( function (){
                    var tab = $(this), tabHeight = tab.height(), tabContent;
                    /*
                        if this tab is not already naturally at the largest height value, pad it out vertically to center it,
                        and to make the total height equal the largest height value
                     */
                    if (tabHeight < maxTabHeight) {
                        tab.html( "<div style='padding: " + Math.floor( (maxTabHeight - tabHeight)/2 ) + "px 0 " + Math.ceil( (maxTabHeight - tabHeight)/2 ) + "px'>" + tab.html() + "</div>" );
                    }
                    //IM-2514 fix
                    tab.css("height", (tabHeight-30)+"px");
                    tab.css("height", (tabHeight+30)+"px");
                });
        
                /* now select active tab for IE7's height calculation problems */
                $(activeTab).addClass('active');
        
                /* IE corner fix */
                // if it's IE7-8, explicitly put rounded corner absolutely positioned images in top left and right corners of tabs
               // if ( ($.browser.msie) && ($.browser.version < 9) ) {
                //    tabs.each( function () {
               //         $(this).append( $("<span>", {
                //            "class":"tab-left-corner"
               //         }) ).append( $("<span>", {
               //             "class":"tab-right-corner"
               //         }) );
              //      } );
               // }
            });
    
        });
    /***^Sub Tab Builder^***/
    } ,
    
    hideTabsForAuthor : function() {
        jQuery('.tab-content').each(function() {
            jQuery(this).addClass('tab-content-hide');
        }); 
    }
}


/**
 * A managing singleton for keeping track of the recently viewed pages. 
 * 
 */
zebralib.RecentlyViewedManager = {

    /**
     * Private
     * 
     * String where this manager is going to house its cookie
     */
    cookieString : "zebra_global_recentlyviewed", 
        
    /**
     * Private
     * 
     * Array of recently viewed pages.  Each array element is expected to take the form {url, title} where the 
     * url is appropriate for insertion as the HREF of an a tag and the title is appropriate for display.
     */
    recentlyViewed : Array(),
        
    /**
     * Private
     * 
     * The limit to store in recentlyViewed.  
     */
    limit : 3, 
        
    /**
     * Private
     * 
     * An array of path portions defining what resource paths to store as recent requests.  This essentially acts 
     * as a filter to the recent request component.  To have more request types stored, simply add to this list.
     */
    requestPathsToStore : Array( /^\/\w*\/\w*\/solutions/, /^\/\w*\/\w*\/products/ ),
        
    /**
     * Set the limit of recently viewed items to present to the user.
     * 
     * @param int limit The limit of the number of recently viewed pages to store for later presentation
     */
    setLimit : function( limit ) { 
            
        this.limit = limit;
            
    },
        
    getRecentlyViewed : function() { 
            
        var retArray = Array();
        var minusOne = 0;
            
        /*
         * See if the first item in our array is the current page.  If it is, ignore it
         */
        if ( this.recentlyViewed.length > 0 && this.recentlyViewed[ this.recentlyViewed.length - 1 ].url == jQuery(location).attr('pathname') ) {
            minusOne = -1;
        }
            
        for ( var i=0; i<this.recentlyViewed.length + minusOne; i++ ) {
            retArray.push( this.recentlyViewed[i] );
        }
        if ( retArray.length > this.limit ) { 
            retArray.shift();
        }
            
        return retArray;
            
    },

    /**
     * Adds a recently viewed item to the recently viewed array if such an item does not already exist.
     * 
     * In the case where a URL is being added which is already in the recently viewed list, it is moved to the top 
     * of the list but not duplicated within the list.
     * 
     * A limit of n items are allowed in the recently viewed list.
     */
    addRecentlyViewed : function( url, title ) { 
            
        var runRecentlyViewed = false;
            
        /*
         * See if we should store the page based on our internal list of paths to store
         */
        for ( var i=0; i<this.requestPathsToStore.length; i++ ) { 
                
            if ( this.requestPathsToStore[i].exec( jQuery(location).attr('pathname') ) ) {
                runRecentlyViewed = true;
            }
                
        }
            
        if ( runRecentlyViewed ) { 
            
            /*
             * Iterate through the recently viewed list to see if it already contains the URL we are trying to add.
             * If it does, we remove that item.  It gets added back later in the method.
             */
            for ( var i = 0; i < this.recentlyViewed.length ; i++ ) { 
                    
                if ( this.recentlyViewed[ i ].url == url ) { 
                    this.recentlyViewed.splice( i, 1 );
                }
                    
            }
                
            /*
             * See if we are at our limit.  If we are, slide an item off the array
             */
            if ( this.recentlyViewed.length >= this.limit + 1 ) {
                this.recentlyViewed.shift();
            }
                
            /*
             * Add our new recently viewed link definition
             */
            this.recentlyViewed.push( {
                url: url, 
                title: title
            } );
                
            /*
             * Save a new cookie definition
             */
            this.save();
            
        }
            
    }, 
        
    /**
     * Read in the recently viewed cookies list from zebra_global_recentlyviewed and store it in the 
     * recentlyViewed array
     */
    init : function( limit, runRecentlyViewed ) { 
            
        this.limit = limit || 3;
        this.runRecentlyViewed = runRecentlyViewed || false; 
            
            
        try {
            var cookieVal = jQuery.cookie( this.cookieString );

            this.recentlyViewed = jQuery.parseJSON( cookieVal ) || Array(); 
        }
        catch ( e ) { 
        //do nothing - let recently viewed remain empty if something went wrong
        }
            
            
    },
        
    /**
     * Saves the recentlyViewed array as a json rendering of the object
     */
    save : function() { 
            
        var s = "[";
            
        for ( var i=0; i<this.recentlyViewed.length; i++ ) { 
                
            s += 
            "{ \"url\": \"" + 
            this.recentlyViewed[ i ].url + 
            "\", \"title\": \"" + 
            this.recentlyViewed[ i ].title + 
            "\"} ,";
                
        }
            
        //trim the last comma
        s = s.substr( 0, s.length - 1 );   
        s += "]"
                
        var topLevelPath = window.location.pathname.substr(1);
        topLevelPath = "/" + topLevelPath.substr(0 , topLevelPath.indexOf("/"));
                
        jQuery.cookie( this.cookieString, s, {
            path: topLevelPath
        } );
            
    }
};// end zebralib.Tabs

zebralib.filterDropdown = {
    filter : function(elementName , dependentElementName) {
        if (dependentElementName==null || dependentElementName==undefined || dependentElementName.length ==0) {
            return;
        }
        var selectTarget = jQuery('select[name='+elementName+']');
        dependentValue = jQuery('select[name='+dependentElementName+']').val();
        var shown = 0;
        jQuery('select[name='+elementName+'] option').each( function() {
            var thisVal = jQuery(this).attr('value');
            var elementDefaultVal = (!thisVal || thisVal==null || thisVal==undefined || thisVal == "" ||thisVal == " " );
            var dependentDefaultVal = (dependentValue === "" ||dependentValue === " " );
            var dependentValSelected = false;
            
            for (var i=1; true ;i++) {
                var depVal = jQuery(this).data("dependent-value"+i);
                if(depVal && depVal.length > 0) {
                    if (depVal === dependentValue) {
                        dependentValSelected=true;
                        break;
                    }
                } else {
                    //we've reached the end of defined dependent values for this option
                    break;
                }
            }
            
            if ( elementDefaultVal || ( !dependentDefaultVal && dependentValSelected ) ) {
                jQuery(this).removeClass('hidden');
                if (!elementDefaultVal){
                    shown++;
                }
            } else {
                jQuery(this).addClass('hidden');
            }
            
        });
        //update selectbox
        selectTarget.selectBox('options' , selectTarget.html());
        //enable or disable based on whether or not any options exist.
        //do the same for selectbox
        if (shown > 0 ) {
            selectTarget.removeAttr("disabled");
            selectTarget.selectBox('enable');
        } else {
            selectTarget.attr("disabled", "disabled");
            selectTarget.selectBox('disable');
        }
        selectTarget.change();
    }
};
zebralib.formElement = {
    changeInputByCountrydropdown : function($ , elementName , countryDrop, anyCountryName) {
        var newCountry = countryDrop.val();
        var targetElement = $('input[name="'+elementName+'"]');
        if (targetElement.length==0) {
            targetElement = $('textarea[name="'+elementName+'"]');
        }
        var json = targetElement.data('country-dynamic-values');
        var country = json[newCountry];
        var anyCountry = json[anyCountryName];
        if (country == undefined) {
            country = json[anyCountryName];
        }
        if (country!=undefined) {
            var hide = country.hide;
            if (hide==null || hide.length < 1) {
                hide = anyCountry.hide;
            }
            var value = country.newValue;
            if (value==null || value.length < 1) {
                value = anyCountry.newValue;
            }
            var required = country.required;
            if (required==null || required.length < 1) {
                required = anyCountry.required;
            }
            if (required==null || required.length < 1) {
                //no required configs at all, use whatever the author orginally gave
                required = targetElement.data('authored-required');
            }
            var targetShowHide;
            var parentSection = targetElement.closest('.section');
            if (parentSection!=undefined && parentSection !=null) {
                targetShowHide = parentSection;
            } else {
                targetShowHide = targetElement;
            }
            if (hide == "show") {
                targetShowHide.show();
            } 
            if (hide == "hide") {
                targetShowHide.hide();
            }
            if (value!=undefined && value.length > 0) {
                targetElement.val(value);
            }
            if (required == "yes" || required == true|| required =='true') {
                zebralib.formElement.drawRequired($ , targetElement , true);
                zebralib.formElement.setRequired($ , targetElement , true);
            } else {
                zebralib.formElement.drawRequired($ , targetElement , false);
                zebralib.formElement.setRequired($ , targetElement , false);
            }
        }
    },
    changeSelectByCountrydropdown : function($ , elementName , countryDrop, anyCountryName) {
        var newCountry = countryDrop.val();
        var targetElement = $('select[name="'+elementName+'"]');
        var json = targetElement.data('country-dynamic-values');
        var country = json[newCountry];
        var anyCountry = json[anyCountryName];
        if (country == undefined) {
            country = json[anyCountryName];
        }
        if (country!=undefined) {
            var hide = country.hide;
            if (hide==null || hide.length < 1) {
                hide = anyCountry.hide;
            }
            var value = country.newValue;
            if (value==null || value.length < 1) {
                value = anyCountry.newValue;
            }
            var required = country.required;
            if (required==null || required.length < 1) {
                required = anyCountry.required;
            }
            if (required==null || required.length < 1) {
                //no required configs at all, use whatever the author orginally gave
                required = targetElement.data('authored-required');
            }
            var targetShowHide;
            var parentSection = targetElement.closest('.section');
            if (parentSection!=undefined && parentSection !=null) {
                targetShowHide = parentSection;
            } else {
                targetShowHide = targetElement;
            }
            if (hide == "show") {
                targetShowHide.show();
            } 
            if (hide == "hide") {
                targetShowHide.hide();
            }
            if (required == "yes" || required == true|| required =='true') {
                zebralib.formElement.drawRequired($ , targetElement , true);
                zebralib.formElement.setRequired($ , targetElement , true);
            } else {
                zebralib.formElement.drawRequired($ , targetElement, false);
                zebralib.formElement.setRequired($ , targetElement , false);
            }
        //value changing not supported for select menu - use the filtering capability to accomplish this
        //            if (value!=undefined && value.length > 0) {
        //                targetElement.val(value);
        //            }
        }
    } , 
    changeCheckboxByCountrydropdown : function($ , elementName , countryDrop, anyCountryName) {
        var newCountry = countryDrop.val();
        var targetElements = $('input[name="'+elementName+'"]');
        var targetElement = targetElements.first();
        var json = targetElement.closest('.form_row').data('country-dynamic-values');
        var country = json[newCountry];
        var anyCountry = json[anyCountryName];
        if (country == undefined) {
            country = json[anyCountryName];
        }
        if (country!=undefined) {
            var hide = country.hide;
            if (hide==null || hide.length < 1) {
                hide = anyCountry.hide;
            }
            var value = country.newValue;
            if (value==null || value.length < 1) {
                value = anyCountry.newValue;
            }
            var required = country.required;
            if (required==null || required.length < 1) {
                required = anyCountry.required;
            }
            if (required==null || required.length < 1) {
                //no required configs at all, use whatever the author orginally gave
                required = targetElement.closest('.form_row').data('authored-required');
            }
            var targetShowHide;
            var parentSection = targetElements.first().closest('.section');
            if (parentSection!=undefined && parentSection !=null) {
                targetShowHide = parentSection;
            } else {
                targetShowHide = targetElements;
            }
            if (hide == "show") {
                targetShowHide.show();
            } 
            if (hide == "hide") {
                targetShowHide.hide();
            }
            if (required == "yes" || required == true|| required =='true') {
                zebralib.formElement.drawRequired($ , targetElement , true , true);
                zebralib.formElement.setRequired($ , targetElement.closest('.form_row') , true);
            } else {
                zebralib.formElement.drawRequired($ , targetElement , false , true);
                zebralib.formElement.setRequired($ , targetElement.closest('.form_row') , false);
            }
            
            //uncheck all values
            targetElements.each(function() {
                $(this).removeAttr('checked');
            }); 
            
            //check only those matching a value for the country selected
            if (value!=null && value!= undefined){
                var values = value.split('|');
                if (values!=undefined && values.length > 0) {
                    var valuesLen = values.length;
                    for (var i = 0; i < valuesLen;i++) {
                        targetElements.each(function() {
                            if ($(this).val() == values[i]){
                                $(this).attr('checked','checked');
                            }
                        }); 
                    }
                }
            }
        }
    }, 
    drawRequired : function($ , targetElement, required , isCheckbox) {
        
        var form_row = targetElement.closest('.form_row');
        if (isCheckbox) {
            form_row = form_row.siblings('.form_row').first();
        }
        var form_leftcol = form_row.find('.form_leftcol:first');
        if (form_leftcol.length> 0 ) {//if length is zero, there is no left col and no reason to draw asterisk
            var form_leftcolmark = form_leftcol.find('.form_leftcolmark');
            if (required) {
                if (form_leftcolmark.length < 1) {
                    form_leftcol.append('<div class="form_leftcolmark"> *</div>');
                } else {
                    form_leftcolmark.html(' *');
                }
            } else {
                if (form_leftcolmark.length >0) {
                    form_leftcolmark.remove();
                }
            }
            
        } 
    },
    setRequired : function($ , targetElement , required) {
        targetElement.data('required' , (required?'yes':'no') );
    }   
    
};
zebralib.roi={
        
    setInitial : function(){
    	timeyearVar = true;
        costyearVar = true;
    },
        
    toDecimal : function(num, Digits) 
    {
        temp = "";
        //if(!isNaN(num)) return;
        if(Digits > 0)
        {
            n = Math.round(num * Math.pow(10, Digits));
            for(i = 0; i < Digits; i++)
            {
                d = n % 10;
                n = (n - d)/10;
                temp = (d + "") + temp;
            }
            temp = "." + temp;
        }
        else n = num;
        //if you need "," eg: 123,465.78 
        while(n > 999)
        {
            temp1 = "";
            for(i = 0; i < 3; i++)
            {
                d = Math.floor(n) % 10;
                n = Math.floor((n - d)/10);
                temp1 = (d + "") + temp1;
            }
            temp = "," + temp1 + temp;
        }
        return n + temp;
    },
        
    calcSavings : function(form)
    {
        if (timeyearVar) {
            //alert('time year');
            var fixed_time = eval(form.labels.value) * eval(form.label_time.value) * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60;
            var mobile_time = eval(form.labels.value) * 0.5 * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60;
        }
        else {
            //alert('time month');
            var fixed_time = eval(form.labels.value) * eval(form.label_time.value) * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60 / 12;
            var mobile_time = eval(form.labels.value) * 0.5 * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60 / 12;
        }
        form.fixed_time.value = zebralib.roi.toDecimal(parseInt(fixed_time, 10), 0) + ' hrs';
        form.mobile_time.value = zebralib.roi.toDecimal(parseInt(mobile_time, 10), 0)  + ' hrs';
        var savings_time = fixed_time - mobile_time;
        form.savings_time.value = zebralib.roi.toDecimal(parseInt(savings_time, 10), 0) + ' hrs';
        if (costyearVar) {
            //alert('cost year')
            var fixed_time = eval(form.labels.value) * eval(form.label_time.value) * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60;
            var mobile_time = eval(form.labels.value) * 0.5 * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60;
            var fixed_cost = eval(form.labour_hour.value) * fixed_time;
            var mobile_cost = eval(form.labour_hour.value) * mobile_time;
        }
        else {
            //alert('cost month')
            var fixed_time = eval(form.labels.value) * eval(form.label_time.value) * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60 / 12;
            var mobile_time = eval(form.labels.value) * 0.5 * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60 / 12;
            var fixed_cost = eval(form.labour_hour.value) * fixed_time; 
            var mobile_cost = eval(form.labour_hour.value) * mobile_time;
        }
        form.fixed_cost.value = form.units.value + ' ' + zebralib.roi.toDecimal(parseInt(fixed_cost, 10), 2);
        form.mobile_cost.value = form.units.value + ' ' + zebralib.roi.toDecimal(parseInt(mobile_cost, 10), 2);
        var savings_cost = fixed_cost - mobile_cost;
        form.savings_cost.value = form.units.value + ' ' + zebralib.roi.toDecimal(parseInt(savings_cost, 10), 2);
        if(form.cost_printer != null && form.cost_printer.value > 0){
            var printer_cost = eval(form.cost_printer.value) * eval(form.printers_store.value) * eval(form.stores.value);
            form.printer_cost.value = form.units.value + ' ' + zebralib.roi.toDecimal(parseInt(printer_cost, 10), 2);
        }
        zebralib.roi.reColor(form);
    },
        
    calcPayback : function(form) {
        var fixed_time = eval(form.labels.value) * eval(form.label_time.value) * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60;
        var mobile_time = eval(form.labels.value) * 0.5 * eval(form.weeks.value) * eval(form.hours.value) * eval(form.stores.value) / 60;
        var fixed_cost = eval(form.labour_hour.value) * fixed_time;
        var mobile_cost = eval(form.labour_hour.value) * mobile_time;
        var savings_cost = fixed_cost - mobile_cost;
        var savings_month = savings_cost/12;
        var printer_cost = eval(form.cost_printer.value) * eval(form.printers_store.value) * eval(form.stores.value);
        var payback_period = printer_cost/savings_month;
        form.payback_period.value = zebralib.roi.toDecimal(Math.round(payback_period), 0);
    },
        
    changeCurrency : function(form)
    {
        form.units2.selectedIndex = form.units.selectedIndex;
        if (form.savings_time.value) {
            form.fixed_cost.value = form.units.value + form.fixed_cost.value.substring(1, form.fixed_cost.value.length);
            form.mobile_cost.value = form.units.value + form.mobile_cost.value.substring(1, form.mobile_cost.value.length);
            form.savings_cost.value = form.units.value + form.savings_cost.value.substring(1, form.savings_cost.value.length);
        }
        if (form.printer_cost.value) {
            form.printer_cost.value = form.units.value + form.printer_cost.value.substring(1, form.printer_cost.value.length);
        }
    },
        
    changeCurrency2 : function (form) {
        form.units.selectedIndex=form.units2.selectedIndex;
        zebralib.roi.changeCurrency(form);
    },
    reColor : function (form) {
        var timeyearelement=document.getElementById('timeyear');
        var costyearelement=document.getElementById('costyear');
        var timemonthelement=document.getElementById('timemonth');
        var costmonthelement=document.getElementById('costmonth');
            
        if (timeyearVar) {
            timeyearelement.className='on';
            timemonthelement.className='off';
        }
        else {
            timeyearelement.className='off';
            timemonthelement.className='on';
        }
        if (costyearVar) {
            costyearelement.className='on';
            costmonthelement.className='off';
        }
        else {
            costyearelement.className='off';
            costmonthelement.className='on';
        }
    },
    yearMonth : function (form, savings) {
        //alert(savings);
        switch (savings) {
            case 'time':
                if (timeyearVar) {
                    //alert('time: year -> month');
                    timeyearVar=false;
                    zebralib.roi.calcSavings(form);
                }
                break;
            case 'cost':
                if (costyearVar) {
                    //alert('cost: year -> month');
                    costyearVar=false;
                    zebralib.roi.calcSavings(form);
                }
                break;
        }
    },
        
    monthYear : function(form, savings) {
        switch (savings) {
            case 'time':
                if (!timeyearVar) {
                    //alert('time: month -> year');
                    timeyearVar=true;
                    zebralib.roi.calcSavings(form);         
                }
                break;
            case 'cost':
                if (!costyearVar) {
                    //alert('cost month -> year');
                    costyearVar=true;
                    zebralib.roi.calcSavings(form);
                }
                break;
        }
    }

}

zebralib.roi.printermgmt = {
        
    setInitial : function(){
        var timeyearVar = true;
        var costyearVar = true;
        var V;
        var Y;
    },
        
    calcSavings : function(form)
    {
        Y = eval(form.A.value) * eval(form.B.value) + eval(form.Z.value);
        form.Y.value = zebralib.roi.toDecimal( Y );
        form.X.value = zebralib.roi.toDecimal( ( eval(form.A.value) - 1 ) * ( eval(form.C.value) * eval(form.E.value) ) );
        var W = ( eval(form.H.value) * ( eval(form.F.value) * eval(form.G.value) )) + ( eval(form.I.value) * ( eval(form.F.value) * eval(form.G.value) ))
        form.W.value = zebralib.roi.toDecimal( W );
        var YS1 = ( eval(form.A.value) - 1 ) * ( eval(form.C.value) * eval(form.E.value) ) + ( eval(W) * 12 )
        var YS2 = eval(W) * 12;
        var YS3 = eval(W) * 12;
        form.YS1.value=zebralib.roi.toDecimal( YS1 );
        form.YS2.value=zebralib.roi.toDecimal( YS2 );
        form.YS3.value=zebralib.roi.toDecimal( YS3 );
        V = YS1 + YS2 + YS3;
        form.V.value = zebralib.roi.toDecimal( V );
        form.VM.value = zebralib.roi.toDecimal( V / 36 );
    },
        
    calcPayback : function (form) {
        form.payback_period.value = zebralib.roi.toDecimal( (Y / (V / 36)), 1 );
    }
}

/**
 * Begin library for any 'category browsers' components
 */
zebralib.CategoryBrowser = {
    init : function($) {
        $('.supplies-landing a').click(function(){
            if(HashData){
                var newHref = $(this).attr('href');  
                newHref += window.location.hash;
                $(this).attr('href' , newHref);
            }
            return true;
        });
    }
}

jQuery(document).ready( function( $ ) { 
    //run the init
    zebralib.RecentlyViewedManager.init(); 
    //then store off where we're at
    zebralib.RecentlyViewedManager.addRecentlyViewed( $(location).attr('pathname'), $(this).attr('title') );
    //Initialize any category browsers components
    zebralib.CategoryBrowser.init($);
    //remove the legacy SSO cookie that is causing a 400 error when linking to the old site
    jQuery.cookie('downloadCookie', 'set', {path:'/', domain:'zebra.com'});
});

jQuery(document).ready(function(){

	var isMobile = {
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
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
	    }
	};        
	if(isMobile.any()){
		jQuery("input[type=text], textarea, select, radio, checkbox").focus(function(){
			zoomDisable();
		});
		jQuery("input[type=text], textarea, select, radio, checkbox").blur(function(){
			zoomEnable();
		});
		
		function zoomDisable(){
		  jQuery('head meta[name=viewport]').remove();
		  jQuery('head').prepend('<meta name="viewport" content="user-scalable=0" />');
		}
		function zoomEnable(){
		  jQuery('head meta[name=viewport]').remove();
		  jQuery('head').prepend('<meta name="viewport" content="width=device-width" />');
		}
		
		if(window.orientation == 0){
			jQuery(".horizontal-list").css({"border":"1px solid #d0e2ff",
			"margin":"10px auto 10px auto"});
			jQuery(".nav > ul > li > a").css({
				"padding":"15px 8px 0px"
			});
			jQuery(".horizontal-list li").css({
				"float":"none",
				"border-bottom":"1px solid #d0e2ff",
				"background":"url('../images/bg-nav.png') no-repeat"
			});

		}else{
			jQuery(".horizontal-list").css({"border":"none",
			"margin":"0 auto"});
			jQuery(".nav > ul > li > a").css({
				"padding":"5px 0px 0px 20px"
			});
			jQuery(".horizontal-list li").css({
				"float":"left",
				"border":"none",
				"background":"none"
			});

		}
		jQuery(window).bind('orientationchange', function(e) {
			if(window.orientation == 0){
				jQuery(".horizontal-list").css({"border":"1px solid #d0e2ff",
				"margin":"10px auto 10px auto"});
				jQuery(".nav > ul > li > a").css({
					"padding":"15px 8px 0px"
				});
				jQuery(".horizontal-list li").css({
					"float":"none",
					"border-bottom":"1px solid #d0e2ff",
					"background":"url('../images/bg-nav.png') no-repeat"
				});

			}else{
				jQuery(".horizontal-list").css({"border":"none",
				"margin":"0 auto"});
				jQuery(".nav > ul > li > a").css({
					"padding":"5px 0px 0px 20px"
				});
				jQuery(".horizontal-list li").css({
					"float":"left",
					"border":"none",
					"background":"none"
				});

			}

		});
		
		jQuery(".megaDropDownNav").addClass('inner').prepend('<div class="nav-button zebra-btn buttonized"><span class="text">Menu</span></div>');
		jQuery(".search-container").addClass('inner').prepend('<div class="search-button zebra-btn buttonized"><span class="text">Search</span></div>');
		jQuery(".home-top-banner").remove();
		jQuery(".home-banner-overlay-video").remove();
		jQuery(".home-video-background").remove();
		jQuery(".home-banner-overlay").remove();
		jQuery(".inner").wrapAll('<div class="new-wrapper" />');
		jQuery(".news-scroller").trigger('stopScroll');
		jQuery(".horizontal-list li div").remove();
		jQuery(".main-nav-dropdown-bg").remove();
		jQuery(".logo").append(jQuery('.change-country'));
		
		
		var myZebraLogin = jQuery(".login-bar > .my-zebra").html();
		var partnerLogin = jQuery(".login-bar > .partner-login").wrap('<div></div>').parent().html();
		var myZebraItem = jQuery('#solutionsNav').clone().attr('id', 'myzebraloginnav').prepend(myZebraLogin);
		myZebraItem.find('a:eq(1)').remove();
		var partnerLoginItem = jQuery('#solutionsNav').clone().attr('id', 'partnerloginnav').prepend(partnerLogin);
		partnerLoginItem.find('a:eq(1)').remove();
		jQuery('.horizontal-list').append(myZebraItem).append(partnerLoginItem);
		
		var container = jQuery(".left-rail");
		var homeBanner = jQuery('.home-top-banner');
		if(homeBanner.length > 0){
			homeBanner.remove();
		}
		if(container.length > 0){
			jQuery(".left-rail").remove();
			jQuery(".content-container").append(container);
			jQuery("ul.accordion li").siblings("li").children("ul").hide();
			jQuery("ul.accordion").show();    
			jQuery("ul.accordion li.active").children("ul").show();
			jQuery("ul.accordion li").addClass("expander");
			jQuery("a", "ul.accordion").parent("li").addClass("link").removeClass("expander");
			jQuery("ul.accordion>li").addClass("expander").removeClass("link");
			jQuery("ul.accordion li").click(function () { 
		        if ( jQuery(this).children("ul").is(":hidden") ) { 
		        	jQuery(this).siblings("li").removeClass("active").children("ul").not(":hidden").slideToggle();
		        	jQuery(this).toggleClass("active").children("ul").slideToggle();
		        } 
		    });
		    
		}
		/*Temporary fix. The browser was throwing live funtion undefined error.*/
        /*So moving it to on function, as live function is not supported in jquery 1.9 and above*/
		jQuery(".nav-button").on("click", function(){
			var otherMenu = jQuery(".headerSearch");
			if(otherMenu.css('display', 'block')){
				jQuery(".headerSearch").css('display', 'none');
			}
			jQuery(".nav").slideToggle();
			
		});
		/*Temporary fix. The browser was throwing live funtion undefined error.*/
        /*So moving it to on function, as live function is not supported in jquery 1.9 and above*/
		jQuery(".search-button").on("click", function(){
			var otherMenu = jQuery(".nav");
			if(otherMenu.css('display', 'block')){
				jQuery(".nav").css('display', 'none');
			}
			jQuery(".headerSearch").slideToggle();
			
		});
		jQuery(".change-country-btn").click(function(e){
			jQuery(".header-dropdown").toggle();	
		
		});
	    if(jQuery('.megaDropDownNav').size() >0 ) { // Need to check whether mega drop down exists in the page or not
			  var top = jQuery('.megaDropDownNav').offset().top - parseFloat(jQuery('.megaDropDownNav').css('marginTop').replace(/auto/, 0));
			  jQuery(window).scroll(function (event) {
			    	var y = jQuery(this).scrollTop();
			    if (y >= top) {
			      	jQuery('.new-wrapper').addClass('fixed-menu').css('top', '0px');
					jQuery('.nav').addClass('fixed-menu').css('top', '61px');
					jQuery('.headerSearch').addClass('fixed-menu').css('top', '61px');
			    } else {
                    jQuery('.new-wrapper').removeClass('fixed-menu').css('top', '4px');
                    jQuery('.nav').addClass('fixed-menu').css('top', '140px');
                    jQuery('.headerSearch').addClass('fixed-menu').css('top', '140px');
                    jQuery('.search-container.inner').css('margin-top', '-4px');
				}
			  });
	    }
	  
	 /* var obj2 = jQuery("#mainpartabscontainer > .tab");
	  jQuery(".tab").css({'width':''});*/
	}	
});
