var windowWidth;
var windowCenter;
var valuesApplied=false;
var queryLength=0;
var WLdrag=false;
var sx,sy,wc,ww;

var isIE = navigator.userAgent.toLowerCase().indexOf('msie') > -1;

function popupQueryOptions() {
	 document.getElementById('searchPane1').style.visibility='visible';
     new Effect.SlideDown('searchPane1',{duration:0.5});

     if(valuesApplied==false) {
        document.getElementById('wc').value = globalWC;
        document.getElementById('ww').value = globalWW;
        onChangeWLsetPreset();
     }
     document.onkeydown = null;
     document.onkeypress = null;
}

function applyCenterAndWidth() {
    windowCenter = document.getElementById('wc').value; 
    windowWidth=document.getElementById('ww').value;
    applyCentAndWidth(windowCenter,windowWidth);
    document.getElementById('preview').checked=false;
    showWindowAttributes(windowCenter,windowWidth);
    valuesApplied=true;
}

function applyCentAndWidth(owc,oww) {
    var ss=document.getElementById('picture').src;
    if(ss.indexOf('&windowCenter')>0) 
       var test = ss.substring(0,ss.indexOf('&windowCenter'));
    else
       var test = ss;

    if(owc==0 && oww==0)
       var s = test;
    else		
       var s = test + '&windowCenter='+owc+'&windowWidth='+oww;
    document.getElementById('picture').src=s;
}

function setPresetValues() {
    if(document.getElementById('preset').selectedIndex==5) {
    	document.getElementById('wc').value=globalWC;
    	document.getElementById('ww').value=globalWW;
    } else {
    	var psvalue=document.getElementById('preset').value;
		document.getElementById('ww').value=psvalue.substring(0,psvalue.indexOf(':'));
		document.getElementById('wc').value=psvalue.substring(psvalue.indexOf(':')+1,psvalue.length);
	} 
	applyPreview();
}

function applyPreview() {
	   if(document.getElementById('preview').checked==true) {
          windowCenter = document.getElementById('wc').value; 
          windowWidth=document.getElementById('ww').value;
		  applyCentAndWidth(windowCenter,windowWidth);
		  showWindowAttributes(windowCenter,windowWidth);
	   }
}

function applyAllValues(){
    isWLAdjusted = true;
    globalWC=document.getElementById('wc').value;
    globalWW=document.getElementById('ww').value;
    showWindowAttributes(globalWC,globalWW);
    applyCenterAndWidth();
}

function onChangeWLsetPreset() {
	var wc2 = document.getElementById('wc').value;
	var ww2 = document.getElementById('ww').value;
	if(wc2==350 && ww2==40)
	   document.getElementById('preset').selectedIndex=0;
	else if(wc2==-600 && ww2==1500)
	   document.getElementById('preset').selectedIndex=1;
	else if(wc2==40 && ww2==80)
	   document.getElementById('preset').selectedIndex=2;
	else if(wc2==480 && ww2==2500)
	   document.getElementById('preset').selectedIndex=3;
	else if(wc2==90 && ww2==350)
	   document.getElementById('preset').selectedIndex=4;
	else
	   document.getElementById('preset').selectedIndex=5;
}

function resetWLValues() {
    applyCentAndWidth(globalWC,globalWW);
    document.getElementById('wc').value = globalWC;
    document.getElementById('ww').value = globalWW;
    onChangeWLsetPreset();
    showWindowAttributes(globalWC,globalWW);
}

function closePopupMenu() {
	new Effect.SlideUp('searchPane1',{duration:0.5});
	document.onkeydown = KeyPress;
	  
	if(valuesApplied==false)
	  resetWLValues();
	return false;
}

function showWindowAttributes(winCenter,winWidth) {
	var windowDesc = "WL: "+winCenter+" WW: "+winWidth;
	if(winCenter==350 && winWidth==40)
		windowDesc += " (Chest/Abdomen/Pelvis)";
	else if(winCenter==-600 && winWidth==1500)
		windowDesc += " (Lung)";
	else if(winCenter==40 && winWidth==80)
		windowDesc += " (Brain)";
	else if(winCenter==480 && winWidth==2500)
		windowDesc += " (Bone)";
	else if(winCenter==90 && winWidth==350)
		windowDesc += " (Head/Neck)";
    document.getElementById('windowLevel').innerHTML=windowDesc;
}

