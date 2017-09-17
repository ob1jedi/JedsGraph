
function addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, _sourceConfig) {
	console.log('graph elements', graphElements);
	var newNodes = [];
	graphElements.forEach(function (graphElement) {
		var datN = new nodeDataType;
		datN.id = graphElement.fromNode.id;
		datN.labels = graphElement.fromNode.labels;
		datN.properties = new neoPropertyList(graphElement.fromNode.properties);
		datN.propertiesObject = graphElement.fromNode.properties;
		var fromNode = addDataNode(datN.id, datN, _sourceConfig);
		if (fromNode)
			newNodes.push(fromNode);

		var datM = new nodeDataType;
		datM.id =graphElement.toNode.id;
		datM.labels = graphElement.toNode.labels;
		datM.properties = new neoPropertyList(graphElement.toNode.properties);
		datM.propertiesObject = graphElement.toNode.properties;
		var toNode = addDataNode(datM.id, datM, _sourceConfig);
		if (toNode)
			newNodes.push(toNode);

		//link R...
		var linkdata = new linkDataType(datN.id, datM.id, graphElement.link.id, graphElement.link.labels, _sourceConfig);
		linkdata.properties = new neoPropertyList(graphElement.link.properties);
		linkdata.propertiesObject = graphElement.link.properties;
		console.log('adding data link', linkdata);
		var link = addDataLink(datN.id, datM.id, linkdata, _sourceConfig);
	});

	refreshNodesDepths();
	return newNodes;
}

function addRelationToGraphReturnLink(relation, _sourceConfig) {
    var dat = new linkDataType(relation.fromNodeId, relation.toNodeId, relation.id, relation.labels, _sourceConfig);
    if (relation.properties) { dat.properties = new neoPropertyList(relation.properties); }
    if (relation.properties) { dat.propertiesObject = relation.properties }
    var relation = addDataLink(dat.fromNodeID, dat.toNodeID, dat, _sourceConfig);
    return relation;
}

function addEntitiesToGraphAndReturnNodes(entities, _sourceConfig)
{
	var newNodes =[];
	entities.forEach(function (entitiy) {
		var datM = new nodeDataType;
		datM.id = entitiy.id;
		datM.labels = entitiy.labels;
		datM.properties = new neoPropertyList(entitiy.properties);
		datM.propertiesObject = entitiy.properties;
		var addedNode = addDataNode(entitiy.id, datM, _sourceConfig)
		newNodes.push(addedNode);
	});
	
	return newNodes;
}

function removeNodeFromGraph(node)
{
	removeNodeFromStage(node.id);
}