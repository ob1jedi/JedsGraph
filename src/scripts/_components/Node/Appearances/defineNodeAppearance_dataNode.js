function nodeAppearanceHelper(node) {
	var _cnf = node.data.entityConfig.config;

    this.node = node;
	this.nodeGraphics = [];
	this.nodeEffects = [];

	this.addNodeBody = function () {
		var nodeRadius = Number(_cnf.attributes["radius"]);
		var nodeBody = Viva.Graph.svg(_cnf.attributes["shape"])
			.attr('cx', 0)//...for circle
			.attr('cy', 0)//...for circle
			.attr('r', nodeRadius) //...for circle
			.attr('fill', _cnf.attributes["background-color"] == null ? 'grey':_cnf.attributes["background-color"])
			.attr('stroke-width', Number(_cnf.attributes["border-width"]))
			.attr('stroke', _cnf.attributes["border-color"] == null ? 'black': _cnf.attributes["border-color"])
		if (_cnf.attributes["shape"] == "rect") {
			nodeBody.attr('width', Number(_cnf.attributes["width"]));
			nodeBody.attr('height',  Number(_cnf.attributes["height"]));
			nodeBody.attr('rx', nodeRadius);
			nodeBody.attr('x', -((Number(_cnf.attributes["width"])) / 2));
			nodeBody.attr('y', -((Number(_cnf.attributes["height"])) / 2));
		}
		if (_cnf.effects["haze"] == true)
			nodeBody.attr('filter', 'url(#hazeEffect)'); //haze
		if (_cnf.effects["glass"] == true)
			nodeBody.attr('fill', 'url(#gradGlass)');
		if (_cnf.effects["rounded"] == true)
			nodeBody.attr('fill', 'url(#gradRound)');
		if (!_cnf.effects["opaque"] == true)
			nodeBody.attr('fill-opacity', _cnf.attributes["opacity"]);
		node.data.UI.bodyUI = nodeBody;
		this.nodeGraphics.push(nodeBody);
		return nodeBody
	}

	this.addNodeImage = function () {

		//if (!_cnf.attributes.img["url"] == null)
		//	return;
    // Evaluate image url:
    var imageUrl = "";
    if (_cnf.attributes.img.displayData["key"] === "property")
      imageUrl = this.node.data.propertiesObject[_cnf.attributes.img.displayData["value"]];
    else if (_cnf.attributes.img.displayData["key"] === "static")
      imageUrl = _cnf.attributes.img.displayData["value"];
    else
      imageUrl = _cnf.attributes.img["url"];
		
    var imgWidth = Number(_cnf.attributes.img["width"]);
		var imgHeight = Number(_cnf.attributes.img["height"]);
		
    if (imageUrl &&imgWidth === 0)
      imgWidth = 100;
    if (imageUrl && imgHeight === 0)
      imgHeight = 100;

    var nodeBodyImage = Viva.Graph.svg('image')
		//var nodeRadius = Number(nodeRadius);
		//.attr('rx', nodeRadius)
		.attr('width', imgWidth)
		.attr('height', imgHeight)
		.attr('x', -imgWidth/2)
		.attr('y', -imgHeight / 2)
		.attr('opacity', Number(_cnf.attributes.img["opacity"]))
    .link(imageUrl);
		if (_cnf.effects["rounded"] == true) nodeBodyImage.attr('fill', 'url(#gradRound)');
		//if (!_cnf.effects["opaque"] == true) nodeBodyImage.attr('opacity', Number(_cnf.attributes.img["opacity"]));
		this.node.data.UI.imageUI = nodeBodyImage;
		this.nodeGraphics.push(nodeBodyImage);
		return nodeBodyImage;
	}

	this.addNodeOption = function (thingConfig) {
		nodeOption = Viva.Graph.svg('image')
			.attr('x', thingConfig["x"])
			.attr('y', thingConfig["y"])
			.attr('width', thingConfig["size"])
			.attr('height', thingConfig["size"])
			.attr('fill', thingConfig["color"])
			.link(thingConfig["url"])
		this.node.data.UI.options.push(nodeOption);
		this.nodeGraphics.push(nodeOption);
		return nodeOption;
	}

	this.addNodeLine = function () {
		var x = Math.ceil(getRandomArbitrary(40, 90));
		var y = Math.ceil(getRandomArbitrary(40, 90));
		var r = Math.ceil(getRandomArbitrary(0, 360));
		var sx = Math.ceil(getRandomArbitrary(-1, 1));
		var sy = Math.ceil(getRandomArbitrary(-1, 1));

		nodeLine = Viva.Graph.svg('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', x)
			.attr('y2', y)
			.attr('style', "stroke:url(#gradShine);transform:rotate("+ r +"deg);")
			.attr('stroke-width', '2')
		;
		this.node.data.UI.options.push(nodeLine);
		this.nodeGraphics.push(nodeLine);
		return nodeLine;
	}

	this.addNodeText = function () {
		if (!_cnf.attributes.labelText["show"])
			return;
		//Text elements...
		var displayText = Viva.Graph.svg('text')
			.attr('y', Number(_cnf.attributes.labelText["x"]))
			.attr('x', Number(_cnf.attributes.labelText["y"]))
			.attr('fill', _cnf.attributes.labelText["color"])
			.attr('font-family', _cnf.attributes.labelText["font-family"])
			.attr('font-weight', _cnf.attributes.labelText["font-weight"])
			.attr('font-size', Number(_cnf.attributes.labelText["font-size"]))
			//.attr('stroke', 'black')
			//.attr('stroke-width', '0.5')
			.text(this.node.data.displayLabel);
		//if (_cnf.attributes.labelText.effects["haze"] == true)
		//	displayText.attr('filter', 'url(#darkHazeEffect)'); //haze
		this.node.data.UI.displayTextUI = displayText;
		this.nodeGraphics.push(displayText);
		return displayText;
	}

	this.addNodeCircleTextPath = function () {
		if (!_cnf.attributes.circleText["show"])
			return;
		var r = Number(_cnf.attributes["radius"]) + 5;
		var circleTextPath = Viva.Graph.svg('path')
			.attr('id', 'npath_' + this.node.data.id)
			.attr('d', ''
				+'M 0, 0'
				+'m -'+r+', 0'
				+'a '+r+', '+r+' 0 1, 0 '+r*2+', 0'
				+'a '+r+', '+r+' 0 1, 0 -'+r*2+', 0')
			.attr('fill', 'transparent')
			.attr('style', "transform:rotate(" + 90 + "deg);")
		this.node.data.UI.circleTextPath = circleTextPath;
		this.nodeGraphics.push(circleTextPath);
		return circleTextPath;
	}

	this.addNodeCircleText = function () {
		if (!_cnf.attributes.circleText["show"])
			return;
		var circleText = Viva.Graph.svg('text')
			.attr('y', 0)
			.attr('x', 0)
			.attr('fill', _cnf.attributes.circleText["color"])
			.attr('opacity', _cnf.attributes.circleText["opacity"])
			.attr('font-size', '10')
		circleText.innerHTML += '<textPath alignment-baseline="hanging" text-anchor="middle" xlink:href="#npath_' + this.node.data.id + '" startOffset="50%">' + this.node.data.circleText + '</textPath>';
		//circleText.innerHTML += '<textPath alignment-baseline="baseline" text-anchor="start" xlink:href="#npath_' + this.node.data.id + '" startOffset="0%">' + this.node.data.circleText + '</textPath>';
		this.node.data.UI.circleText = circleText;
		this.nodeGraphics.push(circleText);
		return circleText;
	}
	
	this.addEffect = function (name, definition) {
		this.nodeEffects.push({ name: name, definition:definition });
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
	var _cnf = node.data.entityConfig.config;

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
	var nodeAppearance = new nodeAppearanceHelper(node);

	nodeAppearance.addNodeBody();
	nodeAppearance.addNodeImage();
	nodeAppearance.addNodeText();
	nodeAppearance.addNodeCircleTextPath();
	nodeAppearance.addNodeCircleText();

	_cnf["relatedThings"].forEach(function (thingConfig) {
		if (thingConfig.thingName === "option")
			nodeAppearance.addNodeOption(thingConfig);
	});

	nodeAppearance.addEffect("hazeEffect",
		'<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>'
	);
	nodeAppearance.addEffect("shadowEffect",
		'<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>'
	);
	nodeAppearance.addEffect("gradGlass", ''
		+'<linearGradient id="gradGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%">'
		+'	<stop offset="0%" stop-color="#606768" stop-opacity="0.3"/>'
		+'	<stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/>'
		+'	<stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/>'
		+'	<stop offset="28%" stop-color="#000000" stop-opacity="0.3"/>'
		+'	<stop offset="73%" stop-color="#000000" stop-opacity="0.3"/>'
		+'	<stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/>'
		+'	<stop offset="97%" stop-color="#000000" stop-opacity="0.3"/>'
		+'	<stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>'
		+'</linearGradient>'
	);
	nodeAppearance.addEffect("gradShine", ''
		+'<linearGradient id="gradShine" x1="0%" y1="0%" x2="100%" y2="100%">'
		+'	<stop offset="0%"   stop-color="white" stop-opacity="0.7"/>'
		+'	<stop offset="100%"  stop-color="purple" stop-opacity="0"/>'
		+'</linearGradient>'
	);

	//effects.push('<linearGradient id="coloredGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#606768" stop-opacity="0.3"/><stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="28%" stop-color="#000000" stop-opacity="0.3"/><stop offset="73%" stop-color="#000000" stop-opacity="0.3"/><stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/><stop offset="97%" stop-color="#000000" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0.3"/></linearGradient>');
	nodeAppearance.addEffect("gradRound",
		'<radialGradient id="gradRound" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="80%" style="stop-color:rgb(' + node.data.nodeColorRGB.r + ',' + node.data.nodeColorRGB.g + ',' + node.data.nodeColorRGB.b + '); stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(' + (node.data.nodeColorRGB.r - 100) + ',' + (node.data.nodeColorRGB.g - 100) + ',' + (node.data.nodeColorRGB.b - 100) + ');stop-opacity:1" /></radialGradient>'
	);

	//var effectsUi = nodeAppearance.addEffects(effects);
	//console.log(effectsUi);
	
	
	nodeAppearance.compileNode(ui);



}

