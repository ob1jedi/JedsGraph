
	//[Test]
	globals.allUnitTests.push(function JsonTranslate_GivenComplexObject_ExpectNodeStructure() {
		// Arrange
    var sut=new JsonTranslator();
    var jsonObject1='{'
      +'"level1String": "level1String",'
      +'"level1Object": {'
      +'  "level2String": "level2String",'
      +'  "level2Object": {'
      +'    "level3String": "level3String",'
      +'    "level3Array": ['
      +'      {'
      +'        "arrayId": "0",'
      +'        "level4ElementString": "level4ElementString_BaseObjectOnly"'
      +'      },'
      +'      { '
      +'        "arrayId": "1",'
      +'        "level4ElementString": "level4ElementString" '
      +'      },'
      +'      {'
      +'        "arrayId": "2",'
      +'        "level4ElementObject": {'
      +'          "level5ElObjString": "level5ElObjString"'
      +'        }'
      +'      },'
      +'      ["arrayId:1", 1],'
      +'      ["arrayId:2", 2],'
      +'      ["arrayId:4", {"arrayId":1, "level6Number":1}, {"arrayId":2, "level6Number":2}]'
      +'    ]'
      +'  }'
      +'}'
      +'}'
		
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


	//[Test]
	globals.allUnitTests.push(function ParseTreeTranslator_givenExpression_expectDictionaryOfSubExpressions() {
    // Arrange
    var expression = "a - (b*a) + (z * (s * d)) - p - (o * d)";
    var translator = new ParseTreeTranslator();
    
    // Act
    var result = translator.GetNormalizedDictionaryFromExpression(expression);
    
    // Assert
    if (result['%1'] != "b*a") return result;
    if (result['%2'] != "s * d") return result;
    if (result['%3'] != "o * d") return result;
    if (result['%4'] != "z * %2") return result;
    return true
	});

	//[Test]
	globals.allUnitTests.push(function ParseTreeTranslator_givenExpression_expectNormalizedExpression() {
    // Arrange
    var expression = "a * (b*a) * (z * (s*d)) * p * (o * d)";
    var translator = new ParseTreeTranslator();
    
    // Act
    var result = translator.GetNormalizedExpression(expression);

    // Assert
    if (result != "a * %1 * %4 * p * %3") return result;
    return true
	});

	//[Test]
	globals.allUnitTests.push(function ParseTreeTranslator_givenExpression_expectGraph() {
    // Arrange    
    var expression = "a && (b && c) -> (d -> (e || f)) ^ ~(g || h)";
    var translator = new ParseTreeTranslator();
    
    // Act
    var result = translator.Translate(expression);

    // Assert
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

//[Test]
globals.allUnitTests.push(function CreateGraphElementsFromJsonOffExistingNode_GivenJson_ExpectGraphElements() {
	// Arrange
	var sut = new JsonTranslator(); 
  var node = new DataService().CreateEntity_AddToGraph_ReturnNode(["ParentRootNode"]);

	var inputJSON = {
		Parent: {
			Name: "John",
			Child: [
				{
					Name: "Scott",
					Age: 10,
          Pic: "bin/assets/Persons/Monroe.png",
          link: "http://localhost:9090/scripts/Tests/TestAssets/TestJson.json"
				},
				{
					Name: "Jane",
          Avatar: "bin/assets/Persons/elvis.png"
				}]
		}
	};

  
	// Act
	var result = sut.TranslateToGraph_ReturnGraphElements(node, JSON.stringify(inputJSON), globals.currentTheme.sourceConfig);

	// Assert
	return (result.length == 4
		&& result[0].fromNode.data.labels[0] == "ParentRootNode") ? true : result;
});
