function ConfigHelper() {
	///Input: the function to be called when configuration has been loaded

	this.AddDynamicEntityConfigReturnId = function (name, jsonConfig)
    {
        dataSvc = new DataService();
        var confId = dataSvc.CreateConfigReturnId(name, jsonConfig);
        jsonConfig.id = confId;
        mergeConfigIntoMasterConfigs(jsonConfig);
        return confId;
	}

	this.AddOrUpdateDynamicEntityConfigReturnId = function (name, jsonConfig) {
		dataSvc = new DataService();
		var confId = dataSvc.CreateUpdateConfigReturnId(name, jsonConfig);
		jsonConfig.id = confId;
		mergeConfigIntoMasterConfigs(jsonConfig);
		return confId;
	}

	function mergeConfigIntoMasterConfigs(jsonConfig)
	{
		for (var i = 0; i < globals.masterEntityConfigs.length; i++) {
			if (globals.masterEntityConfigs[i].configName == jsonConfig.configName) {
				globals.masterEntityConfigs[i] = jsonConfig;
				return;
			}
		}
		globals.masterEntityConfigs.push(jsonConfig);
	}

	//Get config file...
    this.GetConfigForEntityId = function (entityId) {
        var dataSvc = new DataService();
        var entity = dataSvc.GetEntityById(entityId);
        return this.GetConfigForEntity(entity);
	}

	//Get config file...
    this.GetConfigForEntity = function (entity) {
    	var dataSvc = new DataService();
    	var entityConfigs = [];

    	entityConfigs.push(globals.masterEntityConfigs[0]);
    	globals.masterEntityConfigs.forEach(function (config) {
    		if (isConfigForEntity(entity, config)) {
    			entityConfigs.push(config);
    		}
    	});

    	//debugger;
    	var finalConfig = {};
    	entityConfigs.map(function (cnf) {
    		finalConfig = $.extend(true, {}, finalConfig, cnf);
    	});

    	return finalConfig;
    }

    function isConfigForEntity(entity, config)
	{
		if (config.configType != "node")
			return false;

		var jsonHelper = new JsonHelper();
		if (config.matchEntity != null) {
			return jsonHelper.Contains(config.matchEntity, entity)
		}
		return true;
	}



	//Set default config 
	this.setConfigSettings = function(config) {

		globals.currentTheme.sourceConfig = config;
		globals.currentTheme.backgroundImage = config.displaySettings.backgroundImage;
		globals.currentTheme.loadNodePopouts = config.displaySettings.loadNodePopouts;
		globals.currentTheme.loadRelationPopouts = config.displaySettings.loadRelationPopouts;
		globals.currentTheme.linkThickness = config.displaySettings.linkThickness;
		globals.currentTheme.entityRgbRange = config.displaySettings.entityRgbRange;
		globals.currentTheme.graphBackground = config.displaySettings.graphBackground;
		globals.currentTheme.entityLabelColor = config.displaySettings.entityLabelColor;
		globals.currentTheme.entityCircleTextColor = config.displaySettings.entityCircleTextColor;
		//globals.currentTheme.entityShape = config.displaySettings.entityShape;
		globals.currentTheme.opaque = config.displaySettings.opaque;
		globals.currentTheme.labelSizing = config.displaySettings.labelSizing;
		globals.currentTheme.shadow = config.displaySettings.shadow;
		globals.currentTheme.entityBorderColor = config.displaySettings.entityBorderColor;
		globals.currentTheme.glow = config.displaySettings.glow;
		globals.currentTheme.linkColor = config.displaySettings.linkColor;
		globals.currentTheme.rounded = config.displaySettings.rounded;
		globals.currentTheme.showLabels = config.displaySettings.showLabels;
		globals.currentTheme.showRelationships = config.displaySettings.showRelationships;
		globals.currentTheme.showRelationProperties = config.displaySettings.showRelationProperties;
		globals.currentTheme.haze = config.displaySettings.haze;
		globals.currentTheme.highlightHaze = config.displaySettings.highlightHaze;
		globals.currentTheme.linkMainTextColor = config.displaySettings.linkMainTextColor;
		globals.currentTheme.linkSubTextColor = config.displaySettings.linkSubTextColor;


		//setting up panels...
		$topBar = document.getElementById('topBar');
		$topBar.addEventListener('dragenter', handleDragEnter, false);
		$topBar.addEventListener('dragover', handleDragOver, false);
		$topBar.addEventListener('dragleave', handleDragLeave, false);
		$topBar.addEventListener('drop', handleDrop, false);

		config.viewOptions.panels.forEach(function (panelConfig) {
			setupUiPanelAndTopbar(panelConfig)
		});

		//Set global variable
		globals.config_ext = config;
	}

	this.runStartupProcedures = function () {
		//GET ALL LABELS>>
		globals.masterConfigs.forEach(function (cnf) {

			if (cnf.viewOptions.prefetchLabelSelectors) {
				globals.dataService.GetAllEntityTypes(cnf); //..get all entity names from the DB
			}

			//GET STARTUP NODES>>
			cnf.startupOptions.startupSearch.forEach(function (search, index) {
				globals.dataService.GetNodesByDetails(search.nodeLabel, search.properties, cnf)
			});

			//RUN STARTUP QUERIES>>
			cnf.startupOptions.startupQueries.forEach(function (search, index) {
				globals.dataService.QuerySimpleSearch(search.fromEntity, search.whereProperty, search.equalsValue, cnf);
			});
		});

	}

	function setupUiPanelAndTopbar(panelConfig)
	{

		$elPanel = document.getElementById(panelConfig.name);
		if (panelConfig.available) {
			addTopBarButton(panelConfig.name, panelConfig.desc, panelConfig.icon)
			$parentContainer = document.getElementById(panelConfig.parent);
			if ($parentContainer && panelConfig.visible) {
				toggleToolPanel(panelConfig.name);
			}
			$elPanel.setAttribute('draggable', true);
			$elPanel.addEventListener('dragstart', handleDragStart, false);
			$elPanel.addEventListener('dragend', handleDragEnd, false);
			globals.toolPanels.push($elPanel);
		}
		else {
			$elPanel.remove();
		}
	}

	function addTopBarButton(name, description, icon){
		$topBar = document.getElementById('topBar');
		var tobarButton = '';
		tobarButton += '<button id="toolbar.' + name + '" onclick="toggleToolPanel(\'' + name + '\')" class="toolPanelIcon mytooltip">';
		tobarButton += '  <span class="' + icon + '" aria-hidden="true">';
		tobarButton += '  </span>';
		tobarButton += '  <div class="mytooltiptext ttright ttcenter">' + description;
		tobarButton += '  </div>';
		tobarButton += '</button>';
		$topBar.innerHTML += tobarButton;
	}

	this.getConfig = function(apparentConfig) {
		return apparentConfig ? apparentConfig : globals.currentTheme.sourceConfig;
	}



}