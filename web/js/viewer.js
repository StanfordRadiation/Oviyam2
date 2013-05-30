var pat = null;
var imgLoaded = false;
var myDatabase = null;
var loadedImgs = 0;

function loadViewerPage() {
	myLayout = $('#optional-container').layout({
    	west: {
        	size: 205
        }
  	});
	//addThemeSwitcher('.ui-layout-north',{ top: '13px', right: '20px' });
    initPage();

    $("#toolbarContainer").load("viewer_tools.html");
}

function getStudyDetails() {
    pat = $.cookies.get( 'patient' );
    var queryString = window.top.location.search.substring(1);
    var patId = getParameter(queryString, "patientID");
    var studyId = getParameter(queryString, "studyUID");
    var serverName = getParameter(queryString, "serverName");
    if(serverName == 'null') {
        serverName = '';
    }

    if(patId != null && studyId != null && serverName != null) {
        $.post("StudyInfo.do", {
            "patientID":patId,
            "studyUID":studyId,
            "serverName":serverName
        }, function(data) {
            if(data['error'] != null) {
                if(data['error'].trim() == 'Server not found') {
                    alert("Server not found!!!");
                    return;
                }
            }
            pat = data;
            $('#westPane').css('background-color', pat.bgColor);
            createTables();
        }, "json");
    } else {
        $('#westPane').css('background-color', pat.bgColor);
        createTables();
    }
}

function createTables() {
    document.title = pat.pat_Name;

    myDatabase = initDB();

    if (!window.openDatabase) {
        var myDB = window.indexedDB;
        var request = myDB.open("oviyamDB");
        request.onsuccess = function(event) {
            var db = event.result || event.target.result;
            var vReq = db.setVersion("1.0");
            vReq.onsuccess = function(e) {
                var tables = db.objectStoreNames;
                if(!tables.contains("patient")) {
                    db.createObjectStore("patient", {
                        keyPath: "PatientId"
                    });
                }
                if(!tables.contains("study")) {
                    db.createObjectStore("study", {
                        keyPath: "StudyInstanceUID"
                    });
                }
                if(!tables.contains("series")) {
                    db.createObjectStore("series", {
                        keyPath: "SeriesInstanceUID"
                    });
                }
                if(!tables.contains("instance")) {
                    db.createObjectStore("instance", {
                        keyPath: "SopUID"
                    });
                }
                console.log("Tables created!!!");
            }
        }
    } else {
        database = myDatabase;
        database.transaction(function(tx) {
            var sql = "CREATE TABLE IF NOT EXISTS patient(Pk INTEGER PRIMARY KEY, PatientId varchar(255) NOT NULL, PatientName varchar(255), PatientBirthDate varchar(30), PatientSex varchar(10));";
            tx.executeSql(sql, [], nullDataHandler, errorHandler);

            sql = "CREATE TABLE IF NOT EXISTS study(StudyInstanceUID varchar(255) NOT NULL PRIMARY KEY, StudyDate varchar(30), AccessionNo varchar(50), ReferringPhysicianName varchar(255), StudyDescription varchar(80), ModalityInStudy varchar(10), NoOfSeries integer, NoOfInstances integer, ServerURL varchar(50), DicomURL varchar(50), Patient_Pk INTEGER REFERENCES patient(Pk));";
            tx.executeSql(sql, [], nullDataHandler, errorHandler);

            sql = "CREATE TABLE IF NOT EXISTS series(SeriesInstanceUID varchar(255) NOT NULL PRIMARY KEY, SeriesNo varchar(50), Modality varchar(10), SeriesDescription varchar(100), BodyPartExamined varchar(100), NoOfSeriesRelatedInstances integer, PatientId varchar(255), StudyInstanceUID varchar(255), ReferencedSopIUID varchar(255), SopClassUID varchar(255));";
            tx.executeSql(sql, [], nullDataHandler, errorHandler);

            sql = "CREATE TABLE IF NOT EXISTS instance(SopUID varchar(255) NOT NULL PRIMARY KEY, InstanceNo integer, WindowCenter varchar(30), WindowWidth varchar(30), Rows varchar(5), Columns varchar(5), ImageOrientation varchar(16), SliceThickness varchar(16), SliceLocation float, FrameOfReferenceUID varchar(128), ImagePosition varchar(64), ImageOrientPatient varchar(64), PixelSpacing varchar(64), ReferencedSOPInsUID varchar(128), ImageType varchar(10), NumberOfFrames varchar(10), PatientId varchar(255), StudyInstanceUID varchar(255), SeriesInstanceUID varchar(255));";
            tx.executeSql(sql, [], nullDataHandler, errorHandler);
        });
    }

    checkStudyAvailability();
}

