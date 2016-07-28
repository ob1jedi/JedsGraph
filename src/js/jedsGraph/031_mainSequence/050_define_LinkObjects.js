
function defineLinkObjects()
{
	//LINKS SETUP (occurs once for every link...)
	//** UNIQUE REFERENCES ************************************************
	graphics.link(function(link){ //...get called for every link
		//====== DATA LINKS ========================================================================================================
		if (link.data.linkType == 'data')
		{
			var linklabelId = link.data.id;//'link'+link.fromId + 'To' + link.toId;
			if (link.data.sourceConfig.displaySettings.showRelationships == "all" || link.data.sourceConfig.displaySettings.showRelationships == "on-highlight")
			{

				//MARKER: TEXT
				var midMarker = Viva.Graph.svg('marker')
					.attr('class', 'markertextmain')
					.attr('id', 'mid'+linklabelId )
					.attr('viewBox', "-4 -6 8 12")
					.attr('refX', "0")
					.attr('refY', "0")
					.attr('markerWidth', "500")
					.attr('markerHeight', "100")
					.attr('markerUnits', "userSpaceOnUse")
					.attr('orient', "auto");
				
				//MARKER: ARROW
				var endMarker = Viva.Graph.svg('marker')
					//.attr('class', 'markertextmain')
					.attr('id', 'end'+linklabelId )
					.attr('viewBox', "-4 -6 8 12")
					.attr('refX', "0")
					.attr('refY', "0")
					.attr('markerWidth', "50")
					.attr('markerHeight', "100")
					.attr('markerUnits', "userSpaceOnUse")
					.attr('orient', "auto");
					
				var endArrow =  Viva.Graph.svg('path')
					.attr('stroke-width',0)
					.attr('d', 'M 0 -0.7 L 2 0 L 0 0.7 z')
					.attr('fill',link.data.color);
					if (!link.data.sourceConfig.displaySettings.opaque) {endArrow.attr('opacity', link.data.sourceConfig.displaySettings.linkOpacity);}
					//markerTraingle.append(markerArrow)
				/*var markerLabel = Viva.Graph.svg('text')
						.attr('class','markertextlabel')
						.attr('x', '0')
						.attr('y', '0')
						.attr('fill',link.data.sourceConfig.displaySettings.linkMainTextColor)
						.attr('font-family','Arial, Helvetica, sans-serif')
						.attr('font-size','1.5')
						.text(link.data.name);
				if (link.data.sourceConfig.displaySettings.showRelationships == "on-highlight") {markerLabel.attr('fill','transparent')}
				
				
				//var propertyList = link.data.properties.forEach(function(prop){var x = ''; prop})
				var markerProperties = Viva.Graph.svg('text')
						.attr('class','markertextsub')
						.attr('x', '0')
						.attr('y', '.5')
						.attr('fill',link.data.sourceConfig.displaySettings.linkSubTextColor)
						.attr('font-family','Arial, Helvetica, sans-serif')
						.attr('font-size','1')
						.text('');
				markerProperties.innerHTML = propertyListToSvgList(link.data.properties, '<tspan x="0" dy="1.2em">', '</tspan>');
				
				if (link.data.sourceConfig.displaySettings.showRelationships == 'all'){
					midMarker.append(markerLabel);
					if (link.data.sourceConfig.displaySettings.showRelationProperties){midMarker.append(markerProperties);}
				}
				*/
				
				endMarker.append(endArrow);
				var defs = graphics.getSvgRoot().append('defs');
				defs.append(midMarker);
				defs.append(endMarker);

				link.data.UI.midMarkerUI = midMarker;
				link.data.UI.toMarkerUI = endMarker;
				//link.data.UI.nameTextUI = markerLabel; //...only added when markder is highlighted
				//link.data.UI.subTextUI = markerProperties;
			}

			var linkPath;
			var ui = Viva.Graph.svg('g')
			.attr('class','link')
			//.attr('refX', '50')
			//.attr('refY', '50')
			
			var linkPath = Viva.Graph.svg('path')
					   .attr('class','linkpath')
					   .attr('id',linklabelId)
					   .attr('stroke', link.data.color)
					   .attr('stroke-width', link.data.sourceConfig.displaySettings.linkThickness)
					   .attr('marker-mid', 'url(#mid' + linklabelId + ')')
					   //.attr('marker-end', 'url(#Triangle)')
					   .attr('marker-end', 'url(#end' + linklabelId + ')')
					   .attr("fill", 'transparent');
					   if (!link.data.sourceConfig.displaySettings.opaque) {linkPath.attr('stroke-opacity', link.data.sourceConfig.displaySettings.linkOpacity);}

					   
			var linkPoputText = Viva.Graph.svg('text')
						.attr('class','linkPoputText')
						.attr('x',0)
						.attr('y',0)
						.attr('fill','#EB6A00')
						.attr('refx', '25')
						.attr('refy', '0')
						.attr('stroke-width', 0)
						.attr('font-family','Arial, Helvetica, sans-serif')
						.attr('font-size','10')
						.text('');
			/*
			var endArrow =  Viva.Graph.svg('path')
						.attr('stroke-width',3)
						.attr('d', 'M 0 -2 L 4 0 L 0 2 z')
						.attr('fill',link.data.color)
						.attr('stroke','red')*/

			var textwidth = 0;
			var proplist = ''; 
			link.data.properties.forEach(function(prop){
					linkPoputText.innerHTML += '<tspan dx="-' + textwidth + 'em" dy="1.5em" >' + prop.key + ": " + prop.value+  '</tspan>';
					textwidth = 5;
			});

			var linkRect = Viva.Graph.svg('rect')
						.attr('class','linkrect')
						.attr('refx', '30')
						.attr('width', '150')
						.attr('height', '25')
						.attr('fill','black')
						.attr('rx','5');
			//linkRect.attr('refy', Number(linkRect.attr('width'))/2 );
			//linkPoputText.attr('refy', Number(linkRect.attr('width'))/2 );
			//linkPath.innerHTML += '<text font-family="Verdana" font-size="42.5"><textPath xlink:href="#'+linklabelId+'">HELLO</textPath></text>';
			//linkPath.append('defs');

			ui.append(linkPath);
			//ui.append(endArrow);
			if (link.data.sourceConfig.displaySettings.loadRelationPopouts)
			{
				ui.append(linkRect);
				ui.append(linkPoputText);
			}

			$(linkPath).hover(function() { // MOUSE HOVER
				//markerLabel.attr('fill', 'yellow');
				if (link.data.checked){}
				//highlightLink(link);
			}, function() { // mouse out
				//unHighlightLink(link);
			});
			
			$(linkPath).click(function() { // MOUSE CLICK
				showLinkDetails(link);
				toggleLink(link);
			});

			link.data.UI.fullUI = ui;
			link.data.UI.pathUI = linkPath;
			link.data.UI.popoutBodyUI = linkRect;
			link.data.UI.popoutTextUI = linkPoputText;
			
			//var linkUI = graphics.getLinkUI(link.id);
			if (link.data.linkType == 'data'){
				ui.attr('fromNode',link.data.fromNodeID).attr('toNode',link.data.toNodeID);
				ui.attr('linkDataIndex',linkList.length);//default
			}
			ui.attr('fromNodeRadius',25); //default
			ui.attr('toNodeRadius',25);//default
			ui.attr('labelWidth',30);//default
			ui.attr('labelVisible',false);//default
			//ui.attr('linkPos', getDataLinks(link.data.fromNodeID, link.data.toNodeID).length);//will be adjusted later				
		}
		//====== INDICATOR LINKS ========================================================================================================
		else if(link.data.linkType == 'sub')
		{
			var linklabelId = link.data.id;//'link'+link.fromId + 'To' + link.toId;

			var linkPath;
			var ui = Viva.Graph.svg('g')
			.attr('class','link')
			var linkPath = Viva.Graph.svg('path')
					   .attr('id',linklabelId)
					   .attr('stroke', link.data.color)
					   .attr('stroke-width', '1')
					   .attr("fill", 'transparent');
					   if (!link.data.sourceConfig.displaySettings.opaque) {linkPath.attr('stroke-opacity', link.data.sourceConfig.displaySettings.linkOpacity);}

			ui.append(linkPath);
			link.data.UI.fullUI = ui;
			link.data.UI.pathUI = linkPath;
			ui.attr('fromNodeRadius',25); //default
			ui.attr('toNodeRadius',25);//default
			ui.attr('labelWidth',30);//default
			ui.attr('labelVisible',false);//default
		}	
		//====== planned LINKS ========================================================================================================
		else if(link.data.linkType == 'planned')
		{
			var linklabelId = link.data.id;//'link'+link.fromId + 'To' + link.toId;

			var linkPath;
			var ui = Viva.Graph.svg('g')
			.attr('class','link')
			var linkPath = Viva.Graph.svg('path')
					   .attr('id',linklabelId)
					   .attr('stroke', link.data.color)
					   .attr('stroke-width', link.data.sourceConfig.displaySettings.linkThickness)
					   .attr("fill", 'transparent');
					   if (!link.data.sourceConfig.displaySettings.opaque) {linkPath.attr('stroke-opacity', link.data.sourceConfig.displaySettings.linkOpacity);}

			ui.append(linkPath);
			link.data.UI.fullUI = ui;
			link.data.UI.pathUI = linkPath;
			ui.attr('fromNodeRadius',25); //default
			ui.attr('toNodeRadius',25);//default
			ui.attr('labelWidth',30);//default
			ui.attr('labelVisible',false);//default
			
		}
		
		ui.attr('linkType', link.data.linkType);
		ui.attr('textOrient', '-1');
		ui.attr('linkPathIndex',0);//default
		return ui;   
	});
}