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
    });

	}

}

var UrlHelper = function(){


    this.GetParameterByName = function(name, url) {
      
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    this.GetAllParams = function(url) {
      var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = window.location.search.substring(1);
      var urlParams = [];
      while (match = search.exec(query))
        urlParams.push({"key": decode(match[1]), "value":decode(match[2])});
         //urlParams[decode(match[1])] = decode(match[2]);
      return urlParams;
    }

}