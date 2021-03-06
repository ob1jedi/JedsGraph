//Graph functions



function unPinAllNodes() {
  globals.nodeList.forEach(function(node) {
    globals.layout.pinNode(node,false);
    node.data.isPinned=false;
  });
}

function uncheckAll() {
  //check nodes
  globals.nodeList.forEach(function(node) {
    uncheckNode(node);
  });
  //check links
  globals.linkList.forEach(function(link) {
    new LinkHelper().UncheckLink(link);
  });
}

function checkAll() {
  //check nodes
  globals.nodeList.forEach(function(node) {
    checkNode(node);
  });
  //check links
  globals.linkList.forEach(function(link) {
    new LinkHelper().checkLink(link);
  });
}

function setScreenDragType(key) {
  globals.viewOptions.screenDragType=key;
}

function getDataRootNodes() {
  var rootNodes=[];
  globals.nodeList.forEach(function(node) {
    if(node.data.fromNodes.length==0) {
      rootNodes.push(node);
    }
  });
  return rootNodes;
}

function arrangeBy(rootNode,processedNodeIds,maxxRight,maxxLeft,level,startY) {

  if(!rootNode) {
    squares=[];
    var startPos=globals.layout.getNodePosition(globals.nodeList[0].id);
    var rootNodes=getDataRootNodes();
    processedNodeIds=[];

    var startpos=startPos.x;
    globals.nodeList.forEach(function(node) {
      globals.layout.pinNode(node,true);
      node.data.isPinned=true;
      startpos+=100;
      globals.layout.setNodePosition(node.id,startpos,startPos.y);
    });

    maxxRight=startPos.x;
    maxxLeft=startPos.x;
    startY=startPos.y;
    rootNodes.forEach(function(rootNode,index) {
      maxxRight=arrangeBy(rootNode,processedNodeIds,maxxRight,maxxLeft,0,startY);
    });
  }
  else {


    level++;
    processedNodeIds.push(rootNode.id);
    var rootNodePos=globals.layout.getNodePosition(rootNode.id);
    var cb=rootNodePos.x-((rootNode.data.toNodes.length*100)/2)
    rootNode.data.toNodes.forEach(function(childNode,index) {
      var childNodePos=globals.layout.getNodePosition(childNode.id);
      childNodePos.x=cb+(100*index);
      if(childNodePos.x+100>=maxxRight) { maxxRight=childNodePos.x+100; }
      if(childNodePos.x<=maxxLeft) { maxxLeft=maxxLeft-100; maxxRight=maxxRight+100; }
      var childLevel=startY+(level*150);
      if(childLevel>childNodePos.y) { childNodePos.y=childLevel };
      globals.layout.setNodePosition(childNode.id,childNodePos.x,childNodePos.y);

      if(processedNodeIds.indexOf(childNode.id)<0) {
        arrangeBy(childNode,processedNodeIds,maxxRight,maxxLeft,level,startY);
      }
      else //cyclic relation
      {
        //globals.layout.pinNode(node, false);
        //node.data.isPinned = false;
      }
    });
  }
  return maxxRight;

}

function arrangeBy2(rootNode,processedNodeIds,posLeft,posTop,level) {
  if(!rootNode) {
    squares=[];
    var startPos=globals.layout.getNodePosition(globals.nodeList[0].id);
    var rootNodes=getDataRootNodes();
    processedNodeIds=[];
    globals.nodeList.forEach(function(node) {
      globals.layout.pinNode(node,true);
      node.data.isPinned=true;
      globals.layout.setNodePosition(node.id,startPos.x,startPos.y);
    });

    posLeft=startPos.x;
    posTop=startPos.y;
    var rootTop=startPos.y;
    rootNodes.forEach(function(rootNode,index) {
      posTop+=100;
      posTop=arrangeBy2(rootNode,processedNodeIds,posLeft,posTop,0);
      var parentPos=rootTop+((posTop-rootTop)/2);
      globals.layout.setNodePosition(rootNode.id,posLeft,parentPos);
      rootTop=posTop;
    });
  }
  else {
    level++;
    processedNodeIds.push(rootNode.id);
    var rootNodePos={ x: posLeft,y: posTop };
    posLeft+=200;
    var currentChildTop=posTop-100;
    rootNode.data.toNodes.forEach(function(childNode,index) {
      if(processedNodeIds.indexOf(childNode.id)<0) {
        currentChildTop+=100;
        globals.layout.setNodePosition(childNode.id,posLeft,currentChildTop);
        posTop=arrangeBy2(childNode,processedNodeIds,posLeft,currentChildTop,level);
      }
    });
  }
  return posTop;
}

