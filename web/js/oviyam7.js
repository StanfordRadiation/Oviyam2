	var selected="dkgrey";
	var selection = document.getElementById("black");
	var hidetool=0;
	var hidepatient=0;
	var hidesereis=0;
	var numberOfImages=0;
	var cineloop=0;
	var slideshowspeed=500;
	var whichlink=0;
	var whichimage=0;    
	var numberOfFrames=0;
	var frameSrc;
	var frameNumber=0;
	var ispatientlistvisible=1;
	var patname;
	var globalWW=0,globalWC=0;
    var multiFrames = false;
    var defaultWC,defaultWW;
	var ftv = new Array();
	var fti = 0;
	var fps = 30;
	var selectedInstanceIndex = null;	
	var vlc_controls = null;
	var isWLAdjusted = false;
	var xPixelSpacing = 0;
	var yPixelSpacing = 0;
	var nativeRows = 0;
	var nativeColumns = 0;
	var ajaxDelayTimeout = null;
    var latestAjaxRequest = null;
    var requestSemaphore = 0;
    var measureSafe = false;
    
    // Load all images in a multi-frame ahead of time?
    var enableImageCache = true;
    
    $.noConflict();
    //Setup the toolbar handlers. These needed to be jQuery events, because mixing with regular events and jQuery style events was 
    //causing odd behavior (events added to a click event during a click event were firing on that same click event.)
    jQuery(function(){
        jQuery("#toolBar").data("mode","none");
        jQuery("#wcButton").bind("click.on", adjustWLWW);
        jQuery("#wcButton").hover(function(){jQuery(this).addClass("wcButtonHover");},function(){jQuery(this).removeClass("wcButtonHover");});
        jQuery("#moveButton").bind("click.on", dragMe);
        jQuery("#moveButton").hover(function(){jQuery(this).addClass("moveButtonHover");},function(){jQuery(this).removeClass("moveButtonHover");});
        jQuery("#zoomButton").bind("click.on", zoomOnOff);
        jQuery("#zoomButton").hover(function(){jQuery(this).addClass("zoomButtonHover");},function(){jQuery(this).removeClass("zoomButtonHover");});
    });
    
    
	function setCursor(){
		if(selected=="black"){
			$("black").style.cursor="default";
		}else{
			$("black").style.cursor="pointer";
		}
		
		if(selected=="white"){
			$("white").style.cursor="default";
		}else{
			$("white").style.cursor="pointer";
		}
		if(selected=="ltgrey"){
			$("ltgrey").style.cursor="default";
		}else{
			$("ltgrey").style.cursor="pointer";
		}
		
		if(selected=="dkgrey"){
			$("dkgrey").style.cursor="default";
		}else{
			$("dkgrey").style.cursor="pointer";
		}
	}
	
	
	function scaleIt(v) {
		 var scalePhotos = document.getElementsByClassName('scale-image');
		 floorSize = .26;
		 ceilingSize = 1.0;
		 v = floorSize + (v * (ceilingSize - floorSize));
		 for (i=0; i < scalePhotos.length; i++) {
		 	scalePhotos[i].style.width = (v*226)+'px';
		 }
	}	

	
	
	function gridView(){		
		$('left').style.width="0%";		
		$('left').style.visibility="hidden";
		$('thumbNails').style.width="100%";		
		$('thumbNails').style.height="100%";
		$('thumbNails').style.left="0px";
		$('thumbNails').style.overflow="auto";			
		$('gridView').style.color="#FFFFFF";
		$('mosaicView').style.color="#616161";
		$("mosaicView").style.background="transparent url('images/icons/icn_mosaic_0.gif') no-repeat";
		$("gridView").style.background="transparent url('images/icons/icn_grid_1.gif') no-repeat";		
	}
	
	var imageview=0;
	
	function singleImage(){
		if(imageview==0){
			imageview=1;
			$('left').style.width="99%";
			$('thumbNailHolder').style.visibility="hidden";
			$('thumbNails').style.left="99%";
			$('thumbNails').style.width="5px";			
			
		}else{
			imageview=0;			
			$('left').style.width="70%";
			$('thumbNailHolder').style.visibility="visible";
			$('thumbNails').style.left="70%";
			$('thumbNails').style.width="30%";
			
		}
	}
	
	
	
	function mosaicView(){		
		$('left').style.width="70%";		
		$('left').style.visibility="visible";
		$('thumbNails').style.width="30%";
		$('thumbNails').style.left="70%";		
		$('gridView').style.color="#616161";
		$('mosaicView').style.color="#FFFFFF";
		$("mosaicView").style.background="transparent url('images/icons/icn_mosaic_1.gif') no-repeat";
		$("gridView").style.background="transparent url('images/icons/icn_grid_0.gif') no-repeat";		
	}	
	
	function changeClass(i,c){
		if(document.all)
			 document.all(i).className=c;
		else if($)
			$(i).className=c;
	}
	
	function setImageInfos(totalImages){
		numberOfImages=totalImages;
		setImage = true;
		whichimage=0;
		cineloop=1;
		cineLoop();
		$('loadingText').innerHTML='Loading Images...';
	}	
	var expDate = new Date();
	
	function changeBlack(){
		expDate.setYear( parseInt(expDate.getYear()) + 1 );
		selected="black";
		
		if($('thumbDivider') != null) {
		    var shadows = document.getElementsByClassName('shadow');		
			   for (i=0; i < shadows.length; i++) {
		 		  shadows[i].style.color = '#FFCC00';
		    }
		 
		    var seriesDetails = document.getElementsByClassName('seriesDetails');		
			   for (i=0; i < seriesDetails.length; i++) {
		 		  seriesDetails[i].style.color = '#FFCC00';
		    }
		    $("seriesDivider").style.background="#d9d9d9";
		    $("thumbDivider").style.background="#d9d9d9";

		    $("imagePane").style.background="#000000";
		    $("thumbNails").style.background="#000000";
		    $("seriesPane").style.background="#000000";

		    $("body").style.background="#000000";
		    $("black").style.cursor="default";
		} 
		
		if($("queryResult") != null) {
			document.getElementById('queryBody').style.background='#000000';
			$("queryBody").style.color='#FFFFFF';
		}
		$("black").style.background="transparent url('images/icons/icn_black_backColor.png') no-repeat scroll  0px -18px ";
		$("white").style.background="transparent url('images/icons/icn_white_backColor.png') no-repeat scroll  0px -56px ";
		$("ltgrey").style.background="transparent url('images/icons/icn_ltgrey_backColor.png') no-repeat scroll  0px -56px ";
		$("dkgrey").style.background="transparent url('images/icons/icn_dkgrey_backColor.png') no-repeat scroll  0px -56px ";
		document.cookie="color=#000000;"+expDate+";";
	}
	
	function changeGray(){
		expDate.setYear( parseInt(expDate.getYear()) + 1 );
		document.cookie="color=#262626;"+expDate+";";
		selected="dkgrey";
		
		if($('thumbDivider') != null) {		
		    var shadows = document.getElementsByClassName('shadow');		
			   for (i=0; i < shadows.length; i++) {
		 		  shadows[i].style.color = '#FFCC00';
		     }
		 
		     var seriesDetails = document.getElementsByClassName('seriesDetails');		
			    for (i=0; i < seriesDetails.length; i++) {
		 	  	  seriesDetails[i].style.color = '#FFCC00';
		     }
		     $("seriesDivider").style.background="#d9d9d9";
		     $("thumbDivider").style.background="#d9d9d9";
		     $("body").style.background="#262626";

		     $("imagePane").style.background="#262626";
		     $("thumbNails").style.background="#262626";
		     $("seriesPane").style.background="#262626";

		     $("dkgrey").style.cursor="default";
		} 
		
		if($("queryResult") != null) {
			document.getElementById('queryBody').style.background='#262626';
			$("queryBody").style.color='#d9d9d9';
		}
		
		$("dkgrey").style.background="transparent url('images/icons/icn_dkgrey_backColor.png') no-repeat scroll  0px -18px ";
		$("white").style.background="transparent url('images/icons/icn_white_backColor.png') no-repeat scroll  0px -56px ";
		$("black").style.background="transparent url('images/icons/icn_black_backColor.png') no-repeat scroll  0px -56px ";
		$("ltgrey").style.background="transparent url('images/icons/icn_ltgrey_backColor.png') no-repeat scroll  0px -56px ";
	}
	
	function changeWhite(){
		expDate.setYear( parseInt(expDate.getYear()) + 1 );
		document.cookie="color=#FFFFFF;"+expDate+";";
		selected="white";
		if($('thumbDivider') != null){
		   with($("body").style){
			  background="#FFFFFF";
		   }
	
		   var shadows = document.getElementsByClassName('shadow');		
		   for (i=0; i < shadows.length; i++) {
			   shadows[i].style.color = '#FFCC00';
		   }
		 
		   var seriesDetails = document.getElementsByClassName('seriesDetails');		
		   for (i=0; i < seriesDetails.length; i++) {
			  seriesDetails[i].style.color = '#FFCC00';
		   }
		   $("seriesDivider").style.background="#000000";
		   $("thumbDivider").style.background="#000000";

		   $("imagePane").style.background="#FFFFFF";
		   $("thumbNails").style.background="#FFFFFF";
		   $("seriesPane").style.background="#FFFFFF";

		   $("white").style.cursor="default";
		} 
		
		if($("queryResult") != null) {
			document.getElementById('queryBody').style.background='#FFFFFF';
			$("queryBody").style.color='#000000';
		}
		$("white").style.background="transparent url('images/icons/icn_white_backColor.png') no-repeat scroll  0px -18px ";
		$("black").style.background="transparent url('images/icons/icn_black_backColor.png') no-repeat scroll  0px -56px ";
		$("dkgrey").style.background="transparent url('images/icons/icn_dkgrey_backColor.png') no-repeat scroll  0px -56px ";
		$("ltgrey").style.background="transparent url('images/icons/icn_ltgrey_backColor.png') no-repeat scroll  0px -56px ";
	}
	
	function changeLightGray(){
		expDate.setYear( parseInt(expDate.getYear()) + 1 );
		document.cookie="color=#d9d9d9;"+expDate+";";
		selected="ltgrey";
		
		if($('thumbDivider') != null) {		
		   with($("body").style){
			 background="#d9d9d9";
		   }
		   var shadows = document.getElementsByClassName('shadow');		
		   for (i=0; i < shadows.length; i++) {
			  shadows[i].style.color = '#FFCC00';
		   }
		 
		   var seriesDetails = document.getElementsByClassName('seriesDetails');		
		   for (i=0; i < seriesDetails.length; i++) {
			  seriesDetails[i].style.color = '#FFCC00';
		   }
		   $("seriesDivider").style.background="#000000";
		   $("thumbDivider").style.background="#000000";

		   $("imagePane").style.background="#d9d9d9";
		   $("thumbNails").style.background="#d9d9d9";
		   $("seriesPane").style.background="#d9d9d9";

		   $("ltgrey").style.cursor="default";
		}
		
		if($("queryResult") != null) {
			document.getElementById('queryBody').style.background='#d9d9d9';
			$("queryBody").style.color='#000000';
		}
		$("ltgrey").style.background="transparent url('images/icons/icn_ltgrey_backColor.png') no-repeat scroll  0px -18px ";
		$("white").style.background="transparent url('images/icons/icn_white_backColor.png') no-repeat scroll  0px -56px ";
		$("black").style.background="transparent url('images/icons/icn_black_backColor.png') no-repeat scroll  0px -56px ";
		$("dkgrey").style.background="transparent url('images/icons/icn_dkgrey_backColor.png') no-repeat scroll  0px -56px ";
	}	
	function changeslides(which){
		inc=which;
		whichimage=which;
		var imgsrc = $("img"+which).src;
	    if(isWLAdjusted == true)
			imgsrc += "&windowCenter=" + globalWC + "&windowWidth=" + globalWW;
		setImageAndHeaders(imgsrc);
		$('number').innerHTML="Image "+(inc+1)+" of "+numberOfImages;
		valuesApplied=false;
	}
	
	function changeImages(which){
		inc=which;
		whichimage=which;
		setImageAndHeaders($("img"+which).src);		
	}
	

	var inc=0;
	
	function nextImage(){
		inc++;		
		try{
		    var imgsrc = $("img"+inc).src;
		    
		    if(isWLAdjusted == true)
			    imgsrc += "&windowCenter=" + globalWC + "&windowWidth=" + globalWW;
		    setImageAndHeaders(imgsrc);
		    //showWindowAttributes(globalWC,globalWW);
		    valuesApplied=false;
			changeBorder($("img"+inc));	
			$('number').innerHTML="Image "+(inc+1)+" of "+numberOfImages;
			whichimage=inc;
		}
		catch(e){
			inc=-1;
			
			nextImage();
		}		
	}
	
	function prevImage(){
		inc--;
		try{
		    var imgsrc = $("img"+inc).src;
		    if(isWLAdjusted == true)
			    imgsrc += "&windowCenter=" + globalWC + "&windowWidth=" + globalWW;
		    setImageAndHeaders(imgsrc);
		    //showWindowAttributes(globalWC,globalWW);
		    valuesApplied=false;
			changeBorder($("img"+inc));			
			$('number').innerHTML="Image "+(inc+1)+" of "+numberOfImages;
			whichimage=inc;
		}
		catch(e){
			
			inc=numberOfImages;
			prevImage();
		}	
	}
	
	function setPatientInfos(){
		if(ispatientlistvisible==0)
		{	

			$("patientDisName").style.visibility="visible";
		    //$("patientDisName").innerHTML=$("patname").innerHTML;
		    //window.document.title='Oviyam -'+$("patname").innerHTML;;
		    if(!$('loadingText'))return;
		    else
		    $('loadingText').innerHTML='Loading series...';
		}
	}
	
	function setPatientInfoVisible(patientName){
			
		if(ispatientlistvisible==0)
		{	
			$("patientDisName").style.visibility="visible";
		$("patientDisName").innerHTML=patientName;
		window.document.title='Oviyam -'+patientName;
		if(!$('loadingText'))return;
		else
		$('loadingText').innerHTML='Loading series...';
		}
	}
	
	function showTools(){
		keynav=1;
		inc=0;		
		$('hideButton').style.visibility="visible";
		$('toolBar').style.visibility="visible";
		hideTools();
	}
	
	function hidePatient(){
		if(hidepatient==0){
			hidepatient=1;			
			new Effect.SlideUp('patientDiv',{duration:1.0});			
			$('seriesPane').style.visibility="visible";
			$('imagePane').style.visibility="visible";
			ispatientlistvisible=0;
			$("patientDisName").style.visibility="visible";
			if($('pdf') != null)
    			document.getElementById('pdf').style.display='';
			
			return false;
		}
		else{
			hidepatient=0;
			ispatientlistvisible=1; // This is the patient list from a search result
			new Effect.SlideDown('patientDiv',{duration:1.0});			
			$('seriesPane').style.visibility="hidden";	
			$('imagePane').style.visibility="hidden";
			$("patientDisName").style.visibility="hidden";
			if($('pdf') != null)
    			document.getElementById('pdf').style.display='none';
			
			return false;			
		}		
	}
	
	function hideSeries(){
		
		if(hidesereis==0){
			hidesereis=1;
			$('seriesPane').style.width="0%";
			$('seriesDivider').style.left="0";
			$('imagePane').style.left="5px";
			$('viewSeries').style.color="#616161";
			$("viewSeries").style.background="transparent url('images/icons/icn_series_0.png') no-repeat";
			
		}
		else{
			hidesereis=0;
			$('seriesPane').style.width="200px";
			$('imagePane').style.left="200px";
			$('seriesDivider').style.left="200px";
			
			$('viewPatient').style.color="#616161";			
			$('viewSeries').style.color="#FFFFFF";
			$('gridView').style.color="#616161";
			$('mosaicView').style.color="#616161";
			$("viewSeries").style.background="transparent url('images/icons/icn_series_1.png') no-repeat";
		}
	
	}
	
	
	function hideTools(){
 	    $('toolBar').style.visibility="visible";		
		if(hidetool==0){
			hidetool=1;
			new Effect.SlideDown('toolBar',{duration:1.0});
			$("hideButton").style.background="transparent url('images/buttons/hide_tools1.gif') no-repeat scroll 0px 0px";			
			$('seriesPane').style.top="107px";
			$('seriesDivider').style.top="107px";
			$('imagePane').style.top="107px";
			$('patientDiv').style.top="107px";
		}else{
			hidetool=0;			
			new Effect.SlideUp('toolBar',{duration:1.0});			
			$("hideButton").style.background="transparent url('images/buttons/show_tools.gif') no-repeat scroll 0px 0px";
			$('seriesPane').style.top="57px";
			$('imagePane').style.top="57px";
			$('seriesDivider').style.top="57px";
			$('patientDiv').style.top="57px";
		}
	}
	
	function showHider(){
		
	}
	

	
	function resetAll(){
	    if (!$('picture')){
	        // If this was called before anything was viewed; ignore
	        return;
	    }
	    measureSafe = false;
	    disableMeasure();
		zoomFlag=true;
		zoom(512,512,'picture','restore');
		zoomFlag=false;
		drag=false;
		$("picture").style.cursor="default";
		$('zoomInButton').style.visibility="hidden";
		$('zoomOutButton').style.visibility="hidden";
		$('picture').style.position="relative";
		$('picture').style.top="0px";
		$('picture').style.filter='';
		
		var imageHolder = $('imageHolder');
		if (imageHolder) {
		    var left = imageHolder.style.width/4 ;		
		    $('picture').style.left=left+"px";		
	    }
		// Disable any modes that are currently enabled.
		jQuery("#moveButton").first().trigger("click.disableMode");
	    jQuery("#toolBar").data("mode","none");
		document.getElementById("zoomText").innerHTML="Zoom on";

		var cs = document.getElementById('picture').src;
                if(cs.indexOf('&windowCenter')>0)
                   var rs=cs.substring(0, cs.indexOf('&windowCenter'));
                else
                  var rs = cs;
                document.getElementById('picture').src = rs;

	    globalWC = defaultWC;
        globalWW = defaultWW;
        // Some modes do not have spots to show attributes
        try{
		    showWindowAttributes(globalWC,globalWW);
	    } catch (e) {
	        // We are in video mode with no access to those attributes.
	    }
	}
	
	var moda="";
	var grp="";
	
	function loadFile(){
		var modElements = document.getElementsByName("modality");
		for (var i=0; i < modElements.length; i++) {
			if(modElements[i].checked==true){
		 		moda=modElements[i].value;
		 	}
		}
		var grpElements = document.getElementsByName("group1");
		for (var i=0; i < grpElements.length; i++) {
			if(grpElements[i].checked==true){
				grp=grpElements[i].value;
			}
		}

		if ( grp=="between" && $("from").value=="" && $("to").value=="" )
		{
			alert('From/To date field kept blank...!');
			return;
		}
		
		if((moda=="ALL") && grp=="All Date" && $("patientId").value=="" && $("patientName").value=="" && $("accNo").value=="" && $("birthDate").value==""){
				
			var src = confirm("No filters have been selected. It will take long time to query and display results...!");
			if(src==true){					
				loadPatientInfos(moda,grp);				
			}else{
			}
		}else{
			loadPatientInfos(moda,grp);
		}	
	}
	function resetForm(){
		$('patientId').value="";
		$('patientName').value="";		
		$('accNo').value="";
		$('birthDate').value="";
		$('from').value="";
		$('to').value="";
		document.getElementsByName("modality")[0].checked=true;
		document.getElementsByName("group1")[0].checked=true;
	}
	function loadPatientInfos(moda,grp){
		new Effect.SlideUp('searchPane',{duration:0.5}); 
		
		var filename="patient.jsp?patientId="+$('patientId').value+ 
		"&patientName="+$('patientName').value+
		"&modality="+moda+"&group1="+grp+"&from="+$('from').value+"&to="+$('to').value+"&accessionNumber="+$('accNo').value+"&birthDate="+$('birthDate').value.replace(/\//g,''); 
		
		$('seriesPane').innerHTML="";  // This is causing an issue when multiFrame = yes and the user hits search, not sure where the fix is yet. -JM
		$('imagePane').innerHTML="";	
		sortPatientTable();
	
		hidepatient=1;
		if(hidepatient==1){
			hidePatient();
			ajaxpage('patientDiv', filename );		 // Hacky fix to repair Search in multi frame mode			
			$('viewPatient').style.color="#FFFFFF";			
			$('viewSeries').style.color="#616161";
			$('gridView').style.color="#616161";
			$('mosaicView').style.color="#616161";
			return false;			
		}
	    ajaxpage('patientDiv', filename );        // Hacky fix to repair Search in multi frame mode
		$('loadingText').innerHTML='Loading patient/study details...';
	}
	
	function loadDataSet(url,imgurl){
		if($("mymovie") != null)
			document.getElementById('mymovie').style.visibility = 'hidden';
		
		if(multiFrames == true) {
			$('dataSetImage').src=$("img"+selectedInstanceIndex).src;
			var dataset = $("imgs"+selectedInstanceIndex).name;
		} else {
			$('dataSetImage').src=$("img"+whichimage).src;
			var dataset = $("imgs"+whichimage).name;
		}
	
		$('dataSet').style.visibility="visible";
		$('dataSetPatient').innerHTML=$('patientDisName').innerHTML;
		$('stuDesc').innerHTML=$('patStudyDesc').innerHTML;
		
		dataset = dataset.replace(/amp;/,'');			
		var datasetURL = 'DICOMDataset.do?datasetURL='+dataset;			
		ajaxpage('dataSetHolder',datasetURL);	
	}
		
	function hideDataSet(){
		if($("mymovie") != null)
			$('mymovie').style.visibility = 'visible';
		if($('dataSet').style.visibility != "hidden")
		   $('dataSet').style.visibility="hidden";
	}
		
	function cineLoop(){
		if(borderThumb!='')
			borderThumb.style.border="2px solid transparent";			
		if(cineloop==0){			
			// Disable measuring, can't measure on a moving image.
			// If in measure mode, exit it, doesn't make sense to be measuring while looping.
            if (jQuery("#toolBar").data("mode") === "measure"){
        	    jQuery("#moveButton").first().trigger("click.disableMode");
                jQuery("#toolBar").data("mode","none");
        	}
        	// We disable measure here, but do not set measureSafe to false 
        	// because unless the image actually changes, it is still safe to 
        	// enable it again. We need the measureSafe because it is possible that
        	// while it is safe to Measure, we cannot actually enable it because we are
        	// in cineloop, so we have to know if we can turn it on if cineloop is disabled.
			disableMeasure();
			// Hide DICOM headers, flickering is irritating:
			jQuery("#nativeRes").hide();
			jQuery("#pixelMessage").hide();
    		jQuery("#pixelSpacing").hide();
			cineloop=1;
			$('cineLoop').style.color="#FFFFFF";
			$('cineSlider').style.visibility="visible";
			$('cineLoop').style.background="url(images/icons/icn_play_1.png)  0px center no-repeat";
			slideit();
		}else{
			cineloop=0;
			// If it is safe to turn measure on, do it, otherwise, it will be turned on when the latest 
			// image and data is loaded
			if (measureSafe && !jQuery("#measureButton").data("enabled")){
			    enableMeasure();
			}
		    jQuery("#nativeRes").show();
    		jQuery("#pixelSpacing").show();
    		jQuery("#pixelMessage").show();
			$('cineSlider').style.visibility="hidden";
			$('cineLoop').style.background="url(images/icons/icn_play_0.png)  0px center no-repeat";
			$('cineLoop').style.color="#616161";
		}
	}
	

	function slideit(){
	    // Not sure why looking for nulls here, JMM
	    if(cineloop == 0 ||
	      (multiFrames && $("imgCache"+whichimage) == null) || 
	      (!multiFrames && $("img"+whichimage) == null)) {
    	      return;
    	}
    	
        if(multiFrames == true) {
            // if we send null to setImageAndHeaders, it will keep the existing image, but 
            // change the frame to parameter 2
            setImageAndHeaders(null, whichimage); 
    	    $('number').innerHTML="Frame "+(whichimage+1)+" of "+numberOfImages;
	        if(ftv == null)
		        changeSpeed(slideshowspeed);
	        else
	            changeSpeed(ftv[fti]);
	        fti++;
	        if(fti == numberOfImages-1) {
	            fti = 0;
	        }
       } else {
	       setImageAndHeaders($("img"+whichimage).src); 
    	   $('number').innerHTML="Image "+(whichimage+1)+" of "+numberOfImages;
           $('cineSlider').title = slideshowspeed;
	   }
	   
	   inc=whichimage;
       whichlink=whichimage;
       if (whichimage<numberOfImages-1)
            whichimage++;
       else
            whichimage=0;
       interval = setTimeout("slideit()",slideshowspeed);
	}
	
		
	function changeSpeed(speedval){
		slideshowspeed=parseInt(speedval);			
	}
		
	function sortPatientTable(){
		if($('queryResult')){
			var t = new SortableTable($('queryResult'), 100);
		}else{
			setTimeout("sortPatientTable()",2000);
		}
	}
		
	function addRow(num,pageURL){
		img = $('expand'+num);
		if(img.className=="expand"){			
			img.src="images/TopMinus1.gif";
			img.className="shrink";
		}
		else{			
			img.src="images/TopPlus1.gif";
			img.className="expand";
		}

		if($('div'+num)){	
			new Effect.toggle('seriesHolder'+num,'blind');		
		}else{
			name="seriesHolder"+num;
			var tbl = $(name);
			var div=document.createElement('div');
			div.setAttribute("id","div"+num);
			div.setAttribute("class","seriesinfo");
			div.setAttribute("style","overflow:auto;width:100%;height:auto;");
			tbl.appendChild(div);		
			ajaxpage('div'+num,pageURL);
			return false;
		}

	}
	
	function configServer(aeTitle,hostName,port,wadoPort){
		$('aeTitle').value=aeTitle;
		$('hostName').value=hostName;
		$('port').value=port;
		$('wadoPort').value=wadoPort;
	}
	
  	function loadImages(pageurl){  
  		ajaxpage('imagePane',pageurl); 
  		return false; 	 
  	}
  
  	function load(){
  	    // This will be turned on if it is appropriate
  	    turnOffMeasure();
  	    measureSafe = false;
  	    disableMeasure();
  	    // was numberOfImages
  		for (var i=0; i < jQuery("#thumbNailHolder .scale-item").length; i++) {
  		    
  			$('img'+i).src=$('img'+i).name ;
		}
		
		// We don't want to call the setImage function
		// on dicom objects like KO and SR
		if (jQuery("#img0").hasClass("measurable")){
	        jQuery("#img0").click();
        }
		setImage = false;
		initScroll();  

		if(selected=="black"){
			changeBlack();
		}else if(selected=="white"){
			changeWhite();
		}else if(selected=="ltgrey"){
			changeLightGray();
		}else{
			changeGray();
		}
	}
	
	function initScroll(){
		if($('picture')){
			initMouseWheel();
			return;	
		}else{
			setTimeout("initScroll()",2000);
		}
	}
		
	function wheel(event){
		var delta = 0;
		if (!event) event = window.event;
		if (event.wheelDelta){
			delta = event.wheelDelta / 120;
		}else if (event.detail){		
			delta = -event.detail / 3;
		}
		if (delta) handle(delta);
		if (event.preventDefault) event.preventDefault();
		event.returnValue = false;
	}

	function initMouseWheel(){
		if($('picture')){
			   var picture = $('picture');
	 		if(window.addEventListener)	{
	 	 		picture.addEventListener('DOMMouseScroll', wheel, false);
 	 		}
	 	 	picture.onmousewheel = wheel;
	 	}
	 }

	function handle(delta){
		// We want top fetch image related info when the 
		// user switches images.
		switch (delta > 0){
			case true:
				prevImage();
				break;
			default:
				nextImage();
				break;
		}
	}
	
	var showdetails = 1;
	function showDetails(){
		if(showdetails==1){
			showdetails = 0;
			var details = document.getElementsByClassName('shadow');		
		 	for (i=0; i < details.length; i++) {
		 		details[i].style.visibility = 'hidden';
		 	}
			
		}else{
			showdetails = 1;
			var details = document.getElementsByClassName('shadow');	
			 for (i=0; i < details.length; i++) {
		 		details[i].style.visibility = 'visible';
		 	}
		}
		
	}
	
	var borderThumb='';
	var borderSeries='';
	
	function changeFirstImgBorder(which){	
		var i=0;		
		if(i!=0&& i<2){		
			innerProcess('img0');
		}
		else
		{	i++;	
			setTimeout("innerProcess('img0')",2000);
		}
	}
	
	function innerProcess(which){
	    if(borderThumb==''){
 		   borderThumb=$(which);
		   borderThumb.style.border="2px solid #FF0000";	
        }
	}
	
	function changeBorder(which){	
		if(borderThumb==''){		
			borderThumb = which;
			borderThumb.style.border="2px solid #FF0000";				
		}else{
			borderThumb.style.border="2px solid transparent";
			borderThumb = which;
			borderThumb.style.border="2px solid #FF0000";
		}	
	}
	
	function changeInstanceBorder(ins_id)
	{
		document.getElementById(ins_id).style.border = "2px solid #FF0000";
	}
	
	function changeSeriesBorder(which){	
		if(borderSeries==''){		
			borderSeries = which;
			borderSeries.style.border="1px solid #FF0000";				
		}else{
			borderSeries.style.border="1px solid transparent";
			borderSeries = which;
			borderSeries.style.border="1px solid #FF0000";
		}	
	}

	function setCookie(name, value, expires, path, domain, secure) {
  		var curCookie = name + "=" + escape(value) +
      	((expires) ? "; expires=" + expires.toUTCString() : "") +
      	((path) ? "; path=" + path : "") +
      	((domain) ? "; domain=" + domain : "") +
      	((secure) ? "; secure" : "");
  	document.cookie = curCookie;
	}
 
	function changeSpeed1(ft) {
		stopTimer();		
		if(ft != "\r\n") {
	          ftv = ft.split(":");
                  changeSpeed(ftv[fti]);
		 fps = parseInt(1000/ftv[fti]);
	     }

		cineSlider.dispose();
		cineSlider = new Control.Slider('cineHandle','cineTrack',{axis:'horizontal', minimum:100, maximum:1000, alignX:00,increment:100, sliderValue:0.5});
		$('cineSlider').title = fps+" fps";

		cineSlider.options.onSlide = function(value){
			changeSpeed(1000-(value*1000));
		};
		cineSlider.options.onChange = function(value){
			ftv = null;
			var t1=Math.round(value*(fps*2));
			if(t1<=0) {
 			   t1=1;
			}
			var t2=1000/t1;
			changeSpeed(t2);
			$('cineSlider').title = t1+" fps";
		};
	}
	
	function changeDataset() {
        if($('dataSet').style.visibility != "hidden")
	      loadDataSet('','');
     }
	
	function init_vlc_player() {
		stopTimer();
		
		if( vlc_controls == null) {
			//load plugin
			myvlc = new VLCObject("mymovie", "600", "350");
			myvlc.write($("MPEGContent"));
			
			// load controls
			vlc_controls = new VLCcontrols(myvlc);
		}
	}

	function stopTimer() {
		if(interval != null)
			clearInterval(interval);
	}
	
	function showFullResolution() {
	    var oriPath = $('picture').src;

	    var img_URL = "FullResolution.jsp?imageURL=" + oriPath;
   	    var params  = 'width='+screen.width;
	        params += ',height='+screen.height;
	        params += ',fullscreen=yes';
	        params += ',scrollbars=yes';
	        params += ',titlebar=no';
	        params += ',location=no';
		window.open(img_URL, '' , params);
	  }
	
	  function checkResolution(resolution)
	  {
		if(parseInt(resolution) > 512)
			document.getElementById("full_resolution").style.visibility = "visible";
	  }	
	  
	  function resetLoop() 
	  {
			stopTimer();		
			cineSlider.dispose();
			cineSlider = new Control.Slider('cineHandle','cineTrack',{axis:'horizontal', minimum:100, maximum:1000, alignX:00,increment:100, sliderValue:0.5});
			cineSlider.options.onSlide = function(value){
				changeSpeed(1000-(value*1000));
			};
			cineSlider.options.onChange = function(value){
				changeSpeed(1000-(value*1000));
			};
	  }
	  
      function showDicomHeaderInfo(rows, cols, xSpacing, ySpacing, spacingAttrName, message) {
         
         // Set the native resolution
         jQuery("#nativeRes").html("<p>Native Resolution:"+rows+"px by "+cols+"px</p>");
         
         // Show the user what we are using for measurements
         if ((spacingAttrName === null) || (xSpacing===0) || (ySpacing===0)){
             jQuery("#pixelSpacing").html("Measurements shown in pixels");
         }else{
             jQuery("#pixelMessage").html(message);
             if (xSpacing === ySpacing) {
                 // Spacing is the same, just show as a single value
                 jQuery("#pixelSpacing").html(spacingAttrName + ": " +xSpacing);
             }else{
                 // Two discrete values, show this
                 jQuery("#pixelSpacing").html(spacingAttrName + " Row: "+ySpacing+" , Column: " + xSpacing);
             }
         }
         
      }
      
      function clearDicomHeaderInfo(){
          jQuery("#nativeRes").empty();
          jQuery("#pixelSpacing").empty();
          jQuery("#pixelMessage").empty();
      }
      
      function enableMeasure() {
          if (cineloop) {
              return; // No measuring while in cineloop mode
          } 
          jQuery("#measureButton").data("enabled", true);
          jQuery("#measureButton").bind("click.on", measureOn);
          jQuery("#measureButton").hover(function(){jQuery(this).addClass("measureButtonHover");},function(){jQuery(this).removeClass("measureButtonHover");});
          jQuery("#measureButton").css("cursor","pointer");
      }
      
      function disableMeasure(){
           jQuery("#measureButton").data("enabled", false);
           jQuery("#measureButton").unbind("click.on");
           jQuery("#measureButton").unbind("mouseenter mouseleave");
           jQuery("#measureButton").css("cursor","default");
      }
      
      // Utility function to create an object from a url query string
      function queryString2Object(queryString){
          var regEx = /[?&]([^=]*)=([^&]*)/g;
          var match;
          var obj = {};
          while(match = regEx.exec(queryString)){
              obj[match[1]]=match[2];
          }
          return obj;
      }
      
      // This function changes the center image and requests the associated DICOM data
      function setImageAndHeaders(img, frame){
          turnOffMeasure();
          var stage = jQuery("#picture");
          
          if (img === null){
              if (frame === undefined){
                  frame = 0;
              }
              img = stage.attr('src').replace(/frameNumber=\d*/,"frameNumber="+frame);
          }else{
              var c = queryString2Object(stage.attr('src'));
              var n = queryString2Object(img);
              // If the request is the same as the current image, just change the image, not the 
              // dicom headers
              // This catches multi-frame dicom images and WL/WW modification
              if ((c.study===n.study && c.object===n.object && c.series===n.series)){
                  stage.unbind("load");
                  stage.attr('src',img);
                  return;
              }
          }
          // If there is an outstanding ajax request, abort it now, we are about to make
          // the data it is delivering stale.
          if (latestAjaxRequest){
              latestAjaxRequest.abort();
              latestAjaxRequest = null;
              requestSemaphore--;
          }
          
          // Keep track of the number of outstanding requests we have, only allow measuring when
          // this becomes 0 again.
          requestSemaphore++;
          // Until we find out the specifics of this image, no measuring can be done
          measureSafe = false;
          disableMeasure();
          clearDicomHeaderInfo();
          // The user is seeing a new image now, invalidate old values
          nativeRows = null;
          nativeColumns = null;
          xPixelSpacing  = null;
          yPixelSpacing = null;
          
          var imgLoaded = false;
          var dataLoaded = false;
          
          stage.unbind("load");
          
          stage.load(function(){
              stage.show();
              imgLoaded = true;
              if (dataLoaded){
                  measureSafe = true;
                  enableMeasure();
              }
          });
 
          stage.attr('src',img);
          // Send same url parameters to the DICOM attribute servlet
          var url = "DcmAttr?"+img.split("?")[1];
          
          // Cancel any existing timeout
          if (ajaxDelayTimeout !== null){
                clearTimeout(ajaxDelayTimeout);
                ajaxDelayTimeout = null;
                requestSemaphore--;
          }

          var executeCall = function(){
              ajaxDelayTimeout = null;
              if (latestAjaxRequest !== null){
                  latestAjaxRequest.abort();
                  latestAjaxRequest = null;
                  requestSemaphore--;
              }
              
              latestAjaxRequest = jQuery.ajax({
                  url: url,
                  dataType: 'json',
                  cache: false,
                  success: function(data){
                    latestAjaxRequest = null;
                    if (data !== null){
                        requestSemaphore--;
                    }
                    if (requestSemaphore === 0) {
                        if (data === null || data.status == "error") {
                            return;
                        }
                        
                        if ((globalWC==0) && (globalWW==0)){
                            // Prevent overriding user adjusted values
                            defaultWC=globalWC=data.windowCenter;
                            defaultWW=globalWW=data.windowWidth;
                        }

                        nativeRows = data.nativeRows;
                        nativeColumns = data.nativeColumns; 
                        xPixelSpacing =  data.xPixelSpacing;
                        yPixelSpacing = data.yPixelSpacing;
                        showWindowAttributes(globalWC,globalWW);
                        showDicomHeaderInfo(nativeRows,nativeColumns,xPixelSpacing,yPixelSpacing,data.pixelAttrName,data.pixelMessage);
                        dataLoaded = true;

                        if (imgLoaded){
                            measureSafe = true;
                            enableMeasure();
                        }
                    }
                  },
                  error: function(request){
                     // An error occurred.
                     requestSemaphore--;
                  }});
          };
          
          // When scrolling quickly through images, we wind up making unnecessary
          // ajax calls, wait to see if the user stays on the image before
          // making the call out
          ajaxDelayTimeout = setTimeout(executeCall,150);
	  }

      function loadSeriesHandler(domImage, loadPage, numOfImages, injectID, loadCenter){
          turnOffMeasure();
          measureSafe = false;
          disableMeasure();
          borderThumb='';
          if (numOfImages !== undefined){
              setImageInfos(numOfImages);
          }
          initScroll();
          if (injectID !== undefined){
            jQuery.get(loadPage, function(content){
               jQuery("#imagePane").get(0).innerHTML = content;
               changeSeriesBorder(domImage);
               changeFirstImgBorder('img0');
               ajaxpage(injectID,loadCenter);
            });
          }else{
              ajaxpage("imagePane", loadPage);
              changeSeriesBorder(domImage);
              changeFirstImgBorder('img0');
          }
          
          return false;
      }
      
      function loadStudyDesc(studyDesc) {
          if($('patStudyDesc').innerHTML == "") {
              $('patStudyDesc').innerHTML = studyDesc;
          }
      }
      
      // If measure is on, turn it off
      function turnOffMeasure(){
          if (jQuery("#toolBar").data("mode") === "measure"){
                 jQuery("#moveButton").first().trigger("click.disableMode");
                 jQuery("#toolBar").data("mode","none");
          }
      }
      
      
      var imageCacheTemplate = jQuery.jqotec([
            '<% for (var frameNo = 0; frameNo < this.frames; frameNo++) {%>',
                '<img alt="" id="imgCache<%=frameNo%>" src="<%=this.src%><%=frameNo%>" width="100%">',
            '<% } %>'
      ].join(""));
      
      
      // This function will inject into the DOM an img tag for each image in a multi-frame DICOM image.
      // This used to be done in MultiFrames.jsp, but the code has been moved to the client to 
      // simplify things
      function loadImageCache(img, numberOfFrames){
          if (!enableImageCache){
              return;
          }
          jQuery('#imageCacheHolder').empty().append(jQuery.jqote(imageCacheTemplate, {src:img, frames:numberOfFrames}));
      }
      
      // onClick event for "Cancel" button in Search Panel.
      function cancelButtonClicked() {
    	  if($('mymovie') != null) 
    		  document.getElementById('mymovie').style.visibility='visible'; 
    	  keynav=1; 
    	  new Effect.SlideUp('searchPane',{duration:0.5}); 
  		
    	  if($('pdf') != null)
    		  document.getElementById('pdf').style.display='';

    	  return false;
      }
    
      // onClick event for "Search" button in Page Header
      function searchButtonClicked() {
    	  resetAll(); 
    	  ajaxpage('searchTools','SearchPopup.jsp'); 
    	  new Effect.SlideDown('searchPane',{duration:0.5}); 
    	  document.getElementById('buttons').style.visibility='visible';
    	  document.getElementById('divider').style.visibility='visible';
    	  keynav=0;
    	  keyaplhabet=0; 
    	  hideDataSet(); 
    	  if($('mymovie') != null)
    		  document.getElementById('mymovie').style.visibility='hidden';
    	  if($('pdf') != null)
    		  document.getElementById('pdf').style.display='none';
    	
    	  return false;
      }
