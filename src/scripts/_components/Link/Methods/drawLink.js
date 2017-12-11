function defineLinkDrawing() {
    //LINKS DRAWING/RENDERING (occurs continuously for every link...)
    //var geom = Viva.Graph.geom();
    globals.graphics.placeLink(function(linkUI,fromPos,toPos) {
        //var linkDataIndex=linkUI.attr('linkDataIndex');
        var linkIndex=linkUI.attr('linkPos');

        var from=fromPos;
        var to=toPos;

        to.x=to.x-from.x;
        to.y=to.y-from.y;

        var skew=(linkIndex)*20*(((linkIndex)%2==0)?-1:1); //...creates a bend in the middle for multiple relationships
        //var curvex = from.x + (to.x - from.x)/2; //...the middle point x
        //var curvey = from.y + (to.y - from.y)/2 + skew;//...the middle point y
        var curvex=(to.x)/2; //...the middle point x
        var curvey=(to.y)/2+skew;//...the middle point y
        linkUI.attr('transform','translate('+fromPos.x+','+fromPos.y+')');

        linkPath=linkUI.childNodes[linkUI.attr('linkPathIndex')];
        for(var i=0;i<linkUI.childNodes.length;i++) {
            var child=linkUI.childNodes[i];
            if(!child) continue;
            if(!child.attr) continue;
            if(!child.attr('refx')) continue;
            child.attr('x',curvex-child.attr('refx'));
            child.attr('y',curvey-child.attr('refy'));
            for(var h=0;h<child.childNodes.length;h++) {
                if(!child.childNodes[h]) continue;
            }
        }

        //Flip the text orientation on relationships so that the text is never upside down...
        if(linkUI.attr('labelVisible')=='true') {
            if(to.x>0&&(linkUI.attr('textOrient')=='0'||linkUI.attr('textOrient')=='-1')) {
                //globals.linkList[Number(linkDataIndex)].data.UI.nameTextUI.attr('transform', 'scale(1,1)');
                //debugger;
                linkUI.childNodes[1].childNodes[0].attr('transform','scale(1,1)');
                linkUI.attr('textOrient','1');

            }
            else if(to.x<0&&(linkUI.attr('textOrient')=='1'||linkUI.attr('textOrient')=='-1')) {
                linkUI.attr('textOrient','0');
                //globals.linkList[Number(linkDataIndex)].data.UI.nameTextUI.attr('transform', 'scale(-1,-1)');
                linkUI.childNodes[1].childNodes[0].attr('transform','scale(-1,-1)');
            }
        }

        var distance=Math.sqrt(Math.pow(to.x,2)+Math.pow(to.y,2));
        var data;
        //Place link line...
        if(linkIndex==0) {
            data='M '+0+' '+0+' L '+curvex+' '+curvey+' L '+to.x+','+to.y;
        } else {
            //var multiplier = (((linkIndex)%2 == 0)?-1:1);
            var arc=linkIndex*(distance);
            data='M0,0 A'+arc+','+arc+' 0 0,0 '+to.x+','+to.y;
        }
        linkPath.attr("d",data); //...DRAW LINE			
        linkPath.attr("stroke-dasharray","0,0");

        var fromNodeRadius=Number(linkUI.attr('fromNodeRadius'));
        var toNodeRadius=Number(linkUI.attr('toNodeRadius'));
        if(linkIndex==0) {
            var linkTextWidth=0;
            if(linkUI.attr('labelVisible')=='true') { linkTextWidth=Number(linkUI.attr('labelWidth'))*10; }

            var firstSegment=((distance/2)-(fromNodeRadius+5))-(linkTextWidth/2);
            var secondSegment=((distance/2)-(toNodeRadius+10))-(linkTextWidth/2);
            //set the dash-pattern of the path, to exclude the node space, and the text space...
            linkPath.attr("stroke-dasharray","0,"+(fromNodeRadius+5)+","+firstSegment+","+linkTextWidth+","+secondSegment+","+(toNodeRadius+10)+",0");
        }

        ////Place arrow marker...		
        //if(linkDataIndex) {
        //    debugger;
            var rad=toNodeRadius/6.5+2.4 //...'2' is the height of the triangle
            //if(globals.linkList[Number(linkDataIndex)]) { globals.linkList[Number(linkDataIndex)].data.UI.toMarkerUI.attr('refX',rad); }
            linkUI.childNodes[2].attr('refX',rad);
        //}

        //Set dashed-pattern if the link is actually a planned link...
        if(linkUI.attr('linkType')=='planned') { linkPath.attr("stroke-dasharray","5,5"); }
    });
}
