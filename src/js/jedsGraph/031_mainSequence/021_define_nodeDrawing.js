function defineNodeDrawing(){
	//====== NODE DRAWING/RENDERING ...occurs continuously ========================================================================================================
	graphics.placeNode(function(nodeUI, pos) {
		//nodeUI.attr('x', pos.x - nodeSize / 2).attr('y', pos.y - nodeSize / 2);
		var nodesize = nodeUI.attr('nodeSize');
		var nodeid = nodeUI.attr('nodeid');
		var nodetype = nodeUI.attr('nodetype');
		var nodeDragging = nodeUI.attr('dragging');
		//if (nodetype != 'window'){
		nodeUI.attr('transform','translate(' +(pos.x) + ',' + (pos.y) + ')');
		
		if (nodeDragging == 'true' && nodetype=='subnode')
		{
			var parentNodeId = nodeUI.attr('parentnodeid')
			var parentPos = layout.getNodePosition(parentNodeId);
			var thisPos = layout.getNodePosition(nodeid);
			var distance = calculateDistance(parentPos, thisPos);
			
			nodeUI.children[0].attr('r', distance/5);
			//nodeUI.children[1].text(Math.ceil(distance/5)+'%');
			fixTextWidth4Node(GRAPH.getNode(nodeid));
		}
		//}
		//else
		//{
			//nodeUI.attr('transform','translate(' +(pos.x) + ',' + (pos.y) + ')');
			//nodeUI.attr('transform','translate(' +(pos.x) + ',' + (pos.y) + ')');
		//}
		if (nodeid == selectedNodeID)
		{		
			//var ele = document.getElementById("panel.bulkactions").style['left'] = pos.x;
			//var ele = document.getElementById("floating.details").style['left'] = pos.x;
			//detailsUI.attr('transform','translate(' +(pos.x) + ',' + (pos.y) + ')');
		}
		
		
	});


	//if (viewOptions.screenDragType == 'depth') {
	//    graphics.dragScreen(function (offset) {

	//        GRAPH.forEachNode(function (node, index) {
	//            layout.pinNode(node, true);
	//            var pos = layout.getNodePosition(node.id);
	//            pos.x = pos.x + (offset.x * (node.data.nodeIndex + 1) * 0.1);
	//            pos.y = pos.y + (offset.y * (node.data.nodeIndex + 1) * 0.1);
	//            layout.setNodePosition(node.id, pos.x, pos.y);
	//        });

	//    });
	//}


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
            updateNodesDepth({ x: dx, y: dy })
        }
    }
    function updateNodesDepth(offset)
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