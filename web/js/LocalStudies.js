var objTable = null;

function showAllLocalStudies(objTable1) {
    objTable = objTable1;
    var myDb = initDB();
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
    } else {
        var sql = "select patient.PatientId, PatientName, PatientBirthDate, PatientSex, AccessionNo, StudyDate, StudyDescription, ModalityInStudy, NoOfInstances, ReferringPhysicianName, study.StudyInstanceUID, NoOfSeries from patient, study where patient.Pk = study.Patient_Pk;";
        //var sql = "select PatientId, PatientName, PatientBirthDate from patient";
        myDb.transaction(function(tx) {
            tx.executeSql(sql, [], dataHandler, errorHandler);
        });
    }
}

function dataHandler(transaction, results) {
    if(typeof objTable == 'undefined' || objTable == null) {
        objTable = $('#resultTable').dataTable();
    }

    for(var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);
        objTable.fnAddData([
            '&nbsp;<img src="images/details_open.png" />',
            row['PatientId'],
            row['PatientName'],
            row['PatientBirthDate'],
            row['AccessionNo'],
            row['StudyDate'],
            row['StudyDescription'],
            row['ModalityInStudy'],
            row['NoOfInstances'],
            row['StudyInstanceUID'],
            row['ReferringPhysicianName'],
            row['NoOfSeries'],
            row['PatientSex']
            ]);
    }

    $.fn.dataTableInstances[0].push( objTable );
}