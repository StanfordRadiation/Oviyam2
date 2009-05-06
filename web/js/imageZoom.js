
	//Image zoom in/out script
	
	var zoomFlag=false;
	var zoomfactor=0.05 //Enter factor (0.05=5%)
	function zoomhelper(state){
		if (parseInt(whatcache.style.width)>=70){
			whatcache.style.width=(parseInt(whatcache.style.width)+parseInt(whatcache.style.width)*zoomfactor*prefix)+'px';
			//whatcache.style.height=parseInt(whatcache.style.height)+parseInt(whatcache.style.height)*zoomfactor*prefix;
		//	alert(parseInt(whatcache.style.width));

		} 
		if(parseInt(whatcache.style.width)<70 && state=="in") {
			whatcache.style.width='70px';
		//	alert(parseInt(whatcache.style.width));
		}
	}
	
	function zoom(originalW, originalH, what, state){
		if(zoomFlag==true){
		if (!document.all&&!document.getElementById)
		return;
		whatcache=eval("document.images."+what);
		prefix=(state=="in")? 1 : -1;
		if (whatcache.style.width==""||state=="restore"){
			whatcache.style.width=originalW+'px';
			//whatcache.style.height=originalH;
			if (state=="restore")
				return;
		}
		else{
			zoomhelper(state);
		}
		beginzoom=setInterval("zoomhelper('state')",300);
		}
	}
	
	function clearzoom(){
		if (window.beginzoom)
		clearInterval(beginzoom);
	}
	
	function zoomOnOff(){
		
	
		if(zoomFlag==false){		
			zoomFlag=true;
			document.getElementById('zoomInButton').style.visibility="visible";
			document.getElementById('zoomOutButton').style.visibility="visible";
			document.getElementById("zoomButton").style.background="transparent url('images/icons/icn_zoom_on.PNG') no-repeat center 0px ";
			document.getElementById('zoomText').innerHTML="Zoom off";
			
			document.getElementById('zoomText').style.color="#FFFFFF";
			
			
		}else{		
			zoomFlag=false;
			document.getElementById('zoomInButton').style.visibility="hidden";
			document.getElementById('zoomOutButton').style.visibility="hidden";
			document.getElementById("zoomButton").style.background="transparent url('images/icons/icn_zoom_off.PNG') no-repeat center 0px ";
			document.getElementById('zoomText').innerHTML="Zoom on";
			document.getElementById('zoomText').style.color="#616161";
		}	
	}