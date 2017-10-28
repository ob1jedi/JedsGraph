function JsonHelper() {

    this.Contains = function(subsetJson, supersetJson) {
        if (typeof subsetJson !== typeof supersetJson)
            return false;

        switch (typeof subsetJson) {
            case "object":
                for (var key in subsetJson)
                	return this.Contains(subsetJson[key], supersetJson[key])
            case "array":
                for (var i = 0; i < subsetJson; i++)
                	return this.Contains(subsetJson[i], supersetJson[i])
            default:
                return subsetJson === supersetJson;
        }
        return true;
    }

  
  this.Merge = function(baseJson, newJson, idFieldName) {
    //debugger;
    if(typeof baseJson!==typeof newJson)
      return [baseJson, newJson];
    if (typeof baseJson === "object")
      baseJson = this.MergeObjects(baseJson, newJson, idFieldName);
    else if(typeof baseJson === "array")
      baseJson = this.MergeArrays(baseJson, newJson, idFieldName);
    else
      baseJson = newJson;
    return baseJson;
  }

  this.MergeObjects = function(baseObject, newObject, idFieldName)
  {
    for(var key in newObject){
      if (baseObject[key] === undefined)
        baseObject[key] = newObject[key]
      else
        baseObject[key] = this.Merge(baseObject[key],newObject[key],idFieldName)
    }
    return baseObject;
  }

  //Doesn't do multi-dimensional arrays
  this.MergeArrays = function(baseArray, newArray, idFieldName){
    for (var n=0;n<newArray.length;b++){
      matchfound = false;
      for(var b=0;b<baseArray.length;b++){
        if (typeof baseArray[b] === typeof newArray[n]){
          if (typeof baseArray[b] === "object"){
            if (baseArray[b][idFieldName] === newArray[n][idFieldName] && newArray[n][idFieldName]){
              baseArray[b][idFieldName] = this.MergeObjects(baseArray[b], newArray[n])
              matchfound = true;
            }
          }else if (!typeof baseArray[b] === "array" && baseArray[b] === newArray[n]){
            matchfound = true;
          }
        }
      }
      if (!matchfound)
        baseArray.push(newArray[n]);
    }
    return baseArray;
  }

}