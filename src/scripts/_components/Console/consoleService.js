var ConsoleService = function () {

	this.HideNodeFlyout = function () {
    consoleApp.nodeFlyout.hideFlyout();
	}

	this.ShowFlyout = function (node, x, y) {
    consoleApp.nodeFlyout.showFlyout(node, x, y);
	}

}
