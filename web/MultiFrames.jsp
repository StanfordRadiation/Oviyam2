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
* Bharathi B
* Manikandan P
* Meer Asgar Hussain B
* Prakash J
* Prakasam V
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
<%@ page isELIgnored="false" %>
<%@page errorPage="ErrorPage.jsp" %>
<%@ taglib prefix="img" uri="ImageInfo" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
<title>Oviyam - Multiframe</title>
<script type="text/javascript" src="js/MultiFrames.js"></script>
<link type="text/css" rel="StyleSheet" href="./css/oviyam7.css">
</head>
<body bgcolor="#000000">	
		<div id="left">			
			<div class="shadow" id="patStudyDesc">${param.studyDescription }</div>
			<div class="shadow" id="patSex">${param.sex }</div>
			<div class="shadow" onclick=" even=document.getElementById('picture').event; initwl();" id="patPhyName">${param.physicianName}</div>
			<div class="shadow" id="patBirthDate">${param.birthDate }</div>
			<div class="shadow" id="patStudyDate">${param.studyDates}</div>
			<div class="shadow" id="patModality">${param.modality}</div>
	
			<table id="imgTable">
				<tr>
					<td class="imageHolder"><div class="imageHolder"><center>
						
						<img alt="" class="dragme" name="picture" src="Image.do?study=${param.study}&series=${param.series }&object=${param.object }&frameNumber=0" width="512" id="picture"
						
						 ></center></div>
					<td>
				</tr>
				<tr>
					<td>
						<div class="shadow" id="frameNumber"></div>
					</td>
					
				</tr>
			</table>				
			<div class="shadow" id="number">Frame 1 of ${param.numberOfFrames }	</div>							
		</div>
		
		<div id="thumbNails">
			<div id="thumbDivider" onclick="singleImage();" title="Click or press 'i' to toggle thumbnails visibility">
				<img id="dividerImg" src="images/icn_grip1.gif" alt="">
			</div>

			<div id="thumbNailHolder1" style="display: none">	
			  <c:if test="${param.numberOfFrames >0}">	
				<c:set var="incr" value="1"/>
				<c:forEach var="inc" begin="0" end="${param.numberOfFrames-1}" step="${incr}">			
					<div class="scale-item">
						<div class="imgNo">${inc+1}</div>	
		 				<img alt="" id="img${inc}" class="scale-image" src="Image.do?study=${param.study}&series=${param.series }&object=${param.object }&frameNumber=${inc}" width="100%">
		 			</div>
		 		</c:forEach>
		 	  </c:if>
			</div>

	<div id="thumbNailHolder">
	
	<%-- Image tag that gives the instance informations   --%>
	<img:Image patientId="${param.patient}" study="${param.study}" seriesId="${param.series}" >
		<div class="scale-item">
			<div class="imgNo">${instanceNumber}</div>
			<input type="hidden" id="imgs${img}" name='http://${applicationScope.serverConfig.hostName }:${applicationScope.serverConfig.wadoPort }/wado?requestType=WADO&contentType=application/dicom%2Bxml&studyUID=${param.study}&seriesUID=${param.series }&objectUID=${imageId }' style="position:fixed;top:0px;">

<%--  			<c:choose>				 
			<c:when test="${param.modality =='XA' }">     --%>
			
					<img alt="" id="instance${img}" src="Image.do?study=${param.study}&series=${param.series }&object=${imageId }" class="scale-image" width="100%" onclick="fti=0; multiFrames=true; changeSpeed1(ajaxpage('','MFrames?datasetURL=http://${applicationScope.serverConfig.hostName}:${applicationScope.serverConfig.wadoPort}/wado?requestType=WADO&contentType=application/dicom&studyUID=${param.study}&seriesUID=${seriesId}&objectUID=${imageId}')); setImageInfos('${numberOfFrames}'); setImage=false; cineloop=0; ajaxpage('imagePane','MultiFrames.jsp?study=${param.study}&series=${param.series }&object=${imageId }&studyDescription=${param.studyDescription }&numberOfFrames=${numberOfFrames }&sex=${param.sex }&physicianName=${param.physicianName }&birthDate=${param.birthDate }&studyDates=${param.studyDates }&modality=${param.modality }'); if('${frames}' == 'yes'){ cineLoop(); } changeInstanceBorder(this.id); selectedInstanceIndex = ${img}; hideDataSet();">		

				<%-- </c:when>
			</c:choose>  --%>

		</div>				
	</img:Image><%--End of Image tag. --%>
	</div><%--End of thumbNailHolder Div --%>
	</div>

       	<script type="text/javascript" language="javascript">
		numberOfFrames = ${param.numberOfFrames};
		load();
 	</script>
</body>
</html>

