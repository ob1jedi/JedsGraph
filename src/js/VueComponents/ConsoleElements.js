
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
			<vw-panel-nodeEditor></vw-panel-nodeEditor>
		</div>
		`
})

Vue.component('vw-panel-nodeEditor', {
	template: `
	<div class ='modPanel' id='nodeEditor'>
		<div class ="panelHead">Style Editor<i class ="glyphicon glyphicon-menu-hamburger pull-right"></i></div>
		<div>
			<div>Matching Criteria</div>
			<label>Entity Type: </label><input></input>
			<div>Properties: </div>
			<label>Property Name: </label><input></input>
			<label>Property Value: </label><input></input>
			<label>Formula: </label><input></input>
			<label>Translator: </label><input></input>
			<hr/>
		</div>
		<div>
			<div>Style Options</div>
			<div>
				<label>Color: </label> <input class ="jscolor" value="ab2567"></input>
				<label>Border Color: </label> <input class ="jscolor" value="ab2567"></input>
				<label>Circle Text Color: </label> <input class ="jscolor" value="ab2567"></input>
				<label>Size: </label> <input></input>
				<label>Shape: </label> <input></input>
				
			</div>
		</div>
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
				var translator = this.currentTranslator;
				translator.Translate(this.formulaValue);
				this.formulaValue = "";
			},
			executeExampleFormula: function () {
				var translator = this.currentTranslator;
				translator.Translate(this.selectedExample);
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
			formulaParams: []
		}
	}
})


function ShowInfoModal() {
	var nodeFlyout = document.getElementById('InfoModal');
	nodeFlyout.showModal();
}
function CloseInfoModal() {
	var nodeFlyout = document.getElementById('InfoModal');
	nodeFlyout.close();
}


