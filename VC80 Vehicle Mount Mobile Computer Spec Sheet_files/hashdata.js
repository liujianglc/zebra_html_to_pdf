/**
 * HashData
 * 
 * A utility class for managing data stored in a hash
 */
HashData = { 
	
	/**
	 * Private
	 * 
	 * The current mode which is being operated under.  
	 * 
	 * <ul>
	 *   <li>nvp : Name Value Pair - parsing will produce a data map where the 
	 *                               keys of the map are the names established 
	 *                               and the values of the map are arrays containing 
	 *                               the values established. 
	 *                               
	 *                               Example NVP Hash: 
	 *                                 #name1=value1,value2+name2=value3,value4
	 *   </li>
	 *   <li>list : List - parsing will produce a data array containing the list 
	 *                     of values established.  
	 *                     
	 *                     Example List Hash:
	 *                       #value1,value2,value3,value4
	 *   </li>
	 * </ul>
	 */	
	mode : "nvp", 
	
	/**
	 * Private
	 * 
	 * When in NVP mode, the divider is the string used to separate individual nvps
	 */
	divider : "+", 
	
	/**
	 * Private
	 * 
	 * Data currently being managed
	 */
    data : null, 
    
    /**
     * Private
     * 
     * Processes hash data from the window and populates the internal data object
     */
    getHashData : function() {
    	
    	this.clear();
    	
    	/*
    	 * Pull the hash from the location and lop off the first character since it will be a '#'
    	 */
    	var hashData = window.location.hash.length > 0 ? window.location.hash.substring( 1 ) : "";
    	
    	this.determineMode( hashData );
    	
    	switch( this.mode ) { 
    	
	    	case "nvp" : this.processHashAsNVP( hashData );
	    				 break;
	    	case "list" : this.processHashAsList( hashData );
	    				  break;
	    	default : break;
	    	
    	}
    	
    	this.cleanup();
    	
    }, 
    
    processHashAsNVP : function( h ) { 
    	
    	var nvpPass1 = h.split( this.divider );
    	
    	for ( var i = 0; i < nvpPass1.length; i++ ) { 
    		
    		if ( nvpPass1[i].indexOf( "=" ) >= 1 ) { 
    			nvpPass2 = nvpPass1[i].split( "=" );
    			curName = nvpPass2[0];
    			curValue = nvpPass2[1].length > 0 ? nvpPass2[1].split( "," ) : Array();
    			this.data.push( { name: curName, value: curValue } );
    		}
    		
    	}
    	
    }, 
    
    processHashAsList : function( h ) { 
    	    	
    	if ( h == "" || h == "#" ) {
    		this.data = Array();
    	}
    	else {
    		this.data = h.split( "," );
    	}
    }, 
    
    /**
     * Attempts to determine the mode to run the processor in based on 
     * the contents of h.  
     * 
     * @param h
     */
    determineMode : function( h ) { 
    	
    	if ( h.indexOf( "=" ) >= 0 ) {
    		this.mode = "nvp";
    	}
    	else {
    		this.mode = "list";
    	}
    },
    
    /**
     * 
     * 
     * @param refresh A flag indicating whether the data should be re-populated from the Hash Tag
     */
    getData : function( refresh ) { 
    	
    	/*
    	 * Try to pull the data if we have not done so already or if a refresh was requested
    	 */
    	if ( this.data == null || refresh ) { 
    		
    		this.getHashData();
    		
    	}
    	
    	return this.data; 
    
    } , 
    
    /**
     * Adds data to the internal data object and re-writes the hash in the location
     * 
     * This method attempts to discover an appropriate mode based on the parameters passed in.  If two parameters 
     * are provided, it is assumed that the user wants to operate in 'nvp' mode.  If one parameter is provided, it is 
     * assumed that the user wants to operate in 'list' mode.  
     * 
     * @param n The name of the nvp to add, or the value to add if in list mode
     * @param v The value of the nvp to add.  Specifying v indicates an intention to use nvp mode
     * @param overwrite A flag indicating whether an existing nvp should be overwritten.  This flag does nothing in 
     *                  list mode.  If true and if working in nvp mode, if n is the same as an existing nvp in our 
     *                  data set, the existing nvp is replaced.  If false, then the new values are added to the list 
     *                  of values contained in the nvp.
     */
    putData : function( n, v, overwrite ) { 
    	/*
    	 * First see if we've already processed the existing hash data
    	 */
    	if ( this.data == null ) { 
    		this.getHashData();
    	}
    	
    	/*
    	 * Now see what the user is trying to do
    	 */
    	if ( v === undefined ) {
    		if ( this.mode != "list" ) {
    			this.clear();
    		}
    		this.mode = "list";
    		if ( Object.prototype.toString.call( n ) !== '[object Array]' ) {
    			n = [n];
    		}
    		this.data = this.data.concat( n );
    	}
    	else { 
    		if ( this.mode != "nvp" ) {
    			this.clear();
    		}
    		this.mode = "nvp";
    		
    		/*
    		 * <p>
    		 * Here we need to attempt to discover what the user is trying to do.  There are a few possibilities.
    		 * </p>
    		 * <ul>
    		 *   <li>Add a new name value pair or overwrite an existing name value pair associating a name with a single value</li>
    		 *   <li>Add a new name value pair or overwrite an existing name value pair associating a name with a list of values</li>
    		 *   <li>Add a single value to the list of an existing name value pair</li>
    		 *   <li>Add multiple values to the list of an existing name value pair</li>
    		 * </ul>
    		 */
    		if ( Object.prototype.toString.call( v ) !== '[object Array]' ) {
    			v = [v];
    		}
    		
    		var k = -1;
    		
    		for ( var i=0; i<this.data.length; i++ ) { 
    			if ( ( this.data[i].name ) == n ) {
    				k = i;
    				break;
    			}
    		}
    		if ( k >= 0 ) {
    			if ( overwrite ) { 
    				this.data[i] = { name: n, value: v };
    			}
    			else {
    				this.data[i].value = this.data[i].value.concat( v );
    			}
    		}
    		else {
    			this.data.push( { name: n, value: v } );
    		}
    	}
    	
    	this.cleanup();
    	this.writeHashData();
    	
    } , 
    
    cleanup : function() { 
    	
    	switch ( this.mode ) { 
    	case "nvp":
    		for ( var i=0; i<this.data.length; i++ ) {
    			this.data[i].value = this.removeDuplicatesFromArray( this.data[i].value );
    		}
    		break;
    	case "list":
    		this.data = this.removeDuplicatesFromArray( this.data );
    		break;
    	
    	}
    	
    } , 
    
    removeDuplicatesFromArray : function( a ) {
    	var used = Array();
    	var output = Array();
    	
    	for( var i=0; i < a.length; i++ ) {
    		if ( used[a[i]] === undefined ) {
    			used[a[i]] = true;
    			output.push( a[i] );
    		}
    	}
    	
    	return output;
    } ,
    
    writeHashData : function() { 
    	
    	h = "";
    	
    	switch( this.mode ) { 
    	case "nvp": 
    		for ( var i=0; i<this.data.length; i++ ) { 
    			h += this.data[i].name + "=" + this.data[i].value.join( "," );
    			
    			if ( i < this.data.length - 1 ) {
    				h += this.divider;
    			}
    		}
    		break;
    	case "list":
    		h = this.data.join( "," );
    		break;
    	}

    	if ( h != "" ) {
    		window.location.hash = "#" + h;
    	}
    	else {
    		window.location.hash = "";
    	}
    	
    } ,
    
    clear : function() {
    	this.data = Array();
    } , 
    
    put : function( n, v ) { 
    	
    	return this.putData( n, v, true );
    	
    }, 
    
    add : function( n, v ) { 
    	
    	return this.putData( n, v, false );
    	
    }, 
    
    remove : function( i ) { 
    	
    	if ( typeof i == "number" && this.data.length > i ) {
    		return this.data.splice( i, 1 );
    	}
    	if ( typeof i == "string" ) {
    		for ( var j = 0; j < this.data.length; j++ ) { 
    			if ( this.data[j].name == i ) {
    				this.data.splice( j, 1 );
    			}
    		}
    	}
    	
    	this.writeHashData();
    	
    }, 
    
    refresh : function() { 
    	return this.getData( true );    	
    }, 
    
    /**
     * Convenience method for retrieving all the data in the current hash or a particular named item in NVP mode.
     * 
     * @param n Optional.  The name of a nvp.  This param is only respected when running in NVP mode
     * @returns The full data array if n is not provided or we are running in List mode, or the array of values 
     *          associated with the name n provided
     */
    get : function( n ) {
    	this.getData();
    	
    	if ( this.mode == "nvp" && n ) { 
    		for( var i=0; i<this.data.length; i++ ) { 
    			if( this.data[i].name && this.data[i].name == n ) { 
    				return this.data[i].value;
    			}
    		}
    		return Array();
    	}
    	
    	return this.data;
    }
    	
};


