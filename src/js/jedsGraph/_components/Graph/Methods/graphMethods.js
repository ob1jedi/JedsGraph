//Graph functions



function unPinAllNodes()
{
	nodeList.forEach(function(node){
		layout.pinNode(node, false);
		node.data.isPinned = false;
	});
}
				
function uncheckAll(){
	//check nodes
	nodeList.forEach(function(node){
		uncheckNode(node);
	});
	//check links
	linkList.forEach(function(link){
		uncheckLink(link);
	});
}

function checkAll(){
	//check nodes
	nodeList.forEach(function(node){
		checkNode(node);
	});
	//check links
	linkList.forEach(function(link){
		checkLink(link);
	});
}
		
function setScreenDragType(key)
{
	viewOptions.screenDragType = key;
}

function getDataRootNodes()
{
	var rootNodes = [];
	nodeList.forEach(function(node){
		if (node.data.fromNodes.length == 0)
		{
			rootNodes.push(node);
		}
	});
	return rootNodes;
}
		
function arrangeBy(rootNode, processedNodeIds, maxxRight, maxxLeft, level, startY)
{
			
	if (!rootNode){
		squares = [];
		var startPos = layout.getNodePosition(nodeList[0].id);
		var rootNodes = getDataRootNodes();
		processedNodeIds = [];
				
		var startpos = startPos.x;
		nodeList.forEach(function(node){
			layout.pinNode(node, true);
			node.data.isPinned = true;
			startpos += 100;
			layout.setNodePosition(node.id, startpos, startPos.y);
		});
			
		maxxRight = startPos.x;
		maxxLeft = startPos.x;
		startY = startPos.y;
		rootNodes.forEach(function(rootNode, index){
			maxxRight = arrangeBy(rootNode, processedNodeIds, maxxRight, maxxLeft, 0, startY);
		});
	}
	else{
				

		level++;
		processedNodeIds.push(rootNode.id);
		var rootNodePos = layout.getNodePosition(rootNode.id);
		var cb = rootNodePos.x - ((rootNode.data.toNodes.length*100) /2)
		rootNode.data.toNodes.forEach(function(childNode, index){
			var childNodePos = layout.getNodePosition(childNode.id);
			childNodePos.x = cb + (100 * index);
			if (childNodePos.x + 100 >= maxxRight) {maxxRight = childNodePos.x + 100;}
			if (childNodePos.x <= maxxLeft) {maxxLeft = maxxLeft - 100; maxxRight = maxxRight + 100;}
			var childLevel = startY + (level * 150);
			if (childLevel > childNodePos.y) {childNodePos.y = childLevel};
			layout.setNodePosition(childNode.id, childNodePos.x, childNodePos.y);
					
			if (processedNodeIds.indexOf(childNode.id) < 0){
				arrangeBy(childNode, processedNodeIds, maxxRight, maxxLeft, level, startY);
			}
			else //cyclic relation
			{
				//layout.pinNode(node, false);
				//node.data.isPinned = false;
			}
		});
	}
	return maxxRight;

}	
		
function arrangeBy2(rootNode, processedNodeIds, posLeft, posTop, level)
{
	if (!rootNode){
		squares = [];
		var startPos = layout.getNodePosition(nodeList[0].id);
		var rootNodes = getDataRootNodes();
		processedNodeIds = [];
		nodeList.forEach(function(node){
			layout.pinNode(node, true);
			node.data.isPinned = true;
			layout.setNodePosition(node.id, startPos.x, startPos.y);
		});
			
		posLeft = startPos.x;
		posTop = startPos.y;
		var rootTop = startPos.y;
		rootNodes.forEach(function(rootNode, index){
			posTop += 100;
			posTop = arrangeBy2(rootNode, processedNodeIds, posLeft, posTop, 0);
			var parentPos = rootTop + ((posTop - rootTop)/2);
			layout.setNodePosition(rootNode.id, posLeft, parentPos);
			rootTop = posTop;
		});
	}
	else{
		level++;
		processedNodeIds.push(rootNode.id);
		var rootNodePos = {x:posLeft, y:posTop};
		posLeft += 200;
		var currentChildTop = posTop - 100;
		rootNode.data.toNodes.forEach(function(childNode, index){
			if (processedNodeIds.indexOf(childNode.id) < 0){					
				currentChildTop += 100;
				layout.setNodePosition(childNode.id, posLeft, currentChildTop);
				posTop = arrangeBy2(childNode, processedNodeIds, posLeft, currentChildTop, level);
			}
		});
	}
	return posTop;
}
	
