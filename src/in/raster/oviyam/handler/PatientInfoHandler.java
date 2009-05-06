
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

import in.raster.oviyam.*;
import in.raster.oviyam.model.PatientModel;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.SimpleTagSupport;

import org.apache.log4j.Logger;

/**
 * Tag handler class gives the patient informations.
 * It implements the tag functionality with another page(Using JSP).
 *  
 * @author bharathi
 * @version 0.7
 * 
 * Example: The Jsp code that uses the PatientInfoHadler class as Tag.
 * <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>    
 * <%@ page isELIgnored="false"%> *	
 * <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
 * <%@ taglib prefix="pat" uri="PatientInfo" %>
 * <HTML>
 * 	<HEAD>
 * 	</HEAD>
 * 		<BODY> 
 * 			<TABLE>
 * 			<pat:Patient patientId="${param.patientId}" patientName="${param.patientName}" birthDate="${param.birthDate}" searchDate="${param.searchDate}" modality="${param.modality}" 
 * 				<TR>
 * 					<TD>${patientId}</TD>
 * 					<TD>${patientName}</TD>
 *  				<TD>${birthDate}</TD>
 *  				<TD>${modality}</TD>
 * 					<TD>${sex}</TD>
 *  				<TD>${physicianName}</TD>
 *  			</TR>					
 * 			</pat:Patient>
 * 			</TABLE>
 * 		 </BODY> 
 * </HTML>
 */
public class PatientInfoHandler extends SimpleTagSupport{
	
	private static Logger log = Logger.getLogger(PatientInfoHandler.class);
	
	
	// Attribute variables for the tag ---------------------------------------------
	private String patientId="";	
	private String patientName="";
	private String birthDate="";
	private String searchDate="";
	private String modality="";	
	private String from="";	
	private String to="";	
	private String searchDays;
	private String phy_name;
	private String accessionNumber="";
	
	// Variables -------------------------------------------------------------------
	Date date = new Date();	
	DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");	
	String s=dateFormat.format(date);	
	
	PatientInfo patientInfo;
	
	/**
	 * Setter for property patientId.
	 * @param patientId The String object registers the patientId.
	 */
	public void setPatientId(String patientId){
		if(patientId==null){
			this.patientId="";
		}else{
			this.patientId = patientId;		
		}
	}
	
	/**
	 * Setter for property patientName.
	 * @param patientName The String object registers the patientName.
	 */
	public void setPatientName(String patientName){
		if(patientName==null){
			this.patientName="";
		}else{
			this.patientName = patientName;		
		}
	}
	
	/**
	 * Setter for property birthDate.
	 * @param birthDate The String object registers the birthDate. 
	 */
	public void setBirthDate(String birthDate){
		if(birthDate==null){
			this.birthDate="";
		}
		else{
			this.birthDate = birthDate;		
		}
	}
	
	/**
	 * Setter for property searchDate.
	 * @param searchDate The String object registers the searchDate.
	 */
	public void setSearchDate(String searchDate){
		if(searchDate==null){
			this.searchDate="";
		}else{
			this.searchDate = searchDate;		
		}
	}
	
	/**
	 * Setter for property modality.
	 * @param modality The String object registers the modality.
	 */
	public void setModality(String modality){
		if(modality==null){
			this.modality="";
		}else{
			this.modality = modality;		
		}
	}
	
	/**
	 * Setter for property to.
	 * @param to The String object registers the to.
	 */
	public void setTo(String to){
		if(to==null){
			this.to="";
		}else{
			this.to = to;		
		}
	}
	
	/**
	 * Setter for property from
	 * @param from The String object registers the from.
	 */
	public void setFrom(String from){
		if(from==null){
			this.from="";
		}else{
			this.from = from;		
		}
	}
	
	/**
	 * Setter for property searchDays.
	 * @param searchDays The String object registers the searchDays.
	 */
	public void setSearchDays(String searchDays){
		if(searchDays==null){
			this.searchDays="";
		}else{
			this.searchDays = searchDays;		
		}
	}
	
	/**
	 * Setter for property accessionNumber.
	 * @param accessionNumber The String object registers the accessionNumber.
	 */
	public void setAccessionNumber(String accessionNumber){
		if(accessionNumber==null){
			this.accessionNumber="";
		}else{
			this.accessionNumber= accessionNumber;		
		}
	}
	
	/**
	 * It calculates and returns the lastweek's date(7 days ago from current date). 
	 * @return String value of lastweek's date.
	 */
	public String getLastWeek(){
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Calendar currDate= Calendar.getInstance();
		currDate.add(Calendar.DATE, -7); //go back 7 days
		 currDate.getTime();
		
		return dateFormat.format(currDate.getTime());
	}
	
