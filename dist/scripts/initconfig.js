var configManager = {
	configs:[],/*...will be populated by the HTML loads*/
	defaultConfig:"DT2" /*prefix of the default config*/
} 
configManager.configs.push( {
	configName: "Default", /*mandatory field, must be unique among other configs*/
	prefix: "DEF", /*mandatory field, must be unique among other configs*/
	neo4jconnection: {
		sourceName: "local",
		server: "http://localhost:7474",
		username: "neo4j",
		password: "Password@123456"
	},
	dataAccessOptions: {
		generalFetchLimit: 100 /*when you build a query, the amount of results to fetch for option boxes*/
	},
	startupOptions: {
		//defaultConnection:"local", //used unless source is otherwise specified.
		startupSearch: [],
		startupQueries: [],
		nodeDisplayValues: [ /*{nodeLabel:"SOME_LABEL", displayField??nodeLabel, circleText??nodeLabel}*/ ],
		nodeDisplayBody: [],
		linkDisplayValues: []
		/*stat Reachers: "getRelationCounts"*/
		,
		nodeStatReachers: [
			{
				nodeLabel: "Category",
				functionName: "getRelationCounts"
			} /*updates ParentCount, ChildCount*/
			,
			{
				nodeLabel: "Order",
				functionName: "getRelationCounts"
			},
			{
				nodeLabel: "Product",
				functionName: "getRelationCounts"
			}
		],
		nodeTransformers: [
			/*Petalize params: petal-count(number)/node-object-path-petal-count(string)/petal-list(object array)), image-url, inner-radius, width, height*/
			//{nodeLabel: "Category", name: "Petalize", params:["data.stats.fromEntityCount", 'custom/svg/Leaves/subulate.svg', 15, 20]}
			{
				nodeLabel: "Category",
				name: "Petalize",
				params: [ "data.propertiesObject.categoryID", 'custom/svg/Leaves/black-willow.svg', 25, 30 ]
			},
			{
				nodeLabel: "Order",
				name: "Petalize",
				params: [ "data.stats.toEntityCount", 'custom/svg/Misc/man.svg', 25, 20 ]
			}
			//,{nodeLabel: "Product", name: "Ringulate", params:["data.stats.fromEntityCount"]}

		],
			nodeAugments: [
				{
					nodeLabel: "Category",
					property: "categoryID",
					value: 5,
					nodeDisplayBody: {
						color: "gray",
						size: 50,
						image: "custom/svg/placeholder.svg"
					}
				}
			],
			"nodeFlyout": []

	},
	viewOptions: {
		prefetchLabelSelectors: false,
		prefetchCounts: true,
		panels: [
			//{name:"PANEL.NAME", parent:""/"leftSidebar"/"rightSidebar"/"topBar", visible:BOOL, icon:"bootstrap glyph icon"}
			{
				"name": "panel.labelselectors",
				"parent": "leftSidebar",
				"available": true,
				"visible": true,
				"icon": "glyphicon glyphicon-indent-right",
				"desc": "selectors"
			},
			{
				"name": "panel.functions",
				"parent": "leftSidebar",
				"available": true,
				"visible": true,
				"icon": "glyphicon glyphicon-th-large",
				"desc": "functions"
			},
			{
				"name": "panel.config",
				"parent": "leftSidebar",
				"available": false,
				"visible": false,
				"icon": "glyphicon glyphicon-adjust",
				"desc": "config"
			},
			{
				"name": "panel.selection",
				"parent": "leftSidebar",
				"available": true,
				"visible": false,
				"icon": "glyphicon glyphicon-ok-sign",
				"desc": "select options"
			},
			{
				"name": "panel.nodedetails",
				"parent": "leftSidebar",
				"available": true,
				"visible": false,
				"icon": "glyphicon glyphicon-dashboard",
				"desc": "entity details"
			},
			{
				"name": "panel.linkdetails",
				"parent": "leftSidebar",
				"available": true,
				"visible": false,
				"icon": "glyphicon glyphicon-sort-by-order",
				"desc": "relationship details"
			},
			{
				"name": "panel.simplequery",
				"parent": "leftSidebar",
				"available": false,
				"visible": false,
				"icon": "glyphicon glyphicon-search",
				"desc": "query"
			},
			{
				"name": "panel.bulkactions",
				"parent": "leftSidebar",
				"available": true,
				"visible": true,
				"icon": "glyphicon glyphicon-list",
				"desc": "bulk actions"
			},
			//{
			//	"name": "panel.node",
			//	"parent": "",
			//	"available": true,
			//	"visible": true,
			//	"icon": "glyphicon glyphicon-star",
			//	"desc": "node panel"
			//},
			{
				"name": "panel.monitoring",
				"parent": "leftSidebar",
				"available": false,
				"visible": false,
				"icon": "glyphicon glyphicon-asterisk",
				"desc": "monitoring"
			},
			{
				"name": "panel.entity.create",
				"parent": "leftSidebar",
				"available": true,
				"visible": false,
				"icon": "glyphicon glyphicon-plus-sign",
				"desc": "create entity"
			},
			{
				"name": "panel.relationship.create",
				"parent": "leftSidebar",
				"available": true,
				"visible": false,
				"icon": "glyphicon glyphicon-registration-mark",
				"desc": "create relationship"
			},
			{
				"name": "panel.appearance",
				"parent": "leftSidebar",
				"available": true,
				"visible": false,
				"icon": "glyphicon glyphicon-certificate",
				"desc": "appearance"
			},
			{
				"name": "panel.highlight",
				"parent": "leftSidebar",
				"available": true,
				"visible": false,
				"icon": "glyphicon glyphicon-eye-open",
				"desc": "hover options"
			},
			{
				"name": "panel.navigation",
				"parent": "leftSidebar",
				"available": true,
				"visible": false,
				"icon": "glyphicon glyphicon-hand-up",
				"desc": "navigation options"
			}
		],
		subnodes: { relations: "ifany" },
		nodeSizing: "relationCount" /*relationCount/outRelationCount/inRelationCount(increase node size based on relationships)*/
	},
	monitoringOptions: {
		pollInterval: 1 /*in seconds*/
	},
	displaySettings: {
		"selectorColor": "gray",
		"backgroundImage": null /*URL or, set to null for nothing*/
		,
		"graphBackground": "linear-gradient(#002533, #00384d, #002533)", /*"linear-gradient(#002533, #00384d)"*/ /*"#0e1a25",*/
		"highlightColor": "#99ff33",
		"focusColor": "red",
		"entityShape": "circle",
		"entityRgbRange": {
			"min": 40,
			"max": 140
		} /*The 4bit rgb range from which nodeLabel colors can be automatically generated.*/
		,
		"entityLabelColor": "black",
		"entityBorderColor": "black", /*null=auto-color*/
		//"entityCircleTextColor": "red",

		"entityOpacity": 1,
		"entityPopoutTextColor": "#0077b3",
		"entityPopoutBoxColor": "#bfbfbf",
		"entityFont": {
			"family": "Arial, Helvetica, sans-serif",
			"weight": "normal"
		},
		"linkColor": "grey" /*...html/hex color*/
		,
		"linkMainTextColor": "#d9d9d9",
		"linkSubTextColor": "#ffa64d",
		"linkThickness": 3,
		"linkOpacity": 1,
		"linkHighlightColor": "red",
		"opaque": false,
		"labelSizing": "fontsize" /*choices: "hyphenate" (make labels shorter) "fontsize" (make the font size smaller) "" (no sizing, labels may extend past the boundaries of the node)*/

		/*effects...*/
		,
		"haze": false /*...outer node haze*/
		//,textHaze:true /*...node text haze*/
		,
		"glass": false /*...node text haze*/
		,
		"highlightHaze": false /*...outer node haze*/
		,
		"shadow": false /*...outer node shadow*/
		,
		"glow": false /*...outer node glow*/
		,
		"rounded": false /*...inner node shadow*/

		//node data...
		,
		"showLabels": false,
		"loadNodePopouts": false,
		"showCircleText": false

		//link data
		,
		"showRelationships": "on-highlight" /*showRelationships: "all/on-highlight/none" */
		,
		"loadRelationPopouts": false,
		"showRelationProperties": false

	}
})

