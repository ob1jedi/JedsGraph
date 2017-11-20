function BrowserHelper(){

  this.getBrowser = function(){
    // Opera 8.0+
    if (isOpera()) 
      return {name: "Opera", group: "Opera 8.0+"};
    // Firefox 1.0+
    if (isFirefox()) 
      return {name: "Firefox", group: "Firefox 1.0+"}
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    if (isSafari()) 
      return {name: "Safari", group:"Safari 3.0+"}
    // Internet Explorer 6-11
    if(isInternetExplorer()) 
      return {name: "IE", group:"Internet Explorer 6-11"}
    // Edge 20+
    if (isEdge()) 
      return {name: "Edge", group:"Edge 20+"}
    // Chrome 1+
    if (isChrome())
      return {name: "Chrome", group:"Chrome 1+"}
    // Blink engine detection
    if (isBlink()) 
      return {name: "Blink", group:"Blink engine"}
  }

  // Opera 8.0+
  this.IsOpera = function (){
    return isOpera();
  }
  // Firefox 1.0+
  this.IsFirefox = function (){
    return isFirefox();
  }
  // Safari 3.0+ "[object HTMLElementConstructor]" 
  this.IsSafari = function (){
    return isSafari();
  }
  // Internet Explorer 6-11
  this.IsInternetExplorer = function (){
    /*@cc_on!@*/
    return isInternetExplorer();
  }
  // Edge 20+
  this.IsEdge = function (){
    return isEdge();
  }
  // Chrome 1+
  this.IsChrome = function (){
    return isChrome();
  }
  // Blink engine detection
  this.IsBlink = function (){
    return isBlink();
  }

    // Opera 8.0+
  function isOpera  (){
    return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  }
  // Firefox 1.0+
  function isFirefox  (){
    return typeof InstallTrigger !== 'undefined';
  }
  // Safari 3.0+ "[object HTMLElementConstructor]" 
  function isSafari  (){
    return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  }
  // Internet Explorer 6-11
  function isInternetExplorer  (){
    /*@cc_on!@*/
    return false || !!document.documentMode;
  }
  // Edge 20+
  function isEdge  (){
    return isInternetExplorer() && !!window.StyleMedia;
  }
  // Chrome 1+
  function isChrome  (){
    return !!window.chrome //&& !!window.chrome.webstore;
  }
  // Blink engine detection
  function isBlink  (){
    return (isChrome || isOpera) && !!window.CSS;
  }

  this.GetWindowSize = function(){
    var w = window.innerWidth
    if (!w) w = document.documentElement.clientWidth
    if (!w) w =  document.body.clientWidth;

    var h = window.innerHeight
    if (!h) h = document.documentElement.clientHeight
    if (!h) h = document.body.clientHeight;
    return {width: w, height: h};
  }
}