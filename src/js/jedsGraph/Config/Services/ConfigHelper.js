function ConfigHelper() {
	///Input: the function to be called when configuration has been loaded

	this.AddDynamicEntityConfigReturnId = function (name, jsonConfig)
    {
        dataSvc = new DataService();
        var confId = dataSvc.CreateConfigReturnId(name, jsonConfig);
        jsonConfig.id = confId;
        masterEntityConfigs.push(jsonConfig);
        return confId;
    }

	//Get config file...
    this.GetConfigForEntity = function (entityId) {
        var dataSvc = new DataService();
        var entity = dataSvc.GetEntityById(entityId);
        var entityConfigs = [];

        entityConfigs.push(masterEntityConfigs[0]);
        masterEntityConfigs.forEach(function (config) {
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

		currentTheme.sourceConfig = config;
		currentTheme.backgroundImage = config.displaySettings.backgroundImage;
		currentTheme.loadNodePopouts = config.displaySettings.loadNodePopouts;
		currentTheme.loadRelationPopouts = config.displaySettings.loadRelationPopouts;
		currentTheme.linkThickness = config.displaySettings.linkThickness;
		currentTheme.entityRgbRange = config.displaySettings.entityRgbRange;
		currentTheme.graphBackground = config.displaySettings.graphBackground;
		currentTheme.entityLabelColor = config.displaySettings.entityLabelColor;
		currentTheme.entityCircleTextColor = config.displaySettings.entityCircleTextColor;
		//currentTheme.entityShape = config.displaySettings.entityShape;
		currentTheme.opaque = config.displaySettings.opaque;
		currentTheme.labelSizing = config.displaySettings.labelSizing;
		currentTheme.shadow = config.displaySettings.shadow;
		currentTheme.entityBorderColor = config.displaySettings.entityBorderColor;
		currentTheme.glow = config.displaySettings.glow;
		currentTheme.linkColor = config.displaySettings.linkColor;
		currentTheme.rounded = config.displaySettings.rounded;
		currentTheme.showLabels = config.displaySettings.showLabels;
		currentTheme.showRelationships = config.displaySettings.showRelationships;
		currentTheme.showRelationProperties = config.displaySettings.showRelationProperties;
		currentTheme.haze = config.displaySettings.haze;
		currentTheme.highlightHaze = config.displaySettings.highlightHaze;
		currentTheme.linkMainTextColor = config.displaySettings.linkMainTextColor;
		currentTheme.linkSubTextColor = config.displaySettings.linkSubTextColor;


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
		config_ext = config;
	}

	this.runStartupProcedures = function () {
		//GET ALL LABELS>>
		masterConfigs.forEach(function (cnf) {

			if (cnf.viewOptions.prefetchLabelSelectors) {
				dataService.GetAllEntityTypes(cnf); //..get all entity names from the DB
			}

			//GET STARTUP NODES>>
			cnf.startupOptions.startupSearch.forEach(function (search, index) {
				dataService.GetNodesByDetails(search.nodeLabel, search.properties, cnf)
			});

			//RUN STARTUP QUERIES>>
			cnf.startupOptions.startupQueries.forEach(function (search, index) {
				dataService.QuerySimpleSearch(search.fromEntity, search.whereProperty, search.equalsValue, cnf);
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
			toolPanels.push($elPanel);

			
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
		return apparentConfig ? apparentConfig : currentTheme.sourceConfig;
	}



}