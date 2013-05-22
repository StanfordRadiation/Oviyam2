var nativeRows = 0;
var nativeColumns = 0;
var syncEnabled = false;
var studyRetrieved = false;
var doMouseWheel = true;
var imgInc = 0;

function showSeries(studyUID) {
    var myDb = systemDB;

    var sql = "select SeriesDescription, Modality, NoOfSeriesRelatedInstances, ReferencedSopIUID, SeriesInstanceUID, SopClassUID from series where StudyInstanceUID='" + studyUID + "';";
    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], seriesHandler, errorHandler);
    });
}


function seriesHandler(transaction, results) {
    var content = '<div id="seriesTable" style="float: left;" width="100%" onmouseover="this.style.cursor=\'pointer\'">';

    for(var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);

        if(isCompatible()) {
            if(row['SopClassUID'] == '1.2.840.10008.5.1.4.1.1.104.1') {
                var refImg = row['ReferencedSopIUID'] +".pdf";
            } else {
                var refImg = row['ReferencedSopIUID'] +".jpg";
            }
            readImage(refImg,'');

            content += '<table class="serThumbTable" style="border:1px solid #606060; background:#FFF;" onClick="eSeriesClick($(this))"><tr><td height="8" style="white-space:nowrap;">' + convertSplChars(row['SeriesDescription']) + '</td>';
            content += '</tr><tr><td>' + row['NoOfSeriesRelatedInstances'] + ' images</td></tr>';
            content += '<tr><td><input type="hidden" value="' + row['SeriesInstanceUID'] + '">';
            content += '<tr><td><img height="70" width="70" id="' + row['ReferencedSopIUID'] + '" name="' + row['SopClassUID'] + '"></td></tr></table>';
        } else {
            var refImgSrc = 'Image.do?serverURL=';

            var aTrs = oTable.fnGetNodes();
            for(var j=0; j<aTrs.length; j++) {
                if($(aTrs[j]).css("background-color") == "rgb(114, 143, 206)") {
                    refImgSrc += oTable.fnGetData(j, 10) + '&study=';
                    refImgSrc += oTable.fnGetData(j,9);
                }
            }

            refImgSrc += '&series=' + row['SeriesInstanceUID'] + '&object=' + row['ReferencedSopIUID'];

            content += '<table class="serThumbTable" style="border: 1px solid #606060; background: #FFF;" onClick="eSeriesClick($(this))"><tr><td height="8" style="white-space:nowrap;">' + convertSplChars(row['SeriesDescription']) + '</td>';
            content += '</tr><tr><td>' + row['NoOfSeriesRelatedInstances'] + ' images</td></tr>';
            content += '<tr><td><input type="hidden" value="' + row['SeriesInstanceUID'] + '">';

            if(row['SopClassUID'] == '1.2.840.10008.5.1.4.1.1.104.1') {
                content += '<tr><td><img height="70" width="70" id="' + row['ReferencedSopIUID'] + '" src="images/pdf.png" name="' + refImgSrc +'"></td></tr></table>';
            } else {
                content += '<tr><td><img height="70" width="70" id="' + row['ReferencedSopIUID'] + '" src="' + refImgSrc +'"></td></tr></table>';
            }
        }
    }
    content += "</div>";
    document.getElementById('SeriesPane').innerHTML = content;

    serClick($('.serThumbTable:first-child'));
}

var clickCount = 0;
function eSeriesClick(row) {
    clickCount++;
    var $table = row.children();

    row.parent().children().each(function() {
        $(this).css("background", "#FFF");
    });
    row.css("background","-webkit-gradient(linear, left top, left bottom, from(#E6E6E6), to(#868686))");

    var $hidden = $('#seriesTable :hidden');
    $hidden.each(function() {
        $(this).removeAttr('name');
    });

    var seriesUID = $table.find(':hidden');
    seriesUID.attr('name','selectedSeries');

    if(clickCount == 1) {
        singleClickTimer = setTimeout(function() {
            clickCount = 0;
            serClick(row);
        }, 400);
    } else if(clickCount == 2) {
        //clearTimeout(singleClickTimer);
        clickCount = 0;
        openSingleStudy();
    }
}

