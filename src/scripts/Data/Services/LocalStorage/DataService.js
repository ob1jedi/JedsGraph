var DataService=function() {
  var dataDriver=new LocalStorageDataDriver();

  this.DropDatabase=function() {
    dataDriver.ClearStorage();
    window.location.reload();
  }

  this.CreateConfigReturnId=function(configName,jsonConfig) {
    if(dataDriver.ConfigExists(configName))
      throw "A config by that name already exists";
    return dataDriver.CreateConfigInDbAndReturnId(configName,jsonConfig);
  }

  this.CreateUpdateConfigReturnId=function(configName,jsonConfig) {
    var existingConfig=this.GetConfigByName(configName);
    if(!existingConfig)
      return dataDriver.CreateConfigInDbAndReturnId(configName,jsonConfig);
    var jsonHelper=new JsonHelper();
    //var finalConf = $.extend(true, {}, existingConfig, jsonConfig);
    var finalConf=jsonHelper.MergeJson(existingConfig,jsonConfig,"arrayId");
    console.log('existingConfig',existingConfig);
    console.log('jsonConfig',jsonConfig);
    console.log('finalConf',finalConf);
    return dataDriver.UpdateConfigInDb(configName,finalConf);
  }

  this.GetAllConfigs=function() {
    var allConfigNames=dataDriver.GetAllConfigNames();
    return allConfigNames.map(function(cnfName) { return dataDriver.GetConfigsByName(cnfName)[0] })
  }

  this.GetConfigByName=function(configName) {
    if(!configName) throw "Config name not provided";
    var configs=dataDriver.GetConfigsByName(configName);
    if(configs.length==0)
      return null;
    return configs[0];
  }

  this.FetchEntitiesForNodeId=function(nodeId,_sourceConfig) {
    var graphElements=dataDriver.GetRelatedEntityGraph(stripDomainFromId(nodeId));
    addNodesToGraphFromGraphElementsAndReturnNodes(graphElements,globals.currentTheme.sourceConfig);
  }

  this.CreateEntity_AddToGraph_ReturnNode=function(labels,properties,_sourceConfig) {
    if(!_sourceConfig) { _sourceConfig=globals.currentTheme.sourceConfig; }
    if(!properties){
      properties={};
    }
    var entityId=dataDriver.CreateEntityInDatabasePopulateAndReturnId(labels, properties);
    var entity=dataDriver.GetEntityById(entityId);

    var configHelper=new ConfigHelper();
    var entityConfig=configHelper.GetConfigForEntityId(entityId);

    updateUiComponents(labels[0],1,entityConfig);
    var nodes=addEntitiesToGraphAndReturnNodes([entity])[0];
    return nodes;
  }

  this.CreateEntityReturnId=function(labels,properties) {
    if(!properties)
      properties={};

    var entityId=dataDriver.CreateEntityInDatabasePopulateAndReturnId(labels, properties);
    return entityId;
  }

  this.DeleteEntity=function(entityID,_sourceConfig) {
    dataDriver.DeleteEntity(entityID);
    //Neo4jDeleteNode(nodeID, _sourceConfig);
  }

  this.CheckMonitoredNodes=function(_sourceConfig) {
    //Neo4jCheckMonitoredNodes(_sourceConfig);
  }

  this.CheckMonitoredLinks=function(_sourceConfig) {
    //Neo4jCheckMonitoredLinks(_sourceConfig);
  }

  this.Qbuilder=function(selectType,_sourceConfig) {
    //Neo4jQbuilder(selectType, _sourceConfig);
  }

  this.Qbuilder_ClearValue=function(selectType) {
    //Neo4jQbuilder_ClearValue(selectType);
  }

  this.QuerySimpleSearch=function(fromEntity,whereProperty,equalsValue,_sourceConfig) {
    //Neo4jQuerySimpleSearch(fromEntity, whereProperty, equalsValue, _sourceConfig);
  }

  this.GetRelationCounts=function(nodeId,callback,_sourceConfig) {
    //Neo4jGetRelationCounts(nodeId, callback, _sourceConfig);
  }

  this.GetEntitiesByType=function(byLabel,sourceConfigPrefix) {
    //Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix);
    var entities=dataDriver.GetEntitiesByType(byLabel);
    return addEntitiesToGraphAndReturnNodes(entities,globals.currentTheme.sourceConfig);
  }

  this.GetEntityById=function(entityId,sourceConfigPrefix) {
    return dataDriver.GetEntityFromDatabase(entityId);
  }

  this.GetEntitiesByDetails=function(nodeLabel,properties,_sourceConfig) {
    //Neo4jGetEntitiesByDetails(nodeLabel, properties, _sourceConfig);
  }

  this.GetAllEntities=function(_sourceConfig) {
    var labelData=dataDriver.GetAllEntityTypes();
    labelData.forEach(function(labelData) {
      var entities=dataDriver.GetEntitiesByType(labelData);
      addEntitiesToGraphAndReturnNodes(entities,globals.currentTheme.sourceConfig);
    });
    this.GetAllRelations(_sourceConfig);
    //Neo4jGetAllEntities(_sourceConfig);
  }

  this.GetAllRelations=function(_sourceConfig) {
    var labelDatas=dataDriver.GetAllRelationTypesAndRelationIds();

    var graphElements=labelDatas.map(function(labelData) {
      labelData.ids.map(function(id) {
        return dataDriver.GetGraphOfRelation(id)
      });
    });
    addNodesToGraphFromGraphElementsAndReturnNodes(graphElements,globals.currentTheme.sourceConfig);
    //Neo4jGetAllRelations(_sourceConfig);
  }

  this.CreateEntityReturnCallbackWithIds=function(entityName,propList,inputCallback) {
    var nodeId=dataDriver.CreateEntityInDatabasePopulateAndReturnId([entityName], propList);
    var node=dataDriver.GetEntityFromDatabase(nodeId);
    addEntitiesToGraphAndReturnNodes([node],globals.currentTheme.sourceConfig);
    //inputCallback(nodeId);
    //Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback);
    var configHelper=new ConfigHelper();
    var entityConfig=configHelper.GetConfigForEntityId(nodeId);
    updateUiComponents(entityName,1,entityConfig);
  }

  this.UpdateEntity=function(entityId, newLabels, newProperties, callback) {
    dataDriver.UpdateEntityInDatabase(entityId, newLabels, newProperties);
    if (callback)
      callback(entityId);
    //Neo4jUpdateEntity(nodeID, newProperties, callback);
  }

  this.CreateRelation_AddToGraph_ReturnLink=function(fromEntityId,toEntityId,labels,properties,_sourceConfig,planOnly) {
    //Neo4jCreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly)
    var relId=dataDriver.CreateRelationPopulateAndReturnId(stripDomainFromId(fromEntityId),stripDomainFromId(toEntityId),labels,properties);
    var relation=dataDriver.GetLinkFromDatabase(relId);
    var link=addRelationToGraphReturnLink(relation);
    applyPopoutEffectToNodesById(fromEntityId,toEntityId);
    return link
  }

  this.DeleteRelationship=function(relationshipID,_sourceConfig) {
    //Neo4jDeleteRelationship(relationshipID, _sourceConfig);
  }

  this.DeleteLabel=function(nodeId,labelName,_sourceConfig) {
    //Neo4jDeleteLabel(nodeId, labelName, _sourceConfig);
  }

  this.AddProperty=function(nodeId,_sourceConfig) {
    //Neo4jAddProperty(nodeId, _sourceConfig);
  }

  this.AddLabel=function(_sourceConfig) {
    //Neo4jAddLabel(_sourceConfig);
  }

  this.GetAllEntityTypes=function(_sourceConfig) {
    //Neo4jGetAllLabels(_sourceConfig);
    var labels=dataDriver.GetAllEntityTypesAndEntityIds(_sourceConfig);
    labels.forEach(function(label) {
      var pseudoEntity=new DataEntity();
      pseudoEntity.labels=[label];

      var configHelper=new ConfigHelper();
      var entityConfig=configHelper.GetConfigForEntity(pseudoEntity);

      updateUiComponents(label.label,label.ids.length,entityConfig);
    });
  }

  function updateUiComponents(label,entityCount,entityConfig) {
    var typeSelector=addEntityLabel(label,entityCount,entityConfig);
    refreshEntitySelectors();
    consoleApp.refreshTypeSelectors();
  }

  function stripDomainFromId(nodeId) {
    if(nodeId.length>3)
      if(nodeId.substring(0,3)=='LOC')
        return nodeId.substring(3);
    return nodeId;
  }

}



//===============================================================================================

//===============================================================================================


//===============================================================================================