function addNodeToGraph(nodeId,nodeData) {
  var node=globals.GRAPH.getNode(nodeId);
  node=globals.GRAPH.addNode(nodeId,nodeData);
  fixTextWidth4Node(node);
  return node;
}

function highlightLabel(labelIndex) {
  var nodeLabel=globals.labelsList[labelIndex];
  globals.nodeList.forEach(function(node) {
    node.data.UI.fullUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity);
    node.data.UI.bodyUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity);
    if(nodeLabel&&node.data.labels.indexOf(nodeLabel.name)==-1) {
      node.data.UI.fullUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity/5)
      node.data.UI.bodyUI.attr('fill-opacity',node.data.sourceConfig.displaySettings.entityOpacity/5);
    }
  });
}

function addPlannedLink(fromNodeID,toNodeID,linkName,linkProperties) {
  var plannedLinkData=new linkDataType()
  plannedLinkData.fromNode=fromNodeID;
  plannedLinkData.toNode=toNodeID;
  plannedLinkData.id=fromNodeID+'_'+toNodeID+' '+linkName;
  plannedLinkData.name=linkName;
  plannedLinkData.displayLabel=linkName;
  plannedLinkData.linkType='planned';
  plannedLinkData.color='red';
  link=globals.GRAPH.addLink(fromNodeID,toNodeID,plannedLinkData);
  globals.linkList.push(link);
}

function addDataLink(fromNodeID,toNodeID,linkData,_sourceConfig) {
  linkData.sourceConfig=_sourceConfig?_sourceConfig:globals.currentTheme.sourceConfig;
  var bIsNew=false;
  var link;
  var existingLink=getDataLink(linkData.id);

  if(existingLink) {
    var updatedProperties=getUpdatedProperties(linkData.properties,existingLink.data.properties);
    if(linkData.name!=existingLink.data.name||updatedProperties.length>0) {
      existingLink.data.name=linkData.name;
      existingLink.data.displayLabel=linkData.name;
      existingLink.data.properties=linkData.properties;
      globals.animUpdateLinks.push(existingLink);
    }
    link=existingLink;
    fromNodeID=existingLink.data.fromNodeID;
    toNodeID=existingLink.data.toNodeID;
  }
  else {
    bIsNew=true;
    link=globals.GRAPH.addLink(fromNodeID,toNodeID,linkData);
    link.data.fromNodeID=fromNodeID;
    link.data.toNodeID=toNodeID;
    link.data.displayLabel=linkData.name;



    globals.linkList.push(link);
    new LinkHelper().FixLinkIndexes(fromNodeID,toNodeID);
  }



  var toNode=globals.GRAPH.getNode(toNodeID);
  var fromNode=globals.GRAPH.getNode(fromNodeID);

  globals.config_ext.startupOptions.linkDisplayValues.map(function(lconfig) {
    var useConfig=true;
    if(lconfig.labelFrom) { useConfig=(lconfig.labelFrom==fromNode.data.labels[0])?useConfig:false } else { useConfig=false; }
    if(lconfig.labelTo) { useConfig=(lconfig.labelTo==toNode.data.labels[0])?useConfig:false } else { useConfig=false; }
    if(lconfig.type) { useConfig=(lconfig.type==link.data.name)?useConfig:false } else { useConfig=false; }
    if(useConfig) {
      link.data.config=lconfig;
      link.data.displayLabel=lconfig.displayField;
      var propertyValue=getNodePropertyValue(link.data.properties,lconfig.displayField);
      link.data.displayLabel=propertyValue?propertyValue:' ';
    }
  });
  new LinkHelper().RefreshLinkVisual(link);

  if(bIsNew) {
    ensureLinkIntoListList(link,toNode.data.fromLinks);
    ensureLinkIntoListList(link,fromNode.data.toLinks);
    ensureNodeIntoNodeList(fromNode,toNode.data.fromNodes);
    ensureNodeIntoNodeList(toNode,fromNode.data.toNodes);
  }
  new LinkHelper().FixTextWidth4Link(link);
  return link;
}

function ensureLinkIntoListList(link,linkList) {
  for(var i=0;i<linkList.length;i++) {
    if(linkList[i].id==link.id)
      return;
  }
  linkList.push(link);
}

function ensureNodeIntoNodeList(node,nodeList) {
  for(var i=0;i<nodeList.length;i++) {
    if(nodeList[i].id==node.id)
      return;
  }
  nodeList.push(node);
}


