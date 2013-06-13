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

import java.util.StringTokenizer;

/**
 * @author     <a href="mailto:gunter@tiani.com">gunter zeilinger</a>
 * @since    May, 2002
 * @version    $Revision: 3922 $ $Date: 2005-10-05 18:26:16 +0200 (Mi, 05 Okt 2005) $
 */
public final class GenericDicomURL extends Object
{
	
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
	/**
	 * @author     <a href="mailto:gunter@tiani.com">gunter zeilinger</a>
	 * @since    March 4, 2003
	 * @version    $Revision: 3922 $ $Date: 2005-10-05 18:26:16 +0200 (Mi, 05 Okt 2005) $
	 */
	public final static class GenericDcmProtocol
	{
	    /**  Description of the Field */
	    public final static GenericDcmProtocol DICOM =
	            new GenericDcmProtocol("dicom", null);
	    /**  Description of the Field */
	    public final static GenericDcmProtocol DICOM_TLS =
	            new GenericDcmProtocol("dicom-tls",
	            new String[]{
	            "SSL_RSA_WITH_NULL_SHA",
				"TLS_RSA_WITH_AES_128_CBC_SHA",
	            "SSL_RSA_WITH_3DES_EDE_CBC_SHA"
	            });
	    /**  Description of the Field */
	    public final static GenericDcmProtocol DICOM_TLS_3DES =
	            new GenericDcmProtocol("dicom-tls.3des",
	            new String[]{
	            "SSL_RSA_WITH_3DES_EDE_CBC_SHA"
	            });
	    /**  Description of the Field */
	    public final  static GenericDcmProtocol DICOM_TLS_AES =
	            new GenericDcmProtocol("dicom-tls.aes",
	            new String[]{
	            "TLS_RSA_WITH_AES_128_CBC_SHA",
			    "SSL_RSA_WITH_3DES_EDE_CBC_SHA"
	            });
	    /**  Description of the Field */
	    public final  static GenericDcmProtocol DICOM_TLS_NODES =
	            new GenericDcmProtocol("dicom-tls.nodes",
	            new String[]{
	            "SSL_RSA_WITH_NULL_SHA",
	            });


	    /**
	     *  Description of the Method
	     *
	     * @param  protocol  Description of the Parameter
	     * @return           Description of the Return Value
	     */
	    public  static GenericDcmProtocol valueOf(String protocol)
	    {
	        String lower = protocol.toLowerCase();
	        if (lower.equals("dicom")) {
	            return DICOM;
	        }
	        if (lower.equals("dicom-tls")) {
	            return DICOM_TLS;
	        }
	        if (lower.equals("dicom-tls.3des")) {
	            return DICOM_TLS_3DES;
	        }
	        if (lower.equals("dicom-tls.aes")) {
	            return DICOM_TLS_AES;
	        }
	        if (lower.equals("dicom-tls.nodes")) {
	            return DICOM_TLS_NODES;
	        }
	        throw new IllegalArgumentException("protocol:" + protocol);
	    }


	    private final String name;
	    private final String[] cipherSuites;


	    private GenericDcmProtocol(String name, String[] cipherSuites)
	    {
	        this.name = name;
	        this.cipherSuites = cipherSuites;
	    }


	    /**
	     *  Description of the Method
	     *
	     * @return    Description of the Return Value
	     */
	    public String toString()
	    {
	        return name;
	    }


	    /**
	     *  Gets the cipherSuites attribute of the DcmProtocol object
	     *
	     * @return    The cipherSuites value
	     */
	    public String[] getCipherSuites()
	    {
	        return cipherSuites == null ? null
	                 : (String[]) cipherSuites.clone();
	    }


	    /**
	     *  Gets the tLS attribute of the DcmProtocol object
	     *
	     * @return    The tLS value
	     */
	    public boolean isTLS()
	    {
	        return cipherSuites != null;
	    }
	}


	
	
    // Constants -----------------------------------------------------
    /**  Description of the Field */
    public final static int DICOM_PORT = 104;

