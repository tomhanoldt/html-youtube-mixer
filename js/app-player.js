
/*global App, AppPlayerSearch, JavaPlayer, YoutubePlayer */

var AppPlayer = function(id, config){
  config      = $.extend(AppPlayer.default_config, config);

  var self    = this;

  self.id     = id;

  self.player = App.running_java_mixer ? new JavaPlayer(id, config) : new YoutubePlayer(id, config);

  self.search = new AppPlayerSearch(self);


  this.ready = function(){
    return self.player.ready;
  }

  this.play = function(id){
    if(self.ready()){
      self.player.play(id);
    }
    else{
      alert('player not ready ...maybe its a bug ...or a feature?');
    }
  };

  this.volume = function(level){
    if(level === null)
      return self.player.volume();

    if(level > 0){
      $('#'+id).addClass('active');
    }
    else{
      $('#'+id).removeClass('active');
    }

    self.player.volume(level);
  };
};

AppPlayer.default_config = {
  player:{
      on_ready: null,
      on_change: null
    },
  yt: {
    height: '390',
    width: '640',
    playerVars: { }
  }
};
