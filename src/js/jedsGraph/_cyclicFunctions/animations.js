//Cyclic functions
		
		/*every second, checks the list of timeout elements, and removes any which have timed out*/
		function checkTimeoutElements()
		{
			setTimeout(function(){ 
				
				var i = 0;
				while(i < timeoutElements.length)
				{
					var tele = timeoutElements[i];
					var currenttime = +new Date();
					if (currenttime > tele.activationPoint + (tele.duration *1000))
					{	//remove element...
						tele.fnRemove(tele.element);
						timeoutElements.splice(i, 1);
						
					}
					else (i++);
				}
				checkTimeoutElements(); 
				
			}, 1000);
		}
		
		function performAnimations()
		{	
			//Node Update-Animations...
			animUpdateNodes.forEach(function (node) {
				addSatelliteToNode(node);
			});
			animUpdateNodes = [];
			
			//Link Update-Animations...
			animUpdateLinks.forEach(function (link) {				
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
				timeoutElements.push(new timeoutElementType(gSattelite2, 60, removeAnimatedElement));
				link.data.UI.midMarkerUI.append(gSattelite2);
				gSattelite2.attr('class','rotatee');
			});
			animUpdateLinks = [];
			
		}
		
		function removeAnimatedElement(element)
		{
			element.remove();
		}
		
		
		function animateTest(node)
		{	
			if(!node){node = selectedNode;}
			//animUpdateNodes.forEach(function (node) {
				//var node = selectedNode;
				var nodeUI = graphics.getNodeUI(node.id);
				circlex = Viva.Graph.svg('circle')
						.attr('cx', 0)
						.attr('cy', 0)
						.attr('r', node.data.nodeSize)
						.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')
						.attr('stroke-width','5')
						.attr('stroke-opacity','0.7')
				nodeUI.append(circlex);
				circlex.attr('class','droplet');
				

				
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
                ' A 10,' + node.data.nodeSize + ',-30,0,1,' + node.data.nodeSize*2 + ',' + node.data.nodeSize*2;
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
						.attr('cx', 0) //node.data.nodeSize/2)
						.attr('cy', 0) //node.data.nodeSize/2)
						.attr('r', node.data.nodeSize)
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
		