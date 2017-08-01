
//============ DATA QUERY ================================================================================================================================================================================================
function Neo4jExtractProperties(nodesResult) //extract properties from a collection of nodes, from a cypher node search
{
	var propertyList = [];
	for (var i = 0; i < nodesResult.results.length; i++){		
		var result = nodesResult.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			propertyList = propertyList.concat(new neoPropertyList(row[0]));
		}
	}
		
	return propertyList;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jExtractValues(nodesResult) //extract properties from a collection of nodes, from a cypher node search
{
	var valueList = [];
	for (var i = 0; i < nodesResult.results.length; i++){		
		var result = nodesResult.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			valueList.push(row[0]);
		}
	}
	return valueList;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jQbuilder_ClearValue(selectType)
{
	var scope = selectType.split('.');
	document.getElementById('qbuilder.' + scope[1] + '.value').value = '';
	//document.getElementById('qbuilder.'+scope[1]+'.selectvalue').innerHTML = '<option value=""></option>';
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jQuerySimpleSearch(fromEntity, whereProperty, equalsValue, _sourceConfig)
{
	var propertyBlock = (whereProperty)?'{'+whereProperty+':'+parseDataType(equalsValue)+'}':'';
		
	if (fromEntity && fromEntity != ''){fromEntity = ':' + fromEntity;}
	var command = 'MATCH (n' + fromEntity + propertyBlock + ') RETURN id(n), labels(n), n  LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		
	var callback = function(nodesResult, sourceConfig){
		addSingleNodesFromResults(nodesResult, sourceConfig)
		//Recurse...
		var command = 'MATCH (n' + fromEntity + propertyBlock + ')-[r]-(m) RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)  LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		var callback2 = function(nodesResult, sourceConfig){addNodesFromResults(nodesResult, sourceConfig)};
		Neo4j_Command([command], callback2, sourceConfig);
	};
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jFetchEntitiesForNode(nodeId, _sourceConfig)
{
	if (!nodeId) {nodeId = selectedNodeID;}
	var command = '';
	switch(viewOptions.navigateDirection){
	case 'child':
		command = 'MATCH (n)-[r]->(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		break;
	case 'parent':
		command = 'MATCH (n)<-[r]-(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		break;
	default:
		command = 'MATCH (n)-[r]-(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		break;
	}
	var whenResultsComeBackFunction = function(nodesResult, sourceConfig){
		var newNodes = addNodesFromResults(nodesResult, sourceConfig)
		//popout effect
		newNodes.forEach(function (newNode) {
			applyPopoutEffectToNode(newNode, nodeId)
		});
			
	};

	applyWaitingAffectToNode(nodeId);
	Neo4j_Command([command], whenResultsComeBackFunction, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function applyPopoutEffectToNode(newNode, parentNodeId) {
	layout.pinNode(newNode, true);
	var pos = layout.getNodePosition(parentNodeId);
	layout.setNodePosition(newNode.id, getRandomArbitrary(pos.x - newNode.data.nodeSize / 2, pos.x + newNode.data.nodeSize / 2), getRandomArbitrary(pos.y - newNode.data.nodeSize / 2, pos.y + newNode.data.nodeSize / 2));
	layout.pinNode(newNode, false);
}

function applyWaitingAffectToNode(nodeId) {
	
}
function removeWaitingAffectFromNode(nodeId) {

}


function Neo4jGetRelationCounts(nodeId, callback, _sourceConfig)
{
	command = 'MATCH (n)-[r]->(m) where id(n) = '+getNeoId(nodeId)+' RETURN count(n) UNION MATCH (n)<-[r]-(m) where id(n) = '+getNeoId(nodeId)+ ' RETURN count(n)'
		
	var callback2 = function(nodesResults, sourceConfig){
		for (var i = 0; i < nodesResults.results.length; i++){	
				var result = nodesResults.results[i];
				var fromLinksCount = (result.data[0])? result.data[0].row[0]: 0; 
				var toLinksCount = (result.data[1])? result.data[1].row[0]: 0;
				callback(fromLinksCount, toLinksCount, sourceConfig);
		}	
	};
	Neo4j_Command([command], callback2, _sourceConfig);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetNodeById(nodeid, _sourceConfig)
{
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodesFromResults(nodesResult, sourceConfig);
	}
		
	var command = 'MATCH (n) WHERE ID(n) = '+getNeoId(nodeid)+'  RETURN id(n), labels(n), (n)';
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix)
{
	var _sourceConfig = getConfigByPrefix(sourceConfigPrefix)
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodesFromResults(nodesResult, sourceConfig);
	}
	var matchPattern = 'n';
	if (byLabel && byLabel != '') {matchPattern += ":" + byLabel;}
	var command = 'MATCH (' + matchPattern + ') RETURN id(n), labels(n), (n) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetNodesByDetails(label, properties, _sourceConfig)
{
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodesFromResults(nodesResult, sourceConfig);
	}
	var matchPattern = 'n';
	if (label) {matchPattern += ":" + label;}
	var command = 'MATCH ('+matchPattern+')';
	if (properties){
		if (properties.length > 0)
		{
			var conditions;
			properties.forEach(function (prop) {
				if (conditions) {conditions += ' AND'} else {conditions = ''}
				conditions += ' n.' + prop.key + '=' + parseDataType(prop.value);
			});
			command += ' WHERE' + conditions;
		}
	}
	command += ' RETURN id(n), labels(n), (n) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jInitAllNodes(_sourceConfig)
{
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodesFromResults(nodesResult, sourceConfig);
		Neo4jInitAllRelations(_sourceConfig);
	}
	var command = 'MATCH (n) RETURN id(n), labels(n), (n) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jInitAllRelations(_sourceConfig)
{
	var callback = function (relationsResult, sourceConfig) {
		addSingleRelationFromResults(relationsResult, sourceConfig);
	}
	var command = 'MATCH (n)-[r]->(m) RETURN id(n), id(m), id(r), type(r), r LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jFetchRelation(fromNodeID, toNodeID, _sourceConfig)
{
	command = 'MATCH (n)-[r]-(m) WHERE ID(n) = ' + getNeoId(fromNodeID) + ' and ID(m) = '+getNeoId(toNodeID)+' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)';
	var callback2 = function(nodesResult, sourceConfig){
		addNodesFromResults(nodesResult, sourceConfig)
	};
	Neo4j_Command([command], callback2, _sourceConfig);
		
}



//============ DATA CREATE/UPDATE/DELETE ================================================================================================================================================================================================

function Neo4jCreateEntity() {
	var _sourceConfig = currentTheme.sourceConfig;
	var entityName = document.getElementById('new.entity.name').value;
	if (!entityName || entityName == '') { alert('Save failed!\nNo entity name specified.'); return; }
	var propIndex = 0;
	var propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	var propList = '';

	while (propertyElement) {
	    var propertyTypeElement = document.getElementById('new.entity.property.type.' + propIndex);
	    var propertyValueElement = document.getElementById('new.entity.property.value.' + propIndex);
	    if (!propertyValueElement || propertyValueElement.value == '') { alert('Save failed!\nInvalid property name.'); return; }
	    if (propList != '') { propList += ',' }
	    propList += propertyElement.value + ':' + parseDataType(propertyValueElement.value, propertyTypeElement.value);
	    propIndex++;
	    propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	}
	if (propList != '') { propList = '{' + propList + '}'; }

	var callback = function (nodesResult, sourceConfig) {
	    addSingleNodesFromResults(nodesResult, sourceConfig);
	};
	var command = 'CREATE (n:' + entityName + propList + ') return id(n), labels(n), n'
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function Neo4jUpdateEntity(nodeID) {
	if (!nodeID) { nodeID = selectedNodeID; }
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

	var callback = function (nodesResult, sourceConfig) {

	    addSingleNodesFromResults(nodesResult, sourceConfig);
	    UiShow_EditEntity(selectedNode);
	};
	var command = 'MATCH (n) WHERE ID(n)=' + getNeoId(nodeID) + propList + ' return id(n), labels(n), n'
	Neo4j_Command([command], callback, _sourceConfig);

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

function panelRemoveKeyValue(panelId) {
	var panel = document.getElementById(panelId);
	if (panel.children[0].children.length == 0) { return; }
	panel.children[0].children[panel.children[0].children.length - 1].remove();
}

function removeLastElement() {
	var ui = selectedNodeUI.children[selectedNodeUI.children.length - 1];
	selectedNode.data.UI.focusUI.remove();
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCreateRelation(nodeID1, nodeID2, planOnly, _sourceConfig) {
	var node1 = GRAPH.getNode(nodeID1);
	var node2 = GRAPH.getNode(nodeID2);
	if (node1.data.sourceConfig.prefix != node2.data.sourceConfig.prefix) {
	    alert('Save failed!\nYou cannot relate nodes from different sources.'); return;
	}
	var relationName = document.getElementById('new.relation.name').value;
	if (!relationName || relationName == '') { alert('Save failed!\nNo relation name specified.'); return; }
	var propIndex = 0;
	var propertyElement = document.getElementById('new.relation.property.key.' + propIndex);
	var propList = '';

	while (propertyElement) {
	    var propertyValueElement = document.getElementById('new.relation.property.value.' + propIndex);
	    if (!propertyValueElement || propertyValueElement.value == '') { alert('Save failed!\nInvalid property name.'); return; }
	    if (propList != '') { propList += ',' }
	    propList += propertyElement.value + ':' + parseDataType(propertyValueElement.value);
	    propIndex++;
	    propertyElement = document.getElementById('new.relation.property.key.' + propIndex);
	}
	if (propList != '') { propList = '{' + propList + '}'; }

	if (!planOnly) {
	    var callback = function (nodesResult, sourceConfig) {
	        Neo4jFetchRelation(nodeID1, nodeID2, sourceConfig);
	    }
	    var command = 'MATCH (n) WHERE ID(n) = ' + getNeoId(nodeID1) + ' MATCH (m) WHERE ID(m) = ' + getNeoId(nodeID2) + ' CREATE (n)-[r:' + relationName + propList + ']->(m) RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)'
	    Neo4j_Command([command], callback, _sourceConfig);
	}
	else {
	    addPlannedLink(nodeID1, nodeID2, relationName, propList)
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCreateNode(labelName, _sourceConfig) {
	var callback = function (nodesResult, sourceConfig) {
	    addSingleNodesFromResults(nodesResult, sourceConfig);
	}
	var command = 'CREATE (n:' + labelName + ') RETURN id(n), labels(n), n';
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jDeleteNode(nodeID, _sourceConfig) {
	var callback = function (nodesResult, sourceConfig) {

	    removeNodeFromStage(nodeID)
	}
	var command = 'MATCH (n) where ID(n) = ' + getNeoId(nodeID) + ' DETACH DELETE (n) RETURN ID(n)';
	Neo4j_Command([command], callback, _sourceConfig);


}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jDeleteRelationship(relationshipID, _sourceConfig) {
	var callback = function (nodesResult, sourceConfig) {

	    removeLinkFromStage(relationshipID)
	}
	var command = 'MATCH (n)-[r]->(m) where ID(r) = ' + getNeoId(relationshipID) + ' DELETE (r) RETURN ID(r)';
	Neo4j_Command([command], callback, _sourceConfig);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function Neo4jDeleteLabel(nodeId, labelName, _sourceConfig) {
	var command = "MATCH (n) where ID(n) = " + getNeoId(nodeId) + " REMOVE n:" + labelName;
	var callback = function (results, sourceConfig) {
	    Neo4jGetNodeById(selectedNodeID, sourceConfig)
	};
	Neo4j_Command([command], callback, _sourceConfig, callback);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jAddProperty(nodeId, _sourceConfig) {
	if (!nodeId) { nodeId = selectedNodeID }
	var elePropKey = document.getElementById('add.property.key').value;
	var elePropVal = document.getElementById('add.property.value').value;
	var elePropType = document.getElementById('add.property.type').value;
	if (!elePropType) { elePropType = "string"; }
	if (elePropType == "string") { elePropVal = '"' + elePropVal + '"' }
	var command = "MATCH (n) where ID(n) = " + getNeoId(nodeId) + " SET n +={" + elePropKey + ":" + elePropVal + "}";

	var callback = function (results, sourceConfig) {
	    Neo4jGetNodeById(selectedNodeID, sourceConfig);
	};
	Neo4j_Command([command], callback, _sourceConfig, callback);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jAddLabel(_sourceConfig) {
	var processingElement = document.getElementById('log');
	//node.data.labels.push(processingElement.value);
	if (!processingElement) return;
	if (!processingElement.value) return;

	var callback = function (results, sourceConfig) {
	    Neo4jGetNodeById(selectedNodeID, sourceConfig);
	};

	var command = "MATCH (n) where ID(n) = " + getNeoId(selectedNodeID) + " SET n:" + processingElement.value;
	Neo4j_Command([command], callback, _sourceConfig, callback);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetAllLabels(_sourceConfig) {
	//var command = "match (n) return distinct labels(n)";
	var callback = function (data, sourceConfig) {
	    data.results[0].data.forEach(function (dataobject) {
	        addDataLabel(dataobject.row[0][0], dataobject.row[1], sourceConfig);
	    });
	    refreshLabelSelectors();
	};

	var command = "match (n) return labels(n), count(labels(n))";
	Neo4j_Command([command], callback, _sourceConfig);
}

