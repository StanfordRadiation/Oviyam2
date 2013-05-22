function SliceLocator() {
    this.scoutRowCosx = 0;
    this.scoutRowCosy = 0;
    this.scoutRowCosz = 0;
    this.scoutColCosx = 0;
    this.scoutColCosy = 0;
    this.scoutColCosz = 0;
    this.scoutx = 0;
    this.scouty = 0;
    this.scoutz = 0;
    this.imgRowCosx = 0;
    this.imgRowCosy = 0;
    this.imgRowCosz = 0;
    this.imgColCosx = 0;
    this.imgColCosy = 0;
    this.imgColCosz = 0;
    this.imgx = 0;
    this.imgy = 0;
    this.imgz = 0;
    this.nrmCosX = 0;
    this.nrmCosY = 0;
    this.nrmCosZ = 0;
    this.scoutxSpacing = 0;
    this.scoutySpacing = 0;
    this.imgxSpacing = 0;
    this.imgySpacing = 0;
    this.scoutValid = false;
    this.imgValid = false;
    this.scoutPosX = 0;
    this.scoutPosY = 0;
    this.scoutPosZ = 0;
    this.scoutRowLen = 0;
    this.scoutColLen = 0;
    this.scoutRows = 0;
    this.scoutCols = 0;
    this.imgRowLen = 0;
    this.imgColLen = 0;
    this.imgRows = 0;
    this.imgCols = 0;
    this.boxUlx = 0;
    this.boxUly = 0;
    this.boxUrx = 0;
    this.boxUry = 0;
    this.boxLrx = 0;
    this.boxLry = 0;
    this.boxLlx = 0;
    this.boxLly = 0;
    this.mAxisTopx = 0;
    this.mAxisTopy = 0;
    this.mAxisRightx = 0;
    this.mAxisRighty = 0;
    this.mAxisBottomx = 0;
    this.mAxisBottomy = 0;
    this.mAxisLeftx = 0;
    this.mAxisLefty = 0;

    this.getBoxLlx = function() {
        return this.boxLlx;
    }

    this.getBoxLly = function() {
        return this.boxLly;
    }

    this.getBoxLrx = function() {
    	return this.boxLrx;
    }

    this.getBoxLry = function() {
    	return this.boxLry;
    }

    this.getBoxUlx = function() {
        return this.boxUlx;
    }

    this.getBoxUly = function() {
    	return this.boxUly;
    }

    this.getBoxUrx = function() {
        return this.boxUrx;
    }

    this.getBoxUry = function() {
        return this.boxUry;
    }

    this.getmAxisBottomx = function() {
        return this.mAxisBottomx;
    }

    this.getmAxisBottomy = function() {
        return this.mAxisBottomy;
    }

    this.getmAxisLeftx = function() {
        return this.mAxisLeftx;
    }

    this.getmAxisLefty = function() {
        return this.mAxisLefty;
    }

    this.getmAxisRightx = function() {
        return this.mAxisRightx;
    }

    this.getmAxisRighty = function() {
        return this.mAxisRighty;
    }

    this.getmAxisTopx = function() {
        return this.mAxisTopx;
    }

    this.getmAxisTopy = function() {
        return this.mAxisTopy;
    }

    this.projectSlice = projectSlicing;
}

SliceLocator.prototype.setScoutPosition = function (scoutPosition) {
    var retVal = true;
    var _scoutPositionArray = [];
    // set the member variables
    // _mScoutx, _mScouty, _mScoutz to the actual position information
    // if the input pointer is null or the string is empty set all position to 0 and
    // set the position valid flag (_mScoutvalid) to false
    retVal = this.checkPosString(scoutPosition);
    if (retVal) {
    	_scoutPositionArray = scoutPosition.split("\\");
        this.scoutx = parseFloat(_scoutPositionArray[0]);
        this.scouty = parseFloat(_scoutPositionArray[1]);
        this.scoutz = parseFloat(_scoutPositionArray[2]);
    	this.scoutValid = true;
    } else {
	// The Pos contains no valid information it is assumed that the sout position is to be clweared of all valid
        // entries
        this.clearScout();
    }
    return (retVal);
}

