var iPos = null;
var mDatabase = null;

function viewSeries(selectedRow) {
    if(typeof oTable != 'undefined') {
        iPos = oTable.fnGetData(selectedRow);
    } else {
        iPos = selectedRow;

    }
    mDatabase = initDB();
    var myDb = mDatabase;
    var sql = "select SeriesDescription, Modality, NoOfSeriesRelatedInstances, ReferencedSopIUID, SeriesInstanceUID, SopClassUID from series where StudyInstanceUID='" + iPos[9] + "';";
    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], wcSeriesHandler, errorHandler);
    });
}

function wcSeriesHandler(transaction, results) {
    var wcContent = '<div id="patName" style="font-size: 14px;font-weight: bold;font-family: Arial,Helvitica,Serif;">' + iPos[2] + '</div>';
    wcContent += '<div id="patID" style="font-size: 14px;font-weight: bold; font-family: Arial,Helvitica,Serif;">ID: ' + iPos[1] + '</div>';

    wcContent += '<table id="studyTable" style="font-family: Arial,Helvitica,Serif; font-size:12px; width: 100%;border: 2px outset white; "><tbody><tr>';
    wcContent += '<td colspan="2">' + iPos[6] + '</td></tr><tr>';
    wcContent += '<td>' + iPos[5] + '</td><td align="right">' + iPos[11] + ' Series</td></tr></tbody></table><br>';

    for(var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);

        // wcContent += '<table style="font-size:12px; color:white; width:100%" cellspacing="0"><tbody>
        // wcContent += '<tr><td>';

        wcContent += '<table style="table-layout:fixed; width: 100%; font-family: Arial,Helvitica,Serif; font-size:11px; background:#808080;border-radius:3px;">';
        wcContent += '<tbody><tr onclick="jQuery(this).next().toggle()" style="cursor: pointer; background: #BBB; font-weight:bold;"><td colspan="2">';
        wcContent += row['SeriesDescription'] + ' - Images: ' + row['NoOfSeriesRelatedInstances'] + '</td></tr>';
        wcContent += '<tr><td colspan="2"><table style="table-layout:fixed; width:100%;"><tbody><tr><td id="' + row['SeriesInstanceUID'].replace(/\./g,'_') + '" class="seriesImgsIndex" style="width: 94%">';

        var serIns = parseInt(row['NoOfSeriesRelatedInstances']);

        for(var j=0; j<serIns; j++) {
            if(j==0 || j==Math.round(serIns/2)-1 || j==serIns-1) {
                wcContent += '<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>';
            } else {
                wcContent += '<div style="background: #a6a6a6; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>';
            }
        }
        wcContent += '</td>';
        if(serIns > 3) {
            wcContent += '<td align="right" style="vertical-align: top; "><img class="toggleImgView" src="images/three.png" onclick="changeImgView(this)" name="' + row['SeriesInstanceUID'] + '"></td></tr>';
        } else {
            wcContent += '<td align="right" style="vertical-align: top; "><img class="toggleImgView" src="images/all.png" name="' + row['SeriesInstanceUID'] + '"></td></tr>';
        }
        wcContent += '<tr><td colspan="2" style="padding: 1px 1px">';

        var serUidTmp = row['SeriesInstanceUID'].replace(/\./g,'_');

        for(j=0; j<serIns; j++) {
            if(j==0 || j==Math.round(serIns/2)-1 || j==serIns-1) {
                wcContent += '<img class="westImgs" name="' + row['SopClassUID'] + '" id="' + serUidTmp + '_' + parseInt(j+1) + '" serUid="' + row['SeriesInstanceUID'] + '_' + j + '" onclick="changeSeries(this)" height="48px">';
            } else {
                wcContent += '<img class="westImgs" name="' + row['SopClassUID'] + '" id="' + serUidTmp + '_' + parseInt(j+1) + '" serUid="' + row['SeriesInstanceUID'] + '_' + j + '" onclick="changeSeries(this)" height="48px" style="display:none">';
            }
        }
        wcContent += '</td></tr></tbody></table>';
        wcContent += '</td></tr></tbody></table><div style="height:4px"></div>'; //</td></tr>';
        wcContent += '<div id="MFContainer"></div>';
    }

    // wcContent += '</tbody></table>';
    jQuery('#westPane').html(wcContent);

    var bgClr = jQuery('#westPane').css('background-color');
    bgClr = bgClr.substring(bgClr.indexOf('(')+1, bgClr.indexOf(')'));
    var bgColorArr = bgClr.split(',');
    bgClr = 'rgb(';
    for(i = 0; i<bgColorArr.length; i++) {
        bgClr += (255 - bgColorArr[i]);
        if(i != bgColorArr.length-1) {
            bgClr += ' , ';
        }

    }
    bgClr += ')';
    jQuery('#studyTable').css('color', bgClr);
    jQuery('#westPane').css('color', bgClr);

    loadSeriesImages('.westImgs');
}

