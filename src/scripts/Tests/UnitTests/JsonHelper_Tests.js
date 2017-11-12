
//[Test]
globals.allUnitTests.push(function mergeJson_Given2PropsIn2Objects_Expect2PropsIn1Object() {
  // Arrange
  var sut=new JsonHelper();
  var jsonObject1={
    property1: "test 1"
  }
  var jsonObject2={
    property2: "test 2"
  }

  // Act
  var result=sut.MergeJson(jsonObject1,jsonObject2);

  // Assert
  console.log('Merged Json object',result);
  return (result.property1=="test 1"&&result.property2=="test 2")?true:result;
});

//[Test]
globals.allUnitTests.push(function mergeJson_Given1Propin2Objects_ExpectNewPropValue() {
  // Arrange
  var sut=new JsonHelper();
  var jsonObject1={
    property1: "test 1"
  }
  var jsonObject2={
    property1: "test 2"
  }

  // Act
  var result=sut.MergeJson(jsonObject1,jsonObject2);

  // Assert
  console.log('Merged Json object',result);
  return (result.property1=="test 2")?true:result;
});

//[Test]
globals.allUnitTests.push(function mergeJson_Given2ComplexObjects_Expect1UpdatedObject() {
  // Arrange
  var sut=new JsonHelper();
  var jsonObject1={
    level1String: "level1String",
    level1Object: {
      level2String: "level2String",
      level2Object: {
        level3String: "level3String",
        level3Array: [
          {
            arrayId: "0",
            level4ElementString: "level4ElementString_BaseObjectOnly"
          },
          { 
            arrayId: "1",
            level4ElementString: "level4ElementString" 
          },
          {
            arrayId: "2",
            level4ElementObject: {
              level5ElObjString: "level5ElObjString"
            }
          },
          ["arrayId:1", 1],
          ["arrayId:2", 2],
          ["arrayId:4", {arrayId:1, level6Number:1}, {arrayId:2, level6Number:2}],
        ]
      }
    }
  }

  var jsonObject2={
    level1String: "level1String-Replaced",
    level1Object: {
      level2String: "level2String-Replaced",
      level2Object: {
        level3String: "level3String-Replaced",
        level3Array: [
          {
            arrayId: "3",
            level4ElementString: "level4ElementString_NewObjectOnly"
          },
          { 
            arrayId: "1",
            level4ElementString: "level4ElementString-Replaced" 
          },
          {
            arrayId: "2",
            level4ElementObject: {
              level5ElObjString: "level5ElObjString-Replaced"
            }
          },
          ["arrayId:3", 3],
          ["arrayId:2", 4],
          ["arrayId:4", {arrayId:3, level6Number:3}, {arrayId:2, level6Number:4}],
        ]
      }
    }
  }

  // Act
  var result=sut.MergeJson(jsonObject1,jsonObject2, "arrayId");

  // Assert
  console.log('Merged Json object',result);
    //console.log(1,  result.level1String === 'level1String-Replaced')
    //console.log(2,  result.level1Object.level2String === 'level2String-Replaced')
    //console.log(3,  result.level1Object.level2Object.level3String === 'level3String-Replaced')
    //console.log(4,  result.level1Object.level2Object.level3Array[0].arrayId === "0")
    //console.log(5,  result.level1Object.level2Object.level3Array[1].arrayId === "1")
    //console.log(6,  result.level1Object.level2Object.level3Array[2].arrayId === "2")
    //console.log(7,  result.level1Object.level2Object.level3Array[6].arrayId === "3")
    //console.log(8,  result.level1Object.level2Object.level3Array[0].level4ElementString === 'level4ElementString_BaseObjectOnly')
    //console.log(9,  result.level1Object.level2Object.level3Array[1].level4ElementString === 'level4ElementString-Replaced')
    //console.log(10,  result.level1Object.level2Object.level3Array[2].level4ElementObject.level5ElObjString === 'level5ElObjString-Replaced')
    //console.log(11,  result.level1Object.level2Object.level3Array[6].level4ElementString === 'level4ElementString_NewObjectOnly')
    //console.log(12,  result.level1Object.level2Object.level3Array[3][0] === 'arrayId:1')
    //console.log(13,  result.level1Object.level2Object.level3Array[3][1] === 1)
    //console.log(14,  result.level1Object.level2Object.level3Array[4][0] === 'arrayId:2')
    //console.log(15,  result.level1Object.level2Object.level3Array[4][1] === 2)
    //console.log(16,  result.level1Object.level2Object.level3Array[4][2] === 4)
    //console.log(17,  result.level1Object.level2Object.level3Array[5][0] === 'arrayId:4')
    //console.log(18,  result.level1Object.level2Object.level3Array[5][1].arrayId === 1)
    //console.log(19,  result.level1Object.level2Object.level3Array[5][1].level6Number === 1)
    //console.log(20,  result.level1Object.level2Object.level3Array[5][2].arrayId === 2)
    //console.log(21,  result.level1Object.level2Object.level3Array[5][2].level6Number === 4)
    //console.log(22,  result.level1Object.level2Object.level3Array[5][3].arrayId === 3)
    //console.log(23,  result.level1Object.level2Object.level3Array[5][3].level6Number === 3)
    //console.log(24,  result.level1Object.level2Object.level3Array[7][0] === 'arrayId:3')
    //console.log(25,  result.level1Object.level2Object.level3Array[7][1] === 3)


  return (result.level1String === 'level1String-Replaced'
    && result.level1Object.level2String === 'level2String-Replaced'
    && result.level1Object.level2Object.level3String === 'level3String-Replaced'
    && result.level1Object.level2Object.level3Array[0].arrayId === "0"
    && result.level1Object.level2Object.level3Array[1].arrayId === "1"
    && result.level1Object.level2Object.level3Array[2].arrayId === "2"
    && result.level1Object.level2Object.level3Array[6].arrayId === "3"
    && result.level1Object.level2Object.level3Array[0].level4ElementString === 'level4ElementString_BaseObjectOnly'
    && result.level1Object.level2Object.level3Array[1].level4ElementString === 'level4ElementString-Replaced'
    && result.level1Object.level2Object.level3Array[2].level4ElementObject.level5ElObjString === 'level5ElObjString-Replaced'
    && result.level1Object.level2Object.level3Array[6].level4ElementString === 'level4ElementString_NewObjectOnly'
    && result.level1Object.level2Object.level3Array[3][0] === 'arrayId:1'
    && result.level1Object.level2Object.level3Array[3][1] === 1
    && result.level1Object.level2Object.level3Array[4][0] === 'arrayId:2'
    && result.level1Object.level2Object.level3Array[4][1] === 2
    && result.level1Object.level2Object.level3Array[4][2] === 4
    && result.level1Object.level2Object.level3Array[5][0] === 'arrayId:4'
    && result.level1Object.level2Object.level3Array[5][1].arrayId === 1
    && result.level1Object.level2Object.level3Array[5][1].level6Number === 1
    && result.level1Object.level2Object.level3Array[5][2].arrayId === 2
    && result.level1Object.level2Object.level3Array[5][2].level6Number === 4
    && result.level1Object.level2Object.level3Array[5][3].arrayId === 3
    && result.level1Object.level2Object.level3Array[5][3].level6Number === 3
    && result.level1Object.level2Object.level3Array[7][0] === 'arrayId:3'
    && result.level1Object.level2Object.level3Array[7][1] === 3
    )?true:result;
});