function isCompatible() {
    return !!(window.requestFileSystem || window.webkitRequestFileSystem);
}

function checkStudyAvailability() {
    //pat = $.cookies.get( 'patient' );
    var sql = "select StudyInstanceUID from study where StudyInstanceUID='" + pat.studyUID + "';";
    var myDb1 = myDatabase;
    myDb1.transaction(function(tx1) {
        tx1.executeSql(sql, [], function(trans, results) {
            if(results.rows.length == 0) {
                insertStudy();
                // load WestPane content
                var tmpUrl = "westContainer.jsp?patient=" + pat.pat_ID + "&study=" + pat.studyUID + "&patientName=" + pat.pat_Name;
                tmpUrl += "&studyDesc=" + pat.studyDesc + "&studyDate=" + pat.studyDate + "&totalSeries=" + pat.totalSeries + "&dcmURL=" + pat.dicomURL;
                tmpUrl += "&wadoUrl=" + pat.serverURL;
                $('#westPane').load(encodeURI(tmpUrl));
            } else {
                jQuery('#loadingView').hide();
                var sql1 = "select SeriesInstanceUID from series where StudyInstanceUID='" + pat.studyUID +"';";
                trans.executeSql(sql1, [], function(tran, results) {
                    var row = results.rows.item(0);
                    var link = '';
                    link = "frameContent.html?seriesUID=" + row['SeriesInstanceUID'];
                    if(isCompatible()) {
                        jQuery("iframe").attr('src',link);

                        var i=1;
                        var iPos = new Array();
                        iPos[0] = 'details_open.png';
                        iPos[1] = pat.pat_ID;
                        iPos[2] = pat.pat_Name;
                        iPos[3] = pat.pat_Birthdate;
                        iPos[4] = pat.accNumber;
                        iPos[5] = pat.studyDate;
                        iPos[6] = pat.studyDesc;
                        iPos[7] = pat.modality;
                        iPos[8] = pat.totalIns;
                        iPos[9] = pat.studyUID;
                        iPos[10] = pat.refPhysician;
                        iPos[11] = pat.totalSeries;
                        iPos[12] = pat.pat_gender;

                        /*for(var key in pat) {
                            if (pat.hasOwnProperty(key)) {
                                iPos[i] = pat[key];
                                i++;
                            }
                        } */

                        viewSeries(iPos);
                    } else {
                        var tmpUrl = "westContainer.jsp?patient=" + pat.pat_ID + "&study=" + pat.studyUID + "&patientName=" + pat.pat_Name;
                        tmpUrl += "&studyDesc=" + pat.studyDesc + "&studyDate=" + pat.studyDate + "&totalSeries=" + pat.totalSeries;

                        var lSql = "select DicomURL, ServerURL from study where StudyInstanceUID='" + pat.studyUID + "'";
                        //var myDb = initDB();
                        myDb1.transaction(function(tx) {
                            tx.executeSql(lSql, [], function(trans, results) {
                                var row = results.rows.item(0);
                                tmpUrl += "&dcmURL=" + row['DicomURL'] + "&wadoUrl=" + row['ServerURL'];
                                $('#westPane').load(encodeURI(tmpUrl));
                                if(!isCompatible()) {
                                    link += '&studyUID=' + pat.studyUID + '&serverURL=' + row['ServerURL'];
                                    jQuery("iframe").attr('src',link);
                                }
                            }, errorHandler);
                        });
                    }
                }, errorHandler);
            }
        }, errorHandler);
    });
}



