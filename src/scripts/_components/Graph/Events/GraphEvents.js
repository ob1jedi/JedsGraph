
function graph_Event(eventType, x, y) {
  if (eventType == "dblclick"){
		graph_DoubleClick(x, y);
  }
}

function graph_DoubleClick(x, y){
  if (globals.modes.createNodeOnGraphDblClick == true){
    new GraphBehavioursHelper().CreateNodeAtClickPoint(x,y);
  }
}

