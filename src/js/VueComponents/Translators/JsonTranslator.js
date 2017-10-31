function JsonTranslator() {
  var _graphEntities=[];
  var _graphRelations=[];
  var _jsonHelper=new JsonHelper;

  this.Name="Json 1";
  this.Examples=[
          '{"x":{"y":{}}}',
          '{"Sam":{"Bob":{"John":{}}}}'
  ];
  this.ImportExamples=[
    {
      name: "This day in history", 
      params: ["$day", "$month", "$year"],
      value: 'http://en.wikipedia.org/api/rest_v1/feed/featured/$year/$month/$day' 
    }
  ];

  this.ReferenceContent=`
						Objects are nodes, eg. <span class ="inputModal code">{"John":{}}</span>
						<hr>
						Nodes start from the properties of the root node.
						The root node is never materialized.
						<hr>
						Arrays will become nodes by the name of the parent property.
	`;

  this.Translate=function(expression,_baseObjectName) {
    var translator=new JsonTranslator();
    //console.log('expression', expression);
    translator.TranslateToGraph_ReturnGraphElements(_baseObjectName||'root',expression);
  }

  this.TranslateToGraph_ReturnGraphElements=function(objectName,jsonString) {
    var jsonObject=JSON.parse(jsonString);
    //debugger;
    if(isObject(jsonObject) && hasPrimitives(jsonObject))
      createEntity(objectName,jsonObject);
    else if (isObject(jsonObject))
      processObject(jsonObject)
    else if(isArray(jsonObject)) 
      processArray(objectName, jsonObject);
    else if(isPrimitive(jsonObject)) {
      createEntity(jsonString,{});
    }

    var dataService=new DataService();
    for(var e=0;e<_graphEntities.length;e++) {
      var node=dataService.CreateEntity_AddToGraph_ReturnNode(_graphEntities[e].labels,_graphEntities[e].properties);
      _graphEntities[e].id=node.id;
    }

    var graphElements=[];
    for(var e=0;e<_graphRelations.length;e++) {
      var link=dataService.CreateRelation_AddToGraph_ReturnLink(_graphRelations[e].fromEntity.id,_graphRelations[e].toEntity.id,_graphRelations[e].labels,_graphRelations[e].properties);
      var newGraphElement=new GraphElement();
      newGraphElement.fromNode=globals.GRAPH.getNode(link.fromId);
      newGraphElement.toNode=globals.GRAPH.getNode(link.toId);
      newGraphElement.link=link;
      graphElements.push(newGraphElement);
    }

    return graphElements;
  }

  function processObject(obj){
    for(var thingKey in obj) {
        if(isObject(obj[thingKey]))
          createEntity(thingKey,obj[thingKey]);
        else if(isArray(obj[thingKey])) {
          processArray(thingKey, obj[thingKey]);
        }
      }
  }

  function processArray(name, array) {
    for(var i=0;i<array.length;i++) {
      if(isObject(array[i]))
        createEntity(name,array);
      else if(isPrimitive(array[i])) {
        createEntity(array[i],{});
      }
    }
  }


  function createEntity(name,obj) {
    var newEntity=new Entity();
    newEntity.labels=[name];
    newEntity.properties={};
    var newLinks=[];
    for(var propertyKey in obj) {
      if(isPrimitive(obj[propertyKey])) {
        newEntity.properties[propertyKey]=obj[propertyKey];
      }
      if(isObject(obj[propertyKey])) {
        var newChildEntity=createEntity(propertyKey,obj[propertyKey]);
        newLinks.push(createRelation('',[],newEntity,newChildEntity));
      }
      if(isArray(obj[propertyKey])) {
        for(var i=0;i<obj[propertyKey].length;i++) {
          if(isObject(obj[propertyKey][i])) {
            var newChildEntity=createEntity(propertyKey,obj[propertyKey][i]);
            newLinks.push(createRelation('',[],newEntity,newChildEntity));
          }
          if (isPrimitive(obj[propertyKey][i])){
            var newChildEntity=createEntity(propertyKey,obj[propertyKey][i]);
            newLinks.push(createRelation('',[],newEntity,newChildEntity));
          }
        }
      }

    }
    newEntity.links=newLinks;
    _graphEntities.push(newEntity);
    return newEntity;
  }

  function createRelation(name,properties,fromEntity,toEntity) {
    var newRelation=new Relationship();
    newRelation.labels=[name];
    newRelation.properties=properties;
    newRelation.fromEntity=fromEntity;
    newRelation.toEntity=toEntity;
    _graphRelations.push(newRelation);
    return newRelation;
  }

  function isObject(obj) {
    return getType(obj)=='object'
  }

  function isArray(obj) {
    return getType(obj)=='array'
  }

  function isPrimitive(obj) {
    return getType(obj)!='object'&&getType(obj)!='array'
  }
  function hasPrimitives(obj) {
    for(var thingKey in obj)
      if(isPrimitive(obj[thingKey]))
        return true;
    return false;
  }
}