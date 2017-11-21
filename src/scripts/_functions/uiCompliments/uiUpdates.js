		function closeDialog(dialogName)
		{
			document.getElementById(dialogName).close();
		}
		
		
		//function applyConfigUpdates(_sourceConfig)
		//{
		//	globals.graphContainer = document.getElementById('graphContainer');
		//	globals.graphContainer.style.background=_sourceConfig.displaySettings.graphBackground;
		//	if (_sourceConfig.displaySettings.backgroundImage!=null){
		//		globals.graphContainer.style['background-image'] =  'url('+_sourceConfig.displaySettings.backgroundImage+')'
		//	};
		//}
		
		function addValueToList(listElementId, col1, col2, col3)
		{
			var propertyElement = document.getElementById(listElementId);
			//check if element already exists in list...
			for (var i = 0; i < propertyElement.childNodes.length; i++ ){
				if (propertyElement.childNodes[i].childNodes[0].childNodes[2].innerHTML == col3){
					return;
				}
			}
			//element does not already exist in list, therefore add it...
			var html = '<tr>'
			html += '<td>'+col1+'</td>'	
			html += '<td>'+col2+'</td>'	
			html += '<td>'+col3+'</td>'	
			html += '</tr>';
			propertyElement.innerHTML +=html;

		}	
		
		
