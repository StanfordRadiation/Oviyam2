
var colIndex;
var rowIndex;

var currSer='';

function showSeries1() {
    var qStr = window.top.location.search.substring(1);
    var serUID = getParameter(qStr, 'seriesUID');

    var sqlStr = "select SeriesInstanceUID, SeriesDescription from series where StudyInstanceUID='" + pat.studyUID + "'";

    var myDb = initDB();
    myDb.transaction(function(tx) {
        tx.executeSql(sqlStr, [], getSeriesDescription, errorHandler);
    });
}

function getSeriesDescription(trans, results) {
    var divElement = document.getElementById('tabs_div');
    // divElement.style.border = 'none';
    var divContent = '<table width="100%" height="100%" cellspacing="2" cellpadding="0" border="0">';

    var serUids = new Array();
    for(var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);
        serUids[i] =  row['SeriesInstanceUID'];
    }

    var cnt = 0;

    if(isCompatible()) {
        for(var x=0; x<rowIndex+1; x++) {
            divContent += '<tr height="' + 100/(rowIndex+1) +'%">';
            for(var y=0; y<colIndex+1; y++) {
                divContent += '<td style="padding:0;margin:0;" width="' + 100/(colIndex+1) + '%"><iframe id="frame' + cnt;
                divContent += '" height="100%" width="100%" frameBorder="0" scrolling="no" ';
                if(cnt < serUids.length) {
                	if(currSer != '' && currSer == serUids[cnt]) {
                		divContent += 'src="frameContent.html?seriesUID=' + serUids[cnt] + '&instanceNumber=' + parent.imgNo + '"';
                	} else {
                    	divContent += 'src="frameContent.html?seriesUID=' + serUids[cnt] + '"';
                	}
                }
                divContent += ' style="background:#000"></iframe></td>';
                cnt = cnt + 1;
            }
            divContent += '</tr>';
        }
        divContent += '</table>';
    } else {
        //var qs = window.location.href;
        var qs = $('iframe').attr('src');

        for(var x=0; x<rowIndex+1; x++) {
            divContent += '<tr height="' + 100/(rowIndex+1) +'%">';
            for(var y=0; y<colIndex+1; y++) {
                divContent += '<td style="padding:0;margin:0;" width="' + 100/(colIndex+1) + '%"><iframe id="frame' + cnt;
                divContent += '" height="100%" width="100%" frameBorder="0" scrolling="no"';
                if(cnt < serUids.length) {
                    divContent += 'src="frameContent.html?serverURL=';
                    divContent += getParameter(qs, 'serverURL') + '&studyUID=' + getParameter(qs, 'studyUID');
                    divContent += '&seriesUID=' + serUids[cnt] + '"';
                }
                divContent += ' style="background:#000"></iframe></td>';
                cnt = cnt + 1;
            }
            divContent += '</tr>';
        }
        divContent += '</table>';
    }

    //alert(divContent);
    divElement.innerHTML = divContent;

    jQuery('.seriesImgsIndex', window.parent.document).each(function() {
        var childs = jQuery(this).children();
        var imgCnt = 0;
        childs.each(function() {
            var bgClr = jQuery(this).css('background');
            bgClr = bgClr.substring(bgClr.indexOf('rgb('), bgClr.indexOf(')')+1);

            if(bgClr == 'rgb(255, 255, 255)') {
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
}
