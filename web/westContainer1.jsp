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

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@page errorPage="ErrorPage.jsp" %>
<%@taglib prefix="ser" uri="SeriesDetails" %>
<%@taglib prefix="img" uri="ImageInfo" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%
    String patName = new String(request.getParameter("patientName").getBytes("ISO-8859-1"), "UTF-8");
    String studyDesc = new String(request.getParameter("studyDesc").getBytes("ISO-8859-1"), "UTF-8");
%>

<html>
    <head>

        <style type="text/css">
            .heading
            {
                font-family: Arial,Helvitica,Serif;
                font-size: 14px;
                font-weight: bold;
            }

        </style>

        <script type="text/javascript">

            $(document).ready(function() {
                var bgClr = jQuery('#westPane').css('background-color');
                bgClr = bgClr.substring(bgClr.indexOf('(')+1, bgClr.indexOf(')'));
                var bgColorArr = bgClr.split(',');
                bgClr = 'rgb(';
                for(i = 0; i<bgColorArr.length; i++) {
                    bgClr += (255 - bgColorArr[i]);
                    if(i != bgColorArr.length-1) {
                        bgClr += ' , ';
                    }
                }
                bgClr += ')';
                jQuery('#studyTable').css('color', bgClr);
                jQuery('#westPane').css('color', bgClr);

                var WPSeriesColor = $('.sorting_1').css('background-color');
                jQuery('.seriesTable').css('background-color', WPSeriesColor);
                if(WPSeriesColor == 'rgb(211, 214, 255)')
	                jQuery('.seriesTable').find('tr:first').css('background-color', WPSeriesColor);
            });

            function changeImgView(but) {
                //var table = $(but).parent().parent().parent().parent();
                //console.log(table.children().find('tr:nth-child(2)').children());

                var imgBut = $(but).attr('src');
                var imgCount = 0;

                if(imgBut.indexOf("all.png") >=0 ) {
                    $(but).attr('src', 'images/one.png');

                    $(but).parent().prev().children().each(function() {
                        if(imgCount == 0) {
                            $(this).css('background-color', '#00F');
                        } else {
                            $(this).css('background-color', '#a6a6a6');
                        }
                        imgCount++;
                    });

                    imgCount = 0;

                    $(but).parent().parent().next().children().children().each(function() {
                        if(imgCount == 0) {
                            $(this).css('display', 'inline');
                        } else {
                            $(this).css('display', 'none');
                        }
                        imgCount++;
                    });
                } else if(imgBut.indexOf("one.png") >=0 ) {
                    $(but).attr('src', 'images/three.png');
                    var serDivs = $(but).parent().prev().children();
                    var totserDivs = serDivs.length;
                    serDivs.each(function() {
                        if(imgCount == 0 || imgCount == Math.round(totserDivs/2)-1 || imgCount == totserDivs-1) {
                            $(this).css('background-color', '#00F');
                        } else {
                            $(this).css('background-color', '#a6a6a6');
                        }
                        imgCount++;
                    });

                    imgCount = 0;

                    var serImgs = $(but).parent().parent().next().children().children();
                    var serInsCnt = serImgs.length;
                    serImgs.each(function() {
                        if(imgCount == 0 || imgCount == Math.round(serInsCnt/2)-1 || imgCount == serInsCnt-1) {
                            $(this).css('display', 'inline');
                        } else {
                            $(this).css('display', 'none');
                        }
                        imgCount++;
                    });
                } else {
                    $(but).attr('src', 'images/all.png');

                    $(but).parent().prev().children().each(function() {
                        $(this).css('background-color', '#00F');
                    });

                    $(but).parent().parent().next().children().children().each(function() {
                        $(this).css('display', 'inline');
                    });
                }

                /* var tmp = $(but).attr('name');
                var tmp = tmp.split("|");
                var tagUrl = "tableContainer.jsp?patient=${param.patient}&study=${param.study}&dcmURL=${param.dcmURL}";
                tagUrl += "&wadoUrl=${param.wadoUrl}";
                tagUrl += "&series=" + tmp[0].trim() + "&numberOfImages=" + tmp[1].trim()+"&toggleImageView=0";
                table.load(encodeURI(tagUrl));*/
            }

            function changeSeries(image) {
                var imgSrc = image.src;

                if(imgSrc.indexOf('images/SR_Latest.png') > 0) {
                	imgSrc = jQuery(image).attr('imgSrc');
                }

                var url = 'frameContent.html?studyUID=' + getParameter(imgSrc, 'study');
                url += '&seriesUID=' + getParameter(imgSrc, 'series');
                url += '&instanceNumber=' + parseInt(image.name-1);
                url += '&serverURL=' + getParameter(imgSrc, 'serverURL');
                var actFrame = getActiveFrame();
                actFrame.src = url;
                doMouseWheel = true;
            }
            
            function openSeriesInViewer(clickImg) {
                var selTabText = $('.ui-tabs-selected').find('span').html();
                var patId = $('#patID').html().substring(3).trim();
                var sUrl = "viewer.html?patientID=" + patId + "&studyUID=" + getParameter(clickImg.src, "study");
                sUrl += "&serverName=" + selTabText;
                window.open(sUrl, "_blank");
            }

            function getParameter(queryString, parameterName) {
                //Add "=" to the parameter name (i.e. parameterName=value);
                var parameterName = parameterName + "=";
                if(queryString.length > 0) {
                    //Find the beginning of the string
                    var begin = queryString.indexOf(parameterName);
                    if(begin != -1) {
                        //Add the length (integer) to the beginning
                        begin += parameterName.length;
                        var end = queryString.indexOf("&", begin);
                        if(end == -1) {
                            end = queryString.length;
                        }
                        return unescape(queryString.substring(begin, end));
                    }

                    return null;
                }
            }

        </script>

    </head>
    <body>
        <div id="patName" class="heading"><%=patName%></div>
        <div id="patID" class="heading">ID: ${param.patient}</div>
        <table id="studyTable" style="font-family: Arial,Helvitica,Serif; font-size:12px; width: 100%;border: 2px outset white; " >
            <tbody>
                <tr>
                    <td colspan="2"><%=studyDesc%></td>
                </tr>
                <tr>
                    <td>${param.studyDate}</td>
                    <td align="right">${param.totalSeries} Series</td>
                </tr>
            </tbody>
        </table>
        <br />
    <ser:Series patientId="${param.patient}" study="${param.study}" dcmURL="${param.dcmURL}">
        <c:set var="middle" value="${numberOfImages/2}" />
        <fmt:formatNumber var="middle" maxFractionDigits="0" value="${middle}" />
        <table class="seriesTable" style="table-layout:fixed; width: 100%; font-family: Arial,Helvitica,Serif; font-size:11px; background:#808080; border-radius:3px;">
            <tbody>
                <tr onclick="jQuery(this).next().toggle()" style="cursor: pointer; background: #BBB; font-weight:bold;">
                    <td colspan="2">${seriesDesc} - Images: ${numberOfImages}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <table style="table-layout:fixed; width:100%;">
                           <!--  <tr>
                                <td id="${fn:replace(seriesId, '.','_')}" class="seriesImgsIndex" style="width: 100%">
                            <c:forEach var="i" begin="1" end="${numberOfImages}">
                                <c:choose>
                                    <c:when test="${(i == middle) || (i==1) || (i==numberOfImages)}">
                                        <div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
                                    </c:when>
                                    <c:otherwise>
                                        <div style="background: #a6a6a6; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
                                    </c:otherwise>
                                </c:choose>
                            </c:forEach>
                    </td>
            </tr> -->
            <tr>
                <td colspan="2">
            <img:Image patientId="${param.patient}" study="${param.study}" series="${seriesId}" dcmURL="${param.dcmURL}">
            	<c:choose>
                    <c:when test="${modality == 'SR'}">
                        <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" src="images/SR_Latest.png" imgSrc="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&rows=512" height="48px" ondblclick="openSeriesInViewer(this)" />
                    </c:when>

                    <c:when test="${sopClassUID == '1.2.840.10008.5.1.4.1.1.104.1'}">
                        <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" src="images/pdf.png" imgSrc="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&rows=512" height="48px" ondblclick="openSeriesInViewer(this)" />
                    </c:when>

                    <c:otherwise>
                        <c:choose>
                            <c:when test="${param.wadoUrl == 'C-GET'}">
                                <c:if test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==numberOfImages)}">
                                    <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" src="Wado.do?dicomURL=${param.dcmURL}&study=${param.study}&series=${seriesId}&object=${imageId}&retrieveType=${param.wadoUrl}&sopClassUID=${sopClassUID}" height="48px" ondblclick="openSeriesInViewer(this)" />
                                </c:if>
                            </c:when>
                            <c:when test="${param.wadoUrl == 'C-MOVE'}">
                                <c:if test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==numberOfImages)}">
                                    <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" src="Wado.do?dicomURL=${param.dcmURL}&study=${param.study}&series=${seriesId}&object=${imageId}&retrieveType=${param.wadoUrl}" height="48px" ondblclick="openSeriesInViewer(this)" />
                                </c:if>
                            </c:when>
                            <c:otherwise>
                                <c:if test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==numberOfImages)}">
                                    <img name="${instanceNumber}" id="${fn:replace(seriesId, '.','_')}_${instanceNumber}" src="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${seriesId}&object=${imageId}&rows=512" height="48px" ondblclick="openSeriesInViewer(this)" />
                                </c:if>
                            </c:otherwise>
                        </c:choose>
                    </c:otherwise>
                </c:choose>
            </img:Image>
            </td>
            </tr>
        </table>
    </td>
</tr>
</tbody>
</table>
<div style="height:3px"></div>
</ser:Series>

</body>
</html>