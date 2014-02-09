
jQuery(function($){
  //triggers App.bootstrap and ensures jQuery is loaded
  $('body').append(
      $('<script/>').attr('src', "http://www.youtube.com/player_api"));

  //init search result links
  $(document).on('click', 'a.add-to-player', function(e){
    e.preventDefault();
    e.stopPropagation();
    var player = ($(this).attr('href').indexOf('player1') > -1) ? App.player1 : App.player2;
    player.play($(this).data('id'));
  });
});

//triggered after http://www.youtube.com/player_api loaded
function onYouTubePlayerAPIReady(){
  App.bootstrap();
}

/*global AppPlayer, YTHelper, YTRecord, AppVolumeSlider */
var App = {
  bootstrap: function(){
    App.player1 = new AppPlayer('player1', {player: {on_ready: function(){ App.slider.value(-50); }}});
    App.player2 = new AppPlayer('player2', {player: {on_ready: function(){ App.slider.value(-50); }}});
    App.slider  = new AppVolumeSlider('volume-slider');
  },

  is_ready: function(){
    return App.player1.ready && App.player2.ready;
  },

  volume: function(value){
    if(!App.is_ready()){
      return ;
    }

    var volume_player_1, volume_player_2;

    if(value < 0){//means more on player 1
      volume_player_1 = Math.abs(value);
      volume_player_2 = 0;
    }
    else{//more on player 2
      volume_player_1 = 0;
      volume_player_2 = value;
    }

    App.player1.volume(volume_player_1);
    App.player2.volume(volume_player_2);
  },

  search: function(query, callback){
    YTHelper.search(YTHelper.SEARCH_TYPE_VIDEO, query, function(data){
      data.results = [];

      if(!data.feed.entry){
        return callback(data);
      }

      for(var i =0; i < data.feed.entry.length; i++ ){
        data.results.push(new YTRecord(data.feed.entry[i]));
      }

      callback(data);
    });
  }
};
