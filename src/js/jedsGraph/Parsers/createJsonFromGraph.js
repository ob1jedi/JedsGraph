
		function createJsonFromSelectedNodes()
		{
			//get the rootmost objects amongst the check nodes...
			var rootMostNodes = [];
			var processedNodes = [];
			checkedNodes.forEach(function(node) { //iterate through checked nodes...
				if (processedNodes.map(function(n) {return n.id}).indexOf(node.id) == -1){ //...node has not been processed yet
					processedNodes.push(node); //...add node to processed list
					var isRootNode = true;
					node.data.fromNodes.forEach(function (fromnode){ //...iterate through current node's fromNodes
						if (checkedNodes.map(function(n) {return n.id}).indexOf(node.id) > -1) //...current fromNode is in the checkedNodes list, therefore its not a rootmost node
						{	
							isRootNode = false;
							return;
						}
					})
					if (isRootNode) {rootMostNodes.push(node);}
				}
			});
			if (rootMostNodes.length == 0 && checkedNodes.length != 0) {rootMostNodes.push(checkedNodes[0]);}  //resolve a cyclic scenario by just picking the first checked node.

			var rootObject = {};
			processedNodes  = [];
			var labels = [];
			rootMostNodes.map(function(n, index) {if (labels.indexOf(n.data.labels[0]) == -1){labels.push(n.data.labels[0]);} });
			
			labels.forEach(function (nodeLabel) {
				var useArray = false;
				var count = 0;
				rootMostNodes.map(function (n) { if (n.data.labels[0] == nodeLabel) { count++; } });
				if (count > 1) {useArray = true;}
				if (useArray) { rootObject[nodeLabel] = []; }
				rootMostNodes.forEach(function (node) {
					if (node.data.labels[0] == nodeLabel) {
						if (useArray) 
							rootObject[nodeLabel].push(createJsonFromNode(node, {}, processedNodes));
						else
							rootObject[nodeLabel] = createJsonFromNode(node, {}, processedNodes);
					}
				})
			});			
			var jsonstring = JSON.stringify(rootObject);
			var dialog = document.getElementById('myDialog');
			var dialogText = document.getElementById('myDialogText');
			dialogText.innerHTML = jsonstring
			dialog.showModal();
		}

		function createJsonFromNode(node, parentObject, processedNodes, parentNode)
		{
		
			var entityName = node.data.labels[0]; 
			var thisObject = {};
			parentObject[entityName] = thisObject;
			thisObject['$type'] = entityName;
			processedNodes.push(node);
			var relationships = [];
			if (parentNode){	
				node.data.fromLinks.forEach(function(link){
					if (link.fromId == parentNode.id)
					{
						relationship = {};
						relationship['$name'] = link.data.name;
						link.data.properties.forEach(function(prop){
							relationship[prop.key] = prop.value;
						} );
						relationships.push(relationship);
					}
				})
			}
			if (relationships.length >0){
				thisObject['$rel'] = relationships
			}
			
			node.data.properties.forEach(function(prop){
				thisObject[prop.key] = prop.value;
			});

			//process child nodes...
			var labels = [];
			node.data.toNodes.map(function(n, index) {if (labels.indexOf(n.data.labels[0]) == -1){labels.push(n.data.labels[0]);} });
			
			labels.forEach(function (nodeLabel) {
				
				var useArray = false;
				var count = 0;
				node.data.toNodes.map(function (n) { if (n.data.labels[0] == nodeLabel) { count++; } });
				if (count > 1) {useArray = true;}
				if (useArray) { thisObject[nodeLabel] = []; }
				
				node.data.toNodes.forEach(function (childNode){
					if (childNode.data.labels[0] == nodeLabel && count > 0)
					{
						if (processedNodes.indexOf(childNode.id) == -1)
						{
							if (checkedNodes.map(function(n){return n.id}).indexOf(childNode.id) > -1)
							{
								if (useArray) 
									thisObject[nodeLabel].push(createJsonFromNode(childNode, {}, processedNodes, node));
								else 
									thisObject[nodeLabel] = createJsonFromNode(childNode, {}, processedNodes, node);
							}
						}
					}
				})
			})
			return thisObject;
		}