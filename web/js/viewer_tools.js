var systemDB = null;


jQuery(document).keyup(function(e) {
    var curr = jQuery('#containerBox').find('.current');

    //Executed when RIGHT arrow pressed
    if(e.keyCode == 39) {
        if(curr.length) {
            jQuery(curr).attr('class', 'toolbarButton');
            jQuery(curr).children().attr('class', 'imgOff');
            jQuery(curr).next().attr('class', 'toolbarButton current');
            jQuery(curr).next().children().attr('class', 'imgOn');
        } else {
            jQuery('#containerBox div:first-child').attr('class', 'toolbarButton current');
            jQuery('#containerBox div:first-child').children().attr('class', 'imgOn');
        }
    }

    //Executed when LEFT arrow pressed
    if(e.keyCode == 37) {
        if(curr.length) {
            jQuery(curr).attr('class', 'toolbarButton');
            jQuery(curr).children().attr('class', 'imgOff');
            jQuery(curr).prev().attr('class', 'toolbarButton current');
            jQuery(curr).prev().children().attr('class', 'imgOn');
        } else {
            jQuery('#containerBox div:last-child').attr('class', 'toolbarButton current');
            jQuery('#containerBox div:last-child').children().attr('class', 'imgOn');
        }
    }

    //Executed when ENTER key pressed
    if(e.keyCode == 13) {
        jQuery(curr).attr('class', 'toolbarButton current');
        jQuery(curr).children().attr('class', 'imgOn');

        var featureSelected = jQuery(curr).attr('id');
        switch(featureSelected) {
            case "rotateLeft":
                rotateLeft();
                break;
            case "rotateRight":
                rotateRight();
                break;
            case "vflip":
                flipVertical();
                break;
            case "hflip":
                flipHorizontal();
                break;
            case "zoomIn":
                startZoom();
                break;
            case "zoomOut":
                break;
            case "move":
                moveCanvas();
                break;
            case "invert":
                invert();
                break;
            case "windowing":
                break;
        }

    }

});
