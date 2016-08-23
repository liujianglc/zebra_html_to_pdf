/*

    FILE: languagedropdown.js
    DESCRIPTION: Header language dropdown
    AUTHOR(S): Frankie Ramirez

*/

jQuery(function() {
  var current   =   localStorage.getItem('lang'),
      button    =   jQuery('.language-selector'),
      wrapper   =   jQuery('.language-dropdown'),
      selector  =   jQuery('.language-option li a'),
      isOpen    =   false;

  function open() {
    isOpen = true;
    //button.unbind('click');

    wrapper.show();

    button.addClass('selected');

    wrapper.find('ul li a').on('click', function(e) {
      button.html( jQuery(this).parent().html() );
      button.removeClass('selected');
      localStorage.setItem('lang', jQuery(this).parent().data('lang') );

      wrapper.hide();
    });

    //HIDE ON CLICK AWAY
    setTimeout(function() {
      jQuery('body').on('click', {
        elements: ['language-dropdown', 'language-selector'],
        callback: close
      }, clickEvent);
    }, 100);
  }

  function close() { // CLOSE LANGUAGE SELECTOR
    isOpen = false;
    //button.unbind('click');
    button.removeClass('selected');

    wrapper.hide();

    //button.off('click');
    //selector.off('click');
  }

  function clickEvent(e) { // EVENT TO FIRE ON CLICK AWAY
    var targets = [], parents = [];

    // CHECK IF TARGET OR PARENT HAS PROVIDED CLASS(ES)
    jQuery.each(e.data.elements, function(key, value) {
      targets.push(!jQuery(e.target).hasClass(value));
      parents.push(jQuery(e.target).parents().hasClass(value));
    });

    // INVOKE CALLBACK IF TARGET IS OUTSIDE OF PROVIDED CLASS(ES)
    // if ( targets.indexOf(false) < 0  && parents.indexOf(true) < 0  ) {
    //   e.data.callback();
    //   jQuery('body').off('click', clickEvent);
    // }
  }

  if ( current ) {
    wrapper.find('ul li a').each(function() {
      if ( jQuery(this).parent().data('lang') === current ) {
        button.html( jQuery(this).parent().html() );
      }
    });
  }else {
    wrapper.find('ul li a').each(function() {
      if ( jQuery(this).parent().data('lang') === 'us-en' ) {
        button.html( jQuery(this).parent().html() );
      }
    });
  }

  button.on('click', function(e) {
    e.preventDefault();
    if(isOpen) {
      close();
    }else {
      open();
    }
  });

  selector.on('click', function(e) {
    //e.preventDefault();
    close();
  });
});
