function renderGraph()
{
	// Finally render the graph with our customized graphics object:
	renderer = Viva.Graph.View.renderer(GRAPH, {
	  layout   : layout, //Exclude custom physics
	  graphics   : graphics,
	  renderLinks : true,
	  prerender  : true,
	  container : document.getElementById('graphContainer')
	});
	//var renderer2 = Viva.Graph.View.renderer(graph, {
	//  container : document.getElementById('schemaContainer')
	//});
	
	renderer.run();
}