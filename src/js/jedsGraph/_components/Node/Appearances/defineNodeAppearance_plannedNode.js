function defineNodeAppearance_plannedNode(node, ui) {
	var cnf = node.data.sourceConfig.displaySettings;
	var nodeConfig = node.data.config.nodeDisplayBody;
	if (nodeConfig.color) { node.data.nodeColor = nodeConfig.color; }

	nodeBody = Viva.Graph.svg('circle')
		.attr('cx', 0)//...for circle
		.attr('cy', 0)//...for circle
		.attr('r', node.data.nodeSize) //...for circle
		.attr('fill', node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
		.attr('stroke-width', 3)
		.attr('stroke', cnf.entityBorderColor == null ? node.data.nodeBorderColor : cnf.entityBorderColor)
	//.attr('stroke-opacity',0.5);
	if (cnf.haze == true) { nodeBody.attr('filter', 'url(#hazeEffect)'); } //haze
	if (cnf.rounded == true) { nodeBody.attr('fill', 'url(#gradRound)'); }
	if (!cnf.opaque == true) { nodeBody.attr('fill-opacity', node.data.nodeOpacity); }

	nodeBodyImage = Viva.Graph.svg('image')
		.attr('x', -node.data.nodeSize)
		.attr('y', -node.data.nodeSize)
		.attr('rx', node.data.nodeSize)
		.attr('width', node.data.nodeSize * 2)
		.attr('height', node.data.nodeSize * 2)
		.link(nodeConfig.image ? nodeConfig.image : '');
	if (cnf.rounded == true) { nodeBodyImage.attr('fill', 'url(#gradRound)'); }
	if (!cnf.opaque == true) { nodeBodyImage.attr('fill-opacity', node.data.nodeOpacity); }

	//Text elements...
	displayText = Viva.Graph.svg('text')
		.attr('y', 0)
		.attr('x', 0)
		.attr('fill', cnf.entityLabelColor)
		.attr('stroke-width', '0')
		.attr('font-family', 'Arial, Helvetica, sans-serif')
		.attr('font-size', '20')
		.text(node.data.displayLabel);


	popoutTextUI = Viva.Graph.svg('text')
		.attr('class', 'slideText')
		.attr('y', -node.data.nodeSize) //node.data.nodeSize/2 + 5)
		.attr('x', 0)// - node.data.displayLabel.length)
		.attr('fill', '#0077b3')
		.attr('stroke-width', '0')
		.attr('font-family', 'Arial, Helvetica, sans-serif')
		.attr('font-size', '10')
		.text('--');
	popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="50" dy="1.2em">', '</tspan>');

	popoutBodyUI = Viva.Graph.svg('rect')
		.attr('class', 'slideout')
		.attr('x', node.data.nodeSize / 2)
		.attr('y', -node.data.nodeSize)
		.attr('rx', node.data.nodeSize / 4)
		.attr('height', 0)
		.attr('fill', '#141414')
	if (!cnf.opaque == true) { popoutBodyUI.attr('fill-opacity', 0.3); }


	//var defs = graphics.getSvgRoot().append('defs');
	//defs.append(midMarker);

	var visDefs = '<defs>';
	visDefs += '<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
	visDefs += '<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
	//visDefs += '<radialGradient id="gradGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:#ffffff; stop-opacity:1" /><stop offset="100%" style="stop-color:#66e0ff;stop-opacity:0" /></radialGradient>';
	visDefs += '<radialGradient id="gradRound" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="80%" style="stop-color:rgb(' + node.data.nodeColorRGB.r + ',' + node.data.nodeColorRGB.g + ',' + node.data.nodeColorRGB.b + '); stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(' + (node.data.nodeColorRGB.r - 100) + ',' + (node.data.nodeColorRGB.g - 100) + ',' + (node.data.nodeColorRGB.b - 100) + ');stop-opacity:1" /></radialGradient>';
	visDefs += '</defs>';
	ui.innerHTML = visDefs;


	node.data.UI.fullUI = ui;
	node.data.UI.bodyUI = nodeBody;
	node.data.UI.imageUI = nodeBodyImage;
	node.data.UI.displayTextUI = displayText;
	node.data.UI.popoutBodyUI = popoutBodyUI;
	node.data.UI.popoutTextUI = popoutTextUI;

	//if (cnf.loadNodePopouts){ui.append(node.data.UI.bodyUI);}//else{ui.append(rectblank);}
	if (cnf.loadNodePopouts) { ui.append(node.data.UI.popoutBodyUI); }
	ui.append(node.data.UI.bodyUI);
	if (nodeConfig.image) { ui.append(node.data.UI.imageUI); }
	//ui.append(node.data.UI.focusUI);
	if (cnf.showLabels) { ui.append(node.data.UI.displayTextUI); }
	if (cnf.loadNodePopouts) { ui.append(node.data.UI.popoutTextUI); }

}