SliceLocator.prototype.setScoutOrientation = function(scoutOrientation) {
    var retVal;
    var scoutOrientationArray = [];
    // Scna the sout orientation vactor into the local variables and chack it for validity
    retVal = this.checkVectorString(scoutOrientation);
    if (retVal) {
    	scoutOrientationArray = scoutOrientation.split("\\");
        this.scoutRowCosx = parseFloat(scoutOrientationArray[0]);
        this.scoutRowCosy = parseFloat(scoutOrientationArray[1]);
    	this.scoutRowCosz = parseFloat(scoutOrientationArray[2]);
        this.scoutColCosx = parseFloat(scoutOrientationArray[3]);
        this.scoutColCosy = parseFloat(scoutOrientationArray[4]);
        this.scoutColCosz = parseFloat(scoutOrientationArray[5]);
        this.scoutValid = this.checkScoutVector();
        if (!this.scoutValid) {
            this.clearScout();
        }
    }
    return (retVal);
}

SliceLocator.prototype.clearScout = function() {
    // clear all the scout parameters and set the scout valid flag to false.
    this.scoutRowCosx = 0;
    this.scoutRowCosy = 0;
    this.scoutRowCosz = 0;
    this.scoutColCosx = 0;
    this.scoutColCosy = 0;
    this.scoutColCosz = 0;
    this.scoutx = 0;
    this.scouty = 0;
    this.scoutz = 0;
    this.scoutValid = false;
}

SliceLocator.prototype.clearImg = function() {
    // clear all the image prameters and set the image valid flag to false.
    this.imgRowCosx = 0;
    this.imgRowCosy = 0;
    this.imgRowCosz = 0;
    this.imgColCosx = 0;
    this.imgColCosy = 0;
    this.imgColCosz = 0;
    this.imgx = 0;
    this.imgy = 0;
    this.imgz = 0;
    this.imgValid = false;
}

SliceLocator.prototype.setImgPosition = function(imagePosition) {
    var retVal = true;
    var _imgPositionArray = [];
    // set the member variables
    // _mImgx, _mImgy, _mImgz to the actual position information
    // if the input pointer is null or the string is empty set all position to 0 and
    // set the position valid flag (_mImgvalid) to false
    retVal = this.checkPosString(imagePosition);
    if (retVal) {
    	// the position information contains valid data.  It has been checked prior to
        // the activation of theis member function
        _imgPositionArray = imagePosition.split("\\");
        this.imgx = parseFloat(_imgPositionArray[0]);
        this.imgy = parseFloat(_imgPositionArray[1]);
        this.imgz = parseFloat(_imgPositionArray[2]);

        this.imgValid = true;
    } else {
    	// The Pos contains no valid information it is assumed that the sout position is to be clweared of all valid
        // entries
        this.clearImg();
    }
    return (retVal);
}

SliceLocator.prototype.setImgOrientation = function(imageOrientation) {
    var retVal;
    var imageOrientationArray = [];
    // Scna the sout orientation vactor into the local variables and chack it for validity
    retVal = this.checkVectorString(imageOrientation);
    if (retVal) {
    	imageOrientationArray = imageOrientation.split("\\");
        this.imgRowCosx = parseFloat(imageOrientationArray[0]);
        this.imgRowCosy = parseFloat(imageOrientationArray[1]);
        this.imgRowCosz = parseFloat(imageOrientationArray[2]);
        this.imgColCosx = parseFloat(imageOrientationArray[3]);
        this.imgColCosy = parseFloat(imageOrientationArray[4]);
        this.imgColCosz = parseFloat(imageOrientationArray[5]);
        this.imgValid = this.checkImgVector();

        if (!this.imgValid) {
            this.clearImg();
        }
    }
    return (retVal);
}

SliceLocator.prototype.checkScoutVector = function() {
    var retVal;

    // check the row vector and check the column vector
    retVal = this.checkVector(this.scoutRowCosx, this.scoutRowCosy, this.scoutRowCosz);
    retVal = this.checkVector(this.scoutColCosx, this.scoutColCosy, this.scoutColCosz);
    return (retVal);
}

