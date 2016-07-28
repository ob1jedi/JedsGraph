//Initial setup

function prepareGraph()
{
	var graph = Viva.Graph.graph();

	//graph.addNode('anvaka', 'test1'); //'91bad8ceeec43ae303790f8fe238164b');
	//graph.addNode('indexzero',function(){var d = new Date(); return d.getTime() }()); // 'd43e8ea63b61e7669ded5b9d3c2e980f');
	//graph.addNode('asdasd', 'test3'); //'d43e8ea63b61e7669ded5b9d3c2e980f');
	//graph.addLink('anvaka', 'indexzero'); //'indexzero');
	//addDataNode

	// Custom physics... (include/exclude in the 'renderer' at the bottom of the script)
	var idealLength = 150;
	layout = Viva.Graph.Layout.forceDirected(graph, {
	   springLength: idealLength,
	   springCoeff : 0.00008,
	   //dragCoeff : 0.01,
	   //gravity : -1.2,
	   //theta : 1
	   springTransform: function (link, spring) {
			spring.length = idealLength;// + link.data.connectionStrength;
	   }
		  
	});

	graphics = Viva.Graph.View.svgGraphics();
	GRAPH = graph;
}
	//nodeSize = 24;

//var visDefs = '<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
//visDefs += '<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
//var defs = graphics.getSvgRoot().append('defs');
//defs.append(visDefs);
		

//add static-type elements
//var backgroundDataNode = new nodeDataType();
//backgroundDataNode.id = 'backgroundImage';
//backgroundDataNode.nodeType = 'window'
//var backgroundNode = graph.addNode(backgroundDataNode.id, backgroundDataNode); //'91bad8ceeec43ae303790f8fe238164b');			
//layout.pinNode(backgroundNode, true);

//------------------------------------------------------------------------------------
// we use this method to highlight all realted links
// when user hovers mouse over a node:

//------------------------------------------------------------------------------------