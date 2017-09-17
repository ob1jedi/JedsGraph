
var LocalStorageDataDriver = function () {

	//----PUBLIC----------------------------------------------------------
	this.CreateEntityInDatabasePopulateAndReturnId = function (node) {
		node = sanitizeNode(node);
		node.id = this.GetNextNewNodeId();
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

	this.GetRelatedNodesGraph = function (nodeId) {
		var node = this.GetEntityFromDatabase(nodeId);
		var dataDriver = this;
		return node.links.map(function (linkId) { return dataDriver.GetGraphOfRelation(linkId) });
	}

	this.GetGraphOfRelation = function (linkId) {
		var link = this.GetLinkFromDatabase(linkId);
		var graphElement = new GraphElement();
		console.log('link', linkId);
		graphElement.fromNode = this.GetEntityFromDatabase(link.fromNodeId);
		graphElement.toNode = this.GetEntityFromDatabase(link.toNodeId);
		graphElement.link = link;
		return graphElement;
	}

	this.CreateRelationPopulateAndReturnId = function (fromEntityId, toEntityId, labels, properties) {
	    link = {}; //new Relation(); //sanitizeLink(relation);
		link.id = this.GetNextNewLinkId();
		link.fromNodeId = fromEntityId;
		link.toNodeId = toEntityId;
		link.labels = labels ? labels : [];
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

	this.GetEntityFromDatabase = function (nodeId) {
		return getNodeFromDatabase(nodeId);
	}

	this.GetLinkFromDatabase = function (linkId) {
		return getLinkFromDatabase(linkId);
	}

	this.DeleteNode = function(nodeId)
	{
		localStorage.removeItem(nodeKeyFromNodeId(nodeId));
	}


	this.NodeExists = function(nodeId)
	{
		var node = readNodeFromStorage(nodeId);
		return node !== null;
	}

	this.GetNextNewNodeId = function () {
		var nextId = localStorage.getItem('NEXT_NODE_ID');
		if (nextId === null) {
			localStorage.setItem('NEXT_NODE_ID', 1);
			return 1;
		}
		localStorage.setItem('NEXT_NODE_ID', Number(nextId) + 1);
		return nextId;
	}

	this.GetNextNewLinkId = function () {
		var nextId = localStorage.getItem('NEXT_LINK_ID');
		if (nextId === null) {
			localStorage.setItem('NEXT_LINK_ID', 1);
			return 1;
		}
		localStorage.setItem('NEXT_LINK_ID', Number(nextId) + 1);
		return nextId;
	}

	this.GetNodesByLabel = function(labelName){		
		return getItemsInIndex('INDEX_ON_NODE_LABELS', labelName, 'node');
	}

	this.GetNodesByPropertyName = function (propertyName) {
		return getItemsInIndex('INDEX_ON_NODE_PROPS', propertyName, 'node');
	}

	this.GetLinksByLabel = function (labelName) {
		return getItemsInIndex('INDEX_ON_LINK_LABELS', labelName, 'link');
	}

	this.GetLinksByPropertyName = function (propertyName) {
		return getItemsInIndex('INDEX_ON_LINK_PROPS', propertyName, 'link');
	}

	this.GetAllNodeLabels = function () {
		var nodeIndex = localStorage.getItem('INDEX_ON_NODE_LABELS');
		return getAllLabelsFromIndex(nodeIndex);
	}

	this.GetAllLinkLabels = function () {
		var linkIndex = localStorage.getItem('INDEX_ON_LINK_LABELS');
		return getAllLabelsFromIndex(linkIndex);
	}

	this.GetAllLinkLabelInfos = function () {
		var linkIndex = localStorage.getItem('INDEX_ON_LINK_LABELS');
		return getAllLabelsFromIndex(linkIndex);
	}

	this.GetAllNodeLabelsAndNodeIds = function () {
		return getAllLabelsAndIdsForIndex('INDEX_ON_NODE_LABELS');
	}

	this.GetAllLinkLabelsAndLinkIds = function () {
		return getAllLabelsAndIdsForIndex('INDEX_ON_LINK_LABELS');
	}
	//---- PRIVATE ----------------------------------------------------------

	function getNodeFromDatabase(nodeId) {
		throwIfInvalidNodeId(nodeId);
		var node = readNodeFromStorage(nodeId);
		return node;
	}

	function getLinkFromDatabase(linkId) {
		throwIfInvalidLinkId(linkId);
		var link = readLinkFromStorage(linkId);
		return link;
	}

	function getItemsInIndex(indexName, elementName, itemType) {
		var dataStringHelper = new DataStringHelper();
		var indexedData = dataStringHelper.getDataString(indexName);
		var itemIdList = dataStringHelper.getDataFromDataString(indexedData, elementName);
		var itemIdArray = itemIdList.split(',');
		var itemArray = [];
		var dataDriver = this;
		for (var i = 0; i < itemIdArray.length; i++) {
			if (itemType === 'node')
				itemArray.push(getNodeFromDatabase(itemIdArray[i]));
			if (itemType === 'link')
				itemArray.push(getLinkFromDatabase(itemIdArray[i]));
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

	function readNodeFromStorage(nodeId) {
		return deserialize(localStorage.getItem(nodeKeyFromNodeId(nodeId)));
	}

	function readLinkFromStorage(linkId) {
		return deserialize(localStorage.getItem(linkKeyFromNodeId(linkId)));
	}

	function throwIfInvalidNodeId(nodeId) {
		if (nodeId === undefined || nodeId === null || nodeId === 0)
			throw "Invalid node id";
	}

	function throwIfInvalidLinkId(linkId) {
		if (linkId === undefined || linkId === null || linkId === 0)
			throw "Invalid link id";
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