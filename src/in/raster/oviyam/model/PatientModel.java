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

import java.util.ArrayList;

import org.dcm4che.data.Dataset;
import org.dcm4che.dict.Tags;

/**
 * 
 * @author bharathi
 * @version 0.7
 *
 */
public class PatientModel {	
	
	// Variables --------------------------------------------------------------
	private String patientID;
	
	private String patientName;
	
	private String patientSex;
	
	private String patientBirthDate;
	
	private String physicianName;
	
	/**
	 * ArrayList object to keep the StudyModel instances.
	 */	
	private ArrayList<StudyModel> studyList;
	
	// Constructors -----------------------------------------------------------
	/**
	 * Used to create a instance of PatientModel.The properties of 
	 * PatientModel instance will be initialized  While initializing the PatientModel.
	 * @param dataSet The Dataset instance contains the Patient informations.
	 */
	public PatientModel(Dataset dataSet){
		studyList = new ArrayList<StudyModel>();
		patientID = dataSet.getString(Tags.PatientID);
		patientName = dataSet.getString(Tags.PatientName);
		patientSex = dataSet.getString(Tags.PatientSex);
		patientBirthDate = dataSet.getString(Tags.PatientBirthDate);
		
		if((physicianName = dataSet.getString(Tags.ReferringPhysicianName)) != null){
			if(physicianName.indexOf("\"")>0){
				physicianName = physicianName.replace("\"","`~");
			} 
			if(physicianName.indexOf("\'")>0) {
				physicianName = physicianName.replace("\'","~`");
			} 
		} else {
			physicianName = "";
		}
	}
	
	/**
	 * Getter for property patientID.
	 * @return Value of property patientID.
	 */
	public String getPatientID(){
		return this.patientID;
	}
	
	/**
	 * Getter for property patientName.
	 * @return Value of property patientName.
	 */
	public String getPatientName(){
		return this.patientName;
	}
	
	/**
	 * Getter for property patientSex.
	 * @return Value of property patientSex.
	 */
	public String getPatientSex(){
		return this.patientSex;
	}
	
	/**
	 * Getter for property patientBirthDate.
	 * @return Value of property patientBirthDate.
	 */
	public String getPatientBirthDate(){
		return this.patientBirthDate;
	}
	
	/**
	 * Getter for property physicianName.
	 * @return Value of property physicianName.
	 */
	public String getPhysicianName(){
		return this.physicianName;
	}
	
	/**
	 * Adds the StudyModel instance to the studyList (ArrayList<StudyModel>).
	 * @param dataSet The Dataset object that contains the study informations.
	 */
	public void addStudy(Dataset dataSet){		
		studyList.add(new StudyModel(dataSet));		
	}
	
	/**
	 * Getter for property studyList.
	 * @return studies of this PatientModel.
	 */
	public ArrayList<StudyModel> getStudis(){
		return this.studyList;
	}
	
	

}
