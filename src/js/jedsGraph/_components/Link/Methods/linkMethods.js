		function fixTextWidth4Link(link)
		{
			if(link.data.UI.nameTextUI && link.data.UI.midMarkerUI){
				var textWidth = link.data.UI.nameTextUI.getBBox().width;
				link.data.UI.nameTextUI.attr('x', -textWidth/2);
				link.data.UI.fullUI.attr('labelWidth',textWidth);
				
				if(link.data.UI.subTextUI){
					var i = 0;
					var boxWidth = link.data.UI.subTextUI.getBBox().width;
					while (link.data.UI.subTextUI.children[i]){
						$(link.data.UI.subTextUI.children[i]).attr('x', -boxWidth/2);
						i++;
					}
				}
			}
		}
		
		
		function showLinkDetails(link)
		{
			var processingElement = document.getElementById('selectedLink');
			var labellist = ''
			var html = '<p class="panelheader">Selected Link:</a> <p class="dataNameLabel">' + link.data.id + '</p>';
			html += '<br/><p class="panelheader">Link type</a>: <p class="dataNameLabel">'+link.data.name+'</p>' 	
			processingElement.innerHTML = html;
			
			html = '<a class="panelheader">Properties<a>:';
			html += '<table style="width:90%;">'
			var processingElement = document.getElementById('linkDetails');
			link.data.properties.forEach(function(property, index){
				html += '<tr>'
				var button_onclick = 'showOnNode(' + link.data.id + ', \'' + property.value + '\')';
				html += '<td> <p class="dataNameLabel">' + property.key + '</p></td><td><p class="dataValueLabel"> ' + property.value + '</p></td>';
				html += '</tr>'
			});
			html += '</table>'
			processingElement.innerHTML = html;
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function highlightRelatedNodes(nodeId, isOn) {				   
		   // just enumerate all realted nodes and update link color:
		   GRAPH.forEachLinkedNode(nodeId, function(node, link){
			   var linkUI = graphics.getLinkUI(link.id);
			   if (linkUI) {
				   if (!link.data.checked) {
						link.data.UI.pathUI.attr('stroke', isOn ? currentTheme.sourceConfig.displaySettings.linkHighlightColor : link.data.color)
					}
			   }
		   });
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------		
		function highlightDescendantNodes(nodeId, isOn) {				   
		   // just enumerate all realted nodes and update link color:
		   var descendantNodes = [];
		   descendantNodes.push(nodeId);
		   var i = 0;
		   while (i < (descendantNodes.length))
		   {
				var descendantNode = getDataNode(descendantNodes[i]);
				descendantNode.data.toLinks.forEach(function(link){
					var linkUI = graphics.getLinkUI(link.id);
					if (linkUI) {
						if (!link.data.checked) {link.data.UI.pathUI.attr('stroke', isOn ? currentTheme.sourceConfig.displaySettings.linkHighlightColor : link.data.color)}
					}
				});
				
				descendantNode.data.toNodes.forEach(function (node){
					if (descendantNodes.indexOf(node.id)< 0){descendantNodes.push(node.id);}
				});
				
				i++;
		   }
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function highlightAncestorNodes(nodeId, isOn) {				   
		   var ancestorNodes = [];
		   ancestorNodes.push(nodeId);
		   var i = 0;
		   while (i < (ancestorNodes.length))
		   {
				var ancestorNode = getDataNode(ancestorNodes[i]);
				ancestorNode.data.fromLinks.forEach(function(link){
					var linkUI = graphics.getLinkUI(link.id);
					if (linkUI) {
						if (!link.data.checked) {link.data.UI.pathUI.attr('stroke', isOn ? currentTheme.sourceConfig.displaySettings.linkHighlightColor : link.data.color)}
					}
				});
				ancestorNode.data.fromNodes.forEach(function (node){
					if (ancestorNodes.indexOf(node.id)< 0){ancestorNodes.push(node.id);}
				});
				i++;
		   }
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function checkLink(link){
				showLinkData(link);
				link.data.UI.pathUI.attr('stroke-width', link.data.sourceConfig.displaySettings.linkThickness * 2);
				link.data.UI.pathUI.attr('stroke', '#99ff33');
				link.data.checked = true;
				checkedLinks.push(link);
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function uncheckLink(link){
				hideLinkData(link);
				link.data.UI.pathUI.attr('stroke-width', link.data.sourceConfig.displaySettings.linkThickness);
				link.data.UI.pathUI.attr('stroke', link.data.color);
				link.data.checked = false;
				checkedLinks.map(function(l,index){if (l.data.id == link.data.id){checkedLinks.splice(index,1);}})
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function toggleLink(link, bvalue) {
		    
			if (bvalue == true && link.data.checked){return;}
			if (bvalue == false && !link.data.checked){return;}
			link.data.checked = !link.data.checked;
			if (link.data.checked) //link must be checked
			{
				checkLink(link);
			}
			else  //link must be unchecked
			{
				uncheckLink(link);
			}
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function highlightLink(link) { //...for mouse-hover only
			showLinkData(link);
			link.data.UI.pathUI.attr('stroke-width', link.data.sourceConfig.displaySettings.linkThickness * 2);
			//link.data.UI.pathUI.attr('stroke', 'red');
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function unHighlightLink(link) { //...for mouse-hover only
			if (!link.data.checked){
				hideLinkData(link);
				link.data.UI.pathUI.attr('stroke-width', link.data.sourceConfig.displaySettings.linkThickness);
			}
			//link.data.UI.pathUI.attr('stroke', link.data.color);
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function hideLinkData(link)
		{
			link.data.UI.fullUI.attr('labelVisible','false');
			if (!link.data.displayingData){return;}
			link.data.displayingData = false;
			if(link.data.UI.nameTextUI){link.data.UI.nameTextUI.remove();}
			if(link.data.UI.subTextUI){link.data.UI.subTextUI.remove();}
			$(link.data.UI.fullUI).hide().show();
			//drawLink(link.data.UI.fullUI, {x:0,y:0}, {x:0,y:0});
		}
		
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function getLinkById(linkId)
		{
			for (var i = 0; i < linkList.length; i++)
				if (linkList[i].id == linkId)
					return linkList[i];
			//return linkList.find(function (l) { return l.data.id === linkId });
		}
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		function showLinkData(link)
		{
			link.data.UI.fullUI.attr('labelVisible','true');
			if (link.data.displayingData) {return;}
			link.data.displayingData = true;
			link.data.UI.nameTextUI = CommonUI.linkName.cloneNode();
			link.data.UI.nameTextUI.innerHTML = link.data.displayLabel;
			if(link.data.UI.midMarkerUI) {link.data.UI.midMarkerUI.append(link.data.UI.nameTextUI);}
			
			if(currentTheme.sourceConfig.displaySettings.showRelationProperties){			
				link.data.UI.subTextUI = CommonUI.linkProps.cloneNode();
				link.data.UI.subTextUI.innerHTML = propertyListToSvgList(link.data.properties, '<tspan x="0" dy="1.2em">', '</tspan>');
				if(link.data.UI.midMarkerUI) {link.data.UI.midMarkerUI.append(link.data.UI.subTextUI);}
			}
			fixTextWidth4Link(link);
		}

		function refreshLinkVisual(link)
		{
			if(link.data.UI.nameTextUI){link.data.UI.nameTextUI.innerHTML = link.data.displayLabel;}
			if(link.data.UI.subTextUI){link.data.UI.subTextUI.innerHTML = propertyListToSvgList(link.data.properties, '<tspan x="0" dy="1.2em">', '</tspan>');}
			
			//link.data.UI.subTextUI.attr('x', link.data.UI.subTextUI.getBBox().width/2)
			//toggle twice to refresh link...
			toggleLink(link);
			toggleLink(link);
		}
		