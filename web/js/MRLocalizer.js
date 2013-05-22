/*var locator = null;
var scoutModel = null;
var zoomPer = null;
var currCanvas = null;
var isLevelLine = false;
var imgPlane = ""; */
var slope = null;

function MRLocalizer() {
    //this.drawScoutLineWithBorder = drawScoutLine;
}

//Static method

MRLocalizer.drawScoutLineWithBorder = function() {
    var imgType = jQuery(parent.jcanvas).parent().parent().find('#imgType').html();
    var frames = jQuery(parent.document).find('iframe');
    var sRefSopUid = jQuery(parent.jcanvas).parent().parent().find('#refSOPInsUID').html();
    var sFORUid = jQuery(parent.jcanvas).parent().parent().find('#forUIDPanel').html();

    var i;
    var destCanvas;

    if(frames.length <= 1) {
        return;
    }

   // if(imgType == 'AXIAL') {
        for(i=0; i<frames.length; i++) {
            if(jQuery(frames[i]).contents().find('html').css('border') != '2px solid rgb(0, 255, 0)') {
                var cSopInsUid = jQuery(frames[i]).contents().find('#frameSrc').html();
                cSopInsUid = cSopInsUid.substring(cSopInsUid.indexOf('objectUID=')+10);
                destCanvas = jQuery(frames[i]).contents().find('#canvasLayer1');
                var cFORUid = jQuery(frames[i]).contents().find('#forUIDPanel').html();
                if( sFORUid == cFORUid) {
    	            //projectSlice(destCanvas.get(0));
                    currCanvas = destCanvas.get(0);
                    //clearCanvas(currCanvas);
                    projectSliceMR('OTHER');
    	        }
            }
        }
    /*} else if(imgType == 'LOCALIZER') {
        for(i=0; i<frames.length; i++) {
            if(jQuery(frames[i]).contents().find('#imgType').html() == 'AXIAL') {
                destCanvas = jQuery(frames[i]).contents().find('canvas');
                currCanvas = destCanvas.get(0);
                projectSlice('LOCALIZER');
            }
        }
    }*/
}

MRLocalizer.hideScoutLine = function() {
    var frames = jQuery(parent.document).find('iframe');
    for(var i=0; i<frames.length; i++) {
        //if(jQuery(frames[i]).contents().find('#imgType').html() == 'LOCALIZER') {
            var localCanvas = jQuery(frames[i]).contents().find('#canvasLayer1').get(0);
            clearCanvas(localCanvas);
            localCanvas = jQuery(frames[i]).contents().find('#canvasLayer2').get(0);
            clearCanvas(localCanvas);
	//}
    }
    isLevelLine = false;
}

MRLocalizer.clearCanvasContent = function() {
    var localCanvas = jQuery(parent.jcanvas).siblings().get(0);
    clearCanvas(localCanvas);
    localCanvas = jQuery(parent.jcanvas).siblings().get(1);
    clearCanvas(localCanvas);
    isLevelLine = false;
}

