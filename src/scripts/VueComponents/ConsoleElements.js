


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
					<td><input v-bind:value="property.key" class="halfbox" v-bind:class="{ active: tabs.newMatching.bHasProperties }"></input></td>
					<td><input v-bind:value="property.value" class ="halfbox" v-bind:class="{ active: tabs.newMatching.bHasProperties }"></input></td>
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

// ================= TOPBAR ================= 

Vue.component('vw-topbar',{
  props: ['topbar'],
  template:
`
	<div id='graphexTopBar'>
    <table>
      <tr>
        <td>
          <div class="logo">GRAPH<i class="glyphicon glyphicon-menu-hamburger"></i>X</div>
        </td>
        <td>
            <vw-dropdown-menu 
              v-for="item in topbar.items" 
              v-bind:name="item.caption" 
              v-bind:menuitems="item.items">
            </vw-dropdown-menu>
        </td>
      </tr>
      <!--<vw-mode-indicator v-bind:indicatorprop="topbar.indicator"></vw-mode-indicator>-->
    </table>
        
	</div>
`
})

Vue.component('vw-dropdown-menu',{
  props: ['name', 'menuitems'],
  template: `
    <span class="dropdown">
      <button class="dropbtn">{{name}}</button>
      <div class="dropdown-content">
        <a href="#" 
          v-for="item in menuitems"
          v-on:click="item.func()"
          >{{ item.caption }}</a>
      </div>
    </span>
		`
})


Vue.component('vw-panel-nodeSelector',{
  props: ['sysdata'],
  template: `
    <div class='modPanel' id='typeSelectors'>
			<div class="panelHead">Type Selector<i class ="glyphicon glyphicon-menu-hamburger pull-right"></i></div>
      
      <div class="labelSelectorDisplay flexcroll" id='labelSelectorsPanel'>
        <table class="labelSelectorText">
        
        <tr>
				    <td>
					    <div v-on:click="sysdata.highlightAllNodes()" class="labelSelectorItem"> 
                All &nbsp;
					    </div>
				    </td>
				    <td>
					    <div id="labelSelector.fetcher" 
                  class="forlabelselector mytooltip pull-right"
                  v-on:click="sysdata.getAllEntities()"
                  v-bind:style="{ 'background-color': 'gray' }">
						      &nbsp;
						    <div class="mytooltiptext ttleft ttupper">
							    Fetch all from database
						    </div>
					    </div>
				    </td>
			    </tr>

          <tr v-for="(selector, index) in sysdata.typeSelectors">
				    <td>
					    <div v-on:click="sysdata.highlightNodesByType(index)" class="labelSelectorItem"> 
                {{ selector.name }} &nbsp;
					    </div>
				    </td>
				    <td>
					    <div id="labelSelector.fetcher" 
                  class="forlabelselector mytooltip pull-right"
                  v-on:click="sysdata.getEntitiesByType(selector.name, index)"
                  v-bind:style="{ 'background-color': selector.color }">
						    {{ selector.instanceCount }}
						    <div class="mytooltiptext ttleft ttupper">
							    Fetch from database
						    </div>
					    </div>
				    </td>
			    </tr>
        </table>
	    </div>
    </div>
  `
})

// ================= BOTTOMBAR/FOOTER ================= 

Vue.component('vw-footer',{
  template:
`
	<div id='graphexFooter'>
        
	</div>
`
})

// ================= SIDEBARS & GRAPH ================= 

Vue.component('vw-graph',{
  template:
        `
		<div id='graphPanel'>
			<div id='graphContainer'></div>
		</div>
		`
})

Vue.component('vw-left-sidebar',{
  props: ['sysdata', 'panels'],
  template: `
      <div v-if="panels.nodeTypeSelector.show" id='leftSidebar' class ="flexcroll">
        <vw-panel-nodeSelector v-if="panels.nodeTypeSelector.show" v-bind:sysdata="sysdata"></vw-panel-nodeSelector>
      </div>
		`
})

Vue.component('vw-right-sidebar',{
  props: ['tabs', 'panels'],
  template: `
		<div v-if="panels.nodeTypeEditor.show" id='rightSidebar' class ="flexcroll">
        <vw-panel-nodeEditor v-if="panels.nodeTypeEditor.show" v-bind:tabsprop="tabs"></vw-panel-nodeEditor>
		</div>
		`
})



// ================= MODALS ================= 

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
	<dialog class="inputModal shadow" v-bind:id="modalId">
    <button v-if='canCancel' onclick='new VueConsoleHelper().CloseGlobalInfoModal(this.parentElement.id)' class="pull-right">&times;</button>
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

