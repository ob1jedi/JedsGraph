function NodeHelper(){
  
  this.RefreshNode = function(nodeId){
    refreshNodeAppearance(nodeId);
  }
  
  this.ReloadNode = function(nodeId){
    addDataNode(node.id, node.data);
  }

  function refreshNodeAppearance(nodeId){
	  var node = globals.GRAPH.getNode(nodeId?nodeId:globals.selectedNode.id);
    node=addNodeToGraph(node.id, node.data);
    return node;
  }

}