function nodeAppearanceHelper(node, config) {
	this.node = node;
	this.config = config;
	this.nodeGraphics = [];
	this.nodeEffects = [];

	this.addNodeBody = function () {
		var nodeBody = Viva.Graph.svg(this.config.entityShape)
			.attr('cx', 0)//...for circle
			.attr('cy', 0)//...for circle
			.attr('r', this.node.data.nodeSize) //...for circle
			.attr('fill', this.node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
			.attr('stroke-width', 3)
			.attr('stroke', this.config.entityBorderColor == null ? this.node.data.nodeBorderColor : currentTheme.entityBorderColor)
		if (this.config.entityShape == "rect") {
			nodeBody.attr('width', this.node.data.nodeSize * 3);
			nodeBody.attr('height', this.node.data.nodeSize * 2);
			nodeBody.attr('rx', this.node.data.nodeSize / 4);
			nodeBody.attr('x', -(this.node.data.nodeSize * 3 / 2));
			nodeBody.attr('y', -(this.node.data.nodeSize * 2 / 2));
		}
		if (this.config.haze == true)
			nodeBody.attr('filter', 'url(#hazeEffect)'); //haze
		if (this.config.glass == true)
			nodeBody.attr('fill', 'url(#gradGlass)');
		if (this.config.rounded == true)
			nodeBody.attr('fill', 'url(#gradRound)');
		if (!this.config.opaque == true)
			nodeBody.attr('fill-opacity', this.config.entityOpacity);
		node.data.UI.bodyUI = nodeBody;
		this.nodeGraphics.push(nodeBody);
		return nodeBody
	}

	this.addNodeImage = function (nodeConfig) {
		if (!this.config.image)
			return;
		var nodeBodyImage = Viva.Graph.svg('image')
		.attr('x', -this.node.data.nodeSize)
		.attr('y', -this.node.data.nodeSize)
		.attr('rx', this.node.data.nodeSize)
		.attr('width', this.node.data.nodeSize * 2)
		.attr('height', this.node.data.nodeSize * 2)
		.link(nodeConfig.image ? nodeConfig.image : '');
		if (this.config.rounded == true)
			nodeBodyImage.attr('fill', 'url(#gradRound)');
		if (!this.config.opaque == true)
			nodeBodyImage.attr('fill-opacity', this.node.data.nodeOpacity);
		this.node.data.UI.imageUI = nodeBodyImage;
		this.nodeGraphics.push(nodeBodyImage);
		return nodeBodyImage;
	}

	this.addNodeText = function () {
		if (!this.config.showLabels)
			return;
		//Text elements...
		var displayText = Viva.Graph.svg('text')
			.attr('y', 0)
			.attr('x', 0)
			.attr('fill', this.config.entityLabelColor)
			.attr('stroke-width', '0')
			.attr('font-family', this.config.entityFont.family)
			.attr('font-weight', this.config.entityFont.weight)
			.attr('font-size', '20')
			.text(this.node.data.displayLabel);
		if (this.config.textHaze == true)
			displayText.attr('filter', 'url(#darkHazeEffect)'); //haze
		this.node.data.UI.displayTextUI = displayText;
		this.nodeGraphics.push(displayText);
		return displayText;
	}

	this.addNodeOption= function (x, y) {
		nodeOption = Viva.Graph.svg('rect')
			.attr('x', x)
			.attr('y', y)
			.attr('width', 100)
			.attr('fill', 'green')
			.attr('height', 20)
		this.node.data.UI.options.push(nodeOption);
		this.nodeGraphics.push(nodeOption);
		return nodeOption;
	}

	this.addNodeCircleTextPath = function () {
		if (!this.config.showCircleText)
			return;
		var circleTextPath = Viva.Graph.svg('path')
			.attr('id', 'npath_' + this.node.data.id)
			.attr('d', 'M' + (-this.node.data.nodeSize - 3) + ',' + (-1.5) + ' a1,1 0 1,1 ' + (this.node.data.nodeSize * 2 + 6) + ',0')
			.attr('fill', 'transparent')
			//.attr('stroke-width', 5)
			//.attr('stroke', 'black')
		this.node.data.UI.circleTextPath = circleTextPath;
		this.nodeGraphics.push(circleTextPath);
		return circleTextPath;
	}

	this.addNodeCircleText = function () {
		if (!this.config.showCircleText)
			return;
		var circleText = Viva.Graph.svg('text')
			.attr('y', 0)
			.attr('x', 0)
			.attr('fill', this.config.entityCircleTextColor)
			.attr('font-size', '10')			
		circleText.innerHTML += '<textPath xlink:href="#npath_' + this.node.data.id + '">' + this.node.data.circleText + '</textPath>';
		this.node.data.UI.circleText = circleText;
		this.nodeGraphics.push(circleText);
		return circleText;
	}
	
	this.addEffect = function (name, definition) {
		this.nodeEffects.push({ name: name, definition, definition });
	}



	this.compileNode = function(ui)
	{
		node.data.UI.fullUI = ui;

		var effectsUi = '<defs>';
		for (var i = 0; i < this.nodeEffects.length; i++)
			effectsUi += this.nodeEffects[i].definition;
		effectsUi += '</defs>';

		ui.innerHTML = effectsUi;
		this.nodeGraphics.forEach(function (nodeGraphic) {
			ui.append(nodeGraphic);
		});
	}
}


function defineNodeAppearance_dataNode(node, ui) {
	var cnf = node.data.sourceConfig.displaySettings;

	var nodeConfig = node.data.config.nodeDisplayBody;
	//var configHelper = new ConfigHelper();
	//nodeConfig = configHelper.getNodeConfig();


	if (nodeConfig.color) { node.data.nodeColor = nodeConfig.color; }
	ui.attr('class', 'datanode')
	node.data.UI = {
		bodyUI: undefined,
		imageUI: undefined,
		displayTextUI: undefined,
		options: [],
		circleTextPath: undefined,
		circleText: undefined
	}

	//Circle elements NODE-CIRCLE
	var nodeAppearance = new nodeAppearanceHelper(node, cnf);

	nodeAppearance.addNodeBody();
	nodeAppearance.addNodeImage(nodeConfig);
	nodeAppearance.addNodeText();
	nodeAppearance.addNodeCircleTextPath();
	nodeAppearance.addNodeCircleText();

	nodeAppearance.addEffect("hazeEffect",
		'<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>'
	);
	nodeAppearance.addEffect("shadowEffect",
		'<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>'
	);
	nodeAppearance.addEffect("gradGlass",
		'<linearGradient id="gradGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#606768" stop-opacity="0.3"/><stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="28%" stop-color="#000000" stop-opacity="0.3"/><stop offset="73%" stop-color="#000000" stop-opacity="0.3"/><stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/><stop offset="97%" stop-color="#000000" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0.3"/></linearGradient>'
	);
	//effects.push('<linearGradient id="coloredGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#606768" stop-opacity="0.3"/><stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="28%" stop-color="#000000" stop-opacity="0.3"/><stop offset="73%" stop-color="#000000" stop-opacity="0.3"/><stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/><stop offset="97%" stop-color="#000000" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0.3"/></linearGradient>');
	nodeAppearance.addEffect("gradRound",
		'<radialGradient id="gradRound" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="80%" style="stop-color:rgb(' + node.data.nodeColorRGB.r + ',' + node.data.nodeColorRGB.g + ',' + node.data.nodeColorRGB.b + '); stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(' + (node.data.nodeColorRGB.r - 100) + ',' + (node.data.nodeColorRGB.g - 100) + ',' + (node.data.nodeColorRGB.b - 100) + ');stop-opacity:1" /></radialGradient>'
	);

	//var effectsUi = nodeAppearance.addEffects(effects);
	//console.log(effectsUi);
	
	
	nodeAppearance.compileNode(ui);



}

