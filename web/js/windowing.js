var wadoURL;
var mouseLocX1;
var mouseLocX2;
var mouseLocY1;
var mouseLocY2;

var wcenter;
var wwidth;
var rescale_Slope;
var rescale_Intercept;
var lookupTable;
var huLookupTable;
var pixelBuffer = new Array();

var row;
var column;
var lookupObj;
var zoomPercent;

var canvas;
var ctx;
var myImageData;
var winEnabled = false;

String.prototype.replaceAll = function(pcFrom, pcTo){
    var i = this.indexOf(pcFrom);
    var c = this;
    while (i > -1){
        c = c.replace(pcFrom, pcTo);
        i = c.indexOf(pcFrom);
    }
    return c;
}

function mouseDownHandler(evt)
{
    mousePressed=1;

    zoomPercent = jQuery(jcanvas).parent().parent().find('#zoomPercent').html();
    zoomPercent = zoomPercent.substring(zoomPercent.indexOf(":")+1, zoomPercent.indexOf("%"));
    zoomPercent = zoomPercent / 100;

    if(imageLoaded==1)
    {
        mouseLocX = evt.pageX - parent.jcanvas.offsetLeft;
        mouseLocX = parseInt(mouseLocX / zoomPercent);
        mouseLocY = evt.pageY - parent.jcanvas.offsetTop;
        mouseLocY = parseInt(mouseLocY / zoomPercent);
    }

    evt.preventDefault();
    evt.stopPropagation();
    evt.target.style.cursor = "url(images/windowing.png), auto";
}

function mouseupHandler(evt)
{
    mousePressed=0;
    evt.target.style.cursor = "default";
    wlApplied = false;
//applyWindowing();
}

function mousemoveHandler(evt)
{

    try
    {
        if(parent.imageLoaded==1)
        {
            mouseLocX1 = evt.pageX - jcanvas.offsetLeft;
            mouseLocX1 = parseInt(mouseLocX1 / zoomPercent);
            mouseLocY1 = evt.pageY - jcanvas.offsetTop;
            mouseLocY1 = parseInt(mouseLocY1 / zoomPercent);

            if(mouseLocX1>=0&&mouseLocY1>=0&&mouseLocX1<column&&mouseLocY1<row)
            {
                showHUvalue(mouseLocX1,mouseLocY1);

                if(mousePressed==1)
                {
                    //imageLoaded=0;
                    var diffX=mouseLocX1-mouseLocX;
                    var diffY=mouseLocY-mouseLocY1;
                    parent.wc=parseInt(parent.wc)+diffY;
                    parent.ww=parseInt(parent.ww)+diffX;

                    if(parent.ww < 1) {
                        parent.ww = 1;
                    }

                    showWindowingValue(parent.wc,parent.ww);
                    lookupObj.setWindowingdata(parent.wc,parent.ww);
                    genImage();
                    mouseLocX=mouseLocX1
                    mouseLocY=mouseLocY1;
                //imageLoaded=1;

                }
            }
        }
    }
    catch(err)
    {
    }

}

function changePreset(presetValue)
{
    if(winEnabled) {
        //applyPreset(parseInt(document.getElementById("preset").options[document.getElementById("preset").selectedIndex].value));
        applyPreset(parseInt(presetValue));
    }
}

function applyPreset(preset)
{
    switch (preset)
    {
        case 1:
            parent.wc=wcenter;
            parent.ww=wwidth;
            lookupObj.setWindowingdata(parent.wc,parent.ww);
            genImage();
            break;

        case 2:
            parent.wc=350;
            parent.ww=40;
            lookupObj.setWindowingdata(parent.wc,parent.ww);
            genImage();
            break;

        case 3:
            parent.wc=-600;
            parent.ww=1500;
            lookupObj.setWindowingdata(parent.wc,parent.ww);
            genImage();
            break;

        case 4:
            parent.wc=40;
            parent.ww=80;
            lookupObj.setWindowingdata(parent.wc,parent.ww);
            genImage();
            break;

        case 5:
            parent.wc=480;
            parent.ww=2500;
            lookupObj.setWindowingdata(parent.wc,parent.ww);
            genImage();
            break;

        case 6:
            parent.wc=90;
            parent.ww=350;
            lookupObj.setWindowingdata(parent.wc,parent.ww);
            genImage();
            break;
    }
    showWindowingValue(parent.wc,parent.ww);
}

