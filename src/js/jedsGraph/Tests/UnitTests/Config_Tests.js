var Config_Tests = function () {
	var tests = [];

	// Public...
	this.runAllTests = function () {
		var index = 0;
		tests.forEach(function (test) {
			console.log('-------------------------------------------------------------------');
			console.log('Configs, Test ' + (++index) + '/' + tests.length + ', "' + test.name + '"')
			runAndReport(test);
		});
	}

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

	// Private...
	function createConfigHelper() {
		return new ConfigHelper();
	}

	//[Test]
	tests.push(function getNextNewNodeId_Given_Expect1() {
		// Arrange
		var sut = createConfigHelper();
	    // Arrange
		var dataSvc = new DataService();
		var entity = {
		    labels: ['ConfigMatch'],
		    properties: {
		        id: "MyId121",
		        prop2: "value2"
		    }
		};
        
		var entityId = dataSvc.CreateEntityReturnId(entity.labels, entity.properties);
		var testConfig = {"configName":"TestConfig2","configType":"node","match":{},"config":{"attributes":[{"color":"#f2b3ab","circleTextColor":"beige"}]}};
		sut.AddDynamicConfig("MyConfig", testConfig);
		// Act
		var nodeConfig = sut.GetConfigForEntity(entityId);

	    // Assert

		//return (newNodeId === expectedNodeId) ? true : expectedNodeId;
	});

}