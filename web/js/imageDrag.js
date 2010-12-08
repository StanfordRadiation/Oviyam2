	var ie=document.all;
	var nn6=document.getElementById&&!document.all;
	var isdrag=false;
	var x,y;
	var dobj;
	var drag=false;

    // Using jQuery event namespacing here to make it so that once a feature is turned on, it will automatically be disabled
    // when another mode is enabled, this way as we add modes we don't have go back and change the code in every mode.
    // Also removed references to wldrag, since we don't need them if we use the new event model
	function dragMe(){
		drag=true;
		jQuery("#toolBar").data("mode","drag");
		var pic = document.getElementById('picture');
		if (pic){
		    pic.style.cursor="move";
	    }
		//See note in imageMeasure.js about fixing this up
		var dragOff = function(event){
    	       drag=false;
    	       jQuery("#moveButton").removeClass("moveButtonOn").addClass("moveButton");
               jQuery(".toolBarButton").unbind("click.disableMode.Drag");
               jQuery("#moveButton").hover(function(){jQuery(this).addClass("moveButtonHover");},function(){jQuery(this).removeClass("moveButtonHover");});
               jQuery("#moveButton").bind("click.on",dragMe);
               var pic = document.getElementById('picture');
               if (pic){
                   pic.style.cursor="default";
               }
               if( jQuery("#toolBar").data("mode") === "drag"){
                   jQuery("#toolBar").data("mode","none");
               }

    	};
		jQuery("#moveButton").unbind();
		jQuery(".toolBarButton:not(#configButton,#infoButton,#presetButton)").bind("click.disableMode.Drag", dragOff);
		jQuery("#moveButton").removeClass("moveButton").addClass("moveButtonOn");
		
		// We need to take more control over the hover, turn it off when the button is pressed, and remove the class.
		// Using the css hover did not work because it stopped working once we manually manipulated the classes, not exactly sure why though, perhaps once
		// you change the class definition, the engine no longer considers the class to the same? This will work in all browser anyway.
		jQuery("#moveButton").removeClass("moveButtonHover");
	}
	
	function movemouse(e){
		if (isdrag){
			dobj.style.left = (nn6 ? tx + e.clientX - x : tx + event.clientX - x)+'px';
			dobj.style.top  = (nn6 ? ty + e.clientY - y : ty + event.clientY - y)+'px';
			return false;
		}
	}
	
	var zoom=1;
	
	// This is always on, but only does something when drag == true
	function selectmouse(e){
		var fobj       = nn6 ? e.target : event.srcElement;
		var topelement = nn6 ? "HTML" : "BODY";
		while (fobj.tagName != topelement && fobj.className != "dragme"){
			fobj = nn6 ? fobj.parentNode : fobj.parentElement;
		}	
	
		if (fobj.className=="dragme"){
			if(drag==true){
				isdrag = true;
				dobj = fobj;
				tx = parseInt(dobj.style.left+0);
				ty = parseInt(dobj.style.top+0);
				x = nn6 ? e.clientX : event.clientX;
				y = nn6 ? e.clientY : event.clientY;
				document.getElementById('left').onmousemove=movemouse;
				return false;
			}
		}
	}
	
	document.onmousedown=selectmouse;
	document.onmouseup=new Function("isdrag=false");
	
	var xx1;
	var xx2;
	var yy1;
	var yy2;
	
	


function mouseMove(ev){
	ev = ev || window.event;
	var mousePos = mouseCoords(ev);
}

function mouseCoords(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

function mouseDown(ev){
ev = ev || window.event;
	var mousePos = mouseCoords(ev);
	
	xx1= mousePos.x;
	yy1= mousePos.y;


}

function mouseUp(ev){
ev = ev || window.event;
	var mousePos = mouseCoords(ev);
	
	xx2= mousePos.x;
	yy2= mousePos.y;
	
	
	if(drag==true){
		
		DrawLine(xx1,yy1,xx2,yy2,"red");
	}


}

