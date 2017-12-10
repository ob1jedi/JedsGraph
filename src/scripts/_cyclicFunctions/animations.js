//Cyclic functions
		
		/*every second, checks the list of timeout elements, and removes any which have timed out*/
		function checkTimeoutElements()
		{
			setTimeout(function(){ 
				
				var i = 0;
				while(i < globals.timeoutElements.length)
				{
					var tele = globals.timeoutElements[i];
					var currenttime = +new Date();
					if (currenttime > tele.activationPoint + (tele.duration *1000))
					{	//remove element...
						tele.fnRemove(tele.element);
						globals.timeoutElements.splice(i, 1);
						
					}
					else (i++);
				}
				checkTimeoutElements(); 
				
			}, 1000);
		}
		
		function performAnimations()
		{	
			//Node Update-Animations...
			globals.animUpdateNodes.forEach(function (node) {
				addSatelliteToNode(node);
			});
			globals.animUpdateNodes = [];
			
			//Link Update-Animations...
			globals.animUpdateLinks.forEach(function (link) {				
				var circletiny2 = Viva.Graph.svg('circle')
						.attr('cx', 1)
						.attr('cy', 1)
						.attr('r', .5)
						.attr('fill','red')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')
						.attr('opacity',0.5)
						.attr('stroke-width',0)
				var gSattelite2 = Viva.Graph.svg('g')
				gSattelite2.append(circletiny2);
				globals.timeoutElements.push(new timeoutElementType(gSattelite2, 60, removeAnimatedElement));
				link.data.UI.midMarkerUI.append(gSattelite2);
				gSattelite2.attr('class','rotatee');
			});
			globals.animUpdateLinks = [];
			
		}
		
		function removeAnimatedElement(element)
		{
			element.remove();
		}
		
		
		function animateTest(node)
		{	
			if(!node){node = globals.selectedNode;}
			//globals.animUpdateNodes.forEach(function (node) {
				//var node = globals.selectedNode;
				var nodeUI = globals.graphics.getNodeUI(node.id);
				circlex = Viva.Graph.svg('circle')
						.attr('cx', 0)
						.attr('cy', 0)
						.attr('r', Number(node.data.entityConfig.config.attributes["radius"]))
						.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')
						.attr('stroke-width','5')
						.attr('stroke-opacity','0.7')
				nodeUI.append(circlex);
				circlex.attr('class','droplet');
				

				var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
				var groupx = Viva.Graph.svg('g')
				var x1 = -13;
				var y1 = 10;
				var x2 = 37;
				var c = 48;
				var dpath1 = '';
				dpath1 += 'M '+ x1 +' '+ y1 +' C '; //x1, y1
				dpath1 += x1 +' '+ c +','; //control-x1, control-y1
				dpath1 += x2 +' '+ c +',';//control-x2, control-y2
				dpath1 += x2 +' '+y1; //x2, y2
				var dpath2 = 'M' + 0 + ',' + 0 +
                ' A 10,' + nodeRadius + ',-30,0,1,' + nodeRadius * 2 + ',' + nodeRadius * 2;
				var dpath3 = "M80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 Z"   
				var dpath4 = "M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10"
				//var dpath = '';
				//dpath += 'M '+0+' '+0 +' C '; //x1, y1
				//dpath += 0+' '+40+','; //control-x1, control-y1
				//dpath += 50+' '+40+',';//control-x2, control-y2
				//dpath += 50+' '+0; //x2, y2
				var pathx = Viva.Graph.svg('path')
					.attr('d',dpath1)
					//.attr('d','M'+0+' '+0+' C '+0+' '+50+', '+50+' '+0+', '+50+' '+ 50)	
					//M70 110 
					//C 70 140, 
					//110 140, 
					//110 110
					.attr('stroke', 'blue')
				//groupx.append(pathx);
				//groupx.append(circlex);
				
				
				circley = Viva.Graph.svg('circle')
						.attr('cx', 0) //node.data.entityConfig.config.attributes["radius"]/2)
						.attr('cy', 0) //node.data.entityConfig.config.attributes["radius"]/2)
						.attr('r', node.data.entityConfig.config.attributes["radius"])
						.attr('fill','blue')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')	
				//groupx.append(circley);
				
				circletiny = Viva.Graph.svg('circle')
						.attr('cx', 20)
						.attr('cy', 30)
						.attr('r', 5)
						.attr('fill','red')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')
						.attr('opacity',0.5)
						.attr('stroke-width',0)
				groupx.append(circletiny);
				groupx.attr('dx',100);
				groupx.attr('dy',100);
				nodeUI.append(groupx);
				groupx.attr('class','rotatee');

		}
		
		
