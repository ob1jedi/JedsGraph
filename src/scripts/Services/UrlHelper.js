function UrlHelper(){

    this.GetParameterByName = function(name, url) {
      
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    this.GetAllParams = function(url) {
      var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = window.location.search.substring(1);
      var urlParams = [];
      while (match = search.exec(query))
        urlParams.push({"key": decode(match[1]), "value":decode(match[2])});
         //urlParams[decode(match[1])] = decode(match[2]);
      return urlParams;
    }

}