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
* Bharathi B
* Manikandan P
* Prakash J
* Prakasam V
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
package in.raster.oviyam.utils;

import org.apache.log4j.Logger;
import in.raster.oviyam.config.ServerConfiguration;
import in.raster.oviyam.config.ServerXmlConfiguration;
/**
 * 
 * @author bharathi
 * @version 0.7
 *
 */
public class AE {
	/**
	 * Initialize Logger.
	 */
	private static Logger log = Logger.getLogger(AE.class);
	
	// Variables --------------------------------------------------
	private ServerXmlConfiguration sxc;
	
	private ServerConfiguration serverConfiguration;	
	
	
	// Constructor ------------------------------------------------
	/**
	 * Creates new AE
	 */
	public AE(){		
		try{
			/*
			 * ServerXmlConfiguration and ServerConfiguration objects to read the
			 * configured aeTitle, hostName and port from the Oviyam-config.xml file.
			 */
			sxc = new ServerXmlConfiguration();		
			serverConfiguration = sxc.getElementValues();
		}catch(Exception e){
			log.error("Unable to create instance for ServerXmlConfiguration and ServerConfiguration.",e);
			return;
		}
	}
	/**
	 * returns the String that can be passed to the DcmURL(String) as argument.
	 * @see org.dcm4che.util.DcmURL.  
	 */
	@Override
	public String toString(){
		return serverConfiguration.getDcmProtocol().toLowerCase()+"://"+serverConfiguration.getAeTitle()+'@'+serverConfiguration.getHostName()+':'+serverConfiguration.getPort();		
	}
	
	/**
	 * Getter for property serverConfiguration.
	 * @return instance of ServerConfiguration.
	 */	
	public ServerConfiguration getServerConfiguration(){
		return serverConfiguration;
	}
	
	

}
