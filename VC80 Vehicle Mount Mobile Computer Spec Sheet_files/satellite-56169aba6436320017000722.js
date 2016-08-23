/*
  Analytics file
*/
var s_fileLastUpdated='dtm:2016.04.18:new site - '+_satellite.getVar('siteVersion');

var $z=$z||{};$z.w=window;$z.l=$z.w.location;$z.h=$z.l.href;$z.o=$z.l.host;


/* Start - SiteCatalyst */
$z.sc_acct = "zebraglobal";
switch (location.hostname) {
  case "test-www.zebra.com":
    $z.sc_acct = "maindev";
    break;
}
var s=new AppMeasurement();
s.account=$z.sc_acct;
s.trackingServer="zebratechnologies.d1.sc.omtrdc.net";
s.cookieDomainPeriods=s_cdp();
s.date=new Date();
s.dynamicVariablePrefix="..";
s.jq="undefined"==typeof jQuery?!1:parseInt(jQuery.fn.jquery.replace(/\./g,''))>=142?!0:!1 ;
s.linkDownloadFileTypes="zpl,cab,apk,jad,bin,hex,exe,pdf,txt,bmp,csv,jar,wml,zip";
s.trackDownloadLinks=true;
s.linkInternalFilters="javascript:,kagi.com,zebra.com,eloqua.com,motorolasolutions.com,sharepoint.com,zebra.ir,zebrapartner.com,bulldogsolutions.net,zebraapac.com,zatar.com,zebra888.cn,zebrazipship.com,zcardprinters.com, zebra.lan,zebra.hu,virtualzebra.com,retailzebra.com,impressoras-zebra.com,zebraresourcefinder.com,zebrabarkod.com,serviceslatamzebra.com,zebraexperience.com,zebratrainingportal.com,zebrasports.com,zebracard.com.au,zebra.jobs,zebraetiketten.nl,zebraitalia.it,zebraonestore.com,zebrasalespower3.com,zebratradeinprogram.com,zebra-info.pl,zebracard.ca,zebracard.com,zebrasia.com,zebratechnologies.net,scansource-zebra.eu,zebracard.dk,zebra-online.ru,suministroszebra.com,zebra-kartendrucker.at,myzebra.fr,zebrasocialondemand.com,you-scsc-zebra.eu,zebraapacincentives.com,zebra-printer-etiketok.com.ua";
s.trackExternalLinks=true;
s.linkLeaveQueryString=false;
s.linkTrackEvents="";
s.linkTrackVars="";
s.trackInlineStats=false;
s.queryVarsList="id";
s.usePlugins=true;

/**** Start Supplies Selector Tool Tracking Part 1 ****/
s.SSTTracker = {
  config : {
    // needs to be in order of form steps 
    'stepEvents' : {
      'printer'       : ['event52'],
      'productType'   : ['event53'],
      'printTech'     : ['event54'],
      'materialType'  : ['event55'],
      // no ajax call for length so not tracking media size for now
      'width'         : [],
      'length'        : [] 
    },
    'ctaEvents' : {
      'searchResults' : ['event51'],
      'addToCart'     : ['event57']  
    },
    'numSearches'     : ['eVar73'],
    'searchCriteria'  : ['prop72','eVar72'],
    'refSite'         : ['eVar74']
  },
  trackAddToCart : function (skus) {
    s.t_ltv = s.linkTrackVars;
    s.t_lte = s.linkTrackEvents;
    var skus=skus||[];
    if (!(skus instanceof Array))
      skus=Array(skus);
    if (skus.length>0) {
      s.products=';'+skus.join(',;');
      s.events=s.SSTTracker.config.ctaEvents.addToCart.join(',');
      s.linkTrackVars='events,products';
      s.linkTrackEvents=s.events;
      s.tl(true,'o','Supplies Selector Tool');
    }
    s.linkTrackVars = s.t_ltv;
    s.linkTrackEvents = s.t_lte;
  } // end trackAddToCart
} // end SSTTracker 
/**** End Supplies Selector Tool Tracking Part 1 ****/

/* Setup Console Debugging */
s.c_r("sc_debug_tracking")&&(s.debugTracking=!0);

/* Page Name Plugin Config */
s.siteID="Zebra";
s.defaultPage="";

/* some legacy wrapper functions. gonna leave an empty definition just in case */
function scCustomClick(){}
function scCustomExit(){}



