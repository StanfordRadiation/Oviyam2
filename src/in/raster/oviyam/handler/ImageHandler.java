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
package in.raster.oviyam.handler;

import in.raster.oviyam.ImageInfo;
import in.raster.oviyam.model.InstanceModel;
import in.raster.oviyam.utils.AE;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.SimpleTagSupport;

import org.apache.log4j.Logger;

/**
 * Tag handler class generates the informations of Instances.
 * It creates the Object of ImageInfo and access its callFindWithQuery.  
 *  
 * @author bharathi
 * @version 0.7
 * 
 * Example: The Jsp code that uses the ImageHadler class as Tag.
 * <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>    
 * <%@ page isELIgnored="false"%> *	
 * <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
 * <%@ taglib prefix="img" uri="ImageInfo" %>
 * <HTML>
 * 	<HEAD>
 * 	</HEAD>
 * 		<BODY> 
 * 			<TABLE>
 * 				<img:Image patientId="${param.patientID}" study="${param.studyID}" seriesId="${param.seriesID}" >
 * 					<TR>
 * 						<TD>${imageId}</TD>
 * 						<TD>${numberOfImages}</TD>
 *  					<TD>${patientName}</TD>
 *  				</TR>					
 * 				</img:Image>
 * 			</TABLE>
 * 		 </BODY>
 * </HTML>
 *
 */
public class ImageHandler extends SimpleTagSupport {
	
	/*
	 * Initialize logger
	 */	
	private static Logger log = Logger.getLogger(ImageHandler.class);
	
	// Attribute variables for the tag ----------------------------------------
	private String patientId;

	private String seriesId;

	private String study;
	
	// Variables --------------------------------------------------------------	
	private ImageInfo imageInfo;
	
	/**
	 * Setter for property patientId.
	 * @param patientId String object registers the patientId.
	 */
	public void setPatientId(String patientId) {
		if (patientId == null) {
			this.patientId = "";
		} else {
			this.patientId = patientId;
		}
	}
	
	/**
	 * Setter for property seriesId.
	 * @param seriesId String object registers the seriesId.
	 */
	public void setSeriesId(String seriesId) {
		if (patientId == null) {
			this.seriesId = "";
		} else {
			this.seriesId = seriesId;
		}
	}
	
	/**
	 * Setter for property study.
	 * @param study String object that registers the study.
	 */
	public void setStudy(String study) {
		this.study = study;
	}
	
	/**
	 * Overridden Tag handler method. Default processing of the tag.
	 * This method will send the ImageInfos to generate a Html page during its execution. 	
	 * 
	 * @see javax.servlet.jsp.tagext.SimpleTagSupport#doTag()
	 */
	@SuppressWarnings("boxing")
	@Override
	public void doTag() throws JspException, IOException {		
		try {
			/*
			 * in.raster.oviyam.ImageInfo class is used to query(cFIND) the Instance details of
			 * particular patient, study and series. 
			 */
			imageInfo = new ImageInfo();
			AE ae = new AE();
			imageInfo.callFindWithQuery(patientId, study,	seriesId);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("Unable to create instance of ImageInfo and access the callFindWithQuery()",e);
			return;
		}

		try {
			/*
			 * Writes the instance informations such as imageId and numberOfImages to the response.
			 */
			ArrayList<InstanceModel> instances = imageInfo.getInstances();
			for (int instanceCount = 0; instanceCount < instances.size(); instanceCount++) {
				
				/*
				 * InstanceModel object contains the Image informations such as SopIUID, patientName etc.
				 * @see in.raster.oviyam.InstanceModel.
				 */
				InstanceModel instance = instances.get(instanceCount);
			//	System.out.println("Number of instances are "+instances.size());
				getJspContext().setAttribute("img", instanceCount);
				getJspContext().setAttribute("imageId", instance.getSopIUID());
				getJspContext()
						.setAttribute("numberOfImages", instances.size());
				getJspContext().setAttribute("patientName",
						instance.getPatientName());
				getJspContext().setAttribute("seriesId",
						seriesId);
				getJspContext().setAttribute("instanceNumber", instance.getInstanceNumber());
				getJspContext().setAttribute("numberOfFrames", instance.getNumberOfFrames());
				
				String noOfRows = instance.getRows();
				if(Integer.parseInt(noOfRows)>1024)
					noOfRows = "1024";
				getJspContext().setAttribute("rows", noOfRows);
				
				if(instance.getNumberOfFrames()!=null){
					getJspContext().setAttribute("frames","yes");
				}else{				
					getJspContext().setAttribute("frames","no");
				}
				
				
				//This jsp context information for direct studyUID query
				
				getJspContext().setAttribute("studyDesc",imageInfo.getStudyDesc());
				getJspContext().setAttribute("studyDate",imageInfo.getStudyDate());
				getJspContext().setAttribute("patientSex",imageInfo.getPatientSex());
				getJspContext().setAttribute("patientBirthDate",imageInfo.getPatientBirthDate());
				getJspContext().setAttribute("refPhysicianName",imageInfo.getRefPhysicianName());
				getJspContext().setAttribute("modality",imageInfo.getModality());
				
				/*
				 * Process the body of the tag and print it to the response. The null argument
				 * means the output goes to the response rather than some other writer. 
				 */
				getJspBody().invoke(null);
			}
		} catch (Exception e) {
			//log.error(e.getMessage(),e);
			e.printStackTrace();
		}

	}

}
