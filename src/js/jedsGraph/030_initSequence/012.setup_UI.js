


function setupCommonUI(){
			//Common UI...
	CommonUI.focusUI = Viva.Graph.svg('circle')
					.attr('cx', 0) //...for circle
					.attr('cy', 0)//...for circle
					.attr('r',50)
					.attr('fill','transparent')//'#4dffc3')
					.attr('stroke',currentTheme.sourceConfig.displaySettings.focusColor)
					if (!currentTheme.sourceConfig.displaySettings.opaque) {CommonUI.focusUI.attr('stroke-opacity','0.5')}
					//.attr('stroke-opacity',0.5);
					if (currentTheme.sourceConfig.displaySettings.entityShape == "rect") {
						CommonUI.focusUI.attr('width',50 * 3);
						CommonUI.focusUI.attr('height',50 * 2);
						CommonUI.focusUI.attr('rx',50/4);
						CommonUI.focusUI.attr('x',-(50*3/2));
						CommonUI.focusUI.attr('y',-(50*2/2));
					}
				
	CommonUI.linkFocusUI = Viva.Graph.svg('path')
					   .attr('stroke', currentTheme.sourceConfig.displaySettings.focusColor)
					   .attr('stroke-width', '5')
					   
	CommonUI.checkUI = Viva.Graph.svg('circle')
					.attr('cx', 0) //...for circle
					.attr('cy', 0)//...for circle
					.attr('r',50)
					.attr('fill','transparent')//'#4dffc3')
					.attr('stroke',currentTheme.sourceConfig.displaySettings.highlightColor)
					.attr('stroke-width', '5')
					if (!currentTheme.sourceConfig.displaySettings.opaque) {CommonUI.checkUI.attr('stroke-opacity','0.5')}
					if (currentTheme.sourceConfig.displaySettings.highlightHaze) {CommonUI.checkUI.attr('filter','url(#hazeEffect)');}
					
	//MARKER: TEXT
	CommonUI.linkMidMarker = Viva.Graph.svg('marker')
		.attr('class', 'markertextmain')
		//.attr('id', linklabelId )
		.attr('viewBox', "-4 -6 8 12")
		.attr('refX', "3")
		.attr('refY', "0.5")
		.attr('markerWidth', "500")
		.attr('markerHeight', "100")
		.attr('markerUnits', "userSpaceOnUse")
		.attr('orient', "auto");
	
	CommonUI.linkName = Viva.Graph.svg('text')
			.attr('class','markertextlabel')
			.attr('x', '0')
			.attr('y', '0.5')
			.attr('fill',currentTheme.sourceConfig.displaySettings.linkMainTextColor)
			.attr('font-family','Arial, Helvetica, sans-serif')
			.attr('font-size','1.5')

	//		.text(link.data.name);
	//if (currentTheme.sourceConfig.displaySettings.showRelationships == "on-highlight") {markerLabel.attr('fill','transparent')}
	
	//var propertyList = link.data.properties.forEach(function(prop){var x = ''; prop})
	CommonUI.linkProps = Viva.Graph.svg('text')
			.attr('class','markertextsub')
			.attr('x', '0')
			.attr('y', '.5')
			.attr('fill',currentTheme.sourceConfig.displaySettings.linkSubTextColor)
			.attr('font-family','Arial, Helvetica, sans-serif')
			.attr('font-size','1')
	//		.text('');
	//markerProperties.innerHTML = propertyListToSvgList(link.data.properties, '<tspan x="0" dy="1.2em">', '</tspan>');
			
	CommonUI.popoutInfoUI = Viva.Graph.svg('g');

	CommonUI.popoutTextUI = Viva.Graph.svg('text')
				//.attr('class', 'slidetext')
				.attr('y', 0) //node.data.nodeSize/2 + 5)
				.attr('x', 0)// - node.data.displayLabel.length)
				.attr('fill',currentTheme.sourceConfig.displaySettings.entityPopoutTextColor)
				.attr('stroke-width','0')
				.attr('font-family','Arial, Helvetica, sans-serif')
				.attr('font-size','10')
				.attr('opacity', 0)
				.text('--');
			//popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="50" dy="1.2em">', '</tspan>');

	CommonUI.popoutBodyUI = Viva.Graph.svg('rect')
				//.attr('class', 'slidebody')
				.attr('width', 0)
				.attr('x', 0)
				.attr('y', 0)
				.attr('rx', 7)
				.attr('height', 0)
				.attr('fill',currentTheme.sourceConfig.displaySettings.entityPopoutBoxColor)
				//.attr('width','20%')

			//if (!currentTheme.sourceConfig.displaySettings.opaque) {CommonUI.popoutBodyUI.attr('fill-opacity',0.3);}
			
	CommonUI.popoutInfoUI.append(CommonUI.popoutBodyUI);
	CommonUI.popoutInfoUI.append(CommonUI.popoutTextUI);

}
		