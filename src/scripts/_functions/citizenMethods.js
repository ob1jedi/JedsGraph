		function hasProperty(propertyList, propertyName)
		{
			var x = false;
				if (!propertyList) return;
				propertyList.forEach(function (prop, index){
					if (prop.key == propertyName)
					{
						x = true;
						return true;
					}
				}); 
			return x;
		}
		
		function hasPropertyWithValue(propertyList, propertyName, value)
		{
			var x = false;
				if (!propertyList) return;
				propertyList.forEach(function (prop, index){
					if (prop.key == propertyName)
					{
						x = (value == prop.value);
						return (value == prop.value);
					}
				}); 
			return x;
		}
		
		function getNodePropertyValue(propertyList, propertyName)
		{
			var x;
			if (!propertyList) return;
			propertyList.forEach(function (prop, index){
				if (prop.key.toLowerCase() === propertyName.toLowerCase())
				{
					x = prop.value;
					return x;
				}
			}); 
			return x;
		}
		
		function mergeProperties(basePropertyList, newPropertyList){
			var updatedList = [];
			var addedList = [];
			
			newPropertyList.forEach(function (newprop){
				var newPropExists = false;
				basePropertyList.forEach(function (baseprop){
					if (baseprop.key == newprop.key){
						newPropExists = true;
						if (baseprop.value != newprop.value){
							baseprop.value = newprop.value;
							updatedList.push(baseprop);
						}
					}
				});
				if (!newPropExists){
					basePropertyList.push(newprop)
					addedList.push(newprop);
					baseprop.push(newprop)
				}
			})
			return basePropertyList;
		}
		
		function propertyListToSvgList(propertyList, prefix, suffix)
		{
			var proplist = ''; 
			propertyList.forEach(function(prop){
				proplist += prefix + prop.key + ": " + prop.value + suffix;
			})
			return proplist;
		}
		
		function getUpdatedProperties(propListFrom, propListTo)
		{
			
			var updatedProperties = [];
			propListFrom.forEach(function(fromProp){				
				var foundProp = false;
				propListTo.forEach(function(toProp){
					if (fromProp.key == toProp.key){
						foundProp = true;
						if (fromProp.value != toProp.value)
						{
							updatedProperties.push({property:toProp, updateType:'update'});
						}
					}
						
				})
				if (!foundProp){ //toProps did not have the property, the property must have been deleted.
					updatedProperties.push({property:fromProp, updateType:'delete'});
				}
			});
			
			//check for new properties (will be in the ToList but not the FromList)
			propListTo.forEach(function(toProp){
				var foundProp = false;
				propListFrom.forEach(function(fromProp){
					if (fromProp.key == toProp.key){
						foundProp = true;
					}
				});
				if (!foundProp){ //fromProps did not have the property, the property must be new.
					updatedProperties.push({property:toProp, updateType:'create'});
				}
			});
			
			return updatedProperties;
		}
		
		function createChildNode(parentNodeId, newNodeName, nodeProperties, relationName, relationProperties)
		{
			var _callback = function (ids) {
				for (var i = 0; i < ids.length; i++) {
					var newNode = globals.GRAPH.getNode(ids[i]);
					//globals.layout.pinNode(newNode, true);
					//var parentPosition = globals.layout.getNodePosition(parentNodeId);
					//globals.layout.setNodePosition(ids[i], parentPosition.x, parentPosition.y);
					globals.dataService.CreateRelation_AddToGraph_ReturnLink(parentNodeId, ids[i], [relationName], relationProperties);
				}
			}
			globals.dataService.CreateEntityReturnCallbackWithIds(newNodeName, nodeProperties, _callback);
		}