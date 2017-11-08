
	//[Test]
	globals.allUnitTests.push(function GraphHelper_GivenNodes_ExpectGlobalTypeDefs() {
		// Arrange
    var sut=new GraphHelper();
    var dataSvc = new DataService();
    var entityLabels = ['TypeDefTest'];
    var entityProperties = {
      Name: "John",
      Age: 30,
      Source: "../custom/assets/binoculars.svg"
    };
    var newNode1 = dataSvc.CreateEntity_AddToGraph_ReturnNode(entityLabels, entityProperties);
    entityLabels = ['TypeDefTest'];
    entityProperties = {
      FirstName: "John",
      Age: "32",
      Img: "../custom/assets/binoculars.svg"
    };
    var newNode2 = dataSvc.CreateEntity_AddToGraph_ReturnNode(entityLabels, entityProperties);

    var globalTypeDefs = globals.entityTypeDefs;
    var typeDefs = [];
    for (var i = 0 ; i < globals.entityTypeDefs.length; i++)
      if (globals.entityTypeDefs[i].labels[0] == entityLabels[0]) 
        typeDefs.push(globals.entityTypeDefs[i]);
    
    console.log('typeDefs', typeDefs);
    if (typeDefs.length !== 1) 
      return result;
    if (typeDefs[0].labels[0] != 'TypeDefTest') 
      return result;
    if (!typeDefs[0].properties["Age"] 
      || !typeDefs[0].properties["Img"] 
      || !typeDefs[0].properties["Source"]
      || !typeDefs[0].properties["Name"]
      || !typeDefs[0].properties["FirstName"]) 
      return result;

    return true;
  });

	