function renderGraph()
{
	// Finally render the graph with our customized globals.graphics object:
	renderer = Viva.Graph.View.renderer(globals.GRAPH, {
	  layout   : globals.layout, //Exclude custom physics
	  graphics   : globals.graphics,
	  renderLinks : true,
	  prerender  : true,
	  container : document.getElementById('graphContainer')
	});
	//var renderer2 = Viva.Graph.View.globals.renderer(graph, {
	//  container : document.getElementById('schemaContainer')
	//});
	
	renderer.run();
}