
/*global AppPlayerSearch, YT */

var AppPlayer = function(id, config){
  config      = $.extend(AppPlayer.default_config, config);
  var self    = this;
  this.ready  = false;
  this.id     = id;

  var init = function(){
    self.player = new YT.Player(id, $.extend(config.yt, { events: {
                                                          'onReady': on_player_ready,
                                                          'onStateChange': on_state_change
                                                      }}));
    self.search = new AppPlayerSearch(self);
  };

  this.play = function(id){
    if(self.ready)
      this.player.loadVideoById(id);
    else
      alert('player not ready ...maybe its a bug ...or a feature?');
  };

  this.is_playing = function (){
    return self.player.getPlayerState() === YT.PlayerState.PLAYING;
  };

  this.volume = function(level){
    if(level === null)
      return self.player.getVolume();

    if(level > 0)
      $('#'+id).addClass('active');
    else
      $('#'+id).removeClass('active');

    self.player.setVolume(level);
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
