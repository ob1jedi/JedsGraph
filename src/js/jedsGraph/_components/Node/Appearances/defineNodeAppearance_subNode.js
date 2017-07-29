function defineNodeAppearance_dataNode(node, ui) {
	var cnf = node.data.sourceConfig.displaySettings;
	var nodeConfig = node.data.config.nodeDisplayBody;
	if (nodeConfig.color) { node.data.nodeColor = nodeConfig.color; }

	nodeBody = Viva.Graph.svg('circle')
		.attr('cx', 0)//...for circle
		.attr('cy', 0)//...for circle
		.attr('r', node.data.nodeSize) //...for circle
		.attr('fill', node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
		.attr('stroke-width', 3)
		.attr('stroke', node.data.nodeColor)
	nodeBodyImage = Viva.Graph.svg('image')
		.attr('x', -node.data.nodeSize)
		.attr('y', -node.data.nodeSize)
		.attr('rx', node.data.nodeSize)
		.attr('width', node.data.nodeSize * 2)
		.attr('height', node.data.nodeSize * 2)
		.link(nodeConfig.image ? nodeConfig.image : '');
	if (cnf.rounded) { nodeBodyImage.attr('fill', 'url(#gradRound)'); }
	if (!cnf.opaque) { nodeBodyImage.attr('fill-opacity', node.data.nodeOpacity); }

	//Text elements...
	displayText = Viva.Graph.svg('text')
		.attr('y', 0)
		.attr('x', 0)
		.attr('fill', 'black')
		.attr('stroke-width', '0')
		.attr('font-family', 'Arial, Helvetica, sans-serif')
		.attr('font-size', '20')
		.text(node.data.displayLabel);

	node.data.UI.fullUI = ui;
	node.data.UI.bodyUI = nodeBody;
	node.data.UI.imageUI = nodeBodyImage;
	node.data.UI.displayTextUI = displayText;

	ui.append(node.data.UI.bodyUI);
	if (nodeConfig.image) { ui.append(node.data.UI.imageUI); }
	if (cnf.showLabels) { ui.append(node.data.UI.displayTextUI); }
}