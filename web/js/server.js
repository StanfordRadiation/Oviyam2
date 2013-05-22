
var db;
var $url = "";
var oTable;
var addBtnPressed = false;
var editBtnPressed = false;
var callingAET = '';

$(document).ready(function() {

    $('button').button();

    loadTable();

    $("#addBtn").click(function() {
        if(!addBtnPressed) {
            var str = '<tr style="width:100%"><td><input type="checkbox" disabled="true" /></td><td><input type="text" id="desc" style="width:100%"></td>' +
            '<td><input type="text" id="aet" style="width:100%"></td>' +
            '<td><input type="text" id="host" style="width:100%"></td><td><input type="text" id="port" style="width:100%"></td>' +
            '<td><select id="retrieve" style="width:100%" onchange="hideWadoFields()"><option value="WADO">WADO</option><option value="C-MOVE">C-MOVE</option><option value="C-GET">C-GET</option></select></td>' +
            '<td><input type="text" id="wadoCxt" value="wado" style="width:100%" title="WADO Context"></td><td><input type="text" id="wadoPort" value="8080" style="width:87%" title="WADO Port">' +
            '<a href="#" onClick="insertTable();"><img src="images/save.png"></a></td></tr>';
            //var wid = $("#serverTable").css('width');
            $("#serverTable > tbody:last").append(str);
            // $("#serverTable").css('width', '1088px');
            addBtnPressed = true;
        }
    });

    $("#verifyBtn").click(function(){
        var msg = '';
        if($url != "" && ($('#serverTable :checked').length == 1)) {
            $.get("Echo.do?dicomURL=" + $url, function(data) {
                if (data == "EchoSuccess") {
                    msg = "Echo " + $url + " successfully!!!";
                    $.ambiance({
                        message: msg,
                        type: 'success'
                    });
                } else {
                    msg = "Echo " + $url + " not successfully!!!";
                    $.ambiance({
                        message: msg,
                        type: 'error'
                    });
                }
            });
        } else {
            msg = "Please select server!!!";
            $.ambiance({
                message: msg,
                type: 'error'
            });
        }
    });


    oTable = $('#serverTable').dataTable({
        "bJQueryUI": true,
        //"sPaginationType": "full_numbers"
        "bPaginate": false,
        "bFilter": false,
        "bSort": false
    });

    $(".fg-toolbar.ui-corner-tl").html('<b>Servers</b>');

    $("#deleteBtn").click(function(){
        deleteSelectedRow();
    //oTable.fnClearTable();
    //loadTable();
    });

    $("#editBtn").click(function() {
        if(!editBtnPressed) {
            editSelectedRow();
        }
    });

    $('.dataTables_wrapper').css('min-height','200px');

    $("#updateListener").click(function() {
        $.ajax({
            url: 'Listener.do',
            type: 'POST',
            data: {
                'aetitle':$('#listener_ae').val(),
                'port':$('#listener_port').val(),
                'action':'Update'
            },
            success: function(msg1) {
                if(msg1.trim() == 'success') {
                    $.ambiance({
                        message: "Listener details updated and listener restarted!!!",
                        type: 'success'
                    });
                } else {
                    $.ambiance({
                        message: "Error while updating listener details!!!",
                        type: 'error'
                    });
                }
            }
        });
    });

}); // for document.ready

// To create table
function createTables(database) {
    database.transaction(function(tx) {
        var sql = "CREATE TABLE IF NOT EXISTS ae(pk integer NOT NULL PRIMARY KEY AUTOINCREMENT, logicalname varchar(255), hostname varchar(255),aetitle varchar(255),port integer);";
        tx.executeSql(sql, [], nullDataHandler, errorHandler);
    });
}

function insertTable() {
    var msg = '';
    if($('#desc').val().toLowerCase() == "local") {
        alert($('#desc').val() + " is reserved for local studies, please try some other name!!!");
        return;
    }

    if($("#desc").val()!='' && $("#aet").val()!='' && $("#host").val()!='' && $("#port").val()!='' && $("#wadoport").val()!='') {
        $.ajax({
            url: 'ServerConfig.do',
            data: {
                'logicalName':$("#desc").val(),
                'aeTitle':$("#aet").val(),
                'hostName':$("#host").val(),
                'port':$("#port").val(),
                'retrieve':$("#retrieve").val(),
                'wadoContext':$("#wadoCxt").val(),
                'wadoPort':$("#wadoPort").val(),
                'todo':'ADD'
            },
            type: 'POST',
            success: function(msg1) {
                if(msg1.trim() == 'success') {
                    oTable.fnClearTable();
                    loadTable();
                    msg = "Server added!!!";
                } else if(msg1.trim() == 'duplicate') {
                    msg = "Logical name already exists!!!";
                }
                $.ambiance({
                    message: msg,
                    type: 'success'
                });
            }
        });
    } else {
        msg = "Please enter all the details";
        $.ambiance({
            message: msg,
            type: 'error'
        });
        return;
    }
    addBtnPressed = false;
}

