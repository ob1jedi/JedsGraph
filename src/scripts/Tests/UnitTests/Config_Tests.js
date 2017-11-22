
// Private...
function createConfigHelper() {
	return new ConfigHelper();
}

//[Test]
globals.allUnitTests.push(function addDynamicConfig_GivenConfig_ExpectConfig() {
	// Arrange
	var sut = new DataService();
	var testEntityName = 'HELLO';
	var configName = "TestConfig1";
	var matchEntity = {
		"labels": [
			testEntityName
		]
	}
	var testConfig = {
		"configName": configName,
		"configType": "entity",
		"matchEntity": matchEntity,
		"config": {
			"attributes": {
				"background-color": "#33c11d",
				"border-color": "#334687",
				"circleText": {
					"color": "#00FF00"
				},
				"img": {
					"url": "custom/assets/Space/Earth-PNG-Clipart.png",
					"width": 70,
					"height": 70
				}
			}
		}
	};
	var baseNodeConfig = globals.masterConfigs.forEach(function (config) { if (config.prefix == "BNC") return config; });

	// Act
	var confId = sut.CreateUpdateConfigReturnId(configName, testConfig);
	var result = sut.GetConfigByName(configName);

	// Assert
	return (result.config.attributes.circleText.color === "#00FF00") ? true : result;
});

//[Test]globals.allUnitTests
globals.allUnitTests.push(function addDynamicConfig_GivenConfig_ExpectConfigAndNode() {
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
		"configName": testConfigName,
		"configType": "entity",
		"matchEntity": {
			"labels": [
				testEntityName
			]
		},
		"config": {
			"attributes": {
				"background-color": "#f2b3ab",
				"circleText": {
					"color": "#6fa563"
				}
			},
			"relatedThings": [
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

	var confId = sut.AddDynamicEntityConfigReturnId(testConfigName, testConfig);
	var entity = dataSvc.GetEntityById(entityId);
	var nodes = addEntitiesToGraphAndReturnNodes([entity]);
	// Act
	var result = sut.GetConfigForEntityId(entityId);
	// Assert
	return (result.config.attributes.circleText.color == "#6fa563") ? true : result;
});

//[Test]
globals.allUnitTests.push(function updateExistingConfig_GivenConfig_ExpectConfig() {
	// Arrange
	var sut = new DataService();
	var testEntityName = 'CASE2';
	var configName = "TestConfig3";
	var matchEntity = {
		"labels": [
			testEntityName
		]
	}
	var initialConfig = { 
    "configName": configName, 
    "configType": "entity", 
    "matchEntity": matchEntity, 
    "config": { 
      "attributes": { 
        "background-color": "#33c11d", 
        "border-color": "#4155f4", 
        "circleText": { 
          "color": "#0000FF" 
        } 
      } 
    } 
  };
	var confId = sut.CreateUpdateConfigReturnId(configName, initialConfig);
	var updatedConfig = { 
    "configName": configName, 
    "configType": "entity", 
    "matchEntity": matchEntity, 
    "config": { 
      "attributes": { 
        "radius":15, 
        "background-color": "#33c11d", 
        "border-color": "#4155f4", 
        "circleText": { 
          "color": "#FF0000" 
        } 
      } 
    } 
  };

	// Act
	var confId2 = sut.CreateUpdateConfigReturnId(configName, updatedConfig);

	// Assert
	var result = sut.GetConfigByName(configName);
	return (result.config.attributes.circleText.color === "#FF0000" && result.config.attributes.radius === 15) ? true : result;
	
	var nodes = getNodesByMatchingLabels(globals.nodeList, [testEntityName]);
	refreshNodeAppearance(nodes[0].id);

});


////[Test]
//globals.allUnitTests.push(function insertValueIntoConfig_GivenConfig_ExpectUpdatedConfig() {
	
//  // Arrange
//	var sut = new ConfigHelper();
//  var configValuePath = "newConfig/config/attributes/background-color";
//  var newValue = "green";
//  var sourceConfig = {
//		"configName": "Test",
//		"configType": "entity",
//		"matchEntity": "HELLO",
//		"config": {
//			"attributes": {
//				"background-color": "#33c11d",
//				"color": "blue",
//				"circleText": {
//					"color": "yellow"
//				},
//				"img": {
//					"url": "custom/assets/Space/Earth-PNG-Clipart.png",
//					"width": 70,
//					"height": 70
//				}
//			}
//		}
//	};


//  // Act 
//  var newConfig = sut.AddToConfigReturnConfig(sourceConfig, configValuePath, newValue);

//  // Assert
//  var result = newConfig.config.attributes["background-color"]
//  return (result == newValue) ? true : result;

//});