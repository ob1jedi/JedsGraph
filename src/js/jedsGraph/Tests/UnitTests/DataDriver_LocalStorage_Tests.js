

// Private...
function createDataDriver() {
	return new LocalStorageDataDriver();
}

function createDataStringHelper() {
	return new DataStringHelper();
}

function createJsonParser() {
	return new JsonParser();
}
//[Test]
globals.allUnitTests.push(function getNextNewNodeId_Given_Expect1() {
	// Arrange
	var sut = createDataDriver();
	localStorage.removeItem('NEXT_NODE_ID');
	var expectedNodeId = 1;

	// Act
	var newNodeId = sut.GetNextNewEntityId();

	// Assert
	return (newNodeId === expectedNodeId) ? true : expectedNodeId;
});

globals.allUnitTests.push(function getNextNewLinkId_Given_Expect1() {
	// Arrange
	var sut = createDataDriver();
	localStorage.removeItem('NEXT_LINK_ID');
	var expectedLinkId = 1;

	// Act
	var newLinkId = sut.GetNextNewRelationId();

	// Assert
	return (newLinkId === expectedLinkId) ? true : expectedLinkId;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNoNode_ExpectNode() {
	// Arrange
	var sut = createDataDriver();

	// Act
	var nodeId = sut.CreateEntityInDatabasePopulateAndReturnId();

	// Assert
	return (nodeId !== undefined) ? true : result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenEmptyNode_ExpectNodeId() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};

	// Act
	var nodeId = sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	return (nodeId !== undefined) ? true : result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenEmptyNode_ExpectNodeWithId() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};

	// Act
	var nodeId = sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(nodeId);
	return (result.id === nodeId) ? true : result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_Given2NodesWithIdsGetFirstNode_ExpectFirstInputNodeId() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	sut.CreateEntityInDatabasePopulateAndReturnId(node2);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	return (result.id === node1.id) ? true : result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithIdAndLabel_ExpectInputNodeLabels() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		labels: ["label1"]
	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	for (var i = 0 ; i < node1.labels.length; i++) {
		if (node1.labels[i] !== result.labels[i])
			return result;
	}
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithMultipleLabels_ExpectInputNodeLabels() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		labels: ["label1", "label2"]
	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	for (var i = 0 ; i < node1.labels.length; i++) {
		if (node1.labels[i] !== result.labels[i])
			return result;
	}
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithNoLabels_ExpectInputNodeNoLabels() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.labels.length > 0)
		return result;
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWith0Properties_ExpectInputNodeNoProperties() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.properties.length > 0)
		return result;
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWith1Property_ExpectInputNodeWith1Property() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		properties: {
			property1: 'MyPropertyValue'
		}
	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.properties.property1 === 'MyPropertyValue')
		return true;
	return result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithNumberProperty_ExpectInputNodeWithNumberProperty() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		properties: {
			property1: 23
		}

	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.properties.property1 === 23)
		return true;
	return result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithBooleanProperty_ExpectInputNodeWithBooleanProperty() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		properties: {
			property1: true
		}

	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.properties.property1 === true)
		return true;
	return result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithArrayOfStringProperty_ExpectInputNodeWithArrayOfStringProperty() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		properties: {
			property1: ['test1', 'test2']
		}

	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);

	if (result.properties.property1 === undefined)
		return result;

	for (var i = 0; i < result.properties.property1.length; i++) {
		if (result.properties.property1[i] !== 'test1' && result.properties.property1[i] !== 'test2')
			return result;
	}
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenVerboseNode_ExpectNodeWithAllAttributes() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		labels: ['WORKFLOW', 'TOOL'],
		properties: {
			toolName: "EXCEL",
			property1: 'string test',
			property2: 25,
			property3: true,
			property4: ['test1', 'test2']
		}
	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);

	if (result.properties.property1 === undefined || result.properties.property2 === undefined || result.properties.property3 === undefined || result.properties.property4 === undefined)
		return result;

	if (result.labels === [])
		return result;

	if (result.labels.length !== 2)
		return result;

	if (result.properties.property1 !== 'string test')
		return result;

	if (result.properties.property2 !== 25)
		return result;

	if (result.properties.property3 !== true)
		return result;


	for (var i = 0; i < result.properties.property4.length; i++) {
		if (result.properties.property4[i] !== 'test1' && result.properties.property4[i] !== 'test2')
			return result;
	}

	return true;
});

//[Test]
globals.allUnitTests.push(function createRelationshipPopulateAndReturnId_Given2NodeIds_ExpectLinkId0() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);

	// Act
	var result = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Assert
	if (result > 0)
		return true

	return result;

});

