function node_Event(eventType, node, x, y) {

	//console.log('NodeEvent: ' + eventType + ', x=' +x + ' y=' +y);

	if (eventType == "MouseEnter")
		node_OnMouseEnter(node, x, y);

	else if (eventType == "mousedown")
		node_OnMouseDown(node, x, y);

	else if (eventType == "mouseup")
		node_OnMouseUp(node, x, y);

	else if (eventType == "dblclick")
		node_OnMouseDblClick(node, x, y);

	else if (eventType == "MouseLeave")
		node_OnMouseLeave(node, x, y);

	else if (eventType == "MouseDragging")
		node_OnMouseLeave(node, x, y);

	else if (eventType == "SubNodePulledOut")
		node_Event_subNodePulledOut(node, x, y);

	else if (eventType == "touchstart")
		node_OnTouchStart(node, x, y);

	else if (eventType == "tap")
		node_OnTap(node, x, y);

	else if (eventType == "touchend")
		node_OnTouchEnd(node, x, y);
	//else if (eventType == "taphold")
	//	node_OnTapHold(node, x, y);

	//else if (eventType == "touchmove")
	//	node_OnTouchMove(node, x, y);

	//else if (eventType == "touchend")
	//	node_OnTouchEnd(node, x, y);

}

//-----------------------------------------------------------------
function node_Event_subNodePulledOut(node, x, y)
{
	var parentNode = nodeLayer.attr('parentnodeid', node.data.superNodes[0]);
	// show 'create-node' modal
	// create new node
}

function nodeFlyout_Event_HideClick(nodeId) {
	removeNodeFromGraph(nodeId);
}

function nodeFlyout_Event_PinClick(nodeId) {
	var node = GRAPH.getNode(nodeId);
	unPinNode(node);
}


