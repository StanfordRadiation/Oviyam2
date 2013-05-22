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

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.ParseException;

import org.apache.log4j.Logger;
import org.dcm4che.util.DcmURL;

import de.iftm.dcm4che.services.CDimseService;
import de.iftm.dcm4che.services.ConfigProperties;


/**
 *
 * @author  BabuHussain
 * @version 0.5
 *
 */
public class EchoService {

	/*
	 * Initialize Logger.
	 */
	private static Logger log = Logger.getLogger(EchoService.class);

	// String object to represent whether the echo is success or failed.
	private String status;

	private long delay;

	// Constructors -----------------------------------------------------
	public EchoService() {
             //String[] s = ApplicationContext.databaseRef.getListenerDetails();
             //CDimseService.DEFAULT_CALLING_AET=s[0];
            status = "";
	}
	/**
	 * Used to find whether the configured server is available(running) or not.
	 *
	 */
	public void checkEcho(DcmURL url) {
		ConfigProperties cfgCDimseService;
		CDimseService cDimseService;
		boolean isOpen;
		status = "Echo failed";


		// Load configuration properties of the server
		try {
			cfgCDimseService = new ConfigProperties(CDimseService.class.getResource("/resources/EchoService.cfg"));

		} catch (IOException e) {
			log.error("Error while loading configuration properties");
			return;
		}

		/*
		 * new AE().toString() returns the string ('dcmProtocol://aeTitle@hostName:port')
		 * @see org.dcm4che.util.DcmURL.
		 */


		try {
			cDimseService = new CDimseService(cfgCDimseService, url);
		} catch (ParseException e) {
			log.error("Unable to create CDimseService instance", e);
			return;
		}

		// Open association
		try {
			isOpen = cDimseService.aASSOCIATE();
			if (!isOpen) {
				return;
			}
		} catch (IOException e) {
			log.error(e.getMessage());
			status = "Echo failed";

			return;
		} catch (GeneralSecurityException e) {
			log.error(e.getMessage());
			return;
		}

		// Echo
		try {
			delay = cDimseService.cECHO();

			status = "EchoSuccess";
		//	log.info("C-ECHO delay: " + String.valueOf(delay));
		} catch (Exception e) {
			log.error(e.getMessage());
			return;
		}

		// Release association
		try {
			cDimseService.aRELEASE(true);
		} catch (IOException e) {
			log.error(e.getMessage());
		} catch (InterruptedException e) {
			log.error(e.getMessage());
		}

		log.info(">>>>>>>>>> C-ECHO finished. <<<<<<<<<<");

	}

	/**
	 * Getter for property status.
	 * @return the status represents whether the echo is success or failed.
	 */
	public String getStatus() {
		return status;
	}

	public long getDelay(){
		return delay;
	}
}