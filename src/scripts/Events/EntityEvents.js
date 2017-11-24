function EntityEventsHelper(){

  var eventBehaviourMapping = [
    //{ name: 'AutoImage', event: addEntityToGraph_before, func: new NodeBehavioursApi().AutoImageToConfig }
    { name: 'AutoImage', event: addEntityToGraph_after, func: new NodeBehavioursApi().AutoImageToNode }
  ]

  this.AddEntityToGraph_before = function(nodeData){addEntityToGraph_before(nodeData);}
  this.AddEntityToGraph_after = function(node){addEntityToGraph_after(node)}

  function addEntityToGraph_before(nodeData){
    var behaviours = getBehavioursForNodeAndEvent(addEntityToGraph_before.name, nodeData.id);
    behaviours.forEach(function(b){b(nodeData)});
  }

  function addEntityToGraph_after(node){
    //debugger;
    var behaviours = getBehavioursForNodeAndEvent(addEntityToGraph_after.name, node.id);
    behaviours.forEach(function(b){b(node)});
  }

  function getBehavioursForNodeAndEvent(eventName, entityId){
    var behaviourFunctions = [];
    var configHelper = new ConfigHelper();
    var config = configHelper.GetConfigForEntityId(entityId);
    config.config.behaviours.forEach(function(behaviourName){  
      eventBehaviourMapping.forEach(function(eb){
        if (eb.name == behaviourName && eb.event.name == eventName)
          behaviourFunctions.push(eb.func);
      });
    });
    return behaviourFunctions;
  }

}
