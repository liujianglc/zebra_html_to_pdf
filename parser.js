var cheerio = require('cheerio');
var fs = require("fs");
var pdf = require('html-pdf');
var html = fs.readFileSync('VC80 Vehicle Mount Mobile Computer Spec Sheet.htm', 'utf8');


var options = {
    // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
    "height": "10.5in", // allowed units: mm, cm, in, px
    "width": "8in", // allowed units: mm, cm, in, px
    "orientation": "portrait", // portrait or landscape

    // Page options
    "border": {
        "top": "0.5in", // default is 0, units: mm, cm, in, px
        "right": "0.5in",
        "bottom": "0.5in",
        "left": "0.5in"
    },

    "header": {
        "height": "15mm",
        "contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
    },

    // Zooming option, can be used to scale images if `options.type` is not pdf
    "zoomFactor": "0.8", // default is 1

    // File options
    "type": "pdf", // allowed file types: png, jpeg, pdf
    "quality": "75", // only used for types png & jpeg

}

fs.readFile('VC80 Vehicle Mount Mobile Computer Spec Sheet.htm', function(err, data) {
    if (err) {
        return console.error(err);
    }
    //console.log("异步读取: " + data.toString());
    $ = cheerio.load(data.toString());
    var title = $("h1").text();
    console.log('title=' + title);

    //console.log($('.section').length);

    /*var ss = $('.section');
    for (var i = 0; i < ss.length; i++) {
        fs.appendFile('input.txt', $(ss[i]).html(), function(err) {
            if (err) {
                return console.error(err);
            }
        })
        console.log($(ss[i]).html());

    }

    return;*/

    var content = $('.content-col.fullpage');
    var html = $(content).html();
    pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    var main_desc = $(content).find('.parbase.section.text.richText');
    console.log('sub title=' + $(main_desc).find('h3').text());
    console.log('desc=' + $(main_desc).find('p').text());
    //console.log($(main_desc).find('.section').length);
    var column_control = $('.column-control');
    ///console.log(column_control.length);
    for (var i = 0; i < column_control.length; i++) {
        var have_data = false;
        have_data = $(column_control[i]).find('.section').length > 0 ? true : false;
        if (have_data) {
            //console.log($(column_control[i]).find('.section').length);
            var sections = $(column_control[i]).find('.section');
            for (var j = 0; j < sections.length; j++) {
                if ($(sections[j]).hasClass('imagecomponent')) {
                    console.log('img=' + $(sections[j]).find('img').attr('srcset'));
                } else {
                    console.log();
                    console.log($(sections[j]).find('div').html());
                }
            }
        }
    }

    var par = $(".par.parsys");
    console.log($(par).find('div').html())

    var table = $('.tablegrid.parbase.section');


});
