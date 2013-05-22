//Initialize the systemDB variable
function initDB() {
    var sysDB = null;
    try {
        if(!window.openDatabase) {
            initIndexedDB();
        } else {
            var shortName = "oviyam2db";
            var version = "1.0";
            var displayName = "Oviyam Database";
            var maxSize = 5 * 1024 * 1024;
            sysDB = openDatabase(shortName, version, displayName, maxSize);
        }
    } catch(e) {
        if(e==2) {
            alert("Invalid database version", "ERROR");
        } else {
            alert("Unknown error " + e, "ERROR");
        }
    }

    return sysDB;
}

function initIndexedDB() {
    if(window.mozIndexedDB) {
        window.indexedDB = window.mozIndexedDB;
        window.IDBKeyRange = window.IDBKeyRange;
        window.IDBTransaction = window.IDBTransaction;
    } else if(window.webkitIndexedDB) {
        window.indexedDB = window.webkitIndexedDB;
        window.IDBKeyRange = window.webkitIDBKeyRange;
        window.IDBTransaction = window.webkitIDBTransaction;
    }

    if(!window.indexedDB) {
        jAlert("Your browser doesn't supports web database", "Browser support");
        return;
    }
}

function resetLocalDB() {
    var database = initDB();
    database.transaction(function(tx) {
        var query = "SELECT StudyInstanceUID from study";
        tx.executeSql(query, [], function(trans, results){
            for(var i=0; i<results.rows.length; i++) {
                var row = results.rows.item(i);
                deleteStudy(row['StudyInstanceUID']);
            }
        }, errorHandler);
    });
}

function deleteStudy(studyIUID) {
    var database = initDB();

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

    var oTable = $.fn.dataTableInstances[0];
    oTable.fnClearTable();
}

function deleteFile(fileName) {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
        fs.root.getFile(fileName, {
            create: false
        }, function(fileEntry) {
            fileEntry.remove(function() {
                //console.log('File removed.');
            }, fileErrorHandler);
        }, fileErrorHandler);

    }, fileErrorHandler);
}

function executeQuery(sql) {
    var database = initDB();

    database.transaction(function(tx) {
        tx.executeSql(sql, [], nullDataHandler, errorHandler);
    });
}

function nullDataHandler(transaction, results) { }

function errorHandler(transaction, error) {
    if(error.code != 5) {
        alert("Error: " + error.message + "(Code: " + error.code + ")", "ERROR");
    } else {
        console.log(error.message);
    }
}

function fileErrorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }

    console.log('Error: ' + msg);
}
