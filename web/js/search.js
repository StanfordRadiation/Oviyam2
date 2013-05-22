$(document).ready(function() {
	$('button').button();
    $("#fromDate").datepicker();
    $("#toDate").datepicker();
    $("#birthDate").datepicker();

    $('#okBtn').click(function() {
        var searchURL = "queryResult.jsp?";
        if($('#patName').val() != null && $('#patName').val() != '') {
            searchURL += 'patientName=' + $('#patName').val();
        }

        if($('#patId').val() != null && $('#patId').val() != '') {
            searchURL += '&patientId=' + $('#patId').val();
        }

        if($('#accessionNo').val() != null && $('#accessionNo').val() != '') {
            searchURL += '&accessionNumber=' + $('#accessionNo').val();
        }

        if($('#birthDate').val() != null && $('#birthDate').val() != '') {
            searchURL += '&birthDate=' + convertToDcm4cheeDate($('#birthDate').val());
        }

        if($('#fromDate').val() != null && $('#fromDate').val() != '') {
            searchURL += '&searchDays=between&from=' + convertToDcm4cheeDate($('#fromDate').val());
        }

        if($('#toDate').val() != null && $('#toDate').val() != '') {
            searchURL += '&to=' + convertToDcm4cheeDate($('#toDate').val());
        }

        if($('#modalities').val() != null && $('#modalities').val() != '') {
            searchURL += '&modality=' + $('#modalities').val();
        }

        if($('#studyDesc').val() != null && $('#studyDesc').val() != '') {
            searchURL += '&studyDesc=' + $('#studyDesc').val();
        }

        if($('#referPhysician').val() != null && $('#referPhysician').val() != '') {
            searchURL += '&referPhysician=' + $('#referPhysician').val();
        }


        var dUrl = $('.ui-tabs-selected').find('a').attr('name');
        searchURL += "&dcmURL=" + dUrl;

        modal.close();

        var divContent = $('.ui-tabs-selected').find('a').attr('href');
        searchURL += '&tabName=' + divContent.replace('#','');

        var tabIndex = $('#tabs_div').data('tabs').options.selected;
        searchURL += '&tabIndex=' + tabIndex;
        
        divContent += '_content'; 

        $(divContent).load(encodeURI(searchURL), function() {
            clearInterval(timer);
            checkLocalStudies();
        });

        $('#westPane').html('');
    });  // for okBtn click

    $('#resetBtn').click(function() {
        $('#patName').val('');
        $('#patId').val('');
        $('#accessionNo').val('');
        $('#birthDate').val('');
        $('#fromDate').val('');
        $('#toDate').val('');

        //To clear modality filter
        var $checked = $("#modalitiesTable :checked");
        $checked.each(function() {
            $(this).attr('checked', false);
        });
        $('#modalities').val('');
    });  // for resetBtn click

    $('#modalitiesTable tbody tr td').click(function() {
        var $checked = $("#modalitiesTable :checked");
        var $len = $checked.length;
        var selModalities = "";
        for(var i=0; i<$len; i++) {
            if(selModalities == "") {
                selModalities = selModalities + $checked[i].value;
            } else {
                selModalities = selModalities + "\\" + $checked[i].value;
            }
        }

        $("#modalities").val(selModalities);
    });

    function convertToDcm4cheeDate(givenDate) {
        var retVal = "";
        if(givenDate != "") {
            var str = givenDate.split("/");
            retVal = str[2] + str[0] + str[1];
        }
        return(retVal);
    }

    function checkLocalStudies() {
        var myDB = initDB();
        var sql = "select StudyInstanceUID from study";
        myDB.transaction(function(tx) {
            tx.executeSql(sql, [], function(trans, results) {
                for(var i=0; i<results.rows.length; i++) {
                    var row = results.rows.item(i);
                    var img = document.getElementById(row['StudyInstanceUID']);
                    if(img != null) {
                        img.style.visibility = 'visible';
                    }
                }
            }, errorHandler);
        });
    }

}); //for document.ready
