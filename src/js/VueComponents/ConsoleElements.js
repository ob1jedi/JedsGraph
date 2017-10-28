


// ================= NODE EDITOR ================= 

Vue.component('vw-panel-nodeEditor', {
	props: ['tabsprop'],
	template: `

		<div class='modPanel' id='nodeEditor'>
			<div class="panelHead">Node Type Editor<i class ="glyphicon glyphicon-menu-hamburger pull-right"></i></div>

			<div class ="tab">
			  <button class ="tablinks" v-on:click="tabsprop.selectedMatchingTab='NEW'">New Match</button>
			  <button class ="tablinks" v-on:click="tabsprop.selectedMatchingTab='EXISTING'">Existing</button>
			</div>
			<div>
				<vw-panel-nodeEditor-matching v-show="tabsprop.selectedMatchingTab==='NEW'" v-bind:newMatching="tabsprop.newMatching"></vw-panel-nodeEditor-matching>
				<vw-panel-nodeEditor-existing v-show="tabsprop.selectedMatchingTab==='EXISTING'" v-bind:existing="tabsprop.existingMatching"></vw-panel-nodeEditor-existing>
			</div>

			<div class ="tab">
			  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab='STYLES'">Style</button>
			  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab='EFFECTS'">Effects</button>
			  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab='BEHAVIOURS'">Behaviours</button>
			</div>
			<div>
				<vw-panel-nodeEditor-styles v-show="tabsprop.selectedStyleTab==='STYLES'" v-bind:styles="tabsprop.styles"></vw-panel-nodeEditor-styles>
				<vw-panel-nodeEditor-effects v-show="tabsprop.selectedStyleTab==='EFFECTS'" v-bind:effects="tabsprop.effects"></vw-panel-nodeEditor-effects>
				<vw-panel-nodeEditor-behaviours v-show="tabsprop.selectedStyleTab==='BEHAVIOURS'" v-bind:behaviours="tabsprop.behaviours"></vw-panel-nodeEditor-behaviours>
			</div>

			<div class ="tab">
			  <button class ="tablinks" v-on:click="tabsprop.saveMatch()">Save</button>
			  <button class ="tablinks" v-on:click="tabsprop.reset()">Reset</button>
			</div>

			<!--<div class ="tabcontent">
				<vw-graph></vw-graph>
			</div>-->
		</div>

	`
})


Vue.component('vw-panel-nodeEditor-matching', {
	props: ['newMatching'],
	template: `
		<div class ="tabcontent">
			<label class="active">Node type of: </label>
			<input
				v-model.lazy='newMatching.selectedNodeType'>
			</input>
			<label class="active">With properties: <span v-on:click="newMatching.addProperty()" class ="btn btn-sm"><i class ="glyphicon glyphicon-plus"></i></span></label>
			<hr/>
			<table>
				<th><label>Name  </label></th>
				<th><label>Value </label></th>
				<tr v-for="property in newMatching.properties">
					<td><input v-bind="property.key" class ="halfbox"></input></td>
					<td><input v-bind="property.value" class ="halfbox"></input></td>
				</tr>
			</table>
		</div>
		`
})
Vue.component('vw-panel-nodeEditor-existing', {
	props: ['existing'],
	template: `
		<div class ="tabcontent">

    	<table class="table">
				<tr>
					<td><label class="canCheck active">Config:</label></td>
					<td>
			      <select class ="pull-right" v-model='existing.selectedConfig'>
				      <option v-for="config in existing.masterEntityConfigs" v-bind:value="config">
                {{config.configName}}
              </option>
			      </select>
  	      </td>
        </tr>
      </table>

    </div>
		`
})

