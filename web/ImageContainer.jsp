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

<%--This page generates the image and image thumbnails of the selected series.
@author:  Bharathi.
@version: 0.7
--%>
<%@ page isELIgnored="false" %>
<%@ page errorPage="ErrorPage.jsp" %>
<%@ taglib prefix="img" uri="ImageInfo" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:if test="${param.physicianName!=null}">
<c:set var="phy_name" scope="application" value="${param.physicianName}"/>

<c:if test='${fn:indexOf(phy_name,"`~")>0}'>
<c:set var="phy_name" scope="application" value='${fn:replace(phy_name,"`~","\\"")}'/>
</c:if>

<c:if test='${fn:indexOf(phy_name,"~`")>0}'>
<c:set var="phy_name" scope="application" value="${fn:replace(phy_name,'~`','\\'')}" />
</c:if>

</c:if>

<c:if test="${param.physicianName==null}">
<c:set var="phy_name" scope="application" value=""/>
</c:if>

<div id="left">
<c:choose>				 
<c:when test="${param.modality =='SR' }">
	<div id="SRContent" style="position:relative;left:10%;width:80%;overflow-x:auto;overflow-y:auto;color:#FFFFFF;"></div>
	<img alt="" class="dragme" name="picture" src="Image.do?study=${param.study }&series=${param.series }&object=${param.imageId }" width="0" id="picture">
</c:when>

<c:when test="${frames =='yes' }">
	<div class="shadow" id="patStudyDesc">${param.studyDescription }</div>	
	<div class="shadow" id="patSex">${param.sex }</div>
	<div class="shadow" onclick=" even=document.getElementById('picture').event; initwl();" id="patPhyName">${phy_name}</div>
	<div class="shadow" id="patBirthDate">${param.birthDate }</div>
	<div class="shadow" id="patStudyDate">${param.studyDates}</div>
	<div class="shadow" id="patModality">${param.modality}</div>
	
        <div class="shadow" id="number">Frame 1 of ${param.totalImages }</div>
	<table id="imgTable">
		<tr>
			<td class="imageHolder">
				<div id = "imageHolder" class="imageHolder">
					<center>
						<img alt="" class="dragme" name="picture" src="Image.do?study=${param.study}&series=${param.series}&object=${param.imageId}" width="512" id="picture">
				 	</center>
				 </div>
			<td>
		</tr>
	</table>

</c:when>

<c:otherwise>			
	<div class="shadow" id="patStudyDesc">${param.studyDescription }</div>	
	<div class="shadow" id="patSex">${param.sex }</div>
	<div class="shadow" onclick=" even=document.getElementById('picture').event; initwl();" id="patPhyName">${phy_name}</div>
	<div class="shadow" id="patBirthDate">${param.birthDate }</div>
	<div class="shadow" id="patStudyDate">${param.studyDates}</div>
	<div class="shadow" id="patModality">${param.modality}</div>
	
	<div class="shadow" id="windowLevel"></div>

	<div class="shadow" id="number">Image 1 of ${param.totalImages }</div>
	<table id="imgTable">
		<tr>
			<td class="imageHolder">
				<div id = "imageHolder" class="imageHolder">
					<center>
						<img alt="" class="dragme" name="picture" src="Image.do?study=${param.study}&series=${param.series}&object=${param.imageId}&rows=512" width="512" id="picture" onload="if('${windowCenter}'!='' && globalWC==0 && globalWW==0) {defaultWC=globalWC='${windowCenter}'; defaultWW=globalWW='${windowWidth}'; showWindowAttributes(globalWC,globalWW);}">
				 	</center>
				 </div>
			<td>
		</tr>
	</table>

</c:otherwise>
</c:choose>	
			
</div>
		

<%--//ThumbNails Div to hold the thumbDivider and thumbNailHolder --%>
<div id="thumbNails" class='flexcroll'>

	<%--thumbDivider to seperate the image and thumbnails --%>
	<div id="thumbDivider" onclick="singleImage();" title="Click or press 'i' to toggle thumbnails visibility">
		<img id="dividerImg" src="images/icn_grip1.gif" alt="">
	</div><%--End of thumbDivider --%>
	
	<%-- thumbNailHolder Div to contain the thumbnails of the selected Series. --%>
	<div id="thumbNailHolder">
	
	<%-- Image tag that gives the instance informations--%>
	<img:Image patientId="${param.patient}" study="${param.study}" seriesId="${param.series}" >
		<div class="scale-item">
			<div class="imgNo">${instanceNumber}</div>
			<input type="hidden" id="imgs${img}" name='http://${applicationScope.serverConfig.hostName }:${applicationScope.serverConfig.wadoPort }/wado?requestType=WADO&contentType=application/dicom%2Bxml&studyUID=${param.study}&seriesUID=${param.series }&objectUID=${imageId }' style="position:fixed;top:0px;">
			<c:choose>				 
			<c:when test="${param.modality =='SR' }">
				<img alt="" id="img${img}" name="images/icons/SR_black.jpg" class="scale-image" src="images/icons/SR_black.jpg" width="100%" onclick="ajaxpage('SRContent','Image.do?study=${param.study}&series=${param.series }&object=${imageId }&contentType=text/html'); return false;">
			</c:when>
			<c:otherwise>
				<c:choose>
				<c:when test="${frames =='yes' }">		 
					<img alt="" id="img${img}" name="Image.do?study=${param.study}&series=${param.series }&object=${imageId }" class="scale-image" src="images/icons/filler_black.jpg" width="100%" onclick="fti=0; multiFrames=true; changeSpeed1(ajaxpage('','MFrames?datasetURL=http://${applicationScope.serverConfig.hostName}:${applicationScope.serverConfig.wadoPort}/wado?requestType=WADO&contentType=application/dicom&studyUID=${param.study}&seriesUID=${seriesId}&objectUID=${imageId}')); setImageInfos('${numberOfFrames}'); setImage=false; cineloop=0; ajaxpage('imagePane','MultiFrames.jsp?study=${param.study}&series=${param.series }&object=${imageId }&numberOfFrames=${numberOfFrames }&sex=${param.sex }&physicianName=${param.physicianName }&birthDate=${param.birthDate }&studyDates=${param.studyDates }&modality=${param.modality }'); cineLoop(); changeBorder(this);">		
				</c:when>

				<c:otherwise> 
					<img alt="" id="img${img}" name="Image.do?study=${param.study}&series=${param.series }&object=${imageId }&rows=${rows}" class="scale-image" src="images/icons/filler_black.jpg" width="100%" onclick="changeslides(${img}); changeBorder(this);">
				</c:otherwise>
				</c:choose>
			</c:otherwise>
			</c:choose>				 
		</div>				
	</img:Image><%--End of Image tag. --%>
	</div><%--End of thumbNailHolder Div --%>
</div><%--End of thumbNails Div --%>