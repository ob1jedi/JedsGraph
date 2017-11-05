﻿
	//[Test]
	globals.allUnitTests.push(function JsonTranslate_GivenComplexObject_ExpectNodeStructure() {
		// Arrange
    var sut=new JsonTranslator();
    var jsonObject1=`{
      "level1String": "level1String",
      "level1Object": {
        "level2String": "level2String",
        "level2Object": {
          "level3String": "level3String",
          "level3Array": [
            {
              "arrayId": "0",
              "level4ElementString": "level4ElementString_BaseObjectOnly"
            },
            { 
              "arrayId": "1",
              "level4ElementString": "level4ElementString" 
            },
            {
              "arrayId": "2",
              "level4ElementObject": {
                "level5ElObjString": "level5ElObjString"
              }
            },
            ["arrayId:1", 1],
            ["arrayId:2", 2],
            ["arrayId:4", {"arrayId":1, "level6Number":1}, {"arrayId":2, "level6Number":2}]
          ]
        }
      }
    }`
		
    // Act
		var result = sut.Translate(jsonObject1);
		
    // Assert
    console.log('Testing: level1Object')
    var result = getNodesByMatchingLabels(globals.nodeList, ['level1Object']);
    if (result.length == 0) return result;
    
    console.log('Testing: level2Object')
    var result = getNodesByMatchingLabels(globals.nodeList, ['level2Object']);
    if (result.length == 0) return result;

    console.log('Testing: level3Array')
    var result = getNodesByMatchingLabels(globals.nodeList, ['level3Array']);
    if (result.length == 0) return result;

    console.log('Testing: level4ElementObject')
    var result = getNodesByMatchingLabels(globals.nodeList, ['level4ElementObject']);
    if (result.length == 0) return result;

		//return (result == "affirmative result") ? true : result;
    return true
	});

	//[Test]
	globals.allUnitTests.push(function JsonTranslate_GivenStringOnlyObject_ExpectNode() {
		// Arrange
    var sut=new JsonTranslator();
    var jsonObject1='"TestJsonNode"';
		
    // Act
		var result = sut.Translate(jsonObject1);
		
    // Assert
    console.log('Testing: "TestJsonNode"')
    var result = getNodesByMatchingLabels(globals.nodeList, ['"TestJsonNode"']);
    if (result.length == 0) return result;

    return true
	});

	////[Test]
	//globals.allUnitTests.push(function JsonTranslate_GivenArrayWithObjects_ExpectRootNodes() {
	//	// Arrange
  //  var sut=new JsonTranslator();
  //  var jsonObject1='["TestRootNode"]';
		
    
  //  // Act
	//	var result = sut.Translate(jsonObject1, "BaseNode");
		
  //  // Assert
  //  console.log('Testing: BaseNode')
  //  var result = getNodesByMatchingLabels(globals.nodeList, ['BaseNode']);
  //  if (result.length == 0) return result;

  //  //console.log('Testing: TestJsonNode')
  //  //var result = getNodesByMatchingLabels(globals.nodeList, ['stringOnlyNode']);
  //  //if (!result) return result;

  //  console.log('Testing: TestRootNode')
  //  var result = getNodesByMatchingLabels(globals.nodeList, ['TestRootNode']);
  //  if (result.length == 0) return result;

  //  return true
	//});


	//[Test]
	globals.allUnitTests.push(function UrlParamsTranslator_Given1Graph_Expect2Nodes() {
		// Arrange
    var sut=new UrlParamsTranslator();
    var expression ='param1--param2';

    // Act
		var result = sut.Translate(expression);
		
    // Assert
    console.log('Testing: param1')
    var result = getNodesByMatchingLabels(globals.nodeList, ['param1']);
    if (result.length == 0) return result;
    console.log('Testing: param2')
    var result = getNodesByMatchingLabels(globals.nodeList, ['param2']);
    if (result.length == 0) return result;

    return true
	});

	//[Test]
	globals.allUnitTests.push(function UrlParamsTranslator_Given2Graphs_Expect3Nodes() {
		// Arrange
    var sut=new UrlParamsTranslator();
    var expression ='p1--p2.p2--p3';

    // Act
		var result = sut.Translate(expression);
		
    // Assert
    console.log('Testing: p1')
    var result = getNodesByMatchingLabels(globals.nodeList, ['p1']);
    if (result.length == 0) return result;
    console.log('Testing: p2')
    var result = getNodesByMatchingLabels(globals.nodeList, ['p2']);
    if (result.length == 0) return result;
    console.log('Testing: p3');
    var result = getNodesByMatchingLabels(globals.nodeList, ['p3']);
    if (result.length == 0) return result;

    return true
	});