function node_OnMouseEnter(node, x, y) {
	if (node.data.nodeType == "data")
		dataNode_OnMouseEnter(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseEnter(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseEnter(node, x, y);
}

function node_OnTap(node, x, y) {
	node_OnMouseDown(node, x, y)
}

function node_OnTouchStart(node, x, y) {
	node_OnMouseDown(node, x, y)
}

function node_OnTouchEnd(node, x, y) {
	node_OnMouseUp(node, x, y)
}


function node_OnMouseDown(node, x, y) {
	node.data.dragging = 'true';

	if (node.data.nodeType == "data")
		dataNode_OnMouseDown(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseDown(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseDown(node, x, y);
}

function node_OnMouseDblClick(node, x, y) {
	if (node.data.nodeType == "data")
		dataNode_OnMouseDblClick(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseDblClick(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseDblClick(node, x, y);
}

function node_OnMouseLeave(node, x, y) {
	if (node.data.nodeType == "data")
		dataNode_OnMouseLeave(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseLeave(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseLeave(node, x, y);
}

function node_OnMouseUp(node, x, y) {
	//$node.data.UI.fullUI.attr('dragging', 'false');
	node.data.dragging = 'false';
	//console.log('node state', node);

	if (node.data.nodeType == "data")
		dataNode_OnMouseUp(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseUp(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseUp(node, x, y);
}

function node_OnDrag(node, x, y) {
	if (node.data.nodeType == "data")
		dataNode_OnDrag(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnDrag(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnDrag(node, x, y);

}
//---- Node Specific: Data Nodes -------------------------------------------------------------

function dataNode_OnMouseEnter(node, x, y) {
	if (viewOptions.highlightRelated) 
		highlightRelatedNodes(node.id, true);
	if (viewOptions.highlightdescendants) 
		highlightDescendantNodes(node.id, true);
	if (viewOptions.highlightAncestors) 
		highlightAncestorNodes(node.id, true);

}

function dataNode_OnMouseDown(node,x, y) {
	highlightSelectedNode(node.id);
	nodeFunctions = NodeFunctionsFactory.createNew(node);
	//console.log('nodeFunctions', nodeFunctions);
	layout.pinNode(node, true);
	node.data.isPinned = true;


	//
	//
	//

	//nodeFlyout.show();

	//addSubNode(node, 'Create_X', 'blue', 'X');
	//addSubNode(node, 'Create_Y', 'red', 'Y');
	//addSubNode(node, 'Create_Z', 'green', 'Z');
	//var svgContainer = graphics.getGraphicsRoot().children[0];
	//var canvas = document.getElementById('graphContainer');
	//var context = svgContainer.getContext('2d');
	//context.beginPath();
	//context.rect(x, y, x+200, y+100);
	//context.fillStyle = 'yellow';
	//context.fill();
	//context.lineWidth = 7;
	//context.strokeStyle = 'black';
	//context.stroke();

}

function dataNode_OnMouseUp(node, x, y) {
	consoleService.ShowFlyout(node, x, y);
	// Not yet implemented.
}

function dataNode_OnMouseDblClick(node, x, y) {
	dataService.FetchEntitiesForNodeId(node.id, node.data.sourceConfig);
}

function dataNode_OnMouseLeave(node, x, y) {
	if (viewOptions.highlightRelated) 
		highlightRelatedNodes(node.id, false);
	if (viewOptions.highlightdescendants) 
		highlightDescendantNodes(node.id, false);
	if (viewOptions) 
		highlightAncestorNodes(node.id, false);
}

function dataNode_OnDrag(node, x, y) {
	// not yet implemented
}

//---- Node Specific: Sub Nodes -------------------------------------------------------------
function subNode_OnMouseEnter(node, x, y) {
	// not yet implemented
}

function subNode_OnDblClick(node, x, y) {
	// not yet implemented
}

function subNode_OnMouseLeave(node, x, y) {
	// not yet implemented
}

function subNode_OnMouseDown(node, x, y) {
	// not yet implemented
}

function subNode_OnMouseUp(node, x, y) {
	node.data.UI.fullUI.attr('dragging', 'false');
	node.data.UI.fullUI.children[0].attr('r', node.data.nodeSize);
	fixTextWidth4Node(node, x, y);
}

function subNode_OnDrag(node, x, y) {
	var nodeUI = node.data.UI.fullUI;
	var parentNodeId = nodeUI.attr('parentnodeid')
	var parentPos = layout.getNodePosition(parentNodeId);
	var thisPos = layout.getNodePosition(nodeid);
	var distance = calculateDistance(parentPos, thisPos);
	var eventsHelper = new EventsHelper(node);
	if (eventsHelper.distancePassedThreshold(distance))
		nodeEvent('SubNodePulledOut', node);

	nodeUI.children[0].attr('r', distance / 5);
	//nodeUI.children[1].text(Math.ceil(distance/5)+'%');
	fixTextWidth4Node(GRAPH.getNode(nodeid));
}

//---- Node Specific: Planned Nodes -------------------------------------------------------------
function plannedNode_OnMouseEnter(node, x, y) {
	// not yet implemented
}

function plannedNode_OnDblClick(node, x, y) {
	// not yet implemented
}

function plannedNode_OnMouseLeave(node, x, y) {
	// not yet implemented
}

function plannedNode_OnMouseDown(node, x, y) {
	// not yet implemented
}

function plannedNode_OnMouseUp(node, x, y) {
	// not yet implemented
}

function plannedNode_OnDrag(node, x, y) {
	// not yet implemented
}


//---- Helper Functions -------------------------------------------------------------


var EventsHelper = function (node) {
	var _node = node;
	this.distancePassedThreshold = function (distance) {
		// Not yet implemented
	}
}


// --- Developer Custom Modals ---
// --- Modals ---
// Workflow modals
NodeFunctionsFactory.show_addWorkflowModal = function () {
	var nodeFlyout = document.getElementById('newWorkflowModel');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_updateWorkflowModal = function () {
	var nodeFlyout = document.getElementById('updateWorkflowModel');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_removeWorkflowModal = function () {
	var nodeFlyout = document.getElementById('removeWorkflowModel');
	nodeFlyout.showModal();
}
// Content modals
NodeFunctionsFactory.show_addContentModal = function () {
	var nodeFlyout = document.getElementById('addContentModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_updateContentModal = function () {
	var nodeFlyout = document.getElementById('updateContent');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_removeContentModal = function () {
	var nodeFlyout = document.getElementById('removeContent');
	nodeFlyout.showModal();
}
// Tool modals
NodeFunctionsFactory.show_addToolModal = function () {
	var nodeFlyout = document.getElementById('addToolModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_updateToolModal = function () {
	var nodeFlyout = document.getElementById('updateToolModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_removeToolModal = function () {
	var nodeFlyout = document.getElementById('removeToolModal');
	nodeFlyout.showModal();
}
// Collector Modals
NodeFunctionsFactory.show_addCollectorModal = function () {
	var nodeFlyout = document.getElementById('addCollectorModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_updateCollectorModal = function () {
	var nodeFlyout = document.getElementById('updateCollectorModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_removeCollectorModal = function () {
	var nodeFlyout = document.getElementById('removeCollectorModal');
	nodeFlyout.showModal();
}

// --- Modal submit functions ---
// Workflow functions
NodeFunctionsFactory.add_workflow = function () {
	var modal = document.getElementById('newWorkflowModel');
	var nameFieldValue = modal.children[0].children[3].value;
	var nodeProperties = [];
	// Types can be string, number, array, other
	nodeProperties.push({ key: "workflowName", value: parseDataType(nameFieldValue, 'string') });
	createChildNode(this.node.id, "WORKFLOW", nodeProperties, 'SEND_TO', []);
	modal.close();
}

NodeFunctionsFactory.update_workflow = function () {
	var modal = document.getElementById('updateWorkflowModel');
	var nameFieldValue = modal.children[0].children[3].value;
	console.log('update_workflow for node:', this.node);
	this.node.data.properties.forEach(function (property) {
		if (property.key = "workflowName")
			property.value = nameFieldValue;
	});
	var callback = function () {
		Alert("Update applied");
	}
	dataService.UpdateEntity(this.node.id, this.node.data.properties, callback);
	modal.close();
}

NodeFunctionsFactory.remove_workflow = function () {
	dataService.GetRelatedEntityGraph(this.node.id);
	modal.close();
}
// Tool functions
NodeFunctionsFactory.add_tool = function () {
	var modal = document.getElementById('addToolModal');
	var nameFieldValue = modal.children[0].children[3].value;
	var nodeProperties = [];
	nodeProperties.push({ key: "toolName", value: parseDataType(nameFieldValue, 'string') });
	createChildNode(this.node.id, "TOOL", nodeProperties, 'SEND_TO', []);
	modal.close();
}

NodeFunctionsFactory.update_tool = function () {
	var modal = document.getElementById('updateToolModel');
	var nameFieldValue = modal.children[0].children[3].value;
	this.node.data.properties.forEach(function (property) {
		if (property.key = "toolName")
			property.value = nameFieldValue;
	});
	var callback = function () {
		Alert("Update applied");
	}
	dataService.UpdateEntity(this.node.id, this.node.data.properties, callback);
	modal.close();
}

// Common functions ...
NodeFunctionsFactory.remove_entity = function () {
	dataService.GetRelatedEntityGraph(this.node.id);
	modal.close();
}
//nodeFunctions.createContentSubsetNode = function () { }
//nodeFunctions.createToolNode = function () { }
//nodeFunctions.createCollectorNode = function () { }
