
jQuery(function($){
  $('#volume-slider').slider()
                     .on('slide', App.set_volume)
                     .on('slide', function(e){
                        $('.volume-slider-state').html(e.value+'%');
                      });

  //triggers App.bootsrap and ensures jQuery is loaded
  $('body').append(
      $('<script/>').attr('src', "http://www.youtube.com/player_api"));

});

//triggered after http://www.youtube.com/player_api loaded
function onYouTubePlayerAPIReady(){
  App.bootsrap();
}

var App = {
  bootsrap: function(){
    App.player1 = new AppPlayer('player1');
    App.player2 = new AppPlayer('player2');
  },

  is_ready: function(){
    return App.player1.ready && App.player2.ready;
  },

  set_volume: function(e){
    if(!App.is_ready())
      return ;

    var slider_value = e.value, volume_player_1, volume_player_2;

    if(slider_value < 0){//means more on player 1
      volume_player_1 = Math.abs(slider_value);
      volume_player_2 = 0;
    }
    else{//more on player 2
      volume_player_1 = 0;
      volume_player_2 = slider_value;
    }

    App.player1.volume(volume_player_1);
    App.player2.volume(volume_player_2);
  },

  search: function(query, callback){
    YTHelper.search(YTHelper.SEARCH_TYPE_VIDEO, query, function(data){
      data.results = [];

      if(!data.feed.entry)
        return callback(data);

      for(var i =0; i < data.feed.entry.length; i++ )
        data.results.push(new YTRecord(data.feed.entry[i]));

      callback(data);
    });
  }
};
