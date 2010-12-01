<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="ISO-8859-1"%>
    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	String cookieName = "agree";
	Cookie cookies[] = request.getCookies();
	Cookie myCookie = null;
	if (cookies != null) {
		for (int i = 0; i < cookies.length; i++) {
			if (cookies[i].getName().equals(cookieName)) {
		myCookie = cookies[i];
		break;
			}
		}
	}
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Oviyam - DICOM Web Browser</title>
<style>
	#hiddenPane{
		
		position: absolute;
		top:0px;
		left:0px;
		height: 100%;
		width: 100%;
		text-align: center;
		visibility:hidden;
		z-index:10000;
		background:#000000;
		opacity:.85;
	}
	#dialogDiv {
		position: relative;
		width:500px;
		border:1px solid #FFFFFF;
		margin: 20% auto;
		margin-top: 20%;
		/*  top: -50px;*/
		height: 200px;
		text-align: center;
		color:#FFFFFF;
		background:#232323;		
	}
</style>	

<script>
	function showDialog(){
		document.getElementById('hiddenPane').style.visibility="visible";
		document.getElementById('welcomePane').style.visibility="hidden";
	}
	
	function hideDialog(){
		document.getElementById('hiddenPane').style.visibility="hidden";	
	}
</script>
</head>



<body bgcolor="#000000" >
<center>
  <div id="welcomePane">
	<div style="position:relative;margin:300px 0px 0px 0px;width:100%;">
		<img src="images/oviyam_web_logo.png" style="position:relative;" alt=""> 
		<%
			if (myCookie == null) {
		%> 
		<input type="button" value="Enter" name="enter"	onclick="showDialog();">
		<%
			} else {
		%>
		<form action="oviyam" method="GET"><input type="submit"	value="Enter"></form>
		<%
			}
		%>
	</div>	
  </div>
</center>

<div id="hiddenPane">
	<div id="dialogDiv">
		<center>
			<table>
				<tr>
					<td colspan="2">
						<p align="justify" style="position:relative;color:#FFFFFF;">
					 	  <b>Important Notice</b><br>
							This version of Oviyam, being a free open-source software (FOSS), is not certified as a commercial medical device (FDA or CE-1).
							Please check with local compliance office for possible limitations in its clinical use.
						</p>
					</td>
				</tr>							
				<tr>
					<td colspan="2" align="right">
						<form action="oviyam" method="GET">
							<input type="checkbox" value="agree" name="agree">Do not show this notice again. <br>
							<input type="submit" value="Agree">
							<input type="button" value="Do not Agree" onclick="hideDialog();">
						</form>									
						
					</td>					
				</tr>
			</table>			
		</center>
	</div>
</div>	
</body>
</html>