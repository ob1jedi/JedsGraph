function GraphHelper(){
  
  this.SelectNode = function(node){
    globals.selectedNode = node;
    highlightSelectedNode(node.id);
    consoleApp.consoleShowNode(node);
  }
  this.getNodesByName = function(name){
    var nodes = [];
    for (var i = 0; i < globals.nodeList.length; i++){
      if (globals.nodeList[i].data.labels.indexOf(name) > -1)
        nodes.push(globals.nodeList[i]);
    }
    return nodes;
  }

  this.ConsoleShowNode = function(node){
    consoleApp.consoleShowNode(node);
  }

  this.AddToEntityTypeDefs = function(node){
    var entityType = new EntityTypeDef();
    labelFound = false;
    // Check for existing node type...
    for (var i = 0; i < globals.entityTypeDefs.length; i++){
      var nodeTypeDef = globals.entityTypeDefs[i];
      for (var x = 0; x < node.data.labels.length; x++){
        if (nodeTypeDef.labels.indexOf(node.data.labels[x]) > -1){
          labelFound = true;
          entityType = nodeTypeDef;
          break;
        }
      }
    }
    // Update properties...
    for (var key in node.data.propertiesObject){
      if (!entityType.properties.hasOwnProperty(key))
        entityType.properties[key] = new PropertyTypeDef();

      var propertyType = getType(node.data.properties[key]);
      if (entityType.properties[key].DataTypes.indexOf(propertyType) == -1)
        entityType.properties[key].DataTypes.push(propertyType);

      if (new StringHelper().IsImage(node.data.propertiesObject[key])){
        if (entityType.imageProperties.indexOf(key) == -1)
          entityType.imageProperties.push(key);
      }
    }

    // Add to array, if new...
    if (!labelFound){
      entityType.labels = node.data.labels;
      globals.entityTypeDefs.push(entityType);
    }
  }

}




