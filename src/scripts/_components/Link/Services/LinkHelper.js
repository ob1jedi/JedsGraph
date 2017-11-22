function LinkHelper() {

  this.FixTextWidth4Link=function(link) { fixTextWidth4Link(link) }
  function fixTextWidth4Link(link) {
    if(link.data.UI.nameTextUI&&link.data.UI.midMarkerUI) {
      var textWidth = link.data.UI.nameTextUI.getBBox().width;
      //link.data.UI.nameTextUI.attr('x',-textWidth/2);
      setUi(link.data.UI.nameTextUI, 'x',-textWidth/2); 
      //link.data.UI.fullUI.attr('labelWidth',textWidth);
      setUi(link.data.UI.fullUI, 'labelWidth',textWidth); 

      if(link.data.UI.subTextUI) {
        var i=0;
        var boxWidth=link.data.UI.subTextUI.getBBox().width;

        while(link.data.UI.subTextUI.childNodes[i]) {
          //$(link.data.UI.subTextUI.childNodes[i]).attr('x',-boxWidth/2);
          setUi(link.data.UI.subTextUI.childNodes[i], 'x',-boxWidth/2); 
          i++;
        }
      }
    }
  }

  this.FixLinkIndexes = function(fromNodeID,toNodeID){fixLinkIndexes(fromNodeID,toNodeID)}; //Get sibling details...
  function fixLinkIndexes(fromNodeID,toNodeID) { //Get sibling details...
    var totalSiblings=0;
    var leftSiblings=0;
    var rightSiblings=0;
    //get sibling information
    globals.linkList.forEach(function(link) {
      if(link.toId==toNodeID&&link.fromId==fromNodeID) {
        totalSiblings++;
        leftSiblings++
      }
      else if(link.toId==fromNodeID&&link.fromId==toNodeID) {
        totalSiblings++;
        rightSiblings++
      }
    });

    globals.linkList.forEach(function(link) {
      if(link.toId==toNodeID&&link.fromId==fromNodeID) {
        //this is a left sibling
        if(totalSiblings==1) { //there is only one sibling so its position will be center 
          setUi(link.data.UI.fullUI, 'linkPos',0);
        } else {
          //add the position of the sibling, (counting down so that widest is always underneath)
          setUi(link.data.UI.fullUI, 'linkPos',leftSiblings--);
        }
      }
      else if(link.toId==fromNodeID&&link.fromId==toNodeID) {
        if(totalSiblings==1) { //there is only one sibling so its position will be center 
          setUi(link.data.UI.fullUI, 'linkPos',0);
        } else {
          //add the position of the sibling, (counting down so that widest is always underneath)
          setUi(link.data.UI.fullUI, 'linkPos',rightSiblings--);
        }
      }
    });
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.ShowLinkDetails=function(link) { showLinkDetails(link) }
  function showLinkDetails(link) {
    //var processingElement=document.getElementById('selectedLink');
    //var labellist=''
    //var html='<p class="panelheader">Selected Link:</a> <p class="dataNameLabel">'+link.data.id+'</p>';
    //html+='<br/><p class="panelheader">Link type</a>: <p class="dataNameLabel">'+link.data.name+'</p>'
    //processingElement.innerHTML=html;

    //html='<a class="panelheader">Properties<a>:';
    //html+='<table style="width:90%;">'
    //var processingElement=document.getElementById('linkDetails');
    //link.data.properties.forEach(function(property,index) {
    //  html+='<tr>'
    //  var button_onclick='showOnNode('+link.data.id+', \''+property.value+'\')';
    //  html+='<td> <p class="dataNameLabel">'+property.key+'</p></td><td><p class="dataValueLabel"> '+property.value+'</p></td>';
    //  html+='</tr>'
    //});
    //html+='</table>'
    //processingElement.innerHTML=html;
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.HighlightRelatedNodes = function(nodeId,isOn){highlightRelatedNodes(nodeId,isOn)}
  function highlightRelatedNodes(nodeId,isOn) {
    // just enumerate all realted nodes and update link color:
    globals.GRAPH.forEachLinkedNode(nodeId,function(node,link) {
      var linkUI=globals.graphics.getLinkUI(link.id);
      if(linkUI) {
        if(!link.data.checked) {
          accentuateLink(link, isOn);
        }
      }
    });
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------		
  this.HighlightDescendantNodes = function(nodeId,isOn){highlightDescendantNodes(nodeId,isOn)}
  function highlightDescendantNodes(nodeId,isOn) {
    // just enumerate all realted nodes and update link color:
    var descendantNodes=[];
    descendantNodes.push(nodeId);
    var i=0;
    while(i<(descendantNodes.length)) {
      var descendantNode=getExistingNode(descendantNodes[i]);
      descendantNode.data.toLinks.forEach(function(link) {
        var linkUI=globals.graphics.getLinkUI(link.id);
        if(linkUI) {
          if(!link.data.checked) {
            accentuateLink(link, isOn);
          }
        }
      });

      descendantNode.data.toNodes.forEach(function(node) {
        if(descendantNodes.indexOf(node.id)<0) { descendantNodes.push(node.id); }
      });

      i++;
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.HighlightAncestorNodes = function(nodeId,isOn){highlightAncestorNodes(nodeId,isOn)}
  function highlightAncestorNodes(nodeId,isOn) {
    var ancestorNodes=[];
    ancestorNodes.push(nodeId);
    var i=0;
    while(i<(ancestorNodes.length)) {
      var ancestorNode=getExistingNode(ancestorNodes[i]);
      ancestorNode.data.fromLinks.forEach(function(link) {
        var linkUI=globals.graphics.getLinkUI(link.id);
        if(linkUI) {
          if(!link.data.checked) {
            accentuateLink(link, isOn);
          }
        }
      });
      ancestorNode.data.fromNodes.forEach(function(node) {
        if(ancestorNodes.indexOf(node.id)<0) { ancestorNodes.push(node.id); }
      });
      i++;
    }
  }

  function accentuateLink(link, isOn){
    setUi(link.data.UI.pathUI, 'stroke',isOn?globals.currentTheme.sourceConfig.displaySettings.linkHighlightColor:link.data.color);
    setUi(link.data.UI.toMarkerUI, 'fill',isOn?globals.currentTheme.sourceConfig.displaySettings.linkHighlightColor:link.data.color);
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.CheckLink=function(link) { checkLink(link) }
  function checkLink(link) {
    showLinkData(link);
    //link.data.UI.pathUI.attr('stroke-width',link.data.sourceConfig.displaySettings.linkThickness*2);
    //link.data.UI.toMarkerUI.attr('stroke-width',link.data.sourceConfig.displaySettings.linkThickness*2);
    //link.data.UI.pathUI.attr('stroke','#99ff33');
    //link.data.UI.toMarkerUI.attr("fill",'#99ff33');

    setUi(link.data.UI.pathUI, 'stroke-width',link.data.sourceConfig.displaySettings.linkThickness*2);
    setUi(link.data.UI.toMarkerUI, 'stroke-width',link.data.sourceConfig.displaySettings.linkThickness*2);    
    setUi(link.data.UI.pathUI, 'stroke','#99ff33');
    setUi(link.data.UI.toMarkerUI, "fill",'#99ff33');

    link.data.checked=true;
    globals.checkedLinks.push(link);
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.UncheckLink=function(link) { uncheckLink(link) }
  function uncheckLink(link) {
    hideLinkData(link);
    //ToDo... //replace all .attr with setUi(xxx, 'yyy',zzz); 
    setUi(link.data.UI.pathUI, 'stroke-width',link.data.sourceConfig.displaySettings.linkThickness);
    setUi(link.data.UI.toMarkerUI, 'stroke-width',link.data.sourceConfig.displaySettings.linkThickness);    
    setUi(link.data.UI.pathUI, 'stroke',link.data.color);
    setUi(link.data.UI.toMarkerUI, "fill",link.data.color);
    link.data.checked=false;
    globals.checkedLinks.map(function(l,index) { if(l.data.id==link.data.id) { globals.checkedLinks.splice(index,1); } })
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.ToggleLink=function(link, bvalue) { toggleLink(link, bvalue) }
  function toggleLink(link, bvalue) {

    if(bvalue==true&&link.data.checked) { return; }
    if(bvalue==false&&!link.data.checked) { return; }
    link.data.checked=!link.data.checked;
    if(link.data.checked) //link must be checked
    {
      checkLink(link);
    }
    else  //link must be unchecked
    {
      uncheckLink(link);
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.HighlightLink = function(link) { highlightLink(link) }
  function highlightLink(link) { //...for mouse-hover only
    showLinkData(link);
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.UnHighlightLink = function(link) { unHighlightLink(link) }
  function unHighlightLink(link) { //...for mouse-hover only
    if(!link.data.checked) {
      hideLinkData(link);
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  function hideLinkData(link) {
    setUi(link.data.UI.fullUI,'labelVisible','false');

    if(!link.data.displayingData) {
      return;
    }
    link.data.displayingData = false;
    if(link.data.UI.nameTextUI) {
      removeUi(link.data.UI.nameTextUI);
    }
    if(link.data.UI.subTextUI) {
      removeUi(link.data.UI.subTextUI);
    }
    $(link.data.UI.fullUI).hide().show();
    //drawLink(link.data.UI.fullUI, {x:0,y:0}, {x:0,y:0});
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  function setUi(ui,attrName,attrValue) {
    if(!ui) return;
    ui.attr( attrName, attrValue );
  }
  function removeUi(ui) {
    if(!ui) return;
    if(!ui.remove) return;
    ui.remove();
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.GetLinkById = function(linkId) { getLinkById(linkId) }
  function getLinkById(linkId) {
    for(var i=0;i<globals.linkList.length;i++)
      if(globals.linkList[i].id==linkId)
        return globals.linkList[i];
    //return globals.linkList.find(function (l) { return l.data.id === linkId });
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  function showLinkData(link) {
    console.log('showing link data');
    setUi(link.data.UI.fullUI, 'labelVisible','true');
    if(link.data.displayingData) { return; }
    link.data.displayingData = true;
    link.data.UI.nameTextUI = globals.CommonUI.linkName.cloneNode();
    link.data.UI.nameTextUI.innerHTML=link.data.displayLabel;
    if(link.data.UI.midMarkerUI) { link.data.UI.midMarkerUI.append(link.data.UI.nameTextUI); }

    if(globals.currentTheme.sourceConfig.displaySettings.showRelationProperties) {
      link.data.UI.subTextUI = globals.CommonUI.linkProps.cloneNode();
      link.data.UI.subTextUI.innerHTML=propertyListToSvgList(link.data.properties,'<tspan x="0" dy="1.2em">','</tspan>');
      if(link.data.UI.midMarkerUI) { link.data.UI.midMarkerUI.append(link.data.UI.subTextUI); }
    }
    fixTextWidth4Link(link);
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  this.RefreshLinkVisual = function(link) { refreshLinkVisual(link) }
  function refreshLinkVisual(link) {
    if(link.data.UI.nameTextUI) { 
      link.data.UI.nameTextUI.innerHTML=link.data.displayLabel; }
    if(link.data.UI.subTextUI) { 
      link.data.UI.subTextUI.innerHTML=propertyListToSvgList(link.data.properties,'<tspan x="0" dy="1.2em">','</tspan>'); }

    //link.data.UI.subTextUI.attr('x', link.data.UI.subTextUI.getBBox().width/2)
    //toggle twice to refresh link...
    toggleLink(link);
    toggleLink(link);
  }
}