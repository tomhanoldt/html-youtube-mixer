

var AppVolumeSlider = function(slider_selector, state_selector){
  var volume_slider = $(slider_selector).slider();
  var volume_slider_state = $(state_selector);
  var self = this;

  this.value = function(value){
    if(typeof value === 'undefined')
      return parseInt(volume_slider.data('slider').getValue(), 10);

    volume_slider.slider('setValue', value);
    volume_slider.data('slider').layout();

    volume_slider_state.html(Math.abs(value)+'%');
    App.set_volume(value);
  };

  this.inc_value = function(relative_value){
    self.value(self.value() + relative_value);
  };

  volume_slider.on('slide', function(e){
                  App.set_volume(e.value);
                });

  //volume slider keycodes
  $(document).on("keydown", function(e) {
    switch(e.which){
      case 37:
      case 38:
        self.inc_value(-10);
      break;
      case 39:
      case 40:
        self.inc_value(10);
      break;
    }
  });
}
