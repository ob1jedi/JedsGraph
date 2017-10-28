function JsonHelper() {

  this.Contains=function(subsetJson,supersetJson) {
    if(!ofSameType(subsetJson,supersetJson))
      return false;

    switch(typeof subsetJson) {
      case "object":
        for(var key in subsetJson)
          return this.Contains(subsetJson[key],supersetJson[key])
      case "array":
        for(var i=0;i<subsetJson;i++)
          return this.Contains(subsetJson[i],supersetJson[i])
      default:
        return subsetJson===supersetJson;
    }
    return true;
  }

  this.MergeJson=function(baseJson,newJson,idFieldName) {
    if (!newJson || !baseJson) 
      throw "JSONMERGE ERROR: Invalid Json input";
    return mergeJson(baseJson,newJson,idFieldName);
  }

  function mergeJson(baseJson,newJson,idFieldName){
    if(!ofSameType(baseJson,newJson)){
      //debugger;
      return clone(newJson);
    }
    if(isArray(baseJson))
      baseJson=mergeArrays(baseJson,newJson,idFieldName);
    else if(isObject(baseJson)){
      if (baseJson == null) debugger;
      baseJson=mergeObjects(baseJson,newJson,idFieldName);
      }
    else{
      //debugger;
      baseJson=newJson;
    }
    return baseJson;
  }

  mergeObjects=function(baseObject,newObject,idFieldName) {
    var returnObject = {};
    for(var key in baseObject) {
      returnObject[key]= clone(baseObject[key]);
    }
    for(var key in newObject) {
      if (baseObject == null) debugger;
      if(baseObject[key] === undefined){
        returnObject[key]=clone(newObject[key])
      }
      else
        returnObject[key]=mergeJson(baseObject[key],newObject[key],idFieldName)
    }
    return returnObject;
  }

  mergeArrays=function(baseArray,newArray,idFieldName) {
    if(!idFieldName)
      throw "JSONMERGE ERROR: No discriminator specified";
    var returnArray = [];
    baseArray.map((e)=>returnArray.push(e));
    for(var n=0;n<newArray.length;n++) {
      var matchFound=false;
      for(var b=0;b<baseArray.length;b++) {
        if(areEquivalent(baseArray[b],newArray[n],idFieldName)) {
          matchFound=true;
          if(isObject(baseArray[b])){
            returnArray[b] = mergeObjects(baseArray[b],newArray[n],idFieldName);
          }
          else if(isArray(baseArray[b])){
            returnArray[b] = mergeArrays(baseArray[b],newArray[n],idFieldName);
          }
          break;
        }
      }
      if(!matchFound)
        returnArray.push(clone(newArray[n]));
    }
    return returnArray;
  }

  function clone(input){
    return JSON.parse(JSON.stringify(input));
  }


  function areEquivalent(input1,input2,idFieldName) {
    if(!ofSameType(input1,input2))
      return false;
    if(isObject(input1))
      return (input1[idFieldName]===input2[idFieldName]&&input1[idFieldName])
    if(isPrimitive(input1))
      return input1===input2
    if(isArray(input1)) {
      for(var i=0;i<input1.length;i++)
        for(var x=0;x<input2.length;x++)
          if(isString(input1[i])&&input1[i]===input2[x]&&input1[i].startsWith(idFieldName+":"))
            return true;
      return false;
    }
    throw "JSONMERGE ERROR: unable to compare"
  }
  function isString(input) {
    return typeof input==="string";
  }
  function isArray(input) {
    return (typeof input==="array" || Array.isArray(input)) && input
  }
  function isObject(input) {
    return typeof input==="object" && !Array.isArray(input) && input;
  }
  function isPrimitive(input) {
    return !isObject(input)&&!isArray(input);
  }
  function ofSameType(element1,element2) {
    return typeof element1===typeof element1 && Array.isArray(element1) === Array.isArray(element2);
  }
}