function insertStudy() {
    //Insert records in study table for selected rows
    //var selectedRows = $("#resultTable input[type=checkbox]:checked").parent().parent();

    var totalImgs = 0;
    var i;
    var cells;

    if (!window.openDatabase) {
        var myDB = window.indexedDB;
        var request = myDB.open("oviyamDB");
        request.onsuccess = function(event) {
            var db = event.result || event.target.result;
            var trans = db.transaction(["patient"], window.IDBTransaction.READ_WRITE, 0);
            var store = trans.objectStore("patient");

            var row = '{PatientId:"' + pat.pat_ID + '", PatientName: "' + pat.pat_Name + '", PatientBirthDate: "' + pat.pat_Birthdate + '", PatientSex: "' + pat.pat_gender + '"}';
            store.put(eval('(' + row + ')'));

            var trans1 = db.transaction(["study"], window.IDBTransaction.READ_WRITE, 0);
            var store1 = trans1.objectStore("study");

            row = '{StudyInstanceUID:"' + pat.studyUID + '",StudyDate:"' + pat.studyDate + '",AccessionNo:"' + pat.accNumber + '",ReferringPhysicianName:"' + pat.refPhysician + '",StudyDescription:"' + pat.studyDesc + '",ModalityInStudy:"' + pat.modality + '",NoOfSeries:"' + pat.totalSeries + '",NoOfInstances:"' + pat.totalIns + '",ServerURL:"' + pat.serverURL + '",dicomURL:"' + pat.dicomURL + '",PatientId:"' + pat.pat_ID + '"}';
            store1.put(eval('(' + row + ')'));

            insertSeries(pat.pat_ID, pat.studyUID);
        }
    } else {
        var sql = "insert into patient(PatientId, PatientName, PatientBirthDate, PatientSex) values('" + pat.pat_ID +"','" + pat.pat_Name + "','" + pat.pat_Birthdate + "','" + pat.pat_gender +"');";
        insertPatient(sql, pat.studyUID);

        sql="insert into study values('" + pat.studyUID + "','" + pat.studyDate + "','" + pat.accNumber + "','" + pat.refPhysician + "','" + pat.studyDesc + "','" + pat.modality + "',"+ pat.totalSeries + "," + pat.totalIns + ",'" + pat.serverURL + "','" + pat.dicomURL + "',null)";
        executeQuery(sql);

        insertSeries(pat.pat_ID, pat.studyUID);
    }
}

function insertPatient(sql, tmpStudyUID) {
    var database = myDatabase;

    database.transaction(function(tx) {
        tx.executeSql(sql, [], function(trans, results) {
            var tmpSql = "update study set Patient_Pk=" + results.insertId + " where StudyInstanceUID='" + tmpStudyUID + "'";
            database.transaction(function(tx) {
                tx.executeSql(tmpSql, [], nullDataHandler, errorHandler);
            });
        }, errorHandler);
    });
}

