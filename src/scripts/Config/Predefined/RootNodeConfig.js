configManager.configs.push( {
	"configName": "BaseNodeconfig", /*mandatory field, must be unique among other configs*/
	"prefix": "BNC", /*mandatory field, must be unique among other configs*/

	/*mandatory field, value can be "node"/"graph"/"link" */
	"configType": "entity",

	/*will apply to all nodes. Options are: null */
	"matchEntity": {labels:["root"]},
	"config": {
		"attributes": {
      "background-color": "black",
      "border-color": "black",
      "radius": 10,
			"labelText": {
				"show": false
			},
			"circleText": {
				"show": false
				},
		}
	}
});
