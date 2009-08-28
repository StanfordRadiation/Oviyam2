
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


import in.raster.oviyam.SeriesInfo;
import in.raster.oviyam.model.SeriesModel;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.SimpleTagSupport;

import org.apache.log4j.Logger;


/**
 * Tag handler class generates the informations of series.
 * 
 * @author bharathi
 * @version 0.7
 *
 * Example: The Jsp code that uses the SeriesHandler class as Tag.
 * <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>    
 * <%@ page isELIgnored="false"%> *	
 * <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
 * <%@taglib prefix="ser" uri="SeriesInfo" %>
 * <HTML>
 * 	<HEAD>
 * 	</HEAD>
 * 		<BODY> 
 * 			<TABLE>
 * 				<ser:Series patientId="${param.patient}" study="${param.study}">
 * 					<TR>
 * 						<TD>${seriesId}</TD>
 * 						<TD>${seriesDescs}</TD>
 *  					<TD>${modality}</TD>
 *  					<TD>${patientName}</TD>
 * 						<TD>${imageId}</TD>
 *  					<TD>${numberOfImages}</TD>
 *  				</TR>					
 * 				</ser:Series>
 * 			</TABLE>
 * 		 </BODY>
 * </HTML>
 */
public class SeriesDetailsHandler extends SimpleTagSupport{
	
	//Initialize Logger
	private static Logger log = Logger.getLogger(SeriesDetailsHandler.class);
	
	// Attribute variables for this tag ---------------------------------	
	private String study;
	
	private String patientId;
	
	// Instance variables------------------------------------------------
	private SeriesInfo seriesInfo;


	/**
	 * Setter for property study.
	 * @param study String object registers the study.
	 */
	public void setStudy(String study){
		this.study = study;
	}
	
	/**
	 * Setter for property patientId.
	 * @param patientId String object registers the patientId.
	 */
	public void setPatientId(String patientId){
		if(patientId==null){
			this.patientId="";
		}else{
			this.patientId = patientId;		
		}
	}
	
	/**
	 * Overridden Tag handler method.Default processing of the tag.
	 * This method will send the Series information to generate a Html page during its execution. 	
	 * 
	 * @see javax.servlet.jsp.tagext.SimpleTagSupport#doTag()
	 */	
	@Override
	public void doTag()throws JspException,IOException{
		
		try{
			/*
			 * in.raster.oviyam.SeriesInfo used to query(cFind) the Sereis informations of given
			 * Study and patient. 
			 */
			seriesInfo = new SeriesInfo();
			seriesInfo.callFindWithQuery(patientId, study);
		}catch(Exception e){
			e.printStackTrace();			
			log.error("Unable to create instance of SeriesInfo and access its callFindWithQuery()", e);
			return;
		}
		try {
			/*
			 * ArrayList contains the SeriesModels of Particular Study.
			 * @see in.raster.oviyam.model.SeriesModel.
			 */
			ArrayList<SeriesModel> seriesList = seriesInfo.getSeries();
			
		    Collections.sort(seriesList, new Comparator(){
				 
	            public int compare(Object o1, Object o2) {
	                SeriesModel p1 = (SeriesModel) o1;
	                SeriesModel p2 = (SeriesModel) o2;
	                
	                if(p1.getSeriesNumber() == null)
	                	return(-1);
	                else if(p2.getSeriesNumber() == null)
	                	return(1);
	                else if(p1.getSeriesNumber().indexOf("+") >= 0 || p1.getSeriesNumber().indexOf("-") >= 0 || p2.getSeriesNumber().indexOf("+") >= 0 || p2.getSeriesNumber().indexOf("-") >= 0)
	                    return(p1.getSeriesNumber().compareTo(p2.getSeriesNumber()));	
	                else {
	                  int a=Integer.parseInt(p1.getSeriesNumber());
	                  int b=Integer.parseInt(p2.getSeriesNumber());
	                  int t=(a==b ? 0 :(a>b ? 1 : -1));
	                  return t;
	                }
	            }
	        });
		
			for (int seriesCount = 0; seriesCount < seriesList.size(); seriesCount++) {
				
				/*
				 * SeriesModel instance contains the series details such as seriesUID ,
				 * numberOfInstances, patientName etc.
				 * @see in.raster.oviyam.model.SeriesModel. 
				 */
				SeriesModel series = seriesList.get(seriesCount);
				
				/*
				 * Tag handler sets the attribute values such as seriesId, seriesDescs, modality etc.
				 * Example : User can access it form the JSP using the Expression Language of JSP such as
				 * 	${seriesID}
				 * 	${seriesDescs}
				 *  ${modality}
				 */
				
				getJspContext().setAttribute("seriesId", series.getSeriesUID());
				getJspContext().setAttribute("seriesDescs", series.getSeriesDescription() != null ? series.getSeriesDescription() : "unknown");
				getJspContext().setAttribute("modality", series.getModality() != null ?series.getModality() : "unknown");
				getJspContext().setAttribute("patientName", seriesInfo.getPatientName());
				getJspContext().setAttribute("numberOfImages", series.getNumberOfInstances());
				getJspContext().setAttribute("seriesNumber", series.getSeriesNumber());
				
				
				/*
				 * Process the body of the tag and print it to the response. The null argument
				 * means the output goes to the response rather than some other writer. 
				 */
				getJspBody().invoke(null);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage(), e);
		}
		
	}

}