    private final static int DELIMITER = -1;
    private final static int CALLED_AET = 0;
    private final static int CALLING_AET = 1;
    private final static int HOST = 2;
    private final static int PORT = 3;
    private final static int END = 4;

    // Attributes ----------------------------------------------------
    private GenericDcmProtocol protocol;
    private String calledAET;
    private String callingAET;
    private String host;
    private int port = DICOM_PORT;


    // Constructors --------------------------------------------------
    /**
     *Constructor for the DcmURL object
     *
     * @param  spec  Description of the Parameter
     */
    public GenericDicomURL(String spec)
    {
        parse(spec.trim());
        if (calledAET == null) {
            throw new IllegalArgumentException("Missing called AET");
        }
        if (host == null) {
            throw new IllegalArgumentException("Missing host name");
        }
    }


    /**
     *Constructor for the DcmURL object
     *
     * @param  protocol    Description of the Parameter
     * @param  calledAET   Description of the Parameter
     * @param  callingAET  Description of the Parameter
     * @param  host        Description of the Parameter
     * @param  port        Description of the Parameter
     */
    public GenericDicomURL(String protocol, String calledAET, String callingAET,
            String host, int port)
    {
        this.protocol = GenericDcmProtocol.valueOf(protocol);
        this.calledAET = calledAET;
        this.callingAET = callingAET;
        this.host = host;
        this.port = port;
    }


    // Public --------------------------------------------------------
    /**
     *  Gets the protocol attribute of the DcmURL object
     *
     * @return    The protocol value
     */
    public final String getProtocol()
    {
        return protocol.toString();
    }


    /**
     *  Gets the cipherSuites attribute of the DcmURL object
     *
     * @return    The cipherSuites value
     */
    public final String[] getCipherSuites()
    {
        return protocol.getCipherSuites();
    }


    public final boolean isTLS()
    {
        return protocol.isTLS();
    }
    
    /**
     *  Gets the callingAET attribute of the DcmURL object
     *
     * @return    The callingAET value
     */
    public final String getCallingAET()
    {
        return callingAET;
    }


    /**
     *  Gets the calledAET attribute of the DcmURL object
     *
     * @return    The calledAET value
     */
    public final String getCalledAET()
    {
        return calledAET;
    }


    /**
     *  Gets the host attribute of the DcmURL object
     *
     * @return    The host value
     */
    public final String getHost()
    {
        return host;
    }


    /**
     *  Gets the port attribute of the DcmURL object
     *
     * @return    The port value
     */
    public final int getPort()
    {
        return port;
    }


    /**
     *  Description of the Method
     *
     * @return    Description of the Return Value
     */
    public String toString()
    {
        StringBuffer sb = new StringBuffer(64);
        sb.append(protocol).append("://").append(calledAET);
        if (callingAET != null) {
            sb.append(':').append(callingAET);
        }
        sb.append('@').append(host).append(':').append(port);
        return sb.toString();
    }


    // Private -------------------------------------------------------

    private void parse(String s)
    {
        int delimPos = s.indexOf("://");
        if (delimPos == -1) {
            throw new IllegalArgumentException(s);
        }
        protocol = GenericDcmProtocol.valueOf(s.substring(0, delimPos));
        StringTokenizer stk = new StringTokenizer(
                s.substring(delimPos + 3), ":@/", true);
        String tk;
        int state = CALLED_AET;
        boolean tcpPart = false;
        while (stk.hasMoreTokens()) {
            tk = stk.nextToken();
            switch (tk.charAt(0)) {
                case ':':
                    state = tcpPart ? PORT : CALLING_AET;
                    break;
                case '@':
                    tcpPart = true;
                    state = HOST;
                    break;
                case '/':
                    return;
                default:
                    switch (state) {
                        case CALLED_AET:
                            calledAET = tk;
                            break;
                        case CALLING_AET:
                            callingAET = tk;
                            break;
                        case HOST:
                            host = tk;
                            break;
                        case PORT:
                            port = Integer.parseInt(tk);
                            return;
                        default:
                            throw new RuntimeException();
                    }
                    state = DELIMITER;
                    break;
            }
        }
    }
}