function readImage(fileName, canvas) {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
        fs.root.getFile(fileName, {}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    var img = document.createElement("img");

                    if(fileName.indexOf(".pdf") == -1) {
                        img.src = reader.result;
                    }

                    if(canvas == '') {
                        var container;
                        if(fileName.indexOf(".pdf") >=0) {
                            container = fileName.substring(0, fileName.indexOf(".pdf"));
                        } else {
                            container = fileName.substring(0, fileName.indexOf(".jpg"));
                        }
                        var holder = document.getElementById(container);
                        if(holder.name == '1.2.840.10008.5.1.4.1.1.104.1') {
                            holder.src = 'images/pdf.png';
                        } else {
                            holder.src = img.src;
                        }
                    } else {
                        if(fileName.indexOf(".pdf") >=0) {
                            var html = '<object id="PDFPlugin" data="' + reader.result + '"';
                            html += ' width="770" height="550"';
                            html += '>';
                            html += '</object>';

                            jQuery('#PDFContent').html(html);
                            jQuery('#PDFContent').css('visibility','visible');
                            jQuery('#imageCanvas').css('visibility','hidden');

                            jQuery('#imageCanvas').css('height','0px');

                            if(jQuery('#canvasDiv').html() != null) {
                                var pHeight = jQuery('#PDFContent').parent().css('height');
                                jQuery('#PDFPlugin').css('height',pHeight);
                            }
                            jQuery('#canvasDiv').css('height','0px');
                        } else {
                            jQuery('#PDFContent').css('visibility','hidden');
                            jQuery('#imageCanvas').css('visibility','visible');
                            jQuery('#PDFContent').css('height','0px');
                            //jQuery('#imageCanvas').css('height','512px');

                            var context = canvas.getContext("2d");

                            var vWidth = canvas.parentNode.offsetWidth;
                            var vHeight = canvas.parentNode.offsetHeight;

                            if(nativeColumns == 0 || nativeRows == 0) {
                                var tmpImgSize = jQuery(canvas).parent().parent().find('#imageSize').html().substring(11).split("x");
                                nativeColumns = parseInt(tmpImgSize[0]);
                                nativeRows = parseInt(tmpImgSize[1]);
                            }

                            var wRatio = vWidth / nativeColumns * 100;
                            var hRatio = vHeight / nativeRows * 100;
                            var zoomRatio = Math.round(Math.min(wRatio, hRatio)) / 100;

                            //if(zoomRatio < 1.0) {
                            var sw = parseInt(nativeColumns * zoomRatio);
                            var sh = parseInt(nativeRows * zoomRatio);
                            canvas.width = sw;
                            canvas.height = sh;

                            canvas.style.width = sw;
                            canvas.style.height = sh;

                            jQuery("#zoomPercent").html('Zoom: ' + parseInt(zoomRatio * 100) + '%');

                            /*} else {
                                canvas.width = nativeColumns;
                                canvas.height = nativeRows;
                                jQuery("#zoomPercent").html('Zoom: 100%');
                            } */

                            img.onload = function() {
                                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                            };

                            var top = (canvas.parentNode.offsetHeight-canvas.height) / 2;
                            canvas.style.marginTop = parseInt(top) + "px";

                            var left = (canvas.parentNode.offsetWidth - canvas.width) / 2;
                            canvas.style.marginLeft = parseInt(left) + "px";

                            for(var j=0; j<jQuery(canvas).siblings().length; j++) {
                                var tmpCanvas = jQuery(canvas).siblings().get(j);
                                if(tmpCanvas != null) {
                                    tmpCanvas.width = sw;
                                    tmpCanvas.height = sh;
                                    tmpCanvas.style.width = sw;
                                    tmpCanvas.style.height = sh;
                                    tmpCanvas.style.marginTop = parseInt(top) + "px";
                                    tmpCanvas.style.marginLeft = parseInt(left) + "px";
                                }
                            }
                        }
                    }
                };
                reader.readAsDataURL(file);
            }, fileErrorHandler);
        }, fileErrorHandler);
    }, fileErrorHandler);
}

