function renderGraph() {
  // Finally render the graph with our customized globals.graphics object:
  renderer=Viva.Graph.View.renderer(globals.GRAPH,{
    layout: globals.layout, //Exclude custom physics
    graphics: globals.graphics,
    renderLinks: true,
    prerender: true,
    container: document.getElementById('graphContainer')
  });

  function updateIndicator(e) {
    setTimeout(function() {
      var indicator=document.getElementById('indicator');
      var gx=globals.layout.getGraphRect();
      var graphMatrix = globals.graphics.getSvgRoot().childNodes[0].attr('transform').substr(7).replace(')','').replace(/\s/g,'').split(',');
      indicator.innerHTML=''
      +'x1:'+gx.x1
      +'<br/>x2:'+gx.x2
      +'<br/>y1:'+gx.y1
      +'<br/>y2:'+gx.y2
      +'<br/>scale:'+graphMatrix[3]
      +'<br/>GX:'+graphMatrix[4]
      +'<br/>GY:'+graphMatrix[5]
      //+ ((e)?('<br/>clientX:' + e.x + '<br/>clientY:' + e.y):'')
      ;
      updateIndicator();
    },10);
  }
  updateIndicator();
  

  globals.renderer=renderer;
  renderer.run();
}