//[Test]
globals.allUnitTests.push(function createRelationshipPopulateAndReturnId_Given3NodeIds_ExpectLinkIdGreaterThan0() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node3 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var node3Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);

	// Act
	sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);
	var result = sut.CreateRelationPopulateAndReturnId(node2Id, node3Id);

	// Assert
	if (result === undefined || result <= 0)
		return result;

	return true;
});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenNode_ExpectRelatedNode() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var result = sut.GetRelatedNodes(node1Id);

	// Assert
	if (result[0] === node2Id)
		return true;
	return result;
});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenNode_ExpectRelatedNodeAndLink() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var result = sut.GetRelatedEntityGraph(node1Id);

	// Assert
	if (result[0].fromNode.id !== node1Id)
		return result;
	if (result[0].toNode.id !== node2Id)
		return result;
	if (result[0].link.id !== linkId)
		return result;
	return true;

});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_Given2RelatedNodes_ExpectRelatedNodeAndLink() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);

	// Assert
	if (results[0].fromNode.id !== node1Id)
		return results;
	if (results[0].toNode.id !== node2Id)
		return results;
	if (results[0].link.id !== linkId)
		return results;

	return true;

});


//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	node1.labels = ["HELLO"];
	node2.labels = ["WORLD"];
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);
	addNodesToGraphFromGraphElementsAndReturnNodes(results, globals.currentTheme.sourceConfig);

	// Assert
	return true;

});


//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	node1 = {
		labels: ["WORKFLOW"],
		properties: { workflowName: "Transform" }
	};
	node2 = {
		labels: ["TOOL"],
		properties: { toolName: "WORD" }
	};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);
	addNodesToGraphFromGraphElementsAndReturnNodes(results, globals.currentTheme.sourceConfig);

	// Assert
	return true;

});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var link = {};
	node1.labels = ["PARENT"];
	node2.labels = ["CHILD"];
	var linkLabels = ["MOTHER_OF"];
	var linkProperties = {
		BirthType: 'Natural Born',
		property3: true,
		Activities: ['Dancing', 'Hockey']
	}
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id, linkLabels, linkProperties);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);
	addNodesToGraphFromGraphElementsAndReturnNodes(results, globals.currentTheme.sourceConfig);

	// Assert
	return true;

});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	node1.labels = ["CASE1"];
	node2.labels = ["CASE2"];
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);
	addNodesToGraphFromGraphElementsAndReturnNodes(results, globals.currentTheme.sourceConfig);

	// Assert
	return true;
});


//[Test]
globals.allUnitTests.push(function deleteNode_Given1DeletedNode_ExpectNodeNotFound() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	sut.DeleteEntity(node1Id);

	// Act
	var result = sut.EntityExists(node1Id);

	// Assert
	if (result === false)
		return true

	return result;

});



//=========== DataStringHelper Tests =========================================================================================================
//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf100AndCriteria33_ExpectIndex33() {
	// Arrange
	var sut = createDataStringHelper();
	var expected = '|';

	// Act
	var result = sut.getNewDataString();

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf100AndCriteria33_ExpectIndex33() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var expected = 33;

	for (var i = 0 ; i < 100; i++)
		arrayOfNumbers.push(i);

	// Act
	var result = sut.numberBinarySearch(arrayOfNumbers, 33);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf100AndCriteria34_ExpectIndex34() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var expected = 34;

	for (var i = 0 ; i < 100; i++)
		arrayOfNumbers.push(i);

	// Act
	var result = sut.numberBinarySearch(arrayOfNumbers, 34);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf100AndCriteria35_ExpectIndex35() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var expected = 35;

	for (var i = 0 ; i < 100; i++)
		arrayOfNumbers.push(i);

	// Act
	var result = sut.numberBinarySearch(arrayOfNumbers, 35);

	// Assert
	if (result === expected)
		return true
	return result;
});



