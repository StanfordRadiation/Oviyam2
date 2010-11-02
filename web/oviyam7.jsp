<%@ page contentType="text/html;" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="ser" uri="SeriesInfo"%>
<%@ taglib prefix="img" uri="ImageInfo"%>
<%@taglib prefix="pat" uri="PatientInfo" %>
<%@ page errorPage="ErrorPage.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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

<html>
<head>

<title>Oviyam</title>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<script type="text/javascript" language="javascript" src="js/lib/prototype.js"></script>
<script type="text/javascript" language="javascript" src="js/lib/jquery-1.4.2.min.js"></script>
<script type="text/javascript" language="javascript" src="js/oviyam7.js"></script>
<script type="text/javascript" language="javascript" src="js/imageDrag.js"></script>
<script type="text/javascript" language="javascript" src="js/imageZoom.js"></script>
<script type="text/javascript" language="javascript" src="js/ajaxLoadPage.js"></script>
<script type="text/javascript" language="javascript" src="js/keyNavigation.js"></script>
<script type="text/javascript" language="javascript" src="js/sortTable.js"></script>
<script type="text/javascript" language="javascript" src="js/webtoolkit.sortabletable.js"></script>
<script type="text/javascript" language="javascript" src="js/src/scriptaculous.js"></script>
<script type="text/javascript" language="javascript" src="js/DatePicker.js"></script>
<script type="text/javascript" language="javascript" src="js/windowLevel.js"></script>
<script type="text/javascript" language="javascript" src="js/VLCobject.js"></script>
<script type="text/javascript" language="javascript" src="js/VLCcontrols.js"></script>
<script type="text/javascript" language="javascript" src="js/ExternalLibLoader.js"></script>
<script type="text/javascript" language="javascript" src="js/imageMeasure.js"></script>
<script type="text/javascript" language="javascript" src="js/LightBox.js"></script>
<script type="text/javascript" language="javascript" src="js/Ruler.js"></script>
<script type="text/javascript" language="javascript" src="js/lib/raphael-min.js"></script>
<script type="text/javascript" language="javascript" src="js/lib/raphaelle.js"></script>

<c:choose>
	<c:when test="${param.studyUID != null && param.seriesUID!=null}">
		<link type="text/css" rel="StyleSheet" href="./css/Study.css" />
	</c:when>

	<c:when test="${param.patientID != null && param.studyUID!=null}">
		<link type="text/css" rel="StyleSheet" href="./css/Study.css" />
	</c:when>

	<c:when
		test="${param.patientID == null && param.studyUID!=null && param.seriesUID==null}">
		<link type="text/css" rel="StyleSheet" href="./css/Study.css" />
	</c:when>
	
	<c:when
		test="${param.patientID == null && param.accessionNumber!=null && param.studyUID== null}">
		<pat:Patient patientId="${param.patientId}" patientName="${param.patientName}" birthDate="${param.birthDate}" searchDate="${param.searchDate}" modality="${param.modality}"	from="${param.from}" to="${param.to}" searchDays="${param.group1}" accessionNumber="${param.accessionNumber}">

		</pat:Patient>
		  <c:if test="${totalNoOfStudies==1}">	
		     <link type="text/css" rel="StyleSheet" href="./css/Study.css">
          </c:if>
          <c:if test="${totalNoOfStudies>1 || totalNoOfStudies==0}">
		       <link type="text/css" rel="StyleSheet" href="./css/oviyam7.css">
          </c:if>
    </c:when>
	
	<c:otherwise>

		<link type="text/css" rel="StyleSheet" href="./css/oviyam7.css" />

	</c:otherwise>
</c:choose>
<link type="text/css" rel="StyleSheet" href="./css/dcm-style.css" />
<link rel="shortcut icon" href="images/icons/favicon.ico" />

</head>


<body id="body"
	<c:choose><c:when test="${cookie.color != null}">style="background:${cookie.color.value};" </c:when> 
	<c:otherwise> style="background:#232323;" </c:otherwise></c:choose>>
