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
package in.raster.oviyam.model;

import org.dcm4che.data.Dataset;
import org.dcm4che.dict.Tags;


/**
 * 
 * @author bharathi
 * @version 0.7
 *
 */
public class StudyModel {
	
	// Variables --------------------------------------------------------------
	private String studyID;
	
	private String studyDescription;
	
	private String studyDate;
	
	private String modalitiesInStudy=null;
	
	private String accessionNumber;
	
	// Constructors -----------------------------------------------------------
	/**
	 * Used to create a instance of StudyModel.The properties of 
	 * StudyModel instance will be initialized  While initializing the StudyModel.
	 * @param dataSet The Dataset instance contains the Study informations.
	 */
	public StudyModel(Dataset dataSet){
		
		studyID = dataSet.getString(Tags.StudyInstanceUID);
		studyDescription = dataSet.getString(Tags.StudyDescription)!=null?dataSet.getString(Tags.StudyDescription):"unknown";
		studyDate = dataSet.getString(Tags.StudyDate)!=null?dataSet.getString(Tags.StudyDate):"unknown";
		modalitiesInStudy = getModalities(dataSet,Tags.ModalitiesInStudy);	
		accessionNumber = dataSet.getString(Tags.AccessionNumber);
	}
	
	/** 
	 * Getter for property studyID.
     * @return Value of property studyID.
     */
	public String getStudyID(){
		return studyID;		
	}
	
	/** 
	 * Getter for property studyDescription.
     * @return Value of property studyDescription.
     */
	public String getStudyDescription(){
		return studyDescription;
	}
	
	/** 
	 * Getter for property studyDate.
     * @return Value of property studyDate.
     */
	public String getStudyDate(){
		return studyDate;
	}
	
	/** 
	 * Getter for property modalitiesInStudy.
     * @return Value of property modalitiesInStudy.
     */
	public String getModalitiesInStudy(){
		return modalitiesInStudy;
	}
	
	/** 
	 * Getter for property accessionNumber.
     * @return Value of property accessionNumber.
     */
	public String getAccessionNumber(){
		return accessionNumber;
	}
	
	/**
	 * @param dataset-dataset Instance contain study information
	 * @param modalityConstant-Tag value for ModalitiesInStudies attribute of dataset
	 * @return modalities of specified dataset
	 */
	private String getModalities(Dataset dataSet, int modalityConstant) {
		String temp[] = null, modality = "";
		if (dataSet.getStrings(modalityConstant) != null) {
			temp = dataSet.getStrings(modalityConstant);
		} else {
			modality = "unknown";
		}
		for (int i = 0; i < temp.length; i++) {
			if (i == temp.length - 1)
				modality += temp[i];
			else
				modality += temp[i] + "\\";
		}
		return modality;
	}
}
