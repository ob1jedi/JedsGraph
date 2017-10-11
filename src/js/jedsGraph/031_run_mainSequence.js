function main() {
	
	initializeConfiguration(setupGraph); //get config, setup common UI

	function setupGraph(DefaultConfig) {
		var configHelper = new ConfigHelper();
		configHelper.setConfigSettings(DefaultConfig);
		configHelper.runStartupProcedures();
		setupCommonUI();
		prepareGraph();
		defineNodes();
		defineNodeDrawing();
		defineLinkObjectsCommonAssets();
		defineLinkObjects();
		defineLinkDrawing();
		renderGraph();
		initUi();

		// Start monitoring timeout elements
		checkTimeoutElements() 

		// DECLARE UNIT TESTS...
		if (window.location.href.startsWith("http://localhost:9090/")){
		//if (localStorage.getItem('testMode') === "true") {
			var unitTests = [];
			unitTests.push(new LocalStorageDataDriver_Tests);
			unitTests.push(new Config_Tests);
			var unitTestFramework = new UnitTestFramework();
			// RUN UNIT TESTS...
			unitTestFramework.runAllTests(unitTests);
		}

	}
	

}