
var touristGuide = {

  searchValue: null,
  topicHTML: "",
  baseUrl: "https://www.freebase.com/",
  searchUrl: 'https://www.googleapis.com/freebase/v1/search', //base endpoint for the search service
  topicUrl: 'https://www.googleapis.com/freebase/v1/topic', //base endpoint for the search service
  cursorValue: 0,

  init: function() {
    $('#loadingImage').hide();    
    this.submitSearch();
    touristGuide.nextPage();
    touristGuide.previousPage();
    $('#nextPage').hide();
    $('#previousPage').hide();

  },
  //validates user input against symbols, allows only alp, numbers and _
  validateInput: function (input) {
    var test = /[^-_a-zA-Z ]/.test(input);
    if (!test) {
      this.searchValue = input;
      this.searchAPI();
    } else {
      $('#topInfo').text('Please enter a valid city or country name, numbers and symbols are not allowed!');
    }
  },
  //params in method, because searchValue depends on search from user
  params: function () {
   return { 
    "domain": "travel",
    'key': 'AIzaSyAIoCIVP399FSK6l5imEndmTlxYdPC3JeE',
    'query': this.searchValue,
    'type': '/travel/tourist_attraction',
    'indent': true, //for nice indented JSON format, needed for development only
    // 'exact': true
    'limit': 10,
    'cursor': this.cursorValue
    };
  },

  //set value for the set page, and disables next button, if no next page

  //gets user input
  submitSearch: function () {
    $('#app').submit(function (evt) {
      evt.preventDefault();
      touristGuide.cursorValue = 0;
      touristGuide.validateInput($('#search').val());
      // setCursorValue(true);
    });
  },

  fixCursor: function(data) {
    if (data.cursor) {
      $('#nextPage').show();
    } else {
      $('#nextPage').off('click');
      $('#nextPage').one('click', function(event) {
        event.preventDefault();
        touristGuide.searchAPI();
      // touristGuide.setCursorValue(false);
        $('#nextPage').hide(function () {
          touristGuide.nextPage();
        });
      });
    }
  },
  
  //makes json call
  searchAPI: function () {
    $('#display').empty();
    $('#loadingImage').show();
    $.getJSON(this.searchUrl + '?callback=?', this.params(), function(topic) {
      console.log(topic);
      touristGuide.fixCursor(topic);
      var imageUrl = "", topicTitle = "", topicDesc = "";
      $.each(topic.result, function(i, val) {
        touristGuide.getTopic(val.id || val.mid);
      });
    });
  },

  //method to get topic
  getTopic: function (topicId) {
    $.getJSON(this.topicUrl + topicId + '?callback=?', null, function (topic) {
      touristGuide.buildTopic(topic);
    });
  },

  buildTopic: function (topic) {
    if (topic.property['/common/topic/image']) {
      imageUrl = topic.property['/common/topic/image'].values[0].id;
      touristGuide.topicHTML = '<li class="clearfix"> <img src="https://usercontent.googleapis.com/freebase/v1/image' + imageUrl + '?maxwidth=225&maxheight=225&mode=fillcropmid">';
    } else {
      touristGuide.topicHTML = '<li class="clearfix"> <img src="../img/location.PNG">';
    }

    if (topic.property['/type/object/name']) {
      topicTitle = topic.property['/type/object/name'].values[0].text;
      touristGuide.topicHTML += '<h3>' + topicTitle + '</h3>';
    }
    if (topic.property['/common/topic/description']) {
      topicDesc = topic.property['/common/topic/description'].values[0].value;
      touristGuide.topicHTML += '<p>' + topicDesc + '</p> </li> <hr />';
    }
      touristGuide.showTopic(touristGuide.topicHTML);
  },

  //displays topic from JSON load into the page
  showTopic: function (display) {
    $('#loadingImage').hide();
    $('#display').append(display);
  },

  setCursorValue: function (boolean) {
    if (boolean) {
      this.cursorValue += 10;
    } else {
      this.cursorValue -= 10;
    }
  },
  nextPage: function () {
    $('#nextPage').click(function(event) {
      event.preventDefault();
      touristGuide.setCursorValue(true);
      touristGuide.searchAPI();
      $('#previousPage').show();
    });
  },

  previousPage: function () {
    $('#previousPage').click(function (event) {
      event.preventDefault();
      touristGuide.setCursorValue(false);
      touristGuide.searchAPI();
      if (touristGuide.cursorValue === 0) {
        $('#previousPage').hide();
      }
    });
  }
};

$(document).ready(function() {
  touristGuide.init();
});