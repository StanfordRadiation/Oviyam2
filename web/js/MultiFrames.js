var numberOfFrames;
var frameNumber=1;
  
  function nextFrame(){
  	++frameNumber;
  if(frameNumber>=numberOfFrames){
  frameNumber=0;    	
  }
  setImageAndHeaders(document.getElementById("img"+frameNumber).src);
  }
  
   function prevFrame(){
   	--frameNumber;
   	if(frameNumber<1){
  		frameNumber=numberOfFrames-1;    	
 	 }
  setImageAndHeaders(document.getElementById("img"+frameNumber).src);
    	
  }
  
  var frameslide=1;
  
  function frameSlide(){
  if(frameslide==0)
  	return;
  	
  	nextFrame();
  	setTimeout("frameSlide()",100);
   
  }
  
  function changeslides(which){
  		frameNumber=which;
  		setImageAndHeaders(document.getElementById("img"+which).src);
  		document.getElementById('frameNumber').innerHTML="Frame "+(frameNumber+1)+" of "+numberOfFrames;
  
  }
  
  function stopSlide(){
  
  	frameslide=0;
  
  }
  
  
	function load(){
	  	for (var i=0; i < numberOfFrames; i++) {
	  		document.getElementById('img'+i).src=document.getElementById('img'+i).name ;
	  	}
	}