<div id="pageHeader">
<button id="searchButton" class="large"
	onclick="resetAll(); ajaxpage('searchTools','SearchPopup.jsp'); new Effect.SlideDown('searchPane',{duration:0.5}); 
	document.getElementById('buttons').style.visibility='visible';
	document.getElementById('divider').style.visibility='visible';
	keynav=0;keyaplhabet=0; hideDataSet(); 
	if($('mymovie') != null)
	   document.getElementById('mymovie').style.visibility='hidden';
	return false;">
</button>

<div id="patientDisName"></div>

<button id="hideButton" class="large" onclick="hideTools();"></button>
</div>

<div id="toolBar">
<div id="toolBarContainer">

<div id="infoButton" class="toolBarButton" onclick="loadDataSet('','');"
	onmouseout="clearzoom()">
<div class="toolBarText toolBarTextNonMode">DICOM Info</div>
</div>

<div id="configButton" class="toolBarButton"
	onclick="keynav=0; configServer('${applicationScope.serverConfig.aeTitle}','${applicationScope.serverConfig.hostName}','${applicationScope.serverConfig.port}','${applicationScope.serverConfig.wadoPort}'); document.getElementById('configPane').style.visibility='visible'; new Effect.SlideDown('configPane',{duration:0.5});">
	<div class="toolBarText toolBarTextNonMode">Config</div>
</div>

<div id="wcButton" class="wcButton toolBarButton">
	<div class="toolBarText" id="wcText">WL/WW</div>
</div>

<div id="presetButton" class="toolBarButton" onclick="popupQueryOptions();">
	<div class="toolBarText toolBarTextNonMode" id="presetText">Preset</div>
</div>

<div id="resetButton" class="toolBarButton" onclick="resetAll();">
	<div class="toolBarText toolBarTextNonMode">Reset</div>
</div>

<div id="moveButton" class="toolBarButton moveButton">
	<div class="toolBarText" id="moveText">Move</div>
</div>

<div id="measureButton" class="measureButton toolBarButton">
	<div class="toolBarText" id="measureText">Measure</div>
</div>

<div id="zoomButton" class="toolBarButton zoomButton">
	<div class="toolBarText" id="zoomText">Zoom on</div>
</div>

<div id="zoomInButton" class="toolBarButton"
	onmouseover="zoom(512,512,'picture','in');" onmouseout="clearzoom()">
<div class="toolBarText">Zoom in</div>
</div>

<div id="zoomOutButton" class="toolBarButton"
	onmouseover="zoom(512,512,'picture','out');" onmouseout="clearzoom()">
<div class="toolBarText">Zoom out</div>
</div>
</div>
</div>

<div id="patientDiv">
<div id="patientDi"></div>
</div>

