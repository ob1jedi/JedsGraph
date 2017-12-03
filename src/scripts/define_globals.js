

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
