function GraphHelper(){
  
  this.getNodesByName = function(name){
    var nodes = [];
    for (var i = 0; i < globals.nodeList.length; i++){
      if (globals.nodeList[i].data.labels.indexOf(name) > -1)
        nodes.push(globals.nodeList[i]);
    }
    return nodes;
  }

}