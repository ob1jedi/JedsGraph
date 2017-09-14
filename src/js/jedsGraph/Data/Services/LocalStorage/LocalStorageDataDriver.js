
var LocalStorageDataDriver = function () {

	//----PUBLIC----------------------------------------------------------
	this.createNodeInDatabasePopulateAndReturnId = function (node) {
		node = sanitizeNode(node);
		node.id = this.getNextNewNodeId();
		writeNodeToStorage(node);
		return node.id;
	}

	this.getRelatedNodes = function (nodeId) {
		var node = this.getNodeFromDatabase(nodeId);
		var nodeLinks = node.links;
		var dataDriver = this;
		var relatedNodeIds = [];
		nodeLinks.forEach(function (linkId) {
			var link = dataDriver.getLinkFromDatabase(linkId);
			if (nodeId == link.fromNodeId)
				relatedNodeIds.push(link.toNodeId);
			else
				relatedNodeIds.push(link.fromNodeId);
		});

		return relatedNodeIds;
	}

	this.getRelatedNodesGraph = function (nodeId) {
		var node = this.getNodeFromDatabase(nodeId);
		var dataDriver = this;
		return node.links.map(function (linkId) { return dataDriver.getGraphOfLink(linkId) });
	}

	this.getGraphOfLink = function (linkId) {
		var link = this.getLinkFromDatabase(linkId);
		var graphElement = new GraphElement();
		console.log('link', linkId);
		graphElement.fromNode = this.getNodeFromDatabase(link.fromNodeId);
		graphElement.toNode = this.getNodeFromDatabase(link.toNodeId);
		graphElement.link = link;
		return graphElement;
	}

	this.createRelationshipPopulateAndReturnId = function (fromNodeId, toNodeId, link) {
		link = sanitizeLink(link);
		link.id = this.getNextNewLinkId();
		link.fromNodeId = fromNodeId;
		link.toNodeId = toNodeId;

		console.log('fromNodeId', fromNodeId);
		console.log('toNodeId', toNodeId);
		console.log('link', link);
		var fromNode = this.getNodeFromDatabase(fromNodeId);
		console.log('fromNode', fromNode);
		fromNode.links.push(link.id);
		writeNodeToStorage(fromNode);

		var toNode = this.getNodeFromDatabase(toNodeId);
		toNode.links.push(link.id);
		writeNodeToStorage(toNode);

		writeLinkToStorage(link);
		return link.id;
	}

	this.getNodeFromDatabase = function (nodeId) {
		throwIfInvalidNodeId(nodeId);
		var node = readNodeFromStorage(nodeId);
		return node;
	}

	this.getLinkFromDatabase = function (linkId) {
		throwIfInvalidLinkId(linkId);
		var link = readLinkFromStorage(linkId);
		return link;
	}

	this.deleteNode = function(nodeId)
	{
		localStorage.removeItem(nodeKeyFromNodeId(nodeId));
	}

	this.getNodeByLabel = function(label)
	{
		throw("not yet implemented");
	}

	this.nodeExists = function(nodeId)
	{
		var node = readNodeFromStorage(nodeId);
		return node !== null;
	}

	this.getNextNewNodeId = function () {
		var nextId = localStorage.getItem('NEXT_NODE_ID');
		if (nextId === null) {
			localStorage.setItem('NEXT_NODE_ID', 1);
			return 1;
		}
		localStorage.setItem('NEXT_NODE_ID', Number(nextId) + 1);
		return nextId;
	}

	this.getNextNewLinkId = function () {
		var nextId = localStorage.getItem('NEXT_LINK_ID');
		if (nextId === null) {
			localStorage.setItem('NEXT_LINK_ID', 1);
			return 1;
		}
		localStorage.setItem('NEXT_LINK_ID', Number(nextId) + 1);
		return nextId;
	}

	this.getNodesByLabel = function(labelName){
		var indexedData = localStorage.getItem('INDEX_ON_NODE_LABELS');
		var dataStringHelper = new DataStringHelper();
		var nodeIdList = dataStringHelper.getDataFromDataString(indexedData, labelName);
		console.log('nodeIdList', nodeIdList);
		var nodeIdArray = nodeIdList.split(',');
		var nodeArray = [];
		var dataDriver = this;
		nodeIdArray.forEach(function(nodeId){
			nodeArray.push(dataDriver.getNodeFromDatabase(nodeId));
		});
		return nodeArray;
	}

	this.getAllNodeLabels = function () {
		var nodeIndex = localStorage.getItem('INDEX_ON_NODE_LABELS');
		return getAllLabelsFromIndex(nodeIndex);
	}

	this.getAllLinkLabels = function () {
		var linkIndex = localStorage.getItem('INDEX_ON_LINK_LABELS');
		return getAllLabelsFromIndex(linkIndex);
	}

	this.getAllLinkLabelInfos = function () {
		var linkIndex = localStorage.getItem('INDEX_ON_LINK_LABELS');
		return getAllLabelsFromIndex(linkIndex);
	}

	this.getAllNodeLabelsAndNodeIds = function () {
		return getAllLabelsAndIdsForIndex('INDEX_ON_NODE_LABELS');
	}

	this.getAllLinkLabelsAndLinkIds = function () {
		return getAllLabelsAndIdsForIndex('INDEX_ON_LINK_LABELS');
	}
	//---- PRIVATE ----------------------------------------------------------

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
		updateNodeLabelsIndex(node);
	}

	function updateNodeLabelsIndex(node) {
		node.labels.forEach(function (label) {
			updateIndex("INDEX_ON_NODE_LABELS", label, node.id);
		});
	}

	function updateIndex(indexName, elementName, data) {
		var index = localStorage.getItem(indexName);
		var dataStringHelper = new DataStringHelper();
		if (index === null)
			index = dataStringHelper.getNewDataString();
		index = dataStringHelper.ensureDataIntoElement(index, elementName, data)
		localStorage.setItem(indexName, index);
	}

	function writeLinkToStorage(link) {
		localStorage.setItem(linkKeyFromNodeId(link.id), serialize(link));
		updateLinkLabelsIndex(link);
	}

	function updateLinkLabelsIndex(link) {
		link.labels.forEach(function (label) {
			updateIndex("INDEX_ON_LINK_LABELS", label, link.id);
		});
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