function showHUvalue(x,y)
{
    var t=(y*column)+x;
    //var hupanel=document.getElementById("huDisplayPanel");
    //hupanel.innerHTML="X :"+x+" Y :"+y+" HU :"+huLookupTable[pixelBuffer[t]];
    var huValue = "X :"+x+" Y :"+y+" HU :"+huLookupTable[pixelBuffer[t]];
    selectedFrame.find('#huDisplayPanel').html(huValue);
}

function showWindowingValue(wcenter,wwidth)
{
    var winValue = "WL: "+wcenter+" / WW: "+wwidth;
    selectedFrame.find('#windowLevel').html(winValue);
}

function loadDicom() {
    //stop zoom if zoom enabled
    if(zoomEnabled) {
        var zDiv = jQuery('#zoomIn').get(0);
        stopZoom(zDiv);
    }

    // stop move if move enabled
    if(moveEnabled) {
        var mvDiv = jQuery('#move').get(0);
        stopMove(mvDiv);
    }

    var imgSize = jQuery(jcanvas).parent().parent().find('#imageSize').html().substring(11).split("x");
    row = parseInt(imgSize[1]);
    column = parseInt(imgSize[0]);

    //var viewSize = jQuery(jcanvas).parent().parent().find('#viewSize').html().substring(10).split("x");
    /*if(parseInt(imgSize[0]) > parseInt(viewSize[0])) {
        return;
    } else if(parseInt(imgSize[1]) > parseInt(viewSize[1])) {
        return;
    } */

    var curr = jQuery('#containerBox').find('.current');

    //var queryString = window.top.location.search.substring(1);

    var queryString = jQuery(jcanvas).parent().parent().find("#frameSrc").html();

    //var queryString = window.location.href;
    var seriesUID = getParameter(queryString, 'seriesUID');

    var sql = "select study.StudyInstanceUID, ServerURL, SeriesInstanceUID from study, series where study.StudyInstanceUID = series.StudyInstanceUID and SeriesInstanceUID = '" + seriesUID + "';";
    var myDb = initDB();

    //var layerCanvas = jQuery(jcanvas).siblings().get(1);
    var layerCanvas = jQuery(jcanvas).parent().children().get(2);

    if(!winEnabled) {
        winEnabled = true;
        doMouseWheel = false;
        //jQuery('#preset').removeAttr('disabled');
        jQuery("#presetDiv input").removeAttr('disabled');
        jQuery("#presetDiv a").css('visibility', 'visible');
        jQuery(jcanvas).parent().parent().find('#applyWLDiv').show();
        jQuery(jcanvas).parent().parent().find('#huDisplayPanel').show();
        jQuery(jcanvas).parent().parent().find('#thickLocationPanel').hide();
        jQuery('#containerBox .toolbarButton').unbind('mouseenter').unbind('mouseleave');
        jQuery(curr).attr('class','toolbarButton current');

        myDb.transaction(function(tx) {
            tx.executeSql(sql, [], urlHandler, errorHandler);
        });


        jQuery(layerCanvas).mouseup(function(evt) {
            mouseupHandler(evt);
        }).mousedown(function(evt) {
            mouseDownHandler(evt);
        }).mousemove(function(evt) {
            mousemoveHandler(evt);
        });
    } else {
        stopWLAdjustment();
    }
}

function stopWLAdjustment() {
    winEnabled = false;
    doMouseWheel = true;
    var curr = jQuery('#containerBox').find('.current');
    var layerCanvas = jQuery(jcanvas).parent().children().get(2);
    //jQuery('#preset').attr('disabled', 'disabled');
    jQuery("#presetDiv input").attr('disabled',true);
    jQuery("#presetDiv a").css('visibility', 'hidden');
    jQuery(jcanvas).parent().parent().find('#applyWLDiv').hide();
    jQuery(jcanvas).parent().parent().find('#thickLocationPanel').show();
    jQuery(jcanvas).parent().parent().find('#huDisplayPanel').hide();
    jQuery(curr).attr('class', 'toolbarButton');
    jQuery(curr).children().attr('class', 'imgOff');
    jQuery(layerCanvas).unbind('mousedown').unbind('mouseup');

    doContainerBoxHOver();
}

