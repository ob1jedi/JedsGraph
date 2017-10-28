
	//[Test]
	globals.allUnitTests.push(function mergeJson_Given2PropsIn2Objects_Expect2PropsIn1Object() {
		// Arrange
		var sut = new JsonHelper();
    var jsonObject1 = {
      property1: "test 1"
    } 
    var jsonObject2 = {
      property2: "test 2"
    } 

		// Act
    var result= sut.Merge(jsonObject1, jsonObject2);

    // Assert
    console.log('Merged Json object', result);
		return (result.property1 == "test 1" && result.property2 == "test 2") ? true : result;
	});

	//[Test]
	globals.allUnitTests.push(function mergeJson_Given1Propin2Objects_ExpectNewPropValue() {
		// Arrange
		var sut = new JsonHelper();
    var jsonObject1 = {
      property1: "test 1"
    } 
    var jsonObject2 = {
      property1: "test 2"
    } 

		// Act
    var result= sut.Merge(jsonObject1, jsonObject2);

    // Assert
    console.log('Merged Json object', result);
		return (result.property1 == "test 2") ? true : result;
	});