configManager.configs.push( {
	"configName": "BaseNodeconfig", /*mandatory field, must be unique among other configs*/
	"prefix": "BNC", /*mandatory field, must be unique among other configs*/
	/*mandatory field, value can be "node"/"graph"/"link" */
	"configType": "entity",
	/*will apply to all nodes. Options are: null */
	"matchEntity": {labels:["link"]},
	"config": {
		"attributes": {
			/* Options: |circle|rect| */
			"shape": "rect",
			/* Options: null (auto-size)*/
			"radius": 1,
      "width": 80,
      "height": 20,
			/* Options: null (auto-color)*/
			"border-color": "#0e243f",
			/* Options: null (auto-color from RGB range)*/
			"background-color": "#4292f4",
			"opacity": 0.5,
			"highlightRing": {
				"border-color": "#0e243f"
			},

			"focusRing": {
				"border-color": "blue"
			},

			"labelText": {
				"show": true,
				/* Options: null(show label)|{key:"property", value:"nameOfProperty"}|{key:"static", value:"some text"}|{key:"first", value:["propName1", "propName2"]}*/
				"displayData": {
					"key": "static",
					"value": "http://..."
				}
			},
      "circleText": {
				"show": false
			}

		},

		"behaviours": [
      "FetchLinkOnDblClick"
		]
	}
});
