var jcanvas = null;
var loopSpeed = 500;
var timer;
var selectedFrame = null;
var sopClassUID = null;
var wc;
var ww;
var wlApplied = false;
var mousePressed=0;
var imageLoaded=0;
var displayScout = false;
var scrollImages = false;
var drawEnabled = false;
var line = null;
var moveEnabled = false;
var imgNo = 0;
var frameNumber = 1;
var $dialog = jQuery('<div id="dialog3D"></div>');

function rotate(ang) {
    //var canvas = document.getElementById('imageCanvas');
    //canvas = getCurrCanvas();

    var width = canvas.width;
    var height = canvas.height;
    var copy = document.createElement("canvas");
    copy.width = width;
    copy.height = height;
    copy.getContext("2d").drawImage(canvas,0,0,width,height);
    var angle=-parseFloat(ang)*Math.PI/180;
    var dimAngle = angle;
    if(dimAngle > Math.PI*0.5)
        dimAngle = Math.PI-dimAngle;
    if(dimAngle < -Math.PI*0.5)
        dimAngle = -Math.PI-dimAngle;
    var diag = Math.sqrt(width*width+height*height);
    var diagAngle1 = Math.abs(dimAngle)-Math.abs(Math.atan2(height,width));
    var diagAngle2 = Math.abs(dimAngle)+Math.abs(Math.atan2(height,width));
    var newWidth = Math.abs(Math.cos(diagAngle1)*diag);
    var newHeight = Math.abs(Math.sin(diagAngle2)*diag);
    canvas.width = newWidth;
    canvas.height = newHeight;
    var ctx = canvas.getContext("2d");
    ctx.translate(newWidth/2,newHeight/2);
    ctx.rotate(angle);
    ctx.drawImage(copy,-width/2,-height/2);
}

function rotateRight() {
    //jcanvas = document.getElementById('imageCanvas');
    //jcanvas = getCurrCanvas();

    var iNewWidth = jcanvas.width;
    var iNewHeight = jcanvas.height;

    var cpCanvas = document.createElement('canvas');
    cpCanvas.width = iNewWidth;
    cpCanvas.height= iNewHeight;
    cpCanvas.getContext("2d").drawImage(jcanvas, 0, 0);

    jcanvas.width = iNewHeight;
    jcanvas.height= iNewWidth;

    var oCtx = jcanvas.getContext('2d');
    oCtx.clearRect(0,0, iNewWidth, iNewHeight);
    oCtx.save();
    oCtx.rotate(90/180 * Math.PI);
    oCtx.drawImage(cpCanvas, 0, -iNewHeight);
    oCtx.restore();

    rotateRightTextOverlay();
}

function rotateLeft() {
    //jcanvas = document.getElementById('imageCanvas');
    //jcanvas = getCurrCanvas();

    var iNewWidth = jcanvas.width;
    var iNewHeight = jcanvas.height;

    var cpCanvas = document.createElement("canvas");
    cpCanvas.width = iNewWidth;
    cpCanvas.height = iNewHeight;
    cpCanvas.getContext('2d').drawImage(jcanvas, 0, 0);

    jcanvas.width = iNewHeight;
    jcanvas.height= iNewWidth;

    var oCtx = jcanvas.getContext("2d");
    oCtx.clearRect(0, 0, iNewWidth, iNewHeight);
    oCtx.save();
    //oCtx.translate(0, iNewWidth);
    oCtx.rotate(-90/180 * Math.PI);
    oCtx.drawImage(cpCanvas, -iNewWidth, 0);
    //oCtx.drawImage(cpCanvas, 0, 0);
    oCtx.restore();

    rotateLeftTextOverlay();
}

function flipHorizontal() {
    //jcanvas = document.getElementById('imageCanvas');
    //jcanvas = getCurrCanvas();

    var iNewWidth=jcanvas.width;
    var iNewHeight=jcanvas.height;

    var cpCanvas=document.createElement("canvas");
    cpCanvas.width=iNewWidth;
    cpCanvas.height=iNewHeight;
    cpCanvas.getContext("2d").drawImage(jcanvas,0,0);

    var oCtx=jcanvas.getContext("2d");
    oCtx.clearRect(0,0,iNewWidth,iNewHeight);
    oCtx.save();
    oCtx.translate(iNewWidth,0);
    oCtx.scale(-1,1);
    oCtx.drawImage(cpCanvas,0,0);
    oCtx.restore();

    flipOrientationToHorizontal();
}

