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
 * The Original Code is part of dcm4che, an implementation of DICOM(TM) in
 * Java(TM), hosted at http://sourceforge.net/projects/dcm4che.
 *
 * The Initial Developer of the Original Code is
 * TIANI Medgraph AG.
 * Portions created by the Initial Developer are Copyright (C) 2002-2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * Gunter Zeilinger <gunter.zeilinger@tiani.com>
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
package de.iftm.dcm4che.services;

//import java.io.File;
import in.raster.oviyam.util.IDataSet;
import java.io.IOException;
import java.net.ConnectException;
import java.util.Enumeration;
import java.util.List;
import java.util.Vector;
import java.text.ParseException;

import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.net.ConfigurationException;
import org.dcm4che2.tool.dcmecho.DcmEcho;
import org.dcm4che2.tool.dcmqr.DcmQR;
import org.dcm4che2.tool.dcmqr.DcmQR.QueryRetrieveLevel;

import org.apache.log4j.Logger;


/**
 * Implementation of C-DIMSE services.
 * <p>
 * <p> Usage:
 * <p> 1. Create a new instance of this class.
 * <p> 2. Use the aASSOCIATE method to establish an association.
 * <p> 3. Use the cFIND method to query  the archive.
 * <p> 4. Use the cMOVE method to move an object from the archive to a destination server.
 * <p> 5. Use the cSTORE to store an object into an archive.
 * <p> 6. Use the cECHO to verfy a association.
 * <p> 7. If you are ready with the C-DIMSE services use the aRELEASE method to close the association.
 * <p>
 * <p>The query/retrieve levels used by C-FIND and C-MOVE are defined as enummerated constants.
 * Use the method getQueryRetrieveLevel to convert these values to the String representation
 * used in the DICOM element QueryRetrieveLevel (0008,0052).
 * <p>
 * <p>Based on dcm4che 1.4.0 sample: MoveStudy.java revision date 2005-10-05
 * <p>Based on dcm4che 1.4.0 sample: DcmSnd.java revision date 2005-10-05
 * <p>
 * <p>See: PS 3.4 - Annex B STORAGE SERVICE CLASS
 * <p>See: PS 3.4 - Annex C QUERY/RETRIEVE SERVICE CLASS
 * <p>See: PS 3.4 - C.6 SOP CLASS DEFINITIONS
 * <p>See: PS 3.4 - C.6.2 Study Root SOP Class Group
 * <p>
 * <p>Details of how to run the services is given in a configuration property file.
 * A sample may be found at "./resources/CDimseService.cfg".
 *
 *
 * @author Thomas Hacklaender
 * @version 2006-08-28
 */
public class CDimseService {
    
    static final Logger log = Logger.getLogger("CDimseService");
    
    /** The DEBUG flag is set, if the logging level of this class is Debug */
    final static boolean DEBUG = log.isDebugEnabled();
    
    
    /** DICOM URL to define a communication partner for an association.
     * <p>PROTOCOL://CALLED[:CALLING]@HOST[:PORT]
     * <p>
     * <p>PROTOCOL Specifies protocol. Possible values:
     * <p>   - dicom            DICOM default (without TLS)
     * <p>   - dicom-tls        DICOM on TLS (offer AES and DES encryption)
     * <p>   - dicom-tls.aes    DICOM on TLS (force AES or DES encryption)
     * <p>   - dicom-tls.3des   DICOM on TLS (force DES encryption)
     * <p>   - dicom-tls.nodes  DICOM on TLS (no encryption)
     * <p>CALLED  Called AET in association request (max 16 chars)
     * <p>CALLING Calling AET in association request (max 16 chars) [default id final field DEFAULT_CALLING_AET = MYAET]
     * <p>HOST    Name or IP address of host, where the server is running
     * <p>PORT    TCP port address, on which the server is listing for
     * <p>        incoming TCP Transport Connection Indication [default=104] */
    private GenericDicomURL url = null;

    private ConfigProperties _cfg;
    
    
    //>>>> Constructor >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    /**
     *  Constructor for the StorageSCUServiceClass object. Initializes everything.
     *
     * <p>Details of how to run the server is given in another configuration property file.
     * A sample may be found at "./resources/StorageSCUServiceClass.cfg".
     *
     * @param cfg the configuration properties for this class.
     * @param url the DcmURL of the communication partner.
     * @throws ParseException
     */
    public CDimseService(ConfigProperties cfg, GenericDicomURL url) throws ParseException {
        this.url = url;
    

        _cfg = cfg;
    }

    
    /**
     * Queries the archive for DICOM objects matching Attribute Keys defined in
     * the loacal field "keys". This field is set by the constructor out of the
     * configuration parameters or by the methods setQueryKeys(Configuration) and setQueryKeys(Dataset).
     * See PS 3.4 - Annex C QUERY/RETRIEVE SERVICE CLASS.
     * <p>The method returns, when the result is received from the communication partner.
     *
     *
     * @return the result of the cFIND as a Vector of Dataset objects each specifying
     *         one matching DICOM object. If no matching objects are found an empty Vector is returned.
     * @throws ConnectException
     * @throws IOException
     * @throws ParseException 
     */
    public Vector<IDataSet> cFIND() throws ParseException {
      
    	 DcmQR dcmqr = new DcmQR("DCMCFIND");
    		
   	    dcmqr.setCalledAET(url.getCalledAET(), true);
   	    dcmqr.setRemoteHost(url.getHost());
   	    dcmqr.setRemotePort(url.getPort());
   	    dcmqr.setQueryLevel(QueryRetrieveLevel.STUDY);
   	    dcmqr.configureTransferCapability(true);
   	    
   	    for (Enumeration it = _cfg.keys(); it.hasMoreElements(); ) {
               String key = (String) it.nextElement();
               if (key.startsWith("key.")) {
                   try {
                	int[] tagPath = Tag.toTagPath(key.substring(4));
                   	dcmqr.addMatchingKey(tagPath, _cfg.getProperty(key));
                   } catch (Exception e) {
                       throw new ParseException("Illegal entry in configuration filr: " + key + "=" + _cfg.getProperty(key),0);
                   }
               }
           }
   	
   	    Vector<IDataSet> realResults = new Vector<IDataSet>();
   	    try {
   		    dcmqr.start();
   		    System.out.println("started");
   		    dcmqr.open();
   		    System.out.println("opened");
   		    List<DicomObject> result = dcmqr.query();
   		    for(DicomObject obj : result)
   		    {
   		    	realResults.add(new DcmDataSet(obj));
   		    }
   		    dcmqr.get(result);
   		    System.out.println("List Size = "+result.size());
   		    dcmqr.close();
   		    dcmqr.stop();
   	    }
   	    catch (Exception e) {
   	
   	    }
   	    return realResults;
    }
    
    
    /**
     * Implements the ECHO service. The C-ECHO service is invoked by a DIMSE-service-user
     * to verify end-to-end communications with a peer DIMSE-service-user.
     * See PS 3.7 - 9.1.5 C-ECHO SERVICE
     *
     * @exception ConnectException
     * @exception InterruptedException
     * @exception IOException
     * @throws ConfigurationException 
     */
    public long cECHO() throws InterruptedException, IOException, ConfigurationException {
    	
    	DcmEcho dcmecho = new DcmEcho("DCMECHO");
    	dcmecho.setCalledAET(url.getCalledAET(), true);
    	dcmecho.setRemoteHost(url.getHost());
    	dcmecho.setRemotePort(url.getPort());
    	
       long t1 = System.currentTimeMillis();
       dcmecho.open();
       dcmecho.echo();
       return System.currentTimeMillis() - t1;
    	
   
    }

 
}
