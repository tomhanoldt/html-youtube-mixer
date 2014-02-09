var YTHelper = {};

YTHelper.API_URL = 'http://gdata.youtube.com/feeds/api';
YTHelper.API_LANGUAGE = 'de';
YTHelper.SEARCH_TYPE_VIDEO = 'videos';


YTHelper.search = function(type, query, callback){
    $.get(YTHelper.API_URL+'/'+type,
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

YTRecord = function(result){
  this.date       = new Date(result.published.$t);
  this.date_fmt   = this.date.getDay()+'.'+this.date.getMonth()+'.'+this.date.getFullYear();
  this.id         = result.id.$t.split('/').pop();
  this.views      = (result.yt$statistics) ? result.yt$statistics.viewCount : '-';
  this.authors    = result.author;
  this.title      = result.title.$t;
  this.thumbnail  = (result.media$group.media$thumbnail) ? result.media$group.media$thumbnail[0].url : '';
  this.info       = result.content.$t;
  this.duration   = {};
  this.duration_seconds = parseInt(result.media$group.yt$duration.seconds);
  this.duration_fmt = Math.round(this.duration_seconds/60)+':'+(this.duration_seconds%60)
}
