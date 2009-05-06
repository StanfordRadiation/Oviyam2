	var ie=document.all;
	var nn6=document.getElementById&&!document.all;
	var isdrag=false;
	var x,y;
	var dobj;
	var drag=false;


	function dragMe(){
	
	//document.getElementById('picture').onmousemove = mouseMove;
	//document.getElementById('picture').onmousedown = mouseDown; 
	//document.getElementById('picture').onmouseup = mouseUp; 
		if(drag==false){
			WLdrag=true;
			adjustWLWW();
			drag=true;
			document.getElementById('picture').style.cursor="move";
			document.getElementById("moveButton").style.background="transparent url('images/icons/icn_fit_on.png') no-repeat center 0px ";
			document.getElementById("moveText").style.color="#FFFFFF";
		}else{
			drag=false;
			document.getElementById('picture').style.cursor="default";
			document.getElementById("moveButton").style.background="transparent url('images/icons/icn_fit_off.png') no-repeat center 0px ";
			document.getElementById("moveText").style.color="#616161";
		}
	}
	
	function movemouse(e){
		if (isdrag){
			dobj.style.left = (nn6 ? tx + e.clientX - x : tx + event.clientX - x)+'px';
			dobj.style.top  = (nn6 ? ty + e.clientY - y : ty + event.clientY - y)+'px';
			return false;
		}
	}
	
	var zoom=1;
	
	function selectmouse(e){
		var fobj       = nn6 ? e.target : event.srcElement;
		var topelement = nn6 ? "HTML" : "TABLE.TD";
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

