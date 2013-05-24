/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package in.raster.oviyam.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;

/**
 *
 * @author asgar
 */
public class StreamFile {
    
    public StreamFile() { }

    public void doStream(File streamFile, OutputStream os) {
        FileInputStream fis = null;

        try {

            fis = new FileInputStream(streamFile);
            byte[] buffer = new byte[4096];
            int bytes_read;

            //write the file into the response's output stream.
            while((bytes_read = fis.read(buffer)) != -1) {
                os.write(buffer, 0, bytes_read);
            }

            os.flush();

            
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            //Close the output stream.
            if(os != null) {
                try {
                    os.close();
                } catch(Exception ignore) {}
            }

            //Close the file input stream
            if(fis != null) {
                try {
                    fis.close();
                } catch(Exception ignore) {}
            }
        }
    }
}
