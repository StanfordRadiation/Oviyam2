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

package in.raster.oviyam.delegate;

import in.raster.oviyam.util.core.DcmRcv;
import in.raster.oviyam.util.core.MoveScu;
import in.raster.oviyam.xml.handler.LanguageHandler;
import in.raster.oviyam.xml.handler.ListenerHandler;
import in.raster.oviyam.xml.model.Listener;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author  BabuHussain
 * @version 0.5
 *
 */
public class ReceiveDelegate {

    private DcmRcv dcmrcv = null;

    public ReceiveDelegate() {
        try {
            //InetAddress thisIp = InetAddress.getLocalHost();
            ListenerHandler lh = new ListenerHandler();
            Listener listener = lh.getListener();
            dcmrcv = new DcmRcv();
            dcmrcv.setAEtitle(listener.getAetitle());
            dcmrcv.setHostname("0.0.0.0");
            dcmrcv.setPort(Integer.parseInt(listener.getPort()));
            //dcmrcv.setDestination(ServerConfigLocator.locate().getServerHomeDir() + File.separator + "data");
            String dest = LanguageHandler.source.getAbsolutePath();
            dcmrcv.setDestination(dest.substring(0, dest.indexOf("oviyam2-config.xml")-1));
            dcmrcv.setPackPDV(false);
            dcmrcv.setTcpNoDelay(false);
            dcmrcv.initTransferCapability();
            dcmrcv.setTlsNeedClientAuth(false);
            MoveScu.maskNull(listener.getAetitle());
        } catch (Exception ex) {
            Logger.getLogger(ReceiveDelegate.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void start() throws Exception {
        dcmrcv.start();
    }

    public void stop() {
        if (dcmrcv != null) {
            dcmrcv.stop();
            dcmrcv = null;
        }
    }

}