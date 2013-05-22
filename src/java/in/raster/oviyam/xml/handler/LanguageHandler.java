/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.oviyam.xml.handler;

import in.raster.oviyam.xml.model.Configuration;
import in.raster.oviyam.xml.model.Language;
import java.io.File;
import java.util.List;
import org.apache.log4j.Logger;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;

/**
 * 8 Apr, 2013
 *
 * @author sathees
 */
public class LanguageHandler {

    //Initialize logger
    private static Logger log = Logger.getLogger(LanguageHandler.class);
    private Serializer serializer = null;
    public static File source = null;
    private Configuration config = null;

    public LanguageHandler(String tmpDir) {
        try {
            serializer = new Persister();
            source = new File(new XMLFileHandler().getXMLFilePath(tmpDir));
            config = serializer.read(Configuration.class, source);
        } catch (Exception ex) {
            log.error("Unable to read XML document", ex);
            return;
        }
    }

    public void updateLanguage(String language) {
        try {
            List<Language> list = config.getLanguagesList();
            for (Language lang : list) {
                if (lang.getLanguage().equals(language)) {
                    lang.setSelected(true);
                } else {
                    lang.setSelected(false);
                }
            }
            config.setLanguagesList(list);
            serializer.write(config, source);
        } catch (Exception ex) {
            log.error("Unable to modify existing Language settings", ex);
        }
    }

    public List<Language> getLanguage() {
        return config.getLanguagesList();
    }

    public String getCurrentLanguage() {
        List<Language> langList = config.getLanguagesList();
        for (Language lang : langList) {
            if (lang.isSelected()) {
                return lang.getLocaleID();
            }

        }
        return "";
    }
}
