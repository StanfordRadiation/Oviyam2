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
* Jeff M
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

import org.json.JSONObject;
import in.raster.oviyam.config.ServerConfiguration;
import java.io.IOException;
import java.io.InputStream;
import java.io.BufferedInputStream;
import java.net.URL;
import java.io.DataInputStream;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;

import org.dcm4che2.io.DicomInputStream;
import org.dcm4che2.data.DicomElement;
import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;

/**
 * Reads window width, window center, pixel spacing, native rows and native columns from a dicom file.
 * @author jeffm with code from asgar
 * @version 0.9
 *
 */
public class DcmAttributeRetrieve extends HttpServlet{
	
	/**
	 * Initialize the logger.
	 */
	 
	private static Logger log = Logger.getLogger(DcmAttributeRetrieve.class);
	private static final String WINDOW_CENTER_PARAM = "windowCenter";
	private static final String WINDOW_WIDTH_PARAM = "windowWidth";
	private static final String PIXEL_SPACING = "pixelSpacing";
	private static final String NATIVE_ROWS = "nativeRows";
	private static final String NATIVE_COLUMNS = "nativeColumns";
	                                  
	private static final String CT = "1.2.840.10008.5.1.4.1.1.2";
	private static final String MR = "1.2.840.10008.5.1.4.1.1.4";
	private static final String XA = "1.2.840.10008.5.1.4.1.1.12.1";
	private static final String CR = "1.2.840.10008.5.1.4.1.1.1";
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException{

		// Reads the parameters from the request.
		
		response.setContentType("text/html");
		PrintWriter out=response.getWriter();
		
		String dicomURL = "http://"+((ServerConfiguration)(getServletContext().getAttribute("serverConfig"))).getHostName()+":"+((ServerConfiguration)(getServletContext().getAttribute("serverConfig"))).getWadoPort()+"/wado?requestType=WADO&";
		String seriesUID = request.getParameter("series");
		String objectUID = request.getParameter("object");
		String studyUID = request.getParameter("study");
		
		// Generates the URL for the requested DICOM Dataset page.
		dicomURL += "contentType=application/dicom&studyUID="+studyUID+"&seriesUID="+seriesUID+"&objectUID="+objectUID+"&transferSyntax=1.2.840.10008.1.2.1";
		dicomURL = dicomURL.replace("+", "%2B");  

		InputStream is = null;
		DicomInputStream dis = null;
	
				
		try{
			//Initialize the URL for the requested page.
			URL url = new URL(dicomURL);
			//opens the inputStream of the URL.
			is = url.openStream();
			
			dis = new DicomInputStream(is);
			DicomObject dob = dis.readDicomObject();
			DicomElement sopClassUID = dob.get(Tag.SOPClassUID);
			DicomElement nativeRows = dob.get(Tag.Rows);
			DicomElement nativeColumns = dob.get(Tag.Columns);
			DicomElement windowCenter = dob.get(Tag.WindowCenter);
			DicomElement windowWidth = dob.get(Tag.WindowWidth);
			
			String sopClassUIDValue  =  sopClassUID == null ? null :  new String(sopClassUID.getBytes()).trim();
			int nativeRowsValueNum      =  nativeRows == null ? 0 :  nativeRows.getInt(false);
			int nativeColumnsValueNum   =  nativeColumns == null ? 0 :   nativeColumns.getInt(false);
			String windowCenterValue =  windowCenter == null ? null : new String(windowCenter.getBytes());
			String windowWidthValue  =  windowWidth == null ? null :  new String(windowWidth.getBytes());
			
			
			// Different types of modalities store pixel data in different attributes
			DicomElement spacing = null;
			if ((sopClassUID != null) && (sopClassUIDValue.equals(CT) || sopClassUIDValue.equals(MR))){
				spacing = dob.get(Tag.PixelSpacing);
			} else if ((sopClassUID != null) && (sopClassUIDValue.equals(CR) || sopClassUIDValue.equals(XA))){
				spacing = dob.get(Tag.ImagerPixelSpacing);
			} 
			
			String spacingValue = spacing == null ? null : new String(spacing.getBytes());
			
			// Some values come packed as strings contain two numbers, we are only currently interested in one
			double spacingValueNum    = 0;
			double windowWidthValueNum   = 0;
			double windowCenterValueNum  = 0;
			
			if ((windowCenter != null) &&(windowCenter.vm(null) == 2)){
				windowCenterValueNum = new Double(windowCenterValue.split("\\\\")[0].trim()).doubleValue();
			}else if (windowCenter != null) {
			    windowCenterValueNum = new Double(windowCenterValue.trim());
			}   
			
			if ((windowWidth != null) && (windowWidth.vm(null) == 2)){
				windowWidthValueNum = new Double(windowWidthValue.split("\\\\")[0].trim()).doubleValue();
			}else if (windowWidth != null) {
			    windowWidthValueNum = new Double(windowWidthValue.trim()).doubleValue();
			}
			
			if ((spacing != null) && (spacing.vm(null) == 2)){
			    // Only report a pixel spacing value if both row and col
			    // spacing are the same.
			    String[] spacingValues = spacingValue.split("\\\\");
			    if (spacingValues[0].trim().equals(spacingValues[1].trim())){
			        spacingValueNum = new Double(spacingValues[0].trim()).doubleValue();
			    }
			} else if ((spacing != null) && (spacing.vm(null) == 1)){
			    spacingValueNum = new Double(spacingValue.trim()).doubleValue();
			}
			
			dis.close();
			
			JSONObject jsonResponse = new JSONObject();
			
     		// set the window center and window width attributes
			jsonResponse.put(WINDOW_CENTER_PARAM, windowCenterValueNum);
			jsonResponse.put(WINDOW_WIDTH_PARAM, windowWidthValueNum);
			jsonResponse.put(PIXEL_SPACING, spacingValueNum);
			jsonResponse.put(NATIVE_ROWS, nativeRowsValueNum);
			jsonResponse.put(NATIVE_COLUMNS, nativeColumnsValueNum);
			
			jsonResponse.put("status","success");
			
			is.close();
			dis.close();
		
			out.println(jsonResponse.toString());
			out.close();
			
		} catch (Exception e) {
			 is.close();
			 dis.close();
			 out.println("{\"status\":\"error\"}");
			 out.close();
			 System.out.println(e);
			 log.error("Unable to read and send the DICOM dataset page",e);
		}
	}
}
