
function addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, _sourceConfig) {
	var newNodes = [];

	graphElements.forEach(function (graphElement) {
    var bFromNodeExists = true;
    var bToNodeExists = true;

    var fromNode=getExistingNode(graphElement.fromNode.id);
    if (!fromNode){
      bFromNodeExists = false;
		  var datN = new nodeDataType;
		  datN.id = graphElement.fromNode.id;
      datN.labels = graphElement.fromNode.labels;
      datN.properties = new neoPropertyList(graphElement.fromNode.properties);
      datN.propertiesObject = graphElement.fromNode.properties;
      datN.entityConfig = GetConfigForEntityId(datN);
      fromNode = addDataNode(datN.id, datN, _sourceConfig);
    }
    newNodes.push(fromNode);
    var toNode=getExistingNode(graphElement.toNode.id);
    if (!toNode){
      bToNodeExists = false;
		  var datM = new nodeDataType;
      datM.id =graphElement.toNode.id;
      datM.labels = graphElement.toNode.labels;
      datM.properties = new neoPropertyList(graphElement.toNode.properties);
      datM.propertiesObject = graphElement.toNode.properties;
      datM.entityConfig = GetConfigForEntityId(datM);
      toNode = addDataNode(datM.id, datM, _sourceConfig);
    }
    newNodes.push(toNode);
		// Link...
    var link = getExistingLink(graphElement.link.id);
    if (!link){
		  var linkdata = new linkDataType(fromNode.id, toNode.id, graphElement.link.id, graphElement.link.labels, _sourceConfig);
		  linkdata.properties = new neoPropertyList(graphElement.link.properties);
		  linkdata.propertiesObject = graphElement.link.properties;
		  link = addDataLink(fromNode.id, toNode.id, linkdata, _sourceConfig);
    }

    if (bFromNodeExists && !bToNodeExists)
      applyPopoutEffectToNode(toNode, fromNode.id)
    if (bToNodeExists && !bFromNodeExists)
      applyPopoutEffectToNode(fromNode, toNode.id)

	});

	refreshNodesDepths();
  
  return newNodes;
}



function addRelationToGraphReturnLink(relation, _sourceConfig) {
    var link = getExistingLink(relation.id);
    if (!link){
      var dat = new linkDataType(relation.fromNodeId, relation.toNodeId, relation.id, relation.labels, _sourceConfig);
      if (relation.properties) { dat.properties = new neoPropertyList(relation.properties); }
      if (relation.properties) { dat.propertiesObject = relation.properties }
      link = addDataLink(dat.fromNodeID, dat.toNodeID, dat, _sourceConfig);
    }
    return link;
}

function addEntitiesToGraphAndReturnNodes(entities, _sourceConfig)
{
	var newNodes =[];
	entities.forEach(function (entity) {
    var addedNode=getExistingNode(entity.id);
    if (!addedNode){
		  var datM = new nodeDataType;
		  datM.id = entity.id;
		  datM.labels = entity.labels || [];
		  datM.properties = new neoPropertyList(entity.properties);
		  datM.propertiesObject = entity.properties;
      datM.entityConfig = GetConfigForEntityId(datM);
		  addedNode = addDataNode(entity.id, datM, _sourceConfig)
    }
		newNodes.push(addedNode);
	});
	
	return newNodes;
}


function GetConfigForEntityId(nodeData)
{
    new EntityEventsHelper().AddEntityToGraph_beforeConfigLoad(nodeData);
    var configHelper = new ConfigHelper();
    return configHelper.GetConfigForEntityId(nodeData.id);
}

function removeNodeFromGraph(nodeId)
{
	removeNodeFromStage(nodeId);
}