function addNodeToGraph(nodeId, nodeData)
{
	var node = GRAPH.getNode(nodeId);
	node = GRAPH.addNode(nodeId, nodeData);
	fixTextWidth4Node(node);
	return node;
}
		
function highlightLabel(labelIndex)
{
	var nodeLabel = labelsList[labelIndex];
	nodeList.forEach(function(node){
		node.data.UI.fullUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity);
		node.data.UI.bodyUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity);
		if (nodeLabel && node.data.labels.indexOf(nodeLabel.name) == -1) {
			node.data.UI.fullUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity/ 5)
			node.data.UI.bodyUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity/ 5);
		}
	});	
}

function addPlannedLink(fromNodeID, toNodeID, linkName, linkProperties)
{
	var plannedLinkData = new linkDataType()
	plannedLinkData.fromNode = fromNodeID;
	plannedLinkData.toNode = toNodeID;
	plannedLinkData.id = fromNodeID + '_' + toNodeID + ' ' + linkName;
	plannedLinkData.name = linkName;
	plannedLinkData.displayLabel = linkName;
	plannedLinkData.linkType = 'planned';
	plannedLinkData.color = 'red';
	link = GRAPH.addLink(fromNodeID, toNodeID, plannedLinkData);
	linkList.push(link);
}
		
function addDataLink(fromNodeID, toNodeID, linkData, _sourceConfig)
{
	linkData.sourceConfig = _sourceConfig? _sourceConfig : currentTheme.sourceConfig;
	var bIsNew = false;
	var link;
	var existingLink = getDataLink(linkData.id);
	if (existingLink){
		var updatedProperties = getUpdatedProperties(linkData.properties, existingLink.data.properties);
		if (linkData.name != existingLink.data.name || updatedProperties.length > 0){
			existingLink.data.name = linkData.name;
			existingLink.data.displayLabel = linkData.name;
			existingLink.data.properties = linkData.properties;
			animUpdateLinks.push(existingLink);
		}
		link = existingLink;
		fromNodeID = existingLink.data.fromNodeID;
		toNodeID = existingLink.data.toNodeID;
	}
	else{
		bIsNew = true;
		link = GRAPH.addLink(fromNodeID, toNodeID, linkData);
		link.data.fromNodeID = fromNodeID;
		link.data.toNodeID = toNodeID;
		link.data.displayLabel = linkData.name;
		linkList.push(link); 
		fixLinkIndexes(fromNodeID, toNodeID);
	}

	var toNode = GRAPH.getNode(toNodeID);
	var fromNode = GRAPH.getNode(fromNodeID);
			
	config_ext.startupOptions.linkDisplayValues.map(function (lconfig) {
		var useConfig = true;
		if (lconfig.labelFrom){useConfig = (lconfig.labelFrom == fromNode.data.labels[0])?useConfig:false}else{useConfig = false;}
		if (lconfig.labelTo){useConfig = (lconfig.labelTo == toNode.data.labels[0])?useConfig:false}else{useConfig = false;}
		if (lconfig.type){useConfig = (lconfig.type == link.data.name)?useConfig:false}else{useConfig = false;}
		if (useConfig){
			link.data.config = lconfig;
			link.data.displayLabel = lconfig.displayField;
			var propertyValue = getNodePropertyValue(link.data.properties, lconfig.displayField);
			link.data.displayLabel = propertyValue ? propertyValue : ' ';
		}			
	});
	refreshLinkVisual(link);

	if (bIsNew)
	{
		toNode.data.fromLinks.push(link);
		toNode.data.fromNodes.push(fromNode);
		fromNode.data.toLinks.push(link);
		fromNode.data.toNodes.push(toNode);
	}
			
	fixTextWidth4Link(link);
}
		