function addDataNode(nodeId,newNodeData) {
  var arraySvc=new ArrayHelper();
  var isNewNode=true;
  var node=getExistingNode(nodeId);
  if(node) {
    node.data.labels=newNodeData.labels;
    node.data.properties=newNodeData.properties;
  }
  setupDisplayLabelsIn(newNodeData);
  var eventsHelper=new EntityEventsHelper();
  setNodeColorIn(newNodeData);
  eventsHelper.AddEntityToGraph_beforeNodeAdd(newNodeData);
  node=addNodeToGraph(newNodeData.id,newNodeData);
  //PerformNodeStatFunctions(node);
  recordTypeInfo(node);
  eventsHelper.AddEntityToGraph_afterNodeAdd(node);

  return node;
}

function setupDisplayLabelsIn(thisNodeData) {
  var finalLabel='';
  thisNodeData.labels.forEach(function(nodeLabel,index) {
    if(finalLabel) { finalLabel+=', '+finalLabel }
    if(!finalLabel) { finalLabel=''; }
    if(finalLabel=="") {
      finalLabel=nodeLabel;
    }
  });
  //set display label...
  thisNodeData.displayLabel="";
  var configDisplayValueOptions=thisNodeData.entityConfig.config.attributes.labelText["displayData"];

  if(!configDisplayValueOptions) {
    thisNodeData.displayLabel=finalLabel;
  } else if(configDisplayValueOptions.key==="property") {
    thisNodeData.displayLabel=getNodePropertyValue(thisNodeData.properties,configDisplayValueOptions.value);
  } else if(configDisplayValueOptions.key==="static") {
    thisNodeData.displayLabel=configDisplayValueOptions.value;
  } else if(configDisplayValueOptions.key==="first") {
    for(var i=0;i<configDisplayValueOptions.value.length;i++) {
      var potentialFieldValue=getNodePropertyValue(thisNodeData.properties,configDisplayValueOptions.value[i]);
      if(potentialFieldValue) {
        thisNodeData.displayLabel=potentialFieldValue;
        break;
      }
    }
  }
  if(!thisNodeData.displayLabel||thisNodeData.displayLabel=='') {
    thisNodeData.displayLabel=" ";
  }

  if(thisNodeData.config.nodeDisplayValues.circleText) {
    if(thisNodeData.circleText!="") {
      thisNodeData.circleText+'\n';
    }
    var propertyValue=getNodePropertyValue(thisNodeData.properties,thisNodeData.config.nodeDisplayValues.displayField);
    thisNodeData.circleText+=propertyValue?propertyValue:' ';
  }
  else {
    thisNodeData.circleText=finalLabel;
  }
}

function setNodeColorIn(entityData) {
  //entityData.displayLabel;
  var aNeoLabel=getNeoLabel(entityData.labels[0]);
  if(aNeoLabel) {

    if(!entityData.entityConfig.config.attributes["background-color"]) {
      entityData.entityConfig.config.attributes["background-color"]=aNeoLabel.color;
    }

    entityData.nodeColorRGB=aNeoLabel.colorRGB;
    entityData.nodeColor=rgb2hex(entityData.nodeColorRGB.r,entityData.nodeColorRGB.g,entityData.nodeColorRGB.b);

    if(!entityData.entityConfig.config.attributes["border-color"]) {
      var nodeBorderColorRGB={
        r: entityData.nodeColorRGB.r-50,
        g: entityData.nodeColorRGB.g-50,
        b: entityData.nodeColorRGB.b-50
      }
      var nodeColorHex=rgb2hex(nodeBorderColorRGB.r,nodeBorderColorRGB.g,nodeBorderColorRGB.b);
      entityData.entityConfig.config.attributes["border-color"]=nodeColorHex;
      entityData.nodeBorderColor=nodeColorHex;
    }
    //entityData.nodeColor = aNeoLabel.color;
    //entityData.nodeBorderColor = rgb2hex(entityData.nodeColorRGB.r-20, entityData.nodeColorRGB.g-20, entityData.nodeColorRGB.b-20);
  }
}

function recordTypeInfo(node) {
  var graphHelper=new GraphHelper();
  graphHelper.AddToEntityTypeDefs(node);
  globals.nodeList.push(node);
}

