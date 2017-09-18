function JsonParser() {
    var _graphEntities = [];
    var _graphRelations = [];

    this.TranslateToGraph_ReturnGraphElements = function (objectName, jsonString)
    {
        var jsonObject = JSON.parse(jsonString);

        if (isObject(jsonObject))
            createEntity(objectName, jsonObject);
        else if (isArray(jsonObject))
            for (var i = 0; i < jsonObject.length; i++) {
                if (isObject(jsonObject[i]))
                    createEntity(objectName, jsonObject);
            }
        else {
            // If the input is only a primitive, null or undefined, then throw an error.
            throw "Invalid input: Cannot make a graph from this input."
        }
        
        var dataService = new DataService();
        for (var e = 0; e < _graphEntities.length; e++)
        {
            var node = dataService.CreateEntity_AddToGraph_ReturnNode(_graphEntities[e].labels, _graphEntities[e].properties);
            _graphEntities[e].id = node.id;
        }

        var graphElements = [];
        for (var e = 0; e < _graphRelations.length; e++) {
            var link = dataService.CreateRelation_AddToGraph_ReturnLink(_graphRelations[e].fromEntity.id, _graphRelations[e].toEntity.id, _graphRelations[e].labels, _graphRelations[e].properties);
            var newGraphElement = new GraphElement();
            console.log('link', link);
            newGraphElement.fromNode = GRAPH.getNode(link.fromId);
            newGraphElement.toNode = GRAPH.getNode(link.toId);
            newGraphElement.link = link;
            graphElements.push(newGraphElement);
        }

        return graphElements;
    }

    function createEntity(name, obj) {
        var newEntity = new Entity();
        newEntity.labels = [name];
        newEntity.properties = {};
        var newLinks = [];
        for (var propertyKey in obj) {
            if (isPrimitive(obj[propertyKey])) 
                newEntity.properties[propertyKey] = obj[propertyKey];
            if (isObject(obj[propertyKey])) {
                var newChildEntity = createEntity(propertyKey, obj[propertyKey]);
                newLinks.push(createRelation('', [], newEntity, newChildEntity));
            }
            if (isArray(obj[propertyKey])) {
                for (var i = 0; i < obj[propertyKey].length; i++) {
                    if (isObject(obj[propertyKey][i])) {
                        var newChildEntity = createEntity(propertyKey, obj[propertyKey][i]);
                        newLinks.push(createRelation('', [], newEntity, newChildEntity));
                    }
                }
            }
        }
        newEntity.links = newLinks;
        _graphEntities.push(newEntity);
        return newEntity;
    }

    function createRelation(name, properties, fromEntity, toEntity) {
        var newRelation = new Relationship();
        newRelation.labels = [name];
        newRelation.properties = properties;
        newRelation.fromEntity = fromEntity;
        newRelation.toEntity = toEntity;
        _graphRelations.push(newRelation);
        return newRelation;
    }

    function isObject(obj) {
        return getType(obj) == 'object'
    }

    function isArray(obj) {
        return getType(obj) == 'array'
    }

    function isPrimitive(obj) {
        return getType(obj) != 'object' && !getType(obj) != 'array'
    }

}