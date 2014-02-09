
var AppPlayer = function(id, config){
  config     = $.extend(AppPlayer.default_config, config);
  var self   = this;
  this.ready = false;

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
  $('#search-'+id+'-button').click(function(){
    App.search($('#search-'+id+'-input').val(), function(data){
      var str = '';
      for(var i = 0; i < data.results.length; i++)
        str+=AppView.format_search_result(data.results[i]);

      $('#search-'+id+'-result').html(str);
    });
  });

  //search enter
  $('#search-'+id+'-input').on("keydown", function(e) {
    if(e.which !== 13)
      return ;

    $('#search-'+id+'-button').trigger('click');
  });

  //search autocompleetion
  $('#search-'+id+'-input').autocomplete({
        source: function(request, response) {
            $.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
                {
                  "hl":"en", // Language
                  "ds":"yt", // Restrict lookup to youtube
                  "jsonp":"suggestCallBack", // jsonp callback function name
                  "q":request.term, // query term
                  "client":"youtube" // force youtube style response, i.e. jsonp
                }
            );
            suggestCallBack = function (data) {

                var suggestions = [];
                $.each(data[1], function(key, val) {
                    suggestions.push({"value":val[0]});
                });
                suggestions.length = 5; // prune suggestions list to only 5 items

                try{
                  response(suggestions);
                }
                catch(e){
                  //prevent jquery bug, when autocompleete source returns undefined
                };
            };
        },
    });

  //clickable result rows
  $(document).on('click', '#search-'+id+'-result .record', function(){
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
