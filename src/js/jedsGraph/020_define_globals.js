//==========Globals ==================================================================================================================================================================			
		//const UI_SHADOW_INDEX = 0;
		var binaryToggle = true;
		//.....Functional variables.......
		var labelsList = []; //list of "neoLabelType" objects
		var nodeList = []; //list of "node" objects
		var monitoredNodes = [];//list of "node" objects
		var toolPanels = [];
		var monitoredLinks = []; //list of "link" objects
		var animUpdateNodes = [];//list of "node" objects
		var animUpdateLinks = []; //list of "link" objects
		var checkedNodes = []; //list of "node" objects
		var checkedLinks = []; //list of "node" objects
		var linkList = []; //list of "link" objects
		var timeoutElements = []; //list of "timeoutElement" objects
		var masterConfigs = [];
		var selectedNodeID = '';
		var selectedNodeData = '';
		var selectedNode = '';
		var selectedLink = '';
		var selectedNodeUI = '';
		var bRelate = false;
		var bPlanRelate = false;
		var counter = 10;	
		var detailsUI;
		var detailsNode;
		var processUniqueId = 0; //... must be incremented every time its used
		var nodeFunctions = {}; //... This object instance will become an instance of the factory class "NodeFunctions", and get developer custom functions added to it.

		var consoleService = new ConsoleService();

		//......Filter settings.............
		var viewOptions = new viewOptionsType();
		var interactionOptions = new interactionOptionsType();


		//......Display settings............
		var currentTheme = new themeType();
		var MaxLabelLength = 5; //the amount of characters allowed before elipse
		var labelSize = 30;
		var CommonUI = {};
	
		//SINGLETONS...
		var GRAPH = '';
		var graphics = '';
		var layout = '';
		var renderer = '';
		var graphContainer;
		
		
		var config_ext; //...default config for whenever there isn't a specific config available

		//DATA PROVIDERS
		var dataService = new DataService();


		
		
