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
