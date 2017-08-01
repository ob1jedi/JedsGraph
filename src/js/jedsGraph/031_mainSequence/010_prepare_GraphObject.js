//Initial setup

function prepareGraph()
{
	var graph = Viva.Graph.graph();

	// Custom physics... (include/exclude in the 'renderer' at the bottom of the script)
	var idealLength = 150;
	layout = Viva.Graph.Layout.forceDirected(graph, {
	   springLength: idealLength,
	   springCoeff : 0.00008,
	   //dragCoeff : 0.01,
	   //gravity : -1.2,
	   //theta : 1
	   springTransform: function (link, spring) {
			spring.length = idealLength;
	   }
		  
	});

	graphics = Viva.Graph.View.svgGraphics();
	GRAPH = graph;
}


