

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
package in.raster.oviyam;

import in.raster.oviyam.model.SeriesModel;
import in.raster.oviyam.utils.AE;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.Vector;

import org.apache.log4j.Logger;
import org.dcm4che.data.Dataset;
import org.dcm4che.dict.Tags;
import org.dcm4che.util.DcmURL;

import de.iftm.dcm4che.services.CDimseService;
import de.iftm.dcm4che.services.ConfigProperties;
import de.iftm.dcm4che.services.StorageService;

/**
 * Queries(cFIND) the Series informations from the machine(dcmProtocol://aeTitle@hostName:port).
 * 
 * @author bharathi
 * @version 0.7
 *
 */
public class SeriesInfo {
	/*
	 * Initialize Logger.
	 */
	private static Logger log = Logger.getLogger(SeriesInfo.class);
	
	// Variables -------------------------------------------------------------------
	private String patientName;
	
	private String patientSex;
	
	private String patientBirthDate;
	
	private String studyDate;
	
	private String studyDesc;
	
	private String refPhysicianName;
	
	
	
	private ArrayList<SeriesModel> seriesList;
	
	//HashMap instance to hold the SeriesModel instances.
	private HashMap<Integer,SeriesModel> series = new HashMap<Integer, SeriesModel>();
	
	//DICOM Dataset instance.
	private Dataset dataSet;
	
	// Constructor -----------------------------------------------------------------
	// Creates the new SeriesInfo
	public SeriesInfo() {
		seriesList = new ArrayList<SeriesModel>();
	}

	/**
	 * Queries(cFIND) the Series informations from the machine(dcmProtocol://aeTitle@hostName:port).
	 * @param patientID
	 * @param studyInstanceUID
	 */
	@SuppressWarnings( { "unchecked", "unchecked" })
	public void callFindWithQuery(String patientID, String studyInstanceUID) {

		ConfigProperties cfgCDimseService;
		boolean isOpen;
		Vector datasetVector;
		CDimseService cDimseService;

		try {
			cfgCDimseService = new ConfigProperties(StorageService.class
					.getResource("/resources/Series.cfg"));

		} catch (IOException e) {
			log.error("Error while loading configuration properties");
			return;
		}
		
		/*
		 * new AE().toString() returns the string ('dcmProtocol://aeTitle@hostName:port')
		 * @see in.raster.oviyam.utils.AE.
		 * @see org.dcm4che.util.DcmURL.
		 */
		DcmURL url = new DcmURL(new AE().toString());

		cfgCDimseService.put("key.PatientID", patientID);

		cfgCDimseService.put("key.StudyInstanceUID", studyInstanceUID);
		

		try {
			cDimseService = new CDimseService(cfgCDimseService, url);
		} catch (ParseException e) {
			log.error("unable to create instance of CDimseService", e);
			return;
		}
		
		
		try {
			isOpen = cDimseService.aASSOCIATE();
			if (!isOpen) {
				return;
			}
		} catch (IOException e) {
			log.error(e.getMessage());
			return;
		} catch (GeneralSecurityException e) {
			log.error(e.getMessage());
			return;
		}

		try {
			datasetVector = cDimseService.cFIND();
			
		} catch (Exception e) {
			log.error(e.getMessage());
			return;
		}
		
		/*
		 * Gets the Dataset from the datasetVector and add it to the seriesList ArrayList<SeriesModel>
		 */
		for (int dataSetCount = 0; dataSetCount < datasetVector.size(); dataSetCount++) {
			try {
				
				dataSet = (Dataset) datasetVector.elementAt(dataSetCount);
				/*
				 * Creates the SeriesModel instance and adds it to the series
				 */				
				series.put(dataSetCount, new SeriesModel(dataSet));
			} catch (Exception e) {
				log.error(e.getMessage());
				e.printStackTrace();
			}
		}
		
		if(dataSet != null){
			patientName = dataSet.getString(Tags.PatientName);
			patientSex = dataSet.getString(Tags.PatientSex);
			patientBirthDate = dataSet.getString(Tags.PatientBirthDate);
			studyDate = dataSet.getString(Tags.StudyDate);
			studyDesc = dataSet.getString(Tags.StudyDescription);
			if((refPhysicianName = dataSet.getString(Tags.ReferringPhysicianName)) != null){
				if(refPhysicianName.indexOf("\"")>0){
				refPhysicianName = refPhysicianName.replace("\"","`~");
				} 
				if(refPhysicianName.indexOf("\'")>0) {
				refPhysicianName = refPhysicianName.replace("\'","~`");
				} 
			} else {
				refPhysicianName = "";
			}
		}

		try {
			cDimseService.aRELEASE(true);
		} catch (IOException e) {
			log.error(e.getMessage());
		} catch (InterruptedException e) {
			log.error(e.getMessage());
		}
	}        
 
	/**
	 * Getter for property patientName.
	 * @return Value of Property patientName.
	 */
	public String getPatientName() {
		return patientName;
	}
	/**
	 * Getter for property patientSex.
	 * @return Value of Property patientSex.
	 */
	public String getPatientSex() {
		return patientSex;
	}
	/**
	 * Getter for property patientBirthDate.
	 * @return Value of Property patientBirthDate.
	 */
	public String getPatientBirthDate() {
		return patientBirthDate;
	}
	/**
	 * Getter for property studyDate.
	 * @return Value of Property studyDate.
	 */
	public String getStudyDate() {
		return studyDate;
	}
	/**
	 * Getter for property studyDesc.
	 * @return Value of Property studyDesc.
	 */
	public String getStudyDesc() {
		return studyDesc;
	}
	/**
	 * Getter for property refPhysicianName.
	 * @return Value of Property refPhysicianName.
	 */
	public String getRefPhysicianName() {
		return refPhysicianName;
	}
	
	/**
	 * It returns the collections of SeriesModel.
	 * @return ArrayList<SeriesModel> instance.
	 */
	public ArrayList<SeriesModel> getSeries(){
		seriesList.addAll(getSortedMap().values());
		return seriesList;		
	}
	
	/**
	 * Sorts the hashMap Key values(SeriesNumber).
	 * @return Sorted order Map.
	 */
	public Map<Integer,SeriesModel> getSortedMap(){		 
		 Map<Integer,SeriesModel> sortedMap = new TreeMap<Integer, SeriesModel>(series);		
		return sortedMap;
	}
	

}
