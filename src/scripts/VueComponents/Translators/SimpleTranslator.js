
var SimpleTranslator = function () {
	this.Name = "Simply Graphex";
	this.Examples = [
						"x->y",
						"Sam->John^->Bob",
						"-->Product->3",
						"Diana-MotherOf->William&Harry",
						"Fe(name: Iron)",
						"C(name: Carbon, weight: 12.011)",
						"Oxygen->Hydrogen & Hydrogen",
            "mom->dad; mom->me; dad->me; me->son"
	];
	this.ReferenceContent = `
						Type any word to create a node, eg. <span class ="inputModal code">John</span>
						<hr>
						Create a node with some attributes, eg.
							</br><span class ="inputModal code">John(age: 30, sex: male)</span>
						<hr>
						Create a relationship between two nodes:
							</br><span class ="inputModal code">node1->node2</span>
						<hr>
						Link multiple nodes in a chain:
							</br><span class ="inputModal code">n1->n2->n3->n4</span>
						<hr>
						Link multiple nodes to one node:
							</br><span class ="inputModal code">n1->n2 & n3 & n4</span>
						<hr>
						Alternative relationship syntax: <span class ="inputModal code">--></span>
						<hr>
						Create relationship with a name: <span class ="inputModal code">-name-></span>
						<hr>
						Create relationship with a name and some attributes:
							</br><span class ="inputModal code">-owns(since: 2010) -></span>
						<hr>
						Select the node using the caret symbol:
							</br><span class ="inputModal code">node1->node2^</span>
						<hr>
	`;
					

	this.Translate = function (expression) {
    var subExpressions = expression.split(';');
    for (var i =0; i< subExpressions.length; i++){
      processExpression(subExpressions[i].trim());
    }
	}

  function processExpression(expression){
    var dataSvc = new DataService();
    var elements = expression.split('->');
		var currentElement = elements[0];
		var currentEntity = getEntityDetails(currentElement.trim());
		var currentNodes = [];
		if (currentEntity === null) {
			//...we're attaching to the currently selected node on the stage
			//debugger;
			if (!IsNodeSelected) return;
			currentNodes = [globals.selectedNode];
		}
		else {
      currentNodes = getNodesFromStage(currentEntity.labels, currentEntity.properties);
			if (currentNodes.length == 0 )
        currentNodes.push(dataSvc.CreateEntity_AddToGraph_ReturnNode(currentEntity.labels, currentEntity.properties));
			if (mustSelectNode(currentElement))
				highlightSelectedNode(currentNode.id);
		}

		for (var i = 1 ; i < elements.length; i++) {
			var nextElement = elements[i];
			var subElements = nextElement.split('&');
			var relation = getRelationDetails(currentElement);
			for (s = 0; s < subElements.length; s++) {
				var subElement = subElements[s];
				var nextEntity = getEntityDetails(subElement);
				var nextNodes = [];
				if (nextEntity === null) {
					//...we're attaching to the currently selected node on the stage
					if (!IsNodeSelected) {
						return;
					}
					nextNodes = [globals.selectedNode];
				}
				else {
					//...we need to create a new entity.
					//if (AppendToStageNode == true) {
						//TODO: perform search...
					//}
					nextNodes =getNodesFromStage(nextEntity.labels, nextEntity.properties);
          if (nextNodes.length == 0)      
            nextNodes = [dataSvc.CreateEntity_AddToGraph_ReturnNode(nextEntity.labels, nextEntity.properties)];
					if (mustSelectNode(subElement)){
						nextNodes.forEach((nextNode) => highlightSelectedNode(nextNode.id));
          }
					applyPopoutEffectToNode(nextNodes[0], currentNodes[0].id);
				}
        currentNodes.forEach((currentNode) => {
				  nextNodes.forEach((nextNode) => {
            var link = dataSvc.CreateRelation_AddToGraph_ReturnLink(
					    currentNode.id,
					    nextNode.id,
					    (relation === null) ? [] : relation.labels,
					    (relation === null) ? {} : relation.properties
				    );
          });
        });
			}
			currentElement = nextElement;
			currentNodes = nextNodes;
		}
  }

  function getNodesFromStage(labels, properties){
    var nodes = [];
    for (var i = 0; i < globals.nodeList.length; i++){
      var labelsMatch = true;
      for (var l = 0; l < labels.length; l++){
        if (globals.nodeList[i].data.labels.indexOf(labels[l]) == -1)
          labelsMatch = false;
      }
      if (labelsMatch){
        var propertiesMatch = true;
        for (var key in properties)
          if (globals.nodeList[i].data.propertiesObject[key] != properties[key])
            propertiesMatch = false;
      }
      if (labelsMatch && propertiesMatch)
        nodes.push(globals.nodeList[i]);
      
    }
    return nodes;
  }
	function mustSelectNode(element)
	{
		return element.includes('^');
	}
	function IsNodeSelected() {
		//debugger;
		if (!globals.selectedNode) {
			alert("You must select an existing node first.");
			return false;
		}
		return true;
	}
	function getEntityDetails(element) {
		element = element.replace('^', '');
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
