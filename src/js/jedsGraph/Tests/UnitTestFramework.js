var UnitTestFramework = function () {

	//this.runAllTestSets = function (testSetArray) {
	//	testSetArray.forEach(function (test) {
	//		test.runAllUnitTests();
	//	});
	//}

	// Public...
	this.runAllUnitTests = function (tests) {
			localStorage.clear();
			localStorage.removeItem('NEXT_NODE_ID');
			localStorage.removeItem('NEXT_LINK_ID');
			localStorage.removeItem('NEXT_CONFIG_ID');
			//localStorage.removeItem('INDEX_ON_NODE_LABELS');
			console.log('MEMORY', localStorage);
		var index = 0;
		tests.forEach(function (test) {
			console.log('-------------------------------------------------------------------');
			console.log('Test ' + (++index) + '/' + tests.length + ', "' + test.name + '"')
			runAndReport(test);
		});
	}

	function runAndReport(test) {
		var result = test();
		if (result !== true) {
			console.log('TEST FAILED. ACTUAL RESULT:', result);
			throw ('TEST FAILED. ACTUAL RESULT: ' + result);
		}
		else
			console.log('TEST PASSED');
	}
}