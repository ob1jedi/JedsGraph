function EntityEventsHelper(){

  this.AddEntityToGraph_before = function(nodeData){
    var configHelper = new ConfigHelper();
    var config = configHelper.GetConfigForEntity(nodeData);
    var nodeBehaviours = new NodeBehavioursApi();
    config.config.behaviours.forEach(function(behaviourName){
      nodeBehaviours.Behaviours.forEach(function(regBehavior){
        if (behaviourName == regBehavior.name)
          regBehavior.func(nodeData);
      });
    });
  }

  this.AddEntityToGraph_after = function(nodeData){
  }

}
