function initializeConfiguration(callback_setupGraph) {
	$(document).ready(function (e) {
		configManager = configManager; //config manager from file

		if (configManager.configs.length == 0) {
			alert("Error: unable to load configurations");
			return;
		}

		masterConfigs = [];

		var DefaultConfig = configManager.configs[0];

		//Perform Shinethrough: Merge configs, so that all configs are equal, except for their differences...
		configManager.configs.map(function (cnf) {
			if (cnf.configType === "entity")
				masterEntityConfigs.push(cnf);
			masterConfigs.push($.extend(true, {}, DefaultConfig, cnf));
		})
		//var dynamicConfig = getDynamicConfig();
		var dataSvc = new DataService(); 
		var dynamicEntityConfigs = dataSvc.GetAllConfigs();
		dynamicEntityConfigs.forEach(function (cnf) {
			masterEntityConfigs.push(cnf);
		});

		//Update the config selector on the UI...
		var selectorElement = document.getElementById("configSelector");
		masterConfigs.forEach(function (cnf) {
			if (configManager.defaultConfig = cnf.prefix) { DefaultConfig = cnf }
			selectorElement.innerHTML += '<option value="' + cnf.configName + '">' + cnf.configName + '</option>';
		});

		callback_setupGraph(DefaultConfig);
	});
}