<div id="seriesPane"><c:choose>
	<c:when test="${param.patientID != null && param.studyUID!=null}">
		<center>
		<div>
		<table>
			<ser:Series patientId="${param.patientID}" study="${param.studyUID}">
				<tr>
					<td style="border-bottom: 2px solid #d9d9d9;">
					<div class="seriesDetails">${seriesDescs}</div>
					<div class="seriesDetails">Total Images : ${numberOfImages}</div>
					<div id="image"><A HREF=""
						onclick="borderThumb=''; setImageInfos('${numberOfImages}'); loadImages('ImageContainer.jsp?patient=${serPk}&study=${param.studyUID}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId}&sex=${patientSex}&birthDate=${patientBirthDate}&studyDates=${studyDate}&studyDescription=${studyDesc}&physicianName=${refPhysicianName}'); return false;"><img
						width="130px" class="reflec"
						src="Image.do?study=${param.study}&series=${seriesId}&object=${imageId}&row=135" /></a></div>
					<script type="text/javascript" language="javascript">
											ispatientlistvisible=0;
											setPatientInfoVisible("${patientName}");
											ispatientlistvisible=1;
										</script></td>
				</tr>
			</ser:Series>
		</table>
		</div>
		</center>
		<script type="text/javascript" language="javascript">
					keynav=1;
				</script>
	</c:when>
	<c:when
		test="${param.patientID == null && param.studyUID!=null && param.seriesUID == null}">
		<center>
		<div>
		<table>
			<ser:Series patientId="${param.patientID}" study="${param.studyUID}">
				<tr>
					<td style="border-bottom: 2px solid #d9d9d9;">
					<div class="seriesDetails">${seriesDescs}</div>
					<div class="seriesDetails">Total Images : ${numberOfImages}</div>
					<c:choose>
					   <c:when test="${modality =='SR' }"> <%--Structured Reporting Document--%>
						  <div class="image" onclick="borderThumb=''; setImageInfos('${numberOfImages}'); loadImages('ImageContainer.jsp?patient=${serPk}&study=${param.studyUID}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId}&sex=${patientSex}&birthDate=${patientBirthDate}&studyDates=${studyDate}&studyDescription=${studyDesc}&physicianName=${refPhysicianName}');"><img  width="128px" class="reflec" src="images/icons/SR_Latest.png" onclick="changeSeriesBorder(this); changeFirstImgBorder('img0'); ajaxpage('SRContent','Image.do?study=${param.study}&series=${seriesId}&object=${imageId }&contentType=text/html');"></div>
					   </c:when>

					   <c:when test="${modality =='KO' }"> <%--Key Object Selection--%>
						 <div class="image" onclick="borderThumb=''; setImageInfos('${numberOfImages}'); loadImages('ImageContainer.jsp?patient=${serPk}&study=${param.studyUID}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId}&sex=${patientSex}&birthDate=${patientBirthDate}&studyDates=${studyDate}&studyDescription=${studyDesc}&physicianName=${refPhysicianName}');"><img  width="128px" class="reflec" src="images/icons/KO.png" onclick="changeSeriesBorder(this); changeFirstImgBorder('img0'); ajaxpage('KOContent','Image.do?study=${param.study}&series=${seriesId}&object=${imageId }&contentType=text/html');"></div>
					   </c:when>
					
					   <c:when test="${modality == 'ES' && sopClassUID == '1.2.840.10008.5.1.4.1.1.77.1.1.1' }">					
						 <div class="image" onclick="loadImages('ImageContainer.jsp?patient=${param.patient}&study=${param.study}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId }&studyDescription=${param.studyDescription }&sex=${param.sex }&birthDate=${param.birthDate }&studyDates=${param.studyDates }&physicianName=${param.physicianName }&sopClassUid=${sopClassUID}'); "><img  width="128px" class="reflec" src="images/icons/icn_video.gif" onclick="changeSeriesBorder(this);"></div>
					   </c:when>					
					