function flipVertical() {
    //jcanvas = document.getElementById('imageCanvas');
    //jcanvas = getCurrCanvas();

    var iNewWidth=jcanvas.width;
    var iNewHeight=jcanvas.height;

    var cpCanvas=document.createElement("canvas");
    cpCanvas.width=iNewWidth;
    cpCanvas.height=iNewHeight;
    cpCanvas.getContext("2d").drawImage(jcanvas,0,0);

    var oCtx=jcanvas.getContext("2d");
    oCtx.clearRect(0,0,iNewWidth,iNewHeight);
    oCtx.save();
    oCtx.translate(0,iNewHeight);
    oCtx.scale(1,-1);
    oCtx.drawImage(cpCanvas,0,0);
    oCtx.restore();

    flipOrientationToVertical();
}

function invert() {
    //jcanvas = document.getElementById('imageCanvas');
    //jcanvas = getCurrCanvas();

    var iNewWidth = jcanvas.width;
    var iNewHeight = jcanvas.height;

    var oCtx = jcanvas.getContext("2d");
    var dataSrc = oCtx.getImageData(0,0,iNewWidth,iNewHeight);
    var dataDst = oCtx.getImageData(0,0,iNewWidth,iNewHeight);
    var aDataSrc = dataSrc.data;
    var aDataDst = dataDst.data;

    var y = iNewHeight;
    do {
        var iOffsetY = (y-1)*iNewWidth*4;
        var x = iNewWidth;
        do {
            var iOffset = iOffsetY + (x-1)*4;
            aDataDst[iOffset]   = 255 - aDataSrc[iOffset];
            aDataDst[iOffset+1] = 255 - aDataSrc[iOffset+1];
            aDataDst[iOffset+2] = 255 - aDataSrc[iOffset+2];
            aDataDst[iOffset+3] = aDataSrc[iOffset+3];
        } while (--x);
    } while (--y);
    oCtx.putImageData(dataDst,0,0);
}

function moveCanvas(moveDiv) {
    if(zoomEnabled) {
        var zDiv = jQuery('#zoomIn').get(0);
        stopZoom(zDiv);
    }

    if(winEnabled) {
        stopWLAdjustment();
    }

    var canvas = jQuery(jcanvas).parent().children().get(2);
    var tCanvas = jQuery(jcanvas).get(0);
    var ctx=tCanvas.getContext('2d');
    var mouse={
        x:0,
        y:0
    }

    var img=new Image();
    img.src=tCanvas.toDataURL("image/png");

    if(!moveEnabled) {
        moveEnabled = true;

        canvas.onmousemove=function(e){
            mouse={
                x:e.pageX-this.offsetLeft,
                y:e.pageY-this.offsetTop
            };
        }
        canvas.onmousemove=function(e){
            mouse={
                x:e.pageX-this.offsetLeft,
                y:e.pageY-this.offsetTop
            };
        }

        var isDown = false;
        var startCoords = [];
        var last = [0, 0];

        canvas.onmousedown = function(e) {
            isDown = true;

            startCoords = [
            e.offsetX - last[0],
            e.offsetY - last[1]
            ];

            e.preventDefault();
            e.stopPropagation();
            e.target.style.cursor = "url(images/move.png), auto";
        };

        canvas.onmouseup = function(e) {
            isDown = false;

            last = [
            e.offsetX - startCoords[0], // set last coordinates
            e.offsetY - startCoords[1]
            ];

            e.target.style.cursor = "default";
        };

        canvas.onmousemove = function(e) {
            if(!isDown) return;

            var x = e.offsetX;
            var y = e.offsetY;
            ctx.setTransform(1, 0, 0, 1, x - startCoords[0], y - startCoords[1]);
            render(ctx);
        }

        var render = function() {
            ctx.beginPath();
            ctx.save();
            ctx.setTransform(1,0,0,1,0,0);
            //ctx.fillRect(0,0,canvas.width,canvas.height) //fill the background. color is default black
            ctx.clearRect(0,0,canvas.width,canvas.height);  //clear the canvas
            ctx.restore();
            ctx.save();
            ctx.drawImage(img,0,0,img.width,img.height);
            ctx.closePath();
            ctx.restore();
        }

        jQuery(moveDiv).addClass('toggleOff');
        jQuery(moveDiv).children().attr('class', 'imgOn');
    } else {
        stopMove(moveDiv);
    }
}

