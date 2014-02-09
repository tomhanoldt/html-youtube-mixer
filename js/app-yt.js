var YTHelper = {};

YTHelper.YT_URL  = 'http://www.youtube.com';
YTHelper.API_VIDEO_URL = 'http://gdata.youtube.com/feeds/api';
YTHelper.API_SUGGEST_URL = 'http://suggestqueries.google.com/complete/search?callback=?';
YTHelper.API_LANGUAGE = 'de';
YTHelper.SEARCH_TYPE_VIDEO = 'videos';


YTHelper.search = function(type, query, callback){
    $.get(YTHelper.API_VIDEO_URL+'/'+type,
          {
            'max-results':50,
            alt: 'json',
            lr: YTHelper.API_LANGUAGE,
            q: query
          },
          function(data){
            callback(data);
          });
};

YTHelper.suggest = function(q, response){
  $.getJSON(YTHelper.API_SUGGEST_URL,
            {
              "hl":"en", // Language
              "ds":"yt", // Restrict lookup to youtube
              "q":q,     // query term
              "client":"youtube" // force youtube style response, i.e. jsonp
            },
            function(data) {
              response( $.map( data[1], function(item) {
                      return {
                          label: item[0],
                          value: item[0]
                      };
                  }));
            }
        );
};

var YTRecord = function(result){
  this.id         = result.id.$t.split('/').pop();
  this.yt_url     = YTHelper.YT_URL+'/watch?v='+this.id;
  this.date       = new Date(result.published.$t);
  this.date_fmt   = this.date.getDay()+'.'+this.date.getMonth()+'.'+this.date.getFullYear();
  this.views      = (result.yt$statistics) ? result.yt$statistics.viewCount : '-';
  this.authors    = result.author;
  this.title      = result.title.$t;
  this.thumbnail  = (result.media$group.media$thumbnail) ? result.media$group.media$thumbnail[0].url : '';
  this.info       = result.content.$t;
  this.duration_seconds = parseInt(result.media$group.yt$duration.seconds, 10);
  var minutes = ''+Math.round(this.duration_seconds/60);
  var seconds = ''+(this.duration_seconds%60);
  this.duration_fmt = (minutes.length === 1 ? '0'+minutes : minutes)+':'+(seconds.length === 1 ? '0'+seconds : seconds);
};