SliceLocator.prototype.checkImgVector = function() {
    var retVal;
    // check the row vector and check the column vector
    retVal = this.checkVector(this.imgRowCosx, this.imgRowCosy, this.imgRowCosz);
    retVal = this.checkVector(this.imgColCosx, this.imgColCosy, this.imgColCosz);
    return (retVal);
}

SliceLocator.prototype.checkPosString = function(position) {
    var retVal = true;
    var positionArray = [];
    positionArray = position.split("\\");
    for (var i = 0; i < positionArray.length; i++) {
     	if (positionArray[i].match("((-|\\+)?[0-9]+(\\.[0-9]+)?)+")) {
            retVal = true;
        } else {
            retVal = false;
        }
    }
    //I just want to check the existance of the numeric values in the position.
    return retVal;
}

SliceLocator.prototype.checkVectorString = function(vector) {
    var retVal = true;
    var vectorArray = [];
    vectorArray = vector.split("\\");
    for (var i = 0; i < vectorArray.length; i++) {
    	if (vectorArray[i].match("((-|\\+)?[0-9]+(\\.[0-9]+)?)+")) {
            retVal = true;
        } else {
            retVal = false;
        }
    }
    //I just want to check the existance of the vector string.
    return retVal;
}

SliceLocator.prototype.checkVector = function(CosX, CosY, CosZ) {
    // Check if the vector passed is a unit vector
    if (Math.abs(CosX * CosX + CosY * CosY + CosZ * CosZ - 1) < 0) {
    	return (false);
    } else {
    	return (true);
    }
}

SliceLocator.prototype.normalizeScout = function() {
    // first create the scout normal vector
    this.nrmCosX = this.scoutRowCosy * this.scoutColCosz - this.scoutRowCosz * this.scoutColCosy;
    this.nrmCosY = this.scoutRowCosz * this.scoutColCosx - this.scoutRowCosx * this.scoutColCosz;
    this.nrmCosZ = this.scoutRowCosx * this.scoutColCosy - this.scoutRowCosy * this.scoutColCosx;
    return (this.checkVector(this.nrmCosX, this.nrmCosY, this.nrmCosZ));
}

SliceLocator.prototype.setScoutSpacing = function(scoutPixelSpacing) {
    //  Convert the pixelspacing for the scout image and return true if both values are > 0
    // the pixel spacing is specified in adjacent row/adjacent column spacing
    // in this code ..xSpacing refers to column spacing
    var scoutPixelSpacingArray = [];
    scoutPixelSpacingArray = scoutPixelSpacing.split("\\");
    this.scoutxSpacing = parseFloat(scoutPixelSpacingArray[1]);
    this.scoutySpacing = parseFloat(scoutPixelSpacingArray[0]);
    if (this.scoutxSpacing == 0 || this.scoutySpacing == 0) {
        return (false);
    } else {
    	return (true);
    }
}

SliceLocator.prototype.setImgSpacing = function(imgPixelSpacing) {
    //  Convert the pixelspacing for the Img image and return true if both values are > 0
    // the pixel spacing is specified in adjacent row/adjacent column spacing
    // in this code ..xSpacing refers to column spacing
    var imgPixelSpacingArray = [];
    imgPixelSpacingArray = imgPixelSpacing.split("\\");

    this.imgxSpacing = parseFloat(imgPixelSpacingArray[1]);
    this.imgySpacing = parseFloat(imgPixelSpacingArray[0]);
    if (this.imgxSpacing == 0 || this.imgySpacing == 0) {
    	return (false);
    } else {
    	return (true);
    }
}

SliceLocator.prototype.rotateImage = function(imgPosx, imgPosy, imgPosz) {
    // projet the points passed into the space of the normalized scout image

    this.scoutPosX = this.scoutRowCosx * imgPosx + this.scoutRowCosy * imgPosy + this.scoutRowCosz * imgPosz;
    this.scoutPosY = this.scoutColCosx * imgPosx + this.scoutColCosy * imgPosy + this.scoutColCosz * imgPosz;
    this.scoutPosZ = this.nrmCosX * imgPosx + this.nrmCosY * imgPosy + this.nrmCosZ * imgPosz;
    return (true);
}

