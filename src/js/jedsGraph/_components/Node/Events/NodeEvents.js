function node_Event(eventType, node) {

	console.log('NodeEvent: ' + eventType);

	if (eventType == "MouseEnter")
		node_OnMouseEnter(node);
	else if (eventType == "MouseDown")
		node_OnMouseDown(node);
	else if (eventType == "MouseUp")
		node_OnMouseUp(node);
	else if (eventType == "MouseDblClick")
		node_OnMouseDblClick(node);
	else if (eventType == "MouseLeave")
		node_OnMouseLeave(node);
	else if (eventType == "MouseDragging")
		node_OnMouseLeave(node);
	else if (eventType == "SubNodePulledOut")
		node_Event_subNodePulledOut(node);
}

//-----------------------------------------------------------------
function node_Event_subNodePulledOut(node)
{
	var parentNode = nodeLayer.attr('parentnodeid', node.data.superNodes[0]);
	// show 'create-node' modal
	// create new node
}

function node_OnMouseEnter(node) {
	if (node.data.nodeType == "data")
		dataNode_OnMouseEnter(node);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseEnter(node);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseEnter(node);
}

function node_OnMouseDown(node) {
	node.data.dragging = 'true';

	if (node.data.nodeType == "data")
		dataNode_OnMouseDown(node);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseDown(node);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseDown(node);
}

function node_OnMouseDblClick(node) {
	if (node.data.nodeType == "data")
		dataNode_OnMouseDblClick(node);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseDblClick(node);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseDblClick(node);
}

function node_OnMouseLeave(node) {
	if (node.data.nodeType == "data")
		dataNode_OnMouseLeave(node);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseLeave(node);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseLeave(node);
}

function node_OnMouseUp(node) {
	//$node.data.UI.fullUI.attr('dragging', 'false');
	node.data.dragging = 'false';
	console.log('node state', node);

	if (node.data.nodeType == "data")
		dataNode_OnMouseUp(node);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseUp(node);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseUp(node);
}

function node_OnDrag(node) {
	if (node.data.nodeType == "data")
		dataNode_OnDrag(node);
	else if (node.data.nodeType == "subnode")
		subNode_OnDrag(node);
	else if (node.data.nodeType == "planned")
		plannedNode_OnDrag(node);

}
//---- Node Specific: Data Nodes -------------------------------------------------------------

function dataNode_OnMouseEnter(node) {
	if (viewOptions.highlightRelated) 
		highlightRelatedNodes(node.id, true);
	if (viewOptions.highlightdescendants) 
		highlightDescendantNodes(node.id, true);
	if (viewOptions.highlightAncestors) 
		highlightAncestorNodes(node.id, true);

}

function dataNode_OnMouseDown(node) {
	highlightSelectedNode(node.id);
	layout.pinNode(node, true);
	node.data.isPinned = true;

	addSubNode(node, 'Create_X', 'blue', 'X');
	addSubNode(node, 'Create_Y', 'red', 'Y');
	addSubNode(node, 'Create_Z', 'green', 'Z');

}

function dataNode_OnMouseUp(node) {
	// Not yet implemented.
}

function dataNode_OnMouseDblClick(node) {

	Neo4jFetchEntitiesForNode(node.id, node.data.sourceConfig);
}

function dataNode_OnMouseLeave(node) {
	if (viewOptions.highlightRelated) 
		highlightRelatedNodes(node.id, false);
	if (viewOptions.highlightdescendants) 
		highlightDescendantNodes(node.id, false);
	if (viewOptions) 
		highlightAncestorNodes(node.id, false);
}

function dataNode_OnDrag(node) {
	// not yet implemented
}

//---- Node Specific: Sub Nodes -------------------------------------------------------------
function subNode_OnMouseEnter(node) {
	// not yet implemented
}

function subNode_OnDblClick(node) {
	// not yet implemented
}

function subNode_OnMouseLeave(node) {
	// not yet implemented
}

function subNode_OnMouseDown(node) {
	// not yet implemented
}

function subNode_OnMouseUp(node) {
	node.data.UI.fullUI.attr('dragging', 'false');
	node.data.UI.fullUI.children[0].attr('r', node.data.nodeSize);
	fixTextWidth4Node(node);
}

function subNode_OnDrag(node) {
	var nodeUI = node.data.UI.fullUI;
	var parentNodeId = nodeUI.attr('parentnodeid')
	var parentPos = layout.getNodePosition(parentNodeId);
	var thisPos = layout.getNodePosition(nodeid);
	var distance = calculateDistance(parentPos, thisPos);

	if (EventsHelper.distancePassedThreshold(distance))
		nodeEvent('SubNodePulledOut', node);

	nodeUI.children[0].attr('r', distance / 5);
	//nodeUI.children[1].text(Math.ceil(distance/5)+'%');
	fixTextWidth4Node(GRAPH.getNode(nodeid));
}

//---- Node Specific: Planned Nodes -------------------------------------------------------------
function plannedNode_OnMouseEnter(node) {
	// not yet implemented
}

function plannedNode_OnDblClick(node) {
	// not yet implemented
}

function plannedNode_OnMouseLeave(node) {
	// not yet implemented
}

function plannedNode_OnMouseDown(node) {
	// not yet implemented
}

function plannedNode_OnMouseUp(node) {
	// not yet implemented
}

function plannedNode_OnDrag(node) {
	// not yet implemented
}


//---- Helper Functions -------------------------------------------------------------
var EventsHelper = {
	distancePassedThreshold : function(distance){

	}
}