function insertSeries(patId, studyUID) {
    var database = myDatabase;
    $.post("Series.do", {
        "patientID":patId,
        "studyUID":studyUID,
        "dcmURL":pat.dicomURL
    },
    function(data) {
        $.each(data, function(i, series) {
            if (!window.openDatabase) {
                var myDB = window.indexedDB;
                var request = myDB.open("oviyamDB");
                request.onsuccess = function(event) {
                    var db = event.result || event.target.result;
                    var trans = db.transaction(["series"], window.IDBTransaction.READ_WRITE, 0);
                    var store = trans.objectStore("series");

                    var row = '{SeriesInstanceUID:"' + series['seriesUID'] + '",SeriesNo:"' + series['seriesNumber'] + '",Modality:"' + series['modality'] + '",SeriesDescription:"' + series['seriesDesc'] + '",BodyPartExamined:"' + series['bodyPart'] + '",NoOfSeriesRelatedInstances:"' + series['totalInstances'] + '",PatientId:"' + series['patientId'] + '",StudyInstanceUID:"' + series['studyUID'] + '",ReferencedSopIUID:"", SopClassUID:""}';
                    store.put(eval('(' + row + ')'));
                }

                insertInstances(patId, studyUID, series['seriesUID']);
            } else {
                var sql = "insert into series values('" + series['seriesUID'] + "','" + series['seriesNumber'] + "','" + series['modality'] + "','" + series['seriesDesc'] + "','" + series['bodyPart'] + "'," + series['totalInstances'] + ",'" + series['patientId'] + "','" + series['studyUID'] + "','','');";
                database.transaction(function(tx) {
                    tx.executeSql(sql, [], function(trans, results) {
                        if(pat.serverURL != 'C-MOVE' && pat.serverURL != 'C-GET') {
                            insertInstances(patId, studyUID, series['seriesUID']);
                        }
                    }, errorHandler);
                });
            }
        });
    }, "json");
}

function insertInstances(patId, studyUID, seriesUID) {
    var database = myDatabase;
    $.post("Instance.do", {
        "patientId":patId,
        "studyUID":studyUID,
        "seriesUID":seriesUID,
        "dcmURL":pat.dicomURL,
        "serverURL":pat.serverURL
    },
    function(data) {
        $.each(data, function(i, instance) {
            //var sql = "insert into instance values('" + instance['SopUID'] + "'," + instance['InstanceNo'] + ",'" + instance['windowCenter'] + "','" + instance['windowWidth'] + "','" + instance['nativeRows'] + "','" + instance['nativeColumns'] + "','" + instance['imageOrientation'] + "','" + instance['sliceThickness'] + "','" + instance['sliceLocation'] + "','" + instance['frameOfReferenceUID'] + "','" + instance['imagePositionPatient'] + "','" + instance['imageOrientPatient'] + "','" + instance['pixelSpacing'] + "','" + instance['refSOPInsUID'] + "','" + instance['imageType'] + "','" + instance['numberOfFrames'] + "','" + patId + "','" + studyUID + "','" + seriesUID + "');";
            var sql = "insert into instance values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            database.transaction(function(rx) {
                rx.executeSql(sql, [instance['SopUID'], instance['InstanceNo'], instance['windowCenter'], instance['windowWidth'], instance['nativeRows'], instance['nativeColumns'], instance['imageOrientation'], instance['sliceThickness'], instance['sliceLocation'], instance['frameOfReferenceUID'], instance['imagePositionPatient'], instance['imageOrientPatient'], instance['pixelSpacing'], instance['refSOPInsUID'], instance['imageType'], instance['numberOfFrames'], patId, studyUID, seriesUID], function(trans, results){
                    if(isCompatible()) {

                        /*    retrieveImage(studyUID, seriesUID, instance['SopUID'], instance['SopClassUID'], null);
                        if(instance['numberOfFrames'] != '') {
                            for(var frmCnt = 1; frmCnt <= parseInt(instance['numberOfFrames']); frmCnt++) {
                                retrieveImage(studyUID, seriesUID, instance['SopUID'], instance['SopClassUID'], frmCnt);
                            }
                        } */

                        loadedImgs++;

                        if(loadedImgs == pat.totalIns) {
                            saveJpgImages();
                        }
                    } //else {
                    if(!imgLoaded) {
                        loadFirstImage(seriesUID);
                        imgLoaded = true;
                    }
                // }
                }, errorHandler);
            });

            if(i==0) {
                var sql1 = "update series set ReferencedSopIUID='" + instance['SopUID'] +"', SopClassUID='" + instance['SopClassUID'] + "' where StudyInstanceUID='" + studyUID + "' and SeriesInstanceUID='" + seriesUID +"';";
                database.transaction(function(tx) {
                    tx.executeSql(sql1, [], nullDataHandler, errorHandler);
                });
            }
        });
    }, "json");
}

