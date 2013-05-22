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

package in.raster.oviyam.servlet;

import in.raster.oviyam.PatientInfo;
import in.raster.oviyam.model.StudyModel;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONArray;
import org.json.JSONObject;
import org.apache.log4j.Logger;

/**
 *
 * @author asgar
 */
public class AutoRefreshStudies extends HttpServlet {

    /*
     * Initialize the Logger.
     */
    private static Logger log = Logger.getLogger(DcmImage.class);
   
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /** 
     * Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        HttpSession session = request.getSession();
        List studyList = (ArrayList) session.getAttribute("studyList");

        String queryStr = request.getParameter("query");
        String searchDays = findValueFromQuery(queryStr, "searchDays");
        String searchDates = "";
        String studyTime = "";
        if(searchDays.equals("between")) {
            searchDates = findValueFromQuery(queryStr, "from") + "-" + findValueFromQuery(queryStr, "to");
            studyTime = findValueFromQuery(queryStr, "fromTime") + "-" + findValueFromQuery(queryStr, "toTime");
        }
        String modality = findValueFromQuery(queryStr, "modality");
        String dcmUrl = findValueFromQuery(queryStr, "dcmURL");
        //System.out.println("DICOM URL**************: " + dcmUrl);

        PatientInfo patientInfo = new PatientInfo();
        patientInfo.callFindWithQuery("", "", "", searchDates, studyTime, modality, "","","", dcmUrl);
        List studies = patientInfo.getStudyList();
        studies.removeAll(studyList);

        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObj = null;

        try {
            for(Object obj : studies) {
                StudyModel sm = (StudyModel) obj;
                jsonObj = new JSONObject();
                jsonObj.put("patientID", sm.getPatientID());
                jsonObj.put("patientName", sm.getPatientName());
                jsonObj.put("patientGender", sm.getPatientGender());
                jsonObj.put("patientBirthDate", sm.getPatientBirthDate());
                jsonObj.put("physicianName", sm.getPhysicianName());
                //jsonObj.put("studyTime", sm.getStudyTime());
                jsonObj.put("studyDescription", sm.getStudyDescription());
                jsonObj.put("modalitiesInStudy", sm.getModalitiesInStudy());
                jsonObj.put("studyRelatedInstances", sm.getStudyRelatedInstances());
                jsonObj.put("accessionNumber", sm.getAccessionNumber());
                jsonObj.put("studyInstanceUID", sm.getStudyInstanceUID());
                jsonObj.put("studyRelatedSeries", sm.getStudyRelatedSeries());

                String sDate = sm.getStudyDate();
                if(sDate != null) {
                    SimpleDateFormat sdf;

                    if(sm.getStudyTime() != null && sm.getStudyTime().length() > 0) {
                        sDate = sDate + " " + sm.getStudyTime();
                        sdf = new SimpleDateFormat("yyyyMMdd HHmmss");
                    } else {
                        sdf = new SimpleDateFormat("yyyyMMdd");
                    }

                    Date sDateTmp = sdf.parse(sDate);
                    //sdf = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss a");
                    sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

                    jsonObj.put("studyDate", sdf.format(sDateTmp));
                }
                
                jsonArray.put(jsonObj);
                studyList.add(sm);
            }
        } catch(Exception e) {
            log.error("Exception occured while creating JSON Array...", e);
        }

        session.setAttribute("studyList", studyList);

        PrintWriter out = response.getWriter();
        out.println(jsonArray);
    } 

    /** 
     * Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    private String findValueFromQuery(String qryStr, String param) {
        String result = "";
	param += "=";
	if(qryStr != null && qryStr.length() > 0) {
	   int begin = qryStr.indexOf(param);
	   if(begin != -1) {
		begin += param.length();
		int end = qryStr.indexOf("&", begin);
		if(end == -1) {
		   end = qryStr.length();
		}
		result = qryStr.substring(begin, end);
	   }
	}

	return result;
    }

}
