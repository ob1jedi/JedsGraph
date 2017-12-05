function JsonHelper() {

  this.Contains=function(subsetJson,supersetJson, caseSensitive) {
    if(!ofSameType(subsetJson,supersetJson))
      return false;

    if (isObject(subsetJson))
        for(var key in subsetJson)
          return this.Contains(subsetJson[key],supersetJson[key])
    else if (isArray(subsetJson))
        for(var i=0;i<subsetJson.length;i++)
          return this.Contains(subsetJson[i],supersetJson[i])
    else if (typeof subsetJson === "string")
      if (caseSensitive)
        return subsetJson === supersetJson;
      else
        return subsetJson.toLowerCase() === supersetJson.toLowerCase()
    else
      return subsetJson === supersetJson;
  }

  this.GetValueWithPath =function(json, path){
    var elements = path.split('/');
    var configElement = json;
    for (var i=0; i < elements.length; i++){
      if (configElement === undefined)
       return undefined;

      var subels = elements[i].split('[');
      if (subels.length > 1){ 
        configElement = configElement[subels[0]][Number(subels[1].replace(']',''))];
      }
      else
        configElement = configElement[subels[0]];
    }
    return configElement;
  }


  this.MergeJson=function(baseJson,newJson,idFieldName) {
    if (!newJson || !baseJson) 
      throw "JSONMERGE ERROR: Invalid Json input";
    return mergeJson(baseJson,newJson,idFieldName);
  }

  function mergeJson(baseJson,newJson,idFieldName){
    if(!ofSameType(baseJson,newJson)){
      return clone(newJson);
    }
    if(isArray(baseJson))
      baseJson=mergeArrays(baseJson,newJson,idFieldName);
    else if(isObject(baseJson)){
      baseJson=mergeObjects(baseJson,newJson,idFieldName);
      }
    else{
      baseJson=newJson;
    }
    return baseJson;
  }

  mergeObjects=function(baseObject,newObject,idFieldName) {
    var returnObject = {};
    for(var key in baseObject) {
      returnObject[key]= clone(baseObject[key]);
    }
    for(var key in newObject) {
      if(baseObject[key] === undefined){
        returnObject[key]=clone(newObject[key])
      }
      else
        returnObject[key]=mergeJson(baseObject[key],newObject[key],idFieldName)
    }
    return returnObject;
  }

  mergeArrays=function(baseArray,newArray,idFieldName) {
    if(!idFieldName)
      throw "JSONMERGE ERROR: No discriminator specified";
    var returnArray = [];
    baseArray.map(function(e){returnArray.push(e)});
    for(var n=0;n<newArray.length;n++) {
      var matchFound=false;
      for(var b=0;b<baseArray.length;b++) {
        if(areEquivalent(baseArray[b],newArray[n],idFieldName)) {
          matchFound=true;
          if(isObject(baseArray[b])){
            returnArray[b] = mergeObjects(baseArray[b],newArray[n],idFieldName);
          }
          else if(isArray(baseArray[b])){
            returnArray[b] = mergeArrays(baseArray[b],newArray[n],idFieldName);
          }
          break;
        }
      }
      if(!matchFound)
        returnArray.push(clone(newArray[n]));
    }
    return returnArray;
  }

  function clone(input){
    return JSON.parse(JSON.stringify(input));
  }


  function areEquivalent(input1,input2,idFieldName) {
    if(!ofSameType(input1,input2))
      return false;
    if(isObject(input1))
      return (input1[idFieldName]===input2[idFieldName]&&input1[idFieldName])
    if(isPrimitive(input1))
      return input1===input2
    if(isArray(input1)) {
      for(var i=0;i<input1.length;i++)
        for(var x=0;x<input2.length;x++)
          if(   isString(input1[i])
             && input1[i] === input2[x]
             && input1[i].substr(0,(idFieldName+":").length) == (idFieldName+":")
            ){
            return true;
          }
      return false;
    }
    throw "JSONMERGE ERROR: unable to compare"
  }
  function isString(input) {
    return typeof input==="string";
  }
  function isArray(input) {
    return (typeof input==="array" || Array.isArray(input)) && input
  }
  function isObject(input) {
    return typeof input==="object" && !Array.isArray(input) && input;
  }
  function isPrimitive(input) {
    return !isObject(input)&&!isArray(input);
  }
  function ofSameType(element1,element2) {
    return typeof element1===typeof element2 && Array.isArray(element1) === Array.isArray(element2);
  }
}
//==========Globals ==================================================================================================================================================================			
var mappings = new Mappings();

function Mappings(){
  
  this.Translators = [];
  this.Arrangers = [];
}
String.prototype.gxTrimQuotes = function(){
    var str = this;
    str = str.replace(/^"+|"+$/g, '');
    str = str.replace(/^'+|'+$/g, '');
  return str;
}

String.prototype.gxTrimBrackets = function(){
    var str = this;
    str = str.replace(/^\(+|\)+$/g, '');
    str = str.replace(/^<+|>+$/g, '');
    str = str.replace(/^\[+|\]+$/g, '');
    str = str.replace(/^\{+|\}+$/g, '');
  return str;
}
//String.prototype.trim = function () {
//    return this.replace(/^\s+|\s+$/g, "");
//};

function StringHelper(){

  this.ReplaceEachOfCharSet= function(inputString, replaceChars, withChars){
    return replaceEachOfCharSet(inputString, replaceChars, withChars);
  }

  function replaceEachOfCharSet(inputString, replaceChars, withChars){
      if (replaceChars.length !== replaceChars.length)
      throw 'the replacing character-set must be same length as the replaced character set';
    var newString = '';
    for (var i = 0; i < inputString.length; i++){
      newString += inputString[i];
      for (var x = 0; x < replaceChars.length; x++){
        if (inputString[i] === replaceChars[x]){
          newString = newString.slice(0,i) + withChars[x];
        }
      }
    }
    return newString;
  }

  this.ParamEncodeString = function(string){
    return replaceEachOfCharSet(btoa(string), '+/=','._-');
  }

  this.ParamDecodeString = function(encodedString){
    encodedString = replaceEachOfCharSet(encodedString, '._-','+/=');
    return atob(encodedString);
  }

  this.RegexGetCaptured = function( string, regex, index) {
  index || (index = 0); // default to the first capturing group
  var matches = [];
  var match;
  while (match = regex.exec(string)) {
    matches.push(match[index]);
  }
  return matches;
}

  this.SplitOr = function(inputString, searchStrings)
  {
    var results = [];
    searchStrings.forEach(function(str){ 
      var res = inputString.split(str);
      if (res.length > 1);
        results = results.concat(res.slice(1));
    });
    if (results.length ==0)
      return [inputString];
    return results;
  }

  this.ReplaceAll = function(inputString, replaceStr, withStr){
    var strI = inputString.indexOf(replaceStr);
    while (strI > -1){
      inputString = inputString.substr(0, strI) + withStr + inputString.slice(strI + replaceStr.length);
      strI = inputString.indexOf(replaceStr, strI + withStr.length);
    }
    return inputString;
  }

  this.IsImage = function(value){
    if (getType(value) != "string")// || value.slice(4) != "http")
      return false;
    var ext = value.slice(-4);
    return (ext == ".jpg" 
      || ext == ".png" 
      || ext == ".gif" 
      || ext == ".svg" 
      || ext == ".ico" 
      || value.slice(-5) == ".jpeg");
  }
  //this.CompressString2 = function(s){
  //  var dict = [];

  //  for (var i = 0; i < s.length; i++){
  //    var sub = s.substr(i);
  //    for (var x = sub.length; x > -1; x--){
  //      dict.push(sub.substr(x));
  //    }
  //  }
    
  //  var dic = [];
  //  for (var d =0; d < dict.length; d++){ 
  //    if (s.split(dict[d]).length > 2)
  //    {
  //      dicIndex++;
  //      while (s.indexOf(String.fromCharCode(dicIndex)) > -1){
  //        dicIndex++;
  //      }
  //      var dicChar = String.fromCharCode(dicIndex);
  //      dic.push(dicChar);
  //      s = replaceAll(s, dict[d], dicChar)    
  //    }
  //  }
  
  //}


  // LZW-compress a string
  this.CompressString = function(s) {
      var dict = {};
      var data = (s + "").split("");
      var out = [];
      var currChar;
      var phrase = data[0];
      var code = 256;
      for (var i=1; i<data.length; i++) {
          currChar=data[i];
          if (dict[phrase + currChar] != null) {
              phrase += currChar;
          }
          else {
              out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
              dict[phrase + currChar] = code;
              code++;
              phrase=currChar;
          }
      }
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      for (var i=0; i<out.length; i++) {
          out[i] = String.fromCharCode(out[i]);
      }
      return out.join("");
  }

  // Decompress an LZW-encoded string
  this.DecompressString = function(s) {
      var dict = {};
      var data = (s + "").split("");
      var currChar = data[0];
      var oldPhrase = currChar;
      var out = [currChar];
      var code = 256;
      var phrase;
      for (var i=1; i<data.length; i++) {
          var currCode = data[i].charCodeAt(0);
          if (currCode < 256) {
              phrase = data[i];
          }
          else {
             phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
          }
          out.push(phrase);
          currChar = phrase.charAt(0);
          dict[code] = oldPhrase + currChar;
          code++;
          oldPhrase = phrase;
      }
      return out.join("");
  }

}

var NodeFunctionsFactory = {
	node: {},
	createNew: function (node) {
		this.node = node;
		return this;
	}
};


function ConfigHelper() {
  ///Input: the function to be called when configuration has been loaded

  this.AddDynamicEntityConfigReturnId=function(name,jsonConfig) {
    dataSvc=new DataService();
    var confId=dataSvc.CreateUpdateConfigReturnId(name,jsonConfig);
    jsonConfig.id=confId;
    mergeConfigIntoMasterConfigs(jsonConfig);
    return confId;
  }

  this.AddOrUpdateDynamicEntityConfigReturnId=function(name,jsonConfig) {
    dataSvc=new DataService();
    var confId=dataSvc.CreateUpdateConfigReturnId(name,jsonConfig);
    jsonConfig.id=confId;
    mergeConfigIntoMasterConfigs(jsonConfig);
    return confId;
  }

  function mergeConfigIntoMasterConfigs(jsonConfig) {
    for(var i=0;i<globals.masterEntityConfigs.length;i++) {
      if(globals.masterEntityConfigs[i].configName==jsonConfig.configName) {
        globals.masterEntityConfigs[i]=jsonConfig;
        return;
      }
    }
    globals.masterEntityConfigs.push(jsonConfig);
    consoleApp.tabs.newMatching.masterEntityConfigs.push(jsonConfig);
  }

  //Get config file...
  this.GetConfigForEntityId=function(entityId) {
    var dataSvc=new DataService();
    var entity=dataSvc.GetEntityById(entityId);
    return getConfigForEntity(entity);
  }

  //Get config file...
  this.GetConfigForEntity=function(entity) {
    return getConfigForEntity(entity);
  }

  function getConfigForEntity(entity){
    var theseEntityConfigs=[];
    //entityConfigs.push(globals.masterEntityConfigs[0]);
    globals.masterEntityConfigs.forEach(function(thisConfig) {
      if(isConfigForEntity(entity,thisConfig)) {
        theseEntityConfigs.push(thisConfig);
      }
    });
    var finalConfig={};
    var jsonHelper=new JsonHelper();
    theseEntityConfigs.map(function(cnf) {
      
      //finalConfig = $.extend(true, {}, finalConfig, cnf);
      finalConfig=jsonHelper.MergeJson(finalConfig, cnf,"arrayId");
    });
    return finalConfig;
  }

  //this.AddToConfigReturnConfig =function(sourceConfig, configValuePath, newValue){

  //  for (var p in o)
  //  {

  //  }

  //  var configElements = configValuePath.split('/');
  //  var inConfig = sourceConfig;
  //  configValuePath.replace()
  //  for (var i = 0, path=configValuePath.split('/'), len=path.length; i < len; i++){
  //    obj = obj[path[i]];
  //  }

  //  inConfig = newValue;
  //  return sourceConfig;
  //}

  function isConfigForEntity(entity,config) {
    if(config.configType!="entity")
      return false;

    var jsonHelper=new JsonHelper();
    if(config.matchEntity!=null) {
      return jsonHelper.Contains(config.matchEntity, entity, false)
    }
    return true;
  }



  //Set default config 
  this.setConfigSettings=function(config) {

    globals.currentTheme.sourceConfig=config;
    globals.currentTheme.backgroundImage=config.displaySettings.backgroundImage;
    globals.currentTheme.loadNodePopouts=config.displaySettings.loadNodePopouts;
    globals.currentTheme.loadRelationPopouts=config.displaySettings.loadRelationPopouts;
    globals.currentTheme.linkThickness=config.displaySettings.linkThickness;
    globals.currentTheme.entityRgbRange=config.displaySettings.entityRgbRange;
    globals.currentTheme.graphBackground=config.displaySettings.graphBackground;
    globals.currentTheme.entityLabelColor=config.displaySettings.entityLabelColor;
    globals.currentTheme.entityCircleTextColor=config.displaySettings.entityCircleTextColor;
    //globals.currentTheme.entityShape = config.displaySettings.entityShape;
    globals.currentTheme.opaque=config.displaySettings.opaque;
    globals.currentTheme.labelSizing=config.displaySettings.labelSizing;
    globals.currentTheme.shadow=config.displaySettings.shadow;
    globals.currentTheme.entityBorderColor=config.displaySettings.entityBorderColor;
    globals.currentTheme.glow=config.displaySettings.glow;
    globals.currentTheme.linkColor=config.displaySettings.linkColor;
    globals.currentTheme.rounded=config.displaySettings.rounded;
    globals.currentTheme.showLabels=config.displaySettings.showLabels;
    globals.currentTheme.showRelationships=config.displaySettings.showRelationships;
    globals.currentTheme.showRelationProperties=config.displaySettings.showRelationProperties;
    globals.currentTheme.haze=config.displaySettings.haze;
    globals.currentTheme.highlightHaze=config.displaySettings.highlightHaze;
    globals.currentTheme.linkMainTextColor=config.displaySettings.linkMainTextColor;
    globals.currentTheme.linkSubTextColor=config.displaySettings.linkSubTextColor;


    //setting up panels...
    //$topBar=document.getElementById('topBar');
    //$topBar.addEventListener('dragenter',handleDragEnter,false);
    //$topBar.addEventListener('dragover',handleDragOver,false);
    //$topBar.addEventListener('dragleave',handleDragLeave,false);
    //$topBar.addEventListener('drop',handleDrop,false);

    //config.viewOptions.panels.forEach(function(panelConfig) {
    //  setupUiPanelAndTopbar(panelConfig)
    //});

    //Set global variable
    globals.config_ext=config;
  }

  this.runStartupProcedures=function() {
    //GET ALL LABELS>>
    globals.masterConfigs.forEach(function(cnf) {

      if(cnf.viewOptions.prefetchLabelSelectors) {
        globals.dataService.GetAllEntityTypes(cnf); //..get all entity names from the DB
      }

      //GET STARTUP NODES>>
      cnf.startupOptions.startupSearch.forEach(function(search,index) {
        globals.dataService.GetEntitiesByDetails(search.nodeLabel,search.properties,cnf)
      });

      //RUN STARTUP QUERIES>>
      cnf.startupOptions.startupQueries.forEach(function(search,index) {
        globals.dataService.QuerySimpleSearch(search.fromEntity,search.whereProperty,search.equalsValue,cnf);
      });
    });

  }

  //function setupUiPanelAndTopbar(panelConfig) {

  //  $elPanel=document.getElementById(panelConfig.name);
  //  if(panelConfig.available) {
  //    addTopBarButton(panelConfig.name,panelConfig.desc,panelConfig.icon)
  //    $parentContainer=document.getElementById(panelConfig.parent);
  //    if($parentContainer&&panelConfig.visible) {
  //      toggleToolPanel(panelConfig.name);
  //    }
  //    $elPanel.setAttribute('draggable',true);
  //    //$elPanel.addEventListener('dragstart',handleDragStart,false);
  //    //$elPanel.addEventListener('dragend',handleDragEnd,false);
  //    globals.toolPanels.push($elPanel);
  //  }
  //  else {
  //    $elPanel.remove();
  //  }
  //}

  //function addTopBarButton(name,description,icon) {
  //  $topBar=document.getElementById('topBar');
  //  var tobarButton='';
  //  tobarButton+='<button id="toolbar.'+name+'" onclick="toggleToolPanel(\''+name+'\')" class="toolPanelIcon mytooltip">';
  //  tobarButton+='  <span class="'+icon+'" aria-hidden="true">';
  //  tobarButton+='  </span>';
  //  tobarButton+='  <div class="mytooltiptext ttright ttcenter">'+description;
  //  tobarButton+='  </div>';
  //  tobarButton+='</button>';
  //  $topBar.innerHTML+=tobarButton;
  //}

  this.getConfig=function(apparentConfig) {
    return apparentConfig?apparentConfig:globals.currentTheme.sourceConfig;
  }



}
var UnitTestFramework = function () {

	//this.runAllTestSets = function (testSetArray) {
	//	testSetArray.forEach(function (test) {
	//		test.runAllUnitTests();
	//	});
	//}

	// Public...
	this.runAllUnitTests = function (tests) {
			//localStorage.clear();
			//localStorage.removeItem('NEXT_NODE_ID');
			//localStorage.removeItem('NEXT_LINK_ID');
			//localStorage.removeItem('NEXT_CONFIG_ID');
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
var DataService = function () {
	var dataDriver = new LocalStorageDataDriver();

  this.DropDatabase = function(){
    dataDriver.ClearStorage();
    window.location.reload();
  }

	this.CreateConfigReturnId = function (configName, jsonConfig) {
		if (dataDriver.ConfigExists(configName))
	        throw "A config by that name already exists";
	    return dataDriver.CreateConfigInDbAndReturnId(configName, jsonConfig);
	}

	this.CreateUpdateConfigReturnId = function (configName, jsonConfig) {
		var existingConfig = this.GetConfigByName(configName);
		if (!existingConfig)
			return dataDriver.CreateConfigInDbAndReturnId(configName, jsonConfig);
		var jsonHelper = new JsonHelper();
    //var finalConf = $.extend(true, {}, existingConfig, jsonConfig);
    var finalConf = jsonHelper.MergeJson(existingConfig, jsonConfig, "arrayId");
		console.log('existingConfig',existingConfig );
    console.log('jsonConfig',jsonConfig );
    console.log('finalConf',finalConf );
    return dataDriver.UpdateConfigInDb(configName, finalConf);
	}

	this.GetAllConfigs = function () {
		var allConfigNames = dataDriver.GetAllConfigNames();
		return allConfigNames.map(function (cnfName) { return dataDriver.GetConfigsByName(cnfName)[0]})
	}

	this.GetConfigByName = function (configName) {
		if (!configName) throw "Config name not provided";
	    var configs = dataDriver.GetConfigsByName(configName);
	    if (configs.length == 0)
	        return null;
	    return configs[0];
	}

	this.FetchEntitiesForNodeId = function (nodeId, _sourceConfig) {
		var graphElements = dataDriver.GetRelatedEntityGraph(stripDomainFromId(nodeId));
		addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, globals.currentTheme.sourceConfig);
	}

	this.CreateEntity_AddToGraph_ReturnNode = function (labels, properties, _sourceConfig) {
		if (!_sourceConfig) { _sourceConfig = globals.currentTheme.sourceConfig;}
	    if (!properties)
	        properties = {};
	    var newEntity = {
		    labels: labels,
		    properties: properties
		};
	    var entityId = dataDriver.CreateEntityInDatabasePopulateAndReturnId(newEntity);
		var entity = dataDriver.GetEntityById(entityId);
		
    var configHelper = new ConfigHelper();
		var entityConfig = configHelper.GetConfigForEntityId(entityId);
    
    updateUiComponents(labels[0], 1, entityConfig);
		var nodes = addEntitiesToGraphAndReturnNodes([entity])[0];
		return nodes;
	}

	this.CreateEntityReturnId = function (labels, properties) {
	    if (!properties)
	        properties = {};
	    var newEntity = {
	        labels: labels,
	        properties: properties
	    };
	    var entityId = dataDriver.CreateEntityInDatabasePopulateAndReturnId(newEntity);
	    return entityId;
	}

	this.DeleteEntity = function (entityID, _sourceConfig) {
		dataDriver.DeleteEntity(entityID);
		//Neo4jDeleteNode(nodeID, _sourceConfig);
	}

	this.CheckMonitoredNodes = function (_sourceConfig) {
		//Neo4jCheckMonitoredNodes(_sourceConfig);
	}

	this.CheckMonitoredLinks = function (_sourceConfig) {
		//Neo4jCheckMonitoredLinks(_sourceConfig);
	}

	this.Qbuilder = function (selectType, _sourceConfig) {
		//Neo4jQbuilder(selectType, _sourceConfig);
	}

	this.Qbuilder_ClearValue = function (selectType) {
		//Neo4jQbuilder_ClearValue(selectType);
	}

	this.QuerySimpleSearch = function (fromEntity, whereProperty, equalsValue, _sourceConfig) {
		//Neo4jQuerySimpleSearch(fromEntity, whereProperty, equalsValue, _sourceConfig);
	}

	this.GetRelationCounts = function (nodeId, callback, _sourceConfig) {
		//Neo4jGetRelationCounts(nodeId, callback, _sourceConfig);
	}

	this.GetEntitiesByType = function (byLabel, sourceConfigPrefix) {
		//Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix);
		var entities = dataDriver.GetEntitiesByType(byLabel);
		return addEntitiesToGraphAndReturnNodes(entities, globals.currentTheme.sourceConfig);
	}

	this.GetEntityById = function(entityId, sourceConfigPrefix) {
	    return dataDriver.GetEntityFromDatabase(entityId);
	}

	this.GetEntitiesByDetails = function (nodeLabel, properties, _sourceConfig) {
		//Neo4jGetEntitiesByDetails(nodeLabel, properties, _sourceConfig);
	}

	this.GetAllEntities = function (_sourceConfig) {
		var labelData = dataDriver.GetAllEntityTypes();
		labelData.forEach(function (labelData) {
			var entities = dataDriver.GetEntitiesByType(labelData);
			addEntitiesToGraphAndReturnNodes(entities, globals.currentTheme.sourceConfig);
		});
		this.GetAllRelations(_sourceConfig);
		//Neo4jGetAllEntities(_sourceConfig);
	}

	this.GetAllRelations = function (_sourceConfig) {
		var labelDatas = dataDriver.GetAllRelationTypesAndRelationIds();

		var graphElements = labelDatas.map(function (labelData) {
			labelData.ids.map(function (id) {
				return dataDriver.GetGraphOfRelation(id)
			});
		});
		addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, globals.currentTheme.sourceConfig);
		//Neo4jGetAllRelations(_sourceConfig);
	}

	this.CreateEntityReturnCallbackWithIds = function (entityName, propList, inputCallback) {
		var newNode = {
			labels: [entityName],
			properties: propList
		};
		var nodeId = dataDriver.CreateEntityInDatabasePopulateAndReturnId(newNode);
		var node = dataDriver.GetEntityFromDatabase(nodeId);
		addEntitiesToGraphAndReturnNodes([node], globals.currentTheme.sourceConfig);
		//inputCallback(nodeId);
		//Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback);
    var configHelper = new ConfigHelper();
		var entityConfig = configHelper.GetConfigForEntityId(nodeId);
		updateUiComponents(entityName, 1, entityConfig);
	}

	this.UpdateEntity = function (nodeID, newProperties, callback) {
		//Neo4jUpdateEntity(nodeID, newProperties, callback);
	}

	this.CreateRelation_AddToGraph_ReturnLink = function (fromEntityId, toEntityId, labels, properties, _sourceConfig, planOnly) {
		//Neo4jCreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly)
		var relId = dataDriver.CreateRelationPopulateAndReturnId(stripDomainFromId(fromEntityId), stripDomainFromId(toEntityId), labels, properties);
		var relation = dataDriver.GetLinkFromDatabase(relId);
		var link = addRelationToGraphReturnLink(relation); 
    applyPopoutEffectToNodesById(fromEntityId, toEntityId);
    return link
	}

	this.DeleteRelationship = function (relationshipID, _sourceConfig) {
		//Neo4jDeleteRelationship(relationshipID, _sourceConfig);
	}

	this.DeleteLabel = function (nodeId, labelName, _sourceConfig) {
		//Neo4jDeleteLabel(nodeId, labelName, _sourceConfig);
	}

	this.AddProperty = function (nodeId, _sourceConfig) {
		//Neo4jAddProperty(nodeId, _sourceConfig);
	}

	this.AddLabel = function (_sourceConfig) {
		//Neo4jAddLabel(_sourceConfig);
	}

	this.GetAllEntityTypes = function (_sourceConfig) {
		//Neo4jGetAllLabels(_sourceConfig);
		var labels = dataDriver.GetAllEntityTypesAndEntityIds(_sourceConfig);
		labels.forEach(function (label) {
			var pseudoEntity = new DataEntity();
			pseudoEntity.labels = [label];

			var configHelper = new ConfigHelper();
			var entityConfig = configHelper.GetConfigForEntity(pseudoEntity);

			updateUiComponents(label.label, label.ids.length, entityConfig);
		});
	}

	function updateUiComponents(label, entityCount, entityConfig)
	{
		var typeSelector = addEntityLabel(label, entityCount, entityConfig);
		refreshEntitySelectors();
    consoleApp.refreshTypeSelectors();
	}

	function stripDomainFromId(nodeId)
	{
		if (nodeId.length > 3)
			if (nodeId.substring(0, 3) == 'LOC')
				return nodeId.substring(3);
		return nodeId;
	}

}



//===============================================================================================

//===============================================================================================


//===============================================================================================


function addNodesToGraphFromGraphElementsAndReturnNodes(graphElements, _sourceConfig) {
	var newNodes = [];
	graphElements.forEach(function (graphElement) {
		var datN = new nodeDataType;
		datN.id = graphElement.fromNode.id;
		datN.labels = graphElement.fromNode.labels;
		datN.properties = new neoPropertyList(graphElement.fromNode.properties);
    datN.propertiesObject = graphElement.fromNode.properties;
		datN.entityConfig = GetConfigForEntityId(datN);
		var fromNode = addDataNode(datN.id, datN, _sourceConfig);
		if (fromNode)
		    newNodes.push(fromNode);

		var datM = new nodeDataType;
		datM.id =graphElement.toNode.id;
		datM.labels = graphElement.toNode.labels;
		datM.properties = new neoPropertyList(graphElement.toNode.properties);
		datM.propertiesObject = graphElement.toNode.properties;
		datM.entityConfig = GetConfigForEntityId(datM);
		var toNode = addDataNode(datM.id, datM, _sourceConfig);
		if (toNode) {
			newNodes.push(toNode);
			applyPopoutEffectToNode(toNode, datN.id)
		}
		//link R...
		var linkdata = new linkDataType(datN.id, datM.id, graphElement.link.id, graphElement.link.labels, _sourceConfig);
		linkdata.properties = new neoPropertyList(graphElement.link.properties);
		linkdata.propertiesObject = graphElement.link.properties;
		var link = addDataLink(datN.id, datM.id, linkdata, _sourceConfig);
	});

	refreshNodesDepths();
	return newNodes;
}

function addRelationToGraphReturnLink(relation, _sourceConfig) {
    var dat = new linkDataType(relation.fromNodeId, relation.toNodeId, relation.id, relation.labels, _sourceConfig);
    if (relation.properties) { dat.properties = new neoPropertyList(relation.properties); }
    if (relation.properties) { dat.propertiesObject = relation.properties }
    var relation = addDataLink(dat.fromNodeID, dat.toNodeID, dat, _sourceConfig);
    return relation;
}

function addEntitiesToGraphAndReturnNodes(entities, _sourceConfig)
{
	var newNodes =[];
	entities.forEach(function (entity) {
		var datM = new nodeDataType;
		datM.id = entity.id;
		datM.labels = entity.labels || [];
		datM.properties = new neoPropertyList(entity.properties);
		datM.propertiesObject = entity.properties;
    datM.entityConfig = GetConfigForEntityId(datM);
		var addedNode = addDataNode(entity.id, datM, _sourceConfig)
		newNodes.push(addedNode);
	});
	
	return newNodes;
}

function GetConfigForEntityId(nodeData)
{
    new EntityEventsHelper().AddEntityToGraph_beforeConfigLoad(nodeData);
    var configHelper = new ConfigHelper();
    return configHelper.GetConfigForEntityId(nodeData.id);
}

function removeNodeFromGraph(nodeId)
{
	removeNodeFromStage(nodeId);
}

var LocalStorageDataDriver = function () {


    //----PUBLIC----------------------------------------------------------

  this.ClearStorage = function(){
    localStorage.clear();
  }


	this.UpdateConfigInDb = function (name, configJson) {
		writeConfigToStorage(name, configJson);
		return configJson.id;
	}
    this.CreateConfigInDbAndReturnId = function (name, configJson) {
    	configJson.id = this.GetNextNewConfigId();
        writeConfigToStorage(name, configJson);
        return configJson.id;
    }

	this.CreateEntityInDatabasePopulateAndReturnId = function (node) {
		node = sanitizeNode(node);
		node.id = this.GetNextNewEntityId();
		writeNodeToStorage(node);
		return node.id;
	}

	this.GetRelatedNodes = function (nodeId) {
		var node = this.GetEntityFromDatabase(nodeId);
		var nodeLinks = node.links;
		var dataDriver = this;
		var relatedNodeIds = [];
		nodeLinks.forEach(function (linkId) {
			var link = dataDriver.GetLinkFromDatabase(linkId);
			if (nodeId == link.fromNodeId)
				relatedNodeIds.push(link.toNodeId);
			else
				relatedNodeIds.push(link.fromNodeId);
		});

		return relatedNodeIds;
	}

	this.GetEntityById = function (entityId){
	    return this.GetEntityFromDatabase(entityId);
	}

	this.GetConfigById = function (configId) {
	    return this.GetConfigFromDatabase(configId);
	}

	this.GetRelatedEntityGraph = function (nodeId) {
		var node = this.GetEntityFromDatabase(nodeId);
		var dataDriver = this;
		return node.links.map(function (linkId) { return dataDriver.GetGraphOfRelation(linkId) });
	}

	this.GetGraphOfRelation = function (linkId) {
		var link = this.GetLinkFromDatabase(linkId);
		var graphElement = new GraphElement();
		graphElement.fromNode = this.GetEntityFromDatabase(link.fromNodeId);
		graphElement.toNode = this.GetEntityFromDatabase(link.toNodeId);
		graphElement.link = link;
		return graphElement;
	}

	this.CreateRelationPopulateAndReturnId = function (fromEntityId, toEntityId, labels, properties) {
	    link = {}; //new Relation(); //sanitizeLink(relation);
		link.id = this.GetNextNewRelationId();
		link.fromNodeId = fromEntityId;
		link.toNodeId = toEntityId;
		link.labels = labels || [];
		link.properties = properties ? properties : {};

		var fromEntity = this.GetEntityFromDatabase(fromEntityId);
		fromEntity.links.push(link.id);
		writeNodeToStorage(fromEntity);

		var toEntity = this.GetEntityFromDatabase(toEntityId);
		toEntity.links.push(link.id);
		writeNodeToStorage(toEntity);

		writeLinkToStorage(link);
		return link.id;
	}

	this.GetConfigFromDatabase = function (configId) {
	    return getConfigFromDatabase(configId);
	}

	this.GetEntityFromDatabase = function (nodeId) {
		return getEntityFromDatabase(nodeId);
	}

	this.GetLinkFromDatabase = function (linkId) {
		return getRelationFromDatabase(linkId);
	}

	this.DeleteEntity = function(nodeId)
	{
		localStorage.removeItem(nodeKeyFromNodeId(nodeId));
	}


	this.EntityExists = function(nodeId)
	{
		var node = readNodeFromStorage(nodeId);
		return node !== null;
	}

	this.GetNextNewConfigId = function () {
		var nextIndex = getNextIndexForCounter('NEXT_CONFIG_ID');
		return nextIndex;
	}

	this.GetNextNewEntityId = function () {
		return getNextIndexForCounter('NEXT_NODE_ID');
	}

	this.GetNextNewRelationId = function () {
		return getNextIndexForCounter('NEXT_LINK_ID');
	}

	function getNextIndexForCounter(CounterName) {
		
		var nextId = localStorage.getItem(CounterName);
		if (nextId === null) {
			localStorage.setItem(CounterName, 1);
			return 1;
		}
		nextId = Number(nextId) + 1;
		localStorage.setItem(CounterName, nextId);
		return nextId;
	}

	this.ConfigExists = function (configName) {
	    var configs = getItemsInIndex('INDEX_ON_CONFIG_NAMES', configName, 'config');
	    return (configs.length > 0);
	}

	this.GetConfigsByName = function (configName) {
	    return getItemsInIndex('INDEX_ON_CONFIG_NAMES', configName, 'config');
	}

	this.GetEntitiesByType = function(labelName){		
		return getItemsInIndex('INDEX_ON_NODE_LABELS', labelName, 'node');
	}

	this.GetEntitiesByPropertyName = function (propertyName) {
		return getItemsInIndex('INDEX_ON_NODE_PROPS', propertyName, 'node');
	}

	this.GetRelationsByLabel = function (labelName) {
		return getItemsInIndex('INDEX_ON_LINK_LABELS', labelName, 'link');
	}

	this.GetRelationsByPropertyName = function (propertyName) {
		return getItemsInIndex('INDEX_ON_LINK_PROPS', propertyName, 'link');
	}

	this.GetAllEntityTypes = function () {
		var nodeIndex = localStorage.getItem('INDEX_ON_NODE_LABELS');
		return getAllLabelsFromIndex(nodeIndex);
	}

	this.GetAllRelationTypes = function () {
		var linkIndex = localStorage.getItem('INDEX_ON_LINK_LABELS');
		return getAllLabelsFromIndex(linkIndex);
	}

	this.GetAllConfigNames = function () {
		var linkIndex = localStorage.getItem('INDEX_ON_CONFIG_NAMES');
		return getAllLabelsFromIndex(linkIndex);
	}

	//this.GetAllRelationTypeInfos = function () {
	//	var linkIndex = localStorage.getItem('INDEX_ON_LINK_LABELS');
	//	return getAllLabelsFromIndex(linkIndex);
	//}

	this.GetAllEntityTypesAndEntityIds = function () {
		return getAllLabelsAndIdsForIndex('INDEX_ON_NODE_LABELS');
	}

	this.GetAllRelationTypesAndRelationIds = function () {
		return getAllLabelsAndIdsForIndex('INDEX_ON_LINK_LABELS');
	}
	//---- PRIVATE ----------------------------------------------------------

	function getConfigFromDatabase(configId) {
	    throwIfInvalidConfigId(configId);
	    var config = readConfigFromStorage(configId);
	    return config;
	}

	function getEntityFromDatabase(nodeId) {
		throwIfInvalidNodeId(nodeId);
		var node = readNodeFromStorage(nodeId);
		return node;
	}

	function getRelationFromDatabase(linkId) {
		throwIfInvalidLinkId(linkId);
		var link = readLinkFromStorage(linkId);
		return link;
	}

	function getItemsInIndex(indexName, elementName, itemType) {
		var dataStringHelper = new DataStringHelper();
		var indexedData = dataStringHelper.getDataString(indexName);
		if (indexedData == "|")
		    return [];
		var itemIdList = dataStringHelper.getDataFromDataString(indexedData, elementName);
		if (itemIdList.length == 0)
		    return [];
		var itemIdArray = itemIdList.split(',');
		if (itemIdArray.length == 0)
		    return [];
		var itemArray = [];
		var dataDriver = this;
		for (var i = 0; i < itemIdArray.length; i++) {
			if (itemType === 'node')
				itemArray.push(getEntityFromDatabase(itemIdArray[i]));
			if (itemType === 'link')
			    itemArray.push(getRelationFromDatabase(itemIdArray[i]));
			if (itemType === 'config')
			    itemArray.push(getConfigFromDatabase(itemIdArray[i]));
		}
		return itemArray;
	}

	function getAllLabelsAndIdsForIndex(indexName) {
		var indexedData = localStorage.getItem(indexName);
		var dataStringHelper = new DataStringHelper();
		var elementArray = dataStringHelper.getAllElements(indexedData);
		var elementInfo = elementArray.map(function (element) {
			return elementToLabelInfo(element);
		});
		return elementInfo;
	}

	function getAllLabelsFromIndex(indexedData) {
		var dataStringHelper = new DataStringHelper();
		var elementArray = dataStringHelper.getAllElements(indexedData);
		var elemenNames = elementArray.map(function (element) { return element.split(':')[0] });
		return elemenNames;
	}

	function elementToLabelInfo(element) {
		var elementParts = element.split(':');
		if (elementParts.length > 1)
			return { label: elementParts[0], ids: elementParts[1].split(',') }
		return { label: elementParts[0], ids: [] }
	}
	
	function writeConfigToStorage(name, config) {
		if (!config.id) throw "Missing config-id in config";
	    localStorage.setItem(configKeyFromConfigId(config.id), serialize(config));
	    updateIndex("INDEX_ON_CONFIG_NAMES", name, config.id);
	}

	function writeNodeToStorage(node) {
		localStorage.setItem(nodeKeyFromNodeId(node.id), serialize(node));
		updateLabelsIndex("INDEX_ON_NODE_LABELS", node);
		updatePropertyIndex("INDEX_ON_NODE_PROPS", node);
	}

	function writeLinkToStorage(link) {
		localStorage.setItem(linkKeyFromNodeId(link.id), serialize(link));
		updateLabelsIndex("INDEX_ON_LINK_LABELS", link);
		updatePropertyIndex("INDEX_ON_LINK_PROPS", link);
	}

	function updateLabelsIndex(indexName, item) {
		item.labels.forEach(function (label) {
			updateIndex(indexName, label, item.id);
		});
	}

	function updatePropertyIndex(indexName, item) {
		for (var propertyKey in item.properties) {
			updateIndex(indexName, propertyKey, item.id);
		}
	}

	function updateIndex(indexName, elementName, data) {
		var index = localStorage.getItem(indexName);
		var dataStringHelper = new DataStringHelper();
		if (index === null)
			index = dataStringHelper.getNewDataString();
		index = dataStringHelper.ensureDataIntoElement(index, elementName, data)
		localStorage.setItem(indexName, index);
	}

	function sanitizeNode(node) {
		if (node === undefined)
			node = {};
		node.labels = sanitizeLabels(node.labels);
		node.links = sanitizeNodeLinks(node.links);
		node.properties = sanitizeProperties(node.properties);
		return node;
	}

	function sanitizeLink(link) {
		if (link === undefined)
			link = {};
		link.labels = sanitizeLabels(link.labels);
		link.properties = sanitizeProperties(link.properties);
		return link;
	}

	function sanitizeNodeLinks(links) {
		if (links === undefined)
			links = [];
		return links;
	}

	function sanitizeLabels(labels) {
		if (labels === undefined)
			labels = [];
		return labels;
	}

	function sanitizeProperties(properties) {
		if (properties === undefined)
			properties = [];
		return properties;
	}

	function readConfigFromStorage(configId) {
	    return deserialize(localStorage.getItem(configKeyFromConfigId(configId)));
	}

	function readNodeFromStorage(nodeId) {
		return deserialize(localStorage.getItem(nodeKeyFromNodeId(nodeId)));
	}

	function readLinkFromStorage(linkId) {
		return deserialize(localStorage.getItem(linkKeyFromNodeId(linkId)));
	}


	function throwIfInvalidConfigId(configId) {
	    if (configId === undefined || configId === null || configId === 0)
	        throw "Invalid config id";
	}

	function throwIfInvalidNodeId(nodeId) {
		if (nodeId === undefined || nodeId === null || nodeId === 0)
			throw "Invalid node id";
	}

	function throwIfInvalidLinkId(linkId) {
		if (linkId === undefined || linkId === null || linkId === 0)
			throw "Invalid link id";
	}

	function configKeyFromConfigId(configId) {
	    return 'C_' + configId;
	}

	function nodeKeyFromNodeId(nodeId) {
		return 'N_' + nodeId;
	}

	function linkKeyFromNodeId(linkId) {
		return 'L_' + linkId;
	}

	function serialize(object) {
		return JSON.stringify(object);
	}

	function deserialize(object) {
		return JSON.parse(object);
	}



}

//================= DATA STRING HELPER =====================================================================================================================
var DataStringHelper = function () {

	this.getNewDataString = function () {
		return '|';
	}


	// ===== PUBLIC ===== //
	this.indexOfElementInDataString = function (string, targetWord) {
		validateInputString(string);
		if (string == "|") {
			// ...There are no more words to the left.
			// Return 1 to say that the insertion index is the current separator + 1, and 0.1 is a flag to say the the item was not found.
			return 1.1;
		}
		// Get the mid-index of the data string
		var stringCenterIndex = getCenterIndex(string);
		// Get elements pre-separator-index...
		var centerWordStartSeparatorIndex = getFirstLeftSeparatorIndexFromIndex(string, stringCenterIndex, ['|'])
		// Get elements data-separator-index... (eg the colon that separates the label from the data)
		var centerWordEndSeparatorIndex = getNextSeparatorIndex(string, centerWordStartSeparatorIndex + 1, [':', '|'])
		// Get elements post-separator-index...
		var centerElementEndSeparatorIndex = getNextSeparatorIndex(string, centerWordStartSeparatorIndex + 1, ['|'])
		// Get the word from the data string...
		var wordFromArray = string.slice(centerWordStartSeparatorIndex + 1, centerWordEndSeparatorIndex);
		
		// Get the elements word-index...
		var leftWordIndex = centerWordStartSeparatorIndex + 1;

		for (var charIndex = 0; charIndex < Math.min(targetWord.length, wordFromArray.length) ; charIndex++) {

			if (character1IsBeforeCharacter2(targetWord[charIndex], wordFromArray[charIndex]))
				return searchLeftHalfOfDataBlockReturnIndex(string, centerWordStartSeparatorIndex, targetWord, this);

			if (character1IsAfterCharacter2(targetWord[charIndex], wordFromArray[charIndex]))
				return searchRightHalfOfDataBlockReturnIndex(string, centerElementEndSeparatorIndex, targetWord, this);
		}
		// ...All characters match.

		if (wordsAreIdentical(targetWord, wordFromArray))
			// ...Found word, return success...
			return centerWordStartSeparatorIndex + 1;

		if (wordIsLonger(targetWord, wordFromArray))
			// ...Word is longer, go right...
			return searchRightHalfOfDataBlockReturnIndex(string, centerElementEndSeparatorIndex, targetWord, this);
		//return centerElementEndSeparatorIndex + indexInRightHalf;

		if (wordIsShorter(targetWord, wordFromArray))
			// ...Word is shorter, go left...
			return searchLeftHalfOfDataBlockReturnIndex(string, centerWordStartSeparatorIndex, targetWord, this);

	}

	this.getWordAtIndex = function (inputString, index) {
		return inputString.slice(index, getNextSeparatorIndex(inputString, index, ['|']));
	}

	this.insertElementIntoDataString = function (dataString, newElement) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, newElement);
		
		if (!elementExists(dataElementIndex)) {
			// Element doesnt exist yet.
			// Get Data String
			var insertionIndex = Math.floor(dataElementIndex);
			var newDataString = dataString.slice(0, insertionIndex) + newElement + '|' + dataString.slice(insertionIndex);
			
			return newDataString;
		}

	}

	this.numberBinarySearch = function (set, criteria) {
		if (set.length === 0) {
			return 0;
		}
		var checkAtIndex = Math.floor(set.length / 2);
		if (set[checkAtIndex] === criteria)
			return checkAtIndex;
		else if (criteria > set[checkAtIndex]) {
			return checkAtIndex + 1 + this.numberBinarySearch(set.slice(checkAtIndex + 1), criteria); // back half of the array
		} else {
			return this.numberBinarySearch(set.slice(0, checkAtIndex - 1), criteria); // front half of the array
		}
	}

	this.deleteElementFromDataString = function (dataString, element) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, element);
		
		if (elementExists(dataElementIndex)) {
			// Element exists.
			var startIndex = Math.floor(dataElementIndex);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var dataString = dataString.slice(0, startIndex - 1) + dataString.slice(endIndex);
		}
		return dataString;
	}

	this.getDataString = function(dataStringName) {
		var dataString = localStorage.getItem(dataStringName);
		if (!dataString || dataString == null)
			dataString = '|';
		return dataString;
	}

	this.getDataFromDataString = function (dataString, elementName) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var element = getElementFromDataString(dataString, dataElementIndex);
			var partitions = element.split(':');
			return (partitions.length > 1) ? partitions[1] : undefined;
		}
		return "";
	}

	this.replaceDataInElement = function (dataString, elementName, newData) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var startIndex = getNextSeparatorIndex(dataString, dataElementIndex, [':', '|']);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var dataString = dataString.slice(0, startIndex) + ":" + newData + dataString.slice(endIndex);
		}
		else {
			dataString = this.insertElementIntoDataString(dataString, elementName + ":" + newData);
		}
		return dataString;
	}

	this.ensureDataIntoElement = function (dataString, elementName, newData) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var startIndex = getNextSeparatorIndex(dataString, dataElementIndex, [':', '|']);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var elementData = dataString.slice(startIndex + 1, endIndex);
			var newDataString = ensureDataIntoString(elementData, newData);
			var dataString = dataString.slice(0, startIndex) + ":" + newDataString + dataString.slice(endIndex);
		}
		else {
			var fullElement = elementName;
			if (newData != undefined)
				fullElement = fullElement + ":" + newData;
			dataString = this.insertElementIntoDataString(dataString, fullElement);
		}
		return dataString;
	}

	this.ensureDataNotInElement = function (dataString, elementName, excludeData) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var startIndex = getNextSeparatorIndex(dataString, dataElementIndex, [':', '|']);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var elementData = dataString.slice(startIndex + 1, endIndex);
			var newDataString = removeDataFromString(elementData, excludeData);
			var dataString = dataString.slice(0, startIndex) + ":" + newDataString + dataString.slice(endIndex);
		}
		return dataString;
	}

	this.clearElementData = function (dataString, elementName, newData) {
		var dataElementIndex = this.indexOfElementInDataString(dataString, elementName);
		if (elementExists(dataElementIndex)) {
			var startIndex = getNextSeparatorIndex(dataString, dataElementIndex, [':', '|']);
			var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
			var dataString = dataString.slice(0, startIndex) + dataString.slice(endIndex);
		}
		return dataString;
	}

	this.getAllElements = function (dataString) {
		if (!dataString || dataString == null)
			return [];
		var elementArray = dataString.split('|');
		return elementArray.splice(1, elementArray.length - 2);
	}

	// ===== PRIVATE ===== //
	function removeDataFromString(dataString, excludeData) {
		var dataArray = dataString.split(',');
		var index = dataArray.indexOf(excludeData.toString());
		if (index == -1)
			return dataString;
		dataArray = dataArray.splice(index - 1, 1);
		return dataArray.join();
	}

	function ensureDataIntoString(dataString, newData) {
		var dataArray = dataString.split(',');
		if (dataExistsInArray(dataArray, newData.toString()))
			return dataString;
		// TODO: add sorting to this.
		dataArray.push(newData);
		return dataArray.join();
	}
	function dataExistsInArray(someArray, someElement) {
		return someArray.indexOf(someElement) > -1;
	}
	function elementExists(flaggedDataElementIndex) {
		return !hasNewFlag(flaggedDataElementIndex);
	}

	function getElementFromDataString(dataString, startIndex) {
		var endIndex = getNextSeparatorIndex(dataString, startIndex, ['|']);
		return dataString.slice(startIndex, endIndex);
	}
	function hasNewFlag(dataElementIndex) {
		return (dataElementIndex % 1) > 0;
	}

	function handleEmptyString(string, nameOfDataString) {

	}

	function validateInputString(string) {
		
		// Validate input data string...
		if (!string
			|| string === null
			|| string[0] !== '|'
			|| string[string.length - 1] !== '|'
			|| string.length === 0
			|| string == '||'){
			  throw "Invalid data-string";
      }
	}
	function character1IsBeforeCharacter2(character1, character2) {
		return character1.charCodeAt(0) < character2.charCodeAt(0);
	}
	function character1IsAfterCharacter2(character1, character2) {
		return character1.charCodeAt(0) > character2.charCodeAt(0);
	}
	function wordIsShorter(targetWord, wordFromArray) {
		return targetWord.length < wordFromArray.length;
	}
	function wordIsLonger(targetWord, wordFromArray) {
		return targetWord.length > wordFromArray.length;
	}
	function wordsAreIdentical(word1, word2) {
		return word1 === word2;
	}
	function searchRightHalfOfDataBlockReturnIndex(string, fromIndex, targetWord, dataDriver) {
		return fromIndex + dataDriver.indexOfElementInDataString(getRightHalfOfString(string, fromIndex), targetWord);
	}
	function searchLeftHalfOfDataBlockReturnIndex(string, fromIndex, targetWord, dataDriver) {
		return dataDriver.indexOfElementInDataString(getLeftHalfOfString(string, fromIndex), targetWord);
	}
	function getRightHalfOfString(string, fromIndex) {
		return string.slice(fromIndex);
	}
	function getLeftHalfOfString(string, fromIndex) {
		return string.slice(0, fromIndex + 1);
	}
	function charactersMatch(char1, char2) {
		return char1 === char2;
	}
	function getFirstLeftSeparatorIndexFromIndex(string, startFromIndex, separatorArray) {
		var checkAtIndex = startFromIndex;
		var overflow = 0;
		while (!arrayContains(separatorArray, string[checkAtIndex]) && checkAtIndex >= -1) {
			if (++overflow > 100000)
				throw "Overflow";
			checkAtIndex--;
		}
		if (checkAtIndex === -1)
			throw "Missing separator in index";
		return checkAtIndex;
	}
	function getNextSeparatorIndex(string, startFromIndex, separatorArray) {
		var checkAtIndex = startFromIndex;
		var overflow = 0;
		while (!arrayContains(separatorArray, string[checkAtIndex]) && checkAtIndex < string.length) {
			if (++overflow > 100000)
				throw "Overflow";
			checkAtIndex++;
		}
		if (checkAtIndex >= string.length)
			throw 'Missing separator in index in string: "' + string + '", starting from index: ' + startFromIndex;
		return checkAtIndex;
	}
	function getCenterIndex(string) {
		return Math.floor(string.length / 2);
	}
	function arrayContains(array, element) {
		for (var i = 0; i < array.length; i++)
			if (array[i] === element)
				return true;
		return false
	}

	
}
//======================================================================================================================================

function SimpleArranger(orientation){
  var _orientation = orientation||"top-to-bottom";
  var _totalRows = -1;
  var _totalCols = -1;
  var _matrix = {};

  this.Arrange = function(){
    var rootNodes = getRootNodes();
    var nodeGrid = {};
    nodeGrid = createAndInitializeNodeGridDictionary(rootNodes);
    nodeGrid = populateNodeGridDictionary(nodeGrid, rootNodes);
    
    var circularDependants = findAnyLeftOutCircularDependants(nodeGrid);
    while( circularDependants.length > 0){
      nodeGrid = populateNodeGridDictionary(nodeGrid, [circularDependants[0]]);
      circularDependants = findAnyLeftOutCircularDependants(nodeGrid);
    }

    drawNodes(nodeGrid, _orientation);
  }

  function getRootNodes(){
    var rootNodes = [];
    globals.nodeList.forEach(function(n) {
      if (n.data.fromNodes.length == 0) rootNodes.push(n)
    });
    return rootNodes;
  }

  function createAndInitializeNodeGridDictionary(rootNodes){
    var gridDict = {};  
    // Initialize dictionery for all nodes...
    globals.nodeList.forEach(function(node) {
      //gridDict[node.id] = {row: ++rowIndex, col:0}
      gridDict[node.id] = {row: -1, col:-1}
    }); 
    return gridDict;
  }
  function populateNodeGridDictionary(gridDict, rootNodes){
   
    // Iterate through root nodes...
    rootNodes.forEach( function(fromNode) {     
      var nodeRegister = {};
      // Set cell of root node to the currently highest row index...
      gridDict[fromNode.id] = {row: ++_totalRows, col:0}
      var minRow = _totalRows;
      // Recursively get grid layout of nodes...  
      setColOfNodes(fromNode, gridDict, _matrix, nodeRegister)
      var rowHeight = _totalRows - minRow;
      gridDict[fromNode.id].row = minRow + rowHeight/2;
    });
    return gridDict;
  }

  function setColOfNodes(fromNode, gridDict, matrix, nodeRegister){
    var minRow = _totalRows;
    fromNode.data.toNodes.forEach( function(toNode){   
      if (nodeRegister[toNode.id]) // ... Node has already been registered in this tree, do not process it again (occurs in circular dependency trees).
        return;
      nodeRegister[toNode.id] = 1;// ... Register node for this tree.
      var col = Math.max(gridDict[fromNode.id].col + 1, gridDict[toNode.id].col);
      _totalCols = Math.max(col, _totalCols);
      //var row = _totalRows;//gridDict[fN.id].row;
      gridDict[toNode.id].col = col;
      //while (matrix[_totalRows + ',' + col] == 1){
      while (rowHasNodes(_totalRows,col, matrix)){
        _totalRows++;
      }
      matrix[_totalRows+','+col] = 1;
      gridDict[toNode.id].row = _totalRows;
      setColOfNodes(toNode, gridDict, matrix, nodeRegister);
    });
    var rowHeight = _totalRows - minRow;
    gridDict[fromNode.id].row = minRow + rowHeight/2;
  }

  function rowHasNodes(row, fromCol, matrix){
    for (var c = fromCol; c < _totalCols + 1; c++)
      if (matrix[row + ',' + c] == 1)
        return true
    return false;
  }

  function findAnyLeftOutCircularDependants(gridDict){
    // Draw Nodes...
    
    var circularDependants = [];
    globals.nodeList.forEach(function(n) {
      if (gridDict[n.id].col == -1 && gridDict[n.id].row == -1){
          circularDependants.push(n);
      }
    });
    return circularDependants;
  }

  function drawNodes(gridDict, orientation){
    // Draw Nodes...
    var graphDistanceFactor = 100;
    var centerOffset = _totalCols/2 * graphDistanceFactor
    globals.nodeList.forEach(function(n) {
      globals.layout.pinNode(n, true);
      switch (orientation || "top-to-bottom")
      {
        case "left-to-right":
          setNodePosition_Animated(n, gridDict[n.id].col * graphDistanceFactor, gridDict[n.id].row * graphDistanceFactor);
          break;
        case "right-to-left":
          setNodePosition_Animated(n, -gridDict[n.id].col * graphDistanceFactor, gridDict[n.id].row * graphDistanceFactor);
          break;
        case "top-to-bottom":
          setNodePosition_Animated(n, gridDict[n.id].row * graphDistanceFactor, gridDict[n.id].col * graphDistanceFactor);
          break;
        case "bottom-to-top":
          setNodePosition_Animated(n, gridDict[n.id].row * graphDistanceFactor, -gridDict[n.id].col * graphDistanceFactor + centerOffset);
          break;
      }
    });
  }

  function setNodePosition_Animated(node, xPos, yPos){
    globals.layout.setNodePosition(node.id, xPos, yPos);
    //globals.animator.NodePositionAnimation(node, {"x":xPos,"y":yPos});
  }

}

mappings.Arrangers.push({name:"Tree", arranger: new SimpleArranger("bottom-to-top")});
mappings.Arrangers.push({name:"Roots", arranger: new SimpleArranger("top-to-bottom")});
mappings.Arrangers.push({name:"List", arranger: new SimpleArranger("left-to-right")});


var SimpleTranslator = function () {
  var _references = [];
  var _hiddenNodes = [];
  var _interpolationDictionary = [];
  var _interpolationCounter = 0;

  // Reference character
  var _r = '#'; 
  // Appender character
  var _a = '^';
  // Continuouse character
  var _c = '&';
  // Hide-node character
  var _h = '*';
  // Interpolation character
  var _i = '$'; // ... there is a regex with the $ sign in it, be sure to replace that if you change this.

	this.Name = "Simply Graphex";
	this.Examples = [
						"x->y",
						"Sam->John"+_a+"->Bob",
						"-->Product->3",
						"Diana-MotherOf->William&Harry",
						"Fe(name: Iron)->S(name: Sulpher)",
						"C(name: Carbon, weight: 12.011)",
						"Oxygen->Hydrogen(1) & Hydrogen(2)",
            'Graph1(quoted:"n->n")->Graph2(special_chars:"-=)(*&^%$#@!~>:)")',
            "Mother"+_r+"M->Father"+_r+"F; "+_r+"F->"+_r+"M; "+_r+"M->Son; "+_r+"F->Son; Son->Grandson",
            "Sun"+_r+"S->Earth"+_r+"E; "+_r+"S->Mars"+_r+"M; "+_r+"E->Moon; "+_r+"M->Phobos;"
	];
	this.ReferenceContent = ''
            +'Syntax characters: <span class ="inputModal code">->():#^&*$</span>:'
            +'<hr>'
						+'Type any word to create a node, eg. <span class ="inputModal code">John</span>'
						+'<hr>'
						+'Create a node with some attributes, eg.'
						+'	</br><span class ="inputModal code">John(age: 30, gender: male)</span>'
						+'<hr>'
						+'Create a relationship between two nodes:'
						+'	</br><span class ="inputModal code">node1->node2</span>'
						+'<hr>'
						+'Link multiple nodes in a chain:'
						+'	</br><span class ="inputModal code">n1->n2->n3->n4</span>'
						+'<hr>'
						+'Link multiple nodes to one node:'
						+'	</br><span class ="inputModal code">n1->n2 & n3 & n4</span>'
						+'<hr>'
						+'Alternative relationship syntax: <span class ="inputModal code">--></span>'
						+'<hr>'
						+'Create relationship with a name: <span class ="inputModal code">-name-></span>'
						+'<hr>'
						+'Create relationship with a name and some attributes:'
						+'	</br><span class ="inputModal code">-owns(since: 2010) -></span>'
						+'<hr>'
						+'Select the node using the <span class ="inputModal code">'+_a+'</span> symbol:'
						+'	</br><span class ="inputModal code">node1->node2 '+_a+'</span>'
						+'<hr>'
            +'Create a temporary node reference using the <span class ="inputModal code">'+ _r+ '</span> character:'
            +'  </br><span class ="inputModal code">star '+_r+'S->planet '+_r+'P; '+_r+'S->sun; '+_r+'P->Earth</span>';
            +'<hr>'
            +'Use double quotes for property values that have special characters <span class ="inputModal code">"..."</span>:'
            +'  </br><span class ="inputModal code">Sentence->Word(chars:"x * y - 34")</span>';
	
  this.Translate = function (expression) {
    _references = [];
    _hiddenNodes = [];
    expression = normalizeExpression(expression);
    var subExpressions = expression.split(';');
    for (var i =0; i< subExpressions.length; i++){
      if (subExpressions[i].trim().length > 0)
        processExpression(subExpressions[i].trim());
    }
    
    for (var i =0; i< _hiddenNodes.length; i++){
      removeNodeFromStage(_hiddenNodes[i]);
    }
	}

  function normalizeExpression(expression){
    return createDictionaryAndNormalizeSubStructures(expression);
  }

  function createDictionaryAndNormalizeSubStructures(expression){
    var dictIndex = 0;
    var encapsulationRegex = new RegExp(/("(?:"??[^"]*?"))/g);
    var encapsulated = expression.match(encapsulationRegex);
    while (encapsulated){
      encapsulated.forEach(function(captured){
        var dictVal = _i + (++_interpolationCounter);
        _interpolationDictionary[dictVal] = captured.slice(1,-1);
        expression = expression.replace(captured, dictVal);
      });
      encapsulated = expression.match(encapsulationRegex);
    }
    return expression;
  }

  this.TranslateGraphToFormula = function(){
    var statements = [];
    globals.nodeList.forEach(function(node){
      var props = JSON.stringify(node.data.propertiesObject).gxTrimBrackets();
      var label = node.data.labels[0];
      var statement = label +'#'+ node.id + ((node.data.properties.length > 0)? ('(' + props + ')'):'') + ';';
      statements.push(statement);
    });

    globals.linkList.forEach(function(link){
      var fromNode = "#" + link.fromId;
      var toNode = "#" + link.toId;
      var props = JSON.stringify(link.data.propertiesObject).gxTrimBrackets();
      var label = link.data.name[0];
      var linkDetails = label + ((link.data.properties.length > 0)? ('(' + props + ')'):'');
      if (link.data.name.length == 0){
        statements.push(fromNode+'->'+toNode+';');
      }
      else{
        statements.push(fromNode + '-' + linkDetails + '->' +  toNode +';');
      }    
    });
    return statements.join('');
  }



  function processExpression(expression){
    var dataSvc = new DataService();
    var elements = expression.split('->');
		var currentElement = elements[0].trim();
		var currentEntity = getEntityDetails(currentElement.trim());
		var currentNodes = [];
		if (currentEntity === null) {
			//...we're attaching to the currently selected node on the stage
			if (!IsNodeSelected) return;
			currentNodes = [globals.selectedNode];
		}
		else {
      //...we're creating a new node.
      currentNodes = getNodesFromStage(currentEntity.labels, currentEntity.properties);
			if (currentNodes.length == 0 ){
        currentNodes = currentNodes.concat(createEntityAddToGraphReturnNodes(currentEntity.labels, currentEntity.properties));
      }
			if (mustSelectNode(currentElement))
				highlightSelectedNode(currentNode.id);
      if (mustHideNode(currentElement))
        hideNode(currentNode.id);
		}

		for (var i = 1 ; i < elements.length; i++) {
			var nextElement = elements[i].trim();
			var subElements = nextElement.split('&');
			var relation = getRelationDetails(currentElement);
			for (s = 0; s < subElements.length; s++) {
				var subElement = subElements[s].trim();
				var nextEntity = getEntityDetails(subElement);
				var nextNodes = [];
				if (nextEntity === null) {
					//...we're attaching to the currently selected node on the stage
					if (!IsNodeSelected) return;
					nextNodes = [globals.selectedNode];
				}
				else {
          //...we're creaing a new node.
					nextNodes = getNodesFromStage(nextEntity.labels, nextEntity.properties);
          if (nextNodes.length == 0)      
            nextNodes = createEntityAddToGraphReturnNodes(nextEntity.labels, nextEntity.properties);
					if (mustSelectNode(subElement)){
						nextNodes.forEach(function(nextNode) {
              highlightSelectedNode(nextNode.id)});
          }
          if (mustHideNode(subElement)){
						nextNodes.forEach(function(nextNode) {
              hideNode(nextNode.id)});
          }
					//applyPopoutEffectToNode(nextNodes[0], currentNodes[0].id);
				}

        //Create relationship
        currentNodes.forEach(function(currentNode) {
				  nextNodes.forEach(function(nextNode) {
            var link = dataSvc.CreateRelation_AddToGraph_ReturnLink(
					    currentNode.id,
					    nextNode.id,
					    (relation === null) ? [] : relation.labels,
					    (relation === null) ? {} : properties = interpolateProperties(relation.properties)
				    );
          });
        });
			}
			currentElement = nextElement;
			currentNodes = nextNodes;
		}
  }
  
  function hideNode(nodeId){
    _hiddenNodes.push(nodeId);
  }

  function interpolate(string){
    if (typeof string === 'string'){
      var reg = new RegExp(/^\$\d+$/g);
      if (string.match(reg)){
        if (_interpolationDictionary[string] != undefined){
          return _interpolationDictionary[string]
        }
      }
    }
    return string;
  }
  
  function interpolateProperties(properties){
    if (properties != undefined){
      for (var propName in properties){
        properties[propName] = interpolate(properties[propName]);
      }
    }
    return properties;
  }
  

  function createEntityAddToGraphReturnNodes(labels, properties){
    var dataSvc = new DataService();
    var idAndLabelArray = labels[0].split(_r);
    var label = idAndLabelArray[0].trim().gxTrimQuotes();
    var id = null;

    if (idAndLabelArray.length > 1){      
      id = idAndLabelArray[1].trim();
    }

    if (isUsingReference(label, id))
      return returnReferenceNodes(id);
    
    validateLabelName(label);

    var newNode = dataSvc.CreateEntity_AddToGraph_ReturnNode([label], interpolateProperties(properties))
    
    if (isDeclaringReference(label, id))
      addToReferences(id, newNode);

    return [newNode];
  }

  function returnReferenceNodes(id){
    for (var i = 0; i < _references.length ; i++)
      if (_references[i].id == id)
        return _references[i].nodes;
    throw "Could not find node reference: '"+_r+""+ id + '. A '+_r+'ref syntax is used to refer to an existing node, or to create a node reference. ';
  }
  function addToReferences(id, newNode){
    var existingReference = null;
      for (var i = 0; i < _references.length ; i++){
        if (_references[i].id == id){
          existingReference.nodes.push(newNode);
          return;
        }
      }
      _references.push({"nodes": [newNode], "id": id})
  }
  function isUsingReference(label, id){
    return label.length == 0 && id;
  }

  function isDeclaringReference(label, id){
    return label.length > 0 && id;
  }
  function validateLabelName(label){
    if (label.length == 0)
      throw "Invalid formula. Node label is empty";
  }

  function getNodesFromStage(labels, properties){
    var nodes = [];
    for (var i = 0; i < globals.nodeList.length; i++){
      var labelsMatch = true;
      for (var l = 0; l < labels.length; l++){
        if (globals.nodeList[i].data.labels.indexOf(labels[l]) == -1)
          labelsMatch = false;
      }
      if (labelsMatch){
        var propertiesMatch = true;
        for (var key in properties)
          if (globals.nodeList[i].data.propertiesObject[key] != properties[key])
            propertiesMatch = false;
      }
      if (labelsMatch && propertiesMatch)
        nodes.push(globals.nodeList[i]);
      
    }
    return nodes;
  }
	function mustSelectNode(element)
	{
		return (element.indexOf(_a) > -1);
	}
  function mustHideNode(element)
	{
		return (element.indexOf(_h) > -1);
	}

	function IsNodeSelected() {
		if (!globals.selectedNode) {
			alert("You must select an existing node first.");
			return false;
		}
		return true;
	}
	function getEntityDetails(element) {
		element = element.replace(_a, '').replace(_h, '');

		var nodePart = getNodePart(element);
		if (nodePart === '')
			return null;
		var nodeLabel = getElementLabel(nodePart);
		var nodeProperties = getElementProperties(nodePart);
		return {
			labels: [nodeLabel.trim().gxTrimQuotes()],
			properties: nodeProperties
		}
	}
	function getRelationDetails(element) {
		var linkPart = getLinkPart(element);
		if (linkPart === null)
			return null;
		var linkLabel = getElementLabel(linkPart);
		var linkProperties = getElementProperties(linkPart);
		return {
			labels: [linkLabel.trim().gxTrimQuotes()],
			properties: linkProperties
		}
	}

	function getNodePart(element) {
		return element.split('-')[0];
	}
	function getLinkPart(element) {
		var elementParts = element.split('-');
		return elementParts.length > 1 ? elementParts[1] : null;
	}

	function getElementLabel(nodePart) {
		return nodePart.split('(')[0];
	}
	function getElementProperties(nodePart) {
		var nodeSections = nodePart.split('(');
		if (nodeSections.length < 2)
			return {}
		var propertySection = nodeSections[1].trim();
		var propertiesString = propertySection.substr(0, propertySection.length - 1);
		var nodeProps = propertiesString.split(',');
		var actualPropertiesObject = {};
		nodeProps.forEach(function (keyValuePair) {
			var propElements = keyValuePair.split(':');
			var propName = propElements[0].trim().gxTrimQuotes();
			var propValue = (propElements.length > 1)? propElements[1].trim().gxTrimQuotes(): "";
			//if (propElements.length > 1)
			//	propValue = propElements[1].trim().graphexTrimQuotes();
			actualPropertiesObject[propName] = propValue;
		});
		return actualPropertiesObject
	}

}

mappings.Translators.push({name:"Simply Graphex", translator: new SimpleTranslator()});


function UrlParamsTranslator() {

	this.Name = "Paramalactic";
	this.Examples = [
						"x--y",
            "x--y.x--z",
            "x--y.y--z"
	];
	this.ReferenceContent = ''
            +'This format is safe to pass in your URL,'
            +'<br/> in the "graph" parameter.'
            +'<br/>Example: '
						+'</br><span class ="inputModal code">http://www.graphex.io/?graph=x--y.y--z</span>'
						+'<hr>'
						+'Create a node with any alphanumric sequence of characters:'
						+'</br><span class ="inputModal code">MyNode1</span>'
						+'<hr>'
						+'Link two nodes with: <span class ="inputModal code">--</span>'
            +'<br/>Example:'
            +'</br><span class ="inputModal code">n1--n2</span>'
            +'<hr>'
						+'Separate node-pairs by using a full-stop: <span class ="inputModal code"> . </span>'
            +'<br/>Nodes will link to previouse nodes by name.'
            +'<br/>Example:'
            +'</br><span class ="inputModal code">n1--n2.n2--n3</span>'
            +'<br/>Relationships live in-beteen two dashes:'
            +'</br><span class ="inputModal code">node1-relationship-node2</span>';
					

	this.Translate = function (expression) {
		var dataSvc = new DataService();
    var regexNodePairs = new RegExp(/(\w+-\w*-\w+)/g);
    var relationRegex = new RegExp(/(-\w*-)/g);
    var graphs = expression.match(regexNodePairs);
    var links = [];
    var nodes = [];
    for (var i = 0; i < graphs.length; i++){
      var singleGraph = graphs[i];
      var relations = singleGraph.match(relationRegex);
      singleGraph = singleGraph.replace(relationRegex, ',')
      var newNode = null;
      var entities = singleGraph.split(',')
      
      for (var e = 0; e < entities.length; e++){
        var entityName = entities[e];
        
        newNode = null;
        nodes.forEach(function(n){if (n.data.labels[0] === entityName) newNode = n});
        
        if (!newNode){
          newNode = dataSvc.CreateEntity_AddToGraph_ReturnNode([entityName]);
          nodes.push(newNode);
        }
        if (e > 0){
          var newRelation = relations[e-1].slice(1,-1);
          var linkName = prevNode.data.labels[0] + "-->" + newNode.data.labels[0];
          if (links.indexOf(linkName) === -1){
            links.push(linkName);
            var link = dataSvc.CreateRelation_AddToGraph_ReturnLink(
				      prevNode.id,
				      newNode.id,
				      (newRelation === null) ? [] : [newRelation]
			      )
          }
        }
        prevNode = newNode;
      }
    }
	}

}

mappings.Translators.push({name:"Paramalactic", translator: new UrlParamsTranslator()});

		function jsonStringToObject(jsonString)
		{
			return JSON.parse(jsonString);
		}
		
		function submitJsonForGraph()
		{
			var jsonString = document.getElementById('dlg.text.json').value;
			var translator = new JsonTranslator();
			translator.TranslateToGraph_ReturnGraphElements('root', jsonString);
			closeDialog('json2GraphDlg');
		}
		
		function jsonToGraph(jsonString, _sourceConfig){
			console.log('CONVERT -string ', jsonString);

			var graphData = processJsonToGraph('root', jsonStringToObject(jsonString), null, 0);
			//ADD NODES...
			graphData.nodes.map(function(nData){
				//match node to existing nodes

				if (nData.temp.matchedNodes > 0){//...update existing node
					//there is no parent, but there are existing matching nodes, therefore make all the matching nodes our root nodes. (we will update all their paths)
					nData.temp.matchedNodes.forEach(function (existingNode){
						//update existing node
						existingNode.data.properties = mergeProperties(existingNode.data.properties, existingNode.data.temp.properties)
						addDataNode(existingNode.id, existingNode.data, _sourceConfig);
					});
				}
				else { //create new node...
					nData.properties = nData.temp.properties;
					addDataNode(nData.id, nData, _sourceConfig)
				}
			});
			
			//ADD LINKS...
			graphData.links.map(function(lData){
				addDataLink(lData.fromNodeID, lData.toNodeID, lData, _sourceConfig)
			});
		}
		
		function processJsonToGraph(name, obj, parentNodeData, level)
		{
			console.log('CONVERT', 1);
			var stillRoot = parentNodeData ? false : true;
			if (!stillRoot){if (!parentNodeData.temp.parentNodeData) {stillRoot = true;}}
			var fromNodeId = parentNodeData ? parentNodeData.id : 'root';
			level++;
			var type = getType(obj);
			var graphData = {nodes:[], links:[]};
			var relationsAdded = false;
			//create a node (will only be applied if this is actually an object (not a primitive or array))
			var nodeData = new nodeDataType();
			nodeData.labels = [name];
			nodeData.id = 'newnode_'+ (++globals.processUniqueId);
			nodeData.temp = {};
			nodeData.temp.stillRoot = stillRoot;
			nodeData.temp.matchedNodes = []; //if '$matchon' is specified then this list will be existing matching nodes
			nodeData.temp.parentNodeData = parentNodeData;
			nodeData.temp.properties = [];
			
			nodesListData = [];
			
			//Process object...
			if (type == 'object'){
				//Find existing nodes by matching label
				
				var nodeDataProperties = [];
				//Filter matching nodes by key properties...
				for (var propName in obj){	
					if (propName == '$matchon'){//...meta data (matchon)...
						//...$matchon should be an array of strings, who's values specify which fields in the current entity, to match on.
						var matchPropertyList = []
						var onPath = false;
						obj['$matchon'].forEach(function (matchPropName){
							if (matchPropName == '$onpath'){
								onPath = true;
							}else{
								matchPropertyList.push(new propertyType(matchPropName, obj[matchPropName]));
							}
						});
						
						var eligibleNodesList = globals.nodeList; //...Search all nodes by default
						if (onPath==true){
							//Only search nodes on the existing path (child nodes of the parent node)...
							eligibleNodesList = getNodesByMatchingLabels((stillRoot)? globals.nodeList : parentNodeData.toNodes , nodeData.labels);
						}
						
						nodeData.temp.matchedNodes = getNodesByMatchingProperties(eligibleNodesList, matchPropertyList);				
						nodeData.temp.matchedNodes.map(function(mn){
							mn.data.temp = {}
							mn.data.temp.matchedNodes = [mn];
							mn.data.temp.properties = [];
							mn.data.temp.parentNodeData = parentNodeData;
							nodesListData.push(mn.data);
						});
					}
					
					else if (propName == '$rel'){//...meta data (relationship)...
						obj[propName].forEach(function (relation){ //...iterate throguh relationships
							var newLinkData = new linkDataType(fromNodeId, newNode.id, ++globals.processUniqueId, relation['$name']);
							newLinkData.properties = [];
							//iterate through relationship properties...
							for (var relPropName in relation){//.forEach(function(prop){
								newLinkData.properties.push(new propertyType(relPropName, relation[relPropName]));
							}
							graphData.links.push(newLinkData); //...add specified link
							relationsAdded = true;
						})
					}
					
					else { //...Since this property is not a meta property, add it to the data proerties list...
						nodeDataProperties.push(propName);
					}
				}
				
				if (nodesListData.length == 0){ //...no existing nodes exist matching this node
					//Create a new node...
					nodesListData = [nodeData]; //...add new node
					//nodeData.temp.matchedNodes = [nodeData]
				}
				
				//get all the properties for the object
				nodesListData.forEach(function (newNode){ 
					
					//for (var propName in obj){
					nodeDataProperties.forEach(function(nodePropName){
						//process non-meta property
						//else { //...property is not meta data... (could be anything)
						var subGraphData = processJsonToGraph(nodePropName, obj[nodePropName], newNode, level)
						if (subGraphData){
							subGraphData.nodes.map(function (n){graphData.nodes.push(n);});
							subGraphData.links.map(function (l){graphData.links.push(l);});
						}
					});

					//ADD THIS NODE...
					if (parentNodeData) { //node has a parent, which means its not a root object (because a valid object will at least have the root node as a parent)
						graphData.nodes.push(newNode);
					}
					
					//ADD A RELATIONSHIP (if not already added, and not a root connection)...
					if (!relationsAdded){ //...no relationships were explicitly mentioned

						if (parentNodeData && parentNodeData.temp.parentNodeData) //...there is actually a parent, and a grandparent, to create a link to
						{

							//link this node to the parent node (will only be applied if this is actually an object (not a primitive or array))
							var defaultLink = new linkDataType(fromNodeId, newNode.id, 'newlink_'+ (++globals.processUniqueId), 'DEFAULT')						
							graphData.links.push(defaultLink);
						}
					}
				})//...next new/existing node
				
				return graphData;
			}
			//Process array...
			else if (type == 'array'){
				//iterate through elements...
				obj.forEach(function(element){
					var subGraphData;
					subGraphData = processJsonToGraph(nodeData.labels[0],element, parentNodeData, level)
					if (subGraphData){
						subGraphData.nodes.map(function (n){graphData.nodes.push(n);});
						subGraphData.links.map(function (l){graphData.links.push(l);});
					}
				})
				return graphData;
			}
			//Process primitive...
			else{ //...property is a primitive
				if(parentNodeData){
					var subGraphData = parentNodeData.temp.properties.push(new propertyType(name, obj));
					return graphData; //return nothing since its only a property
				}
			}

		}

		function createJsonFromSelectedNodes()
		{
			//get the rootmost objects amongst the check nodes...
			var rootMostNodes = [];
			var processedNodes = [];
			globals.checkedNodes.forEach(function(node) { //iterate through checked nodes...
				if (processedNodes.map(function(n) {return n.id}).indexOf(node.id) == -1){ //...node has not been processed yet
					processedNodes.push(node); //...add node to processed list
					var isRootNode = true;
					node.data.fromNodes.forEach(function (fromnode){ //...iterate through current node's fromNodes
						if (globals.checkedNodes.map(function(n) {return n.id}).indexOf(node.id) > -1) //...current fromNode is in the globals.checkedNodes list, therefore its not a rootmost node
						{	
							isRootNode = false;
							return;
						}
					})
					if (isRootNode) {rootMostNodes.push(node);}
				}
			});
			if (rootMostNodes.length == 0 && globals.checkedNodes.length != 0) {rootMostNodes.push(globals.checkedNodes[0]);}  //resolve a cyclic scenario by just picking the first checked node.

			var rootObject = {};
			processedNodes  = [];
			var labels = [];
			rootMostNodes.map(function(n, index) {if (labels.indexOf(n.data.labels[0]) == -1){labels.push(n.data.labels[0]);} });
			
			labels.forEach(function (nodeLabel) {
				var useArray = false;
				var count = 0;
				rootMostNodes.map(function (n) { if (n.data.labels[0] == nodeLabel) { count++; } });
				if (count > 1) {useArray = true;}
				if (useArray) { rootObject[nodeLabel] = []; }
				rootMostNodes.forEach(function (node) {
					if (node.data.labels[0] == nodeLabel) {
						if (useArray) 
							rootObject[nodeLabel].push(createJsonFromNode(node, {}, processedNodes));
						else
							rootObject[nodeLabel] = createJsonFromNode(node, {}, processedNodes);
					}
				})
			});			
			var jsonstring = JSON.stringify(rootObject);
			var dialog = document.getElementById('myDialog');
			var dialogText = document.getElementById('myDialogText');
			dialogText.innerHTML = jsonstring
			dialog.showModal();
		}

		function createJsonFromNode(node, parentObject, processedNodes, parentNode)
		{
		
			var entityName = node.data.labels[0]; 
			var thisObject = {};
			parentObject[entityName] = thisObject;
			thisObject['$type'] = entityName;
			processedNodes.push(node);
			var relationships = [];
			if (parentNode){	
				node.data.fromLinks.forEach(function(link){
					if (link.fromId == parentNode.id)
					{
						relationship = {};
						relationship['$name'] = link.data.name;
						link.data.properties.forEach(function(prop){
							relationship[prop.key] = prop.value;
						} );
						relationships.push(relationship);
					}
				})
			}
			if (relationships.length >0){
				thisObject['$rel'] = relationships
			}
			
			node.data.properties.forEach(function(prop){
				thisObject[prop.key] = prop.value;
			});

			//process child nodes...
			var labels = [];
			node.data.toNodes.map(function(n, index) {if (labels.indexOf(n.data.labels[0]) == -1){labels.push(n.data.labels[0]);} });
			
			labels.forEach(function (nodeLabel) {
				
				var useArray = false;
				var count = 0;
				node.data.toNodes.map(function (n) { if (n.data.labels[0] == nodeLabel) { count++; } });
				if (count > 1) {useArray = true;}
				if (useArray) { thisObject[nodeLabel] = []; }
				
				node.data.toNodes.forEach(function (childNode){
					if (childNode.data.labels[0] == nodeLabel && count > 0)
					{
						if (processedNodes.indexOf(childNode.id) == -1)
						{
							if (globals.checkedNodes.map(function(n){return n.id}).indexOf(childNode.id) > -1)
							{
								if (useArray) 
									thisObject[nodeLabel].push(createJsonFromNode(childNode, {}, processedNodes, node));
								else 
									thisObject[nodeLabel] = createJsonFromNode(childNode, {}, processedNodes, node);
							}
						}
					}
				})
			})
			return thisObject;
		}


function ApiImportTranslator() {

	this.Name = "Api Importer";
	this.Examples = [
            "http://en.wikipedia.org/api/rest_v1/feed/featured/{Year (eg. 2001)}/{Month (eg. 03)}/{Day (eg. 06)}",
            "http://api.tvmaze.com/search/people?q={Actor Name}",
            "https://itunes.apple.com/search?term={Genre}"
	];
	this.ReferenceContent = ''
            +'Place an API link in the formula box'
            +'<br/>This tranlator uses the "Json-son" translator to graph out the return data.'
            +'<br/>Use <code>{...}</code> to create a prompt, to get info from the user.'

	this.Translate = function (expression, parentNode) {

    //Get all data from user...
    var inBracketsRegex = new RegExp(/\{(?:\{??[^\{]*?\})/g);
    var inBrackets = expression.match(inBracketsRegex);
    while (inBrackets){
      inBrackets.forEach(function(captured){
        var newVal = window.prompt(captured.split(':')[0], "");
        expression = expression.replace(captured, newVal);
      });
      inBrackets = expression.match(inBracketsRegex);
    }

	  var httpClient=new HttpClient();
    httpClient.get(expression,function(response) {
        console.log('response',response);
        new JsonTranslator().Translate(response, parentNode);
    });

	}

}




mappings.Translators.push({name:"Api Importer", translator: new ApiImportTranslator()})
function JsonTranslator() {
  var _graphEntities=[];
  var _graphRelations=[];
  var _jsonHelper=new JsonHelper;

  this.Name="Json-son";
  this.Examples=[
          '{"x":{"y":{}}}',
          '{"Sam":{"Bob":{"John":{}}}}'
  ];
  //this.ImportExamples=[
  //  {
  //    name: "This day in history",
  //    params: ["$day","$month","$year"],
  //    value: 'http://en.wikipedia.org/api/rest_v1/feed/featured/$year/$month/$day'
  //  }
  //];

  this.ReferenceContent=''
						+'Objects are nodes, eg. <span class ="inputModal code">{"John":{}}</span>'
						+'<hr>'
						+'Nodes start from the properties of the root node.'
						+'The root node is never materialized.'
						+'<hr>'
						+'Arrays will become nodes by the name of the parent property.';

  this.Translate=function(expression,parentNode) {
    var translator=new JsonTranslator();
    translator.TranslateToGraph_ReturnGraphElements(parentNode||null,expression);
  }

  this.TranslateToGraph_ReturnGraphElements=function(parentNode,jsonString) {
    var dataService=new DataService();
    var appendingEntity=null;

    var jsonObject=JSON.parse(jsonString);
    if(isObject(jsonObject)&&parentNode) {
      appendingEntity=createEntity('root',jsonObject)
    }
    else if(isObject(jsonObject)&&hasPrimitives(jsonObject))
      createEntity('root',jsonObject);
    else if(isObject(jsonObject)&&!hasPrimitives(jsonObject))
      processObject(jsonObject);
    else if(isArray(jsonObject))
      processArray('root',jsonObject);
    else if(isPrimitive(jsonObject)) {
      createEntity(jsonString,{});
    }

    for(var e=0;e<_graphEntities.length;e++) {
      var newNode=dataService.CreateEntity_AddToGraph_ReturnNode(_graphEntities[e].labels,_graphEntities[e].properties);
      _graphEntities[e].id=newNode.id;
    }

    var graphElements=[];
    if(appendingEntity) {
      var link=dataService.CreateRelation_AddToGraph_ReturnLink(parentNode.id,appendingEntity.id);
      graphElements.push(createNewGaphElement(link));
    }
    for(var e=0;e<_graphRelations.length;e++) {
      var link=dataService.CreateRelation_AddToGraph_ReturnLink(_graphRelations[e].fromEntity.id,_graphRelations[e].toEntity.id,_graphRelations[e].labels,_graphRelations[e].properties);
      graphElements.push(createNewGaphElement(link));
    }
    return graphElements;
  }

  function createNewGaphElement(link) {
    var newGraphElement=new GraphElement();
    newGraphElement.fromNode=globals.GRAPH.getNode(link.fromId);
    newGraphElement.toNode=globals.GRAPH.getNode(link.toId);
    newGraphElement.link=link;
    return newGraphElement;
  }

  function processObject(obj) {
    for(var thingKey in obj) {
      if(isObject(obj[thingKey]))
        createEntity(thingKey,obj[thingKey]);
      else if(isArray(obj[thingKey])) {
        processArray(thingKey,obj[thingKey]);
      }
    }
  }

  function processArray(name,array) {
    for(var i=0;i<array.length;i++) {
      if(isObject(array[i]))
        createEntity(name,array[i]);
      else if(isPrimitive(array[i])) {
        createEntity(array[i],{});
      }
    }
  }


  function createEntity(name,obj) {
    var newEntity=new Entity();
    newEntity.labels=[name];
    newEntity.properties={};
    var newLinks=[];
    for(var propertyKey in obj) {
      if(isPrimitive(obj[propertyKey])) {
        newEntity.properties[propertyKey]=obj[propertyKey];
      }
      if(isObject(obj[propertyKey])) {
        var newChildEntity=createEntity(propertyKey,obj[propertyKey]);
        newLinks.push(createRelation('',[],newEntity,newChildEntity));
      }
      if(isArray(obj[propertyKey])) {
        for(var i=0;i<obj[propertyKey].length;i++) {
          if(isObject(obj[propertyKey][i])) {
            var newChildEntity=createEntity(propertyKey,obj[propertyKey][i]);
            newLinks.push(createRelation('',[],newEntity,newChildEntity));
          }
          if(isPrimitive(obj[propertyKey][i])) {
            var newChildEntity=createEntity(propertyKey,obj[propertyKey][i]);
            newLinks.push(createRelation('',[],newEntity,newChildEntity));
          }
        }
      }

    }
    newEntity.links=newLinks;
    _graphEntities.push(newEntity);
    return newEntity;
  }

  function createRelation(name,properties,fromEntity,toEntity) {
    var newRelation=new Relationship();
    newRelation.labels=[name];
    newRelation.properties=properties;
    newRelation.fromEntity=fromEntity;
    newRelation.toEntity=toEntity;
    _graphRelations.push(newRelation);
    return newRelation;
  }

  function isObject(obj) {
    return getType(obj)=='object'
  }

  function isArray(obj) {
    return getType(obj)=='array'
  }

  function isPrimitive(obj) {
    return getType(obj)!='object'&&getType(obj)!='array'
  }
  function hasPrimitives(obj) {
    for(var thingKey in obj)
      if(isPrimitive(obj[thingKey]))
        return true;
    return false;
  }
}

mappings.Translators.push({ name: "Json-son",translator: new JsonTranslator() });


function ParseTreeTranslator() {
  var _dataSvc = new DataService();
	this.Name = "Logic Parse Tree";
	this.Examples = [
    "a & (b & c) -> (d -> (e V f)) & !(g || h)"
  ];
	this.ReferenceContent = ''
    +'</br>'
    +'  Implication'
    +'  <span class ="inputModal code">Implies</span> '
    +'  <span class ="inputModal code">-></span> '
    +'</br>'
    +'  Conjuntion'
    +'  <span class ="inputModal code">And</span> '
    +'  <span class ="inputModal code">&</span> '
    +'  <span class ="inputModal code">&&</span> '
    +'  <span class ="inputModal code">^</span> '
    +'  <span class ="inputModal code">.</span> '
    +'</br>'
    +'  Disjunction'
    +'  <span class ="inputModal code">Or</span> '
    +'  <span class ="inputModal code">||</span> '
    +'  <span class ="inputModal code">V</span> '
    +'  <span class ="inputModal code">+</span> '
    +'</br>'
    +'  Negation'
    +'  <span class ="inputModal code">Not</span> '
    +'  <span class ="inputModal code">~</span> '
    +'  <span class ="inputModal code">!</span> '
    +'  <span class ="inputModal code">-</span> '
    +'</br>'
    +'  Parentheses<span class ="inputModal code">(...)</span> '
    +'';
	var _stringSvc = new StringHelper();
  var _dictionery = [];
  var _precedence = {
    'Implies':["Implies", "->"],
    'And' :["And", "&", "&&", '^', '.'],
    'Or' :["Or", '||', 'V', '+'],
    'Not' :["Not", '~', '!', '-'],
  }
	
  
  this.Translate = function (expression) {
		//var dataSvc = new DataService();
    var normalExpression = normalizeExpression(expression);
    var node = TopEvaluate(normalExpression);

 }

  this.GetNormalizedExpression = function(expression){
    return normalizeExpression(expression);
  }
  this.GetNormalizedDictionaryFromExpression = function(expression){
    normalizeExpression(expression);
    return _dictionery;
  }

  function normalizeExpression(expression)
  {
    for (var op in _precedence){
      _precedence[op].forEach(function(alt){
        expression = _stringSvc.ReplaceAll(expression, alt, op);
      });
    }  
    expression = createDictionaryAndNormalizeSubStructures(expression);
    return expression;
  }

  function createDictionaryAndNormalizeSubStructures(expression){
        var dictIndex = 0;
    var encapsulationRegex = new RegExp(/(\((?:\(??[^\(]*?\)))/g);
    
    var encapsulated = expression.match(encapsulationRegex);

    while (encapsulated){
      encapsulated.forEach(function(captured){
        var dictVal = '%' + (++dictIndex);
        _dictionery[dictVal] = captured.slice(1,-1);
        expression = expression.replace(captured, dictVal);
      });
      encapsulated = expression.match(encapsulationRegex);
    }
    return expression;
  }

  function TopEvaluate(expression){
    var exp = getExpressionFromDictionary(expression);
    for (var op in _precedence){
      var node = getNodeOfOperatorIfAny(exp, op);
      if (node)
        return node;
    }
    return translatorCreateNode(exp, 'atom');
  }

  function getExpressionFromDictionary(expKey)
  {
    if (_dictionery[expKey] != undefined)
      return _dictionery[expKey];
    return expKey;
  }

  function getNodeOfOperatorIfAny(expression, operator){

    var expressions = expression.split(operator);//_stringSvc.SplitOr(expression, operator);
    if (expressions.length == 1)
      return null;
    var node = translatorCreateNode(operator, 'operator');
    for (var i = 0; i < expressions.length; i++){
      if (expressions[i].trim().length > 0) // Binary/n-ary expression
        translatorCreateRelation(node, TopEvaluate(expressions[i].trim()));
    }
    return node;
  }
  
  function translatorCreateRelation(fromNode, toNode){
    _dataSvc.CreateRelation_AddToGraph_ReturnLink(fromNode.id, toNode.id);
  }

  function translatorCreateNode(label, type){
    return _dataSvc.CreateEntity_AddToGraph_ReturnNode([type], {"Name":label});
  }

}


mappings.Translators.push({name:"Logic Parse Tree", translator: new ParseTreeTranslator()});
function TranslatorHelper(){


}

function createNode() {
	var newNodeValue = document.getElementById('newNodeData').value;
	globals.dataService.CreateEntity_AddToGraph_ReturnNode([newNodeValue]);
}

function getEntityNode() {
	var newNodeValue = document.getElementById('nodeLabel').value;
	globals.dataService.GetEntitiesByType(newNodeValue);
}

function GetRelatedEntityGraph() {
	globals.dataService.GetRelatedEntityGraph(globals.selectedNodeID);
}

function deleteLink() {
	if (!globals.selectedLink) { return; }
	globals.dataService.DeleteRelationship(globals.selectedLink.data.id);
}

function submitNewEntity() {
	var entityName = document.getElementById('new.entity.name').value;
	if (!entityName || entityName == '') {
		alert('Save failed!\nNo entity name specified.'); return;
	}
	var propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	var properties = [];
	var propIndex = 0;
	while (propertyElement) {
		var propertyTypeElement = document.getElementById('new.entity.property.type.' + propIndex);
		var propertyValueElement = document.getElementById('new.entity.property.value.' + propIndex);
		if (!propertyValueElement || propertyValueElement.value == '') {
			alert('Save failed!\nInvalid property name.'); return;
		}
		var propertyKey = propertyElement.value;
		var propertyValue = parseDataType(propertyValueElement.value, propertyTypeElement.value);
		properties.push(new propertyType(propertyKey, propertyValue));

		propIndex++;
		propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	}
	globals.dataService.CreateEntityReturnCallbackWithIds(entityName, properties);
}

function submitCreateRelation(nodeID1, nodeID2, planOnly, _sourceConfig) {
	var node1 = globals.GRAPH.getNode(nodeID1);
	var node2 = globals.GRAPH.getNode(nodeID2);
	if (node1.data.sourceConfig.prefix != node2.data.sourceConfig.prefix) {
		alert('Save failed!\nYou cannot relate nodes from different sources.'); return;
	}
	var relationName = document.getElementById('new.relation.name').value;
	if (!relationName || relationName == '') {
		alert('Save failed!\nNo relation name specified.'); return;
	}
	var propIndex = 0;
	var propertyElement = document.getElementById('new.relation.property.key.' + propIndex);
	var propList = '';

	while (propertyElement) {
		var propertyValueElement = document.getElementById('new.relation.property.value.' + propIndex);
		if (!propertyValueElement || propertyValueElement.value == '') {
			alert('Save failed!\nInvalid property name.'); return;
		}
		if (propList != '') { propList += ',' }
		propList += propertyElement.value + ':' + parseDataType(propertyValueElement.value);
		propIndex++;
		propertyElement = document.getElementById('new.relation.property.key.' + propIndex);
	}
	if (propList != '') { propList = '{' + propList + '}'; }

	globals.dataService.CreateRelation_AddToGraph_ReturnLink(nodeID1, nodeID2, [relationName], propList, _sourceConfig, planOnly);
}

function submitUpdateEntity() {
	if (!nodeID) {
		nodeID = globals.selectedNodeID;
	}
	var node = globals.GRAPH.getNode(nodeID);
	var _sourceConfig = node.data.sourceConfig;
	var entityName = document.getElementById('new.entity.name').value;
	if (!entityName || entityName == '') { alert('Save failed!\nNo entity name specified.'); return; }
	var propIndex = 0;
	var propList = '';

	var propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	while (propertyElement) {
		var propertyValueElement = document.getElementById('new.entity.property.value.' + propIndex);
		var propertyTypeElement = document.getElementById('new.entity.property.type.' + propIndex);
		if (propList != '') { propList += ',' }
		if (!propertyValueElement || propertyValueElement.value == 'null') {
			propList += ' n.' + propertyElement.value + '=null';
		}
		else {
			propList += ' n.' + propertyElement.value + '=' + parseDataType(propertyValueElement.value, propertyTypeElement.value);
		}

		propIndex++;
		propertyElement = document.getElementById('new.entity.property.key.' + propIndex);
	}
	if (propList != '') { propList = ' SET ' + propList + ''; }

	var callback = function() {
		UiShow_EditEntity(node);
	}
	globals.dataService.UpdateEntity(nodeID, propList, callback);


}

function relateSelectedToNode() {
	globals.bRelate = true;
}

function planRelateSelectedToNode() {
	globals.bPlanRelate = true;
}

function fontGrow() {
	if (!globals.selectedNode.data.UI.displayTextUI) { return; }
	var fontsize = Number(globals.selectedNode.data.UI.displayTextUI.attr('font-size'));
	globals.selectedNode.data.UI.displayTextUI.attr('font-size', fontsize + 1);
}
function fontShrink() {
	if (!globals.selectedNode.data.UI.displayTextUI) { return; }
	var fontsize = Number(globals.selectedNode.data.UI.displayTextUI.attr('font-size'));
	globals.selectedNode.data.UI.displayTextUI.attr('font-size', fontsize - 1);
}
function fontDown() {
	if (!globals.selectedNode.data.UI.displayTextUI) { return; }
	var fontsize = Number(globals.selectedNode.data.UI.displayTextUI.attr('y'));
	globals.selectedNode.data.UI.displayTextUI.attr('y', fontsize + 1);
}
function fontUp() {
	if (!globals.selectedNode.data.UI.displayTextUI) { return; }
	var fontsize = Number(globals.selectedNode.data.UI.displayTextUI.attr('y'));
	globals.selectedNode.data.UI.displayTextUI.attr('y', fontsize - 1);
}


function updateViewOptions() {
	globals.viewOptions.highlightRelated = document.getElementById('vo.hr').checked;
	globals.viewOptions.highlightAncestors = document.getElementById('vo.ha').checked;
	globals.viewOptions.highlightdescendants = document.getElementById('vo.hd').checked;
}

function updateDragOptions() {
	if (document.getElementById('do.flat').checked) { globals.viewOptions.screenDragType = 'flat' };
	if (document.getElementById('do.depth').checked) { globals.viewOptions.screenDragType = 'depth' };
}
function updateViewOptions_Nav(navoption) {
	globals.viewOptions.navigateDirection = navoption;
}

function updateInteractionOptions() {
	globals.interactionOptions.checkNodes = document.getElementById('vo.ch').checked;
}

function unPinSelectedNode() {
	unPinNode(globals.selectedNode);
}

function ButtonSimpleSearch() {
	//var fromEntity = document.getElementById('qbuilder.from.entity').value;
	var selectedEntityValue = document.getElementById('qbuilder.from.entity').value;
	var sourcePrefix = selectedEntityValue.substring(selectedEntityValue.length - 3);
	var entityName = selectedEntityValue.substring(0, selectedEntityValue.length - 3);

	var fromProperty = document.getElementById('qbuilder.from.property').value;
	var fromValue = document.getElementById('qbuilder.from.value').value;
	globals.dataService.QuerySimpleSearch(entityName, fromProperty, fromValue, getConfigByPrefix(sourcePrefix));
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function panelAddKeyValue(panelId, panelScope, _sKey, _sValue, _sDatatype) {
	if (!_sKey) { _sKey = ''; }
	if (!_sValue) { _sValue = ''; }
	if (!_sDatatype) { _sDatatype = 'string'; }
	var $panel = document.getElementById(panelId);
	console.log(panelScope);
	var typehtml;

	var getTypeHtml = function (type) {
		switch (type) {
			case 'string':
				typehtml = 'a';
				break;
			case 'number':
				typehtml = '1';
				break;
			case 'array':
				typehtml = '[]';
				break;
			case 'other': //boolean
				typehtml = '/';
				break;
		}
		return typehtml;
	}

	var addRow = function (index, key, value, dataType, currentHtml) {
		currentHtml += ("<tr><td><input id='" + panelScope + ".property.key." + index +
        "' class='dynamic' value='" + key +
        "'></input></td><td><input id='" + panelScope + ".property.value." + index +
        "' class='dynamic2' value='" + value +
        "'></input></td>" +
        "<td>" + '<button id="' + panelScope + '.property.type.' + index + '" value="' + dataType + '" class="paneloption mytooltip" onclick="panelCyclePropertyType(\'' + panelScope + '.property.type.' + index + '\')" >' + getTypeHtml(dataType) + '</button>' + "</td></tr>");
		return currentHtml;
	};

	var nextIndex = 0;
	var newHtml = '';
	for (var i = 0; i < $panel.childNodes[0].childNodes.length; i++) {
		var currval = document.getElementById(panelScope + '.property.value.' + i).value;
		var currkey = document.getElementById(panelScope + '.property.key.' + i).value;
		var dataType = document.getElementById(panelScope + '.property.type.' + i).value;
		newHtml = addRow(i, currkey, currval, dataType, newHtml);
		nextIndex = i + 1;
	}

	newHtml = addRow(nextIndex, _sKey, _sValue, _sDatatype, newHtml);
	$panel.childNodes[0].innerHTML = newHtml;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function panelCyclePropertyType(panelId) {

	var elementButton = document.getElementById(panelId); //"new.entity.property.type." + propertyIndex);
	if (elementButton.value == 'string') {
		elementButton.innerHTML = '1';
		elementButton.value = 'number';
	}
	else if (elementButton.value == 'number') {
		elementButton.innerHTML = '[]';
		elementButton.value = 'array';
	}
	else if (elementButton.value == 'array') {
		elementButton.innerHTML = '/';
		elementButton.value = 'other';
	}
	else if (elementButton.value == 'other') {
		elementButton.innerHTML = 'a';
		elementButton.value = 'string';
	}

}

function panelRemoveKeyValue(panelId) {
	var panel = document.getElementById(panelId);
	if (panel.childNodes[0].childNodes.length == 0) { return; }
	panel.childNodes[0].childNodes[panel.childNodes[0].childNodes.length - 1].remove();
}



//====== TOOL PANELS ===============================================================================================================================================

		function toggleToolPanel(panelName)
		{
			var panel;
			globals.currentTheme.sourceConfig.viewOptions.panels.map(function (p) {if (p.name==panelName){panel = p;}})
			$elButton = document.getElementById('toolbar.'+ panel.name);
			$elPanel = document.getElementById(panel.name);
			$parentContainer = document.getElementById(panel.parent);
			$hiddenParent = document.getElementById('invisibleElements');
			if ($parentContainer && $elPanel && $elButton){
				var isShowing = $elButton.classList.contains('showicon');
				if(isShowing){ //hide...
					$elButton.classList.remove('showicon');
					$elPanel.classList.remove('slide-out');
					$elPanel.classList.add('slide-in');
					//$parentContainer.removeChild($elPanel);
				    globals.timeoutElements.push(new timeoutElementType({panel:$elPanel, button:$elButton}, 1, hideToolPanel));
				}
				else{//show...
					$parentContainer.appendChild($elPanel);
					$elButton.classList.add('showicon');
					$elPanel.classList.remove('slide-in');
					$elPanel.classList.add('slide-out');
				}
			}
		}
		
		
		
		function hideToolPanel(elements)
		{
			$topBarElem = elements.button;
			$panel = elements.panel;
			if (!$topBarElem.classList.contains('showicon')){
				$hiddenParent.appendChild($elPanel);
			}
		}
		
		//................Tool panels - Drag and drop................
		function handleDragOver(e) {
		  if (e.preventDefault) {
			e.preventDefault(); // Necessary. Allows us to drop.
		  }
		  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
		  return false;
		}
		function handleDragStart(e) {
		  this.style.opacity = '0.4';  // this / e.target is the source node.
		}
		function handleDragLeave(e) {
		  this.classList.remove('over');  // this / e.target is previous target element.
		}
		function handleDragEnter(e) {
		  // this / e.target is the current hover target.
		  this.classList.add('over');
		}
		function handleDrop(e) {
		  // this / e.target is current target element.
		  if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		  }
		  // See the section on the DataTransfer object.
		  return false;
		}
		function handleDragEnd(e) {
		  // this/e.target is the source node.
		  this.style.opacity = '0.9';
		  globals.toolPanels.forEach(function (col) {
			col.classList.remove('over');
		  });
		}
		function closeDialog(dialogName)
		{
			document.getElementById(dialogName).close();
		}
		
		
		//function applyConfigUpdates(_sourceConfig)
		//{
		//	globals.graphContainer = document.getElementById('graphContainer');
		//	globals.graphContainer.style.background=_sourceConfig.displaySettings.graphBackground;
		//	if (_sourceConfig.displaySettings.backgroundImage!=null){
		//		globals.graphContainer.style['background-image'] =  'url('+_sourceConfig.displaySettings.backgroundImage+')'
		//	};
		//}
		
		function addValueToList(listElementId, col1, col2, col3)
		{
			var propertyElement = document.getElementById(listElementId);
			//check if element already exists in list...
			for (var i = 0; i < propertyElement.childNodes.length; i++ ){
				if (propertyElement.childNodes[i].childNodes[0].childNodes[2].innerHTML == col3){
					return;
				}
			}
			//element does not already exist in list, therefore add it...
			var html = '<tr>'
			html += '<td>'+col1+'</td>'	
			html += '<td>'+col2+'</td>'	
			html += '<td>'+col3+'</td>'	
			html += '</tr>';
			propertyElement.innerHTML +=html;

		}	
		
		

		function hasProperty(propertyList, propertyName)
		{
			var x = false;
				if (!propertyList) return;
				propertyList.forEach(function (prop, index){
					if (prop.key == propertyName)
					{
						x = true;
						return true;
					}
				}); 
			return x;
		}
		
		function hasPropertyWithValue(propertyList, propertyName, value)
		{
			var x = false;
				if (!propertyList) return;
				propertyList.forEach(function (prop, index){
					if (prop.key == propertyName)
					{
						x = (value == prop.value);
						return (value == prop.value);
					}
				}); 
			return x;
		}
		
		function getNodePropertyValue(propertyList, propertyName)
		{
			var x;
			if (!propertyList) return;
			propertyList.forEach(function (prop, index){
				if (prop.key.toLowerCase() === propertyName.toLowerCase())
				{
					x = prop.value;
					return x;
				}
			}); 
			return x;
		}
		
		function mergeProperties(basePropertyList, newPropertyList){
			var updatedList = [];
			var addedList = [];
			
			newPropertyList.forEach(function (newprop){
				var newPropExists = false;
				basePropertyList.forEach(function (baseprop){
					if (baseprop.key == newprop.key){
						newPropExists = true;
						if (baseprop.value != newprop.value){
							baseprop.value = newprop.value;
							updatedList.push(baseprop);
						}
					}
				});
				if (!newPropExists){
					basePropertyList.push(newprop)
					addedList.push(newprop);
					baseprop.push(newprop)
				}
			})
			return basePropertyList;
		}
		
		function propertyListToSvgList(propertyList, prefix, suffix)
		{
			var proplist = ''; 
			propertyList.forEach(function(prop){
				proplist += prefix + prop.key + ": " + prop.value + suffix;
			})
			return proplist;
		}
		
		function getUpdatedProperties(propListFrom, propListTo)
		{
			
			var updatedProperties = [];
			propListFrom.forEach(function(fromProp){				
				var foundProp = false;
				propListTo.forEach(function(toProp){
					if (fromProp.key == toProp.key){
						foundProp = true;
						if (fromProp.value != toProp.value)
						{
							updatedProperties.push({property:toProp, updateType:'update'});
						}
					}
						
				})
				if (!foundProp){ //toProps did not have the property, the property must have been deleted.
					updatedProperties.push({property:fromProp, updateType:'delete'});
				}
			});
			
			//check for new properties (will be in the ToList but not the FromList)
			propListTo.forEach(function(toProp){
				var foundProp = false;
				propListFrom.forEach(function(fromProp){
					if (fromProp.key == toProp.key){
						foundProp = true;
					}
				});
				if (!foundProp){ //fromProps did not have the property, the property must be new.
					updatedProperties.push({property:toProp, updateType:'create'});
				}
			});
			
			return updatedProperties;
		}
		
		function createChildNode(parentNodeId, newNodeName, nodeProperties, relationName, relationProperties)
		{
			var _callback = function (ids) {
				for (var i = 0; i < ids.length; i++) {
					var newNode = globals.GRAPH.getNode(ids[i]);
					//globals.layout.pinNode(newNode, true);
					//var parentPosition = globals.layout.getNodePosition(parentNodeId);
					//globals.layout.setNodePosition(ids[i], parentPosition.x, parentPosition.y);
					globals.dataService.CreateRelation_AddToGraph_ReturnLink(parentNodeId, ids[i], [relationName], relationProperties);
				}
			}
			globals.dataService.CreateEntityReturnCallbackWithIds(newNodeName, nodeProperties, _callback);
		}
function calculateDistance(pos1, pos2){
	return Math.sqrt(Math.pow(pos2.x - pos1.x,2) + Math.pow(pos2.y - pos1.y,2));
}
		
function parseDataType(n, _type) {

	if (_type)
	{
		switch (_type) {
		    case "string":
		        return '"' + n + '"';
		        break;
		    case "number":
		        if (!isNaN(parseFloat(n)) && isFinite(n)) return Number(n);
		        break;
		    case "other": //boolean
		        if (n == "true") { return true; }
		        if (n == "false") { return false; }
		        break;
		    case "array":
		                
		        return '[' + n.split(',').map(function (m) { return '"' + m + '"' }).join() + ']';
		        break;
 		}
	}


	if (n=="true"){return true;}
	if (n=="false"){return false;}
	if (n=="null"){return null;}
	if (n=="undefined"){return undefined;}
	if (!isNaN(parseFloat(n)) && isFinite(n)) return Number(n);

	return '"' + n + '"';
}

var sort_by = function(field, reverse, primer){
	var key = primer ? 
		function(x) {return primer(x[field])} : 
		function(x) {return x[field]};
	reverse = !reverse ? 1 : -1;
	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		} 
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}
//RGB to #HEX
function rgb2hex(red, green, blue) {
		var rgb = blue | (green << 8) | (red << 16);
		return '#' + (0x1000000 + rgb).toString(16).slice(1)
	}

		
function sleepFor( sleepDuration ){
	var now = new Date().getTime();
	while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
		
		
		
function getType(p) {
	if (Array.isArray(p)) return 'array';
	else if (typeof p == 'string') return 'string';
	else if (p != null && typeof p == 'object') return 'object';
	else if (p != null && typeof p == 'number') return 'number';
	else return 'other';
}
function EntityEventsHelper(){

  var eventBehaviourMapping = [
    { name: 'AutoImage',            event: addEntityToGraph_beforeNodeAdd,   func: new NodeBehavioursApi().AutoImageToConfig },
    { name: 'SubnodesForLinks',     event: addEntityToGraph_afterNodeAdd,    func: new NodeBehavioursApi().CreateSubNodesFromLinks },
    { name: 'FetchLinkOnDblClick',  event: nodeDoubleClick,           func: new NodeBehavioursApi().FetchNodeLinks }
  ]
  
  this.AddEntityToGraph_beforeConfigLoad = function(nodeData){addEntityToGraph_beforeConfig(nodeData);}
  
  this.AddEntityToGraph_beforeNodeAdd = function(nodeData){addEntityToGraph_beforeNodeAdd(nodeData);}
  
  this.AddEntityToGraph_afterNodeAdd = function(node){addEntityToGraph_afterNodeAdd(node)}
  
  this.NodeDblClick = function(node){nodeDoubleClick(node)}

  function addEntityToGraph_beforeConfig(nodeData){
    executeConfigBehaviors(nodeData, addEntityToGraph_beforeConfig.name, nodeData.id);
  }

  function addEntityToGraph_beforeNodeAdd(nodeData){
    executeConfigBehaviors(nodeData, addEntityToGraph_beforeNodeAdd.name, nodeData.id);
  }
  
  function addEntityToGraph_afterNodeAdd(node){
    executeConfigBehaviors(node, addEntityToGraph_afterNodeAdd.name, node.id);
  }

  function nodeDoubleClick(node){
    executeConfigBehaviors(node, nodeDoubleClick.name, node.id);
  }

  function executeConfigBehaviors(eventData, eventName, nodeId){
    var behaviours = getBehavioursForNodeAndEvent(eventName, nodeId);
    behaviours.forEach(function(behaviourFunction){
      behaviourFunction(eventData)
    });
  }

  function getBehavioursForNodeAndEvent(eventName, entityId){
    var behaviourFunctions = [];
    var configHelper = new ConfigHelper();
    var config = configHelper.GetConfigForEntityId(entityId);
    config.config.behaviours.forEach(function(behaviourName){  
      eventBehaviourMapping.forEach(function(eb){
        if (eb.name == behaviourName && eb.event.name == eventName)
          behaviourFunctions.push(eb.func);
      });
    });
    return behaviourFunctions;
  }

}

//Graph functions



function unPinAllNodes() {
  globals.nodeList.forEach(function(node) {
    globals.layout.pinNode(node,false);
    node.data.isPinned=false;
  });
}

function uncheckAll() {
  //check nodes
  globals.nodeList.forEach(function(node) {
    uncheckNode(node);
  });
  //check links
  globals.linkList.forEach(function(link) {
    new LinkHelper().UncheckLink(link);
  });
}

function checkAll() {
  //check nodes
  globals.nodeList.forEach(function(node) {
    checkNode(node);
  });
  //check links
  globals.linkList.forEach(function(link) {
    new LinkHelper().checkLink(link);
  });
}

function setScreenDragType(key) {
  globals.viewOptions.screenDragType=key;
}

function getDataRootNodes() {
  var rootNodes=[];
  globals.nodeList.forEach(function(node) {
    if(node.data.fromNodes.length==0) {
      rootNodes.push(node);
    }
  });
  return rootNodes;
}

function arrangeBy(rootNode,processedNodeIds,maxxRight,maxxLeft,level,startY) {

  if(!rootNode) {
    squares=[];
    var startPos=globals.layout.getNodePosition(globals.nodeList[0].id);
    var rootNodes=getDataRootNodes();
    processedNodeIds=[];

    var startpos=startPos.x;
    globals.nodeList.forEach(function(node) {
      globals.layout.pinNode(node,true);
      node.data.isPinned=true;
      startpos+=100;
      globals.layout.setNodePosition(node.id,startpos,startPos.y);
    });

    maxxRight=startPos.x;
    maxxLeft=startPos.x;
    startY=startPos.y;
    rootNodes.forEach(function(rootNode,index) {
      maxxRight=arrangeBy(rootNode,processedNodeIds,maxxRight,maxxLeft,0,startY);
    });
  }
  else {


    level++;
    processedNodeIds.push(rootNode.id);
    var rootNodePos=globals.layout.getNodePosition(rootNode.id);
    var cb=rootNodePos.x-((rootNode.data.toNodes.length*100)/2)
    rootNode.data.toNodes.forEach(function(childNode,index) {
      var childNodePos=globals.layout.getNodePosition(childNode.id);
      childNodePos.x=cb+(100*index);
      if(childNodePos.x+100>=maxxRight) { maxxRight=childNodePos.x+100; }
      if(childNodePos.x<=maxxLeft) { maxxLeft=maxxLeft-100; maxxRight=maxxRight+100; }
      var childLevel=startY+(level*150);
      if(childLevel>childNodePos.y) { childNodePos.y=childLevel };
      globals.layout.setNodePosition(childNode.id,childNodePos.x,childNodePos.y);

      if(processedNodeIds.indexOf(childNode.id)<0) {
        arrangeBy(childNode,processedNodeIds,maxxRight,maxxLeft,level,startY);
      }
      else //cyclic relation
      {
        //globals.layout.pinNode(node, false);
        //node.data.isPinned = false;
      }
    });
  }
  return maxxRight;

}

function arrangeBy2(rootNode,processedNodeIds,posLeft,posTop,level) {
  if(!rootNode) {
    squares=[];
    var startPos=globals.layout.getNodePosition(globals.nodeList[0].id);
    var rootNodes=getDataRootNodes();
    processedNodeIds=[];
    globals.nodeList.forEach(function(node) {
      globals.layout.pinNode(node,true);
      node.data.isPinned=true;
      globals.layout.setNodePosition(node.id,startPos.x,startPos.y);
    });

    posLeft=startPos.x;
    posTop=startPos.y;
    var rootTop=startPos.y;
    rootNodes.forEach(function(rootNode,index) {
      posTop+=100;
      posTop=arrangeBy2(rootNode,processedNodeIds,posLeft,posTop,0);
      var parentPos=rootTop+((posTop-rootTop)/2);
      globals.layout.setNodePosition(rootNode.id,posLeft,parentPos);
      rootTop=posTop;
    });
  }
  else {
    level++;
    processedNodeIds.push(rootNode.id);
    var rootNodePos={ x: posLeft,y: posTop };
    posLeft+=200;
    var currentChildTop=posTop-100;
    rootNode.data.toNodes.forEach(function(childNode,index) {
      if(processedNodeIds.indexOf(childNode.id)<0) {
        currentChildTop+=100;
        globals.layout.setNodePosition(childNode.id,posLeft,currentChildTop);
        posTop=arrangeBy2(childNode,processedNodeIds,posLeft,currentChildTop,level);
      }
    });
  }
  return posTop;
}

function addNodeToGraph(nodeId,nodeData) {
  var node=globals.GRAPH.getNode(nodeId);
  node=globals.GRAPH.addNode(nodeId,nodeData);
  fixTextWidth4Node(node);
  return node;
}

function highlightLabel(labelIndex) {
  var nodeLabel=globals.labelsList[labelIndex];
  globals.nodeList.forEach(function(node) {
    node.data.UI.fullUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity);
    node.data.UI.bodyUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity);
    if(nodeLabel&&node.data.labels.indexOf(nodeLabel.name)==-1) {
      node.data.UI.fullUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity/5)
      node.data.UI.bodyUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity/5);
    }
  });
}

function addPlannedLink(fromNodeID,toNodeID,linkName,linkProperties) {
  var plannedLinkData=new linkDataType()
  plannedLinkData.fromNode=fromNodeID;
  plannedLinkData.toNode=toNodeID;
  plannedLinkData.id=fromNodeID+'_'+toNodeID+' '+linkName;
  plannedLinkData.name=linkName;
  plannedLinkData.displayLabel=linkName;
  plannedLinkData.linkType='planned';
  plannedLinkData.color='red';
  link=globals.GRAPH.addLink(fromNodeID,toNodeID,plannedLinkData);
  globals.linkList.push(link);
}

function addDataLink(fromNodeID,toNodeID,linkData,_sourceConfig) {
  linkData.sourceConfig=_sourceConfig?_sourceConfig:globals.currentTheme.sourceConfig;
  var bIsNew=false;
  var link;
  var existingLink=getDataLink(linkData.id);

  if(existingLink) {
    var updatedProperties=getUpdatedProperties(linkData.properties,existingLink.data.properties);
    if(linkData.name!=existingLink.data.name||updatedProperties.length>0) {
      existingLink.data.name=linkData.name;
      existingLink.data.displayLabel=linkData.name;
      existingLink.data.properties=linkData.properties;
      globals.animUpdateLinks.push(existingLink);
    }
    link=existingLink;
    fromNodeID=existingLink.data.fromNodeID;
    toNodeID=existingLink.data.toNodeID;
  }
  else {
    bIsNew=true;
    link=globals.GRAPH.addLink(fromNodeID,toNodeID,linkData);
    link.data.fromNodeID=fromNodeID;
    link.data.toNodeID=toNodeID;
    link.data.displayLabel=linkData.name;
    globals.linkList.push(link);
    new LinkHelper().FixLinkIndexes(fromNodeID,toNodeID);
  }

  var toNode=globals.GRAPH.getNode(toNodeID);
  var fromNode=globals.GRAPH.getNode(fromNodeID);

  globals.config_ext.startupOptions.linkDisplayValues.map(function(lconfig) {
    var useConfig=true;
    if(lconfig.labelFrom) { useConfig=(lconfig.labelFrom==fromNode.data.labels[0])?useConfig:false } else { useConfig=false; }
    if(lconfig.labelTo) { useConfig=(lconfig.labelTo==toNode.data.labels[0])?useConfig:false } else { useConfig=false; }
    if(lconfig.type) { useConfig=(lconfig.type==link.data.name)?useConfig:false } else { useConfig=false; }
    if(useConfig) {
      link.data.config=lconfig;
      link.data.displayLabel=lconfig.displayField;
      var propertyValue=getNodePropertyValue(link.data.properties,lconfig.displayField);
      link.data.displayLabel=propertyValue?propertyValue:' ';
    }
  });
  new LinkHelper().RefreshLinkVisual(link);

  if(bIsNew) {
    toNode.data.fromLinks.push(link);
    toNode.data.fromNodes.push(fromNode);
    fromNode.data.toLinks.push(link);
    fromNode.data.toNodes.push(toNode);
  }

  new LinkHelper().FixTextWidth4Link(link);

  return link;
}



function addDataNode(nodeId, nodeData, _sourceConfig) {
  var nodeUI;
  var isNewNode=false;
  //if(!_sourceConfig) _sourceConfig=globals.config_ext;
  //var configHelper=new ConfigHelper();
  //nodeData.sourceConfig=configHelper.getConfig(_sourceConfig);

  var node = getExistingNode(nodeId);
  if(node) {
    var newLabels=[];
    nodeUI = globals.graphics.getNodeUI(nodeId);
    nodeData.labels.forEach(function(newLabel) {
      var hasLabel=false;
      for(var i=0;i<nodeData.labels.length;i++) {
        if(nodeData.labels[i]==newLabel) {
          hasLabel=true;
          break;
        }
      };
      if(!hasLabel) { newLabels.push(newLabel) }
    });

    var updatedProperties=getUpdatedProperties(node.data.properties,nodeData.properties);
    if(newLabels.length>0||updatedProperties.length>0) {
      if(nodeData.UI.displayTextUI) {
        nodeData.UI.displayTextUI.innerHTML=propertyListToSvgList(nodeData.properties,'<tspan x="50" dy="1.2em">','</tspan>');
      }
      node.data.labels=nodeData.labels;
      node.data.properties=nodeData.properties;
      globals.animUpdateNodes.push(node);
    }
    else {//no changes have been made to the node...
      return; //NOTE: DO NOT RETURN THE DATA-NODE
    }
  }
  else {
    isNewNode=true;
    nodeUI=globals.graphics.getNodeUI(nodeId);
  }

  var thisNodeData=nodeData;
  var thisIsNewNode=isNewNode;
  //var this_sourceConfig = _sourceConfig;

  //set display attributes based on config...
  if(thisNodeData.config.nodeDisplayBody.size) { thisNodeData.nodeSize=thisNodeData.config.nodeDisplayBody.size };

  setupDisplayLabels(thisNodeData);

  if(thisIsNewNode) {
    var eventsHelper = new EntityEventsHelper();
    setNodeColor(thisNodeData);
    eventsHelper.AddEntityToGraph_beforeNodeAdd(thisNodeData);
    node=addNodeToGraph(thisNodeData.id,thisNodeData);
    //PerformNodeStatFunctions(node);
    recordTypeInfo(node);
    eventsHelper.AddEntityToGraph_afterNodeAdd(node);
    return node; //RETURN ONLY IF NODE IS NEW
  }
}

function setupDisplayLabels(thisNodeData) {
  var finalLabel='';
  thisNodeData.labels.forEach(function(nodeLabel,index) {
    if(finalLabel) { finalLabel+=', '+finalLabel }
    if(!finalLabel) { finalLabel=''; }
    if(finalLabel=="") {
      finalLabel=nodeLabel;
    }
  });
  //set display label...
  thisNodeData.displayLabel="";
  var configDisplayValueOptions=thisNodeData.entityConfig.config.attributes.labelText["displayData"];

  if(!configDisplayValueOptions) {
    thisNodeData.displayLabel=finalLabel;
  } else if(configDisplayValueOptions.key==="property") {
    thisNodeData.displayLabel=getNodePropertyValue(thisNodeData.properties,configDisplayValueOptions.value);
  } else if(configDisplayValueOptions.key==="static") {
    thisNodeData.displayLabel=configDisplayValueOptions.value;
  } else if(configDisplayValueOptions.key==="first") {
    for(var i=0;i<configDisplayValueOptions.value.length;i++) {
      var potentialFieldValue=getNodePropertyValue(thisNodeData.properties,configDisplayValueOptions.value[i]);
      if(potentialFieldValue) {
        thisNodeData.displayLabel=potentialFieldValue;
        break;
      }
    }
  }
  if(!thisNodeData.displayLabel||thisNodeData.displayLabel=='') {
    thisNodeData.displayLabel=" ";
  }

  if(thisNodeData.config.nodeDisplayValues.circleText) {
    if(thisNodeData.circleText!="") {
      thisNodeData.circleText+'\n';
    }
    var propertyValue=getNodePropertyValue(thisNodeData.properties,thisNodeData.config.nodeDisplayValues.displayField);
    thisNodeData.circleText+=propertyValue?propertyValue:' ';
  }
  else {
    thisNodeData.circleText=finalLabel;
  }

}

function setNodeColor(entityData) {
  //entityData.displayLabel;
  var aNeoLabel=getNeoLabel(entityData.labels[0]);
  if(aNeoLabel) {

    if(!entityData.entityConfig.config.attributes["background-color"]) {
      entityData.entityConfig.config.attributes["background-color"]=aNeoLabel.color;
    }

    entityData.nodeColorRGB=aNeoLabel.colorRGB;
    entityData.nodeColor=rgb2hex(entityData.nodeColorRGB.r,entityData.nodeColorRGB.g,entityData.nodeColorRGB.b);

    if(!entityData.entityConfig.config.attributes["border-color"]) {
      var nodeBorderColorRGB={
        r: entityData.nodeColorRGB.r-50,
        g: entityData.nodeColorRGB.g-50,
        b: entityData.nodeColorRGB.b-50
      }
      var nodeColorHex=rgb2hex(nodeBorderColorRGB.r,nodeBorderColorRGB.g,nodeBorderColorRGB.b);
      entityData.entityConfig.config.attributes["border-color"]=nodeColorHex;
      entityData.nodeBorderColor=nodeColorHex;
    }
    //entityData.nodeColor = aNeoLabel.color;
    //entityData.nodeBorderColor = rgb2hex(entityData.nodeColorRGB.r-20, entityData.nodeColorRGB.g-20, entityData.nodeColorRGB.b-20);
  }
}

function recordTypeInfo(node) {
  var graphHelper=new GraphHelper();
  graphHelper.AddToEntityTypeDefs(node);
  globals.nodeList.push(node);
}

function addEntityLabel(labelName,_addInstanceCount,entityConfig) {
  var existingDataLabel=getNeoLabel(labelName);
  if(existingDataLabel) {
    if(_addInstanceCount) { existingDataLabel.instanceCount+=_addInstanceCount };
    var fetchbutton=document.getElementById('labelSelector.fetcher.'+labelName)
    if(fetchbutton) { fetchbutton.innerHTML=existingDataLabel.instanceCount; }
    return existingDataLabel;
  }

  var rgbRange=entityConfig.config.attributes.rgbRange;
  var rgb={
    r: Math.ceil(getRandomArbitrary(rgbRange.min,rgbRange.max)),
    g: Math.ceil(getRandomArbitrary(rgbRange.min,rgbRange.max)),
    b: Math.ceil(getRandomArbitrary(rgbRange.min,rgbRange.max))
  }
  var randomColor=rgb2hex(rgb.r,rgb.g,rgb.b);
  var newDataLabel=new neoLabelType(labelName,randomColor,rgb,entityConfig);
  if(_addInstanceCount) { newDataLabel.instanceCount+=_addInstanceCount; }
  //Add new data label to labels-list
  globals.labelsList.push(newDataLabel);

  return newDataLabel;
}

function refreshEntitySelectors() {
  //Order label selectors...
  globals.labelsList.sort(sort_by('name',false,function(a) { if(a) { return a.toUpperCase() } }));
  //Add selector to HTML...
  var qbuilderFromEntitySelector=document.getElementById('qbuilder.from.entity');
  var color='gray';
  var button_onclick="globals.dataService.GetEntitiesByType(false, '')";
  var fetchButton='<div id="labelSelector.fetcher.All" class="forlabelselector mytooltip" onclick="'+button_onclick+'"><div class="mytooltiptext ttleft ttlower">Fetch from database</div></div>'
  var labelSelectorHtml='<table><tr><td><div onclick="highlightLabel()" class="labelSelectorItem" style="background-color:'+color+';">All</div></td><td>'+fetchButton+'</td></tr>';
  if(qbuilderFromEntitySelector) { qbuilderFromEntitySelector.innerHTML='<option value=""></option>'; }

  globals.labelsList.forEach(function(nodeLabel,index) {
    color=nodeLabel.data.sourceConfig.config.attributes.selector["background-color"];
    button_onclick="globals.dataService.GetEntitiesByType('"+nodeLabel.name+"', '')";

    labelSelectorHtml+=''
			+'<tr>'
			+'	<td>'
			+'		<div onclick="highlightLabel('+index+')" class="labelSelectorItem" style="background-color:'+color+';" > '
			+nodeLabel.name
			+'		</div>'
			+'	</td>'
			+'	<td>'
			+'		<div id="labelSelector.fetcher.'+nodeLabel.name+'" class="forlabelselector mytooltip pull-right" style="background-color:'+nodeLabel.color+'" onclick= "'+button_onclick+'" > '
			+nodeLabel.instanceCount
			+'			<div class="mytooltiptext ttleft ttupper">'
			+'				Fetch from database'
			+'			</div>'
			+'		</div>'
			+'	</td>'
			+'</tr>;'
    if(qbuilderFromEntitySelector) { qbuilderFromEntitySelector.innerHTML+='<option value="'+nodeLabel.name+'">'+nodeLabel.name+'</option>'; }
  });
  labelSelectorHtml+='</table>';
  var LabelsDiv=document.getElementById('selectorLabels');
  if(LabelsDiv) { LabelsDiv.innerHTML=labelSelectorHtml; }
}

function removeNodeFromStage(nodeID) {
  if(!nodeID) { nodeID=globals.selectedNodeID; }
  var node=globals.GRAPH.getNode(nodeID);

  var relativeLinks=node.data.toLinks.concat(node.data.fromLinks);
  relativeLinks.forEach(function(link) {
    removeLinkFromStage(link.id);
    //globals.GRAPH.removeLink(link.id);
  });

  //var allNodeLists = globals.nodeList.concat(node.data.toNodes.concat(node.data.fromNodes));
  var i=-1;
  while(++i<globals.nodeList.length)
    if(globals.nodeList[i].id==nodeID)
      globals.nodeList.splice(i,1);
  var i=-1;
  while(++i<globals.monitoredNodes.length)
    if(globals.monitoredNodes[i].id==nodeID)
      globals.monitoredNodes.splice(i,1);
  var i=-1;
  while(++i<globals.checkedNodes.length)
    if(globals.checkedNodes[i].id==nodeID)
      globals.checkedNodes.splice(i,1);

  globals.nodeList.forEach(function(node) {
    var i=-1;
    while(++i<node.data.toNodes.length)
      if(node.data.toNodes[i].id==nodeID)
        node.data.toNodes.splice(i,1);
    var i=-1;
    while(++i<node.data.fromNodes.length)
      if(node.data.fromNodes[i].id==nodeID)
        node.data.fromNodes.splice(i,1);
    var i=-1;
    while(++i<node.data.toLinks.length)
      if(node.data.toLinks[i].toNodeID==nodeID)
        node.data.toLinks.splice(i,1);
    var i=-1;
    while(++i<node.data.fromLinks.length)
      if(node.data.fromLinks[i].fromNodeID==nodeID)
        node.data.fromLinks.splice(i,1);
  });

  globals.GRAPH.removeNode(nodeID);

  globals.consoleService.hideNodeFlyout();
}

function removeLinkFromStage(linkID) {
  if(!linkID) { linkID=globals.selectedLink.data.id; }

  var link=new LinkHelper().GetLinkById(linkID);
  var i=-1;
  while(++i<globals.linkList.length)
    if(globals.linkList[i].id==linkID)
      globals.linkList.splice(i,1);
  var i=-1;
  while(++i<globals.monitoredLinks.length)
    if(globals.monitoredLinks[i].id==linkID)
      globals.monitoredLinks.splice(i,1);

  var fromNode=globals.GRAPH.getNode(link.data.fromNodeID);
  var toNode=globals.GRAPH.getNode(link.data.toNodeID);
  var i=-1;
  while(++i<fromNode.data.toNodes.length)
    if(fromNode.data.toNodes[i].id==link.data.toNodeID)
      fromNode.data.toNodes.splice(i,1);
  var i=-1;
  while(++i<toNode.data.fromNodes.length)
    if(toNode.data.fromNodes[i].id==link.data.fromNodeID)
      toNode.data.fromNodes.splice(i,1);

  var i=-1;
  while(++i<fromNode.links.length)
    if(fromNode.links[i].id==link.id)
      fromNode.links.splice(i,1);
  var i=-1;
  while(++i<toNode.links.length)
    if(toNode.links[i].id==link.id)
      toNode.links.splice(i,1);

  var i=-1;
  while(++i<fromNode.data.toLinks.length)
    if(fromNode.data.toLinks[i].id==link.id)
      fromNode.data.toLinks.splice(i,1);
  var i=-1;
  while(++i<toNode.data.fromLinks.length)
    if(toNode.data.fromLinks[i].id==link.id)
      toNode.data.fromLinks.splice(i,1);

  globals.GRAPH.removeLink(link);
}


function getExistingNode(nodeID) {
  for(var i=0;i<globals.nodeList.length;i++) {
    if(globals.nodeList[i].id==nodeID) {
      return globals.nodeList[i];
    }
  }
}


function getNodesByMatchingLabels(nodesList,labels) {
  var returnNodeList=[];
  //iterate through 
  nodesList.forEach(function(node) {
    var nodeEligible=true;
    labels.forEach(function(nodeLabel) {
      var labelFound=false;
      node.data.labels.forEach(function(nodelabel) {
        if(nodelabel==nodeLabel)
          labelFound=true;
      });
      if(!labelFound) { nodeEligible=false }
    });
    if(nodeEligible) { returnNodeList.push(node); }
  });
  return returnNodeList;
}

function getNodesByMatchingProperties(nodesList,properties) {
  var returnNodeList=[];
  //iterate through 
  nodesList.forEach(function(node) {
    var nodeEligible=true;
    properties.forEach(function(prop) {
      var propFound=false;
      node.data.properties.forEach(function(nodeprop) {
        if(prop.key==nodeprop.key&&prop.value==nodeprop.value) {
          propFound=true;
        }
      });
      if(!propFound) { nodeEligible=false; }
    });
    if(nodeEligible) { returnNodeList.push(node); }
  });
  return returnNodeList;
}

function getNeoLabel(byName) {
  var x;
  globals.labelsList.forEach(function(labelobj,index) {
    if(labelobj.name==byName) { // &&  labelobj.data.sourceConfig.prefix == sourcePrefix){
      x=labelobj;
      return labelobj;
    }
  });
  return x;
}
function getDataLink(id) {
  for(var i=0;i<globals.linkList.length;i++) {
    if(globals.linkList[i].data.id==id) {
      return globals.linkList[i];
    }
  }
}
function getDataLinks(fromNodeID,toNodeID,direction) {

  var x=[];
  globals.linkList.forEach(function(link,index) {
    switch(direction) {
      case 'same':
        if(link.fromId==Number(fromNodeID)&&link.toId==Number(toNodeID)) {
          x.push(link);
        }
        break;
      case 'opposite':
        if(link.toId==Number(fromNodeID)&&link.fromId==Number(toNodeID)) {
          x.push(link);
        }
        break;
      default:
        if((link.fromId==Number(fromNodeID)&&link.toId==Number(toNodeID))||
					(link.toId==Number(fromNodeID)&&link.fromId==Number(toNodeID))) {
          x.push(link);
        }
        break;
    }
  });
  return x;
}


function getConfigByPrefix(configPrefix) {
  for(var i=0;i<globals.masterConfigs.length;i++) {
    if(globals.masterConfigs[i].prefix==configPrefix) {
      return globals.masterConfigs[i];
    }
  }
}

//Node methods

function applyPopoutEffectToNode(newNode, parentNodeId) {
	globals.layout.pinNode(newNode, true);
	var pos = globals.layout.getNodePosition(parentNodeId);
	var nodeRadius = Number(newNode.data.entityConfig.config.attributes["radius"]);
	globals.layout.setNodePosition(newNode.id,
		getRandomArbitrary(pos.x - nodeRadius / 2, pos.x + nodeRadius / 2),
		getRandomArbitrary(pos.y - nodeRadius / 2, pos.y + nodeRadius / 2)
	);
	globals.layout.pinNode(newNode, false);
}

function applyPopoutEffectToNodesById(parentNodeId, newNodeId) {
	var newNode = globals.GRAPH.getNode(newNodeId);
  globals.layout.pinNode(newNode, true);
	var pos = globals.layout.getNodePosition(parentNodeId);
	var nodeRadius = Number(newNode.data.entityConfig.config.attributes["radius"]);
	globals.layout.setNodePosition(newNode.id,
		getRandomArbitrary(pos.x - nodeRadius / 2, pos.x + nodeRadius / 2),
		getRandomArbitrary(pos.y - nodeRadius / 2, pos.y + nodeRadius / 2)
	);
	globals.layout.pinNode(newNode, false);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function fixTextWidth4Node(node)
{
	
	//adjust display text...
	if (node.data.UI.bodyUI && node.data.UI.displayTextUI)
	{
		//if (!node.data.sourceConfig.displaySettings.showLabels) {return;}
		var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]); //UI.fullUI.attr('r');//nodeUI.attr('r');
		var widthOfNode = Number(node.data.UI.bodyUI.getBBox().width);
		var minWidth = widthOfNode - widthOfNode * 0.1;
		var widthOfText = Number(node.data.UI.displayTextUI.getBBox().width);
		var text = node.data.UI.displayTextUI.text();
		var heightOfText = Number(node.data.UI.displayTextUI.getBBox().height);
		if (!text || text.length == 0) {return;}

		if (node.data.entityConfig.config.attributes.labelText["labelPosition"]) {
			switch(node.data.entityConfig.config.attributes.labelText["labelPosition"]){
				case "above":
					node.data.UI.displayTextUI.attr('x', -widthOfText/2 ); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', -heightOfText - nodeRadius/3);
					break;
				case "under":
					node.data.UI.displayTextUI.attr('x', -widthOfText/2); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', nodeRadius + heightOfText);
					break;
				case "center":
					node.data.UI.displayTextUI.attr('x', -widthOfText / 2); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', heightOfText / 3);
					break;
				case "right":
					node.data.UI.displayTextUI.attr('x', nodeRadius + nodeRadius/3); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', heightOfText/3);
					break;
				case "left":
					node.data.UI.displayTextUI.attr('x', -(widthOfText + nodeRadius + nodeRadius/3)); //-minWidth/2);
					node.data.UI.displayTextUI.attr('y', heightOfText/3);
					break;
			}
		}
		else{
				
			var failer = 0;
			var sizingConfigValue = node.data.entityConfig.config.attributes.labelText["labelSizing"];
			if (widthOfText > minWidth)
			{
				while (widthOfText >= minWidth)
				{
					failer++;
					if (sizingConfigValue == 'hyphenate')
					{
						text = (text).substring(0, text.length - 2) + "'";
						node.data.UI.displayTextUI.text(text);
					}
					else if (sizingConfigValue == 'fontsize') {
						var fontsize = Number(node.data.UI.displayTextUI.attr('font-size'));
						node.data.UI.displayTextUI.attr('font-size', fontsize * 0.9);
					}
					else
					{
						return;
					};
					widthOfText = Number(node.data.UI.displayTextUI.getBBox().width);
					if (failer > 1000) return;
				}
			}
			else if (sizingConfigValue == 'fontsize')
			{	failer = 0;		
						
				while (widthOfText < minWidth - widthOfText)
				{
					failer++;
					var fontsize = Number(node.data.UI.displayTextUI.attr('font-size'));
					node.data.UI.displayTextUI.attr('font-size', fontsize*1.1);
					widthOfText = Number(node.data.UI.displayTextUI.getBBox().width);
					if (failer > 1000) return;
				}
			}					
			heightOfText = Number(node.data.UI.displayTextUI.getBBox().height);
			node.data.UI.displayTextUI.attr('x', -widthOfText/2);
			node.data.UI.displayTextUI.attr('y',  heightOfText/3 );
		}
	}
	//adjust size of popout text...
	if(node.data.UI.popoutBodyUI)
	{	
		var boxheight = 0;
		var boxwidth = 0;
		if (node.data.UI.popoutTextUI && node.data.UI.popoutTextUI.childNodes.length > 0){
			boxheight = Number(node.data.UI.popoutTextUI.getBBox().height + 20);
			boxwidth = Number(node.data.UI.popoutTextUI.getBBox().width + 30);
		}
		var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
		node.data.UI.popoutBodyUI.attr('height',boxheight);
		node.data.UI.fullUI.attr('style','width:'+boxwidth + 'px;');
		node.data.UI.popoutBodyUI.attr('x', nodeRadius + 10)
		node.data.UI.popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="'+ (nodeRadius + 15) +'" dy="1.2em">', '</tspan>');
	}
			
}
		

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function showOnNode(nodeId, text)
{
	var node = getExistingNode(nodeId);
	node.data.displayLabel = text;
	refreshNodeAppearance(nodeId);
}
		
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeSprings(nodeid)
{
	if (!nodeid){nodeid=globals.selectedNodeID;}
	var node = getExistingNode(nodeid);
			
	node.data.toNodes.forEach(function(toNode){
		var nodespring = globals.layout.getSpring(nodeid, toNode.id);
		nodespring.length += 10;
	});
	node.data.fromNodes.forEach(function(toNode){
		var nodespring = globals.layout.getSpring(toNode.id, nodeid);
		nodespring.length += 10;
	});
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeDepth(node, addDepthValue)
{
    //set defaults...
	if (!node){node=globals.selectedNode;}
	if (!addDepthValue){addDepthValue = 0.5;}
                      
    //perform transformations...
	node.data.depth += addDepthValue;

	refreshNodesDepths();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeDepth(node)
{
	if (!node){node=globals.selectedNode;}
	//nodeUI = globals.graphics.getNodeUI(nodeid);
	//nodeUI.attr('depth', Number(nodeUI.attr('depth')) - 0.1);

}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeSprings(nodeid)
{
	if (!nodeid){nodeid=globals.selectedNodeID;}
	var node = getExistingNode(nodeid);
			
	node.data.toNodes.forEach(function(toNode){
		var nodespring = globals.layout.getSpring(nodeid, toNode.id);
		nodespring.length -= 10;
	});
	node.data.fromNodes.forEach(function(toNode){
		var nodespring = globals.layout.getSpring(toNode.id, nodeid);
		nodespring.length -= 10;
	});
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function increaseNodeMass(nodeid)
{
	if (!nodeid){nodeid=globals.selectedNodeID;}
	var nodebod = globals.layout.getBody(nodeid);
	nodebod.mass++;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function decreaseNodeMass(nodeid)
{
	if (!nodeid){nodeid=globals.selectedNodeID;}
	var nodebod = globals.layout.getBody(nodeid);
	nodebod.mass--;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function uncheckNode(node){
	if(node.data.UI.checkUI){
		node.data.UI.checkUI.remove();
		node.data.UI.checkUI = undefined;
	}
	if (globals.currentTheme.sourceConfig.displaySettings.loadNodePopouts){
		if(node.data.UI.popoutTextUI){node.data.UI.popoutTextUI.attr('class','slidetext');}
	}
}
		
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function highlightSelectedNode(nodeId) {
		   
	if (globals.selectedNodeID != ''){
		if (nodeId == globals.selectedNodeID) {return;} //...we've re-clicked the same node
		//DISPOSE PREVIOUS SELECTION
		//remove all sub nodes...
		if (globals.config_ext.viewOptions.subnodes.relations=="ifany"){
			while (globals.selectedNode.data.subNodes.length > 0){
				removeSubNode(globals.selectedNode.data.subNodes[0], false);
				globals.selectedNode.data.subNodes.splice(0,1);
			}
		};
		if (globals.currentTheme.sourceConfig.displaySettings.showRelationships == "on-highlight" && !globals.interactionOptions.checkNodes){
			//Remove previous selections visuals
			var relevantLinks = globals.selectedNode.data.toLinks.concat(globals.selectedNode.data.fromLinks);
			relevantLinks.forEach(function(link){
				new LinkHelper().UnHighlightLink(link,false);
			});
		}
   
		if (globals.bRelate == true)
		{
			if (nodeId != globals.selectedNodeID){
				submitCreateRelation(globals.selectedNodeID, nodeId)
			}
			globals.bRelate=false;
		}
			   
		if (globals.bPlanRelate==true)
		{
			if (nodeId != globals.selectedNodeID){
				submitCreateRelation(globals.selectedNodeID, nodeId, true)
			}
			globals.bPlanRelate=false;
		}
			   
	}

	var node = globals.GRAPH.getNode(nodeId);
	globals.selectedNodeID = nodeId;
	globals.selectedNodeData = node.data;
	globals.selectedNode = node;

	if (globals.interactionOptions.checkNodes){
		checkNode(node);
	}
	else{ //...not checking nodes...
		globals.checkedNodes.forEach(function(nodex){
			uncheckNode(nodex);
		});
		globals.checkedNodes = [];
	}
		   
	//Display relationship details...
	node.data.toLinks.forEach(function(l){
    new LinkHelper().HighlightLink(l,true)
  });
	node.data.fromLinks.forEach(function(l){
    new LinkHelper().HighlightLink(l,true)
  });

	addSelectionGraphic(node);

	loadNodePopout(node, node.data.sourceConfig);

	//showNodeDetailsInToolPanel(node);	

	//show sub nodes...
	if (globals.config_ext.viewOptions.subnodes.relations=="ifany"){
		var diffCount = node.data.stats.toEntityCount - node.data.toLinks.length;
		if (diffCount > 0) {
			addSubNode(node, 'subto' + node.id, '#80ffe5', diffCount);
		}
		diffCount = node.data.stats.fromEntityCount - node.data.fromLinks.length;
		if (diffCount > 0) {
			addSubNode(node, 'subfrom' + node.id, '#99ccff', diffCount);
		}
	};
}

function addSelectionGraphic(node){
	node.data.UI.fullUI.insertBefore(globals.CommonUI.focusUI, node.data.UI.bodyUI);
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	node.data.UI.focusUI = globals.CommonUI.focusUI
		.attr('r', nodeRadius + (nodeRadius / 3))//...for circle
		.attr('stroke-width', nodeRadius / 5);

	node.data.UI.focusUI.attr('class', 'selectionRingOut');
	setTimeout(function () {
		node.data.UI.focusUI.attr('class', 'selectionRingIn');
	}, 200);
	
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function checkNode(node)
{
	globals.checkedNodes.push(node);
		//if(node.data.UI.fullUI){node.data.UI.fullUI.attr('stroke','#99ff33');}
	if(!node.data.UI.checkUI){
		var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
			globals.CommonUI.checkUI
				.attr('r', nodeRadius + nodeRadius/4)//...for circle
				.attr('stroke-width',nodeRadius/5);
			node.data.UI.checkUI = globals.CommonUI.checkUI.cloneNode();
			node.data.UI.fullUI.insertBefore(node.data.UI.checkUI, node.data.UI.bodyUI);
		}

		if (globals.currentTheme.sourceConfig.displaySettings.loadNodePopouts){
			if (!node.data.UI.popoutBodyUI){loadNodePopout(node);}
			if(node.data.UI.popoutTextUI){
				node.data.UI.popoutTextUI.attr('class','showtext');
			}
					
		}
				
}
		
function loadNodePopout(node, config)
{
	if (config.displaySettings.loadNodePopouts == false)
		return;
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	globals.CommonUI.popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="'+( nodeRadius + 15)+'" dy="1.2em">', '</tspan>');
			
	node.data.UI.popoutBodyUI = globals.CommonUI.popoutBodyUI.cloneNode(true);
	node.data.UI.fullUI.append(node.data.UI.popoutBodyUI);
			
	node.data.UI.popoutTextUI = globals.CommonUI.popoutTextUI.cloneNode(true);
	node.data.UI.fullUI.append(node.data.UI.popoutTextUI);

	fixTextWidth4Node(node);

	node.data.UI.popoutBodyUI.attr('class', 'slidebody');
	node.data.UI.popoutTextUI.attr('class', 'slidetext');
}
		
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//function showNodeDetailsInToolPanel(node)
//{
	//var processingElement = document.getElementById('selectedNode');
	//var labellist = ''
	//var html = '<div class="panelHead"><p>Selected Entity:</p></div>';
	////html += '<br/><a class="panelheader">Entity type</a>:<br/>' //+ labellist;
	//html += '<table>'
	//node.data.labels.forEach(function (nodeLabel, index) {
	//	if (index!=0){labellist += ', ';}
	//	//var button_onclick = 'globals.dataService.DeleteLabel(' + node.id + ', \'' + nodeLabel + '\')';
	//	html += '<tr>';
	//	html += '  <td>';
	//	html += '    <p class="dataNameLabel">Entity Number:</p>';
	//	html += '  </td>';
	//	html += '  <td>';
	//	html += '    <p class="dataValueLabel">' + globals.selectedNodeID + '</p>';
	//	html += '  </td>';
	//	html += '</tr>';

	//	html += '<tr>';
	//	//html += '  <td>';
	//	//html += '    <button class="paneloption mytooltip" onclick="' + button_onclick + '" >X';
	//	//html += '		<div class="mytooltiptext">delete label</div>';
	//	//html += '    </button>';
	//	//html += '  </td>';
	//	html += '  <td>';
	//	html += '    <p class="dataNameLabel">Entity Type:</p>';
	//	html += '  </td>';
	//	html += '  <td>';
	//	html += '    <p class="dataValueLabel">' + nodeLabel + '</p>';
	//	html += '  </td>';
	//	html += '</tr>';



	//});
	//html += '</table>'
			
			
	//processingElement.innerHTML = html;
			
	//html = '<div class="panelHead"><p>Properties:</p></div>';
	//html += '<table>'
	//var processingElement = document.getElementById('nodeDetails');
	//node.data.properties.forEach(function(property, index){
	//	html += '<tr>'
	//	var button_onclick = 'showOnNode(\'' + node.id + '\', \'' + property.value + '\')';
	//	html += '  <td>';
	//	html += '    <button class="paneloption mytooltip" onclick="' + button_onclick + '">';
	//	html += '      <i class="glyphicon glyphicon-eye-open sm"></i>';
	//	html += '      <div class="mytooltiptext ttupper">display in node</div>';
	//	html += '    </button>';
	//	html += '  </td>';
	//	html += '  <td> ';
	//	html += '    <p class="dataNameLabel">' + property.key + '</p>';
	//	html += '  </td>';
	//	html += '  <td>';
	//	html += '    <p class="dataValueLabel"> ' + property.value + '</p>';
	//	html += '  </td>';
	//	html += '</tr>'
	//});
	//html += '</table>'
	//processingElement.innerHTML = html;
			
	//UiShow_EditEntity(node);
	//node.data.properties.forEach(function(property, index){
	//	html += '<tr>'
	//	var button_onclick = 'showOnNode(' + node.id + ', \'' + property.value + '\')';
	//	html += '<td><button class="fortext mytooltip" onclick="'+button_onclick+'">O<div class="mytooltiptext">display in node</div></button></td><td> <a class="dataNameLabel">' + property.key + '</a></td><td><a class="dataValueLabel"> ' + property.value + '</a></td>';
	//	html += '</tr>'
	//});
			
//}
		
//function UiShow_EditEntity(node){
//	var updateElement = document.getElementById('new.entity.name');
//	var panel = document.getElementById('panel.entity.props');
//	panel.childNodes[0].innerHTML = '';
		    
//	node.data.properties.forEach(function(prop){
//		panelAddKeyValue('panel.entity.props', 'new.entity', prop.key, prop.value, prop.datatype);
//	});
//	if (updateElement)
//	{
//		updateElement.value = node.data.labels[0];
//	}
//}

function refreshNodeAppearance(nodeId){
	var node = globals.GRAPH.getNode(nodeId?nodeId:globals.selectedNodeID);
	addNodeToGraph(node.id, node.data);
	node.data.UI.fullUI.attr('transform', 'scale(' + node.data.depth + ')');

	if (node.data.depth > 1) {
		node.data.UI.fullUI.attr('opacity', 1 / node.data.depth);
	}
	else {
		node.data.UI.fullUI.attr('opacity', node.data.depth);
	}
}
		
function refreshNodesDepths() {
	var nodeZOrder = [];
	for (var n = 0; n < globals.nodeList.length; n++) {
		var inserted = false;
		for (var z = 0; z < nodeZOrder.length; z++) {
		    if (globals.nodeList[n].data.depth < nodeZOrder[z].data.depth) {
		        nodeZOrder.splice(z, 0, globals.nodeList[n]);
		        inserted = true;
		        break;
		    }
		}
		if (!inserted) { nodeZOrder.push(globals.nodeList[n]); }
	}
	nodeZOrder.forEach(function (znode) { refreshNodeAppearance(znode.id) });
}
			
function increaseNodeSize(nodeId)
{
	if (!nodeId){nodeId = globals.selectedNodeID;}
	var node = globals.GRAPH.getNode(nodeId);
	var nodeRadius = Number( node.data.entityConfig.config.attributes["radius"]);
	nodeRadius = nodeRadius + 50/nodeRadius;
	//node.data.UI.popoutBodyUI.attr('x', nodeRadius/2)
    //            .attr('y', -nodeRadius)
	//node.data.UI.popoutBodyUI.attr('x', nodeRadius/2)
    //            .attr('y', -nodeRadius)
						
	node.data.UI.bodyUI.attr('r', nodeRadius) //...for circle
	node.data.UI.imageUI.attr('x', -nodeRadius)
				.attr('y', -nodeRadius)
				.attr('rx', nodeRadius)
				.attr('width', nodeRadius * 2)
				.attr('height', nodeRadius * 2)
			
	node.data.toLinks.forEach(function (link){
		link.data.UI.fullUI.attr('fromNodeRadius', nodeRadius);
	});
	node.data.fromLinks.forEach(function (link){
		link.data.UI.fullUI.attr('toNodeRadius', nodeRadius);
	});

	increaseNodeSprings(node.id);
	fixTextWidth4Node(node);
		
}		
		
function decreaseNodeSize(nodeId)
{
	if (!nodeId){nodeId = globals.selectedNodeID;}
	var node = globals.GRAPH.getNode(nodeId);
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	node.data.entityConfig.config.attributes["radius"] = nodeRadius / 1.1;
	addNodeToGraph(node.id,node.data);
	decreaseNodeSprings(node.id);
}	
		
function unPinNode(node)
{
	globals.layout.pinNode(node, false);
	node.data.isPinned = false;
}
		

	

		
		
		
function PerformNodeStatFunctions(node)
{
		//procedurally execute stat-reachers...
		var reacherIndex = 0;
		var reachers = node.data.config.nodeStatReachers;
		if (reachers.length == 0){ExecuteNodeTransformers(node);}
		var fn_callback = function(){
			if (reacherIndex >= reachers.length){
				ExecuteNodeTransformers(node);
				return;
			}
			var reacherName = reachers[reacherIndex].functionName;
			reacherIndex = reacherIndex + 1;
			executeReacher(node.data, reacherName, fn_callback);
		};
		fn_callback();
}
		
function ExecuteNodeTransformers(node)
{
	var transformers = node.data.config.nodeTransformers;
			
	transformers.forEach(function(tranformer){
		switch (tranformer.name)
		{
			case "Petalize":
				/*petalize_image(dataNode, data, imageUrl, innerRadius, imageSize);*/
				petalize_image(node, tranformer.params[0], tranformer.params[1], tranformer.params[2], tranformer.params[3]);
				break;
			case "Ringulate":
				/*Ringulate(dataNode, data, imageUrl,  innerRadius, opacity, orientate);*/
				ringulate(node, tranformer.params[0]);
				break
		}
				
	});
}
		
function executeReacher(nodeData, reacherName, callback)
{
	var callWhenFinished = function(){callback();}
	switch(reacherName)
	{
		case "getRelationCounts": getRelationCounts(nodeData, callWhenFinished); break;
		default: callWhenFinished();
	}
}

function getNodeValueWithConstant(node, inputData){
	var x = node;
	var parts = inputData.split('.');
	parts.forEach(function (part){
		x = x[part];
	})
	return x;
}
		
function evaluateAugmentsAndUpdateNodeDisplay(config, nodeData)
{
	var nodeAugments = [];
	if (!config.startupOptions.nodeAugments){return;}
	config.startupOptions.nodeAugments.map(function (nconfig) {
		if (nconfig.nodeLabel == nodeData.labels[0]) {
			if (nconfig.property){ //...we need to check if it has the specified property
				if (hasProperty(nodeData.properties, nconfig.property)){
					if (nconfig.value){//...we need to check if it has the specified property value
						if (hasPropertyWithValue(nodeData.properties, nconfig.property, nconfig.value)){
							nodeAugments.push(nconfig.nodeDisplayBody);
						}
					}
					else{//, no value wanted, passed evaluation by having label and property name...
						nodeAugments.push(nconfig.nodeDisplayBody);
					}
				}
			}else{//, no property name wanted,, passed evaluation by having label...
				nodeAugments.push(nconfig.nodeDisplayBody);
			}
		}
	});		
	var finalDisplay = {};
	nodeAugments.forEach(function (nodeDisplayBody){
		for (var prop in nodeDisplayBody)
		{
			finalDisplay[prop] = nodeDisplayBody[prop];
		}
	})
	return finalDisplay;
}
		
//**********Generators**********
function addPetals()
{
	petalize(globals.selectedNode, 15, 0, 20, '#002533');
}
		
function getCircumferenceCoordinates(itemCount, radius)
{
	var coords = [];
	for(var i = 0; i < itemCount; i++) {
		var x = 0 + radius * Math.cos(2 * Math.PI * (i) / itemCount);
		var y = 0 + radius * Math.sin(2 * Math.PI * (i) / itemCount);   
		coords.push({x:x, y:y});
	}
	return coords;
}
		
		
function petalize_shape(node, petalCount, petalShapeIndex, innerRadius, petalColor)
{
	var PETAL_SHAPES = [];
	PETAL_SHAPES.push('M 0.03840601,0.01972475 C 8.2867315,0.11675375 31.858718,-12.453976 31.025552,-0.98099125 29.886875,14.699041 -0.03542154,2.5583847 0.03840601,0.01972475 Z');
	var degreeInterval = 360 /petalCount;
	var coords = getCircumferenceCoordinates(petalCount, innerRadius);
	var degreePosition = 0;
	var petalArray = Viva.Graph.svg('g')
	for (var i = 0; i < petalCount; i++){	
		var petal = Viva.Graph.svg('g');
		var petalPath =  Viva.Graph.svg('path')
			.attr('d', PETAL_SHAPES[petalShapeIndex])
			.attr('fill',petalColor)
			.attr('opacity',0.5)
			.attr('transform','translate(' + coords[i].x + ',' + coords[i].y + ') rotate('+degreePosition+')');				
		petal.append(petalPath);
		petalArray.append(petal);
		degreePosition += degreeInterval;
	}
	node.data.UI.fullUI.insertBefore(petalArray, node.data.UI.bodyUI);
}
		
		
function petalize_image(node, inputData, imageUrl, innerRadius, size)
{
	var petalCount = 0;
	if (typeof(inputData) == "number"){
		petalCount = inputData;
	}
	else if (typeof(inputData) == "string"){
		petalCount = getNodeValueWithConstant(node, inputData)
	}
		
	var degreeInterval = (360/petalCount);
	var coords = getCircumferenceCoordinates(petalCount, innerRadius);
	var degreePosition = 0;
	var petalArray = Viva.Graph.svg('g')
	for (var i = 0; i < petalCount; i++){	
		var petal = Viva.Graph.svg('g');
		var petalPath = Viva.Graph.svg('image')
		//var petalPath = Viva.Graph.svg('cirlce')
				//.attr('r','10')
				.link(imageUrl)
				.attr('width', Number(size))
				.attr('height', Number(size))
				.attr('transform','translate(' + coords[i].x + ',' + coords[i].y + ') rotate('+(degreePosition + 20)+')');
		petal.append(petalPath);
		//petal.attr('transform','rotate(10)');
		petalArray.append(petal);
		//petalArray.attr('transform','rotate(-90)');
		degreePosition += degreeInterval;
	}
	node.data.UI.fullUI.insertBefore(petalArray, node.data.UI.displayTextUI);
}
function ringulate(node, inputData)
{
	var petalCount = 0;
	if (typeof(inputData) == "number"){
		petalCount = inputData;
	}
	else if (typeof(inputData) == "string"){
		petalCount = getNodeValueWithConstant(node, inputData)
	}
	var petalArray = Viva.Graph.svg('g')
	for (var i = 0; i < petalCount; i++){	
		var petal = Viva.Graph.svg('g');
		var petalPath = Viva.Graph.svg('circle')
					.attr('cx', 0) //...for circle
					.attr('cy', 0)//...for circle
					.attr('r', Number(node.data.entityConfig.config.attributes["radius"]) + (i * 3))
					.attr('fill','transparent')//'#4dffc3')
					.attr('stroke',node.data.nodeColor)
					.attr('stroke-width',2)
		petal.append(petalPath);
		petalArray.append(petal);
	}
	node.data.UI.fullUI.insertBefore(petalArray, node.data.UI.bodyUI);
}
//********************************
		
function getRelationCounts(nodeData, callback)
{
			
	var updateIndicatorNode = function (toCount, fromCount){
				
		nodeData.stats.toEntityCount = toCount;
		nodeData.stats.fromEntityCount = fromCount;
		callback();
		//petalize(dataNode, dataNode.data.toEntityCount, 0, 10, '#0099ff');
		//petalize(dataNode, dataNode.data.fromEntityCount, 0, 20, '#ff6600');
		//petalize_image(dataNode, dataNode.data.toEntityCount, 'custom/server.svg', 10, '#0099ff');
		//petalize_image(dataNode, dataNode.data.fromEntityCount, 'custom/placeholder.svg', 30, '#0099ff');
	}
	globals.dataService.GetRelationCounts(nodeData.id, updateIndicatorNode);
}
		
function removeSubNode(subNode, updateSuperNode)
{
	if (updateSuperNode == true){
		subNode.superNodes.forEach(function(superNode,index){
			if (superNode){
				superNode.subNodes.map(function(sn, i){
					if (sn.id == subNode.id) {
						superNode.subNodes.splice(i,1);
					}
				})
			}
		})
	}
			
	subNode.data.fromLinks.forEach(function(link){globals.GRAPH.removeLink(link.id)});
	subNode.data.toLinks.forEach(function(link){globals.GRAPH.removeLink(link.id)});
	globals.GRAPH.removeNode(subNode.id);			
}
		
function addSubNode(parentNode, id, color, displayLabel)
{
	//console.log('Node', globals.GRAPH.getNode(id));
	var existingNode = globals.GRAPH.getNode(id);
	if (existingNode)
		return;
	var subNodeData = new nodeDataType();
	subNodeData.nodeSize = 5;
	subNodeData.nodeType = 'subnode';
	subNodeData.id = id; //'sub' + parentNode.id;
	subNodeData.labels = ['subnode'];
	subNodeData.nodeColor = color;
	
	subNodeData.displayLabel = displayLabel;
	subNodeData.superNodes.push(parentNode);
	//CREATE NODE
	var subNode = addNodeToGraph(subNodeData.id,subNodeData);	
	parentNode.data.subNodes.push(subNode)
			
	//popout effect
	globals.layout.pinNode(subNode, true);
	var pos = globals.layout.getNodePosition(parentNode.id);
	globals.binaryToggle = !globals.binaryToggle;
	//globals.layout.setNodePosition(subNode.id, pos.x + 10 * (globals.binaryToggle)?-1:1, pos.y + 10* (globals.binaryToggle)?-1:1);
	globals.layout.setNodePosition(subNode.id, pos.x + 10 * ((globals.binaryToggle)?-1:1), pos.y + 10* ((globals.binaryToggle)?-1:1));
	globals.layout.pinNode(subNode, false);

			
			
	var linkData = new linkDataType(parent.id, subNodeData.id, parent.id +' ' + subNodeData.id);
	linkData.linkType = 'sub';
	linkData.color = 'transparent';
	//linkData.fromNodeID = parent.id;
	//linkData.toNodeID = subNodeData.id;
	var toRelLink = globals.GRAPH.addLink(parentNode.id, subNodeData.id, linkData);
	subNode.data.fromLinks.push(toRelLink);
	
	//Adjust length of link...
	var nodespring = globals.layout.getSpring(parentNode.id, subNodeData.id);
	console.log('parentNode',parentNode);
	nodespring.length = Number(parentnode.data.entityConfig.config.attributes["radius"]); //30;

	//Adjust link bounciness...
	//var nodebody = globals.layout.getBody(id);
	//nodebody.mass = 1;

}
		

		
var ConsoleService = function () {

	this.hideNodeFlyout = function () {
		var nodeFlyout = document.getElementById('panel.node');
		nodeFlyout.classList.remove('fadein');
		nodeFlyout.classList.add('fadeout');
		setTimeout(function () {
			nodeFlyout.innerHTML = "";
			nodeFlyout.style.left = '-100px';
		}, 200);
	}

	this.ShowFlyout = function (node, x, y) {
		var nodeFlyout = document.getElementById('panel.node');
		var newContent = '';
		newContent += '<span class="header">'
		newContent += node.data.labels.toString();
		newContent += '</span>'

		newContent += '<span class="pull-right">'
		newContent += '		<span class="winbtn">'
		newContent += '			<i onclick="nodeFlyout_Event_PinClick(\'' + node.id + '\')" class="glyphicon glyphicon-pushpin"></i>'
		newContent += '		</span>'
		newContent += '</span>'

		newContent += '<span class="pull-right">'
		newContent += '		<span class="winbtn">'
		newContent += '			<i onclick="nodeFlyout_Event_HideClick(\'' + node.id + '\')" class="glyphicon glyphicon-eye-close pull-right"></i>'
		newContent += '		</span>'
		newContent += '</span>'

		newContent += '<table>'
		node.data.properties.forEach(function (prop) { 
			newContent += '  <tr>'
			newContent += '    <td>'
			newContent += '      <b>&nbsp' + prop.key + ':&nbsp</b>';
			newContent += '    <td>'
			newContent += '    <td>'
			newContent += prop.value;
			newContent += '    <td>'
			newContent += '  <tr>'
		});
		newContent += '</table>'

		newContent += '<div>'
		//console.log('node', node)
		node.data.config.nodeFlyout.forEach(function (element) {
			newContent += '<' + element.elementType;
			if (element.onclick)
				newContent += ' onclick="' + element.onclick + '"';
			newContent += '>';
			newContent += element.innerHTML;
			newContent += '</' + element.elementType + '>';
		});
		newContent += '</div>'
		//console.log('dialogHtml', newContent);
		showFlyout(x, y, newContent);
	}



	function showFlyout(x, y, newContent) {
		var nodeFlyout = document.getElementById('panel.node');
		nodeFlyout.classList.remove('fadein');
		nodeFlyout.classList.add('fadeout');
		setTimeout(function () {
			nodeFlyout.style.left = (x + 50) + 'px'; //(node.data.config.nodeDisplayBody.size + x) + 'px';
			nodeFlyout.style.top = (y - 30) + 'px'; //y + 'px';
			nodeFlyout.innerHTML = newContent;
			nodeFlyout.classList.remove('fadeout');
			nodeFlyout.classList.add('fadein');
		}, 200);

	}
}

function getNeoId(fromGraphId)
{
	return fromGraphId.substring(3); 
}
var HttpClient = function () {
	this.get = function (aUrl, aCallback) {
		var anHttpRequest = new XMLHttpRequest();
		anHttpRequest.onreadystatechange = function () {
			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
				aCallback(anHttpRequest.responseText);
		}

		anHttpRequest.open("GET", aUrl, true);
		anHttpRequest.send(null);
	}
}
function GraphHelper(){


  this.SelectNode = function(node){
    globals.selectedNode = node;
    highlightSelectedNode(node.id);
    consoleApp.consoleShowNode(node);
  }
  this.getNodesByName = function(name){
    var nodes = [];
    for (var i = 0; i < globals.nodeList.length; i++){
      if (globals.nodeList[i].data.labels.indexOf(name) > -1)
        nodes.push(globals.nodeList[i]);
    }
    return nodes;
  }

  this.ConsoleShowNode = function(node){
    consoleApp.consoleShowNode(node);
  }

  this.AddToEntityTypeDefs = function(node){
    var entityType = new EntityTypeDef();
    labelFound = false;
    // Check for existing node type...
    for (var i = 0; i < globals.entityTypeDefs.length; i++){
      var nodeTypeDef = globals.entityTypeDefs[i];
      for (var x = 0; x < node.data.labels.length; x++){
        if (nodeTypeDef.labels.indexOf(node.data.labels[x]) > -1){
          labelFound = true;
          entityType = nodeTypeDef;
          break;
        }
      }
    }
    // Update properties...
    for (var key in node.data.propertiesObject){
      if (!entityType.properties.hasOwnProperty(key))
        entityType.properties[key] = new PropertyTypeDef();

      var propertyType = getType(node.data.properties[key]);
      if (entityType.properties[key].DataTypes.indexOf(propertyType) == -1)
        entityType.properties[key].DataTypes.push(propertyType);

      if (new StringHelper().IsImage(node.data.propertiesObject[key])){
        if (entityType.imageProperties.indexOf(key) == -1)
          entityType.imageProperties.push(key);
      }
    }

    // Add to array, if new...
    if (!labelFound){
      entityType.labels = node.data.labels;
      globals.entityTypeDefs.push(entityType);
      addNodeStamp(node);
    }
    
    function addNodeStamp(node)
    {
      consoleApp.nodeStamp.stamps.push(
        { 'labels': node.data.labels ,'properties': { Title: 'string' },config: node.data.entityConfig }
      );
    }

  }

}





function BrowserHelper(){

  this.getBrowser = function(){
    // Opera 8.0+
    if (isOpera()) 
      return {name: "Opera", group: "Opera 8.0+"};
    // Firefox 1.0+
    if (isFirefox()) 
      return {name: "Firefox", group: "Firefox 1.0+"}
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    if (isSafari()) 
      return {name: "Safari", group:"Safari 3.0+"}
    // Internet Explorer 6-11
    if(isInternetExplorer()) 
      return {name: "IE", group:"Internet Explorer 6-11"}
    // Edge 20+
    if (isEdge()) 
      return {name: "Edge", group:"Edge 20+"}
    // Chrome 1+
    if (isChrome())
      return {name: "Chrome", group:"Chrome 1+"}
    // Blink engine detection
    if (isBlink()) 
      return {name: "Blink", group:"Blink engine"}
  }

  // Opera 8.0+
  this.IsOpera = function (){
    return isOpera();
  }
  // Firefox 1.0+
  this.IsFirefox = function (){
    return isFirefox();
  }
  // Safari 3.0+ "[object HTMLElementConstructor]" 
  this.IsSafari = function (){
    return isSafari();
  }
  // Internet Explorer 6-11
  this.IsInternetExplorer = function (){
    /*@cc_on!@*/
    return isInternetExplorer();
  }
  // Edge 20+
  this.IsEdge = function (){
    return isEdge();
  }
  // Chrome 1+
  this.IsChrome = function (){
    return isChrome();
  }
  // Blink engine detection
  this.IsBlink = function (){
    return isBlink();
  }

    // Opera 8.0+
  function isOpera  (){
    return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  }
  // Firefox 1.0+
  function isFirefox  (){
    return typeof InstallTrigger !== 'undefined';
  }
  // Safari 3.0+ "[object HTMLElementConstructor]" 
  function isSafari  (){
    return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  }
  // Internet Explorer 6-11
  function isInternetExplorer  (){
    /*@cc_on!@*/
    return false || !!document.documentMode;
  }
  // Edge 20+
  function isEdge  (){
    return isInternetExplorer() && !!window.StyleMedia;
  }
  // Chrome 1+
  function isChrome  (){
    return !!window.chrome //&& !!window.chrome.webstore;
  }
  // Blink engine detection
  function isBlink  (){
    return (isChrome || isOpera) && !!window.CSS;
  }

  this.GetWindowSize = function(){
    var w = window.innerWidth
    if (!w) w = document.documentElement.clientWidth
    if (!w) w =  document.body.clientWidth;

    var h = window.innerHeight
    if (!h) h = document.documentElement.clientHeight
    if (!h) h = document.body.clientHeight;
    return {width: w, height: h};
  }
}
function UrlHelper(){

    this.GetParameterByName = function(name, url) {
      
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    this.GetAllParams = function(url) {
      var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = window.location.search.substring(1);
      var urlParams = [];
      while (match = search.exec(query))
        urlParams.push({"key": decode(match[1]), "value":decode(match[2])});
         //urlParams[decode(match[1])] = decode(match[2]);
      return urlParams;
    }

}
//--------------DATA CONVERSION------------------------------------------------------------------------------------------------------------------------


function addNodesFromResults(nodesResults, _sourceConfig)
{
	var newNodes = [];
	for (var i = 0; i < nodesResults.results.length; i++){
		
		var result = nodesResults.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			
			var I_N_ID = 0;
			var I_N_LABELS = 1;
			var I_N_PROPS = 2;
			var I_R_ID = 3;
			var I_R_LABELS = 4;
			var I_R_PROPS = 5;
			var I_M_ID = 6;
			var I_M_LABELS = 7;
			var I_M_PROPS = 8;
			
			//Node N...
			var datN = new nodeDataType;
			datN.id =_sourceConfig.prefix + row[I_N_ID];
			if (row[I_N_LABELS])
				datN.labels = row[I_N_LABELS];
			if (row[I_N_PROPS])
				datN.properties = new neoPropertyList(row[I_N_PROPS]);
			if (row[I_N_PROPS])
				datN.propertiesObject = row[I_N_PROPS]
			var fromNode = addDataNode(datN.id, datN, _sourceConfig);
			if (fromNode)
				newNodes.push(fromNode);
			//if (!globals.GRAPH.getNode(row[I_N_ID])){
			//	var pos = globals.layout.getNodePosition(row[I_N_ID]);
			//	globals.layout.setNodePosition(row[I_N_ID], pos.x, pos.y);
			//}
			//Node M...
			var datM = new nodeDataType();
			datM.id =_sourceConfig.prefix + row[I_M_ID];
			if (row[I_M_LABELS])
				datM.labels = row[I_M_LABELS];
			if (row[I_M_PROPS])
				datM.properties = new neoPropertyList(row[I_M_PROPS]);
			if (row[I_M_PROPS])
				datM.propertiesObject = row[I_M_PROPS]
			var toNode = addDataNode(datM.id, datM, _sourceConfig);
			if (toNode)
				newNodes.push(toNode);

			
			//link R...
			var linkdata = new linkDataType(datN.id, datM.id, _sourceConfig.prefix + row[I_R_ID], row[I_R_LABELS], _sourceConfig);
			//linkdata.fromNodeID = datN.id;
			//linkdata.toNodeID = datM.id;
			//linkdata.id = _sourceConfig.prefix + row[I_R_ID];
			//linkdata.name = row[I_R_LABELS];
			linkdata.properties = new neoPropertyList(row[I_R_PROPS]);
			linkdata.propertiesObject = row[I_R_PROPS];
			var link = addDataLink(datN.id, datM.id, linkdata, _sourceConfig);
		}
	}

    //Refresh all nodes to ensure depths are correct:
	refreshNodesDepths();

	return newNodes;
}

function addSingleNodeFromResultsAndReturnIds(nodesResults, _sourceConfig)
{
	var Ids = [];
	for (var i = 0; i < nodesResults.results.length; i++){
		
		var result = nodesResults.results[i];
		for (var d = 0; d < result.data.length; d++) {
			var row = result.data[d].row;
			var I_N_ID = 0;
			var I_N_LABELS = 1;
			var I_N_PROPS = 2;
			//Node N...
			var dat = new nodeDataType();
			dat.id = _sourceConfig.prefix + row[I_N_ID];
			if (row[I_N_LABELS]) { dat.labels = row[I_N_LABELS]; }
			if (row[I_N_PROPS]) { dat.properties = new neoPropertyList(row[I_N_PROPS]); }
			if (row[I_N_PROPS]) { dat.propertiesObject = row[I_N_PROPS]; }
			addDataNode(dat.id, dat, _sourceConfig);
			Ids.push(dat.id);
		}
	}
    //Refresh all nodes to ensure depths are correct:
	refreshNodesDepths();
	
	return Ids;
}

function addSingleRelationFromResults(nodesResults, _sourceConfig)
{
	for (var i = 0; i < nodesResults.results.length; i++){
		
		var result = nodesResults.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			var I_N_ID = 0;
			var I_M_ID = 1;
			var I_R_ID = 2;
			var I_R_TYPE = 3;
			var I_R_PROPS = 4;
			//Node N...
			var dat = new linkDataType(_sourceConfig.prefix + row[I_N_ID], _sourceConfig.prefix + row[I_M_ID], _sourceConfig.prefix + row[I_R_ID], row[I_R_TYPE], _sourceConfig);
			//dat.fromNodeID = _sourceConfig.prefix + row[I_N_ID];
			//dat.toNodeID = _sourceConfig.prefix + row[I_M_ID];
			//dat.id = _sourceConfig.prefix + row[I_R_ID];
			//if (row[I_R_TYPE]){dat.name = row[I_R_TYPE];}
			if (row[I_R_PROPS]){dat.properties = new neoPropertyList(row[I_R_PROPS]);}
			if (row[I_R_PROPS]){dat.propertiesObject = row[I_R_PROPS]}
			var node = addDataLink(dat.fromNodeID, dat.toNodeID, dat, _sourceConfig);
		}
	}
}

function neoPropertyList(obj)
{
	var propArray = [];
	for (var thiskey in obj) {
		propArray.push(new propertyType(thiskey, obj[thiskey]));
	}
	return propArray;
}

//============ DATA QUERY ================================================================================================================================================================================================
function Neo4jExtractProperties(nodesResult) //extract properties from a collection of nodes, from a cypher node search
{
	var propertyList = [];
	for (var i = 0; i < nodesResult.results.length; i++){		
		var result = nodesResult.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			propertyList = propertyList.concat(new neoPropertyList(row[0]));
		}
	}
		
	return propertyList;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jExtractValues(nodesResult) //extract properties from a collection of nodes, from a cypher node search
{
	var valueList = [];
	for (var i = 0; i < nodesResult.results.length; i++){		
		var result = nodesResult.results[i];
		for (var d = 0; d < result.data.length; d++){
			var row = result.data[d].row;
			valueList.push(row[0]);
		}
	}
	return valueList;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jQbuilder_ClearValue(selectType)
{
	var scope = selectType.split('.');
	document.getElementById('qbuilder.' + scope[1] + '.value').value = '';
	//document.getElementById('qbuilder.'+scope[1]+'.selectvalue').innerHTML = '<option value=""></option>';
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jQuerySimpleSearch(fromEntity, whereProperty, equalsValue, _sourceConfig)
{
	var propertyBlock = (whereProperty)?'{'+whereProperty+':'+parseDataType(equalsValue)+'}':'';
		
	if (fromEntity && fromEntity != ''){fromEntity = ':' + fromEntity;}
	var command = 'MATCH (n' + fromEntity + propertyBlock + ') RETURN id(n), labels(n), n  LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		
	var callback = function(nodesResult, sourceConfig){
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig)
		//Recurse...
		var command = 'MATCH (n' + fromEntity + propertyBlock + ')-[r]-(m) RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)  LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		var callback2 = function(nodesResult, sourceConfig){addNodesFromResults(nodesResult, sourceConfig)};
		Neo4j_Command([command], callback2, sourceConfig);
	};
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jFetchEntitiesForNode(nodeId, _sourceConfig)
{
	if (!nodeId) {nodeId = globals.selectedNodeID;}
	var command = '';
	switch(globals.viewOptions.navigateDirection){
	case 'child':
		command = 'MATCH (n)-[r]->(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		break;
	case 'parent':
		command = 'MATCH (n)<-[r]-(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		break;
	default:
		command = 'MATCH (n)-[r]-(m) WHERE ID(n) = ' + getNeoId(nodeId) + ' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
		break;
	}
	var whenResultsComeBackFunction = function(nodesResult, sourceConfig){
		var newNodes = addNodesFromResults(nodesResult, sourceConfig)
		//popout effect
		newNodes.forEach(function (newNode) {
			applyPopoutEffectToNode(newNode, nodeId)
		});
			
	};

	Neo4j_Command([command], whenResultsComeBackFunction, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



function Neo4jGetRelationCounts(nodeId, callback, _sourceConfig)
{
	command = 'MATCH (n)-[r]->(m) where id(n) = '+getNeoId(nodeId)+' RETURN count(n) UNION MATCH (n)<-[r]-(m) where id(n) = '+getNeoId(nodeId)+ ' RETURN count(n)'
		
	var callback2 = function(nodesResults, sourceConfig){
		for (var i = 0; i < nodesResults.results.length; i++){	
				var result = nodesResults.results[i];
				var fromLinksCount = (result.data[0])? result.data[0].row[0]: 0; 
				var toLinksCount = (result.data[1])? result.data[1].row[0]: 0;
				callback(fromLinksCount, toLinksCount, sourceConfig);
		}	
	};
	Neo4j_Command([command], callback2, _sourceConfig);	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetNodeById(nodeid, _sourceConfig)
{
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
	}
		
	var command = 'MATCH (n) WHERE ID(n) = '+getNeoId(nodeid)+'  RETURN id(n), labels(n), (n)';
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetNodesByLabel(byLabel, sourceConfigPrefix)
{
	var _sourceConfig = getConfigByPrefix(sourceConfigPrefix)
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
	}
	var matchPattern = 'n';
	if (byLabel && byLabel != '') {matchPattern += ":" + byLabel;}
	var command = 'MATCH (' + matchPattern + ') RETURN id(n), labels(n), (n) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetEntitiesByDetails(nodeLabel, properties, _sourceConfig)
{
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
	}
	var matchPattern = 'n';
	if (nodeLabel) { matchPattern += ":" + nodeLabel; }
	var command = 'MATCH ('+matchPattern+')';
	if (properties){
		if (properties.length > 0)
		{
			var conditions;
			properties.forEach(function (prop) {
				if (conditions) {conditions += ' AND'} else {conditions = ''}
				conditions += ' n.' + prop.key + '=' + parseDataType(prop.value);
			});
			command += ' WHERE' + conditions;
		}
	}
	command += ' RETURN id(n), labels(n), (n) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetAllEntities(_sourceConfig)
{
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
		globals.dataService.GetAllRelations(_sourceConfig);
	}
	var command = 'MATCH (n) RETURN id(n), labels(n), (n) LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetAllRelations(_sourceConfig)
{
	var callback = function (relationsResult, sourceConfig) {
		addSingleRelationFromResults(relationsResult, sourceConfig);
	}
	var command = 'MATCH (n)-[r]->(m) RETURN id(n), id(m), id(r), type(r), r LIMIT ' + _sourceConfig.dataAccessOptions.generalFetchLimit;
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jFetchRelation(fromNodeID, toNodeID, _sourceConfig)
{
	command = 'MATCH (n)-[r]-(m) WHERE ID(n) = ' + getNeoId(fromNodeID) + ' and ID(m) = '+getNeoId(toNodeID)+' RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)';
	var callback2 = function(nodesResult, sourceConfig){
		addNodesFromResults(nodesResult, sourceConfig)
	};
	Neo4j_Command([command], callback2, _sourceConfig);
		
}

//============ DATA CREATE/UPDATE/DELETE ================================================================================================================================================================================================


function Neo4jCreateEntityReturnCallbackWithIds(entityName, propList, inputCallback) {
	var _sourceConfig = globals.currentTheme.sourceConfig;
	var callback = function (nodesResult, sourceConfig) {
		var ids = addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
		//globals.layout.setNodePosition(ids[0], 0, 0);
		if (inputCallback)
			inputCallback(ids);
	};
	var command = 'CREATE (n:' + entityName + _convertPropertyListToNeo4jString(propList) + ') return id(n), labels(n), n'
	console.log('command', command);
	return Neo4j_Command([command], callback, _sourceConfig);
}
function _convertPropertyListToNeo4jString(propList)
{
	var propsString = '';
	if (propList.length > 0) propsString += '{';
	for (var p = 0; p < propList.length; p++){
		if (p > 0) propsString += ',';
		propsString += propList[p].key + ':' ;
		if (propList[p].datatype == "number" || "boolean")
			propsString += propList[p].value;
		else
			propsString += '"' + propList[p].value + '"';
	}
	if (propList.length > 0) propsString += '}';
	return propsString;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function Neo4jUpdateEntity(nodeID, newProperties, callback) {
	
	var _sourceConfig = globals.currentTheme.sourceConfig;
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
		if (inputCallback)
			inputCallback(ids);
	};
	var command = 'MATCH (n) WHERE ID(n)=' + getNeoId(nodeID) + newProperties + ' return id(n), labels(n), n'
	Neo4j_Command([command], callback, _sourceConfig);
}



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCreateRelation(nodeID1, nodeID2, relationName, propList, _sourceConfig, planOnly) {


	if (!planOnly) {
	    var callback = function (nodesResult, sourceConfig) {
	        Neo4jFetchRelation(nodeID1, nodeID2, sourceConfig);
	    }
	    var command = 'MATCH (n) WHERE ID(n) = ' + getNeoId(nodeID1) + ' MATCH (m) WHERE ID(m) = ' + getNeoId(nodeID2) + ' CREATE (n)-[r:' + relationName + propList + ']->(m) RETURN id(startnode(r)), labels(startnode(r)), startnode(r) , id(r), type(r), r, id(endnode(r)), labels(endnode(r)), endnode(r)'
	    Neo4j_Command([command], callback, _sourceConfig);
	}
	else {
	    addPlannedLink(nodeID1, nodeID2, relationName, propList)
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCreateNode(labelName, _sourceConfig) {
	var callback = function (nodesResult, sourceConfig) {
	    addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
	}
	var command = 'CREATE (n:' + labelName + ') RETURN id(n), labels(n), n';
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jDeleteNode(nodeID, _sourceConfig) {
	var callback = function (nodesResult, sourceConfig) {

	    removeNodeFromStage(nodeID)
	}
	var command = 'MATCH (n) where ID(n) = ' + getNeoId(nodeID) + ' DETACH DELETE (n) RETURN ID(n)';
	Neo4j_Command([command], callback, _sourceConfig);


}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jDeleteRelationship(relationshipID, _sourceConfig) {
	var callback = function (nodesResult, sourceConfig) {

	    removeLinkFromStage(relationshipID)
	}
	var command = 'MATCH (n)-[r]->(m) where ID(r) = ' + getNeoId(relationshipID) + ' DELETE (r) RETURN ID(r)';
	Neo4j_Command([command], callback, _sourceConfig);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function Neo4jDeleteLabel(nodeId, labelName, _sourceConfig) {
	var command = "MATCH (n) where ID(n) = " + getNeoId(nodeId) + " REMOVE n:" + labelName;
	var callback = function (results, sourceConfig) {
	    Neo4jGetNodeById(globals.selectedNodeID, sourceConfig)
	};
	Neo4j_Command([command], callback, _sourceConfig, callback);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jAddProperty(nodeId, _sourceConfig) {
	if (!nodeId) { nodeId = globals.selectedNodeID }
	var elePropKey = document.getElementById('add.property.key').value;
	var elePropVal = document.getElementById('add.property.value').value;
	var elePropType = document.getElementById('add.property.type').value;
	if (!elePropType) { elePropType = "string"; }
	if (elePropType == "string") { elePropVal = '"' + elePropVal + '"' }
	var command = "MATCH (n) where ID(n) = " + getNeoId(nodeId) + " SET n +={" + elePropKey + ":" + elePropVal + "}";

	var callback = function (results, sourceConfig) {
	    Neo4jGetNodeById(globals.selectedNodeID, sourceConfig);
	};
	Neo4j_Command([command], callback, _sourceConfig, callback);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jAddLabel(_sourceConfig) {
	var processingElement = document.getElementById('log');
	//node.data.labels.push(processingElement.value);
	if (!processingElement) return;
	if (!processingElement.value) return;

	var callback = function (results, sourceConfig) {
	    Neo4jGetNodeById(globals.selectedNodeID, sourceConfig);
	};

	var command = "MATCH (n) where ID(n) = " + getNeoId(globals.selectedNodeID) + " SET n:" + processingElement.value;
	Neo4j_Command([command], callback, _sourceConfig, callback);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jGetAllLabels(_sourceConfig) {
	var callback = function (data, sourceConfig) {
	    data.results[0].data.forEach(function (dataobject) {
			// Outdated... "sourceConfig" no longer being used...
	    	//addEntityLabel(dataobject.row[0][0], dataobject.row[1], sourceConfig);
	    });
	    refreshEntitySelectors();
	};

	var command = "match (n) return labels(n), count(labels(n))";
	Neo4j_Command([command], callback, _sourceConfig);
}


//============ NEO4J COMMAND BROKER ================================================================================================================================================================================================
function Neo4j_Command(statements, successCallback, _sourceConfig, failCallback)
{
	var sourceConfig = _sourceConfig ? _sourceConfig : globals.currentTheme.sourceConfig;
	var body = new neo_APIcall(); 
	statements.forEach(function(statement){
		body.statements.push(new neo_Statement(statement));
	});
		
	$.ajax({
			url: sourceConfig.neo4jconnection.server + "/db/data/transaction/commit",
			type: 'post',
			data: JSON.stringify(body),
			headers: {
				"Accept":'application/json; charset=UTF-8',
				"Content-Type": 'application/json',
				"Authorization": 'Basic ' + window.btoa(sourceConfig.neo4jconnection.username + ':' + sourceConfig.neo4jconnection.password) //_connection.userToken
			},
			dataType: 'json',				
				
			success: function (returnbody){
				if (successCallback){
					successCallback(returnbody, sourceConfig);
				}
			},
			error: function (returnbody){
				if (failCallback){
					failCallback(returnbody, sourceConfig);
				}
			}()
		});
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCheckMonitoredNodes(_sourceConfig) {
	if (globals.monitoredNodes.length == 0) { return; }
	var id = 0;
	var callback = function (nodesResult, sourceConfig) {
		addSingleNodeFromResultsAndReturnIds(nodesResult, sourceConfig);
		if (id >= globals.monitoredNodes.length) {
			performAnimations();
			setTimeout(function () { globals.dataService.CheckMonitoredLinks(); }, globals.config_ext.monitoringOptions.pollInterval * 1000);
			return;
		}
		var command = 'MATCH (n) WHERE ID(n) = ' + getNeoId(globals.monitoredNodes[id++].id) + ' RETURN id(n), labels(n), n';
		Neo4j_Command([command], callback, sourceConfig);
	};
	var command = 'MATCH (n) WHERE ID(n) = ' + getNeoId(globals.monitoredNodes[id++].id) + ' RETURN id(n), labels(n), n';
	Neo4j_Command([command], callback, _sourceConfig);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jCheckMonitoredLinks(_sourceConfig) {
	if (globals.monitoredLinks.length == 0) { return; }
	var id = 0;
	var callback = function (relationsResult, sourceConfig) {
		addSingleRelationFromResults(relationsResult);
		if (id >= globals.monitoredLinks.length) {
			performAnimations();
			setTimeout(function () { pollDatabase(); }, globals.config_ext.monitoringOptions.pollInterval * 1000);
			return;
		}
		var command = 'MATCH (n)-[r]-(m) WHERE ID(r) = ' + getNeoId(globals.monitoredLinks[id++].data.id) + ' RETURN id(n), id(m), id(r), type(r), r';
		Neo4j_Command([command], callback, sourceConfig);
	};
	var command = 'MATCH (n)-[r]-(m) WHERE ID(r) = ' + getNeoId(globals.monitoredLinks[id++].data.id) + ' RETURN id(n), id(m), id(r), type(r), r';
	Neo4j_Command([command], callback, _sourceConfig);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Neo4jQbuilder(selectType, _sourceConfig) {
	var scope = selectType.split('.');
	var selectedEntityValue = document.getElementById('qbuilder.' + scope[1] + '.entity').value;
	var sourcePrefix = selectedEntityValue.substring(selectedEntityValue.length - 3);
	var entityName = selectedEntityValue.substring(0, selectedEntityValue.length - 3);
	var selectedEntityCount = getNeoLabel(entityName, sourcePrefix);

	if (scope[2] == 'entity') {
		//get properties...
		var valueElementName = 'qbuilder.' + scope[1] + '.selectproperty';
		document.getElementById('qbuilder.' + scope[1] + '.value').value = '';
		var childElementName = 'qbuilder.' + scope[1] + '.property';
		var propertyElement = document.getElementById(childElementName);
		var listedValues = [];
		propertyElement.innerHTML = '<option value=""></option>';
		document.getElementById('qbuilder.' + scope[1] + '.selectvalue').innerHTML = '<option value=""></option>';
		var command = "MATCH (n:" + entityName + ") RETURN n LIMIT 10 "; //...get 10 entities to get hopefully all the possible properties

		var callback = function (nodesResult, sourceConfig) {
			var valueList = Neo4jExtractProperties(nodesResult)

			var valueElement = document.getElementById(valueElementName);

			valueElement.innerHTML = '<option value=""></option>';
			valueList.sort(sort_by('key', false, function (a) { return a.toUpperCase() })).forEach(function (prop) {
				if (listedValues.indexOf(prop.key) == -1) {
					listedValues.push(prop.key)
					valueElement.innerHTML += '<option value="' + prop.key + '">' + prop.key + '</option>';
				}
			});

		};
		Neo4j_Command([command], callback, getConfigByPrefix(sourcePrefix));
	}
	if (scope[2] == 'property') {
		var valueElementName = 'qbuilder.' + scope[1] + '.selectvalue';
		document.getElementById('qbuilder.' + scope[1] + '.value').value = '';
		//var selectedEntity = document.getElementById('qbuilder.'+scope[1]+'.entity').value;
		var selectedProperty = document.getElementById('qbuilder.' + scope[1] + '.property').value;
		//valueElementName.innerHTML = '<option value=""></option>';
		var listedValues = [];
		if (!selectedProperty) { return; }

		//Manage large datasets
		var command = "MATCH (n:" + entityName + ") return distinct n." + selectedProperty + " LIMIT " + getConfigByPrefix(sourcePrefix).dataAccessOptions.generalFetchLimit;

		var callback = function (nodesResult, sourceConfig) {
			var valueList = Neo4jExtractValues(nodesResult)
			var valueElement = document.getElementById(valueElementName);
			valueElement.innerHTML = '<option value=""></option>';
			valueList.sort().forEach(function (prop) {
				if (listedValues.indexOf(prop) == -1) {
					listedValues.push(prop)
					valueElement.innerHTML += '<option value="' + prop + '">' + prop + '</option>';
				}
			});
		};
		Neo4j_Command([command], callback, getConfigByPrefix(sourcePrefix));
	}
}

//Cyclic functions
		
		/*every second, checks the list of timeout elements, and removes any which have timed out*/
		function checkTimeoutElements()
		{
			setTimeout(function(){ 
				
				var i = 0;
				while(i < globals.timeoutElements.length)
				{
					var tele = globals.timeoutElements[i];
					var currenttime = +new Date();
					if (currenttime > tele.activationPoint + (tele.duration *1000))
					{	//remove element...
						tele.fnRemove(tele.element);
						globals.timeoutElements.splice(i, 1);
						
					}
					else (i++);
				}
				checkTimeoutElements(); 
				
			}, 1000);
		}
		
		function performAnimations()
		{	
			//Node Update-Animations...
			globals.animUpdateNodes.forEach(function (node) {
				addSatelliteToNode(node);
			});
			globals.animUpdateNodes = [];
			
			//Link Update-Animations...
			globals.animUpdateLinks.forEach(function (link) {				
				var circletiny2 = Viva.Graph.svg('circle')
						.attr('cx', 1)
						.attr('cy', 1)
						.attr('r', .5)
						.attr('fill','red')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')
						.attr('opacity',0.5)
						.attr('stroke-width',0)
				var gSattelite2 = Viva.Graph.svg('g')
				gSattelite2.append(circletiny2);
				globals.timeoutElements.push(new timeoutElementType(gSattelite2, 60, removeAnimatedElement));
				link.data.UI.midMarkerUI.append(gSattelite2);
				gSattelite2.attr('class','rotatee');
			});
			globals.animUpdateLinks = [];
			
		}
		
		function removeAnimatedElement(element)
		{
			element.remove();
		}
		
		
		function animateTest(node)
		{	
			if(!node){node = globals.selectedNode;}
			//globals.animUpdateNodes.forEach(function (node) {
				//var node = globals.selectedNode;
				var nodeUI = globals.graphics.getNodeUI(node.id);
				circlex = Viva.Graph.svg('circle')
						.attr('cx', 0)
						.attr('cy', 0)
						.attr('r', Number(node.data.entityConfig.config.attributes["radius"]))
						.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')
						.attr('stroke-width','5')
						.attr('stroke-opacity','0.7')
				nodeUI.append(circlex);
				circlex.attr('class','droplet');
				

				var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
				var groupx = Viva.Graph.svg('g')
				var x1 = -13;
				var y1 = 10;
				var x2 = 37;
				var c = 48;
				var dpath1 = '';
				dpath1 += 'M '+ x1 +' '+ y1 +' C '; //x1, y1
				dpath1 += x1 +' '+ c +','; //control-x1, control-y1
				dpath1 += x2 +' '+ c +',';//control-x2, control-y2
				dpath1 += x2 +' '+y1; //x2, y2
				var dpath2 = 'M' + 0 + ',' + 0 +
                ' A 10,' + nodeRadius + ',-30,0,1,' + nodeRadius * 2 + ',' + nodeRadius * 2;
				var dpath3 = "M80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 Z"   
				var dpath4 = "M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10"
				//var dpath = '';
				//dpath += 'M '+0+' '+0 +' C '; //x1, y1
				//dpath += 0+' '+40+','; //control-x1, control-y1
				//dpath += 50+' '+40+',';//control-x2, control-y2
				//dpath += 50+' '+0; //x2, y2
				var pathx = Viva.Graph.svg('path')
					.attr('d',dpath1)
					//.attr('d','M'+0+' '+0+' C '+0+' '+50+', '+50+' '+0+', '+50+' '+ 50)	
					//M70 110 
					//C 70 140, 
					//110 140, 
					//110 110
					.attr('stroke', 'blue')
				//groupx.append(pathx);
				//groupx.append(circlex);
				
				
				circley = Viva.Graph.svg('circle')
						.attr('cx', 0) //node.data.entityConfig.config.attributes["radius"]/2)
						.attr('cy', 0) //node.data.entityConfig.config.attributes["radius"]/2)
						.attr('r', node.data.entityConfig.config.attributes["radius"])
						.attr('fill','blue')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')	
				//groupx.append(circley);
				
				circletiny = Viva.Graph.svg('circle')
						.attr('cx', 20)
						.attr('cy', 30)
						.attr('r', 5)
						.attr('fill','red')//node.data.nodeColor)//'#4dffc3')
						.attr('stroke','red')
						.attr('opacity',0.5)
						.attr('stroke-width',0)
				groupx.append(circletiny);
				groupx.attr('dx',100);
				groupx.attr('dy',100);
				nodeUI.append(groupx);
				groupx.attr('class','rotatee');

		}
		
		
function addSatelliteToNode(node)
{
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	var rippleCircle = Viva.Graph.svg('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', nodeRadius)
				.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
				.attr('stroke','red')
				.attr('stroke-width','5')
				.attr('stroke-opacity','0.7')
		var circletiny = Viva.Graph.svg('circle')
				.attr('cx', nodeRadius)
				.attr('cy', nodeRadius)
				.attr('r', 5)
				.attr('fill','red')//node.data.nodeColor)//'#4dffc3')
				.attr('stroke','red')
				.attr('opacity',0.5)
				.attr('stroke-width',0)
		var endArrow =  Viva.Graph.svg('path')
					.attr('stroke-width',0)
					.attr('d', 'M 0 -0.7 L 2 0 L 0 0.7 z')
					.attr('fill',node.data.nodeColor);
							
		var gSattelite = Viva.Graph.svg('g')
		gSattelite.append(circletiny);
		gSattelite.attr('dx',100);
		gSattelite.attr('dy',100);
		globals.timeoutElements.push(new timeoutElementType(rippleCircle, 5, removeAnimatedElement));
		globals.timeoutElements.push(new timeoutElementType(gSattelite, 60, removeAnimatedElement));
		node.data.UI.fullUI.insertBefore(rippleCircle, node.data.UI.bodyUI);
		node.data.UI.fullUI.insertBefore(gSattelite, node.data.UI.bodyUI);
		gSattelite.attr('class','rotatee');
		rippleCircle.attr('class','droplet');
}


function AnimationHelper(){

  this.StartAnimationTicker = function(){
    animationTick();
  }

  function animationTick(){
    setTimeout(function(){ 
          stepAllAnimations()
				  animationTick(); 
			  }, 10);
  }

  function stepAllAnimations(){
    var i = -1;
    var overflow = 1000;
    while (++i < globals.animations.length && i < overflow){
      var anim = globals.animations[i];
      if (anim.complete)
        globals.animations.splice(i,1);
      else
        anim.onNextStep(anim);
    }
  }

  function AnimatedObject(){
    this.currentStepIndex = 0;
    this.complete = false;
    this.remainingSteps = 70;
    this.data = {};
    this.beforeStart = function(){}
    this.onNextStep = function(){}
  }

  this.NodePositionAnimation = function(node, requestedPos){
    var anim = new AnimatedObject();
    var currentPos = globals.layout.getNodePosition(node.id);
    anim.data = {"node": node, "currentPos": currentPos, "requestedPos": requestedPos};
    anim.stepX = Math.abs(requestedPos.x - currentPos.x) / anim.remainingSteps * (currentPos.x<=requestedPos.x?1:-1);
    anim.stepY = Math.abs(requestedPos.y - currentPos.y) / anim.remainingSteps * (currentPos.y<=requestedPos.y?1:-1);
    anim.onNextStep = function(){
      var node = this.data.node;
      var currentPos = this.data.currentPos;
      var reqPos = this.data.requestedPos;
      var remainingSteps = this.remainingSteps--;
      var nextX = currentPos.x + this.stepX
      var nextY = currentPos.y + this.stepY
      this.data.currentPos.x = nextX;
      this.data.currentPos.y = nextY;
    
      if (typeof (nextX) !== 'number' || typeof (nextY) !== 'number') debugger;
      globals.layout.setNodePosition(node.id, nextX, nextY);
      if (this.remainingSteps <= 0) this.complete = true;
    }
    globals.animations.push(anim);
  }


  this.AddNodeRipple = function(node){
  	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	  var rippleCircle = Viva.Graph.svg('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', nodeRadius)
				.attr('fill','transparent')//node.data.nodeColor)//'#4dffc3')
				.attr('stroke','red')
				.attr('stroke-width','5')
				.attr('stroke-opacity','0.7')
		globals.timeoutElements.push(new timeoutElementType(rippleCircle, 5, removeAnimatedElement));		
		node.data.UI.fullUI.insertBefore(rippleCircle, node.data.UI.bodyUI);
		rippleCircle.attr('class','droplet');
}


}
	
//============ DATA MONITORING ================================================================================================================================================================================================  

		function clearAllMonitored()
		{
			while (globals.monitoredNodes.length >0){
				removeMonitoredNode(globals.monitoredNodes[0].id);
			}
			while (globals.monitoredLinks.length >0){
				removeMonitoredLink(globals.monitoredLinks[0].data.id)
			}
		}
		
		function monitorNode(node)
		{
			var alreadymonitored = false;
			globals.monitoredNodes.map(function(n){if (n.id == node.id) alreadymonitored = true;});
			if (!alreadymonitored){
				globals.monitoredNodes.push(node);
				var removeButton = '<button class="fortext mytooltip" onclick="removeMonitoredNode('+ node.id +')" >X<div class="mytooltiptext">stop monitoring</div></button>'
				addValueToList('nodelist.monitored', removeButton, 'node:',  node.id)
			}
		}
		
		function monitorLink(link)
		{
			var alreadymonitored = false;
			globals.monitoredLinks.map(function(n){if (n.data.id == link.data.id) alreadymonitored = true;});
			if (!alreadymonitored){
				globals.monitoredLinks.push(link);
				var removeButton = '<button class="fortext mytooltip" onclick="removeMonitoredLink('+ link.data.id +')" >X<div class="mytooltiptext">stop monitoring</div></button>'
				addValueToList('nodelist.monitored', removeButton, 'link:',  link.data.id)
			}
		}
		
		function monitorCheckedItems()
		{
			//add nodes...
			if (globals.selectedNode) {monitorNode(globals.selectedNode);}
			globals.checkedNodes.forEach(function (node){
				monitorNode(node);
			});	
			//add links...
			globals.checkedLinks.forEach(function (link){
				monitorLink(link);
			});

			pollDatabase();
		}

		
		
		function removeMonitoredNode(nodeid)
		{
			var searchedIndex = -1;
			globals.monitoredNodes.map(function (node, index){if (node.id == nodeid) {searchedIndex = index;}})			
			if (searchedIndex > -1) {
				globals.monitoredNodes.splice(searchedIndex, 1);
				var vislist = document.getElementById('nodelist.monitored');
				for (var i = 0; i < vislist.childNodes.length; i++ ){
					if (vislist.childNodes[i].childNodes[0].childNodes[2].innerHTML == nodeid
					&& vislist.childNodes[i].childNodes[0].childNodes[1].innerHTML == 'node:'){
						vislist.childNodes[i].remove();
					}
				}
			}	
		}
		
		function removeMonitoredLink(linkid)
		{
			var searchedIndex = -1;
			globals.monitoredLinks.map(function (link, index){if (link.data.id == linkid) {searchedIndex = index;}})			
			if (searchedIndex > -1) {
				globals.monitoredLinks.splice(searchedIndex, 1);
				var vislist = document.getElementById('nodelist.monitored');
				for (var i = 0; i < vislist.childNodes.length; i++ ){
					if (vislist.childNodes[i].childNodes[0].childNodes[2].innerHTML == linkid
					&& vislist.childNodes[i].childNodes[0].childNodes[1].innerHTML == 'link:'){
						vislist.childNodes[i].remove();
					}
				}
			}	
		}
		
	/*The following 3 functions form a closed loop*/
	function pollDatabase()
	{
		setTimeout(function () { globals.dataService.CheckMonitoredNodes(); }, globals.config_ext.monitoringOptions.pollInterval * 1000);
	}

	/*loop*/
function BrowserModel() {
	this.name = "";
  this.group = "";
}
function Entity() {
    this.labels;
    this.properties;
    this.relations;
}
function Relationship() {
    this.properties;
    this.labels
    this.fromEntity;
    this.toEntity;
}
function DataEntity() {
	this.id = 0;
    this.labels = [];
    this.properties = {};
    this.relationIds = [];
}
function DataRelation() {
    this.properties;
    this.labels
    this.id
    this.fromEntityId;
    this.toEntityId;
}
function interactionOptionsType() {
    this.checkNodes = false;
    return this;
}


//Link model
function linkDataType(fromNodeId, toNodeId, linkId, name, sourceConfig) {
    this.linkType = 'data';
    //this.source; //...neo4jConnectionType
    this.fromNodeID = fromNodeId;
    this.toNodeID = toNodeId ? toNodeId : -1;
    this.id = linkId ? linkId : -1;
    this.color = globals.currentTheme.linkColor;
    this.thickness = 1;
    this.name = name ? name : '';
    this.displayLabel = '';
    this.properties = [];
    this.UI = new linkUiElementsType();
    this.checked = false; //...flag which indicates if the link is checked.
    this.displayingData = false; //...flag which indicates if the link label is currently displayingData.
    this.config = {}
    this.sourceConfig = globals.currentTheme.sourceConfig;
    //this.config.linkDisplayBody = {};
    this.config.linkDisplayValues = {};

    if (sourceConfig) {
        this.color = sourceConfig.displaySettings.linkColor
    }
    return this;
}


function linkUiElementsType() {
    this.fullUI;
    this.pathUI;
    this.focusUI;
    this.toMarkerUI;
    this.fromMarkerUI;
    this.midMarkerUI;
    this.nameTextUI;
    this.subTextUI;
    this.popoutBodyUI;
    this.popoutTextUI;
    return this;
}

function neo_APIcall() {
    this.statements = [];
    return this;
}
function neo_Statement(statement) {
    this.statement = statement;
    return this;
}
function neo4jConnectionType(name, url, username, password) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.server = url;
    this.userToken = window.btoa(username + ':' + password);
}
function neoLabelType(setName, setColor, setColorRGB, setSourceConfig) {
    this.data = {};
    this.data.sourceConfig = setSourceConfig;
    this.instanceCount = 0;
    this.name = setName;
    this.color = setColor;
    this.colorRGB = setColorRGB;
    return this;
}


//Node model
function nodeDataType() {
    this.nodeType = 'data';
    this.source; //a label describing which database the node comes from/
    //this.dbdestination = ''; //a label describing which database the node performs opertions on/
    this.id = 0;
    this.labels = []; //string array of labels
    this.nodeSize = 25;
    this.nodeColor = '#808080';
    this.depth = 1;
    this.nodeBorderColor = '#808080';
    this.nodeShape = 'circle';
    this.height = 25;
    this.width = 25;
    this.properties = [];
    this.propertiesObject = {}
    this.nodeColorRGB = { r: 100, g: 100, b: 100 };
    this.nodeOpacity = '1'
    this.textColor = '#ffffff';
    this.displayLabel = '';
    this.circleText = '';
    this.isPinned = false;
    this.properties = [];
    this.toLinks = [];
    this.fromLinks = [];
    //this.toEntityCount = 0; //fetched from database
    //this.fromEntityCount = 0; //fetched from database
    this.toNodes = [];
    this.fromNodes = [];
    this.subNodes = [];
    this.superNodes = [];
    this.UI = new nodeUiElementsType();
    this.config = {}
    this.sourceConfig = globals.currentTheme.sourceConfig;
    this.config.nodeDisplayBody = {};
    this.config.nodeDisplayValues = {};
    this.config.nodeStatReachers = [];
    this.config.nodeFlyout = [];
    this.config.nodeTransformers = [];
    this.stats = {}
    this.stats.toEntityCount = 0;
    this.stats.fromEntityCount = 0;
    return this;
}

function propertyType(key, value) {
    this.key = key;
    this.value = value;
    this.datatype = getType(value);
    //console.log(key + ': ' + this.datatype + ' = ' + value);
    return this;
}
function nodeUiElementsType() {
    this.outerUI;
    this.fullUI;
    this.bodyUI;
    this.imageUI;
    this.focusUI;
    this.checkUI;
    this.displayTextUI;
    this.popoutUI;
    this.popoutInfoUI;
    this.popoutBodyUI;
    this.popoutTextUI;
    return this;
}

function linkUiElementsType() {
    this.fullUI;
    this.pathUI;
    this.focusUI;
    this.toMarkerUI;
    this.fromMarkerUI;
    this.midMarkerUI;
    this.nameTextUI;
    this.subTextUI;
    this.popoutBodyUI;
    this.popoutTextUI;
    return this;
}

//Link model
function linkDataType(fromNodeId, toNodeId, linkId, name, sourceConfig) {
    this.linkType = 'data';
    //this.source; //...neo4jConnectionType
    this.fromNodeID = fromNodeId;
    this.toNodeID = toNodeId ? toNodeId : -1;
    this.id = linkId ? linkId : -1;
    this.color = globals.currentTheme.linkColor;
    this.thickness = 1;
    this.name = name ? name : '';
    this.displayLabel = '';
    this.properties = [];
    this.UI = new linkUiElementsType();
    this.checked = false; //...flag which indicates if the link is checked.
    this.displayingData = false; //...flag which indicates if the link label is currently displayingData.
    this.config = {}
    this.sourceConfig = globals.currentTheme.sourceConfig;
    //this.config.linkDisplayBody = {};
    this.config.linkDisplayValues = {};

    if (sourceConfig) {
        this.color = sourceConfig.displaySettings.linkColor
    }
    return this;
}

function timeoutElementType(_element, _duration, functionRemove) {
    this.fnRemove = functionRemove;
    this.duration = _duration; //in seconds
    this.activationPoint = +new Date(); //+new Date()
    this.element = _element; //UI element
}

function neo4jConnectionType(name, url, username, password) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.server = url;
    this.userToken = window.btoa(username + ':' + password);
}

function neoLabelType(setName, setColor, setColorRGB, setSourceConfig) {
    this.data = {};
    this.data.sourceConfig = setSourceConfig;
    this.instanceCount = 0;
    this.name = setName;
    this.color = setColor;
    this.colorRGB = setColorRGB;
    return this;
}

/*function linkType(fromNodeID, toNodeID, linkData, dataLinkid)
{
	this.FromNodeID = fromNodeID;
	this.ToNodeID = toNodeID;
	this.data = linkData;
	return this;
}*/


function viewOptionsType() {
    this.screenDragType = true;
    this.highlightRelated = true;
    this.highlightAncestors = false;
    this.highlightdescendants = false;
    this.navigateDirection = 'both';
    return this;
}

function interactionOptionsType() {
    this.checkNodes = false;
    return this;
}



function neo_APIcall() {
    this.statements = [];
    return this;
}

function neo_Statement(statement) {
    this.statement = statement;
    return this;
}


function NodeStampType() {
	this.labels = [];
  this.properties = {};
  this.config = {};
}

function nodeUiElementsType() {
    this.outerUI;
    this.fullUI;
    this.bodyUI;
    this.imageUI;
    this.focusUI;
    this.checkUI;
    this.displayTextUI;
    this.popoutUI;
    this.popoutInfoUI;
    this.popoutBodyUI;
    this.popoutTextUI;
    return this;
}

function node_Event(eventType, node, x, y) {

	//console.log('NodeEvent: ' + eventType + ', x=' +x + ' y=' +y);

	if (eventType == "MouseEnter")
		node_OnMouseEnter(node, x, y);

	else if (eventType == "mousedown")
		node_OnMouseDown(node, x, y);

	else if (eventType == "mouseup")
		node_OnMouseUp(node, x, y);

	else if (eventType == "dblclick")
		node_OnMouseDblClick(node, x, y);

	else if (eventType == "MouseLeave")
		node_OnMouseLeave(node, x, y);

	else if (eventType == "MouseDragging")
		node_OnDrag(node, x, y);

	else if (eventType == "SubNodePulledOut")
		node_Event_subNodePulledOut(node, x, y);

	else if (eventType == "touchstart"){
		node_OnMouseDown(node, x, y)
  }

	else if (eventType == "touchend"){
    globals.states.hammeringNode = true;
    globals.states.lastHammeredNodeAt = new Date().getTime();
    setTimeout(function(){ 
      if (new Date().getTime() - globals.states.lastHammeredNodeAt > 500) 
        globals.states.hammeringNode = false; 
    }, 500);
		node_OnMouseUp(node, x, y)
  }
}

//-----------------------------------------------------------------
function node_Event_subNodePulledOut(node, x, y)
{
	var parentNode = nodeLayer.attr('parentnodeid', node.data.superNodes[0]);
	// show 'create-node' modal
	// create new node
}

function nodeFlyout_Event_HideClick(nodeId) {
	removeNodeFromGraph(nodeId);
}

function nodeFlyout_Event_PinClick(nodeId) {
	var node = globals.GRAPH.getNode(nodeId);
	unPinNode(node);
}


function node_OnMouseEnter(node, x, y) {
  globals.states.overNode = node;
	if (node.data.nodeType == "data")
		dataNode_OnMouseEnter(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseEnter(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseEnter(node, x, y);
}

function node_OnMouseDown(node, x, y) {
	globals.states.holdingNode = node;
  node.data.dragging = 'true';

	if (node.data.nodeType == "data")
		dataNode_OnMouseDown(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseDown(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseDown(node, x, y);
}

function node_OnMouseDblClick(node, x, y) {
	if (node.data.nodeType == "data")
		dataNode_OnMouseDblClick(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseDblClick(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseDblClick(node, x, y);
}

function node_OnMouseLeave(node, x, y) {
  globals.states.overNode = null;
	if (node.data.nodeType == "data")
		dataNode_OnMouseLeave(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseLeave(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseLeave(node, x, y);
}

function node_OnMouseUp(node, x, y) {
	//$node.data.UI.fullUI.attr('dragging', 'false');
	globals.states.holdingNode = null;
  node.data.dragging = 'false';
	//console.log('node state', node);

	if (node.data.nodeType == "data")
		dataNode_OnMouseUp(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnMouseUp(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnMouseUp(node, x, y);
}

function node_OnDrag(node, x, y) {
	if (node.data.nodeType == "data")
		dataNode_OnDrag(node, x, y);
	else if (node.data.nodeType == "subnode")
		subNode_OnDrag(node, x, y);
	else if (node.data.nodeType == "planned")
		plannedNode_OnDrag(node, x, y);

}
//---- Node Specific: Data Nodes -------------------------------------------------------------

function dataNode_OnMouseEnter(node, x, y) {
	if (globals.viewOptions.highlightRelated) {
		new LinkHelper().HighlightRelatedNodes(node.id, true);
  }
	if (globals.viewOptions.highlightdescendants) {
    new LinkHelper().HighlightDescendantNodes(node.id, true);
  }
	if (globals.viewOptions.highlightAncestors) {
    new LinkHelper().HighlightAncestorNodes(node.id, true);
  }

}

function dataNode_OnMouseDown(node,x, y) {
  
	var graphHelper = new GraphHelper();
  graphHelper.ConsoleShowNode(node);

  highlightSelectedNode(node.id);
	globals.nodeFunctions = NodeFunctionsFactory.createNew(node);
	globals.layout.pinNode(node, true);
	node.data.isPinned = true;

}

function dataNode_OnMouseUp(node, x, y) {
	globals.consoleService.ShowFlyout(node, x, y);
	// Not yet implemented.
}

function dataNode_OnMouseDblClick(node, x, y) {
  //nodePositionAnimation(node, {x:0,y:0});
	globals.dataService.FetchEntitiesForNodeId(node.id, node.data.sourceConfig);
  new EntityEventsHelper().NodeDblClick(node);
  //globals.animator.AddNodeRipple(node);
}

function dataNode_OnMouseLeave(node, x, y) {
	if (globals.viewOptions.highlightRelated) {
    new LinkHelper().HighlightRelatedNodes(node.id, false);
  }
	if (globals.viewOptions.highlightdescendants){ 
    new LinkHelper().HighlightDescendantNodes(node.id, false);
    }
	if (globals.viewOptions){ 
    new LinkHelper().HighlightAncestorNodes(node.id, false);
    }
}

function dataNode_OnDrag(node, x, y) {
  // pushOtherNodes
	// not yet implemented
}

//---- Node Specific: Sub Nodes -------------------------------------------------------------
function subNode_OnMouseEnter(node, x, y) {
	// not yet implemented
}

function subNode_OnDblClick(node, x, y) {
	// not yet implemented
}

function subNode_OnMouseLeave(node, x, y) {
	// not yet implemented
}

function subNode_OnMouseDown(node, x, y) {
	// not yet implemented
}

function subNode_OnMouseUp(node, x, y) {
	node.data.UI.fullUI.attr('dragging', 'false');
	node.data.UI.fullUI.childNodes[0].attr('r', Number(node.data.entityConfig.config.attributes["radius"]));
	fixTextWidth4Node(node, x, y);
}

function subNode_OnDrag(node, x, y) {
	var nodeUI = node.data.UI.fullUI;
	var parentNodeId = nodeUI.attr('parentnodeid')
	var parentPos = globals.layout.getNodePosition(parentNodeId);
	var thisPos = globals.layout.getNodePosition(nodeid);
	var distance = calculateDistance(parentPos, thisPos);
	var eventsHelper = new EventsHelper(node);
	if (eventsHelper.distancePassedThreshold(distance))
		nodeEvent('SubNodePulledOut', node);

	nodeUI.childNodes[0].attr('r', distance / 5);
	//nodeUI.children[1].text(Math.ceil(distance/5)+'%');
	fixTextWidth4Node(globals.GRAPH.getNode(nodeid));
}

//---- Node Specific: Planned Nodes -------------------------------------------------------------
function plannedNode_OnMouseEnter(node, x, y) {
	// not yet implemented
}

function plannedNode_OnDblClick(node, x, y) {
	// not yet implemented
}

function plannedNode_OnMouseLeave(node, x, y) {
	// not yet implemented
}

function plannedNode_OnMouseDown(node, x, y) {
	// not yet implemented
}

function plannedNode_OnMouseUp(node, x, y) {
	// not yet implemented
}

function plannedNode_OnDrag(node, x, y) {
	// not yet implemented
}


//---- Helper Functions -------------------------------------------------------------


var EventsHelper = function (node) {
	var _node = node;
	this.distancePassedThreshold = function (distance) {
		// Not yet implemented
	}
}


// --- Developer Custom Modals ---
// --- Modals ---
// Workflow modals
NodeFunctionsFactory.show_addWorkflowModal = function () {
	var nodeFlyout = document.getElementById('newWorkflowModel');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_updateWorkflowModal = function () {
	var nodeFlyout = document.getElementById('updateWorkflowModel');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_removeWorkflowModal = function () {
	var nodeFlyout = document.getElementById('removeWorkflowModel');
	nodeFlyout.showModal();
}
// Content modals
NodeFunctionsFactory.show_addContentModal = function () {
	var nodeFlyout = document.getElementById('addContentModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_updateContentModal = function () {
	var nodeFlyout = document.getElementById('updateContent');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_removeContentModal = function () {
	var nodeFlyout = document.getElementById('removeContent');
	nodeFlyout.showModal();
}
// Tool modals
NodeFunctionsFactory.show_addToolModal = function () {
	var nodeFlyout = document.getElementById('addToolModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_updateToolModal = function () {
	var nodeFlyout = document.getElementById('updateToolModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_removeToolModal = function () {
	var nodeFlyout = document.getElementById('removeToolModal');
	nodeFlyout.showModal();
}
// Collector Modals
NodeFunctionsFactory.show_addCollectorModal = function () {
	var nodeFlyout = document.getElementById('addCollectorModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_updateCollectorModal = function () {
	var nodeFlyout = document.getElementById('updateCollectorModal');
	nodeFlyout.showModal();
}
NodeFunctionsFactory.show_removeCollectorModal = function () {
	var nodeFlyout = document.getElementById('removeCollectorModal');
	nodeFlyout.showModal();
}

// --- Modal submit functions ---
// Workflow functions
NodeFunctionsFactory.add_workflow = function () {
	var modal = document.getElementById('newWorkflowModel');
	var nameFieldValue = modal.childNodes[0].childNodes[3].value;
	var nodeProperties = [];
	// Types can be string, number, array, other
	nodeProperties.push({ key: "workflowName", value: parseDataType(nameFieldValue, 'string') });
	createChildNode(this.node.id, "WORKFLOW", nodeProperties, 'SEND_TO', []);
	modal.close();
}

NodeFunctionsFactory.update_workflow = function () {
	var modal = document.getElementById('updateWorkflowModel');
	var nameFieldValue = modal.childNodes[0].childNodes[3].value;
	console.log('update_workflow for node:', this.node);
	this.node.data.properties.forEach(function (property) {
		if (property.key = "workflowName")
			property.value = nameFieldValue;
	});
	var callback = function () {
		Alert("Update applied");
	}
	globals.dataService.UpdateEntity(this.node.id, this.node.data.properties, callback);
	modal.close();
}

NodeFunctionsFactory.remove_workflow = function () {
	globals.dataService.GetRelatedEntityGraph(this.node.id);
	modal.close();
}
// Tool functions
NodeFunctionsFactory.add_tool = function () {
	var modal = document.getElementById('addToolModal');
	var nameFieldValue = modal.childNodes[0].childNodes[3].value;
	var nodeProperties = [];
	nodeProperties.push({ key: "toolName", value: parseDataType(nameFieldValue, 'string') });
	createChildNode(this.node.id, "TOOL", nodeProperties, 'SEND_TO', []);
	modal.close();
}

NodeFunctionsFactory.update_tool = function () {
	var modal = document.getElementById('updateToolModel');
	var nameFieldValue = modal.childNodes[0].childNodes[3].value;
	this.node.data.properties.forEach(function (property) {
		if (property.key = "toolName")
			property.value = nameFieldValue;
	});
	var callback = function () {
		Alert("Update applied");
	}
	globals.dataService.UpdateEntity(this.node.id, this.node.data.properties, callback);
	modal.close();
}

// Common functions ...
NodeFunctionsFactory.remove_entity = function () {
	globals.dataService.GetRelatedEntityGraph(this.node.id);
	modal.close();
}
//globals.nodeFunctions.createContentSubsetNode = function () { }
//globals.nodeFunctions.createToolNode = function () { }
//globals.nodeFunctions.createCollectorNode = function () { }

function NodeBehavioursApi() {
  
  //this.Behaviours = [
  //  {name: "autoImage", func: autoImage}
  //];

  this.AutoImageToConfig = function(nodeData) {
    for(var prop in nodeData.propertiesObject) {
      var propVal=nodeData.propertiesObject[prop];
      if(isImage(propVal)) {
        nodeData.entityConfig.config.attributes.img["url"] = propVal;
        //var config = createEntitySpecificConfig(nodeData.id);
        //config.config = {"attributes":{"img":{"url": propVal}}};
        //new ConfigHelper().AddDynamicEntityConfigReturnId(config.configName, config);
      }
    }
  }

  this.CreateSubNodesFromLinks = function(node) {
    //debugger;
    for(var prop in node.data.propertiesObject) {
      var propVal = node.data.propertiesObject[prop];
      if (isLink(propVal) && !isImage(propVal) && !isHtml(propVal) && node.data.labels[0] != 'link'){
        var dataSvc= new DataService();
        var subNode = dataSvc.CreateEntity_AddToGraph_ReturnNode(["link"], {"URL":propVal});
        var link=new dataSvc.CreateRelation_AddToGraph_ReturnLink(node.id,subNode.id,["links_to"]);

      }
    }
  }

  this.FetchNodeLinks = function(node) {
    for(var prop in node.data.propertiesObject) {
      var propVal = node.data.propertiesObject[prop];
      if (isLink(propVal) && !isImage(propVal) && !isHtml(propVal)){
        var dataSvc= new DataService();
        try{
          new ApiImportTranslator().Translate(propVal, node);
        }catch(exception){}
      }
    }
  }

  this.AutoImageToNode = function(node) {
    
    for(var prop in node.data.propertiesObject) {
      var propVal=node.data.propertiesObject[prop];
      if(isImage(propVal)) {
        node.data.UI.imageUI.link(propVal);
        node.data.UI.imageUI.attr("width", node.data.nodeSize * 3);
        node.data.UI.imageUI.attr("height", node.data.nodeSize * 3);
        node.data.UI.imageUI.attr("x", -node.data.nodeSize * 3/2);
        node.data.UI.imageUI.attr("y", -node.data.nodeSize * 3/2);
      }
    }
  }

  function isLink(value){
    if (typeof value !== "string") 
      return;
    if(value.length>7) {
        return value.substr(0,7).toLowerCase()=='http://' || value.substr(0,8).toLowerCase()=='https://'
    }
    return false;
  }

  function isHtml(value){
    if (typeof value !== "string") 
      return;
    if(value.length>5) {
        var possibleExtension=value.slice(-5);
        return possibleExtension.toLowerCase()=='.html'
    }
    return false;
  }

  function isImage(value){
    if (typeof value !== "string") 
      return;
    if(value.length>4) {
        var possibleExtension=value.slice(-4);
        return possibleExtension.toLowerCase()=='.jpg'
            ||possibleExtension.toLowerCase()=='.svg'
            ||possibleExtension.toLowerCase()=='.bmp'
            ||possibleExtension.toLowerCase()=='.png'
            ||possibleExtension.toLowerCase()=='.gif'
            ||possibleExtension.toLowerCase()=='.ico';
    }
    return false;
  }

  function createEntitySpecificConfig(entityId){
    var newConfig = {};
    newConfig.configName = 'N' + entityId + '_behaviours';
    newConfig.configType = "entity";
    newConfig.matchEntity = {"id":entityId}
    return newConfig;
  }

}
function nodeAppearanceModel(node) {
  var _cnf=node.data.entityConfig.config;

  this.node=node;
  this.nodeGraphics=[];
  this.nodeEffects=[];

  this.addNodeBody=function() {
    var nodeRadius=Number(_cnf.attributes["radius"]);
    var nodeBody=Viva.Graph.svg(_cnf.attributes["shape"])
			.attr('cx',0)//...for circle
			.attr('cy',0)//...for circle
			.attr('r',nodeRadius) //...for circle
			.attr('fill',_cnf.attributes["background-color"]==null?'grey':_cnf.attributes["background-color"])
			.attr('stroke-width',Number(_cnf.attributes["border-width"]))
			.attr('stroke',_cnf.attributes["border-color"]==null?'black':_cnf.attributes["border-color"])
    if(_cnf.attributes["shape"]=="rect") {
      nodeBody.attr('width',Number(_cnf.attributes["width"]));
      nodeBody.attr('height',Number(_cnf.attributes["height"]));
      nodeBody.attr('rx',nodeRadius);
      nodeBody.attr('x',-((Number(_cnf.attributes["width"]))/2));
      nodeBody.attr('y',-((Number(_cnf.attributes["height"]))/2));
    }
    if(_cnf.effects["shadow"]==true)
      nodeBody.attr('filter','url(#shadowEffect)');
    if(_cnf.effects["haze"]==true)
      nodeBody.attr('filter','url(#hazeEffect)');
    if(_cnf.effects["glass"]==true)
      nodeBody.attr('fill','url(#gradGlass)');
    if(_cnf.effects["rounded"]==true)
      nodeBody.attr('fill','url(#gradRound)');
    if(!_cnf.effects["opaque"]==true)
      nodeBody.attr('fill-opacity',_cnf.attributes["opacity"]);
    node.data.UI.bodyUI=nodeBody;
    this.nodeGraphics.push(nodeBody);
    return nodeBody
  }

  this.addNodeImage=function() {

    //if (!_cnf.attributes.img["url"] == null)
    //	return;
    // Evaluate image url:
    var imageUrl="";
    if(_cnf.attributes.img.displayData["key"]==="property")
      imageUrl=this.node.data.propertiesObject[_cnf.attributes.img.displayData["value"]];
    else if(_cnf.attributes.img.displayData["key"]==="static")
      imageUrl=_cnf.attributes.img.displayData["value"];
    else
      imageUrl=_cnf.attributes.img["url"];

    var imgWidth=Number(_cnf.attributes.img["width"]);
    var imgHeight=Number(_cnf.attributes.img["height"]);

    if(imageUrl&&imgWidth===0)
      imgWidth=100;
    if(imageUrl&&imgHeight===0)
      imgHeight=100;

    var nodeBodyImage=Viva.Graph.svg('image')
		//var nodeRadius = Number(nodeRadius);
		//.attr('rx', nodeRadius)
		.attr('width',imgWidth)
		.attr('height',imgHeight)
		.attr('x',-imgWidth/2)
		.attr('y',-imgHeight/2)
		.attr('opacity',Number(_cnf.attributes.img["opacity"]))
    .link(imageUrl);
    if(_cnf.effects["rounded"]==true) nodeBodyImage.attr('fill','url(#gradRound)');
    //if (!_cnf.effects["opaque"] == true) nodeBodyImage.attr('opacity', Number(_cnf.attributes.img["opacity"]));
    this.node.data.UI.imageUI=nodeBodyImage;
    this.nodeGraphics.push(nodeBodyImage);
    return nodeBodyImage;
  }

  this.addNodeOption=function(thingConfig) {
    nodeOption=Viva.Graph.svg('image')
			.attr('x',thingConfig["x"])
			.attr('y',thingConfig["y"])
			.attr('width',thingConfig["size"])
			.attr('height',thingConfig["size"])
			.attr('fill',thingConfig["color"])
			.link(thingConfig["url"])
    this.node.data.UI.options.push(nodeOption);
    this.nodeGraphics.push(nodeOption);
    return nodeOption;
  }

  this.addNodeLine=function() {
    var x=Math.ceil(getRandomArbitrary(40,90));
    var y=Math.ceil(getRandomArbitrary(40,90));
    var r=Math.ceil(getRandomArbitrary(0,360));
    var sx=Math.ceil(getRandomArbitrary(-1,1));
    var sy=Math.ceil(getRandomArbitrary(-1,1));

    nodeLine=Viva.Graph.svg('line')
			.attr('x1',0)
			.attr('y1',0)
			.attr('x2',x)
			.attr('y2',y)
			.attr('style',"stroke:url(#gradShine);transform:rotate("+r+"deg);")
			.attr('stroke-width','2')
    ;
    this.node.data.UI.options.push(nodeLine);
    this.nodeGraphics.push(nodeLine);
    return nodeLine;
  }

  this.addNodeText=function() {
    if(!_cnf.attributes.labelText["show"])
      return;
    //Text elements...
    var displayText=Viva.Graph.svg('text')
			.attr('y',Number(_cnf.attributes.labelText["x"]))
			.attr('x',Number(_cnf.attributes.labelText["y"]))
			.attr('fill',_cnf.attributes.labelText["color"])
			.attr('font-family',_cnf.attributes.labelText["font-family"])
			.attr('font-weight',_cnf.attributes.labelText["font-weight"])
			.attr('font-size',Number(_cnf.attributes.labelText["font-size"]))
			//.attr('stroke', 'black')
			//.attr('stroke-width', '0.5')
			.text(this.node.data.displayLabel);
    //if (_cnf.attributes.labelText.effects["haze"] == true)
    //	displayText.attr('filter', 'url(#darkHazeEffect)'); //haze
    this.node.data.UI.displayTextUI=displayText;
    this.nodeGraphics.push(displayText);
    return displayText;
  }

  this.addNodeCircleTextPath=function() {
    if(!_cnf.attributes.circleText["show"])
      return;
    var r=Number(_cnf.attributes["radius"])+5;
    var circleTextPath=Viva.Graph.svg('path')
			.attr('id','npath_'+this.node.data.id)
			.attr('d',''
				+'M 0, 0'
				+'m -'+r+', 0'
				+'a '+r+', '+r+' 0 1, 0 '+r*2+', 0'
				+'a '+r+', '+r+' 0 1, 0 -'+r*2+', 0')
			.attr('fill','transparent')
			.attr('style',"transform:rotate("+90+"deg);")
    this.node.data.UI.circleTextPath=circleTextPath;
    this.nodeGraphics.push(circleTextPath);
    return circleTextPath;
  }

  this.addNodeCircleText=function() {
    if(!_cnf.attributes.circleText["show"])
      return;
    var circleText=Viva.Graph.svg('text')
			.attr('y',0)
			.attr('x',0)
			.attr('fill',_cnf.attributes.circleText["color"])
			.attr('opacity',_cnf.attributes.circleText["opacity"])
			.attr('font-size','10')
    circleText.innerHTML+='<textPath alignment-baseline="hanging" text-anchor="middle" xlink:href="#npath_'+this.node.data.id+'" startOffset="50%">'+this.node.data.circleText+'</textPath>';
    //circleText.innerHTML += '<textPath alignment-baseline="baseline" text-anchor="start" xlink:href="#npath_' + this.node.data.id + '" startOffset="0%">' + this.node.data.circleText + '</textPath>';
    this.node.data.UI.circleText=circleText;
    this.nodeGraphics.push(circleText);
    return circleText;
  }

  this.addEffect=function(name,definition) {
    this.nodeEffects.push({ name: name,definition: definition });
  }



  this.compileNode=function(ui) {
    node.data.UI.fullUI=ui;

    addEffectsToNode(ui,this.nodeEffects);

    this.nodeGraphics.forEach(function(nodeGraphic) {
      ui.append(nodeGraphic);
    });

  }

  function addEffectsToNode(ui,nodeEffects) {
    var effectsUi='<defs>';
    for(var i=0;i<nodeEffects.length;i++) {
      effectsUi+=nodeEffects[i].definition;
    }
    effectsUi+='</defs>';
    ui.innerHTML=effectsUi;

    //for(var i=0;i<nodeEffects.length;i++) {
    //  ui.attr('filter','url(#'+nodeEffects[i].name+')');
    //}
  }
}


function defineNodeAppearance_dataNode(node,ui) {
  var _cnf=node.data.entityConfig.config;

  ui.attr('class','datanode')
  node.data.UI={
    bodyUI: undefined,
    imageUI: undefined,
    displayTextUI: undefined,
    options: [],
    circleTextPath: undefined,
    circleText: undefined
  }

  //Circle elements NODE-CIRCLE
  var nodeAppearance=new nodeAppearanceModel(node);

  nodeAppearance.addNodeBody();
  nodeAppearance.addNodeImage();
  nodeAppearance.addNodeText();
  nodeAppearance.addNodeCircleTextPath();
  nodeAppearance.addNodeCircleText();

  _cnf["relatedThings"].forEach(function(thingConfig) {
    if(thingConfig.thingName==="option")
      nodeAppearance.addNodeOption(thingConfig);
  });

  if(_cnf.effects["haze"]) {
    nodeAppearance.addEffect("hazeEffect",
		  '<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>'
	  );
  }
  if(_cnf.effects["shadow"]) {
    nodeAppearance.addEffect("shadowEffect",
      '<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>'
    );
  }
  if(_cnf.effects["glass"]) {
    nodeAppearance.addEffect("gradGlass",''
      +'<linearGradient id="gradGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%">'
      +'	<stop offset="0%" stop-color="#606768" stop-opacity="0.3"/>'
      +'	<stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/>'
      +'	<stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/>'
      +'	<stop offset="28%" stop-color="#000000" stop-opacity="0.3"/>'
      +'	<stop offset="73%" stop-color="#000000" stop-opacity="0.3"/>'
      +'	<stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/>'
      +'	<stop offset="97%" stop-color="#000000" stop-opacity="0.3"/>'
      +'	<stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>'
      +'</linearGradient>'
    );
  }
  if(_cnf.effects["highlightHaze"]) {
    nodeAppearance.addEffect("gradShine",''
      +'<linearGradient id="gradShine" x1="0%" y1="0%" x2="100%" y2="100%">'
      +'	<stop offset="0%"   stop-color="white" stop-opacity="0.7"/>'
      +'	<stop offset="100%"  stop-color="purple" stop-opacity="0"/>'
      +'</linearGradient>'
    );
  }
  if(_cnf.effects["rounded"]) {
    //effects.push('<linearGradient id="coloredGlass" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#606768" stop-opacity="0.3"/><stop offset="3%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="27%" stop-color="#bbbbbb" stop-opacity="0.3"/><stop offset="28%" stop-color="#000000" stop-opacity="0.3"/><stop offset="73%" stop-color="#000000" stop-opacity="0.3"/><stop offset="88%" stop-color="#4b5051" stop-opacity="0.3"/><stop offset="97%" stop-color="#000000" stop-opacity="0.3"/><stop offset="100%" stop-color="#000000" stop-opacity="0.3"/></linearGradient>');
    nodeAppearance.addEffect("gradRound",
      '<radialGradient id="gradRound" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="80%" style="stop-color:rgb('+node.data.nodeColorRGB.r+','+node.data.nodeColorRGB.g+','+node.data.nodeColorRGB.b+'); stop-opacity:1" /><stop offset="100%" style="stop-color:rgb('+(node.data.nodeColorRGB.r-100)+','+(node.data.nodeColorRGB.g-100)+','+(node.data.nodeColorRGB.b-100)+');stop-opacity:1" /></radialGradient>'
    );
  }
  //var effectsUi = nodeAppearance.addEffects(effects);
  //console.log(effectsUi);


  nodeAppearance.compileNode(ui);



}


function defineNodeAppearance_plannedNode(node, ui) {
	var cnf = node.data.sourceConfig.displaySettings;
	var nodeConfig = node.data.config.nodeDisplayBody;
	if (nodeConfig.color) { node.data.nodeColor = nodeConfig.color; }
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	nodeBody = Viva.Graph.svg('circle')
		.attr('cx', 0)//...for circle
		.attr('cy', 0)//...for circle
		.attr('r', nodeRadius) //...for circle
		.attr('fill', node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
		.attr('stroke-width', 3)
		.attr('stroke', cnf.entityBorderColor == null ? node.data.nodeBorderColor : cnf.entityBorderColor)
	//.attr('stroke-opacity',0.5);
	if (cnf.haze == true) { nodeBody.attr('filter', 'url(#hazeEffect)'); } //haze
	if (cnf.rounded == true) { nodeBody.attr('fill', 'url(#gradRound)'); }
	if (!cnf.opaque == true) { nodeBody.attr('fill-opacity', node.data.nodeOpacity); }

	nodeBodyImage = Viva.Graph.svg('image')
		.attr('x', -nodeRadius)
		.attr('y', -nodeRadius)
		.attr('rx', nodeRadius)
		.attr('width', nodeRadius * 2)
		.attr('height', nodeRadius * 2)
		.link(nodeConfig.image ? nodeConfig.image : '');
	if (cnf.rounded == true) { nodeBodyImage.attr('fill', 'url(#gradRound)'); }
	if (!cnf.opaque == true) { nodeBodyImage.attr('fill-opacity', node.data.nodeOpacity); }

	//Text elements...
	displayText = Viva.Graph.svg('text')
		.attr('y', 0)
		.attr('x', 0)
		.attr('fill', cnf.entityLabelColor)
		.attr('stroke-width', '0')
		.attr('font-family', 'Arial, Helvetica, sans-serif')
		.attr('font-size', '20')
		.text(node.data.displayLabel);


	popoutTextUI = Viva.Graph.svg('text')
		.attr('class', 'slideText')
		.attr('y', -nodeRadius) //nodeRadius/2 + 5)
		.attr('x', 0)// - node.data.displayLabel.length)
		.attr('fill', '#0077b3')
		.attr('stroke-width', '0')
		.attr('font-family', 'Arial, Helvetica, sans-serif')
		.attr('font-size', '10')
		.text('--');
	popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="50" dy="1.2em">', '</tspan>');

	popoutBodyUI = Viva.Graph.svg('rect')
		.attr('class', 'slideout')
		.attr('x', nodeRadius / 2)
		.attr('y', -nodeRadius)
		.attr('rx', nodeRadius / 4)
		.attr('height', 0)
		.attr('fill', '#141414')
	if (!cnf.opaque == true) { popoutBodyUI.attr('fill-opacity', 0.3); }


	//var defs = globals.graphics.getSvgRoot().append('defs');
	//defs.append(midMarker);

	var visDefs = '<defs>';
	visDefs += '<filter id="hazeEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="FillPaint" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
	visDefs += '<filter id="shadowEffect" x="-1" y="-1" width="300%" height="300%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>';
	//visDefs += '<radialGradient id="gradGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:#ffffff; stop-opacity:1" /><stop offset="100%" style="stop-color:#66e0ff;stop-opacity:0" /></radialGradient>';
	visDefs += '<radialGradient id="gradRound" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="80%" style="stop-color:rgb(' + node.data.nodeColorRGB.r + ',' + node.data.nodeColorRGB.g + ',' + node.data.nodeColorRGB.b + '); stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(' + (node.data.nodeColorRGB.r - 100) + ',' + (node.data.nodeColorRGB.g - 100) + ',' + (node.data.nodeColorRGB.b - 100) + ');stop-opacity:1" /></radialGradient>';
	visDefs += '</defs>';
	ui.innerHTML = visDefs;


	node.data.UI.fullUI = ui;
	node.data.UI.bodyUI = nodeBody;
	node.data.UI.imageUI = nodeBodyImage;
	node.data.UI.displayTextUI = displayText;
	node.data.UI.popoutBodyUI = popoutBodyUI;
	node.data.UI.popoutTextUI = popoutTextUI;

	//if (cnf.loadNodePopouts){ui.append(node.data.UI.bodyUI);}//else{ui.append(rectblank);}
	if (cnf.loadNodePopouts) { ui.append(node.data.UI.popoutBodyUI); }
	ui.append(node.data.UI.bodyUI);
	if (nodeConfig.image) { ui.append(node.data.UI.imageUI); }
	//ui.append(node.data.UI.focusUI);
	if (cnf.showLabels) { ui.append(node.data.UI.displayTextUI); }
	if (cnf.loadNodePopouts) { ui.append(node.data.UI.popoutTextUI); }

}
function defineNodeAppearance_subNode(node, ui) {
	var cnf = node.data.sourceConfig.displaySettings;
	var nodeConfig = node.data.config.nodeDisplayBody;
	if (nodeConfig.color) { node.data.nodeColor = nodeConfig.color; }
	var nodeRadius = Number(node.data.entityConfig.config.attributes["radius"]);
	nodeBody = Viva.Graph.svg('circle')
		.attr('cx', 0)//...for circle
		.attr('cy', 0)//...for circle
		.attr('r', nodeRadius) //...for circle
		.attr('fill', node.data.nodeColor)//node.data.nodeColor)//'#4dffc3')
		.attr('stroke-width', 3)
		.attr('stroke', node.data.nodeColor)
	nodeBodyImage = Viva.Graph.svg('image')
		.attr('x', -nodeRadius)
		.attr('y', -nodeRadius)
		.attr('rx', nodeRadius)
		.attr('width', nodeRadius * 2)
		.attr('height', nodeRadius * 2)
		.link(nodeConfig.image ? nodeConfig.image : '');
	if (cnf.rounded) { nodeBodyImage.attr('fill', 'url(#gradRound)'); }
	if (!cnf.opaque) { nodeBodyImage.attr('fill-opacity', node.data.nodeOpacity); }

	//Text elements...
	displayText = Viva.Graph.svg('text')
		.attr('y', 0)
		.attr('x', 0)
		.attr('fill', 'black')
		.attr('stroke-width', '0')
		.attr('font-family', 'Arial, Helvetica, sans-serif')
		.attr('font-size', '20')
		.text(node.data.displayLabel);

	node.data.UI.fullUI = ui;
	node.data.UI.bodyUI = nodeBody;
	node.data.UI.imageUI = nodeBodyImage;
	node.data.UI.displayTextUI = displayText;

	ui.append(node.data.UI.bodyUI);
	if (nodeConfig.image) { ui.append(node.data.UI.imageUI); }
	if (cnf.showLabels) { ui.append(node.data.UI.displayTextUI); }
}
function propertyType(key, value) {
    this.key = key;
    this.value = value;
    this.datatype = getType(value);
    //console.log(key + ': ' + this.datatype + ' = ' + value);
    return this;
}


function themeType(entityRgbRange, graphBackground, entityLabelColor) {
    this.entityRgbRange = (entityRgbRange) ? entityRgbRange : { min: 100, max: 200 };
    /*The 4bit rgb range from which label colors can be automatically generated.*/
    this.graphBackground = (graphBackground) ? graphBackground : '#1a1a1a';
    this.entityLabelColor = (entityLabelColor) ? entityLabelColor : 'white';
    //this.entityShape = (entityShape)?entityShape: 'rect';
    this.opaque = false;
    /*choices: 
		rect (entities are rectangular)
		circle (entities are circles)
	*/
    this.labelSizing = "fontsize";
    /*choices: 
		"hyphenate" (make labels shorter)
		"fontsize" (make the font size smaller)
		"" (no sizing, labels may extend past the boundaries of the node)
	*/
    this.shadow = true;
    this.glow = false;
    this.linkColor = 'red';
    this.rounded = false;
    this.showLabels = true;
}


function timeoutElementType(_element, _duration, functionRemove) {
    this.fnRemove = functionRemove;
    this.duration = _duration; //in seconds
    this.activationPoint = +new Date(); //+new Date()
    this.element = _element; //UI element
}

function viewOptionsType() {
    this.screenDragType = true;
    this.highlightRelated = true;
    this.highlightAncestors = false;
    this.highlightdescendants = false;
    this.navigateDirection = 'both';
    return this;
}
function GraphElement() {
	this.fromNode;
	this.toNode;
	this.link;
}
function PropertyTypeDef(){
  this.DataTypes = [];
  this.rangeIfNumber = {min: 0, max: 0}
}
function EntityTypeDef() {
  this.labels = [];
  this.properties = {};
  this.imageProperties = []; 
}


//==========Globals ==================================================================================================================================================================			
var globals = new Globals();

function Globals(){
	  this.browser = null;	
    //const UI_SHADOW_INDEX = 0;
		this.binaryToggle = true;
		//.....Functional variables.......
		this.labelsList = []; //list of "neoLabelType" objects
		this.nodeList = []; //list of "node" objects
    
    this.entityTypeDefs = []; 
    this.animations = [];
    
		this.monitoredNodes = [];//list of "node" objects
		this.toolPanels = [];
		this.monitoredLinks = []; //list of "link" objects
		this.animUpdateNodes = [];//list of "node" objects
		this.animUpdateLinks = []; //list of "link" objects
		this.checkedNodes = []; //list of "node" objects
		this.checkedLinks = []; //list of "node" objects
		this.linkList = []; //list of "link" objects
		this.timeoutElements = []; //list of "timeoutElement" objects
		this.selectedNodeID = '';
		this.selectedNodeData = '';
		this.selectedNode = '';
		this.selectedLink = '';
		this.selectedNodeUI = '';
		this.bRelate = false;
		this.bPlanRelate = false;
		this.counter = 10;	
		this.detailsUI;
		this.detailsNode;
		this.processUniqueId = 0; //... must be incremented every time its used
		this.nodeFunctions = {}; //... This object instance will become an instance of the factory class "NodeFunctions", and get developer custom functions added to it.

    this.animator = new AnimationHelper();
		this.consoleService = new ConsoleService();

    // States ...
    this.states = {};
    this.states.overNode = null; // ...nodeType; (mouse is over a node);
    this.states.holdingNode = null; // ...nodeType; (user is dragging or holding a node)
    this.states.hammeringNode = false; // ...Bool; (last tap/click within 1 second, was on a node)
    this.states.lastHammeredNodeAt = null; // ...Number; (the last Time that the node was clicked)
    // Modes ...
    this.modes = {};
    this.modes.createNodeOnGraphDblClick = false;
    this.modes.selectNodeAfterCreate = false;
    this.modes.createLinkFromSelectedNodeOnCreateNode = false;
    // Nodestamp
    this.nodeStamp = new NodeStampType();

		//......Filter settings.............
		this.viewOptions = new viewOptionsType();
		this.interactionOptions = new interactionOptionsType();

		//......Display settings............
		this.currentTheme = new themeType();
		this.maxLabelLength = 5; //the amount of characters allowed before elipse
		this.labelSize = 30;
		this.CommonUI = {};
	
		//SINGLETONS...
		this.GRAPH = '';
		this.graphics = '';
		this.layout = '';
		this.renderer = '';
		this.graphContainer;
		
		this.masterConfigs = [];
		this.masterEntityConfigs = [];
		this.config_ext; //...default config for whenever there isn't a specific config available

		//DATA PROVIDERS
		this.dataService = new DataService();

		this.allUnitTests = [];
}



// Private...
function createDataDriver() {
	return new LocalStorageDataDriver();
}

function createDataStringHelper() {
	return new DataStringHelper();
}


//[Test]
globals.allUnitTests.push(function getNextNewNodeId_Given_Expect1() {
	// Arrange
	var sut = createDataDriver();
	localStorage.removeItem('NEXT_NODE_ID');
	var expectedNodeId = 1;

	// Act
	var newNodeId = sut.GetNextNewEntityId();

	// Assert
	return (newNodeId === expectedNodeId) ? true : expectedNodeId;
});

globals.allUnitTests.push(function getNextNewLinkId_Given_Expect1() {
	// Arrange
	var sut = createDataDriver();
	localStorage.removeItem('NEXT_LINK_ID');
	var expectedLinkId = 1;

	// Act
	var newLinkId = sut.GetNextNewRelationId();

	// Assert
	return (newLinkId === expectedLinkId) ? true : expectedLinkId;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNoNode_ExpectNode() {
	// Arrange
	var sut = createDataDriver();

	// Act
	var nodeId = sut.CreateEntityInDatabasePopulateAndReturnId();

	// Assert
	return (nodeId !== undefined) ? true : result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenEmptyNode_ExpectNodeId() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};

	// Act
	var nodeId = sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	return (nodeId !== undefined) ? true : result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenEmptyNode_ExpectNodeWithId() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};

	// Act
	var nodeId = sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(nodeId);
	return (result.id === nodeId) ? true : result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_Given2NodesWithIdsGetFirstNode_ExpectFirstInputNodeId() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	sut.CreateEntityInDatabasePopulateAndReturnId(node2);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	return (result.id === node1.id) ? true : result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithIdAndLabel_ExpectInputNodeLabels() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		labels: ["label1"]
	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	for (var i = 0 ; i < node1.labels.length; i++) {
		if (node1.labels[i] !== result.labels[i])
			return result;
	}
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithMultipleLabels_ExpectInputNodeLabels() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		labels: ["label1", "label2"]
	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	for (var i = 0 ; i < node1.labels.length; i++) {
		if (node1.labels[i] !== result.labels[i])
			return result;
	}
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithNoLabels_ExpectInputNodeNoLabels() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.labels.length > 0)
		return result;
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWith0Properties_ExpectInputNodeNoProperties() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.properties.length > 0)
		return result;
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWith1Property_ExpectInputNodeWith1Property() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		properties: {
			property1: 'MyPropertyValue'
		}
	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.properties.property1 === 'MyPropertyValue')
		return true;
	return result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithNumberProperty_ExpectInputNodeWithNumberProperty() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		properties: {
			property1: 23
		}

	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.properties.property1 === 23)
		return true;
	return result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithBooleanProperty_ExpectInputNodeWithBooleanProperty() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		properties: {
			property1: true
		}

	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);
	if (result.properties.property1 === true)
		return true;
	return result;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenNodeWithArrayOfStringProperty_ExpectInputNodeWithArrayOfStringProperty() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		properties: {
			property1: ['test1', 'test2']
		}

	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);

	if (result.properties.property1 === undefined)
		return result;

	for (var i = 0; i < result.properties.property1.length; i++) {
		if (result.properties.property1[i] !== 'test1' && result.properties.property1[i] !== 'test2')
			return result;
	}
	return true;
});

//[Test]
globals.allUnitTests.push(function CreateNodeInDatabasePopulateAndReturnId_GivenVerboseNode_ExpectNodeWithAllAttributes() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {
		labels: ['WORKFLOW', 'TOOL'],
		properties: {
			toolName: "EXCEL",
			property1: 'string test',
			property2: 25,
			property3: true,
			property4: ['test1', 'test2']
		}
	};

	// Act
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Assert
	var result = sut.GetEntityFromDatabase(node1.id);

	if (result.properties.property1 === undefined || result.properties.property2 === undefined || result.properties.property3 === undefined || result.properties.property4 === undefined)
		return result;

	if (result.labels === [])
		return result;

	if (result.labels.length !== 2)
		return result;

	if (result.properties.property1 !== 'string test')
		return result;

	if (result.properties.property2 !== 25)
		return result;

	if (result.properties.property3 !== true)
		return result;


	for (var i = 0; i < result.properties.property4.length; i++) {
		if (result.properties.property4[i] !== 'test1' && result.properties.property4[i] !== 'test2')
			return result;
	}

	return true;
});

//[Test]
globals.allUnitTests.push(function createRelationshipPopulateAndReturnId_Given2NodeIds_ExpectLinkId0() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);

	// Act
	var result = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Assert
	if (result > 0)
		return true

	return result;

});

//[Test]
globals.allUnitTests.push(function createRelationshipPopulateAndReturnId_Given3NodeIds_ExpectLinkIdGreaterThan0() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node3 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var node3Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);

	// Act
	sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);
	var result = sut.CreateRelationPopulateAndReturnId(node2Id, node3Id);

	// Assert
	if (result === undefined || result <= 0)
		return result;

	return true;
});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenNode_ExpectRelatedNode() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var result = sut.GetRelatedNodes(node1Id);

	// Assert
	if (result[0] === node2Id)
		return true;
	return result;
});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenNode_ExpectRelatedNodeAndLink() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var result = sut.GetRelatedEntityGraph(node1Id);

	// Assert
	if (result[0].fromNode.id !== node1Id)
		return result;
	if (result[0].toNode.id !== node2Id)
		return result;
	if (result[0].link.id !== linkId)
		return result;
	return true;

});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_Given2RelatedNodes_ExpectRelatedNodeAndLink() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);

	// Assert
	if (results[0].fromNode.id !== node1Id)
		return results;
	if (results[0].toNode.id !== node2Id)
		return results;
	if (results[0].link.id !== linkId)
		return results;

	return true;

});


//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	node1.labels = ["HELLO"];
	node2.labels = ["WORLD"];

	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);
	addNodesToGraphFromGraphElementsAndReturnNodes(results, globals.currentTheme.sourceConfig);

	// Assert
	return true;

});


//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	node1 = {
		labels: ["WORKFLOW"],
		properties: { workflowName: "Transform" }
	};
	node2 = {
		labels: ["TOOL"],
		properties: { toolName: "WORD" }
	};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);
	addNodesToGraphFromGraphElementsAndReturnNodes(results, globals.currentTheme.sourceConfig);

	// Assert
	return true;

});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var link = {};
	node1.labels = ["PARENT"];
	node2.labels = ["CHILD"];
	var linkLabels = ["MOTHER_OF"];
	var linkProperties = {
		BirthType: 'Natural Born',
		property3: true,
		Activities: ['Dancing', 'Hockey']
	}
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id, linkLabels, linkProperties);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);
	addNodesToGraphFromGraphElementsAndReturnNodes(results, globals.currentTheme.sourceConfig);

	// Assert
	return true;

});

//[Test]
globals.allUnitTests.push(function GetRelatedNodes_GivenGiven2RelatedNodes_ExpectVisualGraph() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	node1.labels = ["CASE1"];
	node2.labels = ["CASE2"];
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var linkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id);

	// Act
	var results = sut.GetRelatedEntityGraph(node1Id);
	addNodesToGraphFromGraphElementsAndReturnNodes(results, globals.currentTheme.sourceConfig);

	// Assert
	return true;
});


//[Test]
globals.allUnitTests.push(function deleteNode_Given1DeletedNode_ExpectNodeNotFound() {
	// Arrange
	var sut = createDataDriver();
	var node1 = {};
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	sut.DeleteEntity(node1Id);

	// Act
	var result = sut.EntityExists(node1Id);

	// Assert
	if (result === false)
		return true

	return result;

});



//=========== DataStringHelper Tests =========================================================================================================
//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf100AndCriteria33_ExpectIndex33() {
	// Arrange
	var sut = createDataStringHelper();
	var expected = '|';

	// Act
	var result = sut.getNewDataString();

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf100AndCriteria33_ExpectIndex33() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var expected = 33;

	for (var i = 0 ; i < 100; i++)
		arrayOfNumbers.push(i);

	// Act
	var result = sut.numberBinarySearch(arrayOfNumbers, 33);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf100AndCriteria34_ExpectIndex34() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var expected = 34;

	for (var i = 0 ; i < 100; i++)
		arrayOfNumbers.push(i);

	// Act
	var result = sut.numberBinarySearch(arrayOfNumbers, 34);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf100AndCriteria35_ExpectIndex35() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var expected = 35;

	for (var i = 0 ; i < 100; i++)
		arrayOfNumbers.push(i);

	// Act
	var result = sut.numberBinarySearch(arrayOfNumbers, 35);

	// Assert
	if (result === expected)
		return true
	return result;
});



//[Test]
globals.allUnitTests.push(function binarySearch_GivenArrayOf1AndCriteria1_ExpectIndex1() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var expected = 1;

	for (var i = 0 ; i < 1; i++)
		arrayOfNumbers.push(i);

	// Act
	var result = sut.numberBinarySearch(arrayOfNumbers, 1);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenDataStringAndCriteriaPQR_ExpectIndexPQR() {
	// Arrange
	var sut = createDataStringHelper();
	var arrayOfNumbers = [];
	var input = "|ABC:12,|DEF|GHIJKL|MNO|PQR|STU|VWX|YZ|";
	var expected = 'PQR';

	// Act
	var wordIndex = sut.indexOfElementInDataString(input, expected);
	var result = sut.getWordAtIndex(input, wordIndex);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenEmptyDataStringAnd1Element_ExpectElementInDataString() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|A|";
	var searchFor = "TEST";
	var expected = 3.1;

	// Act

	var result = sut.indexOfElementInDataString(input, searchFor);
	//var result = sut.getWordAtIndex(input, wordIndex);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenEmptyDataStringAnd1Element_ExpectElementInDataString() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|";
	var searchFor = "TEST";
	var expected = 1.1;

	// Act

	var result = sut.indexOfElementInDataString(input, searchFor);
	//var result = sut.getWordAtIndex(input, wordIndex);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenDataStringAndValueOfPQC_ExpectValuePQC() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,|DEF|GHIJKL|MNO|PQA|PQB|PQC|PQD|PQE|PQR|STU|VWX|YZ|";
	var expected = 'PQC';


	// Act
	var wordIndex = sut.indexOfElementInDataString(input, expected);
	var result = sut.getWordAtIndex(input, wordIndex);

	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenDataStringAndValueOfDoesntExist_ExpectIndex() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:2234345|PQR:2|STU:12|VWX:0|YZ:3|";
	var searchFor = 'PQF'; //...doesn't exist
	var expected = 49.1;

	// Act
	var result = sut.indexOfElementInDataString(input, searchFor);

	// Assert
	if (result === expected)
		return true
	return result;
});


//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenDataStringAndLongerValueOfExisting_ExpectIndexNegative1() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:23|PQR:2|STU:12|VWX:0|YZ:3|";
	var searchFor = 'PQRR'; //...doesn't exist
	var expected = 50.1;
	// Act
	var result = sut.indexOfElementInDataString(input, searchFor);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollection_ExpectAllPass() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:23|PQR:2|STU:12|VWX:0|YZ:3|";
	var searchFor = 'PQRR'; //...doesn't exist
	var subTestsFailed = false;

	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var subInput = testCases[i].split(':')[0];
		var expected = input.indexOf(testCases[i]);
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (' + subInput + ', ' + expected + ')');
		var result = sut.indexOfElementInDataString(input, subInput);
		if (result !== expected) {
			console.log('     FAILED: expected = ' + expected + ', actual = ' + result);
			subTestsFailed = true;
		}
	}

	// Assert
	if (subTestsFailed)
		return false;
	return true;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollectionButLongerLabels_ExpectAllPass() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|PQE:23|PQR:2|STU:12|VWX:0|YZ:3|";
	var searchFor = 'PQRR'; //...doesn't exist
	var subTestsFailed = false;
	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var subInput = testCases[i].split(':')[0] + 'XY';
		var expected = input.indexOf(testCases[i]) + testCases[i].length + 1 + 0.1; // add the insert flag
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (' + subInput + ', ' + expected + ')');
		var result = sut.indexOfElementInDataString(input, subInput);
		if (result !== expected) {
			console.log('     FAILED: expected = ' + expected + ', actual = ' + result);
			subTestsFailed = true;
		}
	}
	// Assert
	if (subTestsFailed)
		return false;
	return true;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollectionButShorterLabels_ExpectAllPass() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:12|VWX:0|YZ:3|";
	var subTestsFailed = false;
	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var subInput = testCases[i].split(':')[0].slice(0, -1);
		var expected = input.indexOf(testCases[i]) + 0.1; // add the insert flag
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (' + subInput + ', ' + expected + ')');
		var result = sut.indexOfElementInDataString(input, subInput);
		if (result !== expected) {
			console.log('     FAILED: expected = ' + expected + ', actual = ' + result);
			subTestsFailed = true;
		}
	}
	// Assert
	if (subTestsFailed)
		return false;
	return true;
});

//[Test]
globals.allUnitTests.push(function insertElementIntoDataString_GivenEmptyStringAndDataElement_ExpectDataElement() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|";
	var itemToAdd = 'ABC'; //...doesn't exist yet
	// Act
	var newDataString = sut.insertElementIntoDataString(input, itemToAdd);
	// Assert
	if (newDataString === '|ABC|')
		return true
	return newDataString;
});

//[Test]
globals.allUnitTests.push(function insertElementIntoDataString_GivenEmptyStringAndDataElement_ExpectDataElement() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|"; // ...Empty storage
	// Act
	storageString = sut.insertElementIntoDataString(storageString, 'ABC');
	storageString = sut.insertElementIntoDataString(storageString, 'GHI');
	storageString = sut.insertElementIntoDataString(storageString, 'DEF');
	// Assert
	if (storageString === '|ABC|DEF|GHI|')
		return true
	return storageString;
});

//[Test]
globals.allUnitTests.push(function deleteElementFromDataString_GivenStorageStringAndDataElement_ExpectDataElementRemoved() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|"; // ...Empty storage
	// Act
	storageString = sut.insertElementIntoDataString(storageString, 'ABC');
	storageString = sut.insertElementIntoDataString(storageString, 'GHI');
	storageString = sut.insertElementIntoDataString(storageString, 'DEF');

	// Act
	storageString = sut.deleteElementFromDataString(storageString, 'DEF');

	// Assert
	if (storageString === '|ABC|GHI|')
		return true
	return storageString;
});

//[Test]
globals.allUnitTests.push(function deleteElementFromDataString_GivenStorageStringAndNonExistingDataElement_ExpectNoChange() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|"; // ...Empty storage
	// Act
	storageString = sut.insertElementIntoDataString(storageString, 'ABC');
	storageString = sut.insertElementIntoDataString(storageString, 'GHI');
	storageString = sut.insertElementIntoDataString(storageString, 'DEF');
	// Act
	storageString = sut.deleteElementFromDataString(storageString, 'HIJ');
	// Assert
	if (storageString === '|ABC|DEF|GHI|')
		return true
	return storageString;
});

//[Test]
globals.allUnitTests.push(function deleteElementFromDataString_GivenEmptyStorageStringAndNonExistingDataElement_ExpectNoChange() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|"; // ...Empty storage
	// Act


	// Act
	storageString = sut.deleteElementFromDataString(storageString, 'ABC');

	// Assert
	if (storageString === '|')
		return true
	return storageString;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollection_ExpectAllLabelParts() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:12|VWX:0|YZ:3|";
	var subTestsFailed = false;
	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var elementName = testCases[i].split(':')[0];
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (removing: ' + elementName + ', from: ' + input + ')');
		var input = sut.deleteElementFromDataString(input, elementName);
		if (input.indexOf(elementName) > -1) {
			console.log('     FAILED: actual = ' + input);
			subTestsFailed = true;
		}
	}
	if (input != '|')
		return input
	// Assert
	if (subTestsFailed)
		return false;
	return true;
});


//[Test]
globals.allUnitTests.push(function getDataFromStorageString_GivenElement_ExpectData() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var elementName = 'STU';
	var expected = '45';
	// Act
	var result = sut.getDataFromDataString(storageString, elementName);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function stringBinarySearch_GivenStringCollection_ExpectAllDataParts() {
	// Arrange
	var sut = createDataStringHelper();
	var input = "|ABC:12,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:12|VWX:0|YZ:3|";
	var subTestsFailed = false;
	// Act
	var testCases = input.split('|');
	for (var i = 1; i < testCases.length - 1; i++) {
		var elementName = testCases[i].split(':')[0];
		var elementValue = testCases[i].split(':')[1];
		console.log(' - Test Case ' + i + '/' + (testCases.length - 2) + ': (get: ' + elementName + ', expect: ' + elementValue + ')');
		var result = sut.getDataFromDataString(input, elementName);
		if (result !== elementValue) {
			console.log('     FAILED: actual = ' + input);
			subTestsFailed = true;
		}
	}
	// Assert
	if (subTestsFailed)
		return false;
	return true;
});

//[Test]
globals.allUnitTests.push(function replaceDataInElement_GivenElementLabel_ExpectDataUpdated() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'STU';
	var newData = '67';
	var expected = '|ABC:13,32|DEF:12|GHIJKL|MNO:1|PQA:2|STU:67|VWX:0|YZ:3|';
	// Act
	var result = sut.replaceDataInElement(storageString, element, newData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function replaceDataInElement_GivenNonExistingElement_ExpectElementAndDataAdded() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'OOO';
	var newData = '35';
	var expected = '|ABC:13,32|DEF:12|GHIJKL|MN:1|OOO:35|PQA:2|STU:45|VWX:0|YZ:3|';
	// Act
	var result = sut.replaceDataInElement(storageString, element, newData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function replaceDataInElement_GivenEmptyDataStringNonExistingElement_ExpectElementAndDataAdded() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|";
	var element = 'OOO';
	var newData = '35';
	var expected = '|OOO:35|';
	// Act
	var result = sut.replaceDataInElement(storageString, element, newData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function ensureDataIntoElement_GivenDataStringAndElement_ExpectDataAdded() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'MN';
	var newData = '35';
	var expected = '|ABC:13,32|DEF:12|GHIJKL|MN:1,35|PQA:2|STU:45|VWX:0|YZ:3|';
	// Act
	var result = sut.ensureDataIntoElement(storageString, element, newData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function ensureDataNotInElement_GivenDataStringAndElement_ExpectDataAdded() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1,35|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'MN';
	var removeData = '1';
	var expected = '|ABC:13,32|DEF:12|GHIJKL|MN:35|PQA:2|STU:45|VWX:0|YZ:3|';
	// Act
	var result = sut.ensureDataNotInElement(storageString, element, removeData);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function clearElementData_GivenElement_ExpectElementDataRemoved() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var element = 'ABC';
	var expected = '|ABC|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|';
	// Act
	var result = sut.clearElementData(storageString, element);
	// Assert
	if (result === expected)
		return true
	return result;
});

//[Test]
globals.allUnitTests.push(function getAllElements_GivenDataString_ExpectCorrectAmountOfElements() {

	// Arrange
	var sut = createDataStringHelper();
	var storageString = "|ABC:13,32|DEF:12|GHIJKL|MN:1|PQA:2|STU:45|VWX:0|YZ:3|";
	var expected = 8;
	// Act
	var result = sut.getAllElements(storageString);
	// Assert
	if (result.length === expected)
		return true
	return result;
});

//================================================================================================================================================================

//[Test]
globals.allUnitTests.push(function getNodeInDatabaseByLabel_Given1NodesWithLabelAndLabel_ExpectNode() {
	// Arrange
	var sut = createDataDriver();
	var node1 = { labels: ['FindMe'] };
	var expectedNodeId = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	// Act
	var result = sut.GetEntitiesByType('FindMe');
	// Assert
	return (result[0].id === expectedNodeId) ? true : result;
});

//[Test]
globals.allUnitTests.push(function getLinkInDatabaseByLabel_Given2NodesAndRelationshipAndLabel_ExpectLink() {
	// Arrange
	var sut = createDataDriver();
	var node1 = { labels: ['ATOM'], properties: { element: "Hydrogen" } };
	var node2 = { labels: ['ATOM'], properties: { element: "Oxygen" } };
	var node3 = { labels: ['ATOM'], properties: { element: "Helium" } };
	var link1Labels = ["BOND"];
	var link1Properties = { strength: "strong" };
	var link2Labels = ["BOND"];
	var link2Properties = { strength: "strong" };


	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var node3Id = sut.CreateEntityInDatabasePopulateAndReturnId(node3);
	var expectedLinkId1 = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id, link1Labels, link1Properties);
	var expectedLinkId2 = sut.CreateRelationPopulateAndReturnId(node2Id, node3Id, link2Labels, link2Properties);

	// Act
	var result = sut.GetRelationsByLabel('BOND');
	// Assert
	return (result[0].id === expectedLinkId1 && result[1].id === expectedLinkId2) ? true : result;
});

//[Test]
globals.allUnitTests.push(function getAllNodeLabels_GivenNodesWithLabels_ExpectLabels() {
	// Arrange
	var sut = createDataDriver();
	var node1 = { labels: ['ThisTestLabel0'] };
	var node2 = { labels: ['ThisTestLabel2', 'ThisTestLabel1'] };
	var node3 = { labels: ['ThisTestLabel3'] };
	sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	sut.CreateEntityInDatabasePopulateAndReturnId(node3);
	// Act
	var result = sut.GetAllEntityTypes();
	// Assert
	return (result.indexOf('ThisTestLabel1') > -1 && result.indexOf('ThisTestLabel2') > -1) ? true : result;
});

//[Test]
globals.allUnitTests.push(function getNodesByPropertyName_GivenNodesWithProperties_ExpectPropertyIndex() {
	// Arrange
	var propertyName = "uniqueProp1672";
	var sut = createDataDriver();
	var node1 = {
		labels: ['PropsNodeTest'],
		properties: {
			uniqueProp1672: "uniqueProperty",
			prop2: "value2"
		}
	};
	var expectedNodeId = sut.CreateEntityInDatabasePopulateAndReturnId(node1);

	// Act
	var result = sut.GetEntitiesByPropertyName(propertyName);

	// Assert
	if (result[0].id == expectedNodeId)
		return true;

	return result;
});

//[Test]
globals.allUnitTests.push(function getRelationshipByPropertyName_GivenGiven2RelatedNodes_ExpectRelationship() {
	// Arrange
	var propertyName = "uniqueProp1673";
	var sut = createDataDriver();
	var node1 = {};
	var node2 = {};
	var link = {};
	node1.labels = ["CLIENT"];
	node2.labels = ["CAR"];
	node2.properties = {
		Manufacturer: 'Kia',
		Model: 'Picanto'
	};
	linkLabels = ["OWNS"];
	linkProperties = {
		uniqueProp1673: "ForAlink",
		Year: 2012,
		Dealer: 'Autocar',
		OnLayby: true,
		AttendedBy: ['Joan Luna', 'Derick Stapler']
	}
	var node1Id = sut.CreateEntityInDatabasePopulateAndReturnId(node1);
	var node2Id = sut.CreateEntityInDatabasePopulateAndReturnId(node2);
	var expectedLinkId = sut.CreateRelationPopulateAndReturnId(node1Id, node2Id, linkLabels, linkProperties);

	// Act
	var result = sut.GetRelationsByPropertyName(propertyName);

	// Assert
	if (result[0].id == expectedLinkId)
		return true;

	return resultNodes;

});



// Private...
function createConfigHelper() {
	return new ConfigHelper();
}

//[Test]
globals.allUnitTests.push(function addDynamicConfig_GivenConfig_ExpectConfig() {
	// Arrange
	var sut = new DataService();
	var testEntityName = 'HELLO';
	var configName = "TestConfig1";
	var matchEntity = {
		"labels": [
			testEntityName
		]
	}
	var testConfig = {
		"configName": configName,
		"configType": "entity",
		"matchEntity": matchEntity,
		"config": {
			"attributes": {
				"background-color": "#33c11d",
				"border-color": "#334687",
				"circleText": {
					"color": "#00FF00"
				},
				"img": {
					"url": "custom/assets/Space/Earth-PNG-Clipart.png",
					"width": 70,
					"height": 70
				}
			}
		}
	};
	var baseNodeConfig = globals.masterConfigs.forEach(function (config) { if (config.prefix == "BNC") return config; });

	// Act
	var confId = sut.CreateUpdateConfigReturnId(configName, testConfig);
	var result = sut.GetConfigByName(configName);

	// Assert
	return (result.config.attributes.circleText.color === "#00FF00") ? true : result;
});

//[Test]globals.allUnitTests
globals.allUnitTests.push(function addDynamicConfig_GivenConfig_ExpectConfigAndNode() {
	// Arrange
	var testEntityName = 'EntityForConfig';
	var testConfigName = 'TestConfig2';
	var sut = createConfigHelper();
	var dataSvc = new DataService();
	var entity = {
		labels: [testEntityName],
		properties: {
			id: "MyId121",
			prop2: "value2"
		}
	};

	var entityId = dataSvc.CreateEntityReturnId(entity.labels, entity.properties);
	

	// Dynamic config...
	var testConfig = {
		"configName": testConfigName,
		"configType": "entity",
		"matchEntity": {
			"labels": [
				testEntityName
			]
		},
		"config": {
			"attributes": {
				"background-color": "#f2b3ab",
				"circleText": {
					"color": "#6fa563"
				}
			},
			"relatedThings": [
				{
					"thingName": "option",
					"url": "custom/assets/64.png",
					"x": 10,
					"y": -50,
					"size": 50
				}
			]
		}
	};

	var confId = sut.AddDynamicEntityConfigReturnId(testConfigName, testConfig);
	var entity = dataSvc.GetEntityById(entityId);
	var nodes = addEntitiesToGraphAndReturnNodes([entity]);
	// Act
	var result = sut.GetConfigForEntityId(entityId);
	// Assert
	return (result.config.attributes.circleText.color == "#6fa563") ? true : result;
});

//[Test]
globals.allUnitTests.push(function updateExistingConfig_GivenConfig_ExpectConfig() {
	// Arrange
	var sut = new DataService();
	var testEntityName = 'CASE2';
	var configName = "TestConfig3";
	var matchEntity = {
		"labels": [
			testEntityName
		]
	}
	var initialConfig = { 
    "configName": configName, 
    "configType": "entity", 
    "matchEntity": matchEntity, 
    "config": { 
      "attributes": { 
        "background-color": "#33c11d", 
        "border-color": "#4155f4", 
        "circleText": { 
          "color": "#0000FF" 
        } 
      } 
    } 
  };
	var confId = sut.CreateUpdateConfigReturnId(configName, initialConfig);
	var updatedConfig = { 
    "configName": configName, 
    "configType": "entity", 
    "matchEntity": matchEntity, 
    "config": { 
      "attributes": { 
        "radius":15, 
        "background-color": "#33c11d", 
        "border-color": "#4155f4", 
        "circleText": { 
          "color": "#FF0000" 
        } 
      } 
    } 
  };

	// Act
	var confId2 = sut.CreateUpdateConfigReturnId(configName, updatedConfig);

	// Assert
	var result = sut.GetConfigByName(configName);
	return (result.config.attributes.circleText.color === "#FF0000" && result.config.attributes.radius === 15) ? true : result;
	
	var nodes = getNodesByMatchingLabels(globals.nodeList, [testEntityName]);
	refreshNodeAppearance(nodes[0].id);

});


////[Test]
//globals.allUnitTests.push(function insertValueIntoConfig_GivenConfig_ExpectUpdatedConfig() {
	
//  // Arrange
//	var sut = new ConfigHelper();
//  var configValuePath = "newConfig/config/attributes/background-color";
//  var newValue = "green";
//  var sourceConfig = {
//		"configName": "Test",
//		"configType": "entity",
//		"matchEntity": "HELLO",
//		"config": {
//			"attributes": {
//				"background-color": "#33c11d",
//				"color": "blue",
//				"circleText": {
//					"color": "yellow"
//				},
//				"img": {
//					"url": "custom/assets/Space/Earth-PNG-Clipart.png",
//					"width": 70,
//					"height": 70
//				}
//			}
//		}
//	};


//  // Act 
//  var newConfig = sut.AddToConfigReturnConfig(sourceConfig, configValuePath, newValue);

//  // Assert
//  var result = newConfig.config.attributes["background-color"]
//  return (result == newValue) ? true : result;

//});

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
          Pic: "custom/assets/Persons/Monroe.png",
          link: "http://localhost:9090/scripts/Tests/TestAssets/TestJson.json"
				},
				{
					Name: "Jane",
          Avatar: "custom/assets/Persons/elvis.png"
				}]
		}
	};

  
	// Act
	var result = sut.TranslateToGraph_ReturnGraphElements(node, JSON.stringify(inputJSON), globals.currentTheme.sourceConfig);

	// Assert
	return (result.length == 4
		&& result[0].fromNode.data.labels[0] == "ParentRootNode") ? true : result;
});


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

	//[Test]
	globals.allUnitTests.push(function GraphHelper_GivenNodes_ExpectGlobalTypeDefs() {
		// Arrange
    var sut=new GraphHelper();
    var dataSvc = new DataService();
    var entityLabels = ['TypeDefTest'];
    var entityProperties = {
      Name: "John",
      Age: 30,
      Source: "../custom/assets/Persons/Holmes.png"
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

	
function initializeConfiguration(callback_setupGraph) {
	$(document).ready(function (e) {
		configManager = configManager; //config manager from file

		if (configManager.configs.length == 0) {
			alert("Error: unable to load configurations");
			return;
		}

		globals.masterConfigs = [];

		var DefaultConfig = configManager.configs[0];

		//Perform Shinethrough: Merge configs, so that all configs are equal, except for their differences...
		var jsonHelper = new JsonHelper();
    configManager.configs.map(function (cnf) {
			if (cnf.configType === "entity"){
				globals.masterEntityConfigs.push(cnf);
      }
			//globals.masterConfigs.push($.extend(true, {}, DefaultConfig, cnf));
      globals.masterConfigs.push(jsonHelper.MergeJson(DefaultConfig, cnf, "arrayId"));
		})
    // Add dynamic configs (anything added AFTER the baseconfigs have been loaded)
		var dataSvc = new DataService(); 
		var entityConfigs = dataSvc.GetAllConfigs();
		entityConfigs.forEach(function (cnf) {
			globals.masterEntityConfigs.push(cnf);
      // Update VUE component with master configs...
      consoleApp.tabs.newMatching.masterEntityConfigs.push(cnf);
		});

		//Update the config selector on the UI...
		//var selectorElement = document.getElementById("configSelector");
		globals.masterConfigs.forEach(function (cnf) {
			if (configManager.defaultConfig = cnf.prefix) { 
        DefaultConfig = cnf;
      }
			//selectorElement.innerHTML += '<option value="' + cnf.configName + '">' + cnf.configName + '</option>';
		});

		callback_setupGraph(DefaultConfig);
	});
}



function setupCommonUI(){
			//Common UI...
	globals.CommonUI.focusUI = Viva.Graph.svg('circle')
					.attr('cx', 0) //...for circle
					.attr('cy', 0)//...for circle
					.attr('r',50)
					.attr('fill','transparent')//'#4dffc3')
					.attr('stroke',globals.currentTheme.sourceConfig.displaySettings.focusColor)
					if (!globals.currentTheme.sourceConfig.displaySettings.opaque) {globals.CommonUI.focusUI.attr('stroke-opacity','0.5')}
					//.attr('stroke-opacity',0.5);
					if (globals.currentTheme.sourceConfig.displaySettings.entityShape == "rect") {
						globals.CommonUI.focusUI.attr('width',50 * 3);
						globals.CommonUI.focusUI.attr('height',50 * 2);
						globals.CommonUI.focusUI.attr('rx',50/4);
						globals.CommonUI.focusUI.attr('x',-(50*3/2));
						globals.CommonUI.focusUI.attr('y',-(50*2/2));
					}
				
	globals.CommonUI.linkFocusUI = Viva.Graph.svg('path')
					   .attr('stroke', globals.currentTheme.sourceConfig.displaySettings.focusColor)
					   .attr('stroke-width', '5')
					   
	globals.CommonUI.checkUI = Viva.Graph.svg('circle')
					.attr('cx', 0) //...for circle
					.attr('cy', 0)//...for circle
					.attr('r',50)
					.attr('fill','transparent')//'#4dffc3')
					.attr('stroke',globals.currentTheme.sourceConfig.displaySettings.highlightColor)
					.attr('stroke-width', '5')
					if (!globals.currentTheme.sourceConfig.displaySettings.opaque) {globals.CommonUI.checkUI.attr('stroke-opacity','0.5')}
					if (globals.currentTheme.sourceConfig.displaySettings.highlightHaze) {globals.CommonUI.checkUI.attr('filter','url(#hazeEffect)');}
					
	//MARKER: TEXT
	globals.CommonUI.linkMidMarker = Viva.Graph.svg('marker')
		.attr('class', 'markertextmain')
		//.attr('id', linklabelId )
		.attr('viewBox', "-4 -6 8 12")
		.attr('refX', "3")
		.attr('refY', "0.5")
		.attr('markerWidth', "500")
		.attr('markerHeight', "100")
		.attr('markerUnits', "userSpaceOnUse")
		.attr('orient', "auto");
	
	globals.CommonUI.linkName = Viva.Graph.svg('text')
			.attr('class','markertextlabel')
			.attr('x', '0')
			.attr('y', '0.5')
			.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkMainTextColor)
			.attr('font-family','Arial, Helvetica, sans-serif')
			.attr('font-size','1.5')

	//		.text(link.data.name);
	//if (globals.currentTheme.sourceConfig.displaySettings.showRelationships == "on-highlight") {markerLabel.attr('fill','transparent')}
	
	//var propertyList = link.data.properties.forEach(function(prop){var x = ''; prop})
	globals.CommonUI.linkProps = Viva.Graph.svg('text')
			.attr('class','markertextsub')
			.attr('x', '0')
			.attr('y', '.5')
			.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkSubTextColor)
			.attr('font-family','Arial, Helvetica, sans-serif')
			.attr('font-size','1')
	//		.text('');
	//markerProperties.innerHTML = propertyListToSvgList(link.data.properties, '<tspan x="0" dy="1.2em">', '</tspan>');
			
	globals.CommonUI.popoutInfoUI = Viva.Graph.svg('g');

	globals.CommonUI.popoutTextUI = Viva.Graph.svg('text')
				//.attr('class', 'slidetext')
				.attr('y', 0) // Number(node.data.entityConfig.config.attributes["radius"])/2 + 5)
				.attr('x', 0)// - node.data.displayLabel.length)
				.attr('fill',globals.currentTheme.sourceConfig.displaySettings.entityPopoutTextColor)
				.attr('stroke-width','0')
				.attr('font-family','Arial, Helvetica, sans-serif')
				.attr('font-size','10')
				.attr('opacity', 0)
				.text('--');
			//popoutTextUI.innerHTML = propertyListToSvgList(node.data.properties, '<tspan x="50" dy="1.2em">', '</tspan>');

	globals.CommonUI.popoutBodyUI = Viva.Graph.svg('rect')
				//.attr('class', 'slidebody')
				.attr('width', 0)
				.attr('x', 0)
				.attr('y', 0)
				.attr('rx', 7)
				.attr('height', 0)
				.attr('fill',globals.currentTheme.sourceConfig.displaySettings.entityPopoutBoxColor)
				//.attr('width','20%')

			//if (!globals.currentTheme.sourceConfig.displaySettings.opaque) {globals.CommonUI.popoutBodyUI.attr('fill-opacity',0.3);}
			
	globals.CommonUI.popoutInfoUI.append(globals.CommonUI.popoutBodyUI);
	globals.CommonUI.popoutInfoUI.append(globals.CommonUI.popoutTextUI);

}
		


function graphexMain() {

	initializeConfiguration(setupGraph); //get config, setup common UI

	function setupGraph(DefaultConfig) {
    setBrowser();
		var configHelper = new ConfigHelper();
		configHelper.setConfigSettings(DefaultConfig);
		configHelper.runStartupProcedures();
		setupCommonUI();
		prepareGraph();
		define_Graph();
    define_Node();
		defineNodeDrawing();
		if (globals.browser.name != "Firefox" && globals.browser.name != "IE"){
      defineLinkObjectsCommonAssets();
		  defineLinkObjects();
      defineLinkDrawing();
    }
		renderGraph();
		initUi();

		// Start monitoring timeout elements
		checkTimeoutElements() 
    // Start animation cycle...
    globals.animator.StartAnimationTicker();
    // Run unit tests...
    runUnitTests();
    // Check params for Graphs
    processParameters();
	}

  function runUnitTests(){
    // UNIT TESTS...
		if(window.location.href.substr(0,17)=="http://localhost:"){
			var unitTestFramework = new UnitTestFramework();
			unitTestFramework.runAllUnitTests(globals.allUnitTests);
		}
  }

  function setBrowser(){
    globals.browser = new BrowserHelper().getBrowser();
  }
  function processParameters(){
        // PARAMETERS
    //extract commands from URL:
    var stringHelper = new StringHelper();
    var urlHelper  = new UrlHelper();
    var params = urlHelper.GetAllParams();
    params.forEach(function(param){
      if (param.key == "graph"){
        var translator = new UrlParamsTranslator();
        translator.Translate(param.value);
      }

      if (param.key == "grenc"){
        var translator = stringHelper.ParamDecodeString(urlHelper.GetParameterByName("trans"));
        var arranger = urlHelper.GetParameterByName("arrange");
        var decodedData = stringHelper.ParamDecodeString(param.value);
        executeTranslator(translator, decodedData);
        //executeArranger(arranger);
      }
    });
  }

  function executeTranslator(translator, data){
    if (!translator || !data) return;
    mappings.Translators.forEach(function(transMapping){if (transMapping.name == translator){
      var trans = transMapping.translator;
      trans.Translate(data);
    }});
  }

  function executeArranger(arranger){
    if (!arranger) return;
    //debugger;
    mappings.Arrangers.forEach(function(arrangerMapping){
      //debugger;
      if (arrangerMapping.name == arranger){
        var arranger = transMapping.arranger;
        arranger.Arrange(arranger);
      }
    });
  }

}




//Initial setup

function prepareGraph()
{
	var graph = Viva.Graph.graph();

	// Custom physics... (include/exclude in the 'globals.renderer' at the bottom of the script)
	var idealLength = 150;
	globals.layout = Viva.Graph.Layout.forceDirected(graph, {
	   springLength: idealLength,
	   springCoeff : 0.00008,
	   //dragCoeff : 0.01,
	   //gravity : -1.2,
	   //theta : 1
	   springTransform: function (link, spring) {
			spring.length = idealLength;
	   }
		  
	});

	globals.graphics = Viva.Graph.View.svgGraphics();
	globals.GRAPH = graph;
}



function GraphBehavioursHelper(){

  this.CreateNodeAtClickPoint = function(x, y){
    // Get graph matrix...
    var graphMatrix = globals.graphics.getSvgRoot().childNodes[0].attr('transform').substr(7).replace(')','').replace(/\s/g,'').split(',');
    var graphX = Number(graphMatrix[4]);
    var graphY = Number(graphMatrix[5]);
    var graphScale = Number(graphMatrix[3]);

    // Create node...
    var labels = globals.nodeStamp.labels;
    //var properties = globals.nodeStamp.properties;
    var config = globals.nodeStamp.config;
    config.matchEntity = {"labels":labels};
    config.configName = "stmpCnf_" + labels[0];
    config.configType = "entity";

    var configId = new ConfigHelper().AddOrUpdateDynamicEntityConfigReturnId(config.configName,config);
    var newNode = new DataService().CreateEntity_AddToGraph_ReturnNode(labels);

    // Calculate node position...
    var posx= ((x) * (1/graphScale)) - graphX * (1/graphScale);// * (1/graphScale);
    var posy= ((y-50) * (1/graphScale)) - graphY * (1/graphScale);// * (1/graphScale); //e.clientY + window.document.body.scrollTop + window.document.documentElement.scrollTop

    // Create relation...
    if (globals.modes.createLinkFromSelectedNodeOnCreateNode){
      var fromNode = globals.selectedNode;
      if(fromNode){
        new DataService().CreateRelation_AddToGraph_ReturnLink(fromNode.id, newNode.id);
      }
    }

    // Select Node
    if (globals.modes.selectNodeAfterCreate){
      //debugger;
      new GraphHelper().SelectNode(newNode);
    }

    // Position node...
    globals.layout.setNodePosition(newNode.id,posx,posy);
  }


  //function translatorCreateRelation(fromNode, toNode){
  //  _dataSvc.CreateRelation_AddToGraph_ReturnLink(fromNode.id, toNode.id);
  //}

  //function translatorCreateNode(label, type){
  //  return _dataSvc.CreateEntity_AddToGraph_ReturnNode([type], {"Name":label});
  //}

}

function graph_Event(eventType, x, y) {
  if (eventType == "dblclick"){
		graph_DoubleClick(x, y);
  }
}

function graph_DoubleClick(x, y){
  if (globals.modes.createNodeOnGraphDblClick == true){
    new GraphBehavioursHelper().CreateNodeAtClickPoint(x,y);
  }
}


function define_Graph(){
  
  
  var graph=document.getElementById('graphContainer')
  graph.onmove=function(e) {
    updateIndicator(e);
  }

  // Define Graph Events...
  Hammer(graph).on("tap", function(e) {
    //singletap stuff, (theres a problem here, we can't distinguish between a node tap and graph tap)
  });
  Hammer(graph).on("doubletap", function(e) {
    if (globals.states.overNode){
      new node_Event('dblclick',globals.states.overNode, e.center.x, e.center.y);
      return;
    }
    if (globals.states.hammeringNode){
      return;
    }
    graph_Event('dblclick', e.center.x, e.center.y);
  });

}


//====== NODE VISUAL DEFINITIONS ========================================================================================================

function define_Node() {
	//Node elements...
	globals.graphics.node(function (node) {

		nodeOuterLayer = Viva.Graph.svg('g');
		nodeLayer = Viva.Graph.svg('g');

		if (node.data.nodeType == 'data') {
			defineNodeAppearance_dataNode(node, nodeLayer);
		}
		else if (node.data.nodeType == 'subnode') {
			defineNodeAppearance_subNode(node, nodeLayer);
			if (node.data.superNodes[0])
				nodeLayer.attr('parentnodeid', node.data.superNodes[0].id);
		}
		else if (node.data.nodeType == 'planned')
			defineNodeAppearance_plannedNode(node, nodeLayer);

		attachMouseEventsToNode(node, nodeLayer);
		attachMetaData(node, nodeLayer);
		nodeOuterLayer.append(nodeLayer);
		node.data.UI.outerUI = nodeOuterLayer;
		return nodeOuterLayer;
	});

	function attachMetaData(node, ui) {
		ui.attr('depth', 5);
		ui.attr('class', 'node');
		ui.attr('nodeSize', Number(node.data.entityConfig.config.attributes["radius"]));
		ui.attr('nodeid', node.id);
		ui.attr('dragging', false);
		ui.attr('nodetype', node.data.nodeType);
	}

	function attachMouseEventsToNode(node, ui) {
		//NODE EVENTS
		// events (http://www.w3.org/TR/SVG/interact.html#SVGEvents ),

		$(ui).touchstart(function (event) { // MOUSE CLICK
			node_Event("touchstart", node, event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
		}),
		$(ui).touchmove(function (event) { // MOUSE CLICK
			node_Event("touchmove", node, event.originalEvent.changedTouches[0].pageX, event.originalEvent.changedTouches[0].pageY);
		}),
		$(ui).touchend(function (event) { // MOUSE CLICK
			node_Event("touchend", node, event.originalEvent.changedTouches[0].pageX, event.originalEvent.changedTouches[0].pageY);
		}),

		$(ui).mousedown(function (event) { // MOUSE CLICK
			node_Event("mousedown", node, event.pageX, event.pageY);
		}),

		$(ui).contextmenu(function (event) { // MOUSE CLICK
			node_Event("contextmenu", node, event.pageX, event.pageY);
		}),

		$(ui).mouseup(function (event) { // MOUSE CLICK
			node_Event("mouseup", node, event.pageX, event.pageY);
		}),

		$(ui).mouseover(function (event) { // MOUSE CLICK
			node_Event("mouseover", node, event.pageX, event.pageY);
		}),

		$(ui).click(function (event) { // MOUSE CLICK
			node_Event("click", node, event.pageX, event.pageY);
		}),

		$(ui).dblclick(function (event) { // MOUSE CLICK
			node_Event("dblclick", node, event.pageX, event.pageY);
		}),

		$(ui).hover(function (event) { // MOUSE HOVER
			node_Event("MouseEnter", node, event.pageX, event.pageY);

		}, function () { // MOUSE LEAVE
			node_Event("MouseLeave", node, event.pageX, event.pageY);
		});

	}
}
function defineNodeDrawing(){

	//====== NODE DRAWING/RENDERING ...occurs continuously ========================================================================================================
	globals.graphics.placeNode(function (nodeUI, pos) {
		//console.log('draw-UI', nodeUI.node);
		nodeUI.attr('transform', 'translate(' + (pos.x) + ',' + (pos.y) + ')');

		//if (nodeUI.attr('dragging') == 'true')
		if (nodeUI.node.data.dragging == 'true')
			node_Event("MouseDragging", nodeUI.node, pos.x, pos.y);
	});

    //OVERRIDE drag drawing...
    globals.graphics.translateRel = function (dx, dy) {
        var svgRoot = globals.graphics.getSvgRoot();
        var svgContainer = globals.graphics.getGraphicsRoot().childNodes[0];
        //var svgContainer = globals.graphics.getGraphicsRoot().children[0];

        var p = svgRoot.createSVGPoint(),
            t = svgContainer.getCTM(),
            origin = svgRoot.createSVGPoint().matrixTransform(t.inverse());

        p.x = dx;
        p.y = dy;

        p = p.matrixTransform(t.inverse());
        p.x = (p.x - origin.x) * t.a;
        p.y = (p.y - origin.y) * t.d;

        t.e += p.x;
        t.f += p.y;

        var transform = "matrix(" + t.a + ", 0, 0," + t.d + "," + t.e + "," + t.f + ")";
        svgContainer.attr("transform", transform);

        if (globals.viewOptions.screenDragType == 'depth')
            applyDepthOffset({ x: dx, y: dy })

        globals.consoleService.hideNodeFlyout();

    }
	
    function applyDepthOffset(offset)
    {

        globals.GRAPH.forEachNode(function (node, index) {
            globals.layout.pinNode(node, true);
            var pos = globals.layout.getNodePosition(node.id);
            pos.x = pos.x + (offset.x * node.data.depth);
            pos.y = pos.y + (offset.y * node.data.depth);
            globals.layout.setNodePosition(node.id, pos.x, pos.y);

            

        });
    }
}
function LinkHelper() {

  this.FixTextWidth4Link=function(link) { fixTextWidth4Link(link) }
  function fixTextWidth4Link(link) {
    if(link.data.UI.nameTextUI&&link.data.UI.midMarkerUI) {
      var textWidth = link.data.UI.nameTextUI.getBBox().width;
      //link.data.UI.nameTextUI.attr('x',-textWidth/2);
      setUi(link.data.UI.nameTextUI, 'x',-textWidth/2); 
      //link.data.UI.fullUI.attr('labelWidth',textWidth);
      setUi(link.data.UI.fullUI, 'labelWidth',textWidth); 

      if(link.data.UI.subTextUI) {
        var i=0;
        var boxWidth=link.data.UI.subTextUI.getBBox().width;

        while(link.data.UI.subTextUI.childNodes[i]) {
          //$(link.data.UI.subTextUI.childNodes[i]).attr('x',-boxWidth/2);
          setUi(link.data.UI.subTextUI.childNodes[i], 'x',-boxWidth/2); 
          i++;
        }
      }
    }
  }

  this.FixLinkIndexes = function(fromNodeID,toNodeID){fixLinkIndexes(fromNodeID,toNodeID)}; //Get sibling details...
  function fixLinkIndexes(fromNodeID,toNodeID) { //Get sibling details...
    var totalSiblings=0;
    var leftSiblings=0;
    var rightSiblings=0;
    //get sibling information
    globals.linkList.forEach(function(link) {
      if(link.toId==toNodeID&&link.fromId==fromNodeID) {
        totalSiblings++;
        leftSiblings++
      }
      else if(link.toId==fromNodeID&&link.fromId==toNodeID) {
        totalSiblings++;
        rightSiblings++
      }
    });

    globals.linkList.forEach(function(link) {
      if(link.toId==toNodeID&&link.fromId==fromNodeID) {
        //this is a left sibling
        if(totalSiblings==1) { //there is only one sibling so its position will be center 
          setUi(link.data.UI.fullUI, 'linkPos',0);
        } else {
          //add the position of the sibling, (counting down so that widest is always underneath)
          setUi(link.data.UI.fullUI, 'linkPos',leftSiblings--);
        }
      }
      else if(link.toId==fromNodeID&&link.fromId==toNodeID) {
        if(totalSiblings==1) { //there is only one sibling so its position will be center 
          setUi(link.data.UI.fullUI, 'linkPos',0);
        } else {
          //add the position of the sibling, (counting down so that widest is always underneath)
          setUi(link.data.UI.fullUI, 'linkPos',rightSiblings--);
        }
      }
    });
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.ShowLinkDetails=function(link) { showLinkDetails(link) }
  function showLinkDetails(link) {
    //var processingElement=document.getElementById('selectedLink');
    //var labellist=''
    //var html='<p class="panelheader">Selected Link:</a> <p class="dataNameLabel">'+link.data.id+'</p>';
    //html+='<br/><p class="panelheader">Link type</a>: <p class="dataNameLabel">'+link.data.name+'</p>'
    //processingElement.innerHTML=html;

    //html='<a class="panelheader">Properties<a>:';
    //html+='<table style="width:90%;">'
    //var processingElement=document.getElementById('linkDetails');
    //link.data.properties.forEach(function(property,index) {
    //  html+='<tr>'
    //  var button_onclick='showOnNode('+link.data.id+', \''+property.value+'\')';
    //  html+='<td> <p class="dataNameLabel">'+property.key+'</p></td><td><p class="dataValueLabel"> '+property.value+'</p></td>';
    //  html+='</tr>'
    //});
    //html+='</table>'
    //processingElement.innerHTML=html;
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.HighlightRelatedNodes = function(nodeId,isOn){highlightRelatedNodes(nodeId,isOn)}
  function highlightRelatedNodes(nodeId,isOn) {
    // just enumerate all realted nodes and update link color:
    globals.GRAPH.forEachLinkedNode(nodeId,function(node,link) {
      var linkUI=globals.graphics.getLinkUI(link.id);
      if(linkUI) {
        if(!link.data.checked) {
          accentuateLink(link, isOn);
        }
      }
    });
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------		
  this.HighlightDescendantNodes = function(nodeId,isOn){highlightDescendantNodes(nodeId,isOn)}
  function highlightDescendantNodes(nodeId,isOn) {
    // just enumerate all realted nodes and update link color:
    var descendantNodes=[];
    descendantNodes.push(nodeId);
    var i=0;
    while(i<(descendantNodes.length)) {
      var descendantNode=getExistingNode(descendantNodes[i]);
      descendantNode.data.toLinks.forEach(function(link) {
        var linkUI=globals.graphics.getLinkUI(link.id);
        if(linkUI) {
          if(!link.data.checked) {
            accentuateLink(link, isOn);
          }
        }
      });

      descendantNode.data.toNodes.forEach(function(node) {
        if(descendantNodes.indexOf(node.id)<0) { descendantNodes.push(node.id); }
      });

      i++;
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.HighlightAncestorNodes = function(nodeId,isOn){highlightAncestorNodes(nodeId,isOn)}
  function highlightAncestorNodes(nodeId,isOn) {
    var ancestorNodes=[];
    ancestorNodes.push(nodeId);
    var i=0;
    while(i<(ancestorNodes.length)) {
      var ancestorNode=getExistingNode(ancestorNodes[i]);
      ancestorNode.data.fromLinks.forEach(function(link) {
        var linkUI=globals.graphics.getLinkUI(link.id);
        if(linkUI) {
          if(!link.data.checked) {
            accentuateLink(link, isOn);
          }
        }
      });
      ancestorNode.data.fromNodes.forEach(function(node) {
        if(ancestorNodes.indexOf(node.id)<0) { ancestorNodes.push(node.id); }
      });
      i++;
    }
  }

  function accentuateLink(link, isOn){
    setUi(link.data.UI.pathUI, 'stroke',isOn?globals.currentTheme.sourceConfig.displaySettings.linkHighlightColor:link.data.color);
    setUi(link.data.UI.toMarkerUI, 'fill',isOn?globals.currentTheme.sourceConfig.displaySettings.linkHighlightColor:link.data.color);
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.CheckLink=function(link) { checkLink(link) }
  function checkLink(link) {
    showLinkData(link);
    //link.data.UI.pathUI.attr('stroke-width',link.data.sourceConfig.displaySettings.linkThickness*2);
    //link.data.UI.toMarkerUI.attr('stroke-width',link.data.sourceConfig.displaySettings.linkThickness*2);
    //link.data.UI.pathUI.attr('stroke','#99ff33');
    //link.data.UI.toMarkerUI.attr("fill",'#99ff33');

    setUi(link.data.UI.pathUI, 'stroke-width',link.data.sourceConfig.displaySettings.linkThickness*2);
    setUi(link.data.UI.toMarkerUI, 'stroke-width',link.data.sourceConfig.displaySettings.linkThickness*2);    
    setUi(link.data.UI.pathUI, 'stroke','#99ff33');
    setUi(link.data.UI.toMarkerUI, "fill",'#99ff33');

    link.data.checked=true;
    globals.checkedLinks.push(link);
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.UncheckLink=function(link) { uncheckLink(link) }
  function uncheckLink(link) {
    hideLinkData(link);
    //ToDo... //replace all .attr with setUi(xxx, 'yyy',zzz); 
    setUi(link.data.UI.pathUI, 'stroke-width',link.data.sourceConfig.displaySettings.linkThickness);
    setUi(link.data.UI.toMarkerUI, 'stroke-width',link.data.sourceConfig.displaySettings.linkThickness);    
    setUi(link.data.UI.pathUI, 'stroke',link.data.color);
    setUi(link.data.UI.toMarkerUI, "fill",link.data.color);
    link.data.checked=false;
    globals.checkedLinks.map(function(l,index) { if(l.data.id==link.data.id) { globals.checkedLinks.splice(index,1); } })
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.ToggleLink=function(link, bvalue) { toggleLink(link, bvalue) }
  function toggleLink(link, bvalue) {

    if(bvalue==true&&link.data.checked) { return; }
    if(bvalue==false&&!link.data.checked) { return; }
    link.data.checked=!link.data.checked;
    if(link.data.checked) //link must be checked
    {
      checkLink(link);
    }
    else  //link must be unchecked
    {
      uncheckLink(link);
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.HighlightLink = function(link) { highlightLink(link) }
  function highlightLink(link) { //...for mouse-hover only
    showLinkData(link);
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.UnHighlightLink = function(link) { unHighlightLink(link) }
  function unHighlightLink(link) { //...for mouse-hover only
    if(!link.data.checked) {
      hideLinkData(link);
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  function hideLinkData(link) {
    setUi(link.data.UI.fullUI,'labelVisible','false');

    if(!link.data.displayingData) {
      return;
    }
    link.data.displayingData = false;
    if(link.data.UI.nameTextUI) {
      removeUi(link.data.UI.nameTextUI);
    }
    if(link.data.UI.subTextUI) {
      removeUi(link.data.UI.subTextUI);
    }
    $(link.data.UI.fullUI).hide().show();
    //drawLink(link.data.UI.fullUI, {x:0,y:0}, {x:0,y:0});
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  function setUi(ui,attrName,attrValue) {
    if(!ui) return;
    ui.attr( attrName, attrValue );
  }
  function removeUi(ui) {
    if(!ui) return;
    if(!ui.remove) return;
    ui.remove();
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.GetLinkById = function(linkId) { return getLinkById(linkId) }
  function getLinkById(linkId) {
    for(var i=0;i<globals.linkList.length;i++)
      if(globals.linkList[i].id==linkId)
        return globals.linkList[i];
    //return globals.linkList.find(function (l) { return l.data.id === linkId });
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  function showLinkData(link) {
    setUi(link.data.UI.fullUI, 'labelVisible','true');
    if(link.data.displayingData) { return; }
    link.data.displayingData = true;
    link.data.UI.nameTextUI = globals.CommonUI.linkName.cloneNode();
    link.data.UI.nameTextUI.innerHTML=link.data.displayLabel;
    if(link.data.UI.midMarkerUI) { link.data.UI.midMarkerUI.append(link.data.UI.nameTextUI); }

    if(globals.currentTheme.sourceConfig.displaySettings.showRelationProperties) {
      link.data.UI.subTextUI = globals.CommonUI.linkProps.cloneNode();
      link.data.UI.subTextUI.innerHTML=propertyListToSvgList(link.data.properties,'<tspan x="0" dy="1.2em">','</tspan>');
      if(link.data.UI.midMarkerUI) { link.data.UI.midMarkerUI.append(link.data.UI.subTextUI); }
    }
    fixTextWidth4Link(link);
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.RefreshLinkVisual = function(link) { refreshLinkVisual(link) }
  function refreshLinkVisual(link) {
    if(link.data.UI.nameTextUI) { 
      link.data.UI.nameTextUI.innerHTML=link.data.displayLabel; }
    if(link.data.UI.subTextUI) { 
      link.data.UI.subTextUI.innerHTML=propertyListToSvgList(link.data.properties,'<tspan x="0" dy="1.2em">','</tspan>'); }

    //link.data.UI.subTextUI.attr('x', link.data.UI.subTextUI.getBBox().width/2)
    //toggle twice to refresh link...
    toggleLink(link);
    toggleLink(link);
  }
}
//====== LINK ASSET DEFINITIONS========================================================================================================
// To render an arrow we have to address two problems:
//  1. Links should start/stop at node's bounding box, not at the node center.
//  2. Render an arrow shape at the end of the link.

// Rendering arrow shape is achieved by using SVG markers, part of the SVG
// standard: http://www.w3.org/TR/SVG/painting.html#Markers
function defineLinkObjectsCommonAssets()
{
	//** COMMON REFERENCES ************************************************		
	//MARKER: TRAINGLE
	var markerTriangle = Viva.Graph.svg('marker')
					   .attr('id', 'Triangle')
					   .attr('viewBox', "0 0 10 10")
					   .attr('refX', "30")
					   .attr('refY', "5")
					   .attr('refY', "5")
					   .attr('markerUnits', "userSpaceOnUse")
					   .attr('markerWidth', "10")
					   .attr('markerHeight', "10")
					   .attr('orient', "auto")
					   
	var markerArrow =  Viva.Graph.svg('path')
		.attr('d', 'M 0 0 L 12 5 L 0 10 z')
		.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkColor);
	markerTriangle.append(markerArrow)

					   
	//MARKER: DOUBLE-DASH
	var markerDoubleDash = Viva.Graph.svg('marker')
		.attr('id', 'DoubleDash')
		.attr('viewBox', "-4 -6 8 12")
		.attr('refX', "-20")
		.attr('refY', "0")
		.attr('markerWidth', "20")
		.attr('markerHeight', "20")
		.attr('markerUnits', "userSpaceOnUse")
		.attr('orient', "auto");
	var markerrect1 = Viva.Graph.svg('rect')
			.attr('x', '-3')
			.attr('y', '-5')
			.attr('width', '2')
			.attr('height', '10')
			.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkColor);
	var markerrect2 = Viva.Graph.svg('rect')
			.attr('x', '1')
			.attr('y', '-5')
			.attr('width', '2')
			.attr('height', '10')
			.attr('fill',globals.currentTheme.sourceConfig.displaySettings.linkColor);
	markerDoubleDash.append(markerrect1);
	markerDoubleDash.append(markerrect2);

	// Marker should be defined only once in <defs> child element of root <svg> element:
	var defs = globals.graphics.getSvgRoot().append('defs');
	defs.append(markerTriangle);
	defs.append(markerDoubleDash);

}

function defineLinkObjects()
{
	//LINKS SETUP (occurs once for every link...)
	//** UNIQUE REFERENCES ************************************************
	globals.graphics.link(function(link){ //...get called for every link
		//====== DATA LINKS ========================================================================================================
		if (link.data.linkType == 'data')
		{
			var linklabelId = link.data.id;//'link'+link.fromId + 'To' + link.toId;
			if (link.data.sourceConfig.displaySettings.showRelationships == "all" || link.data.sourceConfig.displaySettings.showRelationships == "on-highlight")
			{

				//MARKER: TEXT
				var midMarker = Viva.Graph.svg('marker')
					.attr('class', 'markertextmain')
					.attr('id', 'mid'+linklabelId )
					.attr('viewBox', "-4 -6 8 12")
					.attr('refX', "0")
					.attr('refY', "0")
					.attr('markerWidth', "500")
					.attr('markerHeight', "100")
          .attr('fill',link.data.color)
					.attr('markerUnits', "userSpaceOnUse")
					.attr('orient', "auto");
				
				//MARKER: ARROW
				var endMarker = Viva.Graph.svg('marker')
					//.attr('class', 'markertextmain')
					.attr('id', 'end'+linklabelId )
					.attr('viewBox', "-4 -6 8 12")
					.attr('refX', "0")
					.attr('refY', "0")
					.attr('markerWidth', "50")
					.attr('markerHeight', "100")
          .attr('fill',link.data.color)
					.attr('markerUnits', "userSpaceOnUse")
					.attr('orient', "auto");
					
				var endArrow =  Viva.Graph.svg('path')
					.attr('d', 'M 0 -0.7 L 2 0 L 0 0.7 z');
					//if (!link.data.sourceConfig.displaySettings.opaque) {endArrow.attr('opacity', link.data.sourceConfig.displaySettings.linkOpacity);}
					//markerTraingle.append(markerArrow)
				/*var markerLabel = Viva.Graph.svg('text')
						.attr('class','markertextlabel')
						.attr('x', '0')
						.attr('y', '0')
						.attr('fill',link.data.sourceConfig.displaySettings.linkMainTextColor)
						.attr('font-family','Arial, Helvetica, sans-serif')
						.attr('font-size','1.5')
						.text(link.data.name);
				if (link.data.sourceConfig.displaySettings.showRelationships == "on-highlight") {markerLabel.attr('fill','transparent')}
				
				
				//var propertyList = link.data.properties.forEach(function(prop){var x = ''; prop})
				var markerProperties = Viva.Graph.svg('text')
						.attr('class','markertextsub')
						.attr('x', '0')
						.attr('y', '.5')
						.attr('fill',link.data.sourceConfig.displaySettings.linkSubTextColor)
						.attr('font-family','Arial, Helvetica, sans-serif')
						.attr('font-size','1')
						.text('');
				markerProperties.innerHTML = propertyListToSvgList(link.data.properties, '<tspan x="0" dy="1.2em">', '</tspan>');
				
				if (link.data.sourceConfig.displaySettings.showRelationships == 'all'){
					midMarker.append(markerLabel);
					if (link.data.sourceConfig.displaySettings.showRelationProperties){midMarker.append(markerProperties);}
				}
				*/
				
				endMarker.append(endArrow);
				var defs = globals.graphics.getSvgRoot().append('defs');
				defs.append(midMarker);
				defs.append(endMarker);

				link.data.UI.midMarkerUI = midMarker;
				link.data.UI.toMarkerUI = endMarker;
				//link.data.UI.nameTextUI = markerLabel; //...only added when markder is highlighted
				//link.data.UI.subTextUI = markerProperties;
			}

			var linkPath;
			var ui = Viva.Graph.svg('g')
			.attr('class','link')
			//.attr('refX', '50')
			//.attr('refY', '50')
			
			var linkPath = Viva.Graph.svg('path')
					   .attr('class','linkpath')
					   .attr('id',linklabelId)
					   .attr('stroke', link.data.color)
					   .attr('stroke-width', link.data.sourceConfig.displaySettings.linkThickness)
					   .attr('marker-mid', 'url(#mid' + linklabelId + ')')
					   //.attr('marker-end', 'url(#Triangle)')
					   .attr('marker-end', 'url(#end' + linklabelId + ')')
					   .attr("fill", 'transparent');
					   if (!link.data.sourceConfig.displaySettings.opaque) {linkPath.attr('stroke-opacity', link.data.sourceConfig.displaySettings.linkOpacity);}

					   
			var linkPoputText = Viva.Graph.svg('text')
						.attr('class','linkPoputText')
						.attr('x',0)
						.attr('y',0)
						.attr('fill','#EB6A00')
						.attr('refx', '25')
						.attr('refy', '0')
						.attr('stroke-width', 0)
						.attr('font-family','Arial, Helvetica, sans-serif')
						.attr('font-size','10')
						.text('');
			/*
			var endArrow =  Viva.Graph.svg('path')
						.attr('stroke-width',3)
						.attr('d', 'M 0 -2 L 4 0 L 0 2 z')
						.attr('fill',link.data.color)
						.attr('stroke','red')*/

			var textwidth = 0;
			var proplist = ''; 
			link.data.properties.forEach(function(prop){
					linkPoputText.innerHTML += '<tspan dx="-' + textwidth + 'em" dy="1.5em" >' + prop.key + ": " + prop.value+  '</tspan>';
					textwidth = 5;
			});

			var linkRect = Viva.Graph.svg('rect')
						.attr('class','linkrect')
						.attr('refx', '30')
						.attr('width', '150')
						.attr('height', '25')
						.attr('fill','black')
						.attr('rx','5');
			//linkRect.attr('refy', Number(linkRect.attr('width'))/2 );
			//linkPoputText.attr('refy', Number(linkRect.attr('width'))/2 );
			//linkPath.innerHTML += '<text font-family="Verdana" font-size="42.5"><textPath xlink:href="#'+linklabelId+'">HELLO</textPath></text>';
			//linkPath.append('defs');

			ui.append(linkPath);
			//ui.append(endArrow);
			if (link.data.sourceConfig.displaySettings.loadRelationPopouts)
			{
				ui.append(linkRect);
				ui.append(linkPoputText);
			}

			$(linkPath).hover(function() { // MOUSE HOVER
				//markerLabel.attr('fill', 'yellow');
				if (link.data.checked){}
				//new LinkHelper().HighlightLink(link);
			}, function() { // mouse out
				//new LinkHelper().UnHighlightLink(link);
			});
			
			$(linkPath).click(function() { // MOUSE CLICK
			    globals.selectedLink = link;
			    new LinkHelper().ShowLinkDetails(link);
				new LinkHelper().ToggleLink(link);
			});

			link.data.UI.fullUI = ui;
			link.data.UI.pathUI = linkPath;
			link.data.UI.popoutBodyUI = linkRect;
			link.data.UI.popoutTextUI = linkPoputText;
			
      ui.attr('fromNodeRadius',25); //default
			ui.attr('toNodeRadius',25);//default
			ui.attr('labelWidth',30);//default
			ui.attr('labelVisible',false);//default
			//var linkUI = globals.graphics.getLinkUI(link.id);
			if (link.data.linkType == 'data'){
				ui.attr('fromNode',link.data.fromNodeID).attr('toNode',link.data.toNodeID);
				ui.attr('linkDataIndex',globals.linkList.length);//default

        //fromNode.data.entityConfig.config.attributes["radius"];//nodeSize

        var fromNode = node=globals.GRAPH.getNode(link.data.fromNodeID);
        var toNode = node=globals.GRAPH.getNode(link.data.toNodeID);
        //if (fromNode.data.labels[0] == "root")
          //debugger;
        ui.attr('fromNodeRadius',fromNode.data.entityConfig.config.attributes["radius"]);
			  ui.attr('toNodeRadius',toNode.data.entityConfig.config.attributes["radius"]);
			}

			//ui.attr('linkPos', getDataLinks(link.data.fromNodeID, link.data.toNodeID).length);//will be adjusted later				
		}
		//====== INDICATOR LINKS ========================================================================================================
		else if(link.data.linkType == 'sub')
		{
			var linklabelId = link.data.id;//'link'+link.fromId + 'To' + link.toId;

			var linkPath;
			var ui = Viva.Graph.svg('g')
			.attr('class','link')
			var linkPath = Viva.Graph.svg('path')
					   .attr('id',linklabelId)
					   .attr('stroke', link.data.color)
					   .attr('stroke-width', '1')
					   .attr("fill", 'transparent');
					   if (!link.data.sourceConfig.displaySettings.opaque) {linkPath.attr('stroke-opacity', link.data.sourceConfig.displaySettings.linkOpacity);}

			ui.append(linkPath);
			link.data.UI.fullUI = ui;
			link.data.UI.pathUI = linkPath;
			ui.attr('fromNodeRadius',25); //default
			ui.attr('toNodeRadius',25);//default
			ui.attr('labelWidth',30);//default
			ui.attr('labelVisible',false);//default
		}	
		//====== planned LINKS ========================================================================================================
		else if(link.data.linkType == 'planned')
		{
			var linklabelId = link.data.id;//'link'+link.fromId + 'To' + link.toId;

			var linkPath;
			var ui = Viva.Graph.svg('g')
			.attr('class','link')
			var linkPath = Viva.Graph.svg('path')
					   .attr('id',linklabelId)
					   .attr('stroke', link.data.color)
					   .attr('stroke-width', link.data.sourceConfig.displaySettings.linkThickness)
					   .attr("fill", 'transparent');
					   if (!link.data.sourceConfig.displaySettings.opaque) {linkPath.attr('stroke-opacity', link.data.sourceConfig.displaySettings.linkOpacity);}

			ui.append(linkPath);
			link.data.UI.fullUI = ui;
			link.data.UI.pathUI = linkPath;
			ui.attr('fromNodeRadius',25); //default
			ui.attr('toNodeRadius',25);//default
			ui.attr('labelWidth',30);//default
			ui.attr('labelVisible',false);//default
			
		}
		
		ui.attr('linkType', link.data.linkType);
		ui.attr('textOrient', '-1');
		ui.attr('linkPathIndex',0);//default
		return ui;   
	});
}
function defineLinkDrawing(){
	//LINKS DRAWING/RENDERING (occurs continuously for every link...)
	//var geom = Viva.Graph.geom();
	globals.graphics.placeLink(function(linkUI, fromPos, toPos) {
		var linkDataIndex = linkUI.attr('linkDataIndex');	
		var linkIndex = linkUI.attr('linkPos');

		var from = fromPos;
		var to = toPos;

		to.x = to.x - from.x;
		to.y = to.y - from.y;

		var skew = (linkIndex) *20 *(((linkIndex)%2 == 0)?-1:1); //...creates a bend in the middle for multiple relationships
		//var curvex = from.x + (to.x - from.x)/2; //...the middle point x
		//var curvey = from.y + (to.y - from.y)/2 + skew;//...the middle point y
		var curvex = (to.x)/2; //...the middle point x
		var curvey = (to.y)/2 + skew;//...the middle point y
		linkUI.attr('transform','translate(' +fromPos.x + ',' + fromPos.y + ')');
		
    linkPath = linkUI.childNodes[linkUI.attr('linkPathIndex')];
		for (var i = 0; i < linkUI.childNodes.length; i++)
		{
			var child = linkUI.childNodes[i];
			if (!child) continue;
			if (!child.attr) continue;
			if (!child.attr('refx')) continue;
			child.attr('x',curvex - child.attr('refx'));
			child.attr('y',curvey - child.attr('refy'));
			for (var h = 0; h < child.childNodes.length; h++)
			{
				if (!child.childNodes[h]) continue;
			}
		}

		//Flip the text orientation on relationships so that the text is never upside down...
		if (linkUI.attr('labelVisible') == 'true'){
			if (to.x > 0 && (linkUI.attr('textOrient') == '0' || linkUI.attr('textOrient') == '-1')){
				globals.linkList[Number(linkDataIndex)].data.UI.nameTextUI.attr('transform', 'scale(1,1)');
				linkUI.attr('textOrient','1');

			}
			else if (to.x < 0 && (linkUI.attr('textOrient') == '1' || linkUI.attr('textOrient') == '-1')){
				linkUI.attr('textOrient', '0');
				globals.linkList[Number(linkDataIndex)].data.UI.nameTextUI.attr('transform', 'scale(-1,-1)');

			}
		}

		var distance = Math.sqrt(Math.pow(to.x,2) + Math.pow(to.y,2));
		var data;
		//Place link line...
		if (linkIndex == 0)
		{
			data = 'M '+0+' '+0+' L '+curvex + ' '+curvey + ' L '+to.x + ','+to.y;
		}else{
			//var multiplier = (((linkIndex)%2 == 0)?-1:1);
			var arc = linkIndex*(distance);
			data = 'M0,0 A' +arc +','+arc +' 0 0,0 ' +to.x+','+to.y;
		}
		linkPath.attr("d", data); //...DRAW LINE			
		linkPath.attr("stroke-dasharray", "0,0");

		var fromNodeRadius = Number(linkUI.attr('fromNodeRadius'));
		var toNodeRadius = Number(linkUI.attr('toNodeRadius'));
		if (linkIndex == 0 ){
			var linkTextWidth = 0;
			if (linkUI.attr('labelVisible') == 'true') {linkTextWidth = Number(linkUI.attr('labelWidth')) * 10;}
			
			var firstSegment = ((distance/2) - (fromNodeRadius + 5)) - (linkTextWidth/2);
			var secondSegment = ((distance/2) - (toNodeRadius + 10)) - (linkTextWidth/2);
			//set the dash-pattern of the path, to exclude the node space, and the text space...
			linkPath.attr("stroke-dasharray", "0," + (fromNodeRadius + 5) + "," + firstSegment + ","+ linkTextWidth + "," + secondSegment + "," + (toNodeRadius +10) + ",0");
		}

		//Place arrow marker...		
		if (linkDataIndex){
			var rad = toNodeRadius/6.5 + 2.4 //...'2' is the height of the triangle
			if(globals.linkList[Number(linkDataIndex)]){globals.linkList[Number(linkDataIndex)].data.UI.toMarkerUI.attr('refX', rad);}
		}

		//Set dashed-pattern if the link is actually a planned link...
		if (linkUI.attr('linkType') == 'planned'){linkPath.attr("stroke-dasharray", "5,5");}
	});
}

function renderGraph() {
  // Finally render the graph with our customized globals.graphics object:
  renderer=Viva.Graph.View.renderer(globals.GRAPH,{
    layout: globals.layout, //Exclude custom physics
    graphics: globals.graphics,
    renderLinks: true,
    prerender: true,
    container: document.getElementById('graphContainer')
  });

  function updateIndicator(e) {
    setTimeout(function() {
      var indicator=document.getElementById('indicator');
      var gx=globals.layout.getGraphRect();
      var graphMatrix = globals.graphics.getSvgRoot().childNodes[0].attr('transform').substr(7).replace(')','').replace(/\s/g,'').split(',');
      indicator.innerHTML=''
      +'x1:'+gx.x1
      +'<br/>x2:'+gx.x2
      +'<br/>y1:'+gx.y1
      +'<br/>y2:'+gx.y2
      +'<br/>scale:'+graphMatrix[3]
      +'<br/>GX:'+graphMatrix[4]
      +'<br/>GY:'+graphMatrix[5]
      //+ ((e)?('<br/>clientX:' + e.x + '<br/>clientY:' + e.y):'')
      ;
      updateIndicator();
    },10);
  }
  updateIndicator();
  

  globals.renderer=renderer;
  renderer.run();
}
function initUi() {
  //========== STARTUP UI SETTINGS ===========================================================================================================================================================================
  globals.graphContainer=document.getElementById('graphContainer');
  if(globals.graphContainer) {
    globals.graphContainer.style.background=globals.currentTheme.sourceConfig.displaySettings.graphBackground;
    if(globals.currentTheme.sourceConfig.displaySettings.backgroundImage!=null) {
      globals.graphContainer.style['background-image']='url('+globals.currentTheme.sourceConfig.displaySettings.backgroundImage+')'
    };
  }
  globals.consoleService.hideNodeFlyout();

}