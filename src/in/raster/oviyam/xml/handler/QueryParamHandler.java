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

import in.raster.oviyam.xml.model.Button;
import in.raster.oviyam.xml.model.Configuration;
import in.raster.oviyam.xml.model.SearchParams;
import in.raster.oviyam.xml.model.User;
import java.util.List;
import org.simpleframework.xml.Serializer;
import org.apache.log4j.Logger;
import org.simpleframework.xml.core.Persister;


/**
 *
 * @author asgar
 */
public class QueryParamHandler {

    //Initialize logger
    private static Logger log = Logger.getLogger(QueryParamHandler.class);

    private Serializer serializer = null;
    //private File source = null;
    Configuration config = null;
    //private String tempDir = null;

    //Constructor
    public QueryParamHandler() {
        try {
            //tempDir = tmpDir;
            serializer = new Persister();
            //String fname = "oviyam2-config.xml";
            //source = new File(tmpDir + File.separator + fname);
            config = serializer.read(Configuration.class, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Error while creating Query Parameter Handler object", ex);
        }
    }

    public void addNewButton(Button btn, String userName) {
        UserHandler uh = new UserHandler();
        User user = uh.findUserByName(userName);

        if(user != null) {
            SearchParams sp = user.getSearchParams();
            List<Button> btnsList = sp.getButtonsList();
            btnsList.add(btn);
            uh.updateUser(user);
        } else {
            uh.addNewUser(btn, userName);
        }
    }

    public void deleteExistingButton(Button btn, String userName) {
        try {
            List<User> usersList = config.getUsersList();
            for (User user : usersList) {
                if (user.getUserName().equals(userName)) {
                    SearchParams sp = user.getSearchParams();
                    List<Button> btnsList = sp.getButtonsList();
                    for(Button btnTmp : btnsList) {
                        if(btnTmp.getLabel().equals(btn.getLabel())) {
                            btnsList.remove(btnTmp);
                            break;
                        }
                    }
                    break;
                }
            }
            serializer.write(config, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Error while deleting existing button", ex);
        }
    }

    public List<Button> getAllButtons(String userName) {
        List<User> usersList = config.getUsersList();
        List<Button> btnsList = null;
        for(User user : usersList) {
            if(user.getUserName().equals(userName)) {
                SearchParams sp = user.getSearchParams();
                btnsList = sp.getButtonsList();
                break;
            }

        }

        return btnsList;
    }

}
