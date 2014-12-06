var touristGuide = {

  searchValue: null,
  serviceUrl: 'https://www.googleapis.com/freebase/v1/search', //base endpoint for the search service
  topicUrl: 'https://www.googleapis.com/freebase/v1/topic', //base endpoint for the search service

  init: function() {
    this.submitSearch();
    //console.log('init!!!');
  },

  //params in method, because searchValue depends on search from user
  params: function () {
    //id: "/travel/tourist_attraction"
   return { "domain": "travel",
    'query': this.searchValue,
    'type': '/travel/tourist_attraction',
    //"filter": "(all type:/location/country/name)",
    'indent': true //for nice indented JSON format, needed for development only
    };
  },

  //gets user input
  submitSearch: function () {
    console.log('submitSearch');
    $('#app').submit(function (evt) {
      evt.preventDefault();
      touristGuide.searchValue = $('#search').val();
      console.log(touristGuide.searchValue);
      touristGuide.getJson();
    });
  },

  //makes json call
  getJson: function () {
    $.getJSON(this.serviceUrl + '?callback=?', this.params(), function(topic) {
    //console.log(topic);
    $.each(topic.result, function(index, val) {
       /* iterate through array or object */
       //console.log(val.id || "none");
       touristGuide.getTopic(val.id);
       //$('<div>', {text:val.id.text});

    });
  });
  },

  //sends empty params, name will still change
  paras: {

  },
  //method to get topic
  getTopic: function (topicId) {
    $.getJSON(this.topicUrl + topicId + '?callback=?', this.paras, function (topic) {
      console.log(topic);
    });
  }
};

$(document).ready(function() {
  touristGuide.init();
});