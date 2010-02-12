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
import java.net.URL;
import java.io.DataInputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
/**
 * Reads the Window Level and Window Width.
 * @author asgar
 * @version 0.7
 *
 */
public class DcmWindowLevel extends HttpServlet{
	
	/**
	 * Initialize the logger.
	 */
	private static Logger log = Logger.getLogger(DcmWindowLevel.class);
	
	private static final String WINDOW_CENTER_PARAM = "windowCenter";
	
	private static final String WINDOW_WIDTH_PARAM = "windowWidth";
	
	int[] dicomData = new int[10*1024];
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException{

		// Reads the parameters from the request.
		
		response.setContentType("text/html");
		PrintWriter out=response.getWriter();
		
		int i;
		
		String dicomURL = request.getParameter("datasetURL");	
		String contentType = request.getParameter("contentType");
		String studyUID = request.getParameter("studyUID");
		String seriesUID = request.getParameter("seriesUID");
		String objectUID = request.getParameter("objectUID");
		
		// Generates the URL for the requested DICOM Dataset page.
		dicomURL += "&contentType="+contentType+"&studyUID="+studyUID+"&seriesUID="+seriesUID+"&objectUID="+objectUID+"&transferSyntax=1.2.840.10008.1.2.1";
		dicomURL = dicomURL.replace("+", "%2B");  

		InputStream is = null;
		DataInputStream dis = null;
				
		try{
			//Initialize the URL for the requested page.
			URL url = new URL(dicomURL);
			//opens the inputStream of the URL.
			is = url.openStream();
			dis = new DataInputStream(is);
			
			//Read data from stream and hold it in an array.
			
			for(i=0; i<dicomData.length; i++)
		        dicomData[i] = dis.readUnsignedByte();
			
			String windowCenter = getElementValue("00281050");
			String windowWidth = getElementValue("00281051");
			
			// set the window center and window width attributes
			
			getServletContext().setAttribute(WINDOW_CENTER_PARAM, windowCenter == null ? null : windowCenter.trim());
			getServletContext().setAttribute(WINDOW_WIDTH_PARAM, windowWidth == null ? null : windowWidth.trim()); 
			
			dis.skipBytes(50000000);
				
			is.close();
			dis.close();
			
			out.println("Success");
			out.close();
			
		} catch (Exception e) {
			 log.error("Unable to read and send the DICOM dataset page",e);
		}
	}
	
	// Method to getElementValue from DICOM
	
	private String getElementValue(String element) {
		int a,b,c,d;
		a = Integer.parseInt(element.substring(2,4),16);
		b = Integer.parseInt(element.substring(0,2),16);
		c = Integer.parseInt(element.substring(6,8),16);
		d = Integer.parseInt(element.substring(4,6),16);

		String val="";
		int len;
		String ret_val[] = new String[2];

		for(int i=0; i<dicomData.length; i++) 
		{
		    if(dicomData[i]==a && dicomData[i+1]==b && dicomData[i+2]==c && dicomData[i+3]==d) 
		    {
			if( dicomData[i+4] > 65)
			    len = dicomData[i+6];
			else
			    len = dicomData[i+4];
	                
	        int m=i+8+len;
	               
			for(int j=i+8; j<m; j++) {
			    val += (char) dicomData[j];
			}
			break;
		    }
		}
		ret_val = val.split("\\\\"); 
		return (ret_val[0]);
	}

}
