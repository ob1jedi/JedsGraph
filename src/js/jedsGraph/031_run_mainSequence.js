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

		// UNIT TESTS...
		if (window.location.href.startsWith("http://localhost:9090/")){
		//if (localStorage.getItem('testMode') === "true") {
			//var unitTestSets = [];
			//unitTestSets.push(new LocalStorageDataDriver_Tests);
			//unitTestSets.push(new Config_Tests);

			var unitTestFramework = new UnitTestFramework();
			// RUN UNIT TESTS...
			unitTestFramework.runAllUnitTests(allUnitTests);
		}

	}
	

}