function stopMove(moveDiv) {
    var canvas = jQuery(jcanvas).parent().children().get(2);
    moveEnabled = false;
    jQuery(moveDiv).removeClass('toggleOff');
    jQuery(moveDiv).children().attr('class', 'imgOff');

    //cancel the mousedown event
    canvas.onmousedown = function(e) {
        if(e.preventDefault) {
            e.preventDefault();
        }
    }
}

/*function moveCanvas() {
    var moveEnabled = jQuery(jcanvas).parent().draggable("option", "disabled");

    var curr = jQuery('#containerBox').find('.current');
    if(moveEnabled) {
        jQuery(jcanvas).parent().draggable({
            cursor: 'crosshair',
            iframeFix: true
        });
        jQuery('#containerBox .toolbarButton').unbind('mouseenter').unbind('mouseleave');
        jQuery(curr).attr('class','toolbarButton current');
    } else {
        jQuery(jcanvas).parent().draggable("destroy");
        jQuery(curr).attr('class', 'toolbarButton');
        jQuery(curr).children().attr('class', 'imgOff');

        doContainerBoxHOver();
    }
} */

var scale = 1.0;
var zoomEnabled = false;

function startZoom(zoomDiv) {
    // stop move if move enabled
    if(moveEnabled) {
        var mvDiv = jQuery('#move').get(0);
        stopMove(mvDiv);
    }

    if(winEnabled) {
        stopWLAdjustment();
    }

    if(!zoomEnabled) {
        zoomEnabled = true;
        doMouseWheel = false;
        jQuery(zoomDiv).addClass('toggleOff');
        jQuery(zoomDiv).children().attr('class', 'imgOn');
        doZoom(jcanvas);
    } else {
        stopZoom(zoomDiv);
    }
}

function stopZoom(zoomDiv) {
    zoomEnabled = false;
    doMouseWheel = true;
    jQuery(zoomDiv).removeClass('toggleOff');
    jQuery(zoomDiv).children().attr('class', 'imgOff');

    //to remove the mousedown event listener
    var kCanvas = jQuery(jcanvas).siblings().get(1);
    kCanvas.removeEventListener('mousedown', mouseDown, false);
    //to enable contextmenu while right click
    jQuery(jcanvas).parent().parent().parent().find('#contextmenu1').css('visibility', 'visible');
    jQuery(jcanvas).parent().parent().parent().find('#contextmenu1').hide();
}

function tmpstartZoom() {
    var sy,dy,yDiff;
    var curr = jQuery('#containerBox').find('.current');

    if(!zoomEnabled) {
        zoomEnabled = true;
        jQuery('#containerBox .toolbarButton').unbind('mouseenter').unbind('mouseleave');
        jQuery(curr).attr('class','toolbarButton current');

        jcanvas = document.getElementById('imageCanvas');

        jQuery('#imageCanvas').mouseup(function(evt) {
            dy = evt.clientY;
            yDiff = sy - dy;
            if(yDiff < 0)
                scale = -1;
            else
                scale = 1;

            draw(scale, Math.abs(yDiff));
        }).mousedown(function(evt) {
            sy = evt.clientY;
        });

    } else {
        zoomEnabled = false;
        jQuery(curr).attr('class', 'toolbarButton');
        jQuery(curr).children().attr('class', 'imgOff');
        jQuery('#imageCanvas').unbind('mousedown').unbind('mouseup');

        doContainerBoxHOver();
    }
}

function draw(scale, yDiff){
    //jcanvas = document.getElementById('imageCanvas');
    //jcanvas = getCurrCanvas();

    var iNewWidth = jcanvas.width;
    var iNewHeight = jcanvas.height;

    var cpCanvas = document.createElement('canvas');
    cpCanvas.width = iNewWidth;
    cpCanvas.height= iNewHeight;
    cpCanvas.getContext("2d").drawImage(jcanvas, 0, 0);

    var per = yDiff / iNewHeight;

    var newWidth = iNewWidth + iNewWidth * per * scale;
    var newHeight = iNewHeight + iNewHeight * per * scale;

    if(newHeight < jcanvas.parentNode.offsetHeight) {
        jcanvas.width = newWidth;
        jcanvas.height = newHeight;
    }

    var context = jcanvas.getContext("2d");
    context.clearRect(0, 0, jcanvas.width, jcanvas.height);
    context.drawImage(cpCanvas, 0, 0, jcanvas.width, jcanvas.height);

    var top = (jcanvas.parentNode.offsetHeight-jcanvas.height) / 2;
    jcanvas.style.marginTop = parseInt(top) + "px";


//context.save();
//context.translate(translatePos.x, translatePos.y);
//context.scale(scale, scale);
//context.drawImage(cpCanvas, -translatePos.x, -translatePos.y);
//context.restore();
}

