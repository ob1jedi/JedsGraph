//Node methods

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function fixTextWidth4Node(node)
{	
	//adjust display text...
	if (node.data.UI.bodyUI && node.data.UI.displayTextUI)
	{
		if (!node.data.sourceConfig.displaySettings.showLabels) {return;}
		var nodeRadius = node.data.nodeSize; //UI.fullUI.attr('r');//nodeUI.attr('r');
		var widthOfNode = Number(node.data.UI.bodyUI.getBBox().width);
		var minWidth = widthOfNode - widthOfNode * 0.1;
		var widthOfText = Number(node.data.UI.displayTextUI.getBBox().width);
		var text = node.data.UI.displayTextUI.text();
		var heightOfText = Number(node.data.UI.displayTextUI.getBBox().height);
		if (!text || text.length == 0) {return;}

		if (node.data.config.nodeDisplayBody.labelPos){
			switch(node.data.config.nodeDisplayBody.labelPos){
				case "above":
					node.data.UI.displayTextUI.attr('x', -widthOfText/2 ); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', -heightOfText - nodeRadius/3);
					break;
				case "under":
					node.data.UI.displayTextUI.attr('x', -widthOfText/2); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', nodeRadius + heightOfText);
					break;
				case "right":
					node.data.UI.displayTextUI.attr('x', nodeRadius + nodeRadius/3); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', heightOfText/3);
					break;
				case "left":
					node.data.UI.displayTextUI.attr('x', -(widthOfText + nodeRadius + nodeRadius/3)); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', heightOfText/3);
					break;
			}
		}
		else{
				
			var failer = 0;
			if (widthOfText > minWidth)
			{
				while (widthOfText >= minWidth)
				{
					failer++;
					if (node.data.sourceConfig.displaySettings.labelSizing == 'hyphenate')
					{
						text = (text).substring(0, text.length-2) + "'";
						node.data.UI.displayTextUI.text(text);
					}
					else if (node.data.sourceConfig.displaySettings.labelSizing == 'fontsize')
					{
						var fontsize = Number(node.data.UI.displayTextUI.attr('font-size'));
						node.data.UI.displayTextUI.attr('font-size', fontsize*0.9);
					}
					else return;
					widthOfText = Number(node.data.UI.displayTextUI.getBBox().width);
					if (failer > 1000) return;
				}
			}
			else if (node.data.sourceConfig.displaySettings.labelSizing == 'fontsize')
			{	failer = 0;		
						
				while (widthOfText < minWidth - (widthOfText *0.2))
				{
					failer++;
					var fontsize = Number(node.data.UI.displayTextUI.attr('font-size'));
					node.data.UI.displayTextUI.attr('font-size', fontsize*1.1);
					widthOfText = Number(node.data.UI.displayTextUI.getBBox().width);
					if (failer > 1000) return;
				}
			}					
			heightOfText = Number(node.data.UI.displayTextUI.getBBox().height);
			node.data.UI.displayTextUI.attr('x', -widthOfText/2);
			node.data.UI.displayTextUI.attr('y',  heightOfText/3 );
		}
	}
			
	//adjust size of popout text...
	if(node.data.UI.popoutBodyUI)
	{	
		var boxheight = 0;
		var boxwidth = 0;
		if (node.data.UI.popoutTextUI && node.data.UI.popoutTextUI.children.length > 0){
			boxheight = Number(node.data.UI.popoutTextUI.getBBox().height + 20);
			boxwidth = Number(node.data.UI.popoutTextUI.getBBox().width + 30);
		}
		node.data.UI.popoutBodyUI.attr('height',boxheight);
		node.data.UI.fullUI.attr('style','width:'+boxwidth + 'px;');
		node.data.UI.popoutBodyUI.attr('x', node.data.nodeSize + 10)
		node.data.UI.popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="'+(node.data.nodeSize + 15)+'" dy="1.2em">', '</tspan>');
	}
			
}
		

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function showOnNode(nodeId, text)
{
	var node = getDataNode(nodeId);
	node.data.displayLabel = text;
	refreshNodeAppearance(nodeId);
}
		
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeSprings(nodeid)
{
	if (!nodeid){nodeid=selectedNodeID;}
	var node = getDataNode(nodeid);
			
	node.data.toNodes.forEach(function(toNode){
		var nodespring = layout.getSpring(nodeid, toNode.id);
		nodespring.length += 10;
	});
	node.data.fromNodes.forEach(function(toNode){
		var nodespring = layout.getSpring(toNode.id, nodeid);
		nodespring.length += 10;
	});
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeDepth(node, addDepthValue)
{
    //set defaults...
	if (!node){node=selectedNode;}
	if (!addDepthValue){addDepthValue = 0.5;}
                      
    //perform transformations...
	node.data.depth += addDepthValue;

	refreshNodesDepths();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeDepth(node)
{
	if (!node){node=selectedNode;}
	//nodeUI = graphics.getNodeUI(nodeid);
	//nodeUI.attr('depth', Number(nodeUI.attr('depth')) - 0.1);

}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeSprings(nodeid)
{
	if (!nodeid){nodeid=selectedNodeID;}
	var node = getDataNode(nodeid);
			
	node.data.toNodes.forEach(function(toNode){
		var nodespring = layout.getSpring(nodeid, toNode.id);
		nodespring.length -= 10;
	});
	node.data.fromNodes.forEach(function(toNode){
		var nodespring = layout.getSpring(toNode.id, nodeid);
		nodespring.length -= 10;
	});
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeMass(nodeid)
{
	if (!nodeid){nodeid=selectedNodeID;}
	var nodebod = layout.getBody(nodeid);
	nodebod.mass++;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeMass(nodeid)
{
	if (!nodeid){nodeid=selectedNodeID;}
	var nodebod = layout.getBody(nodeid);
	nodebod.mass--;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function uncheckNode(node){

	if(node.data.UI.checkUI){
		node.data.UI.checkUI.remove();
		node.data.UI.checkUI = undefined;
	}
	if (currentTheme.sourceConfig.displaySettings.loadNodePopouts){
		if(node.data.UI.popoutTextUI){node.data.UI.popoutTextUI.attr('class','slidetext');}
	}
}
		
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function highlightSelectedNode(nodeId) {
		   
	if (selectedNodeID != ''){
		if (nodeId == selectedNodeID) {return;} //...we've re-clicked the same node
		//DISPOSE PREVIOUS SELECTION
		//remove all sub nodes...
		if (config_ext.viewOptions.subnodes.relations=="ifany"){
			while (selectedNode.data.subNodes.length > 0){
				removeSubNode(selectedNode.data.subNodes[0], false);
				selectedNode.data.subNodes.splice(0,1);
			}
		};
		if (currentTheme.sourceConfig.displaySettings.showRelationships == "on-highlight" && !interactionOptions.checkNodes){
			//Remove previous selections visuals
			var relevantLinks = selectedNode.data.toLinks.concat(selectedNode.data.fromLinks);
			relevantLinks.forEach(function(link){
				unHighlightLink(link,false);
			});
		}
   
		if (bRelate == true)
		{
			if (nodeId != selectedNodeID){
				submitCreateRelation(selectedNodeID, nodeId)
			}
			bRelate=false;
		}
			   
		if (bPlanRelate==true)
		{
			if (nodeId != selectedNodeID){
				submitCreateRelation(selectedNodeID, nodeId, true)
			}
			bPlanRelate=false;
		}
			   
	}

	var node = GRAPH.getNode(nodeId);
	selectedNodeID = nodeId;
	selectedNodeData = node.data;
	selectedNode = node;

	if (interactionOptions.checkNodes){
		checkNode(node);
	}
	else{ //...not checking nodes...
		checkedNodes.forEach(function(nodex){
			uncheckNode(nodex);
		});
		checkedNodes = [];
	}
		   
	//Display relationship details...
	node.data.toLinks.forEach(function(l){highlightLink(l,true)});
	node.data.fromLinks.forEach(function(l){highlightLink(l,true)});

	addSelectionGraphic(node);

	loadNodePopout(node, node.data.sourceConfig);

	showNodeDetailsInToolPanel(node);	

	//show sub nodes...
	if (config_ext.viewOptions.subnodes.relations=="ifany"){
		var diffCount = node.data.stats.toEntityCount - node.data.toLinks.length;
		if (diffCount > 0) {
			addSubNode(node, 'subto' + node.id, '#80ffe5', diffCount);
		}
		diffCount = node.data.stats.fromEntityCount - node.data.fromLinks.length;
		if (diffCount > 0) {
			addSubNode(node, 'subfrom' + node.id, '#99ccff', diffCount);
		}
	};
}

function addSelectionGraphic(node){
	node.data.UI.fullUI.insertBefore(CommonUI.focusUI, node.data.UI.bodyUI);
	node.data.UI.focusUI = CommonUI.focusUI
		.attr('r', node.data.nodeSize + node.data.nodeSize / 3)//...for circle
		.attr('stroke-width', node.data.nodeSize / 5);

	node.data.UI.focusUI.attr('class', 'selectionRingOut');
	setTimeout(function () {
		node.data.UI.focusUI.attr('class', 'selectionRingIn');
	}, 200);
	
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function checkNode(node)
{
	checkedNodes.push(node);
		//if(node.data.UI.fullUI){node.data.UI.fullUI.attr('stroke','#99ff33');}
		if(!node.data.UI.checkUI){
			CommonUI.checkUI
				.attr('r', node.data.nodeSize + node.data.nodeSize/4)//...for circle
				.attr('stroke-width',node.data.nodeSize/5);
			node.data.UI.checkUI = CommonUI.checkUI.cloneNode();
			node.data.UI.fullUI.insertBefore(node.data.UI.checkUI, node.data.UI.bodyUI);
		}

		if (currentTheme.sourceConfig.displaySettings.loadNodePopouts){
			if (!node.data.UI.popoutBodyUI){loadNodePopout(node);}
			if(node.data.UI.popoutTextUI){
				node.data.UI.popoutTextUI.attr('class','showtext');
			}
					
		}
				
}
		
function loadNodePopout(node, config)
{
	if (config.displaySettings.loadNodePopouts == false)
		return;

	CommonUI.popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="'+(node.data.nodeSize + 15)+'" dy="1.2em">', '</tspan>');
			
	node.data.UI.popoutBodyUI = CommonUI.popoutBodyUI.cloneNode(true);
	node.data.UI.fullUI.append(node.data.UI.popoutBodyUI);
			
	node.data.UI.popoutTextUI = CommonUI.popoutTextUI.cloneNode(true);
	node.data.UI.fullUI.append(node.data.UI.popoutTextUI);

	fixTextWidth4Node(node);
	node.data.UI.popoutBodyUI.attr('class', 'slidebody');
	node.data.UI.popoutTextUI.attr('class', 'slidetext');
}
		
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function showNodeDetailsInToolPanel(node)
{
	var processingElement = document.getElementById('selectedNode');
	var labellist = ''
	var html = '<a class="panelheader">Selected Entity:</a> <a class="dataNameLabel">' + selectedNodeID + '</a>';
	//html += '<br/><a class="panelheader">Entity type</a>:<br/>' //+ labellist;
	html += '<table>'
	node.data.labels.forEach(function (nodeLabel, index) {
		if (index!=0){labellist += ', ';}
		var button_onclick = 'Neo4jDeleteLabel(' + node.id + ', \'' + nodeLabel + '\')';
		html += '<tr>'
		html += '<td><button class="paneloption mytooltip" onclick="' + button_onclick + '" >X<div class="mytooltiptext">delete label</div></button></td><td><a class="dataNameLabel">' + nodeLabel + '</a></td>'
		html += '</tr>'
	});
	html += '</table>'
			
			
	processingElement.innerHTML = html;
			
	html = '<a class="panelheader">Properties<a>:';
	html += '<table>'
	var processingElement = document.getElementById('nodeDetails');
	node.data.properties.forEach(function(property, index){
		html += '<tr>'
		var button_onclick = 'showOnNode(\'' + node.id + '\', \'' + property.value + '\')';
		html += '<td><button class="paneloption mytooltip" onclick="'+button_onclick+'">O<div class="mytooltiptext ttupper">display in node</div></button></td><td> <a class="dataNameLabel">' + property.key + '</a></td><td><a class="dataValueLabel"> ' + property.value + '</a></td>';
		html += '</tr>'
	});
	html += '</table>'
	processingElement.innerHTML = html;
			
	UiShow_EditEntity(node);
	//node.data.properties.forEach(function(property, index){
	//	html += '<tr>'
	//	var button_onclick = 'showOnNode(' + node.id + ', \'' + property.value + '\')';
	//	html += '<td><button class="fortext mytooltip" onclick="'+button_onclick+'">O<div class="mytooltiptext">display in node</div></button></td><td> <a class="dataNameLabel">' + property.key + '</a></td><td><a class="dataValueLabel"> ' + property.value + '</a></td>';
	//	html += '</tr>'
	//});
			
}
		
function UiShow_EditEntity(node){
	var updateElement = document.getElementById('new.entity.name');
	var panel = document.getElementById('panel.entity.props');
	panel.children[0].innerHTML = '';
		    
	node.data.properties.forEach(function(prop){
		panelAddKeyValue('panel.entity.props', 'new.entity', prop.key, prop.value, prop.datatype);
	});
	if (updateElement)
	{
		updateElement.value = node.data.labels[0];
	}
}

function refreshNodeAppearance(nodeId){
	var node = GRAPH.getNode(nodeId?nodeId:selectedNodeID);
	addNodeToGraph(node.id, node.data);
	node.data.UI.fullUI.attr('transform', 'scale(' + node.data.depth + ')');

	if (node.data.depth > 1) {
		node.data.UI.fullUI.attr('opacity', 1 / node.data.depth);
	}
	else {
		node.data.UI.fullUI.attr('opacity', node.data.depth);
	}
}
		
function refreshNodesDepths() {
	var nodeZOrder = [];
	for (var n = 0; n < nodeList.length; n++) {
		var inserted = false;
		for (var z = 0; z < nodeZOrder.length; z++) {
		    if (nodeList[n].data.depth < nodeZOrder[z].data.depth) {
		        nodeZOrder.splice(z, 0, nodeList[n]);
		        inserted = true;
		        break;
		    }
		}
		if (!inserted) { nodeZOrder.push(nodeList[n]); }
	}
	nodeZOrder.forEach(function (znode) { refreshNodeAppearance(znode.id) });
}
			
function increaseNodeSize(nodeId)
{
	if (!nodeId){nodeId = selectedNodeID;}
	var node = GRAPH.getNode(nodeId);
	node.data.nodeSize = node.data.nodeSize + 50/node.data.nodeSize;
	//node.data.UI.popoutBodyUI.attr('x', node.data.nodeSize/2)
    //            .attr('y', -node.data.nodeSize)
	//node.data.UI.popoutBodyUI.attr('x', node.data.nodeSize/2)
    //            .attr('y', -node.data.nodeSize)
						
	node.data.UI.bodyUI.attr('r', node.data.nodeSize) //...for circle
	node.data.UI.imageUI.attr('x', -node.data.nodeSize)
				.attr('y', -node.data.nodeSize)
				.attr('rx', node.data.nodeSize)
				.attr('width', node.data.nodeSize * 2)
				.attr('height', node.data.nodeSize * 2)
			
	node.data.toLinks.forEach(function (link){
		link.data.UI.fullUI.attr('fromNodeRadius', node.data.nodeSize);
	});
	node.data.fromLinks.forEach(function (link){
		link.data.UI.fullUI.attr('toNodeRadius', node.data.nodeSize);
	});

	increaseNodeSprings(node.id);
	fixTextWidth4Node(node);
		
}		
		
function decreaseNodeSize(nodeId)
{
	if (!nodeId){nodeId = selectedNodeID;}
	var node = GRAPH.getNode(nodeId);
	node.data.nodeSize = node.data.nodeSize / 1.1;
	addNodeToGraph(node.id,node.data);
	decreaseNodeSprings(node.id);
}	
		
function unPinNode(node)
{
	layout.pinNode(node, false);
	node.data.isPinned = false;
}
		

	

		
		
		
function PerformNodeStatFunctions(node)
{
		//procedurally execute stat-reachers...
		var reacherIndex = 0;
		var reachers = node.data.config.nodeStatReachers;
		if (reachers.length == 0){ExecuteNodeTransformers(node);}
		var fn_callback = function(){
			if (reacherIndex >= reachers.length){
				ExecuteNodeTransformers(node);
				return;
			}
			var reacherName = reachers[reacherIndex].functionName;
			reacherIndex = reacherIndex + 1;
			executeReacher(node.data, reacherName, fn_callback);
		};
		fn_callback();
}
		
function ExecuteNodeTransformers(node)
{
	var transformers = node.data.config.nodeTransformers;
			
	transformers.forEach(function(tranformer){
		switch (tranformer.name)
		{
			case "Petalize":
				/*petalize_image(dataNode, data, imageUrl, innerRadius, imageSize);*/
				petalize_image(node, tranformer.params[0], tranformer.params[1], tranformer.params[2], tranformer.params[3]);
				break;
			case "Ringulate":
				/*Ringulate(dataNode, data, imageUrl,  innerRadius, opacity, orientate);*/
				ringulate(node, tranformer.params[0]);
				break
		}
				
	});
}
		
function executeReacher(nodeData, reacherName, callback)
{
	var callWhenFinished = function(){callback();}
	switch(reacherName)
	{
		case "getRelationCounts": getRelationCounts(nodeData, callWhenFinished); break;
		default: callWhenFinished();
	}
}

function getNodeValueWithConstant(node, inputData){
	var x = node;
	var parts = inputData.split('.');
	parts.forEach(function (part){
		x = x[part];
	})
	return x;
}
		
function evaluateAugmentsAndUpdateNodeDisplay(config, nodeData)
{
	var nodeAugments = [];
	if (!config.startupOptions.nodeAugments){return;}
	config.startupOptions.nodeAugments.map(function (nconfig) {
		if (nconfig.nodeLabel == nodeData.labels[0]) {
			if (nconfig.property){ //...we need to check if it has the specified property
				if (hasProperty(nodeData.properties, nconfig.property)){
					if (nconfig.value){//...we need to check if it has the specified property value
						if (hasPropertyWithValue(nodeData.properties, nconfig.property, nconfig.value)){
							nodeAugments.push(nconfig.nodeDisplayBody);
						}
					}
					else{//, no value wanted, passed evaluation by having label and property name...
						nodeAugments.push(nconfig.nodeDisplayBody);
					}
				}
			}else{//, no property name wanted,, passed evaluation by having label...
				nodeAugments.push(nconfig.nodeDisplayBody);
			}
		}
	});		
	var finalDisplay = {};
	nodeAugments.forEach(function (nodeDisplayBody){
		for (var prop in nodeDisplayBody)
		{
			finalDisplay[prop] = nodeDisplayBody[prop];
		}
	})
	return finalDisplay;
}
		
//**********Generators**********
function addPetals()
{
	petalize(selectedNode, 15, 0, 20, '#002533');
}
		
function getCircumferenceCoordinates(itemCount, radius)
{
	var coords = [];
	for(var i = 0; i < itemCount; i++) {
		var x = 0 + radius * Math.cos(2 * Math.PI * (i) / itemCount);
		var y = 0 + radius * Math.sin(2 * Math.PI * (i) / itemCount);   
		coords.push({x:x, y:y});
	}
	return coords;
}
		
		
function petalize_shape(node, petalCount, petalShapeIndex, innerRadius, petalColor)
{
	var PETAL_SHAPES = [];
	PETAL_SHAPES.push('M 0.03840601,0.01972475 C 8.2867315,0.11675375 31.858718,-12.453976 31.025552,-0.98099125 29.886875,14.699041 -0.03542154,2.5583847 0.03840601,0.01972475 Z');
	var degreeInterval = 360 /petalCount;
	var coords = getCircumferenceCoordinates(petalCount, innerRadius);
	var degreePosition = 0;
	var petalArray = Viva.Graph.svg('g')
	for (var i = 0; i < petalCount; i++){	
		var petal = Viva.Graph.svg('g');
		var petalPath =  Viva.Graph.svg('path')
			.attr('d', PETAL_SHAPES[petalShapeIndex])
			.attr('fill',petalColor)
			.attr('opacity',0.5)
			.attr('transform','translate(' + coords[i].x + ',' + coords[i].y + ') rotate('+degreePosition+')');				
		petal.append(petalPath);
		petalArray.append(petal);
		degreePosition += degreeInterval;
	}
	node.data.UI.fullUI.insertBefore(petalArray, node.data.UI.bodyUI);
}
		
		
function petalize_image(node, inputData, imageUrl, innerRadius, size)
{
	var petalCount = 0;
	if (typeof(inputData) == "number"){
		petalCount = inputData;
	}
	else if (typeof(inputData) == "string"){
		petalCount = getNodeValueWithConstant(node, inputData)
	}
		
	var degreeInterval = (360/petalCount);
	var coords = getCircumferenceCoordinates(petalCount, innerRadius);
	var degreePosition = 0;
	var petalArray = Viva.Graph.svg('g')
	for (var i = 0; i < petalCount; i++){	
		var petal = Viva.Graph.svg('g');
		var petalPath = Viva.Graph.svg('image')
		//var petalPath = Viva.Graph.svg('cirlce')
				//.attr('r','10')
				.link(imageUrl)
				.attr('width', Number(size))
				.attr('height', Number(size))
				.attr('transform','translate(' + coords[i].x + ',' + coords[i].y + ') rotate('+(degreePosition + 20)+')');
		petal.append(petalPath);
		//petal.attr('transform','rotate(10)');
		petalArray.append(petal);
		//petalArray.attr('transform','rotate(-90)');
		degreePosition += degreeInterval;
	}
	node.data.UI.fullUI.insertBefore(petalArray, node.data.UI.displayTextUI);
}
function ringulate(node, inputData)
{
	var petalCount = 0;
	if (typeof(inputData) == "number"){
		petalCount = inputData;
	}
	else if (typeof(inputData) == "string"){
		petalCount = getNodeValueWithConstant(node, inputData)
	}
	var petalArray = Viva.Graph.svg('g')
	for (var i = 0; i < petalCount; i++){	
		var petal = Viva.Graph.svg('g');
		var petalPath = Viva.Graph.svg('circle')
					.attr('cx', 0) //...for circle
					.attr('cy', 0)//...for circle
					.attr('r',node.data.nodeSize + (i * 3))
					.attr('fill','transparent')//'#4dffc3')
					.attr('stroke',node.data.nodeColor)
					.attr('stroke-width',2)
		petal.append(petalPath);
		petalArray.append(petal);
	}
	node.data.UI.fullUI.insertBefore(petalArray, node.data.UI.bodyUI);
}
//********************************
		
function getRelationCounts(nodeData, callback)
{
			
	var updateIndicatorNode = function (toCount, fromCount){
				
		nodeData.stats.toEntityCount = toCount;
		nodeData.stats.fromEntityCount = fromCount;
		callback();
		//petalize(dataNode, dataNode.data.toEntityCount, 0, 10, '#0099ff');
		//petalize(dataNode, dataNode.data.fromEntityCount, 0, 20, '#ff6600');
		//petalize_image(dataNode, dataNode.data.toEntityCount, 'custom/server.svg', 10, '#0099ff');
		//petalize_image(dataNode, dataNode.data.fromEntityCount, 'custom/placeholder.svg', 30, '#0099ff');
	}
	Neo4jGetRelationCounts(nodeData.id, updateIndicatorNode);
}
		
function removeSubNode(subNode, updateSuperNode)
{
	if (updateSuperNode == true){
		subNode.superNodes.forEach(function(superNode,index){
			if (superNode){
				superNode.subNodes.map(function(sn, i){
					if (sn.id == subNode.id) {
						superNode.subNodes.splice(i,1);
					}
				})
			}
		})
	}
			
	subNode.data.fromLinks.forEach(function(link){GRAPH.removeLink(link.id)});
	subNode.data.toLinks.forEach(function(link){GRAPH.removeLink(link.id)});
	GRAPH.removeNode(subNode.id);			
}
		
function addSubNode(parentNode, id, color, displayLabel)
{
	//console.log('Node', GRAPH.getNode(id));
	var existingNode = GRAPH.getNode(id);
	if (existingNode)
		return;
	var subNodeData = new nodeDataType();
	subNodeData.nodeSize = 5;
	subNodeData.nodeType = 'subnode';
	subNodeData.id = id; //'sub' + parentNode.id;
	subNodeData.labels = ['subnode'];
	subNodeData.nodeColor = color;
	
	subNodeData.displayLabel = displayLabel;
	subNodeData.superNodes.push(parentNode);
	//CREATE NODE
	var subNode = addNodeToGraph(subNodeData.id,subNodeData);	
	parentNode.data.subNodes.push(subNode)
			
	//popout effect
	layout.pinNode(subNode, true);
	var pos = layout.getNodePosition(parentNode.id);
	binaryToggle = !binaryToggle;
	//layout.setNodePosition(subNode.id, pos.x + 10 * (binaryToggle)?-1:1, pos.y + 10* (binaryToggle)?-1:1);
	layout.setNodePosition(subNode.id, pos.x + 10 * ((binaryToggle)?-1:1), pos.y + 10* ((binaryToggle)?-1:1));
	layout.pinNode(subNode, false);

			
			
	var linkData = new linkDataType(parent.id, subNodeData.id, parent.id +' ' + subNodeData.id);
	linkData.linkType = 'sub';
	linkData.color = 'transparent';
	//linkData.fromNodeID = parent.id;
	//linkData.toNodeID = subNodeData.id;
	var toRelLink = GRAPH.addLink(parentNode.id, subNodeData.id, linkData);
	subNode.data.fromLinks.push(toRelLink);
	
	//Adjust length of link...
	var nodespring = layout.getSpring(parentNode.id, subNodeData.id);
	console.log('parentNode',parentNode);
	nodespring.length = parentNode.data.nodeSize; //30;

	//Adjust link bounciness...
	//var nodebody = layout.getBody(id);
	//nodebody.mass = 1;

}
		
		
function addSatelliteToNode(node)
{
	var rippleCircle = Viva.Graph.svg('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', node.data.nodeSize)
				.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
				.attr('stroke','red')
				.attr('stroke-width','5')
				.attr('stroke-opacity','0.7')
		var circletiny = Viva.Graph.svg('circle')
				.attr('cx', node.data.nodeSize)
				.attr('cy', node.data.nodeSize)
				.attr('r', 5)
				.attr('fill','red')//node.data.nodeColor)//'#4dffc3')
				.attr('stroke','red')
				.attr('opacity',0.5)
				.attr('stroke-width',0)
		var endArrow =  Viva.Graph.svg('path')
					.attr('stroke-width',0)
					.attr('d', 'M 0 -0.7 L 2 0 L 0 0.7 z')
					.attr('fill',node.data.nodeColor);
							
		var gSattelite = Viva.Graph.svg('g')
		gSattelite.append(circletiny);
		gSattelite.attr('dx',100);
		gSattelite.attr('dy',100);
		timeoutElements.push(new timeoutElementType(rippleCircle, 5, removeAnimatedElement));
		timeoutElements.push(new timeoutElementType(gSattelite, 60, removeAnimatedElement));
		node.data.UI.fullUI.insertBefore(rippleCircle, node.data.UI.bodyUI);
		node.data.UI.fullUI.insertBefore(gSattelite, node.data.UI.bodyUI);
		gSattelite.attr('class','rotatee');
		rippleCircle.attr('class','droplet');
}
		