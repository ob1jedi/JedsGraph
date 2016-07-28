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
}