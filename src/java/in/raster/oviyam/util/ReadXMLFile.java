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
* Meer Asgar Hussain B
* Prakash J
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

package in.raster.oviyam.util;

import in.raster.oviyam.xml.handler.LanguageHandler;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.json.JSONArray;
import org.json.JSONObject;
import org.apache.log4j.Logger;

/**
 *
 * @author asgar
 */
public class ReadXMLFile {
    //Initialize logger
    private static Logger log = Logger.getLogger(ReadXMLFile.class);    

    public Document getXMLDocument() {
        Document doc = null;
        
        File configXmlFile;
        try {
            DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();

            String xmlFileName = this.getClass().getResource("/conf/oviyam2-config.xml").getPath(); //toString();
            //String fname = "oviyam2-config.xml";

            //if(xmlFileName.indexOf("default") >0) {
                File srcFile = new File(this.getClass().getResource("/conf/oviyam2-config.xml").toURI());
		//configXmlFile = new File(xmlFileName.substring(0,xmlFileName.indexOf("default"))+"default" + File.separator + fname);
                configXmlFile = LanguageHandler.source;
                
                //log.debug("Path: " + LanguageHandler.source.getAbsolutePath());

                // check the exists of xml file. If not exists, copy the file to default folder
		if(!configXmlFile.exists()) {
                    FileInputStream in = new FileInputStream(srcFile);
                    FileOutputStream out = new FileOutputStream(configXmlFile);
                    byte[] buf = new byte[1024];
                    int len;
                    while((len = in.read(buf)) > 0) {
                        out.write(buf, 0, len);
                    }
                    in.close();
                    out.close();
                }

                doc = docBuilder.parse(configXmlFile);
            /*} else {
                configXmlFile = new File(xmlFileName);
                doc = docBuilder.parse(configXmlFile);
            }*/
        } catch(Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
        }

        return doc;
    }

    //Read DICOM nodes
    public JSONArray getElementValues(String tagName) {
        Document doc = this.getXMLDocument();
        JSONArray jsonArr = null;
        try {
            jsonArr = new JSONArray();
            JSONObject jsonObj = null;

            NodeList nodeList = doc.getElementsByTagName(tagName);

            for(int i=0; i<nodeList.getLength(); i++) {
                jsonObj = new JSONObject();
                Element element = (Element) nodeList.item(i);

                NodeList nList = element.getChildNodes();
                for(int j=0; j<nList.getLength(); j++) {
                    Node node = nList.item(j);
                    switch (node.getNodeType()) {
                        case Node.ELEMENT_NODE:
                            jsonObj.put(node.getNodeName(), getTagValue(node.getNodeName(), element));
                            break;
                    }
                }
                jsonArr.put(jsonObj);
            }
        } catch(Exception e) {
            log.info("Unable to get element values ", e);
        }

        return jsonArr;
    }

    private static String getTagValue(String sTag, Element element) {
        NodeList nodeList = element.getElementsByTagName(sTag).item(0).getChildNodes();
        Node node = (Node) nodeList.item(0);

        if(node != null) {
            return node.getNodeValue();
        } else {
            return "";
        }
    }

}
