//====== LINK ASSET DEFINITIONS========================================================================================================
// To render an arrow we have to address two problems:
//  1. Links should start/stop at node's bounding box, not at the node center.
//  2. Render an arrow shape at the end of the link.

// Rendering arrow shape is achieved by using SVG markers, part of the SVG
// standard: http://www.w3.org/TR/SVG/painting.html#Markers
function defineLinkObjectsCommonAssets()
{
	//** COMMON REFERENCES ************************************************		
	//MARKER: TRAINGLE
	console.log('globals.currentTheme', globals.currentTheme);
	var markerTraingle = Viva.Graph.svg('marker')
					   .attr('id', 'Triangle')
					   .attr('viewBox', "0 0 10 10")
					   .attr('refX', "30")
					   .attr('refY', "5")
					   .attr('refY', "5")
					   .attr('markerUnits', "userSpaceOnUse")
					   .attr('markerWidth', "10")
					   .attr('markerHeight', "10")
					   .attr('orient', "auto")
					   
	var markerArrow =  Viva.Graph.svg('path')
		.attr('d', 'M 0 0 L 12 5 L 0 10 z')
		.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkColor);
	markerTraingle.append(markerArrow)

					   
	//MARKER: DOUBLE-DASH
	var markerDoubleDash = Viva.Graph.svg('marker')
		.attr('id', 'DoubleDash')
		.attr('viewBox', "-4 -6 8 12")
		.attr('refX', "-20")
		.attr('refY', "0")
		.attr('markerWidth', "20")
		.attr('markerHeight', "20")
		.attr('markerUnits', "userSpaceOnUse")
		.attr('orient', "auto");
	var markerrect1 = Viva.Graph.svg('rect')
			.attr('x', '-3')
			.attr('y', '-5')
			.attr('width', '2')
			.attr('height', '10')
			.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkColor);
	var markerrect2 = Viva.Graph.svg('rect')
			.attr('x', '1')
			.attr('y', '-5')
			.attr('width', '2')
			.attr('height', '10')
			.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkColor);
	markerDoubleDash.append(markerrect1);
	markerDoubleDash.append(markerrect2);

	// Marker should be defined only once in <defs> child element of root <svg> element:
	var defs = globals.graphics.getSvgRoot().append('defs');
	defs.append(markerTraingle);
	defs.append(markerDoubleDash);
}