function main() {
	var configHelper = new ConfigHelper();
	Configuration(configHelper.setConfigSettings); //get config, setup common UI
	prepareGraph();
	defineNodes();
	defineNodeDrawing();
	defineLinkObjectsCommonAssets();
	defineLinkObjects();
	defineLinkDrawing();
	renderGraph();
	initUi();
	
	
	//Configuration(connectUser);
	//setup UI
	checkTimeoutElements() //start monitoring timeout elements
	
	// RUN UNIT TESTS...
	unitTestFramework.runAllTests(unitTests);
}