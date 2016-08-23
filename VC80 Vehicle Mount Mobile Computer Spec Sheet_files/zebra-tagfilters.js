/**
 * Establish a context which can be attached as a subscriber to filter messages and handles those filter messages by running an
 * AJAX request and populating a DOM object with the results of the request assuming success.
 *
 * Recognized options
 * <ul>
 * 	<li>perPage : The number of results to present on each page.</li>
 * 	<li>contentContainer : The DOM object or jQuery wrapped DOM object in which search results will be presented</li>
 *  <li>searchRoot : The root search URL from which JSON requests will be built</li>
 *  <li>paginationControlContainer : The container in which the pagination controls will be presented</li>
 *  <li>totalResultsContainer : The container in which the number of results will be presented</li>
 *  <li>selectedFiltersContainer : The container in which the filters the user has selected will be presented</li>
 *  <li>loadingContainer : Container holding a loading message which will be shown while data is loading</li>
 *
 *  <li>totalResultsText : The text to display as the "Total Results" label</li>
 *  <li>ofText : The text to display inbetween the current result range and the total result count</li>
 *  <li>readMoreText : The text to display as the Read More link under each story</li>
 *  <li>nextButtonText : The text to display as the Next Page control button</li>
 *  <li>previousButtonText : The text to display as the Previous Page control button</li>
 *  <li>noneText : The text to display when no filters are selected</li>
 *  <li>noResultsFoundText : The text to display when no results are associated with the set of filters selected</li>
 *  <li>pLCustomNoResultsFoundText : The text to display when no results are associated with the configured filters for Partner Locator Service Search</li>
 *  <li>pLCountryCode : Used to check user country matches with configured country in Partner Locator Service Search</li>
 *  <li>pLFilters : Used to check whether user selected filters matches with configured filters</li>
 *  <li>isPlPage : Used to identify whether request page is Partner locator or not</li>
 *  <li>userNotLocatedText : The text to display when the user couldn't get geolocated and needs to enter their address</li>
 *  <li>removeAllText : The text to display as the Remove All Filters control</li>
 *
 *  <li>renderers : A map of rendering functions for row classifications</li>
 *  <li>defaultRenderer : A default function which will be called as the renderer for result rows which can not be rendered by one of the
 *                        classified renderers established via the renderers option.  If such a row is encountered and no defaultRenderer
 *                        has been established, the row is ignored.</li>
 *	<li>getQueryString : Functoin to add query string parameters to the URL before it hits the servlet to add search options
 *
 *  <li>exclusive : Boolean - indicates whether the sets of results should be combined exclusively or inclusively.  That is to say, whether
 *                  a result must match all or one of the selected filters in order to be presented.  A value of 'true' indicates it must match
 *                  all selected filters.
 *
 *  <li>resultFilter : A function which takes a result object and the set of current filters and returns a boolean indicating whether the
 *                     current result should be included in the final result set.</li>
 *
 *  <li>sortingAlgorithm : A comparator function to be used when sorting the presented teasers</li>
 * </ul>
 */
