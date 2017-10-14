
Vue.component('vw-graph', {
	template: `
		<div id='graphPanel'>
			<div id='graphContainer'></div>
		</div>
		`
})

Vue.component('vw-panel', {
	template: `<h3>hello</h3>`
})


Vue.component('vw-topbar', {
	template:
`
		<div id='topBar'>
		</div>
`
})

Vue.component('vw-topbar', {
	template:
`
		<div id='topBar'>
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
Vue.component('vw-right-sidebar', {
	template: `
		<div id='rightColumn' class ="flexcroll">
		</div>
		`
})


Vue.component('vw-mode-indicator', {
	template: `
		<div id='modeIndicator'>
		</div>
		`
})

Vue.component('vw-panel-nodeEditor', {
	template: `
	<div class ='toolPanel' id='panel.noeEditor'>
		<div class ="panelHead">Node Editor</div>
		HELLO THERE
	</div>
	`
})

var app6 = new Vue({
	el: '#vue-app',
})

