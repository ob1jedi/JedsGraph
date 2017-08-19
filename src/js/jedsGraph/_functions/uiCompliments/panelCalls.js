
function createNode() {
	var newNodeValue = document.getElementById('newNodeData').value;
	dataService.CreateNode(newNodeValue);
}

function getEntityNode() {
	var newNodeValue = document.getElementById('nodeLabel').value;
	dataService.GetNodesByLabel(newNodeValue);
}

function deleteNode() {
	dataService.DeleteNode(selectedNodeID);
}

function deleteLink() {
	if (!selectedLink) { return; }
	dataService.DeleteRelationship(selectedLink.data.id);
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
	dataService.CreateEntityReturnCallbackWithIds(entityName, properties);
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

	dataService.CreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly);
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
	dataService.UpdateEntity(nodeID, propList, callback);


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
	dataService.QuerySimpleSearch(entityName, fromProperty, fromValue, getConfigByPrefix(sourcePrefix));
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function panelAddKeyValue(panelId, panelScope, _sKey, _sValue, _sDatatype) {
	if (!_sKey) { _sKey = ''; }
	if (!_sValue) { _sValue = ''; }
	if (!_sDatatype) { _sDatatype = 'string'; }
	var $panel = document.getElementById(panelId);
	console.log(panelScope);
	var typehtml;

	var getTypeHtml = function (type) {
		switch (type) {
			case 'string':
				typehtml = 'abc';
				break;
			case 'number':
				typehtml = '123';
				break;
			case 'array':
				typehtml = '[A]';
				break;
			case 'other': //boolean
				typehtml = 'T/F';
				break;
		}
		return typehtml;
	}

	var addRow = function (index, key, value, dataType, currentHtml) {
		currentHtml += ("<tr><td><input id='" + panelScope + ".property.key." + index +
        "' class='dynamic' value='" + key +
        "'></input></td><td><input id='" + panelScope + ".property.value." + index +
        "' class='dynamic2' value='" + value +
        "'></input></td>" +
        "<td>" + '<button id="' + panelScope + '.property.type.' + index + '" value="' + dataType + '" class="paneloption mytooltip" onclick="panelCyclePropertyType(\'' + panelScope + '.property.type.' + index + '\')" >' + getTypeHtml(dataType) + '</button>' + "</td></tr>");
		return currentHtml;
	};

	var nextIndex = 0;
	var newHtml = '';
	for (var i = 0; i < $panel.children[0].children.length; i++) {
		var currval = document.getElementById(panelScope + '.property.value.' + i).value;
		var currkey = document.getElementById(panelScope + '.property.key.' + i).value;
		var dataType = document.getElementById(panelScope + '.property.type.' + i).value;
		newHtml = addRow(i, currkey, currval, dataType, newHtml);
		nextIndex = i + 1;
	}

	newHtml = addRow(nextIndex, _sKey, _sValue, _sDatatype, newHtml);
	$panel.children[0].innerHTML = newHtml;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function panelCyclePropertyType(panelId) {

	var elementButton = document.getElementById(panelId); //"new.entity.property.type." + propertyIndex);
	if (elementButton.value == 'string') {
		elementButton.innerHTML = '123';
		elementButton.value = 'number';
	}
	else if (elementButton.value == 'number') {
		elementButton.innerHTML = '[A]';
		elementButton.value = 'array';
	}
	else if (elementButton.value == 'array') {
		elementButton.innerHTML = 'T/F';
		elementButton.value = 'other';
	}
	else if (elementButton.value == 'other') {
		elementButton.innerHTML = 'abc';
		elementButton.value = 'string';
	}

}

function panelRemoveKeyValue(panelId) {
	var panel = document.getElementById(panelId);
	if (panel.children[0].children.length == 0) { return; }
	panel.children[0].children[panel.children[0].children.length - 1].remove();
}

function removeLastElement() {
	var ui = selectedNodeUI.children[selectedNodeUI.children.length - 1];
	selectedNode.data.UI.focusUI.remove();
}

