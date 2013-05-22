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
import de.iftm.dcm4che.services.StorageService;
import in.raster.oviyam.model.SeriesModel;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Vector;
import org.apache.log4j.Logger;
import org.dcm4che.util.DcmURL;
import java.text.ParseException;
import java.util.HashMap;
import org.dcm4che.data.Dataset;

/**
 *
 * @author asgar
 */
public class SeriesInfo {

    // Initialize Looger
    private static Logger log = Logger.getLogger(SeriesInfo.class);

    //private ArrayList<SeriesModel> seriesList;
    private HashMap<Integer, SeriesModel> series;

    //Constructor
    public SeriesInfo() {
        //seriesList = new ArrayList<SeriesModel>();
        series = new HashMap<Integer, SeriesModel>();
    }

    /**
     * Queries (cFIND) the Series information from the machine (dcmProtocol://aeTitle@hostname:port
     * @param patientID
     * @param studyInstanceUID
     */
    public void callFindWithQuery(String patientID, String studyInstanceUID, String dcmURL) {

        ConfigProperties cfgProperties;
        boolean isOpen;
        Vector dsVector;
        CDimseService cDimseService;

        try {
            cfgProperties = new ConfigProperties(StorageService.class.getResource("/resources/Series.cfg"));
        } catch(IOException ioe) {
            log.error("Error while loading configuration properties");
            return;
        }

        DcmURL url = new DcmURL(dcmURL);
        
        cfgProperties.put("key.PatientID", patientID);
        cfgProperties.put("key.StudyInstanceUID", studyInstanceUID);

        try {
            cDimseService = new CDimseService(cfgProperties, url);
        } catch(ParseException pe) {
            log.error("Unable to create instance of CDimseService", pe);
            return;
        }

        // Open association
        try {
            isOpen = cDimseService.aASSOCIATE();
            if(!isOpen) {
                return;
            }
        } catch(IOException ioe) {
            log.error("Error while opening association ", ioe);
            return;
        } catch(GeneralSecurityException gse) {
            log.error("Error while opeing association ", gse);
            return;
        }

        //query result using cFIND
        try {
            dsVector = cDimseService.cFIND();
        } catch(Exception e) {
            log.error("Error while querying... ", e);
            return;
        }

        // Get the Dataset from the dsVector and add it to the seriesList
        for(int i=0; i<dsVector.size(); i++) {
            try {
                Dataset dataSet = (Dataset) dsVector.elementAt(i);
                //Create the SeriesModel instance and adds it to the seriesList
                SeriesModel sm = new SeriesModel(dataSet);
                series.put(i, sm);
            } catch(Exception e) {
                log.error("Error while adding SeriesModel in HashMap series ", e);
                return;
            }
        }

        //close association
        try {
            cDimseService.aRELEASE(true);
        } catch(IOException e) {
            log.error("Error while releasing association ", e);
        } catch(InterruptedException ie) {
            log.error("Error while releasing association ", ie);
        }
    }

    /**
     * It returns the collections of SeriesModel.
     * @returns ArrayList<SeriesModel>
     */
    public ArrayList<SeriesModel> getSeriesList() {
        return new ArrayList<SeriesModel>(series.values());
    }

}
