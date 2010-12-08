// This file contains the handlers called when the user clicks on the measure icon.
function measureOn(evt){
        var lb = null;
        jQuery("#measureButton").removeClass("measureButton").addClass("measureButtonOn");
        lb = lightBox("picture");
        if (cineloop == 1){
            cineLoop();
        }
        
        lb.measureOn();
        jQuery("#toolBar").data("mode","measure");
        // Change the measure button so it disables measuring the next time it is clicked.
        // Disable measuring whenever the user clicks on the other toolbar buttons (except config or info)
        // Originally I attempted to apply the click.disableMeasure to the measureButton as well, the thought being that
        // the next time anyone clicked on any buttons, it would turn this off (even the measure button), the problem with this was
        // if the user clicked measure, then move, for example, measure would turn off, but move would register its turn off in the same click
        // and then it would immedtately be turned off, because jQuery was allowing a click event that was registered during the event to go off.
        // I think this had to do with mixing on the onClick events, and jQuery events.
       
        var turnOff = function(event) {
             jQuery("#measureButton").removeClass("measureButtonOn").addClass("measureButton");
             jQuery(".toolBarButton").unbind("click.disableMode.Measure");
             jQuery("#measureButton").bind("click.on", measureOn);
             lb.measureOff();
             lb.destroy();
             jQuery("#measureButton").hover(function(){jQuery(this).addClass("measureButtonHover");},function(){jQuery(this).removeClass("measureButtonHover");});
             if (jQuery("#toolBar").data("mode") === "measure"){
                 jQuery("#toolBar").data("mode","none");
             }
             setImageAndHeaders(jQuery("#picture").get(0).src);
        };
        
        jQuery("#measureButton").unbind();
        jQuery(".toolBarButton:not(#configButton,#infoButton)").bind("click.disableMode.Measure", turnOff);
        jQuery("#measureButton").removeClass("measureButtonHover");

};