if(s.jq){

  /* Filter checkbox clicks */
  jQuery('input:checkbox').change(function(){
  	if(s.url.match(/\/forms\//)){
  		return;
  	}else{
  	$z.ckBox=jQuery(this).attr('name').toLowerCase().replace(/&amp;/g,'and');
  	if((jQuery(this).is(':checked'))&&($z.ckBox!=$z.currentBox)){
  		s.linkTrackVars=s.linkTrackVars+",events,eVar21";
  		s.linkTrackEvents=s.events="event4";
  		s.usePlugins=false;
  		s.eVar1=s.channel;
  		s.eVar6=s.pageName;
  		s.prop8="action: filter selected > "+$z.ckBox;
  		s.eVar21=$z.ckBox;
  		s.tl(this,'o','filter selected');
  		$z.currentBox=$z.ckBox;
  		s.prop8=s.eVar21="";
  	}}
  });

}//end jquery check


/* Plugin Calls */
function s_doPlugins(s){
  
  var dp=s.dynamicVariablePrefix||'D=';
  
  /* grab omniture vars from on-page data layer */
  if (!s.trackData.isCalled) {
    if (!s.linkObject) {
      var data_layer={};
      if (typeof window.AnalyticsDataLayer=='object') {
        data_layer=window.AnalyticsDataLayer;
      } else if (typeof window.AdobeDataLayer=='object') {
        data_layer=window.AdobeDataLayer;
      } else if (typeof window.dataLayer=='object') {
        data_layer=window.dataLayer;
      }
      for (var v in data_layer) {
        if (data_layer.hasOwnProperty(v)) {
          s[v] = data_layer[v];
        }
      }
    }  
  }

  /* automated download tracking */
  if (s.linkObject&&s.linkType&&s.linkType=='d') {
    s.events='event38';
    s.eVar44=s.linkURL;
    s.eVar45=s.linkURL.split('.').pop();       
    s.linkTrackEvents='event38';
    s.linkTrackVars='events,eVar44,eVar45';
  }

  /* automated exit tracking */
  if (s.linkObject&&s.linkType&&s.linkType=='e') {
    s.events='event76';
    s.contextData={exiturl:s.linkURL};
    s.linkTrackEvents='event76';
    s.linkTrackVars='contextData.exiturl';
  }

  /* site navigation for blogs links */
  s.o_sites = [
    'blogs.zebra.com',
    'mpe.zebra.com'
  ];
  if (s.linkObject&&s.linkURL) {
    for (var c=0,l=s.o_sites.length;c<l;c++) {
      if (s.linkURL.indexOf(s.o_sites[c])!=-1) {
        s.o_url=s.linkURL;
        break; 
      }
    }
    if (s.o_url) {
      s.linkType='o';
      s.events='event5';
      s.eVar15='cross_site|'+s.o_url;
      s.linkTrackEvents='event5';
      s.linkTrackVars='events,eVar15';
    }
  }
  
  /**** Start Supplies Selector Tool Tracking Part 2 ****/
  // ref site
  if (location.href.indexOf('/supply-selector-tool.html')>0) {
    for (var c=0,l=s.SSTTracker.config.refSite.length;c<l;c++) {
      s[s.SSTTracker.config.refSite[c]]=s.Util.getQueryParam('dmar')||document.referrer||'unidentified referrer';
    }
  }
  /**** End Supplies Selector Tool Tracking Part 2 ****/
  
  
  s.setDemandBaseVars();
  
  s.addEvent('event1');
	s.pageName=s.pageName?s.pageName:s.getPageName();
	s.server=s.u0;
	s.prop1=s.account;
	s.prop8=s.prop8?s.prop8:"..pageName";
	s.prop9=s.getVisitNum();
	s.prop11="1"==s.prop9?"new":"repeat";
	s.prop14=s.getDaysSinceLastVisit();
	s.prop17=$z.page?$z.page.contentType:"";
	s.prop22=s.getTimeParting();
	s.eVar6="..pageName";
	s.eVar9=s.prop9?"..c9":"";
	s.eVar10=s.Util.getQueryParam('icid');
	s.eVar11=s.prop11?"..c11":"";
	s.eVar14=s.prop14?"..c14":"";
	s.eVar17=s.prop17?"..c17":"";
	s.eVar22=s.prop22?"..c22":"";
	s.prop5=s.getPercentPageViewed(); 
	s.eVar5 = s.prop5 ? "..c5": "";

  /* 404 pages */
  if ( s.pageName.indexOf('404-page')>-1 ) {
    s.pageType='errorPage';
    s.prop12=String(location.hash).replace(/^#/,'');
  }
  
  /* product pages */
  if (s.jq) {
    if ( 
      jQuery('meta[data-isproduct]')
       &&
      (jQuery('meta[data-isproduct]').data('isproduct')==true)
    ) {
      s.addEvent('event11');
      if (
        jQuery('meta[data-isproduct]').data('product-title')
      ) {
        s.eVar30 = jQuery('meta[data-isproduct]').data('product-title');
      }
    }
  }
  
    
		s.hier1="home";
		
		if(s.u3){
			s.channel=s.u3;
			s.hier1=s.hier1+"|"+s.u3;
		}else if(!s.u3&&s.u2&&s.cfn){
			s.channel=s.cfn;
			s.hier1=s.hier1+"|"+s.cfn;
		}
		
		if(s.u4){
			s.prop2=s.u4;
			s.hier1=s.hier1+"|"+s.u4;	
		}else if(!s.u4&&s.u3&&s.cfn){
			s.prop2=s.cfn;
			s.hier1=s.hier1+"|"+s.cfn;
		}
		
		if(s.u5){
			s.prop3=s.u5;
			s.hier1=s.hier1+"|"+s.u5;			
		}else if(!s.u5&&s.u4&&s.cfn){
			s.prop3=s.cfn;
			s.hier1=s.hier1+"|"+s.cfn;
		}
		if(s.u6){
			s.prop4=s.u6;	
			s.hier1=s.hier1+"|"+s.u6;
		}else if(!s.u6&&s.u5&&s.cfn){
			s.prop4=s.cfn;
			s.hier1=s.hier1+"|"+s.cfn;
		}
		s.eVar1=s.channel?"..ch":"";
		s.eVar2=s.prop2?"..c2":"";
		s.eVar3=s.prop3?"..c3":"";
		s.eVar4=s.prop4?"..c4":"";

    /* previous page */
  	s.prevPage = s.getPreviousValue(s.pageName,'s_v75');
    s.eVar75 = s.prevPage;
    s.prop75 = '..v75';    

  
		/* Logged In/Out/Recognized */
		if(s.c_r('ObSSOCookie')){
			s.prop16="logged in";
			s.date.setTime(s.date.getTime()+63072E6);
			s.c_w('s_c16','1',s.date);
		}else{
			if(s.c_r('s_c16')){
				s.prop16="non-logged in : recognized";
			}else{
				s.prop16="non-logged in : non-recognized";
			}
		}
		s.eVar16=s.prop16?"..c16":"";

    /* form viewed */
    if (s.jq) {
      if ( jQuery('form[id*="zebra"]').length>0 ) {
        s.addEvent('event47');
        s.eVar50=s.pageName;
      } 
    } 

    /* form completed */
		if(s.jq){
			s.eVar26=s.c_r('s_evar26')||'not specified';
			s.c_w('s_evar26','',-1);
			s.eVar27=s.c_r('s_evar27')||'not specified';
			s.c_w('s_evar27','',-1);
			s.eVar28=s.c_r('s_evar28')||'not specified';
			s.c_w('s_evar28','',-1);

			jQuery('input.form_button_submit').click(function() {
				if (jQuery('select[name=Country]').val()) {
					$z.v26 = jQuery('select[name=Country]').val().toLowerCase();
					s.c_w('s_evar26', $z.v26);
				}
				if (jQuery('select[name=BuyingTimeframe]').val()) {
					$z.v27 = jQuery('select[name=BuyingTimeframe]').val().toLowerCase();
					s.c_w('s_evar27', $z.v27);
				}
				if (jQuery('select[name=models]').val()) {
					$z.v28 = jQuery('select[name=models]').val().toLowerCase();
					s.c_w('s_evar28', $z.v28);
				}
			});
			$z.h1=jQuery('h1').text().toLowerCase();
			if($z.h1.match(/confirmation/)){
				s.addEvent('event7');
        if ( s.prevPage.match(/contact-general-inquiry/) ) {
          s.addEvent('event49');
        }
        if ( s.prevPage.match(/buying-interest/) ) {
          s.addEvent('event50');
        }
			}
		}

    /* 
      bandaid: trigger form complete on tco calculator page if 
      previous page was eloqua 
     */
    if (
      (document.referrer.indexOf('secure.eloqua.com')!=-1)
       &&
      (location.pathname.indexOf('/total-cost-ownership-tco-comparison')!=-1)
    ) { 
      if (!s.events) s.events='';
      s.events=s.apl(s.events,'event7',',',2); 
    }
    

		/* Internal Search */
		if(s.url.match(/search/)){
			s.prop34=s.Util.getQueryParam('q').replace(/\+/g,' ');
			s.eVar34=s.getValOnce(s.prop34,'s_cv34');
			if(s.eVar34){
				s.addEvent('event21');
			}
			if(s.jq){
				if(jQuery('.no-results-found').html()){
					s.eVar35="zero";
					s.addEvent('event22');
				}else if(jQuery('.total-results').html()){
					s.eVar35=jQuery('.total-results').html().split(' of ')[1].split(' ')[0]
				}
			}
		}

  
	s.plugins="";

  /* site version */
  s.prop47=(typeof s_fileLastUpdated!='undefined')?s_fileLastUpdated:'unknown';

  /* page language */
  if (!s.prop48) {
    // default english
    s.pageLang = 'en';
    s.pathParts = location.pathname.split('/');
    // afaik knowledge base is english-only.. 
    if (location.hostname!='km.zebra.com') {
      if (typeof s.pathParts[2] != 'undefined') {
        // homepage has e.g. /us/en.html/ need to strip .html
        s.pageLang = s.pathParts[2].replace(/\..*$/,'');
      }
    }
    s.prop48 = s.pageLang;
  }

  /* external campaign tracking (main ppc) */
	s.campaign=s.Util.getQueryParam('cid');
  
  /* external campaign tracking (tactic integration) */
  if (!s.campaign) {
    var tacticFound = false;
    var tacticValues = [];
    s.tacticCampaignParams = ['tactic_type','tactic_detail'];
    for (var c=0,cp=s.tacticCampaignParams.length;c<cp;c++) {
      if (s.Util.getQueryParam(s.tacticCampaignParams[c])) tacticFound = true;
      tacticValues.push(s.Util.getQueryParam(s.tacticCampaignParams[c])||'none');
    }
    if (tacticFound) 
      s.campaign = tacticValues.join('|');
  }

  /* external campaign tracking (GA integration) */
  if (!s.campaign) {
    var utmFound = false;
    var utmValues = [];
    s.utmCampaignParams = ['utm_campaign','utm_medium','utm_source','utm_term','utm_content','utm_site'];
    for (var c=0,cp=s.utmCampaignParams.length;c<cp;c++) {
      if (s.Util.getQueryParam(s.utmCampaignParams[c])) utmFound = true;
      utmValues.push(s.Util.getQueryParam(s.utmCampaignParams[c])||'none');
    }
    if (utmFound) 
      s.campaign = utmValues.join('|');
  }

  
  /* generic var dupes */
  s.varDupes = {
    // 'var to dupe to':['url param of var to dupe':'var to dupe']
    'prop44':['v44','eVar44']
  }
  for (var v in s.varDupes) {
    if ( s.varDupes.hasOwnProperty(v)&&(typeof s[s.varDupes[v][1]] != 'undefined')&&(s[s.varDupes[v][1]]!='') ) {
      s[v]=dp+s.varDupes[v][0];
      if (s.linkType) s.linkTrackVars=s.apl(s.linkTrackVars,v,',',2);
    }
  }

  /* every call */
  if (s.linkType) {
    // ['variable1','variable2','etc..']
    s.trackEveryCall = [];
    for (var n=0,v=s.trackEveryCall.length;n<v;n++) {
      s.linkTrackVars=s.apl(s.linkTrackVars,s.trackEveryCall[n],',',2);
    }
  }

} // end s_doPlugins
s.doPlugins=s_doPlugins;


/* Cookie Domain Periods */
function s_cdp(){var a=window.location.host,b;b=a.match(/\./g);b=b?b:'11';return b.length}


/* Chrome Session cookies v1.5k */
if(s.n&&s.n.userAgent.indexOf('Chrome')>=0){s.c_wr=s.c_w;s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,cs,t;cs=s.chromeSession?s.chromeSession:60;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-60);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}else if(l='SESSION'||!e){e=new Date;e.setTime(e.getTime()+(cs*60000))}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/; expires='+e.toGMTString()+';'+(d?' domain='+d+';':'');return s.c_r(k)==v}return 0};}

/* URL component helper v2.1k */
s.url=s.pageURL?s.pageURL:s.w.location.href;s.url=s.url.toLowerCase();s.uf=s.url.split('/');s.ul=s.uf.length;s.sda=s.uf[2].split('.');if(s.sda.length>2){s.sd=s.sda[0];}s.url=s.url.substring(0,(s.url.indexOf('#')==-1)?s.url.length:s.url.indexOf('#'));s.url=s.url.substring(0,(s.url.indexOf('?')==-1)?s.url.length:s.url.indexOf('?'));s.hash=s.w.location.hash;s.fn=s.url.substring(s.url.lastIndexOf('/')+1,s.url.length);s.cfn=s.fn.split('.')[0].replace(/_/gi,'-');if(s.uf[2]){s.u0=s.uf[2];}if(s.ul>4&&s.uf[3]){s.u1=s.uf[3];}if(s.ul>5&&s.uf[4]){s.u2=s.uf[4];}if(s.ul>6&&s.uf[5]){s.u3=s.uf[5];}if(s.ul>7&&s.uf[6]){s.u4=s.uf[6];}if(s.ul>8&&s.uf[7]){s.u5=s.uf[7];}if(!Date.now){Date.now=function(){return new Date().valueOf()}}

/* Regex */
s.reg1=/Â®|â„¢|\<\/span\>|\<span\>|\>|\,|^\s+|\s+$/g;

/* Get Action Depth v1.5k */
s.getActionDepth=function(c){var v=1,t=new Date;t.setTime(t.getTime()+18E5);c=c?c:'s_gad';if(!s.c_r(c)){v=1}if(s.c_r(c)){v=s.c_r(c);v++}if(!s.c_w(c,v,t)){s.c_w(c,v,0)}return s.pageNum=v}();

/* Utility Functions: split,p_c */
s.split=new Function("l","d","var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
s.p_c=new Function("v","c","var x=v.indexOf('=');return c.toLowerCase()==v.substring(0,x<0?v.length:x).toLowerCase()?v:0");

/* Event Adder v1.1k */   
s.addEvent=new Function("v","var s=this,i,n,a,m=0,L=s.events,d=',';if(L){a=L.split(d);for(i=0;i<a.length;i++){n=a[i];m=m||n==v;}}if(!m)L=L?L+d+v:v;s.events=L;return s.events");

/* Page Name v2.5k */ 
s.fl=function(x,l){return x?(''+x).substring(0,l):x};
s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};
s.getPageName=new Function("u","var s=this,v=u?u:''+s.w.location,x=v.indexOf(':'),y=v.indexOf('/',x+4),z=v.indexOf('?'),c=s.pathConcatDelim,e=s.pathExcludeDelim,g=s.queryVarsList,d=s.siteID,n=d?d:'',q=z<0?'':v.substring(z+1),p=v.substring(y+1,q?z:v.length);c=c?c:':';e=e?e:';';z=p.indexOf('#');p=z<0?p:s.fl(p,z);x=e?p.indexOf(e):-1;p=x<0?p:s.fl(p,x);p+=!p||p.charAt(p.length-1)=='/'?s.defaultPage:'';y=c?c:'/';while(p){x=p.indexOf('/');x=x<0?p.length:x;z=s.fl(p,x);if(!s.pt(s.pathExcludeList,',','p_c',z))n+=n?y+z:z;p=p.substring(x+1)}y=c?c:'?';while(g){x=g.indexOf(',');x=x<0?g.length:x;z=s.fl(g,x);z=s.pt(q,'&','p_c',z);if(z){n+=n?y+z:z;y=c?c:'&'}g=g.substring(x+1)}return n");

/* Visit Number v2.5k */
s.getVisitNum=new Function("var s=this,a=31536E6,b=18E5,d=new Date(),t=d.getTime(),v,V,c='s_vnum',C='s_invisit';d.setTime(t+b);v=parseInt(s.c_r(c));V=s.c_r(C);if(!v){s.c_w(C,1,d);d.setTime(t+a);s.c_w(c,1,d);return 1}else{if(!V){s.c_w(C,1,d);d.setTime(t+a);s.c_w(c,v+1,d);return v+1}else{s.c_w(C,1,d);return v}}");

/* Days Since Last Visit 3.1k */
s.getDaysSinceLastVisit=new Function("c","x","r","f","g","var s=this,a=new Date(),b,d,e,h=18E5,j=2592E6,k=6048E5,l=864E5,m,t=a.getTime(),v=['cookies not supported','first visit','more than 30 days','more than 7 days','less than 7 days','less than 1 day','zero'];c=c?c:'s_dslv';x=x?x:1095;v[1]=f?f:v[1];e=s.c_r(c);a.setTime((l*x)+t);if(e&&g){s.c_w(c,e,a)}else{s.c_w(c,t,a)}if(!e){m=1;b=v[1]}else{d=t-e;if(d>h){b=Math.floor(d/l);if(d>j){m=2}else if(d<j+1&&d>k){m=3}else if(d<k+1&&d>l){m=4}else if(d<l+1){m=5;b=v[6]}}}if(s.c_r(c)){if(r){return b}else if(m){return v[m]}else{return ''}}else{return v[0]}");

/*
 * Plugin: getQueryParam (legacy support)
 * Modified for AM compatibility just in case someone out there is
 * using it. note: the real legacy plugin is case-insensitive
 * for params. AM Util version is case-sensitive!
 */
s.getQueryParam=function(p,d,u) {
  var s=this;
  var c,l,v=[];
  var p=p||'';
  var d=d||'';
  var u=u||'';
  p=p.split(',');
  for (c=0,l=p.length;c<l;c++) {
    v.push(s.Util.getQueryParam(p[c],u));
  }
  return v.join(d);
} // end getQueryParam (legacy support)
s.p_gpv=new Function("k","u","h","var s=this,v='',q;j=h==1?'#':'?';i=u.indexOf(j);if(k&&i>-1){q=u.substring(i+1);v=s.pt(q,'&','p_gvf',k)}return v");
s.p_gvf=new Function("t","k","if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'True':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s.epa(v)}return''");

/* Get Value Once v2.1k */
s.getValOnce=new Function("v","c","e","t","var s=this,a=new Date,v=v?v:'',c=c?c:'s_gvo',e=e?e:0,i=t=='m'?6E4:864E5;k=s.c_r(c);if(v){a.setTime(a.getTime()+e*i);s.c_w(c,v,e==0?0:a);}return v==k?'':v");

/* Time Parting v3.4k */
s.getTimeParting=new Function("f","z","l","var s=this,d,A,B,C,D,E,F,G,H,U,W,X,Y,Z;d=new Date();A=d.getFullYear();if(A=='2013'){B='10';C='03'}if(A=='2014'){B='09';C='02'}if(A=='2015'){B='08';C='01'}if(A=='2016'){B='13';C='06'}if(A=='2017'){B='12';C='05'}if(A=='2018'){B='11';C='04'}if(!B||!C){B='11';C='04'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;D=new Date('1/1/2000');if(D.getDay()!=6||D.getMonth()!=0){return 'data not available'}else{z=z?z:'-6';z=parseFloat(z);B=new Date(B);C=new Date(C);W=new Date();if(W>B&&W<C&&!l){z=z+1}W=W.getTime()+(W.getTimezoneOffset()*6E4);W=new Date(W+(36E5*z));X=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];E=B=W.getHours();C=W.getMinutes();if(C<10){C='0'+C};D=W.getDay();Z=X[D];A='weekday';if(D==6||D==0){A='weekend'}X='00';if(C>29){X='30'}U='am';if(B>=12){U='pm';B=B-12};if(B==0){B=12};F=W.getDate();G=W.getMonth()+1;H=W.getFullYear();W=B+':'+X+U;Y=C+U;if(f){if(f=='h'){return W}if(f=='m'){return B+':'+Y}if(f=='k'){return E+':'+X}if(f=='r'){return E+':'+C}if(f=='d'){return Z}if(f=='w'){return A}if(f=='f'){return Z+'|'+B+':'+Y}if(f=='j'){return G+'/'+F+'/'+H;}}else{return Z+'|'+W}}");


/** video tracking config **/
  s.trackVideoConfig = {
    'name':'prop20,eVar20',
    'segment':'eVar36',
    'contentType':'eVar37',
    'timePlayed':'event17',
    'view':'event18',
    'segmentView':'event23',
    'complete':'event19',
    'milestones':{
      25: 'event24',
      50: 'event25',
      75: 'event26'
    }
  };

/*
** Plugin: trackVideo - wrapper for manual video tracking
** ACR.josh 2013.02.01
**
** Dependencies: s.trackVideoConfig, s.track
*/
s.trackVideo = function (payload) {
  _satellite.notify('OMN: s.trackVideo payload: '+JSON.stringify(payload),3);
  var s=this;
  var data = {};
	
	if (!s.trackVideoConfig) return false;
  if ( typeof(payload)!='object' ) return false;

  payload.title = payload.title||s.trackVideo.title||'no title';
  s.trackVideo.title = payload.title;

  payload.player = payload.player||s.trackVideo.player||'no player or vendor'; 
  s.trackVideo.player = payload.player;

  s.trackVideo.position = s.trackVideo.position||0;
  payload.position = (payload.position) ? parseInt(payload.position) : 0;
  var elapsed = (payload.position-s.trackVideo.position < 0) ?  0 : payload.position-s.trackVideo.position; 
  s.trackVideo.position = payload.position;
  var events=[];
  var segment='';
	var validEvent = false;	

  switch (payload.event) {
    case 'play' :
      validEvent = true;
      events.push(s.trackVideoConfig.view);
      segment = '1:M:0-25';
      break;
    case 'pause' :
      break;
    case 'stop' :
      break;
    case 'continue' :
      break;
    case '25%' :
      validEvent = true;
      events.push(s.trackVideoConfig.milestones[25]);
			events.push(s.trackVideoConfig.segmentView);
			events.push(s.trackVideoConfig.timePlayed+"="+elapsed);
      segment = '1:M:0-25';
      break;
    case '50%' :
      validEvent = true;
      events.push(s.trackVideoConfig.milestones[50]);
			events.push(s.trackVideoConfig.segmentView);
			events.push(s.trackVideoConfig.timePlayed+"="+elapsed);
      segment = '2:M:25-50';
      break;
    case '75%' :
      validEvent = true;
      events.push(s.trackVideoConfig.milestones[75]);
			events.push(s.trackVideoConfig.segmentView);
			events.push(s.trackVideoConfig.timePlayed+"="+elapsed);
      segment = '3:M:25-75';
      break;
    case '100%' :
      validEvent = true;
      events.push(s.trackVideoConfig.complete);
			events.push(s.trackVideoConfig.segmentView);
			events.push(s.trackVideoConfig.timePlayed+"="+elapsed);
      segment = '4:M:75-100';
      break;
	} // end switch payload.event

  data.events = events.join(',').replace(/^,+|,+$/,'');
  var vt = s.trackVideoConfig.name.split(',');
	for (var n=0;n<vt.length;n++) data[vt[n]]= s.trackVideo.title;
  var vs = s.trackVideoConfig.segment.split(',');
	for (var n=0;n<vs.length;n++) data[vs[n]]= segment;
  var ct = s.trackVideoConfig.contentType.split(',');
	for (var n=0;n<ct.length;n++) data[ct[n]]= s.trackVideo.player;
    
  _satellite.notify('DTM: trackVideo > trackData called: data payload: '+JSON.stringify(data),3);
  if (validEvent) s.trackData(data,'tl_o','Video Tracking');
} // end function trackVideo

/*
 * Plugin: trackData - general tracking callback function
 * Last Updated: 2016.01.13 ACR.josh 
 */
s.trackData = function (params,tt,ld) {
  //try{var i=document.createElement('iframe');i.style.display='none';document.body.appendChild(i);window.console=i.contentWindow.console;}catch(e){};
  //_satellite.notify('DTM: trackData called: arguments: '+JSON.stringify(arguments),3);

  var s=this;
  s.trackData.isCalled=true;
  s.trackData.callType=false;
  if (arguments[1]) {
    var t_ltv = s.linkTrackVars;
    var t_lte = s.linkTrackEvents;
    if (typeof(arguments[2]) == 'undefined' || arguments[2] == '') var ld = 'no value';
    for(var j in params) {
      if(params.hasOwnProperty(j)) {
        s.linkTrackVars = s.apl(s.linkTrackVars,j,',',2); 
        switch (j) {
          case 'events' :
            params[j]=new String(params[j]);
            var k = params[j].split(',');
            for (var c = 0; c<k.length; c++) {
              var te = k[c].split(/:|=/)[0];
              s.linkTrackEvents = s.apl(s.linkTrackEvents,te,',',2);
            }
          break;
          case 'contextData' :
            if (typeof s[j] == 'undefined') s[j]={};
            for (var c in params[j]) {
              if (params[j].hasOwnProperty(c)) {
                var cv = j+'.'+c;
                s.linkTrackVars = s.apl(s.linkTrackVars,cv,',',2);
              }
            }
          break;
        } // end switch
        if (j=='contextData') {
          if (typeof s[j]=='undefined') s[j]={};
          s[j][c]=params[j][c];
        } else {
          s[j] = params[j];
        }
      } // end if
    } // end for j
    var lt = String(arguments[1]).split('_')[1]||String(arguments[1]);
    if (!s.inList(lt,'e,d,o', ',')) lt = 'o';
    s.trackData.callType='tl';
    s.tl(true,lt,ld);
    for(var j in params) {
      if(params.hasOwnProperty(j)) {
        s[j]=(j=='contextData')?{}:'';
      }
    }
    s.linkTrackVars=t_ltv;
    s.linkTrackEvents=t_lte;
  } else {      
    var named = ['contextData','campaign','channel','charSet','currencyCode','events','pageName','pageType','pageURL','products','purchaseID','referrer','server','state','TnT','transactionID','visitorID','zip'];
    for(var n=0,l=named.length;n<l;n++) {
      if(typeof s[named[n]] != 'undefined') delete s[named[n]];
    }
    for(n=1;n<=100;n++) {
      if(typeof s['hier'+n] != 'undefined') delete s['hier'+n];
      if(typeof s['eVar'+n] != 'undefined') delete s['eVar'+n];
      if(typeof s['prop'+n] != 'undefined') delete s['prop'+n];
    }
    s.events = ''; 
    s.contextData={};
    for(var j in params) {
      if(params.hasOwnProperty(j)) {
        if (j=='contextData') {
          if (typeof s[j]=='undefined') s[j]={};
          s[j][c]=params[j][c];
        } else {
          s[j] = params[j];
        }
      } // end if
    } // end for j
    s.trackData.callType='t';
    s.t();
  } // end else 
  s.trackData.callType=false;
  s.trackData.isCalled=false;
} // end s.trackData

/*
 * Utility: inList v1.0 - find out if a value is in a list
 * MODIFIED BY: Acronym 2012.11.09 
 * Now Accepts optional 4th arg for sub-delimiter to account for serialized events
 */
s.inList= function(v,l,D,d) {
  var s=this,ar=Array(),i=0,D=(D)?D:',',d=(d)?String(d):'';
  if((typeof(l)!='undefined')&&((typeof(l)=='string')||(l instanceof String))){
    if(s.split) {
      ar=s.split(l,D);
    } else if(l.split) {
      ar=l.split(D);
    } else { 
      return -1;
    }
  } else if ((typeof(l)!='undefined')&&((typeof(l)=='array')||(l instanceof Array))) {
    ar=l;
  }    else {
    return false;
  }
  while(i<ar.length){
    if(v==((d&&((typeof(ar[i])=='string')||(ar[i] instanceof String)))?ar[i].split(d)[0]:ar[i]))
      return true;i++
  }
  return false;
}

/*
 * Plugin Utility: apl v1.1
 */
s.apl=new Function("l","v","d","u",""
+"var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
+"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
+"e()));}}if(!m)l=l?l+d+v:v;return l");
  
/************* DO NOT ALTER ANYTHING BELOW THIS LINE. **************/
/*
 * Plugin: getPreviousValue_v1.0 - return previous value of designated
 *   variable (requires split utility)
 */
s.getPreviousValue=new Function("v","c","el",""
+"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
+"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
+"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
+":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
+"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

/* 
* Plugin: getPercentPageViewed v1.4 
*/ 
s.handlePPVevents=new Function("","" 
+"if(!s.getPPVid)return;var dh=Math.max(Math.max(s.d.body.scrollHeigh" 
+"t,s.d.documentElement.scrollHeight),Math.max(s.d.body.offsetHeight," 
+"s.d.documentElement.offsetHeight),Math.max(s.d.body.clientHeight,s." 
+"d.documentElement.clientHeight)),vph=s.w.innerHeight||(s.d.documen" 
+"tElement.clientHeight||s.d.body.clientHeight),st=s.w.pageYOffset||" 
+"(s.w.document.documentElement.scrollTop||s.w.document.body.scroll" 
+"Top),vh=st+vph,pv=Math.min(Math.round(vh/dh*100),100),c=s.c_r('s_pp" 
+"v'),a=(c.indexOf(',')>-1)?c.split(',',4):[],id=(a.length>0)?(a[0]):" 
+"escape(s.getPPVid),cv=(a.length>1)?parseInt(a[1]):(0),p0=(a.length>" 
+"2)?parseInt(a[2]):(pv),cy=(a.length>3)?parseInt(a[3]):(0),cn=(pv>0)" 
+"?(id+','+((pv>cv)?pv:cv)+','+p0+','+((vh>cy)?vh:cy)):'';s.c_w('s_pp" 
+"v',cn);"); 
s.getPercentPageViewed=new Function("pid","" 
+"pid=pid?pid:'-';var s=this,ist=!s.getPPVid?true:false;if(typeof(s.l" 
+"inkType)!='undefined'&&s.linkType!='e')return'';var v=s.c_r('s_ppv'" 
+"),a=(v.indexOf(',')>-1)?v.split(',',4):[];if(a.length<4){for(var i=" 
+"3;i>0;i--){a[i]=(i<a.length)?(a[i-1]):('');}a[0]='';}a[0]=unescape(" 
+"a[0]);s.getPPVpid=pid;s.c_w('s_ppv',escape(pid));if(ist){s.getPPVid" 
+"=(pid)?(pid):(s.pageName?s.pageName:document.location.href);s.c_w('" 
+"s_ppv',escape(s.getPPVid));if(s.w.addEventListener){s.w.addEventL" 
+"istener('load',s.handlePPVevents,false);s.w.addEventListener('scro" 
+"ll',s.handlePPVevents,false);s.w.addEventListener('resize',s.handl" 
+"ePPVevents,false);}else if(s.w.attachEvent){s.w.attachEvent('onlo" 
+"ad',s.handlePPVevents);s.d.attachEvent('onscroll',s.handlePPVevent" 
+"s);s.w.attachEvent('onresize',s.handlePPVevents);}}return(pid!='-'" 
+")?(a):(a[1]);");

s.setDemandBaseVars=function() {
  var s=this;
    /* new demandbase integration */
    try {
   
      s._dtm_db = _satellite.getVar('demandbaseInfo');
      if (s._dtm_db) {
        _satellite.notify('DTM: demandbase data: '+JSON.stringify(s._dtm_db),3);

        s.new_db={
          _delim:':',
          _nonOrgMatchLabel:'[n/a]',
          _contextData: {
            s_dmdbase_group1:[
              {"id":"audience",          "max_size":40},
              {"id":"audience_segment",  "max_size":40},
              {"id":"company_name",      "max_size":40},
              {"id":"industry",          "max_size":40},
              {"id":"sub_industry",      "max_size":40},
              {"id":"employee_range",    "max_size":30},
              {"id":"revenue_range",     "max_size":10}
            ],
            s_dmdbase_group2:[
              {"id": "city",                          "max_size":40},
              {"id": "state",                         "max_size":10},
              {"id": "zip",                           "max_size":12},
              {"id": "country",                       "max_size":10},
              {"id": "registry_area_code",            "max_size":12},
              {"id": "registry_city",                 "max_size":40},
              {"id": "registry_company_name",         "max_size":40},
              {"id": "registry_country_code",         "max_size":10},
              {"id": "registry_zip_code",             "max_size":12},
            ]
/*            s_dmdbase_downstream:[
              { 'id': 'fortune_1000',    'max_size': 5 },
              { 'id': 'forbes_2000',     'max_size': 5 },
              { 'id': 'primary_sic',     'max_size': 8 },
              { 'id': 'employee_count',  'max_size': 7 },
              { 'id': 'web_site',        'max_size': 30 },
              { 'id': 'stock_ticker',    'max_size': 6 },
              { 'id': 'traffic',         'max_size': 30 }
            ]
*/
          }
        };  
        var p,v;
        var cd = s.new_db._contextData;
        for (var c in cd) {
          if (cd.hasOwnProperty(c)) {
            s.contextData[c]=[];
            for (var i=0,l=cd[c].length;i<l;i++) {
              v='';
              p = cd[c][i];
              if ( 
                  (p.id instanceof Array)
                   &&
                  (typeof s._dtm_db[p.id[0]]!='undefined')
                   &&
                  (typeof s._dtm_db[p.id[0]][p.id[1]]!='undefined')
                ){
                  v=s._dtm_db[p.id[0]][p.id[1]];
              }
              else if (
                  (typeof s._dtm_db[p.id]!='undefined')
                ){
                  v=s._dtm_db[p.id];
              }  
              v=((''+v)||s.new_db._nonOrgMatchLabel).slice(0,p.max_size);
              var rep = new RegExp(s.new_db._delim,'g');
              v=v.replace(rep,'.'); 
              s.contextData[c].push(v);
            } // end for
          } // end if
          s.contextData[c]=s.contextData[c].join(s.new_db._delim);
        }

      } // end if s._dtm_db

      
    } catch (e) {
      _satellite.notify(e,5);
    }
  
} // end s.setDemandBaseVars

/*
 Start ActivityMap Module

 The following module enables ActivityMap tracking in Adobe Analytics. ActivityMap
 allows you to view data overlays on your links and content to understand how
 users engage with your web site. If you do not intend to use ActivityMap, you
 can remove the following block of code from your AppMeasurement.js file.
 Additional documentation on how to configure ActivityMap is available at:
 https://marketing.adobe.com/resources/help/en_US/analytics/activitymap/getting-started-admins.html
*/
function AppMeasurement_Module_ActivityMap(f){function g(a,d){var b,c,n;if(a&&d&&(b=e.c[d]||(e.c[d]=d.split(","))))for(n=0;n<b.length&&(c=b[n++]);)if(-1<a.indexOf(c))return null;p=1;return a}function q(a,d,b,c,e){var g,h;if(a.dataset&&(h=a.dataset[d]))g=h;else if(a.getAttribute)if(h=a.getAttribute("data-"+b))g=h;else if(h=a.getAttribute(b))g=h;if(!g&&f.useForcedLinkTracking&&e&&(g="",d=a.onclick?""+a.onclick:"")){b=d.indexOf(c);var l,k;if(0<=b){for(b+=10;b<d.length&&0<="= \t\r\n".indexOf(d.charAt(b));)b++;
if(b<d.length){h=b;for(l=k=0;h<d.length&&(";"!=d.charAt(h)||l);)l?d.charAt(h)!=l||k?k="\\"==d.charAt(h)?!k:0:l=0:(l=d.charAt(h),'"'!=l&&"'"!=l&&(l=0)),h++;if(d=d.substring(b,h))a.e=new Function("s","var e;try{s.w."+c+"="+d+"}catch(e){}"),a.e(f)}}}return g||e&&f.w[c]}function r(a,d,b){var c;return(c=e[d](a,b))&&(p?(p=0,c):g(k(c),e[d+"Exclusions"]))}function s(a,d,b){var c;if(a&&!(1===(c=a.nodeType)&&(c=a.nodeName)&&(c=c.toUpperCase())&&t[c])&&(1===a.nodeType&&(c=a.nodeValue)&&(d[d.length]=c),b.a||
b.t||b.s||!a.getAttribute||((c=a.getAttribute("alt"))?b.a=c:(c=a.getAttribute("title"))?b.t=c:"IMG"==(""+a.nodeName).toUpperCase()&&(c=a.getAttribute("src")||a.src)&&(b.s=c)),(c=a.childNodes)&&c.length))for(a=0;a<c.length;a++)s(c[a],d,b)}function k(a){if(null==a||void 0==a)return a;try{return a.replace(RegExp("^[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+","mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+$",
"mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]{1,}","mg")," ").substring(0,254)}catch(d){}}var e=this;e.s=f;var m=window;m.s_c_in||(m.s_c_il=[],m.s_c_in=0);e._il=m.s_c_il;e._in=m.s_c_in;e._il[e._in]=e;m.s_c_in++;e._c="s_m";e.c={};var p=0,t={SCRIPT:1,STYLE:1,LINK:1,CANVAS:1};e._g=function(){var a,d,b,c=f.contextData,e=f.linkObject;(a=f.pageName||f.pageURL)&&(d=r(e,"link",f.linkName))&&(b=r(e,"region"))&&(c["a.activitymap.page"]=a.substring(0,
255),c["a.activitymap.link"]=128<d.length?d.substring(0,128):d,c["a.activitymap.region"]=127<b.length?b.substring(0,127):b,c["a.activitymap.pageIDType"]=f.pageName?1:0)};e.link=function(a,d){var b;if(d)b=g(k(d),e.linkExclusions);else if((b=a)&&!(b=q(a,"sObjectId","s-object-id","s_objectID",1))){var c,f;(f=g(k(a.innerText||a.textContent),e.linkExclusions))||(s(a,c=[],b={a:void 0,t:void 0,s:void 0}),(f=g(k(c.join(""))))||(f=g(k(b.a?b.a:b.t?b.t:b.s?b.s:void 0)))||!(c=(c=a.tagName)&&c.toUpperCase?c.toUpperCase():
"")||("INPUT"==c||"SUBMIT"==c&&a.value?f=g(k(a.value)):a.src&&"IMAGE"==c&&(f=g(k(a.src)))));b=f}return b};e.region=function(a){for(var d,b=e.regionIDAttribute||"id";a&&(a=a.parentNode);){if(d=q(a,b,b,b))return d;if("BODY"==a.nodeName)return"BODY"}}}
/* End ActivityMap Module */
/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

AppMeasurement for JavaScript version: 1.6.1
Copyright 1996-2016 Adobe, Inc. All Rights Reserved
More info available at http://www.adobe.com/marketing-cloud.html
*/
function AppMeasurement(){var a=this;a.version="1.6.1";var k=window;k.s_c_in||(k.s_c_il=[],k.s_c_in=0);a._il=k.s_c_il;a._in=k.s_c_in;a._il[a._in]=a;k.s_c_in++;a._c="s_c";var q=k.AppMeasurement.Cb;q||(q=null);var r=k,n,t;try{for(n=r.parent,t=r.location;n&&n.location&&t&&""+n.location!=""+t&&r.location&&""+n.location!=""+r.location&&n.location.host==t.host;)r=n,n=r.parent}catch(u){}a.sb=function(a){try{console.log(a)}catch(b){}};a.Da=function(a){return""+parseInt(a)==""+a};a.replace=function(a,b,d){return!a||
0>a.indexOf(b)?a:a.split(b).join(d)};a.escape=function(c){var b,d;if(!c)return c;c=encodeURIComponent(c);for(b=0;7>b;b++)d="+~!*()'".substring(b,b+1),0<=c.indexOf(d)&&(c=a.replace(c,d,"%"+d.charCodeAt(0).toString(16).toUpperCase()));return c};a.unescape=function(c){if(!c)return c;c=0<=c.indexOf("+")?a.replace(c,"+"," "):c;try{return decodeURIComponent(c)}catch(b){}return unescape(c)};a.kb=function(){var c=k.location.hostname,b=a.fpCookieDomainPeriods,d;b||(b=a.cookieDomainPeriods);if(c&&!a.cookieDomain&&
!/^[0-9.]+$/.test(c)&&(b=b?parseInt(b):2,b=2<b?b:2,d=c.lastIndexOf("."),0<=d)){for(;0<=d&&1<b;)d=c.lastIndexOf(".",d-1),b--;a.cookieDomain=0<d?c.substring(d):c}return a.cookieDomain};a.c_r=a.cookieRead=function(c){c=a.escape(c);var b=" "+a.d.cookie,d=b.indexOf(" "+c+"="),f=0>d?d:b.indexOf(";",d);c=0>d?"":a.unescape(b.substring(d+2+c.length,0>f?b.length:f));return"[[B]]"!=c?c:""};a.c_w=a.cookieWrite=function(c,b,d){var f=a.kb(),e=a.cookieLifetime,g;b=""+b;e=e?(""+e).toUpperCase():"";d&&"SESSION"!=
e&&"NONE"!=e&&((g=""!=b?parseInt(e?e:0):-60)?(d=new Date,d.setTime(d.getTime()+1E3*g)):1==d&&(d=new Date,g=d.getYear(),d.setYear(g+5+(1900>g?1900:0))));return c&&"NONE"!=e?(a.d.cookie=c+"="+a.escape(""!=b?b:"[[B]]")+"; path=/;"+(d&&"SESSION"!=e?" expires="+d.toGMTString()+";":"")+(f?" domain="+f+";":""),a.cookieRead(c)==b):0};a.H=[];a.ea=function(c,b,d){if(a.wa)return 0;a.maxDelay||(a.maxDelay=250);var f=0,e=(new Date).getTime()+a.maxDelay,g=a.d.visibilityState,m=["webkitvisibilitychange","visibilitychange"];
g||(g=a.d.webkitVisibilityState);if(g&&"prerender"==g){if(!a.fa)for(a.fa=1,d=0;d<m.length;d++)a.d.addEventListener(m[d],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&(a.fa=0,a.delayReady())});f=1;e=0}else d||a.l("_d")&&(f=1);f&&(a.H.push({m:c,a:b,t:e}),a.fa||setTimeout(a.delayReady,a.maxDelay));return f};a.delayReady=function(){var c=(new Date).getTime(),b=0,d;for(a.l("_d")?b=1:a.qa();0<a.H.length;){d=a.H.shift();if(b&&!d.t&&d.t>c){a.H.unshift(d);setTimeout(a.delayReady,
parseInt(a.maxDelay/2));break}a.wa=1;a[d.m].apply(a,d.a);a.wa=0}};a.setAccount=a.sa=function(c){var b,d;if(!a.ea("setAccount",arguments))if(a.account=c,a.allAccounts)for(b=a.allAccounts.concat(c.split(",")),a.allAccounts=[],b.sort(),d=0;d<b.length;d++)0!=d&&b[d-1]==b[d]||a.allAccounts.push(b[d]);else a.allAccounts=c.split(",")};a.foreachVar=function(c,b){var d,f,e,g,m="";e=f="";if(a.lightProfileID)d=a.L,(m=a.lightTrackVars)&&(m=","+m+","+a.ja.join(",")+",");else{d=a.e;if(a.pe||a.linkType)m=a.linkTrackVars,
f=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(m=a[e].Bb,f=a[e].Ab));m&&(m=","+m+","+a.C.join(",")+",");f&&m&&(m+=",events,")}b&&(b=","+b+",");for(f=0;f<d.length;f++)e=d[f],(g=a[e])&&(!m||0<=m.indexOf(","+e+","))&&(!b||0<=b.indexOf(","+e+","))&&c(e,g)};a.p=function(c,b,d,f,e){var g="",m,p,k,w,n=0;"contextData"==c&&(c="c");if(b){for(m in b)if(!(Object.prototype[m]||e&&m.substring(0,e.length)!=e)&&b[m]&&(!d||0<=d.indexOf(","+(f?f+".":"")+m+","))){k=!1;if(n)for(p=
0;p<n.length;p++)m.substring(0,n[p].length)==n[p]&&(k=!0);if(!k&&(""==g&&(g+="&"+c+"."),p=b[m],e&&(m=m.substring(e.length)),0<m.length))if(k=m.indexOf("."),0<k)p=m.substring(0,k),k=(e?e:"")+p+".",n||(n=[]),n.push(k),g+=a.p(p,b,d,f,k);else if("boolean"==typeof p&&(p=p?"true":"false"),p){if("retrieveLightData"==f&&0>e.indexOf(".contextData."))switch(k=m.substring(0,4),w=m.substring(4),m){case "transactionID":m="xact";break;case "channel":m="ch";break;case "campaign":m="v0";break;default:a.Da(w)&&("prop"==
k?m="c"+w:"eVar"==k?m="v"+w:"list"==k?m="l"+w:"hier"==k&&(m="h"+w,p=p.substring(0,255)))}g+="&"+a.escape(m)+"="+a.escape(p)}}""!=g&&(g+="&."+c)}return g};a.mb=function(){var c="",b,d,f,e,g,m,p,k,n="",r="",s=e="";if(a.lightProfileID)b=a.L,(n=a.lightTrackVars)&&(n=","+n+","+a.ja.join(",")+",");else{b=a.e;if(a.pe||a.linkType)n=a.linkTrackVars,r=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(n=a[e].Bb,r=a[e].Ab));n&&(n=","+n+","+a.C.join(",")+",");r&&(r=","+r+",",
n&&(n+=",events,"));a.events2&&(s+=(""!=s?",":"")+a.events2)}if(a.visitor&&1.5<=parseFloat(a.visitor.version)&&a.visitor.getCustomerIDs){e=q;if(g=a.visitor.getCustomerIDs())for(d in g)Object.prototype[d]||(f=g[d],e||(e={}),f.id&&(e[d+".id"]=f.id),f.authState&&(e[d+".as"]=f.authState));e&&(c+=a.p("cid",e))}a.AudienceManagement&&a.AudienceManagement.isReady()&&(c+=a.p("d",a.AudienceManagement.getEventCallConfigParams()));for(d=0;d<b.length;d++){e=b[d];g=a[e];f=e.substring(0,4);m=e.substring(4);!g&&
"events"==e&&s&&(g=s,s="");if(g&&(!n||0<=n.indexOf(","+e+","))){switch(e){case "supplementalDataID":e="sdid";break;case "timestamp":e="ts";break;case "dynamicVariablePrefix":e="D";break;case "visitorID":e="vid";break;case "marketingCloudVisitorID":e="mid";break;case "analyticsVisitorID":e="aid";break;case "audienceManagerLocationHint":e="aamlh";break;case "audienceManagerBlob":e="aamb";break;case "authState":e="as";break;case "pageURL":e="g";255<g.length&&(a.pageURLRest=g.substring(255),g=g.substring(0,
255));break;case "pageURLRest":e="-g";break;case "referrer":e="r";break;case "vmk":case "visitorMigrationKey":e="vmt";break;case "visitorMigrationServer":e="vmf";a.ssl&&a.visitorMigrationServerSecure&&(g="");break;case "visitorMigrationServerSecure":e="vmf";!a.ssl&&a.visitorMigrationServer&&(g="");break;case "charSet":e="ce";break;case "visitorNamespace":e="ns";break;case "cookieDomainPeriods":e="cdp";break;case "cookieLifetime":e="cl";break;case "variableProvider":e="vvp";break;case "currencyCode":e=
"cc";break;case "channel":e="ch";break;case "transactionID":e="xact";break;case "campaign":e="v0";break;case "latitude":e="lat";break;case "longitude":e="lon";break;case "resolution":e="s";break;case "colorDepth":e="c";break;case "javascriptVersion":e="j";break;case "javaEnabled":e="v";break;case "cookiesEnabled":e="k";break;case "browserWidth":e="bw";break;case "browserHeight":e="bh";break;case "connectionType":e="ct";break;case "homepage":e="hp";break;case "events":s&&(g+=(""!=g?",":"")+s);if(r)for(m=
g.split(","),g="",f=0;f<m.length;f++)p=m[f],k=p.indexOf("="),0<=k&&(p=p.substring(0,k)),k=p.indexOf(":"),0<=k&&(p=p.substring(0,k)),0<=r.indexOf(","+p+",")&&(g+=(g?",":"")+m[f]);break;case "events2":g="";break;case "contextData":c+=a.p("c",a[e],n,e);g="";break;case "lightProfileID":e="mtp";break;case "lightStoreForSeconds":e="mtss";a.lightProfileID||(g="");break;case "lightIncrementBy":e="mti";a.lightProfileID||(g="");break;case "retrieveLightProfiles":e="mtsr";break;case "deleteLightProfiles":e=
"mtsd";break;case "retrieveLightData":a.retrieveLightProfiles&&(c+=a.p("mts",a[e],n,e));g="";break;default:a.Da(m)&&("prop"==f?e="c"+m:"eVar"==f?e="v"+m:"list"==f?e="l"+m:"hier"==f&&(e="h"+m,g=g.substring(0,255)))}g&&(c+="&"+e+"="+("pev"!=e.substring(0,3)?a.escape(g):g))}"pev3"==e&&a.c&&(c+=a.c)}return c};a.B=function(a){var b=a.tagName;if("undefined"!=""+a.Fb||"undefined"!=""+a.wb&&"HTML"!=(""+a.wb).toUpperCase())return"";b=b&&b.toUpperCase?b.toUpperCase():"";"SHAPE"==b&&(b="");b&&(("INPUT"==b||
"BUTTON"==b)&&a.type&&a.type.toUpperCase?b=a.type.toUpperCase():!b&&a.href&&(b="A"));return b};a.za=function(a){var b=a.href?a.href:"",d,f,e;d=b.indexOf(":");f=b.indexOf("?");e=b.indexOf("/");b&&(0>d||0<=f&&d>f||0<=e&&d>e)&&(f=a.protocol&&1<a.protocol.length?a.protocol:l.protocol?l.protocol:"",d=l.pathname.lastIndexOf("/"),b=(f?f+"//":"")+(a.host?a.host:l.host?l.host:"")+("/"!=h.substring(0,1)?l.pathname.substring(0,0>d?0:d)+"/":"")+b);return b};a.I=function(c){var b=a.B(c),d,f,e="",g=0;return b&&
(d=c.protocol,f=c.onclick,!c.href||"A"!=b&&"AREA"!=b||f&&d&&!(0>d.toLowerCase().indexOf("javascript"))?f?(e=a.replace(a.replace(a.replace(a.replace(""+f,"\r",""),"\n",""),"\t","")," ",""),g=2):"INPUT"==b||"SUBMIT"==b?(c.value?e=c.value:c.innerText?e=c.innerText:c.textContent&&(e=c.textContent),g=3):c.src&&"IMAGE"==b&&(e=c.src):e=a.za(c),e)?{id:e.substring(0,100),type:g}:0};a.Db=function(c){for(var b=a.B(c),d=a.I(c);c&&!d&&"BODY"!=b;)if(c=c.parentElement?c.parentElement:c.parentNode)b=a.B(c),d=a.I(c);
d&&"BODY"!=b||(c=0);c&&(b=c.onclick?""+c.onclick:"",0<=b.indexOf(".tl(")||0<=b.indexOf(".trackLink("))&&(c=0);return c};a.vb=function(){var c,b,d=a.linkObject,f=a.linkType,e=a.linkURL,g,m;a.ka=1;d||(a.ka=0,d=a.clickObject);if(d){c=a.B(d);for(b=a.I(d);d&&!b&&"BODY"!=c;)if(d=d.parentElement?d.parentElement:d.parentNode)c=a.B(d),b=a.I(d);b&&"BODY"!=c||(d=0);if(d&&!a.linkObject){var p=d.onclick?""+d.onclick:"";if(0<=p.indexOf(".tl(")||0<=p.indexOf(".trackLink("))d=0}}else a.ka=1;!e&&d&&(e=a.za(d));e&&
!a.linkLeaveQueryString&&(g=e.indexOf("?"),0<=g&&(e=e.substring(0,g)));if(!f&&e){var n=0,r=0,q;if(a.trackDownloadLinks&&a.linkDownloadFileTypes)for(p=e.toLowerCase(),g=p.indexOf("?"),m=p.indexOf("#"),0<=g?0<=m&&m<g&&(g=m):g=m,0<=g&&(p=p.substring(0,g)),g=a.linkDownloadFileTypes.toLowerCase().split(","),m=0;m<g.length;m++)(q=g[m])&&p.substring(p.length-(q.length+1))=="."+q&&(f="d");if(a.trackExternalLinks&&!f&&(p=e.toLowerCase(),a.Ca(p)&&(a.linkInternalFilters||(a.linkInternalFilters=k.location.hostname),
g=0,a.linkExternalFilters?(g=a.linkExternalFilters.toLowerCase().split(","),n=1):a.linkInternalFilters&&(g=a.linkInternalFilters.toLowerCase().split(",")),g))){for(m=0;m<g.length;m++)q=g[m],0<=p.indexOf(q)&&(r=1);r?n&&(f="e"):n||(f="e")}}a.linkObject=d;a.linkURL=e;a.linkType=f;if(a.trackClickMap||a.trackInlineStats)a.c="",d&&(f=a.pageName,e=1,d=d.sourceIndex,f||(f=a.pageURL,e=0),k.s_objectID&&(b.id=k.s_objectID,d=b.type=1),f&&b&&b.id&&c&&(a.c="&pid="+a.escape(f.substring(0,255))+(e?"&pidt="+e:"")+
"&oid="+a.escape(b.id.substring(0,100))+(b.type?"&oidt="+b.type:"")+"&ot="+c+(d?"&oi="+d:"")))};a.nb=function(){var c=a.ka,b=a.linkType,d=a.linkURL,f=a.linkName;b&&(d||f)&&(b=b.toLowerCase(),"d"!=b&&"e"!=b&&(b="o"),a.pe="lnk_"+b,a.pev1=d?a.escape(d):"",a.pev2=f?a.escape(f):"",c=1);a.abort&&(c=0);if(a.trackClickMap||a.trackInlineStats||a.ActivityMap){var b={},d=0,e=a.cookieRead("s_sq"),g=e?e.split("&"):0,m,p,k,e=0;if(g)for(m=0;m<g.length;m++)p=g[m].split("="),f=a.unescape(p[0]).split(","),p=a.unescape(p[1]),
b[p]=f;f=a.account.split(",");m={};for(k in a.contextData)k&&!Object.prototype[k]&&"a.activitymap."==k.substring(0,14)&&(m[k]=a.contextData[k],a.contextData[k]="");a.c=a.p("c",m)+(a.c?a.c:"");if(c||a.c){c&&!a.c&&(e=1);for(p in b)if(!Object.prototype[p])for(k=0;k<f.length;k++)for(e&&(g=b[p].join(","),g==a.account&&(a.c+=("&"!=p.charAt(0)?"&":"")+p,b[p]=[],d=1)),m=0;m<b[p].length;m++)g=b[p][m],g==f[k]&&(e&&(a.c+="&u="+a.escape(g)+("&"!=p.charAt(0)?"&":"")+p+"&u=0"),b[p].splice(m,1),d=1);c||(d=1);if(d){e=
"";m=2;!c&&a.c&&(e=a.escape(f.join(","))+"="+a.escape(a.c),m=1);for(p in b)!Object.prototype[p]&&0<m&&0<b[p].length&&(e+=(e?"&":"")+a.escape(b[p].join(","))+"="+a.escape(p),m--);a.cookieWrite("s_sq",e)}}}return c};a.ob=function(){if(!a.zb){var c=new Date,b=r.location,d,f,e=f=d="",g="",m="",k="1.2",n=a.cookieWrite("s_cc","true",0)?"Y":"N",q="",s="";if(c.setUTCDate&&(k="1.3",(0).toPrecision&&(k="1.5",c=[],c.forEach))){k="1.6";f=0;d={};try{f=new Iterator(d),f.next&&(k="1.7",c.reduce&&(k="1.8",k.trim&&
(k="1.8.1",Date.parse&&(k="1.8.2",Object.create&&(k="1.8.5")))))}catch(t){}}d=screen.width+"x"+screen.height;e=navigator.javaEnabled()?"Y":"N";f=screen.pixelDepth?screen.pixelDepth:screen.colorDepth;g=a.w.innerWidth?a.w.innerWidth:a.d.documentElement.offsetWidth;m=a.w.innerHeight?a.w.innerHeight:a.d.documentElement.offsetHeight;try{a.b.addBehavior("#default#homePage"),q=a.b.Eb(b)?"Y":"N"}catch(u){}try{a.b.addBehavior("#default#clientCaps"),s=a.b.connectionType}catch(x){}a.resolution=d;a.colorDepth=
f;a.javascriptVersion=k;a.javaEnabled=e;a.cookiesEnabled=n;a.browserWidth=g;a.browserHeight=m;a.connectionType=s;a.homepage=q;a.zb=1}};a.M={};a.loadModule=function(c,b){var d=a.M[c];if(!d){d=k["AppMeasurement_Module_"+c]?new k["AppMeasurement_Module_"+c](a):{};a.M[c]=a[c]=d;d.Sa=function(){return d.Wa};d.Xa=function(b){if(d.Wa=b)a[c+"_onLoad"]=b,a.ea(c+"_onLoad",[a,d],1)||b(a,d)};try{Object.defineProperty?Object.defineProperty(d,"onLoad",{get:d.Sa,set:d.Xa}):d._olc=1}catch(f){d._olc=1}}b&&(a[c+"_onLoad"]=
b,a.ea(c+"_onLoad",[a,d],1)||b(a,d))};a.l=function(c){var b,d;for(b in a.M)if(!Object.prototype[b]&&(d=a.M[b])&&(d._olc&&d.onLoad&&(d._olc=0,d.onLoad(a,d)),d[c]&&d[c]()))return 1;return 0};a.qb=function(){var c=Math.floor(1E13*Math.random()),b=a.visitorSampling,d=a.visitorSamplingGroup,d="s_vsn_"+(a.visitorNamespace?a.visitorNamespace:a.account)+(d?"_"+d:""),f=a.cookieRead(d);if(b){f&&(f=parseInt(f));if(!f){if(!a.cookieWrite(d,c))return 0;f=c}if(f%1E4>v)return 0}return 1};a.N=function(c,b){var d,
f,e,g,m,k;for(d=0;2>d;d++)for(f=0<d?a.ra:a.e,e=0;e<f.length;e++)if(g=f[e],(m=c[g])||c["!"+g]){if(!b&&("contextData"==g||"retrieveLightData"==g)&&a[g])for(k in a[g])m[k]||(m[k]=a[g][k]);a[g]=m}};a.La=function(c,b){var d,f,e,g;for(d=0;2>d;d++)for(f=0<d?a.ra:a.e,e=0;e<f.length;e++)g=f[e],c[g]=a[g],b||c[g]||(c["!"+g]=1)};a.ib=function(a){var b,d,f,e,g,k=0,p,n="",q="";if(a&&255<a.length&&(b=""+a,d=b.indexOf("?"),0<d&&(p=b.substring(d+1),b=b.substring(0,d),e=b.toLowerCase(),f=0,"http://"==e.substring(0,
7)?f+=7:"https://"==e.substring(0,8)&&(f+=8),d=e.indexOf("/",f),0<d&&(e=e.substring(f,d),g=b.substring(d),b=b.substring(0,d),0<=e.indexOf("google")?k=",q,ie,start,search_key,word,kw,cd,":0<=e.indexOf("yahoo.co")&&(k=",p,ei,"),k&&p)))){if((a=p.split("&"))&&1<a.length){for(f=0;f<a.length;f++)e=a[f],d=e.indexOf("="),0<d&&0<=k.indexOf(","+e.substring(0,d)+",")?n+=(n?"&":"")+e:q+=(q?"&":"")+e;n&&q?p=n+"&"+q:q=""}d=253-(p.length-q.length)-b.length;a=b+(0<d?g.substring(0,d):"")+"?"+p}return a};a.Ra=function(c){var b=
a.d.visibilityState,d=["webkitvisibilitychange","visibilitychange"];b||(b=a.d.webkitVisibilityState);if(b&&"prerender"==b){if(c)for(b=0;b<d.length;b++)a.d.addEventListener(d[b],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&c()});return!1}return!0};a.aa=!1;a.F=!1;a.Za=function(){a.F=!0;a.i()};a.Y=!1;a.R=!1;a.Va=function(c){a.marketingCloudVisitorID=c;a.R=!0;a.i()};a.ba=!1;a.S=!1;a.$a=function(c){a.visitorOptedOut=c;a.S=!0;a.i()};a.V=!1;a.O=!1;a.Na=function(c){a.analyticsVisitorID=
c;a.O=!0;a.i()};a.X=!1;a.Q=!1;a.Pa=function(c){a.audienceManagerLocationHint=c;a.Q=!0;a.i()};a.W=!1;a.P=!1;a.Oa=function(c){a.audienceManagerBlob=c;a.P=!0;a.i()};a.Qa=function(c){a.maxDelay||(a.maxDelay=250);return a.l("_d")?(c&&setTimeout(function(){c()},a.maxDelay),!1):!0};a.Z=!1;a.D=!1;a.qa=function(){a.D=!0;a.i()};a.isReadyToTrack=function(){var c=!0,b=a.visitor;a.aa||a.F||(a.Ra(a.Za)?a.F=!0:a.aa=!0);if(a.aa&&!a.F)return!1;b&&b.isAllowed()&&(a.Y||a.marketingCloudVisitorID||!b.getMarketingCloudVisitorID||
(a.Y=!0,a.marketingCloudVisitorID=b.getMarketingCloudVisitorID([a,a.Va]),a.marketingCloudVisitorID&&(a.R=!0)),a.ba||a.visitorOptedOut||!b.isOptedOut||(a.ba=!0,a.visitorOptedOut=b.isOptedOut([a,a.$a]),a.visitorOptedOut!=q&&(a.S=!0)),a.V||a.analyticsVisitorID||!b.getAnalyticsVisitorID||(a.V=!0,a.analyticsVisitorID=b.getAnalyticsVisitorID([a,a.Na]),a.analyticsVisitorID&&(a.O=!0)),a.X||a.audienceManagerLocationHint||!b.getAudienceManagerLocationHint||(a.X=!0,a.audienceManagerLocationHint=b.getAudienceManagerLocationHint([a,
a.Pa]),a.audienceManagerLocationHint&&(a.Q=!0)),a.W||a.audienceManagerBlob||!b.getAudienceManagerBlob||(a.W=!0,a.audienceManagerBlob=b.getAudienceManagerBlob([a,a.Oa]),a.audienceManagerBlob&&(a.P=!0)),a.Y&&!a.R&&!a.marketingCloudVisitorID||a.V&&!a.O&&!a.analyticsVisitorID||a.X&&!a.Q&&!a.audienceManagerLocationHint||a.W&&!a.P&&!a.audienceManagerBlob||a.ba&&!a.S)&&(c=!1);a.Z||a.D||(a.Qa(a.qa)?a.D=!0:a.Z=!0);a.Z&&!a.D&&(c=!1);return c};a.k=q;a.q=0;a.callbackWhenReadyToTrack=function(c,b,d){var f;f={};
f.eb=c;f.cb=b;f.ab=d;a.k==q&&(a.k=[]);a.k.push(f);0==a.q&&(a.q=setInterval(a.i,100))};a.i=function(){var c;if(a.isReadyToTrack()&&(a.Ya(),a.k!=q))for(;0<a.k.length;)c=a.k.shift(),c.cb.apply(c.eb,c.ab)};a.Ya=function(){a.q&&(clearInterval(a.q),a.q=0)};a.Ta=function(c){var b,d,f=q,e=q;if(!a.isReadyToTrack()){b=[];if(c!=q)for(d in f={},c)f[d]=c[d];e={};a.La(e,!0);b.push(f);b.push(e);a.callbackWhenReadyToTrack(a,a.track,b);return!0}return!1};a.lb=function(){var c=a.cookieRead("s_fid"),b="",d="",f;f=8;
var e=4;if(!c||0>c.indexOf("-")){for(c=0;16>c;c++)f=Math.floor(Math.random()*f),b+="0123456789ABCDEF".substring(f,f+1),f=Math.floor(Math.random()*e),d+="0123456789ABCDEF".substring(f,f+1),f=e=16;c=b+"-"+d}a.cookieWrite("s_fid",c,1)||(c=0);return c};a.t=a.track=function(c,b){var d,f=new Date,e="s"+Math.floor(f.getTime()/108E5)%10+Math.floor(1E13*Math.random()),g=f.getYear(),g="t="+a.escape(f.getDate()+"/"+f.getMonth()+"/"+(1900>g?g+1900:g)+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+" "+
f.getDay()+" "+f.getTimezoneOffset());a.visitor&&(a.visitor.jb&&(a.authState=a.visitor.jb()),!a.supplementalDataID&&a.visitor.getSupplementalDataID&&(a.supplementalDataID=a.visitor.getSupplementalDataID("AppMeasurement:"+a._in,a.expectSupplementalData?!1:!0)));a.l("_s");a.Ta(c)||(b&&a.N(b),c&&(d={},a.La(d,0),a.N(c)),a.qb()&&!a.visitorOptedOut&&(a.analyticsVisitorID||a.marketingCloudVisitorID||(a.fid=a.lb()),a.vb(),a.usePlugins&&a.doPlugins&&a.doPlugins(a),a.account&&(a.abort||(a.trackOffline&&!a.timestamp&&
(a.timestamp=Math.floor(f.getTime()/1E3)),f=k.location,a.pageURL||(a.pageURL=f.href?f.href:f),a.referrer||a.Ma||(a.referrer=r.document.referrer),a.Ma=1,a.referrer=a.ib(a.referrer),a.l("_g")),a.nb()&&!a.abort&&(a.ob(),g+=a.mb(),a.ub(e,g),a.l("_t"),a.referrer=""))),c&&a.N(d,1));a.abort=a.supplementalDataID=a.timestamp=a.pageURLRest=a.linkObject=a.clickObject=a.linkURL=a.linkName=a.linkType=k.s_objectID=a.pe=a.pev1=a.pev2=a.pev3=a.c=a.lightProfileID=0};a.tl=a.trackLink=function(c,b,d,f,e){a.linkObject=
c;a.linkType=b;a.linkName=d;e&&(a.j=c,a.u=e);return a.track(f)};a.trackLight=function(c,b,d,f){a.lightProfileID=c;a.lightStoreForSeconds=b;a.lightIncrementBy=d;return a.track(f)};a.clearVars=function(){var c,b;for(c=0;c<a.e.length;c++)if(b=a.e[c],"prop"==b.substring(0,4)||"eVar"==b.substring(0,4)||"hier"==b.substring(0,4)||"list"==b.substring(0,4)||"channel"==b||"events"==b||"eventList"==b||"products"==b||"productList"==b||"purchaseID"==b||"transactionID"==b||"state"==b||"zip"==b||"campaign"==b)a[b]=
void 0};a.tagContainerMarker="";a.ub=function(c,b){var d,f=a.trackingServer;d="";var e=a.dc,g="sc.",k=a.visitorNamespace;f?a.trackingServerSecure&&a.ssl&&(f=a.trackingServerSecure):(k||(k=a.account,f=k.indexOf(","),0<=f&&(k=k.substring(0,f)),k=k.replace(/[^A-Za-z0-9]/g,"")),d||(d="2o7.net"),e=e?(""+e).toLowerCase():"d1","2o7.net"==d&&("d1"==e?e="112":"d2"==e&&(e="122"),g=""),f=k+"."+e+"."+g+d);d=a.ssl?"https://":"http://";e=a.AudienceManagement&&a.AudienceManagement.isReady();d+=f+"/b/ss/"+a.account+
"/"+(a.mobile?"5.":"")+(e?"10":"1")+"/JS-"+a.version+(a.yb?"T":"")+(a.tagContainerMarker?"-"+a.tagContainerMarker:"")+"/"+c+"?AQB=1&ndh=1&pf=1&"+(e?"callback=s_c_il["+a._in+"].AudienceManagement.passData&":"")+b+"&AQE=1";a.hb(d);a.ga()};a.hb=function(c){a.g||a.pb();a.g.push(c);a.ia=a.A();a.Ja()};a.pb=function(){a.g=a.rb();a.g||(a.g=[])};a.rb=function(){var c,b;if(a.na()){try{(b=k.localStorage.getItem(a.la()))&&(c=k.JSON.parse(b))}catch(d){}return c}};a.na=function(){var c=!0;a.trackOffline&&a.offlineFilename&&
k.localStorage&&k.JSON||(c=!1);return c};a.Aa=function(){var c=0;a.g&&(c=a.g.length);a.o&&c++;return c};a.ga=function(){if(a.o&&(a.v&&a.v.complete&&a.v.timeout&&a.v.pa(),a.o))return;a.Ba=q;if(a.ma)a.ia>a.K&&a.Ha(a.g),a.oa(500);else{var c=a.bb();if(0<c)a.oa(c);else if(c=a.xa())a.o=1,a.tb(c),a.xb(c)}};a.oa=function(c){a.Ba||(c||(c=0),a.Ba=setTimeout(a.ga,c))};a.bb=function(){var c;if(!a.trackOffline||0>=a.offlineThrottleDelay)return 0;c=a.A()-a.Ga;return a.offlineThrottleDelay<c?0:a.offlineThrottleDelay-
c};a.xa=function(){if(0<a.g.length)return a.g.shift()};a.tb=function(c){if(a.debugTracking){var b="AppMeasurement Debug: "+c;c=c.split("&");var d;for(d=0;d<c.length;d++)b+="\n\t"+a.unescape(c[d]);a.sb(b)}};a.Ua=function(){return a.marketingCloudVisitorID||a.analyticsVisitorID};a.U=!1;var s;try{s=JSON.parse('{"x":"y"}')}catch(x){s=null}s&&"y"==s.x?(a.U=!0,a.T=function(a){return JSON.parse(a)}):k.$&&k.$.parseJSON?(a.T=function(a){return k.$.parseJSON(a)},a.U=!0):a.T=function(){return null};a.xb=function(c){var b,
d,f;a.Ua()&&2047<c.length&&("undefined"!=typeof XMLHttpRequest&&(b=new XMLHttpRequest,"withCredentials"in b?d=1:b=0),b||"undefined"==typeof XDomainRequest||(b=new XDomainRequest,d=2),b&&a.AudienceManagement&&a.AudienceManagement.isReady()&&(a.U?b.ta=!0:b=0));!b&&a.Ka&&(c=c.substring(0,2047));!b&&a.d.createElement&&a.AudienceManagement&&a.AudienceManagement.isReady()&&(b=a.d.createElement("SCRIPT"))&&"async"in b&&((f=(f=a.d.getElementsByTagName("HEAD"))&&f[0]?f[0]:a.d.body)?(b.type="text/javascript",
b.setAttribute("async","async"),d=3):b=0);b||(b=new Image,b.alt="",b.abort||"undefined"===typeof k.InstallTrigger||(b.abort=function(){b.src=q}));b.va=function(){try{b.timeout&&(clearTimeout(b.timeout),b.timeout=0)}catch(a){}};b.onload=b.pa=function(){b.va();a.gb();a.ca();a.o=0;a.ga();if(b.ta){b.ta=!1;try{var c=a.T(b.responseText);a.AudienceManagement.passData(c)}catch(d){}}};b.onabort=b.onerror=b.ya=function(){b.va();(a.trackOffline||a.ma)&&a.o&&a.g.unshift(a.fb);a.o=0;a.ia>a.K&&a.Ha(a.g);a.ca();
a.oa(500)};b.onreadystatechange=function(){4==b.readyState&&(200==b.status?b.pa():b.ya())};a.Ga=a.A();if(1==d||2==d){var e=c.indexOf("?");f=c.substring(0,e);e=c.substring(e+1);e=e.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,"");1==d?(b.open("POST",f,!0),b.send(e)):2==d&&(b.open("POST",f),b.send(e))}else if(b.src=c,3==d){if(a.Ea)try{f.removeChild(a.Ea)}catch(g){}f.firstChild?f.insertBefore(b,f.firstChild):f.appendChild(b);a.Ea=a.v}b.timeout=setTimeout(function(){b.timeout&&(b.complete?b.pa():(a.trackOffline&&
b.abort&&b.abort(),b.ya()))},5E3);a.fb=c;a.v=k["s_i_"+a.replace(a.account,",","_")]=b;if(a.useForcedLinkTracking&&a.G||a.u)a.forcedLinkTrackingTimeout||(a.forcedLinkTrackingTimeout=250),a.da=setTimeout(a.ca,a.forcedLinkTrackingTimeout)};a.gb=function(){if(a.na()&&!(a.Fa>a.K))try{k.localStorage.removeItem(a.la()),a.Fa=a.A()}catch(c){}};a.Ha=function(c){if(a.na()){a.Ja();try{k.localStorage.setItem(a.la(),k.JSON.stringify(c)),a.K=a.A()}catch(b){}}};a.Ja=function(){if(a.trackOffline){if(!a.offlineLimit||
0>=a.offlineLimit)a.offlineLimit=10;for(;a.g.length>a.offlineLimit;)a.xa()}};a.forceOffline=function(){a.ma=!0};a.forceOnline=function(){a.ma=!1};a.la=function(){return a.offlineFilename+"-"+a.visitorNamespace+a.account};a.A=function(){return(new Date).getTime()};a.Ca=function(a){a=a.toLowerCase();return 0!=a.indexOf("#")&&0!=a.indexOf("about:")&&0!=a.indexOf("opera:")&&0!=a.indexOf("javascript:")?!0:!1};a.setTagContainer=function(c){var b,d,f;a.yb=c;for(b=0;b<a._il.length;b++)if((d=a._il[b])&&"s_l"==
d._c&&d.tagContainerName==c){a.N(d);if(d.lmq)for(b=0;b<d.lmq.length;b++)f=d.lmq[b],a.loadModule(f.n);if(d.ml)for(f in d.ml)if(a[f])for(b in c=a[f],f=d.ml[f],f)!Object.prototype[b]&&("function"!=typeof f[b]||0>(""+f[b]).indexOf("s_c_il"))&&(c[b]=f[b]);if(d.mmq)for(b=0;b<d.mmq.length;b++)f=d.mmq[b],a[f.m]&&(c=a[f.m],c[f.f]&&"function"==typeof c[f.f]&&(f.a?c[f.f].apply(c,f.a):c[f.f].apply(c)));if(d.tq)for(b=0;b<d.tq.length;b++)a.track(d.tq[b]);d.s=a;break}};a.Util={urlEncode:a.escape,urlDecode:a.unescape,
cookieRead:a.cookieRead,cookieWrite:a.cookieWrite,getQueryParam:function(c,b,d){var f;b||(b=a.pageURL?a.pageURL:k.location);d||(d="&");return c&&b&&(b=""+b,f=b.indexOf("?"),0<=f&&(b=d+b.substring(f+1)+d,f=b.indexOf(d+c+"="),0<=f&&(b=b.substring(f+d.length+c.length+1),f=b.indexOf(d),0<=f&&(b=b.substring(0,f)),0<b.length)))?a.unescape(b):""}};a.C="supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(" ");
a.e=a.C.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" "));a.ja="timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" ");a.L=a.ja.slice(0);a.ra="account allAccounts debugTracking visitor trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData AudienceManagement".split(" ");
for(n=0;250>=n;n++)76>n&&(a.e.push("prop"+n),a.L.push("prop"+n)),a.e.push("eVar"+n),a.L.push("eVar"+n),6>n&&a.e.push("hier"+n),4>n&&a.e.push("list"+n);n="pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest".split(" ");a.e=a.e.concat(n);a.C=a.C.concat(n);a.ssl=0<=k.location.protocol.toLowerCase().indexOf("https");a.charSet="UTF-8";a.contextData={};a.offlineThrottleDelay=0;a.offlineFilename=
"AppMeasurement.offline";a.Ga=0;a.ia=0;a.K=0;a.Fa=0;a.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";a.w=k;a.d=k.document;try{if(a.Ka=!1,navigator){var y=navigator.userAgent;if("Microsoft Internet Explorer"==navigator.appName||0<=y.indexOf("MSIE ")||0<=y.indexOf("Trident/")&&0<=y.indexOf("Windows NT 6"))a.Ka=!0}}catch(z){}a.ca=function(){a.da&&(k.clearTimeout(a.da),a.da=q);a.j&&a.G&&a.j.dispatchEvent(a.G);a.u&&("function"==typeof a.u?a.u():a.j&&a.j.href&&(a.d.location=
a.j.href));a.j=a.G=a.u=0};a.Ia=function(){a.b=a.d.body;a.b?(a.r=function(c){var b,d,f,e,g;if(!(a.d&&a.d.getElementById("cppXYctnr")||c&&c["s_fe_"+a._in])){if(a.ua)if(a.useForcedLinkTracking)a.b.removeEventListener("click",a.r,!1);else{a.b.removeEventListener("click",a.r,!0);a.ua=a.useForcedLinkTracking=0;return}else a.useForcedLinkTracking=0;a.clickObject=c.srcElement?c.srcElement:c.target;try{if(!a.clickObject||a.J&&a.J==a.clickObject||!(a.clickObject.tagName||a.clickObject.parentElement||a.clickObject.parentNode))a.clickObject=
0;else{var m=a.J=a.clickObject;a.ha&&(clearTimeout(a.ha),a.ha=0);a.ha=setTimeout(function(){a.J==m&&(a.J=0)},1E4);f=a.Aa();a.track();if(f<a.Aa()&&a.useForcedLinkTracking&&c.target){for(e=c.target;e&&e!=a.b&&"A"!=e.tagName.toUpperCase()&&"AREA"!=e.tagName.toUpperCase();)e=e.parentNode;if(e&&(g=e.href,a.Ca(g)||(g=0),d=e.target,c.target.dispatchEvent&&g&&(!d||"_self"==d||"_top"==d||"_parent"==d||k.name&&d==k.name))){try{b=a.d.createEvent("MouseEvents")}catch(n){b=new k.MouseEvent}if(b){try{b.initMouseEvent("click",
c.bubbles,c.cancelable,c.view,c.detail,c.screenX,c.screenY,c.clientX,c.clientY,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.button,c.relatedTarget)}catch(q){b=0}b&&(b["s_fe_"+a._in]=b.s_fe=1,c.stopPropagation(),c.stopImmediatePropagation&&c.stopImmediatePropagation(),c.preventDefault(),a.j=c.target,a.G=b)}}}}}catch(r){a.clickObject=0}}},a.b&&a.b.attachEvent?a.b.attachEvent("onclick",a.r):a.b&&a.b.addEventListener&&(navigator&&(0<=navigator.userAgent.indexOf("WebKit")&&a.d.createEvent||0<=navigator.userAgent.indexOf("Firefox/2")&&
k.MouseEvent)&&(a.ua=1,a.useForcedLinkTracking=1,a.b.addEventListener("click",a.r,!0)),a.b.addEventListener("click",a.r,!1))):setTimeout(a.Ia,30)};a.Ia();a.loadModule("ActivityMap")}
function s_gi(a){var k,q=window.s_c_il,r,n,t=a.split(","),u,s,x=0;if(q)for(r=0;!x&&r<q.length;){k=q[r];if("s_c"==k._c&&(k.account||k.oun))if(k.account&&k.account==a)x=1;else for(n=k.account?k.account:k.oun,n=k.allAccounts?k.allAccounts:n.split(","),u=0;u<t.length;u++)for(s=0;s<n.length;s++)t[u]==n[s]&&(x=1);r++}x||(k=new AppMeasurement);k.setAccount?k.setAccount(a):k.sa&&k.sa(a);return k}AppMeasurement.getInstance=s_gi;window.s_objectID||(window.s_objectID=0);
function s_pgicq(){var a=window,k=a.s_giq,q,r,n;if(k)for(q=0;q<k.length;q++)r=k[q],n=s_gi(r.oun),n.setAccount(r.un),n.setTagContainer(r.tagContainerName);a.s_giq=0}s_pgicq();

