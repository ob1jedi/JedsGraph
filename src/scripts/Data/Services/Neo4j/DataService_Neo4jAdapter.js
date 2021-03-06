﻿var DataService = function () {

	this.FetchEntitiesForNodeId = function (nodeId, _sourceConfig) {
		Neo4jFetchEntitiesForNode(nodeId, _sourceConfig);
	}

	this.CreateEntity_AddToGraph_ReturnNode = function (labels, properties, _sourceConfig) {
		Neo4jCreateNode(labelName[0], _sourceConfig);
	}

	this.GetRelatedEntityGraph = function (nodeID, _sourceConfig) {
		Neo4jDeleteNode(nodeID, _sourceConfig);
	}

	this.CheckMonitoredNodes = function (_sourceConfig) {
		Neo4jCheckMonitoredNodes(_sourceConfig);
	}

	this.CheckMonitoredLinks = function (_sourceConfig) {
		Neo4jCheckMonitoredLinks(_sourceConfig);
	}

	this.Qbuilder = function (selectType, _sourceConfig) {
		Neo4jQbuilder(selectType, _sourceConfig);
	}

	this.Qbuilder_ClearValue = function (selectType) {
		Neo4jQbuilder_ClearValue(selectType);
	}

	this.QuerySimpleSearch = function (fromEntity, whereProperty, equalsValue, _sourceConfig) {
		Neo4jQuerySimpleSearch(fromEntity, whereProperty, equalsValue, _sourceConfig);
	}

	this.GetRelationCounts = function (nodeId, callback, _sourceConfig) {
		Neo4jGetRelationCounts(nodeId, callback, _sourceConfig);
	}

	this.GetEntitiesByType = function (byLabel, sourceConfigPrefix) {
		Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix);
	}

	this.GetEntitiesByDetails = function (nodeLabel, properties, _sourceConfig) {
		Neo4jGetEntitiesByDetails(nodeLabel, properties, _sourceConfig);
	}

	this.GetAllEntities = function (_sourceConfig) {
		Neo4jGetAllEntities(_sourceConfig);
	}

	this.GetAllRelations = function (_sourceConfig) {
		Neo4jGetAllRelations(_sourceConfig);
	}

	this.CreateEntityReturnCallbackWithIds = function (entityName, propList, inputCallback) {
		Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback);
	}

	this.UpdateEntity = function (nodeID, newProperties, callback) {
		Neo4jUpdateEntity(nodeID, newProperties, callback);
	}

	this.CreateRelation_AddToGraph_ReturnLink = function (nodeID1, nodeID2, relationLabels, propList, _sourceConfig, planOnly) {
	    Neo4jCreateRelation(nodeID1, nodeID2, relationLabels[0], propList, _sourceConfig, planOnly)
	}

	this.DeleteRelationship = function (relationshipID, _sourceConfig) {
		Neo4jDeleteRelationship(relationshipID, _sourceConfig);
	}

	this.DeleteLabel = function (nodeId, labelName, _sourceConfig) {
		Neo4jDeleteLabel(nodeId, labelName, _sourceConfig);
	}

	this.AddProperty = function (nodeId, _sourceConfig) {
		Neo4jAddProperty(nodeId, _sourceConfig);
	}

	this.AddLabel = function (_sourceConfig) {
		Neo4jAddLabel(_sourceConfig);
	}

	this.GetAllEntityTypes = function (_sourceConfig) {
		Neo4jGetAllLabels(_sourceConfig);
	}

}


