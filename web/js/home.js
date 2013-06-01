var myLayout;
$.fn.dataTableInstances = [];
var timer;
     
$(document).ready(function() {

    loadTabs();

    $("#buttonContainer").buttonset();

    if(/chrome/.test(navigator.userAgent.toLowerCase())) {
        $('.ui-helper-hidden-accessible').css('display', 'none');
    }

    $('#westPane').addClass('ui-widget-content');
    $('#buttonContainer').addClass('ui-widget-content');
    $('#user').addClass('ui-widget-content');

    $.get("UserConfig.do", {
        'settings':'userName',
        'todo':'READ'
    }, function(data){
        $('#user').html(data);
    });

    $(".header-footer").hover(
        function(){
            $(this).addClass('ui-state-hover');
        }
        , function(){
            $(this).removeClass('ui-state-hover');
        }
        );

    myLayout = $('#optional-container').layout({
    		closable: false,
    		resizable: false
    });

   /* myLayout = $('#optional-container').layout({
        west: {
            size: 205
        }
    }); */

    //start listener
    $.ajax({
        type: "GET",
        url: "Listener.do",
        data: {
            'action':'Verify'
        }
    });
   
    // get the buttons from configuration
    $.ajax({
        type: "GET",
        url: "UserConfig.do",
        data: {
            'settings':'buttons',
            'todo':'READ'
        },
        dataType: "json",
        success: parseJson
    });

    showAllLocalStudies();

    function parseJson(json) {

        $('#buttonContainer').html('');
        //createButton("Search", null, null, null);
       // createButton({"label":"Search"});

        $(json).each(function() {
            //createButton(displayText, date_criteria, time_criteria, modality);
            createButton(this);
        });

        $.get("UserConfig.do", {
            'settings':'theme',
            'todo':'READ'
        }, function(data){
            $('#switcher').themeswitcher({
                loadTheme: data.trim(),
                cookieName:'',
                width: 160
            });
            if(data.trim() == 'Dark Hive') {
                $('.ui-widget-content').css('background', 'black');
            }
        });

    //addThemeSwitcher('.ui-layout-north',{ top: '13px', right: '20px' });
    }

//    function createButton(txt, crit, tCrit, modality) {
    function createButton(that) {
        var txt = that['label'];
        var crit = that['dateCrit'];
        var tCrit = that['timeCrit'];
        var modality = that['modality'];
        var autoRef = that['autoRefresh'];

        var id = '';
        if(txt == 'Search') {
            id = 'btn-search';
        } else {
            id = 'btn-' + new Date().valueOf().toString();
        }

        $('#buttonContainer').append('<input type="radio" id="' + id + '" name="radio" /><label for="' + id + '">' + txt + '</label>');
        jQuery('#' + id).click(function() {
            var dUrl = $('.ui-tabs-selected').find('a').attr('name');

            $('.ui-tabs-selected').find('a').attr('searchBtn', id);

            //if($('.ui-tabs-selected').length == 0) {
            if(dUrl == null) {
                var msg = "Please select remote server!!!";
                noty({
                    text: msg,
                    layout: 'topRight',
                    type: 'error'
                });

                return;
            }

            if(id == "btn-search") {
                $.get('search.html', function(data) {
                    modal.open({
                        content: data
                    });
                });
            } else {
                $.get("Echo.do?dicomURL=" + dUrl, function(data) {
                    if(data == "EchoSuccess") {
                        var searchURL = "queryResult.jsp?";
                        if(modality != null && modality != '') {
                            searchURL += "modality=" + modality;
                        }

                        var days = 0;

                        if(crit != null && crit != '') {
                            if(crit.indexOf("-") >= 0) {
                                days = crit.substring(crit.indexOf("t-")+2);
                                var fromDate = Date.today().addDays(-days).toString("yyyyMMdd");
                                var toDate = Date.today().toString("yyyyMMdd");
                                searchURL += "&searchDays=between&from=" + fromDate + "&to=" + toDate ;
                            } else {
                                var tDate = Date.today().toString("yyyyMMdd");
                                searchURL += "&searchDays=between&from=" + tDate + "&to=" + tDate ;
                            }
                        }

                        if(tCrit != null) {
                            if(tCrit == '-30m') {
                                var fTime = new Date().addMinutes(-30).toString("HHmmss");
                                var tTime = new Date().toString("HHmmss");
                                searchURL += '&fromTime=' + fTime + '&toTime=' + tTime;
                            } else if(tCrit.indexOf('-') == 0) {
                                var fTime = new Date().addHours(parseInt(tCrit)).toString("HHmmss");
                                var tTime = new Date().toString("HHmmss");
                                searchURL += '&fromTime=' + fTime + '&toTime=' + tTime;
                            } else if(tCrit.indexOf('-') > 0) {
                                var tArr = tCrit.split('-');
                                searchURL += '&fromTime=' + tArr[0] + '&toTime=' + tArr[1];
                            }
                        }

                        searchURL += "&dcmURL=" + dUrl;

                        var divContent = $('.ui-tabs-selected').find('a').attr('href');
                        searchURL += '&tabName=' + divContent.replace('#','');

                        var tabIndex = $('#tabs_div').data('tabs').options.selected;
                        searchURL += '&tabIndex=' + tabIndex;
                                            
                        divContent += '_content';

                        $('#westPane').html('');
                        $(divContent).html('');

                        $(divContent).load(encodeURI(searchURL), function() {
                            clearInterval(timer);
                            checkLocalStudies();

                            if(parseInt(autoRef) > 0) {
                                timer = setInterval(function() {
                                    startTimer(searchURL)
                                }, parseInt(autoRef));
                            }
                        });

                        $('.ui-tabs-selected').find('a').attr('searchurl', searchURL);
                    } else {
                        var msg = "Server not available";
                        noty({
                            text: msg,
                            layout: 'topRight',
                            type: 'error'
                        });

                        return;
                    }
                });
            }

        });

        $("#buttonContainer").buttonset();
        $('#buttonContainer').hide();

        if(/chrome/.test(navigator.userAgent.toLowerCase())) {
            $('.ui-helper-hidden-accessible').css('display', 'none');
        }

    }

    function startTimer(searchURL) {
        //  if( searchURL.indexOf(Date.today().toString("yyyyMMdd")) >= 0) {
        //console.log(searchURL);
        $.getJSON('RefreshStudies.do', {
            'query' : searchURL
        }, function(data) {
            var tabIndex = $('#tabs_div').data('tabs').options.selected;
            var oTable = $.fn.dataTableInstances[tabIndex];

            var selectedTabTxt = $('.ui-tabs-selected').find('span').html();
            var searchTab = searchURL.substring(searchURL.indexOf('tabName=')+8);
            if(searchTab.trim() == selectedTabTxt.trim()) {
                for(var itr=0; itr<data.length; itr++) {
                    var newRow = data[itr];
                    oTable.fnAddData([
                        '<img src="images/details_open.png" alt="" /> <img src="images/red.png" id="' + newRow.studyInstanceUID +'" alt="" />',
                        newRow.patientID,
                        newRow.patientName,
                        newRow.patientBirthDate,
                        newRow.accessionNumber,
                        newRow.studyDate,
                        newRow.studyDescription,
                        newRow.modalitiesInStudy,
                        newRow.studyRelatedInstances,
                        newRow.studyInstanceUID,
                        newRow.physicianName,
                        newRow.studyRelatedSeries,
                        newRow.patientGender
                    ]);
                }
            }
        });
    // } // if
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

    function loadTabs() {
        $.getJSON('DicomNodes.do', function(results) {
            var callingAET = results[results.length-1].callingAET.trim();
            for(var i=0; i<results.length-1; i++) {
                var node = results[i];
                //var li = '<li class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active"><a href="#tab_3"><span>Local</span></a></li>';

                var dcmUrl = '';
                if(callingAET == '') {
                    dcmUrl = "DICOM://" + node.aetitle + "@" + node.hostname + ":" + node.port;
                } else {
                    dcmUrl = "DICOM://" + node.aetitle + ":" + callingAET + "@" + node.hostname + ":" + node.port;
                }

                var wadoUrl = null;
                if(node.retrieve == 'WADO') {
                    if(node.wadoport == '') {
                        wadoUrl = "http://" + node.hostname + "/" + node.wadocontext;
                    } else {
                        wadoUrl = "http://" + node.hostname + ":" + node.wadoport + "/" + node.wadocontext;
                    }
                } else {
                    wadoUrl = node.retrieve;
                }

                var li = '<li class="ui-state-default ui-corner-top"><a href="#' + node.aetitle + '" name="' + dcmUrl + '" wadoUrl="' + wadoUrl + '"><span>' + node.logicalname + '</span></a></li>';
                $('#tabUL').append(li);

                var div = '<div id="' + node.aetitle + '" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" style="padding: 0; width: 100%">';
                div += '<nav class="ui-state-default" onmouseover="this.className=\'ui-state-hover\'" onmouseout="this.className=\'ui-state-default\'" style="cursor: pointer">Search</nav>';
                div += '<div id="' + node.aetitle + '_search" style="height:13%; width:100%;"></div>';
                div += '<div id="' + node.aetitle + '_content" style="height:85%; width:99%;"></div></div>';
                $('#tabContent').append(div);
                $('#' + node.aetitle + '_search').load('newSearch.html');
            }

            $("#tabs_div").tabs({
                select: function(event, ui) {
                    clearInterval(timer);
                    var selTabText = ui.tab.text;
                    var oTable = $.fn.dataTableInstances[ui.index];

                    /* var search_url = $(ui.tab).attr("searchurl");
                    if(typeof search_url != 'undefined') {
                        timer = setInterval(function() {startTimer(search_url)}, 10000);
                    } */

                    var searchBtn = $(ui.tab).attr('searchBtn');
                    if(typeof searchBtn != 'undefined') {
                        $('#'+searchBtn).attr('checked', 'checked');
                        $("#buttonContainer").buttonset( "refresh" );
                    } else {
                        $("#buttonContainer").find("input:radio:checked").prop('checked',false);
                        $("#buttonContainer").buttonset( "refresh" );
                    }

                    if(selTabText == 'Local') {
                        $('#buttonContainer').hide();
                        oTable.fnClearTable();
                        //oTable.fnDestroy();
                        showAllLocalStudies(oTable);
                    } else {
                        $('#buttonContainer').show();

                    /*if(typeof oTable != 'undefined') {
                            oTable.fnClearTable();
                        }*/
                    }

                    $('.modalitiesList').multiselect({
                	selectedList: 12,
                	minWidth: 130,
                	header: false,
                        noneSelectedText: "ALL"
                    });

                } // for select event
            });

            $("#tabs_div LI").contextMenu({
                menu: 'tabMenu'
            } , function(action, el, pos) {
                var url = 'Echo.do?dicomURL=' + el.find('a').attr('name');
                $.get(url, function(data) {
                    if(data == "EchoSuccess") {
                        var msg = 'Echo ' + el.find('a').attr('name') + ' successfully!';
                        noty({
                            text: msg,
                            layout: 'topRight',
                            type: 'success'
                        });
                    } else {
                        var msg = 'Echo ' + el.find('a').attr('name') + ' not successfully!';
                        noty({
                            text: msg,
                            layout: 'topRight',
                            type: 'error'
                        });
                    }
                });
            });
        });
    }

    $.fn.dataTableInstances.push( $('#resultTable').dataTable({
        "bJQueryUI": true,
        "oLanguage": {
            "sSearch": "Filter:"
        }
    }) );

    // $('#resultTable tbody tr').live("click", function() {
    $('.display tbody tr').live("click", function() {

        var tabIndex = $('#tabs_div').data('tabs').options.selected;
        var oTable = $.fn.dataTableInstances[tabIndex];

        if($(this).hasClass('row_selected')) {
            //$(this).removeClass('row_selected');
            return;
        } else {
            oTable.$('tr.row_selected').removeClass('row_selected');
            $(this).addClass('row_selected');
        }

        var selTabText = $('.ui-tabs-selected').find('span').html();
        var iPos = oTable.fnGetData(this);

        if(selTabText != 'Local') {
            if(document.getElementById(iPos[9]).style.visibility == 'hidden') {
                showWestPane(iPos);
            } else {
                if(!!(window.requestFileSystem || window.webkitRequestFileSystem)) {
                    viewWPSeries(this);
                } else {
                    showWestPane(iPos);
                }
            }
        } else {
            if(!!(window.requestFileSystem || window.webkitRequestFileSystem)) {
                viewWPSeries(this);
            } else {
                var tmpUrl = "westContainer1.jsp?patient=" + iPos[1] + "&study=" + iPos[9] + "&patientName=" + iPos[2];
                tmpUrl += "&studyDesc=" + iPos[6] + "&studyDate=" + iPos[5].split(" ")[0] + "&totalSeries=" + iPos[11];

                var lSql = "select DicomURL, ServerURL from study where StudyInstanceUID='" + iPos[9] + "'";
                var myDb = initDB();
                myDb.transaction(function(tx) {
                    tx.executeSql(lSql, [], function(trans, results) {
                        var row = results.rows.item(0);
                        tmpUrl += "&dcmURL=" + row['DicomURL'] + "&wadoUrl=" + row['ServerURL'];
                        $('#' + selTabText + '_westPane').load(encodeURI(tmpUrl));
                    }, errorHandler);
                });

            }
        }
    });

    //$("#resultTable tbody tr").live("dblclick", function() {
    $('.display tbody tr').live("dblclick", function() {

        var tabIndex = $('#tabs_div').data('tabs').options.selected;
        var oTable = $.fn.dataTableInstances[tabIndex];

        var nTrContent = oTable.fnGetData(this);
        var ser_url = $('.ui-tabs-selected').find('a').attr('wadoUrl');
        if(typeof ser_url == 'undefined') {
            var lSql = "select DicomURL, ServerURL from study where StudyInstanceUID='" + nTrContent[9] + "'";
            var myDb = initDB();
            myDb.transaction(function(tx) {
                tx.executeSql(lSql, [], function(trans, results) {
                    var row = results.rows.item(0);
                    var jsonObj = {
                        "pat_ID" : nTrContent[1],
                        "pat_Name" : nTrContent[2],
                        "pat_Birthdate" : nTrContent[3],
                        "accNumber" : nTrContent[4],
                        "studyDate" : nTrContent[5],
                        "studyDesc" : nTrContent[6],
                        "modality" : nTrContent[7],
                        "totalIns" : nTrContent[8],
                        "studyUID" : nTrContent[9],
                        "refPhysician" : nTrContent[10],
                        "totalSeries" : nTrContent[11],
                        "pat_gender" : nTrContent[12],
                        "serverURL" : row['ServerURL'],
                        "dicomURL" : row['DicomURL'],
                        "bgColor" : $('.ui-widget-content').css('background-color')
                    };

                    $.cookies.set( 'patient', jsonObj );

                    window.open("viewer.html", "_blank");
                }, errorHandler);
            });
        } else {

            var jsonObj = {
                "pat_ID" : nTrContent[1],
                "pat_Name" : nTrContent[2],
                "pat_Birthdate" : nTrContent[3],
                "accNumber" : nTrContent[4],
                "studyDate" : nTrContent[5],
                "studyDesc" : nTrContent[6],
                "modality" : nTrContent[7],
                "totalIns" : nTrContent[8],
                "studyUID" : nTrContent[9],
                "refPhysician" : nTrContent[10],
                "totalSeries" : nTrContent[11],
                "pat_gender" : nTrContent[12],
                "serverURL" : $('.ui-tabs-selected').find('a').attr('wadoUrl'),
                "dicomURL" : $('.ui-tabs-selected').find('a').attr('name'),
                "bgColor" : $('.ui-widget-content').css('background-color')
            };

            $.cookies.set( 'patient', jsonObj );

            window.open("viewer.html", "_blank");
        }
    });

    //$('#resultTable tbody td img').live('click', function() {
    $('.display tbody td img').live('click', function() {

        var tabIndex = $('#tabs_div').data('tabs').options.selected;
        var oTable = $.fn.dataTableInstances[tabIndex];

        var nTr = this.parentNode.parentNode;
        var nTrContent = oTable.fnGetData(nTr);

        if(this.src.match('details_close')) {
            this.src = "images/details_open.png";
            oTable.fnClose(nTr);
        } else if(this.src.match('details_open')) {
            /* Open this row */
            this.src = "images/details_close.png";
            var selectedTabTxt = $('.ui-tabs-selected').find('span').html();
            if(selectedTabTxt != 'Local') {
                var urlDcm = $('.ui-tabs-selected').find('a').attr('name');
                var tmpUrl = "seriesDetails.jsp?patient=" + nTrContent[1] + "&study=" + nTrContent[9] + "&dcmURL=" + urlDcm;
                $.get(tmpUrl, function(series) {
                    oTable.fnOpen(nTr, series, 'details');
                });
            } else {
                var sql = "select SeriesNo, SeriesDescription, Modality, BodyPartExamined, NoOfSeriesRelatedInstances from series where StudyInstanceUID='" + nTrContent[9] + "';";
                var content = '<head><style>.dataTables_wrapper .fg-toolbar{display: none;}</style>';
                content += '<script type="text/javascript">$(document).ready(function() {var now = new Date().getTime();';
                content += '$("#seriesTable").attr("id", now); sTable = $("#" + now).dataTable({"bJQueryUI": true,"bPaginate": false,"bFilter": false});';
                content += '}); </script></head></body>';
                content += '<body><table class="display" id="seriesTable" style="font-size:12px;"><thead>';
                content += '<tr><th>Series Number</th><th>Series Desc</th><th>Modality</th><th>Body Part Examined</th><th>Total Instances</th></tr>';
                content += '</thead><tbody>';

                var myDb = initDB();
                myDb.transaction(function(tx) {
                    tx.executeSql(sql, [], function(trans, results) {
                        for(var i=0; i<results.rows.length; i++) {
                            var row = results.rows.item(i);
                            content += '<tr><td>' + row['SeriesNo'] + '</td><td>' + row['SeriesDescription'] + '</td>';
                            content += '<td>' + row['Modality'] + '</td><td>' + row['BodyPartExamined'] + '</td>';
                            content += '<td>' + row['NoOfSeriesRelatedInstances'] + '</td></tr>';
                        }
                        content += '</tbody></table></body>';
                        oTable.fnOpen(nTr, content, 'details');
                    }, errorHandler);
                });
            }
        }

    });

    $('#liConfig').click(function() {
        $('ul.the_menu').slideToggle('medium');
        window.open('config.html', '_blank');
    });

    $('#deleteDb').click(function() {
    	if(confirm('All the studies stored in the local storage will be deleted. Are you sure?')) {
            resetLocalDB();
            var selTabText = $('.ui-tabs-selected').find('span').html();
            if(selTabText == 'Local') {
                $('#westPane').html('');
            }
    	}
    });

    $('img.menu_class').click(function () {
        $('ul.the_menu').slideToggle('medium');

    /*if($('ul.the_menu').find('.jquery-ui-themeswitcher-trigger').length == 0) {
                    $('ul.the_menu').find('#theme').themeswitcher({
                        cookieName: '',
                        onSelect: function() {
                        	$('#westPane').addClass('ui-widget-content');
                        	$('#buttonContainer').addClass('ui-widget-content');
                        	$('#user').addClass('ui-widget-content');
                        },
                        onClose: function() {
                            var selTheme = $(".jquery-ui-themeswitcher-title").html();
                            selTheme = selTheme.split(': ')[1];
                            //$.get("Theme.do", {'theme':selTheme});

                            if(typeof selTheme != 'undefined') {
                                $.get("UserConfig.do", {'settings':'theme', 'settingsValue':selTheme, 'todo':'UPDATE'});
                            }
                        }
                    });
		} */
    });

    $('#logout').click(function() {
        $.post('logout.jsp', null, function(data) {
            $(document).empty();
            window.location.replace('.');
        });
    });

    $(document).click(function(e) {
        var myTarget = 'menu_class';
        var clicked = e.target.className;
        if(myTarget != clicked) {
            if(!$('ul.the_menu').is(':hidden')) {
                $('ul.the_menu').slideToggle('medium');
            }
        }
    });
    
    $('nav').live('click', function() { 
		var selTabText = $('.ui-tabs-selected').find('a').attr('href');
    	var tmpStr = selTabText + '_search';
		if($(tmpStr).is(":visible")) {
			$(tmpStr).slideUp();
			tmpStr = selTabText + '_content';
    		$(tmpStr).css('height', '100%');			
		} else {
			$(tmpStr).slideDown();
			tmpStr = selTabText + '_content';
    		$(tmpStr).css('height', '85%');			
		}
    });

    $('.ui-layout-resizer').css('visibility', 'hidden');

}); // for document ready

function showWestPane(iPos) {
    var urlDcm = $('.ui-tabs-selected').find('a').attr('name');
    var urlWado = $('.ui-tabs-selected').find('a').attr('wadoUrl');

    var tmpUrl = "westContainer1.jsp?patient=" + iPos[1] + "&study=" + iPos[9] + "&patientName=" + iPos[2];
    tmpUrl += "&studyDesc=" + iPos[6] + "&studyDate=" + iPos[5].split(" ")[0] + "&totalSeries=" + iPos[11] + "&dcmURL=" + urlDcm;
    tmpUrl += "&wadoUrl=" + urlWado;
    
    var selTabText = $('.ui-tabs-selected').find('a').attr('href');
    var container = selTabText + '_westPane';
    $(container).load(encodeURI(tmpUrl));
}
