//====== NODE VISUAL DEFINITIONS ========================================================================================================

function defineNodes()
{
	//Node elements...
	graphics.node(function(node) {		

		nodeOuterLayer = Viva.Graph.svg('g');
	    nodeLayer = Viva.Graph.svg('g');

	    if (isShadowEffectTurnedOnInConfig(node.data.sourceConfig)) {
	    	//console.log('Shadow on');
	    	addShadowTo(nodeLayer);
	    }

	    if (node.data.nodeType == 'data')
			defineNodeAppearance_dataNode(node, nodeLayer);

	    else if (node.data.nodeType == 'subnode') {
			defineNodeAppearance_subNode(node, nodeLayer);
			if (node.data.superNodes[0])
				nodeLayer.attr('parentnodeid', node.data.superNodes[0].id);
		}
		else if (node.data.nodeType == 'planned')
			defineNodeAppearance_plannedNode(node, nodeLayer);

	    attachMouseEventsToNode(node, nodeLayer);
	    attachMetaData(node, nodeLayer);
		nodeOuterLayer.append(nodeLayer);
		node.data.UI.outerUI = nodeOuterLayer;
		return nodeOuterLayer;
	});

	function isShadowEffectTurnedOnInConfig(config) {
		//console.log('Shadow:', config.displaySettings.shadow);
		return config.displaySettings.shadow;
	}

	function addShadowTo(nodeLayer){
		nodeLayer.attr('filter', 'url(#shadowEffect)');
	}

	function attachMetaData(node, ui) {
		ui.attr('depth', 5);
		ui.attr('class', 'node');
		ui.attr('nodeSize', node.data.nodeSize);
		ui.attr('nodeid', node.id);
		ui.attr('dragging', false);
		ui.attr('nodetype', node.data.nodeType);
	}

	function attachMouseEventsToNode(node, ui) {
		//NODE EVENTS
		// events (http://www.w3.org/TR/SVG/interact.html#SVGEvents ),
		// including mouse events:
		$(ui).mousedown(function (event) { // MOUSE CLICK
			node_Event("MouseDown", node, event.pageX, event.pageY);
		}),

		$(ui).contextmenu(function (event) { // MOUSE CLICK
			node_Event("MouseContextMenu", node, event.pageX, event.pageY);
		}),

		$(ui).mouseup(function (event) { // MOUSE CLICK
			node_Event("MouseUp", node, event.pageX, event.pageY);
		}),

		$(ui).mouseover(function (event) { // MOUSE CLICK
			node_Event("MouseOver", node, event.pageX, event.pageY);
		}),

		$(ui).dblclick(function (event) { // MOUSE CLICK
			node_Event("MouseDblClick", node, event.pageX, event.pageY);
		}),

		$(ui).hover(function (event) { // MOUSE HOVER
			node_Event("MouseEnter", node, event.pageX, event.pageY);

		}, function () { // MOUSE LEAVE
			node_Event("MouseLeave", node, event.pageX, event.pageY);
		});
	}
}