function addSatelliteToNode(node)
{
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	var rippleCircle = Viva.Graph.svg('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', nodeRadius)
				.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
				.attr('stroke','red')
				.attr('stroke-width','5')
				.attr('stroke-opacity','0.7')
		var circletiny = Viva.Graph.svg('circle')
				.attr('cx', nodeRadius)
				.attr('cy', nodeRadius)
				.attr('r', 5)
				.attr('fill','red')//node.data.nodeColor)//'#4dffc3')
				.attr('stroke','red')
				.attr('opacity',0.5)
				.attr('stroke-width',0)
		var endArrow =  Viva.Graph.svg('path')
					.attr('stroke-width',0)
					.attr('d', 'M 0 -0.7 L 2 0 L 0 0.7 z')
					.attr('fill',node.data.nodeColor);
							
		var gSattelite = Viva.Graph.svg('g')
		gSattelite.append(circletiny);
		gSattelite.attr('dx',100);
		gSattelite.attr('dy',100);
		globals.timeoutElements.push(new timeoutElementType(rippleCircle, 5, removeAnimatedElement));
		globals.timeoutElements.push(new timeoutElementType(gSattelite, 60, removeAnimatedElement));
		node.data.UI.fullUI.insertBefore(rippleCircle, node.data.UI.bodyUI);
		node.data.UI.fullUI.insertBefore(gSattelite, node.data.UI.bodyUI);
		gSattelite.attr('class','rotatee');
		rippleCircle.attr('class','droplet');
}


function AnimationHelper(){

  this.StartAnimationTicker = function(){
    animationTick();
  }

  function animationTick(){
    setTimeout(function(){ 
          stepAllAnimations()
				  animationTick(); 
			  }, 10);
  }

  function stepAllAnimations(){
    var i = -1;
    var overflow = 1000;
    while (++i < globals.animations.length && i < overflow){
      var anim = globals.animations[i];
      if (anim.complete)
        globals.animations.splice(i,1);
      else
        anim.onNextStep(anim);
    }
  }

  function AnimatedObject(){
    this.currentStepIndex = 0;
    this.complete = false;
    this.remainingSteps = 70;
    this.data = {};
    this.beforeStart = function(){}
    this.onNextStep = function(){}
  }

  this.NodePositionAnimation = function(node, requestedPos){
    var anim = new AnimatedObject();
    var currentPos = globals.layout.getNodePosition(node.id);
    anim.data = {"node": node, "currentPos": currentPos, "requestedPos": requestedPos};
    anim.stepX = Math.abs(requestedPos.x - currentPos.x) / anim.remainingSteps * (currentPos.x<=requestedPos.x?1:-1);
    anim.stepY = Math.abs(requestedPos.y - currentPos.y) / anim.remainingSteps * (currentPos.y<=requestedPos.y?1:-1);
    anim.onNextStep = function(){
      var node = this.data.node;
      var currentPos = this.data.currentPos;
      var reqPos = this.data.requestedPos;
      var remainingSteps = this.remainingSteps--;
      var nextX = currentPos.x + this.stepX
      var nextY = currentPos.y + this.stepY
      this.data.currentPos.x = nextX;
      this.data.currentPos.y = nextY;
    
      globals.layout.setNodePosition(node.id, nextX, nextY);
      if (this.remainingSteps <= 0) this.complete = true;
    }
    globals.animations.push(anim);
  }


  this.AddNodeRipple = function(node){
  	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	  var rippleCircle = Viva.Graph.svg('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', nodeRadius)
				.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
				.attr('stroke','red')
				.attr('stroke-width','5')
				.attr('stroke-opacity','0.7')
		globals.timeoutElements.push(new timeoutElementType(rippleCircle, 5, removeAnimatedElement));		
		node.data.UI.fullUI.insertBefore(rippleCircle, node.data.UI.bodyUI);
		rippleCircle.attr('class','droplet');
}


}