function editTable() {

    $.ajax({
        url: 'ServerConfig.do',
        data: {
            'logicalName':$("#desc").val(),
            'aeTitle':$("#aet").val(),
            'hostName':$("#host").val(),
            'port':$("#port").val(),
            'retrieve':$("#retrieve").val(),
            'wadoContext':$("#wadoCxt").val(),
            'wadoPort':$("#wadoPort").val(),
            'todo':'EDIT'
        },
        type: 'POST',
        success: function(msg1) {
            oTable.fnClearTable();
            loadTable();
            var msg = "Server edited!!!";
            $.ambiance({
                message: msg,
                type: 'success'
            });
        }
    });

    editBtnPressed = false;
}

function loadTable() {
    $.getJSON('DicomNodes.do', function(result) {
        $.each(result, function(i, row) {
            if(typeof row['callingAET'] == 'undefined') {
                //$('#serverTable').databind(result);

                var wadoCxt = '';
                if( typeof row['wadocontext'] != 'undefined' ) {
                    wadoCxt = row['wadocontext'];
                }

                var wadoPort = '';
                if ( typeof row['wadoport'] != 'undefined' ) {
                    wadoPort = row['wadoport'];
                }

                oTable.fnAddData([
                    "<input type='checkbox' style='text-align:center'>",
                    row['logicalname'],
                    row['aetitle'],
                    row['hostname'],
                    row['port'],
                    row['retrieve'],
                    wadoCxt,
                    wadoPort
                    ]);
            } else {
                callingAET = row['callingAET'].trim();
                $("#listener_ae").val(callingAET);
                $("#listener_port").val(row['listenerPort'].trim());
            }
        })
    });

}

function deleteRow() {
    var host = $url.substring($url.indexOf("@")+1, $url.lastIndexOf(":"));
    var port = $url.substring($url.lastIndexOf(":")+1);
    var ae = $url.substring($url.lastIndexOf("/")+1, $url.indexOf("@"));
    var sql = "delete from ae where hostname=? and aetitle=? and port=?";

    db.transaction(function(tx) {
        tx.executeSql(sql, [host, ae, port], nullDataHandler, errorHandler);
    });
}

function deleteSelectedRow() {
    var msg = '';
    var selectRow = $('#serverTable :checked').parent().parent();
    if($('#serverTable :checked').length == 1) {
        var logical = selectRow.find('td:nth-child(2)').html();
        var ae = selectRow.find('td:nth-child(3)').html();
        var host = selectRow.find('td:nth-child(4)').html();
        var port = selectRow.find('td:nth-child(5)').html();
        var wado = selectRow.find('td:nth-child(6)').html();

        $.ajax({
            url: 'ServerConfig.do',
            data: {
                'logicalName':logical,
                'aeTitle':ae,
                'hostName':host,
                'port':port,
                'wadoPort':wado,
                'todo':'DELETE'
            },
            type: 'POST',
            success: function(msg1) {
                oTable.fnClearTable();
                loadTable();

                msg = "Server deleted";
                $.ambiance({
                    message: msg,
                    type: 'success'
                });
            }
        });
    } else {
        msg = "Please select server to delete";
        $.ambiance({
            message: msg,
            type: 'error'
        });
        return;
    }
}