//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf1AndCriteria1_ExpectIndex1() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var expected = 1;

	for (var i = 0 ; i < 1; i++)
		arrayOfNumbers.push(i);

	// Act
	var result = sut.numberBinarySearch(arrayOfNumbers, 1);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenDataStringAndCriteriaPQR_ExpectIndexPQR() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var input = "|ABC:12,|DEF|GHIJKL|MNO|PQR|STU|VWX|YZ|";
	var expected = 'PQR';

	// Act
	var wordIndex = sut.indexOfElementInDataString(input, expected);
	var result = sut.getWordAtIndex(input, wordIndex);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenEmptyDataStringAnd1Element_ExpectElementInDataString() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|A|";
	var searchFor = "TEST";
	var expected = 3.1;

	// Act

	var result = sut.indexOfElementInDataString(input, searchFor);
	//var result = sut.getWordAtIndex(input, wordIndex);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenEmptyDataStringAnd1Element_ExpectElementInDataString() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|";
	var searchFor = "TEST";
	var expected = 1.1;

	// Act

	var result = sut.indexOfElementInDataString(input, searchFor);
	//var result = sut.getWordAtIndex(input, wordIndex);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenDataStringAndValueOfPQC_ExpectValuePQC() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,|DEF|GHIJKL|MNO|PQA|PQB|PQC|PQD|PQE|PQR|STU|VWX|YZ|";
	var expected = 'PQC';


	// Act
	var wordIndex = sut.indexOfElementInDataString(input, expected);
	var result = sut.getWordAtIndex(input, wordIndex);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenDataStringAndValueOfDoesntExist_ExpectIndex() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:2234345|PQR:2|STU:12|VWX:0|YZ:3|";
	var searchFor = 'PQF'; //...doesn't exist
	var expected = 49.1;

	// Act
	//debugger;
	var result = sut.indexOfElementInDataString(input, searchFor);

	// Assert
	if (result === expected)
		return true
	return result;
});


//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenDataStringAndLongerValueOfExisting_ExpectIndexNegative1() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:23|PQR:2|STU:12|VWX:0|YZ:3|";
	var searchFor = 'PQRR'; //...doesn't exist
	var expected = 50.1;
	// Act
	var result = sut.indexOfElementInDataString(input, searchFor);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollection_ExpectAllPass() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:23|PQR:2|STU:12|VWX:0|YZ:3|";
	var searchFor = 'PQRR'; //...doesn't exist
	var subTestsFailed = false;

	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var subInput = testCases[i].split(':')[0];
		var expected = input.indexOf(testCases[i]);
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (' + subInput + ', ' + expected + ')');
		var result = sut.indexOfElementInDataString(input, subInput);
		if (result !== expected) {
			console.log('     FAILED: expected = ' + expected + ', actual = ' + result);
			subTestsFailed = true;
		}
	}

	// Assert
	if (subTestsFailed)
		return false;
	return true;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollectionButLongerLabels_ExpectAllPass() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:23|PQR:2|STU:12|VWX:0|YZ:3|";
	var searchFor = 'PQRR'; //...doesn't exist
	var subTestsFailed = false;
	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var subInput = testCases[i].split(':')[0] + 'XY';
		var expected = input.indexOf(testCases[i]) + testCases[i].length + 1 + 0.1; // add the insert flag
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (' + subInput + ', ' + expected + ')');
		var result = sut.indexOfElementInDataString(input, subInput);
		if (result !== expected) {
			console.log('     FAILED: expected = ' + expected + ', actual = ' + result);
			subTestsFailed = true;
		}
	}
	// Assert
	if (subTestsFailed)
		return false;
	return true;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollectionButShorterLabels_ExpectAllPass() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:12|VWX:0|YZ:3|";
	var subTestsFailed = false;
	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var subInput = testCases[i].split(':')[0].slice(0, -1);
		var expected = input.indexOf(testCases[i]) + 0.1; // add the insert flag
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (' + subInput + ', ' + expected + ')');
		var result = sut.indexOfElementInDataString(input, subInput);
		if (result !== expected) {
			console.log('     FAILED: expected = ' + expected + ', actual = ' + result);
			subTestsFailed = true;
		}
	}
	// Assert
	if (subTestsFailed)
		return false;
	return true;
});

//[Test]
globals.allUnitTests.push(function insertElementIntoDataString_GivenEmptyStringAndDataElement_ExpectDataElement() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|";
	var itemToAdd = 'ABC'; //...doesn't exist yet
	// Act
	var newDataString = sut.insertElementIntoDataString(input, itemToAdd);
	// Assert
	if (newDataString === '|ABC|')
		return true
	return newDataString;
});

//[Test]
globals.allUnitTests.push(function insertElementIntoDataString_GivenEmptyStringAndDataElement_ExpectDataElement() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|"; // ...Empty storage
	// Act
	storageString = sut.insertElementIntoDataString(storageString, 'ABC');
	storageString = sut.insertElementIntoDataString(storageString, 'GHI');
	storageString = sut.insertElementIntoDataString(storageString, 'DEF');
	// Assert
	if (storageString === '|ABC|DEF|GHI|')
		return true
	return storageString;
});