function saveJpgImages() {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    var secondTR = $('.seriesTable');
    secondTR.find('img').each(function() {
        if(this.complete) {
            saveLocally(this);
        } else {
            this.onload = function() {
                saveLocally(this);
            };
        }

    });
}

function saveLocally(image) {
    var cvs = document.createElement('canvas');
    var ctx  = cvs.getContext("2d");

    var fn = '';
    if(image.src.indexOf('images/pdf.png') >= 0) {
		fn = getParameter($(image).attr('imgSrc'), 'object') +'.pdf';
    } else {
	    fn = getParameter(image.src, 'object') + '.jpg';
    }
    cvs.width = image.naturalWidth;
    cvs.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0);

	if(image.src.indexOf('images/pdf.png') >= 0) {
    	var imd = cvs.toDataURL('image/pdf');
  	    var ui8a = convertDataURIToBinary(imd);
	    var bb = new Blob([ui8a], {
    	    type: 'image/pdf'
    	});
    } else {
     	var imd = cvs.toDataURL('image/jpeg');
  	    var ui8a = convertDataURIToBinary(imd);
	    var bb = new Blob([ui8a], {
    	    type: 'image/jpeg'
    	});
    }

    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
        fs.root.getFile(fn, {
            create: true
        }, function(fileEntry) {
            // Create a FileWriter object for our FileEntry.
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function(e) {
                    console.log(fileEntry.fullPath + ' Write completed.');
                };

                fileWriter.onerror = function(e) {
                    console.log('Write failed: ' + e.toString());
                };

                fileWriter.write(bb); //.getBlob(contentType[extname]));
            }, fileErrorHandler);
        }, fileErrorHandler);
    }, fileErrorHandler);
}

function convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}

function loadFirstImage(serUID) {
    var link = '';
    if(isCompatible()) {
        link = "frameContent.html?seriesUID=" + serUID;
    } else {
        link = 'frameContent.html?studyUID=' + pat.studyUID + '&seriesUID=' + serUID + '&serverURL=' + pat.serverURL;
    }

    jQuery("iframe").attr('src',link);
    jQuery('#loadingView').hide();
}

function retrieveImage(studyUID, seriesUID, instanceUID, sopClassUID, frameNumber) {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    var xhr = new XMLHttpRequest();
    var url;

    if(frameNumber == null) {
        url = 'Image.do?serverURL=' + pat.serverURL + '&study=' + studyUID + '&series=' + seriesUID + '&object=' + instanceUID;
    } else {
        url = 'Image.do?serverURL=' + pat.serverURL + '&study=' + studyUID + '&series=' + seriesUID + '&object=' + instanceUID + '&frameNumber=' + frameNumber;
        instanceUID = instanceUID + "_" + frameNumber;
    //console.log("multiframe: " + frameNumber);
    }

    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        if(this.status == 200) {
            window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
                var fn = '';
                if(sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1') {
                    fn = instanceUID+'.pdf';
                } else {
                    fn = instanceUID+'.jpg';
                }

                fs.root.getFile(fn, {
                    create:true
                }, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        writer.onwriteend = function(e) {
                            //console.log(fileEntry.fullPath + " created");
                            //loadedImgs++;
                            //if(loadedImgs == parseInt(pat.totalIns)) {
                            //	jQuery('#loadingView').hide();
                            //}

                            if(!imgLoaded) {
                                loadFirstImage(seriesUID);
                                imgLoaded = true;
                            }
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

                        if(bb) {
                            bb.append(xhr.response);

                            if(sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1') {
                                writer.write(bb.getBlob('application/pdf'));
                            } else {
                                writer.write(bb.getBlob('image/jpeg'));
                            }
                        } else {
                            if(sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1') {
                                bb = new Blob([xhr.response], {
                                    type:'application/pdf'
                                });
                            } else {
                                bb = new Blob([xhr.response], {
                                    type: 'image/jpeg'
                                });
                            }
                            writer.write(bb);
                        }
                    }, fileErrorHandler);
                }, fileErrorHandler);
            }, fileErrorHandler);
        }
    };
    xhr.send();
}
