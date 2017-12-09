//Node methods

function applyPopoutEffectToNode(newNode, parentNodeId) {
	globals.layout.pinNode(newNode, true);
	var pos = globals.layout.getNodePosition(parentNodeId);
	var nodeRadius = Number(newNode.data.entityConfig.config.attributes["radius"]);
	globals.layout.setNodePosition(newNode.id,
		getRandomArbitrary(pos.x - nodeRadius / 2, pos.x + nodeRadius / 2),
		getRandomArbitrary(pos.y - nodeRadius / 2, pos.y + nodeRadius / 2)
	);
	globals.layout.pinNode(newNode, false);
}

function applyPopoutEffectToNodesById(parentNodeId, newNodeId) {
	var newNode = globals.GRAPH.getNode(newNodeId);
  globals.layout.pinNode(newNode, true);
	var pos = globals.layout.getNodePosition(parentNodeId);
	var nodeRadius = Number(newNode.data.entityConfig.config.attributes["radius"]);
	globals.layout.setNodePosition(newNode.id,
		getRandomArbitrary(pos.x - nodeRadius / 2, pos.x + nodeRadius / 2),
		getRandomArbitrary(pos.y - nodeRadius / 2, pos.y + nodeRadius / 2)
	);
	globals.layout.pinNode(newNode, false);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function fixTextWidth4Node(node)
{
	
	//adjust display text...
	if (node.data.UI.bodyUI && node.data.UI.displayTextUI)
	{
		//if (!node.data.sourceConfig.displaySettings.showLabels) {return;}
		var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]); //UI.fullUI.attr('r');//nodeUI.attr('r');
		var widthOfNode = Number(node.data.UI.bodyUI.getBBox().width);
		var minWidth = widthOfNode - widthOfNode * 0.1;
		var widthOfText = Number(node.data.UI.displayTextUI.getBBox().width);
		var text = node.data.UI.displayTextUI.text();
		var heightOfText = Number(node.data.UI.displayTextUI.getBBox().height);
		if (!text || text.length == 0) {return;}

		if (node.data.entityConfig.config.attributes.labelText["labelPosition"]) {
			switch(node.data.entityConfig.config.attributes.labelText["labelPosition"]){
				case "above":
					node.data.UI.displayTextUI.attr('x', -widthOfText/2 ); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', -heightOfText - nodeRadius/3);
					break;
				case "under":
					node.data.UI.displayTextUI.attr('x', -widthOfText/2); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', nodeRadius + heightOfText);
					break;
				case "center":
					node.data.UI.displayTextUI.attr('x', -widthOfText / 2); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', heightOfText / 3);
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
			var sizingConfigValue = node.data.entityConfig.config.attributes.labelText["labelSizing"];
			if (widthOfText > minWidth)
			{
				while (widthOfText >= minWidth)
				{
					failer++;
					if (sizingConfigValue == 'hyphenate')
					{
						text = (text).substring(0, text.length - 2) + "'";
						node.data.UI.displayTextUI.text(text);
					}
					else if (sizingConfigValue == 'fontsize') {
						var fontsize = Number(node.data.UI.displayTextUI.attr('font-size'));
						node.data.UI.displayTextUI.attr('font-size', fontsize * 0.9);
					}
					else
					{
						return;
					};
					widthOfText = Number(node.data.UI.displayTextUI.getBBox().width);
					if (failer > 1000) return;
				}
			}
			else if (sizingConfigValue == 'fontsize')
			{	failer = 0;		
						
				while (widthOfText < minWidth - widthOfText)
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
		if (node.data.UI.popoutTextUI && node.data.UI.popoutTextUI.childNodes.length > 0){
			boxheight = Number(node.data.UI.popoutTextUI.getBBox().height + 20);
			boxwidth = Number(node.data.UI.popoutTextUI.getBBox().width + 30);
		}
		var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
		node.data.UI.popoutBodyUI.attr('height',boxheight);
		node.data.UI.fullUI.attr('style','width:'+boxwidth + 'px;');
		node.data.UI.popoutBodyUI.attr('x', nodeRadius + 10)
		node.data.UI.popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="'+ (nodeRadius + 15) +'" dy="1.2em">', '</tspan>');
	}
			
}
		

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function showOnNode(nodeId, text)
{
	var node = getExistingNode(nodeId);
	node.data.displayLabel = text;
	refreshNodeAppearance(nodeId);
}
		
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeSprings(nodeid)
{
	if (!nodeid){nodeid=globals.selectedNodeID;}
	var node = getExistingNode(nodeid);
			
	node.data.toNodes.forEach(function(toNode){
		var nodespring = globals.layout.getSpring(nodeid, toNode.id);
		nodespring.length += 10;
	});
	node.data.fromNodes.forEach(function(toNode){
		var nodespring = globals.layout.getSpring(toNode.id, nodeid);
		nodespring.length += 10;
	});
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeDepth(node, addDepthValue)
{
    //set defaults...
	if (!node){node=globals.selectedNode;}
	if (!addDepthValue){addDepthValue = 0.5;}
                      
    //perform transformations...
	node.data.depth += addDepthValue;

	refreshNodesDepths();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeDepth(node)
{
	if (!node){node=globals.selectedNode;}
	//nodeUI = globals.graphics.getNodeUI(nodeid);
	//nodeUI.attr('depth', Number(nodeUI.attr('depth')) - 0.1);

}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeSprings(nodeid)
{
	if (!nodeid){nodeid=globals.selectedNodeID;}
	var node = getExistingNode(nodeid);
			
	node.data.toNodes.forEach(function(toNode){
		var nodespring = globals.layout.getSpring(nodeid, toNode.id);
		nodespring.length -= 10;
	});
	node.data.fromNodes.forEach(function(toNode){
		var nodespring = globals.layout.getSpring(toNode.id, nodeid);
		nodespring.length -= 10;
	});
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeMass(nodeid)
{
	if (!nodeid){nodeid=globals.selectedNodeID;}
	var nodebod = globals.layout.getBody(nodeid);
	nodebod.mass++;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeMass(nodeid)
{
	if (!nodeid){nodeid=globals.selectedNodeID;}
	var nodebod = globals.layout.getBody(nodeid);
	nodebod.mass--;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function uncheckNode(node){
	if(node.data.UI.checkUI){
		node.data.UI.checkUI.remove();
		node.data.UI.checkUI = undefined;
	}
	if (globals.currentTheme.sourceConfig.displaySettings.loadNodePopouts){
		if(node.data.UI.popoutTextUI){node.data.UI.popoutTextUI.attr('class','slidetext');}
	}
}
		
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function highlightSelectedNode(nodeId) {
		   
	if (globals.selectedNodeID != ''){
		if (nodeId == globals.selectedNodeID) {return;} //...we've re-clicked the same node
		//DISPOSE PREVIOUS SELECTION
		//remove all sub nodes...
		if (globals.config_ext.viewOptions.subnodes.relations=="ifany"){
			while (globals.selectedNode.data.subNodes.length > 0){
				removeSubNode(globals.selectedNode.data.subNodes[0], false);
				globals.selectedNode.data.subNodes.splice(0,1);
			}
		};
		if (globals.currentTheme.sourceConfig.displaySettings.showRelationships == "on-highlight" && !globals.interactionOptions.checkNodes){
			//Remove previous selections visuals
			var relevantLinks = globals.selectedNode.data.toLinks.concat(globals.selectedNode.data.fromLinks);
			relevantLinks.forEach(function(link){
				new LinkHelper().UnHighlightLink(link,false);
			});
		}
   
		if (globals.bRelate == true)
		{
			if (nodeId != globals.selectedNodeID){
				submitCreateRelation(globals.selectedNodeID, nodeId)
			}
			globals.bRelate=false;
		}
			   
		if (globals.bPlanRelate==true)
		{
			if (nodeId != globals.selectedNodeID){
				submitCreateRelation(globals.selectedNodeID, nodeId, true)
			}
			globals.bPlanRelate=false;
		}
			   
	}

	var node = globals.GRAPH.getNode(nodeId);
	globals.selectedNodeID = nodeId;
	globals.selectedNodeData = node.data;
	globals.selectedNode = node;

	if (globals.interactionOptions.checkNodes){
		checkNode(node);
	}
	else{ //...not checking nodes...
		globals.checkedNodes.forEach(function(nodex){
			uncheckNode(nodex);
		});
		globals.checkedNodes = [];
	}
		   
	//Display relationship details...
	node.data.toLinks.forEach(function(l){
    new LinkHelper().HighlightLink(l,true)
  });
	node.data.fromLinks.forEach(function(l){
    new LinkHelper().HighlightLink(l,true)
  });

	addSelectionGraphic(node);

	loadNodePopout(node, node.data.sourceConfig);

	//showNodeDetailsInToolPanel(node);	

	//show sub nodes...
	if (globals.config_ext.viewOptions.subnodes.relations=="ifany"){
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
	node.data.UI.fullUI.insertBefore(globals.CommonUI.focusUI, node.data.UI.bodyUI);
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	node.data.UI.focusUI = globals.CommonUI.focusUI
		.attr('r', nodeRadius + (nodeRadius / 3))//...for circle
		.attr('stroke-width', nodeRadius / 5);

	node.data.UI.focusUI.attr('class', 'selectionRingOut');
	setTimeout(function () {
		node.data.UI.focusUI.attr('class', 'selectionRingIn');
	}, 200);
	
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function checkNode(node)
{
	globals.checkedNodes.push(node);
		//if(node.data.UI.fullUI){node.data.UI.fullUI.attr('stroke','#99ff33');}
	if(!node.data.UI.checkUI){
		var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
			globals.CommonUI.checkUI
				.attr('r', nodeRadius + nodeRadius/4)//...for circle
				.attr('stroke-width',nodeRadius/5);
			node.data.UI.checkUI = globals.CommonUI.checkUI.cloneNode();
			node.data.UI.fullUI.insertBefore(node.data.UI.checkUI, node.data.UI.bodyUI);
		}

		if (globals.currentTheme.sourceConfig.displaySettings.loadNodePopouts){
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
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	globals.CommonUI.popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="'+( nodeRadius + 15)+'" dy="1.2em">', '</tspan>');
			
	node.data.UI.popoutBodyUI = globals.CommonUI.popoutBodyUI.cloneNode(true);
	node.data.UI.fullUI.append(node.data.UI.popoutBodyUI);
			
	node.data.UI.popoutTextUI = globals.CommonUI.popoutTextUI.cloneNode(true);
	node.data.UI.fullUI.append(node.data.UI.popoutTextUI);

	fixTextWidth4Node(node);

	node.data.UI.popoutBodyUI.attr('class', 'slidebody');
	node.data.UI.popoutTextUI.attr('class', 'slidetext');
}

function refreshNodeAppearance(nodeId){
	var node = globals.GRAPH.getNode(nodeId?nodeId:globals.selectedNode.id);
  addDataNode(node.id, node.data);
  applyDepth(node);
  return node;
}

function applyDepth(node){
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
	for (var n = 0; n < globals.nodeList.length; n++) {
		var inserted = false;
		for (var z = 0; z < nodeZOrder.length; z++) {
		    if (globals.nodeList[n].data.depth < nodeZOrder[z].data.depth) {
		        nodeZOrder.splice(z, 0, globals.nodeList[n]);
		        inserted = true;
		        break;
		    }
		}
		if (!inserted) { nodeZOrder.push(globals.nodeList[n]); }
	}
	nodeZOrder.forEach(function (znode) { refreshNodeAppearance(znode.id) });
}
			
function increaseNodeSize(nodeId)
{
	if (!nodeId){nodeId = globals.selectedNodeID;}
	var node = globals.GRAPH.getNode(nodeId);
	var nodeRadius = Number( node.data.entityConfig.config.attributes["radius"]);
	nodeRadius = nodeRadius + 50/nodeRadius;
	//node.data.UI.popoutBodyUI.attr('x', nodeRadius/2)
    //            .attr('y', -nodeRadius)
	//node.data.UI.popoutBodyUI.attr('x', nodeRadius/2)
    //            .attr('y', -nodeRadius)
						
	node.data.UI.bodyUI.attr('r', nodeRadius) //...for circle
	node.data.UI.imageUI.attr('x', -nodeRadius)
				.attr('y', -nodeRadius)
				.attr('rx', nodeRadius)
				.attr('width', nodeRadius * 2)
				.attr('height', nodeRadius * 2)
			
	node.data.toLinks.forEach(function (link){
		link.data.UI.fullUI.attr('fromNodeRadius', nodeRadius);
	});
	node.data.fromLinks.forEach(function (link){
		link.data.UI.fullUI.attr('toNodeRadius', nodeRadius);
	});

	increaseNodeSprings(node.id);
	fixTextWidth4Node(node);
		
}		
		
function decreaseNodeSize(nodeId)
{
	if (!nodeId){nodeId = globals.selectedNodeID;}
	var node = globals.GRAPH.getNode(nodeId);
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	node.data.entityConfig.config.attributes["radius"] = nodeRadius / 1.1;
	addNodeToGraph(node.id,node.data);
	decreaseNodeSprings(node.id);
}	
		
function unPinNode(node)
{
	globals.layout.pinNode(node, false);
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
	petalize(globals.selectedNode, 15, 0, 20, '#002533');
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
					.attr('r', Number(node.data.entityConfig.config.attributes["radius"]) + (i * 3))
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
	globals.dataService.GetRelationCounts(nodeData.id, updateIndicatorNode);
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
			
	subNode.data.fromLinks.forEach(function(link){globals.GRAPH.removeLink(link.id)});
	subNode.data.toLinks.forEach(function(link){globals.GRAPH.removeLink(link.id)});
	globals.GRAPH.removeNode(subNode.id);			
}
		
function addSubNode(parentNode, id, color, displayLabel)
{
	//console.log('Node', globals.GRAPH.getNode(id));
	var existingNode = globals.GRAPH.getNode(id);
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
	globals.layout.pinNode(subNode, true);
	var pos = globals.layout.getNodePosition(parentNode.id);
	globals.binaryToggle = !globals.binaryToggle;
	//globals.layout.setNodePosition(subNode.id, pos.x + 10 * (globals.binaryToggle)?-1:1, pos.y + 10* (globals.binaryToggle)?-1:1);
	globals.layout.setNodePosition(subNode.id, pos.x + 10 * ((globals.binaryToggle)?-1:1), pos.y + 10* ((globals.binaryToggle)?-1:1));
	globals.layout.pinNode(subNode, false);

			
			
	var linkData = new linkDataType(parent.id, subNodeData.id, parent.id +' ' + subNodeData.id);
	linkData.linkType = 'sub';
	linkData.color = 'transparent';
	//linkData.fromNodeID = parent.id;
	//linkData.toNodeID = subNodeData.id;
	var toRelLink = globals.GRAPH.addLink(parentNode.id, subNodeData.id, linkData);
	subNode.data.fromLinks.push(toRelLink);
	
	//Adjust length of link...
	var nodespring = globals.layout.getSpring(parentNode.id, subNodeData.id);
	console.log('parentNode',parentNode);
	nodespring.length = Number(parentnode.data.entityConfig.config.attributes["radius"]); //30;

	//Adjust link bounciness...
	//var nodebody = globals.layout.getBody(id);
	//nodebody.mass = 1;

}
		

		