function fixLinkIndexes(fromNodeID, toNodeID){ //Get sibling details...
	var totalSiblings = 0;
	var leftSiblings = 0;
	var rightSiblings = 0;
	//get sibling information
	linkList.forEach(function (link){
		if (link.toId == toNodeID && link.fromId == fromNodeID){
			totalSiblings++;
			leftSiblings++
		}
		else if (link.toId == fromNodeID && link.fromId == toNodeID){
			totalSiblings++;
			rightSiblings++
		}
	});
			
	linkList.forEach(function (link){
		if (link.toId == toNodeID && link.fromId == fromNodeID){
			//this is a left sibling
			if (totalSiblings == 1){ //there is only one sibling so its position will be center 
				link.data.UI.fullUI.attr('linkPos',0);
			}else{
				//add the position of the sibling, (counting down so that widest is always underneath)
				link.data.UI.fullUI.attr('linkPos', leftSiblings--);
			}
		}
		else if (link.toId == fromNodeID && link.fromId == toNodeID){
			if (totalSiblings == 1){ //there is only one sibling so its position will be center 
				link.data.UI.fullUI.attr('linkPos',0);
			}else{
				//add the position of the sibling, (counting down so that widest is always underneath)
				link.data.UI.fullUI.attr('linkPos', rightSiblings--);
			}
		}
	});
}

