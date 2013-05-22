var systemDB = null;
var isSlider = false;

var instances = new Array();

jQuery(document).ready(function() {

    var ht = jQuery(window).height() - 3 + 'px';
    jQuery('body').css('height',ht );

    initFrame();
    loadContextMenu();

    jQuery.get("UserConfig.do", {
        'settings':'viewerSlider',
        'todo':'READ'
    }, function(data){
        if(data.trim() == 'show') {
            isSlider = true;
            loadSlider();
        }
    });

    //jQuery('canvas').addcontextmenu('contextmenu1');

    jQuery("#loopSlider").slider({
        max:1000,
        value:500
    });
    jQuery("#loopSlider").bind("slidechange", function(event, ui) {
        loopSpeed = ui.value;
    });

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


    jQuery('#ImagePane').bind('mousewheel', function(event, delta) {
        if(parent.doMouseWheel) {
            var frmBdr = jQuery(event.target).parent().parent().parent().parent().css('border');
            if(frmBdr.indexOf('none') >= 0) {
                setBorder(event.target);
            }
            var direction = event.originalEvent.wheelDelta > 0 ? 'Up' : 'Down';
            var iNo = null;
            if(direction == 'Up') {
                iNo = jQuery(parent.jcanvas).parent().parent().find('#totalImages').html();
                iNo = iNo.substring(iNo.indexOf(':')+1, iNo.indexOf("/"));
                prevImage(iNo-1);
            } else {
                iNo = jQuery(parent.jcanvas).parent().parent().find('#totalImages').html();
                iNo = iNo.substring(iNo.indexOf(':')+1, iNo.indexOf("/"));
                nextImage(iNo-1);

            }

        //changeImgPosInSeries();
        }
    });

    jQuery(document).bind('keydown', function(e) {
        var iNo = jQuery(parent.jcanvas).parent().parent().find('#totalImages').html();
        iNo = iNo.substring(iNo.indexOf(':')+1, iNo.indexOf("/"));

        if(e.keyCode == 38 || e.keyCode == 37) {
            prevImage(iNo-1);
        } else if(e.keyCode == 40 || e.keyCode == 39) {
            nextImage(iNo-1);
        }
    });

    jQuery("#frameSrc").html(window.location.href);

    var framesCnt = jQuery(parent.document).find('iframe');
    if(framesCnt.size() == 1) {
        jQuery('.seriesImgsIndex', window.parent.document).each(function() {
            var childs = jQuery(this).children();
            var imgCnt = 0;
            childs.each(function() {
                var bgClr = jQuery(this).css('background-color');
                //bgClr = bgClr.substring(bgClr.indexOf('rgb('), bgClr.indexOf(')')+1);

                if(bgClr == 'rgb(255, 0, 0)') {
                    var imgToggle = jQuery(this).parent().next().find('img').attr('src');
                    if(imgToggle == 'images/three.png') {
                        if(imgCnt == 0 || imgCnt==Math.round(childs.size()/2)-1 || imgCnt==childs.size()-1) {
                            jQuery(this).css('background-color', 'rgb(0, 0, 255)');
                        } else {
                            jQuery(this).css('background-color', 'rgb(166, 166, 166)');
                        }
                    } else if(imgToggle == 'images/one.png') {
                        if(imgCnt == 0) {
                            jQuery(this).css('background-color', 'rgb(0, 0, 255)');
                        } else {
                            jQuery(this).css('background-color', 'rgb(166, 166, 166)');
                        }
                    } else if(imgToggle == 'images/all.png') {
                        jQuery(this).css('background-color', 'rgb(0, 0, 255)');
                    }
                }
                imgCnt++;
            });
        });
    } else {
        for(var x=0; x<framesCnt.size(); x++) {
            var serUidTmp = jQuery(framesCnt[x]).contents().find('#frameSrc').html();
            if(serUidTmp != null) {
                var qryStrTmp = window.location.href;
                var actFrmSerUid = getParameter(qryStrTmp, 'seriesUID');
                serUidTmp = getParameter(serUidTmp, 'seriesUID');

                if(typeof serUidTmp != 'undefined') {

                    if(actFrmSerUid != serUidTmp) {
                        serUidTmp = serUidTmp.replace(/\./g, '_');

                        jQuery('.seriesImgsIndex', window.parent.document).each(function() {
                            if(jQuery(this).attr('id') != serUidTmp) {
                                var childs = jQuery(this).children();
                                var imgCnt = 0;
                                childs.each(function() {
                                    var bgClr = jQuery(this).css('background-color');
                                    //bgClr = bgClr.substring(bgClr.indexOf('rgb('), bgClr.indexOf(')')+1);

                                    if(bgClr == 'rgb(255, 0, 0)') {
                                        var imgToggle = jQuery(this).parent().next().find('img').attr('src');
                                        if(imgToggle == 'images/three.png') {
                                            if(imgCnt == 0 || imgCnt==Math.round(childs.size()/2)-1 || imgCnt==childs.size()-1) {
                                                jQuery(this).css('background-color', 'rgb(0, 0, 255)');
                                            } else {
                                                jQuery(this).css('background-color', 'rgb(166, 166, 166)');
                                            }
                                        } else if(imgToggle == 'images/one.png') {
                                            if(imgCnt == 0) {
                                                jQuery(this).css('background-color', 'rgb(0, 0, 255)');
                                            } else {
                                                jQuery(this).css('background-color', 'rgb(166, 166, 166)');
                                            }
                                        } else if(imgToggle == 'images/all.png') {
                                            jQuery(this).css('background-color', 'rgb(0, 0, 255)');
                                        }
                                    }
                                    imgCnt++;
                                });
                            }

                        });
                    }
                }
            }
        } //for
    } //else

    jQuery('body').css('background-color', parent.pat.bgColor);

    if(parent.scrollImages) {
        parent.startStack(jQuery('#canvasLayer2').get(0));
    }

    //To disable zooming
    if(parent.zoomEnabled) {
        //parent.doZoom(jQuery('#imageCanvas').get(0));
        parent.zoomEnabled = false;
        parent.doMouseWheel = true;
        jQuery('#zoomIn', parent.document).removeClass('toggleOff');
        jQuery('#zoomIn', parent.document).children().attr('class', 'imgOff');
    }

    jQuery('#applyWLDiv').click(function() {
        var qryStrTmp = window.location.href;
        var tmp_seruid = getParameter(qryStrTmp, 'seriesUID') + "_1";
        tmp_seruid = tmp_seruid.replace(/\./g, '_');

        var serCont = jQuery('#' + tmp_seruid, parent.document).parent();
        var wc_ww = jQuery('#windowLevel').html().split('/');

        var wind_center = wc_ww[0].match('WL:(.*)')[1].trim();
        var wind_width = wc_ww[1].match('WW:(.*)')[1].trim();

        var imgSrcTmp = serCont.children().get(0).src;
        if(imgSrcTmp.indexOf('Image.do') == -1) {
            serCont.children().each(function() {
                var imgSrc = 'Image.do?serverURL=' + parent.pat.serverURL;
                imgSrc += '&study=' + parent.pat.studyUID;
                imgSrc += '&series=' + jQuery(this).attr('seruid');
                imgSrc += '&object=' + jQuery(this).attr('sopuid');

                if(imgSrc.indexOf('windowCenter') >= 0) {
                    imgSrc = imgSrc.substring(0, imgSrc.indexOf('&windowCenter='));
                }

                imgSrc += '&windowCenter=' + wind_center + '&windowWidth=' + wind_width;
                jQuery(this).attr('src', imgSrc);
            });
        } else {
            serCont.children().each(function() {
                var imgSrc = jQuery(this).attr('src');

                if(imgSrc.indexOf('windowCenter') >= 0) {
                    imgSrc = imgSrc.substring(0, imgSrc.indexOf('&windowCenter='));
                }

                imgSrc += '&windowCenter=' + wind_center + '&windowWidth=' + wind_width;
                jQuery(this).attr('src', imgSrc);
            });
        }

        parent.wlApplied = true;

    });

});  //for document.ready