Vue.component('vw-panel-nodeEditor-styles', {
	props: ['styles'],
	template: `
		<div class ="tabcontent">

			<table class="table">
				<tr>
					<td>
            <label class="canCheck"
              v-on:click="(styles.bNodeColor=!styles.bNodeColor)" 
              v-bind:class="{ active: styles.bNodeColor }">
                Background Col:
              </label>
            </td>
					<td>
						<input class="jscolor tinybox pull-right"
							v-model.lazy='styles.selectedNodeColor'
							v-on:change="styles.updateNodeBackgroundColor('#' + styles.selectedNodeColor)">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeBorderColor=!styles.bNodeBorderColor)" 
              v-bind:class="{ active: styles.bNodeBorderColor }">Border Color:</label></td>
					<td>
						<input class ="jscolor tinybox pull-right"
							v-model.lazy='styles.selectedNodeBorderColor'
							v-on:change="styles.updateNodeBorderColor('#' + styles.selectedNodeBorderColor)">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeTextColor=!styles.bNodeTextColor)" 
              v-bind:class="{ active: styles.bNodeTextColor }">Text Color:</label></td>
					<td>
						<input class ="jscolor tinybox pull-right"
							v-model.lazy='styles.selectedNodeTextColor'
							v-on:change="styles.updateNodeTextColor('#' + styles.selectedNodeTextColor)">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeCircleTextColor=!styles.bNodeCircleTextColor)" 
              v-bind:class="{ active: styles.bNodeCircleTextColor }">Circle Text Color: </label></td>
					<td>
						<input class ="jscolor tinybox pull-right"
							v-model.lazy='styles.selectedNodeCircleTextColor'
							v-on:change="styles.updateNodeCircleTextColor('#' + styles.selectedNodeCircleTextColor)">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeSize=!styles.bNodeSize)" 
              v-bind:class="{ active: styles.bNodeSize }">Size: </label></td>
					<td>
						<input class ="tinybox pull-right" type="number" value="25"
								v-model.lazy='styles.selectedNodeSize'
								v-on:change="styles.updateNodeSize(styles.selectedNodeSize)">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeShape=!styles.bNodeShape)" 
              v-bind:class="{ active: styles.bNodeShape }">Shape: </label></td>
					<td>
						<select class ="pull-right"
							v-model='styles.selectedNodeShape'
							v-on:change="styles.updateNodeShape()">>
							<option v-for="shape in styles.shapes" v-bind:value="shape.value">{{shape.key}}</option>
						</select>
					</td>
				</tr>
			</table>
			<label class="canCheck"
              v-on:click="(styles.bNodeImageUrl=!styles.bNodeImageUrl)" 
              v-bind:class="{ active: styles.bNodeImageUrl }">Image URL: </label>
			<input
					v-model.lazy='styles.selectedNodeImageUrl'
					v-on:change="styles.updateNodeImage(styles.selectedNodeImageUrl)">
			</input>
		</div>
		`
})
Vue.component('vw-panel-nodeEditor-effects', {
	props: ['effects'],
	template: `
		<div class ="tabcontent">
			<table class ="table">
				<tr>
					<td><label class="canCheck"
              v-on:click="(effects.activateEffectHaze=!effects.activateEffectHaze)" 
              v-bind:class="{ active: effects.activateEffectHaze }">Haze: </label></td>
					<td><input type="checkbox" v-model="effects.hasEffectHaze" value="false"></input></td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(effects.activateEffectShadow=!effects.activateEffectShadow)" 
              v-bind:class="{ active: effects.activateEffectShadow }">Shadow: </label></td>
					<td><input type="checkbox" v-model="effects.hasEffectShadow" value="false"></input></td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(effects.activateEffectGlass=!effects.activateEffectGlass)" 
              v-bind:class="{ active: effects.activateEffectGlass }">Glass: </label></td>
					<td><input type="checkbox" v-model="effects.hasEffectGlass" value="false"></input></td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(effects.activateEffectRounded=!effects.activateEffectRounded)" 
              v-bind:class="{ active: effects.activateEffectRounded }">Rounded: </label></td>
					<td><input type="checkbox" v-model="effects.hasEffectRounded" value="false"></input></td>
				</tr>

			</table>
		</div>
		`
})
Vue.component('vw-panel-nodeEditor-behaviours', {
	props: ['behaviours'],
	template: `
		<div class ="tabcontent">
			<table class ="table">
				<tr>
					<td><label class="canCheck"
              v-on:click="(behaviours.bDisplayText=!behaviours.bDisplayText)" 
              v-bind:class="{ active: behaviours.bDisplayText }"> Center text: </label></td>
          <td>
						<select class ="pull-right" v-model='behaviours.selectedDisplayTextType'>
							<option v-for="type in ['Node type','Property','Static','First Of']" v-bind:value="type">
                {{type}}
              </option>
						</select>
					</td>
				</tr>
				
        <tr v-if="(behaviours.selectedDisplayTextType ==='Property')">
					<td> <label v-bind:class="{ active: behaviours.bDisplayText }"> field name: </label>                                                </td>
					<td> <input class ="halfbox pull-right" v-model="behaviours.selectedDisplayField"></input> </td>
				</tr>
				
        <tr v-if="(behaviours.selectedDisplayTextType ==='Static')">
					<td> <label v-bind:class="{ active: behaviours.bDisplayText }"> value: </label>                                                    </td>
					<td> <input class ="halfbox pull-right" v-model="behaviours.selectedDisplayField"></input> </td>
				</tr>
				
        <tr v-if="(behaviours.selectedDisplayTextType ==='First Of')">
					<td> <label v-bind:class="{ active: behaviours.bDisplayText }"> field names: </label>                                              </td>
					<td> <label> comma seperated </label> <input class ="halfbox pull-right" v-model="behaviours.selectedDisplayField"></input> </td>
				</tr>

			</table>
			<hr>

		</div>
		`
})