configManager.configs.push( {
	configName: "local", /*mandatory field, must be unique among other configs*/
	prefix: "LOC", /*mandatory field, must be unique among other configs*/
	neo4jconnection: {
		sourceName: "local",
		server: "",
		username: "",
		password: ""
	},
	startupOptions: {
		//defaultConnection:"local", //used unless source is otherwise specified.
		startupSearch: [
			/*{nodeLabel:"SOME_LABEL", source:"NEO4J_CONNECTION, properties:[{key:"KEYNAME", value:"VALUE"}]"*/
			/*{nodeLabel:"Person", properties:[{key:"name", value:"Amy"}] }*/
			{ "nodeLabel": "WORKFLOW" },
			{ "nodeLabel": "STREAM" }
		],
		startupQueries: [
			//{fromEntity:"service", whereProperty:"serviceName", equalsValue:"vanguard2"},
			//{fromEntity:"version", whereProperty:"versionName", equalsValue:"V23"}
		],
		nodeDisplayValues: [
			/*{nodeLabel:"SOME_LABEL", displayField??nodeLabel, displayLabel??nodeLabel},*/
			//{nodeLabel:"Human", displayField:"Name"},
			{
				"nodeLabel": "service",
				"displayField": "status"
			},
			{
				"nodeLabel": "version",
				"displayField": "versionName"
			},
			{
				"nodeLabel": "Category",
				"displayField": "categoryName"
			},
			{
				"nodeLabel": "WORKFLOW",
				"displayField": "workflowName"
			},
			{
				"nodeLabel": "TOOL",
				"displayField": "toolName"
			}
		],
		nodeDisplayBody: [
			/*{nodeLabel:"SOME_LABEL", "image":"IMAGE_URL"??none, "color":"HEXVALUE"??auto, "size":30, "labelPos":"above/under/left/right"??center},*/
			{
				nodeLabel: "Sample",
				size: 50,
				color: "#f2b3ab"
			},
			{
				nodeLabel: "BinomialDistribution",
				size: 50,
				color: "#f2b3ab"
			},
			{
				nodeLabel: "Population",
				size: 50,
				color: "#f2b3ab"
			},
			{
				nodeLabel: "SampleDistribution",
				size: 50,
				color: "#f2b3ab"
			}
		],
			"nodeFlyout": [
				{
					"nodeLabel": "WORKFLOW",
					"elementType": "button",
					"innerHTML": "Configuration",
					"onclick": "globals.nodeFunctions.show_updateWorkflowModal()",
					"tooltip": "Configure this workflow"
				},
				{
					"nodeLabel": "WORKFLOW",
					"elementType": "button",
					"innerHTML": "New Workflow",
					"onclick": "globals.nodeFunctions.show_addWorkflowModal()",
					"tooltip": "Create new workflow"
				},
				{
					"nodeLabel": "WORKFLOW",
					"elementType": "button",
					"innerHTML": "-",
					"onclick": "globals.nodeFunctions.show_removeWorkflowModal()",
					"tooltip": "Delete this workflow"
				},
				{
					"nodeLabel": "WORKFLOW",
					"elementType": "div",
					"innerHTML": ""
				},
				{
					"nodeLabel": "WORKFLOW",
					"elementType": "button",
					"innerHTML": "Add Content",
					"onclick": "globals.nodeFunctions.show_addContentModal()",
					"tooltip": "Take a few files"
				},
				{
					"nodeLabel": "WORKFLOW",
					"elementType": "button",
					"innerHTML": "Send to Tool",
					"onclick": "globals.nodeFunctions.show_addToolModal()",
					"tooltip": "Process content with tool"
				},
				{
					"nodeLabel": "WORKFLOW",
					"elementType": "button",
					"innerHTML": "Send to Collector",
					"onclick": "globals.nodeFunctions.show_addCollectorModal()",
					"tooltip": "Collect processed content"
				},
				{
					"nodeLabel": "TOOL",
					"elementType": "button",
					"innerHTML": "Configuration",
					"onclick": "globals.nodeFunctions.show_updateToolModal()",
					"tooltip": "Adjust settings for tool"
				},
				{
					"nodeLabel": "TOOL",
					"elementType": "button",
					"innerHTML": "Send to Tool",
					"onclick": "globals.nodeFunctions.show_addToolModal()",
					"tooltip": "Process content with tool"
				},

				{
					"nodeLabel": "COLLECTOR",
					"elementType": "button",
					"innerHTML": "Configuration",
					"onclick": "globals.nodeFunctions.show_updateCollectorModal()",
					"tooltip": "Configure collector"
				}

			]
	},

	"viewOptions": {
		"prefetchLabelSelectors": true
	},
	"displaySettings": {
		"selectorColor": "gray",
		"graphBackground": "white", //"linear-gradient(#002533, #00384d)", //"#0e1a25",

		"entityShape": "circle",
		"entityRgbRange": {
			"min": 150,
			"max": 200
		}, /*The 4bit rgb range from which nodeLabel colors can be automatically generated.*/
		"entityLabelColor": "black",
		"entityBorderColor": "black", /*null=auto-color*/
		"entityOpacity": 1,

		"linkColor": "grey", /*...html/hex color*/
		"linkMainTextColor": "grey",
		"linkSubTextColor": "grey",
		"linkThickness": 2,
		"linkOpacity": 1,

		"opaque": false,
		"labelSizing": "fontsize", /*choices: "hyphenate" (make labels shorter) "fontsize" (make the font size smaller) "" (no sizing, labels may extend past the boundaries of the node)*/

		/*effects...*/

		"haze": false, /*...outer node haze*/
		"highlightHaze": true, /*...outer node haze*/
		"shadow": false, /*...outer node shadow*/
		"glow": false, /*...outer node glow*/
		"rounded": false, /*...inner node shadow*/

		//node data...
		"showLabels": false,
		"loadNodePopouts": false,

		//link data
		"showRelationships": "on-highlight", /*showRelationships: "all/on-highlight/none" */
		"loadRelationPopouts": false,
		"showRelationProperties": false

	}
})

