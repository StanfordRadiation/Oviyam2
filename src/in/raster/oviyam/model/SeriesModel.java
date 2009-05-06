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
package in.raster.oviyam.model;

import org.dcm4che.data.Dataset;
import org.dcm4che.dict.Tags;

/**
 * Used to keep the Series informations such as seriesIUID, seriesDescription etc.
 * @author bharathi
 * @version 0.7
 *
 */
public class SeriesModel {
	
	// Variables -------------------------------------------------------------	
	private String seriesIUID;
	
	private String seriesDescription;
	
	private String seriesNumber;
	
	private String numberOfInstances;
	
	private String modality;
	
		
	// Constructors -----------------------------------------------------------
	/**
	 * Used to create a instance of SeriesModel.The properties of 
	 * SeriesModel instance will be initialized  While initializing the SeriesModel.
	 * @param dataSet The Dataset instance contains the Series informations.
	 */
	public SeriesModel(Dataset dataSet){
		seriesIUID = dataSet.getString(Tags.SeriesInstanceUID);
		seriesDescription = dataSet.getString(Tags.SeriesDescription);
		seriesNumber = dataSet.getString(Tags.SeriesNumber);
		numberOfInstances = dataSet.getString(Tags.NumberOfSeriesRelatedInstances);
		modality = dataSet.getString(Tags.Modality);
		if(seriesDescription != null){
			seriesDescription = seriesDescription.replace("'","");
		}
	}
	
	/**
	 * Getter for property seriesIUID.
	 * @return Value of property seriesIUID.
	 */
	public String getSeriesUID(){
		return seriesIUID;
	}
	
	/**
	 * Getter for property seriesDescription.
	 * @return Value of property seriesDescription.
	 */
	public String getSeriesDescription(){
		return seriesDescription;
	}
	
	/**
	 * Getter for property seriesNumber.
	 * @return Value of property seriesNumber.
	 */
	public String getSeriesNumber(){
		return seriesNumber;
	}
	
	/**
	 * Getter for property numberOfInsrances.
	 * @return Value of property numberOfInstances.
	 */
	public String getNumberOfInstances(){
		return numberOfInstances;
	}
	
	/**
	 * Getter for property modality.
	 * @return Value of property modality.
	 */
	public String getModality(){
		return modality;
	}

}
