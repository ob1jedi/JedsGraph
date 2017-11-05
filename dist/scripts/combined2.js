function addToConfig(t,e,n){if(console.log("isActive",t),!t)return e;var l=new JsonHelper;return console.log("creating new config..."),l.MergeJson(e,n,"arrayId")}function ShowInfoModal(){document.getElementById("InfoModal").showModal()}function CloseInfoModal(){document.getElementById("InfoModal").close()}function ShowGlobalInfoModal(t){document.getElementById(t).showModal()}function CloseGlobalInfoModal(t){document.getElementById(t).close()}Vue.component("vw-panel-nodeEditor",{props:["tabsprop"],template:'\n\n\t\t<div class=\'modPanel\' id=\'nodeEditor\'>\n\t\t\t<div class="panelHead">Node Type Editor<i class ="glyphicon glyphicon-menu-hamburger pull-right"></i></div>\n\n\t\t\t<div class ="tab">\n\t\t\t  <button class ="tablinks" v-on:click="tabsprop.selectedMatchingTab=\'NEW\'" v-bind:class="{ active: tabsprop.selectedMatchingTab===\'NEW\'}">Match</button>\n\t\t\t</div>\n\t\t\t<div>\n\t\t\t\t<vw-panel-nodeEditor-matching v-show="tabsprop.selectedMatchingTab===\'NEW\'" v-bind:tabs="tabsprop"></vw-panel-nodeEditor-matching>\n\t\t\t</div>\n\n\t\t\t<div class ="tab">\n\t\t\t  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab=\'STYLES\'" v-bind:class="{ active: tabsprop.selectedStyleTab===\'STYLES\'}">Style</button>\n\t\t\t  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab=\'EFFECTS\'" v-bind:class="{ active: tabsprop.selectedStyleTab===\'EFFECTS\'}">Effects</button>\n\t\t\t  <button class ="tablinks" v-on:click="tabsprop.selectedStyleTab=\'BEHAVIOURS\'" v-bind:class="{ active: tabsprop.selectedStyleTab===\'BEHAVIOURS\'}">Binding</button>\n\t\t\t</div>\n\t\t\t<div>\n\t\t\t\t<vw-panel-nodeEditor-styles v-show="tabsprop.selectedStyleTab===\'STYLES\'" v-bind:styles="tabsprop.styles"></vw-panel-nodeEditor-styles>\n\t\t\t\t<vw-panel-nodeEditor-effects v-show="tabsprop.selectedStyleTab===\'EFFECTS\'" v-bind:effects="tabsprop.effects"></vw-panel-nodeEditor-effects>\n\t\t\t\t<vw-panel-nodeEditor-behaviours v-show="tabsprop.selectedStyleTab===\'BEHAVIOURS\'" v-bind:behaviours="tabsprop.behaviours"></vw-panel-nodeEditor-behaviours>\n\t\t\t</div>\n\n\t\t\t<div class ="tab">\n\t\t\t  <button class ="tablinks" v-on:click="tabsprop.saveMatch()">Save</button>\n\t\t\t  <button class ="tablinks" v-on:click="tabsprop.reset()">Reset</button>\n\t\t\t</div>\n\n\t\t\t\x3c!--<div class ="tabcontent">\n\t\t\t\t<vw-graph></vw-graph>\n\t\t\t</div>--\x3e\n\t\t</div>\n\n\t'}),Vue.component("vw-panel-nodeEditor-matching",{props:["tabs"],template:'\n\t\t<div class ="tabcontent">\n\n      <label class="canCheck"\n        v-on:click="(tabs.newMatching.bExistingConfig=false); (tabs.newMatching.selectedConfig=null)"\n        v-bind:class="{ active: tabs.newMatching.bExistingConfig }">Existing Config:</label>\n      <select class ="fullbox" v-model=\'tabs.newMatching.selectedConfig\'\n          v-bind:class="{ active: tabs.newMatching.bExistingConfig }"\n          v-on:change="tabs.selectExisting(tabs.newMatching.selectedConfig); tabs.newMatching.bExistingConfig=true">\n\t\t\t\t<option v-for="config in tabs.newMatching.masterEntityConfigs" v-bind:value="config">{{config.configName}}</option>\n\t\t\t</select>\n\n\n\n      <label class="active">Node type of: </label>\n\t\t\t<input class="active" v-model.lazy=\'tabs.newMatching.selectedNodeType\' v-bind:value="tabs.newMatching.selectedNodeType"></input>\n\n      <label v-bind:class="{ active: tabs.newMatching.bHasProperties }">With properties:\n        <span v-on:click="tabs.newMatching.addProperty(); tabs.newMatching.bHasProperties=true;" class ="btn btn-sm"><i class ="glyphicon glyphicon-plus"></i></span>\n      </label>\n\n\t\t\t<hr/>\n\t\t\t<table>\n\t\t\t\t<th><label>Name  </label></th>\n\t\t\t\t<th><label>Value </label></th>\n\t\t\t\t<tr v-for="property in tabs.newMatching.properties">\n\t\t\t\t\t<td><input v-bind="property.key" class="halfbox" v-bind:class="{ active: tabs.newMatching.bHasProperties }"></input></td>\n\t\t\t\t\t<td><input v-bind="property.value" class ="halfbox" v-bind:class="{ active: tabs.newMatching.bHasProperties }"></input></td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</div>\n\t\t'}),Vue.component("vw-panel-nodeEditor-existing",{props:["tabs"],template:'\n\t\t<div class ="tabcontent">\n\n    \t<table class="table">\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck active">Config:</label></td>\n\t\t\t\t\t<td>\n\t\t\t      <select class ="pull-right active" v-model=\'tabs.existingMatching.selectedConfig\'\n                v-on:change="tabs.selectExisting(tabs.existingMatching.selectedConfig)">\n\t\t\t\t      <option v-for="config in tabs.existingMatching.masterEntityConfigs" v-bind:value="config">\n                {{config.configName}}\n              </option>\n\t\t\t      </select>\n  \t      </td>\n        </tr>\n      </table>\n\n    </div>\n\t\t'}),Vue.component("vw-panel-nodeEditor-styles",{props:["styles"],template:'\n\t\t<div class ="tabcontent">\n\n\t\t\t<table class="table">\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n            <label class="canCheck"\n              v-on:click="(styles.bNodeColor=!styles.bNodeColor)"\n              v-bind:class="{ active: styles.bNodeColor }">Background Col:</label></td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input type="color" class="tinybox pull-right"\n              v-bind:class="{ active: styles.bNodeColor }"\n\t\t\t\t\t\t\tv-model.lazy="styles.selectedNodeColor"\n\t\t\t\t\t\t\tv-on:change="styles.updateNodeBackgroundColor(); styles.bNodeColor=true">\n\t\t\t\t\t\t</input>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(styles.bNodeBorderColor=!styles.bNodeBorderColor)"\n              v-bind:class="{ active: styles.bNodeBorderColor }">Border Color:</label></td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input type="color" class ="tinybox pull-right"\n              v-bind:class="{ active: styles.bNodeBorderColor }"\n\t\t\t\t\t\t\tv-model.lazy="styles.selectedNodeBorderColor"\n\t\t\t\t\t\t\tv-on:change="styles.updateNodeBorderColor(); styles.bNodeBorderColor=true">\n\t\t\t\t\t\t</input>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(styles.bNodeTextColor=!styles.bNodeTextColor)"\n              v-bind:class="{ active: styles.bNodeTextColor }">Text Color:</label></td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input type="color" class="tinybox pull-right"\n              v-bind:class="{ active: styles.bNodeTextColor }"\n\t\t\t\t\t\t\tv-model.lazy="styles.selectedNodeTextColor"\n\t\t\t\t\t\t\tv-on:change="styles.updateNodeTextColor(); styles.bNodeTextColor=true">\n\t\t\t\t\t\t</input>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(styles.bNodeCircleTextColor=!styles.bNodeCircleTextColor)"\n              v-bind:class="{ active: styles.bNodeCircleTextColor }">Circle Text Color: </label></td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input type="color" class="tinybox pull-right"\n              v-bind:class="{ active: styles.bNodeCircleTextColor }"\n\t\t\t\t\t\t\tv-model.lazy="styles.selectedNodeCircleTextColor"\n\t\t\t\t\t\t\tv-on:change="styles.updateNodeCircleTextColor(); styles.bNodeCircleTextColor=true">\n\t\t\t\t\t\t</input>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(styles.bNodeSize=!styles.bNodeSize)"\n              v-bind:class="{ active: styles.bNodeSize }">Size: </label></td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input class ="tinybox pull-right" type="number" value="25"\n              v-bind:class="{ active: styles.bNodeSize }"\n\t\t\t\t\t\t\tv-model.lazy=\'styles.selectedNodeSize\'\n\t\t\t\t\t\t\tv-on:change="styles.updateNodeSize(styles.selectedNodeSize); styles.bNodeSize=true">\n\t\t\t\t\t\t</input>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(styles.bNodeShape=!styles.bNodeShape)"\n              v-bind:class="{ active: styles.bNodeShape }">Shape: </label></td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<select class ="pull-right"\n              v-bind:class="{ active: styles.bNodeShape }"\n\t\t\t\t\t\t\tv-model=\'styles.selectedNodeShape\'\n\t\t\t\t\t\t\tv-on:change="styles.updateNodeShape(); styles.bNodeShape=true">>\n\t\t\t\t\t\t\t<option v-for="shape in styles.shapes" v-bind:value="shape.value">{{shape.key}}</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t\t<label class="canCheck"\n        v-on:click="(styles.bNodeImageUrl=!styles.bNodeImageUrl)"\n        v-bind:class="{ active: styles.bNodeImageUrl }">Image URL: </label>\n\t\t\t<input\n        v-bind:class="{ active: styles.bNodeImageUrl }"\n\t\t\t\tv-model.lazy=\'styles.selectedNodeImageUrl\'\n\t\t\t\tv-on:change="styles.updateNodeImage(styles.selectedNodeImageUrl); styles.bNodeImageUrl=true">\n\t\t\t</input>\n\t\t</div>\n\t\t'}),Vue.component("vw-panel-nodeEditor-effects",{props:["effects"],template:'\n\t\t<div class ="tabcontent">\n\t\t\t<table class ="table">\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(effects.activateEffectHaze=!effects.activateEffectHaze)"\n              v-bind:class="{ active: effects.activateEffectHaze }">Haze: </label></td>\n\t\t\t\t\t<td><input type="checkbox" v-model="effects.hasEffectHaze" v-on:change="effects.activateEffectHaze=true" value="false" v-bind:class="{ active: effects.activateEffectHaze }"></input></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(effects.activateEffectShadow=!effects.activateEffectShadow)"\n              v-bind:class="{ active: effects.activateEffectShadow }">Shadow: </label></td>\n\t\t\t\t\t<td><input type="checkbox" v-model="effects.hasEffectShadow" v-on:change="effects.activateEffectShadow=true" value="false" v-bind:class="{ active: effects.activateEffectShadow }"></input></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(effects.activateEffectGlass=!effects.activateEffectGlass)"\n              v-bind:class="{ active: effects.activateEffectGlass }">Glass: </label></td>\n\t\t\t\t\t<td><input type="checkbox" v-model="effects.hasEffectGlass" v-on:change="effects.activateEffectGlass=true" value="false" v-bind:class="{ active: effects.activateEffectGlass }"></input></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td><label class="canCheck"\n              v-on:click="(effects.activateEffectRounded=!effects.activateEffectRounded)"\n              v-bind:class="{ active: effects.activateEffectRounded }">Rounded: </label></td>\n\t\t\t\t\t<td><input type="checkbox" v-model="effects.hasEffectRounded" v-on:change="effects.activateEffectRounded=true" value="false" v-bind:class="{ active: effects.activateEffectRounded }"></input></td>\n\t\t\t\t</tr>\n\n\t\t\t</table>\n\t\t</div>\n\t\t'}),Vue.component("vw-panel-nodeEditor-behaviours",{props:["behaviours"],template:'\n\t\t<div class ="tabcontent">\n\n      <label class="canCheck" v-on:click="(behaviours.bDisplayText=!behaviours.bDisplayText)" v-bind:class="{ active: behaviours.bDisplayText }"> Center text: </label>\n      <table>\n        <tr>\n          <td>\n            <select class ="halfbox pull-right"\n                v-model="behaviours.selectedDisplayTextType"\n                v-bind:class="{ active: behaviours.bDisplayText }"\n                v-on:change="behaviours.bDisplayText=true">\n              <option v-for="type in [\'type\',\'property\',\'static\',\'first\']" v-bind:value="type">\n                {{type}}\n              </option>\n            </select>\n          </td>\n          <td> <input class ="halfbox pull-right" v-model="behaviours.selectedDisplayField" v-bind:class="{ active: behaviours.bDisplayText }"></input> </td>\n        </tr>\n      </table>\n\n      <label class="canCheck" v-on:click="(behaviours.bDisplayImage=!behaviours.bDisplayImage)" v-bind:class="{ active: behaviours.bDisplayImage }"> Image URL: </label>\n      <table>\n        <tr>\n          <td>\n            <select class ="halfbox pull-right"\n                v-model="behaviours.selectedNodeImageType"\n                v-bind:class="{ active: behaviours.bDisplayImage }"\n                v-on:change="behaviours.bDisplayImage=true">\n              <option v-for="type in [\'property\',\'static\']" v-bind:value="type">\n                {{type}}\n              </option>\n            </select>\n          </td>\n          <td> <input class ="halfbox pull-right" v-model="behaviours.selectedNodeImageValue" v-bind:class="{ active: behaviours.bDisplayImage }"></input> </td>\n        </tr>\n      </table>\n\n\n\t\t\t<hr>\n\n\t\t</div>\n\t\t'}),Vue.component("vw-graph",{template:"\n\t\t<div id='graphPanel'>\n\t\t\t<div id='graphContainer'></div>\n\t\t</div>\n\t\t"}),Vue.component("vw-panel",{template:""}),Vue.component("vw-topbar",{template:"\n\t<div id='topBar' class=\"topbar-shadow\">\n\t</div>\n"}),Vue.component("vw-secondbar",{template:"\n\t<div id='secondBar'>\n        <vw-formula-box></vw-formula-box>\n\t</div>\n"}),Vue.component("vw-left-sidebar",{template:"\n\t\t<div id='leftColumn' class =\"flexcroll\">\n\t\t</div>\n\t\t"}),Vue.component("vw-right-sidebar",{props:["tabs"],template:'\n\t\t<div id=\'rightColumn\' class ="flexcroll">\n\t\t\t<vw-panel-nodeEditor v-bind:tabsprop="tabs"></vw-panel-nodeEditor>\n\t\t</div>\n\t\t'}),Vue.component("vw-info-modal",{props:{modalId:{type:String},canCancel:{type:Boolean,default:!0},strHeader:{type:String},htmlContent:{type:String},button1Caption:{type:String},button1Function:{type:String},button2Caption:{type:String},button2Function:{type:String}},template:'\n\t<dialog class="inputModal" v-bind:id="modalId">\n    <button v-if=\'canCancel\' onclick=\'CloseGlobalInfoModal(this.parentElement.id)\' class="pull-right">&times;</button>\n\t\t<form class="form-group"> \n\t\t\t<h2>{{ strHeader }}</h2>\n\t\t\t<div class="inputModal modalContent flexcroll"\n\t\t\t\tv-html="htmlContent">\n\t\t\t</div>\n      <button v-show=\'button1Caption\' v-on:click="button1Function||null" class="pull-right">{{ button1Caption }}</button>\n      <button v-show=\'button2Caption\' v-on:click="button2Function||null" class="pull-right">{{ button2Caption }}</button>\n\t\t</form>\n\t</dialog>\n\t'}),Vue.component("vw-mode-indicator",{props:["indicatorprop"],template:'\n        <div id=\'modeIndicator\'>\n            <img :src="indicatorprop.image" class ="modeIndicatorImage"/>\n            <span class ="modeIndicatorLabel">{{indicatorprop.title}}</span>\n        </div>\n\t\t'}),Vue.component("vw-formula-box",{props:["formulaprop"],template:'\n        <div id=\'formulaBox\'>\n            <table>\n              <tr>\n                <td>\n\t\t\t\t\t\t      <label for="txtFormulaInput">Formula</label>\n                  <input class="dynamic3" id="txtFormulaInput"\n\t\t\t\t\t\t\t      v-on:keyup.enter="formulaprop.executeFormula()"\n\t\t\t\t\t\t\t      v-model=\'formulaprop.formulaValue\'\n                    datalist="formulaHistory">\n\t\t\t\t\t\t      </input>\n                  <datalist id="formulaHistory">\n                    <option v-for="formula in formulaprop.formulaHistory" v-bind:value="formula.formula">{{formula.formula}}</option>\n                  </datalist>\n                </td>\n                <td>\n\t\t\t\t\t\t      <label for="cmdFormulaGenerate">&nbsp</label>\n\t\t\t\t\t\t      <div>\n\t\t\t\t\t\t\t      <button class ="mybutton" id="cmdFormulaGenerate"\n\t\t\t\t\t\t\t\t      v-on:click="formulaprop.executeFormula(formulaprop.formulaValue)">\n\t\t\t\t\t\t\t\t      generate\n\t\t\t\t\t\t\t      </button>\n\t\t\t\t\t\t      </div>\n                </td>\n\t\t\t\t\t      <td>\n\t\t\t\t\t\t      <label for="cboFormulaTranslator">Translator</label>\n                    <select id="cboFormulaTranslator"\n\t\t\t\t\t\t\t      v-model="formulaprop.selectedTranslatorName"\n                    v-on:change="formulaprop.selectTranslator(formulaprop.selectedTranslatorName)"\n\t\t\t\t\t\t\t      ><option\n\t\t\t\t\t\t\t\t      v-for="item in formulaprop.translators"\n\t\t\t\t\t\t\t\t      v-bind:value="item.Name"\n\t\t\t\t\t\t\t\t      v-bind:key="item.Name"\n\t\t\t\t\t\t\t      >{{item.Name}}</option>\n\t\t\t\t\t\t      </select>\n                </td>\n\t\t\t\t\t      <td>\n\t\t\t\t\t\t      <label for="cboFormulaExamples">Examples</label>\n\t\t\t\t\t\t      <select class="halfbox" id="cboFormulaExamples" name="formulaExample"\n\t\t\t\t\t\t\t      v-model="formulaprop.selectedExample"\n\t\t\t\t\t\t\t      v-on:change="formulaprop.executeExampleFormula()"\n\t\t\t\t\t\t\t      ><option\n\t\t\t\t\t\t\t\t      v-for="example in formulaprop.currentTranslator.Examples"\n\t\t\t\t\t\t\t\t      v-bind:value="example"\n\t\t\t\t\t\t\t      >{{example}}</option>\n\t\t\t\t\t\t      </select>\n\t\t\t\t\t      </td>\n\n                <td v-show="(formulaprop.currentTranslator.ImportExamples && formulaprop.currentTranslator.ImportExamples.length>0)">\n                <label for="cboFormulaImports">Imports</label>\n\t\t\t\t\t\t      <select id="cboFormulaImports"\n\t\t\t\t\t\t\t      v-model="formulaprop.selectedImport"\n\t\t\t\t\t\t\t      v-on:change="formulaprop.importFromUrl(formulaprop.selectedImport.value)"\n\t\t\t\t\t\t\t      ><option\n\t\t\t\t\t\t\t\t      v-for="importExample in formulaprop.currentTranslator.ImportExamples"\n\t\t\t\t\t\t\t\t      v-bind:value="importExample"\n\t\t\t\t\t\t\t      >{{importExample.name}}</option>\n\t\t\t\t\t\t      </select>\n\t\t\t\t\t      </td>\n\n\t\t\t\t\t      <td>\n\t\t\t\t\t\t      <label for="cmdInfo">&nbsp</label>\n\t\t\t\t\t\t      <div>\n\t\t\t\t\t\t\t      <button id="cmdInfo"\n\t\t\t\t\t\t\t\t      onclick="ShowGlobalInfoModal(\'TranslatorInfo\')"\n\t\t\t\t\t\t\t      ><i class ="glyphicon glyphicon-question-sign"></i></button>\n\t\t\t\t\t\t      </div>\n                </td>\n\n                <td>\n\t\t\t\t\t\t      <label for="cmdTest">&nbsp</label>\n\t\t\t\t\t\t      <div>\n\t\t\t\t\t\t\t      <button id="cmdTest" v-on:click="formulaprop.generateLink()">Create Link</button>\n\t\t\t\t\t\t      </div>\n                </td>\n\n                \x3c!--<td>\n\t\t\t\t\t\t      <label>&nbsp</label>\n\t\t\t\t\t\t      <div>\n                    <a href="../../../html/help/formulas.html" target="_blank">Graphex</a>\n\t\t\t\t\t\t      </div>\n                </td>--\x3e\n\n              </tr>\n            </table>\n            \n            <vw-info-modal \n              modalId=\'TranslatorInfo\' \n              v-bind:canCancel=\'true\' \n              v-bind:strHeader=\'formulaprop.currentTranslator.Name\' \n              v-bind:htmlContent=\'formulaprop.currentTranslator.ReferenceContent\'>\n            </vw-info-modal>\n            \n            <vw-info-modal modalId=\'GenerateLink\' \n              strHeader=\'Formula link\' \n              v-bind:htmlContent=\'formulaprop.generatedGraphLink\'>\n              button1Caption=\'Copy Link\'\n              v-bind:button1Function=\'formulaprop.copyLink(formulaprop.generatedGraphLink)\'\n            </vw-info-modal>\n            \n            <vw-info-modal modalId=\'WaitingModal1\' \n              v-bind:canCancel=\'false\' \n              strHeader=\'Loading\' \n              htmlContent=\'Please wait...\'>\n            </vw-info-modal>\n        </div>\n\t\t'});var consoleApp=new Vue({components:["vw-panel-nodeEditor"],el:"#vue-app",data:{indicator:{title:"view",image:"../custom/assets/binoculars.svg"},formulaToolbar:{formulaValue:"",formulaHistory:[],translators:[new SimpleTranslator,new JsonTranslator,new UrlParamsTranslator],selectedTranslatorName:(new SimpleTranslator).Name,currentTranslator:new SimpleTranslator,selectedExample:(new SimpleTranslator).Examples&&(new SimpleTranslator).Examples.length>0?"example: "+(new SimpleTranslator).Examples[0]:"",selectedImport:null,selectTranslator:function(t){var e=this;this.translators.forEach(function(n){if(n.Name===t)return e.currentTranslator=n,e.selectedTranslatorName=n.Name,void console.log("translator",e.currentTranslator)})},executeFormula:function(){this.currentTranslator.Translate(this.formulaValue),this.formulaHistory.push({formula:this.formulaValue,translator:this.currentTranslator}),this.formulaValue=""},executeExampleFormula:function(){this.currentTranslator.Translate(this.selectedExample)},importFromUrl(t){ShowGlobalInfoModal("WaitingModal1"),console.log("IMPORTING...");var e=this.currentTranslator,n=new HttpClient,l=t;l=(l=(l=l.replace("$day",("0"+(new Date).getDate()).slice(-2))).replace("$month",("0"+((new Date).getMonth()+1)).slice(-2))).replace("$year",2e3),console.log("URL",l),n.get(l,function(t){console.log("response",t),e.Translate(t),CloseGlobalInfoModal("WaitingModal1")})},generatedGraphLink:"",generateLink:function(){var t=(new StringHelper).ReplaceEachOfCharSet(btoa(this.formulaValue),"+/=","._-");this.generatedGraphLink="http://www.graphex.io/?trans='Simple'&grenc="+t,ShowGlobalInfoModal("GenerateLink")}},tabs:{selectedMatchingTab:"NEW",newMatching:{bExistingConfig:null,selectedConfig:null,masterEntityConfigs:[],selectedNodeType:"",bHasProperties:!1,properties:[],addProperty:function(){this.properties.push({key:"",value:""})}},existingMatching:{},selectExisting:function(t){var e=new JsonHelper;this.styles.selectedNodeColor=e.GetValueWithPath(t,"config/attributes/background-color")||null,this.styles.bNodeColor=!!e.GetValueWithPath(t,"config/attributes/background-color"),this.styles.selectedNodeBorderColor=e.GetValueWithPath(t,"config/attributes/border-color")||null,this.styles.bNodeBorderColor=!!e.GetValueWithPath(t,"config/attributes/border-color"),this.styles.selectedNodeTextColor=e.GetValueWithPath(t,"config/attributes/labelText/color")||null,this.styles.bNodeTextColor=!!e.GetValueWithPath(t,"config/attributes/labelText/color"),this.styles.selectedNodeCircleTextColor=e.GetValueWithPath(t,"config/attributes/circleText/color")||null,this.styles.bNodeCircleTextColor=!!e.GetValueWithPath(t,"config/attributes/circleText/color"),this.styles.selectedNodeSize=e.GetValueWithPath(t,"config/attributes/radius")||null,this.styles.bNodeSize=!!e.GetValueWithPath(t,"config/attributes/radius"),this.styles.selectedNodeShape=e.GetValueWithPath(t,"config/attributes/shape")||null,this.styles.bNodeShape=!!e.GetValueWithPath(t,"config/attributes/shape"),this.styles.selectedNodeImageUrl=e.GetValueWithPath(t,"config/attributes/img/url")||null,this.styles.bNodeImageUrl=!!e.GetValueWithPath(t,"config/attributes/img/url"),this.newMatching.selectedNodeType=e.GetValueWithPath(t,"matchEntity/labels[0]")||null;var n=e.GetValueWithPath(t,"matchEntity/properties");if(this.newMatching.bHasProperties=!1,this.newMatching.properties=[],n){this.newMatching.bHasProperties=!0;for(var l in n)this.newMatching.properties.push({key:l,value:n[l]})}},selectedStyleTab:"STYLES",styles:{bNodeColor:!1,bNodeBorderColor:!1,bNodeTextColor:!1,bNodeCircleTextColor:!1,bNodeSize:!1,bNodeShape:!1,bNodeImageUrl:!1,selectedNodeColor:null,selectedNodeBorderColor:null,selectedNodeTextColor:null,selectedNodeCircleTextColor:null,selectedNodeShape:"circle",selectedNodeSize:25,selectedNodeImageUrl:null,shapes:[{key:"circle",value:"circle"}],updateNodeBackgroundColor:function(){this.bNodeColor=!0,console.log("this.selectedNodeColor",this.selectedNodeColor),globals.selectedNode&&(globals.selectedNode.data.UI.bodyUI.attributes.fill.nodeValue=this.selectedNodeColor)},updateNodeBorderColor:function(){globals.selectedNode&&(globals.selectedNode.data.UI.bodyUI.attributes.stroke.nodeValue=this.selectedNodeBorderColor)},updateNodeTextColor:function(){globals.selectedNode&&(globals.selectedNode.data.UI.displayTextUI.attributes.fill.nodeValue=this.selectedNodeTextColor)},updateNodeCircleTextColor:function(){globals.selectedNode&&(globals.selectedNode.data.UI.circleText.attributes.fill.nodeValue=this.selectedNodeCircleTextColor)},updateNodeSize:function(t){globals.selectedNode&&(globals.selectedNode.data.UI.bodyUI.attributes.r.nodeValue=t)},updateNodeShape:function(){globals.selectedNode&&(globals.selectedNode.data.UI.bodyUI.nodeName=this.selectedNodeShape)},updateNodeImage:function(t){globals.selectedNode&&(globals.selectedNode.data.UI.imageUI.href.baseVal=t)}},effects:{activateEffectHaze:!1,activateEffectShadow:!1,activateEffectGlass:!1,activateEffectRounded:!1,hasEffectHaze:null,hasEffectShadow:null,hasEffectGlass:null,hasEffectRounded:null},behaviours:{bDisplayText:!1,selectedDisplayTextType:null,selectedDisplayField:null,bDisplayImage:!1,selectedNodeImageType:null,selectedNodeImageValue:null},saveMatch:function(){console.log("Saving...");for(var t=new ConfigHelper,e={configName:"NEW"===this.selectedMatchingTab?this.newMatching.selectedNodeType:this.existingMatching.selectedConfig,configType:"entity",matchEntity:{labels:[this.newMatching.selectedNodeType]},config:{}},n=0;n<this.newMatching.properties.length;n++){var l=this.newMatching.properties[n];e.matchEntity.properties||(e.matchEntity.properties={}),l.key&&l.value&&(e.matchEntity.properties[l.key]=l.value)}var a=this.styles;e=addToConfig(a.bNodeColor,e,{config:{attributes:{"background-color":a.selectedNodeColor}}}),e=addToConfig(a.bNodeBorderColor,e,{config:{attributes:{"border-color":a.selectedNodeBorderColor}}}),e=addToConfig(a.bNodeShape,e,{config:{attributes:{shape:a.selectedNodeShape}}}),e=addToConfig(a.bNodeSize,e,{config:{attributes:{radius:a.selectedNodeSize}}}),e=addToConfig(a.bNodeTextColor,e,{config:{attributes:{labelText:{color:a.selectedNodeTextColor}}}}),e=addToConfig(a.bNodeCircleTextColor,e,{config:{attributes:{circleText:{color:a.selectedNodeCircleTextColor}}}}),e=addToConfig(a.bNodeImageUrl,e,{config:{attributes:{img:{url:a.selectedNodeImageUrl}}}});var o=this.behaviours;e=addToConfig(o.bDisplayText,e,{config:{attributes:{labelText:{displayData:{key:o.selectedDisplayTextType,value:o.selectedDisplayField}}}}}),e=addToConfig(o.bDisplayImage,e,{config:{attributes:{img:{displayData:{key:o.selectedNodeImageType,value:o.selectedNodeImageValue}}}}}),t.AddOrUpdateDynamicEntityConfigReturnId(e.configName,e),alert('Config Saved "'+e.configName+'"')},reset:function(){}}}});