
var AppPlayer = function(id, config){
  config     = $.extend(AppPlayer.default_config, config);
  var self   = this;
  this.ready = false;

  var search_button_selector = '#search-'+id+'-button';
  var search_input_selector  = '#search-'+id+'-input';
  var search_result_selector = '#search-'+id+'-result';

  var init = function(){
    self.player = new YT.Player(id, $.extend(config.yt, { events: {
                                                          'onReady': on_player_ready,
                                                          'onStateChange': on_state_change
                                                      }}));
  };

  var on_player_ready = function(e){
    self.ready = true;

    if(typeof config.player.on_ready == 'function')
      config.player.on_ready(e);
  };

  var on_state_change = function(e){
    if(typeof config.player.on_change == 'function')
      config.player.on_change(e);
  };

  this.volume = function(level = null){
    if(level === null)
      return self.player.getVolume();

    if(level > 0)
      $('#'+id).addClass('active');
    else
      $('#'+id).removeClass('active');

    self.player.setVolume(level);
  };

  this.is_playing = function (){
    return self.player.getPlayerState() === YT.PlayerState.PLAYING;
  };

  this.play = function(id){
    self.player.loadVideoById(id);
  };

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
    self.play(video_id);
  });

  init();
};

AppPlayer.default_config = {
  yt: {
    height: '390',
    width: '640',
    playerVars: { }
  },
  player:{
    on_ready: null,
    on_change: null
  }
};
