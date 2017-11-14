var configManager={configs:[],defaultConfig:"DT2"};configManager.configs.push({configName:"Default",prefix:"DEF",neo4jconnection:{sourceName:"local",server:"http://localhost:7474",username:"neo4j",password:"Password@123456"},dataAccessOptions:{generalFetchLimit:100},startupOptions:{startupSearch:[],startupQueries:[],nodeDisplayValues:[],nodeDisplayBody:[],linkDisplayValues:[],nodeStatReachers:[{nodeLabel:"Category",functionName:"getRelationCounts"},{nodeLabel:"Order",functionName:"getRelationCounts"},{nodeLabel:"Product",functionName:"getRelationCounts"}],nodeTransformers:[{nodeLabel:"Category",name:"Petalize",params:["data.propertiesObject.categoryID","custom/svg/Leaves/black-willow.svg",25,30]},{nodeLabel:"Order",name:"Petalize",params:["data.stats.toEntityCount","custom/svg/Misc/man.svg",25,20]}],nodeAugments:[{nodeLabel:"Category",property:"categoryID",value:5,nodeDisplayBody:{color:"gray",size:50,image:"custom/svg/placeholder.svg"}}],nodeFlyout:[]},viewOptions:{prefetchLabelSelectors:!1,prefetchCounts:!0,panels:[{name:"panel.labelselectors",parent:"leftSidebar",available:!0,visible:!0,icon:"glyphicon glyphicon-indent-right",desc:"selectors"},{name:"panel.functions",parent:"leftSidebar",available:!0,visible:!0,icon:"glyphicon glyphicon-th-large",desc:"functions"},{name:"panel.config",parent:"leftSidebar",available:!1,visible:!1,icon:"glyphicon glyphicon-adjust",desc:"config"},{name:"panel.selection",parent:"leftSidebar",available:!0,visible:!1,icon:"glyphicon glyphicon-ok-sign",desc:"select options"},{name:"panel.nodedetails",parent:"leftSidebar",available:!0,visible:!1,icon:"glyphicon glyphicon-dashboard",desc:"entity details"},{name:"panel.linkdetails",parent:"leftSidebar",available:!0,visible:!1,icon:"glyphicon glyphicon-sort-by-order",desc:"relationship details"},{name:"panel.simplequery",parent:"leftSidebar",available:!1,visible:!1,icon:"glyphicon glyphicon-search",desc:"query"},{name:"panel.bulkactions",parent:"leftSidebar",available:!0,visible:!0,icon:"glyphicon glyphicon-list",desc:"bulk actions"},{name:"panel.monitoring",parent:"leftSidebar",available:!1,visible:!1,icon:"glyphicon glyphicon-asterisk",desc:"monitoring"},{name:"panel.entity.create",parent:"leftSidebar",available:!0,visible:!1,icon:"glyphicon glyphicon-plus-sign",desc:"create entity"},{name:"panel.relationship.create",parent:"leftSidebar",available:!0,visible:!1,icon:"glyphicon glyphicon-registration-mark",desc:"create relationship"},{name:"panel.appearance",parent:"leftSidebar",available:!0,visible:!1,icon:"glyphicon glyphicon-certificate",desc:"appearance"},{name:"panel.highlight",parent:"leftSidebar",available:!0,visible:!1,icon:"glyphicon glyphicon-eye-open",desc:"hover options"},{name:"panel.navigation",parent:"leftSidebar",available:!0,visible:!1,icon:"glyphicon glyphicon-hand-up",desc:"navigation options"}],subnodes:{relations:"ifany"},nodeSizing:"relationCount"},monitoringOptions:{pollInterval:1},displaySettings:{selectorColor:"gray",backgroundImage:null,graphBackground:"linear-gradient(#002533, #00384d, #002533)",highlightColor:"#99ff33",focusColor:"red",entityShape:"circle",entityRgbRange:{min:40,max:140},entityLabelColor:"black",entityBorderColor:null,entityOpacity:1,entityPopoutTextColor:"#0077b3",entityPopoutBoxColor:"#bfbfbf",entityFont:{family:"Arial, Helvetica, sans-serif",weight:"normal"},linkColor:"grey",linkMainTextColor:"#d9d9d9",linkSubTextColor:"#ffa64d",linkThickness:3,linkOpacity:1,linkHighlightColor:"red",opaque:!1,labelSizing:"fontsize",haze:!0,glass:!1,highlightHaze:!0,shadow:!1,glow:!1,rounded:!1,showLabels:!0,loadNodePopouts:!1,showCircleText:!0,showRelationships:"on-highlight",loadRelationPopouts:!1,showRelationProperties:!1}}),configManager.configs.push({configName:"local",prefix:"LOC",neo4jconnection:{sourceName:"local",server:"http://localhost:7474",username:"neo4j",password:"Password@123456"},startupOptions:{startupSearch:[{nodeLabel:"WORKFLOW"},{nodeLabel:"STREAM"}],startupQueries:[],nodeDisplayValues:[{nodeLabel:"service",displayField:"status"},{nodeLabel:"version",displayField:"versionName"},{nodeLabel:"Category",displayField:"categoryName"},{nodeLabel:"WORKFLOW",displayField:"workflowName"},{nodeLabel:"TOOL",displayField:"toolName"}],nodeDisplayBody:[{nodeLabel:"Sample",size:50,color:"#f2b3ab"},{nodeLabel:"BinomialDistribution",size:50,color:"#f2b3ab"},{nodeLabel:"Population",size:50,color:"#f2b3ab"},{nodeLabel:"SampleDistribution",size:50,color:"#f2b3ab"}],nodeFlyout:[{nodeLabel:"WORKFLOW",elementType:"button",innerHTML:"Configuration",onclick:"globals.nodeFunctions.show_updateWorkflowModal()",tooltip:"Configure this workflow"},{nodeLabel:"WORKFLOW",elementType:"button",innerHTML:"New Workflow",onclick:"globals.nodeFunctions.show_addWorkflowModal()",tooltip:"Create new workflow"},{nodeLabel:"WORKFLOW",elementType:"button",innerHTML:"-",onclick:"globals.nodeFunctions.show_removeWorkflowModal()",tooltip:"Delete this workflow"},{nodeLabel:"WORKFLOW",elementType:"div",innerHTML:""},{nodeLabel:"WORKFLOW",elementType:"button",innerHTML:"Add Content",onclick:"globals.nodeFunctions.show_addContentModal()",tooltip:"Take a few files"},{nodeLabel:"WORKFLOW",elementType:"button",innerHTML:"Send to Tool",onclick:"globals.nodeFunctions.show_addToolModal()",tooltip:"Process content with tool"},{nodeLabel:"WORKFLOW",elementType:"button",innerHTML:"Send to Collector",onclick:"globals.nodeFunctions.show_addCollectorModal()",tooltip:"Collect processed content"},{nodeLabel:"TOOL",elementType:"button",innerHTML:"Configuration",onclick:"globals.nodeFunctions.show_updateToolModal()",tooltip:"Adjust settings for tool"},{nodeLabel:"TOOL",elementType:"button",innerHTML:"Send to Tool",onclick:"globals.nodeFunctions.show_addToolModal()",tooltip:"Process content with tool"},{nodeLabel:"COLLECTOR",elementType:"button",innerHTML:"Configuration",onclick:"globals.nodeFunctions.show_updateCollectorModal()",tooltip:"Configure collector"}]},viewOptions:{prefetchLabelSelectors:!0},displaySettings:{selectorColor:"gray",graphBackground:"linear-gradient(black, #323a39)",entityShape:"circle",entityRgbRange:{min:150,max:200},entityLabelColor:"black",entityBorderColor:null,entityOpacity:1,linkColor:"grey",linkMainTextColor:"grey",linkSubTextColor:"grey",linkThickness:2,linkOpacity:1,opaque:!1,labelSizing:"fontsize",haze:!1,highlightHaze:!0,shadow:!1,glow:!1,rounded:!1,showLabels:!0,loadNodePopouts:!1,showRelationships:"on-highlight",loadRelationPopouts:!1,showRelationProperties:!1}}),configManager.configs.push({configName:"BaseGraphConfig",prefix:"BGC",configType:"graph",config:{startupOptions:{},startupSearch:[{nodeLabel:"WORKFLOW"},{nodeLabel:"STREAM"}],startupQueries:[]}}),configManager.configs.push({configName:"BaseNodeconfig",prefix:"BNC",configType:"entity",matchEntity:null,config:{attributes:{shape:"circle",radius:25,"border-color":null,"background-color":null,opacity:1,rgbRange:{min:60,max:140},highlightRing:{"border-color":"#99ff33"},focusRing:{"border-color":"red"},labelText:{show:!0,displayData:{key:"first",value:["Name","Title","Id"]},labelPosition:"center",labelSizing:null,color:"#cccccc","font-family":"Arial, Helvetica, sans-serif","font-weight":"normal",x:0,y:0,effects:{haze:!1}},circleText:{show:!0,color:"#d9dce0",opacity:1,"font-family":"Arial, Helvetica, sans-serif","font-weight":"normal"},selector:{"background-color":"gray"},img:{url:null,displayData:{key:null,value:null},width:0,height:0,opacity:1},placement:{depth:null,"start-x":null,"start-y":null},physics:{mass:null,spring:null}},relatedThings:[{arrayId:1,thingName:"popoutBox",TextColor:"#0077b3",BoxColor:"#bfbfbf"},{arrayId:2,thingName:"flyout",show:!0},{arrayId:3,thingName:"flyoutButton",elementType:"button",innerHTML:"New Workflow",onclick:"globals.nodeFunctions.show_addWorkflowModal()",tooltip:"Create new workflow"}],behaviours:{loadNodePopouts:!1},effects:{haze:!1,shadow:!1,glass:!1,rounded:!1,highlightHaze:!1,glow:!1,opaque:!1},functions:[{arrayId:1,onEvent:"onDisplay",executeFunction:"getRelationCounts",withParams:{},intoVariable:"Relations"}],plugins:[{arrayId:1,name:"Petalize",params:{propertyName:"Relations",petalImageUrl:"custom/svg/Leaves/black-willow.svg",startAtRadius:25,petalSize:30}},{arrayId:2,name:"Ringulate",params:{propertyName:"Relations",petalImageUrl:"custom/svg/Leaves/black-willow.svg"}}],appearanceRules:[{arrayId:1,ifProperty:"categoryID",isValue:5,thenNodeDisplayBody:{color:"gray",size:50,image:"custom/svg/placeholder.svg"}}],dynamicSizingOptions:{propertyName:"Relations",acceleration:-1,velocity:1}}});