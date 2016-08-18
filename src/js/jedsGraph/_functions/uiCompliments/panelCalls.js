	
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
		

		function panelAddKeyValue(panelId, panelScope, _sKey, _sValue) {
		    if (!_sKey) { _sKey = ''; }
		    if (!_sValue) { _sValue = ''; }
		    
		    var $panel = document.getElementById(panelId);
		    var nextIndex = 0; 

		    var newHtml = '';
		    for (var i = 0; i < $panel.children[0].children.length; i++) {
		        var currval = document.getElementById('new.entity.property.value.' + i).value;
		        var currkey = document.getElementById('new.entity.property.key.' + i).value;
		        newHtml += ("<tr><td><input id='" + panelScope +
                ".property.key." + i +
                "' class='dynamic' value='" + currkey +
                "'></input></td><td><input id='" + panelScope + ".property.value." + i +
                "' class='dynamic2' value='" + currval +
                "'></input></td><td></td></tr>");
		        nextIndex = i + 1;
		    }
		     newHtml += ("<tr><td><input id='" + panelScope +
                ".property.key." + nextIndex +
                "' class='dynamic' value='" + _sKey +
                "'></input></td><td><input id='"+ panelScope +".property.value." + nextIndex +
                "' class='dynamic2' value='" + _sValue +
                "'></input></td><td></td></tr>");
		     $panel.children[0].innerHTML = newHtml;
		}
		function panelRemoveKeyValue(panelId) {
		    var panel = document.getElementById(panelId);
		    if (panel.children[0].children.length == 0) { return; }
		    panel.children[0].children[panel.children[0].children.length - 1].remove();
		}

		function removeLastElement() {
		    var ui = selectedNodeUI.children[selectedNodeUI.children.length - 1];
		    selectedNode.data.UI.focusUI.remove();
		}