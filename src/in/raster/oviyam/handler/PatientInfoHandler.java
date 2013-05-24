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

package in.raster.oviyam.handler;

import in.raster.oviyam.PatientInfo;
import in.raster.oviyam.model.StudyModel;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.SimpleTagSupport;
import org.apache.log4j.Logger;

/**
 *
 * @author asgar
 */
public class PatientInfoHandler extends SimpleTagSupport {
    private static Logger log = Logger.getLogger(PatientInfoHandler.class);
    
    //Attribute values for the tag
    private String patientId = "";
    private String patientName = "";
    private String birthDate = "";
    private String modality = "";
    private String from = "";
    private String to = "";
    private String searchDays;
    private String accessionNumber = "";
    private String dcmURL = "";
    private String fromTime = "";
    private String toTime = "";
    private String referPhysician = "";
    private String studyDescription = "";
    
    PatientInfo patientInfo;

    /**
     * Setter for property patientId.
     * @param patientId The String object registers the patientId.
     */
     public void setPatientId(String patientId) {
         if(patientId == null) {
             this.patientId = "";
         } else {
             this.patientId = patientId;
         }
     }

     /**
      * Setter for proerty patientName.
      * @param patientName The String object registers the patientName.
      */
     public void setPatientName(String patientName) {
         if(patientName == null) {
             this.patientName = "";
         } else {
             this.patientName = patientName;
         }
     }

     /**
      * Setter for property birthDate.
      * @param birthDate The String object registers the birthDate.
      */
     public void setBirthDate(String birthDate) {
         if(birthDate == null) {
             this.birthDate = "";
         } else {
             this.birthDate = birthDate;
         }
     }

     /**
      * Setter for property modality.
      * @param modality The String object registers the modality.
      */
     public void setModality(String modality) {
         if(modality == null) {
             this.modality = "";
         } else {
             this.modality = modality;
         }
     }

     /**
      * Setter for property from
      * @param from The String object registers the from.
      */
     public void setFrom(String from) {
         if(from == null) {
             this.from = "";
         } else {
             this.from = from;
         }
     }

     /**
      * Setter for property to.
      * @param to The String object registers the to.
      */
     public void setTo(String to) {
         if(to == null) {
             this.to = "";
         } else {
             this.to = to;
         }
     }

     /**
      * Setter for property searchDays.
      * @param searchDays The String object registers the searchDays.
      */
     public void setSearchDays(String searchDays) {
         if(searchDays == null) {
             this.searchDays = "";
         } else {
             this.searchDays = searchDays;
         }
     }

     /**
      * Setter for property accessionNumber.
      * @param accessionNumber The String object registers the accessionNumber.
      */
     public void setAccessionNumber(String accessionNumber) {
         if(accessionNumber == null) {
             this.accessionNumber = "";
         } else {
             this.accessionNumber = accessionNumber;
         }
     }

     /**
      * Setter for property dcmURL.
      * @param dcmURL The String object registers the dcmURL.
      */
     public void setDcmURL(String dcmURL) {
         if(dcmURL == null) {
             this.dcmURL = "";
         } else {
             this.dcmURL = dcmURL;
         }
     }

     /**
      * Setter for property fromTime.
      * @param fromTime The String object registers the fromTime.
      */
     public void setFromTime(String fromTime) {
         if(fromTime == null) {
             this.fromTime = "";
         } else {
             this.fromTime = fromTime;
         }
     }

     /**
      * Setter for property toTime
      * @param toTime The String object registers the toTime
      */
     public void setToTime(String toTime) {
         if(toTime == null) {
             this.toTime = "";
         } else {
             this.toTime = toTime;
         }
     }

     /**
      * Setter for property referPhysician
      * @param referPhysician The String object registers the referPhysician
      */
     public void setReferPhysician(String referPhysician) {
         if(referPhysician == null) {
            this.referPhysician = "";
         } else {
            this.referPhysician = referPhysician;
         }
     }

     /**
      * Setter for property studyDescription
      * @param studyDescription The String object registers the studyDescription
      */
     public void setStudyDescription(String studyDescription) {
         if(studyDescription == null) {
            this.studyDescription = "";
         } else {
            this.studyDescription = studyDescription;
         }
     }

