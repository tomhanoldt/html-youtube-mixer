
/*global App, YT */

//triggers onYouTubePlayerAPIReady, ensures jQuery is loaded, exposes global YT object
$('body').append(
    $('<script/>').attr('src', "http://www.youtube.com/player_api"));


//triggered after http://www.youtube.com/player_api loaded
var yt_player_callbacks = [];
function onYouTubePlayerAPIReady(){
  if(!yt_player_callbacks){
    return ;
  }

  for(key in yt_player_callbacks){
    yt_player_callbacks[key]();
  }

  yt_player_callbacks = null;
}

var YoutubePlayer = function(id, config){
  var self    = this;
  self.ready  = false;
  self.id     = id;

  var init = function(){
    var yt_config = $.extend(config.yt, { events: {
                                          'onReady': on_player_ready,
                                          'onStateChange': on_state_change
                                      }});

    self.player = new YT.Player(id, yt_config);
  };

  if(typeof YT !== 'undefined'){
    init();
  }
  else{
    yt_player_callbacks.push(function(){
      init();
    });
  }

  this.play = function(id){
    if(!self.ready){
      alert('player not ready ...maybe its a bug ...or a feature?');
      return ;
    }

    self.player.loadVideoById(id);
  };

  this.volume = function(level){
    if(!self.ready){
      alert('player not ready ...maybe its a bug ...or a feature?');
      return ;
    }

    if(level === null)
      return self.player.getVolume();

    self.player.setVolume(level);
  };

  var on_player_ready = function(e){
    self.ready = true;
    if(typeof config.player.on_ready === 'function'){
      config.player.on_ready(e);
    }
  };

  var on_state_change = function(e){
    if(typeof config.player.on_change === 'function'){
      config.player.on_change(e);
    }
  };
};

