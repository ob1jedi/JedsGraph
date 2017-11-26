

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
		if (globals.browser.name != "Firefox" && globals.browser.name != "IE"){
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
        var decodedData = stringHelper.ParamDecodeString(param.value);
        //var base64Str = new StringHelper().ReplaceEachOfCharSet(param.value, '._-','+/=');
        //var decodedData = atob(base64Str);
        mappings.Translators.forEach(function(transMapping){if (transMapping.name == translator){
          console.log('translator', transMapping);
          var trans = transMapping.translator;
          trans.Translate(decodedData);
        }});

      }
    });
  }

}



