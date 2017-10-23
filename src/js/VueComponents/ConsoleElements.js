
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

Vue.component('vw-panel-nodeEditor', {
	template: `
	<div class ='toolPanel' id='nodeEditor'>
		<div class ="panelHead">Node Editor</div>
		HELLO THERE
	</div>
	`
})

Vue.component('vw-right-sidebar', {
	template: `
		<div id='rightColumn' class ="flexcroll">
		</div>
		`
})

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

Vue.component('vw-mode-indicator', {
	props: ['indicatorprop'],
	template: `
        <div id='modeIndicator'>
            <img :src="indicatorprop.image" class ="modeIndicatorImage"/>
            <span class ="modeIndicatorLabel">{{indicatorprop.title}}</span>
        </div>
		`
})

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

                </tr>
            </table>
        </div>
		`
})

var consoleApp = new Vue({
	el: '#vue-app',
	data: {
		infoModal: {
			showModal: false
		},
		indicator: {
			title: "view",
			image: "../custom/assets/binoculars.svg"
		},
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
				var translator = new this.currentTranslator;
				translator.Translate(this.formulaValue);
				this.formulaValue = "";
			},
			executeExampleFormula: function () {
				var translator = this.currentTranslator;
				translator.Translate(this.selectedExample);
			},
			showInfoModal: function () {
				//console.log('MODAL', this.isInfoModalVisible);
				this.modalHeader = this.currentTranslator.Name;
				this.modalContent = this.currentTranslator.ReferenceContent;
				this.modalButtonCaption = "Close";
				ShowInfoModal();
				//this.isInfoModalVisible = true;
			},
			closeInfoModal: function () {
				//console.log('MODAL', this.isInfoModalVisible);
				CloseInfoModal();
				//this.isInfoModalVisible = true;
			},
			formulaParams: []
		}
	}
})


//globals.Translators = [
//	[
//				{
//					id: 1,
//					desc: "simple X->Y",
//					translator: SimpleTranslator,
//					examples: [
//						"x->y",
//						"Sam->John^->Bob",
//						"-->Product->3",
//						"Diana-MotherOf->William&Harry",
//						"Fe(name: Iron)",
//						"C(name: Carbon, weight: 12.011)",
//						"Oxygen->Hydrogen & Hydrogen"
//					],
//					referenceContent: `
//						Type any word to create a node, eg. <span class ="inputModal code">John</span>
//						<hr>
//						Create a node with some attributes, eg.
//							</br><span class ="inputModal code">John(age: 30, sex: male)</span>
//						<hr>
//						Create a relationship between two nodes:
//							</br><span class ="inputModal code">node1->node2</span>
//						<hr>
//						Link multiple nodes in a chain:
//							</br><span class ="inputModal code">n1->n2->n3->n4</span>
//						<hr>
//						Link multiple nodes to one node:
//							</br><span class ="inputModal code">n1->n2 & n3 & n4</span>
//						<hr>
//						Alternative relationship syntax: <span class ="inputModal code">--></span>
//						<hr>
//						Create relationship with a name: <span class ="inputModal code">-name-></span>
//						<hr>
//						Create relationship with a name and some attributes:
//							</br><span class ="inputModal code">-owns(since: 2010) -></span>
//						<hr>
//						Select the node using the caret symbol:
//							</br><span class ="inputModal code">node1->node2^</span>
//						<hr>
//					`,
//				},
//				{
//					id: 2,
//					desc: "Json 1",
//					translator: JsonTranslator,

//				}
//	],
//]

function ShowInfoModal() {
	var nodeFlyout = document.getElementById('InfoModal');
	nodeFlyout.showModal();
}
function CloseInfoModal() {
	var nodeFlyout = document.getElementById('InfoModal');
	nodeFlyout.close();
}


