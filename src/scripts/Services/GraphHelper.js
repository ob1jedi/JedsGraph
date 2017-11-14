function GraphHelper(){
  
  this.getNodesByName = function(name){
    var nodes = [];
    for (var i = 0; i < globals.nodeList.length; i++){
      if (globals.nodeList[i].data.labels.indexOf(name) > -1)
        nodes.push(globals.nodeList[i]);
    }
    return nodes;
  }

  this.SelectNode = function(node){
    consoleApp.selectNode(node);
  }

  this.AddToEntityTypeDefs = function(node){
    //debugger;
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
    //debugger;
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


function SimpleArranger(){
  this.Arrange = function(){
    var types = [];
    var typesCount = {};
    globals.nodeList.forEach(function(node){
      var type = node.data.labels[0];
      types.push(type);
      if (!typesCount[type])
        typesCount[type] = [node];
      else
        typesCount[type].push(node);
    });

    var y = 0;
    for (var type in typesCount){
      y += 100;
      var x = 0;
      typesCount[type].forEach(function(node){
        x += 100;
        globals.layout.pinNode(node, true);
        globals.layout.setNodePosition(node.id, x, y);
      });
    }
  }
}

