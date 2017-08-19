﻿var DataService = function () {

	this.FetchEntitiesForNode = function (nodeId, _sourceConfig) {
		
	}

	this.CreateNode = function (labelName, _sourceConfig) {
		
	}

	this.DeleteNode = function (nodeID, _sourceConfig) {
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

	this.GetNodesByLabel = function (byLabel, sourceConfigPrefix) {
		Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix);
	}

	this.GetNodesByDetails = function (nodeLabel, properties, _sourceConfig) {
		Neo4jGetNodesByDetails(nodeLabel, properties, _sourceConfig);
	}

	this.InitAllNodes = function (_sourceConfig) {
		Neo4jInitAllNodes(_sourceConfig);
	}

	this.InitAllRelations = function (_sourceConfig) {
		Neo4jInitAllRelations(_sourceConfig);
	}

	this.CreateEntityReturnCallbackWithIds = function (entityName, propList, inputCallback) {
		Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback);
	}

	this.UpdateEntity = function (nodeID, newProperties, callback) {
		Neo4jUpdateEntity(nodeID, newProperties, callback);
	}

	this.CreateRelation = function (nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly) {
		Neo4jCreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly)
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

	this.GetAllLabels = function (_sourceConfig) {
		Neo4jGetAllLabels(_sourceConfig);
	}

}

var TestUnitFramework = function () {
	this.runAllTests = function (testSetArray) {
		testSetArray.forEach(function (test) {
			console.log('running test-set', test);
			test.runAllTests();
		});
	}

}

var DataDriver_Tests = function () {
	function runAndReport(test){
		console.log('running test', test);
		var result = test();
		console.log('result = ' + result);
	}

	this.runAllTests = function() {
		runAndReport(storeNodeInDatabase_GivenEmtpyNode_ExpectsNodeToBeStored);
		runAndReport(storeNodeInDatabase_GivenEmtpyNode_ExpectsNodeToBeStored);
		runAndReport(storeNodeInDatabase_GivenEmtpyNode_ExpectsNodeToBeStored);
	}

	function createDataDriver(){
		return new DataDriver();
	}

	function storeNodeInDatabase_GivenEmtpyNode_ExpectsNodeToBeStored() {
		// Arrange
		var sut = createDataDriver();
		var node = {
			id: '1'
		}

		// Act
		sut.storeNodeInDatabase(node);

		// Assert
		return sut.getNodeFromDatabase(node.id) == "N1";

	}
}

var DataDriver = function()
{
	this.storeNodeInDatabase = function (node) {
		localStorage.setItem("Nodes", "N" + node.id);
	}

	this.getNodeFromDatabase = function (nodeId) {
		localStorage.getItem("Nodes", "N" + nodeId);
		//JSON.stringify(node)
	}
}