<%-- Removing call to dcmWL, a separate ajax call is more appropriate. --%>
			           <c:otherwise>
					     <div class="image" onclick="resetAll(); globalWC=globalWW=0; borderThumb=''; setImageInfos('${numberOfImages}');  loadImages('ImageContainer.jsp?patient=${serPk}&study=${param.studyUID}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId}&sex=${patientSex}&birthDate=${patientBirthDate}&studyDates=${studyDate}&studyDescription=${studyDesc}&physicianName=${refPhysicianName}'); changeFirstImgBorder('img0'); return false;"><img id="series${seriesNumber}" width="128px" class="reflec" src="Image.do?study=${param.study}&series=${seriesId}&object=${imageId}&row=128" onclick="changeSeriesBorder(this); changeFirstImgBorder('img0');"></div>
					   </c:otherwise>
					</c:choose>

					    <script type="text/javascript" language="javascript">
							    ispatientlistvisible=0;
								setPatientInfoVisible("${patientName}");
								ispatientlistvisible=1;
					   </script>
					</td>
				</tr>
			</ser:Series>
		</table>
		</div>
		</center>
		<script type="text/javascript" language="javascript">
					keynav=1;
				</script>
	</c:when>

    <c:when test="${param.patientID == null && param.accessionNumber!=null && param.studyUID== null}">

		<c:if test="${totalNoOfStudies==1}">
		   <center>		
		  	  <div>
		    	<table>
					<ser:Series patientId="${patientId}" study="${studyId}">
				       <tr>
						<td style="border-bottom: 2px solid #d9d9d9;">
						<div class="seriesDetails">${seriesDescs}</div>
						<div class="seriesDetails">Total Images : ${numberOfImages}</div>
						
						<c:choose>
					       <c:when test="${modality =='SR' }"> 
						      <div class="image" onclick="borderThumb=''; setImageInfos('${numberOfImages}'); loadImages('ImageContainer.jsp?patient=${serPk}&study=${param.studyUID}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId}&sex=${patientSex}&birthDate=${patientBirthDate}&studyDates=${studyDate}&studyDescription=${studyDesc}&physicianName=${refPhysicianName}');"><img  width="128px" class="reflec" src="images/icons/SR_Latest.png" onclick="changeSeriesBorder(this); changeFirstImgBorder('img0'); ajaxpage('SRContent','Image.do?study=${param.study}&series=${seriesId}&object=${imageId }&contentType=text/html');"></div>
					       </c:when>

					       <c:when test="${modality =='KO' }">
						      <div class="image" onclick="borderThumb=''; setImageInfos('${numberOfImages}'); loadImages('ImageContainer.jsp?patient=${serPk}&study=${param.studyUID}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId}&sex=${patientSex}&birthDate=${patientBirthDate}&studyDates=${studyDate}&studyDescription=${studyDesc}&physicianName=${refPhysicianName}');"><img  width="128px" class="reflec" src="images/icons/KO.png" onclick="changeSeriesBorder(this); changeFirstImgBorder('img0'); ajaxpage('KOContent','Image.do?study=${param.study}&series=${seriesId}&object=${imageId }&contentType=text/html');"></div>
					       </c:when>
					
					       <c:when test="${modality == 'ES' && sopClassUID == '1.2.840.10008.5.1.4.1.1.77.1.1.1' }">					
						      <div class="image" onclick="loadImages('ImageContainer.jsp?patient=${param.patient}&study=${param.study}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId }&studyDescription=${param.studyDescription }&sex=${param.sex }&birthDate=${param.birthDate }&studyDates=${param.studyDates }&physicianName=${param.physicianName }&sopClassUid=${sopClassUID}'); "><img  width="128px" class="reflec" src="images/icons/icn_video.gif" onclick="changeSeriesBorder(this);"></div>
					       </c:when>
					       
					       <c:otherwise>
						      <div class="image" onclick="resetAll();globalWC=globalWW=0; borderThumb=''; setImageInfos('${numberOfImages}');  loadImages('ImageContainer.jsp?patient=${serPk}&study=${param.studyUID}&series=${seriesId}&modality=${modality}&seriesDesc=${seriesDescs}&totalImages=${numberOfImages}&imageId=${imageId}&sex=${patientSex}&birthDate=${patientBirthDate}&studyDates=${studyDate}&studyDescription=${studyDesc}&physicianName=${refPhysicianName}'); changeFirstImgBorder('img0'); return false;"><img id="series${seriesNumber}" width="128px" class="reflec" src="Image.do?study=${param.study}&series=${seriesId}&object=${imageId}&row=128" onclick="changeSeriesBorder(this); changeFirstImgBorder('img0');"></div>
						   </c:otherwise>
						 </c:choose>

					  <script type="text/javascript" language="javascript">
						ispatientlistvisible=0;
						setPatientInfoVisible("${patientName}");
						ispatientlistvisible=1;
					  </script>
					</td>
				</tr>
			</ser:Series>
		    </table>
	        </div>
	        </center>
		</c:if>
		<script type="text/javascript" language="javascript">
			keynav=1;
		</script>

</c:when>
	
</c:choose></div>

<div id="seriesDivider" onclick="hideSeries();" title="Click or press 's' to toggle series visibility">
	<img id="dividerImg" src="images/icn_grip1.gif" alt="">
</div>

