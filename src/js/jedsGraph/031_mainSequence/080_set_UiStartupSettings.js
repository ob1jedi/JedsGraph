function initUi()
{
	//========== STARTUP UI SETTINGS ===========================================================================================================================================================================
	globals.graphContainer = document.getElementById('graphContainer')
	globals.graphContainer.style.background=globals.currentTheme.sourceConfig.displaySettings.graphBackground;

	if (globals.currentTheme.sourceConfig.displaySettings.backgroundImage!=null){
		globals.graphContainer.style['background-image'] =  'url('+globals.currentTheme.sourceConfig.displaySettings.backgroundImage+')'
	};

	globals.consoleService.hideNodeFlyout();

}