function projectSliceMR(_imgType) {
    var scoutPos = jQuery(currCanvas).parent().parent().find('#imgPosition').html();
    var scoutOrientation = jQuery(currCanvas).parent().parent().find('#imgOrientation').html();
    var scoutPixelSpacing = jQuery(currCanvas).parent().parent().find('#pixelSpacing').html();
    var imgSize = jQuery(currCanvas).parent().parent().find('#imageSize').html().substring(11).split("x");
    var scoutRow = imgSize[1];
    var scoutColumn = imgSize[0];

    scoutModel = new ScoutLineModel('');
    scoutModel.imgPosition = scoutPos;
    scoutModel.imgOrientation = scoutOrientation;
    scoutModel.pixelSpacing = scoutPixelSpacing;
    scoutModel.rows = scoutRow;
    scoutModel.columns = scoutColumn;

    var zoomLabel = jQuery(currCanvas).parent().parent().find('#zoomPercent').html();
    zoomLabel = zoomLabel.substring(6, zoomLabel.indexOf("%"));
    zoomPer = parseFloat(zoomLabel / 100);

    locator = new SliceLocator();

    if(!isLevelLine) {
        isLevelLine = true;

        var oImgOrient = new ImageOrientation();
        var imgOri = jQuery(currCanvas).parent().parent().find('#imgOrientation').html();
        imgPlane = oImgOrient.getOrientation(imgOri);

        //First slice
        var serUid = jQuery(parent.jcanvas).parent().parent().find('#frameSrc').html();
        serUid = serUid.substring(serUid.indexOf("seriesUID=")+10);
        serUid = serUid.substring(0, serUid.indexOf('&'));

        scoutModel = new ScoutLineModel(serUid);
        scoutModel.getValues("First", _imgType);

        //Last slice
        scoutModel.getValues("Last", _imgType);
    }

    // current slice

    imgPos = jQuery(parent.jcanvas).parent().parent().find('#imgPosition').html();
    imgOrientation = jQuery(parent.jcanvas).parent().parent().find('#imgOrientation').html();
    imgPixelSpacing = jQuery(parent.jcanvas).parent().parent().find('#pixelSpacing').html();
    imgSize = jQuery(parent.jcanvas).parent().parent().find('#imageSize').html().substring(11).split("x");
    imgRow = imgSize[1];
    imgColumn = imgSize[0];

    imgSize = null;
    var cCanvas = jQuery(currCanvas).siblings().get(1);
    clearCanvas(cCanvas);

    var ps = null;
    var cThickLoc = null;
    var cThick = null;

    if(jQuery(parent.jcanvas).parent().parent().find('#imgType').html() != 'LOCALIZER') {
        ps = jQuery(currCanvas).parent().parent().find('#pixelSpacing').html();

        var psArr = ps.split("\\");
    	ps = parseFloat(psArr[0]) / parseFloat(psArr[1]);

    	cThickLoc = jQuery(parent.jcanvas).parent().parent().find('#thickLocationPanel').html();
    	cThick = parseFloat(cThickLoc.match("Thick:(.*)mm Loc")[1]);
    } else {
	ps = jQuery(parent.jcanvas).parent().parent().find('#pixelSpacing').html();

        var psArr = ps.split("\\");
    	ps = parseFloat(psArr[0]) / parseFloat(psArr[1]);

    	cThickLoc = jQuery(currCanvas).parent().parent().find('#thickLocationPanel').html();
    	cThick = parseFloat(cThickLoc.match("Thick:(.*)mm Loc")[1]);
    }

    var thick = cThick * ps * zoomPer;
    thick = thick / 2;

    if(imgPlane == "SAGITTAL") {
        locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing, scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing, imgRow, imgColumn);
        drawLine(parseInt(locator.getBoxUlx()*zoomPer), parseInt(locator.getBoxUly()*zoomPer), parseInt(locator.getBoxLlx()*zoomPer), parseInt(locator.getBoxLly()*zoomPer), cCanvas, "GREEN", null);

        drawLine(parseInt(locator.getBoxUlx()*zoomPer), parseInt(locator.getBoxUly()*zoomPer)+thick, parseInt(locator.getBoxLlx()*zoomPer), parseInt(locator.getBoxLly()*zoomPer)+thick, cCanvas, "GREEN", null);
        drawLine(parseInt(locator.getBoxUlx()*zoomPer), parseInt(locator.getBoxUly()*zoomPer)-thick, parseInt(locator.getBoxLlx()*zoomPer), parseInt(locator.getBoxLly()*zoomPer)-thick, cCanvas, "GREEN", null);

    } else {//if(imgPlane == "CORONAL") {
        locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing, scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing, imgRow, imgColumn);
        drawLine(parseInt(locator.getmAxisLeftx()*zoomPer), parseInt(locator.getmAxisLefty()*zoomPer), parseInt(locator.getmAxisRightx()*zoomPer), parseInt(locator.getmAxisRighty()*zoomPer), cCanvas, "GREEN", null);

        drawLine(parseInt(locator.getmAxisLeftx()*zoomPer), parseInt(locator.getmAxisLefty()*zoomPer)+thick, parseInt(locator.getmAxisRightx()*zoomPer), parseInt(locator.getmAxisRighty()*zoomPer)+thick, cCanvas, "GREEN", null);
        drawLine(parseInt(locator.getmAxisLeftx()*zoomPer), parseInt(locator.getmAxisLefty()*zoomPer)-thick, parseInt(locator.getmAxisRightx()*zoomPer), parseInt(locator.getmAxisRighty()*zoomPer)-thick, cCanvas, "GREEN", null);

    } /*else {
        locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing, scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing, imgRow, imgColumn);
        drawLine(parseInt(locator.getmAxisLeftx()*zoomPer), parseInt(locator.getmAxisLefty()*zoomPer), parseInt(locator.getmAxisRightx()*zoomPer), parseInt(locator.getmAxisRighty()*zoomPer), cCanvas, "GREEN", parseFloat(cThick * ps * zoomPer));

    }*/

    return true;
}

