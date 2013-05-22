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

import in.raster.oviyam.xml.handler.QueryParamHandler;
import in.raster.oviyam.xml.model.Button;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.naming.InitialContext;
import javax.security.auth.Subject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;

/**
 *
 * @author asgar
 */
public class QueryParams extends HttpServlet {

    private static Logger log = Logger.getLogger(QueryParams.class);
   
    /** 
     * Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //Reads the request parameters
        String btnLabel = request.getParameter("buttonLabel");
        String dateCrit = request.getParameter("dateCriteria");
        String timeCrit = request.getParameter("timeCriteria");
        String modality = request.getParameter("modality");
        String autoRefresh = request.getParameter("autoRefresh");
        String toDo = request.getParameter("todo");
        
        try {

            //Get user details
            InitialContext ctx = new InitialContext();
            Subject subject = (Subject) ctx.lookup("java:comp/env/security/subject");
            
            List<Principal> prinList = new ArrayList<Principal>(subject.getPrincipals());

            Principal p = prinList.get(0);
            String userName = p.getName();

            Button btn = new Button();
            btn.setLabel(btnLabel);
            btn.setDateCrit(dateCrit);
            btn.setTimeCrit(timeCrit);
            btn.setModality(modality);
            btn.setAutoRefresh(autoRefresh);
            
            //File tempDir = (File) getServletContext().getAttribute("javax.servlet.context.tempdir");
            QueryParamHandler qph = new QueryParamHandler();

            if(toDo.equalsIgnoreCase("ADD")) {
                qph.addNewButton(btn, userName);
            } else if(toDo.equalsIgnoreCase("DELETE")) {
                qph.deleteExistingButton(btn, userName);
            }
        } catch(Exception e) {
            log.error("Error occured while processing query param configurations", e);
        }
        
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

}
