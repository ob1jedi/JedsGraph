var DataService = function () {
	var dataDriver = new LocalStorageDataDriver();

	this.CreateConfigReturnId = function (configName, jsonConfig) {
	    if (dataDriver.ConfigExists(configName))
	        throw "A config by that name already exists";
	    return dataDriver.CreateConfigInDbAndReturnId(configName, jsonConfig);
	}

	this.GetAllConfigs = function () {
		var allConfigNames = dataDriver.GetAllConfigNames();
		return allConfigNames.map(function (cnfName) { return dataDriver.GetConfigsByName(cnfName)[0]})
	}

	this.GetConfigByName = function (configName) {
	    var configs = dataDriver.GetConfigsByName(configName);
	    if (configs.length == 0)
	        return null;
	    return configs[0];
	}

	this.FetchEntitiesForNodeId = function (nodeId, _sourceConfig) {
		var graphElements = dataDriver.GetRelatedEntityGraph(stripDomainFromId(nodeId));
		addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, currentTheme.sourceConfig);

	}

	this.CreateEntity_AddToGraph_ReturnNode = function (labels, properties, _sourceConfig) {
		if (!_sourceConfig) { _sourceConfig = currentTheme.sourceConfig;}
	    if (!properties)
	        properties = {};
	    var newEntity = {
		    labels: labels,
		    properties: properties
		};
	    var entityId = dataDriver.CreateEntityInDatabasePopulateAndReturnId(newEntity);
		var entity = dataDriver.GetEntityById(entityId);
		var nodes = addEntitiesToGraphAndReturnNodes([entity])[0];
		updateUiComponents(labels[0], 1, _sourceConfig);
		return nodes;
	}

	this.CreateEntityReturnId = function (labels, properties) {
	    if (!properties)
	        properties = {};
	    var newEntity = {
	        labels: labels,
	        properties: properties
	    };
	    var entityId = dataDriver.CreateEntityInDatabasePopulateAndReturnId(newEntity);
	    return entityId;
	}

	this.DeleteEntity = function (entityID, _sourceConfig) {
		dataDriver.DeleteEntity(entityID);
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

	this.GetEntitiesByType = function (byLabel, sourceConfigPrefix) {
		//Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix);
		var nodes = dataDriver.GetEntitiesByType(byLabel);
		return addEntitiesToGraphAndReturnNodes(nodes, currentTheme.sourceConfig);
	}

	this.GetEntityById = function(entityId, sourceConfigPrefix) {
	    return dataDriver.GetEntityFromDatabase(entityId);
	}

	this.GetNodesByDetails = function (nodeLabel, properties, _sourceConfig) {
		//Neo4jGetNodesByDetails(nodeLabel, properties, _sourceConfig);
	}

	this.InitAllNodes = function (_sourceConfig) {
		var labelData = dataDriver.GetAllEntityTypes();
		labelData.forEach(function (labelData) {
			var nodes = dataDriver.GetEntitiesByType(labelData);
			addEntitiesToGraphAndReturnNodes(nodes, currentTheme.sourceConfig);
		});
		this.InitAllRelations(_sourceConfig);
		//Neo4jInitAllNodes(_sourceConfig);
	}

	this.InitAllRelations = function (_sourceConfig) {
		var labelDatas = dataDriver.GetAllRelationTypesAndRelationIds();

		var graphElements = labelDatas.map(function (labelData) {
			labelData.ids.map(function (id) {
				return dataDriver.GetGraphOfRelation(id)
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
		var nodeId = dataDriver.CreateEntityInDatabasePopulateAndReturnId(newNode);
		var node = dataDriver.GetEntityFromDatabase(nodeId);
		addEntitiesToGraphAndReturnNodes([node], currentTheme.sourceConfig);
		//inputCallback(nodeId);
		//Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback);
		updateUiComponents(entityName, 1, currentTheme.sourceConfig);
	}

	this.UpdateEntity = function (nodeID, newProperties, callback) {
		//Neo4jUpdateEntity(nodeID, newProperties, callback);
	}

	this.CreateRelation_AddToGraph_ReturnLink = function (fromEntityId, toEntityId, labels, properties, _sourceConfig, planOnly) {
		//Neo4jCreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly)
		var relId = dataDriver.CreateRelationPopulateAndReturnId(stripDomainFromId(fromEntityId), stripDomainFromId(toEntityId), labels, properties);
		var link = dataDriver.GetLinkFromDatabase(relId);
		return addRelationToGraphReturnLink(link);
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

	this.GetAllEntityTypes = function (_sourceConfig) {
		//Neo4jGetAllLabels(_sourceConfig);
		var labels = dataDriver.GetAllEntityTypesAndEntityIds(_sourceConfig);
		labels.forEach(function (label) {
			updateUiComponents(label.label, label.ids.length, _sourceConfig);
		});
	}

	function updateUiComponents(label, entityCount, _sourceConfig)
	{
		addDataLabel(label, entityCount, _sourceConfig);
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
