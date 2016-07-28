
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
	function Neo4jQbuilder(selectType, _sourceConfig)
	{
		var scope = selectType.split('.'); //...scope[0] = "qbuilder", scope[1] = "from"/"to", scope[2] = "entity"/"property"/"value"
		var selectedEntityValue = document.getElementById('qbuilder.' + scope[1] + '.entity').value;
		var sourcePrefix = selectedEntityValue.substring(selectedEntityValue.length-3);
		var entityName = ':' + selectedEntityValue.substring(0, selectedEntityValue.length-3);
		//if (entityName && entityName != ''){entityName = ':' +entityName;} 
		
		if (scope[2] == 'entity'){
			//get properties...
			document.getElementById('qbuilder.' + scope[1] + '.value').value = '';
			var childElementName = 'qbuilder.'+scope[1]+'.property';
			var propertyElement = document.getElementById(childElementName);
			propertyElement.innerHTML = '<option value=""></option>';
			//document.getElementById('qbuilder.'+scope[1]+'.value').innerHTML = '';
			document.getElementById('qbuilder.'+scope[1]+'.selectvalue').innerHTML = '<option value=""></option>';
			
			//var selectedEntityValue = document.getElementById(selectType).value;
			//var sourcePrefix = selectedEntityValue.substring(selectedEntityValue.length-3);
			//var entityName = selectedEntityValue.substring(0, selectedEntityValue.length-3);
		
			
			var command = "MATCH (n"+ entityName + ") return n";
			var listedProperties = [];
			var callback = function(nodesResult, sourceConfig){
				var propertyList = Neo4jExtractProperties(nodesResult)
				propertyList.sort(sort_by('key', false, function(a){return a.toUpperCase()})).forEach(function(prop){
					if (listedProperties.indexOf(prop.key) == -1) {
						listedProperties.push(prop.key);
						propertyElement.innerHTML += '<option value="'+prop.key+'">' + prop.key + '</option>';
					}
				});
			};
			Neo4j_Command([command], callback, getConfigByPrefix(sourcePrefix));
		}
		if (scope[2] == 'property'){
			var valueElementName = 'qbuilder.' + scope[1] + '.selectvalue';
			document.getElementById('qbuilder.' + scope[1] + '.value').value = '';
			//var selectedEntity = document.getElementById('qbuilder.'+scope[1]+'.entity').value;
			var selectedProperty = document.getElementById('qbuilder.'+scope[1]+'.property').value;
			//valueElementName.innerHTML = '<option value=""></option>';
			var listedValues = [];
			if (!selectedProperty){ return;}
			var command = "MATCH (n"+entityName+") return distinct n." + selectedProperty;
			var callback = function(nodesResult, sourceConfig){
				var valueList = Neo4jExtractValues(nodesResult)
				var valueElement = document.getElementById(valueElementName);
				valueElement.innerHTML = '<option value=""></option>';	
				valueList.sort().forEach(function(prop){
					if (listedValues.indexOf(prop) == -1){ 
						listedValues.push(prop)
						valueElement.innerHTML += '<option value="'+prop+'">' + prop + '</option>';
					}
				});
			};
			Neo4j_Command([command], callback, getConfigByPrefix(sourcePrefix));
		}
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jQuerySimpleSearch(fromEntity, whereProperty, equalsValue, _sourceConfig)
	{
		var propertyBlock = (whereProperty)?'{'+whereProperty+':'+parseDataType(equalsValue)+'}':'';
		
		if (fromEntity && fromEntity != ''){fromEntity = ':' + fromEntity;}
		var command = 'MATCH (n'+fromEntity + propertyBlock + ') RETURN id(n), labels(n), n';
		
		var callback = function(nodesResult, sourceConfig){
			addSingleNodesFromResults(nodesResult, sourceConfig)
			//Recurse...
			var command = 'MATCH (n'+fromEntity + propertyBlock+')-[r]-(m) RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)';
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
			command = 'MATCH (n)-[r]->(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)';
			break;
		case 'parent':
			command = 'MATCH (n)<-[r]-(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)';
			break;
		default:
			command = 'MATCH (n)-[r]-(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)';
			break;
		}
		var callback2 = function(nodesResult, sourceConfig){
			var newNodes = addNodesFromResults(nodesResult, sourceConfig)
			//popout effect
			newNodes.forEach(function (newNode){
				layout.pinNode(newNode, true);
				var pos = layout.getNodePosition(nodeId);
				layout.setNodePosition(newNode.id, getRandomArbitrary(pos.x-newNode.data.nodeSize/2, pos.x+newNode.data.nodeSize/2), getRandomArbitrary(pos.y-newNode.data.nodeSize/2, pos.y+newNode.data.nodeSize/2));
				layout.pinNode(newNode, false);
			});
			
		};
		Neo4j_Command([command], callback2, _sourceConfig);
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
		var command = 'MATCH ('+matchPattern+') RETURN id(n), labels(n), (n)';
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
		command += ' RETURN id(n), labels(n), (n)';
		Neo4j_Command([command], callback, _sourceConfig);
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jInitAllNodes(_sourceConfig)
	{
		var callback = function (nodesResult, sourceConfig) {
			addSingleNodesFromResults(nodesResult, sourceConfig);
			Neo4jInitAllRelations(_sourceConfig);
		}
		var command = 'MATCH (n) RETURN id(n), labels(n), (n)';
		Neo4j_Command([command], callback, _sourceConfig);
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Neo4jInitAllRelations(_sourceConfig)
	{
		var callback = function (relationsResult, sourceConfig) {
			addSingleRelationFromResults(relationsResult, sourceConfig);
		}
		var command = 'MATCH (n)-[r]->(m) RETURN id(n), id(m), id(r), type(r), r';
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