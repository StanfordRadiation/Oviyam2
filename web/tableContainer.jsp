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
<%@taglib prefix="img" uri="ImageInfo" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<c:set var="middle" value="${param.numberOfImages/2}" />
<fmt:formatNumber var="middle" maxFractionDigits="0" value="${middle}" />

<html>
  <head>
        <script type="text/javascript">
        	function toggleImgView(but) {
        		var table = $(but).parent().parent().parent().parent();
    		    var tmp = $(but).attr('name');

    		    var tmp = tmp.split("|");
        		var tagUrl = "tableContainer.jsp?patient=${param.patient}&study=${param.study}&dcmURL=${param.dcmURL}";
                        tagUrl += "&wadoUrl=${param.wadoUrl}";
        		tagUrl += "&series=" + tmp[0].trim() + "&numberOfImages=" + tmp[1].trim();

	       		var imgBut = $(but).attr('src');
	       		if(imgBut.indexOf("all.png") >=0 ) {
	       		   $(but).attr('src', 'one.png');
	       		   tagUrl += "&toggleImageView=1";
	       		} else if(imgBut.indexOf("one.png") >=0 ) {
	       		   $(but).attr('src', 'three.png');
	       		   tagUrl += "&toggleImageView=3";
	       		} else {
	       		   $(but).attr('src', 'all.png');
	       		   tagUrl += "&toggleImageView=0";
	       		}
        	    table.load(encodeURI(tagUrl));
        	}

            function changeSeries(image) {
            	var imgSrc = image.src;
                var url = 'frameContent.html?studyUID=' + getParameter(imgSrc, 'study');
		url += '&seriesUID=' + getParameter(imgSrc, 'series');
		url += '&serverURL=' + getParameter(imgSrc, 'serverURL');
    		var actFrame = getActiveFrame();
    		actFrame.src = url;
            }

        </script>
  </head>
  <body>
<table style="font-size:10px; width:100%" cellspacing="0">
  <tr>
  	<td>
	  <c:forEach var="i" begin="1" end="${param.numberOfImages}">
	    <c:choose>
	       <c:when test="${param.toggleImageView == 0}">
	       		<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
	       </c:when>

	       <c:when test="${param.toggleImageView == 3}">
			 <c:choose>
      		<c:when test="${(i == middle) || (i==1) || (i==param.numberOfImages)}">
            	<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
            </c:when>
		 	<c:otherwise>
               <div style="background: #a6a6a6; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
			</c:otherwise>
		  </c:choose>
		  </c:when>
		  <c:when test="${param.toggleImageView == 1}">
			<c:choose>
      		<c:when test="${i==1}">
            	<div style="background: #00F; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
            </c:when>
		 	<c:otherwise>
               <div style="background: #a6a6a6; width: 5px; height: 5px; float: left;margin: 0 1px 1px;"></div>
			</c:otherwise>
		  </c:choose>

		  </c:when>
		  </c:choose>
         </c:forEach>
	   </td>
	   <td align="right" style="vertical-align: top; ">
	      <c:choose>
	         <c:when test="${param.toggleImageView == 0}">
		  	   <img class="toggleImgView" src="images/all.png" name="${param.series} | ${param.numberOfImages}" onclick="toggleImgView(this)" />
		     </c:when>

		      <c:when test="${param.toggleImageView == 1}">
		        <img class="toggleImgView" src="images/one.png" name="${param.series} | ${param.numberOfImages}" onclick="toggleImgView(this)" />
		      </c:when>

		       <c:when test="${param.toggleImageView == 3}">
		          <img class="toggleImgView" src="images/three.png" name="${param.series} | ${param.numberOfImages}" onclick="toggleImgView(this)" />
		       </c:when>
		  </c:choose>
	   </td>
     </tr>
     <tr>
        <td colspan="2">
          <c:choose>
              <c:when test="${param.toggleImageView == 0}">
                <img:Image patientId="${param.patient}" study="${param.study}" series="${param.series}" dcmURL="${param.dcmURL}">
                  <img src="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${param.series}&object=${imageId}&rows=48" height="48px" width="48px" onclick="changeSeries(this)" />
               </img:Image>
              </c:when>

              <c:when test="${param.toggleImageView == 1}">
                <img:Image patientId="${param.patient}" study="${param.study}" series="${param.series}" dcmURL="${param.dcmURL}">
                <c:if test="${instanceNumber==1}">
                  <img src="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${param.series}&object=${imageId}&rows=48" height="48px" width="48px" onclick="changeSeries(this)" />
                </c:if>
               </img:Image>
              </c:when>

             <c:when test="${param.toggleImageView == 3}">
               <img:Image patientId="${param.patient}" study="${param.study}" series="${param.series}" dcmURL="${param.dcmURL}">
                <c:if test="${(instanceNumber == middle) || (instanceNumber==1) || (instanceNumber==param.numberOfImages)}">
                  <img src="Image.do?serverURL=${param.wadoUrl}&study=${param.study}&series=${param.series}&object=${imageId}&rows=48" height="48px" width="48px" onclick="changeSeries(this)" />
                </c:if>
               </img:Image>
              </c:when>

         </c:choose>
      </td>
   </tr>
</table>
</body>
</html>
