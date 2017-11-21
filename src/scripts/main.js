

function graphexMain() {

	initializeConfiguration(setupGraph); //get config, setup common UI

	function setupGraph(DefaultConfig) {
    setBrowser();
		var configHelper = new ConfigHelper();
		configHelper.setConfigSettings(DefaultConfig);
		configHelper.runStartupProcedures();
		setupCommonUI();
		prepareGraph();
		defineNodes();
		defineNodeDrawing();
		if (globals.browser.name == "Chrome"){
      defineLinkObjectsCommonAssets();
		  defineLinkObjects();
      defineLinkDrawing();
    }
		renderGraph();
		initUi();

		// Start monitoring timeout elements
		checkTimeoutElements() 

    runUnitTests();
    processParameters();
	}

  function runUnitTests(){
    // UNIT TESTS...
		if (window.location.href.startsWith("http://localhost:9090/")){
			var unitTestFramework = new UnitTestFramework();
			unitTestFramework.runAllUnitTests(globals.allUnitTests);
		}
  }

  function setBrowser(){
    globals.browser = new BrowserHelper().getBrowser();
  }
  function processParameters(){
        // PARAMETERS
    //extract commands from URL:
    var urlHelper  = new UrlHelper();
    //debugger;
    var params = urlHelper.GetAllParams();
    params.forEach(function(param){
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



