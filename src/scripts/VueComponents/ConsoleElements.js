


// ================= NODE EDITOR ================= 

Vue.component('vw-panel-nodeEditor',{
  props: ['tabsprop'],
  template: '#vueTemplate-panel-nodeEditor'
})

Vue.component('vw-panel-nodeEditor-matching',{
  props: ['tabs'],
  template: '#vueTemplate-panel-nodeEditor-matching'
})

Vue.component('vw-panel-nodeEditor-existing',{
  props: ['tabs'],
  template: '#vueTemplate-panel-nodeEditor-existing'
})

Vue.component('vw-panel-nodeEditor-styles',{
  props: ['styles'],
  template: '#vueTemplate-panel-nodeEditor-styles'
})
Vue.component('vw-panel-nodeEditor-effects',{
  props: ['effects'],
  template: '#vueTemplate-panel-nodeEditor-effects'
})
Vue.component('vw-panel-nodeEditor-behaviours',{
  props: ['behaviours'],
  template: '#vueTemplate-panel-nodeEditor-behaviours'
})

Vue.component('vw-panel-nodestamp',{
  props: ['nodestamp', 'show'],
  template: '#vueTemplate-panel-nodeStamp'
})
// ================= TOPBAR ================= 

Vue.component('vw-topbar',{
  props: ['topbar'],
  template: '#vueTemplate-topbar'
})

Vue.component('vw-dropdown-menu',{
  props: ['name','menuitems'],
  template: '#vueTemplate-dropdown-menu'
})


Vue.component('vw-panel-nodeSelector',{
  props: ['sysdata'],
  template: '#vueTemplate-panel-nodeSelector'
})

// ================= BOTTOMBAR/FOOTER ================= 

Vue.component('vw-footer',{
  template: '#vueTemplate-footer'
})

// ================= SIDEBARS & GRAPH ================= 

Vue.component('vw-graph',{
  template: '#vueTemplate-graph'
})

Vue.component('vw-left-sidebar',{
  props: ['sysdata','panels'],
  template: '#vueTemplate-left-sidebar'
})

Vue.component('vw-right-sidebar',{
  props: ['tabs','nodestamp','panels'],
  template: '#vueTemplate-right-sidebar'
})

Vue.component('vw-left-toolbar',{
  props: ['lefttoolbar','panels'],
  template: '#vueTemplate-toolbar'
})

Vue.component('vw-subtoolbar',{
  props: ['toolbar','expander_function','collapse_function','parent','level'],
  template: '#vueTemplate-subtoolbar'
})

// ================= MODALS ================= 

//Vue.component('vw-info-modal',{
//  props: {
//    modalId: {type: String},
//    canCancel:{type: Boolean, default:true},
//    strHeader: {type: String}, 
//    htmlContent: {type: String}, 
//    button1Caption: {type: String},
//    button1Function: {type: String},
//    button2Caption: {type: String},
//    button2Function: {type: String}
//  },
//  template:'#vueTemplate-info-modal'
//})

//Vue.component('vw-modal-user-confirm',{
//  props: ['userconfirm'],
//  template: '#vueTemplate-modal-user-confirm'
//})

//Vue.component('vw-modal-info',{
//  props: ['modal'],
//  template: '#vueTemplate-modal-info'
//})

Vue.component('vw-modal',{
  props: ['modal'],
  template: '#vueTemplate-modal'
})

// ================= MODE INDICTAOR ================= 
Vue.component('vw-mode-indicator',{
  props: ['indicatorprop'],
  template: '#vueTemplate-mode-indicator'
})

// ================= FORMULA BOX ================= 
Vue.component('vw-formula-box',{
  props: ['formulaprop','panels'],
  template: '#vueTemplate-formula-box'
})