function getContextPath()
{
    var path = top.location.pathname;
    if (document.all) {
        path = path.replace(/\\/g,"/");
    }
    path = path.substr(0,path.lastIndexOf("/")+1);

    return path;
}

function parseAndLoadDicom()
{
    //alert(wadoURL);
    var reader=new DicomInputStreamReader();

    if( !(!(wadoURL.indexOf('C-GET') >= 0) && !(wadoURL.indexOf('C-MOVE') >= 0))) {
        //var urlTmp = "DcmFile.do?study=" + getParameter(wadoURL, "studyUID") + "&object=" + getParameter(wadoURL, "objectUID");
        var urlTmp = "Wado.do?study=" + getParameter(wadoURL, "studyUID") + "&object=" + getParameter(wadoURL, "objectUID") + "&contentType=application/dicom";
    	reader.readDicom(urlTmp);
    } else {
       // reader.readDicom("http://"+top.location.host+"/"+getContextPath()+"/DcmStream.do?wadourl="+wadoURL.replaceAll("&","_"));
    	 reader.readDicom("DcmStream.do?wadourl="+wadoURL.replaceAll("&","_"));
    }

    /*var urlTmp = "Wado.do?dicomURL=DICOM://ASGARDCM:OVIYAM2@localhost:11112&study=" + getParameter(wadoURL, "studyUID") + "&series=" + getParameter(wadoURL, "seriesUID");
    urlTmp += "&object=" + getParameter(wadoURL, "objectUID");
    reader.readDicom(urlTmp);*/

    /*jQuery.post(urlTmp, function(data) {
    	alert(data); 
    }); */

    var dicomBuffer=reader.getInputBuffer();
    var dicomReader=reader.getReader();
    var dicomParser=new DicomParser(dicomBuffer,dicomReader);
    dicomParser.parseAll();
    var elementindex=0;
    for(;elementindex<dicomParser.dicomElement.length;elementindex++)
    {
        var dicomElement=dicomParser.dicomElement[elementindex];
        if(dicomElement.name=="windowWidth")
        {
            wwidth=ww=dicomElement.value[0];
        }
        else if(dicomElement.name=="windowCenter")
        {
            wcenter=wc=dicomElement.value[0];
        }
        else if(dicomElement.name=="rescaleIntercept")
        {
            rescale_Intercept=parseInt(dicomElement.value);
        }
        else if(dicomElement.name=="rescaleSlope")
        {
            rescale_Slope=parseInt(dicomElement.value);
        }
    }
    pixelBuffer=dicomParser.pixelBuffer;
    lookupObj=new LookupTable();
    lookupObj.setData(wc,ww,rescale_Slope,rescale_Intercept);
    lookupObj.calculateHULookup();
    huLookupTable=lookupObj.huLookup;

    //canvas = document.getElementById("imageCanvas");
    ctx = jcanvas.getContext("2d");
    var iNewWidth = jcanvas.width;
    var iNewHeight = jcanvas.height;

    jcanvas.width = column;
    jcanvas.height = row;

    ctx.fillRect(0, 0, column, row);
    myImageData = ctx.getImageData(0,0,column,row);

    getWindowingValue();
    lookupObj.setWindowingdata(wc,ww);

    jcanvas.width = iNewWidth;
    jcanvas.height = iNewHeight;

    genImage();
    parent.imageLoaded=1;
}

