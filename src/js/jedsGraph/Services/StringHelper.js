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

}
