//====== NODE VISUAL DEFINITIONS ========================================================================================================

function defineNodes()
{
	//Node elements...
	graphics.node(function(node) {		

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

		var debuggingText = document.getElementById("DebuggingText");

		$(ui).mousedown(function (event) { // MOUSE CLICK
			//console.log('EVENT', $(ui));
			debuggingText.innerHTML += ",MD";
			node_Event("MouseDown", node, event.pageX, event.pageY);
		}),

		$(ui).contextmenu(function (event) { // MOUSE CLICK
			debuggingText.innerHTML += ",MCnt";
			node_Event("MouseContextMenu", node, event.pageX, event.pageY);
		}),

		$(ui).mouseup(function (event) { // MOUSE CLICK
			debuggingText.innerHTML += ",MU";
			node_Event("MouseUp", node, event.pageX, event.pageY);
		}),

		$(ui).mouseover(function (event) { // MOUSE CLICK
			debuggingText.innerHTML += ",MO";
			node_Event("MouseOver", node, event.pageX, event.pageY);
		}),

		$(ui).click(function (event) { // MOUSE CLICK
			debuggingText.innerHTML += ",CLICK";
			node_Event("Click", node, event.pageX, event.pageY);
		}),

		$(ui).dblclick(function (event) { // MOUSE CLICK
			node_Event("MouseDblClick", node, event.pageX, event.pageY);
		}),

		$(ui).focus(function (event) { // MOUSE CLICK
			debuggingText.innerHTML += ",FOCUS";
			node_Event("Focus", node, event.pageX, event.pageY);
		}),
		//$(ui).tap(function (event) { // MOUSE CLICK
		//	node_Event("Tap", node, event.pageX, event.pageY);
		//}),

		//$(ui).on("click", function (event) {
		//	console.log('TAPPING');
		//	node_Event("Tap", node, event.pageX, event.pageY);
		//}),

		$(ui).hover(function (event) { // MOUSE HOVER
			debuggingText.innerHTML += ",ME";
			node_Event("MouseEnter", node, event.pageX, event.pageY);

		}, function () { // MOUSE LEAVE
			debuggingText.innerHTML += ",ML";
			node_Event("MouseLeave", node, event.pageX, event.pageY);
		});

	}
}