<c:choose>
	<c:when test="${param.studyUID == null && param.seriesUID ==null}">
		<div id="imagePane"></div>
	</c:when>
	<c:when test="${param.patientID != null && param.studyUID !=null}">
		<div id="imagePane"></div>
	</c:when>
	<c:when
		test="${param.patientID == null && param.studyUID !=null && param.seriesUID==null}">
		<div id="imagePane"></div>
	</c:when>
	<c:when test="${param.studyUID != null && param.seriesUID !=null}">
		<div id="imagePane"></div>
		<script type="text/javascript" language="javascript">
		    $('seriesPane').style.width="0%";
			$('seriesDivider').style.left="0";
			initScroll(); 
		</script>
		<div id="imagePane">
		<div id="left">
		<table id="imgTable">
			<tr>
				<td class="imageHolder">
				<div class="imageHolder">
				<center><img:Image patientId="${param.patient}" study="${param.studyUID}" seriesId="${param.seriesUID}">

					<c:if test="${refPhysicianName!=null}">
						<c:set var="phy_name" scope="application"
							value="${refPhysicianName}" />

						<c:if test='${fn:indexOf(phy_name,"`~")>0}'>
							<c:set var="phy_name" scope="application"
								value='${fn:replace(phy_name,"`~","\\"")}' />
						</c:if>

						<c:if test='${fn:indexOf(phy_name,"~`")>0}'>
							<c:set var="phy_name" scope="application"
								value="${fn:replace(phy_name,'~`','\\'')}" />
						</c:if>

					</c:if>

					<c:if test="${refPhysicianName==null}">
						<c:set var="phy_name" scope="application" value="" />
					</c:if>
				</img:Image>
				
				<div class="shadow" id="patStudyDesc">${studyDesc}</div>
				<div class="shadow" id="patSex">${patientSex}</div>
				<div class="shadow" id="patPhyName">${phy_name}</div>
				<div class="shadow" id="patBirthDate">${patientBirthDate}</div>
				<div class="shadow" id="patStudyDate">${studyDate}</div>
				<div class="shadow" id="patModality">${modality}</div>
				<div class="shadow" id="number"></div> 
				
				<img class="dragme" name="picture" src="" width="512" alt=""
					id="picture"></center>
				</div>
				</td>
			</tr>
		</table>
		</div>

		<div id="thumbNails">
		<div id="thumbDivider" onclick="singleImage();"
			title="Click or press 'i' to toggle thumbnails visibility"><img
			id="dividerImg" src="images/icn_grip1.gif" alt=""></div>
		<div id="thumbNailHolder">
		<img:Image patientId="${param.patient}" study="${param.studyUID}" seriesId="${param.seriesUID}">
			<div class="scale-item">
			<div class="imgNo">${img +1}</div>
			<input type="hidden" id="imgs${img}"
				name='http://${applicationScope.hostName }:${applicationScope.wadoPort }/wado?requestType=WADO&contentType=application/dicom%2Bxml&studyUID=${param.studyUID}&seriesUID=${param.seriesUID }&objectUID=${imageId }'
				style="position: fixed; top: 0px;"> <img alt=""
				id="img${img}" class="scale-image"
				src="Image.do?study=${param.studyUID}&series=${param.seriesUID}&object=${imageId }"
				width="100%" onclick="changeslides(${img}); changeBorder(this);">
			</div>
		</img:Image></div>
		</div>

			<script type="text/javascript" language="javascript">	
				numberOfImages=${img+1};
				ispatientlistvisible=0;
				setPatientInfoVisible("${patientName}");
				ispatientlistvisible=1;
				keynav=1;
				document.getElementById('picture').src=document.getElementById("img0").src;
				document.getElementById('number').innerHTML="Image 1 of "+numberOfImages;
			</script>
			</div>
	</c:when>
</c:choose>

