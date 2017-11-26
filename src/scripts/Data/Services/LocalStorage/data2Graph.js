
function addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, _sourceConfig) {
	var newNodes = [];
	graphElements.forEach(function (graphElement) {
		var datN = new nodeDataType;
		datN.id = graphElement.fromNode.id;
		datN.labels = graphElement.fromNode.labels;
		datN.properties = new neoPropertyList(graphElement.fromNode.properties);
    datN.propertiesObject = graphElement.fromNode.properties;
		datN.entityConfig = GetConfigForEntityId(datN);
		var fromNode = addDataNode(datN.id, datN, _sourceConfig);
		if (fromNode)
		    newNodes.push(fromNode);

		var datM = new nodeDataType;
		datM.id =graphElement.toNode.id;
		datM.labels = graphElement.toNode.labels;
		datM.properties = new neoPropertyList(graphElement.toNode.properties);
		datM.propertiesObject = graphElement.toNode.properties;
		datM.entityConfig = GetConfigForEntityId(datM);
		var toNode = addDataNode(datM.id, datM, _sourceConfig);
		if (toNode) {
			newNodes.push(toNode);
			applyPopoutEffectToNode(toNode, datN.id)
		}
		//link R...
		var linkdata = new linkDataType(datN.id, datM.id, graphElement.link.id, graphElement.link.labels, _sourceConfig);
		linkdata.properties = new neoPropertyList(graphElement.link.properties);
		linkdata.propertiesObject = graphElement.link.properties;
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
	entities.forEach(function (entity) {
		var datM = new nodeDataType;
		datM.id = entity.id;
		datM.labels = entity.labels || [];
		datM.properties = new neoPropertyList(entity.properties);
		datM.propertiesObject = entity.properties;
    datM.entityConfig = GetConfigForEntityId(datM);
		var addedNode = addDataNode(entity.id, datM, _sourceConfig)
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