
// Private...
function createConfigHelper() {
	return new ConfigHelper();
}

//[Test]
allUnitTests.push(function addDynamicConfig_GivenConfig_ExpectConfig() {
	// Arrange
	var sut = new DataService();
	var testEntityName = 'HELLO';
	var configName = "TestConfig";
	var matchEntity = {
		"labels": [
			testEntityName
		]
	}
	var testConfig = { "configName": configName, "configType": "node", "matchEntity": matchEntity, "config": { "attributes": { "background-color": "#33c11d", "color": "blue", "circleText": { "color": "yellow" } } } };
	var baseNodeConfig = masterConfigs.forEach(function (config) { if (config.prefix == "BNC") return config; });

	// Act
	var confId = sut.CreateConfigReturnId(configName, testConfig);
	var result = sut.GetConfigByName(configName);

	// Assert
	return (result.config.attributes.circleText.color === "yellow") ? true : result;
});

//[Test]allUnitTests
allUnitTests.push(function addDynamicConfig_GivenConfig_ExpectConfigAndNode() {
	// Arrange
	var testEntityName = 'EntityForConfig';
	var testConfigName = 'TestConfig2';
	var sut = createConfigHelper();
	var dataSvc = new DataService();
	var entity = {
		labels: [testEntityName],
		properties: {
			id: "MyId121",
			prop2: "value2"
		}
	};

	var entityId = dataSvc.CreateEntityReturnId(entity.labels, entity.properties);
	

	// Dynamic config...
	var testConfig = {
		configName: testConfigName,
		configType: "node",
		matchEntity: {
			"labels": [
				testEntityName
			]
		},
		config: {
			attributes: {
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

	var conf = sut.AddDynamicEntityConfigReturnId(testConfigName, testConfig);
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


