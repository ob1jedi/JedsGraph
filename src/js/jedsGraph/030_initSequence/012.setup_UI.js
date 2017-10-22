


function setupCommonUI(){
			//Common UI...
	globals.CommonUI.focusUI = Viva.Graph.svg('circle')
					.attr('cx', 0) //...for circle
					.attr('cy', 0)//...for circle
					.attr('r',50)
					.attr('fill','transparent')//'#4dffc3')
					.attr('stroke',globals.currentTheme.sourceConfig.displaySettings.focusColor)
					if (!globals.currentTheme.sourceConfig.displaySettings.opaque) {globals.CommonUI.focusUI.attr('stroke-opacity','0.5')}
					//.attr('stroke-opacity',0.5);
					if (globals.currentTheme.sourceConfig.displaySettings.entityShape == "rect") {
						globals.CommonUI.focusUI.attr('width',50 * 3);
						globals.CommonUI.focusUI.attr('height',50 * 2);
						globals.CommonUI.focusUI.attr('rx',50/4);
						globals.CommonUI.focusUI.attr('x',-(50*3/2));
						globals.CommonUI.focusUI.attr('y',-(50*2/2));
					}
				
	globals.CommonUI.linkFocusUI = Viva.Graph.svg('path')
					   .attr('stroke', globals.currentTheme.sourceConfig.displaySettings.focusColor)
					   .attr('stroke-width', '5')
					   
	globals.CommonUI.checkUI = Viva.Graph.svg('circle')
					.attr('cx', 0) //...for circle
					.attr('cy', 0)//...for circle
					.attr('r',50)
					.attr('fill','transparent')//'#4dffc3')
					.attr('stroke',globals.currentTheme.sourceConfig.displaySettings.highlightColor)
					.attr('stroke-width', '5')
					if (!globals.currentTheme.sourceConfig.displaySettings.opaque) {globals.CommonUI.checkUI.attr('stroke-opacity','0.5')}
					if (globals.currentTheme.sourceConfig.displaySettings.highlightHaze) {globals.CommonUI.checkUI.attr('filter','url(#hazeEffect)');}
					
	//MARKER: TEXT
	globals.CommonUI.linkMidMarker = Viva.Graph.svg('marker')
		.attr('class', 'markertextmain')
		//.attr('id', linklabelId )
		.attr('viewBox', "-4 -6 8 12")
		.attr('refX', "3")
		.attr('refY', "0.5")
		.attr('markerWidth', "500")
		.attr('markerHeight', "100")
		.attr('markerUnits', "userSpaceOnUse")
		.attr('orient', "auto");
	
	globals.CommonUI.linkName = Viva.Graph.svg('text')
			.attr('class','markertextlabel')
			.attr('x', '0')
			.attr('y', '0.5')
			.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkMainTextColor)
			.attr('font-family','Arial, Helvetica, sans-serif')
			.attr('font-size','1.5')

	//		.text(link.data.name);
	//if (globals.currentTheme.sourceConfig.displaySettings.showRelationships == "on-highlight") {markerLabel.attr('fill','transparent')}
	
	//var propertyList = link.data.properties.forEach(function(prop){var x = ''; prop})
	globals.CommonUI.linkProps = Viva.Graph.svg('text')
			.attr('class','markertextsub')
			.attr('x', '0')
			.attr('y', '.5')
			.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkSubTextColor)
			.attr('font-family','Arial, Helvetica, sans-serif')
			.attr('font-size','1')
	//		.text('');
	//markerProperties.innerHTML = propertyListToSvgList(link.data.properties, '<tspan x="0" dy="1.2em">', '</tspan>');
			
	globals.CommonUI.popoutInfoUI = Viva.Graph.svg('g');

	globals.CommonUI.popoutTextUI = Viva.Graph.svg('text')
				//.attr('class', 'slidetext')
				.attr('y', 0) //node.data.nodeSize/2 + 5)
				.attr('x', 0)// - node.data.displayLabel.length)
				.attr('fill',globals.currentTheme.sourceConfig.displaySettings.entityPopoutTextColor)
				.attr('stroke-width','0')
				.attr('font-family','Arial, Helvetica, sans-serif')
				.attr('font-size','10')
				.attr('opacity', 0)
				.text('--');
			//popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="50" dy="1.2em">', '</tspan>');

	globals.CommonUI.popoutBodyUI = Viva.Graph.svg('rect')
				//.attr('class', 'slidebody')
				.attr('width', 0)
				.attr('x', 0)
				.attr('y', 0)
				.attr('rx', 7)
				.attr('height', 0)
				.attr('fill',globals.currentTheme.sourceConfig.displaySettings.entityPopoutBoxColor)
				//.attr('width','20%')

			//if (!globals.currentTheme.sourceConfig.displaySettings.opaque) {globals.CommonUI.popoutBodyUI.attr('fill-opacity',0.3);}
			
	globals.CommonUI.popoutInfoUI.append(globals.CommonUI.popoutBodyUI);
	globals.CommonUI.popoutInfoUI.append(globals.CommonUI.popoutTextUI);

}
		