function addDataNode(nodeId, nodeData, _sourceConfig)
{
	if (!_sourceConfig) _sourceConfig = config_ext;
	nodeData.sourceConfig = getConfig(_sourceConfig);
	var dataNode = getDataNode(nodeId);
	var nodeUI;
	var isNewNode = false;
	if (dataNode){
		var newLabels = [];
		nodeUI = graphics.getNodeUI(nodeId);
		nodeData.labels.forEach(function (newLabel) {
			var hasLabel = false;
			for (var i = 0; i < nodeData.labels.length; i++){
				if (nodeData.labels[i] == newLabel){
					hasLabel = true;
					break;
				}
			};
			if (!hasLabel) {newLabels.push(newLabel)}
		});

		var updatedProperties = getUpdatedProperties(dataNode.data.properties, nodeData.properties);
		if (newLabels.length > 0 || updatedProperties.length > 0){
			if (nodeData.UI.displayTextUI) {
				nodeData.UI.displayTextUI.innerHTML = propertyListToSvgList(nodeData.properties, '<tspan x="50" dy="1.2em">', '</tspan>');
			}
			dataNode.data.labels = nodeData.labels;
			dataNode.data.properties = nodeData.properties;
			animUpdateNodes.push(dataNode);
		}
		else{//no changes have been made to the node...
			return; //NOTE: DO NOT RETURN THE DATA-NODE
		}
	}
	else 
	{
		isNewNode = true;
		nodeUI = graphics.getNodeUI(nodeId);
	}
			
	//find config for node if any is specified...
	_sourceConfig.startupOptions.nodeDisplayBody.map(function (nconfig) { if (nconfig.nodeLabel == nodeData.labels[0]) { nodeData.config.nodeDisplayBody = nconfig; } });
	_sourceConfig.startupOptions.nodeDisplayValues.map(function (nconfig) { if (nconfig.nodeLabel == nodeData.labels[0]) { nodeData.config.nodeDisplayValues = nconfig; } });
	_sourceConfig.startupOptions.nodeStatReachers.map(function (nconfig) { if (nconfig.nodeLabel == nodeData.labels[0]) { nodeData.config.nodeStatReachers.push(nconfig); } });
	_sourceConfig.startupOptions.nodeTransformers.map(function (nconfig) { if (nconfig.nodeLabel == nodeData.labels[0]) { nodeData.config.nodeTransformers.push(nconfig); } });
	_sourceConfig.startupOptions.nodeFlyout.map(function (nconfig) { if (nconfig.nodeLabel == nodeData.labels[0]) { nodeData.config.nodeFlyout.push(nconfig); } });

	var nodeDisplayBody = evaluateAugmentsAndUpdateNodeDisplay(nodeData.sourceConfig, nodeData);
	for (var prop in nodeDisplayBody){
		nodeData.config.nodeDisplayBody[prop] = nodeDisplayBody[prop];
	}
				
	thisNodeData = nodeData;
	thisIsNewNode = newNode;
	this_sourceConfig = _sourceConfig;

	//set display attributes based on config...
	if (thisNodeData.config.nodeDisplayBody.size) {thisNodeData.nodeSize = thisNodeData.config.nodeDisplayBody.size};
			
	var finalLabel = '';
	thisNodeData.labels.forEach(function (nodeLabel, index) {
		if (finalLabel) { finalLabel += ',' }
		if (!finalLabel) { finalLabel = ''; }
		if (finalLabel == "") {
			finalLabel = nodeLabel;
		}
	});

	//set display label...
	thisNodeData.displayLabel = "";
	if (thisNodeData.config.nodeDisplayValues.displayField) {
		if (thisNodeData.displayLabel != "") { thisNodeData.displayLabel + '\n'; }
		var propertyValue = getNodePropertyValue(thisNodeData.properties, thisNodeData.config.nodeDisplayValues.displayField);
		thisNodeData.displayLabel += propertyValue ? propertyValue : ' ';
	}
	else {
		thisNodeData.displayLabel = finalLabel;
	}

	//set circle text...
	if (thisNodeData.config.nodeDisplayValues.circleText) {
		if (thisNodeData.circleText != "") { thisNodeData.circleText + '\n'; }
		var propertyValue = getNodePropertyValue(thisNodeData.properties, thisNodeData.config.nodeDisplayValues.displayField);
		thisNodeData.circleText += propertyValue ? propertyValue : ' ';
	}
	else {
		thisNodeData.circleText = finalLabel;
	}

		    

	//thisNodeData.displayLabel;
	var aNeoLabel = getNeoLabel(thisNodeData.labels[0], this_sourceConfig.prefix);
	if (aNeoLabel) {
		thisNodeData.nodeColor = aNeoLabel.color; 
		thisNodeData.nodeColorRGB = aNeoLabel.colorRGB;
		thisNodeData.nodeBorderColor = rgb2hex(thisNodeData.nodeColorRGB.r-20, thisNodeData.nodeColorRGB.g-20, thisNodeData.nodeColorRGB.b-20);
	}
			
	if (thisIsNewNode){
		dataNode = addNodeToGraph(thisNodeData.id, thisNodeData);	
		nodeList.push(dataNode);
		PerformNodeStatFunctions(dataNode);
		return dataNode; //RETURN ONLY IF NODE IS NEW
	}
	else
	{
		PerformNodeStatFunctions(dataNode);
	}
}
		
		
function addDataLabel(labelName, _addInstanceCount, _sourceConfig)
{	
	var existingLabelSelector = getNeoLabel(labelName, _sourceConfig.prefix);
	if(existingLabelSelector) 
	{
		if(_addInstanceCount){existingLabelSelector.instanceCount += _addInstanceCount};
		var fetchbutton = document.getElementById('labelSelector.fetcher.' + labelName)
		if (fetchbutton) {fetchbutton.innerHTML = existingLabelSelector.instanceCount;}
		return;
	}

	var rgb = {r: Math.ceil(getRandomArbitrary(_sourceConfig.displaySettings.entityRgbRange.min, _sourceConfig.displaySettings.entityRgbRange.max)),
							g: Math.ceil(getRandomArbitrary(_sourceConfig.displaySettings.entityRgbRange.min, _sourceConfig.displaySettings.entityRgbRange.max)),
							b: Math.ceil(getRandomArbitrary(_sourceConfig.displaySettings.entityRgbRange.min, _sourceConfig.displaySettings.entityRgbRange.max))
				}
	var randomColor = rgb2hex(rgb.r, rgb.g, rgb.b);
	var newDataLabel = new neoLabelType(labelName, randomColor, rgb, _sourceConfig);
	if (_addInstanceCount) {newDataLabel.instanceCount += _addInstanceCount;}
	//Add new data label to labels-list
	labelsList.push(newDataLabel);
						
	return newDataLabel;
}
		