//[Test]
globals.allUnitTests.push(function getJsonValueWithPath_GivenJsonAndPath_ExpectValue() {
  // Arrange
  var sut=new JsonHelper();
  var path = "property1";

  var jsonObject1={
    property1: "test 1"
  }

  // Act
  var result=sut.GetValueWithPath(jsonObject1,path);

  // Assert
  console.log('Merged Json object',result);
  return (result=="test 1")?true:result;
});

//[Test]
globals.allUnitTests.push(function getJsonValueWithPath_GivenJsonAndPath_ExpectValue_Case2() {
  // Arrange
  var sut=new JsonHelper();
  var path = "level1Object/level2Object/level3String";

  var jsonObject1={
    level1String: "level1String",
    level1Object: {
      level2Striing: "level1String",
      level2Object: {
        level3String: "level3String"
      }
    }
  }

  // Act
  var result=sut.GetValueWithPath(jsonObject1,path);

  // Assert
  return (result=="level3String")?true:result;
});

//[Test]
globals.allUnitTests.push(function getJsonValueWithPath_GivenJsonAndFalsePath_ExpectUndefined() {
  // Arrange
  var sut=new JsonHelper();
  var path = "level1Object/falseValue";

  var jsonObject1={
    level1String: "level1String",
    level1Object: {
      level2Striing: "level1String",
      level2Object: {
        level3String: "level3String"
      }
    }
  }

  // Act
  var result=sut.GetValueWithPath(jsonObject1,path);

  // Assert
  return (result==undefined)?true:result;
});

//[Test]
globals.allUnitTests.push(function getJsonValueWithPath_GivenJsonAndFalsePath_ExpectUndefined_Case2() {
  // Arrange
  var sut=new JsonHelper();
  var path = "level1Object/falsePath/impossibleValue";

  var jsonObject1={
    level1String: "level1String",
    level1Object: {
      level2Striing: "level1String",
      level2Object: {
        level3String: "level3String"
      }
    }
  }

  // Act
  var result=sut.GetValueWithPath(jsonObject1,path);

  // Assert
  return (result==undefined)?true:result;
});

//[Test]
globals.allUnitTests.push(function getJsonValueWithPath_GivenJsonWithArray_ExpectValue() {
  // Arrange
  var sut=new JsonHelper();
  var path = "level1Object/level2Array[0]";

  var jsonObject1={
    level1String: "level1String",
    level1Object: {
      level2Striing: "level1String",
      level2Array: [
        "level3ArrayString"
      ]
    }
  }

  // Act
  var result=sut.GetValueWithPath(jsonObject1,path);

  // Assert
  return (result=="level3ArrayString")?true:result;
});