function serClick(row) {

    var $table = row.children();

    row.parent().children().each(function() {
        $(this).css("background", "#FFF");
    });
    row.css("background","-webkit-gradient(linear, left top, left bottom, from(#E6E6E6), to(#868686))");

    var $hidden = $('#seriesTable :hidden');

    $hidden.each(function() {
        $(this).removeAttr('name');
    });

    var seriesUID = $table.find(':hidden');
    seriesUID.attr('name','selectedSeries');

    var link="";

    if(isCompatible()) {
        link += "viewer1.html?seriesUID=" + seriesUID.attr('value');
        jQuery("iframe").attr('src',link);
    } else {
        var tmpUrl = row.find('img').attr('src');

        if(tmpUrl == 'images/pdf.png') {
            tmpUrl = row.find('img').attr('name');
        }

        var tmpStr = tmpUrl.substring(tmpUrl.indexOf('serverURL')+10, tmpUrl.indexOf('&study'));
        link += "viewer1.html?serverURL=" + tmpStr;

        tmpStr = tmpUrl.substring(tmpUrl.indexOf('study=')+6, tmpUrl.indexOf('&series'));
        link += "&studyUID=" + tmpStr;

        tmpStr = tmpUrl.substring(tmpUrl.indexOf('series=')+7, tmpUrl.indexOf('&object'));
        link += "&seriesUID=" + tmpStr;

        jQuery("iframe").attr('src',link);
    }
}

function imageHandler(transaction, results) {
    instances = new Array(results.rows.length);
    for(var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);
        instances[i] = row['SopUID'];
    }
    
    if(!jQuery('#loopChkBox').is(':checked')) {
	    showDcmAttributeValues();
	    //console.log("test");
	}
}

function imageDetailsHandler(transaction, results) {
    for(var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);
        jQuery("#patName").html(row['PatientName']);
        jQuery("#patID").html(row['PatientId']);
        jQuery("#patGender").html(row['PatientSex']);
        jQuery("#studyDate").html(row['StudyDate']);
        jQuery("#studyDesc").html(row['StudyDescription']);
        jQuery("#modalityDiv").html(row['ModalityInStudy']);
        jQuery("#seriesDesc").html(row['SeriesDescription']);

        var qryStr = window.location.href;
        var instanceNo = getParameter(qryStr, 'instanceNumber');

        if(instanceNo != null && instanceNo.length > 0) {
            imgInc = parseInt(instanceNo);
        }
        
        if(imgInc > 0) {
            jQuery("#totalImages").html('Images: ' + (imgInc+1) + ' / ' + row['NoOfSeriesRelatedInstances']);
        } else {
            jQuery("#totalImages").html('Image: ' + (imgInc+1) + ' / ' + row['NoOfSeriesRelatedInstances']);
        }
    }

    parent.sopClassUID = row['SopClassUID'];
}

function prevImage(iInc) {
    var totalImagesDiv;
    var totalFrames;
    var frmSrc;

    if(typeof(parent.jcanvas) != "undefined") {
        totalImagesDiv = jQuery(parent.jcanvas).parent().parent().find('#totalImages');
        frmSrc = jQuery(parent.jcanvas).parent().parent().find('#frameSrc').html();
    } else {
        totalImagesDiv = jQuery("#totalImages");
        frmSrc = jQuery("#frameSrc").html();
    }
    totalFrames = totalImagesDiv.html();

    if(totalFrames.indexOf('Frame') >= 0) {
        totalFrames = totalFrames.substring(totalFrames.indexOf('/')+1);

        parent.frameNumber--;

        if(parent.frameNumber < 1) {
            parent.frameNumber = parseInt(totalFrames);
        }

        totalImagesDiv.html('Frames: ' + parent.frameNumber + ' / ' + totalFrames);

        var objectUID = getParameter(frmSrc, 'objectUID');
        showImage(objectUID + "_" + parseInt(parent.frameNumber), null);
    } else {
        imgInc = iInc-1;

        //if(typeof instances == 'undefined') {
        var actFrame = getActiveFrame();
        instances = actFrame.contentWindow.instances;
        //}

        if(imgInc < 0) {
            imgInc = instances.length-1;
        }

        if(typeof(parent.jcanvas) != "undefined") {
            jQuery(parent.jcanvas).parent().parent().find('#totalImages').html('Images: ' + (imgInc+1) + ' / ' + self.instances.length);
        } else {
            jQuery("#totalImages").html('Images: ' + (imgInc+1) + ' / ' + this.instances.length);
        }

        showDcmAttributeValues();
    }
    parent.imgNo = imgInc;
}

