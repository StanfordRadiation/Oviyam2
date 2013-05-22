var systemDB = null;

jQuery(document).ready(function() {
    jQuery("#loopSlider").slider({
        max:1000,
        value:500
    });
    jQuery("#loopSlider").bind("slidechange", function(event, ui) {
        loopSpeed = parseInt(1000 - ui.value);
        doLoop(jQuery('#loopChkBox').is(':checked'));
    });

    jQuery("#preset").combobox({
    	selected: function(event, ui) {
            changePreset(ui.item.value);
    	}
    });

    jQuery("#presetDiv input").attr('disabled',true);
    jQuery("#presetDiv input").attr('size', '10');
    jQuery("#presetDiv a").css('visibility', 'hidden');

    jQuery('#containerBox .toolbarButton').hover(function() {
        var selected = jQuery('#containerBox').find('.current');
        jQuery(selected).attr('class', 'toolbarButton');
        jQuery(selected).children().attr('class', 'imgOff');
        jQuery(this).attr('class', 'toolbarButton current');
        jQuery(this).children().attr('class', 'imgOn');
        jQuery(this).css('cursor', 'pointer');
    }, function() {
        var selected = jQuery('#containerBox').find('.current');
        jQuery(selected).attr('class', 'toolbarButton');
        jQuery(selected).children().attr('class', 'imgOff');
        jQuery(this).css('cursor', 'auto');
    });

    showSyncSeries();

    var changeTooltipPosition = function(event) {
        var tooltipX = event.pageX - 8;
        var tooltipY = event.pageY + 8;
        jQuery('div.tooltip').css({
            top: tooltipY,
            left: tooltipX
        });
    };

    var showTooltip = function(event) {
        jQuery('div.tooltip').remove();
        jQuery('<div class="tooltip">3D module not installed!!!</div>').appendTo('body');
        changeTooltipPosition(event);
    };

    var hideTooltip = function() {
        jQuery('div.tooltip').remove();
    };

    jQuery('#containerBox').css('background-color', pat.bgColor);

});  // for document.ready


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
