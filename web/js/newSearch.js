function searchClick(searchBtn) {
    var inputFields = $(searchBtn).parent().parent().parent().find('input');
    var searchURL = "queryResult.jsp?";
    inputFields.each(function() {
        if(this.id == 'patId') {
            if(this.value.trim() != '') {
                searchURL += 'patientId=' + this.value.trim();
            }
        } else if(this.id == 'patName') {
            if(this.value.trim() != '') {
                searchURL += '&patientName=' + this.value.trim();
            }
        } else if(this.id == 'accessionNo') {
            if(this.value.trim() != '') {
                searchURL += '&accessionNumber=' + this.value.trim();
            }
       // } else if($(this).siblings()[0].innerHTML == 'Birth Date') {
        } else if($(this).prop('class') == 'bdate hasDatepicker') {
            if(this.value.trim() != '') {
                searchURL += '&birthDate=' + convertToDcm4cheeDate(this.value.trim());
            }
        //} else if($(this).siblings()[0].innerHTML == 'Study Date (From)') {
        } else if($(this).prop('class') == 'fsdate hasDatepicker') {
            if(this.value.trim() != '') {
                searchURL += '&searchDays=between&from=' + convertToDcm4cheeDate(this.value.trim());
            }
        //} else if($(this).siblings()[0].innerHTML == 'Study Date (To)') {
        } else if($(this).prop('class') == 'tsdate hasDatepicker') {
            if(this.value.trim() != '') {
                searchURL += '&to=' + convertToDcm4cheeDate(this.value.trim());
            }
        } else if(this.id == 'studyDesc') {
            if(this.value.trim() != '') {
                searchURL += '&studyDesc=' + this.value.trim();
            }
        } else if(this.id == 'referPhysician') {
            if(this.value.trim() != '') {
                searchURL += '&referPhysician=' + this.value.trim();
            }
        }
    });  // for each

    var modalities = $(searchBtn).parent().prev().find('span')[1].innerHTML.replace(/, /g, '\\');
    if(modalities.trim() != 'ALL') {
        searchURL += '&modality=' + modalities.trim();
    }

    var dUrl = $('.ui-tabs-selected').find('a').attr('name');
    searchURL += "&dcmURL=" + dUrl;

    var divContent = $('.ui-tabs-selected').find('a').attr('href');
    searchURL += '&tabName=' + divContent.replace('#','');

    var tabIndex = $('#tabs_div').data('tabs').options.selected;
    searchURL += '&tabIndex=' + tabIndex;

    divContent += '_content';

    $(divContent).html('');
    $('#westPane').html('');

    $(divContent).load(encodeURI(searchURL), function() {
        clearInterval(timer);
        checkLocalStudies();
    });
   
} // end of searchClick()

function resetClick(resetBtn) {
    var inputFields = $(resetBtn).parent().parent().parent().find('input');
    inputFields.each(function() {
        this.value = '';
    }); //for each
}

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