function nextImage(iInc) {
    var totalImagesDiv;
    var totalFrames;
    var frmSrc;

    if(typeof(parent.jcanvas) != "undefined") {
        totalImagesDiv = jQuery(parent.jcanvas).parent().parent().find('#totalImages');
        frmSrc = jQuery(parent.jcanvas).parent().parent().find('#frameSrc').html();
    } else {
        totalImagesDiv = jQuery("#totalImages");
        frmSrc = jQuery("#frameSrc").html();
    }
    totalFrames = totalImagesDiv.html();

    if(totalFrames.indexOf('Frame') >= 0) {
        totalFrames = totalFrames.substring(totalFrames.indexOf('/')+1);

        parent.frameNumber++;

        if(parent.frameNumber > parseInt(totalFrames)) {
            parent.frameNumber = 1;
        }

        totalImagesDiv.html('Frames: ' + parent.frameNumber + ' / ' + totalFrames);

        var objectUID = getParameter(frmSrc, 'objectUID');
        showImage(objectUID + "_" + parseInt(parent.frameNumber), null);
    } else {
        imgInc = iInc + 1;

        //if(typeof instances == 'undefined') {
        var actFrame = getActiveFrame();
        instances = actFrame.contentWindow.instances;
        //}

        if(imgInc == instances.length) {
            imgInc = 0;
        }

        if(typeof(parent.jcanvas) != "undefined") {
            jQuery(parent.jcanvas).parent().parent().find('#totalImages').html('Images: ' + (imgInc+1) + ' / ' + self.instances.length);
        } else {
            jQuery("#totalImages").html('Images: ' + (imgInc+1) + ' / ' + this.instances.length);
        }
        showDcmAttributeValues();
    }
    parent.imgNo = imgInc;
}

function getActiveFrame() {
    var frames = jQuery(parent.document).find('iframe');
    var activeFrame = null;
    if(frames.length <= 1) {
        activeFrame = frames[0];
    } else {
        for(var k=0; k<frames.length; k++) {
            if(jQuery(frames[k]).contents().find('html').css('border') == '2px solid rgb(0, 255, 0)') {
                activeFrame = frames[k];
            }
        }
    }
    return activeFrame;
}

function showNextImage(imgNo) {
    imgInc = imgNo;
    nextImage();
}

function showDcmAttributeValues() {
    var sql = "select SopUID, WindowCenter, WindowWidth, Rows, Columns, ImageOrientation, SliceThickness, SliceLocation, FrameOfReferenceUID, ImagePosition, ImageOrientPatient, PixelSpacing, ReferencedSOPInsUID, ImageType, NumberOfFrames from instance where SopUID='" + instances[imgInc] + "';";
    var myDb = initDB();
    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], windowLevelHandler, errorHandler);
    });
}