var consoleApp=new Vue({
  components: ['vw-panel-nodeEditor'],
  el: '#vue-app',
  created: function() {
    new VueConsoleHelper().RegisterWindowsEvents();
  },
  data: {
    /*NodeStamp right toolbar*/
    nodeStamp: {
      getWindowHeight: function(){
        console.log('window.innerHeight', window.innerHeight);
        return window.innerHeight;
      },
      activeStampIndex: -1,
      stamps: [
        //{ labels: ['Node'],properties: { Title: 'string' },config: { "config": { "attributes": { "background-color": "red","border-color": "green","border-width": 1 } } } },
        //{ labels: ['Person'],properties: { Title: 'string' },config: { "config": { "attributes": { "background-color": "green","border-color": "blue","border-width": 2 } } } },
        //{ labels: ['Sign'],properties: { Title: 'string' },config: { "config": { "attributes": { "background-color": "blue","border-color": "red","border-width": 3 },"effects": { "shadow": true } } } },
        //{ labels: ['Server'],properties: { Title: 'string' },config: { "config": { "attributes": { "background-color": "gray","border-color": "black" } } } }
      ],
      selectStamp: function() {
        globals.nodeStamp=this.stamps[this.activeStampIndex];
      }
    },
    /*Left toolbar*/
    leftToolbar: {
      expander_function: function(toolbar,_parent,_justClose, collapse_function) {
        if(!toolbar) return;
        // close all siblings...
        if(_parent) { // ...sub-toolbar
          for(var t in _parent.toolbars) {
            if(_parent.toolbars[t].name!=toolbar.name)
              collapse_function(_parent.toolbars[t]);
          }
        }
        if(_justClose&&toolbar.stateIndex!=0) {
          toolbar.stateIndex=0;
        } else {
          toolbar.stateIndex=(toolbar.stateIndex>=toolbar.states.length-1)?0:toolbar.stateIndex+1;
        }
        // adjust toolbar according to potential states...
        if(!_parent) { //...root-toolbar
          toolbar.stateLeft=toolbar.states[toolbar.stateIndex];
        }
        // adjust toolbars according to parents state...
        if(_parent) { // ...sub-toolbar
          toolbar.stateLeft=_parent.stateLeft+toolbar.states[toolbar.stateIndex];
        }
        // adjust child toolbars...
        for(var t in toolbar.toolbars) {
          toolbar.toolbars[t].stateLeft=toolbar.stateLeft+toolbar.toolbars[t].states[toolbar.toolbars[t].stateIndex];
        }
      },
      collapse_function: function(toolbar) {
        for(var tb in toolbar.toolbars) {
          this.collapse_function(toolbar.toolbars[tb]);
        }
        toolbar.stateIndex=0;
        toolbar.stateLeft=-150;
      },

      toolbar: {
        name: 'root',
        stateLeft: -150,
        stateIndex: 0,
        states: [-150,0],
        checkedItems: [],
        left: -150,
        items: [
          {
            desc: 'Navigation',
            ico: 'fa-hand-pointer-o',
            buttonType: 'radio', // ...options: {check / radio/ button}
            func: function() { new VueToolbarHelper().executeToolbarAction('SelectNavigation'); },
            subToolbarKey: 'viewType'
          },
          {
            desc: 'Create nodes',
            img: 'custom/assets/GraphexIcons/NewNode2.svg',
            buttonType: 'radio', // ...options: {check / radio/ button}
            func: function() { new VueToolbarHelper().executeToolbarAction('SelectCreateNodes'); },
            subToolbarKey: 'newNodes'
          }
        ],
        toolbars: {
          'newNodes': {
            name: 'newNodes',
            stateLeft: -150,
            stateIndex: 0,
            states: [0,60,200],
            checkedItems: [],
            toolbars: {},
            items: [
              {
                desc: 'Add free nodes',
                img: 'custom/assets/GraphexIcons/NewNodes.svg',
                buttonType: 'radio', // ...options: {check / radio/ button}
                func: function() { new VueToolbarHelper().executeToolbarAction('SelectCreateFreeNodes'); }
              },
              {
                desc: 'Add chained nodes',
                img: 'custom/assets/GraphexIcons/NewGraphNodes.svg',
                buttonType: 'radio', // ...options: {check / radio/ button}
                func: function() { new VueToolbarHelper().executeToolbarAction('SelectCreateChainedNodes'); }
              },
              {
                desc: 'Add child nodes',
                img: 'custom/assets/GraphexIcons/NewParentAndChildren.svg',
                buttonType: 'radio', // ...options: {check / radio/ button}
                func: function() { new VueToolbarHelper().executeToolbarAction('SelectCreateChildNodes'); }
              }
            ]

          },
          'viewType': {
            name: 'viewType',
            stateLeft: -150,
            stateIndex: 0,
            states: [0,60,200],
            checkedItems: [],
            toolbars: {},
            items: [
              {
                desc: 'Flat view',
                ico: 'fa-arrows',
                buttonType: 'radio', // ...options: {check / radio/ button}
                func: function() { new VueToolbarHelper().executeToolbarAction('SelectViewSpan'); }
              },
              {
                desc: 'Parralax view',
                img: 'custom/assets/GraphexIcons/NewNodes.svg',
                buttonType: 'radio', // ...options: {check / radio/ button}
                func: function() { new VueToolbarHelper().executeToolbarAction('SelectViewParralax'); }
              }

            ]
          }

        }
      }
    },

    panels: {
      nodeTypeEditor: { show: false },
      nodeStamp: { show: false },
      nodeTypeSelector: { show: false },
      formulaBar: { show: true },
      leftToolbar: { show: true }
    },

    modals: {
      commonModal: {
        header: "",
        htmlContent: "",
        buttons: [
          { caption: "ok",onclick: new VueConsoleHelper().CloseGlobalInfoModal }
        ]
      }
    },

    systemData: {
      //totalEntityCount: 0,
      typeSelectors: [],
      getAllEntities: function() {
        new DataService().GetAllEntities();
      },
      getEntitiesByType: function(entityTypeName,index) {
        new DataService().GetEntitiesByType(entityTypeName);
      },
      highlightAllNodes: function() {
        highlightLabel()
      },
      highlightNodesByType: function(index) {
        highlightLabel(index);
      }
    },
    // PUBLIC
    refreshTypeSelectors: function() {
      //this.systemData.totalEntityCount++;
      this.systemData.typeSelectors=globals.labelsList;
    },
    consoleShowNode: function(node) {
      this.selectedNode=node;
      var nodeConfig=node.data.entityConfig.config;

      this.tabs.newMatching.selectedNodeType=node.data.labels[0];
      this.tabs.newMatching.properties=node.data.properties||[];

      this.tabs.styles.selectedNodeColor=nodeConfig.attributes["background-color"];
      this.tabs.styles.selectedNodeBorderColor=nodeConfig.attributes["border-color"];
      this.tabs.styles.selectedNodeTextColor=nodeConfig.attributes.labelText["color"];
      this.tabs.styles.selectedNodeCircleTextColor=nodeConfig.attributes.circleText["color"];
      this.tabs.styles.selectedNodeShape=nodeConfig.attributes["shape"];
      this.tabs.styles.selectedNodeSize=nodeConfig.attributes["radius"];
      this.tabs.styles.selectedNodeImageUrl=nodeConfig.attributes.img["url"];

      this.tabs.effects.hasEffectHaze=nodeConfig.effects["haze"];
      this.tabs.effects.hasEffectShadow=nodeConfig.effects["shadow"];
      this.tabs.effects.hasEffectGlass=nodeConfig.effects["glass"];
      this.tabs.effects.hasEffectRounded=nodeConfig.effects["rounded"];

      this.tabs.behaviours.selectedDisplayTextType=nodeConfig.attributes.labelText.displayData["key"];
      this.tabs.behaviours.selectedDisplayField=nodeConfig.attributes.labelText.displayData["value"];;
      this.tabs.behaviours.selectedNodeImageType=nodeConfig.attributes.img.displayData["key"];
      this.tabs.behaviours.selectedNodeImageValue=nodeConfig.attributes.img.displayData["value"];;;

    },
    // PRIVATE
    selectedNode: null,
    topbar: {
      items: [
         {
           caption: "File",
           items: [
            {
              caption: "Reset storage",
              func: function() { new VueMenuHelper().ResetDatabase() }
            },
            {
              caption: "Export graph",
              func: function() { new VueMenuHelper().ExportGraph() }
            }
           ]
         },
         {
           caption: "View",
           items: [
              {
                caption: "Node Type Editor",
                func: function() { consoleApp.panels.nodeTypeEditor.show=!consoleApp.panels.nodeTypeEditor.show }
              },
              {
                caption: "Node Type Selector",
                func: function() { consoleApp.panels.nodeTypeSelector.show=!consoleApp.panels.nodeTypeSelector.show }
              },
              {
                caption: "Formula bar",
                func: function() { consoleApp.panels.formulaBar.show=!consoleApp.panels.formulaBar.show }
              },
              {
                caption: "Toolbar",
                func: function() { consoleApp.panels.leftToolbar.show=!consoleApp.panels.leftToolbar.show }
              },
           ],
         },
          {
            caption: "Tools",
            items: [
               {
                 caption: "Unpin all",
                 func: function() { new VueMenuHelper().UnpinAll() }
               },
               {
                 caption: "Arrange as tree",
                 func: function() { new VueMenuHelper().ArrangeNodes("bottom-to-top") }
               },
               {
                 caption: "Arrange as list",
                 func: function() { new VueMenuHelper().ArrangeNodes("left-to-right") }
               },
               {
                 caption: "Arrange as roots",
                 func: function() { new VueMenuHelper().ArrangeNodes("top-to-bottom") }
               },
               {
                 caption: "Center graph",
                 func: function() { new VueMenuHelper().CenterGraph() }
               },
               {
                 caption: "Clear stage",
                 func: function() { new VueMenuHelper().ClearStage() }
               }
            ],
          },
          {
            caption: "Help",
            items: [
               {
                 caption: "About",
                 func: function() { new VueMenuHelper().ShowAboutModal() }
               }
            ]
          }

      ],
      indicator: {
        title: "",
        image: "../custom/assets/GraphexIcons/NewNodes.svg"
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
        new ParseTreeTranslator(),
        new ApiImportTranslator()
      ],
      selectedTranslatorName: new SimpleTranslator().Name,
      currentTranslator: new SimpleTranslator(),
      selectedExample: (new SimpleTranslator().Examples&&new SimpleTranslator().Examples.length>0)?('example: '+new SimpleTranslator().Examples[0]):"",
      selectedImport: null,
      selectTranslator: function(value) {
        var currentScope=this;
        this.translators.forEach(function(trans) {
          if(trans.Name===value) {
            currentScope.currentTranslator=trans;
            currentScope.selectedTranslatorName=trans.Name;
            console.log('translator',currentScope.currentTranslator);
            return;
          }
        });
      },
      executeFormula: function() {
        new VueConsoleHelper().DisplayInfoModal('Loading','please wlait...');
        var translator=this.currentTranslator;
        translator.Translate(this.formulaValue);
        this.formulaHistory.push({ "formula": this.formulaValue,"translator": this.currentTranslator });
        this.formulaValue="";
        new VueConsoleHelper().CloseGlobalInfoModal();
      },
      executeExampleFormula: function() {
        //new VueConsoleHelper().DisplayInfoModal('Loading', 'please wlait...');
        var translator=this.currentTranslator;
        translator.Translate(this.selectedExample);
        this.selectedExample=null;
        //new VueConsoleHelper().CloseGlobalInfoModal();
      },
      importFromUrl: function(url) {
        //new VueConsoleHelper().DisplayInfoModal('Loading', 'please wlait...');
        console.log('IMPORTING...');
        var translator=this.currentTranslator;
        var httpClient=new HttpClient();
        var finalUrl=url;
        finalUrl=finalUrl.replace('$day',("0"+(new Date().getDate())).slice(-2));
        finalUrl=finalUrl.replace('$month',("0"+(new Date().getMonth()+1)).slice(-2));
        finalUrl=finalUrl.replace('$year',2000);
        console.log('URL',finalUrl);
        httpClient.get(finalUrl,function(response) {
          console.log('response',response);
          translator.Translate(response);
          //new VueConsoleHelper().CloseGlobalInfoModal();
        });
      },
      generateLink: function() {
        if((this.formulaValue||'').trim().length==0) { alert('Please enter a formula'); return; }
        console.log('this.formulaValue',this.formulaValue);
        var encodedFormula=new StringHelper().ParamEncodeString(this.formulaValue);
        var encodedTranslator=new StringHelper().ParamEncodeString(this.selectedTranslatorName);
        var blob="http://www.graphex.io/?trans="+encodedTranslator+"&grenc="+encodedFormula;
        var content="<input id='exportGraphTextArea' value='"+blob+"'>";
        new VueConsoleHelper().DisplayConfirmModal('Sharable Link',content,ifConfirmed,'Copy','Exit');
        function ifConfirmed() {
          var text=document.getElementById('exportGraphTextArea');
          text.select();
          document.execCommand("Copy");
          alert('Copied to clipboard');
        };

      },
      displayInfoModal: function() {
        new VueConsoleHelper().DisplayInfoModal(this.currentTranslator.Name,this.currentTranslator.ReferenceContent);
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
      selectedStyleTab: 'STYLES',
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
        alert('Config Saved "'+tempConfig.configName+'"')
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

function VueMenuHelper() {
  this.ResetDatabase=function() {
    var header='Are you sure?';
    var content="This will remove all the data and settings that you've accumulated so far";
    var ifConfirmed=function() {
      resetDatabase();
      alert('Storage cleared');
    };
    new VueConsoleHelper().DisplayConfirmModal(header,content,ifConfirmed,'Yes','Cancel');
  }

  this.ExportGraph=function() {
    var blob=new SimpleTranslator().TranslateGraphToFormula();
    //blob = new StringHelper().ReplaceAll(blob, '"', '');
    var content="<input id='exportGraphTextArea' value='"+blob+"'>";
    new VueConsoleHelper().DisplayConfirmModal('Export Data',content,ifConfirmed,'Copy','Exit');
    function ifConfirmed() {
      var text=document.getElementById('exportGraphTextArea');
      text.select();
      document.execCommand("Copy");
      alert('Copied to clipboard');
    };
  }

  this.ArrangeNodes=function(_orientation) {
    new SimpleArranger(_orientation).Arrange();
    this.CenterGraph();
  }
  this.UnpinAll=function() {
    unPinAllNodes();
  }
  this.CenterGraph=function() {
    globals.layout.step();
    var browserHelper=new BrowserHelper();
    var windowSize=browserHelper.GetWindowSize();
    var graphBounds=globals.layout.getGraphRect();
    var graphSize=({
      width: Math.abs(graphBounds.x2-graphBounds.x1),
      height: Math.abs(graphBounds.y2-graphBounds.y1),
    })
    var zoom=globals.graphics.scale(1,{ x: 0,y: 0 });
    var moveX=(windowSize.width/2)-(graphSize.width/2*zoom);
    var moveY=(windowSize.height/2)-(graphSize.height/2*zoom);

    globals.graphics.graphCenterChanged(moveX,moveY);
  },

  this.OtherFunctions=function() {
    //TODO:
    // Double the size of the graph..
    //globals.graphics.scale(2,{x:1,y:1})
    // Half the size of the graph
    //globals.graphics.scale(0.5,{x:1,y:1})
  }
  this.ShowAboutModal=function() {
    var header="About";
    var content=''
        +'Hi there, we hope you are enjoying the use of this tool.'
        +'It is still under development, but we welcome any suggestions that you may have.'
        +'<br>If you would like to contact us for any reason, you can get hold of us at:'
        +'<br><a href="mailto:suggest@graphex.io?Subject=I have a suggestion" target="_top">suggest@graphex.io</a>';
    new VueConsoleHelper().ShowInfoModal(header,content);
  }

  this.ClearStage=function() {
    var overflow=globals.nodeList.length+1;;
    var counter=0;
    while(globals.nodeList.length>0&&++counter<overflow) {
      removeNodeFromGraph(globals.nodeList[0].id);
    }
    globals.labelsList=[];
    globals.nodeList=[];
    globals.checkedLinks=[];
    globals.checkedNodes=[];
    globals.monitoredLinks=[];
    globals.monitoredNodes=[];
    globals.animUpdateNodes=[];
    globals.animUpdateLinks=[];
    globals.bPlanRelate=false;
    globals.bRelate=false;
    globals.selectedLink='';
    globals.selectedNode='';
    globals.selectedNodeData='';
    globals.selectedNodeID='';
    globals.selectedNodeUI='';
    globals.timeoutElements=[];
  }

  this.createFormulaFromGraph=function() {

  }

  function resetDatabase() {
    new DataService().DropDatabase();
    refreshEntitySelectors();
    consoleApp.refreshTypeSelectors();
  }



}

function VueToolbarHelper() {

  this.executeToolbarAction=function(name,args) {
    console.log('executingaction');
    switch(name) {
      case 'SelectNavigation':
        globals.modes.createNodeOnGraphDblClick=false;
        consoleApp.panels.nodeStamp.show = false;
        break
      case 'SelectCreateNodes':
        globals.modes.createNodeOnGraphDblClick=true;
        consoleApp.panels.nodeStamp.show = true;
        break;

      case 'SelectCreateFreeNodes':
        globals.modes.selectNodeAfterCreate=false;
        globals.modes.createLinkFromSelectedNodeOnCreateNode=false;
        break;
      case 'SelectCreateChainedNodes':
        globals.modes.selectNodeAfterCreate=true;
        globals.modes.createLinkFromSelectedNodeOnCreateNode=true;
        break;
      case 'SelectCreateChildNodes':
        globals.modes.selectNodeAfterCreate=false;
        globals.modes.createLinkFromSelectedNodeOnCreateNode=true;
        break;

    }
  }
}

function VueConsoleHelper() {

  this.DisplayConfirmModal=function(header,content,confirmFunction,_confirmCaption,_cancelCaption) {
    consoleApp.modals.commonModal.buttons=[];
    consoleApp.modals.commonModal.header=header;
    consoleApp.modals.commonModal.htmlContent=content;
    consoleApp.modals.commonModal.buttons.push({ caption: _confirmCaption||"yes",onclick: confirmFunction });
    consoleApp.modals.commonModal.buttons.push({ caption: _cancelCaption||"cancel",onclick: new VueConsoleHelper().CloseGlobalInfoModal })
    showGlobalInfoModal();
  }

  this.DisplayInfoModal=function(header,content) {
    consoleApp.modals.commonModal.buttons=[];
    consoleApp.modals.commonModal.header=header;
    consoleApp.modals.commonModal.htmlContent=content;
    showGlobalInfoModal();
  }

  this.ShowInfoModal=function(header,content) {
    consoleApp.modals.commonModal.buttons=[];
    consoleApp.modals.commonModal.header=header;
    consoleApp.modals.commonModal.htmlContent=content;
    showGlobalInfoModal();
  }

  this.ShowCopyModal=function(header,content) {
    consoleApp.modals.commonModal.buttons=[];
    consoleApp.modals.commonModal.header=header;
    consoleApp.modals.commonModal.htmlContent=content;
    showGlobalInfoModal();
  }

  this.ShowGlobalInfoModal=function() {
    showGlobalInfoModal();
  }

  this.CloseGlobalInfoModal=function() {
    closeGlobalInfoModal();
  }

  this.RegisterWindowsEvents=function() {
    console.log('Registering window events');
    // When the user clicks anywhere outside of the modal, close it
    window.onclick=function(event) {
      // Get the modal
      var modal=document.getElementById('myModal');
      if(event.target==modal) {
        modal.style.display="none";
      }
    }
  }

  function showGlobalInfoModal() {
    var dialogElement=document.getElementById('myModal');
    dialogElement.style.display="block";
    //var dialogElement=document.getElementById(modalId);
    //dialogElement.showModal();
  }
  function closeGlobalInfoModal() {
    var dialogElement=document.getElementById('myModal');
    console.log('closing dialog');
    dialogElement.style.display="none";
    //var dialogElement=document.getElementById(modalId);
    //dialogElement.close();
  }


}

