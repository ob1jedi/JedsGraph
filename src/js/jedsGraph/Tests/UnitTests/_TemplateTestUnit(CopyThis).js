// How to use these tests.
// 1. Copy and paste this file, and rename the new file.
// 2. In the new file, change line 6 to the name of your tests.
// 3. In the file "js/jedsGraph/031_run_mainSequence.js" add the new tests to the test unit array.
// 4. Add the new test unit file to the Index.html file.

var [Template_Tests] = function () {
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
	globals.allUnitTests.push(function addDynamicConfig_GivenConfig_ExpectConfig() {
		// Arrange
		//var sut = new MyService();
		
		// Act
		//var result = sut.GetResult();

		// Assert
		//return (result == "affirmative result") ? true : result;
	});

}