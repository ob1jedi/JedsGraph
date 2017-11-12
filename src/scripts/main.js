

function graphexMain() {

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
			unitTestFramework.runAllUnitTests(globals.allUnitTests);
		}

    // PARAMETERS
    //extract commands from URL:
    var urlHelper  = new UrlHelper();
    //debugger;
    var params = urlHelper.GetAllParams();
    params.forEach((param)=>{
      if (param.key == "graph"){
        var translator = new UrlParamsTranslator();
        translator.Translate(param.value);
      }

      if (param.key == "grenc"){
        var translator = urlHelper.GetParameterByName("trans");
        var base64Str = new StringHelper().ReplaceEachOfCharSet(param.value, '._-','+/=');
        var decodedData = atob(base64Str);
        var translator = new SimpleTranslator();
        translator.Translate(decodedData);
      }


    });

	}

}


