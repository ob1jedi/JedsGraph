function BrowserHelper(){

  // Opera 8.0+
  this.IsOpera = function (){
    return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  }

  // Firefox 1.0+
  this.IsFirefox = function (){
    return typeof InstallTrigger !== 'undefined';
  }

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  this.IsSafari = function (){
    return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  }

  // Internet Explorer 6-11
  this.IsInternetExplorer = function (){
    /*@cc_on!@*/
    return false || !!document.documentMode;
  }

  // Edge 20+
  this.IsEdge = function (){
    return !isIE && !!window.StyleMedia;
  }

  // Chrome 1+
  this.IsChrome = function (){
    return !!window.chrome //&& !!window.chrome.webstore;
  }

  // Blink engine detection
  this.IsBlink = function (){
    return (isChrome || isOpera) && !!window.CSS;
  }

  this.GetWindowSize = function(){
      var w = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    var h = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
    return {width: w, height: h};
  }
}