
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
package in.raster.oviyam;

import in.raster.oviyam.model.InstanceModel;
import in.raster.oviyam.utils.AE;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.Vector;

import de.iftm.dcm4che.services.CDimseService;
import de.iftm.dcm4che.services.ConfigProperties;
import de.iftm.dcm4che.services.StorageService;

import org.apache.log4j.Logger;
import org.dcm4che.data.Dataset;
import org.dcm4che.dict.Tags;
import org.dcm4che.util.DcmURL;

/**
 * Queries(cFIND) the Instance informations from the machine(dcmProtocol://aeTitle@hostName:port).
 * @author bharathi
 * @version 0.7
 *
 */
public class ImageInfo {
	/*
	 * Initialize Logger.
	 */
	private static Logger log = Logger.getLogger(ImageInfo.class);
	
	
	// ArrayList object to keep the InstanceModels.
	private ArrayList<InstanceModel> instances;
	
	
	// Variables for direct query with seriesUID-------------------------------------------------------------------
	private String patientName;
	
	private String patientSex;
	
	private String patientBirthDate;
	
	private String studyDate;
	
	private String studyDesc;
	
	private String refPhysicianName;
	
	private String modality;
	
	private HashMap<Integer, InstanceModel> instance = new HashMap<Integer, InstanceModel>();
	
	private Dataset dataSet;
	
	//Constructor ---------------------------------------------------------------
	/**
	 * Creates the new ImageInfo and Initializes the ArrayList<InstanceModel> 
	 * to keep the InstanceModels.
	 */
	public ImageInfo() {
		instances = new ArrayList<InstanceModel>();
	}
	/**
	 * Queries(cFIND) the Instance informations from the machine(dcmProtocol://aeTitle@hostName:port).
	 * 
	 * @param patientID
	 * @param studyInstanceUID
	 * @param seriesInstanceUID
	 */
	@SuppressWarnings("unchecked")
	public void callFindWithQuery(String patientID, String studyInstanceUID, String seriesInstanceUID) {
		ConfigProperties cfgCDimseService;
		boolean isOpen;
		Vector datasetVector;
		CDimseService cDimseService;		

		try {
			cfgCDimseService = new ConfigProperties(StorageService.class
					.getResource("/resources/Image.cfg"));

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
		/*
		 * Setting filter values for query.
		 */
		cfgCDimseService.put("key.PatientID", patientID);
		cfgCDimseService.put("key.StudyInstanceUID", studyInstanceUID);
		cfgCDimseService.put("key.SeriesInstanceUID", seriesInstanceUID);

		try {
			cDimseService = new CDimseService(cfgCDimseService, url);
		} catch (ParseException e) {
			log.error("Unable to create ConfigProperties instance", e);
			return;
		}
		//Open Associate.
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
		
		//Query.
		try {
			datasetVector = cDimseService.cFIND();

		} catch (Exception e) {
			log.error(e.getMessage());
			return;
		}
	//	System.out.println("The data set count is "+datasetVector.size());
		/*
		 * Gets the Dataset from the datasetVector and add it to the instances ArrayList<InstanceModel>
		 */
		for (int dataSetCount = 0; dataSetCount < datasetVector.size(); dataSetCount++) {
			try {
				 dataSet = (Dataset) datasetVector.elementAt(dataSetCount);
				/*
				 * Creates the InstanceModel and adds it to the instance.
				 */				
				
				if(instance.containsKey(Integer.parseInt(dataSet.getString(Tags.InstanceNumber)))){
					instance.put(dataSetCount+1, new InstanceModel(dataSet));
				}else{
					instance.put(Integer.parseInt(dataSet.getString(Tags.InstanceNumber)), new InstanceModel(dataSet));
				}
				

			} catch (Exception e) {
				log.error("Unable to get the Dataset from the datasetVector and \n add it to the instaces ArrayList<InstanceModel>",e);
				e.printStackTrace();
			}
		}
			if(dataSet != null){
				patientName = dataSet.getString(Tags.PatientName);
				patientSex = dataSet.getString(Tags.PatientSex);
				patientBirthDate = dataSet.getString(Tags.PatientBirthDate);
				studyDate = dataSet.getString(Tags.StudyDate);
				studyDesc = dataSet.getString(Tags.StudyDescription);
				modality = dataSet.getString(Tags.Modality);
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
	 * Getter for property modality.
	 * @return Value of Property modality.
	 */
	public String getModality() {
		return modality;
	}
	
	/**
	 * Getter for instances ArrayList<InstanceModel>.
	 * @return the instance of ArrayList<InstanceModel>.
	 */
	public ArrayList<InstanceModel> getInstances() {		
		instances.addAll(getSortedMap().values());
		return instances;
	}
	
	
	
	public Map<Integer,InstanceModel> getSortedMap(){
		Map<Integer,InstanceModel> sortedMap = new TreeMap<Integer, InstanceModel>(instance);
		System.out.println("The data set count after sorting is "+sortedMap.size());
		return sortedMap;
	}



}