SliceLocator.prototype.setScoutDimensions = function() {
    this.scoutRowLen = this.scoutRows * this.scoutxSpacing;
    this.scoutColLen = this.scoutCols * this.scoutySpacing;

    return (true);
}

SliceLocator.prototype.setImgDimensions = function() {
    this.imgRowLen = this.imgRows * this.imgxSpacing;
    this.imgColLen = this.imgCols * this.imgySpacing;

    return (true);
}

SliceLocator.prototype.calculateBoundingBox = function() {
    // the four points in 3d space that defines the corners of the bounding box
    var posX = new Array(4);
    var posY = new Array(4);
    var posZ = new Array(4);
    var rowPixel = new Array(4);
    var colPixel = new Array(4);
    var i;

    // upper left hand Corner
    posX[0] = this.imgx;
    posY[0] = this.imgy;
    posZ[0] = this.imgz;

    // upper right hand corner

    posX[1] = posX[0] + this.imgRowCosx * this.imgRowLen;
    posY[1] = posY[0] + this.imgRowCosy * this.imgRowLen;
    posZ[1] = posZ[0] + this.imgRowCosz * this.imgRowLen;

    // Buttom right hand corner

    posX[2] = posX[1] + this.imgColCosx * this.imgColLen;
    posY[2] = posY[1] + this.imgColCosy * this.imgColLen;
    posZ[2] = posZ[1] + this.imgColCosz * this.imgColLen;

    // bottom left hand corner

    posX[3] = posX[0] + this.imgColCosx * this.imgColLen;
    posY[3] = posY[0] + this.imgColCosy * this.imgColLen;
    posZ[3] = posZ[0] + this.imgColCosz * this.imgColLen;

    // Go through all four corners

    for (i = 0; i < 4; i++) {
    	// we want to view the source slice from the "point of view" of
        // the target localizer, i.e. a parallel projection of the source
        // onto the target

        // do this by imaging that the target localizer is a view port
        // into a relocated and rotated co-ordinate space, where the
        // viewport has a row vector of +X, col vector of +Y and normal +Z,
        // then the X and Y values of the projected target correspond to
        // row and col offsets in mm from the TLHC of the localizer image !

        // move everything to origin of target
        posX[i] -= this.scoutx;
        posY[i] -= this.scouty;
        posZ[i] -= this.scoutz;

        this.rotateImage(posX[i], posY[i], posZ[i]);
        // at this point the position contains the location on the scout image. calculate the pixel position
        // dicom coordinates are center of pixel 1\1
        colPixel[i] = parseInt(this.scoutPosX / this.scoutySpacing + 0.5);
        rowPixel[i] = parseInt(this.scoutPosY / this.scoutxSpacing + 0.5);
    }
    //  sort out the column and row pixel coordinates into the bounding box named coordinates
    //  same order as the position ULC -> URC -> BRC -> BLC
    this.boxUlx = colPixel[0];
    this.boxUly = rowPixel[0];
    this.boxUrx = colPixel[1];
    this.boxUry = rowPixel[1];
    this.boxLrx = colPixel[2];
    this.boxLry = rowPixel[2];
    this.boxLlx = colPixel[3];
    this.boxLly = rowPixel[3];

    //console.log(this.boxUlx + " : " + this.boxUly + " : " + this.boxLlx + " : " + this.boxLly);
}

function projectSlicing(scoutPos, scoutOrient, scoutPixSpace, scoutRows, scoutCols, imgPos, imgOrient, imgPixSpace, imgRows, imgCols) {
    var retVal = true;

    // Fisrs step check if either the scout or the image has to be updated.

    if (scoutPos != null && scoutOrient != null && scoutPixSpace != null && scoutRows != -1 && scoutCols != -1) {
    	// scout parameters appear to be semi-valid try to update the scout information
        if (this.setScoutPosition(scoutPos) && this.setScoutOrientation(scoutOrient) && this.setScoutSpacing(scoutPixSpace)) {
            this.scoutRows = scoutRows;
            this.scoutCols = scoutCols;
            this.setScoutDimensions();
            retVal = this.normalizeScout();
        }
    }
    //  Image and scout information is independent of one and other
    if (imgPos != null && imgOrient != null && imgPixSpace != null && imgRows != -1 && imgCols != -1) {
    	// Img parameters appear to be semi-valid try to update the Img information
        if (this.setImgPosition(imgPos) && this.setImgOrientation(imgOrient) && this.setImgSpacing(imgPixSpace)) {
            this.imgRows = imgRows;
            this.imgCols = imgCols;

            this.setImgDimensions();
        }
    }
    if (retVal) {
    	// start the calculation of the projected bounding box and the ends of the axes along the sides.
        this.calculateBoundingBox();
        this.calculateAxisPoints();
    }
    return (retVal);
}

