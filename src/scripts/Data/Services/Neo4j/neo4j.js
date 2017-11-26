
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
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig)
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
	if (!nodeId) {nodeId = globals.selectedNodeID;}
	var command = '';
	switch(globals.viewOptions.navigateDirection){
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

	Neo4j_Command([command], whenResultsComeBackFunction, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



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
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
	}
		
	var command = 'MATCH (n) WHERE ID(n) = '+getNeoId(nodeid)+'  RETURN id(n), labels(n), (n)';
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix)
{
	var _sourceConfig = getConfigByPrefix(sourceConfigPrefix)
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
	}
	var matchPattern = 'n';
	if (byLabel && byLabel != '') {matchPattern += ":" + byLabel;}
	var command = 'MATCH (' + matchPattern + ') RETURN id(n), labels(n), (n) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetEntitiesByDetails(nodeLabel, properties, _sourceConfig)
{
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
	}
	var matchPattern = 'n';
	if (nodeLabel) { matchPattern += ":" + nodeLabel; }
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
function Neo4jGetAllEntities(_sourceConfig)
{
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
		globals.dataService.GetAllRelations(_sourceConfig);
	}
	var command = 'MATCH (n) RETURN id(n), labels(n), (n) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetAllRelations(_sourceConfig)
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


function Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback) {
	var _sourceConfig = globals.currentTheme.sourceConfig;
	var callback = function (nodesResult, sourceConfig) {
		var ids = addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
		//globals.layout.setNodePosition(ids[0], 0, 0);
		if (inputCallback)
			inputCallback(ids);
	};
	var command = 'CREATE (n:' + entityName + _convertPropertyListToNeo4jString(propList) + ') return id(n), labels(n), n'
	console.log('command', command);
	return Neo4j_Command([command], callback, _sourceConfig);
}
function _convertPropertyListToNeo4jString(propList)
{
	var propsString = '';
	if (propList.length > 0) propsString += '{';
	for (var p = 0; p < propList.length; p++){
		if (p > 0) propsString += ',';
		propsString += propList[p].key + ':' ;
		if (propList[p].datatype == "number" || "boolean")
			propsString += propList[p].value;
		else
			propsString += '"' + propList[p].value + '"';
	}
	if (propList.length > 0) propsString += '}';
	return propsString;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function Neo4jUpdateEntity(nodeID, newProperties, callback) {
	
	var _sourceConfig = globals.currentTheme.sourceConfig;
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
		if (inputCallback)
			inputCallback(ids);
	};
	var command = 'MATCH (n) WHERE ID(n)=' + getNeoId(nodeID) + newProperties + ' return id(n), labels(n), n'
	Neo4j_Command([command], callback, _sourceConfig);
}



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly) {


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
	    addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
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
	    Neo4jGetNodeById(globals.selectedNodeID, sourceConfig)
	};
	Neo4j_Command([command], callback, _sourceConfig, callback);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jAddProperty(nodeId, _sourceConfig) {
	if (!nodeId) { nodeId = globals.selectedNodeID }
	var elePropKey = document.getElementById('add.property.key').value;
	var elePropVal = document.getElementById('add.property.value').value;
	var elePropType = document.getElementById('add.property.type').value;
	if (!elePropType) { elePropType = "string"; }
	if (elePropType == "string") { elePropVal = '"' + elePropVal + '"' }
	var command = "MATCH (n) where ID(n) = " + getNeoId(nodeId) + " SET n +={" + elePropKey + ":" + elePropVal + "}";

	var callback = function (results, sourceConfig) {
	    Neo4jGetNodeById(globals.selectedNodeID, sourceConfig);
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
	    Neo4jGetNodeById(globals.selectedNodeID, sourceConfig);
	};

	var command = "MATCH (n) where ID(n) = " + getNeoId(globals.selectedNodeID) + " SET n:" + processingElement.value;
	Neo4j_Command([command], callback, _sourceConfig, callback);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetAllLabels(_sourceConfig) {
	var callback = function (data, sourceConfig) {
	    data.results[0].data.forEach(function (dataobject) {
			// Outdated... "sourceConfig" no longer being used...
	    	//addEntityLabel(dataobject.row[0][0], dataobject.row[1], sourceConfig);
	    });
	    refreshEntitySelectors();
	};

	var command = "match (n) return labels(n), count(labels(n))";
	Neo4j_Command([command], callback, _sourceConfig);
}

