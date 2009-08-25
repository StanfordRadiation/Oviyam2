var pageURL;
var directSeries=0;
	function ajaxpage(containerid, url){
		var page_request = false;
		document.getElementById("loadingView").style.visibility="visible";
		if (window.XMLHttpRequest) // if Mozilla, Safari etc
			page_request = new XMLHttpRequest();
		else if (window.ActiveXObject){ // if IE
			try {
				page_request = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e){
				try{
					page_request = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e){}
			}
		}
		else
			return false;
		
		if(containerid != '' && multiFrames == true) {
		     page_request.open('GET', url, false);
		     page_request.send(null);
		     loadpage(page_request,containerid,url);
		} else if(containerid != '') {
		  	page_request.onreadystatechange=function() {
		  		loadpage(page_request,containerid,url);
		  	}
		  	page_request.open('GET',url,true);
		  	page_request.send(null);
		} else {
			page_request.open('GET', url, false);
			page_request.send(null);
		        if(multiFrames==true) {
			    return(page_request.responseText);
			}
		}
	}
	
	var setImage = false;
	
	function loadpage(page_request, containerid, url){
		if (page_request.readyState == 4 && (page_request.status==200 || window.location.href.indexOf("http")==-1)){
			var pr = page_request.responseText;
			if(pr.indexOf("wado?") >=0)
				document.getElementById(containerid).innerHTML = pr.replace(/wado?/g, "/wado");
			else			
				document.getElementById(containerid).innerHTML=pr;
			
			document.getElementById("loadingView").style.visibility="hidden";

			setPatientInfos();
			
			if(setImage == true){
				
				load();
			
			}
			
			if(directSeries==1){
			 loadSeriesImage();
			 directSeries=0;
			}			
			//urchinTracker(url);
		}
	}
	
	
	function loadSeriesImage(){	
		keynav=1;
		document.getElementById('picture').src=document.getElementById("img0").src;
	
	}
	
	
	function setURL(page){
	
	pageURL = page;
		
	}
