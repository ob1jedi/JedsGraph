function SimpleArranger(orientation){
  var _orientation = orientation||"top-to-bottom";
  var _totalRows = -1;
  var _totalCols = -1;
  var _matrix = {};

  this.Arrange = function(){
    var rootNodes = getRootNodes();
    var nodeGrid = {};
    nodeGrid = createAndInitializeNodeGridDictionary(rootNodes);
    nodeGrid = populateNodeGridDictionary(nodeGrid, rootNodes);
    
    var circularDependants = findAnyLeftOutCircularDependants(nodeGrid);
    while( circularDependants.length > 0){
      nodeGrid = populateNodeGridDictionary(nodeGrid, [circularDependants[0]]);
      circularDependants = findAnyLeftOutCircularDependants(nodeGrid);
    }

    drawNodes(nodeGrid, _orientation);
  }

  function getRootNodes(){
    var rootNodes = [];
    globals.nodeList.forEach(function(n) {
      if (n.data.fromNodes.length == 0) rootNodes.push(n)
    });
    return rootNodes;
  }

  function createAndInitializeNodeGridDictionary(rootNodes){
    var gridDict = {};  
    // Initialize dictionery for all nodes...
    globals.nodeList.forEach(function(node) {
      //gridDict[node.id] = {row: ++rowIndex, col:0}
      gridDict[node.id] = {row: -1, col:-1}
    }); 
    return gridDict;
  }
  function populateNodeGridDictionary(gridDict, rootNodes){
   
    // Iterate through root nodes...
    rootNodes.forEach( function(fromNode) {     
      var nodeRegister = {};
      // Set cell of root node to the currently highest row index...
      gridDict[fromNode.id] = {row: ++_totalRows, col:0}
      var minRow = _totalRows;
      // Recursively get grid layout of nodes...  
      setColOfNodes(fromNode, gridDict, _matrix, nodeRegister)
      var rowHeight = _totalRows - minRow;
      gridDict[fromNode.id].row = minRow + rowHeight/2;
    });
    return gridDict;
  }

  function setColOfNodes(fromNode, gridDict, matrix, nodeRegister){
    var minRow = _totalRows;
    fromNode.data.toNodes.forEach( function(toNode){   
      if (nodeRegister[toNode.id]) // ... Node has already been registered in this tree, do not process it again (occurs in circular dependency trees).
        return;
      nodeRegister[toNode.id] = 1;// ... Register node for this tree.
      var col = Math.max(gridDict[fromNode.id].col + 1, gridDict[toNode.id].col);
      _totalCols = Math.max(col, _totalCols);
      //var row = _totalRows;//gridDict[fN.id].row;
      gridDict[toNode.id].col = col;
      //while (matrix[_totalRows + ',' + col] == 1){
      while (rowHasNodes(_totalRows,col, matrix)){
        _totalRows++;
      }
      matrix[_totalRows+','+col] = 1;
      gridDict[toNode.id].row = _totalRows;
      setColOfNodes(toNode, gridDict, matrix, nodeRegister);
    });
    var rowHeight = _totalRows - minRow;
    gridDict[fromNode.id].row = minRow + rowHeight/2;
  }

  function rowHasNodes(row, fromCol, matrix){
    for (var c = fromCol; c < _totalCols + 1; c++)
      if (matrix[row + ',' + c] == 1)
        return true
    return false;
  }

  function findAnyLeftOutCircularDependants(gridDict){
    // Draw Nodes...
    
    var circularDependants = [];
    globals.nodeList.forEach(function(n) {
      if (gridDict[n.id].col == -1 && gridDict[n.id].row == -1){
          circularDependants.push(n);
      }
    });
    return circularDependants;
  }

  function drawNodes(gridDict, orientation){
    // Draw Nodes...
    var graphDistanceFactor = 100;
    var centerOffset = _totalCols/2 * graphDistanceFactor
    globals.nodeList.forEach(function(n) {
      globals.layout.pinNode(n, true);
      switch (orientation || "top-to-bottom")
      {
        case "left-to-right":
          setNodePosition_Animated(n, gridDict[n.id].col * graphDistanceFactor, gridDict[n.id].row * graphDistanceFactor);
          break;
        case "right-to-left":
          setNodePosition_Animated(n, -gridDict[n.id].col * graphDistanceFactor, gridDict[n.id].row * graphDistanceFactor);
          break;
        case "top-to-bottom":
          setNodePosition_Animated(n, gridDict[n.id].row * graphDistanceFactor, gridDict[n.id].col * graphDistanceFactor);
          break;
        case "bottom-to-top":
          setNodePosition_Animated(n, gridDict[n.id].row * graphDistanceFactor, -gridDict[n.id].col * graphDistanceFactor + centerOffset);
          break;
      }
    });
  }

  function setNodePosition_Animated(node, xPos, yPos){
    globals.layout.setNodePosition(node.id, xPos, yPos);
    //globals.animator.NodePositionAnimation(node, {"x":xPos,"y":yPos});
  }

}

mappings.Arrangers.push({name:"Tree", arranger: new SimpleArranger("bottom-to-top")});
mappings.Arrangers.push({name:"Roots", arranger: new SimpleArranger("top-to-bottom")});
mappings.Arrangers.push({name:"List", arranger: new SimpleArranger("left-to-right")});
