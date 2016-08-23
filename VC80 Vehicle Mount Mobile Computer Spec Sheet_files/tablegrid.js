/**
 *  Table Grid
 */
var Zebra = window.Zebra || {};

Zebra.TableGrid = {

    init: function() {
        this.buildMobileView();
    },

    buildMobileView: function() {
        var $desktopContainer = $('.table-grid-container'),
            $mobileContainer = $('.table-grid-mobile'),
            $tablegrid = $('.tablegrid.section');


        if ($(window).width() < 799 && !$('.table-grid-container').hasClass("comparison-theme")) {

            var columnCount = $('table th').length;

            $('.tablegrid th').each(function(index1) {
                var th = $(this);

                $('.tablegrid td').each(function(index2) {
                    if( index2 % columnCount == index1 ) {
                        $('.tablegrid th').hide();
                        $(this).prepend('<div><h4 class="title">'+th.html()+'</h4>');
                    }
                });
            });

        } 

        else if ( $(window).width() < 799 && $desktopContainer.hasClass("comparison-theme") ) {
            $tablegrid.find('table').addClass('hide');

            var columnCount = $tablegrid.find('th').length;

            if( $mobileContainer.children().length == 0 ) {
                $tablegrid.find('th').each(function(index1) {
                    if( index1 > 0 ) {
                        $mobileDetails = $('<div class="mobile-details"></div>');
                        $mobileDetails.append($(this).html());

                        $tablegrid.find('td').each(function(index2) {
                            if( index2 % columnCount == 0 ) {
                                $mobileDetails.append('<h4 class="title">' + $(this).html() + '</h4>');
                            }else if( index2 % columnCount == index1 ) {
                                $mobileDetails.append('<p>' + $(this).html() + '</p>');
                            }
                        });

                        $mobileContainer.append($mobileDetails);
                    }
                });
            }

            $mobileContainer.removeClass('hide');

        } else if($desktopContainer.hasClass('comparison-theme')) {
            $tablegrid.find('table').removeClass('hide');
            $mobileContainer.addClass('hide');
        }
    }
};

Zebra.TableGrid.init();
