var ConsoleService = function () {

	this.hideNodeFlyout = function () {
		var nodeFlyout = document.getElementById('panel.node');
		nodeFlyout.classList.remove('fadein');
		nodeFlyout.classList.add('fadeout');
		setTimeout(function () {
			nodeFlyout.innerHTML = "";
			nodeFlyout.style.left = '-100px';
		}, 200);
	}

	this.ShowFlyout = function (node, x, y) {
		var nodeFlyout = document.getElementById('panel.node');
		var newContent = '';
		newContent += '<div>'
		newContent += '	<h3> ' + node.data.displayLabel;
		newContent += '		<small>'
		newContent += '			<i onclick="nodeFlyout_Event_PinClick(\'' + node.id + '\')" class="btn btn-sm glyphicon glyphicon-pushpin pull-right"></i>'
		newContent += '			<i onclick="nodeFlyout_Event_HideClick(\'' + node.id + '\')" class="btn btn-sm glyphicon glyphicon-eye-open pull-right"></i>'
		newContent += '		</small>'
		newContent += '	</h3>'
		newContent += '</div>'
		//console.log('node', node)
		node.data.config.nodeFlyout.forEach(function (element) {
			newContent += '<' + element.elementType;
			if (element.onclick)
				newContent += ' onclick="' + element.onclick + '"';
			newContent += '>';
			newContent += element.innerHTML;
			newContent += '</' + element.elementType + '>';
		});

		//console.log('dialogHtml', newContent);
		showFlyout(x, y, newContent);
	}



	function showFlyout(x, y, newContent) {
		var nodeFlyout = document.getElementById('panel.node');
		nodeFlyout.classList.remove('fadein');
		nodeFlyout.classList.add('fadeout');
		setTimeout(function () {
			nodeFlyout.style.left = (x + 50) + 'px'; //(node.data.config.nodeDisplayBody.size + x) + 'px';
			nodeFlyout.style.top = (y - 30) + 'px'; //y + 'px';
			nodeFlyout.innerHTML = newContent;
			nodeFlyout.classList.remove('fadeout');
			nodeFlyout.classList.add('fadein');
		}, 200);

	}
}