<div id="footerArea">
<div id="pageFooter">
<table width="100%">
	<tr>
		<td width="45%">
		<div id="viewControls">
		<div title="Click or press 'p' to toggle patient visibility"
			id="viewPatient" class="viewSwitcher" onclick="hidePatient();hideDataSet();">
		<div class="label">Patient</div>
		</div>

		<div title="Click or press 's' to toggle series visibility"
			id="viewSeries" class="viewSwitcher" onclick="hideSeries();hideDataSet();">
		<div class="label">Series</div>
		</div>

		<div title="Click or press 'g' to display this series in grid view"
			id="gridView" class="viewSwitcher" onclick="gridView();hideDataSet();">
		<div class="label">Grid</div>
		</div>

		<div title="Click or press 'm' to display this series in mosaic view"
			id="mosaicView" class="viewSwitcher" onclick="mosaicView();hideDataSet();">
		<div class="label">Mosaic</div>
		</div>

		<div title="Play a cineLoop of this series" id="cineLoop"
			class="viewSwitcher" onclick="cineLoop();hideDataSet();">
		<div class="label">Loop</div>
		</div>


		<div id="cineSlider" style="position: relative; visibility: hidden;"
			class="viewSwitcher">
		<div id="cineTrack"
			style="width: 140px; background-image: url('images/icons/icn_slider_track.png'); background-repeat: repeat-x; background-position: left; height: 10px;">
		<div id="cineHandle"
			style="width: 18px; background-image: url('images/icons/icn_slider_handle.png'); background-repeat: no-repeat; background-position: right; height: 15px;"></div>
		</div>
		</div>
		</div>
		</td>
		<td><a href="http://oviyam.raster.in" target="_blank"><img
			src="images/oviyam_logo_b.png" alt="" title="Oviyam"></a></td>
		<td width="300" align="right">
		<div class="colorChooser" id="colorChooser">
		<div class="label">Background:&nbsp;</div>
		<div title="view this page with a black background" id="black"
			class="backColor" onclick="changeBlack();" onmouseover="setCursor()">
		</div>

		<div title="view this page with a dark gray background" id="dkgrey"
			class="backColor" onclick="changeGray();" onmouseover="setCursor()">
		</div>

		<div title="view this page with a light gray background" id="ltgrey"
			class="backColor" onclick="changeLightGray();"
			onmouseover="setCursor()"></div>

		<div title="view this page with a white background" id="white"
			class="backColor" onclick="changeWhite();" onmouseover="setCursor()">
		</div>
		</div>
		</td>
		<td width="200">
		<div id="sizeSlider" class="viewSwitcher"
			style="position: relative; margin-top: 13px;">
		<div id="track"
			style="width: 140px; background-image: url('images/icons/icn_slider_track.png'); background-repeat: repeat-x; background-position: left; height: 10px;">
		<div id="handle"
			style="width: 18px; background-image: url('images/icons/icn_slider_handle.png'); background-repeat: no-repeat; background-position: right; height: 15px;"></div>
		</div>
		</div>
		</td>
	</tr>
</table>
</div>
</div>

<div id="loadingView">
<div id="spinnerDiv"><img src="images/overlay_spinner.gif" alt="">
<div id="loadingText" class="loadingText">Loading...</div>
</div>
</div>

<center>
<div id="searchPane" class="hiddenPanel">
<div class="back-div">
<div class="front-div">
<div id="searchTools"></div>
<div class="divider" id="divider"></div>

<div class="buttons" id="buttons">
<button class="resetStyle" type="reset" 
	onclick="resetForm();">
<div class="outer">
<div class="label">Reset</div>
</div>
</button>
<button class="pushSearch" type="submit" onclick="stopTimer();loadFile(); keynav=1;">
<div class="outer">
<div class="label">Search</div>
</div>
</button>
<button class="pushCancel" type="reset"
	onclick="if($('mymovie') != null) document.getElementById('mymovie').style.visibility='visible'; keynav=1; new Effect.SlideUp('searchPane',{duration:0.5}); return false; keynav=1;">
<div class="outer">
<div class="label">Cancel</div>
</div>
</button>
</div>
</div>
</div>
</div>

<div id="searchPane1" class="hiddenPanel" style="visibility: hidden">
  <div class="back-div">
      <div id="presetTools"></div>
  </div>
</div>

