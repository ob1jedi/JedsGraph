function NodeBehavioursApi() {
  
  this.Behaviours = [
    {name: "autoImage", func: autoImage}
  ];

  function autoImage(nodeData) {
    for(var prop in nodeData.propertiesObject) {
      var propVal=nodeData.propertiesObject[prop];
      //var propVal=entity.properties[prop];
      if(isImage(propVal)) {
        var config = createEntitySpecificConfig(nodeData.id);
        config.config = {"attributes":{"img":{"url": propVal}}};
        new ConfigHelper().AddDynamicEntityConfigReturnId(config.configName, config);
      }
    }
  }

  function isImage(value){
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