function windowLevelHandler(transaction, results) {
    var row = results.rows.item(0);
   
    parent.imgNo = imgInc;
    
    var windowCenter = row['WindowCenter'];
    var windowWidth = row['WindowWidth'];
    nativeRows = parseInt(row['Rows']);
    nativeColumns = parseInt(row['Columns']);

    if(row['ImageOrientation'] != 'undefined' && row['ImageOrientation'] != '') {
        var imgOrient = row['ImageOrientation'].split("\\");

        if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
            jQuery(parent.jcanvas).parent().parent().find('#imgOriRight').html(imgOrient[0]);
            jQuery(parent.jcanvas).parent().parent().find('#imgOriBottom').html(imgOrient[1]);
            jQuery(parent.jcanvas).parent().parent().find('#imgOriLeft').html(getOppositeOrientation(imgOrient[0]));
            jQuery(parent.jcanvas).parent().parent().find('#imgOriTop').html(getOppositeOrientation(imgOrient[1]));
        } else {
            jQuery('#imgOriRight').html(imgOrient[0]);
            jQuery('#imgOriBottom').html(imgOrient[1]);
            jQuery('#imgOriLeft').html(getOppositeOrientation(imgOrient[0]));
            jQuery('#imgOriTop').html(getOppositeOrientation(imgOrient[1]));
        }
    }

    if(windowCenter.indexOf('|') >=0) {
        windowCenter = windowCenter.substring(0, windowCenter.indexOf('|'));
    }

    if(windowWidth.indexOf('|') >=0) {
        windowWidth = windowWidth.substring(0, windowWidth.indexOf('|'));
    }

    if(parent.wlApplied) {
        windowCenter = parent.wc;
        windowWidth = parent.ww;
    }

    if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
        jQuery(parent.jcanvas).parent().parent().find("#windowLevel").html('WL: ' + windowCenter + ' / ' + 'WW: ' + windowWidth);
        jQuery(parent.jcanvas).parent().parent().find("#imageSize").html('Image size: ' + nativeColumns + ' x ' + nativeRows);
    } else {
        jQuery("#windowLevel").html('WL: ' + windowCenter + ' / ' + 'WW: ' + windowWidth);
        jQuery("#imageSize").html('Image size: ' + nativeColumns + ' x ' + nativeRows);
    }

    if(row['NumberOfFrames'] != 'undefined' && row['NumberOfFrames'] != '') {
        if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
            jQuery(parent.jcanvas).parent().parent().find('#totalImages').html('Frames: ' + parent.frameNumber + ' / ' + row['NumberOfFrames']);
        } else {
            jQuery("#totalImages").html('Frames: ' + parent.frameNumber + ' / ' + row['NumberOfFrames']);
        }
    }

    var sliceInfo = '';

    if(row['SliceThickness'] != 'undefined' && row['SliceThickness'] != '') {
        sliceInfo = 'Thick: ' + parseFloat(row['SliceThickness']).toFixed(2) + ' mm ';
    }

    if(row['SliceLocation'] != 'undefined' && row['SliceLocation'] != '') {
        sliceInfo += 'Loc: ' + parseFloat(row['SliceLocation']).toFixed(2) + ' mm';
    }

    if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
        jQuery(parent.jcanvas).parent().parent().find('#thickLocationPanel').html(sliceInfo);
    } else {
        jQuery('#thickLocationPanel').html(sliceInfo);
    }

    if(row['FrameOfReferenceUID'] != 'undefined') {
        if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
            jQuery(parent.jcanvas).parent().parent().find('#forUIDPanel').html(row['FrameOfReferenceUID']);
        } else {
            jQuery('#forUIDPanel').html(row['FrameOfReferenceUID']);
        }
    }

    if(row['ReferencedSOPInsUID'] != 'undefined') {
        if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
            jQuery(parent.jcanvas).parent().parent().find('#refSOPInsUID').html(row['ReferencedSOPInsUID']);
        } else {
            jQuery('#refSOPInsUID').html(row['ReferencedSOPInsUID']);
        }
    }

    if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
        jQuery(parent.jcanvas).parent().parent().find('#imgPosition').html(row['ImagePosition']);
        jQuery(parent.jcanvas).parent().parent().find('#imgOrientation').html(row['ImageOrientPatient']);
        jQuery(parent.jcanvas).parent().parent().find('#imgType').html(row['ImageType']);
        jQuery(parent.jcanvas).parent().parent().find('#pixelSpacing').html(row['PixelSpacing']);
    } else {
        jQuery('#imgPosition').html(row['ImagePosition']);
        jQuery('#imgOrientation').html(row['ImageOrientPatient']);
        jQuery('#imgType').html(row['ImageType']);
        jQuery('#pixelSpacing').html(row['PixelSpacing']);
    }

    var canvas = null;
    if(typeof(jcanvas) == "undefined") {
        canvas = document.getElementById('imageCanvas');
    } else {
        canvas = jcanvas;
    }

    var view = 'View size: ' + canvas.parentNode.offsetWidth + ' x ' + canvas.parentNode.offsetHeight;
    if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
        jQuery(parent.jcanvas).parent().parent().find("#viewSize").html(view);
    } else {
        jQuery("#viewSize").html(view);
    }

    var fSrc;
    if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
        fSrc = jQuery(parent.jcanvas).parent().parent().find("#frameSrc").html();
    } else {
        fSrc = jQuery("#frameSrc").html();
    }

    if(fSrc != null) {
        if(fSrc.indexOf("objectUID") > 0) {
            fSrc = fSrc.substring(0, fSrc.indexOf("objectUID")) + "&objectUID=" + row['SopUID'];
        } else {
            fSrc = fSrc + "&objectUID=" + row['SopUID'];
        }

        if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
            jQuery(parent.jcanvas).parent().parent().find("#frameSrc").html(fSrc);
        } else {
            jQuery("#frameSrc").html(fSrc);
        }
    }

    var fileName = '';

    if(parent.sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1') {
        fileName = instances[imgInc] + ".pdf";
    } else {
        fileName = instances[imgInc] + ".jpg";
    }

    var modality;
    if(parent.scrollImages || jQuery('#loopChkBox').is(':checked')) {
        modality = jQuery(parent.jcanvas).parent().parent().find('#modalityDiv').html();
    } else {
        modality = jQuery('#modalityDiv').html();
    }

    var imgCon = document.getElementById(instances[0]);
    var imgSrc;
    if(imgCon != null) {
        imgSrc = imgCon.src;

        imgSrc = imgSrc.substring(0, imgSrc.lastIndexOf("object="));
        imgSrc += "object=" + instances[imgInc];
        showImage(imgSrc, null);
    } else {
        //var queryString = window.top.location.search.substring(1);
        var queryString = window.location.href;

        if(queryString.indexOf('seriesUID') == -1) {
            queryString = jQuery(parent.jcanvas).parent().parent().find("#frameSrc").html();
        }
        var seriesUID = getParameter(queryString, 'seriesUID');
        var studyUID = getParameter(queryString, 'studyUID');
        if(studyUID == null) {
            studyUID = parent.pat['studyUID'];
        }
        var serverURL = getParameter(queryString, 'serverURL');
        if(serverURL == null) {
            serverURL = parent.pat['serverURL'];
        }

        imgSrc = 'Image.do?serverURL=' + serverURL + '&study=' + studyUID + '&series=' + seriesUID + '&object=' + instances[imgInc];

        if(parent.sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1') {
            var html = '<object id="PDFPlugin" type="application/pdf" data="' + imgSrc + '"';
            html += ' width="770" height="550">';
            html += '</object>';

            jQuery('#PDFContent').html(html);
            jQuery('#PDFContent').css('visibility','visible');
            jQuery('#imageCanvas').css('visibility','hidden');

            jQuery('#imageCanvas').css('height','0px');

            if(jQuery('#canvasDiv').html() != null) {
                var pHeight = jQuery('#PDFContent').parent().css('height');
                jQuery('#PDFPlugin').css('height',pHeight);
            }
            jQuery('#canvasDiv').css('height','0px');
            parent.doMouseWheel = false;

        } else if(parent.sopClassUID.indexOf('1.2.840.10008.5.1.4.1.1.8') >= 0) {
            imgSrc += '&contentType=text/html';
            jQuery('#SRContent').load(imgSrc);
            jQuery('#SRContent').css('visibility','visible');
            jQuery('#SRContent').css('background-color','white');
            jQuery('#SRContent').css('overflow','auto');
            jQuery('#imageCanvas').css('visibility','hidden');
            jQuery('#SRContent').css('height', '100%');
            jQuery('#imageCanvas').css('height','0px');
            jQuery('.textOverlay:not(#huDisplayPanel)').hide();
            parent.doMouseWheel = false;
        } else {
            //showImage(imgSrc, null);

            if(row['NumberOfFrames'] != 'undefined' && row['NumberOfFrames'] != '') {
                if(parent.frameNumber > parseInt(row['NumberOfFrames']))
                    parent.frameNumber = 1;
                showImage(row['SopUID'] + "_" + parseInt(parent.frameNumber), null);
            } else {
                showImage(seriesUID + "_" + parseInt(imgInc+1), null);
            }
        }

        if(parent.syncEnabled) {
            syncSeries();
        }

        if(parent.displayScout) {
            if(modality.indexOf("CT") >= 0) {
                Localizer.drawScoutLineWithBorder();
            } else {
                MRLocalizer.drawScoutLineWithBorder();
            }
        }

        changeImgPosInSeries(imgInc, canvas);

        if(jQuery('#trackbar1').length == 0) {
            var actIframe = getActiveFrame();

            if(actIframe.contentWindow.isSlider) {
                var trackBar = jQuery(actIframe).contents().find('#trackbar1');
                jQuery(trackBar).slider( {
                    range: "min",
                    value: imgInc+1,
                    min: 1,
                    max: instances.length
                /*slide: function onTick(event, ui) {
            		nextImage(ui.value - 2);
        		}*/
                });
            }
        } else {
            jQuery('#trackbar1').slider('option', "value", parseInt(imgInc)+1);
        }

    //}
    }
}

