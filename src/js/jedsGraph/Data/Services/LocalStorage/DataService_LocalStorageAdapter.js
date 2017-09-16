var DataService = function () {
	var dataDriver = new LocalStorageDataDriver();

	this.FetchEntitiesForNode = function (nodeId, _sourceConfig) {
		var graphElements = dataDriver.GetRelatedNodesGraph(stripDomainFromId(nodeId));
		console.log('fetching entities for node:', nodeId);
		addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, currentTheme.sourceConfig);
	}

	this.CreateNode = function (labelName, _sourceConfig) {
		var newNode = {
			labels: [labelName]
		};
		var nodeId = dataDriver.CreateNodeInDatabasePopulateAndReturnId(newNode);
	}

	this.DeleteNode = function (nodeID, _sourceConfig) {
		dataDriver.DeleteNode(nodeID);
		//Neo4jDeleteNode(nodeID, _sourceConfig);
	}

	this.CheckMonitoredNodes = function (_sourceConfig) {
		//Neo4jCheckMonitoredNodes(_sourceConfig);
	}

	this.CheckMonitoredLinks = function (_sourceConfig) {
		//Neo4jCheckMonitoredLinks(_sourceConfig);
	}

	this.Qbuilder = function (selectType, _sourceConfig) {
		//Neo4jQbuilder(selectType, _sourceConfig);
	}

	this.Qbuilder_ClearValue = function (selectType) {
		//Neo4jQbuilder_ClearValue(selectType);
	}

	this.QuerySimpleSearch = function (fromEntity, whereProperty, equalsValue, _sourceConfig) {
		//Neo4jQuerySimpleSearch(fromEntity, whereProperty, equalsValue, _sourceConfig);
	}

	this.GetRelationCounts = function (nodeId, callback, _sourceConfig) {
		//Neo4jGetRelationCounts(nodeId, callback, _sourceConfig);
	}

	this.GetNodesByLabel = function (byLabel, sourceConfigPrefix) {
		//Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix);
		var nodes = dataDriver.GetNodesByLabel(byLabel);
		addNodesToGraphAndReturnNodes(nodes, currentTheme.sourceConfig);
	}

	function GetNodeById (nodeId, sourceConfigPrefix) {
		return dataDriver.getNodeFromDatabase(nodeId);
	}

	this.GetNodesByDetails = function (nodeLabel, properties, _sourceConfig) {
		//Neo4jGetNodesByDetails(nodeLabel, properties, _sourceConfig);
	}

	this.InitAllNodes = function (_sourceConfig) {
		var labelData = dataDriver.GetAllNodeLabels();
		labelData.forEach(function (labelData) {
			var nodes = dataDriver.GetNodesByLabel(labelData);
			addNodesToGraphAndReturnNodes(nodes, currentTheme.sourceConfig);
		});
		this.InitAllRelations(_sourceConfig);
		//Neo4jInitAllNodes(_sourceConfig);
	}

	this.InitAllRelations = function (_sourceConfig) {
		var labelDatas = dataDriver.GetAllLinkLabelsAndLinkIds();

		var graphElements = labelDatas.map(function (labelData) {
			labelData.ids.map(function (id) {
				return dataDriver.GetGraphOfLink(id)
			});
		});
		addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, currentTheme.sourceConfig);
		//Neo4jInitAllRelations(_sourceConfig);
	}

	this.CreateEntityReturnCallbackWithIds = function (entityName, propList, inputCallback) {
		var newNode = {
			labels: [entityName],
			properties: propList
		};
		var nodeId = dataDriver.CreateNodeInDatabasePopulateAndReturnId(newNode);
		var node = dataDriver.getNodeFromDatabase(nodeId);
		addNodesToGraphAndReturnNodes([node], currentTheme.sourceConfig);
		//inputCallback(nodeId);
		//Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback);
		refreshLabelSelectors();
	}

	this.UpdateEntity = function (nodeID, newProperties, callback) {
		//Neo4jUpdateEntity(nodeID, newProperties, callback);
	}

	this.CreateRelation = function (nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly) {
		//Neo4jCreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly)
		var link = {
			labels: [relationName],
			properties: propList
		}
		var relId = dataDriver.CreateRelationshipPopulateAndReturnId(stripDomainFromId(nodeID1), stripDomainFromId(nodeID2), link);
		var link = dataDriver.GetLinkFromDatabase(relId);
		addSingleRelationToGraphReturnLink(link);
	}

	this.DeleteRelationship = function (relationshipID, _sourceConfig) {
		//Neo4jDeleteRelationship(relationshipID, _sourceConfig);
	}

	this.DeleteLabel = function (nodeId, labelName, _sourceConfig) {
		//Neo4jDeleteLabel(nodeId, labelName, _sourceConfig);
	}

	this.AddProperty = function (nodeId, _sourceConfig) {
		//Neo4jAddProperty(nodeId, _sourceConfig);
	}

	this.AddLabel = function (_sourceConfig) {
		//Neo4jAddLabel(_sourceConfig);
	}

	this.GetAllNodeLabels = function (_sourceConfig) {
		//Neo4jGetAllLabels(_sourceConfig);
		var labels = dataDriver.GetAllNodeLabelsAndNodeIds(_sourceConfig);
		labels.forEach(function (label) {
			addDataLabel(label.label, label.ids.length, _sourceConfig);
		});
		refreshLabelSelectors();
	}

	function stripDomainFromId(nodeId)
	{
		if (nodeId.length > 3)
			if (nodeId.substring(0, 3) == 'LOC')
				return nodeId.substring(3);
		return nodeId;
	}

}



//===============================================================================================

//===============================================================================================


//===============================================================================================