     /**
      * Overridden Tag handler method. Default processing of the tag.
      * This method will send the Patient information to generate a Html page during its execution.
      *
      * @see javax.servlet.jsp.tagext.SimpleTagSupport#doTag()
      */
     @Override
     public void doTag() throws JspException, IOException {

         try {
             /*
              * in.raster.oviyam5.PatientInfo class used to query (cFIND) the study details from
              * the configured server.
              */
             patientInfo = new PatientInfo();
         } catch(Exception e) {
             log.error("Unable to create instance of PatientInfo.", e);
             return;
         }

         try {

             String searchDates = from + "-" + to;

             if(searchDates.trim().equals("-")) {
                 searchDates = "";
             }

             String studyTime = fromTime + "-" + toTime;

             if(studyTime.trim().equals("-")) {
                 studyTime = "";
             }

             patientInfo.callFindWithQuery(patientId, patientName, birthDate, searchDates, studyTime, modality, accessionNumber, referPhysician, studyDescription, dcmURL);
         } catch(Exception e) {
             log.error("Error while accessing callFindWithQuery method of PatientInfo.", e);
             e.printStackTrace();
             return;
         }

         /*
          * Writes the study information to the response.
          */
         try {
             // ArrayList contains the StudyModels.
             ArrayList<StudyModel> studyList = patientInfo.getStudyList();
             getJspContext().setAttribute("studyList", studyList, PageContext.SESSION_SCOPE);

             //String[] studyIUIDs = new String[studyList.size()];

             for(int studyCount=0; studyCount < studyList.size(); studyCount++) {

                 StudyModel study = studyList.get(studyCount);

                 /*
                  * Tag handler sets the attribute values such as patientId, patientName, modality etc.
                  * Example: User can access it from the JSP using the Expression Language of JSP such as
                  *     ${patientId}
                  *     ${patientName}
                  *     ${birthDate}
                  */
                 getJspContext().setAttribute("patientId", study.getPatientID());
                 getJspContext().setAttribute("patientName", study.getPatientName());
                 getJspContext().setAttribute("birthDate", study.getPatientBirthDate());
                 getJspContext().setAttribute("accessionNumber", study.getAccessionNumber());
                 getJspContext().setAttribute("studyDescription", study.getStudyDescription());
                 getJspContext().setAttribute("modality", study.getModalitiesInStudy());
                 getJspContext().setAttribute("totalInstances", study.getStudyRelatedInstances());
                 getJspContext().setAttribute("studyIUID", study.getStudyInstanceUID());
                 getJspContext().setAttribute("totalSeries", study.getStudyRelatedSeries());
                 getJspContext().setAttribute("referPhysician", study.getPhysicianName());
                 getJspContext().setAttribute("patientGender", study.getPatientGender());

                 String sDate = study.getStudyDate();
                 if(sDate != null) {
                    SimpleDateFormat sdf;

                    //if(!study.getStudyTime().equals("")) {
                    if(study.getStudyTime() != null && study.getStudyTime().length() > 0) {
                        sDate = sDate + " " + study.getStudyTime();
                        sdf = new SimpleDateFormat("yyyyMMdd HHmmss");
                    } else {
                        sdf = new SimpleDateFormat("yyyyMMdd");
                    }

                    Date sDateTmp = null;
                    try {
                        sDateTmp = sdf.parse(sDate);
                    } catch(ParseException pe) {
                        getJspContext().setAttribute("studyDate", sDate);
                        getJspBody().invoke(null);
                        continue;
                    }
                    //sdf = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss a");
                    sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

                    getJspContext().setAttribute("studyDate", sdf.format(sDateTmp));
                 }

                 //studyIUIDs[studyCount] = study.getStudyInstanceUID();

                 /*
                  * Process the body of the tag and print it to the response. The null argument
                  * means the output goes to the response rather than some other writer.
                  */
                 getJspBody().invoke(null);
             }

             //getJspContext().setAttribute("studyIUIDs", studyIUIDs, PageContext.SESSION_SCOPE);

         } catch(Exception e) {
             log.error(e.getMessage(), e);
             e.printStackTrace();
         }
     }

}