function adjustWLWW(){
	if(WLdrag==false){
		drag=true;
	    isWLAdjusted = true;
		dragMe();
		WLdrag=true;
		document.getElementById("wcButton").style.background="transparent url('images/icons/icn_bricon_on.png') no-repeat center 0px ";
		document.getElementById("wcText").style.color="#FFFFFF";
		
	    var ih = document.getElementById('imageHolder');
        if (ih){
            if (isIE){
                ih.attachEvent("onmousedown",startDrag);
                ih.attachEvent("onmouseup",endDrag);  
                ih.attachEvent("onmousemove", IEMouseMove);
            } else {
                ih.addEventListener("mousedown",startDrag,false);
                ih.addEventListener("mouseup",endDrag,false);
            }
        }
        var wcb = document.getElementById('wcButton');
        if (isIE){   
            wcb.detachEvent("onmouseover",WLMouseOver);
            wcb.detachEvent("onmouseout",WLMouseOut);
        } else if (ih.attachEvent){
            wcb.removeEventListener("mouseover",WLMouseOver,false);
            wcb.removeEventListener("mouseout",WLMouseOut,false);
        }
		
		wc=globalWC;
		ww=globalWW;
	}else{
		WLdrag=false;
		document.getElementById("wcButton").style.background="transparent url('images/icons/icn_bricon_off.png') no-repeat center 0px ";
		document.getElementById("wcText").style.color="#616161";
		
	    var ih = document.getElementById('imageHolder');
	    if (ih){
	        if (isIE){
        	    ih.detachEvent("onmousedown",startDrag);
                ih.detachEvent("onmouseup",endDrag);
                ih.detachEvent("onmousemove", IEMouseMove);
	        } else {
        	    ih.removeEventListener("mousedown",startDrag,false);
                ih.removeEventListener("mouseup",endDrag,false);
	        }   
	    }
		var wcb = document.getElementById('wcButton');
	    if (isIE){
    		wcb.attachEvent("onmouseover",WLMouseOver);
    		wcb.attachEvent("onmouseout",WLMouseOut);
        } else if (ih.detachEvent){
    		wcb.addEventListener("mouseover",WLMouseOver,false);
    		wcb.addEventListener("mouseout",WLMouseOut,false);
        }
	}
}

function startDrag(e) {
   	if(e.preventDefault) {
	  	e.preventDefault();
   	}
   	
   	sx = e.pageX ? e.pageX : e.x;
   	sy = e.pageY ? e.pageY : e.y;
   	
   	return false;
}

function endDrag(e) {
	var srcc=document.getElementById('picture').src;
	
    var ex = e.pageX ? e.pageX : e.x;
	var ey = e.pageY ? e.pageY : e.y;

	if(ex>sx) 
	   ww = parseInt(ww) + (ex-sx);
	else
	   ww = parseInt(ww) - (sx-ex);

	if(ey>sy)
	   wc = parseInt(wc) + (ey-sy);
	else
	   wc = parseInt(wc) - (sy-ey);
	   
	if(parseInt(ww)<=0) 
	   ww=1;

	if(srcc.indexOf('&windowCenter')==-1){
	    srcc += "&windowCenter="+wc+"&windowWidth="+ww;
	}
	else {
		srcc = srcc.substring(0,srcc.indexOf('&windowCenter'));
	    srcc += "&windowCenter="+wc+"&windowWidth="+ww;
	}
	document.getElementById('picture').src=srcc;
   	globalWC=wc;
   	globalWW=ww;
   	showWindowAttributes(wc,ww);
   	valuesApplied=false;
}

function IEMouseMove(e){
    // The mousemove event needs to be cancelled in IE otherwise the mouseup event will not fire after the mouse is dragged.
    return false;   
}

function WLMouseOver(e) {
	document.getElementById("wcButton").style.background="transparent url('images/icons/icn_bricon_on.png') no-repeat center 0px ";
	document.getElementById("wcText").style.color="#FFFFFF";
}

function WLMouseOut(e) {
	document.getElementById("wcButton").style.background="transparent url('images/icons/icn_bricon_off.png') no-repeat center 0px ";
	document.getElementById("wcText").style.color="#616161";
}