function doContainerBoxHOver() {
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
}

function doLoop(isChecked) {

    if(isChecked) {
        var qstr = jQuery(jcanvas).parent().parent().find('#frameSrc').html();
        var serUid = getParameter(qstr, 'seriesUID');

        var sql = "select SopUID from instance where SeriesInstanceUID='" + serUid + "'";

        var myDb = initDB();
        myDb.transaction(function(tx) {
            tx.executeSql(sql, [], imageHandler, errorHandler);
        });

        clearInterval(timer);

        timer = setInterval(function() {
            var iNo = jQuery(jcanvas).parent().parent().find('#totalImages').html();
            iNo = iNo.substring(iNo.indexOf(':')+1, iNo.indexOf("/"));
            nextImage(parseInt(iNo)-1);
        }, loopSpeed);
    } else {
        clearInterval(timer);
    }
}

function changeLayout(layoutUrl) {
    jQuery('#contentDiv').html('');
    jQuery('#contentDiv').load(layoutUrl);
    jQuery('#contentDiv').show();

    jQuery("#contentDiv").mouseleave(function() {
        jQuery(this).hide();
    });
}

function getCurrCanvas() {
    var frames = jQuery("iframe");

    if(frames.length == 1) {
        jcanvas = jQuery(frames[0]).contents().find('canvas').get(0);
    } else {
        for (var i = 0; i < frames.length; i++) {
            var canvasBorder = jQuery(frames[i]).contents().find('canvas').css('border-top-color');
            if(canvasBorder == "rgb(0, 255, 0)") {
                jcanvas = jQuery(frames[i]).contents().find('canvas').get(0);
                break;
            }
        }
    }
    //if(jcanvas == null)
    //	jcanvas = document.getElementById("imageCanvas");

    jcanvas = jQuery('#frame1').contents().find('canvas').get(0);

    return jcanvas;
}

function flipOrientationToHorizontal() {
    var tmpLeft, tmpRight;
    tmpLeft = jQuery(jcanvas).parent().parent().find('#imgOriLeft').html();
    tmpRight = jQuery(jcanvas).parent().parent().find('#imgOriRight').html();

    jQuery(jcanvas).parent().parent().find('#imgOriLeft').html(tmpRight);
    jQuery(jcanvas).parent().parent().find('#imgOriRight').html(tmpLeft);
}

function flipOrientationToVertical() {
    var tmpTop, tmpBottom;
    tmpTop = jQuery(jcanvas).parent().parent().find('#imgOriTop').html();
    tmpBottom = jQuery(jcanvas).parent().parent().find('#imgOriBottom').html();

    jQuery(jcanvas).parent().parent().find('#imgOriTop').html(tmpBottom);
    jQuery(jcanvas).parent().parent().find('#imgOriBottom').html(tmpTop);
}

// Text overlay Selected / All
/*function doTextOverlay() {
    var content = '<div><table style="background-color:#CCC;color:#000">';
    content += '<tr><td onclick="overlaySelected()" onmouseover="this.style.background=\'#FF7E00\'" onmouseout="this.style.background=\'none\'" ';
    content += 'style="font-size:11px;">Selected</td></tr><tr><td onclick="overlayAll()" onmouseover="this.style.background=\'#FF7E00\'" ';
    content += 'onmouseout="this.style.background=\'none\'" style="font-size:11px">All</td></tr></table></div>';

    jQuery('#overlayChoice').html('');
    jQuery('#overlayChoice').html(content);
    jQuery('#overlayChoice').show();
}

function overlaySelected() {
    jQuery(jcanvas).parent().parent().find('.textOverlay').toggle();
}

function overlayAll() {
    var frames = jQuery(document).find('iframe');
    for(var i=0; i<frames.length; i++) {
        jQuery(frames[i]).contents().find('.textOverlay').toggle();
    }
} */

