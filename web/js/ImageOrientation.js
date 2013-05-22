function ImageOrientation() {
    this.obliquityThresholdCosineValue = 0.8;
}

ImageOrientation.prototype.getMajorAxisFromPatientRelativeDirectionCosine = function(x, y, z) {
    var axis = null;

    var orientationX = x < 0 ? "R" : "L";
    var orientationY = y < 0 ? "A" : "P";
    var orientationZ = z < 0 ? "F" : "H";

    var absX = Math.abs(x);
    var absY = Math.abs(y);
    var absZ = Math.abs(z);

    if (absX > this.obliquityThresholdCosineValue && absX>absY && absX>absZ) {
        axis=orientationX;
    } else if (absY > this.obliquityThresholdCosineValue && absY>absX && absY>absZ) {
        axis=orientationY;
    } else if (absZ > this.obliquityThresholdCosineValue && absZ>absX && absZ>absY) {
        axis=orientationZ;
    }

    return axis;
}

ImageOrientation.prototype.makeImageOrientationLabelFromImageOrientationPatient = function(rowX, rowY, rowZ, colX, colY, colZ) {
    var label = null;
    var rowAxis = this.getMajorAxisFromPatientRelativeDirectionCosine(rowX,rowY,rowZ);
    var colAxis = this.getMajorAxisFromPatientRelativeDirectionCosine(colX,colY,colZ);

    if ((rowAxis != null) && (colAxis != null)) {
        if (((rowAxis == "R") || (rowAxis == "L")) && ((colAxis == "A") || (colAxis == "P")))
            label="AXIAL";
        else if (((colAxis == "R") || (colAxis == "L")) && ((rowAxis == "A") || (rowAxis == "P")))
            label="AXIAL";
        else if (((rowAxis == "R") || (rowAxis == "L")) && ((colAxis == "H") || (colAxis == "F")))
            label="CORONAL";
        else if (((colAxis == "R") || (colAxis == "L")) && ((rowAxis == "H") || (rowAxis == "F")))
            label="CORONAL";
        else if (((rowAxis == "A") || (rowAxis == "P")) && ((colAxis == "H") || (colAxis == "F")))
            label="SAGITTAL";
        else if (((colAxis == "A") || (colAxis == "P")) && ((rowAxis == "H") || (rowAxis == "F")))
            label="SAGITTAL";
    } else {
        label="OBLIQUE";
    }
    return label;
}

/*ImageOrientation.prototype.makePatientOrientationFromPatientRelativeDirectionCosine = function(x, y, z) {
    var buffer = "";

    var orientationX = x < 0 ? "R" : "L";
    var orientationY = y < 0 ? "A" : "P";
    var orientationZ = z < 0 ? "F" : "H";

    var absX = Math.abs(x);
    var absY = Math.abs(y);
    var absZ = Math.abs(z);

    for (var i=0; i<3; ++i) {
        if (absX>0.0001 && absX>absY && absX>absZ) {
            buffer += orientationX;
            absX = 0;
        } else if (absY>0.0001 && absY>absX && absY>absZ) {
            buffer += orientationY;
            absY = 0;
        } else if (absZ>0.0001 && absZ>absX && absZ>absY) {
            buffer += orientationZ;
            absZ = 0;
        } else {
            break;
        }
    }
    return buffer;
}
*/

ImageOrientation.prototype.getOrientation = function(imageOrientation) {
    var imageOrientationArray = [];
    //var imgOrientation = [];
    imageOrientationArray = imageOrientation.split("\\");
    var _imgRowCosx = parseFloat(imageOrientationArray[0]);
    var _imgRowCosy = parseFloat(imageOrientationArray[1]);
    var _imgRowCosz = parseFloat(imageOrientationArray[2]);
    var _imgColCosx = parseFloat(imageOrientationArray[3]);
    var _imgColCosy = parseFloat(imageOrientationArray[4]);
    var _imgColCosz = parseFloat(imageOrientationArray[5]);

    /* imgOrientation = new Array(2);
    imgOrientation[0] = this.makePatientOrientationFromPatientRelativeDirectionCosine(_imgRowCosx, _imgRowCosy, _imgRowCosz);
    imgOrientation[1] = this.makePatientOrientationFromPatientRelativeDirectionCosine(_imgColCosx, _imgColCosy, _imgColCosz);
    */

    var plane = this.makeImageOrientationLabelFromImageOrientationPatient(_imgRowCosx, _imgRowCosy, _imgRowCosz, _imgColCosx, _imgColCosy, _imgColCosz);
    return plane;

    /* if(plane == "SAGITTAL") {
        imgOrientation[1] = imgOrientation[1].replace("H", "S");
        imgOrientation[1] = imgOrientation[1].replace("F", "I");
    }

    return(imgOrientation[0].substring(0, Math.min(imgOrientation[0].length, 2)) + "\\" + imgOrientation[1].substring(0, Math.min(imgOrientation[1].length, 2)));
    */

}
