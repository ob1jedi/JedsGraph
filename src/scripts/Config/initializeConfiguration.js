function initializeConfiguration(callback_setupGraph) {
	$(document).ready(function (e) {
		configManager = configManager; //config manager from file

		if (configManager.configs.length == 0) {
			alert("Error: unable to load configurations");
			return;
		}

		globals.masterConfigs = [];

		var DefaultConfig = configManager.configs[0];

		//Perform Shinethrough: Merge configs, so that all configs are equal, except for their differences...
		var jsonHelper = new JsonHelper();
    configManager.configs.map(function (cnf) {
			if (cnf.configType === "entity"){
				globals.masterEntityConfigs.push(cnf);
      }
			//globals.masterConfigs.push($.extend(true, {}, DefaultConfig, cnf));
      globals.masterConfigs.push(jsonHelper.MergeJson(DefaultConfig, cnf, "arrayId"));
		})
    // Add dynamic configs (anything added AFTER the baseconfigs have been loaded)
		var dataSvc = new DataService(); 
		var entityConfigs = dataSvc.GetAllConfigs();
		entityConfigs.forEach(function (cnf) {
			globals.masterEntityConfigs.push(cnf);
      // Update VUE component with master configs...
      consoleApp.tabs.newMatching.masterEntityConfigs.push(cnf);
		});

		//Update the config selector on the UI...
		//var selectorElement = document.getElementById("configSelector");
		globals.masterConfigs.forEach(function (cnf) {
			if (configManager.defaultConfig = cnf.prefix) { 
        DefaultConfig = cnf;
      }
			//selectorElement.innerHTML += '<option value="' + cnf.configName + '">' + cnf.configName + '</option>';
		});

		callback_setupGraph(DefaultConfig);
	});
}