function doTextOverlay() {
    var frames = jQuery(document).find('iframe');
    for(var i=0; i<frames.length; i++) {
        jQuery(frames[i]).contents().find('.textOverlay:not(#huDisplayPanel, #applyWLDiv)').toggle();
    }
}

function showSyncSeries() {
    var frames = jQuery(parent.document).find('iframe');
    var forUid = '';
    for(var i=0; i<frames.length; i++) {
        if(forUid == '') {
            forUid = jQuery(frames[i]).contents().find('#forUIDPanel').html();
        }

        var tt = jQuery(frames[i]).contents().find('#forUIDPanel').html();
        if(forUid != tt) {
            break;
        }
    }

    if(i < frames.length) {
        var curr = jQuery('#syncSeries');
        //jQuery(cur).attr('class','toolbarButton current');
        curr.children().get(0).src= 'images/unlink.png';
    } else {
        syncEnabled = true;
        syncSeries();
    }
}

function doSyncSeries() {
    var curr = jQuery('#syncSeries');

    if(!syncEnabled) {
        syncEnabled = true;
        syncSeries();
        //jQuery('#containerBox .toolbarButton').unbind('mouseenter').unbind('mouseleave');
        curr.children().get(0).src= 'images/Link.png';
    //jQuery(curr).attr('class','toolbarButton current');
    } else {
        syncEnabled = false;
        jQuery(curr).attr('class', 'toolbarButton');
        jQuery(curr).children().attr('class', 'imgOff');
        curr.children().get(0).src= 'images/unlink.png';
        doContainerBoxHOver();
    }
}

function rotateRightTextOverlay() {
    var tmpLeft, tmpRight, tmpTop, tmpBottom;

    tmpLeft = jQuery(jcanvas).parent().parent().find('#imgOriLeft').html();
    tmpRight = jQuery(jcanvas).parent().parent().find('#imgOriRight').html();
    tmpTop = jQuery(jcanvas).parent().parent().find('#imgOriTop').html();
    tmpBottom = jQuery(jcanvas).parent().parent().find('#imgOriBottom').html();

    //do rotate text overlay
    jQuery(jcanvas).parent().parent().find('#imgOriTop').html(tmpLeft);
    jQuery(jcanvas).parent().parent().find('#imgOriRight').html(tmpTop);
    jQuery(jcanvas).parent().parent().find('#imgOriBottom').html(tmpRight);
    jQuery(jcanvas).parent().parent().find('#imgOriLeft').html(tmpBottom);
}

function rotateLeftTextOverlay() {
    var tmpLeft, tmpRight, tmpTop, tmpBottom;

    tmpLeft = jQuery(jcanvas).parent().parent().find('#imgOriLeft').html();
    tmpRight = jQuery(jcanvas).parent().parent().find('#imgOriRight').html();
    tmpTop = jQuery(jcanvas).parent().parent().find('#imgOriTop').html();
    tmpBottom = jQuery(jcanvas).parent().parent().find('#imgOriBottom').html();

    //do rotate text overlay
    jQuery(jcanvas).parent().parent().find('#imgOriTop').html(tmpRight);
    jQuery(jcanvas).parent().parent().find('#imgOriRight').html(tmpBottom);
    jQuery(jcanvas).parent().parent().find('#imgOriBottom').html(tmpLeft);
    jQuery(jcanvas).parent().parent().find('#imgOriLeft').html(tmpTop);
}

function doScout(scoutDiv) {
    var curr = jQuery('#containerBox').find('.current');

    if (!displayScout) {
        displayScout = true;
        //var localizer = new Localizer();
        //localizer.drawScoutLineWithBorder();

        var modality = jQuery(jcanvas).parent().parent().find('#modalityDiv').html();
        if(modality.indexOf("CT") >= 0) {
            Localizer.drawScoutLineWithBorder();
        } else {
            MRLocalizer.drawScoutLineWithBorder();
        }

        //jQuery('#containerBox .toolbarButton').unbind('mouseenter').unbind('mouseleave');
        //jQuery(curr).attr('class','toolbarButton current');
        jQuery(scoutDiv).addClass('toggleOff');
        jQuery(scoutDiv).children().attr('class', 'imgOn');
    } else {
        displayScout = false;
        Localizer.hideScoutLine();
        //jQuery(curr).attr('class', 'toolbarButton');
        //jQuery(curr).children().attr('class', 'imgOff');

        //doContainerBoxHOver();
        jQuery(scoutDiv).removeClass('toggleOff');
        jQuery(scoutDiv).children().attr('class', 'imgOff');

    }
}

