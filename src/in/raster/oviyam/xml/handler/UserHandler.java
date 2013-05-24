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
import java.util.ArrayList;
import java.util.List;
import org.simpleframework.xml.Serializer;
import org.apache.log4j.Logger;
import org.simpleframework.xml.core.Persister;

/**
 *
 * @author asgar
 */
public class UserHandler {

    //Initialize logger
    private static Logger log = Logger.getLogger(QueryParamHandler.class);

    private Serializer serializer = null;
    //private File source = null;
    Configuration config = null;

    public UserHandler() {
        try {
            serializer = new Persister();
            //String fname = "oviyam2-config.xml";
            //source = new File(tmpDir + File.separator + fname);
                        
            config = serializer.read(Configuration.class, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Error while creating Query Parameter Handler object", ex);
        }
    }

    public void updateUser(User user) {
        try {
            List<User> usersList = config.getUsersList();
            for (User usr : usersList) {
                if (usr.getUserName().equals(user.getUserName())) {
                    usr.setSearchParams(user.getSearchParams());
                    usr.setSessTimeout(user.getSessTimeout());
                    usr.setTheme(user.getTheme());
                    usr.setUserName(user.getUserName());
                    break;
                }
            }
            serializer.write(config, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Error while updating user", ex);
        }

    }

    public void addNewUser(Button btn, String userName) {
        try {
            List<User> usersList = config.getUsersList();
            User newUser = new User();
            newUser.setUserName(userName);
            newUser.setSessTimeout("1800");
            newUser.setTheme("Dark Hive");
            newUser.setViewerSlider("hide");
            SearchParams spTmp = new SearchParams();
            List<Button> newBtnList = new ArrayList<Button>();
            newBtnList.add(btn);
            spTmp.setButtonsList(newBtnList);
            newUser.setSearchParams(spTmp);
            usersList.add(newUser);
            serializer.write(config, LanguageHandler.source);
        } catch (Exception ex) {
            log.error("Exception while creating new user", ex);
        }
    }

    public User findUserByName(String userName) {
        List<User> usersList = config.getUsersList();
        User currUser = null;
        for(User user : usersList) {
            if(user.getUserName().equals(userName)) {
                currUser = user;
                break;
            }
        }

        return currUser;
    }
}
