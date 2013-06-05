<%-- 
    Document   : show3d
    Created on : May 16, 2012, 12:31:59 PM
    Author     : Sathishkumar Varatharasu
--%>

<%@page import="java.io.File"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>HTML-5 3D Viewer</title>
        <script src="./js/lib/Three.js"> </script>
        <script src="./js/Rastergl.js"> </script>
        <script src="./js/lib/jquery-latest.js"> </script>
        <script type="text/javascript" src="js/lib/jquery.cookies.min.js"></script>
        
        <script type="text/javascript">
            window.onload = function() {
            	pat = $.cookies.get( 'patient' );
            	document.title = pat.pat_Name + " - 3D Viewer";
            	
            <%
                String dirPath = request.getParameter("dirPath");
                String pixelVal = request.getParameter("pixelValue");
            %>
                    //$.getJSON('surfaceJson?seriesDitectory="/home/sathishkumar/NetBeansProjects/dcmfiles/dcm1/"', function(data) {
                    $.getJSON('surfaceJson.do?seriesDirectory=<%=dirPath%>&pixelValue=<%=pixelVal%>', function(data) {
                        rastergl = new RasterGL("viewer");
                        rastergl.loadCanvas(<%=pixelVal%>);
                        rastergl.loadDicomObject(data);
                        document.getElementById("loading").style.display = "none";
                    });
                }
        </script>
    </head>
    <body style="background-color: #000000;">
        <div align="center" style="background-color: #000000; color:white">
            Mouse Operations: Left=>3D Rotation, Middle=>Zoom In/Out, Right=>Pan.
        </div>        
        <!--==============================content=================================================================================-->
        <section id="content">
            <div align="center" style="background-color: #000000;">
                <div id="loading" style="background-color: #000000; position:absolute; width:100%; text-align:center; top:300px;"><img src="images/loading.gif" border=0></div>
                <div id="viewer" style="background-color: #000000; width:100%; height:750px;"></div>
            </div>
        </section>
    </body>
</html>