function do3D() {
    $dialog.load('load3D.html').dialog({
        modal: true,
        resizable: false,
        title: 'Pixel Information',
        width: 300,
        height: 150
    });
}

function start3D(pix_value) {
    var qstr = jQuery(jcanvas).parent().parent().find('#frameSrc').html();
    //var patId = jQuery(jcanvas).parent().parent().find('#patID').html();
    var serUid = getParameter(qstr, 'seriesUID');
    
    var sql = "select patient.PatientId, study.StudyInstanceUID, series.SeriesInstanceUID, ServerURL, DicomURL from patient, study, series where patient.Pk = study.Patient_Pk and study.StudyInstanceUID = series.StudyInstanceUID and SeriesInstanceUID='" + serUid + "';";

    //var sql = "select PatientId, study.StudyInstanceUID, ServerURL from patient, study where patient.Pk = study.Patient_Pk and PatientId = '" + patId + "'";
    //    var myDb = systemDB;
    var myDb = initDB();
    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], function(trans, results) {
            var row = results.rows.item(0);
            jQuery.post("CopyDicomFiles.do", {
                "patientId":row['PatientId'],
                "studyUID":row['StudyInstanceUID'],
                "seriesUID":row['SeriesInstanceUID'],
                "dcmURL":row['DicomURL'],
                "serverURL":row['ServerURL']
            }, function(data) {
                //console.log(data + ":" + pix_value);
                window.open("./show3d.jsp?dirPath="+data+"&pixelValue="+pix_value, "_blank");
            });
        }, errorHandler);
    });
}

function doStack(stackDiv) {
    //var stkCanvas = jQuery(jcanvas).siblings().get(1);
    var stkCanvas = jQuery(jcanvas).parent().children().get(2);
    var curr = jQuery('#containerBox').find('.current');

    if(!scrollImages) {
        scrollImages = true;

        startStack(stkCanvas);

        //jQuery('#containerBox .toolbarButton').unbind('mouseenter').unbind('mouseleave');
        //jQuery(curr).attr('class','toolbarButton current');

        jQuery(stackDiv).addClass('toggleOff');
        jQuery(stackDiv).children().attr('class', 'imgOn');
    } else {
        scrollImages = false;
        //jQuery(curr).attr('class', 'toolbarButton');
        //jQuery(curr).children().attr('class', 'imgOff');

        //doContainerBoxHOver();

        jQuery(stackDiv).removeClass('toggleOff');
        jQuery(stackDiv).children().attr('class', 'imgOff');

        jQuery(stkCanvas).unbind('mousedown').unbind('mouseup');
    }
}

function startStack(canvasTmp) {
    var oy, ny;
    var cnt = 0;
    var inc = 5;

    jQuery(canvasTmp).mousedown(function(e) {
        oy = e.pageY;

        jQuery(canvasTmp).mousemove(function(e) {
            ny = e.pageY;

            if( (oy-ny) > inc) {
                var iNo = jQuery(jcanvas).parent().parent().find('#totalImages').html();
                iNo = iNo.substring(iNo.indexOf(':')+1, iNo.indexOf("/"));
                prevImage(iNo-1);
                oy = ny;
            } else if((oy-ny) < -(inc)) {
                var iNo = jQuery(jcanvas).parent().parent().find('#totalImages').html();
                iNo = iNo.substring(iNo.indexOf(':')+1, iNo.indexOf("/"));
                nextImage(iNo-1);
                oy = ny;
            }
        });  //mousemove

        e.preventDefault();
        e.stopPropagation();
        e.target.style.cursor = "url(images/layer.png), auto";

    }); //mousedown

    jQuery(canvasTmp).mouseup(function(e) {
        jQuery(canvasTmp).unbind("mousemove");
        e.target.style.cursor = "default";
    });

}

