///Input: the function to be called when configuration has been loaded

//Get config file...
function Configuration(setupConfigCallback, setupGraphCallback)
{
	$(document).ready(function(e) {
		configManager = configManager; //config manager from file
					
		if (configManager.configs.length == 0) {
			alert("Error: unable to load configurations");
			return;
		}
		
		masterConfigs = [];
		var DefaultConfig = configManager.configs[0];
		
		//Merge configs, so that all configs are equal, except for their differences...
		configManager.configs.map(function (cnf){masterConfigs.push($.extend(true, {}, DefaultConfig, cnf));} )
		

		//var dynamicConfig = getDynamicConfig();

		//Update the config selector on the UI...
		var selectorElement = document.getElementById("configSelector");
		masterConfigs.forEach(function (cnf){
			if (configManager.defaultConfig = cnf.prefix){DefaultConfig = cnf}
			selectorElement.innerHTML += '<option value="'+cnf.configName+'">' + cnf.configName + '</option>';
		});
		
		setupConfigCallback(DefaultConfig);	
		setupGraphCallback();
	});
}