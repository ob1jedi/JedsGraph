
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

Vue.component('vw-panel-nodeEditor',{
    template: `
	<div class ='toolPanel' id='panel.nodeEditor'>
		<div class ="panelHead">Node Editor</div>
		HELLO THERE
	</div>
	`
})

Vue.component('vw-right-sidebar',{
    template: `
		<div id='rightColumn' class ="flexcroll">
		</div>
		`
})

Vue.component('vw-mode-indicator',{
    props: ['indicatorprop'],
    template: `
        <div id='modeIndicator'>
            <img :src="indicatorprop.image" class ="modeIndicatorImage"/>
            <span class ="modeIndicatorLabel">{{indicatorprop.title}}</span>
        </div>
		`
})

Vue.component('vw-formula-box',{
    props: ['formulaprop'],
    template: `
        <div id='formulaBox'>
            <table>
                <tr>
                    <td>
                        <input class="dynamic3" v-model='formulaprop.formulaValue' v-bind:placeholder="formulaprop.formulaDefault"></input>
                    </td>
                    <td>
                        <button class ="mybutton" v-on:click="formulaprop.formulaFunction(formulaprop.formulaValue)">generate</button>
                    </td>
                </tr>
            </table>
        </div> `
})

var consoleApp=new Vue({
    el: '#vue-app',
    data: {
        indicator: {
            title: "view",
            image: "../custom/assets/binoculars.svg"
        },
        formulaToolbar: {
            formulaDefault: "example: x->y",
            formulaValue: "",
            formulaFunction: function(expression) {
                var translator = new XYTranslator();
                translator.Translate(this.formulaValue);
            },
            formulaParams: []
        }
    }
})

var XYTranslator=function() {
    this.Translate=function(expression) {
        var dataSvc=new DataService();
        var nodes=expression.split("->");
        var newNodes = [];
        nodes.forEach(function(nodeLabel) {
            var newNode = dataSvc.CreateEntity_AddToGraph_ReturnNode([nodeLabel.trim()]); 
            newNodes.push(newNode);
        });
        if (newNodes.length > 1){
            for (var i = 0; i < newNodes.length-1; i++)
                var newlink = dataSvc.CreateRelation_AddToGraph_ReturnLink(newNodes[i].id, newNodes[i+1].id, "");
        }
    }
}



