
var SimpleTranslator = function () {
  var _references = [];
  
  // Reference character
  var _r = '#'; 
  // Appender character
  var _a = '^';
  // Continuouse character
  var _c = '&';

	this.Name = "Simply Graphex";
	this.Examples = [
						"x->y",
						"Sam->John"+_a+"->Bob",
						"-->Product->3",
						"Diana-MotherOf->William&Harry",
						"Fe(name: Iron)",
						"C(name: Carbon, weight: 12.011)",
						"Oxygen->Hydrogen(1) & Hydrogen(2)",
            "Mother"+_r+"M->Father"+_r+"F; "+_r+"F->"+_r+"M; "+_r+"M->Son; "+_r+"F->Son; Son->Grandson",
            "Sun"+_r+"S->Earth"+_r+"E; "+_r+"S->Mars"+_r+"M; "+_r+"E->Moon; "+_r+"M->Phobos;"
	];
	this.ReferenceContent = ''
						+'Type any word to create a node, eg. <span class ="inputModal code">John</span>'
						+'<hr>'
						+'Create a node with some attributes, eg.'
						+'	</br><span class ="inputModal code">John(age: 30, sex: male)</span>'
						+'<hr>'
						+'Create a relationship between two nodes:'
						+'	</br><span class ="inputModal code">node1->node2</span>'
						+'<hr>'
						+'Link multiple nodes in a chain:'
						+'	</br><span class ="inputModal code">n1->n2->n3->n4</span>'
						+'<hr>'
						+'Link multiple nodes to one node:'
						+'	</br><span class ="inputModal code">n1->n2 & n3 & n4</span>'
						+'<hr>'
						+'Alternative relationship syntax: <span class ="inputModal code">--></span>'
						+'<hr>'
						+'Create relationship with a name: <span class ="inputModal code">-name-></span>'
						+'<hr>'
						+'Create relationship with a name and some attributes:'
						+'	</br><span class ="inputModal code">-owns(since: 2010) -></span>'
						+'<hr>'
						+'Select the node using the <span class ="inputModal code">'+_a+'</span> symbol:'
						+'	</br><span class ="inputModal code">node1->node2 '+_a+'</span>'
						+'<hr>'
            +'Create a temporary node reference using the <span class ="inputModal code">'+ _r+ '</span> character:'
            +'  </br><span class ="inputModal code">star '+_r+'S->planet '+_r+'P; '+_r+'S->sun; '+_r+'P->Earth</span>';
	
  this.TranslateGraphToFormula = function()
  {
    var statements = [];
    globals.nodeList.forEach(function(node){
      var props = JSON.stringify(node.data.propertiesObject).gxTrimBrackets();
      var label = node.data.labels[0];
      var statement = label +'#'+ node.id + ((node.data.properties.length > 0)? ('(' + props + ')'):'') + ';';
      statements.push(statement);
    });

    globals.linkList.forEach(function(link){
      var fromNode = "#" + link.fromId;
      var toNode = "#" + link.toId;
      var props = JSON.stringify(link.data.propertiesObject).gxTrimBrackets();
      var label = link.data.name[0];
      var linkDetails = label + ((link.data.properties.length > 0)? ('(' + props + ')'):'');
      if (link.data.name.length == 0){
        statements.push(fromNode+'->'+toNode+';');
      }
      else{
        statements.push(fromNode + '-' + linkDetails + '->' +  toNode +';');
      }    
    });
    return statements.join('');
  }

	this.Translate = function (expression) {
    _references = [];
    var subExpressions = expression.split(';');
    for (var i =0; i< subExpressions.length; i++){
      if (subExpressions[i].trim().length > 0)
        processExpression(subExpressions[i].trim());
    }
	}

  function processExpression(expression){
    var dataSvc = new DataService();
    var elements = expression.split('->');
		var currentElement = elements[0].trim();
		var currentEntity = getEntityDetails(currentElement.trim());
		var currentNodes = [];
		if (currentEntity === null) {
			//...we're attaching to the currently selected node on the stage
			if (!IsNodeSelected) return;
			currentNodes = [globals.selectedNode];
		}
		else {
      //...we're creaing a new node.
      currentNodes = getNodesFromStage(currentEntity.labels, currentEntity.properties);
			if (currentNodes.length == 0 ){
        currentNodes = currentNodes.concat(createEntityAddToGraphReturnNodes(currentEntity.labels, currentEntity.properties));
        console.log('currentNodes', currentNodes);
      }
			if (mustSelectNode(currentElement))
				highlightSelectedNode(currentNode.id);
		}

		for (var i = 1 ; i < elements.length; i++) {
			var nextElement = elements[i].trim();
			var subElements = nextElement.split('&');
			var relation = getRelationDetails(currentElement);
			for (s = 0; s < subElements.length; s++) {
				var subElement = subElements[s].trim();
				var nextEntity = getEntityDetails(subElement);
				var nextNodes = [];
				if (nextEntity === null) {
					//...we're attaching to the currently selected node on the stage
					if (!IsNodeSelected) return;
					nextNodes = [globals.selectedNode];
				}
				else {
          //...we're creaing a new node.
					nextNodes = getNodesFromStage(nextEntity.labels, nextEntity.properties);
          if (nextNodes.length == 0)      
            nextNodes = createEntityAddToGraphReturnNodes(nextEntity.labels, nextEntity.properties);
					if (mustSelectNode(subElement)){
						nextNodes.forEach(function(nextNode) {highlightSelectedNode(nextNode.id)});
          }
					applyPopoutEffectToNode(nextNodes[0], currentNodes[0].id);
				}

        //Create relationship
        currentNodes.forEach(function(currentNode) {
				  nextNodes.forEach(function(nextNode) {
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
  
  function createEntityAddToGraphReturnNodes(labels, properties){
    var dataSvc = new DataService();
    var idAndLabelArray = labels[0].split(_r);
    var label = idAndLabelArray[0].trim().gxTrimQuotes();
    var id = null;

    if (idAndLabelArray.length > 1){      
      id = idAndLabelArray[1].trim();
    }

    if (isUsingReference(label, id))
      return returnReferenceNodes(id);
    
    validateLabelName(label);

    var newNode = dataSvc.CreateEntity_AddToGraph_ReturnNode([label], properties)
    
    if (isDeclaringReference(label, id))
      addToReferences(id, newNode);

    return [newNode];
  }
  function returnReferenceNodes(id){
    for (var i = 0; i < _references.length ; i++)
      if (_references[i].id == id)
        return _references[i].nodes;
    throw "Could not find node reference: '"+_r+""+ id + '. A '+_r+'ref syntax is used to refer to an existing node, or to create a node reference. ';
  }
  function addToReferences(id, newNode){
    var existingReference = null;
      for (var i = 0; i < _references.length ; i++){
        if (_references[i].id == id){
          existingReference.nodes.push(newNode);
          return;
        }
      }
      _references.push({"nodes": [newNode], "id": id})
  }
  function isUsingReference(label, id){
    return label.length == 0 && id;
  }

  function isDeclaringReference(label, id){
    return label.length > 0 && id;
  }
  function validateLabelName(label){
    if (label.length == 0)
      throw "Invalid formula. Node label is empty";
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
		return (element.indexOf(_a) > -1);
	}
	function IsNodeSelected() {
		if (!globals.selectedNode) {
			alert("You must select an existing node first.");
			return false;
		}
		return true;
	}
	function getEntityDetails(element) {
		element = element.replace(_a, '');
		var nodePart = getNodePart(element);
		if (nodePart === '')
			return null;
		var nodeLabel = getElementLabel(nodePart);
		var nodeProperties = getElementProperties(nodePart);
		return {
			labels: [nodeLabel.trim().gxTrimQuotes()],
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
			labels: [linkLabel.trim().gxTrimQuotes()],
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
			var propName = propElements[0].trim().gxTrimQuotes();
			var propValue = (propElements.length > 1)? propElements[1].trim().gxTrimQuotes(): "";
			//if (propElements.length > 1)
			//	propValue = propElements[1].trim().graphexTrimQuotes();
			actualPropertiesObject[propName] = propValue;
		});
		return actualPropertiesObject
	}

}