configManager.configs.push( {
	/*mandatory field, must be unique among other configs*/
	"configName": "BaseGraphConfig",
	/*mandatory field, must be unique among other configs*/
	"prefix": "BGC",
	/*mandatory field, value can be "node"/"graph"/"link" */
	"configType": "graph",
	"config": {
		"startupOptions": {},
		"startupSearch": [
			/*{nodeLabel:"SOME_LABEL", source:"NEO4J_CONNECTION, properties:[{key:"KEYNAME", value:"VALUE"}]"*/
			/*{nodeLabel:"Person", properties:[{key:"name", value:"Amy"}] }*/
			{ "nodeLabel": "WORKFLOW" },
			{ "nodeLabel": "STREAM" }
		],
		"startupQueries": [
			/*{fromEntity:"service", whereProperty:"serviceName", equalsValue:"vanguard2"},*/
			/*{fromEntity:"version", whereProperty:"versionName", equalsValue:"V23"}*/
		]
	}
});


configManager.configs.push( {
	"configName": "BaseNodeconfig", /*mandatory field, must be unique among other configs*/
	"prefix": "BNC", /*mandatory field, must be unique among other configs*/

	/*mandatory field, value can be "node"/"graph"/"link" */
	"configType": "entity",

	/*will apply to all nodes. Options are: null */
	"matchEntity": null,
	"config": {
		"attributes": {
			/* Options: |circle|rect| */
			"shape": "circle",
			/* Options: null (auto-size)*/
			"radius": 25,
			/* Options: null (auto-color)*/
			"border-color": null,
			/* Options: null (auto-color from RGB range)*/
			"background-color": null,
			"opacity": 1,
			"rgbRange": {
				"min": 60,
				"max": 140
			},

			"highlightRing": {
				"border-color": "#99ff33"
			},

			"focusRing": {
				"border-color": "red"
			},

			"labelText": {
				"show": true,
				/* Options: null(show label)|{key:"property", value:"nameOfProperty"}|{key:"static", value:"some text"}|{key:"first", value:["propName1", "propName2"]}*/
				"displayData": {
					"key": "first",
					"value": [ "Name", "Title", "Id" ]
				},
				/* Options: above|under|center|right|left|null*/
				"labelPosition": "center",
				/* Options: hyphenate|fontsize|null*/
				"labelSizing": null,
				"color": "#cccccc",
				"font-family": "Arial, Helvetica, sans-serif",
				"font-weight": "normal",
				"x": 0,
				"y": 0,
				"effects": {
					"haze": false
				}
			},
			"circleText": {
				"show": true,
				"color": "#d9dce0",
				"opacity": 1,
				"font-family": "Arial, Helvetica, sans-serif",
				"font-weight": "normal"
			},
			"selector": {
				"background-color": "gray"
			},
			"img": {
				/* Options: null|imageUrl*/
        "url": null,
        /* Options: null|{key:"property", value:"nameOfProperty"}|{key:"static", value:"some text"}*/
        "displayData": {
					"key": null,
					"value": null
				},
				"width": 0,
				"height": 0,
				"opacity": 1
			},
			"placement": {
				"depth": null,
				"start-x": null,
				"start-y": null
			},
			"physics": {
				"mass": null,
				"spring": null
			}
		},

		"relatedThings": [
			/* example of "option" thing: {"thingName": "option","url": "custom/assets/64.png","x": 10,"y": 0,"size": 50}, */
      {
        "arrayId":  1,
        "thingName": "popoutBox",
        "TextColor": "#0077b3",
        "BoxColor": "#bfbfbf"
      },
      {
        "arrayId":  2,
        "thingName": "flyout",
        "show": true
      },
      {
        "arrayId":  3,
        "thingName": "flyoutButton",
        "elementType": "button",
        "innerHTML": "New Workflow",
        "onclick": "globals.nodeFunctions.show_addWorkflowModal()",
        "tooltip": "Create new workflow"
      }
		],
		"behaviours": {
			"loadNodePopouts": false
		},

		"effects": {
			"haze": false,
			"shadow": false,
			"glass": false,
			"rounded": false,
			"highlightHaze": false,
			"glow": false,
			"opaque": false
		},


		"functions": [
			/*available event: onDisplay, onClick, onDrag, onHide */
			/*available functionName: getRelationCount, getOutboundRelationCount, getInboundRelationCount, getTallestTree, getDeepestRoot, getAncestorCount, getDescendantCount */
      {
        "arrayId":  1,
        "onEvent": "onDisplay",
        "executeFunction": "getRelationCounts",
        "withParams": { },
        "intoVariable": "Relations"
      }
		],

		"plugins": [
      {
        "arrayId":  1,
        "name": "Petalize",
        "params": {
          "propertyName": "Relations",
          "petalImageUrl": "custom/svg/Leaves/black-willow.svg",
          "startAtRadius": 25,
          "petalSize": 30
        }
      },
      {
        "arrayId":  2,
        "name": "Ringulate",
        "params": {
          "propertyName": "Relations",
          "petalImageUrl": "custom/svg/Leaves/black-willow.svg"
        }
      }
		],
		"appearanceRules": [
      {
        "arrayId":  1,
        "ifProperty": "categoryID",
        "isValue": 5,
        "thenNodeDisplayBody": {
          "color": "gray",
          "size": 50,
          "image": "custom/svg/placeholder.svg"
        }
      }
		],

		"dynamicSizingOptions": {
			"propertyName": "Relations",
			"acceleration": -1, /* if -1 then increases less the greater the value */
			"velocity": 1 /* if 1 then size increases by 1 as value increases by 1 */
		} /*relationCount/outRelationCount/inRelationCount(increase node size based on relationships)*/

	}
});
