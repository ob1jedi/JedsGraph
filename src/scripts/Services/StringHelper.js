function StringHelper(){

  this.ReplaceEachOfCharSet= function(inputString, replaceChars, withChars){
    if (replaceChars.length !== replaceChars.length)
      throw 'the replacing character-set must be same length as the replaced character set';
    var newString = '';
    for (var i = 0; i < inputString.length; i++){
      newString += inputString[i];
      for (var x = 0; x < replaceChars.length; x++){
        if (inputString[i] === replaceChars[x]){
          newString = newString.slice(0,i) + withChars[x];
        }
      }
    }
    return newString;
  }

  this.SplitOr = function(inputString, searchStrings)
  {
    var results = [];
    searchStrings.forEach(function(str){ 
      var res = inputString.split(str);
      if (res.length > 1);
        results = results.concat(res.slice(1));
    });
    if (results.length ==0)
      return [inputString];
    return results;
  }

  this.ReplaceAll = function(inputString, replaceStr, withStr){
    var strI = inputString.indexOf(replaceStr);
    while (strI > -1){
      inputString = inputString.substr(0, strI) + withStr + inputString.slice(strI + replaceStr.length);
      strI = inputString.indexOf(replaceStr, strI + withStr.length);
    }
    return inputString;
  }

  this.IsImage = function(value){
    if (getType(value) != "string")// || value.slice(4) != "http")
      return false;
    var ext = value.slice(-4);
    return (ext == ".jpg" 
      || ext == ".png" 
      || ext == ".gif" 
      || ext == ".svg" 
      || ext == ".ico" 
      || value.slice(-5) == ".jpeg");
  }
  //this.CompressString2 = function(s){
  //  var dict = [];

  //  for (var i = 0; i < s.length; i++){
  //    var sub = s.substr(i);
  //    for (var x = sub.length; x > -1; x--){
  //      dict.push(sub.substr(x));
  //    }
  //  }
    
  //  var dic = [];
  //  for (var d =0; d < dict.length; d++){ 
  //    if (s.split(dict[d]).length > 2)
  //    {
  //      dicIndex++;
  //      while (s.indexOf(String.fromCharCode(dicIndex)) > -1){
  //        dicIndex++;
  //      }
  //      var dicChar = String.fromCharCode(dicIndex);
  //      dic.push(dicChar);
  //      s = replaceAll(s, dict[d], dicChar)    
  //    }
  //  }
  
  //}


  // LZW-compress a string
  this.CompressString = function(s) {
      var dict = {};
      var data = (s + "").split("");
      var out = [];
      var currChar;
      var phrase = data[0];
      var code = 256;
      for (var i=1; i<data.length; i++) {
          currChar=data[i];
          if (dict[phrase + currChar] != null) {
              phrase += currChar;
          }
          else {
              out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
              dict[phrase + currChar] = code;
              code++;
              phrase=currChar;
          }
      }
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      for (var i=0; i<out.length; i++) {
          out[i] = String.fromCharCode(out[i]);
      }
      return out.join("");
  }

  // Decompress an LZW-encoded string
  this.DecompressString = function(s) {
      var dict = {};
      var data = (s + "").split("");
      var currChar = data[0];
      var oldPhrase = currChar;
      var out = [currChar];
      var code = 256;
      var phrase;
      for (var i=1; i<data.length; i++) {
          var currCode = data[i].charCodeAt(0);
          if (currCode < 256) {
              phrase = data[i];
          }
          else {
             phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
          }
          out.push(phrase);
          currChar = phrase.charAt(0);
          dict[code] = oldPhrase + currChar;
          code++;
          oldPhrase = phrase;
      }
      return out.join("");
  }

}