<div id="configPane" class="hiddenPanel" style="visibility: hidden">
<div class="back-div">
<div class="front-div">
<form action="serverconfig.do" method="POST">
<table>
	<tr>
		<td>AE Title</td>
		<td><input type="text" name="aeTitle" id="aeTitle"
			value="${applicationScope.serverConfig.aeTitle}" size="22"></td>
	</tr>
	<tr>
		<td>Host Name</td>
		<td><input type="text" name="hostName" id="hostName"
			value="${applicationScope.serverConfig.hostName}" size="22"></td>
	</tr>
	<tr>
		<td>Port</td>
		<td><input type="text" name="port" id="port"
			value="${applicationScope.serverConfig.port}" size="22"></td>
	</tr>
	<tr>
		<td>WADO Port</td>
		<td><input type="text" name="wadoPort" id="wadoPort"
			value="${applicationScope.serverConfig.wadoPort}" size="22"></td>
	</tr>

	<tr>
		<td>Dcm Protocol</td>
		<td><select name="dcmProtocol" id="dcmProtocol">
			<option value="DICOM">DICOM</option>
			<option value="DICOM_TLS">DICOM_TLS</option>
			<option value="DICOM_TLS_3DES">DICOM_TLS_3DES</option>
			<option value="DICOM_TLS_AES">DICOM_TLS_AES</option>
			<option value="DICOM_TLS_NODES">DICOM_TLS_NODES</option>
		</select></td>
	</tr>
</table>

<div class="divider"></div>

<div class="buttons">
<button class="push" type="submit"
	onclick=" keynav=1; new Effect.SlideUp('configPane',{duration:0.5});">
<div class="outer">
<div class="label">Change</div>
</div>
</button>
<button class="push" type="reset"
	onclick="keynav=1; new Effect.SlideUp('configPane',{duration:0.5}); return false;">
<div class="outer">
<div class="label">Cancel</div>
</div>
</button>
</div>
</form>
</div>
</div>
</div>
</center>



<script type="text/javascript" language="javascript">
		 ajaxpage('searchTools','SearchPopup.jsp');
		 ajaxpage('presetTools','ParameterPopup.jsp');
		 var demoSlider = new Control.Slider('handle','track',
			{axis:'horizontal', minimum: 0, maximum:250, alignX: 00,increment: 2, sliderValue: 0.5});
		demoSlider.options.onSlide = function(value){
			scaleIt(value);
		}
		demoSlider.options.onChange = function(value){
			scaleIt(value);
		}
			
		var cineSlider = new Control.Slider('cineHandle','cineTrack',{axis:'horizontal', minimum:100, maximum:1000, alignX:00,increment:100, sliderValue:0.5});
		cineSlider.options.onSlide = function(value){
			changeSpeed(1000-(value*1000));
		}
		cineSlider.options.onChange = function(value){
			changeSpeed(1000-(value*1000));
		}
	</script>

<c:choose>
	<c:when
		test="${param.modality != null || param.patientID !=null || param.day !=null || param.birthDate !=null || param.patientName!=null}">
		<script type="text/javascript" language="javascript">
				document.getElementById('searchPane').style.visibility='hidden';
				file = "patient.jsp?modality=${param.modality}&group1=${param.day}&from=${param.from}&to=${param.to}&patientId=${param.patientID}&patientName=${param.patientName}&accessionNumber=${param.accessionNumber}&birthDate=${param.birthDate}";
				ajaxpage('patientDiv', file );
				sortPatientTable();
			</script>

	</c:when>

	<c:when
		test="${param.patientID == null && param.accessionNumber!=null && param.studyUID== null}">
		<center>
		
		<c:if test="${totalNoOfStudies>1 || totalNoOfStudies==0}">
		  	<script type="text/javascript" language="javascript">
                document.getElementById('searchPane').style.visibility='hidden';
				file = "patient.jsp?modality=ALL&group1=All Date&patientId=${param.patientID}&patientName=${param.patientName}&accessionNumber=${param.accessionNumber}";
				ajaxpage('patientDiv', file );
			    sortPatientTable();
       	    </script>
        </c:if>
	</div>
	</c:when>

	<c:otherwise>
	</c:otherwise>
</c:choose>
<center>
<div id="dataSet" style="visibility:hidden;">
<div id="dsImageHolder"><img src="" title="Back to Image"
	id="dataSetImage" alt="" onclick="hideDataSet();"><br>
<div id="dataSetPatient" class="ds"></div>
<br>
<div id="stuDesc" class="ds"></div><br>
<input type="button" value="Back to Image" onclick="hideDataSet();">
</div>
<div id="dataSetHolder"></div>
</div>
</center>

</body>
</html>