/*
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

*/

jQuery('#canvasDiv').ready(function() {
    var queryString = window.location.href;
    var frameSize = getParameter(queryString, 'frameSize');
    if(frameSize == null) {
        setBorder(document.getElementById('imageCanvas'));
    }
});

function loadSlider() {
    var qsTmp = window.location.href;
    var serUID = getParameter(qsTmp, 'seriesUID');

    var dbTmp = systemDB;
    var sqlTmp = "select NoOfSeriesRelatedInstances from series where SeriesInstanceUID='" + serUID + "';";
    dbTmp.transaction(function(tx) {
        tx.executeSql(sqlTmp, [], sliderHandler, errorHandler);
    });
}

function sliderHandler(trans, results) {

    var row = results.rows.item(0);

    if(row['NoOfSeriesRelatedInstances'] > 1) {
        jQuery('#trackbar1').slider( {
            range: "min",
            value: imgInc+1,
            min: 1,
            max: row['NoOfSeriesRelatedInstances'],
            slide: onTick
        });
    } else {
        jQuery('#footer').hide();
    }

    jQuery('.ui-slider-handle').css('height', '10px');
    jQuery('.ui-slider-handle').css('width', '10px');
    jQuery('.ui-slider-horizontal').css('height', '.4em');
    jQuery('.ui-slider-horizontal').css('top', '8px');
    jQuery('.ui-slider-horizontal').css('cursor', 'pointer');

}