function editSelectedRow() {
    var $selRow = $('#serverTable :checked').parent().parent();
    if($('#serverTable :checked').length == 1) {

        var currDesc = $selRow.find('td:nth-child(2)').html();
        var currAET = $selRow.find('td:nth-child(3)').html();
        var currHost = $selRow.find('td:nth-child(4)').html();
        var currPort = $selRow.find('td:nth-child(5)').html();

        var currRet = $selRow.find('td:nth-child(6)').html();
        var currWadoCxt = $selRow.find('td:nth-child(7)').html();
        var currWadoPort = $selRow.find('td:nth-child(8)').html();

        var str = '<td><input type="checkbox" disabled="true" CHECKED /></td><td><input type="text" id="desc" disabled="true" value="' + currDesc + '"></td>' +
        '<td><input type="text" id="aet" value="' + currAET + '"></td>' +
        '<td><input type="text" id="host" value="' + currHost +'"></td><td><input type="text" id="port" value="' + currPort +'"></td>';

        if(currRet == 'C-MOVE') {
            str += '<td><select id="retrieve" value="' + currRet + '" style="width:100%" onchange="hideWadoFields()"><option value="WADO" selected>WADO</option><option value="C-MOVE" selected>C-MOVE</option><option value="C-GET">C-GET</option></select></td>';
        } else if(currRet == 'C-GET') {
            str += '<td><select id="retrieve" value="' + currRet + '" style="width:100%" onchange="hideWadoFields()"><option value="WADO">WADO</option><option value="C-MOVE">C-MOVE</option><option value="C-GET" selected>C-GET</option></select></td>';
        } else {
            str += '<td><select id="retrieve" value="' + currRet + '" style="width:100%" onchange="hideWadoFields()"><option value="WADO" selected>WADO</option><option value="C-MOVE">C-MOVE</option><option value="C-GET">C-GET</option></select></td>';
        }
        str += '<td><input type="text" id="wadoCxt" value="' + currWadoCxt + '" style="width:100%" title="WADO Context"></td><td><input type="text" id="wadoPort" value="' + currWadoPort + '" style="width:87%" title="WADO Port">';
        str += '<a href="#" onClick="editTable(); $(this).parent().parent().remove();"><img src="images/save.png"></a></td>';

        $selRow.html(str);

        editBtnPressed = true;
    } else {
        var msg = "Please select server to edit";
        $.ambiance({
            message: msg,
            type: 'error'
        });
        return;
    }
}

function dataHandler(transaction, results) {

    for(var i=0; i<results.rows.length; i++) {
        var row = results.rows.item(i);
        oTable.fnAddData([
            "<input type='checkbox'>",
            row['logicalname'],
            row['aetitle'],
            row['hostname'],
            row['port']
            ]);
    }
}


/* function selectServer(row) {
            var $checkbox = row.find(':checkbox');
            //deselect the already selected checkbox
            $("#serverTable :checkbox").not($checkbox).removeAttr("checked");
            // select current checkbox
            $checkbox.attr('checked', !$checkbox.attr('checked'));

            if($("#serverTable input[type=checkbox]:checked").length == 1) {
                var aet = row.find('td:nth-child(3)').html();
                var host = row.find('td:nth-child(4)').html();
                var port = row.find('td:nth-child(5)').html();

                $url = "dicom://" + aet + "@" + host + ":" + port;
            } else {
                $url = "";
            }
            //alert(e.find('td:nth-child(3)').html());
            //alert(  $("#serverTable input[type=checkbox]:checked").length );
	}*/

$("#serverTable tbody tr").live('click', function(e) {
    var aet = $(this).find('td:nth-child(3)').html();
    var host = $(this).find('td:nth-child(4)').html();
    var port = $(this).find('td:nth-child(5)').html();

    if(callingAET == '') {
        $url = "dicom://" + aet + "@" + host + ":" + port;
    } else {
        $url = "dicom://" + aet + ":" + callingAET + "@" + host + ":" + port;
    }

    //get checkbox current checkbox
    var $checkbox = $(this).find(':checkbox');
    //deselect the already selected checkbox
    $("#serverTable :checkbox").not($checkbox).removeAttr("checked");
    if(e.target.type == 'checkbox') {
        //e.stopPropagation();
        $(this).filter(':has(:checkbox)').toggleClass('selected', $checkbox.attr('checked'));
    } else {
        $checkbox.attr('checked', !$checkbox.attr('checked'));
    //$(this).filter(':has(:checkbox)').toggleClass('selected', $checkbox.attr('checked'));
    }
});

function hideWadoFields() {
    if($("#retrieve").val() != 'WADO') {
        $("#wadoCxt").attr('disabled', 'disabled');
        $('#wadoPort').attr('disabled', 'disabled');
        $("#wadoCxt").val("");
        $('#wadoPort').val("");
    } else {
        $("#wadoCxt").removeAttr('disabled');
        $('#wadoPort').removeAttr('disabled');
        $("#wadoCxt").val("wado");
        $('#wadoPort').val("8080");
    }
}