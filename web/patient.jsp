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
* Asgar Hussain B
* Babu Hussain A
* Bharathi B
* Manikandan P
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
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="ISO-8859-1"%>    
<%@page isELIgnored="false"%>
<%@taglib prefix="pat" uri="PatientInfo" %>
<%@taglib prefix="study" uri="StudyInfo" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<div id="tableContainer" class="TableContainer">
<table id="queryResult"  class="queryResult">

<thead class="fixedHeader">

	<tr>
		<td class="point" >NO</td>
					
					<td  title="Sort">Name</td>
					<td  title="Sort">Patient ID</td>				
					<td  title="Sort">Sex</td>
					<td  title="Sort">Birth date</td>
					<!--  <td>Study date</td>
					<td>Modality</td>-->
					<td  title="Sort">Ref. Physician</td>
					
	</tr>

</thead>

<tbody class="scrollContent" id="queryBody">
	<pat:Patient patientId="${param.patientId}" patientName="${param.patientName}" birthDate="${param.birthDate}" searchDate="${param.searchDate}" modality="${param.modality}" 
	
		from="${param.from}" to="${param.to}" searchDays="${param.group1}" accessionNumber="${param.accessionNumber}">
	
		<tr style="vertical-align:top;">
			<td class="serNo" >${serNo }</td>		
			<td> 
			<table id="innerTable">
			<c:choose>
	<c:when test="${sex =='F' || sex=='f' }">		
		<tr title="Female"> <td class="serNo" colspan="4" ><img style="background:transparent;" src="images/pic1.gif" alt="">&nbsp;&nbsp;${patientName}<br></td></tr>
	</c:when>
	
	<c:when test="${sex =='M' || sex=='m' }">	
			<tr title="Male"> <td class="serNo" colspan="4" ><img style="background:transparent;" src="images/patient-temp1.gif" alt="">&nbsp;&nbsp;${patientName}<br></td></tr>
	</c:when>
	
		<c:otherwise>	
			<tr title="Unknown"> <td class="serNo" colspan="4" >${patientName}<br></td></tr>
	</c:otherwise>	
	
</c:choose>
	<study:Study patientId="${patientId}" modality="${param.modality}">	
						<tr>						
							<td id="plusTD" class = "studyInfo" onclick=" addRow(${no},'seriesDetails.jsp?patient=${patientId }&study=${studyId}&studyDescription=${studyDescription}&sex=${sex }&birthDate=${birthDate }&studyDates=${studyDates }&physicianName=${physicianName}');"><center><img alt="" title="click to expand/shrink this study" id="expand${no}" src="images/TopPlus1.gif" class="expand"></center></td>
							<td id="studyDescTD" class = "studyInfo" colspan="3" onclick= 'hidePatient(); hidesereis=1;hideSeries(); document.getElementById("imagePane").innerHTML=""; ajaxpage("seriesPane", "SeriesInfo.jsp?patient=${patientId }&study=${studyId}&studyDescription=${studyDescription }&sex=${sex }&birthDate=${birthDate }&studyDates=${studyDates }&physicianName=${physicianName}"); resetLoop(); setPatientInfoVisible("${patientName}"); return false'>
								${studyDescription}
							</td>
							<td id="modalityTD">
							${modalityInStudy}
							</td>
							<td id="studyDateTD">
								${studyDates}
							</td>
						
						</tr>
						<tr>
							<td ></td>
							<td colspan="3" align="left">
							<div style="position:relative;width:100%;" id="seriesHolder${no}" class="seriesHolder">				
							</div>
							</td>
						</tr> 
			
				</study:Study>
			</table>
			</td>
			<td >${patientId}</td>			
			<td >${sex}</td>
			<td >${birthDate}</td>			
			<td >${phy_name}</td>
		</tr>
	</pat:Patient>
</tbody>

</table>
</div>