//[Test]
globals.allUnitTests.push(function deleteElementFromDataString_GivenStorageStringAndDataElement_ExpectDataElementRemoved() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|"; // ...Empty storage
	// Act
	storageString = sut.insertElementIntoDataString(storageString, 'ABC');
	storageString = sut.insertElementIntoDataString(storageString, 'GHI');
	storageString = sut.insertElementIntoDataString(storageString, 'DEF');

	// Act
	storageString = sut.deleteElementFromDataString(storageString, 'DEF');

	// Assert
	if (storageString === '|ABC|GHI|')
		return true
	return storageString;
});

//[Test]
globals.allUnitTests.push(function deleteElementFromDataString_GivenStorageStringAndNonExistingDataElement_ExpectNoChange() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|"; // ...Empty storage
	// Act
	storageString = sut.insertElementIntoDataString(storageString, 'ABC');
	storageString = sut.insertElementIntoDataString(storageString, 'GHI');
	storageString = sut.insertElementIntoDataString(storageString, 'DEF');
	// Act
	storageString = sut.deleteElementFromDataString(storageString, 'HIJ');
	// Assert
	if (storageString === '|ABC|DEF|GHI|')
		return true
	return storageString;
});

//[Test]
globals.allUnitTests.push(function deleteElementFromDataString_GivenEmptyStorageStringAndNonExistingDataElement_ExpectNoChange() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|"; // ...Empty storage
	// Act


	// Act
	storageString = sut.deleteElementFromDataString(storageString, 'ABC');

	// Assert
	if (storageString === '|')
		return true
	return storageString;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollection_ExpectAllLabelParts() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:12|VWX:0|YZ:3|";
	var subTestsFailed = false;
	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var elementName = testCases[i].split(':')[0];
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (removing: ' + elementName + ', from: ' + input + ')');
		var input = sut.deleteElementFromDataString(input, elementName);
		if (input.indexOf(elementName) > -1) {
			console.log('     FAILED: actual = ' + input);
			subTestsFailed = true;
		}
	}
	if (input != '|')
		return input
	// Assert
	if (subTestsFailed)
		return false;
	return true;
});


//[Test]
globals.allUnitTests.push(function getDataFromStorageString_GivenElement_ExpectData() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var elementName = 'STU';
	var expected = '45';
	// Act
	var result = sut.getDataFromDataString(storageString, elementName);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollection_ExpectAllDataParts() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:12|VWX:0|YZ:3|";
	var subTestsFailed = false;
	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var elementName = testCases[i].split(':')[0];
		var elementValue = testCases[i].split(':')[1];
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (get: ' + elementName + ', expect: ' + elementValue + ')');
		var result = sut.getDataFromDataString(input, elementName);
		if (result !== elementValue) {
			console.log('     FAILED: actual = ' + input);
			subTestsFailed = true;
		}
	}
	// Assert
	if (subTestsFailed)
		return false;
	return true;
});