/*function drawLine(x1, y1, x2, y2, canvas, color, lineWidth) {
    var oCtx = canvas.getContext("2d");

    if(lineWidth != null) {
        oCtx.lineWidth = lineWidth;
    }

    oCtx.beginPath();
    oCtx.moveTo(x1, y1);
    oCtx.lineTo(x2, y2);
    oCtx.closePath();
    oCtx.strokeStyle = color;
    oCtx.stroke();
}*/

function projectScoutLineMR(sliceModel) {
    var scoutPos = scoutModel.ImgPosition;
    var scoutOrientation = scoutModel.imgOrientation;
    var scoutPixelSpacing = scoutModel.pixelSpacing;
    var scoutRow = scoutModel.rows;
    var scoutColumn = scoutModel.columns;

    var imgPos = sliceModel.getImgPosition();
    var imgOrientation = sliceModel.getImgOrientation();
    var imgPixelSpacing = sliceModel.getPixelSpacing();
    var imgRow = sliceModel.getRows();
    var imgColumn = sliceModel.getColumns();

    if(imgPlane == "SAGITTAL") {
        locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing, scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing, imgRow, imgColumn);

        var slp = findSlope(parseInt(locator.getBoxUlx()*zoomPer), parseInt(locator.getBoxUly()*zoomPer), parseInt(locator.getBoxLlx()*zoomPer), parseInt(locator.getBoxLly()*zoomPer));
        if(slope == null) {
            slope = slp;
        } else {
            if(slp != slope) {
                clearCanvas(currCanvas);
		return;
            }
	}

        drawLine(parseInt(locator.getBoxUlx()*zoomPer), parseInt(locator.getBoxUly()*zoomPer), parseInt(locator.getBoxLlx()*zoomPer), parseInt(locator.getBoxLly()*zoomPer), currCanvas, "YELLOW", null);
    } else { //if(imgPlane == "CORONAL") {
        locator.projectSlice(scoutPos, scoutOrientation, scoutPixelSpacing, scoutRow, scoutColumn, imgPos, imgOrientation, imgPixelSpacing, imgRow, imgColumn);

        var slp = findSlope(parseInt(locator.getmAxisLeftx()*zoomPer), parseInt(locator.getmAxisLefty()*zoomPer), parseInt(locator.getmAxisRightx()*zoomPer), parseInt(locator.getmAxisRighty()*zoomPer));

        if(slope == null) {
            slope = slp;
        } else {
            if(slp != slope) {
                clearCanvas(currCanvas);
		return;
            }
	}

        drawLine(parseInt(locator.getmAxisLeftx()*zoomPer), parseInt(locator.getmAxisLefty()*zoomPer), parseInt(locator.getmAxisRightx()*zoomPer), parseInt(locator.getmAxisRighty()*zoomPer), currCanvas, "YELLOW", null);
    }
}

/*function clearCanvas(canvas) {
    var oCtx = canvas.getContext("2d");

    // Store the current transformation matrix
    oCtx.save();

    // Use the identity matrix while clearing the canvas
    oCtx.setTransform(1, 0, 0, 1, 0, 0);
    oCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    oCtx.restore();
}*/

function findSlope(x1, y1, x2, y2) {
    var sl = (y2-y1) / (x2-x1);
    return sl;
}
