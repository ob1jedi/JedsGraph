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
				"color": "#ccc",
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
