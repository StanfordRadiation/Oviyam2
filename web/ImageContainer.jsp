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
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="ISO-8859-1"%>
<%@ page isELIgnored="false" %>
<%@ page errorPage="ErrorPage.jsp" %>
<%@ taglib prefix="img" uri="ImageInfo" %>
<%@ taglib prefix="lbx" uri="LightBox" %>

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
	<div class="shadow" id="patStudyDesc" style="visibility:hidden;"></div>
	<div id="SRContent"></div>
</c:when>

<c:when test="${param.modality =='KO' }">
	<div class="shadow" id="patStudyDesc" style="visibility:hidden;"></div>
	<div id="KOContent"></div>
</c:when>

<c:when test="${param.modality == 'ES' && param.sopClassUid == '1.2.840.10008.5.1.4.1.1.77.1.1.1' }">
     <div class="shadow" id="patStudyDesc" style="visibility:hidden;"></div>
     <div id="MPEGContent"></div>
     <img alt="" class="dragme" name="picture" src="" width="0" id="picture">
</c:when>

<c:when test="${frames =='yes' }">
	<div class="shadow" id="patStudyDesc"></div>	
	<div class="shadow" id="patSex">${param.sex }</div>
	<div class="shadow" onclick=" even=document.getElementById('picture').event; initwl();" id="patPhyName">${phy_name}</div>
	<div class="shadow" id="patBirthDate">${param.birthDate }</div>
	<div class="shadow" id="patStudyDate">${param.studyDates}</div>
	<div class="shadow" id="patModality">${param.modality}</div>
	
	<div class="shadow" id="windowLevel"></div>
	<div class="shadow" id="pixelSpacing"></div>
	<div class="shadow" id="pixelMessage"></div>
	<div class="shadow" id="nativeRes"></div>
	
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
	<div class="shadow" id="patStudyDesc"></div>	
	<div class="shadow" id="patSex">${param.sex }</div>
	<div class="shadow" onclick=" even=document.getElementById('picture').event; initwl();" id="patPhyName">${phy_name}</div>
	<div class="shadow" id="patBirthDate">${param.birthDate }</div>
	<div class="shadow" id="patStudyDate">${param.studyDates}</div>
	<div class="shadow" id="patModality">${param.modality}</div>
	
	<div class="shadow" id="windowLevel"></div>
	<div class="shadow" id="pixelSpacing"></div>
	<div class="shadow" id="pixelMessage"></div>
	<div class="shadow" id="nativeRes"></div>
	
	<div class="shadow" id="full_resolution" style="visibility:hidden;" onclick="showFullResolution();">&nbsp;View Full Resolution&nbsp;</div>
	
	<div class="shadow" id="number">Image 1 of ${param.totalImages }</div>
	<table id="imgTable">
		<tr>
			<lbx:LightBox patientId="${param.patient}" study="${param.study}" seriesId="${param.series}" objectId="${param.imageId}" >
			<td class="imageHolder">
				<div id = "imageHolder" class="imageHolder">
						<img style="display:none;" alt="" class="dragme" name="picture" src="" width="512" id="picture"></img>
				 </div>
			<td>
			</lbx:LightBox>
		</tr>
	</table>

</c:otherwise>
</c:choose>	
			
</div>
		

