
var AppPlayerSearch = function(player){
  var self   = this;

  var search_button_selector = '#search-'+player.id+'-button';
  var search_input_selector  = '#search-'+player.id+'-input';
  var search_result_selector = '#search-'+player.id+'-result';

  //searchbutton
  $(search_button_selector).click(function(){
    App.search($(search_input_selector).val(), function(data){
      var str = '';
      for(var i = 0; i < data.results.length; i++)
        str+=AppView.format_search_result(data.results[i]);

      $(search_result_selector).html(str);
    });
  });

  //search enter
  $(search_input_selector).on("keydown", function(e) {
    if(e.which !== 13)
      return ;

    $(search_button_selector).trigger('click');
  });

  //search autocompleetion
  $(search_input_selector).autocomplete({
      source: function(request, response) {
        YTHelper.suggest(request.term, response);
      },
  });

  //clickable result rows
  $(document).on('click', search_result_selector+' .record', function(){
    var video_id = $(this).data('id');
    player.play(video_id);
  });
};
