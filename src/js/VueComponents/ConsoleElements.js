


// ================= NODE EDITOR ================= 

Vue.component('vw-panel-nodeEditor',{
  props: ['tabsprop'],
  template: `

		<div class='modPanel' id='nodeEditor'>
			<div class="panelHead">Node Type Editor<i class ="glyphicon glyphicon-menu-hamburger pull-right"></i></div>

			<div class ="tab">
			  <button class ="tablinks" v-on:click="tabsprop.selectedMatchingTab='NEW'" v-bind:class="{ active: tabsprop.selectedMatchingTab==='NEW'}">Match</button>
			</div>
			<div>
				<vw-panel-nodeEditor-matching v-show="tabsprop.selectedMatchingTab==='NEW'" v-bind:tabs="tabsprop"></vw-panel-nodeEditor-matching>
			</div>

			<div class ="tab">
			  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab='STYLES'" v-bind:class="{ active: tabsprop.selectedStyleTab==='STYLES'}">Style</button>
			  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab='EFFECTS'" v-bind:class="{ active: tabsprop.selectedStyleTab==='EFFECTS'}">Effects</button>
			  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab='BEHAVIOURS'" v-bind:class="{ active: tabsprop.selectedStyleTab==='BEHAVIOURS'}">Binding</button>
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


Vue.component('vw-panel-nodeEditor-matching',{
  props: ['tabs'],
  template: `
		<div class ="tabcontent">

      <label class="canCheck"
        v-on:click="(tabs.newMatching.bExistingConfig=false); (tabs.newMatching.selectedConfig=null)"
        v-bind:class="{ active: tabs.newMatching.bExistingConfig }">Existing Config:</label>
      <select class ="fullbox" v-model='tabs.newMatching.selectedConfig'
          v-bind:class="{ active: tabs.newMatching.bExistingConfig }"
          v-on:change="tabs.selectExisting(tabs.newMatching.selectedConfig); tabs.newMatching.bExistingConfig=true">
				<option v-for="config in tabs.newMatching.masterEntityConfigs" v-bind:value="config">{{config.configName}}</option>
			</select>



      <label class="active">Node type of: </label>
			<input class="active" v-model.lazy='tabs.newMatching.selectedNodeType' v-bind:value="tabs.newMatching.selectedNodeType"></input>

      <label v-bind:class="{ active: tabs.newMatching.bHasProperties }">With properties:
        <span v-on:click="tabs.newMatching.addProperty(); tabs.newMatching.bHasProperties=true;" class ="btn btn-sm"><i class ="glyphicon glyphicon-plus"></i></span>
      </label>

			<hr/>
			<table>
				<th><label>Name  </label></th>
				<th><label>Value </label></th>
				<tr v-for="property in tabs.newMatching.properties">
					<td><input v-bind="property.key" class="halfbox" v-bind:class="{ active: tabs.newMatching.bHasProperties }"></input></td>
					<td><input v-bind="property.value" class ="halfbox" v-bind:class="{ active: tabs.newMatching.bHasProperties }"></input></td>
				</tr>
			</table>
		</div>
		`
})
Vue.component('vw-panel-nodeEditor-existing',{
  props: ['tabs'],
  template: `
		<div class ="tabcontent">

    	<table class="table">
				<tr>
					<td><label class="canCheck active">Config:</label></td>
					<td>
			      <select class ="pull-right active" v-model='tabs.existingMatching.selectedConfig'
                v-on:change="tabs.selectExisting(tabs.existingMatching.selectedConfig)">
				      <option v-for="config in tabs.existingMatching.masterEntityConfigs" v-bind:value="config">
                {{config.configName}}
              </option>
			      </select>
  	      </td>
        </tr>
      </table>

    </div>
		`
})

Vue.component('vw-panel-nodeEditor-styles',{
  props: ['styles'],
  template: `
		<div class ="tabcontent">

			<table class="table">
				<tr>
					<td>
            <label class="canCheck"
              v-on:click="(styles.bNodeColor=!styles.bNodeColor)"
              v-bind:class="{ active: styles.bNodeColor }">Background Col:</label></td>
					<td>
						<input type="color" class="tinybox pull-right"
              v-bind:class="{ active: styles.bNodeColor }"
							v-model.lazy="styles.selectedNodeColor"
							v-on:change="styles.updateNodeBackgroundColor(); styles.bNodeColor=true">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeBorderColor=!styles.bNodeBorderColor)"
              v-bind:class="{ active: styles.bNodeBorderColor }">Border Color:</label></td>
					<td>
						<input type="color" class ="tinybox pull-right"
              v-bind:class="{ active: styles.bNodeBorderColor }"
							v-model.lazy="styles.selectedNodeBorderColor"
							v-on:change="styles.updateNodeBorderColor(); styles.bNodeBorderColor=true">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeTextColor=!styles.bNodeTextColor)"
              v-bind:class="{ active: styles.bNodeTextColor }">Text Color:</label></td>
					<td>
						<input type="color" class="tinybox pull-right"
              v-bind:class="{ active: styles.bNodeTextColor }"
							v-model.lazy="styles.selectedNodeTextColor"
							v-on:change="styles.updateNodeTextColor(); styles.bNodeTextColor=true">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeCircleTextColor=!styles.bNodeCircleTextColor)"
              v-bind:class="{ active: styles.bNodeCircleTextColor }">Circle Text Color: </label></td>
					<td>
						<input type="color" class="tinybox pull-right"
              v-bind:class="{ active: styles.bNodeCircleTextColor }"
							v-model.lazy="styles.selectedNodeCircleTextColor"
							v-on:change="styles.updateNodeCircleTextColor(); styles.bNodeCircleTextColor=true">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeSize=!styles.bNodeSize)"
              v-bind:class="{ active: styles.bNodeSize }">Size: </label></td>
					<td>
						<input class ="tinybox pull-right" type="number" value="25"
              v-bind:class="{ active: styles.bNodeSize }"
							v-model.lazy='styles.selectedNodeSize'
							v-on:change="styles.updateNodeSize(styles.selectedNodeSize); styles.bNodeSize=true">
						</input>
					</td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(styles.bNodeShape=!styles.bNodeShape)"
              v-bind:class="{ active: styles.bNodeShape }">Shape: </label></td>
					<td>
						<select class ="pull-right"
              v-bind:class="{ active: styles.bNodeShape }"
							v-model='styles.selectedNodeShape'
							v-on:change="styles.updateNodeShape(); styles.bNodeShape=true">>
							<option v-for="shape in styles.shapes" v-bind:value="shape.value">{{shape.key}}</option>
						</select>
					</td>
				</tr>
			</table>
			<label class="canCheck"
        v-on:click="(styles.bNodeImageUrl=!styles.bNodeImageUrl)"
        v-bind:class="{ active: styles.bNodeImageUrl }">Image URL: </label>
			<input
        v-bind:class="{ active: styles.bNodeImageUrl }"
				v-model.lazy='styles.selectedNodeImageUrl'
				v-on:change="styles.updateNodeImage(styles.selectedNodeImageUrl); styles.bNodeImageUrl=true">
			</input>
		</div>
		`
})
Vue.component('vw-panel-nodeEditor-effects',{
  props: ['effects'],
  template: `
		<div class ="tabcontent">
			<table class ="table">
				<tr>
					<td><label class="canCheck"
              v-on:click="(effects.activateEffectHaze=!effects.activateEffectHaze)"
              v-bind:class="{ active: effects.activateEffectHaze }">Haze: </label></td>
					<td><input type="checkbox" v-model="effects.hasEffectHaze" v-on:change="effects.activateEffectHaze=true" value="false" v-bind:class="{ active: effects.activateEffectHaze }"></input></td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(effects.activateEffectShadow=!effects.activateEffectShadow)"
              v-bind:class="{ active: effects.activateEffectShadow }">Shadow: </label></td>
					<td><input type="checkbox" v-model="effects.hasEffectShadow" v-on:change="effects.activateEffectShadow=true" value="false" v-bind:class="{ active: effects.activateEffectShadow }"></input></td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(effects.activateEffectGlass=!effects.activateEffectGlass)"
              v-bind:class="{ active: effects.activateEffectGlass }">Glass: </label></td>
					<td><input type="checkbox" v-model="effects.hasEffectGlass" v-on:change="effects.activateEffectGlass=true" value="false" v-bind:class="{ active: effects.activateEffectGlass }"></input></td>
				</tr>
				<tr>
					<td><label class="canCheck"
              v-on:click="(effects.activateEffectRounded=!effects.activateEffectRounded)"
              v-bind:class="{ active: effects.activateEffectRounded }">Rounded: </label></td>
					<td><input type="checkbox" v-model="effects.hasEffectRounded" v-on:change="effects.activateEffectRounded=true" value="false" v-bind:class="{ active: effects.activateEffectRounded }"></input></td>
				</tr>

			</table>
		</div>
		`
})
Vue.component('vw-panel-nodeEditor-behaviours',{
  props: ['behaviours'],
  template: `
		<div class ="tabcontent">

      <label class="canCheck" v-on:click="(behaviours.bDisplayText=!behaviours.bDisplayText)" v-bind:class="{ active: behaviours.bDisplayText }"> Center text: </label>
      <table>
        <tr>
          <td>
            <select class ="halfbox pull-right"
                v-model="behaviours.selectedDisplayTextType"
                v-bind:class="{ active: behaviours.bDisplayText }"
                v-on:change="behaviours.bDisplayText=true">
              <option v-for="type in ['type','property','static','first']" v-bind:value="type">
                {{type}}
              </option>
            </select>
          </td>
          <td> <input class ="halfbox pull-right" v-model="behaviours.selectedDisplayField" v-bind:class="{ active: behaviours.bDisplayText }"></input> </td>
        </tr>
      </table>

      <label class="canCheck" v-on:click="(behaviours.bDisplayImage=!behaviours.bDisplayImage)" v-bind:class="{ active: behaviours.bDisplayImage }"> Image URL: </label>
      <table>
        <tr>
          <td>
            <select class ="halfbox pull-right"
                v-model="behaviours.selectedNodeImageType"
                v-bind:class="{ active: behaviours.bDisplayImage }"
                v-on:change="behaviours.bDisplayImage=true">
              <option v-for="type in ['property','static']" v-bind:value="type">
                {{type}}
              </option>
            </select>
          </td>
          <td> <input class ="halfbox pull-right" v-model="behaviours.selectedNodeImageValue" v-bind:class="{ active: behaviours.bDisplayImage }"></input> </td>
        </tr>
      </table>


			<hr>

		</div>
		`
})



// ================= SIDEBARS & TOPBARS & GRAPH ================= 

Vue.component('vw-graph',{
  template:
        `
		<div id='graphPanel'>
			<div id='graphContainer'></div>
		</div>
		`
})

Vue.component('vw-panel',{
  template: ``
})


Vue.component('vw-topbar',{
  template:
`
	<div id='topBar' class="topbar-shadow">
	</div>