	/**
	 * It calculates and returns the lastmonth's date(31 days ago from current date).
	 * @return String value of lastmonth's date.
	 */
	public String getLastMonth(){
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Calendar currDate= Calendar.getInstance();
		currDate.add(Calendar.DATE, -31); //go back 31 days
		 currDate.getTime();
		
		return dateFormat.format(currDate.getTime());
	}
	
	/**
	 * Calculates and returns the string format of yesterday Date.
	 * @return String value of yesterday.
	 */
	public String getYesterday(){
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Calendar currDate= Calendar.getInstance();
		currDate.add(Calendar.DATE, -1); //go back 1 days
		 currDate.getTime();
		
		return dateFormat.format(currDate.getTime());
	}
	
	/**
	 * Calculates and returns the date based on the searchDays value.
	 * @return String value of searchDate.
	 */
	public String getSearchDate(){		
		
		if( searchDays.equalsIgnoreCase("lastweek")){
			String lastWeek=getLastWeek();
			lastWeek=lastWeek.replace("-","");
			s=s.replace("-","");
			searchDate=lastWeek+"-"+s;

		}
		
		if( searchDays.equalsIgnoreCase("today")){
			
			s=s.replace("-","");
			searchDate=s+"-"+s;

		}

		if( searchDays.equalsIgnoreCase("lastmonth")){
			String lastMonth=getLastMonth();
			lastMonth=lastMonth.replace("-","");
			s=s.replace("-","");
			searchDate=lastMonth+"-"+s;

		}

		if( searchDays.equalsIgnoreCase("yesterday")){
			String yesterDay = getYesterday();
			yesterDay=yesterDay.replace("-","");
			searchDate=yesterDay+"-"+yesterDay;

		}
		
		
		if( searchDays.equalsIgnoreCase("between")){
			from = from.replace("/","");
			to = to.replace("/","");
			from = from.replace("-","");
			to = to.replace("-","");
			searchDate=from+"-"+to;

			}
		
		return this.searchDate;
	}
	
	/**
	 * Overridden Tag handler method.Default processing of the tag.
	 * This method will send the Patient information to generate a Html page during its execution. 	
	 * 
	 * @see javax.servlet.jsp.tagext.SimpleTagSupport#doTag()
	 */	
	@Override
	public void doTag()throws JspException,IOException{			
		
		try{
			/*
			 * in.raster.oviyam.PatientInfo class used to query(cFIND) the Patient and Study detials from the 
			 * configured Server. 
			 */
			patientInfo = new PatientInfo();
			
		}catch(Exception e){
			log.error("Unable to create instance of PatientInfo.",e);
			return;
		}
		
		try{
			patientInfo.callFindWithQuery( patientId, patientName, birthDate, getSearchDate(), "", modality, accessionNumber);
			getJspContext().setAttribute("totalNoOfStudies",patientInfo.getNumberOfStudies());
		}catch(Exception e){
			e.printStackTrace();
			log.error("Error while accessing callFindWithQuery() method of PatientInfo.",e);
			return;
		}
		
																																										
		/*
		 * Writes the patient information to the response.
		 */											
		try {																							
			/*
			 * ArrayList contains the PatientModels.
			 */
			ArrayList<PatientModel> patientList = PatientInfo.patientList;
			for (int patientCount = 0; patientCount < patientList.size(); patientCount++) {
				/*
				 * PatientModel instance contains the patient informations such as
				 * patientId, patientName, modality, birthDate etc.
				 * 
				 * @see in.raster.oviyam.PatientModel.
				 */
				PatientModel patient = patientList.get(patientCount);
				
				/*
				 * Tag handler sets the attribute values such as patientId, patientName, modality etc.
				 * Example : User can access it form the JSP using the Expression Language of JSP such as
				 * 	${patientId}
				 * 	${patientName}
				 *  ${birthDate}
				 *  ${physicianName}
				 */
				getJspContext().setAttribute("serNo", patientCount + 1);
				getJspContext().setAttribute("patientId",
						patient.getPatientID());
				getJspContext().setAttribute("patientName",
						patient.getPatientName());
				getJspContext().setAttribute("birthDate",
						patient.getPatientBirthDate());
				getJspContext().setAttribute("modality", modality);
				getJspContext().setAttribute("sex", patient.getPatientSex());
				getJspContext().setAttribute("physicianName",
						patient.getPhysicianName().replace("\"",""));
				
				phy_name = patient.getPhysicianName();
				if(phy_name.indexOf("`~")>0){
					phy_name = phy_name.replace("`~","\"");	
				} 
				if(phy_name.indexOf("~`")>0) {
					phy_name = phy_name.replace("~`","\'");
				} 
				
				getJspContext().setAttribute("phy_name",phy_name);
				
				/*
				 * Process the body of the tag and print it to the response. The null argument
				 * means the output goes to the response rather than some other writer. 
				 */
				getJspBody().invoke(null);

			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage(),e);
		}
		
		
	}

	
}
