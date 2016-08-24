var cheerio = require('cheerio');
var fs = require('fs');

var builder = require('xmlbuilder');

var file_name = 'VC80 Vehicle Mount Mobile Computer Spec Sheet';
//file_name = '3-column';
//file_name = '4-page-2-column';
//file_name = '6-page-2-column';
fs.readFile(file_name + '.htm', function(err, data) {
    $ = cheerio.load(data.toString());

    //begin fetch data
    var title = $("h1").text();
    var main_base = $('.mainpar.parsys');
    var subtitle_desc_container = $(".parbase.section.text.richText");
    var sub_title = $(subtitle_desc_container).find('h3').text();
    var description = $(subtitle_desc_container).find('p').text();
    var img_container = $('.section.imagecomponent');
    var img_elems = $(img_container).find('img');
    var verbiage_container = $(main_base).find('.section.text');
    //console.log(verbiage_container.length);
    var spec_title = '';
    var sepc_sub_title = '';
    var verbiage = '';
    var instructions = [];
    var one_line_desc = '';
    var code = '';
    for (var i = 0; i < verbiage_container.length; i++) {
        if ($(verbiage_container[i]).find('div').text().trim() != '' && !$(verbiage_container[i]).hasClass('richText')) {
            var h3_container = $(verbiage_container[i]).find('h3');
            var h2_container = $(verbiage_container[i]).find('h2');
            //console.log($(verbiage_container[i]).html())
            if (h3_container.length < 1 && h2_container.length < 1) {
                console.log('verbiage')
                verbiage += $($(verbiage_container[i]).find('div')[0]).html();
            }
            if (h3_container.length > 0) {
                console.log('footer')
                one_line_desc = $(verbiage_container[i]).find('h3').text();
                code = $($(verbiage_container[i]).find('a')[0]).text().replace('WWW.ZEBRA.COM\/', '');
                //console.log(code);
            } else {
                if (h2_container.length > 0) {
                    if (i == verbiage_container.length - 1) {
                        console.log('spec title');
                        spec_title = $(verbiage_container[i]).find('h2').text().trim();
                        spec_sub_title = $(verbiage_container[i]).find('p').text();
                    } else {
                        var instrunction_children = $($(verbiage_container[i]).find('div')[0]).children();
                        //console.log(instrunction_children.length)
                        //console.log($(verbiage_container[i]).html())

                        var instruction_content = '';
                        var instruction_title = '';
                        var instruction_count = 0;
                        var old_instrunction_count = 0;
                        for (var m = 0; m < instrunction_children.length; m++) {
                            var tag_name = $(instrunction_children[m]).get(0).tagName
                            if (tag_name == 'h2') {
                                instruction_title = $(instrunction_children[m]).text();
                                instruction_count++;
                                if (instruction_count > 1 && instruction_count != old_instrunction_count) {
                                    instructions[instructions.length] = {
                                        title: instruction_title,
                                        content: instruction_content
                                    };
                                    old_instrunction_count = instruction_count;
                                    instruction_content = '';
                                }
                            } else {
                                instruction_content += $.html(instrunction_children[m]);
                                //console.log(instruction_content);
                            }
                        }
                        instructions[instructions.length] = {
                            title: instruction_title,
                            content: {
                                "#cdata": instruction_content
                            }
                        };
                    }
                }

            }
        }
    }

    var grid = $('.tablegrid.parbase.section');
    console.log('grid table length =' + grid.length);

    var parameters_arr = [];
    for (var i = 0; i < grid.length; i++) {
        var param = {};

        var caption = $(grid[i]).find('table').find('caption').text();
        param.caption = caption;
        param.items = {};
        param.items.item = [];
        $(grid[i]).find('table').find('tr').each(function(i, ele) {
            var td_length = $(this).find('td').length
            if (td_length == 2) {
                var name = $($(this).find('td')[0]).text();
                var value = $($(this).find('td')[1]).text();
                param.items.item[param.items.item.length] = {
                    name: name,
                    value: value
                };
            } else if (td_length == 1) {
                var value = $($(this).find('td')[0]).text();
                param.items.item[param.items.item.length] = {
                    value: value
                };
            }
        });

        parameters_arr[parameters_arr.length] = {
            parameter: param
        };
    }

    var service_container = $(main_base).find('.service');
    var service_title = $(service_container).find('.title').text();
    var service_cotent = $(service_container).find('.content').text();

    var supplies_container = $(main_base).find('.supplies');
    var supplies_title = $(supplies_container).find('.title').text();
    var supplies_cotent = $(supplies_container).find('.content').text();
    //end fetch data

    //  begin create xml
    var root = builder.create('root');
    var base = root.ele('base');
    base.ele('title', title);
    base.ele('sub_title', sub_title);
    base.ele('description', description);
    var imgs = base.ele('imgs');
    for (var i = 0; i < img_elems.length; i++) {
        if ($(img_elems[i]).attr('src')) {
            imgs.ele('img').ele("#cdata", $(img_elems[i]).attr('src'));
        }
    }

    base.ele('verbiage').ele('#cdata', verbiage);
    base.ele({
        'instructions': instructions
    });

    var contact_footer = base.ele('contact_footer');
    contact_footer.ele('code', code);
    contact_footer.ele('one_line_desc', one_line_desc);

    var service = root.ele('service');
    service.ele('title', service_title);
    service.ele('content', service_cotent);

    var supplies = root.ele('supplies');
    supplies.ele('title', supplies_title);
    supplies.ele('content', supplies_cotent);

    var specs = root.ele('specs');
    specs.ele('title', spec_title);
    specs.ele('sub_title', spec_sub_title);
    var parameters = specs.ele('parameters');
    parameters.ele(parameters_arr);
    var xml = root.end({
        pretty: true
    });
    console.log(xml);

    //save xml to file
    fs.writeFile(file_name + '.xml', xml, function(err) {
        if (err) {
            return console.error(err);
        }
    })

    //end create xml
});
