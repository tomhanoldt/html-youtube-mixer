
/*global App */

var AppVolumeSlider = function(id){
  var volume_slider = $('#'+id).slider();
  var volume_slider_state = $('#'+id+'-state');
  var self = this;

  this.value = function(value){
    if(typeof value === 'undefined'){
      return parseInt(volume_slider.data('slider').getValue(), 10);
    }

    volume_slider.slider('setValue', value);
    volume_slider.data('slider').layout();

    self.publish(value);
  };

  this.inc_value = function(relative_value){
    self.value(self.value() + relative_value);
  };

  this.publish = function(value){
    volume_slider_state.html(Math.abs(value)+'%');
    App.set_volume(value);
  };

  //set volume while dragging slider
  volume_slider.on('slide', function(e){
                  self.publish(e.value);
                });

  //volume slider keycodes
  $(document).on("keydown", function(e) {
    switch(e.which){
      case 37:
        self.inc_value(-10);
      break;
      case 39:
        self.inc_value(10);
      break;
    }
  });
};
