

function graphexMain() {

	initializeConfiguration(setupGraph); //get config, setup common UI

	function setupGraph(DefaultConfig) {
    setBrowser();
		var configHelper = new ConfigHelper();
		configHelper.setConfigSettings(DefaultConfig);
		configHelper.runStartupProcedures();
		setupCommonUI();
		prepareGraph();
		define_Graph();
    define_Node();
		defineNodeDrawing();
		if (globals.browser.name != "Firefox" && globals.browser.name != "IE"){
      defineLinkObjectsCommonAssets();
		  defineLinkObjects();
      defineLinkDrawing();
    }
		renderGraph();
		initUi();

		// Start monitoring timeout elements
		checkTimeoutElements() 
    // Start animation cycle...
    globals.animator.StartAnimationTicker();
    // Run unit tests...
    runUnitTests();
    // Check params for Graphs
    processParameters();
	}

  function runUnitTests(){
    // UNIT TESTS...
		if(window.location.href.substr(0,17)=="http://localhost:"){
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
    var stringHelper = new StringHelper();
    var urlHelper  = new UrlHelper();
    var params = urlHelper.GetAllParams();
    params.forEach(function(param){
      if (param.key == "graph"){
        var translator = new UrlParamsTranslator();
        translator.Translate(param.value);
      }

      if (param.key == "grenc"){
        var translator = stringHelper.ParamDecodeString(urlHelper.GetParameterByName("trans"));
        var arranger = urlHelper.GetParameterByName("arrange");
        var decodedData = stringHelper.ParamDecodeString(param.value);
        executeTranslator(translator, decodedData);
        //executeArranger(arranger);
      }
    });
  }

  function executeTranslator(translator, data){
    if (!translator || !data) return;
    mappings.Translators.forEach(function(transMapping){if (transMapping.name == translator){
      var trans = transMapping.translator;
      trans.Translate(data);
    }});
  }

  function executeArranger(arranger){
    if (!arranger) return;
    //debugger;
    mappings.Arrangers.forEach(function(arrangerMapping){
      //debugger;
      if (arrangerMapping.name == arranger){
        var arranger = transMapping.arranger;
        arranger.Arrange(arranger);
      }
    });
  }

}



