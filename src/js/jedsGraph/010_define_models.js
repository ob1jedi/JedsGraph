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
  this.nodeColorRGB = {r:100,g:100,b:100};
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
  this.UI= new nodeUiElementsType();
  this.config = {}
  this.sourceConfig = currentTheme.sourceConfig; 
  this.config.nodeDisplayBody = {};
  this.config.nodeDisplayValues = {};
  this.config.nodeStatReachers = [];
  this.config.nodeTransformers = [];
  this.stats = {}
  this.stats.toEntityCount = 0;
  this.stats.fromEntityCount = 0;
  this.nodeIndex = nodeList.length - 1;
  return this;
}

function propertyType(key, value)
{
	this.key = key;
	this.value = value;
	this.datatype = getType(value);
	//console.log(key + ': ' + this.datatype + ' = ' + value);
	return this;
}
function nodeUiElementsType()
{
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

function linkUiElementsType()
{
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
function linkDataType(fromNodeId, toNodeId, linkId, name, sourceConfig){
	this.linkType = 'data';
	//this.source; //...neo4jConnectionType
	this.fromNodeID = fromNodeId;
	this.toNodeID = toNodeId ? toNodeId :-1;
	this.id = linkId ? linkId : -1;
	this.color = currentTheme.linkColor;
	this.thickness = 1;
	this.name =  name ? name : '';
	this.displayLabel = '';
	this.properties = [];
	this.UI = new linkUiElementsType();
	this.checked = false; //...flag which indicates if the link is checked.
	this.displayingData = false; //...flag which indicates if the link label is currently displayingData.
	this.config = {}
	this.sourceConfig = currentTheme.sourceConfig;
	//this.config.linkDisplayBody = {};
	this.config.linkDisplayValues = {};
	
	if (sourceConfig){
		this.color = sourceConfig.displaySettings.linkColor
	}
	return this;
}

function timeoutElementType(_element, _duration, functionRemove)
{
	this.fnRemove = functionRemove;
	this.duration = _duration; //in seconds
	this.activationPoint = +new Date(); //+new Date()
	this.element = _element; //UI element
}

function neo4jConnectionType(name, url, username, password)
{
	this.name = name;
	this.username = username;
	this.password = password;
	this.server = url;
	this.userToken =  window.btoa(username + ':' + password);
}

function neoLabelType(setName, setColor, setColorRGB, setSourceConfig)
{
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


function viewOptionsType()
{
    this.screenDragType = true;
	this.highlightRelated = true;
	this.highlightAncestors = false;
	this.highlightdescendants = false;
	this.navigateDirection = 'both';
	return this;
}

function interactionOptionsType()
{
	this.checkNodes = false;
	return this;
}

function themeType(entityRgbRange, graphBackground, entityLabelColor)
{
	this.entityRgbRange = (entityRgbRange)?entityRgbRange: {min:100,max:200};
	/*The 4bit rgb range from which label colors can be automatically generated.*/
	this.graphBackground = (graphBackground)?graphBackground: '#1a1a1a';
	this.entityLabelColor = (entityLabelColor)?entityLabelColor: 'white';
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

function neo_APIcall()
{
	this.statements = [];
	return this;
}

function neo_Statement(statement)
{
	this.statement = statement;
	return this;
}
		