//[Test]
globals.allUnitTests.push(function replaceDataInElement_GivenElementLabel_ExpectDataUpdated() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'STU';
	var newData = '67';
	var expected = '|ABC:13,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:67|VWX:0|YZ:3|';
	// Act
	var result = sut.replaceDataInElement(storageString, element, newData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function replaceDataInElement_GivenNonExistingElement_ExpectElementAndDataAdded() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'OOO';
	var newData = '35';
	var expected = '|ABC:13,32|DEF:12|GHIJKL|MN:1|OOO:35|PQA:2|STU:45|VWX:0|YZ:3|';
	// Act
	var result = sut.replaceDataInElement(storageString, element, newData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function replaceDataInElement_GivenEmptyDataStringNonExistingElement_ExpectElementAndDataAdded() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|";
	var element = 'OOO';
	var newData = '35';
	var expected = '|OOO:35|';
	// Act
	var result = sut.replaceDataInElement(storageString, element, newData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function ensureDataIntoElement_GivenDataStringAndElement_ExpectDataAdded() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'MN';
	var newData = '35';
	var expected = '|ABC:13,32|DEF:12|GHIJKL|MN:1,35|PQA:2|STU:45|VWX:0|YZ:3|';
	// Act
	var result = sut.ensureDataIntoElement(storageString, element, newData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function ensureDataNotInElement_GivenDataStringAndElement_ExpectDataAdded() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1,35|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'MN';
	var removeData = '1';
	var expected = '|ABC:13,32|DEF:12|GHIJKL|MN:35|PQA:2|STU:45|VWX:0|YZ:3|';
	// Act
	var result = sut.ensureDataNotInElement(storageString, element, removeData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function clearElementData_GivenElement_ExpectElementDataRemoved() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'ABC';
	var expected = '|ABC|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|';
	// Act
	var result = sut.clearElementData(storageString, element);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function getAllElements_GivenDataString_ExpectCorrectAmountOfElements() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var expected = 8;
	// Act
	var result = sut.getAllElements(storageString);
	// Assert
	if (result.length === expected)
		return true
	return result;
});

//================================================================================================================================================================

//[Test]
globals.allUnitTests.push(function getNodeInDatabaseByLabel_Given1NodesWithLabelAndLabel_ExpectNode() {
	// Arrange
	var sut = createDataDriver();
	var node1 = { labels: ['FindMe'] };
	var expectedNodeId = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	// Act
	var result = sut.GetEntitiesByType('FindMe');
	// Assert
	return (result[0].id === expectedNodeId) ? true : result;
});

//[Test]
globals.allUnitTests.push(function getLinkInDatabaseByLabel_Given2NodesAndRelationshipAndLabel_ExpectLink() {
	// Arrange
	var sut = createDataDriver();
	var node1 = { labels: ['ATOM'], properties: { element: "Hydrogen" } };
	var node2 = { labels: ['ATOM'], properties: { element: "Oxygen" } };
	var node3 = { labels: ['ATOM'], properties: { element: "Helium" } };
	var link1Labels = ["BOND"];
	var link1Properties = { strength: "strong" };
	var link2Labels = ["BOND"];
	var link2Properties = { strength: "strong" };


	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var node3Id = sut.CreateEntityInDatabasePopulateAndReturnId(node3);
	var expectedLinkId1 = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id, link1Labels, link1Properties);
	var expectedLinkId2 = sut.CreateRelationPopulateAndReturnId(node2Id, node3Id, link2Labels, link2Properties);

	// Act
	var result = sut.GetRelationsByLabel('BOND');
	// Assert
	return (result[0].id === expectedLinkId1 && result[1].id === expectedLinkId2) ? true : result;
});

//[Test]
globals.allUnitTests.push(function getAllNodeLabels_GivenNodesWithLabels_ExpectLabels() {
	// Arrange
	var sut = createDataDriver();
	var node1 = { labels: ['ThisTestLabel0'] };
	var node2 = { labels: ['ThisTestLabel2', 'ThisTestLabel1'] };
	var node3 = { labels: ['ThisTestLabel3'] };
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	sut.CreateEntityInDatabasePopulateAndReturnId(node3);
	// Act
	var result = sut.GetAllEntityTypes();
	// Assert
	return (result.indexOf('ThisTestLabel1') > -1 && result.indexOf('ThisTestLabel2') > -1) ? true : result;
});

//[Test]
globals.allUnitTests.push(function getNodesByPropertyName_GivenNodesWithProperties_ExpectPropertyIndex() {
	// Arrange
	var propertyName = "uniqueProp1672";
	var sut = createDataDriver();
	var node1 = {
		labels: ['PropsNodeTest'],
		properties: {
			uniqueProp1672: "uniqueProperty",
			prop2: "value2"
		}
	};
	var expectedNodeId = sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Act
	var result = sut.GetEntitiesByPropertyName(propertyName);

	// Assert
	if (result[0].id == expectedNodeId)
		return true;

	return result;
});

//[Test]
globals.allUnitTests.push(function getRelationshipByPropertyName_GivenGiven2RelatedNodes_ExpectRelationship() {
	// Arrange
	var propertyName = "uniqueProp1673";
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var link = {};
	node1.labels = ["CLIENT"];
	node2.labels = ["CAR"];
	node2.properties = {
		Manufacturer: 'Kia',
		Model: 'Picanto'
	};
	linkLabels = ["OWNS"];
	linkProperties = {
		uniqueProp1673: "ForAlink",
		Year: 2012,
		Dealer: 'Autocar',
		OnLayby: true,
		AttendedBy: ['Joan Luna', 'Derick Stapler']
	}
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var expectedLinkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id, linkLabels, linkProperties);

	// Act
	var result = sut.GetRelationsByPropertyName(propertyName);

	// Assert
	if (result[0].id == expectedLinkId)
		return true;

	return resultNodes;

});



//=== JSON Parser =============================================================================================================================================================

//[Test]
globals.allUnitTests.push(function CreateGraphElementsFromJson_GivenJson_ExpectGraphElements() {
	// Arrange
	var sut = createJsonParser();
	var inputJSON = {
		Parent: {
			Name: "John",
			Child: [
				{
					Name: "Scott",
					Age: 10
				},
				{
					Name: "Jane"
				}]
		}
	};

	// Act
	var result = sut.TranslateToGraph_ReturnGraphElements('root', JSON.stringify(inputJSON), globals.currentTheme.sourceConfig);

	// Assert
	return (result.length == 3
		&& result[0].fromNode.data.labels[0] == "Parent") ? true : result;
});