function loadSeriesImages(className) {
    var imgs = jQuery(className);
    var myDb1 = initDB();
    imgs.each(function(index) {
        var container = jQuery(this).get(0);

        var arr = jQuery(this).attr('serUid').split('_');

        var tmpSql = "select SopUID, NumberOfFrames from instance where SeriesInstanceUID='" + arr[0] + "';";
        myDb1.transaction(function(tx1) {
            tx1.executeSql(tmpSql, [], function(trans, results) {
                for(var i=0; i<results.rows.length; i++) {
                    var row = results.rows.item(i);
                    if(i==arr[1]) {
                        var fileName = null;
                        if(container.name == '1.2.840.10008.5.1.4.1.1.104.1') {
                            fileName = row['SopUID'] + ".pdf";
                        } else if(container.name.indexOf('1.2.840.10008.5.1.4.1.1.8') >= 0) {
                            container.src = 'images/SR_Latest.png';
                            continue;
                        } else {
                            fileName = row['SopUID'] + ".jpg";
                        }
                        viewImage(fileName, container);

                        if(row['NumberOfFrames'] != '') {
                            var cont = jQuery('#MFContainer');
                            var mfCont = '';
                            var imgId = row['SopUID'].replace(/\./g,'_');
                            for(var k=1; k<=parseInt(row['NumberOfFrames']); k++) {
                                mfCont += '<img id="' + imgId + "_" + k +'" height="48px" style="display:none;">';
                            }
                            cont.append(mfCont);

                            for(k=1; k<=parseInt(row['NumberOfFrames']); k++) {
                                var fName = row['SopUID'] + "_" + k + ".jpg";
                                viewImage(fName, jQuery('#' + imgId + "_" + k).get(0));
                            }
                        }
                    }
                } // for
            }, errorHandler);
        }); // for transaction
    }); //for each
}

function toggleImageView(img) {
    var tableBody = jQuery(img).parent().parent().parent().parent();
    var tabContent = '<tbody><tr><td id="' + jQuery(img).parent().prev().attr('id') + '" class="seriesImgsIndex" style="width: 95%">';

    var imgSrc = img.src;
    var togImgView;
    if(imgSrc.indexOf("all.png") >=0 ) {
        togImgView = 'one';
    } else if(imgSrc.indexOf("one.png") >=0 ) {
        togImgView = 'three';
    } else {
        togImgView = 'all';
    }

    //var serIns = parseInt(row['NoOfSeriesRelatedInstances']);
    var serIns = jQuery(img).parent().parent().children().children('div').size();

    for(var j=0; j<serIns; j++) {
        if(togImgView == 'one') {
            if(j==0) {
                tabContent += '<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>';
            } else {
                tabContent += '<div style="background: #a6a6a6; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>';
            }
        } else if(togImgView == 'three') {
            if(j==0 || j==Math.round(serIns/2)-1 || j==serIns-1) {
                tabContent += '<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>';
            } else {
                tabContent += '<div style="background: #a6a6a6; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>';
            }
        } else {
            tabContent += '<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>';
        }
    }
    tabContent += '</td>';
    if(togImgView == 'one') {
        tabContent += '<td align="right" style="vertical-align: top; "><img class="toggleImgView" src="images/one.png" onclick="toggleImageView(this)" name="' + img.name + '"></td></tr>';
    } else if(togImgView == 'three')  {
        tabContent += '<td align="right" style="vertical-align: top; "><img class="toggleImgView" src="images/three.png" onclick="toggleImageView(this)" name="' + img.name  + '"></td></tr>';
    } else {
        tabContent += '<td align="right" style="vertical-align: top; "><img class="toggleImgView" src="images/all.png" onclick="toggleImageView(this)" name="' + img.name + '"></td></tr>';
    }
    tabContent += '<tr><td colspan="2" style="padding: 1px 1px">';

    for(j=0; j<serIns; j++) {
        if(togImgView == 'one') {
            if(j==0) { // || j==Math.round(serIns/2)-1 || j==serIns-1) {
                tabContent += '<img class="westImgs" name="' + 'SopClassUID' + '" id="' + img.name + '_' + j + '" height="48px" width="48px">';
            }
        } else if(togImgView == 'three') {
            if(j==0 || j==Math.round(serIns/2)-1 || j==serIns-1) {
                tabContent += '<img class="westImgs" name="' + 'SopClassUID' + '" id="' + img.name + '_' + j + '" height="48px" width="48px">';
            }
        } else {
            tabContent += '<img class="westImgs" name="' + 'SopClassUID' + '" id="' + img.name + '_' + j + '" height="48px" width="48px">';
        }
    }
    tabContent += '</td></tr></tbody>';

    //    }, errorHandler);
    //    });

    tableBody.html(tabContent);
    loadSeriesImages('.westImgs');

}