function isCompatible() {
    return !!(window.requestFileSystem || window.webkitRequestFileSystem);
}

function showImage(src, currCanvas) {
    //var img = document.createElement("img");
    //img.src = jQuery('#' + src.replace(/\./g,'_'), window.parent.document).attr('src');

    var img1 = jQuery('#' + src.replace(/\./g,'_'), window.parent.document).get(0);
    //console.log(src);

    var canvas = null;
    if(currCanvas == null) {
        canvas = document.getElementById('imageCanvas');
        if(canvas == null) {
            canvas = jcanvas;
        }
    } else {
        canvas = currCanvas;
    }


    var context = canvas.getContext("2d");

    var vWidth = canvas.parentNode.offsetWidth;
    var vHeight = canvas.parentNode.offsetHeight;

    if(nativeColumns == 0 || nativeRows == 0) {
        var tmpImgSize = jQuery(canvas).parent().parent().find('#imageSize').html().substring(11).split("x");
        nativeColumns = parseInt(tmpImgSize[0]);
        nativeRows = parseInt(tmpImgSize[1]);
    }

    var wRatio = vWidth / nativeColumns * 100;
    var hRatio = vHeight / nativeRows * 100;
    var zoomRatio = Math.round(Math.min(wRatio, hRatio)) / 100;

    // if(zoomRatio < 1.0) {
    var sw = parseInt(nativeColumns * zoomRatio);
    var sh = parseInt(nativeRows * zoomRatio);

    canvas.width = sw;
    canvas.height = sh;
    canvas.style.width = sw;
    canvas.style.height = sh;

    jQuery("#zoomPercent").html('Zoom: ' + parseInt(zoomRatio * 100) + '%');

    /*} else {
        canvas.width = nativeColumns;
        canvas.height = nativeRows;
        $("#zoomPercent").html('Zoom: 100%');
    }*/

    if(img1.complete) {
        context.drawImage(img1, 0, 0, canvas.width, canvas.height);
    } else {
        jQuery.sleep(2, function() {
            context.drawImage(img1, 0, 0, canvas.width, canvas.height);
        });
    }

    /*  if(nativeRows <= canvas.height) {
        var top = (canvas.parentNode.offsetHeight-canvas.height) / 2;
        canvas.style.marginTop = parseInt(top) + "px";
    }*/

    var top = (canvas.parentNode.offsetHeight-canvas.height) / 2;
    canvas.style.marginTop = parseInt(top) + "px";

    var left = (canvas.parentNode.offsetWidth - canvas.width) / 2;
    canvas.style.marginLeft = parseInt(left) + "px";

    for(var j=0; j<jQuery(canvas).siblings().length; j++) {
        var tmpCanvas = jQuery(canvas).siblings().get(j);
        if(tmpCanvas != null) {
            tmpCanvas.width = sw;
            tmpCanvas.height = sh;
            tmpCanvas.style.width = sw;
            tmpCanvas.style.height = sh;
            tmpCanvas.style.marginTop = parseInt(top) + "px";
            tmpCanvas.style.marginLeft = parseInt(left) + "px";
        }
    }
}