function genImage()
{
    var tmpCanvas = document.createElement('canvas');

    var sw = jcanvas.width;
    var sh = jcanvas.height;

    tmpCanvas.width = column;
    tmpCanvas.height = row;

    tmpCanvas.style.width = column;
    tmpCanvas.style.height = row;

    var tmpCxt = tmpCanvas.getContext('2d');

    lookupObj.calculateLookup();
    lookupTable=lookupObj.ylookup;
    var n=4;
    for(var yPix=0; yPix<row; yPix++)
    {
        for(var xPix=0; xPix<column;xPix++)
        {
            var offset = (yPix * column + xPix) * 4;
            var pxValue=lookupTable[pixelBuffer[n]];	n++;
            myImageData.data[offset]=	parseInt(pxValue);
            myImageData.data[offset+1]=	parseInt(pxValue);
            myImageData.data[offset+2]=	parseInt(pxValue);
        }
    }

    tmpCxt.putImageData(myImageData, 0,0);
    //ctx.scale(1.5,1.5);
    ctx.drawImage(tmpCanvas, 0, 0, column, row, 0, 0, sw, sh);
    //ctx.drawImage(tmpCanvas, 0, 0, tmpCanvas.width , tmpCanvas.height, 0, 0, sw, sh);
}

function urlHandler(transaction, results) {
    var row = results.rows.item(0);

    var queryString = jQuery(jcanvas).parent().parent().find("#frameSrc").html();
    var insUID = getParameter(queryString, 'objectUID');

    wadoURL = row['ServerURL'] + "/wado?requestType=WADO&contentType=application/dicom&studyUID=" + row['StudyInstanceUID'] + "&seriesUID=" + row['SeriesInstanceUID'] + "&objectUID=" + insUID; //tances[imgInc];

    //wadoURL += getWindowingValue();
    parseAndLoadDicom();
}

function getWindowingValue() {
    var divVal = selectedFrame.find('#windowLevel').html();
    var values = divVal.split("/");
    wc = values[0].substring(values[0].indexOf(':')+1).trim();
    ww = values[1].substring(values[1].indexOf(':')+1).trim();
}

function applyWindowing() {
    //var queryString = window.top.location.search.substring(1);
    var queryString = window.location.href;
    var seriesUID = getParameter(queryString, 'seriesUID');

    var sql = "select StudyInstanceUID, SeriesInstanceUID, SopUID from instance where SeriesInstanceUID='" + seriesUID + "';";
    var myDb = initDB();

    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], windowingHandler, errorHandler);
    });
}

function windowingHandler(transaction, results) {
    for(var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);
    //retrieveImage1(row['StudyInstanceUID'], row['SeriesIntanceUID'], row['SopUID']);
    }
}

function retrieveImage1(studyUID, seriesUID, instanceUID) {

    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    /*var selServer = $("#availableServers input[type=checkbox]:checked").parent().parent();
    var host = selServer.find('td:nth-child(4)').html();
    var wadoPort = selServer.find('td:nth-child(6)').html(); */

    var xhr = new XMLHttpRequest();
    //var url = 'Image.do?serverURL=http://' + host + ':' + wadoPort + '&study=' + studyUID + '&series=' + seriesUID + '&object=' + instanceUID;
    var url = 'Image.do?serverURL=' + parent.wadoURL.substring(0, parent.wadoURL.indexOf('wado')-1) + '&study=' + studyUID + '&series=' + seriesUID + '&object=' + instanceUID;
    url = url + '&windowCenter=' + parent.wc + '&windowWidth=' + parent.ww;

    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        if(this.status == 200) {
            window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
                var fn = '';
                /*if(sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1') {
                fn = instanceUID+'.pdf';
            } else { */
                fn = instanceUID+'.jpg';
                //}

                fs.root.getFile(fn, {
                    create:true
                }, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        writer.onwriteend = function(e) {
                            console.log(fileEntry.fullPath + " created");
                        //updateProgress();
                        }
                        writer.onerror = function(e) {
                            console.log(e.toString());
                        }

                        var bb;
                        if(window.BlobBuilder) {
                            bb = new BlobBuilder();
                        } else if(window.WebKitBlobBuilder) {
                            bb = new WebKitBlobBuilder();
                        }
                        bb.append(xhr.response);

                        /*if(sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1') {
                      	writer.write(bb.getBlob('application/pdf'));
                     } else { */
                        writer.write(bb.getBlob('image/jpeg'));
                    //}
                    }, fileErrorHandler);
                }, fileErrorHandler);
            }, fileErrorHandler);
        }
    };
    xhr.send();
}
