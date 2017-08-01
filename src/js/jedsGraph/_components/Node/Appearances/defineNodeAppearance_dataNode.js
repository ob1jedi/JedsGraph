var nodeAppearanceHelper = {
	addNodeBody: function (config, node) {
		var nodeBody = Viva.Graph.svg(config.entityShape)
			.attr('cx', 0)//...for circle
			.attr('cy', 0)//...for circle
			.attr('r', node.data.nodeSize) //...for circle
			.attr('fill', node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
			.attr('stroke-width', 3)
			.attr('stroke', config.entityBorderColor == null ? node.data.nodeBorderColor : currentTheme.entityBorderColor)
		if (config.entityShape == "rect") {
			nodeBody.attr('width', node.data.nodeSize * 3);
			nodeBody.attr('height', node.data.nodeSize * 2);
			nodeBody.attr('rx', node.data.nodeSize / 4);
			nodeBody.attr('x', -(node.data.nodeSize * 3 / 2));
			nodeBody.attr('y', -(node.data.nodeSize * 2 / 2));
		}
		if (config.haze == true)
			nodeBody.attr('filter', 'url(#hazeEffect)'); //haze
		if (config.glass == true)
			nodeBody.attr('fill', 'url(#gradGlass)');
		if (config.rounded == true)
			nodeBody.attr('fill', 'url(#gradRound)');
		if (!config.opaque == true)
			nodeBody.attr('fill-opacity', config.entityOpacity);
		return nodeBody
	},

	addNodeImage: function (config, nodeConfig, node) {
		var nodeBodyImage = Viva.Graph.svg('image')
		.attr('x', -node.data.nodeSize)
		.attr('y', -node.data.nodeSize)
		.attr('rx', node.data.nodeSize)
		.attr('width', node.data.nodeSize * 2)
		.attr('height', node.data.nodeSize * 2)
		.link(nodeConfig.image ? nodeConfig.image : '');
		if (config.rounded == true)
			nodeBodyImage.attr('fill', 'url(#gradRound)');
		if (!config.opaque == true)
			nodeBodyImage.attr('fill-opacity', node.data.nodeOpacity);
		return nodeBodyImage;
	},

	addNodeText: function (config, node){
		//Text elements...
		var displayText = Viva.Graph.svg('text')
			.attr('y', 0)
			.attr('x', 0)
			.attr('fill', config.entityLabelColor)
			.attr('stroke-width', '0')
			.attr('font-family', config.entityFont.family)
			.attr('font-weight', config.entityFont.weight)
			.attr('font-size', '20')
			.text(node.data.displayLabel);
		if (config.textHaze == true)
			displayText.attr('filter', 'url(#darkHazeEffect)'); //haze
		return displayText;
	}


}


function defineNodeAppearance_dataNode(node, ui) {
	var cnf = node.data.sourceConfig.displaySettings;
	var nodeConfig = node.data.config.nodeDisplayBody;
	if (nodeConfig.color) { node.data.nodeColor = nodeConfig.color; }

	//Circle elements NODE-CIRCLE
	var nodeBody = nodeAppearanceHelper.addNodeBody(cnf, node);
	var nodeBodyImage = nodeAppearanceHelper.addNodeImage(cnf, nodeConfig, node);
	var displayText = nodeAppearanceHelper.addNodeText(cnf, node);

	nodeOptions = Viva.Graph.svg('rect')
		.attr('x', -node.data.nodeSize)
		.attr('y', -node.data.nodeSize)
		.attr('width', 100)
		.attr('fill', 'green')
		.attr('height', 20)

	circleTextPath = Viva.Graph.svg('path')
		.attr('id', 'npath_' + node.data.id)
		.attr('d', 'M' + (-node.data.nodeSize - 3) + ',' + (-1.5) + ' a1,1 0 1,1 ' + (node.data.nodeSize * 2 + 6) + ',0')
		.attr('fill', 'transparent')
		.attr('stroke-width', 0)
		.attr('stroke', 'black')

	circleText = Viva.Graph.svg('text')
		.attr('y', 0)
		.attr('x', 0)
		.attr('fill', 'black')
		.attr('stroke-width', '0')

		.attr('font-size', '10')
	circleText.innerHTML += '<textPath xlink:href="#npath_' + node.data.id + '">' + node.data.circleText + '</textPath>';


	var visDefs = '<defs>';
	visDefs += '<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
	visDefs += '<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
	visDefs += '<linearGradient id="gradGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#606768" stop-opacity="0.3"/><stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="28%" stop-color="#000000" stop-opacity="0.3"/><stop offset="73%" stop-color="#000000" stop-opacity="0.3"/><stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/><stop offset="97%" stop-color="#000000" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0.3"/></linearGradient>';
	//visDefs += '<linearGradient id="coloredGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#606768" stop-opacity="0.3"/><stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="28%" stop-color="#000000" stop-opacity="0.3"/><stop offset="73%" stop-color="#000000" stop-opacity="0.3"/><stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/><stop offset="97%" stop-color="#000000" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0.3"/></linearGradient>';
	visDefs += '<radialGradient id="gradRound" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="80%" style="stop-color:rgb(' + node.data.nodeColorRGB.r + ',' + node.data.nodeColorRGB.g + ',' + node.data.nodeColorRGB.b + '); stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(' + (node.data.nodeColorRGB.r - 100) + ',' + (node.data.nodeColorRGB.g - 100) + ',' + (node.data.nodeColorRGB.b - 100) + ');stop-opacity:1" /></radialGradient>';
	visDefs += '</defs>';
	ui.innerHTML = visDefs;

	ui.attr('class', 'datanode')
	node.data.UI.fullUI = ui;
	node.data.UI.bodyUI = nodeBody;
	node.data.UI.imageUI = nodeBodyImage;
	node.data.UI.displayTextUI = displayText;
	node.data.UI.circleTextPath = circleTextPath;
	node.data.UI.circleText = circleText;
	node.data.UI.options = nodeOptions;
	ui.append(node.data.UI.bodyUI);

	if (cnf.showCircleText) {
		ui.append(node.data.UI.circleTextPath);
		ui.append(node.data.UI.circleText);
	}

	ui.append(node.data.UI.options);

	if (nodeConfig.image)
		ui.append(node.data.UI.imageUI);

	if (cnf.showLabels) 
		ui.append(node.data.UI.displayTextUI);

}

