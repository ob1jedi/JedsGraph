var Config_Tests = function () {
	var tests = [];

	// Public...
	this.runAllTests = function () {
		var index = 0;
		tests.forEach(function (test) {
			console.log('-------------------------------------------------------------------');
			console.log('Test ' + (++index) + '/' + tests.length + ', "' + test.name + '"')
			runAndReport(test);
		});
	}

	// Private...
	function runAndReport(test) {
		var result = test();
		if (result !== true) {
			console.log('TEST FAILED. ACTUAL RESULT:', result);
			throw ('TEST FAILED. ACTUAL RESULT: ' + result);
		}
		else
			console.log('TEST PASSED');
	}

	// Private...
	function createConfigHelper() {
		return new ConfigHelper();
	}

	//[Test]
	tests.push(function getNextNewNodeId_Given_Expect1() {
		// Arrange
		var sut = createConfigHelper();
		var node1 = {

		}

		// Act
		var nodeConfig = sut.GetConfigForNode()

		// Assert
		//return (newNodeId === expectedNodeId) ? true : expectedNodeId;
	});


}