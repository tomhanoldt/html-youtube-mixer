

/*global App, YTJava */
//triggered after Java exposed the java_youtube_mixer object
var java_player_callbacks = [];
function onJavaPlayerAPIReady(){
  if(!java_player_callbacks){
    return ;
  }

  for(key in java_player_callbacks){
    java_player_callbacks[key]();
  }

  java_player_callbacks = null;
}

var JavaPlayer = function(id, config){
  var self    = this;
  self.ready  = false;
  self.id     = id;

  var init = function(){
    var java_config = $.extend(config.java, { events: {
                                          'onReady': on_player_ready,
                                          'onStateChange': on_state_change
                                      }});

    self.player = new YTJava.Player(id, java_config);
  };

  if(typeof YTJava !== 'undefined'){
    init();
  }
  else{
    jsvs_player_callbacks.push(function(){
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

