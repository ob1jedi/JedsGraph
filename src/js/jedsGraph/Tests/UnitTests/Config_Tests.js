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
	tests.push(function addDynamicConfig_GivenConfig_ExpectConfig() {
		// Arrange
		var sut = new DataService();
		var configName = "TestConfig";
		var testConfig = { "configName": "TestConfig", "configType": "node", "matchEntity": null, "config": { "attributes": [{ "color": "#f2b3ab", "circleTextColor": "beige" }] } };
		var baseNodeConfig = masterConfigs.forEach(function (config) { if (config.prefix == "BNC") return config; });

		// Act
		sut.CreateConfigReturnId(configName, testConfig);
		var result = sut.GetConfigByName(configName);

		// Assert
		return (result.config.attributes["0"].circleTextColor == "beige") ? true : result;
	});

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
		var testConfigName = 'TestConfig2';

		// Dynamic config...
		var testConfig = {
			configName: "TestConfig2",
			configType: "node",
			matchEntity: {
				"labels": [
					"ConfigMatch"
				]
			},
			config: {
				attributes: [
					{
						color: "#f2b3ab",
						circleTextColor: "green"
					}]
			}
		};

		sut.AddDynamicConfig("MyConfig", testConfig);

		var entity = dataSvc.GetEntityById(entityId);
		// Act
		var result = sut.GetConfigForEntity(entityId);
	    // Assert
		return (result.config.attributes["0"].circleTextColor == "green") ? true : result;
	});



}