//====== TOOL PANELS ===============================================================================================================================================

		function toggleToolPanel(panelName)
		{
			var panel;
			globals.currentTheme.sourceConfig.viewOptions.panels.map(function (p) {if (p.name==panelName){panel = p;}})
			$elButton = document.getElementById('toolbar.'+ panel.name);
			$elPanel = document.getElementById(panel.name);
			$parentContainer = document.getElementById(panel.parent);
			$hiddenParent = document.getElementById('noColumn');
			if ($parentContainer && $elPanel && $elButton){
				var isShowing = $elButton.classList.contains('showicon');
				if(isShowing){ //hide...
					$elButton.classList.remove('showicon');
					$elPanel.classList.remove('slide-out');
					$elPanel.classList.add('slide-in');
					//$parentContainer.removeChild($elPanel);
				    globals.timeoutElements.push(new timeoutElementType({panel:$elPanel, button:$elButton}, 1, hideToolPanel));
				}
				else{//show...
					$parentContainer.appendChild($elPanel);
					$elButton.classList.add('showicon');
					$elPanel.classList.remove('slide-in');
					$elPanel.classList.add('slide-out');
				}
			}
		}
		
		
		
		function hideToolPanel(elements)
		{
			$topBarElem = elements.button;
			$panel = elements.panel;
			if (!$topBarElem.classList.contains('showicon')){
				$hiddenParent.appendChild($elPanel);
			}
		}
		
		//................Tool panels - Drag and drop................
		function handleDragOver(e) {
		  if (e.preventDefault) {
			e.preventDefault(); // Necessary. Allows us to drop.
		  }
		  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
		  return false;
		}
		function handleDragStart(e) {
		  this.style.opacity = '0.4';  // this / e.target is the source node.
		}
		function handleDragLeave(e) {
		  this.classList.remove('over');  // this / e.target is previous target element.
		}
		function handleDragEnter(e) {
		  // this / e.target is the current hover target.
		  this.classList.add('over');
		}
		function handleDrop(e) {
		  // this / e.target is current target element.
		  if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		  }
		  // See the section on the DataTransfer object.
		  return false;
		}
		function handleDragEnd(e) {
		  // this/e.target is the source node.
		  this.style.opacity = '0.9';
		  globals.toolPanels.forEach(function (col) {
			col.classList.remove('over');
		  });
		}