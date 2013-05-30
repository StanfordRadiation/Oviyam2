package in.raster.oviyam.threed;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONArray;
import vtk.*;

/**
 *
 * @author sathishkumar Varatharasu (sathishkumar.v@raster.in)
 */
@SuppressWarnings("serial")
public class surfaceJson extends HttpServlet {

    static {
        try {
            System.out.println("\n\nLibrary Path : " + System.getProperty("java.library.path"));
            System.out.println("\n\n Java Version : " + System.getProperty("java.version"));
            System.loadLibrary("vtkCommonJava");
            System.loadLibrary("vtkFilteringJava");
            System.loadLibrary("vtkIOJava");
            System.loadLibrary("vtkImagingJava");
            System.loadLibrary("vtkGraphicsJava");
            System.loadLibrary("vtkRenderingJava");
        } catch (UnsatisfiedLinkError er) {
            System.out.println("Library Not Found");
        }
    }
	
	// Load VTK library and print which library was not properly loaded
   /* static {
        //System.setProperty("java.library.path", "/home/sathish/Downloads/VTK6.0.0.rc1/VTK-Build/lib");
        System.out.println("Path : " + System.getProperty("java.library.path"));
        if (!vtkNativeLibrary.LoadAllNativeLibraries()) {
            for (vtkNativeLibrary lib : vtkNativeLibrary.values()) {
                if (!lib.IsLoaded()) {
                    System.out.println(lib.GetLibraryName() + " not loaded");
                } else {
                    System.out.println(lib.GetLibraryName() + " loaded");
                }
            }
        } else {
            System.out.println("All Libraries are loaded");
        }
        vtkNativeLibrary.DisableOutputWindow(new File("error.log"));
    }	*/

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
    @SuppressWarnings("unchecked")
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
            /*
             * TODO output your page here. You may use following sample code.
             */
            //String inputDirectory = "/home/sathishkumar/Installations/dcm4chee-2.17.1-mysql/server/default/DicomFiles/1.2.840.113619.2.3.281.0.2011.6.24.268.2/";
            //int objValue = 500;
            String inputDirectory = request.getParameter("seriesDirectory");
            int objValue = Integer.parseInt(request.getParameter("pixelValue"));

            System.out.println("Dir Path : " + inputDirectory);
            vtkDICOMImageReader reader = new vtkDICOMImageReader();
            File file = new File(inputDirectory.trim());
            System.out.println("Is Path exists : " + file.exists());
            System.out.println("Is Directory : " + file.isDirectory());
            if (file.isDirectory() == true) {
                reader.SetDirectoryName(inputDirectory.trim());
            } else {
                System.out.println("There is no dicom directory");
                return;
            }
            reader.Update();
            reader.GetOutput().ReleaseDataFlagOn();

            vtkMarchingCubes mCube = new vtkMarchingCubes();
            mCube.SetInput(reader.GetOutput());
            mCube.SetValue(0, objValue);
            mCube.ComputeNormalsOn();
            mCube.ComputeGradientsOff();
            mCube.UpdateWholeExtent();

            vtkCleanPolyData pda = new vtkCleanPolyData();
            pda.SetInputConnection(mCube.GetOutputPort());
            pda.Update();

            vtkPolyData pData = pda.GetOutput();

            vtkCellArray cellArray = pData.GetPolys();
            int NumCells = cellArray.GetNumberOfCells();
            vtkIdTypeArray tArray = cellArray.GetData();
            System.out.println("Number of Cells : " + NumCells);

            vtkPoints vertexPoints = pData.GetPoints();
            int NumPoints = vertexPoints.GetNumberOfPoints();
            System.out.println("Number of Vertex Points : " + NumPoints);

            reader.Delete();
            mCube.Delete();
            pda.Delete();
            pData.Delete();

            System.out.println("3D Construction Completed");

            // Write the converted data into a JSON File...
            out.write("[[");
            for (int i = 0; i < NumPoints; i++) {
                double[] vertex = vertexPoints.GetPoint(i);
                JSONArray tempArray = new JSONArray();
                for (double vertexValue : vertex) {
                    tempArray.add(vertexValue);
                }
                // Write the array into files...
                out.write(tempArray.toJSONString());
                if (i != NumPoints - 1) {
                    out.write(",");
                }
            }
            out.write("],[");
            for (int i = 1; i < tArray.GetMaxId() - 1; i += 4) {
                JSONArray tempArray = new JSONArray();
                tempArray.add(tArray.GetValue(i));
                tempArray.add(tArray.GetValue(i + 1));
                tempArray.add(tArray.GetValue(i + 2));
                // Write the array into files...
                out.write(tempArray.toJSONString());
                if (i != tArray.GetMaxId() - 2) {
                    out.write(",");
                }
            }
            out.write("]]");
            out.close();
            System.out.println("Completed...");
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
