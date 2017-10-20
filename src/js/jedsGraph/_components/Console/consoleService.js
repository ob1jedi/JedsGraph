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
		newContent += '<span class="header">'
		newContent += node.data.displayLabel;
		newContent += '</span>'

		newContent += '<span class="pull-right">'
		newContent += '		<span class="winbtn">'
		newContent += '			<i onclick="nodeFlyout_Event_PinClick(\'' + node.id + '\')" class="glyphicon glyphicon-pushpin"></i>'
		newContent += '		</span>'
		newContent += '</span>'

		newContent += '<span class="pull-right">'
		newContent += '		<span class="winbtn">'
		newContent += '			<i onclick="nodeFlyout_Event_HideClick(\'' + node.id + '\')" class="glyphicon glyphicon-eye-close pull-right"></i>'
		newContent += '		</span>'
		newContent += '</span>'

		newContent += '<table>'
		node.data.properties.forEach(function (prop) { 
			newContent += '  <tr>'
			newContent += '    <td>'
			newContent += '      <b>&nbsp' + prop.key + ':&nbsp</b>';
			newContent += '    <td>'
			newContent += '    <td>'
			newContent += prop.value;
			newContent += '    <td>'
			newContent += '  <tr>'
		});
		newContent += '</table>'

		newContent += '<div>'
		//console.log('node', node)
		node.data.config.nodeFlyout.forEach(function (element) {
			newContent += '<' + element.elementType;
			if (element.onclick)
				newContent += ' onclick="' + element.onclick + '"';
			newContent += '>';
			newContent += element.innerHTML;
			newContent += '</' + element.elementType + '>';
		});
		newContent += '</div>'
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
