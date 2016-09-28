	
		function createNode(){
			var newNodeValue = document.getElementById('newNodeData').value;
			Neo4jCreateNode(newNodeValue);
		}
		
		function getEntityNode(){
			var newNodeValue = document.getElementById('nodeLabel').value;
			Neo4jGetNodesByLabel(newNodeValue);
		}
		
		function deleteNode(){
			Neo4jDeleteNode(selectedNodeID);
		}
		
		function deleteLink() {
		    if (!selectedLink) { return; }
		    Neo4jDeleteRelationship(selectedLink.data.id);
		}

		function relateSelectedToNode(){
			bRelate = true;
		}
		
		function planRelateSelectedToNode(){
			bPlanRelate = true;
		}

		function fontGrow()
		{
			if (!selectedNode.data.UI.displayTextUI){return;}
			var fontsize = Number(selectedNode.data.UI.displayTextUI.attr('font-size'));
			selectedNode.data.UI.displayTextUI.attr('font-size', fontsize + 1);
		}
		function fontShrink()
		{
			if (!selectedNode.data.UI.displayTextUI){return;}
			var fontsize = Number(selectedNode.data.UI.displayTextUI.attr('font-size'));
			selectedNode.data.UI.displayTextUI.attr('font-size', fontsize - 1);
		}
		function fontDown()
		{
			if (!selectedNode.data.UI.displayTextUI){return;}
			var fontsize = Number(selectedNode.data.UI.displayTextUI.attr('y'));
			selectedNode.data.UI.displayTextUI.attr('y', fontsize + 1);
		}
		function fontUp()
		{
			if (!selectedNode.data.UI.displayTextUI){return;}
			var fontsize = Number(selectedNode.data.UI.displayTextUI.attr('y'));
			selectedNode.data.UI.displayTextUI.attr('y', fontsize - 1);
		}
		
		
		function updateViewOptions()
		{
			viewOptions.highlightRelated = document.getElementById('vo.hr').checked;
			viewOptions.highlightAncestors = document.getElementById('vo.ha').checked;
			viewOptions.highlightdescendants = document.getElementById('vo.hd').checked;
		}

		function updateDragOptions(){
		    if (document.getElementById('do.flat').checked) { viewOptions.screenDragType = 'flat' };
		    if (document.getElementById('do.depth').checked) { viewOptions.screenDragType = 'depth' };
		}
		function updateViewOptions_Nav(navoption)
		{
			viewOptions.navigateDirection = navoption;
		}
		
		function updateInteractionOptions()
		{
			interactionOptions.checkNodes = document.getElementById('vo.ch').checked;
		}
		
		function unPinSelectedNode()
		{
			unPinNode(selectedNode);
		}
		
		function ButtonSimpleSearch()
		{
			//var fromEntity = document.getElementById('qbuilder.from.entity').value;
			var selectedEntityValue = document.getElementById('qbuilder.from.entity').value;
			var sourcePrefix = selectedEntityValue.substring(selectedEntityValue.length-3);
			var entityName = selectedEntityValue.substring(0, selectedEntityValue.length-3);
			
			var fromProperty = document.getElementById('qbuilder.from.property').value;
			var fromValue = document.getElementById('qbuilder.from.value').value;
			Neo4jQuerySimpleSearch(entityName, fromProperty, fromValue, getConfigByPrefix(sourcePrefix));
		}
		