function addEntityLabel(labelName,_addInstanceCount,entityConfig) {
  var existingDataLabel=getNeoLabel(labelName);
  if(existingDataLabel) {
    if(_addInstanceCount) { existingDataLabel.instanceCount+=_addInstanceCount };
    var fetchbutton=document.getElementById('labelSelector.fetcher.'+labelName)
    if(fetchbutton) { fetchbutton.innerHTML=existingDataLabel.instanceCount; }
    return existingDataLabel;
  }

  var rgbRange=entityConfig.config.attributes.rgbRange;
  var rgb={
    r: Math.ceil(getRandomArbitrary(rgbRange.min,rgbRange.max)),
    g: Math.ceil(getRandomArbitrary(rgbRange.min,rgbRange.max)),
    b: Math.ceil(getRandomArbitrary(rgbRange.min,rgbRange.max))
  }
  var randomColor=rgb2hex(rgb.r,rgb.g,rgb.b);
  var newDataLabel=new neoLabelType(labelName,randomColor,rgb,entityConfig);
  if(_addInstanceCount) { newDataLabel.instanceCount+=_addInstanceCount; }
  //Add new data label to labels-list
  globals.labelsList.push(newDataLabel);

  return newDataLabel;
}

function refreshEntitySelectors() {
  //Order label selectors...
  globals.labelsList.sort(sort_by('name',false,function(a) { if(a) { return a.toUpperCase() } }));
  //Add selector to HTML...
  var qbuilderFromEntitySelector=document.getElementById('qbuilder.from.entity');
  var color='gray';
  var button_onclick="globals.dataService.GetEntitiesByType(false, '')";
  var fetchButton='<div id="labelSelector.fetcher.All" class="forlabelselector mytooltip" onclick="'+button_onclick+'"><div class="mytooltiptext ttleft ttlower">Fetch from database</div></div>'
  var labelSelectorHtml='<table><tr><td><div onclick="highlightLabel()" class="labelSelectorItem" style="background-color:'+color+';">All</div></td><td>'+fetchButton+'</td></tr>';
  if(qbuilderFromEntitySelector) { qbuilderFromEntitySelector.innerHTML='<option value=""></option>'; }

  globals.labelsList.forEach(function(nodeLabel,index) {
    color=nodeLabel.data.sourceConfig.config.attributes.selector["background-color"];
    button_onclick="globals.dataService.GetEntitiesByType('"+nodeLabel.name+"', '')";

    labelSelectorHtml+=''
			+'<tr>'
			+'	<td>'
			+'		<div onclick="highlightLabel('+index+')" class="labelSelectorItem" style="background-color:'+color+';" > '
			+nodeLabel.name
			+'		</div>'
			+'	</td>'
			+'	<td>'
			+'		<div id="labelSelector.fetcher.'+nodeLabel.name+'" class="forlabelselector mytooltip pull-right" style="background-color:'+nodeLabel.color+'" onclick= "'+button_onclick+'" > '
			+nodeLabel.instanceCount
			+'			<div class="mytooltiptext ttleft ttupper">'
			+'				Fetch from database'
			+'			</div>'
			+'		</div>'
			+'	</td>'
			+'</tr>;'
    if(qbuilderFromEntitySelector) { qbuilderFromEntitySelector.innerHTML+='<option value="'+nodeLabel.name+'">'+nodeLabel.name+'</option>'; }
  });
  labelSelectorHtml+='</table>';
  var LabelsDiv=document.getElementById('selectorLabels');
  if(LabelsDiv) { LabelsDiv.innerHTML=labelSelectorHtml; }
}

function removeNodeFromStage(nodeID) {
  if(!nodeID) { return; }
  var node=globals.GRAPH.getNode(nodeID);

  //var relativeLinks=node.data.toLinks.concat(node.data.fromLinks);
  //relativeLinks.forEach(function(link) {
  //  removeLinkFromStage(link.id);
  //  //globals.GRAPH.removeLink(link.id);
  //});

  var relativeLinkIds=node.data.toLinks.map(function(l) { return l.id }).concat(node.data.fromLinks.map(function(l) { return l.id }));
  for(var i=0;i<relativeLinkIds.length;i++) {
    removeLinkFromStage(relativeLinkIds[i]);
  };

  removeNodeFromNodeList(globals.nodeList,nodeID);
  removeNodeFromNodeList(globals.monitoredNodes,nodeID);
  removeNodeFromNodeList(globals.checkedNodes,nodeID);

  globals.nodeList.forEach(function(node) {
    removeNodeFromNodeList(node.data.toNodes,nodeID);
    removeNodeFromNodeList(node.data.fromNodes,nodeID);
    removeLinkFromLinkListByNodeId(node.data.toLinks,nodeID)
    removeLinkFromLinkListByNodeId(node.data.fromLinks,nodeID)
  });

  globals.GRAPH.removeNode(nodeID);

  globals.consoleService.HideNodeFlyout();
}

