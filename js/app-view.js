
var AppView = {
  templates : {
    'search.result.row' : '<div class="record row" data-id="{id}">'+
                            '<div class="col-xs-3 thumbnail">'+
                              '<img src="{thumbnail}"><span class="duration">{duration_fmt}</span>'+
                            '</div>'+
                            '<div class="col-xs-9">'+
                              '<h4>{title}</h4>'+
                              '<i>{date_fmt} - {views} Views</i>'+
                              '<div class="author">Auhoren: {authors} </div>'+
                              '<div class="links">'+
                                '<a class="add-to-player" href="#player1" data-id="{id}" >+player1</a><br/>'+
                                '<a class="add-to-player" href="#player2" data-id="{id}" >+player2</a><br/>'+
                                '<a href="{yt_url}" target="_blank">&gt;youtube</a>'+
                              '</div>'+
                            '</div>'+
                          '</div>',

      'search.result.row.author' :
                            '<span class="author-uri" data-uri="{author_uri}">{author_name}</span> '
  }
};


AppView.render_template =function(template, vars){
  var str = AppView.templates[template];

  for(var key in vars){
    if(vars.hasOwnProperty(key)){
      str = str.replace(new RegExp('{'+key+'}', 'gm'), vars[key]);
    }
  }

  return str;
};

AppView.format_search_result = function(yt_record){
  var authors = '', author;

  for(var j = 0; j < yt_record.authors.length; j++){
    author  = yt_record.authors[j];
    authors+= AppView.render_template('search.result.row.author', {
                                                            'author_uri': author.uri.$t,
                                                            'author_name': author.name.$t
                                                          });
  }

  return AppView.render_template('search.result.row', $.extend(yt_record, {authors:authors }));
};
