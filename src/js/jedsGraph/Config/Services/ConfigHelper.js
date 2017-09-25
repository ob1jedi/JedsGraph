function ConfigHelper() {

	///Input: the function to be called when configuration has been loaded

	//Get config file...


	this.GetConfigForNode = function(node){
		var nodeConfigs = [];
		masterConfigs.forEach(function (config) {
			if (isConfigForNode(node, config))
				nodeConfigs.push(config);
		});

		var finalConfig = nodeConfigs[0];
		nodeConfigs.map(function (cnf) {
			finalConfig = $.extend(true, {}, finalConfig, cnf);
		});

		return finalConfig;
	}

	function isConfigForNode(node, config)
	{
		if (config.configType != "node")
			return false;

		if (config.match != null) {
			for (var key in config.match)
			{
				if (config.match[key] != node[key])
				{
					return false;
				}
			}
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
				dataService.GetAllNodeLabels(cnf); //..get all entity names from the DB
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



	this.getEntityTypeConfig = function(){

	}


	this.getConfig = function(apparentConfig) {
		return apparentConfig ? apparentConfig : currentTheme.sourceConfig;
	}



}