function openSingleStudy() {
    //delete the cookie
    setCookie('patientName', '', -1);

    var serUID = '';
    var $row = $('#seriesTable :hidden');

    $row.each(function() {
        if($(this).attr('name') == 'selectedSeries') {
            serUID = $(this).val();
            return false;
        }
    });

    if(serUID != '') {

        if(isCompatible()) {
            cookiesEnabled();
            //var pName = jQuery('iframe').contents().find('#patName').html();

            var pName = '';
            var aTrs = oTable.fnGetNodes();
            for(var j=0; j<aTrs.length; j++) {
                if($(aTrs[j]).css("background-color") == "rgb(114, 143, 206)") {
                    pName = oTable.fnGetData(j, 2);
                    break;
                }
            }

            if(pName != null && pName != '') {
                setCookie('patientName', pName, 365);
            }

            var viewerURL = 'viewer.html?seriesUID=' + serUID;
            window.open(viewerURL, '_blank');
        } else {
            var viewerURL = 'viewer.html?serverURL=';
            var aTrs = oTable.fnGetNodes();
            for(var j=0; j<aTrs.length; j++) {
                if($(aTrs[j]).css("background-color") == "rgb(114, 143, 206)") {
                    viewerURL += oTable.fnGetData(j, 10) + '&studyUID=';
                    viewerURL += oTable.fnGetData(j, 9);
                }
            }
            viewerURL += '&seriesUID=' + serUID;
            window.open(viewerURL, '_blank');
        }
    } else {
        jAlert("Please select series to view", "Series Alert");
        return;
    }
}

function convertSplChars(str)
{
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    return str;
}

function getOppositeOrientation(str) {
    var strTmp = '';
    for(i=0; i<str.length; i++) {
        switch(str.charAt(i)) {
            case 'P':
                strTmp += 'A';
                break;
            case 'A':
                strTmp += 'P';
                break;
            case 'I':
                strTmp += 'S';
                break;
            case 'S':
                strTmp += 'I';
                break;
            case 'F':
                strTmp += 'H';
                break;
            case 'H':
                strTmp += 'F';
                break;
            case 'L':
                strTmp += 'R';
                break;
            case 'R':
                strTmp += 'L';
                break;
        }
    }

    return strTmp;
}