function refreshLabelSelectors(){
	//Order label selectors...
	labelsList.sort(sort_by('name', false, function(a){ if (a) {return a.toUpperCase()} }));
	//Add selector to HTML...
	var qbuilderFromEntitySelector = document.getElementById('qbuilder.from.entity');
	var color = 'gray';
	var button_onclick = "dataService.GetNodesByLabel(false, '" + currentTheme.sourceConfig.prefix + "')";
	var fetchButton = '<button id="labelSelector.fetcher.All" class="forlabelselector mytooltip" onclick="'+button_onclick+'"><div class="mytooltiptext ttleft ttlower">Fetch from database</div></button>'
	var labelSelectorHtml = '<table><tr><td><div onclick="highlightLabel()" class="labelSelectorPanel" style="background-color:'+ color +';">All</div></td><td>' + fetchButton + '</td></tr>';
	if (qbuilderFromEntitySelector) {qbuilderFromEntitySelector.innerHTML = '<option value=""></option>';}
			
	labelsList.forEach(function (nodeLabel, index) {
		color = nodeLabel.data.sourceConfig.displaySettings.selectorColor;
		button_onclick = "dataService.GetNodesByLabel('" + nodeLabel.name + "', '" + nodeLabel.data.sourceConfig.prefix + "')";
		fetchButton = '<button id="labelSelector.fetcher.' + nodeLabel.name + '" class="forlabelselector mytooltip" style="background-color:' + nodeLabel.color + '" onclick="' + button_onclick + '">' + nodeLabel.instanceCount + '<div class="mytooltiptext ttleft ttupper">Fetch from database</div></button>'
		labelSelectorHtml += '<tr><td><div onclick="highlightLabel(' + index + ')" class="labelSelectorPanel" style="background-color:' + color + ';">' + nodeLabel.name + '</div></td><td>' + fetchButton + '</td></tr>';
		if (qbuilderFromEntitySelector) { qbuilderFromEntitySelector.innerHTML += '<option value="' + nodeLabel.name + nodeLabel.data.sourceConfig.prefix + '">' + (nodeLabel.name + " (" + nodeLabel.data.sourceConfig.prefix + ")") + '</option>'; }
	});
	labelSelectorHtml += '</table>';
	var LabelsDiv = document.getElementById('selectorLabels');
	if (LabelsDiv) {LabelsDiv.innerHTML = labelSelectorHtml;}
}
		
function removeNodeFromStage(nodeID)
{
	if (!nodeID) {nodeID = selectedNodeID;}
	var node = GRAPH.getNode(nodeID);
			
	var allNodeLists = nodeList.concat(node.data.toNodes.concat(node.data.fromNodes));
	var i = -1;
	while (++i < nodeList.length){if (nodeList[i].id == nodeID) {nodeList.splice(i, 1);}}
	var i = -1;
	while (++i < monitoredNodes.length){if (monitoredNodes[i].id == nodeID) {monitoredNodes.splice(i, 1);}}
	var i = -1;
	while (++i < checkedNodes.length){if (checkedNodes[i].id == nodeID) {checkedNodes.splice(i, 1);}}
	nodeList.forEach(function(node) {
		var i = -1;
		while (++i < node.data.toNodes.length){if (node.data.toNodes[i].id == nodeID) {node.data.toNodes.splice(i, 1);}}
		var i = -1;
		while (++i < node.data.fromNodes.length){if (node.data.fromNodes[i].id == nodeID) {node.data.fromNodes.splice(i, 1);}}
		var i = -1;
		while (++i < node.data.toLinks.length){if (node.data.toLinks[i].toNodeID == nodeID) {node.data.toLinks.splice(i, 1);}}
		var i = -1;
		while (++i < node.data.fromLinks.length){if (node.data.fromLinks[i].fromNodeID == nodeID) {node.data.fromLinks.splice(i, 1);}}
	});
			
	var relativeLinks = node.data.toLinks.concat(node.data.fromLinks);
	relativeLinks.forEach(function (link){
		GRAPH.removeLink(link.id);
	});
	GRAPH.removeNode(nodeID);
}
		
