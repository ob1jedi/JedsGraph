function define_Graph(){
  
  
  var graph=document.getElementById('graphContainer')
  graph.onmove=function(e) {
    updateIndicator(e);
  }

  // Define Graph Events...
  Hammer(graph).on("tap", function(e) {
    //singletap stuff, (theres a problem here, we can't distinguish between a node tap and graph tap)
  });
  Hammer(graph).on("doubletap", function(e) {
    if (globals.states.overNode){
      new node_Event('dblclick',globals.states.overNode, e.center.x, e.center.y);
      return;
    }
    if (globals.states.hammeringNode){
      return;
    }
    graph_Event('dblclick', e.center.x, e.center.y);
  });

}

