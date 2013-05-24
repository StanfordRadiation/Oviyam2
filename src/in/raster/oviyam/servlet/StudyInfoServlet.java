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
import in.raster.oviyam.xml.handler.ListenerHandler;
import in.raster.oviyam.xml.handler.ServerHandler;
import in.raster.oviyam.xml.model.Server;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.json.JSONObject;
import org.apache.log4j.Logger;

/**
 *
 * @author asgar
 */
public class StudyInfoServlet extends HttpServlet {

    //Initialize the Logger.
    private static Logger log = Logger.getLogger(SeriesServlet.class);
      

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /** 
     * Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        String patID = request.getParameter("patientID");
        String studyUID = request.getParameter("studyUID");
        String serverName = request.getParameter("serverName");

        //File tempDir = (File) getServletContext().getAttribute("javax.servlet.context.tempdir");
        ServerHandler sh = new ServerHandler();
        Server server = null;
        if(serverName != null && !serverName.isEmpty()) {
            server = sh.findServerByName(serverName);
        } else {
            server = sh.findServerByName("");
        }

        PrintWriter out = response.getWriter();
        JSONObject jsonObj = new JSONObject();

        if(server != null) {
            //Get calling aet
            ListenerHandler lh = new ListenerHandler();
            String callingAET = lh.getListener().getAetitle();
            if( !(callingAET != null && callingAET.length() > 0) ) {
                callingAET = "OVIYAM2";
            }
            String dcmURL = "DICOM://" + server.getAetitle() + ":" + callingAET + "@" + server.getHostname() + ":" + server.getPort();
            String serverURL = null;

            if(server.getRetrieve().equals("WADO")) {
                serverURL = "http://" + server.getHostname() + ":" + server.getWadoport() + "/" + server.getWadocontext();
            } else {
                serverURL = server.getRetrieve();
            }
            
            PatientInfo patientInfo = new PatientInfo();
            patientInfo.callFindWithQuery(patID, "", "", "", "", "", "","","", dcmURL);
            ArrayList<StudyModel> studyList = patientInfo.getStudyList();
            
            try {
                for(StudyModel sm : studyList) {
                    if(sm.getStudyInstanceUID().equals(studyUID)) {
                        jsonObj.put("pat_ID", patID);
                        jsonObj.put("pat_Name", sm.getPatientName());
                        jsonObj.put("pat_Birthdate", sm.getPatientBirthDate());
                        jsonObj.put("accNumber", sm.getAccessionNumber());
                        jsonObj.put("studyDate", sm.getStudyDate());
                        jsonObj.put("studyDesc", sm.getStudyDescription());
                        jsonObj.put("modality", sm.getModalitiesInStudy());
                        jsonObj.put("totalIns", sm.getStudyRelatedInstances());
                        jsonObj.put("studyUID", studyUID);
                        jsonObj.put("refPhysician", sm.getPhysicianName());
                        jsonObj.put("totalSeries", sm.getStudyRelatedSeries());
                        jsonObj.put("pat_gender", sm.getPatientGender());
                        jsonObj.put("serverURL", serverURL);
                        jsonObj.put("dicomURL", dcmURL);
                        jsonObj.put("bgColor", "rgb(0, 0, 0)");
                        break;
                    }
                }
            } catch(Exception e) {
                log.error(e);
            }
        } else {
            try {
                jsonObj.put("error", "Server not found");
            } catch (JSONException ex) {
                log.error(ex);
            }
        }

        out.print(jsonObj);
    } 

    /** 
     * Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        doGet(request, response);
    }
 
}
