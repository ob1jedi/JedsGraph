//Set default config 
function setConfigSettings(config) {
	currentTheme.sourceConfig = config;
	currentTheme.backgroundImage = config.displaySettings.backgroundImage;
	currentTheme.loadNodePopouts = config.displaySettings.loadNodePopouts;
	currentTheme.loadRelationPopouts = config.displaySettings.loadRelationPopouts;
	currentTheme.entityRgbRange = config.displaySettings.entityRgbRange;
	currentTheme.linkThickness = config.displaySettings.linkThickness;
	currentTheme.entityRgbRange = config.displaySettings.entityRgbRange;
	currentTheme.graphBackground = config.displaySettings.graphBackground;
	currentTheme.entityLabelColor = config.displaySettings.entityLabelColor;
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
	//$topBar.addEventListener('dragend', handleDragEnd, false);

	config.viewOptions.panels.forEach(function (panel) {
		//$elParent = document.getElementById(panel.parent)	
		$elPanel = document.getElementById(panel.name);
		//elParent.innerHtml += elPanel;
		//$elPanel.style.visibility = (panel.visible)?'visible':'hidden';
		$topBar = document.getElementById('topBar');
		if (panel.available) {
			$parentContainer = document.getElementById(panel.parent);
			$topBar.innerHTML += '<button id="toolbar.' + panel.name + '" onclick="toggleToolPanel(\'' + panel.name + '\')" class="toolPanelIcon mytooltip"><span class="' + panel.icon + '" aria-hidden="true"></span><div class="mytooltiptext ttright ttcenter">' + panel.desc + '</div></button>';
			if ($parentContainer && panel.visible) {
				toggleToolPanel(panel.name);
				//$parentContainer.appendChild($elPanel);
			}

			$elPanel.setAttribute('draggable', true);
			$elPanel.addEventListener('dragstart', handleDragStart, false);
			//$elPanel.addEventListener('dragenter', handleDragEnter, false);
			//$elPanel.addEventListener('dragover', handleDragOver, false);
			//$elPanel.addEventListener('dragleave', handleDragLeave, false);
			//$elPanel.addEventListener('drop', handleDrop, false);
			$elPanel.addEventListener('dragend', handleDragEnd, false);
			toolPanels.push($elPanel);
		}
		else {
			$elPanel.remove();
			//var isOpen = $elPanel.classList.contains('slide-in');
			//$elPanel.setAttribute('class', isOpen ? 'toolPanel slide-out' : 'toolPanel slide-in');
		}

		////{"panels":[{"name":"panelSelectionOptions", "parent":"leftColumn", "visibility":true}]}
	});

	//Set global variable
	config_ext = config;

	setupCommonUI();

	//GET ALL LABELS>>
	masterConfigs.forEach(function (cnf) {

		if (cnf.viewOptions.prefetchLabelSelectors) {
			dataService.GetAllLabels(cnf); //..get all entity names from the DB
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

function getConfig(apparentConfig) {
	return apparentConfig ? apparentConfig : currentTheme.sourceConfig;
}