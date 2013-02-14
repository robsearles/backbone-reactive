// # List View

'use strict';
var Backbone; // hello jslint
var $; // hello jslint

// ## Define the List Item Model
var ListItem = Backbone.Model.extend({
  url: function () {
    return '/mock-data/message.'+this.id+'.json';
  }
});

// ## Define the List Collection
var ListCollection = Backbone.Collection.extend({
  model: ListItem,

  initialize: function (models, options) {
    this.fetch(options);
  },

  // As we don't really care for the backend in this demo, we have
  // hard-coded some JSON data to use in the application
  url: '/mock-data/list.getList.json'
});


var MessageView = Backbone.View.extend({
  id: 'message',
  initialize: function() {
    var self = this;
    this.model.fetch({success: function() {
      self.render();
    }});
  },
  render: function() {
    var html = '<p><label>From</label> '+this.model.get('from')+'</p>'+
      '<p><label>Date</label> '+this.model.get('date')+'</p>'+
      '<p><label>Subject</label> '+this.model.get('subject')+'</p>'+
      '<p>'+this.model.get('body')+'</p>';
    this.$el.html(html);
    $('body').append(this.$el);
  }
});

// ## Define the individual List Row
var ListRowView = Backbone.View.extend({
  tagName: "tr",
  className: "list-row",

  render: function () {
    this.id = this.model.get("id");

    // I am not spending too much time on the date formatting or
    // making it look nice, I just need enough so it works
    var date = new Date(parseInt(this.model.get('date'), 10));
    var timeNice = this.padTime(date.getHours()) + ':' + this.padTime(date.getMinutes());
    var dateNice = date.toLocaleDateString();

    var subject = this.model.get("subject");
    var from = this.model.get("from");

    // Later I'll be converting this to a template, but for the time
    // being it will suffice
    var html = '<td>' + timeNice + '</td><td>' + dateNice + '</td>' +
      '<td>' + subject + '</td><td>' + from + '</td>';

    this.$el.append(html);
    return this;
  },


  events: {
    "click": "open"
  },

  open: function() {
    var message = new MessageView({model: this.model} );
  },

  // ### Pad Time
  // A very simple function to ensure that if the hours or minutes
  // contain a single digit, pad it out. Eg: 9 becomes 09
  padTime: function (time) {
    if (time < 10) {
      return '0' + time;
    }
    return time;
  }
});


// ## Define the List View
var ListView = Backbone.View.extend({

  // ### Initialise the View
  // The view is initialised by loading in some data via an Ajax call
  // the data is then assigned to this view's Collection, which is
  // defined as being of type ListCollection. Once the collection has
  // been defined and created, the view is rendered
  initialize: function () {
    var self = this;
    self.collection = new ListCollection({}, {
      // the success function is used for the fetch callback
      success: function () {
        self.render();
      }
    });
  },

  // ### Render this View
  render: function () {
    var self = this;

    // Later, we will move this html to a template. However, for the
    // sake of this stage of the demo, having hard-coded html is OK
    var html = '<h1>Backbone Reactive List (from JSON)</h1>' +
      '<p>This is generated from JSON data. It isn\'t very special but ' +
      'there is enough going on to be a useful demo' +
      '<table border="1"><thead>' +
      '<tr><th>Time</th><th>Date</th><th>Subject</th><th>From</th></tr>' +
      '</thead><tbody></tbody></table>';
    self.$el.html(html);

    self.collection.each(function (listItem) {
      var v = new ListRowView({model: listItem});
      v.render();
      self.$el.children("table").append(v.el);
    });

    return self;

  },
});


// ## Initiate the ListView
// This will effectively build the page
var listView = new ListView({
  el: $("#content")
});
