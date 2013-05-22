<!--
/* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 1.1/GPL 2.0/LGPL 2.1
*
* The contents of this file are subject to the Mozilla Public License Version
* 1.1 (the "License"); you may not use this file except in compliance with
* the License. You may obtain a copy of the License at
* http://www.mozilla.org/MPL/
*
* Software distributed under the License is distributed on an "AS IS" basis,
* WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
* for the specific language governing rights and limitations under the
* License.
*
* The Original Code is part of Oviyam, an web viewer for DICOM(TM) images
* hosted at http://skshospital.net/pacs/webviewer/oviyam_0.6-src.zip
*
* The Initial Developer of the Original Code is
* Raster Images
* Portions created by the Initial Developer are Copyright (C) 2007
* the Initial Developer. All Rights Reserved.
*
* Contributor(s):
* Babu Hussain A
* Meer Asgar Hussain B
* Prakash J
* Suresh V
*
* Alternatively, the contents of this file may be used under the terms of
* either the GNU General Public License Version 2 or later (the "GPL"), or
* the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
* in which case the provisions of the GPL or the LGPL are applicable instead
* of those above. If you wish to allow use of your version of this file only
* under the terms of either the GPL or the LGPL, and not to allow others to
* use your version of this file under the terms of the MPL, indicate your
* decision by deleting the provisions above and replace them with the notice
* and other provisions required by the GPL or the LGPL. If you do not delete
* the provisions above, a recipient may use your version of this file under
* the terms of any one of the MPL, the GPL or the LGPL.
*
* ***** END LICENSE BLOCK ***** */
-->

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page isELIgnored="false"%>
<%@taglib prefix="pat" uri="PatientInfo"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%
    String patName = request.getParameter("patientName");
    String tabName = request.getParameter("tabName") + "_table";
    String tabIndex = request.getParameter("tabIndex");

    if(patName != null) {
        patName = new String(patName.getBytes("ISO-8859-1"), "UTF-8");
    }
%>

<fmt:setBundle basename="resources.i18n.Messages" var="lang"/>

<html>
    <head>

        <script type="text/javascript" src="js/lib/jquery.dataTables.min.js"></script>

        <script type="text/javascript">
            var dTable;
            $(document).ready(function() {
                var tableName = '#' + <%=tabName%>.id;
                dTable = $(tableName).dataTable({
                    "bJQueryUI": true,
                    //"sPaginationType": "full_numbers",
                    "bPaginate": false,
                    //"bFilter": false,
                    "oLanguage": {
                        "sSearch": "Filter:"
                    },
                    "sScrollY": "87%",
                    "bScrollCollapse": true,
                    "bAutoWidth": true,
                    "sScrollX": "100%",
                    //"sScrollXInner": "100%",
                    "aaSorting": [[ 5, "desc" ]],
                    "aoColumnDefs": [ {
                            "aTargets": [0],
                            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                if ( sData.indexOf('img') >= 0) {
                                    $(nTd).css('padding', '0px');
                                    $(nTd).css('text-align', 'center');
                                }
                            }
                        }],
                    "aoColumns": [ null, null, null, null, null, null, null, null, null, {"bVisible": false}, {"bVisible": false}, {"bVisible": false}, {"bVisible": false}]
                });

                $.fn.dataTableInstances[<%=tabIndex%>] = dTable;

                /* var searchPanel = '#' + <%=request.getParameter("tabName")%>.id + '_search';
                $(searchPanel).load('newSearch.html'); */

            });
            
            function toggleDivider(divider) {
                var westPane = $('#<%=request.getParameter("tabName")%>_westPane');
            	
                if($(westPane).is(":visible")) {
                    $(westPane).hide();
                    $(divider).next().css('width', '98%');
                    $(divider).attr('title', 'Open');
                } else {
                    $(westPane).show();
                    $(divider).next().css('width', '82%');
                    $(divider).attr('title', 'Close');
                }
                dTable.fnAdjustColumnSizing();
            }
        </script>
    </head>
    <body>

<!--  <div id="<%=request.getParameter("tabName")%>_search" style="height:13%; width:99%;"></div>  -->

        <div id="<%=request.getParameter("tabName")%>_westPane" style="width: 16%; height: 99%; visibility: visible; display: block; z-index: 0; overflow:auto; float: left; border: 1px solid #555;"></div>

        <div title="Close" class="ui-state-default" onmouseover="this.className='ui-state-hover'" onmouseout="this.className='ui-state-default'" style="float:left; width: 4px; height: 99%; margin-left: 3px; cursor: pointer;" onclick="toggleDivider(this)"></div>

        <div style="float:left; width:82%; margin-left: 3px;height: 96%;">

            <table class="display" id="<%=tabName%>" style="font-size:12px;">

                <thead>
                    <tr>
                        <th></th>
                        <th><fmt:message key='patientID' bundle="${lang}"/></th>
                <th><fmt:message key='patientName' bundle="${lang}"/></th>
                <th><fmt:message key='dateOfBirth' bundle="${lang}"/></th>
                <th><fmt:message key='accessionNumber' bundle="${lang}"/></th>
                <th><fmt:message key='studyDate' bundle="${lang}"/></th>
                <th><fmt:message key='studyDescription' bundle="${lang}"/></th>
                <th>Modality</th>
                <th><fmt:message key="instanceCount" bundle="${lang}"/></th>
                <th>Study Instance UID</th>
                <th>Refer Physician</th>
                <th>Series Count</th>
                <th>Gender</th>
                </tr>
                </thead>
                <tbody>
                <pat:Patient patientId="${param.patientId}" patientName="<%=patName%>" birthDate="${param.birthDate}" modality="${param.modality}"
                             from="${param.from}" to="${param.to}" searchDays="${param.searchDays}" accessionNumber="${param.accessionNumber}"
                             referPhysician="${param.referPhysician}" studyDescription="${param.studyDesc}"
                             dcmURL="${param.dcmURL}" fromTime="${param.fromTime}" toTime="${param.toTime}">
                    <tr>
                        <td>
                            <img src="images/details_open.png" alt="" />
                            <img src="images/green.png" style="visibility: hidden" id="${studyIUID}" alt="" />
                        </td>
                        <td>${patientId}</td>
                        <td>${patientName}</td>
                        <td>${birthDate}</td>
                        <td>${accessionNumber}</td>
                        <td>${studyDate}</td>
                        <td>${studyDescription}</td>
                        <td>${modality}</td>
                        <td>${totalInstances}</td>
                        <td>${studyIUID}</td>
                        <td>${referPhysician}</td>
                        <td>${totalSeries}</td>
                        <td>${patientGender}</td>
                    </tr>
                </pat:Patient>
                </tbody>
            </table>
        </div>
    </body>
</html>
