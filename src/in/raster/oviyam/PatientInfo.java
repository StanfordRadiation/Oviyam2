
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

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Vector;
import java.lang.String;

import org.apache.log4j.Logger;
import org.dcm4che.data.Dataset;
import org.dcm4che.dict.Tags;
import org.dcm4che.util.DcmURL;

import de.iftm.dcm4che.services.CDimseService;
import de.iftm.dcm4che.services.ConfigProperties;
import de.iftm.dcm4che.services.StorageService;

import in.raster.oviyam.model.PatientModel;
import in.raster.oviyam.utils.AE;

/**
 * Queries(cFIND) the Patient/Study informations from the machine(dcmProtocol://aeTitle@hostName:port).
 * 
 * @author bharathi
 * @version 0.7
 * 
 * 
 */
public class PatientInfo {
	/*
	 * Initialize logger
	 */
	private static Logger log = Logger.getLogger(PatientInfo.class);

	private int numberofStudies;

	/*
	 * ArrayList instance to keep the PatientModel.
	 */
	public static ArrayList<PatientModel> patientList = new ArrayList<PatientModel>();

	// Constructor -------------------------------------------------------------------
	/**
     * Creates new PatientInfo
     */
	public PatientInfo() {
		patientList.clear();
	}

	/**
	 * Queries(cFIND) the Patient/Study informations from the machine(dcmProtocol://aeTitle@hostName:port).
	 * 	
	 * @param searchPatientID
	 * @param SearchPatientName
	 * @param searchDob
	 * @param searchtoday
	 * @param searchsterday
	 * @param searchModality
	 */
	@SuppressWarnings("unchecked")
	public void callFindWithQuery( String searchPatientID,
			String SearchPatientName, String searchDob, String searchtoday,
			String searchsterday, String searchModality, String accessionNumber) {

		ConfigProperties cfgCDimseService;
		boolean isOpen;
		// Vector object to keep the queried Datasets.
		Vector datasetVector;
		CDimseService cDimseService;
		
		// Load configuration properties of the server
		try {
			cfgCDimseService = new ConfigProperties(StorageService.class
					.getResource("/resources/CDimseService.cfg"));
		} catch (IOException e) {
			log.error("Unable to create ConfigProperties instance", e);
			return;
		}
		/*
		 * new AE().toString() returns the string ('dcmProtocol://aeTitle@hostName:port')
		 * @see in.raster.oviyam.utils.AE.
		 * @see org.dcm4che.util.DcmURL.
		 */
		DcmURL url = new DcmURL(new AE().toString());
		/*
		 * Setting filter values for query such as patientId, patientName etc.
		 */
		try {

			cfgCDimseService.put("key.PatientID", searchPatientID);

			cfgCDimseService.put("key.PatientName", SearchPatientName + "*");

			if ((searchtoday.length() > 0))
				cfgCDimseService.put("key.StudyDate", searchtoday);

			if ((searchDob.length() > 0)) {
				cfgCDimseService.put("key.PatientBirthDate", searchDob);
			}
			
			if((accessionNumber.length() > 0))
				cfgCDimseService.put("key.AccessionNumber",accessionNumber);
			
			searchModality = searchModality.toUpperCase();

			if (searchModality.equalsIgnoreCase("ALL")) {
				// cfgCDimseService.put("key.ModalitiesInStudy", "*");
			} else {
				cfgCDimseService.put("key.ModalitiesInStudy", searchModality);
			}
		} catch (Exception e) {
			log.error("Unable to set Key values for query", e);
		}

		try {
			cDimseService = new CDimseService(cfgCDimseService, url);

		} catch (ParseException e) {
			log.error("Unable to create CDimseService instance", e);
			return;

		}

		// Open association
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
		// cFIND (Queries for datasets).
		try {
			datasetVector = cDimseService.cFIND();

		} catch (Exception e) {
			log.error(e.getMessage());
			return;
		}

		numberofStudies = datasetVector.size();
		String currentID = null;
		/*
		 * Gets the Dataset form the datasetVector and adds it to the 
		 * patientList and adds the studies to the corresponding patientList.
		 */
		for (int dataSetCount = 0; dataSetCount < datasetVector.size(); dataSetCount++) {
			try {
				Dataset dataSet = (Dataset) datasetVector.elementAt(dataSetCount);
				String patientID = dataSet.getString(Tags.PatientID);
				/*
				 * Creates the new instance of PatientModel with Dataset.
				 * if the current patientid is equals to the previous patientid then the current 
				 * dataset will be added to the patientModel's studyList(ArrayList<StudyModel>). 
				 * Otherwise, the patientModel object will be added to the patientList(ArrayList<PatientModel>)
				 */
				PatientModel patientModel = new PatientModel(dataSet);
				if (patientID.equals(currentID)) {
					currentID = patientID;
					patientList.get(patientList.size() - 1).addStudy(dataSet);
				} else {
					currentID = patientID;
					patientList.add(patientModel);
					patientModel.addStudy(dataSet);
				}
			} catch (Exception e) {
				log.error(e.getMessage());
				e.printStackTrace();
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
	 * Getter for property numberOfStudies.
	 * @return Value of the numberOfStudies property.
	 */
	public int getNumberOfStudies() {
		return numberofStudies;
	}
	
	/**
	 * Getter for patientList.
	 * @return The ArrayList<PatientModel> object that contains the PatientModels.
	 * @see in.raster.oviyam.model.PatientModel.
	 */
	public ArrayList<PatientModel> getPatients() {
		return patientList;
	}

}
