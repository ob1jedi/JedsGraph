//====== NODE VISUAL DEFINITIONS ========================================================================================================

function defineNodes()
{
	//Node elements...
	graphics.node(function(node) {		
		ui = Viva.Graph.svg('g');
		var cnf = node.data.sourceConfig.displaySettings;
		if (cnf.shadow) {ui.attr('filter','url(#shadowEffect)');} //shadow
		//Image elements...
		//img = Viva.Graph.svg('image')
		//     .attr('width', nodeSize)
		//     .attr('height', nodeSize)
		//     .link('https://secure.gravatar.com/avatar/' + node.data),
		if (node.data.nodeType == 'data')
		{
			var nodeConfig = node.data.config.nodeDisplayBody;
			if(nodeConfig.color){node.data.nodeColor = nodeConfig.color;}
			//Circle elements NODE-CIRCLE
			//circleGlow = Viva.Graph.svg('circle')
			//	.attr('cx', 0)
			//	.attr('cy', 0)
			//	.attr('r', node.data.nodeSize*1.7)
			//	.attr('fill','transparent');//node.data.nodeColor)//'#4dffc3')
			//if (cnf.glow) {circleGlow.attr('fill','url(#gradGlow)');}
			//if (!cnf.opaque) {circleGlow.attr('fill-opacity',0.5);}

			//rectblank = Viva.Graph.svg('rect')
			//	.attr('width', 0)
			//	.attr('height', 0);
				
			nodeBody = Viva.Graph.svg(cnf.entityShape)
				.attr('cx', 0)//...for circle
				.attr('cy', 0)//...for circle
				.attr('r', node.data.nodeSize + (node.data.nodeIndex +1) *1.5) //...for circle
				.attr('fill',node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
				.attr('stroke-width',3)
				.attr('stroke', cnf.entityBorderColor==null?node.data.nodeBorderColor:currentTheme.entityBorderColor)
				
				//.attr('stroke-opacity',0.5);
				if (cnf.entityShape == "rect") {
					nodeBody.attr('width',node.data.nodeSize * 3);
					nodeBody.attr('height',node.data.nodeSize * 2);
					nodeBody.attr('rx',node.data.nodeSize/4);
					nodeBody.attr('x',-(node.data.nodeSize*3/2));
					nodeBody.attr('y',-(node.data.nodeSize*2/2));
				}
				if (cnf.haze == true) {nodeBody.attr('filter','url(#hazeEffect)');} //haze
				if (cnf.glass == true) {nodeBody.attr('fill','url(#gradGlass)');}
				if (cnf.rounded == true) {nodeBody.attr('fill','url(#gradRound)');}
				if (!cnf.opaque == true) {nodeBody.attr('fill-opacity',cnf.entityOpacity);}
			
			nodeBodyImage = Viva.Graph.svg('image')
				.attr('x', -node.data.nodeSize)
				.attr('y', -node.data.nodeSize)
				.attr('rx', node.data.nodeSize)
				.attr('width', node.data.nodeSize * 2)
				.attr('height', node.data.nodeSize * 2)
				.link(nodeConfig.image?nodeConfig.image:'');
				if (cnf.rounded == true) {nodeBodyImage.attr('fill','url(#gradRound)');}
				if (!cnf.opaque == true) {nodeBodyImage.attr('fill-opacity',node.data.nodeOpacity);}
				
			//Text elements...
			displayText = Viva.Graph.svg('text')
				.attr('y', 0) 
				.attr('x', 0)
				.attr('fill',cnf.entityLabelColor)
				.attr('stroke-width','0')
				.attr('font-family',cnf.entityFont.family)
				.attr('font-weight',cnf.entityFont.weight)
				.attr('font-size','20')
				.text(node.data.displayLabel);
				if (cnf.textHaze == true) {displayText.attr('filter','url(#darkHazeEffect)');} //haze
				
			circleTextPath =  Viva.Graph.svg('path')
					.attr('id', 'npath_' + node.data.id)
					.attr('d', 'M'+(-node.data.nodeSize-3)+',' + (-1.5) +' a1,1 0 1,1 '+ (node.data.nodeSize * 2 + 6) +',0')
					.attr('fill', 'transparent')
					.attr('stroke-width', 0)
					.attr('stroke', 'black')
					
			circleText = Viva.Graph.svg('text')
				.attr('y', 0) 
				.attr('x', 0)
				.attr('fill','black')
				.attr('stroke-width','0')
				//.attr('font-family',cnf.entityFont.family)
				//.attr('font-weight',cnf.entityFont.weight)
				.attr('font-size','10')
			circleText.innerHTML += '<textPath xlink:href="#npath_' + node.data.id + '">'+node.data.circleText+'</textPath>';
			//console.log(node);
			//circleTextPathLink =  Viva.Graph.svg('textPath')
			//		.attr('xlink:href'="#myTextPath")
			//		.attr('d', 'M75,20 a1,1 0 0,0 100,0')
				/*
			popoutTextUI = Viva.Graph.svg('text')
				.attr('class', 'slidetext')
				.attr('y', -node.data.nodeSize) //node.data.nodeSize/2 + 5)
				.attr('x', 200)// - node.data.displayLabel.length)
				.attr('fill',cnf.entityPopoutTextColor)
				.attr('stroke-width','0')
				.attr('font-family','Arial, Helvetica, sans-serif')
				.attr('font-size','10')
				.text('--');
			popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="50" dy="1.2em">', '</tspan>');

			popoutBodyUI = Viva.Graph.svg('rect')
				.attr('class', 'slidebody')
				.attr('x', node.data.nodeSize/2)
				.attr('y', -node.data.nodeSize)
				.attr('rx', 7)
				.attr('height', 0)
				.attr('fill','#141414')
				.attr('width','20%')

			if (!cnf.opaque) {popoutBodyUI.attr('fill-opacity',0.3);}
			*/
			
			//var defs = graphics.getSvgRoot().append('defs');
			//defs.append(midMarker);
				
			var visDefs = '<defs>';
			visDefs += '<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
			visDefs += '<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
			visDefs += '<linearGradient id="gradGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#606768" stop-opacity="0.3"/><stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="28%" stop-color="#000000" stop-opacity="0.3"/><stop offset="73%" stop-color="#000000" stop-opacity="0.3"/><stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/><stop offset="97%" stop-color="#000000" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0.3"/></linearGradient>';
			//visDefs += '<linearGradient id="coloredGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#606768" stop-opacity="0.3"/><stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="28%" stop-color="#000000" stop-opacity="0.3"/><stop offset="73%" stop-color="#000000" stop-opacity="0.3"/><stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/><stop offset="97%" stop-color="#000000" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0.3"/></linearGradient>';
			visDefs += '<radialGradient id="gradRound" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="80%" style="stop-color:rgb('+node.data.nodeColorRGB.r+','+node.data.nodeColorRGB.g+','+node.data.nodeColorRGB.b+'); stop-opacity:1" /><stop offset="100%" style="stop-color:rgb('+(node.data.nodeColorRGB.r-100) +','+(node.data.nodeColorRGB.g-100)+','+(node.data.nodeColorRGB.b-100)+');stop-opacity:1" /></radialGradient>';
			visDefs += '</defs>'; 				
			ui.innerHTML = visDefs;
			
			//var defs = graphics.getSvgRoot().append('defs');
			//defs.append(circleTextPath);
				
			
			ui.attr('class', 'datanode')
			
			node.data.UI.fullUI = ui;
			node.data.UI.bodyUI = nodeBody;
			node.data.UI.imageUI = nodeBodyImage;
			node.data.UI.displayTextUI = displayText;
			node.data.UI.circleTextPath = circleTextPath;
			node.data.UI.circleText = circleText;
			//node.data.UI.popoutBodyUI = popoutBodyUI;
			//node.data.UI.popoutTextUI = popoutTextUI;

			//if (cnf.loadNodePopouts){ui.append(node.data.UI.bodyUI);}//else{ui.append(rectblank);}
			//if (cnf.loadNodePopouts){ui.append(node.data.UI.popoutBodyUI);}
			ui.append(node.data.UI.bodyUI);
			
			if (cnf.showCircleText){
				ui.append(node.data.UI.circleTextPath);
				ui.append(node.data.UI.circleText);
			}
			if (nodeConfig.image){ui.append(node.data.UI.imageUI);}
			//ui.append(node.data.UI.focusUI);
			if (cnf.showLabels){ui.append(node.data.UI.displayTextUI);}
			//if (cnf.loadNodePopouts){ui.append(node.data.UI.popoutTextUI);}
			
		//NODE EVENTS
			// events (http://www.w3.org/TR/SVG/interact.html#SVGEvents ),
			// including mouse events:
			$(ui).mousedown(function() { // MOUSE CLICK
				highlightSelectedNode(node.id);
				layout.pinNode(node, true);
				node.data.isPinned = true;
			}),
			//$(ui).mousedown(function() { // MOUSE CLICK
				//detailsUI.text = node.data.properties[0];
				//refreshNodeAppearance(detailsUI.attr('nodeid'));				
			//}),
			$(ui).dblclick(function() { // MOUSE CLICK
				Neo4jFetchEntitiesForNode(node.id, node.data.sourceConfig);	

		
			}),
			$(ui).hover(function() { // MOUSE HOVER
				if (viewOptions.highlightRelated){highlightRelatedNodes(node.id, true);}
				if (viewOptions.highlightdescendants){highlightdescendantNodes(node.id, true);}
				if (viewOptions.highlightAncestors){highlightAncestorNodes(node.id, true);}
			}, function() { // mouse out
				if (viewOptions.highlightRelated){highlightRelatedNodes(node.id, false);}
				if (viewOptions.highlightdescendants){highlightdescendantNodes(node.id, false);}
				if (viewOptions){highlightAncestorNodes(node.id, false);}
			});

		}
		else if (node.data.nodeType == 'window')
		//====== WINDOW NODES ========================================================================================================
		{

			/*
			//Circle elements NODE-CIRCLE
			circleGlow = Viva.Graph.svg('rect')
				.attr('x', -node.data.nodeSize *1.5)//...for rect
				.attr('y', -node.data.nodeSize*1.5)//...for rect
				.attr('width', node.data.width)//...for rect
				.attr('height', node.data.height)//...for rect
				.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
				.attr('fill','url(#gradGlow)');

			windowBody = Viva.Graph.svg('rect')
				.attr('x', -node.data.nodeSize *1.5)//...for rect
				.attr('y', -node.data.nodeSize*1.5)//...for rect
				.attr('rx', node.data.nodeSize/4)//...for rect
				.attr('width', node.data.width)//...for rect
				.attr('height', node.data.height)//...for rect
				.attr('stroke-width','5')
				.attr('stroke-opacity','1')
				.attr('stroke-color','white')
			
			windowSelected = Viva.Graph.svg('rect')
				.attr('width','0')
				.attr('height','0');
				
			//Text elements...
			windowText = Viva.Graph.svg('text')
				.attr('y', -30) //node.data.nodeSize/2 + 5)
				.attr('x', node.data.nodeSize)// - node.data.displayLabel.length)
				.attr('fill','deepskyblue')
				.attr('stroke-width','0')
				.attr('font-family','Arial, Helvetica, sans-serif')
				.attr('font-size','10')
				.text(node.data.displayLabel);

			$(ui).click(function() { // MOUSE CLICK				
				//highlightSelectedNode(node.id);
				//layout.pinNode(node, true);
				//node.data.isPinned = true;
				
			}),
			ui.append(circleGlow);
			ui.append(windowBody);
			ui.append(windowSelected);
			ui.append(windowText);
			//ui.attr('id','NodeWindowX')
			ui.attr('id', node.id)
			//ui.attr('class','nodeWindow2');
			ui.attr('position', 'absolute');
			*/
			
			/*
			//processing window node...
			if (node.id == 'backgroundImage')
			{
				staticBackground = Viva.Graph.svg('image')
					.attr('nodetype', 'window')
					.attr('x', 0)
					.attr('y', 0)
					.attr('width', 500)
					.attr('height', 500)
					.link('custom/map.jpg');
				ui.append(staticBackground);
			}*/
		}
		//====== INDICATOR NODES ========================================================================================================
		else if (node.data.nodeType == 'subnode')
		{					
			var nodeConfig = node.data.config.nodeDisplayBody;
			if(nodeConfig.color){node.data.nodeColor = nodeConfig.color;}
			
			nodeBody = Viva.Graph.svg('circle')
				.attr('cx', 0)//...for circle
				.attr('cy', 0)//...for circle
				.attr('r', node.data.nodeSize) //...for circle
				.attr('fill',node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
				.attr('stroke-width',3)
				.attr('stroke', node.data.nodeColor)
			nodeBodyImage = Viva.Graph.svg('image')
				.attr('x', -node.data.nodeSize)
				.attr('y', -node.data.nodeSize)
				.attr('rx', node.data.nodeSize)
				.attr('width', node.data.nodeSize * 2)
				.attr('height', node.data.nodeSize * 2)
				.link(nodeConfig.image?nodeConfig.image:'');
				if (cnf.rounded) {nodeBodyImage.attr('fill','url(#gradRound)');}
				if (!cnf.opaque) {nodeBodyImage.attr('fill-opacity',node.data.nodeOpacity);}
				
			//Text elements...
			displayText = Viva.Graph.svg('text')
				.attr('y', 0) 
				.attr('x', 0)
				.attr('fill','black')
				.attr('stroke-width','0')
				.attr('font-family','Arial, Helvetica, sans-serif')
				.attr('font-size','20')
				.text(node.data.displayLabel);

			node.data.UI.fullUI = ui;
			node.data.UI.bodyUI = nodeBody;
			node.data.UI.imageUI = nodeBodyImage;
			node.data.UI.displayTextUI = displayText;

			ui.append(node.data.UI.bodyUI);
			if (nodeConfig.image){ui.append(node.data.UI.imageUI);}
			if (cnf.showLabels){ui.append(node.data.UI.displayTextUI);}
			
		//NODE EVENTS
			// events (http://www.w3.org/TR/SVG/interact.html#SVGEvents ),
			// including mouse events:
			$(ui).mousedown(function() { // MOUSE CLICK
				//highlightSelectedNode(node.id);
				node.data.UI.fullUI.attr('dragging', 'true');
			}),

			$(ui).mouseup(function() { // MOUSE CLICK
				node.data.UI.fullUI.attr('dragging', 'false');
				node.data.UI.fullUI.children[0].attr('r', node.data.nodeSize);
				fixTextWidth4Node(node);
				//var parentPos = layout.getNodePosition(node.data.superNodes[0].id);
				//var thisPos = layout.getNodePosition(node.id);
				//var distance = calculateDistance(parentPos, thisPos);
				//increaseNodeSize(node)
				//highlightSelectedNode(node.id);
			}),
			
			$(ui).dblclick(function() { // MOUSE CLICK
				//Neo4jFetchEntitiesForNode();				
			}),
			$(ui).hover(function() { // MOUSE HOVER
				//if (viewOptions.highlightRelated){highlightRelatedNodes(node.id, true);}
				//if (viewOptions.highlightdescendants){highlightdescendantNodes(node.id, true);}
				//if (viewOptions.highlightAncestors){highlightAncestorNodes(node.id, true);}
			}, function() { // mouse out
				//if (viewOptions.highlightRelated){highlightRelatedNodes(node.id, false);}
				//if (viewOptions.highlightdescendants){highlightdescendantNodes(node.id, false);}
				//if (viewOptions){highlightAncestorNodes(node.id, false);}
			});
			
			if (node.data.superNodes[0]){ui.attr('parentnodeid', node.data.superNodes[0].id)}
		}
		
		//====== PLANNED NODES ========================================================================================================
		if (node.data.nodeType == 'planned')
		{
			var nodeConfig = node.data.config.nodeDisplayBody;
			if(nodeConfig.color){node.data.nodeColor = nodeConfig.color;}

			nodeBody = Viva.Graph.svg('circle')
				.attr('cx', 0)//...for circle
				.attr('cy', 0)//...for circle
				.attr('r', node.data.nodeSize) //...for circle
				.attr('fill',node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
				.attr('stroke-width',3)
				.attr('stroke', cnf.entityBorderColor==null?node.data.nodeBorderColor:cnf.entityBorderColor)
				//.attr('stroke-opacity',0.5);
				if (cnf.haze == true) {nodeBody.attr('filter','url(#hazeEffect)');} //haze
				if (cnf.rounded == true) {nodeBody.attr('fill','url(#gradRound)');}
				if (!cnf.opaque == true) {nodeBody.attr('fill-opacity',node.data.nodeOpacity);}
			
			nodeBodyImage = Viva.Graph.svg('image')
				.attr('x', -node.data.nodeSize)
				.attr('y', -node.data.nodeSize)
				.attr('rx', node.data.nodeSize)
				.attr('width', node.data.nodeSize * 2)
				.attr('height', node.data.nodeSize * 2)
				.link(nodeConfig.image?nodeConfig.image:'');
				if (cnf.rounded == true) {nodeBodyImage.attr('fill','url(#gradRound)');}
				if (!cnf.opaque == true) {nodeBodyImage.attr('fill-opacity',node.data.nodeOpacity);}
				
			//Text elements...
			displayText = Viva.Graph.svg('text')
				.attr('y', 0) 
				.attr('x', 0)
				.attr('fill',cnf.entityLabelColor)
				.attr('stroke-width','0')
				.attr('font-family','Arial, Helvetica, sans-serif')
				.attr('font-size','20')
				.text(node.data.displayLabel);
				
				
			popoutTextUI = Viva.Graph.svg('text')
				.attr('class', 'slideText')
				.attr('y', -node.data.nodeSize) //node.data.nodeSize/2 + 5)
				.attr('x', 0)// - node.data.displayLabel.length)
				.attr('fill','#0077b3')
				.attr('stroke-width','0')
				.attr('font-family','Arial, Helvetica, sans-serif')
				.attr('font-size','10')
				.text('--');
			popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="50" dy="1.2em">', '</tspan>');

			popoutBodyUI = Viva.Graph.svg('rect')
				.attr('class', 'slideout')
				.attr('x', node.data.nodeSize/2)
				.attr('y', -node.data.nodeSize)
				.attr('rx', node.data.nodeSize/4)
				.attr('height', 0)
				.attr('fill','#141414')
			if (!cnf.opaque == true) {popoutBodyUI.attr('fill-opacity',0.3);}
			
			
			//var defs = graphics.getSvgRoot().append('defs');
			//defs.append(midMarker);
				
			var visDefs = '<defs>';
			visDefs += '<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
			visDefs += '<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
			//visDefs += '<radialGradient id="gradGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:#ffffff; stop-opacity:1" /><stop offset="100%" style="stop-color:#66e0ff;stop-opacity:0" /></radialGradient>';
			visDefs += '<radialGradient id="gradRound" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="80%" style="stop-color:rgb('+node.data.nodeColorRGB.r+','+node.data.nodeColorRGB.g+','+node.data.nodeColorRGB.b+'); stop-opacity:1" /><stop offset="100%" style="stop-color:rgb('+(node.data.nodeColorRGB.r-100) +','+(node.data.nodeColorRGB.g-100)+','+(node.data.nodeColorRGB.b-100)+');stop-opacity:1" /></radialGradient>';
			visDefs += '</defs>'; 
			ui.innerHTML = visDefs;
			
			
			node.data.UI.fullUI = ui;
			node.data.UI.bodyUI = nodeBody;
			node.data.UI.imageUI = nodeBodyImage;
			node.data.UI.displayTextUI = displayText;
			node.data.UI.popoutBodyUI = popoutBodyUI;
			node.data.UI.popoutTextUI = popoutTextUI;

			//if (cnf.loadNodePopouts){ui.append(node.data.UI.bodyUI);}//else{ui.append(rectblank);}
			if (cnf.loadNodePopouts){ui.append(node.data.UI.popoutBodyUI);}
			ui.append(node.data.UI.bodyUI);
			if (nodeConfig.image){ui.append(node.data.UI.imageUI);}
			//ui.append(node.data.UI.focusUI);
			if (cnf.showLabels){ui.append(node.data.UI.displayTextUI);}
			if (cnf.loadNodePopouts){ui.append(node.data.UI.popoutTextUI);}
			
		//NODE EVENTS
			// events (http://www.w3.org/TR/SVG/interact.html#SVGEvents ),
			// including mouse events:
			$(ui).mousedown(function() { // MOUSE CLICK
				highlightSelectedNode(node.id);
				layout.pinNode(node, true);
				node.data.isPinned = true;
			}),
			//$(ui).mousedown(function() { // MOUSE CLICK
				//detailsUI.text = node.data.properties[0];
				//refreshNodeAppearance(detailsUI.attr('nodeid'));				
			//}),
			$(ui).dblclick(function() { // MOUSE CLICK
				Neo4jFetchEntitiesForNode(node.id, node.data.sourceConfig);				
			}),
			$(ui).hover(function() { // MOUSE HOVER
				if (viewOptions.highlightRelated){highlightRelatedNodes(node.id, true);}
				if (viewOptions.highlightdescendants){highlightdescendantNodes(node.id, true);}
				if (viewOptions.highlightAncestors){highlightAncestorNodes(node.id, true);}
			}, function() { // mouse out
				if (viewOptions.highlightRelated){highlightRelatedNodes(node.id, false);}
				if (viewOptions.highlightdescendants){highlightdescendantNodes(node.id, false);}
				if (viewOptions){highlightAncestorNodes(node.id, false);}
			});
		}
		
		ui.attr('depth', 5);
		ui.attr('class','node');
		ui.attr('nodeSize',node.data.nodeSize);
		ui.attr('nodeid',node.id);
		ui.attr('dragging', false);
		ui.attr('nodetype',node.data.nodeType);
		return ui;
	});
}