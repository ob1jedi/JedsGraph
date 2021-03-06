﻿configManager.configs.push( {
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
