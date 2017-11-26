function NodeBehavioursApi() {
  
  //this.Behaviours = [
  //  {name: "autoImage", func: autoImage}
  //];

  this.AutoImageToConfig = function(nodeData) {
    for(var prop in nodeData.propertiesObject) {
      var propVal=nodeData.propertiesObject[prop];
      if(isImage(propVal)) {
        nodeData.entityConfig.config.attributes.img["url"] = propVal;
        //var config = createEntitySpecificConfig(nodeData.id);
        //config.config = {"attributes":{"img":{"url": propVal}}};
        //new ConfigHelper().AddDynamicEntityConfigReturnId(config.configName, config);
      }
    }
  }

  this.CreateSubNodesFromLinks = function(node) {
    //debugger;
    for(var prop in node.data.propertiesObject) {
      var propVal = node.data.propertiesObject[prop];
      if (isLink(propVal) && !isImage(propVal) && !isHtml(propVal) && node.data.labels[0] != 'link'){
        var dataSvc= new DataService();
        var subNode = dataSvc.CreateEntity_AddToGraph_ReturnNode(["link"], {"URL":propVal});
        var link=new dataSvc.CreateRelation_AddToGraph_ReturnLink(node.id,subNode.id,["links_to"]);

      }
    }
  }

  this.FetchNodeLinks = function(node) {
    for(var prop in node.data.propertiesObject) {
      var propVal = node.data.propertiesObject[prop];
      if (isLink(propVal) && !isImage(propVal) && !isHtml(propVal)){
        var dataSvc= new DataService();
        try{
          new ApiImportTranslator().Translate(propVal, node);
        }catch(exception){}
      }
    }
  }

  this.AutoImageToNode = function(node) {
    
    for(var prop in node.data.propertiesObject) {
      var propVal=node.data.propertiesObject[prop];
      if(isImage(propVal)) {
        node.data.UI.imageUI.link(propVal);
        node.data.UI.imageUI.attr("width", node.data.nodeSize * 3);
        node.data.UI.imageUI.attr("height", node.data.nodeSize * 3);
        node.data.UI.imageUI.attr("x", -node.data.nodeSize * 3/2);
        node.data.UI.imageUI.attr("y", -node.data.nodeSize * 3/2);
      }
    }
  }

  function isLink(value){
    if (typeof value !== "string") 
      return;
    if(value.length>7) {
        return value.substr(0,7).toLowerCase()=='http://' || value.substr(0,8).toLowerCase()=='https://'
    }
    return false;
  }

  function isHtml(value){
    if (typeof value !== "string") 
      return;
    if(value.length>5) {
        var possibleExtension=value.slice(-5);
        return possibleExtension.toLowerCase()=='.html'
    }
    return false;
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