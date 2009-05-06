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
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page contentType="text/html;"  isELIgnored="false" %> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page errorPage="ErrorPage.jsp" %>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Oviyam - Invalid ${requestScope.param}</title>
	<style>
		#contentDiv{		
			position: absolute;
			top:0px;
			left:0px;
			height: 100%;
			width: 100%;
			text-align: center;		
			z-index:10000;
			background:#000000;
			opacity:.85;
		}
		#dialogDiv {
			position: relative;
			width:500px;
			border:1px solid #FFFFFF;
			margin: 20% auto;
			margin-top: 20%;
			/*  top: -50px;*/
			height: 200px;
			text-align: center;
			color:#FF0000;
			background:#232323;	
			font-size:20px;	
		}
	</style>
</head>
<body bgcolor="#000000">

<div id="contentDiv" >
	<div id="dialogDiv">
		<div style="position:relative;top:40%;">
		<center>
			<c:choose>
				<c:when test="${requestScope.param=='studyUID'}">
					Invalid or blank studyUID. Please enter the valid studyUID.
				</c:when>
				<c:when test="${requestScope.param=='seriesUID'}">
					Invalid or blank seriesUID. Please enter the valid seriesUID.
				</c:when>  
				<c:when test="${requestScope.param=='patientID'}">
					Invalid or blank patientID. Please enter the valid patientID.
				</c:when> 
			</c:choose>			
		</center>
		</div>
	</div>

</div>
</body>
</html>