/*$('.westImgs').live('click', function() {
    var serUID_InsNo = $(this).attr('id').split('_');

    var sUID = serUID_InsNo[0];
    var insNo = serUID_InsNo[1];
    var url = 'frameContent.html?seriesUID=' + sUID;
    url += '&instanceNumber=' + insNo;
    var actFrame = getActiveFrame();
    actFrame.src = url;
});*/

function changeImgView(but) {
    //var table = $(but).parent().parent().parent().parent();
    //console.log(table.children().find('tr:nth-child(2)').children());

    var imgBut = $(but).attr('src');
    var imgCount = 0;

    if(imgBut.indexOf("all.png") >=0 ) {
        $(but).attr('src', 'images/one.png');

        $(but).parent().prev().children().each(function() {
            if(imgCount == 0) {
                $(this).css('background-color', '#00F');
            } else {
                $(this).css('background-color', '#a6a6a6');
            }
            imgCount++;
        });

        imgCount = 0;

        $(but).parent().parent().next().children().children().each(function() {
            if(imgCount == 0) {
                $(this).css('display', 'inline');
            } else {
                $(this).css('display', 'none');
            }
            imgCount++;
        });
    } else if(imgBut.indexOf("one.png") >=0 ) {
        $(but).attr('src', 'images/three.png');
        var serDivs = $(but).parent().prev().children();
        var totserDivs = serDivs.length;
        serDivs.each(function() {
            if(imgCount == 0 || imgCount == Math.round(totserDivs/2)-1 || imgCount == totserDivs-1) {
                $(this).css('background-color', '#00F');
            } else {
                $(this).css('background-color', '#a6a6a6');
            }
            imgCount++;
        });

        imgCount = 0;

        var serImgs = $(but).parent().parent().next().children().children();
        var serInsCnt = serImgs.length;
        serImgs.each(function() {
            if(imgCount == 0 || imgCount == Math.round(serInsCnt/2)-1 || imgCount == serInsCnt-1) {
                $(this).css('display', 'inline');
            } else {
                $(this).css('display', 'none');
            }
            imgCount++;
        });
    } else {
        $(but).attr('src', 'images/all.png');

        $(but).parent().prev().children().each(function() {
            $(this).css('background-color', '#00F');
        });

        $(but).parent().parent().next().children().children().each(function() {
            $(this).css('display', 'inline');
        });
    }

/* var tmp = $(but).attr('name');
                var tmp = tmp.split("|");
                var tagUrl = "tableContainer.jsp?patient=${param.patient}&study=${param.study}&dcmURL=${param.dcmURL}";
                tagUrl += "&wadoUrl=${param.wadoUrl}";
                tagUrl += "&series=" + tmp[0].trim() + "&numberOfImages=" + tmp[1].trim()+"&toggleImageView=0";
                table.load(encodeURI(tagUrl));*/
}

function changeSeries(image) {
    if(isCompatible()) {
        var serUidTmp = jQuery(image).attr('serUid').split('_');
        var url = 'frameContent.html?studyUID=' + pat.studyUID;
        url += '&seriesUID=' + serUidTmp[0];
        url += '&instanceNumber=' + serUidTmp[1];
        url += '&serverURL=' + pat.serverURL;
        var actFrame = getActiveFrame();
        actFrame.src = url;
    } else {
        var imgSrc = image.src;
        var url = 'frameContent.html?studyUID=' + getParameter(imgSrc, 'study');
        url += '&seriesUID=' + getParameter(imgSrc, 'series');
        url += '&instanceNumber=' + parseInt(image.name-1);
        url += '&serverURL=' + getParameter(imgSrc, 'serverURL');
        //alert(url);
        var actFrame = getActiveFrame();
        actFrame.src = url;
    }
    doMouseWheel = true;
}