/*function onTick(value) {
            nextImage(value);
        } */

function onTick(event, ui) {
    nextImage(ui.value - 2);
}

function initFrame() {
    //var queryString = window.top.location.search.substring(1);
    var queryString = window.location.href;
    var seriesUID = getParameter(queryString, 'seriesUID');

    //showDcmAttributeValues();
    var sql = "select SopUID from instance where SeriesInstanceUID='" + seriesUID + "'";
    var sql1 = "select patient.PatientId, PatientName, PatientSex, StudyDate, StudyDescription, ModalityInStudy, ReferringPhysicianName, SeriesDescription, BodyPartExamined, NoOfSeriesRelatedInstances, SopClassUID from patient, study, series where patient.Pk = study.Patient_Pk and study.StudyInstanceUID = series.StudyInstanceUID and SeriesInstanceUID='" + seriesUID + "';";

    systemDB = initDB();
    var myDb = systemDB;
    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], imageHandler, errorHandler);
        tx.executeSql(sql1, [], imageDetailsHandler, errorHandler);
    });
    imgInc = 0;
}

function getParameter(queryString, parameterName) {
    //Add "=" to the parameter name (i.e. parameterName=value);
    var parameterName = parameterName + "=";
    if(queryString.length > 0) {
        //Find the beginning of the string
        var begin = queryString.indexOf(parameterName);
        if(begin != -1) {
            //Add the length (integer) to the beginning
            begin += parameterName.length;
            var end = queryString.indexOf("&", begin);
            if(end == -1) {
                end = queryString.length;
            }
            return unescape(queryString.substring(begin, end));
        }

        return null;
    }
}

function setBorder(canvas) {
    var frames = jQuery(parent.document).find('iframe');
    for(var i=0; i<frames.length; i++) {
        jQuery(frames[i]).contents().find('#contextmenu1').css('display', 'none');
    }
    frames = null;

    if(parent.selectedFrame != null) {
        parent.selectedFrame.css('border','none');
    }
    parent.selectedFrame = jQuery('canvas').parent().parent().parent().parent();
    parent.selectedFrame.css('border','2px solid rgb(0, 255, 0)');

    var modality = null;

    if(jQuery(canvas).attr('id') != 'imageCanvas') {
        parent.jcanvas = jQuery(canvas).parent().find('#imageCanvas').get(0);

        modality = jQuery('#modalityDiv').html();

        if(parent.displayScout) {
            if(modality.indexOf("CT") >= 0) {
                Localizer.hideScoutLine();
                Localizer.drawScoutLineWithBorder();
            } else {
                MRLocalizer.hideScoutLine();
                MRLocalizer.drawScoutLineWithBorder();
            }
        }

        if(parent.scrollImages) {
            parent.startStack(jQuery('#canvasLayer2').get(0));
        }

        return;
    }

    parent.jcanvas = canvas;

    if(parent.displayScout) {
        modality = parent.pat.modality;
        if(modality.indexOf("CT") >= 0) {
            Localizer.hideScoutLine();
            Localizer.drawScoutLineWithBorder();
        } else {
            MRLocalizer.hideScoutLine();
            MRLocalizer.drawScoutLineWithBorder();
        }
    }

    if(parent.scrollImages) {
        parent.startStack(jQuery('#canvasLayer2').get(0));
    }
}
