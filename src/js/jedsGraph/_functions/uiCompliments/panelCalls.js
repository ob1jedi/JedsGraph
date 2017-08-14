
function createNode() {
	var newNodeValue = document.getElementById('newNodeData').value;
	Neo4jCreateNode(newNodeValue);
}

function getEntityNode() {
	var newNodeValue = document.getElementById('nodeLabel').value;
	Neo4jGetNodesByLabel(newNodeValue);
}

function deleteNode() {
	Neo4jDeleteNode(selectedNodeID);
}

function deleteLink() {
	if (!selectedLink) { return; }
	Neo4jDeleteRelationship(selectedLink.data.id);
}

function submitNewEntity() {
	var entityName = document.getElementById('new.entity.name').value;
	if (!entityName || entityName == '') {
		alert('Save failed!\nNo entity name specified.'); return;
	}
	var propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	var properties = [];
	var propIndex = 0;
	while (propertyElement) {
		var propertyTypeElement = document.getElementById('new.entity.property.type.' + propIndex);
		var propertyValueElement = document.getElementById('new.entity.property.value.' + propIndex);
		if (!propertyValueElement || propertyValueElement.value == '') {
			alert('Save failed!\nInvalid property name.'); return;
		}
		var propertyKey = propertyElement.value;
		var propertyValue = parseDataType(propertyValueElement.value, propertyTypeElement.value);
		properties.push(new propertyType(propertyKey, propertyValue));

		propIndex++;
		propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	}
	Neo4jCreateEntityReturnCallbackWithIds(entityName, properties);
}

function submitCreateRelation(nodeID1, nodeID2, planOnly, _sourceConfig) {
	var node1 = GRAPH.getNode(nodeID1);
	var node2 = GRAPH.getNode(nodeID2);
	if (node1.data.sourceConfig.prefix != node2.data.sourceConfig.prefix) {
		alert('Save failed!\nYou cannot relate nodes from different sources.'); return;
	}
	var relationName = document.getElementById('new.relation.name').value;
	if (!relationName || relationName == '') {
		alert('Save failed!\nNo relation name specified.'); return;
	}
	var propIndex = 0;
	var propertyElement = document.getElementById('new.relation.property.key.' + propIndex);
	var propList = '';

	while (propertyElement) {
		var propertyValueElement = document.getElementById('new.relation.property.value.' + propIndex);
		if (!propertyValueElement || propertyValueElement.value == '') {
			alert('Save failed!\nInvalid property name.'); return;
		}
		if (propList != '') { propList += ',' }
		propList += propertyElement.value + ':' + parseDataType(propertyValueElement.value);
		propIndex++;
		propertyElement = document.getElementById('new.relation.property.key.' + propIndex);
	}
	if (propList != '') { propList = '{' + propList + '}'; }

	Neo4jCreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly);
}

function submitUpdateEntity() {
	if (!nodeID) {
		nodeID = selectedNodeID;
	}
	var node = GRAPH.getNode(nodeID);
	var _sourceConfig = node.data.sourceConfig;
	var entityName = document.getElementById('new.entity.name').value;
	if (!entityName || entityName == '') { alert('Save failed!\nNo entity name specified.'); return; }
	var propIndex = 0;
	var propList = '';

	var propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	while (propertyElement) {
		var propertyValueElement = document.getElementById('new.entity.property.value.' + propIndex);
		var propertyTypeElement = document.getElementById('new.entity.property.type.' + propIndex);
		if (propList != '') { propList += ',' }
		if (!propertyValueElement || propertyValueElement.value == 'null') {
			propList += ' n.' + propertyElement.value + '=null';
		}
		else {
			propList += ' n.' + propertyElement.value + '=' + parseDataType(propertyValueElement.value, propertyTypeElement.value);
		}

		propIndex++;
		propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	}
	if (propList != '') { propList = ' SET ' + propList + ''; }

	var callback = function() {
		UiShow_EditEntity(node);
	}
	Neo4jUpdateEntity(nodeID, propList, callback);


}

function relateSelectedToNode() {
	bRelate = true;
}

function planRelateSelectedToNode() {
	bPlanRelate = true;
}

function fontGrow() {
	if (!selectedNode.data.UI.displayTextUI) { return; }
	var fontsize = Number(selectedNode.data.UI.displayTextUI.attr('font-size'));
	selectedNode.data.UI.displayTextUI.attr('font-size', fontsize + 1);
}
function fontShrink() {
	if (!selectedNode.data.UI.displayTextUI) { return; }
	var fontsize = Number(selectedNode.data.UI.displayTextUI.attr('font-size'));
	selectedNode.data.UI.displayTextUI.attr('font-size', fontsize - 1);
}
function fontDown() {
	if (!selectedNode.data.UI.displayTextUI) { return; }
	var fontsize = Number(selectedNode.data.UI.displayTextUI.attr('y'));
	selectedNode.data.UI.displayTextUI.attr('y', fontsize + 1);
}
function fontUp() {
	if (!selectedNode.data.UI.displayTextUI) { return; }
	var fontsize = Number(selectedNode.data.UI.displayTextUI.attr('y'));
	selectedNode.data.UI.displayTextUI.attr('y', fontsize - 1);
}


function updateViewOptions() {
	viewOptions.highlightRelated = document.getElementById('vo.hr').checked;
	viewOptions.highlightAncestors = document.getElementById('vo.ha').checked;
	viewOptions.highlightdescendants = document.getElementById('vo.hd').checked;
}

function updateDragOptions() {
	if (document.getElementById('do.flat').checked) { viewOptions.screenDragType = 'flat' };
	if (document.getElementById('do.depth').checked) { viewOptions.screenDragType = 'depth' };
}
function updateViewOptions_Nav(navoption) {
	viewOptions.navigateDirection = navoption;
}

function updateInteractionOptions() {
	interactionOptions.checkNodes = document.getElementById('vo.ch').checked;
}

function unPinSelectedNode() {
	unPinNode(selectedNode);
}

function ButtonSimpleSearch() {
	//var fromEntity = document.getElementById('qbuilder.from.entity').value;
	var selectedEntityValue = document.getElementById('qbuilder.from.entity').value;
	var sourcePrefix = selectedEntityValue.substring(selectedEntityValue.length - 3);
	var entityName = selectedEntityValue.substring(0, selectedEntityValue.length - 3);

	var fromProperty = document.getElementById('qbuilder.from.property').value;
	var fromValue = document.getElementById('qbuilder.from.value').value;
	Neo4jQuerySimpleSearch(entityName, fromProperty, fromValue, getConfigByPrefix(sourcePrefix));
}


