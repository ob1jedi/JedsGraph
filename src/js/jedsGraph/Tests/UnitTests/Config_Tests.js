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
		var testConfig = { "configName": configName, "configType": "node", "matchEntity": null, "config": { "attributes": { "color": "#f2b3ab", "circleText": {"color": "beige"} } } };
		var baseNodeConfig = masterConfigs.forEach(function (config) { if (config.prefix == "BNC") return config; });

		// Act
		var confId = sut.CreateConfigReturnId(configName, testConfig);
		var result = sut.GetConfigByName(configName);
		
		// Assert
		return (result.config.attributes.circleText.color == "beige") ? true : result;
	});

	//[Test]
	tests.push(function addDynamicConfig_GivenConfig_ExpectConfigAndNode() {
		// Arrange
		var sut = createConfigHelper();
	    // Arrange
		var dataSvc = new DataService();
		var entity = {
			labels: ['TestConfig2'],
		    properties: {
		        id: "MyId121",
		        prop2: "value2"
		    }
		};

		var entityId = dataSvc.CreateEntityReturnId(entity.labels, entity.properties);
		var testConfigName = 'TestConfig2';

		// Dynamic config...
		var testConfig = {
			configName: testConfigName,
			configType: "node",
			matchEntity: {
				"labels": [
					"TestConfig2"
				]
			},
			config: {
				attributes:{
					color: "#f2b3ab",
					circleText: {
						color: "green"
					}
				},
				relatedThings: [
					{
						"thingName": "option",
						"url": "custom/assets/64.png",
						"x": 10,
						"y": -50,
						"size": 50
					}
				]
			}
		};

		var conf = sut.AddDynamicEntityConfigReturnId("MyConfig", testConfig);
		console.log('All dynamic configs', dataSvc.GetAllConfigs());

		var entity = dataSvc.GetEntityById(entityId);
		console.log('ENTITY', entity);

		var nodes = addEntitiesToGraphAndReturnNodes([entity]);
		console.log('NODE', nodes);
		// Act
		var result = sut.GetConfigForEntity(entityId);
		console.log('entityConfig', result);

		console.log('masterEntityConfigs', masterEntityConfigs);
	    // Assert
		return (result.config.attributes.circleText.color == "green") ? true : result;
	});



}