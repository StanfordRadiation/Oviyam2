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
<%@page contentType="text/html"%>

<html>

<table class="parameterTable" id="parameterTable" width="100%" cellpadding="5" style="color:#FFFFFF;">
    <tr>
	  <td style="padding-left:67px"><b><font size="2">Preset&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font></b>
	      <select name="preset" id="preset" onChange="setPresetValues();" >
		     <option value="40:350">Chest/Abdomen/Pelvis</option>
			 <option value="1500:-600">Lung</option>
			 <option value="80:40">Brain</option>
			 <option value="2500:480">Bone</option>
		     <option value="350:90">Head/Neck</option>
		     <option value="0:0">Custom</option>
		  </select>
	  </td>
    </tr>

	<tr>
      <td style="padding-left:65px">
	         <b><font size="2">Window Center</font></b>&nbsp; <input type="text" name="wc" id="wc" value="350" size="7" onchange="onChangeWLsetPreset();"> 
	   </td>
	   </tr>
	   <tr>
      <td style="padding-left:65px">
	         <b><font size="2">Window Width&nbsp;&nbsp;&nbsp;&nbsp;</font></b><input type="text" id="ww" name="ww" value="40" size="7" onchange="onChangeWLsetPreset();"> 
	  </td>
    </tr>
	<tr>
	<td style="padding-left:65px"><input type="checkbox" name="preview" id="preview" onchange="applyPreview();"><b><font size="2">Preview </font></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		  <input value="    Apply    " onclick="applyCenterAndWidth()" type="button">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	      <input value="Apply All" onclick="applyAllValues();" type="button">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
	      <input value="    Reset    " onclick="resetWLValues();" type="button">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
		  <input value="    Close    " onclick="closePopupMenu();" type="button">
	  </td>
	</tr>
</table>
</html>