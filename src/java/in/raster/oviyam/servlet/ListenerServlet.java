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

import in.raster.oviyam.delegate.ReceiveDelegate;
import in.raster.oviyam.xml.model.Listener;
import in.raster.oviyam.util.ReadXMLFile;
import in.raster.oviyam.xml.handler.ListenerHandler;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.UnknownHostException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.apache.log4j.Logger;


/**
 *
 * @author asgar
 */
public class ListenerServlet extends HttpServlet {

    private static Logger log = Logger.getLogger(ListenerServlet.class);

    private static ReceiveDelegate receiveDelegate = new ReceiveDelegate();
   
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

        String action = request.getParameter("action");

        if(action.equalsIgnoreCase("Verify")) {
            checkListenerService();
        } else if(action.equalsIgnoreCase("Update")) {
            String aetitle = request.getParameter("aetitle");
            String port = request.getParameter("port");
            Listener listener = new Listener();
            listener.setAetitle(aetitle);
            listener.setPort(port);
            ListenerHandler lh = new ListenerHandler();
            lh.updateListener(listener);
            receiveDelegate.stop();
            receiveDelegate = new ReceiveDelegate();
            checkListenerService();
            PrintWriter pw = response.getWriter();
            pw.println("success");
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

    private boolean getListenerStatus() {
        boolean success = true;

        ListenerHandler lh = new ListenerHandler();
        Listener listener = lh.getListener();

        try {
            (new ServerSocket(Integer.parseInt(listener.getPort()))).close();
        } catch(UnknownHostException e) {
            success = false;
        } catch(IOException e) {
            success = false;
        }

        return success;
    }

    private void checkListenerService() {
        if(getListenerStatus()) {
            ReadXMLFile rxf = new ReadXMLFile();
            JSONArray jsonArray = rxf.getElementValues("server");
            try {
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject obj = jsonArray.getJSONObject(i);
                                        
                    if(obj.getString("retrieve").equals("C-MOVE")) {
                        receiveDelegate.start();
                        break;
                    }
                }
            } catch(Exception ex) {
                log.error("Unable to start listener ", ex);
            }
        }
    }

    @Override
    public void destroy() {
        receiveDelegate.stop();
    }

}
