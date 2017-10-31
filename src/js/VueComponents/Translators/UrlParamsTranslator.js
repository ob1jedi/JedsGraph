
function UrlParamsTranslator() {

	this.Name = "Url Params";
	this.Examples = [
						"x--y",
            "x--y.x--z",
            "x--y.y--z"
	];
	this.ReferenceContent = `
            This format is safe to pass in your URL in the "graph" parameter.
            Example: 
							</br><span class ="inputModal code">http://graphex.io/?graph=x--y.y--z</span>
						<hr>
						Create a node with any alphanumric sequence of characters:
							</br><span class ="inputModal code">node1->MyNode1</span>
						<hr>
						Link multiple nodes with: 
							</br><span class ="inputModal code">--</span>
            Example:
              </br><span class ="inputModal code">n1--n2</span>
	`;
					

	this.Translate = function (expression) {
		var dataSvc = new DataService();
    var regexNodePairs = new RegExp(/(\w+-\w*-\w+)/g);
    var relationRegex = new RegExp(/(-\w*-)/g);
    var graphs = expression.match(regexNodePairs);
    var links = [];
    var nodes = [];
    for (var i = 0; i < graphs.length; i++){
      var singleGraph = graphs[i];
      var relations = singleGraph.match(relationRegex);
      singleGraph = singleGraph.replace(relationRegex, ',')
      var newNode = null;
      var entities = singleGraph.split(',')
      
      for (var e = 0; e < entities.length; e++){
        var entityName = entities[e];
        newNode = nodes.find((s)=>s.data.labels[0]===entityName);
        if (!newNode){
          newNode = dataSvc.CreateEntity_AddToGraph_ReturnNode([entityName]);
          nodes.push(newNode);
        }
        if (e > 0){
          var newRelation = relations[e-1].slice(1,-1);
          var linkName = prevNode.data.labels[0] + "-->" + newNode.data.labels[0];
          if (links.indexOf(linkName) === -1){
            links.push(linkName);
            var link = dataSvc.CreateRelation_AddToGraph_ReturnLink(
				      prevNode.id,
				      newNode.id,
				      (newRelation === null) ? [] : [newRelation]
			      )
          }
        }
        prevNode = newNode;
      }
    }
	}

}