function deleteStudy(studyIUID) {
    var database = systemDB;

    database.transaction(function(tx) {
        var query = "SELECT Patient_Pk from study where StudyInstanceUID='" + studyIUID + "'";
        tx.executeSql(query, [], function(trans, results){
            var row = results.rows.item(0);
            //console.log(row['Patient_Pk']);
            query = "DELETE FROM patient WHERE Pk=" + row['Patient_Pk'];
            executeQuery(query);
        }, errorHandler);
    });

    query = "DELETE FROM study WHERE StudyInstanceUID='" + studyIUID + "';";
    executeQuery(query);
    query = "DELETE FROM series WHERE StudyInstanceUID='" + studyIUID + "';";
    executeQuery(query);

    database.transaction(function(tx) {
        var qry = "SELECT SopUID FROM instance WHERE StudyInstanceUID='" + studyIUID + "'";
        tx.executeSql(qry, [], function(trans, results) {
            for(var i=0; i<results.rows.length; i++) {
                var row = results.rows.item(i);
                var fileName = row['SopUID'] + ".jpg";
                deleteFile(fileName);
            }
            qry = "DELETE FROM instance WHERE StudyInstanceUID='" + studyIUID + "';";
            executeQuery(qry);
        }, errorHandler);
    });
}

function deleteFile(fileName) {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
        fs.root.getFile(fileName, {
            create: false
        }, function(fileEntry) {
            fileEntry.remove(function() {
                console.log('File removed.');
            }, fileErrorHandler);
        }, fileErrorHandler);

    }, fileErrorHandler);
}

function openViewer() {
    var selectedRows = $("#availableStudies tbody input[type=checkbox]:checked").parent().parent();

    if(selectedRows.length <= 0) {
        jAlert("Please select study to view", "Study not selected");
        return;
    } else {
        openMultiplyStudies();
    }
}

function openMultiplyStudies() {
    var selectedRows = $("#availableStudies tbody input[type=checkbox]:checked").parent().parent();
    var strJSON = '{"studies":[';

    var studyIUID = null;
    var patName = null;
    for(var i=0; i<selectedRows.length; i++) {
        studyIUID = oTable.fnGetData(selectedRows[i], 9);
        patName = oTable.fnGetData(selectedRows[i], 2);
        strJSON += '{"studyIUID" : "' + studyIUID + '",';

        if(i == selectedRows.length-1)
            strJSON += '"patientName" : "' + patName + '"}';
        else
            strJSON += '"patientName" : "' + patName + '"},';
    }
    strJSON += ']}';

    var cookieStudy = eval('(' + strJSON + ')');
    jQuery.cookie("studies", cookieStudy, {
        json:true
    });

    if(isCompatible()) {
        window.open("comparestudy.html", '_blank');
    } else {
        var serUrl = oTable.fnGetData(selectedRows[0], 10);
        var url = "comparestudy.html?serverURL=" + serUrl;
        window.open(url, '_blank');
    }
}

function changeImgPosInSeries(iNo, currCanvas) {
    var frmSrcTmp = jQuery(currCanvas).parent().parent().find('#frameSrc').html();
    var serUidTmp = getParameter(frmSrcTmp, 'seriesUID');
    var cont_td = jQuery('#' + serUidTmp.replace(/\./g,'_'), parent.document);
    var i = 0;
    var imgViewIcon = cont_td.next().children('img').attr('src');
    var totIns = jQuery(currCanvas).parent().parent().find('#totalImages').html();
    totIns = parseInt(totIns.substring(totIns.indexOf('/')+1));
    
    cont_td.children().each(function() {
        if(imgViewIcon == 'images/one.png') {
            if(i == 0) {
                jQuery(this).css('background', '#00F');
            } else if(i == iNo) {
                jQuery(this).css('background', '#F00');
            } else {
                jQuery(this).css('background', '#A6A6A6');
            }
        } else if(imgViewIcon == 'images/three.png') {            
            if(i == iNo) {
                jQuery(this).css('background', '#F00');
            } else if(i == 0 || i == Math.round(totIns/2)-1 || i == totIns-1) {
                jQuery(this).css('background', '#00F');
            } else {
                jQuery(this).css('background', '#A6A6A6');
            }
        } else {
            if(i == iNo) {
                jQuery(this).css('background', '#F00');
            } else {
                jQuery(this).css('background', '#00F');
            }
        }
        i++;
    });
}