SliceLocator.prototype.calculateAxisPoints = function() {

    // the four points in 3d space that defines the corners of the bounding box
    var posX = new Array(4);
    var posY = new Array(4);
    var posZ = new Array(4);
    var rowPixel = new Array(4);
    var colPixel = new Array(4);
    var i;

    // upper center
    posX[0] = this.imgx + this.imgRowCosx * this.imgRowLen / 2;
    posY[0] = this.imgy + this.imgRowCosy * this.imgRowLen / 2;
    posZ[0] = this.imgz + this.imgRowCosz * this.imgRowLen / 2;

    // right hand center

    posX[1] = this.imgx + this.imgRowCosx * this.imgRowLen + this.imgColCosx * this.imgColLen / 2;
    posY[1] = this.imgy + this.imgRowCosy * this.imgRowLen + this.imgColCosy * this.imgColLen / 2;
    posZ[1] = this.imgz + this.imgRowCosz * this.imgRowLen + this.imgColCosz * this.imgColLen / 2;

    // Bottom center

    posX[2] = posX[0] + this.imgColCosx * this.imgColLen;
    posY[2] = posY[0] + this.imgColCosy * this.imgColLen;
    posZ[2] = posZ[0] + this.imgColCosz * this.imgColLen;

    // left hand center

    posX[3] = this.imgx + this.imgColCosx * this.imgColLen / 2;
    posY[3] = this.imgy + this.imgColCosy * this.imgColLen / 2;
    posZ[3] = this.imgz + this.imgColCosz * this.imgColLen / 2;

    // Go through all four corners

    for (i = 0; i < 4; i++) {
    	// we want to view the source slice from the "point of view" of
        // the target localizer, i.e. a parallel projection of the source
        // onto the target

        // do this by imaging that the target localizer is a view port
        // into a relocated and rotated co-ordinate space, where the
        // viewport has a row vector of +X, col vector of +Y and normal +Z,
        // then the X and Y values of the projected target correspond to
        // row and col offsets in mm from the TLHC of the localizer image !

        // move everything to origin of target
        posX[i] -= this.scoutx;
        posY[i] -= this.scouty;
        posZ[i] -= this.scoutz;

        this.rotateImage(posX[i], posY[i], posZ[i]);
        // at this point the position contains the location on the scout image. calculate the pixel position
        // dicom coordinates are center of pixel 1\1
        colPixel[i] = parseInt(this.scoutPosX / this.scoutySpacing + 0.5);
        rowPixel[i] = parseInt(this.scoutPosY / this.scoutxSpacing + 0.5);
    }
    // sort out the column and row pixel coordinates into the bounding box axis named coordinates
    // same order as the position top -> right -> bottom -> left
    this.mAxisTopx = colPixel[0];
    this.mAxisTopy = rowPixel[0];
    this.mAxisRightx = colPixel[1];
    this.mAxisRighty = rowPixel[1];
    this.mAxisBottomx = colPixel[2];
    this.mAxisBottomy = rowPixel[2];
    this.mAxisLeftx = colPixel[3];
    this.mAxisLefty = rowPixel[3];

    //console.log(parseInt(this.mAxisLeftx) + " : " + parseInt(this.mAxisLefty) + " : " + parseInt(this.mAxisRightx) + " : " + parseInt(this.mAxisRighty) + " : " + parseInt(this.mAxisTopx) + " : " + parseInt(this.mAxisTopy) + " : " + parseInt(this.mAxisBottomx) + " : " + parseInt(this.mAxisBottomy));

}
