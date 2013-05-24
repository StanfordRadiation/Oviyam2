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

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import in.raster.oviyam.util.ReadXMLFile;
import in.raster.oviyam.xml.handler.ListenerHandler;
import in.raster.oviyam.xml.model.Listener;
import org.json.JSONArray;
import org.json.JSONObject;



/**
 *
 * @author asgar
 */
public class DicomNodes extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

//        get login details
/*        try {
            InitialContext ctx = new InitialContext();
            Subject subject = (Subject) ctx.lookup("java:comp/env/security/subject");

            Set<Principal> prinSet = subject.getPrincipals();
            List<Principal> prinList = new ArrayList<Principal>(prinSet);

            Principal p = prinList.get(0);
            System.out.println("User name: " + p.getName());
            
            p = prinList.get(1);
            System.out.println("Roles: " + p.toString());

        } catch(NamingException e) {
            e.printStackTrace();
        } */
        
        try {            
            ReadXMLFile rxf = new ReadXMLFile();            
            JSONArray jsonArray = rxf.getElementValues("server");
            //out.println(jsonArray.toString());
            
            //File tempDir = (File) getServletContext().getAttribute("javax.servlet.context.tempdir");
            ListenerHandler lh = new ListenerHandler();
            Listener listener = lh.getListener();
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("callingAET", listener.getAetitle());
            jsonObj.put("listenerPort", listener.getPort());
            jsonArray.put(jsonObj);
            out.println(jsonArray.toString());
        } catch(Exception e) {
            e.printStackTrace();
        } 
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

}