// To view in fullscreen
function doFullScreen(fullscreenDiv) {
    var fsImg = jQuery(fullscreenDiv).children().get(0);
    var viewContent = document.getElementById('optional-container');
    if(!window.fullScreenApi.isFullScreen()) {
        window.fullScreenApi.requestFullScreen(viewContent);
        fsImg.src = 'images/fullscreen0.png';
    } else {
        window.fullScreenApi.cancelFullScreen(viewContent);
        fsImg.src = 'images/fullscreen1.png';
    }
}

function showMetaData() {
    var qryStr = jQuery(jcanvas).parent().parent().find('#frameSrc').html();
    var seriesUID = getParameter(qryStr, 'seriesUID');

    var sql = "select study.StudyInstanceUID, ServerURL, SeriesInstanceUID from study, series where study.StudyInstanceUID = series.StudyInstanceUID and SeriesInstanceUID = '" + seriesUID + "';";
    var myDb = initDB();
    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], handleURL, errorHandler);
    });
}

function handleURL(transaction, results) {
    var row = results.rows.item(0);

    var queryString = jQuery(jcanvas).parent().parent().find("#frameSrc").html();
    var insUID = getParameter(queryString, 'objectUID');

    var url = "Image.do?serverURL=" + row['ServerURL'];
    url += '&contentType=application/dicom&study=' + row['StudyInstanceUID'];
    url += '&series=' + row['SeriesInstanceUID'];
    url += '&object=' + insUID;
    url += '&transferSyntax=1.2.840.10008.1.2';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
        if (this.status == 200) {
            var myBlob = this.response;
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                var dicomParser = new ovm.dicom.DicomParser(evt.target.result);
                dicomParser.parseAll();

                // tag list table (without the pixel data)
                var data = dicomParser.dicomElements;
                data.PixelData.value = "...";

                var node = document.createElement('div');
                // new table
                var table = ovm.html.toTable(data);
                table.className = "tagList";

                // append new table
                node.appendChild(table);
                // display it
                node.style.display='';

                // table search form
                var tagSearchform = document.createElement("form");
                tagSearchform.setAttribute("class", "filter");
                var input = document.createElement("input");
                input.onkeyup = function() {
                    ovm.html.filterTable(input, table);
                };

                var span = document.createElement("span");
                span.innerHTML = "Search: ";
                tagSearchform.appendChild(span);
                tagSearchform.appendChild(input);
                node.insertBefore(tagSearchform, table);

                jQuery(node).dialog({
                    title: 'Meta-data',
                    modal: true,
                    height: 500,
                    width: 700
                });
            };

            reader.readAsBinaryString(myBlob);
        }
    };
    xhr.send();
}

function doMeasurement() {
    measureOn();

/* var tmpLayer = new ovm.html.Layer('canvasLayer2');
    tmpLayer.init();
    var tmpCanvas = tmpLayer.getCanvas();
    //var tmpCanvas = jQuery(jcanvas).parent().children().get(2);

    if(line == null) {
        line = new ovm.tool.Line();
    }

    if(!drawEnabled) {
        drawEnabled = true;
	tmpCanvas.addEventListener("mousedown", line.mousedown, false);
    	tmpCanvas.addEventListener("mousemove", line.mousemove, false);
    	tmpCanvas.addEventListener("mouseup", line.mouseup, false);
   } else {
        drawEnabled = false;
   	tmpCanvas.removeEventListener("mousedown", line.mousedown, false);
   	tmpCanvas.removeEventListener("mousemove", line.mousemove, false);
   	tmpCanvas.removeEventListener("mouseup", line.mouseup, false);
   } */
}

function resetActiveFrame() {
    var instNo = jQuery(jcanvas).parent().parent().find('#totalImages').html();
    instNo = instNo.substring(instNo.indexOf(':')+1, instNo.indexOf("/"));

    var frameSrc = jQuery(jcanvas).parent().parent().find("#frameSrc").html();
    var sUID = getParameter(frameSrc, 'seriesUID');

    var url = 'frameContent.html?seriesUID=' + sUID;
    url += '&instanceNumber=' + parseInt(instNo-1);

    var act_frame = getActiveFrame();
    act_frame.src = url;

    jQuery('.toggleOff').removeClass('toggleOff');
    jQuery('.current').removeClass('current');
    jQuery('.imgOn').removeClass().addClass('imgOff');


    if(winEnabled) {
        stopWLAdjustment();
    }

    scrollImages = false;
    moveEnabled = false;

}