
function addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, _sourceConfig) {
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
		var link = addDataLink(datN.id, datM.id, linkdata, _sourceConfig);
	});

	refreshNodesDepths();
	return newNodes;
}

function addSingleRelationToGraphReturnLink(link, _sourceConfig) {
	var dat = new linkDataType(link.fromNodeId, link.toNodeId, link.id, link.labels, _sourceConfig);
	if (link.properties) { dat.properties = new neoPropertyList(link.properties); }
	if (link.properties) { dat.propertiesObject = link.properties }
	var link = addDataLink(dat.fromNodeID, dat.toNodeID, dat, _sourceConfig);
	return link;
}

function addNodesToGraphAndReturnNodes(nodes, _sourceConfig)
{
	var newNodes =[];
	nodes.forEach(function (node) {
		var datM = new nodeDataType;
		datM.id = node.id;
		datM.labels = node.labels;
		datM.properties = new neoPropertyList(node.properties);
		datM.propertiesObject = node.properties;
		var addedNode = addDataNode(node.id, datM, _sourceConfig)
		newNodes.push(addedNode);
	});
	return newNodes;
}

function removeNodeFromGraph(node)
{
	removeNodeFromStage(node.id);
}