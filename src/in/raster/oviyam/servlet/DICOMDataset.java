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
* Meer Asgar Hussain B
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
package in.raster.oviyam.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
/**
 * Sends the DICOM dataset to the user.
 * @author bharathi
 * @version 0.7
 *
 */
public class DICOMDataset extends HttpServlet{
	
	/**
	 * Initialize the logger.
	 */
	private static Logger log = Logger.getLogger(DICOMDataset.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException{
		// Reads the parameters from the request.
		String dataSetURL = request.getParameter("datasetURL");	
		String contentType = request.getParameter("contentType");
		String studyUID = request.getParameter("studyUID");
		String seriesUID = request.getParameter("seriesUID");
		String objectUID = request.getParameter("objectUID");
		// Generates the URL for the requested DICOM Dataset page.
		dataSetURL += "&contentType="+contentType+"&studyUID="+studyUID+"&seriesUID="+seriesUID+"&objectUID="+objectUID;
		dataSetURL = dataSetURL.replace("+", "%2B");
		
		InputStream resultInStream = null;
		//Gets the response's outputStream instance to write a html page in the response.
		OutputStream resultOutStream = response.getOutputStream();
	
		try{
			//Initialize the URL for the requested page.
			URL url = new URL(dataSetURL);
			//opens the inputStream of the URL.
			resultInStream = url.openStream();
			//Initialize the byte array object to read and hold the bytes form the URL stream.
			byte[] buffer = new byte[4096];
			int bytes_read;
			//writes the bytes into the response's output stream.
			while((bytes_read=resultInStream.read(buffer)) != -1){
				resultOutStream.write(buffer, 0, bytes_read);
			}
			//Closing all the input and output streams.
			resultOutStream.flush();
			resultOutStream.close();
			resultInStream.close();
		} catch (Exception e) {
			log.error("Unable to read and send the DICOM dataset page",e);			
		}
	}

}