`
})

Vue.component('vw-secondbar',{
  template:
`
	<div id='secondBar'>
        <vw-formula-box></vw-formula-box>
	</div>
`
})

Vue.component('vw-left-sidebar',{
  template: `
		<div id='leftColumn' class ="flexcroll">
		</div>
		`
})

Vue.component('vw-right-sidebar',{
  props: ['tabs'],
  template: `
		<div id='rightColumn' class ="flexcroll">
			<vw-panel-nodeEditor v-bind:tabsprop="tabs"></vw-panel-nodeEditor>
		</div>
		`
})

// ================= INFO MODAL ================= 

Vue.component('vw-info-modal',{
  props: {
    modalId: {type: String},
    canCancel:{type: Boolean, default:true},
    strHeader: {type: String}, 
    htmlContent: {type: String}, 
    button1Caption: {type: String},
    button1Function: {type: String},
    button2Caption: {type: String},
    button2Function: {type: String}
  },
  template:
	`
	<dialog class="inputModal" v-bind:id="modalId">
    <button v-if='canCancel' onclick='CloseGlobalInfoModal(this.parentElement.id)' class="pull-right">&times;</button>
		<form class="form-group"> 
			<h2>{{ strHeader }}</h2>
			<div class="inputModal modalContent flexcroll"
				v-html="htmlContent">
			</div>
      <button v-show='button1Caption' v-on:click="button1Function||null" class="pull-right">{{ button1Caption }}</button>
      <button v-show='button2Caption' v-on:click="button2Function||null" class="pull-right">{{ button2Caption }}</button>
		</form>
	</dialog>
	`
})

// ================= MODE INDICTAOR ================= 
Vue.component('vw-mode-indicator',{
  props: ['indicatorprop'],
  template: `
        <div id='modeIndicator'>
            <img :src="indicatorprop.image" class ="modeIndicatorImage"/>
            <span class ="modeIndicatorLabel">{{indicatorprop.title}}</span>
        </div>
		`
})

// ================= FORMULA BOX ================= 
Vue.component('vw-formula-box',{
  props: ['formulaprop'],
  template: `
        <div id='formulaBox'>
            
            
            <table>
                <tr>
                    <td>
						        <label for="txtFormulaInput">Formula</label>
                                <input class="dynamic3" id="txtFormulaInput"
							        v-on:keyup.enter="formulaprop.executeFormula()"
							        v-model='formulaprop.formulaValue'>
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
						        <select class="halfbox" id="cboFormulaExamples" name="formulaExample"
							        v-model="formulaprop.selectedExample"
							        v-on:change="formulaprop.executeExampleFormula()"
							        ><option
								        v-for="example in formulaprop.currentTranslator.Examples"
								        v-bind:value="example"
							        >{{example}}</option>
						        </select>
					        </td>

                  <td v-show="(formulaprop.currentTranslator.ImportExamples && formulaprop.currentTranslator.ImportExamples.length>0)">
                  <label for="cboFormulaImports">Imports</label>
						        <select id="cboFormulaImports"
							        v-model="formulaprop.selectedImport"
							        v-on:change="formulaprop.importFromUrl(formulaprop.selectedImport.value)"
							        ><option
								        v-for="importExample in formulaprop.currentTranslator.ImportExamples"
								        v-bind:value="importExample"
							        >{{importExample.name}}</option>
						        </select>
					        </td>

					        <td>
						        <label for="cmdInfo">&nbsp</label>
						        <div>
							        <button id="cmdInfo"
								        onclick="ShowGlobalInfoModal('TranslatorInfo')"
							        ><i class ="glyphicon glyphicon-question-sign"></i></button>
						        </div>
                  </td>

                  <td>
						        <label for="cmdTest">&nbsp</label>
						        <div>
							        <button id="cmdTest" onclick="ShowGlobalInfoModal('WaitingModal1')">Test</button>
						        </div>
                  </td>
                </tr>
            </table>
            <vw-info-modal 
              modalId='TranslatorInfo' 
              v-bind:canCancel='true' 
              v-bind:strHeader='formulaprop.currentTranslator.Name' 
              v-bind:htmlContent=formulaprop.currentTranslator.ReferenceContent>
            </vw-info-modal>
            <vw-info-modal modalId='WaitingModal1' v-bind:canCancel='false' strHeader='Loading' htmlContent='Please wait...'></vw-info-modal>
        </div>
		`
})

var consoleApp=new Vue({
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
				new JsonTranslator(),
        new UrlParamsTranslator()
      ],
      selectedTranslatorName: new SimpleTranslator().Name,
      currentTranslator: new SimpleTranslator(),
      selectedExample: "",
      selectedImport: null,
      selectTranslator: function(value) {
        var currentScope=this;
        this.translators.forEach(function(trans) {
          if(trans.Name===value) {
            currentScope.currentTranslator=trans;
            currentScope.selectedTranslatorName=trans.Name;
            console.log('translator', currentScope.currentTranslator);
            return;
          }
        });
      },
      executeFormula: function() {
        var translator=this.currentTranslator;
        translator.Translate(this.formulaValue);
        this.formulaValue="";
      },
      executeExampleFormula: function() {
        var translator=this.currentTranslator;
        translator.Translate(this.selectedExample);
      },

      // Info model
      infoModal: {
        showModal: false
      },
      showInfoModal: function(heading, content, buttons) {
        this.modalHeader=this.currentTranslator.Name;
        this.modalContent=this.currentTranslator.ReferenceContent;
        this.modalButtonCaption="Close";
        ShowGlobalInfoModal('TranslatorInfo');
      },
      closeInfoModal: function() {
        CloseInfoModal();
      },
      importFromUrl(url) {
        ShowGlobalInfoModal('WaitingModal1')
        console.log('IMPORTING...');
        var translator=this.currentTranslator;
        var httpClient=new HttpClient();
        //httpClient.get('http://en.wikipedia.org/api/rest_v1/feed/featured/2000/03/15', function (response) {
        //var URL = 'http://en.wikipedia.org/api/rest_v1/feed/featured/' + 2000 + '/'+ ("0" + (new Date().getMonth() + 1)).slice(-2)+'/'+ ("0" + (new Date().getDate())).slice(-2);
        var finalUrl = url;
        finalUrl = finalUrl.replace('$day', ("0" + (new Date().getDate())).slice(-2));
        finalUrl = finalUrl.replace('$month', ("0" + (new Date().getMonth() + 1)).slice(-2));
        finalUrl = finalUrl.replace('$year', 2000);

        console.log('URL',finalUrl);
        httpClient.get(finalUrl,function(response) {
          console.log('response',response);
          translator.Translate(response);
          CloseGlobalInfoModal('WaitingModal1')
        });
      }
    },
    tabs: {
      // Matching Tabs...
      selectedMatchingTab: 'NEW',
      newMatching: {
        bExistingConfig: null,
        selectedConfig: null,
        masterEntityConfigs: [],

        selectedNodeType: '',

        bHasProperties: false,
        properties: [],
        addProperty: function() {
          this.properties.push({ key: '',value: '' });
        },


      },
      existingMatching: {

      },
      selectExisting: function(selectedConfig) {
        var jsonHelper=new JsonHelper();
        //debugger;
        this.styles.selectedNodeColor=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/background-color")||null;
        this.styles.bNodeColor=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/background-color")?true:false;
        
        this.styles.selectedNodeBorderColor=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/border-color")||null;
        this.styles.bNodeBorderColor=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/border-color")?true:false;
        
        this.styles.selectedNodeTextColor=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/labelText/color")||null;
        this.styles.bNodeTextColor=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/labelText/color")?true:false;
        
        this.styles.selectedNodeCircleTextColor=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/circleText/color")||null;
        this.styles.bNodeCircleTextColor=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/circleText/color")?true:false;
        
        this.styles.selectedNodeSize=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/radius")||null;
        this.styles.bNodeSize=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/radius")?true:false;
        
        this.styles.selectedNodeShape=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/shape")||null;
        this.styles.bNodeShape=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/shape")?true:false;
        
        this.styles.selectedNodeImageUrl=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/img/url")||null;
        this.styles.bNodeImageUrl=jsonHelper.GetValueWithPath(selectedConfig,"config/attributes/img/url")?true:false;

        this.newMatching.selectedNodeType=jsonHelper.GetValueWithPath(selectedConfig,"matchEntity/labels[0]")||null;
        var properties=jsonHelper.GetValueWithPath(selectedConfig,"matchEntity/properties");
        this.newMatching.bHasProperties=false;
        this.newMatching.properties=[];
        if(properties) {
          this.newMatching.bHasProperties=true;
          for(var keyName in properties)
            this.newMatching.properties.push({ "key": keyName,"value": properties[keyName] });
        }

      },
      // Style tabs...
      selectedStyleTab: `STYLES`,
      styles: {
        bNodeColor: false,
        bNodeBorderColor: false,
        bNodeTextColor: false,
        bNodeCircleTextColor: false,
        bNodeSize: false,
        bNodeShape: false,
        bNodeImageUrl: false,

        selectedNodeColor: null,
        selectedNodeBorderColor: null,
        selectedNodeTextColor: null,
        selectedNodeCircleTextColor: null,
        selectedNodeShape: 'circle',
        selectedNodeSize: 25,
        selectedNodeImageUrl: null,
        //shapes: [{ key: 'circle', value: 'circle' }, { key: 'rectangle', value: "rect" }, { key: 'triangle', value: "path" }],
        shapes: [{ key: 'circle',value: 'circle' }],
        updateNodeBackgroundColor: function() {
          this.bNodeColor=true;
          console.log('this.selectedNodeColor',this.selectedNodeColor);
          if(globals.selectedNode)
            globals.selectedNode.data.UI.bodyUI.attributes["fill"].nodeValue=this.selectedNodeColor;
        },
        updateNodeBorderColor: function() {
          if(globals.selectedNode)
            globals.selectedNode.data.UI.bodyUI.attributes["stroke"].nodeValue=this.selectedNodeBorderColor;
        },
        updateNodeTextColor: function() {
          if(globals.selectedNode)
            globals.selectedNode.data.UI.displayTextUI.attributes["fill"].nodeValue=this.selectedNodeTextColor;
        },
        updateNodeCircleTextColor: function() {
          if(globals.selectedNode)
            globals.selectedNode.data.UI.circleText.attributes["fill"].nodeValue=this.selectedNodeCircleTextColor;
        },
        updateNodeSize: function(size) {
          if(globals.selectedNode)
            globals.selectedNode.data.UI.bodyUI.attributes["r"].nodeValue=size;
        },
        updateNodeShape: function() {
          if(globals.selectedNode)
            globals.selectedNode.data.UI.bodyUI.nodeName=this.selectedNodeShape;
        },
        updateNodeImage: function(URL) {
          if(globals.selectedNode)
            globals.selectedNode.data.UI.imageUI.href.baseVal=URL;
        },

      },
      effects: {
        activateEffectHaze: false,
        activateEffectShadow: false,
        activateEffectGlass: false,
        activateEffectRounded: false,

        hasEffectHaze: null,
        hasEffectShadow: null,
        hasEffectGlass: null,
        hasEffectRounded: null,
      },
      behaviours: {
        bDisplayText: false,
        selectedDisplayTextType: null,
        selectedDisplayField: null,

        bDisplayImage: false,
        selectedNodeImageType: null,
        selectedNodeImageValue: null
      },
      saveMatch: function() {
        console.log('Saving...');
        var configHelper=new ConfigHelper();

        var tempConfig={
          configName: (this.selectedMatchingTab==='NEW')?this.newMatching.selectedNodeType:this.existingMatching.selectedConfig,
          configType: "entity",
          matchEntity: {
            "labels": [this.newMatching.selectedNodeType],
          },
          config: {}
        };
        // Add properties to matching criteria...
        for(var i=0;i<this.newMatching.properties.length;i++) {
          var property=this.newMatching.properties[i];
          if(!tempConfig.matchEntity.properties)
            tempConfig.matchEntity.properties={};
          if(property.key&&property.value)
            tempConfig.matchEntity.properties[property.key]=property.value;
        }

        var s=this.styles;
        tempConfig=addToConfig(s.bNodeColor,tempConfig,{ "config": { "attributes": { "background-color": s.selectedNodeColor } } });
        tempConfig=addToConfig(s.bNodeBorderColor,tempConfig,{ "config": { "attributes": { "border-color": s.selectedNodeBorderColor } } });
        tempConfig=addToConfig(s.bNodeShape,tempConfig,{ "config": { "attributes": { "shape": s.selectedNodeShape } } });
        tempConfig=addToConfig(s.bNodeSize,tempConfig,{ "config": { "attributes": { "radius": s.selectedNodeSize } } });
        tempConfig=addToConfig(s.bNodeTextColor,tempConfig,{ "config": { "attributes": { "labelText": { "color": s.selectedNodeTextColor } } } });
        tempConfig=addToConfig(s.bNodeCircleTextColor,tempConfig,{ "config": { "attributes": { "circleText": { "color": s.selectedNodeCircleTextColor } } } });
        tempConfig=addToConfig(s.bNodeImageUrl,tempConfig,{ config: { attributes: { "img": { "url": s.selectedNodeImageUrl } } } });

        var b=this.behaviours;
        tempConfig=addToConfig(b.bDisplayText,tempConfig,
          {
            "config": {
              "attributes": {
                "labelText": {
                  "displayData": { "key": b.selectedDisplayTextType,"value": b.selectedDisplayField }
                }
              }
            }
          });

        tempConfig=addToConfig(b.bDisplayImage,tempConfig,
          {
            "config": {
              "attributes": {
                "img": {
                  "displayData": { "key": b.selectedNodeImageType,"value": b.selectedNodeImageValue }
                }
              }
            }
          });
        // Save config...
        configHelper.AddOrUpdateDynamicEntityConfigReturnId(tempConfig.configName,tempConfig);
        alert('Config Saved "' + tempConfig.configName + '"')
      },

      reset: function() {
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

function addToConfig(isActive,config,newConfig) {
  console.log('isActive',isActive);
  if(!isActive)
    return config;
  var jsonHelper=new JsonHelper();
  //return $.extend(true, {}, config, newConfig);
  console.log('creating new config...')
  return jsonHelper.MergeJson(config,newConfig,"arrayId");
}

//    var inConfig = config;
//    for (var i = 0; i < configElements; i++){
//      inConfig = config[configElements];
//    }
//    inConfig = newValue;
//}

function ShowInfoModal() {
  var nodeFlyout=document.getElementById('InfoModal');
  nodeFlyout.showModal();
}
function CloseInfoModal() {
  var nodeFlyout=document.getElementById('InfoModal');
  nodeFlyout.close();
}

function ShowGlobalInfoModal(modalId) {
  var nodeFlyout=document.getElementById(modalId);
  nodeFlyout.showModal();
}
function CloseGlobalInfoModal(modalId) {
  var nodeFlyout=document.getElementById(modalId);
  nodeFlyout.close();
}

