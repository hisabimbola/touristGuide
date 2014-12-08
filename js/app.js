
var touristGuide = {

  searchValue: null,
  topicHTML: "",
  baseUrl: "https://www.freebase.com/",
  serviceUrl: 'https://www.googleapis.com/freebase/v1/search', //base endpoint for the search service
  topicUrl: 'https://www.googleapis.com/freebase/v1/topic', //base endpoint for the search service

  init: function() {
    $('#loadingImage').hide();    
    this.submitSearch();

  },

  //params in method, because searchValue depends on search from user
  params: function () {
   return { "domain": "travel",
   'key': 'AIzaSyAIoCIVP399FSK6l5imEndmTlxYdPC3JeE',
    'query': this.searchValue,
    'type': '/travel/tourist_attraction',
    'indent': true, //for nice indented JSON format, needed for development only
    // 'exact': true
    };
  },

  //gets user input
  submitSearch: function () {
    console.log('submitSearch');
    $('#app').submit(function (evt) {
      evt.preventDefault();
      
      touristGuide.searchValue = $('#search').val();
      // console.log(touristGuide.searchValue);
      $('#display').empty();
      touristGuide.getJson();
    });
  },

  //makes json call
  getJson: function () {
    $('#loadingImage').show();
    $.getJSON(this.serviceUrl + '?callback=?', this.params(), function(topic) {
      var imageUrl = "", topicTitle = "", topicDesc = "";
      $.each(topic.result, function(i, val) {
        touristGuide.getTopic(val.id);
      });
    });
  },

  //method to get topic
  getTopic: function (topicId) {
    $.getJSON(this.topicUrl + topicId + '?callback=?', null, function (topic) {
      console.log(topic);
      touristGuide.buildTopic(topic);
    });
  },

  buildTopic: function (topic) {
    if (topic.property['/common/topic/image']) {
      imageUrl = topic.property['/common/topic/image'].values[0].id;
      touristGuide.topicHTML = '<li class="clearfix"> <img src="https://usercontent.googleapis.com/freebase/v1/image' + imageUrl + '?maxwidth=225&maxheight=225&mode=fillcropmid">';
    } else {
      touristGuide.topicHTML = '<li class="clearfix"> <img src="../img/location.PNG"';
    }

    if (topic.property['/type/object/name']) {
      topicTitle = topic.property['/type/object/name'].values[0].text;
      touristGuide.topicHTML += '<h3>' + topicTitle + '</h3>';
    }
    if (topic.property['/common/topic/description']) {
      topicDesc = topic.property['/common/topic/description'].values[0].value;
      touristGuide.topicHTML += '<p>' + topicDesc + '</p> </li>';
    }
      touristGuide.showTopic(touristGuide.topicHTML);
  },

  //displays topic from JSON load into the page
  showTopic: function (display) {
    // $(display).addClass('clearfix');
    $('#loadingImage').show();
    $('#display').append(display);
  }
};

$(document).ready(function() {
  touristGuide.init();
});