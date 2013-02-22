// # List View

'use strict';
var Backbone; // hello jslint
var $; // hello jslint

// ## Shared Date Functions
// Utility class for date functionality
var DateFunctions = {
  // convert a timestamp into a JavaScript Date Object
  getDate: function (timestamp) {
    return new Date(parseInt(timestamp, 10));
  },

  // Format a Javascript Date Object into a more readable date string
  getDateNice: function (date) {
    return date.toLocaleDateString();
  },

  // Format a Javascript Date Object into a more readable time string
  getTimeNice: function (date) {
    return this.padTime(date.getHours()) + ':' + this.padTime(date.getMinutes());
  },

  // Format a Javascript Date Object into a more readable date and
  // time string
  getDateAndTimeNice: function (date) {
    return this.getDateNice(date) + " " + this.getTimeNice(date);
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
};

// ## Define the List Item Model
var ListItem = Backbone.Model.extend({
  url: function () {
    return '/mock-data/message.' + this.id + '.json';
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

// ## Define the View to display the messages
var MessageView = Backbone.View.extend({
  id: 'message',

  loadMessage: function (model) {
    var self = this;
    self.model = model;
    self.model.fetch({success: function () {
      // update the fact that we have read this message
      self.model.set('isRead', true);

      // render this message
      self.render();
    }});
  },
  render: function () {
    var date = DateFunctions.getDate(this.model.get('date'));
    var dateNice = DateFunctions.getDateAndTimeNice(date);

    var html = '<p><label>From</label> ' + this.model.get('from') + '</p>' +
      '<p><label>Date</label> ' + dateNice + '</p>' +
      '<p><label>Subject</label> ' + this.model.get('subject') + '</p>' +
      '<p>' + this.model.get('body') + '</p>';
    this.$el.html(html);
    // if the message view is not already attached to the page, simply
    // append it into the body
    if (!$("body").children("#" + this.id).length) {
      $('body').append(this.$el);
    }
  }
});

// ## Define the individual List Row
var ListRowView = Backbone.View.extend({
  tagName: "tr",
  className: "list-row",

  initialize: function () {
    this.listenTo(this.model, "change", this.render);
  },

  render: function () {
    this.id = this.model.get("id");

    // I am not spending too much time on the date formatting or
    // making it look nice, I just need enough so it works
    var date = DateFunctions.getDate(this.model.get('date'));
    var timeNice = DateFunctions.getTimeNice(date);
    var dateNice = DateFunctions.getDateNice(date);

    var subject = this.model.get("subject");
    var from = this.model.get("from");

    var isRead = 'No';
    if (this.model.get("isRead")) {
      isRead = 'Yes';
    }

    // Later I'll be converting this to a template, but for the time
    // being it will suffice
    var html = '<td>' + timeNice + '</td><td>' + dateNice + '</td>' +
      '<td>' + subject + '</td><td>' + from + '</td><td>' + isRead + '</td>';

    this.$el.html(html);
    return this;
  },

  events: {
    "click": "open"
  },

  open: function () {
    // we want to reuse the MessageView, so don't init a new view on
    // every call of open. Instead, "bubble" the event up, passing the
    // relevant model
    this.trigger("viewMessage", this.model);
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
    // we want to reuse the same view for multiple messages. This is
    // why we are initiating it now
    this.messageView = new MessageView();
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
      '<tr><th>Time</th><th>Date</th><th>Subject</th><th>From</th><th>Read</th></tr>' +
      '</thead><tbody></tbody></table>';
    self.$el.html(html);

    self.collection.each(function (listItem) {
      var v = new ListRowView({model: listItem});
      v.render();
      // listen for the "viewMessage" event, loading the message whenever it is triggered
      v.on('viewMessage', function (model) {
        self.messageView.loadMessage(model);
      });

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
