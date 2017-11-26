function EntityEventsHelper(){

  var eventBehaviourMapping = [
    
    { name: 'AutoImage', event: addEntityToGraph_after, func: new NodeBehavioursApi().AutoImageToNode },
    { name: 'SubnodesForLinks', event: addEntityToGraph_after, func: new NodeBehavioursApi().CreateSubNodesFromLinks },
    { name: 'FetchLinkOnDblClick', event: nodeDoubleClick, func: new NodeBehavioursApi().FetchNodeLinks }
  ]

  this.AddEntityToGraph_before = function(nodeData){addEntityToGraph_before(nodeData);}
  this.AddEntityToGraph_after = function(node){addEntityToGraph_after(node)}
  this.NodeDblClick = function(node){nodeDoubleClick(node)}

  function addEntityToGraph_before(nodeData){
    executeConfigBehaviors(nodeData, addEntityToGraph_before.name, nodeData.id);
  }

  function addEntityToGraph_after(node){
    executeConfigBehaviors(node, addEntityToGraph_after.name, node.id);
  }

  function nodeDoubleClick(node){
    executeConfigBehaviors(node, nodeDoubleClick.name, node.id);
  }

  function executeConfigBehaviors(eventData, eventName, nodeId){
    var behaviours = getBehavioursForNodeAndEvent(eventName, nodeId);
    behaviours.forEach(function(behaviourFunction){
      behaviourFunction(eventData)
    });
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
