


var LocalStorageDataDriver_Tests = function () {
	var tests = [];

	// Private...
	function runAndReport(test) {
		var result = test();
		if (result !== true) {
			console.log('TEST FAILED. ACTUAL RESULT:', result);
			throw ('TEST FAILED. ACTUAL RESULT: ' + result);

		}
		else
			console.log('TEST PASSED');
	}

	// Public...
	this.runAllTests = function () {
		localStorage.clear();
		localStorage.removeItem('NEXT_NODE_ID');
		localStorage.removeItem('NEXT_LINK_ID');
		localStorage.removeItem('INDEX_ON_NODE_LABELS');
		console.log('MEMORY', localStorage);
		var index = 0;
		tests.forEach(function (test) {
			console.log('-------------------------------------------------------------------');
			console.log('Test ' + (++index) + '/' + tests.length + ', "' + test.name + '"')
			runAndReport(test);
		});
	}

	// Private...
	function createDataDriver() {
		return new LocalStorageDataDriver();
	}

	function createDataStringHelper() {
		return new DataStringHelper();
	}

	//[Test]
	tests.push(function getNextNewNodeId_Given_Expect1() {
		// Arrange
		var sut = createDataDriver();
		localStorage.removeItem('NEXT_NODE_ID');
		var expectedNodeId = 1;

		// Act
		var newNodeId = sut.getNextNewNodeId();

		// Assert
		return (newNodeId === expectedNodeId) ? true : expectedNodeId;
	});

	tests.push(function getNextNewLinkId_Given_Expect1() {
		// Arrange
		var sut = createDataDriver();
		localStorage.removeItem('NEXT_LINK_ID');
		var expectedLinkId = 1;

		// Act
		var newLinkId = sut.getNextNewLinkId();

		// Assert
		return (newLinkId === expectedLinkId) ? true : expectedLinkId;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNoNode_ExpectNode() {
		// Arrange
		var sut = createDataDriver();

		// Act
		var nodeId = sut.createNodeInDatabasePopulateAndReturnId();

		// Assert
		return (nodeId !== undefined) ? true : result;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenEmptyNode_ExpectNodeId() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};

		// Act
		var nodeId = sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		return (nodeId !== undefined) ? true : result;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenEmptyNode_ExpectNodeWithId() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};

		// Act
		var nodeId = sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(nodeId);
		return (result.id === nodeId) ? true : result;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_Given2NodesWithIdsGetFirstNode_ExpectFirstInputNodeId() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);
		sut.createNodeInDatabasePopulateAndReturnId(node2);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);
		return (result.id === node1.id) ? true : result;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNodeWithIdAndLabel_ExpectInputNodeLabels() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {
			labels: ["label1"]
		};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);
		for (var i = 0 ; i < node1.labels.length; i++) {
			if (node1.labels[i] !== result.labels[i])
				return result;
		}
		return true;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNodeWithMultipleLabels_ExpectInputNodeLabels() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {
			labels: ["label1", "label2"]
		};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);
		for (var i = 0 ; i < node1.labels.length; i++) {
			if (node1.labels[i] !== result.labels[i])
				return result;
		}
		return true;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNodeWithNoLabels_ExpectInputNodeNoLabels() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);
		if (result.labels.length > 0)
			return result;
		return true;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNodeWith0Properties_ExpectInputNodeNoProperties() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);
		if (result.properties.length > 0)
			return result;
		return true;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNodeWith1Property_ExpectInputNodeWith1Property() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {
			properties: {
				property1: 'MyPropertyValue'
			}
		};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);
		if (result.properties.property1 === 'MyPropertyValue')
			return true;
		return result;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNodeWithNumberProperty_ExpectInputNodeWithNumberProperty() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {
			properties: {
				property1: 23
			}

		};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);
		if (result.properties.property1 === 23)
			return true;
		return result;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNodeWithBooleanProperty_ExpectInputNodeWithBooleanProperty() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {
			properties: {
				property1: true
			}

		};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);
		if (result.properties.property1 === true)
			return true;
		return result;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenNodeWithArrayOfStringProperty_ExpectInputNodeWithArrayOfStringProperty() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {
			properties: {
				property1: ['test1', 'test2']
			}

		};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);

		if (result.properties.property1 === undefined)
			return result;

		for (var i = 0; i < result.properties.property1.length; i++) {
			if (result.properties.property1[i] !== 'test1' && result.properties.property1[i] !== 'test2')
				return result;
		}
		return true;
	});

	//[Test]
	tests.push(function createNodeInDatabasePopulateAndReturnId_GivenVerboseNode_ExpectNodeWithAllAttributes() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {
			labels: ['MyLabel1', 'MyLabel2'],
			properties: {
				property1: 'string test',
				property2: 25,
				property3: true,
				property4: ['test1', 'test2']
			}
		};

		// Act
		sut.createNodeInDatabasePopulateAndReturnId(node1);

		// Assert
		var result = sut.getNodeFromDatabase(node1.id);

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
	tests.push(function createRelationshipPopulateAndReturnId_Given2NodeIds_ExpectLinkId0() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		var node2Id = sut.createNodeInDatabasePopulateAndReturnId(node2);

		// Act
		var result = sut.createRelationshipPopulateAndReturnId(node1Id, node2Id);

		// Assert
		if (result > 0)
			return true

		return result;

	});

	//[Test]
	tests.push(function createRelationshipPopulateAndReturnId_Given3NodeIds_ExpectLinkIdGreaterThan0() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};
		var node3 = {};
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		var node2Id = sut.createNodeInDatabasePopulateAndReturnId(node2);
		var node3Id = sut.createNodeInDatabasePopulateAndReturnId(node2);

		// Act
		sut.createRelationshipPopulateAndReturnId(node1Id, node2Id);
		var result = sut.createRelationshipPopulateAndReturnId(node2Id, node3Id);

		// Assert
		if (result === undefined || result <= 0)
			return result;

		return true;
	});

	//[Test]
	tests.push(function getRelatedNodes_GivenNode_ExpectRelatedNode() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		var node2Id = sut.createNodeInDatabasePopulateAndReturnId(node2);
		sut.createRelationshipPopulateAndReturnId(node1Id, node2Id);

		// Act
		var result = sut.getRelatedNodes(node1Id);

		// Assert
		if (result[0] === node2Id)
			return true;
		return result;
	});

	//[Test]
	tests.push(function getRelatedNodes_GivenNode_ExpectRelatedNodeAndLink() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		var node2Id = sut.createNodeInDatabasePopulateAndReturnId(node2);
		var linkId = sut.createRelationshipPopulateAndReturnId(node1Id, node2Id);

		// Act
		var result = sut.getRelatedNodesGraph(node1Id);

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
	tests.push(function getRelatedNodes_Given2RelatedNodes_ExpectRelatedNodeAndLink() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		var node2Id = sut.createNodeInDatabasePopulateAndReturnId(node2);
		var linkId = sut.createRelationshipPopulateAndReturnId(node1Id, node2Id);

		// Act
		var results = sut.getRelatedNodesGraph(node1Id);

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
	tests.push(function getRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};
		node1.labels = ["HELLO"];
		node2.labels = ["WORLD"];
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		var node2Id = sut.createNodeInDatabasePopulateAndReturnId(node2);
		var linkId = sut.createRelationshipPopulateAndReturnId(node1Id, node2Id);

		// Act
		var results = sut.getRelatedNodesGraph(node1Id);
		addNodesToGraphFromGraphElementsAndReturnNodes(results, currentTheme.sourceConfig);

		// Assert
		return true;

	});

	//[Test]
	tests.push(function getRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};
		var link = {};
		node1.labels = ["PARENT"];
		node2.labels = ["CHILD"];
		link.labels = ["MOTHER_OF"];
		link.properties =  {
				BirthType: 'Natural Born',
				property3: true,
				Activities: ['Dancing', 'Hockey']
		}
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		var node2Id = sut.createNodeInDatabasePopulateAndReturnId(node2);
		var linkId = sut.createRelationshipPopulateAndReturnId(node1Id, node2Id, link);

		// Act
		var results = sut.getRelatedNodesGraph(node1Id);
		addNodesToGraphFromGraphElementsAndReturnNodes(results, currentTheme.sourceConfig);

		// Assert
		return true;

	});

	//[Test]
	tests.push(function getRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node2 = {};
		node1.labels = ["CASE1"];
		node2.labels = ["CASE2"];
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		var node2Id = sut.createNodeInDatabasePopulateAndReturnId(node2);
		var linkId = sut.createRelationshipPopulateAndReturnId(node1Id, node2Id);

		// Act
		var results = sut.getRelatedNodesGraph(node1Id);
		addNodesToGraphFromGraphElementsAndReturnNodes(results, currentTheme.sourceConfig);

		// Assert
		return true;
	});


	//[Test]
	tests.push(function deleteNode_Given1DeletedNode_ExpectNodeNotFound() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {};
		var node1Id = sut.createNodeInDatabasePopulateAndReturnId(node1);
		sut.deleteNode(node1Id);

		// Act
		var result = sut.nodeExists(node1Id);

		// Assert
		if (result === false)
			return true

		return result;

	});



	//=========== DataStringHelper Tests =========================================================================================================
	//[Test]
	tests.push(function binarySearch_GivenArrayOf100AndCriteria33_ExpectIndex33() {
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
	tests.push(function binarySearch_GivenArrayOf100AndCriteria33_ExpectIndex33() {
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
	tests.push(function binarySearch_GivenArrayOf100AndCriteria34_ExpectIndex34() {
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
	tests.push(function binarySearch_GivenArrayOf100AndCriteria35_ExpectIndex35() {
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
	tests.push(function binarySearch_GivenArrayOf1AndCriteria1_ExpectIndex1() {
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
	tests.push(function stringBinarySearch_GivenDataStringAndCriteriaPQR_ExpectIndexPQR() {
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
	tests.push(function stringBinarySearch_GivenEmptyDataStringAnd1Element_ExpectElementInDataString() {
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
	tests.push(function stringBinarySearch_GivenEmptyDataStringAnd1Element_ExpectElementInDataString() {
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
	tests.push(function stringBinarySearch_GivenDataStringAndValueOfPQC_ExpectValuePQC() {
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
	tests.push(function stringBinarySearch_GivenDataStringAndValueOfDoesntExist_ExpectIndex() {
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
	tests.push(function stringBinarySearch_GivenDataStringAndLongerValueOfExisting_ExpectIndexNegative1() {
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
	tests.push(function stringBinarySearch_GivenStringCollection_ExpectAllPass() {
		// Arrange
		var sut = createDataStringHelper();
		var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:23|PQR:2|STU:12|VWX:0|YZ:3|";
		var searchFor = 'PQRR'; //...doesn't exist
		var subTestsFailed =  false;

		// Act
		var testCases = input.split('|');
		for (var i = 1; i < testCases.length - 1; i++)
		{
			var subInput = testCases[i].split(':')[0];
			var expected = input.indexOf(testCases[i]);
			console.log(' - Test Case ' + i + '/' + (testCases.length-2) + ': (' + subInput + ', ' + expected + ')');
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
	tests.push(function stringBinarySearch_GivenStringCollectionButLongerLabels_ExpectAllPass() {
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
	tests.push(function stringBinarySearch_GivenStringCollectionButShorterLabels_ExpectAllPass() {
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
	tests.push(function insertElementIntoDataString_GivenEmptyStringAndDataElement_ExpectDataElement() {
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
	tests.push(function insertElementIntoDataString_GivenEmptyStringAndDataElement_ExpectDataElement() {

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
	tests.push(function deleteElementFromDataString_GivenStorageStringAndDataElement_ExpectDataElementRemoved() {

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
	tests.push(function deleteElementFromDataString_GivenStorageStringAndNonExistingDataElement_ExpectNoChange() {

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
	tests.push(function deleteElementFromDataString_GivenEmptyStorageStringAndNonExistingDataElement_ExpectNoChange() {

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
	tests.push(function stringBinarySearch_GivenStringCollection_ExpectAllLabelParts() {
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
	tests.push(function getDataFromStorageString_GivenElement_ExpectData() {

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
	tests.push(function stringBinarySearch_GivenStringCollection_ExpectAllDataParts() {
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
	tests.push(function replaceDataInElement_GivenElementLabel_ExpectDataUpdated() {

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
	tests.push(function replaceDataInElement_GivenNonExistingElement_ExpectElementAndDataAdded() {

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
	tests.push(function replaceDataInElement_GivenEmptyDataStringNonExistingElement_ExpectElementAndDataAdded() {

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
	tests.push(function ensureDataIntoElement_GivenDataStringAndElement_ExpectDataAdded() {

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
	tests.push(function ensureDataNotInElement_GivenDataStringAndElement_ExpectDataAdded() {

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
	tests.push(function clearElementData_GivenElement_ExpectElementDataRemoved() {

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
	tests.push(function getAllElements_GivenDataString_ExpectCorrectAmountOfElements() {

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
	tests.push(function getNodeInDatabaseByLabel_Given1NodesWithLabelAndLabel_ExpectNode() {
		// Arrange
		var sut = createDataDriver();
		var node1 = {labels:['FindMe']};
		var expectedNodeId = sut.createNodeInDatabasePopulateAndReturnId(node1);
		// Act
		var result = sut.getNodesByLabel('FindMe');
		// Assert
		return (result[0].id === expectedNodeId) ? true : result;
	});

	//[Test]
	tests.push(function getAllNodeLabels_GivenNodesWithLabels_ExpectLabels() {
		// Arrange
		var sut = createDataDriver();
		var node1 = { labels: ['ThisTestLabel0'] };
		var node2 = { labels: ['ThisTestLabel2', 'ThisTestLabel1'] };
		var node3 = { labels: ['ThisTestLabel3'] };
		sut.createNodeInDatabasePopulateAndReturnId(node1);
		sut.createNodeInDatabasePopulateAndReturnId(node2);
		sut.createNodeInDatabasePopulateAndReturnId(node3);
		// Act
		var result = sut.getAllNodeLabels();
		// Assert
		return (result.indexOf('ThisTestLabel1') > -1 && result.indexOf('ThisTestLabel2') > -1) ? true : result;
	});


	////[Test]
	//tests.push(function createNodeInDatabase_GivenNodeWithIdAndLabel_ExpectUpdatedLabelIndex() {
	//	// Arrange
	//	var sut = createDataDriver();
	//	var node1 = {
	//		labels: ["label1"]
	//	};
	//	// Act
	//	sut.createNodeInDatabasePopulateAndReturnId(node1);
	//	// Assert
	//	var result = sut.getNodeFromDatabase(node1.id);
	//	for (var i = 0 ; i < node1.labels.length; i++) {
	//		if (node1.labels[i] !== result.labels[i])
	//			return result;
	//	}
	//	return true;
	//});

}