/* JSON if not available */
typeof JSON!="object"&&(JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}()


/**** Start Supplies Selector Tool Tracking Part 3 ****/
if (location.href.indexOf('/supply-selector-tool.html')>0) {
  if (s.jq) {
    jQuery(document).ready(function() {
      // search form steps
      jQuery(document).ajaxSend(
        function(event,request,settings){
          s.t_ltv = s.linkTrackVars;
          s.t_lte = s.linkTrackEvents;
          s.linkTrackVars='';
          s.linkTrackEvents='';
          s.events='';
          var url=settings.url||'';
          if (url.indexOf('api.zebra.com')==-1) return;
          if ( s.Util.getQueryParam('showResults','',url)=='false' ) {
            var se = s.SSTTracker.config.stepEvents;
            for (var e in se) {
              if ( se.hasOwnProperty(e) ) {
                if ( s.Util.getQueryParam(e,'',url) ) {
                  s.events = se[e].join(',');
                  s.linkTrackVars='events';
                  s.linkTrackEvents=s.events;
                } else {
                  break;
                }
              } // end if
            } // end for
          // results page (
          } else if ( s.Util.getQueryParam('showResults','',url)=='true' ) {
            s.events=s.SSTTracker.config.ctaEvents.searchResults.join(',');
            s.linkTrackVars='events';
            s.linkTrackEvents=s.events;
            var ns = s.SSTTracker.config.numSearches;
            for (var c=0,l=ns.length;c<l;c++) {
              s[ns[c]]='+1';
              s.linkTrackVars+=','+ns[c];
            }
            var sc = s.SSTTracker.config.searchCriteria;
            var sr = (url.split('?')[1]||'').replace(/&?(showResults|dmar)=[^&]/g,'');
            var dmar=s.Util.getQueryParam('dmar','',url);
            if (dmar) sr='dmar='+dmar+'&'+sr;
            for (var c=0,l=sc.length;c<l;c++) {
              s[sc[c]]=sr;
              s.linkTrackVars+=','+sc[c];
            }
          } // end else results true
      
          if (s.events) {
            s.tl(true,'o','Supplies Selector Tool');
          }    
          
          s.linkTrackVars = s.t_ltv;
          s.linkTrackEvents = s.t_lte;
      
        } // end function
      );
    
    }); // end document.ready
  } // end if jquery check
} // end if /supply-selector-tool.html
/**** End Supplies Selector Tool Tracking Part 3 ****/
