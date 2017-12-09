function ArrayHelper(){
  this.ArraysAreEqual = function(array1, array2){
    if (array1.length != array2.length)
      return false;
    for (var i = 0; i < array1.length; i++)
      if (array1[i] !== array2[i])
        return false;
    return true;
  }

  this.ArraysAreEquivalent = function (arrayX, arrayY){
    var array1 = arrayX.slice(0);
    var array2 = arrayY.slice(0);
    if (array1.length != array2.length) return false;
    if (array1.length == 0) return true;
    var a1 = -1;
    while (++a1 < array1.length){
      var a2 = -1;
      while (++a2 < array2.length && a1 < array1.length){
        if (array1[array1.length-1] === array2[a2]){
          array1.splice(a1,1);
          array2.splice(a2,1);
        }
      }
    }
    if (array1.length > 0 || array2.length > 0)
      return false
    return true;
  }
}


