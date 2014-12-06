var touristGuide = {

  searchValue: null,
  service_url: 'https://www.googleapis.com/freebase/v1/search',
  params: function () {
    //id: "/travel/tourist_attraction"
   return { "domain": "travel",
    'query': this.searchValue,
    'type': '/travel/tourist_attraction',
    'indent': true
    };
  },

  init: function() {
    this.submitSearch();
    //console.log('init!!!');
  },

  submitSearch: function () {
    console.log('submitSearch');
    $('#submit').click(function (evt) {
      //evt.preventDefault();
      touristGuide.searchValue = $('#search').val();
      console.log(touristGuide.searchValue);
      touristGuide.getJson();
    });
  },

  getJson: function () {
    $.getJSON(this.service_url + '?callback=?', this.params(), function(topic) {
    console.log(topic);
    //$('<div>',{text:topic.property['/type/object/name'].values[0].text}).appendTo(document.body);
  });
  }
};

$(document).ready(function() {
  touristGuide.init();
});

  // var service_url = 'https://www.googleapis.com/freebase/v1/search';
  // var params = {
  //   'query': 'Cee Lo Green',
  //   'filter': '(all type:/music/artist created:"The Lady Killer")',
  //   'limit': 10,
  //   'indent': true
  // };
  // $.getJSON(service_url + '?callback=?', params, function(response) {
  //   console.log(response);
  //   $.each(response.result, function(i, result) {
  //     $('<div>', {text:result.name}).appendTo(document.body);
  //   });
  // });