function removeLinkFromStage(linkId) {
  if(!linkId) { return; }
  var linkToRemove=new LinkHelper().GetLinkById(linkId);
  if(!linkToRemove) {
    // ...Link has already been removed.
    return;
  }
  removeLinkFromLinkList(globals.linkList,linkId);
  removeLinkFromLinkList(globals.monitoredLinks,linkId);
  var fromNode=globals.GRAPH.getNode(linkToRemove.data.fromNodeID);
  var toNode=globals.GRAPH.getNode(linkToRemove.data.toNodeID);
  removeNodeFromNodeList(fromNode.data.toNodes,linkToRemove.data.toNodeID);
  removeNodeFromNodeList(toNode.data.fromNodes,linkToRemove.data.fromNodeID);
  removeLinkFromLinkList(fromNode.links,linkToRemove.id);
  removeLinkFromLinkList(toNode.links,linkToRemove.id);
  removeLinkFromLinkList(fromNode.data.toLinks,linkToRemove.id);
  removeLinkFromLinkList(toNode.data.fromLinks,linkToRemove.id);
  globals.GRAPH.removeLink(linkToRemove);
}


function removeLinkFromLinkListByNodeId(linkList,nodeId) {
  var i=-1;
  while(++i<linkList.length) {
    if(linkList[i].toNodeID==nodeId||linkList[i].fromNodeID==nodeId) {
      linkList.splice(i,1);
      i--;
    }
  }
}

function removeLinkFromLinkList(linkList,linkId) {
  var i=-1;
  while(++i<linkList.length) {
    if(linkList[i].id==linkId) {
      linkList.splice(i,1);
      i--;
    }
  }
}

function removeNodeFromNodeList(nodeList,nodeId) {
  var i=-1;
  while(++i<nodeList.length) {
    if(nodeList[i].id==nodeId) {
      nodeList.splice(i,1);
      i--;
    }
  }
}

function getExistingNode(nodeID) {
  for(var i=0;i<globals.nodeList.length;i++) {
    if(globals.nodeList[i].id==nodeID) {
      return globals.nodeList[i];
    }
  }
}

function getExistingLink(linkID) {
  for(var i=0;i<globals.linkList.length;i++) {
    if(globals.linkList[i].id==linkID) {
      return globals.linkList[i];
    }
  }
}

function getNodesByMatchingLabels(nodesList,labels) {
  var returnNodeList=[];
  //iterate through 
  nodesList.forEach(function(node) {
    var nodeEligible=true;
    labels.forEach(function(nodeLabel) {
      var labelFound=false;
      node.data.labels.forEach(function(nodelabel) {
        if(nodelabel==nodeLabel)
          labelFound=true;
      });
      if(!labelFound) { nodeEligible=false }
    });
    if(nodeEligible) { returnNodeList.push(node); }
  });
  return returnNodeList;
}

function getNodesByMatchingProperties(nodesList,properties) {
  var returnNodeList=[];
  //iterate through 
  nodesList.forEach(function(node) {
    var nodeEligible=true;
    properties.forEach(function(prop) {
      var propFound=false;
      node.data.properties.forEach(function(nodeprop) {
        if(prop.key==nodeprop.key&&prop.value==nodeprop.value) {
          propFound=true;
        }
      });
      if(!propFound) { nodeEligible=false; }
    });
    if(nodeEligible) { returnNodeList.push(node); }
  });
  return returnNodeList;
}

function getNeoLabel(byName) {
  var x;
  globals.labelsList.forEach(function(labelobj,index) {
    if(labelobj.name==byName) { // &&  labelobj.data.sourceConfig.prefix == sourcePrefix){
      x=labelobj;
      return labelobj;
    }
  });
  return x;
}
function getDataLink(id) {
  for(var i=0;i<globals.linkList.length;i++) {
    if(globals.linkList[i].data.id==id) {
      return globals.linkList[i];
    }
  }
}
function getDataLinks(fromNodeID,toNodeID,direction) {

  var x=[];
  globals.linkList.forEach(function(link,index) {
    switch(direction) {
      case 'same':
        if(link.fromId==Number(fromNodeID)&&link.toId==Number(toNodeID)) {
          x.push(link);
        }
        break;
      case 'opposite':
        if(link.toId==Number(fromNodeID)&&link.fromId==Number(toNodeID)) {
          x.push(link);
        }
        break;
      default:
        if((link.fromId==Number(fromNodeID)&&link.toId==Number(toNodeID))||
					(link.toId==Number(fromNodeID)&&link.fromId==Number(toNodeID))) {
          x.push(link);
        }
        break;
    }
  });
  return x;
}


function getConfigByPrefix(configPrefix) {
  for(var i=0;i<globals.masterConfigs.length;i++) {
    if(globals.masterConfigs[i].prefix==configPrefix) {
      return globals.masterConfigs[i];
    }
  }
}
