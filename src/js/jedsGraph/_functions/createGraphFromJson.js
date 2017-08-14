
		function jsonStringToObject(jsonString)
		{
			return JSON.parse(jsonString);
		}
		
		function submitJsonForGraph()
		{
			var jsonString = document.getElementById('dlg.text.json').value;
			jsonToGraph(jsonString);
			closeDialog('json2GraphDlg');
		}
		
		function jsonToGraph(jsonString, _sourceConfig){
			
			var graphData = processJsonToGraph('root', jsonStringToObject(jsonString), null, 0);
			//ADD NODES...
			graphData.nodes.map(function(nData){
				//match node to existing nodes

				if (nData.temp.matchedNodes > 0){//...update existing node
					//there is no parent, but there are existing matching nodes, therefore make all the matching nodes our root nodes. (we will update all their paths)
					nData.temp.matchedNodes.forEach(function (existingNode){
						//update existing node
						existingNode.data.properties = mergeProperties(existingNode.data.properties, existingNode.data.temp.properties)
						addDataNode(existingNode.id, existingNode.data, _sourceConfig);
					});
				}
				else { //create new node...
					nData.properties = nData.temp.properties;
					addDataNode(nData.id, nData, _sourceConfig)
				}
			});
			
			//ADD LINKS...
			graphData.links.map(function(lData){
				addDataLink(lData.fromNodeID, lData.toNodeID, lData, _sourceConfig)
			});
		}
		
		function processJsonToGraph(name, obj, parentNodeData, level)
		{
			console.log('CONVERT', 1);
			var stillRoot = parentNodeData ? false : true;
			if (!stillRoot){if (!parentNodeData.temp.parentNodeData) {stillRoot = true;}}
			var fromNodeId = parentNodeData ? parentNodeData.id : 'root';
			level++;
			var type = getType(obj);
			var graphData = {nodes:[], links:[]};
			var relationsAdded = false;
			//create a node (will only be applied if this is actually an object (not a primitive or array))
			var nodeData = new nodeDataType();
			nodeData.labels = [name];
			nodeData.id = 'newnode_'+ (++processUniqueId);
			nodeData.temp = {};
			nodeData.temp.stillRoot = stillRoot;
			nodeData.temp.matchedNodes = []; //if '$matchon' is specified then this list will be existing matching nodes
			nodeData.temp.parentNodeData = parentNodeData;
			nodeData.temp.properties = [];
			
			nodesListData = [];
			
			//Process object...
			if (type == 'object'){
				//Find existing nodes by matching label
				
				var nodeDataProperties = [];
				//Filter matching nodes by key properties...
				for (var propName in obj){	
					if (propName == '$matchon'){//...meta data (matchon)...
						//...$matchon should be an array of strings, who's values specify which fields in the current entity, to match on.
						var matchPropertyList = []
						var onPath = false;
						obj['$matchon'].forEach(function (matchPropName){
							if (matchPropName == '$onpath'){
								onPath = true;
							}else{
								matchPropertyList.push(new propertyType(matchPropName, obj[matchPropName]));
							}
						});
						
						var eligibleNodesList = nodeList; //...Search all nodes by default
						if (onPath==true){
							//Only search nodes on the existing path (child nodes of the parent node)...
							eligibleNodesList = getNodesByMatchingLabels((stillRoot)? nodeList : parentNodeData.toNodes , nodeData.labels);
						}
						
						nodeData.temp.matchedNodes = getNodesByMatchingProperties(eligibleNodesList, matchPropertyList);				
						nodeData.temp.matchedNodes.map(function(mn){
							mn.data.temp = {}
							mn.data.temp.matchedNodes = [mn];
							mn.data.temp.properties = [];
							mn.data.temp.parentNodeData = parentNodeData;
							nodesListData.push(mn.data);
						});
					}
					
					else if (propName == '$rel'){//...meta data (relationship)...
						obj[propName].forEach(function (relation){ //...iterate throguh relationships
							var newLinkData = new linkDataType(fromNodeId, newNode.id, ++processUniqueId, relation['$name']);
							newLinkData.properties = [];
							//iterate through relationship properties...
							for (var relPropName in relation){//.forEach(function(prop){
								newLinkData.properties.push(new propertyType(relPropName, relation[relPropName]));
							}
							graphData.links.push(newLinkData); //...add specified link
							relationsAdded = true;
						})
					}
					
					else { //...Since this property is not a meta property, add it to the data proerties list...
						nodeDataProperties.push(propName);
					}
				}
				
				if (nodesListData.length == 0){ //...no existing nodes exist matching this node
					//Create a new node...
					nodesListData = [nodeData]; //...add new node
					//nodeData.temp.matchedNodes = [nodeData]
				}
				
				//get all the properties for the object
				nodesListData.forEach(function (newNode){ 
					
					//for (var propName in obj){
					nodeDataProperties.forEach(function(nodePropName){
						//process non-meta property
						//else { //...property is not meta data... (could be anything)
						var subGraphData = processJsonToGraph(nodePropName, obj[nodePropName], newNode, level)
						if (subGraphData){
							subGraphData.nodes.map(function (n){graphData.nodes.push(n);});
							subGraphData.links.map(function (l){graphData.links.push(l);});
						}
					});

					//ADD THIS NODE...
					if (parentNodeData) { //node has a parent, which means its not a root object (because a valid object will at least have the root node as a parent)
						graphData.nodes.push(newNode);
					}
					
					//ADD A RELATIONSHIP (if not already added, and not a root connection)...
					if (!relationsAdded){ //...no relationships were explicitly mentioned

						if (parentNodeData && parentNodeData.temp.parentNodeData) //...there is actually a parent, and a grandparent, to create a link to
						{

							//link this node to the parent node (will only be applied if this is actually an object (not a primitive or array))
							var defaultLink = new linkDataType(fromNodeId, newNode.id, 'newlink_'+ (++processUniqueId), 'DEFAULT')						
							graphData.links.push(defaultLink);
						}
					}
				})//...next new/existing node
				
				return graphData;
			}
			//Process array...
			else if (type == 'array'){
				//iterate through elements...
				obj.forEach(function(element){
					var subGraphData;
					subGraphData = processJsonToGraph(nodeData.labels[0],element, parentNodeData, level)
					if (subGraphData){
						subGraphData.nodes.map(function (n){graphData.nodes.push(n);});
						subGraphData.links.map(function (l){graphData.links.push(l);});
					}
				})
				return graphData;
			}
			//Process primitive...
			else{ //...property is a primitive
				if(parentNodeData){
					var subGraphData = parentNodeData.temp.properties.push(new propertyType(name, obj));
					return graphData; //return nothing since its only a property
				}
			}

		}