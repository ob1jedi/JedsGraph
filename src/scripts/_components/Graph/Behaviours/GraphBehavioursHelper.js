﻿function GraphBehavioursHelper(){

  this.CreateNodeAtClickPoint = function(x, y){
    // Get graph matrix...
    var graphMatrix = globals.graphics.getSvgRoot().childNodes[0].attr('transform').substr(7).replace(')','').replace(/\s/g,'').split(',');
    var graphX = Number(graphMatrix[4]);
    var graphY = Number(graphMatrix[5]);
    var graphScale = Number(graphMatrix[3]);

    // Create node...
    var labels=['n'];
    var newNode = new DataService().CreateEntity_AddToGraph_ReturnNode(labels);

    // Calculate node position...
    var posx= ((x) * (1/graphScale)) - graphX * (1/graphScale);// * (1/graphScale);
    var posy= ((y-50) * (1/graphScale)) - graphY * (1/graphScale);// * (1/graphScale); //e.clientY + window.document.body.scrollTop + window.document.documentElement.scrollTop

    // Create relation...
    if (globals.modes.createLinkFromSelectedNodeOnCreateNode){
      var fromNode = globals.selectedNode;
      if(fromNode){
        new DataService().CreateRelation_AddToGraph_ReturnLink(fromNode.id, newNode.id);
      }
    }

    // Select Node
    if (globals.modes.selectNodeAfterCreate){
      //debugger;
      new GraphHelper().SelectNode(newNode);
    }

    // Position node...
    globals.layout.setNodePosition(newNode.id,posx,posy);
  }


  //function translatorCreateRelation(fromNode, toNode){
  //  _dataSvc.CreateRelation_AddToGraph_ReturnLink(fromNode.id, toNode.id);
  //}

  //function translatorCreateNode(label, type){
  //  return _dataSvc.CreateEntity_AddToGraph_ReturnNode([type], {"Name":label});
  //}

}