zebralib.makePaginatedFilterSubscriber = function (options) {
	
	/*
	 * Setup properties from options passed in
	 */
	var perPage = options.perPage;
	var nologoImage = options.nologoImage;
	var o = options.contentContainer instanceof jQuery ? options.contentContainer : jQuery(options.contentContainer);
	var urlRoot = options.searchRoot;
	var servletSelectorAndExtension = options.servletSelectorAndExtension || ".tagsearch.json";
	var jsonUrl = urlRoot + servletSelectorAndExtension;
	var getQueryString = options.getQueryString || (function() {return "";});
	var paginationControlContainer = options.paginationControlContainer instanceof jQuery ? options.paginationControlContainer : jQuery(options.paginationControlContainer);
	var totalResultsContainer = options.totalResultsContainer ? options.totalResultsContainer instanceof jQuery ? options.totalResultsContainer : jQuery(options.totalResultsContainer) : null;
	var selectedFiltersContainer = options.selectedFiltersContainer ? options.selectedFiltersContainer instanceof jQuery ? options.selectedFiltersContainer : jQuery(options.selectedFiltersContainer) : null;
	var loadingContainer = options.loadingContainer ? options.loadingContainer instanceof jQuery ? options.loadingContainer : jQuery(options.loadingContainer) : null;
	/*
	 * Text Options
	 */
	var totalResultsText = options.totalResultsText || "Total Results";
	var ofText = options.ofText || "of";
	var readMoreText = options.readMoreText || "Read More";
	var nextButtonText = options.nextButtonText || "Next &gt;";
	var previousButtonText = options.previousButtonText || "&lt; Previous";
	var noneText = options.noneText || "None";
	var noResultsFoundText = options.noResultsFoundText || "No results found";
	var pLCustomNoResultsFoundText = options.pLCustomNoResultsFoundText || "No results found";
	var pLFilters = options.pLFilters || "";
	var pLCountryCode = options.pLCountryCode || "";
	var isPlPage = false;
	var userNotLocatedText = options.userNotLocatedText || "Please enter your address above to start your search.";
	var removeAllText = options.removeAllText || "Remove All";
	
	var featuredResultClassification = options.featuredResultClassification; //featured results at the top
	var standardResultClassification = options.standardResultClassification; //normal search results
	
	var featuredResultMax = options.featuredResultMax || 0;
	
	var sgResultsHeaderText = options.sgResultsHeaderText || "sgResultsHeaderText";
	var sgResultsToolTip = options.sgResultsToolTip || false;
	var printerResultsHeaderText = options.printerResultsHeaderText || "printerResultsHeaderText";
	
	var renderers = options.renderers || Array();
	var defaultRenderer = options.defaultRenderer || null;
	
	var exclusive = options.exclusive || false;
	
	var resultFilter = options.resultFilter || null;
	
	var sortEventQueue = options.sortEventQueue || null;
	
	//Syntax used for other checks won't work since we want to default to true, 
	//	have to check if defined other wise it will do 'false || true' and set it to true every time.
	var sortOnFrontEnd = (typeof options.sortOnFrontEnd != 'undefined') ? options.sortOnFrontEnd : true;
	var sortingAlgorithm = options.sortingAlgorithm || function (t1, t2) {
		//Assume server is returning contents in a sorted fashion if there is no date set
		//TODO change the creation date sort to happen on the server side
		if(t1.creationDate && t2.creationDate) {
			d1 = new Date(t1.creationDate);
			d2 = new Date(t2.creationDate);
			
			if (d1 == d2) {
				return 0;
			}
			if (d1 > d2) {
				return -1;
			}
			return 1;
		}
		
		//If the dates aren't set, return zero and perform no sorting.
		return 0;
	};
	
	/*
	 * Maintains the state of the filters requested
	 */
	var filterObjectList = Array();
	
	/*
	 * Unique set
	 */
	var filterObjectSet = Array();
	
	/*
	 * Maintain a list of the pages which have been requested
	 */
	var pagesRequested = Array();
	
	/*
	 * Setup the teaser data arrays.
	 */
	
	var standardTeasers = Array();
	var featuredTeasers = Array();
	var segregatedTeasers = Array();
	var currentTeasers = Array();
	var currentFeaturedTeasers = Array(); //Don't set equal to what is return so it starts hidden
	
	/*
	 * Used to toggle the display method for certain classifications that are table or other.
	 *    	Needs to be refactored to use this logic for content block as well for solutiong
	 *		group and featured result listing in solution components
	 */
	var resultDisplayLayout;
	
	/*
	 * Constants for render type
	 */
	var DISPLAY_TYPES = {
		STANDARD : 0, //standard nested div containers layout
		PARTNER_LOCATOR_RESULTS_TABLE : 1, //specific to partner locator search results table
		CONTENT_BLOCK : 2 //not implemented yet
	};
	
	/*
	 * Keep track of the current JSON request
	 */
	var activeRequest = null;
	
	/*
	 * Indicates whether things are setup to start properly handling published events
	 */
	var isReady = false;
	
	/*
	 * Queue of published events which were triggered before this was ready
	 */
	var publishedQueue = Array();
	
	/*
	 * Once the document is ready to be presented, kick off data loading
	 */
	jQuery('document').ready(function () {
		query();
	});
		
	
	var query = function(e, newQueryString) {
		var queryString = newQueryString || getQueryString();
		
		//filterObjectList = Array();
		//filterObjectSet = Array();
		pagesRequested = Array();
		standardTeasers = Array();
		featuredTeasers = Array();
		segregatedTeasers = Array();
		currentTeasers = Array();
		currentFeaturedTeasers = Array();
		publishedQueue = Array();
		
		if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
			jQuery.unsubscribe( sortEventQueue, processTableSortMessage);
		}
		
		// Listen next query events always, IM-927
		if (servletSelectorAndExtension == ".partnerlocator.json") {
			isPlPage = true;
			handleHashTag();
			// IM-1597 - Clear Filters 
			filterObjectList = Array();
			filterObjectSet = Array();
			handleUserNotLocated();
			jQuery(".expand-results").hide();
		}
		if(queryString == "USER_NOT_LOCATED") {
			//User not found, but listen for next query after they search for their address
			handleUserNotLocated();
			return;
		}
		
		//console.log("request url! " + jsonUrl + queryString);
		
		/*
		 * Present the loading message
		 */
		showLoadingMessage();
		
		/*
		 * Start loading
		 */
		jQuery.getJSON(
			jsonUrl + queryString,
				
			function (d) {
				activeRequest = d;
				
				//console.log(" start tagfilter init ");
					
				/*
				 * Hide the loading message
				 */
				hideLoadingMessage();
				
				
				/*
				 * Check if the classification makes this a tabled display result
				 */
				resultDisplayLayout = (standardResultClassification == "partnerLocator") ? DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE : DISPLAY_TYPES.STANDARD;
				
				/*
				 * Check and process any errors by checking the status field
				 */
				if(!isValidResponse(d)) {
					//alert("UAT:  Error processing your request, let John know the steps to reproduce this error.");
					populateNoResultsFound();
					return;
				}
				
				//if no result returned
				if (d[standardResultClassification] == null) {
					
					//Clear the markers and set the location to searched location
					if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
					ZebraPartnerModule.initOrSyncParnterLocatorMap(activeRequest);
					}
					
					//Display the no results message
					populateNoResultsFound();
					return;
				}
				//IM-614 Checking whether user request is expanded or not
				if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
					ZebraPartnerUtils.isUserRequestExapanded(d["requestDetails"]);
				}
				
				/*
				 * Arrange the data received
				 */
				standardTeasers = d[standardResultClassification];
				if (featuredResultClassification) {
					featuredTeasers = d[featuredResultClassification];
				}
				
				/*
				 * Segregate the data by tag
				 */
				for (var row in standardTeasers) {
					curRow = standardTeasers[row];
					if (curRow.tags && curRow.tags.length) {
						for (var i = 0; i < curRow.tags.length; i++) {
							if (!segregatedTeasers[curRow.tags[i]]) {
								segregatedTeasers[curRow.tags[i]] = Array();
							}
							segregatedTeasers[curRow.tags[i]].push(curRow);
						}
					}
				}
				
				/*
				 * Establish the currently viewed data, which is all data to start with
				 */
				currentTeasers = currentTeasers.concat(standardTeasers);

				//apply filters that are already selected by users
				
				//When distance/address search is triggered, the tag filters already selected should still 
				//be considered on the result.
				var filterCount = resetCurrentTeasers();
				applyCurrentTeaserFilters(filterCount);
				
				sortCurrentTeasers();
				// This will remove the pagination for Partner Locator
				if (isPlPage) {
					jQuery("#pl-partner-details").html("");
					jQuery("#pl-partner-details").css("display","none");
					jQuery("#pl-partner-details").find("div:visible").hide();
					ZebraPartnerUtils.hidePartnerDetail();
					perPage = d[standardResultClassification].length;
				}
				initializePagination();
				
				/*
				 * Re-publish any events which were missed in the order in which they were missed so that they can be
				 * appropriately handled
				 */
				if (publishedQueue.length > 0) {
					for (var i = 0; i < publishedQueue.length; i++) {
						//console.log("Catching up on the publish queue: " + publishedQueue[i].messageType);
						jQuery.publish(
							publishedQueue[i].messageType,
							[
								publishedQueue[i].filterValue,
								publishedQueue[i].filterProvider,
								publishedQueue[i].filterActive,
								publishedQueue[i].filterName
							]);
					}
				}
				
				isReady = true;
				
				//registering partner locator
				if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
					
					//the events are subscribed on multiple places in this same function. So unsubscribing previous subscriptions to 
					//make sure no conflicts. It created an issue where same partners are listed twice for the search
					jQuery.unsubscribe(ZebraPartnerModule.PARTNER_CONSTANTS.PARTNER_EVENT, query);
					jQuery.subscribe(ZebraPartnerModule.PARTNER_CONSTANTS.PARTNER_EVENT, query);
					
				}
				//Listen for sort events
				if (resultDisplayLayout != DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
					jQuery.subscribe(sortEventQueue, processTableSortMessage);
				}
			});
		
	}; //end of starting a new query
	
	var showLoadingMessage = function () {
		if (loadingContainer != null) {
			loadingContainer.slideDown('fast');
		}
		if (o) {
			o.empty();
		}
	};
	
	var hideLoadingMessage = function () {
		if (loadingContainer != null) {
			loadingContainer.slideUp('fast', function () {
				loadingContainer.hide();
			});
		}
	};
	
	var isValidResponse = function (jsonResponse) {
		var isValid = false;
		//Validate the response has content
		if(jsonResponse) {
			if(jsonResponse.requestDetails) {
				if (jsonResponse.requestDetails.status === "OK") {
					isValid = true;
				} else if (standardResultClassification == "partnerLocator") {
					isValid = true;
				} else {
					// console.log("Error response from search: ",
					// jsonResponse.requestDetails.errorMsg);
				}
			}
		}
		return isValid;
	};
	
	/**
	 * Sorts the currently selected teasers by passed in sort method or defaults to creation date
	 */
	var sortCurrentTeasers = function () {
		if (sortOnFrontEnd) {
			currentTeasers.sort(sortingAlgorithm);
		}
	};
	
	var initializePagination = function () {
		
		if (currentTeasers.length == 0) {
		    //when no results are available on tag filter selection. The map should be initialized and existing partner flags to be cleaned up.
			if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
				ZebraPartnerModule.initOrSyncParnterLocatorMap(activeRequest);
			}
			return populateNoResultsFound();
		}
			
		pagesRequested = Array();
		pagesRequested[0] = true;
		
		var resultList;
		var resultsContent;
		
		if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
			//Send the message to the Google Map to add all the partners for this search
			ZebraPartnerModule.syncPartnerLocatorMapToResults(activeRequest, currentTeasers, nologoImage);	
			//resultList = jQuery("<div id='pl-results-list'/>");
			resultsContent = jQuery("<div id='pl-results-list'/>");
		} else {
			resultsContent = jQuery("<div/>");
		}
		
		/*
		 * Pre build all of the search content containers
		 */
		for (var i = 0; i < currentTeasers.length; i++) {
			
			var resultContainerDiv;
			if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
				resultContainerDiv = jQuery("<div class='search-result-container' />");
			} else {
				resultContainerDiv = jQuery("<div class='clearfix search-result-container' />");
			}
			
			resultsContent.append(resultContainerDiv);
		}
		
		//If there are featured results possible (even if hidden) then add the headings
		if (featuredTeasers && featuredTeasers.length > 0) {
			resultList = jQuery("<div class='content-block clearfix' />");
			var resultsHeader = jQuery("<div id='standardResultsHeader' class='content-block-header'>" + printerResultsHeaderText + "</div>");
			resultsContent.addClass('content-block-content');
			
			resultList.append(resultsHeader);
			resultList.append(resultsContent);
			
		} else if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
			jQuery("#pl-results-sort").show();
			//resultsContent.append(ZebraPartnerModule.triggerSortRequest());
			ZebraPartnerModule.triggerSortRequest();		
		  //  resultList.append(resultsContent);
		    resultList = resultsContent;
	     } else {
			resultList = resultsContent;
		}

		
		/*
		 * Render the content for the individual page
		 */
		renderPage(resultList, 0);
		o.empty();
		o.append(resultList);
		
		/*
		 * Setup Pagination
		 */
		paginationControlContainer.paging(currentTeasers.length, {
			format : '< nnnnncnnnnn >',
			perpage : perPage,
			page : 1,
			onFormat : function (type) {
				switch (type) {
				case 'block':
					if (!this.active)
						return '<span class="disabled-pagination">' + this.value + '</span>';
					else if (this.value != this.page)
						return '<a>' + this.value + '</a>';
					return '<span class="current-page">' + this.value + '</span>';
					break;
				case 'next':
					return "| <a>" + nextButtonText + "</a>";
					break;
				case 'prev':
					return "<a>" + previousButtonText + "</a> | ";
					break;
				}
			},
			onSelect : function (page) {
				/*
				 * See if we already have the requested content
				 */
				if (!pagesRequested[page - 1]) {
					/*
					 * If not, render it
					 */
					renderPage(resultList, page - 1);
				}
				if (jQuery('div.real_fancybox_player').length === 0){
					jQuery('body').append('<div class="real_fancybox_player"> </div>');
				}
				//RELOAD_FLOWPLAYER (global variable) - for ajax reloads, the flow player needs to be instantiated again to render
				//the video properly. The flag is used in initplayer method inside initvideoPlayer.
				RELOAD_FLOWPLAYER = true;
				initvideoPlayer();
				displayPage(page - 1, this);
			}
		});
		
		if (currentTeasers.length <= perPage) {
			paginationControlContainer.hide();
			totalResultsContainer.hide();
			if(isPlPage) {
				ZebraPartnerUtils.isSearchByName(false,true);
				ZebraPartnerUtils.isResultsLoaded();
			}
		} else {
			paginationControlContainer.show();
			totalResultsContainer.show();
		}
	
		
	};
	
	var processTableSortMessage = function (e, clickedColumnHeader, columnIndex) {
	
		//console.log("processTableSortMessage start:", e, clickedColumnHeader, columnIndex);
		
		//Grab sort direction before the search results get recreated and it is lost
		var sortDirection = jQuery(clickedColumnHeader).hasClass('sorted-asc') ? -1 : 1;
		
		//Reset the teasers and apply the current filters
		var filterCount = resetCurrentTeasers();
		applyCurrentTeaserFilters(filterCount);
		
		//Sort the teasers that are currently viewable based on the selected tags
		currentTeasers.sort(function (a, b) {
			if (a.sortKeyByColumn[columnIndex] < b.sortKeyByColumn[columnIndex])
				return -sortDirection;
			if (a.sortKeyByColumn[columnIndex] > b.sortKeyByColumn[columnIndex])
				return sortDirection;
			return 0;
		});
		
		//Sort all of the possible results since there won't be a another sort message issued
		//	from the pagination and all other pages will be out of order when a new filter is
		//	added or subtracted.
		standardTeasers.sort(function (a, b) {
			if (a.sortKeyByColumn[columnIndex] < b.sortKeyByColumn[columnIndex])
				return -sortDirection;
			if (a.sortKeyByColumn[columnIndex] > b.sortKeyByColumn[columnIndex])
				return sortDirection;
			return 0;
		});
		
		//Re-Init the pagination
		initializePagination();
		
		//remove the active class from initial header.
		jQuery("thead th.init-header").removeClass("active");
		//Get the newly created th element
		var refreshedHeader = jQuery('thead th.sortable', o).eq(columnIndex);
		
		//Set the table header according to the latest sort ascending vs descending
		//	which overwrites the default setting inside initializePagination()
		jQuery(refreshedHeader).removeClass('sorted-asc sorted-desc');
		//jQuery(refreshedHeader).siblings('th.sortable active').removeClass('active');
		sortDirection == 1 ? jQuery(refreshedHeader).addClass('sorted-asc active') : jQuery(refreshedHeader).addClass('sorted-desc active');
		
		//console.log("processTableSortMessage complete");
	};
	
	var removeFeaturedResults = function () {
		jQuery("#featuredResultsContainer").remove();
	};
	
	/**
	 * Display a selected page of results.
	 *
	 * This function assumes that the page has already been rendered.  It does not concern itself if it hasn't.
	 */
	var displayPage = function (page, paginator) {
		
		/*
		 *	Generate the featured section
		 */
		if (page == 0 && currentFeaturedTeasers && currentFeaturedTeasers.length > 0) {
			var resultSolutionGroupList = jQuery("<div id='featuredResultsContainer' class='content-block clearfix' />");
			var resultsSolutionGroupHeader = jQuery("<div class='content-block-header'>" + sgResultsHeaderText + ((sgResultsToolTip) ? "<span class='tooltip-icon'><span class='tooltip'><span class='txt'>" + sgResultsToolTip + "</span></span></span>" : "") + "</div>");
			var resultsSolutionGroupContent = jQuery("<div class='content-block-content' />");
			
			/*
			 * Run the renderer.  A renderer is expected to take as an argument the row of data and a DOM element to render to
			 */
			var renderer = renderers[featuredResultClassification];
			if (renderer) {
				for (var i = 0; i < currentFeaturedTeasers.length; i++) {
					renderer(currentFeaturedTeasers[i], resultsSolutionGroupContent);
				}
			}
			
			resultSolutionGroupList.append(resultsSolutionGroupHeader);
			resultSolutionGroupList.append(resultsSolutionGroupContent);
			
			o.prepend(resultSolutionGroupList);
			//Hide extra padding on first and last visible results
			o.find("div#featuredResultsContainer div.list-grid-item:visible:first").addClass("first-visible-child");
			o.find("div#featuredResultsContainer div.list-grid-item:visible:last").addClass("last-visible-child");
		} else if (page > 0) {
			//TODO don't recreate each time the user pages, refresh similar to other paging structure
			removeFeaturedResults();
			o.find(".search-result-container:visible:first").css("border-top", "none");
		}
		
		/*
		 * Hide all search results within the context of the enclosed content area
		 */
		var searchResults = jQuery(".search-result-container", o);
		
		searchResults.hide();
		
		/*
		 * Show the results for the current page
		 */
		searchResults.slice(paginator.slice[0], paginator.slice[1]).show();
		
		/*
		 *	If not the first page and there are possible featured teasers that means there is a header
		 *		for standard results.  We want to hide this on page 1+
		 */
		if (featuredTeasers && featuredTeasers.length > 0) {
			//Hide extra padding on first and last visible results if we have content box present
			o.find(".search-result-container:visible:first").addClass("first-visible-child");
			o.find(".search-result-container:visible:last").addClass("last-visible-child");
			if (page > 0) {
				jQuery("#standardResultsHeader").css("display", "none");
			} else {
				jQuery("#standardResultsHeader").css("display", "block");
			}
		}
		
		/*
		 * Present the total results container
		 */
		if (totalResultsContainer) {
			if (!totalResultsContainer instanceof jQuery) {
				totalResultsContainer = jQuery(totalResultsContainer);
			}
			var resultsText = "";
			if (isPlPage && jQuery("#searchByComp").val() != '') {
				resultsText = ZebraPartnerUtils.isSearchByName(false);
			}
			totalResultsContainer.html(resultsText );
		}
		
		/*
		 * Present the active filters list
		 */
		populateSelectedFiltersContainer();
		
		//Create fancybox for Company Description display on partner locator results
		if (resultDisplayLayout == DISPLAY_TYPES.PARTNER_LOCATOR_RESULTS_TABLE) {
			//IE lower version adds full URL to href which breaks fancybox functionality. So a hack was inevitable here.
			ZebraPartnerModule.changehrefforIE();
			ZebraPartnerModule.showCompanyModal();
		}
		
	};
	
	/**
	 * Populates the Selected Filters Container with the names of the filters which users have elected.  In the case that no filters are currently selected
	 * and in the case where only initialization calls have been made thus far, "None" is presented as the displayed filters.
	 */
	var populateSelectedFiltersContainer = function () {
		
		if (selectedFiltersContainer != null) {
			
			/*
			 * Sort the active filters
			 */
			
			selectedFiltersContainer.empty();
			
			var selectedFilterStrings = Array();
			
			var filterObjectSetArray = Array();
			
			for (var curFilter in filterObjectSet) {
				if (filterObjectSet.hasOwnProperty(curFilter)) {
					filterObjectSetArray.push(filterObjectSet[curFilter]);
				}
			}
			
			if (filterObjectSetArray.length == 0) {
				selectedFiltersContainer.html(noneText);
			} else {
				filterObjectSetArray.sort(function (o1, o2) {
					return o1.filterName.localeCompare(o2.filterName);
				});
				
				for (var i = 0; i < filterObjectSetArray.length; i++) {
					selectedFilterStrings.push("<a class='active-tag-filter' val='" + filterObjectSetArray[i].filterValue + "'>" + filterObjectSetArray[i].filterName + "</a>");
				}
				
				selectedFiltersContainer.html(selectedFilterStrings.join(", "));
				
				jQuery(".active-tag-filter", selectedFiltersContainer).click(function () {
					jQuery.publish("removeTagFilter", [jQuery(this).attr("val")]);
				});
				
				/*
				 * If there are more than one filters active, prepend a remove all link
				 */
				if (filterObjectSetArray.length > 1) {
					var removeAllLink = jQuery("<a class='remove-all-active-tag-filters'>" + removeAllText + "</a>");
					
					removeAllLink.click(function () {
						
						jQuery.publish("removeTagFilter", ["all"]);
						
					});
					
					selectedFiltersContainer.prepend(", ").prepend(removeAllLink);
				}
			}
		}
		
	};
	
	var clearPagination = function () {
		
		hideLoadingMessage();
		
		if (totalResultsContainer) {
			totalResultsContainer.empty();
		}
		
		if (selectedFiltersContainer) {
			selectedFiltersContainer.html(noneText);
		}
		
		if (paginationControlContainer) {
			paginationControlContainer.empty();
		}
		
		if (o) {
			o.empty();
		}
		
	};
	
	var replaceTableWithMessage = function(message) {
		//If the query hasn't returned then ignore this and leave the loading message up.
		hideLoadingMessage();
		if (totalResultsContainer) {
			totalResultsContainer.empty();
		}
		populateSelectedFiltersContainer();
		if (paginationControlContainer) {
			paginationControlContainer.empty();
		}
		if (o) {
			if (isPlPage){
				 o.html("<div class='pl-no-results-message'>" + message + "</div>");
			}else{
			  o.html("<div class='no-results-found'>" + message + "</div>");
			}
		}
	};
	var handleUserNotLocated = function () {
		//the events are subscribed on multiple places in this same function. So unsubscribing previous subscriptions to 
		//make sure no conflicts. It created an issue where same partners are listed twice for the search
		jQuery.unsubscribe(ZebraPartnerModule.PARTNER_CONSTANTS.PARTNER_EVENT, query);
		jQuery.subscribe(ZebraPartnerModule.PARTNER_CONSTANTS.PARTNER_EVENT, query);
		
		//Init the map to the globe since we have no idea about the position of the user or what partners should show up.
		ZebraPartnerModule.initOrSyncParnterLocatorMap(activeRequest);
		replaceTableWithMessage(userNotLocatedText);
	};
	var handleHashTag = function () {
		//the events are subscribed on multiple places in this same function. So unsubscribing previous subscriptions to 
		//make sure no conflicts. It created an issue where same partners are listed twice for the search
		jQuery.unsubscribe(ZebraPartnerModule.PARTNER_CONSTANTS.PARTNER_EVENT, query);
		jQuery.subscribe(ZebraPartnerModule.PARTNER_CONSTANTS.PARTNER_EVENT, query);
		
		//Init the map to the globe since we have no idea about the position of the user or what partners should show up.
		//ZebraPartnerModule.initOrSyncParnterLocatorMap(activeRequest);
		//replaceTableWithMessage(userNotLocatedText);
	};
	// IM-739 Updated
	var populateNoResultsFound = function () {
		// Check whether user location and filters matched with Zasp Service Configuration
		if (isPlPage && pLCountryCode == window.searchParams.countryCode && jQuery(".active").attr("id") == "service") {
			ZebraPartnerUtils.isZaspsCustomSearch(pLFilters,pLCustomNoResultsFoundText,noResultsFoundText,replaceTableWithMessage); 
		}else {
			replaceTableWithMessage(noResultsFoundText);
		}
		if (isPlPage) {
			jQuery("#pl-results-sort").hide();
			ZebraPartnerUtils.isSearchByName(true); 
			jQuery(".expand-results").hide();
		}
	};
	
	/**
	 * Renders a page worth of the data contained in the currentTeasers object
	 *
	 * @param resultList The container to render the results to
	 * @param p The page to render
	 */
	var renderPage = function (resultList, p) {
	
		/*
		 * Build the DOM for each current teaser
		 */
		jQuery.each(currentTeasers.slice((p * perPage), ((p + 1) * perPage)), function (i, row) {
			
			/*
			 * Acquire the proper pre built result container
			 */
			var resultContainerDiv = jQuery(".search-result-container", resultList).eq(i + (p * perPage));
			
			/*
			 * Clear the result container
			 */
			 //TODO i think this can be removed now that i adjusted the pagesRequested to properly work.
			 //		when this method is called, the results should already be empty
			resultContainerDiv.empty();
			
			/*
			 * Look up a proper rendering agent for the row based on its classification
			 */
			var renderer = null;
			
			if (renderers[row.classification]) {
				renderer = renderers[row.classification];
			} else {
				renderer = defaultRenderer;
			}
			//providing generic image if not logo is available in the result
			if (row.companyInfo && row.companyInfo != null) {
			if (!row.companyInfo.isLogo) {
				row.companyInfo.logoSrc = nologoImage;
			}
			}
			/*
			 * Run the renderer.  A renderer is expected to take as an argument the row of data, 
			 * 		a DOM element to render to, and the index of this row
			 */
			if (renderer) {
				renderer(row, resultContainerDiv, i + (p * perPage));
			}
			
			/*
			 * Hide the current result container
			 */
			resultContainerDiv.hide();
			
		});
		
		pagesRequested[p] = true;
	};
	
	var applyCurrentTeaserFilters = function (filterCount) {
		if (resultFilter != null) {
			var tempCurrentTeasers = Array();
			for (var i = 0; i < currentTeasers.length; i++) {
				if (resultFilter(currentTeasers[i], filterObjectSet, filterCount)) {
					tempCurrentTeasers.push(currentTeasers[i]);
				}
			}
			currentTeasers = tempCurrentTeasers;
			
			if (featuredTeasers && featuredTeasers.length > 0) {
				currentFeaturedTeasers = Array();
				for (var i = 0; i < featuredTeasers.length; i++) {
					if (resultFilter(featuredTeasers[i], filterObjectSet, filterCount) && currentFeaturedTeasers.length < featuredResultMax) {
						currentFeaturedTeasers.push(featuredTeasers[i]);
					}
				}
			}
		}
	};
	
	var resetCurrentTeasers = function() {
		/*
		 * Clear out currentTeasers
		 */
		currentTeasers = Array();
		currentFeaturedTeasers = Array();
		
		/*
		 * Establish what teasers should be presented based on the filters chosen.  If no filters are chosen then all results are presented
		 */
		var filterCount = 0;
		
		for (var curFilter in filterObjectSet) {
			if (filterObjectSet.hasOwnProperty(curFilter)) {
				
				if ((!exclusive) || filterCount == 0) {
					if (segregatedTeasers[filterObjectSet[curFilter].filterValue]) {
						for (var j = 0; j < segregatedTeasers[filterObjectSet[curFilter].filterValue].length; j++) {
							if (jQuery.inArray(segregatedTeasers[filterObjectSet[curFilter].filterValue][j], currentTeasers) == -1) {
								currentTeasers.push(segregatedTeasers[filterObjectSet[curFilter].filterValue][j]);
							}
						}
					}
				} else {
					var tempCurrentTeasers = Array();
					if (segregatedTeasers[filterObjectSet[curFilter].filterValue]) {
						for (var j = 0; j < currentTeasers.length; j++) {
							if (jQuery.inArray(currentTeasers[j], segregatedTeasers[filterObjectSet[curFilter].filterValue]) != -1) {
								tempCurrentTeasers.push(currentTeasers[j]);
							}
						}
					}
					currentTeasers = tempCurrentTeasers;
				}
				
				filterCount++;
				
			}
		}
		if (filterCount == 0) {
			currentTeasers = currentTeasers.concat(standardTeasers);
		}
		
		return filterCount;
	};
	
	/**
	 *
	 * @param messageType
	 * @param filterValue The value which the filter takes
	 * @param filterProvider The unique ID of the component from which the filter is being published
	 * @param filterActive Indication of whether this is a 'turn on' or 'turn off' event
	 * @param filterName The verbose name of the filter for display purposes
	 */
	return function (messageType, filterValue, filterProvider, filterActive, filterName) {
		
		//console.log("in the closure for tagfilters", messageType, filterValue, filterProvider, filterActive, filterName);
		
		if (!isReady) {
			publishedQueue.push({
				messageType : messageType,
				filterValue : filterValue,
				filterProvider : filterProvider,
				filterActive : filterActive,
				filterName : filterName
			});
		}
		
		/*
		 * re-initialize the pages requested array
		 */
		pagesRequested = Array();
		
		/*
		 * Initialize the filter arrays for this provider
		 */
		if (!filterObjectList[filterProvider]) {
			filterObjectList[filterProvider] = Array();
		}
		
		/*
		 * See if the filterValue is an array.  Filter providers might pass multiple filters in an array.  If this is the case then
		 * the filterActive parameter should be applied to all provided filters
		 */
		if (!jQuery.isArray(filterValue)) {
			filterValue = Array(filterValue);
		}
		if (!jQuery.isArray(filterName)) {
			filterName = Array(filterName);
		}
		
		for (var i = 0; i < filterValue.length; i++) {
			
			if (filterActive === true) {
				filterObjectList[filterProvider][filterValue[i]] = {
					filterName : filterName[i],
					filterValue : filterValue[i]
				};
			} else {
				delete filterObjectList[filterProvider][filterValue[i]];
			}
		}
		
		/*
		 * Establish the unique set of all active filters
		 */
		filterObjectSet = Array();
		
		for (var curFilterProvider in filterObjectList) {
			if (jQuery.isArray(filterObjectList[curFilterProvider])) {
				for (var curFilterKey in filterObjectList[curFilterProvider]) {
					var curFilter = filterObjectList[curFilterProvider][curFilterKey];
					if (curFilter.filterName && curFilter.filterValue) {
						filterObjectSet[curFilter.filterValue] = curFilter;
					}
				}
			}
		}
		
		var filterCount = resetCurrentTeasers();
		
		applyCurrentTeaserFilters(filterCount);
		
		sortCurrentTeasers();
		
		/*
		 * Initialize pagination
		 */
		initializePagination();
	}
};

/*!
 * jQuery Tiny Pub/Sub - v0.3 - 11/4/2010
 * http://benalman.com/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function ($) {
	
	window.eventHolder = $({});
	
	$.subscribe = function () {
		eventHolder.bind.apply(eventHolder, arguments);
	};
	
	$.unsubscribe = function () {
		eventHolder.unbind.apply(eventHolder, arguments);
	};
	
	$.publish = function () {
		eventHolder.trigger.apply(eventHolder, arguments);
	};
	
})(jQuery);
