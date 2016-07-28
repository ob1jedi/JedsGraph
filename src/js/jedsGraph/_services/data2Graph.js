//--------------DATA CONVERSION------------------------------------------------------------------------------------------------------------------------


function addNodesFromResults(nodesResults, _sourceConfig)
{
	var newNodes = [];
	for (var i = 0; i < nodesResults.results.length; i++){
		
		var result = nodesResults.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			
			var I_N_ID = 0;
			var I_N_LABELS = 1;
			var I_N_PROPS = 2;
			var I_R_ID = 3;
			var I_R_LABELS = 4;
			var I_R_PROPS = 5;
			var I_M_ID = 6;
			var I_M_LABELS = 7;
			var I_M_PROPS = 8;
			
			//Node N...
			var datN = new nodeDataType;
			datN.id =_sourceConfig.prefix + row[I_N_ID];
			if (row[I_N_LABELS]){datN.labels = row[I_N_LABELS];}
			if (row[I_N_PROPS]){datN.properties = new neoPropertyList(row[I_N_PROPS]);}
			if (row[I_N_PROPS]){datN.propertiesObject = row[I_N_PROPS]}
			var fromNode = addDataNode(datN.id, datN, _sourceConfig);
			if (fromNode){newNodes.push(fromNode);}
			//if (!GRAPH.getNode(row[I_N_ID])){
			//	var pos = layout.getNodePosition(row[I_N_ID]);
			//	layout.setNodePosition(row[I_N_ID], pos.x, pos.y);
			//}
			//Node M...
			var datM = new nodeDataType();
			datM.id =_sourceConfig.prefix + row[I_M_ID];
			if (row[I_M_LABELS]){datM.labels = row[I_M_LABELS];}
			if (row[I_M_PROPS]){datM.properties = new neoPropertyList(row[I_M_PROPS]);}
			if (row[I_M_PROPS]){datN.propertiesObject = row[I_M_PROPS]}
			var toNode = addDataNode(datM.id, datM, _sourceConfig);
			if (toNode){newNodes.push(toNode);}
			
			//link R...
			var linkdata = new linkDataType(datN.id, datM.id, _sourceConfig.prefix + row[I_R_ID], row[I_R_LABELS], _sourceConfig);
			//linkdata.fromNodeID = datN.id;
			//linkdata.toNodeID = datM.id;
			//linkdata.id = _sourceConfig.prefix + row[I_R_ID];
			//linkdata.name = row[I_R_LABELS];
			linkdata.properties = new neoPropertyList(row[I_R_PROPS]);
			linkdata.propertiesObject = row[I_R_PROPS];
			var link = addDataLink(datN.id, datM.id, linkdata, _sourceConfig);
		}
	}	
	return newNodes;
}

function addSingleNodesFromResults(nodesResults, _sourceConfig)
{
	for (var i = 0; i < nodesResults.results.length; i++){
		
		var result = nodesResults.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			var I_N_ID = 0;
			var I_N_LABELS = 1;
			var I_N_PROPS = 2;
			//Node N...
			var dat = new nodeDataType();
			dat.id =_sourceConfig.prefix +row[I_N_ID];
			if (row[I_N_LABELS]){dat.labels = row[I_N_LABELS];}
			if (row[I_N_PROPS]){dat.properties = new neoPropertyList(row[I_N_PROPS]);}
			if (row[I_N_PROPS]){dat.propertiesObject = row[I_N_PROPS];}
			addDataNode(dat.id, dat, _sourceConfig);
		}
	}
}

function addSingleRelationFromResults(nodesResults, _sourceConfig)
{
	for (var i = 0; i < nodesResults.results.length; i++){
		
		var result = nodesResults.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			var I_N_ID = 0;
			var I_M_ID = 1;
			var I_R_ID = 2;
			var I_R_TYPE = 3;
			var I_R_PROPS = 4;
			//Node N...
			var dat = new linkDataType(_sourceConfig.prefix + row[I_N_ID], _sourceConfig.prefix + row[I_M_ID], _sourceConfig.prefix + row[I_R_ID], row[I_R_TYPE], _sourceConfig);
			//dat.fromNodeID = _sourceConfig.prefix + row[I_N_ID];
			//dat.toNodeID = _sourceConfig.prefix + row[I_M_ID];
			//dat.id = _sourceConfig.prefix + row[I_R_ID];
			//if (row[I_R_TYPE]){dat.name = row[I_R_TYPE];}
			if (row[I_R_PROPS]){dat.properties = new neoPropertyList(row[I_R_PROPS]);}
			if (row[I_R_PROPS]){dat.propertiesObject = row[I_R_PROPS]}
			var node = addDataLink(dat.fromNodeID, dat.toNodeID, dat, _sourceConfig);
		}
	}
}

function neoPropertyList(obj)
{
	var propArray = [];
	for (var thiskey in obj) {
		propArray.push(new propertyType(thiskey, obj[thiskey]));
	}
	return propArray;
}