
function addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, _sourceConfig) {
	var newNodes = [];
	graphElements.forEach(function (graphElement) {
		var datN = new nodeDataType;
		datN.id = _sourceConfig.prefix + graphElement.fromNode.id;
		datN.labels = graphElement.fromNode.labels;
		datN.properties = new neoPropertyList(graphElement.fromNode.properties);
		datN.propertiesObject = graphElement.fromNode.properties;
		var fromNode = addDataNode(datN.id, datN, _sourceConfig);
		if (fromNode)
			newNodes.push(fromNode);

		var datM = new nodeDataType;
		datM.id = _sourceConfig.prefix + graphElement.toNode.id;
		datM.labels = graphElement.toNode.labels;
		datM.properties = new neoPropertyList(graphElement.toNode.properties);
		datM.propertiesObject = graphElement.toNode.properties;
		var toNode = addDataNode(datM.id, datM, _sourceConfig);
		if (toNode)
			newNodes.push(toNode);

		//link R...
		var linkdata = new linkDataType(datN.id, datM.id, _sourceConfig.prefix + graphElement.link.id, graphElement.link.labels, _sourceConfig);
		linkdata.properties = new neoPropertyList(graphElement.link.properties);
		linkdata.propertiesObject = graphElement.link.properties;
		var link = addDataLink(datN.id, datM.id, linkdata, _sourceConfig);
	});

	refreshNodesDepths();
	return newNodes;
}

function addNodesToGraphAndReturnNodes(nodes, _sourceConfig)
{
	var newNodes =[];
	nodes.forEach(function (node) {
		var datM = new nodeDataType;
		datM.id = _sourceConfig.prefix + node.id;
		datM.labels = node.labels;
		datM.properties = new neoPropertyList(node.properties);
		datM.propertiesObject = node.properties;
		var addedNode = addDataNode(node.id, datM, _sourceConfig)
		newNodes.push(addedNode);
	});
	return newNodes;
}