// ================= SIDEBARS & TOPBARS & GRAPH ================= 

Vue.component('vw-graph', {
	template:
        `
		<div id='graphPanel'>
			<div id='graphContainer'></div>
		</div>
		`
})

Vue.component('vw-panel', {
	template: ``
})


Vue.component('vw-topbar', {
	template:
`
	<div id='topBar' class="topbar-shadow">
	</div>
`
})

Vue.component('vw-secondbar', {
	template:
`
	<div id='secondBar'>
        <vw-formula-box></vw-formula-box>
	</div>
`
})

Vue.component('vw-left-sidebar', {
	template: `
		<div id='leftColumn' class ="flexcroll">
		</div>
		`
})

Vue.component('vw-right-sidebar', {
	props: ['tabs'],
	template: `
		<div id='rightColumn' class ="flexcroll">
			<vw-panel-nodeEditor v-bind:tabsprop="tabs"></vw-panel-nodeEditor>
		</div>
		`
})

// ================= INFO MODAL ================= 

Vue.component('vw-info-modal', {
	props: ['formulaprop'],
	template:
	`
	<dialog class ="inputModal" id="InfoModal">
		<form class ="form-group">
			<h2>{{ formulaprop.modalHeader }}</h2>
			<div class ="inputModal modalContent flexcroll"
				v-html=formulaprop.currentTranslator.ReferenceContent>
			</div>
		</form>
		<button v-on:click="formulaprop.closeInfoModal" class ="btn btn-default pull-right">{{ formulaprop.modalButtonCaption }}</button>
	</dialog>
	`
})

// ================= MODE INDICTAOR ================= 
Vue.component('vw-mode-indicator', {
	props: ['indicatorprop'],
	template: `
        <div id='modeIndicator'>
            <img :src="indicatorprop.image" class ="modeIndicatorImage"/>
            <span class ="modeIndicatorLabel">{{indicatorprop.title}}</span>
        </div>
		`
})


