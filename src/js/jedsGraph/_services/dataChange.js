

//============ DATA CREATE/UPDATE/DELETE ================================================================================================================================================================================================

	function Neo4jCreateEntity()
	{
		var _sourceConfig = currentTheme.sourceConfig;
		var entityName = document.getElementById('new.entity.name').value;
		if (!entityName || entityName == ''){alert('Save failed!\nNo entity name specified.'); return;}
		var propIndex = 0;
		var propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
		var propList = '';
		
		while (propertyElement)
		{
			var propertyValueElement = document.getElementById('new.entity.property.value.' + propIndex);
			if (!propertyValueElement || propertyValueElement.value == '') {alert('Save failed!\nInvalid property name.'); return;}
			if (propList != '') {propList += ','}
			propList += propertyElement.value + ':' + parseDataType(propertyValueElement.value);
			propIndex++;
			propertyElement = document.getElementById('new.entity.property.key.' + propIndex);	
		}
		if (propList != '') {propList = '{' + propList + '}';}

		var callback = function(nodesResult, sourceConfig){
			addSingleNodesFromResults(nodesResult, sourceConfig);
		};
		var command = 'CREATE (n:' + entityName + propList + ') return id(n), labels(n), n'
		Neo4j_Command([command], callback, _sourceConfig);
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	function Neo4jUpdateEntity(nodeID)
	{
		if (!nodeID){nodeID = selectedNodeID;}
		var node = GRAPH.getNode(nodeID);
		var _sourceConfig = node.data.sourceConfig;
		var entityName = document.getElementById('new.entity.name').value;
		if (!entityName || entityName == ''){alert('Save failed!\nNo entity name specified.'); return;}
		var propIndex = 0;
		var propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
		var propList = '';
		
		while (propertyElement)
		{
			var propertyValueElement = document.getElementById('new.entity.property.value.' + propIndex);
			if (propList != '') {propList += ','}
			if (!propertyValueElement || propertyValueElement.value == '') {
			    propList += ' n.' + propertyElement.value + '=null';
			}
			else {
			    propList += ' n.' + propertyElement.value + '=' + parseDataType(propertyValueElement.value);
			}

			propIndex++;
			propertyElement = document.getElementById('new.entity.property.key.' + propIndex);	
		}
		if (propList != '') {propList = ' SET ' + propList + '';}

		var callback = function(nodesResult, sourceConfig){

		    addSingleNodesFromResults(nodesResult, sourceConfig);
		    UiShow_EditEntity(selectedNode);
		};
		var command = 'MATCH (n) WHERE ID(n)=' + getNeoId(nodeID) + propList + ' return id(n), labels(n), n'
		Neo4j_Command([command], callback, _sourceConfig);
		
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jCreateRelation(nodeID1, nodeID2, planOnly, _sourceConfig)
	{
		var node1 = GRAPH.getNode(nodeID1);
		var node2 = GRAPH.getNode(nodeID2);
		if (node1.data.sourceConfig.prefix != node2.data.sourceConfig.prefix){
			alert('Save failed!\nYou cannot relate nodes from different sources.'); return;
		} 
		var relationName = document.getElementById('new.relation.name').value;
		if (!relationName || relationName == ''){alert('Save failed!\nNo relation name specified.'); return;}
		var propIndex = 0;
		var propertyElement = document.getElementById('new.relation.property.key.' + propIndex);
		var propList = '';

		while (propertyElement)
		{
			var propertyValueElement = document.getElementById('new.relation.property.value.' + propIndex);
			if (!propertyValueElement || propertyValueElement.value == '') {alert('Save failed!\nInvalid property name.'); return;}
			if (propList != '') {propList += ','}
			propList += propertyElement.value + ':' + parseDataType(propertyValueElement.value);
			propIndex++;
			propertyElement = document.getElementById('new.relation.property.key.' + propIndex);	
		}
		if (propList != '') {propList = '{' + propList + '}';}

		if (!planOnly){
			var callback = function(nodesResult, sourceConfig){
				Neo4jFetchRelation(nodeID1, nodeID2, sourceConfig);
			}
			var command = 'MATCH (n) WHERE ID(n) = ' + getNeoId(nodeID1) + ' MATCH (m) WHERE ID(m) = '+ getNeoId(nodeID2) + ' CREATE (n)-[r:'+ relationName + propList +']->(m) RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)'
			Neo4j_Command([command], callback, _sourceConfig);
		}
		else{
			addPlannedLink(nodeID1, nodeID2, relationName, propList)
		}
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jCreateNode(labelName, _sourceConfig)
	{
		var callback = function (nodesResult, sourceConfig) {
			addSingleNodesFromResults(nodesResult, sourceConfig);
		}
		var command = 'CREATE (n:' + labelName + ') RETURN id(n), labels(n), n';
		Neo4j_Command([command], callback, _sourceConfig);
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jDeleteNode(nodeID, _sourceConfig)
	{
		var callback = function (nodesResult, sourceConfig) {
			//addSingleNodesFromResults(nodesResult);
			removeNodeFromStage(nodeID)
		}
		var command = 'MATCH (n) where ID(n) = '+ getNeoId(nodeID) +' DETACH DELETE (n) RETURN ID(n)';
		Neo4j_Command([command], callback, _sourceConfig);
		
		
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			
	function Neo4jDeleteLabel(nodeId, labelName, _sourceConfig)
	{
		var command = "MATCH (n) where ID(n) = " + getNeoId(nodeId) + " REMOVE n:" + labelName;
		var callback = function(results, sourceConfig){
			Neo4jGetNodeById(selectedNodeID, sourceConfig)
		};
		Neo4j_Command([command], callback, _sourceConfig, callback);
	}	
	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jAddProperty(nodeId, _sourceConfig)
	{
		if (!nodeId) {nodeId=selectedNodeID}
		var elePropKey = document.getElementById('add.property.key').value;
		var elePropVal = document.getElementById('add.property.value').value;
		var elePropType = document.getElementById('add.property.type').value;
		if (!elePropType) {elePropType ="string";}
		if (elePropType == "string"){elePropVal = '"' + elePropVal + '"'}
		var command = "MATCH (n) where ID(n) = " + getNeoId(nodeId) + " SET n +={" + elePropKey + ":" + elePropVal + "}";
		
		var callback = function(results, sourceConfig){
			Neo4jGetNodeById(selectedNodeID, sourceConfig);
		};
		Neo4j_Command([command], callback, _sourceConfig, callback);
	}	
	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jAddLabel(_sourceConfig)
	{
		var processingElement = document.getElementById('log');
		//node.data.labels.push(processingElement.value);
		if(!processingElement) return;
		if(!processingElement.value) return;
		
		var callback = function(results, sourceConfig){
			Neo4jGetNodeById(selectedNodeID, sourceConfig);
		};
		
		var command = "MATCH (n) where ID(n) = " + getNeoId(selectedNodeID) + " SET n:" + processingElement.value;
		Neo4j_Command([command], callback, _sourceConfig, callback );
	}
	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jGetAllLabels(_sourceConfig)
	{
		//var command = "match (n) return distinct labels(n)";
		var callback = function(data, sourceConfig){
			data.results[0].data.forEach(function (dataobject){
				addDataLabel(dataobject.row[0][0], dataobject.row[1], sourceConfig);
			});
			refreshLabelSelectors();
		};
		
		var command = "match (n) return labels(n), count(labels(n))";
		Neo4j_Command([command], callback, _sourceConfig);
	}		
	
	