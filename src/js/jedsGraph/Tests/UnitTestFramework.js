var UnitTestFramework = function () {

	this.runAllTests = function (testSetArray) {
		testSetArray.forEach(function (test) {
			test.runAllTests();
		});
	}

}