Vue.component('vw-modal-user-confirm',{
  props: ['modal'],
  template: `
	  <dialog class="inputModal shadow" id="UserConfirm">
      <button v-on:click="modal.ifCancelled()" class="pull-right">&times;</button>
		  <div class="form-group"> 
			  <h2>{{modal.header}}</h2>
			  <div class="inputModal modalContent flexcroll"
				  v-html="modal.content">
			  </div>
        
        <button v-on:click="modal.ifCancelled()" class="pull-right">Cancel</button>
        <button v-on:click="modal.ifConfirmed()" class="pull-right">Yes</button>
		  </div>
	  </dialog>
  `
})

Vue.component('vw-modal-info',{
  props: ['modal'],
  template: `
	  <dialog class="inputModal shadow" id="UserInfo">
      <button  onclick='new VueConsoleHelper().CloseGlobalInfoModal(this.parentElement.id)' class="pull-right">&times;</button>
		  <div class="form-group"> 
			  <h2>{{modal.header}}</h2>
			  <div class="inputModal modalContent flexcroll"
				  v-html="modal.content">
			  </div>
		  </div>
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
  props: ['formulaprop', 'panels'],
  template: `
        <div v-if="panels.formulaBar.show" id='formulaBox'>
            <table>
              <tr>
                <td>
						      <label for="txtFormulaInput">Formula</label>
                  <br/>
                  <input class="dynamic3" id="txtFormulaInput"
							      v-on:keyup.enter="formulaprop.executeFormula()"
							      v-model='formulaprop.formulaValue'
                    datalist="formulaHistory">
						      </input>
                  <datalist id="formulaHistory">
                    <option v-for="formula in formulaprop.formulaHistory" v-bind:value="formula.formula">{{formula.formula}}</option>
                  </datalist>
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
                    <br/>
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
                  <br/>
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
						      <br/>
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
						      <br/>
                  <div>
							      <button id="cmdInfo"
								      onclick="new VueConsoleHelper().ShowGlobalInfoModal('TranslatorInfo')"
							      ><i class ="glyphicon glyphicon-question-sign"></i></button>
						      </div>
                </td>

                <td>
						      <label for="cmdTest">&nbsp</label>
						      <br/>
                  <div>
							      <button id="cmdTest" v-on:click="formulaprop.generateLink()">Create Link</button>
						      </div>
                </td>

              </tr>
            </table>
            
            <vw-info-modal 
              modalId='TranslatorInfo' 
              v-bind:canCancel='true' 
              v-bind:strHeader='formulaprop.currentTranslator.Name' 
              v-bind:htmlContent='formulaprop.currentTranslator.ReferenceContent'>
            </vw-info-modal>
            
            <vw-info-modal modalId='GenerateLink' 
              strHeader='Formula link' 
              v-bind:htmlContent='formulaprop.generatedGraphLink'>
              button1Caption='Copy Link'
              v-bind:button1Function='formulaprop.copyLink(formulaprop.generatedGraphLink)'
            </vw-info-modal>
            
            <vw-info-modal modalId='WaitingModal1' 
              v-bind:canCancel='false' 
              strHeader='Loading' 
              htmlContent='Please wait...'>
            </vw-info-modal>
        </div>
		`
})

var consoleApp = new Vue({
  components: ['vw-panel-nodeEditor'],
  el: '#vue-app',
  data: {
    panels:{
      nodeTypeEditor: {show:false},
      nodeTypeSelector: {show:false},
      formulaBar:{show:true}
    },
    modals: {
      userConfirm:{
        header: "",
        content: "<p></p>",
        ifConfirmed: function(){},
        ifCancelled: function(){}
      },
      userInfo:{
        header: "",
        content: "<p></p>"
      }
    },
    systemData:{
      //totalEntityCount: 0,
      typeSelectors: [],
      getAllEntities: function(){
        new DataService().GetAllEntities();
      },
      getEntitiesByType:function(entityTypeName, index){
        new DataService().GetEntitiesByType(entityTypeName);
      },
      highlightAllNodes: function(){
        highlightLabel()
      },
      highlightNodesByType:function(index){
          highlightLabel(index);
      }
    },
    // PUBLIC
    refreshTypeSelectors: function(){
      //this.systemData.totalEntityCount++;
      this.systemData.typeSelectors = globals.labelsList;
    },
    selectNode: function(node){
      this.selectedNode = node;
      var nodeConfig = node.data.entityConfig.config;
      
      this.tabs.newMatching.selectedNodeType = node.data.labels[0];
      this.tabs.newMatching.properties = node.data.properties || [];
      
      this.tabs.styles.selectedNodeColor = nodeConfig.attributes["background-color"];
      this.tabs.styles.selectedNodeBorderColor = nodeConfig.attributes["border-color"];
      //debugger;
      this.tabs.styles.selectedNodeTextColor = nodeConfig.attributes.labelText["color"];
      this.tabs.styles.selectedNodeCircleTextColor = nodeConfig.attributes.circleText["color"];
      this.tabs.styles.selectedNodeShape = nodeConfig.attributes["shape"];
      this.tabs.styles.selectedNodeSize = nodeConfig.attributes["radius"];
      this.tabs.styles.selectedNodeImageUrl = nodeConfig.attributes.img["url"];

      this.tabs.effects.hasEffectHaze = nodeConfig.effects["haze"];
      this.tabs.effects.hasEffectShadow = nodeConfig.effects["shadow"];
      this.tabs.effects.hasEffectGlass = nodeConfig.effects["glass"];
      this.tabs.effects.hasEffectRounded = nodeConfig.effects["rounded"];

      this.tabs.behaviours.selectedDisplayTextType = nodeConfig.attributes.labelText.displayData["key"];
      this.tabs.behaviours.selectedDisplayField = nodeConfig.attributes.labelText.displayData["value"];;
      this.tabs.behaviours.selectedNodeImageType = nodeConfig.attributes.img.displayData["key"];
      this.tabs.behaviours.selectedNodeImageValue = nodeConfig.attributes.img.displayData["value"];;;

    },
    // PRIVATE
    selectedNode: null,
    topbar:{
      items: [
         {
           caption: "File", 
           items:[
            {
              caption: "Reset storage", 
              func: function(){new VueMenuHelper().ResetDatabase()}
            }
          ] 
         },
         {
           caption: "View", 
           items:[
              {
                caption: "Node Type Editor", 
                func: function(){consoleApp.panels.nodeTypeEditor.show = !consoleApp.panels.nodeTypeEditor.show}
              },
              {
                caption: "Node Type Selector", 
                func: function(){consoleApp.panels.nodeTypeSelector.show = !consoleApp.panels.nodeTypeSelector.show}
              },
              {
                caption: "Formula bar", 
                func: function(){consoleApp.panels.formulaBar.show = !consoleApp.panels.nodeTypeSelector.show}
              },
            ],
          },
          {
           caption: "Tools", 
           items:[
              {
                caption: "Unpin all", 
                func: function(){new VueMenuHelper().UnpinAll()}
              },
              {
                caption: "Arrange as tree", 
                func: function(){new VueMenuHelper().ArrangeNodes("bottom-to-top")}
              },
              {
                caption: "Arrange as list", 
                func: function(){new VueMenuHelper().ArrangeNodes("left-to-right")}
              },
              {
                caption: "Arrange as roots", 
                func: function(){new VueMenuHelper().ArrangeNodes("top-to-bottom")}
              },
              {
                caption: "Center graph", 
                func: function(){new VueMenuHelper().CenterGraph()}
              },
              {
                caption: "Clear stage", 
                func: function(){new VueMenuHelper().ClearStage()}
              }
            ],
          },
          {
           caption: "Help", 
           items:[
              {
                caption: "About", 
                func: function(){new VueMenuHelper().ShowAboutModal()}
              }
            ]
          }

        ],
      indicator: {
        title: "",
        image: "../custom/assets/binoculars.svg"
      }
    },

    // Formula toolbar
    formulaToolbar: {
      //modalHeader: "",
      //modalContent: "",
      //modalButtonCaption: "Close",

      formulaValue: "",
      formulaHistory: [],
      translators: [
				new SimpleTranslator(),
				new JsonTranslator(),
        new UrlParamsTranslator(),
        new ParseTreeTranslator()
      ],
      selectedTranslatorName: new SimpleTranslator().Name,
      currentTranslator: new SimpleTranslator(),
      selectedExample: (new SimpleTranslator().Examples && new SimpleTranslator().Examples.length > 0) ? ('example: ' + new SimpleTranslator().Examples[0]) : "",
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
        this.formulaHistory.push({"formula": this.formulaValue, "translator": this.currentTranslator});
        this.formulaValue="";
      },
      executeExampleFormula: function() {
        var translator=this.currentTranslator;
        translator.Translate(this.selectedExample);
      },
      importFromUrl(url) {
        new VueConsoleHelper().ShowGlobalInfoModal('WaitingModal1')
        console.log('IMPORTING...');
        var translator=this.currentTranslator;
        var httpClient=new HttpClient();
        var finalUrl = url;
        finalUrl = finalUrl.replace('$day', ("0" + (new Date().getDate())).slice(-2));
        finalUrl = finalUrl.replace('$month', ("0" + (new Date().getMonth() + 1)).slice(-2));
        finalUrl = finalUrl.replace('$year', 2000);
        console.log('URL',finalUrl);
        httpClient.get(finalUrl,function(response) {
          console.log('response',response);
          translator.Translate(response);
          new VueConsoleHelper().CloseGlobalInfoModal('WaitingModal1')
        });
      },
      generatedGraphLink:"", 
      generateLink: function(){
        var encodedFormula = new StringHelper().ReplaceEachOfCharSet(btoa(this.formulaValue), '+/=','._-');
        this.generatedGraphLink = "http://www.graphex.io/?trans='Simple'&grenc=" + encodedFormula;
        new VueConsoleHelper().ShowGlobalInfoModal('GenerateLink')
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

function VueMenuHelper(){
    this.ResetDatabase = function(){
      var consoleHelper = new VueConsoleHelper();
      consoleApp.modals.userConfirm.header = 'Are you sure?';
      consoleApp.modals.userConfirm.content = "This will remove all the data and settings that you've accumulated so far";
      consoleApp.modals.userConfirm.ifConfirmed = function(){
        consoleHelper.CloseGlobalInfoModal('UserConfirm');
        new DataService().DropDatabase();
        refreshEntitySelectors();
        consoleApp.refreshTypeSelectors();
        alert('Storage cleared');
      };
      consoleApp.modals.userConfirm.ifCancelled = function(){
        consoleHelper.CloseGlobalInfoModal('UserConfirm');
      };
      consoleHelper.ShowGlobalInfoModal('UserConfirm');
    }

  this.ArrangeNodes = function(_orientation){
    new SimpleArranger().Arrange(_orientation);
  }
  this.UnpinAll = function(){
    unPinAllNodes();
  }
  this.CenterGraph = function(){
    var browserHelper = new BrowserHelper();
    var size = browserHelper.GetWindowSize();
    globals.graphics.graphCenterChanged(size.width/2, size.height/2);
  }
  this.ShowAboutModal = function(){
    var header = "About";
    var content = `
        Hi there, we hope you are enjoying the use of this tool.
        It is still under development, but we welcome any suggestions that you may have.
        <br>If you would like to contact us for any reason, you can get hold of us at:
        <br><a href="mailto:suggest@graphex.io?Subject=I have a suggestion" target="_top">suggest@graphex.io</a>
    `;
    new VueConsoleHelper().ShowModal(header, content);
  }

  this.ClearStage = function(){
    var overflow = globals.nodeList.length + 1;;
    var counter = 0;
    while (globals.nodeList.length > 0 && ++counter < overflow){
			removeNodeFromGraph(globals.nodeList[0].id);
    }
    globals.labelsList = [];
    globals.nodeList = [];
    globals.checkedLinks = [];
    globals.checkedNodes = [];
    globals.monitoredLinks = [];
    globals.monitoredNodes = [];
    globals.animUpdateNodes = [];
    globals.animUpdateLinks = [];
    globals.bPlanRelate = false;
    globals.bRelate = false;
    globals.selectedLink = '';
    globals.selectedNode = '';
    globals.selectedNodeData = '';
    globals.selectedNodeID = '';
    globals.selectedNodeUI = '';
    globals.timeoutElements = [];
  }

  this.createFormulaFromGraph = function(){

  }
}


function VueConsoleHelper(){

  this.ShowModal = function(header, content){
      consoleApp.modals.userInfo.header = header;
      consoleApp.modals.userInfo.content = content;
      showGlobalInfoModal('UserInfo');
  }

  this.ShowGlobalInfoModal = function(modalId) {
    showGlobalInfoModal(modalId);
  }
  this.CloseGlobalInfoModal = function(modalId) {
    closeGlobalInfoModal(modalId);
  }

  function showGlobalInfoModal(modalId) {
    var dialogElement=document.getElementById(modalId);
    dialogElement.showModal();
  }
  function closeGlobalInfoModal(modalId) {
    var dialogElement=document.getElementById(modalId);
    dialogElement.close();
  }

  
}

