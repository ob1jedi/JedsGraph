function defineNodeDrawing(){

	//====== NODE DRAWING/RENDERING ...occurs continuously ========================================================================================================
	graphics.placeNode(function (nodeUI, pos) {
		//console.log('draw-UI', nodeUI.node);
		nodeUI.attr('transform', 'translate(' + (pos.x) + ',' + (pos.y) + ')');

		//if (nodeUI.attr('dragging') == 'true')
		if (nodeUI.node.data.dragging == 'true')
			node_Event("MouseDragging", nodeUI.node);
	});

    //OVERRIDE drag drawing...
    graphics.translateRel = function (dx, dy) {
        var svgRoot = graphics.getSvgRoot();
        var svgContainer = graphics.getGraphicsRoot().children[0];

        var p = svgRoot.createSVGPoint(),
            t = svgContainer.getCTM(),
            origin = svgRoot.createSVGPoint().matrixTransform(t.inverse());

        p.x = dx;
        p.y = dy;

        p = p.matrixTransform(t.inverse());
        p.x = (p.x - origin.x) * t.a;
        p.y = (p.y - origin.y) * t.d;

        t.e += p.x;
        t.f += p.y;

        var transform = "matrix(" + t.a + ", 0, 0," + t.d + "," + t.e + "," + t.f + ")";
        svgContainer.attr("transform", transform);

        if (viewOptions.screenDragType == 'depth') {
            applyDepthOffset({ x: dx, y: dy })
        }
    }

    function applyDepthOffset(offset)
    {
        GRAPH.forEachNode(function (node, index) {
            layout.pinNode(node, true);
            var pos = layout.getNodePosition(node.id);
            pos.x = pos.x + (offset.x * node.data.depth);
            pos.y = pos.y + (offset.y * node.data.depth);
            layout.setNodePosition(node.id, pos.x, pos.y);
        });
    }


    //graphics.getNodeUI = function (nodeId) {
    //    return .allNodes[nodeId];
    //}
}