// ================= FORMULA BOX ================= 
Vue.component('vw-formula-box', {
	props: ['formulaprop'],
	template: `
        <div id='formulaBox'>
            <table>
                <tr>
                    <td>
						<label for="txtFormulaInput">Formula</label>
                        <input class="dynamic3" id="txtFormulaInput"
							v-on:keyup.enter="formulaprop.executeFormula()"
							v-model='formulaprop.formulaValue'
							v-bind:placeholder="formulaprop.currentTranslator.Examples[0]">
						</input>
                    </td>
                    <td>
						<label for="cmdFormulaGenerate">&nbsp</label>
						<div>
							<button class ="mybutton" id="cmdFormulaGenerate"
								v-on:click="formulaprop.executeFormula(formulaprop.formulaValue)">
								generate
							</button>
						</div>
                    </td>
					<td>
						<label for="cboFormulaTranslator">Translator</label>
                        <select id="cboFormulaTranslator"
							v-model="formulaprop.selectedTranslatorName"
                            v-on:change="formulaprop.selectTranslator(formulaprop.selectedTranslatorName)"
							><option
								v-for="item in formulaprop.translators"
								v-bind:value="item.Name"
								v-bind:key="item.Name"
							>{{item.Name}}</option>
						</select>
                    </td>
					<td>
						<label for="cboFormulaExamples">Examples</label>
						<select id="cboFormulaExamples" name="formulaExample"
							v-model="formulaprop.selectedExample"
							v-on:change="formulaprop.executeExampleFormula()"
							><option
								v-for="example in formulaprop.currentTranslator.Examples"
								v-bind:value="example"
							>{{example}}</option>
						</select>
					</td>

					<td>
						<label for="cmdInfo">&nbsp</label>
						<div>
							<button id="cmdInfo"
								v-on:click="formulaprop.showInfoModal()"
							><i class ="glyphicon glyphicon-question-sign"></i></button>
						</div>
                    </td>

					<td>
						<label for="cmdUrlImport">&nbsp</label>
						<div>
							<button class ="mybutton" id="cmdUrlImport"
								v-on:click="formulaprop.importFromUrl()">
								Import
							</button>
						</div>
                    </td>

                </tr>
            </table>
        </div>
		`
})

