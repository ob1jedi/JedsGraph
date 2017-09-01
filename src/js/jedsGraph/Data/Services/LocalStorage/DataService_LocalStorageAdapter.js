var DataService = function () {
	var dataDriver = new LocalStorageDataDriver();

	this.FetchEntitiesForNode = function (nodeId, _sourceConfig) {
		var graphElements = dataDriver.getRelatedNodesGraph(nodeId);
		addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, currentTheme.sourceConfig);
	}

	this.CreateNode = function (labelName, _sourceConfig) {
		var newNode = {
			labels: [labelName]
		};
		dataDriver.createNodeInDatabasePopulateAndReturnId(newNode);
	}

	this.DeleteNode = function (nodeID, _sourceConfig) {
		dataDriver.deleteNode(nodeID);
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
		var nodes = dataDriver.getNodesByLabel(byLabel);
		addNodesToGraphAndReturnNodes(nodes, currentTheme.sourceConfig);
	}

	this.GetNodesByDetails = function (nodeLabel, properties, _sourceConfig) {
		//Neo4jGetNodesByDetails(nodeLabel, properties, _sourceConfig);
	}

	this.InitAllNodes = function (_sourceConfig) {
		var labelData = dataDriver.getAllNodeLabels();
		labelData.forEach(function (labelData) {
			var nodes = dataDriver.getNodesByLabel(labelData);
			addNodesToGraphAndReturnNodes(nodes, currentTheme.sourceConfig);
		});
		this.InitAllRelations(_sourceConfig);
		//Neo4jInitAllNodes(_sourceConfig);
	}

	this.InitAllRelations = function (_sourceConfig) {
		var labelDatas = dataDriver.getAllLinkLabelsAndLinkIds();
		console.log('labelDatas', labelDatas);
		var graphElements = labelDatas.map(function (labelData) {
			labelData.ids.map(function (id) {
				return dataDriver.getGraphOfLink(id)
			});
		});
		console.log('graphElements', graphElements);
		addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, currentTheme.sourceConfig);
		//Neo4jInitAllRelations(_sourceConfig);
	}

	this.CreateEntityReturnCallbackWithIds = function (entityName, propList, inputCallback) {
		//Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback);
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
		dataDriver.createRelationshipPopulateAndReturnId(nodeID1, nodeID2, link);
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

	this.getAllNodeLabels = function (_sourceConfig) {
		//Neo4jGetAllLabels(_sourceConfig);
		var labels = dataDriver.getAllNodeLabelsAndNodeIds(_sourceConfig);
		labels.forEach(function (label) {
			addDataLabel(label.label, label.ids.length, _sourceConfig);
		});
		refreshLabelSelectors();
	}

}



//===============================================================================================

//===============================================================================================


//===============================================================================================
