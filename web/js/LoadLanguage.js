
// getting selected language from cookies 
var lang = getCookie('language');
if (typeof lang == 'undefined' || lang.trim() == 'en_GB') {
    $.getScript('js/i18n/Bundle.js', function() {
        loadLabels();
    });
} else {
    var fileName = 'js/i18n/' + "Bundle_" + lang + ".js";
    $.getScript(fileName, function() {
        loadLabels();
    });
}


function loadLabels() {
    //index.html
    $('#productName').html(languages['PageTitle']);
    $('#lblPatientName').html(languages['PatientName']);
    $('#lblPatientID').html(languages['PatientId']);
    $('#lblDOB').html(languages['BirthDate']);
    $('#lblAccessionNumber').html(languages['AccessionNumber']);
    $('#lblStudyDate').html(languages['StudyDate']);
    $('#lblStudyDescription').html(languages['StudyDesc']);
    $('#lblModality').html(languages['Modality']);
    $('#lblInstanceCount').html(languages['InstanceCount']);

    //Tools.html
    $('#lblLayout').attr('title', languages['Layout']);
    $('#lblWindowing').attr('title', languages['Windowing']);
    $('#lblZoom').attr('title', languages['Zoom']);
    $('#lblMove').attr('title', languages['Move']);
    $('#lblScoutLine').attr('title', languages['ScoutLine']);
    $('#lblScrollImages').attr('title', languages['ScrollImage']);
    $('#lblSynchronize').attr('title', languages['Synchronize']);
    $('#lblVFlip').attr('title', languages['VFlip']);
    $('#lblHFlip').attr('title', languages['HFlip']);
    $('#lblLRotate').attr('title', languages['LRotate']);
    $('#lblRRotate').attr('title', languages['RRotate']);
    $('#lblReset').attr('title', languages['Reset']);
    $('#lblInvert').attr('title', languages['Invert']);
    $('#lblTextOverlay').attr('title', languages['TextOverlay']);
    $('#lblfullscreen').attr('title', languages['FullScreen']);
    $('#lblMetadata').attr('title', languages['MetaData']);
    $('#lblLines').attr('title', languages['Lines']);

    //config.html
    $('#lblServer').html(languages['Server']);
    $('#lblQueryParam').html(languages['QueryParam']);
    $('#lblPreferences').html(languages['Preferences']);

    //server.html
    $('#verifyBtn').html(languages['']);
    $('#addBtn').html(languages['']);
    $('#editBtn').html(languages['']);
    $('#deleteBtn').html(languages['']);
    $('#lblDescription').html(languages['Description']);
    $('#lblAETitle').html(languages['AETitle']);
    $('#lblHostName').html(languages['HostName']);
    $('#lblDicomPort').html(languages['Port']);
    $('#lblRetrieve').html(languages['']);
    $('#lblAET').html(languages['AETitle']);
    $('#lblport').html(languages['Port']);
    $('#updateListener').html(languages['Update']);

    //query param.html
    $('#qpAddBtn').html(languages['Add']);
    $('#qpDeleteBtn').html(languages['Delete']);
    $('#lblFilterName').html(languages['FilterName']);
    $('#lblStudyDateFilter').html(languages['StudyDateFilter']);
    $('#lblStudytimeFilter').html(languages['StudytimeFilter']);
    $('#lblModalityFilter').html(languages['ModalityFilter']);
    $('#lblAutoRefresh').html(languages['AutoRefresh']);

    //preference.html
    $('#saveSlider').html(languages['Update']);
    $('#saveTimeout').html(languages['Update']);
    $('#saveTheme').html(languages['Update']);
    $('#saveLanguage').html(languages['Update']);

    //New Search.html
    $("label[for=patId]").text(languages['PatientId']);
    $("label[for=patName]").text(languages['PatientName']);
    $("label[for=accessionNo]").text(languages['AccessionNumber']);
    $("label[for=birthDate]").text(languages['BirthDate']);
    $("label[for=studyDesc]").text(languages['StudyDesc']);
    $("label[for=referPhysician]").text(languages['ReferPhysician']);
    $(".bdate").prev().text(languages['BirthDate']);
    $(".fsdate").prev().text(languages['FromStudyDate']);
    $(".tsdate").prev().text(languages['ToStudyDate']);
    $(".searchBtn").text(languages['Search']);
    $(".clearBtn").text(languages['Reset']);
}

function getCookie(c_name)
{
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++)
    {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name)
        {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}