var consoleApp = new Vue({
	components: ['vw-panel-nodeEditor'],
	el: '#vue-app',
	data: {
		// Indicator
		indicator: {
			title: "view",
			image: "../custom/assets/binoculars.svg"
		},
		// Formula toolbar
		formulaToolbar: {
			modalHeader: "",
			modalContent: "",
			modalButtonCaption: "Close",

			formulaValue: "",
			translators: [
				new SimpleTranslator(),
				new JsonTranslator()
			],
			selectedTranslatorName: new SimpleTranslator().Name,
			currentTranslator: new SimpleTranslator(),
			selectedExample: "",

			selectTranslator: function (value) {
				var currentScope = this;
				this.translators.forEach(function (trans) {
					if (trans.Name === value) {
						currentScope.currentTranslator = trans;
						currentScope.selectedTranslatorName = trans.Name;
						return;
					}
				});
			},
			executeFormula: function () {
				var translator = this.currentTranslator;
				translator.Translate(this.formulaValue);
				this.formulaValue = "";
			},
			executeExampleFormula: function () {
				var translator = this.currentTranslator;
				translator.Translate(this.selectedExample);
			},

			// Info model
			infoModal: {
				showModal: false
			},
			showInfoModal: function () {
				this.modalHeader = this.currentTranslator.Name;
				this.modalContent = this.currentTranslator.ReferenceContent;
				this.modalButtonCaption = "Close";
				ShowInfoModal();
			},
			closeInfoModal: function () {
				CloseInfoModal();
			},
			importFromUrl(url) {
				console.log('IMPORTING...');
				var translator = this.currentTranslator;
				var httpClient = new HttpClient();
				httpClient.get('http://en.wikipedia.org/api/rest_v1/feed/featured/2000/03/15', function (response) {
					console.log('response', response);
					translator.Translate(response);
				});
			}
		},
		tabs: {
			// Matching Tabs...
			selectedMatchingTab: 'NEW',
			newMatching: {
				selectedNodeType: '',
				properties: [],
				addProperty: function () {
					this.properties.push({ key: '', value: '' });
				}
			},
			existingMatching: {
        selectedConfig: 'Custom',
        masterEntityConfigs: [],
      },
			// Style tabs...
			selectedStyleTab: `STYLES`,
			styles: {
        bNodeColor:false,
        bNodeBorderColor:false,
        bNodeTextColor:false,
        bNodeCircleTextColor:false,
        bNodeSize:false,
        bNodeShape:false,
        bNodeImageUrl:false,

				selectedNodeColor: '#BFBC8B',
				selectedNodeBorderColor: '#8ABF8A',
				selectedNodeTextColor: '#8A9DBF',
				selectedNodeCircleTextColor: '#7EDEE6',
				selectedNodeShape: 'circle',
				selectedNodeSize: 25,
				selectedNodeImageUrl: null,
				//shapes: [{ key: 'circle', value: 'circle' }, { key: 'rectangle', value: "rect" }, { key: 'triangle', value: "path" }],
				shapes: [{ key: 'circle', value: 'circle' }],
				updateNodeBackgroundColor: function (color) {
					if (globals.selectedNode)
            globals.selectedNode.data.UI.bodyUI.attributes["fill"].nodeValue = color;
				},
				updateNodeBorderColor: function (color) {
					if (globals.selectedNode)
            globals.selectedNode.data.UI.bodyUI.attributes["stroke"].nodeValue = color;
				},
				updateNodeTextColor: function (color) {
					if (globals.selectedNode)
            globals.selectedNode.data.UI.displayTextUI.attributes["fill"].nodeValue = color;
				},
				updateNodeCircleTextColor: function (color) {
					if (globals.selectedNode)
            globals.selectedNode.data.UI.circleText.attributes["fill"].nodeValue = color;
				},
				updateNodeSize: function (size) {
					if (globals.selectedNode)
            globals.selectedNode.data.UI.bodyUI.attributes["r"].nodeValue = size;
				},
				updateNodeShape: function () {
					if (globals.selectedNode)
            globals.selectedNode.data.UI.bodyUI.nodeName = this.selectedNodeShape;
				},
				updateNodeImage: function (URL) {
					if (globals.selectedNode)
            globals.selectedNode.data.UI.imageUI.href.baseVal = URL;
				},

			},
			effects: {
        activateEffectHaze:false,
        activateEffectShadow:false,
        activateEffectGlass:false,
        activateEffectRounded:false,
        
        hasEffectHaze: null,
        hasEffectShadow: null,
        hasEffectGlass: null,
        hasEffectRounded: null,
      },
			behaviours: {
        bDisplayText:false,
				selectedDisplayTextType: null,
				selectedDisplayField: null,
			},
			saveMatch: function () {
				console.log('Saving...');
				var configHelper = new ConfigHelper();
				var tempConfig = {
					configName: (this.selectedMatchingTab==='NEW')?this.newMatching.selectedNodeType:this.existingMatching.selectedConfig,
					configType: "entity",
					matchEntity: {
						"labels": [this.newMatching.selectedNodeType],
					},
					config: {}
				};
				// Add properties to matching criteria...
				for (var i = 0; i < this.newMatching.properties.length; i++) {
					var property = this.newMatching.properties[i];
					if (!tempConfig.matchEntity.properties)
						tempConfig.matchEntity.properties = {};
          if (property.key && property.value)
					  tempConfig.matchEntity.properties[property.key] = property.value;
				}
				//tempConfig.config.attributes = {
				//	"background-color": this.styles.selectedNodeColor,
				//	"border-color": this.styles.selectedNodeBorderColor,
				//	"shape": this.styles.selectedNodeShape,
				//	"radius": this.styles.selectedNodeSize,
				//	"labelText": {
				//		"color": this.styles.selectedNodeTextColor
				//	},
				//	"circleText": {
				//		"color": this.styles.selectedNodeCircleTextColor
				//	},
				//	"img": {
				//		"url": this.styles.selectedNodeImageUrl
				//	}
				//};
        //console.log('CURRENT CONFIG' , tempConfig);

        var s = this.styles;
        tempConfig = addToConfig(s.bNodeColor           ,tempConfig, {"config":{"attributes":{"background-color":s.selectedNodeColor}}}     );
				tempConfig = addToConfig(s.bNodeBorderColor     ,tempConfig, {"config":{"attributes":{"border-color" :s.selectedNodeBorderColor}}}  );
        tempConfig = addToConfig(s.bNodeShape           ,tempConfig, {"config":{"attributes":{"shape" :s.selectedNodeShape}}}               );
        tempConfig = addToConfig(s.bNodeSize            ,tempConfig, {"config":{"attributes":{"radius" :s.selectedNodeSize}}}               );
        tempConfig = addToConfig(s.bNodeTextColor       ,tempConfig, {"config":{"attributes":{"labelText":{"color" :s.selectedNodeTextColor}}}});
        tempConfig = addToConfig(s.bNodeCircleTextColor ,tempConfig, {"config":{"attributes":{"circleText":{"color" :s.selectedNodeCircleTextColor}}}});
        tempConfig = addToConfig(s.bNodeImageUrl        ,tempConfig, {"config":{"attributes":{"img":{"url" :s.selectedNodeImageUrl}}}}      );

        var b = this.behaviours;
        if (b.bDisplayText){
				  if (b.selectedDisplayTextType == "Property") {
					  tempConfig.config.attributes.labelText.displayData = { key: "property", value: b.selectedDisplayField.trim() };
				  }
				  if (b.selectedDisplayTextType == "Type") {
					  tempConfig.config.attributes.labelText.displayData = null;
				  }
				  if (b.selectedDisplayTextType == "Static") {
					  tempConfig.config.attributes.labelText.displayData = { key: "static", value: b.selectedDisplayField.trim() };
				  }
				  if (b.selectedDisplayTextType == "First of") {
					  tempConfig.config.attributes.labelText.displayData = { key: "first", value: b.selectedDisplayField.split(',').map(function(fieldName){ return fieldName.trim()} ) };
				  }
        }

        //console.log('NEW CONFIG' , tempConfig);

				//configHelper.AddOrUpdateDynamicEntityConfigReturnId(tempConfig.configName, tempConfig);

				//var nodes = getNodesByMatchingLabels(globals.nodeList, [this.newMatching.selectedNodeType]);
				//console.log('Refreshing nodes:', nodes);
				//nodes.forEach(function (node) {
				//	console.log('Refreshing node:', node);
				//	refreshNodeAppearance(node.id)
				//});
			},
			reset: function () {
				// TODO
			}

			//styleTabs: ['vw-panel-nodeEditor-tabs-styles', 'vw-panel-nodeEditor-tabs-effects', 'vw-panel-nodeEditor-tabs-behaviours'],
			//// Declare all variables
			//var i, tabcontent, tablinks;
			//// Get all elements with class="tabcontent" and hide them
			//tabcontent = document.getElementsByClassName("tabcontent");
			//for (i = 0; i < tabcontent.length; i++) {
			//	tabcontent[i].style.display = "none";
			//}
			//// Get all elements with class="tablinks" and remove the class "active"
			//tablinks = document.getElementsByClassName("tablinks");
			//for (i = 0; i < tablinks.length; i++) {
			//	tablinks[i].className = tablinks[i].className.replace(" active", "");
			//}
			//// Show the current tab, and add an "active" class to the button that opened the tab
			//document.getElementById(cityName).style.display = "block";
			//evt.currentTarget.className += " active";
		}
	}
})

function addToConfig(isActive, config, newConfig){
    if (!isActive)
      return config;
    return $.extend(true, {}, config, newConfig);
}
    
//    var inConfig = config;
//    for (var i = 0; i < configElements; i++){
//      inConfig = config[configElements];
//    }
//    inConfig = newValue;
//}

function ShowInfoModal() {
	var nodeFlyout = document.getElementById('InfoModal');
	nodeFlyout.showModal();
}
function CloseInfoModal() {
	var nodeFlyout = document.getElementById('InfoModal');
	nodeFlyout.close();
}


