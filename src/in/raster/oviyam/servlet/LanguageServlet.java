/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.oviyam.servlet;

import in.raster.oviyam.xml.handler.LanguageHandler;
import in.raster.oviyam.xml.model.Language;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.File;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author sathees
 */
public class LanguageServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP
     * <code>GET</code> and
     * <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        PrintWriter out = response.getWriter();
        try {
            String option = request.getParameter("option");
            File tempDir = (File) getServletContext().getAttribute("javax.servlet.context.tempdir");
            LanguageHandler langHandler = new LanguageHandler(tempDir.getAbsolutePath());
            if (option.equals("set")) {
                String language = request.getParameter("language");
               // Language lang = new Language();
                //lang.setLanguage(language);
                langHandler.updateLanguage(language);
                out.println("Success");
            } else if (option.equals("getall")) {
                response.setContentType("application/json");
                JSONArray langArray=new  JSONArray(langHandler.getLanguage());
                out.println(langArray);
            } else {
                out.println(langHandler.getCurrentLanguage());
            }
        } finally {
            out.close();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
