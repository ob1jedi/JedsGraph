	
//============ DATA MONITORING ================================================================================================================================================================================================  

		function clearAllMonitored()
		{
			while (monitoredNodes.length >0){
				removeMonitoredNode(monitoredNodes[0].id);
			}
			while (monitoredLinks.length >0){
				removeMonitoredLink(monitoredLinks[0].data.id)
			}
		}
		
		function monitorNode(node)
		{
			var alreadymonitored = false;
			monitoredNodes.map(function(n){if (n.id == node.id) alreadymonitored = true;});
			if (!alreadymonitored){
				monitoredNodes.push(node);
				var removeButton = '<button class="fortext mytooltip" onclick="removeMonitoredNode('+ node.id +')" >X<div class="mytooltiptext">stop monitoring</div></button>'
				addValueToList('nodelist.monitored', removeButton, 'node:',  node.id)
			}
		}
		
		function monitorLink(link)
		{
			var alreadymonitored = false;
			monitoredLinks.map(function(n){if (n.data.id == link.data.id) alreadymonitored = true;});
			if (!alreadymonitored){
				monitoredLinks.push(link);
				var removeButton = '<button class="fortext mytooltip" onclick="removeMonitoredLink('+ link.data.id +')" >X<div class="mytooltiptext">stop monitoring</div></button>'
				addValueToList('nodelist.monitored', removeButton, 'link:',  link.data.id)
			}
		}
		
		function monitorCheckedItems()
		{
			//add nodes...
			if (selectedNode) {monitorNode(selectedNode);}
			checkedNodes.forEach(function (node){
				monitorNode(node);
			});	
			//add links...
			checkedLinks.forEach(function (link){
				monitorLink(link);
			});

			pollDatabase();
		}

		
		
		function removeMonitoredNode(nodeid)
		{
			var searchedIndex = -1;
			monitoredNodes.map(function (node, index){if (node.id == nodeid) {searchedIndex = index;}})			
			if (searchedIndex > -1) {
				monitoredNodes.splice(searchedIndex, 1);
				var vislist = document.getElementById('nodelist.monitored');
				for (var i = 0; i < vislist.children.length; i++ ){
					if (vislist.children[i].children[0].children[2].innerHTML == nodeid
					&& vislist.children[i].children[0].children[1].innerHTML == 'node:'){
						vislist.children[i].remove();
					}
				}
			}	
		}
		
		function removeMonitoredLink(linkid)
		{
			var searchedIndex = -1;
			monitoredLinks.map(function (link, index){if (link.data.id == linkid) {searchedIndex = index;}})			
			if (searchedIndex > -1) {
				monitoredLinks.splice(searchedIndex, 1);
				var vislist = document.getElementById('nodelist.monitored');
				for (var i = 0; i < vislist.children.length; i++ ){
					if (vislist.children[i].children[0].children[2].innerHTML == linkid
					&& vislist.children[i].children[0].children[1].innerHTML == 'link:'){
						vislist.children[i].remove();
					}
				}
			}	
		}
		
	/*The following 3 functions form a closed loop*/
	function pollDatabase()
	{
		setTimeout(function () { dataService.CheckMonitoredNodes(); }, config_ext.monitoringOptions.pollInterval * 1000);
	}

	/*loop*/