<%--//ThumbNails Div to hold the thumbDivider and thumbNailHolder --%>
<div id="thumbNails" class='flexcroll'>

	<%--thumbDivider to separate the image and thumbnails --%>
	<div id="thumbDivider" onclick="singleImage();" title="Click or press 'i' to toggle thumbnails visibility">
		<img id="dividerImg" src="images/icn_grip1.gif" alt="">
	</div><%--End of thumbDivider --%>
	
	<div id="imageCacheHolder" style="display:none">
	</div>
	
	<%-- thumbNailHolder Div to contain the thumbnails of the selected Series. --%>
	<div id="thumbNailHolder">
	
	<%-- Image tag that gives the instance information--%>
	<img:Image patientId="${param.patient}" study="${param.study}" seriesId="${param.series}" >
		<div class="scale-item">
			<div class="imgNo">${instanceNumber}</div>
			<input type="hidden" id="imgs${img}" name='http://${applicationScope.serverConfig.hostName }:${applicationScope.serverConfig.wadoPort }/wado?requestType=WADO&contentType=application/dicom%2Bxml&studyUID=${param.study}&seriesUID=${param.series }&objectUID=${imageId }' style="position:fixed;top:0px;">
			<c:choose>			 
			<c:when test="${param.modality =='SR' }">
				<img alt="" id="img${img}" name="images/icons/SR_Latest.png" class="scale-image" src="images/icons/SR_Latest.png" width="100%" onclick="ajaxpage('SRContent','Image.do?study=${param.study}&series=${param.series }&object=${imageId }&contentType=text/html'); $('SRContent').style.color='#000000'; changeBorder(this); return false;">
			</c:when>
			
			<c:when test="${param.modality =='KO' }">
				<img alt="" id="img${img}" name="images/icons/KO.png" class="scale-image" src="images/icons/KO.png" width="100%" onclick="ajaxpage('KOContent','Image.do?study=${param.study}&series=${param.series }&object=${imageId }&contentType=text/html'); $('KOContent').style.color='#000000'; changeBorder(this); return false;">
			</c:when>

			<c:when test="${param.modality == 'ES' && sopClassUID == '1.2.840.10008.5.1.4.1.1.77.1.1.1' }">
			    <img alt="" id="img${img}" name="images/icons/icn_video.gif" class="scale-image" src="images/icons/icn_video.gif" width="100%" onclick="vlc_controls=null; init_vlc_player(); vlc_controls.play('wado?requestType=WADO&contentType=application/dicom&studyUID=${param.study}&seriesUID=${param.series}&objectUID=${imageId}'); changeBorder(this); return false;" onload="loadStudyDesc('${studyDesc}');">
			</c:when>		
			
			<c:otherwise>
				<c:choose>
				<c:when test="${frames =='yes' }">		 
					<img alt="" id="img${img}" name="Image.do?study=${param.study}&series=${param.series }&object=${imageId }" class="scale-image measurable" src="images/icons/filler_black.jpg" width="100%" onclick="fti=0; multiFrames=true; changeSpeed1(ajaxpage('','MFrames?datasetURL=http://${applicationScope.serverConfig.hostName}:${applicationScope.serverConfig.wadoPort}/wado?requestType=WADO&contentType=application/dicom&studyUID=${param.study}&seriesUID=${seriesId}&objectUID=${imageId}')); setImageInfos('${numberOfFrames}'); if (cineloop) cineLoop(); loadImageCache('Image.do?study=${param.study}&series=${param.series }&object=${imageId }&rows=${rows}&frameNumber=',${numberOfFrames}); setImageAndHeaders('Image.do?study=${param.study}&series=${param.series }&object=${imageId }&rows=${rows}&frameNumber=0'); cineLoop(); changeBorder(this); selectedInstanceIndex = ${img}; changeDataset();" onload="loadStudyDesc('${studyDesc}');">		
				</c:when>
				<c:otherwise>
					<img alt="" id="img${img}" name="Image.do?study=${param.study}&series=${param.series }&object=${imageId }&rows=${rows}" class="scale-image measurable" src="images/icons/filler_black.jpg" width="100%" onclick="if (cineloop) cineLoop(); setImageInfos('${numberOfImages}'); changeslides(${img}); changeBorder(this); changeDataset();" onload = "checkResolution(${rows}); loadStudyDesc('${studyDesc}');">
				</c:otherwise>
				</c:choose>
			</c:otherwise>
			</c:choose>				 
		</div>				
	</img:Image><%--End of Image tag. --%>
	</div><%--End of thumbNailHolder Div --%>
</div><%--End of thumbNails Div --%>