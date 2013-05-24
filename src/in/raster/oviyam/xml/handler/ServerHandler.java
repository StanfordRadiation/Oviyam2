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

package in.raster.oviyam.xml.handler;

import in.raster.oviyam.xml.model.Configuration;
import in.raster.oviyam.xml.model.Server;
import java.util.List;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;

import org.apache.log4j.Logger;

/**
 *
 * @author asgar
 */
public class ServerHandler {

    // Initialize logger
    private static Logger log = Logger.getLogger(ServerHandler.class);

    private Serializer serializer = null;
    //private File source = null;
    private Configuration config = null;

    //Constructor
    public ServerHandler() {
        try {
            serializer = new Persister();
            //String fname = "oviyam2-config.xml";
            //source = new File(tmpDir + File.separator + fname);
            config = serializer.read(Configuration.class, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Unable to read XML document", ex);
            return;
        }
    }

    public String addNewServer(Server server) {
        String retValue = "success";
        try {
            List<Server> serversList = config.getServersList();
            for(Server serObj : serversList) {
                if(serObj.getLogicalname().equals(server.getLogicalname())) {
                    retValue = "duplicate";
                    return retValue;
                }
            }

            serversList.add(server);
            serializer.write(config, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Unable to add new server", ex);
        }

        return retValue;
    }

    public void deleteExistingServer(Server server) {
        try {
            List<Server> serversList = config.getServersList();
            for (Server serObj : serversList) {
                if ((serObj.getAetitle().equals(server.getAetitle())) && (serObj.getHostname().equals(server.getHostname())) && (serObj.getPort().equals(server.getPort()))) {
                    serversList.remove(serObj);
                    break;
                }
            }            
            serializer.write(config, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Unable to delete existing server", ex);
        }
    }

    public void editExistingServer(Server server) {
        try {
            List<Server> serversList = config.getServersList();
            for (Server serObj : serversList) {
                if (serObj.getLogicalname().equals(server.getLogicalname())) {
                    serObj.setAetitle(server.getAetitle());
                    serObj.setHostname(server.getHostname());
                    serObj.setPort(server.getPort());
                    serObj.setRetrieve(server.getRetrieve());
                    serObj.setWadocontext(server.getWadocontext());
                    serObj.setWadoport(server.getWadoport());
                    break;
                }
            }
            serializer.write(config, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Unable to modify existing server", ex);
        }
    }

    public Server findServerByName(String serverName) {
        Server resultObj = null;

        List<Server> serversList = config.getServersList();

        if(serverName != null && serverName.length() > 0) {
            try {
                for(Server serObj : serversList) {
                    if(serObj.getLogicalname().equals(serverName)) {
                        resultObj = serObj;
                        break;
                    }
                }
            } catch(Exception ex) {
                log.error("Error while finding server by name");
            }
        } else {
            if(serversList.size() == 1) {
                resultObj = (Server) serversList.get(0);
            }
        }

        return resultObj;
    }

}
