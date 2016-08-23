Zebra.Dialogs.ColumnControl = {

  fieldsToShow : {
    "oneColumn" : ["columnCount", "oneColumnWidth"],
    "twoColumn" : ["columnCount","twoColumnWidth"],
    "threeColumn" : ["columnCount","threeColumnWidth"],
    "fourColumn" : ["columnCount","fourColumnWidth"],
    "fiveColumn" : ["columnCount","fiveColumnWidth"],
    "sixColumn" : ["columnCount","sixColumnWidth"],
    "" : ["columnCount"]
  },

  toggleFields : function(selection) {
    try {
      var selectedVal = selection.getValue();
    } catch(e) {}

    if(selectedVal) {
      var fieldSet = selection.findParentByType("panel");
      var fields = this.fieldsToShow[selectedVal];

      $.each(fieldSet.items.items, function(index, field) {
        var name = /\/([^\/]*)\/?$/.exec(field.getName())[1];

        if($.inArray(name, fields) >= 0) {
          Zebra.Dialogs.showField(field);
        } else {
          Zebra.Dialogs.hideField(field);
        }
      });
    }
  }

};