function removeLinkFromStage(linkID) {
	if (!linkID) { linkID = selectedLink.data.id; }
	var link = getLinkById(linkID);
	var i = -1;
	while (++i < linkList.length) { if (linkList[i].id == linkID) { linkList.splice(i, 1); } }
	var i = -1;
	while (++i < monitoredLinks.length) { if (monitoredLinks[i].id == linkID) { monitoredLinks.splice(i, 1); } }
	var fromNode = GRAPH.getNode(link.data.fromNodeID);
	var toNode = GRAPH.getNode(link.data.toNodeID);

	while (++i < fromNode.data.toNodes.length) { if (fromNode.data.toNodes[i].id == link.data.toNodeID) { fromNode.data.toNodes.splice(i, 1); } }
	while (++i < toNode.data.fromNodes.length) { if (toNode.data.fromNodes[i].id == link.data.fromNodeID) { toNode.data.fromNodes.splice(i, 1); } }

	GRAPH.removeLink(link);
}

		
function getDataNode(nodeID)
{
	for (var i = 0; i < nodeList.length; i++){
		if (nodeList[i].id == nodeID){
			return nodeList[i];
		}
	}
}
		
		
function getNodesByMatchingLabels(nodesList, labels){
	var returnNodeList = [];		
	//iterate through 
	nodesList.forEach(function(node){
		var nodeEligible = true;
		labels.forEach(function (nodeLabel) {
			var labelFound = false;
			node.data.labels.forEach(function(nodelabel){
				if (nodelabel == nodeLabel)
					labelFound = true;
			});
			if (!labelFound){nodeEligible = false}
		});
		if (nodeEligible){returnNodeList.push(node);}
	});
	return returnNodeList;
}
		
function getNodesByMatchingProperties(nodesList, properties){
	var returnNodeList = [];		
	//iterate through 
	nodesList.forEach(function(node){
		var nodeEligible = true;
		properties.forEach(function (prop){
			var propFound = false;
			node.data.properties.forEach(function(nodeprop){
				if (prop.key == nodeprop.key && prop.value == nodeprop.value){
					propFound = true;	
				}
			});
			if (!propFound){nodeEligible = false;}
		});
		if(nodeEligible){returnNodeList.push(node);}
	});
	return returnNodeList;
}
		
function getNeoLabel(byName, sourcePrefix)
{
	var x;
		labelsList.forEach(function(labelobj, index){
		if (labelobj.name == byName &&  labelobj.data.sourceConfig.prefix == sourcePrefix){
			x = labelobj;
			return labelobj;
		}
	});
	return x;
}
function getDataLink(id)
{
	for (var i = 0; i < linkList.length; i++){
		if (linkList[i].data.id == id){
			return linkList[i];
		}
	}
}
function getDataLinks(fromNodeID, toNodeID, direction)
{
		
	var x = [];
	linkList.forEach(function(link, index){
		switch (direction){
			case 'same':
				if (link.fromId == Number(fromNodeID) && link.toId == Number(toNodeID)){
					x.push(link);
				}
				break;
			case 'opposite':
				if (link.toId == Number(fromNodeID) && link.fromId == Number(toNodeID)){
					x.push(link);
				}
				break;
			default:
				if ((link.fromId == Number(fromNodeID) && link.toId == Number(toNodeID)) ||
					(link.toId == Number(fromNodeID) && link.fromId == Number(toNodeID))){
					x.push(link);
				}
				break;
			}
	});
	return x;
}
		
		
function getConfigByPrefix(configPrefix)
{
	for (var i = 0; i < masterConfigs.length; i++){
		if (masterConfigs[i].prefix == configPrefix){
			return masterConfigs[i];
		}
	}
}
		