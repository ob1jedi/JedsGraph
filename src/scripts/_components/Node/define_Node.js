//====== NODE VISUAL DEFINITIONS ========================================================================================================

function define_Node() {
	//Node elements...
	globals.graphics.node(function (node) {

		nodeOuterLayer = Viva.Graph.svg('g');
		nodeLayer = Viva.Graph.svg('g');

		if (isShadowEffectTurnedOnInConfig(node.data.sourceConfig)) {
			addShadowTo(nodeLayer);
		}
		if (node.data.nodeType == 'data') {
			defineNodeAppearance_dataNode(node, nodeLayer);
		}
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

	function addShadowTo(nodeLayer) {
		nodeLayer.attr('filter', 'url(#shadowEffect)');
	}

	function attachMetaData(node, ui) {
		ui.attr('depth', 5);
		ui.attr('class', 'node');
		ui.attr('nodeSize', Number(node.data.entityConfig.config.attributes["radius"]));
		ui.attr('nodeid', node.id);
		ui.attr('dragging', false);
		ui.attr('nodetype', node.data.nodeType);
	}

	function attachMouseEventsToNode(node, ui) {
		//NODE EVENTS
		// events (http://www.w3.org/TR/SVG/interact.html#SVGEvents ),
		// including mouse events:

		//$(ui).tap(function (event) { // MOUSE CLICK
		//	node_Event("tap", node, event.pageX, event.pageY);
		//}),
		//$(ui).taphold(function (event) { // MOUSE CLICK
		//	node_Event("taphold", node, event.pageX, event.pageY);
		//}),

		$(ui).touchstart(function (event) { // MOUSE CLICK
			node_Event("touchstart", node, event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
		}),
		$(ui).touchmove(function (event) { // MOUSE CLICK
			node_Event("touchmove", node, event.originalEvent.changedTouches[0].pageX, event.originalEvent.changedTouches[0].pageY);
		}),
		$(ui).touchend(function (event) { // MOUSE CLICK
			node_Event("touchend", node, event.originalEvent.changedTouches[0].pageX, event.originalEvent.changedTouches[0].pageY);
		}),

		$(ui).mousedown(function (event) { // MOUSE CLICK
			node_Event("mousedown", node, event.pageX, event.pageY);
		}),

		$(ui).contextmenu(function (event) { // MOUSE CLICK
			node_Event("contextmenu", node, event.pageX, event.pageY);
		}),

		$(ui).mouseup(function (event) { // MOUSE CLICK
			node_Event("mouseup", node, event.pageX, event.pageY);
		}),

		$(ui).mouseover(function (event) { // MOUSE CLICK
			node_Event("mouseover", node, event.pageX, event.pageY);
		}),

		$(ui).click(function (event) { // MOUSE CLICK
			node_Event("click", node, event.pageX, event.pageY);
		}),

		$(ui).dblclick(function (event) { // MOUSE CLICK
			node_Event("dblclick", node, event.pageX, event.pageY);
		}),

		$(ui).hover(function (event) { // MOUSE HOVER
			node_Event("MouseEnter", node, event.pageX, event.pageY);

		}, function () { // MOUSE LEAVE
			node_Event("MouseLeave", node, event.pageX, event.pageY);
		});

	}
}