//============ NEO4J COMMAND BROKER ================================================================================================================================================================================================
function Neo4j_Command(statements, successCallback, _sourceConfig, failCallback)
{
	var sourceConfig = _sourceConfig ? _sourceConfig : currentTheme.sourceConfig;
	var body = new neo_APIcall(); 
	statements.forEach(function(statement){
		body.statements.push(new neo_Statement(statement));
	});
		
	$.ajax({
			url: sourceConfig.neo4jconnection.server + "/db/data/transaction/commit",
			type: 'post',
			data: JSON.stringify(body),
			headers: {
				"Accept":'application/json; charset=UTF-8',
				"Content-Type": 'application/json',
				"Authorization": 'Basic ' + window.btoa(sourceConfig.neo4jconnection.username + ':' + sourceConfig.neo4jconnection.password) //_connection.userToken
			},
			dataType: 'json',				
				
			success: function (returnbody){
				if (successCallback){
					successCallback(returnbody, sourceConfig);
				}
			},
			error: function (returnbody){
				if (failCallback){
					failCallback(returnbody, sourceConfig);
				}
			}()
		});
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCheckMonitoredNodes(_sourceConfig) {
	if (monitoredNodes.length == 0) { return; }
	var id = 0;
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
		if (id >= monitoredNodes.length) {
			performAnimations();
			setTimeout(function () { dataService.CheckMonitoredLinks(); }, config_ext.monitoringOptions.pollInterval * 1000);
			return;
		}
		var command = 'MATCH (n) WHERE ID(n) = ' + getNeoId(monitoredNodes[id++].id) + ' RETURN id(n), labels(n), n';
		Neo4j_Command([command], callback, sourceConfig);
	};
	var command = 'MATCH (n) WHERE ID(n) = ' + getNeoId(monitoredNodes[id++].id) + ' RETURN id(n), labels(n), n';
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCheckMonitoredLinks(_sourceConfig) {
	if (monitoredLinks.length == 0) { return; }
	var id = 0;
	var callback = function (relationsResult, sourceConfig) {
		addSingleRelationFromResults(relationsResult);
		if (id >= monitoredLinks.length) {
			performAnimations();
			setTimeout(function () { pollDatabase(); }, config_ext.monitoringOptions.pollInterval * 1000);
			return;
		}
		var command = 'MATCH (n)-[r]-(m) WHERE ID(r) = ' + getNeoId(monitoredLinks[id++].data.id) + ' RETURN id(n), id(m), id(r), type(r), r';
		Neo4j_Command([command], callback, sourceConfig);
	};
	var command = 'MATCH (n)-[r]-(m) WHERE ID(r) = ' + getNeoId(monitoredLinks[id++].data.id) + ' RETURN id(n), id(m), id(r), type(r), r';
	Neo4j_Command([command], callback, _sourceConfig);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jQbuilder(selectType, _sourceConfig) {
	var scope = selectType.split('.');
	var selectedEntityValue = document.getElementById('qbuilder.' + scope[1] + '.entity').value;
	var sourcePrefix = selectedEntityValue.substring(selectedEntityValue.length - 3);
	var entityName = selectedEntityValue.substring(0, selectedEntityValue.length - 3);
	var selectedEntityCount = getNeoLabel(entityName, sourcePrefix);

	if (scope[2] == 'entity') {
		//get properties...
		var valueElementName = 'qbuilder.' + scope[1] + '.selectproperty';
		document.getElementById('qbuilder.' + scope[1] + '.value').value = '';
		var childElementName = 'qbuilder.' + scope[1] + '.property';
		var propertyElement = document.getElementById(childElementName);
		var listedValues = [];
		propertyElement.innerHTML = '<option value=""></option>';
		document.getElementById('qbuilder.' + scope[1] + '.selectvalue').innerHTML = '<option value=""></option>';
		var command = "MATCH (n:" + entityName + ") RETURN n LIMIT 10 "; //...get 10 entities to get hopefully all the possible properties

		var callback = function (nodesResult, sourceConfig) {
			var valueList = Neo4jExtractProperties(nodesResult)

			var valueElement = document.getElementById(valueElementName);

			valueElement.innerHTML = '<option value=""></option>';
			valueList.sort(sort_by('key', false, function (a) { return a.toUpperCase() })).forEach(function (prop) {
				if (listedValues.indexOf(prop.key) == -1) {
					listedValues.push(prop.key)
					valueElement.innerHTML += '<option value="' + prop.key + '">' + prop.key + '</option>';
				}
			});

		};
		Neo4j_Command([command], callback, getConfigByPrefix(sourcePrefix));
	}
	if (scope[2] == 'property') {
		var valueElementName = 'qbuilder.' + scope[1] + '.selectvalue';
		document.getElementById('qbuilder.' + scope[1] + '.value').value = '';
		//var selectedEntity = document.getElementById('qbuilder.'+scope[1]+'.entity').value;
		var selectedProperty = document.getElementById('qbuilder.' + scope[1] + '.property').value;
		//valueElementName.innerHTML = '<option value=""></option>';
		var listedValues = [];
		if (!selectedProperty) { return; }

		//Manage large datasets
		var command = "MATCH (n:" + entityName + ") return distinct n." + selectedProperty + " LIMIT " + getConfigByPrefix(sourcePrefix).dataAccessOptions.generalFetchLimit;

		var callback = function (nodesResult, sourceConfig) {
			var valueList = Neo4jExtractValues(nodesResult)
			var valueElement = document.getElementById(valueElementName);
			valueElement.innerHTML = '<option value=""></option>';
			valueList.sort().forEach(function (prop) {
				if (listedValues.indexOf(prop) == -1) {
					listedValues.push(prop)
					valueElement.innerHTML += '<option value="' + prop + '">' + prop + '</option>';
				}
			});
		};
		Neo4j_Command([command], callback, getConfigByPrefix(sourcePrefix));
	}
}
