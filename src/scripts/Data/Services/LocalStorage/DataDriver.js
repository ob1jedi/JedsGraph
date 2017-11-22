
var LocalStorageDataDriver = function () {


    //----PUBLIC----------------------------------------------------------

  this.ClearStorage = function(){
    localStorage.clear();
  }


	this.UpdateConfigInDb = function (name, configJson) {
		writeConfigToStorage(name, configJson);
		return configJson.id;
	}
    this.CreateConfigInDbAndReturnId = function (name, configJson) {
    	configJson.id = this.GetNextNewConfigId();
        writeConfigToStorage(name, configJson);
        return configJson.id;
    }

	this.CreateEntityInDatabasePopulateAndReturnId = function (node) {
		node = sanitizeNode(node);
		node.id = this.GetNextNewEntityId();
		writeNodeToStorage(node);
		return node.id;
	}

	this.GetRelatedNodes = function (nodeId) {
		var node = this.GetEntityFromDatabase(nodeId);
		var nodeLinks = node.links;
		var dataDriver = this;
		var relatedNodeIds = [];
		nodeLinks.forEach(function (linkId) {
			var link = dataDriver.GetLinkFromDatabase(linkId);
			if (nodeId == link.fromNodeId)
				relatedNodeIds.push(link.toNodeId);
			else
				relatedNodeIds.push(link.fromNodeId);
		});

		return relatedNodeIds;
	}

	this.GetEntityById = function (entityId){
	    return this.GetEntityFromDatabase(entityId);
	}

	this.GetConfigById = function (configId) {
	    return this.GetConfigFromDatabase(configId);
	}

	this.GetRelatedEntityGraph = function (nodeId) {
		var node = this.GetEntityFromDatabase(nodeId);
		var dataDriver = this;
		return node.links.map(function (linkId) { return dataDriver.GetGraphOfRelation(linkId) });
	}

	this.GetGraphOfRelation = function (linkId) {
		var link = this.GetLinkFromDatabase(linkId);
		var graphElement = new GraphElement();
		graphElement.fromNode = this.GetEntityFromDatabase(link.fromNodeId);
		graphElement.toNode = this.GetEntityFromDatabase(link.toNodeId);
		graphElement.link = link;
		return graphElement;
	}

	this.CreateRelationPopulateAndReturnId = function (fromEntityId, toEntityId, labels, properties) {
	    link = {}; //new Relation(); //sanitizeLink(relation);
		link.id = this.GetNextNewRelationId();
		link.fromNodeId = fromEntityId;
		link.toNodeId = toEntityId;
		link.labels = labels || [];
		link.properties = properties ? properties : {};

		var fromEntity = this.GetEntityFromDatabase(fromEntityId);
		fromEntity.links.push(link.id);
		writeNodeToStorage(fromEntity);

		var toEntity = this.GetEntityFromDatabase(toEntityId);
		toEntity.links.push(link.id);
		writeNodeToStorage(toEntity);

		writeLinkToStorage(link);
		return link.id;
	}

	this.GetConfigFromDatabase = function (configId) {
	    return getConfigFromDatabase(configId);
	}

	this.GetEntityFromDatabase = function (nodeId) {
		return getEntityFromDatabase(nodeId);
	}

	this.GetLinkFromDatabase = function (linkId) {
		return getRelationFromDatabase(linkId);
	}

	this.DeleteEntity = function(nodeId)
	{
		localStorage.removeItem(nodeKeyFromNodeId(nodeId));
	}


	this.EntityExists = function(nodeId)
	{
		var node = readNodeFromStorage(nodeId);
		return node !== null;
	}

	this.GetNextNewConfigId = function () {
		var nextIndex = getNextIndexForCounter('NEXT_CONFIG_ID');
		return nextIndex;
	}

	this.GetNextNewEntityId = function () {
		return getNextIndexForCounter('NEXT_NODE_ID');
	}

	this.GetNextNewRelationId = function () {
		return getNextIndexForCounter('NEXT_LINK_ID');
	}

	function getNextIndexForCounter(CounterName) {
		
		var nextId = localStorage.getItem(CounterName);
		if (nextId === null) {
			localStorage.setItem(CounterName, 1);
			return 1;
		}
		nextId = Number(nextId) + 1;
		localStorage.setItem(CounterName, nextId);
		return nextId;
	}

	this.ConfigExists = function (configName) {
	    var configs = getItemsInIndex('INDEX_ON_CONFIG_NAMES', configName, 'config');
	    return (configs.length > 0);
	}

	this.GetConfigsByName = function (configName) {
	    return getItemsInIndex('INDEX_ON_CONFIG_NAMES', configName, 'config');
	}

	this.GetEntitiesByType = function(labelName){		
		return getItemsInIndex('INDEX_ON_NODE_LABELS', labelName, 'node');
	}

	this.GetEntitiesByPropertyName = function (propertyName) {
		return getItemsInIndex('INDEX_ON_NODE_PROPS', propertyName, 'node');
	}

	this.GetRelationsByLabel = function (labelName) {
		return getItemsInIndex('INDEX_ON_LINK_LABELS', labelName, 'link');
	}

	this.GetRelationsByPropertyName = function (propertyName) {
		return getItemsInIndex('INDEX_ON_LINK_PROPS', propertyName, 'link');
	}

	this.GetAllEntityTypes = function () {
		var nodeIndex = localStorage.getItem('INDEX_ON_NODE_LABELS');
		return getAllLabelsFromIndex(nodeIndex);
	}

	this.GetAllRelationTypes = function () {
		var linkIndex = localStorage.getItem('INDEX_ON_LINK_LABELS');
		return getAllLabelsFromIndex(linkIndex);
	}

	this.GetAllConfigNames = function () {
		var linkIndex = localStorage.getItem('INDEX_ON_CONFIG_NAMES');
		return getAllLabelsFromIndex(linkIndex);
	}

	//this.GetAllRelationTypeInfos = function () {
	//	var linkIndex = localStorage.getItem('INDEX_ON_LINK_LABELS');
	//	return getAllLabelsFromIndex(linkIndex);
	//}

	this.GetAllEntityTypesAndEntityIds = function () {
		return getAllLabelsAndIdsForIndex('INDEX_ON_NODE_LABELS');
	}

	this.GetAllRelationTypesAndRelationIds = function () {
		return getAllLabelsAndIdsForIndex('INDEX_ON_LINK_LABELS');
	}
	//---- PRIVATE ----------------------------------------------------------

	function getConfigFromDatabase(configId) {
	    throwIfInvalidConfigId(configId);
	    var config = readConfigFromStorage(configId);
	    return config;
	}

	function getEntityFromDatabase(nodeId) {
		throwIfInvalidNodeId(nodeId);
		var node = readNodeFromStorage(nodeId);
		return node;
	}

	function getRelationFromDatabase(linkId) {
		throwIfInvalidLinkId(linkId);
		var link = readLinkFromStorage(linkId);
		return link;
	}

	function getItemsInIndex(indexName, elementName, itemType) {
		var dataStringHelper = new DataStringHelper();
		var indexedData = dataStringHelper.getDataString(indexName);
		if (indexedData == "|")
		    return [];
		var itemIdList = dataStringHelper.getDataFromDataString(indexedData, elementName);
		if (itemIdList.length == 0)
		    return [];
		var itemIdArray = itemIdList.split(',');
		if (itemIdArray.length == 0)
		    return [];
		var itemArray = [];
		var dataDriver = this;
		for (var i = 0; i < itemIdArray.length; i++) {
			if (itemType === 'node')
				itemArray.push(getEntityFromDatabase(itemIdArray[i]));
			if (itemType === 'link')
			    itemArray.push(getRelationFromDatabase(itemIdArray[i]));
			if (itemType === 'config')
			    itemArray.push(getConfigFromDatabase(itemIdArray[i]));
		}
		return itemArray;
	}

	function getAllLabelsAndIdsForIndex(indexName) {
		var indexedData = localStorage.getItem(indexName);
		var dataStringHelper = new DataStringHelper();
		var elementArray = dataStringHelper.getAllElements(indexedData);
		var elementInfo = elementArray.map(function (element) {
			return elementToLabelInfo(element);
		});
		return elementInfo;
	}

	function getAllLabelsFromIndex(indexedData) {
		var dataStringHelper = new DataStringHelper();
		var elementArray = dataStringHelper.getAllElements(indexedData);
		var elemenNames = elementArray.map(function (element) { return element.split(':')[0] });
		return elemenNames;
	}

	function elementToLabelInfo(element) {
		var elementParts = element.split(':');
		if (elementParts.length > 1)
			return { label: elementParts[0], ids: elementParts[1].split(',') }
		return { label: elementParts[0], ids: [] }
	}
	
	function writeConfigToStorage(name, config) {
		if (!config.id) throw "Missing config-id in config";
	    localStorage.setItem(configKeyFromConfigId(config.id), serialize(config));
	    updateIndex("INDEX_ON_CONFIG_NAMES", name, config.id);
	}

	function writeNodeToStorage(node) {
		localStorage.setItem(nodeKeyFromNodeId(node.id), serialize(node));
		updateLabelsIndex("INDEX_ON_NODE_LABELS", node);
		updatePropertyIndex("INDEX_ON_NODE_PROPS", node);
	}

	function writeLinkToStorage(link) {
		localStorage.setItem(linkKeyFromNodeId(link.id), serialize(link));
		updateLabelsIndex("INDEX_ON_LINK_LABELS", link);
		updatePropertyIndex("INDEX_ON_LINK_PROPS", link);
	}

	function updateLabelsIndex(indexName, item) {
		item.labels.forEach(function (label) {
			updateIndex(indexName, label, item.id);
		});
	}

	function updatePropertyIndex(indexName, item) {
		for (var propertyKey in item.properties) {
			updateIndex(indexName, propertyKey, item.id);
		}
	}

	function updateIndex(indexName, elementName, data) {
		var index = localStorage.getItem(indexName);
		var dataStringHelper = new DataStringHelper();
		if (index === null)
			index = dataStringHelper.getNewDataString();
		index = dataStringHelper.ensureDataIntoElement(index, elementName, data)
		localStorage.setItem(indexName, index);
	}

	function sanitizeNode(node) {
		if (node === undefined)
			node = {};
		node.labels = sanitizeLabels(node.labels);
		node.links = sanitizeNodeLinks(node.links);
		node.properties = sanitizeProperties(node.properties);
		return node;
	}

	function sanitizeLink(link) {
		if (link === undefined)
			link = {};
		link.labels = sanitizeLabels(link.labels);
		link.properties = sanitizeProperties(link.properties);
		return link;
	}

	function sanitizeNodeLinks(links) {
		if (links === undefined)
			links = [];
		return links;
	}

	function sanitizeLabels(labels) {
		if (labels === undefined)
			labels = [];
		return labels;
	}

	function sanitizeProperties(properties) {
		if (properties === undefined)
			properties = [];
		return properties;
	}

	function readConfigFromStorage(configId) {
	    return deserialize(localStorage.getItem(configKeyFromConfigId(configId)));
	}

	function readNodeFromStorage(nodeId) {
		return deserialize(localStorage.getItem(nodeKeyFromNodeId(nodeId)));
	}

	function readLinkFromStorage(linkId) {
		return deserialize(localStorage.getItem(linkKeyFromNodeId(linkId)));
	}


	function throwIfInvalidConfigId(configId) {
	    if (configId === undefined || configId === null || configId === 0)
	        throw "Invalid config id";
	}

	function throwIfInvalidNodeId(nodeId) {
		if (nodeId === undefined || nodeId === null || nodeId === 0)
			throw "Invalid node id";
	}

	function throwIfInvalidLinkId(linkId) {
		if (linkId === undefined || linkId === null || linkId === 0)
			throw "Invalid link id";
	}

	function configKeyFromConfigId(configId) {
	    return 'C_' + configId;
	}

	function nodeKeyFromNodeId(nodeId) {
		return 'N_' + nodeId;
	}

	function linkKeyFromNodeId(linkId) {
		return 'L_' + linkId;
	}

	function serialize(object) {
		return JSON.stringify(object);
	}

	function deserialize(object) {
		return JSON.parse(object);
	}



}