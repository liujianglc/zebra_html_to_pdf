/* 
  video tracking for standard html5 videos 
  automated based on current site code / structure
  dependencies: 
    - jQuery 
    - html5 video 
*/
if ( (typeof jQuery=='function')&&(jQuery===$) ) {
  $(document).ready(function() {

/*    
var i = document.createElement('iframe');
i.style.display = 'none';
document.body.appendChild(i);
window.console = i.contentWindow.console;
*/    
    window.s.videoTracker = {
      video : '',
      title : '',
      id    : '',
      duration : '',
      currentTime : '',
      isEventViewed : {}
    };
    
    $('video').on('play',function(e,x){

      /* 
          I can't even.. there's some kind of weird bug in firefox where 
          console shows proper s.trackData call w/ payload but Omn is 
          popping as if it were a s.t() no params.  It's just for play 
          and it's just for firefox. Near as I can tell, it's some kind of 
          wtfery with the video player itself or other code conflicting on 
          play. Soo.. play event is in the timeupdate callback!  
        */
      var s = window.s;
      var vt = s.videoTracker;
      var ev = vt.isEventViewed;

      /* play */
      if (vt.id != this.currentSrc) {
        vt.isEventViewed.play = false;
      }
      if (!vt.isEventViewed.play) {
        vt.video = this;
        vt.title = this.title;
        vt.id = this.currentSrc;
        vt.duration = this.duration;
        vt.currentTime = this.currentTime;
        vt.isEventViewed.play = true;
        var payload = { 
          "player" : "HTML5 Video", 
          "title" : vt.title||vt.id,
          "event" : "play", 
          "duration" : vt.duration||0, 
          "position" : 0 
        }; 
        _satellite.notify('DTM: Video Play > trackVideo: '+JSON.stringify(payload),3);
        //s.eo=0;
        s.trackVideo(payload);
        //s.trackVideo(payload);

      }      

    
    });  // end play
    
    $('video').on('ended',function(e){
      var s = window.s;
      var vt = s.videoTracker;
      vt.isEventViewed = {};
      var payload = { 
        "player" : "HTML5 Video", 
        "title" : vt.title||vt.id,
        "event" : "100%", 
        "duration" : vt.duration, 
        "position" : vt.duration 
      }; 

      s.trackVideo(payload);
    });  // end ended
   
    $('video').on('timeupdate',function(e){
      var s = window.s;
      var vt = s.videoTracker;
      var ev = vt.isEventViewed;

      /* play */
/*
      if (vt.id != this.currentSrc) {
        vt.isEventViewed.play = false;
      }
      if (!vt.isEventViewed.play) {
        vt.video = this;
        vt.title = this.title;
        vt.id = this.currentSrc;
        vt.duration = this.duration;
        vt.currentTime = this.currentTime;
        vt.isEventViewed.play = true;
        var payload = { 
          "player" : "HTML5 Video", 
          "title" : vt.title||vt.id,
          "event" : "play", 
          "length" : vt.duration, 
          "position" : 0 
        }; 
        s.trackVideo(payload);
      }      
*/
      /* percent viewed */
      var duration = Number(this.duration);
      var currentTime = Number(this.currentTime);
      var percentViewed = Math.floor((currentTime/duration)*100);
      switch(percentViewed) {
        case 25 : 
          if (!ev['25']) {
            ev['25']=true;
            var payload = { 
              "player" : "HTML5 Video", 
              "title" : vt.title||vt.id,
              "event" : "25%", 
              "duration" : duration, 
              "position" : currentTime 
            }; 

            s.trackVideo(payload);
          }
          break;
        case 50 : 
          if (!ev['50']) {
            ev['50']=true;
            var payload = { 
              "player" : "HTML5 Video", 
              "title" : vt.title||vt.id,
              "event" : "50%", 
              "duration" : duration, 
              "position" : currentTime 
            }; 

            s.trackVideo(payload);
          }
          break;
        case 75 : 
          if (!ev['75']) {
            ev['75']=true;
            var payload = { 
              "player" : "HTML5 Video", 
              "title" : vt.title||vt.id,
              "event" : "75%", 
              "duration" : duration, 
              "position" : currentTime 
            }; 

            s.trackVideo(payload);
          }
          break;
        } // end switch
     }); // end timeupdate  
    
  }); // end document.ready
} // end if jQuery
