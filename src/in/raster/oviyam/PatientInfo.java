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
* Meer Asgar Hussain B
* Prakash J
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

import de.iftm.dcm4che.services.CDimseService;
import de.iftm.dcm4che.services.ConfigProperties;
import de.iftm.dcm4che.services.GenericDicomURL;
import in.raster.oviyam.model.StudyModel;
import in.raster.oviyam.util.IDataSet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Vector;
import org.apache.log4j.Logger;
import java.text.ParseException;

/**
 *
 * @author asgar
 */
public class PatientInfo {

    //Initialize logger
    private static Logger log = Logger.getLogger(PatientInfo.class);

    public ArrayList<StudyModel> studyList = new ArrayList<StudyModel>();

    //Constructor
    public PatientInfo() {
        studyList.clear();
    }

    /**
     * Queries (cFIND) the Patient/Study information from the machine (dcmProtocol://aeTitle@hostname:port);
     *
     * @param searchPatientID
     * @param searchPatientName
     * @param searchDob
     * @param searchDate
     * @param searchModality
     * @param accessionNumber
     *
     */
    public void callFindWithQuery(String searchPatientID, String searchPatientName, String searchDob, String searchDate, String studyTime, String searchModality, String accessionNumber, String referPhysician, String studyDesc, String dcmURL) {

        ConfigProperties cfgProperties;
        boolean isOpen;
        Vector<IDataSet> dsVector;
        CDimseService cDimseService;

        //Load configuration properties of the server
        try {
            cfgProperties = new ConfigProperties(PatientInfo.class.getResource("/resources/CDimseService.cfg"));
        } catch(IOException ioe) {
            log.error("Unable to create ConfigProperties instance ", ioe);
            return;
        }

        GenericDicomURL url = new GenericDicomURL(dcmURL);
        /**
         * Setting filter values for query such as patientId, patientName, etc.
         */
        try {
            cfgProperties.put("key.PatientID", searchPatientID);

            cfgProperties.put("key.PatientName", searchPatientName + "*");

            if(searchDate.length() > 0) {
                cfgProperties.put("key.StudyDate", searchDate);
            }

            if(studyTime.length() > 0) {
                cfgProperties.put("key.StudyTime", studyTime);
            }

            if(searchDob.length() > 0) {
                cfgProperties.put("key.PatientBirthDate", searchDob);
            }

            if(accessionNumber.length() > 0) {
                cfgProperties.put("key.AccessionNumber", accessionNumber);
            }

            if(referPhysician.length() > 0) {
                cfgProperties.put("key.ReferringPhysicianName", referPhysician);
            }

            if(studyDesc.length() > 0) {
                cfgProperties.put("key.StudyDescription", studyDesc);
            }

            searchModality = searchModality.toUpperCase();
            if(!searchModality.equalsIgnoreCase("ALL")) {
                cfgProperties.put("key.ModalitiesInStudy", searchModality);
            }
        } catch(Exception e) {
            log.error("Unable to set key values for query ", e);
            return;
        }

        //create CDimseService instance
        try {
            cDimseService = new CDimseService(cfgProperties, url);
        } catch(ParseException pe) {
            log.error("Unable to create CDimseService instance ", pe);
            return;
        }


        //cFind (Queries for datasets)
        try {
            dsVector = cDimseService.cFIND();
        } catch(Exception e) {
            log.error("Error while calling cFIND() ", e);
            return;
        }

        /**
         * Get the Dataset from the dsVector and add it to the studyList
         */
        for(int dsCount=0; dsCount<dsVector.size(); dsCount++) {
            try {
                //Creates the new instance of StudyModel with Dataset.
                StudyModel studyModel = new StudyModel(dsVector.elementAt(dsCount));
                studyList.add(studyModel);
            } catch(Exception e) {
                log.error("Error while adding Dataset in studyList ", e);
            }
        }

    }

    /**
     * Getter for property studyList.
     * @return ArrayList The ArrayList<StudyModel> object that contains the StudyModels.
     * @see in.raster.oviyam5.model.StudyModel.
     */
    public ArrayList<StudyModel> getStudyList() {
        return studyList;
    }
}
