function NodeBehavioursApi() {
  
  //this.Behaviours = [
  //  {name: "autoImage", func: autoImage}
  //];

  this.AutoImageToConfig = function(nodeData) {
    for(var prop in nodeData.propertiesObject) {
      var propVal=nodeData.propertiesObject[prop];
      if(isImage(propVal)) {
        var config = createEntitySpecificConfig(nodeData.id);
        config.config = {"attributes":{"img":{"url": propVal}}};
        new ConfigHelper().AddDynamicEntityConfigReturnId(config.configName, config);
      }
    }
  }

  this.AutoImageToNode = function(node) {
    
    for(var prop in node.data.propertiesObject) {
      var propVal=node.data.propertiesObject[prop];
      //var propVal=entity.properties[prop];
      if(isImage(propVal)) {
        node.data.UI.imageUI.link(propVal);
        node.data.UI.imageUI.attr("width", node.data.nodeSize * 3);
        node.data.UI.imageUI.attr("height", node.data.nodeSize * 3);
        node.data.UI.imageUI.attr("x", -node.data.nodeSize * 3/2);
        node.data.UI.imageUI.attr("y", -node.data.nodeSize * 3/2);
        
        //var config = createEntitySpecificConfig(nodeData.id);
        //config.config = {"attributes":{"img":{"url": propVal}}};
        //new ConfigHelper().AddDynamicEntityConfigReturnId(config.configName, config);
      }
    }
  }

  function isImage(value){
    if (typeof value !== "string") 
      return;
    if(value.length>4) {
        var possibleExtension=value.slice(-4);
        return possibleExtension.toLowerCase()=='.jpg'
            ||possibleExtension.toLowerCase()=='.svg'
            ||possibleExtension.toLowerCase()=='.bmp'
            ||possibleExtension.toLowerCase()=='.png'
            ||possibleExtension.toLowerCase()=='.gif'
            ||possibleExtension.toLowerCase()=='.ico';
    }
    return false;
  }

  function createEntitySpecificConfig(entityId){
    var newConfig = {};
    newConfig.configName = 'N' + entityId + '_behaviours';
    newConfig.configType = "entity";
    newConfig.matchEntity = {"id":entityId}
    return newConfig;
  }

}