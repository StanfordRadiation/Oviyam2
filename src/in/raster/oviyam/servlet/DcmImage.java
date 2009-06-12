

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

import in.raster.oviyam.config.ServerConfiguration;
import in.raster.oviyam.config.ServerXmlConfiguration;

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
 * Servlet class returns the JPG image as response. 
 * @author bharathi
 * @version 0.7
 *
 */
public class DcmImage extends HttpServlet{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/*
	 *Initialize the Logger. 
	 */
	private static Logger log = Logger.getLogger(DcmImage.class);

	@Override
	public void doGet(HttpServletRequest request,HttpServletResponse response)throws ServletException,IOException{
		String imageURL="";
		// Sets the response content type to jpg image.
				
		ServerXmlConfiguration sxc = new ServerXmlConfiguration();
		ServerConfiguration sc = sxc.getElementValues();
		// Reads the parameters form the request object which is sent by user.
		String study = request.getParameter("study");
		String series = request.getParameter("series");
		String object = request.getParameter("object");
		String frameNo = request.getParameter("frameNumber");
		String contentType = request.getParameter("contentType");
		String rows = request.getParameter("rows");
		String windowCenter = request.getParameter("windowCenter");
		String windowWidth = request.getParameter("windowWidth");
		
		imageURL="http://"+sc.getHostName()+":"+sc.getWadoPort()+"/wado?requestType=WADO&studyUID="+study+"&seriesUID="+series+"&objectUID="+object;  //+"&windowCenter="+windowCenter+"&windowWidth="+windowWidth;
		if(request.getParameter("frameNumber")!=null){
			imageURL += "&frameNumber="+frameNo;
		}
		if(contentType!=null){
			imageURL += "&contentType="+contentType;
			response.setContentType(contentType);
		}
		if(rows!=null){
			imageURL += "&rows="+rows;
			
		}
		
		if(windowCenter!=null){
			imageURL += "&windowCenter="+windowCenter;
		}
		if(windowWidth!=null){
			imageURL += "&windowWidth="+windowWidth;
		}
		
		
			InputStream resultInStream = null;
			//Gets the response's outputStream instance to write a image in the response.
			OutputStream resultOutStream = response.getOutputStream();
		
		try{
			//Initialize the URL for the requested image.
			URL imageUrl = new URL(imageURL);
			//opens the inputStream of the URL.
			resultInStream = imageUrl.openStream();
			//Initialize the byte array object to read and hold the bytes form the image URL stream.
			byte[] buffer = new byte[4096];
			int bytes_read;
			//writes the image bytes into the response's output stream.
			while((bytes_read=resultInStream.read(buffer)) != -1){
				resultOutStream.write(buffer, 0, bytes_read);
			}

			//Closing all the input and output streams.
			resultOutStream.flush();
			resultOutStream.close();
			resultInStream.close();
		} catch (Exception e) {			
			log.error("Unable to read and write the image from http://"+sc.getHostName()+":"+sc.getWadoPort(),e);
			
		} 
		
	}	

}
