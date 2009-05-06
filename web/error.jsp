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
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Oviyam login</title>
<link type="text/css" rel="StyleSheet" href="./css/login.css">	
</head>
<body id="loginbody">
<center>
	<img src="images/oviyam_web_logo.png">


		<div id="login">
		
			<form action="oviyam" method="POST">
				<table>
					<tr>
						<td>
							<center>
								Invalid Usernamd or Password.
							</center>
						</td>
					</tr>
					<tr>
						<td class="label" >Name:</td><td><input class="text" type="text" name="user" ></td>
					</tr>
					<tr>
						<td class="label" >Password:&nbsp;</td><td><input class="text" type="password" name="password"  ></td>
					</tr>					
				</table>
				
				
				
				<div class="buttons" style="clear: both;">
					<button class="push" type="submit">
			        	<div class="outer">
							<div class="label"></div>
						</div>
					</button>					
				</div>		
			</form>	
		</div>

</center>


</body>
</html>