
var XYTranslator = function () {

	this.TranslateV1 = function (expression) {
		var dataSvc = new DataService();
		var nodes = expression.split("->");
		var newNodes = [];
		nodes.forEach(function (nodeLabel) {
			var newNode = dataSvc.CreateEntity_AddToGraph_ReturnNode([nodeLabel.trim()]);
			newNodes.push(newNode);
		});
		if (newNodes.length > 1) {
			for (var i = 0; i < newNodes.length - 1; i++) {
				var newlink = dataSvc.CreateRelation_AddToGraph_ReturnLink(newNodes[i].id, newNodes[i + 1].id, "");
			}
		}
	}

	this.TranslateV2 = function (expression) {
		var dataSvc = new DataService();

		var nodes = getNodes(expression);
		nodes.forEach(function (nodeName) {
			dataSvc.CreateEntity_AddToGraph_ReturnNode([nodeName.trim()]);
		});
	}
	function getNodes(expression) {
		var myRe = />*{.+}-*/g;
		var myArray = myRe.exec(expression);
		debugger;
		return myArray;
	}

	this.TranslateV3 = function (expression) {
		var dataSvc = new DataService();
		var elements = expression.split('->');
		var graph = [];
		var currentElement = elements[0];
		var currentEntity = getEntityDetails(currentElement.trim());
		var currentNode = null;
		if (currentEntity === null) {
			//...we're attaching to the currently selected node on the stage
			//debugger;
			if (!IsNodeSelected) return;
			currentNode = selectedNode;
		}
		else {
			currentNode = dataSvc.CreateEntity_AddToGraph_ReturnNode(currentEntity.labels, currentEntity.properties);
		}

		for (var i = 1 ; i < elements.length; i++) {
			var nextElement = elements[i];
			var subElements = nextElement.split('+');
			var relation = getRelationDetails(currentElement);
			for (s = 0; s < subElements.length; s++) {
				var nextEntity = getEntityDetails(subElements[s]);
				var nextNode = null;
				if (nextEntity === null) {
					//...we're attaching to the currently selected node on the stage
					if (!IsNodeSelected) {
						return;
					}
					nextNode = selectedNode;
				}
				else {
					//...we need to create a new entity.
					//if (AppendToStageNode == true) {
						//TODO: perform search...
					//}
					nextNode = dataSvc.CreateEntity_AddToGraph_ReturnNode(nextEntity.labels, nextEntity.properties);
					applyPopoutEffectToNode(nextNode, currentNode.id)
				}
				var link = dataSvc.CreateRelation_AddToGraph_ReturnLink(
					currentNode.id,
					nextNode.id,
					(relation === null) ? [] : relation.labels,
					(relation === null) ? {} : relation.properties
				)
			}
			currentElement = nextElement;
			currentNode = nextNode;
		}
	}
	function IsNodeSelected() {
		//debugger;
		if (!selectedNode) {
			alert("You must select an existing node first.");
			return false;
		}
		return true;
	}
	function getEntityDetails(element) {
		var nodePart = getNodePart(element);
		if (nodePart === '')
			return null;
		var nodeLabel = getElementLabel(nodePart);
		var nodeProperties = getElementProperties(nodePart);
		return {
			labels: [nodeLabel.trim()],
			properties: nodeProperties
		}
	}
	function getRelationDetails(element) {
		var linkPart = getLinkPart(element);
		if (linkPart === null)
			return null;
		var linkLabel = getElementLabel(linkPart);
		var linkProperties = getElementProperties(linkPart);
		return {
			labels: [linkLabel.trim()],
			properties: linkProperties
		}
	}

	function getNodePart(element) {
		return element.split('-')[0];
	}
	function getLinkPart(element) {
		var elementParts = element.split('-');
		return elementParts.length > 1 ? elementParts[1] : null;
	}

	function getElementLabel(nodePart) {
		return nodePart.split('(')[0];
	}
	function getElementProperties(nodePart) {
		var nodeSections = nodePart.split('(');
		if (nodeSections.length < 2)
			return {}
		var propertySection = nodeSections[1].trim();
		var propertiesString = propertySection.substr(0, propertySection.length - 1);
		var nodeProps = propertiesString.split(',');
		var actualPropertiesObject = {};
		nodeProps.forEach(function (keyValuePair) {
			var propElements = keyValuePair.split(':');
			var propName = propElements[0].trim();
			var propValue = "";
			if (propElements.length > 1)
				propValue = propElements[1].trim();
			actualPropertiesObject[propName] = propValue;
		});
		return actualPropertiesObject
	}
}
