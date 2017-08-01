function initUi()
{
	//========== STARTUP UI SETTINGS ===========================================================================================================================================================================
	graphContainer = document.getElementById('graphContainer')
	graphContainer.style.background=currentTheme.sourceConfig.displaySettings.graphBackground;

	if (currentTheme.sourceConfig.displaySettings.backgroundImage!=null){
		graphContainer.style['background-image'] =  'url('+currentTheme.sourceConfig.displaySettings.backgroundImage+')'
	};
}