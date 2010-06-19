// The lightbox object will represent the image at the center of the screen when measuring is enabled
var lightBox = function(id, pixelSpacing, rows, columns){   
    
    var that = {};
    var dcmImageLink = jQuery("#"+id);
    var dcm = dcmImageLink.get(0);
    var width = dcm.width;
    var height = dcm.height;
    var ratio = height / rows; 
    var imgTop = dcmImageLink.css("top");
    var imgLeft = dcmImageLink.css("left");
    var lightBoxDiv = jQuery('<div id="lightBox" width="'+width+'"></div>');
    var offset = null; // when this was stage.node, moving messed up lines
    var top  = null;
    var left = null;
    
    // Make sure the Raphael Box is in the same spot on the screen as the img tag was.
    // Needs to be relative because it will not retain its position when moved either wise.
    lightBoxDiv.css("top",imgTop).css("left",imgLeft).addClass("dragme");
    
    lightBoxDiv.height(height);
    lightBoxDiv.width(width);
    dcmImageLink.parent().append(lightBoxDiv);
    dcmImageLink.hide();

    var paper = Raphael("lightBox",width,height);
    
    // IE6 and 7 have odd behavior, the box shifts over the right for some reason.
    // This hack fixes that. Webkit also has an very odd bug where it shifts over to the 
    // left even thought the wrapped jquery object should be empty and this should do nothing.
    if (jQuery("#lightBox > div").length > 0) {
        jQuery("#lightBox > div").css("position","relative");
    }
   
    that.paper = paper;
    that.width = width;
    
	var stage = paper.image(dcmImageLink.attr('src'),0,0,width,height);

	var node  = jQuery(stage.node).parent(); // Passing the Raphael Object was not working because it didn't have a node property
	
	// update the ratio after LightBox has been created
	var updateRatio = function(height,rows,spacing){
	    pixelSpacing = pixelSpacing.split(/ /)[0];
	    ratio = height/rows;
	};
	
	var moveCursorOn = function(cursor){
        lightBoxDiv.toggleClass("crosshair",false);
	    lightBoxDiv.toggleClass("move",true);
	    
	};
	that.moveCursorOn = moveCursorOn;
	
	var moveCursorOff = function(cursor){
	    lightBoxDiv.toggleClass("move",false);
	    lightBoxDiv.toggleClass("crosshair",true);
	};
	that.moveCursorOff = moveCursorOff;
	  
    var measureOn = function() {

        // Show the user a crosshair so they know they can measure
        lightBoxDiv.hover(function(){ lightBoxDiv.toggleClass("crosshair",true);}, function(){lightBoxDiv.toggleClass("crosshair",false);});
        var currentRuler = null;
        
        var mouseDown = function (event, movedRuler, seedX, seedY) {
            var x = null;
            var y = null;
            // We need to recalculate this because if the user changes the size of the browser, it can change.
            offset = jQuery(lightBoxDiv).offset(); // when this was stage.node, moving messed up lines
            
            top  = offset.top;
            left = offset.left; 

            if (event == null){
                x = seedX;
                y = seedY;
                currentRuler = movedRuler;
            }else{
                x = event.pageX - left;
                y = event.pageY - top;
                currentRuler = ruler(that,ratio);
            }
            currentRuler.start({x:x,y:y});
            
            jQuery(node).unbind("mousedown");
    
            jQuery(document).mousemove(function (event) {     
                var endX = event.pageX - left;
                var endY = event.pageY - top;
                currentRuler.adjust({x:endX, y:endY});
                return false;
            });
            
            var measureDone = function (event){
                // For ie, we can't bind to the node object for some reason, so we need to prevent a line from drawing 
                // if the user is not inside the image.
                if ((event.pageY > top + height) || (event.pageY < top) || (event.pageX > left + width) || (event.pageX < left)){
                    return;
                }
                
                var endX = event.pageX - left;
                var endY = event.pageY - top;
                
                jQuery(document).unbind("mousemove");
                jQuery(document).unbind("mouseup");
                jQuery(document).unbind("mousedown");

                
                jQuery(node).mousedown(mouseDown);
                if (currentRuler.end({x:endX,y:endY})){
                    // save this  on the object
                }
                currentRuler = null;
            };
                
            jQuery(document).mouseup(measureDone);
            jQuery(document).mousedown(measureDone);
                        
            // Prevent a small square from appearing when clicking on SVGs  #TODO can i  just return false?
            if (event !== null) { 
                event.preventDefault();
                event.stopPropagation();
            }
        };
        that.mouseDown = mouseDown;
        
        jQuery(node).mousedown(mouseDown);
    };
    that.measureOn = measureOn;
    
    var measureOff = function(){
        jQuery(node).unbind("mousedown");
    };
    that.measureOff = measureOff;
    
    // revert back to plain old image tag
    var destroy = function() {
        lightBoxDiv.remove();
        dcmImageLink.show();
    };
    that.destroy = destroy;
    
    return that;
};

