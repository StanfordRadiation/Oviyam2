document.onkeydown = KeyCheck;
var KeyID;

function KeyCheck(e){
	KeyID = (window.event) ? event.keyCode : e.keyCode;	
}

document.onkeypress = KeyPress;       
var keynav=0;
var keyaplhabet=0;

function KeyPress(e){
	if(keynav==1){		
		switch(KeyID){				
			case 37:
				prevImage();
				break;
			
			case 38:
				prevImage();
				break;
				
			case 39:
				nextImage();
				break;	
				
			case 40:
				nextImage();
				break;
				
			case 61:
				nextImage();
				break;
							
			case 71:
				gridView();
				break;
				
			case 73:
				singleImage();
				break;
			case 76:
				cineLoop();
				break;
				
			case 77:
				mosaicView();
				break;	
			case 80:
				hidePatient();
				break;
				
			case 83:
				hideSeries();
				break;
				
			case 84:
				showDetails();
				break;
							
			case 107:
				nextImage();
				break;
					
			case 109:
				prevImage();
				break;
				
			
					
		}
	}
	
	if(KeyID==120){
		keyaplhabet=1;
	}
	
	
	if(keyaplhabet==1){
		switch(KeyID){
		
					
		}
	}
	
	
	
	
	
	
}