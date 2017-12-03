function EntityEventsHelper(){

  var eventBehaviourMapping = [
    { name: 'AutoImage',            event: addEntityToGraph_beforeNodeAdd,   func: new NodeBehavioursApi().AutoImageToConfig },
    { name: 'SubnodesForLinks',     event: addEntityToGraph_afterNodeAdd,    func: new NodeBehavioursApi().CreateSubNodesFromLinks },
    { name: 'FetchLinkOnDblClick',  event: nodeDoubleClick,           func: new NodeBehavioursApi().FetchNodeLinks }
  ]
  
  this.AddEntityToGraph_beforeConfigLoad = function(nodeData){addEntityToGraph_beforeConfig(nodeData);}
  
  this.AddEntityToGraph_beforeNodeAdd = function(nodeData){addEntityToGraph_beforeNodeAdd(nodeData);}
  
  this.AddEntityToGraph_afterNodeAdd = function(node){addEntityToGraph_afterNodeAdd(node)}
  
  this.NodeDblClick = function(node){nodeDoubleClick(node)}

  function addEntityToGraph_beforeConfig(nodeData){
    executeConfigBehaviors(nodeData, addEntityToGraph_beforeConfig.name, nodeData.id);
  }

  function addEntityToGraph_beforeNodeAdd(nodeData){
    executeConfigBehaviors(nodeData, addEntityToGraph_beforeNodeAdd.name, nodeData.id);
  }
  
  function addEntityToGraph_afterNodeAdd(node){
    executeConfigBehaviors(node, addEntityToGraph_afterNodeAdd.name, node.id);
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
