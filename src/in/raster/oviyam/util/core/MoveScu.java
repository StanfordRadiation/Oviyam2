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

package in.raster.oviyam.util.core;

import gnu.getopt.Getopt;
import gnu.getopt.LongOpt;

import java.io.IOException;
import java.net.Socket;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;
import org.dcm4che.data.Command;
import org.dcm4che.data.Dataset;
import org.dcm4che.data.DcmObjectFactory;
import org.dcm4che.dict.DictionaryFactory;
import org.dcm4che.dict.Tags;
import org.dcm4che.dict.UIDDictionary;
import org.dcm4che.dict.UIDs;
import org.dcm4che.net.AAssociateAC;
import org.dcm4che.net.AAssociateRQ;
import org.dcm4che.net.ActiveAssociation;
import org.dcm4che.net.Association;
import org.dcm4che.net.AssociationFactory;
import org.dcm4che.net.Dimse;
import org.dcm4che.net.ExtNegotiation;
import org.dcm4che.net.FutureRSP;
import org.dcm4che.net.PDU;
import org.dcm4che.util.DcmURL;
import org.dcm4che.util.SSLContextAdapter;

/**
 *
 * @author  gunter.zeilinger@tiani.com
 * @since      7 Nov 2004
 * @version    $Revision: 1.3 $ $Date: 2005/10/05 16:26:14 $
 */
public class MoveScu {

    // Constants -----------------------------------------------------

    private static final byte[] RELATIONAL = new byte[] { 1};

    private static final String[] DEF_TS = { UIDs.ImplicitVRLittleEndian};

    private static final int PCID_ECHO = 1;

    private static final int PCID_PR_MOVE = 3;

    private static final int PCID_SR_MOVE = 5;

    private static final int PCID_PSO_MOVE = 7;

    private abstract class InfoModel {

        final int pcid;

        final String cuid;

        InfoModel(int pcid, String cuid) {
            this.pcid = pcid;
            this.cuid = cuid;
        }

        abstract boolean applicable(Association as);
        
        boolean ajustKeysIfApplicable(Association as) {
            if (!applicable(as)) return false;
            adjustKeys();
            return true;
        }
        
        void adjustKeys() {};
    }

    private final InfoModel patientRoot = new InfoModel(PCID_PR_MOVE,
            UIDs.PatientRootQueryRetrieveInformationModelMOVE) {

        boolean applicable(Association as) {
            if (as.getAcceptedTransferSyntaxUID(pcid) == null) return false;
            if ("PATIENT".equals(level)) return true;
            if (keys.contains(Tags.PatientID)) {
                if ("STUDY".equals(level)) return true;
                if (keys.contains(Tags.StudyInstanceUID)) {
                    if ("SERIES".equals(level)) return true;
                    if (keys.contains(Tags.SeriesInstanceUID)) return true;
                }
            }
            ExtNegotiation extNeg = as.getAAssociateAC()
                    .getExtNegotiation(cuid);
            return extNeg != null && extNeg.info()[0] == 1;
        }

    };
    
    private final InfoModel studyRoot = new InfoModel(PCID_SR_MOVE,
            UIDs.StudyRootQueryRetrieveInformationModelMOVE) {

        boolean applicable(Association as) {
            if ("PATIENT".equals(level)) return false;
            if (as.getAcceptedTransferSyntaxUID(pcid) == null) return false;
            if ("STUDY".equals(level)) return true;
            if (keys.contains(Tags.StudyInstanceUID)) {
                if ("SERIES".equals(level)) return true;
                if (keys.contains(Tags.SeriesInstanceUID)) return true;
            }
            ExtNegotiation extNeg = as.getAAssociateAC()
                    .getExtNegotiation(cuid);
            return extNeg != null && extNeg.info()[0] == 1;
        }

        void adjustKeys() {
            keys.remove(Tags.PatientID);
            keys.remove(Tags.IssuerOfPatientID);
            };
    };
    
    private final InfoModel patientStudyOnly = new InfoModel(PCID_PSO_MOVE,
            UIDs.PatientStudyOnlyQueryRetrieveInformationModelMOVE) {

        boolean applicable(Association as) {
            if ("SERIES".equals(level)) return false;
            if ("IMAGE".equals(level)) return false;
            if (as.getAcceptedTransferSyntaxUID(pcid) == null) return false;
            if ("PATIENT".equals(level)) return true;
            if (keys.contains(Tags.PatientID)) return true;
            ExtNegotiation extNeg = as.getAAssociateAC()
                    .getExtNegotiation(cuid);
            return extNeg != null && extNeg.info()[0] == 1;
        }

    };

    // Attributes ----------------------------------------------------
    static final Logger log = Logger.getLogger("MoveScu");

    /*private static ResourceBundle messages = ResourceBundle
            .getBundle("MoveScu", Locale.getDefault());*/

    private static final UIDDictionary uidDict = DictionaryFactory
            .getInstance().getDefaultUIDDictionary();

    private static final AssociationFactory aFact = AssociationFactory
            .getInstance();

    private static final DcmObjectFactory oFact = DcmObjectFactory
            .getInstance();

    private DcmURL url = null;

    private int priority = Command.MEDIUM;

    private int acTimeout = 5000;

    private int dimseTimeout = 0;

    private int soCloseDelay = 500;

    private AAssociateRQ assocRQ = aFact.newAAssociateRQ();

    private Dataset keys = oFact.newDataset();

    private String dest;

    private String level;

    private boolean move = false;

    private boolean packPDVs = false;

    private String infoModel = "SR";

    private SSLContextAdapter tls = null;

    private String[] cipherSuites = null;

    private ActiveAssociation activeAssociation = null;

    // Static --------------------------------------------------------
    private static final LongOpt[] LONG_OPTS = new LongOpt[] {
            new LongOpt("pid", LongOpt.REQUIRED_ARGUMENT, null, 'd'),
            new LongOpt("issuer", LongOpt.REQUIRED_ARGUMENT, null, 'I'),
            new LongOpt("suid", LongOpt.REQUIRED_ARGUMENT, null, 's'),
            new LongOpt("Suid", LongOpt.REQUIRED_ARGUMENT, null, 'S'),
            new LongOpt("iuid", LongOpt.REQUIRED_ARGUMENT, null, 'i'),
            new LongOpt("dest", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("info-model", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("ac-timeout", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("dimse-timeout", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("so-close-delay", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("prior-high", LongOpt.NO_ARGUMENT, null, 'P'),
            new LongOpt("prior-low", LongOpt.NO_ARGUMENT, null, 'p'),
            new LongOpt("relational", LongOpt.NO_ARGUMENT, null, 'R'),
            new LongOpt("hierachical", LongOpt.NO_ARGUMENT, null, 'H'),
            new LongOpt("max-pdu-len", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("max-op-invoked", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("pack-pdvs", LongOpt.NO_ARGUMENT, null, 'k'),
            new LongOpt("tls-key", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("tls-key-passwd", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("tls-cacerts", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("tls-cacerts-passwd", LongOpt.REQUIRED_ARGUMENT, null,
                    2), new LongOpt("ts", LongOpt.REQUIRED_ARGUMENT, null, 2),
            new LongOpt("help", LongOpt.NO_ARGUMENT, null, 'h'),
            new LongOpt("version", LongOpt.NO_ARGUMENT, null, 'v'),};

    public static void main(String args[]) throws Exception {
        Getopt g = new Getopt("movescu", args, "", LONG_OPTS);

        Configuration cfg = new Configuration(MoveScu.class
                .getResource("/resources/movescu.cfg"));
        String pid = null;
        String issuer = null;
        ArrayList suids = new ArrayList();
        ArrayList serUids = new ArrayList();
        ArrayList iuids = new ArrayList();
        int c;
        while ((c = g.getopt()) != -1) {
            switch (c) {
            case 2:
                cfg.put(LONG_OPTS[g.getLongind()].getName(), g.getOptarg());
                break;
            case 'P':
                cfg.put("prior", "1");
                break;
            case 'p':
                cfg.put("prior", "2");
                break;
            case 'R':
                cfg.put("ext-neg", "true");
                break;
            case 'H':
                cfg.put("ext-neg", "false");
                break;
            case 'k':
                cfg.put("pack-pdvs", "true");
                break;
            case 'd':
                pid = g.getOptarg();
                break;
            case 'I':
                issuer = g.getOptarg();
                break;
            case 's':
                suids.add(g.getOptarg());
                break;
            case 'S':
                serUids.add(g.getOptarg());
                break;
            case 'i':
                iuids.add(g.getOptarg());
                break;
            case 'v':
                exit("version", false);
            case 'h':
                exit("usage", false);
            case '?':
                exit(null, true);
                break;
            }
        }
        int optind = g.getOptind();
        int argc = args.length - optind;
        if (argc == 0) {
            exit("missing first arg", true);
        }
        try {
            MoveScu movescu = new MoveScu(cfg, new DcmURL(args[optind]), pid,
                    issuer, (String[]) suids.toArray(new String[suids.size()]),
                    (String[]) serUids.toArray(new String[serUids.size()]),
                    (String[]) iuids.toArray(new String[iuids.size()]));
            movescu.execute();
        } catch (IllegalArgumentException e) {
            exit(e.getMessage(), true);
        }
    }

    MoveScu(Configuration cfg, DcmURL url, String pid, String issuer,
            String[] suids, String[] serUids, String[] iuids) {
        this.url = url;
        //ApplicationContext.moveScuUrl=url;
        this.priority = Integer.parseInt(cfg.getProperty("prior", "0"));
        this.infoModel = cfg.getProperty("info-model", "StudyRoot");
        initAssocParam(cfg, url);
        initTLS(cfg);
        this.dest = cfg.getProperty("dest");
        this.move = dest != null
                && initKeys(pid, issuer, suids, serUids, iuids);
    }

    private boolean initKeys(String pid, String issuer, String[] suids,
            String[] serUids, String[] iuids) {
        if (pid != null && pid.length() > 0) {
            level = "PATIENT";
            keys.putLO(Tags.PatientID, pid);
            if (issuer != null && issuer.length() > 0)
                    keys.putLO(Tags.IssuerOfPatientID, issuer);
        }
        if (suids.length > 0) {
            level = "STUDY";
            keys.putUI(Tags.StudyInstanceUID, suids);
        }
        if (serUids.length > 0) {
            if (suids.length > 1)
                    throw new IllegalArgumentException("erruids");
            level = "SERIES";
            keys.putUI(Tags.SeriesInstanceUID, serUids);
        }
        if (iuids.length > 0) {
            if (serUids.length > 1)
                    throw new IllegalArgumentException("erruids");
            level = "IMAGE";
            keys.putUI(Tags.SOPInstanceUID, iuids);
        }
        if (level == null) return false;
        keys.putCS(Tags.QueryRetrieveLevel, level);
        return true;
    }

    private void execute() throws Exception {
        ActiveAssociation a = openAssoc();
        if (a != null) {
            try {
                if (move)
                    move(a);
                else
                    echo(a);
            } finally {
                a.release(true);
            }
        }
    }

    private void echo(ActiveAssociation a) throws Exception {
        if (a.getAssociation().getAcceptedTransferSyntaxUID(PCID_ECHO) == null) {
            log.error("noPCEcho");
        } else {
            Command cmd = oFact.newCommand();
            cmd.initCEchoRQ(1);
            Dimse echoRQ = aFact.newDimse(PCID_ECHO, cmd);
            a.invoke(echoRQ, null);
        }
    }

    private void move(ActiveAssociation a) throws Exception {
        Association as = a.getAssociation();
        int pcid = selectInfoModel(as);
        if (pcid > 0) {
            Command cmd = oFact.newCommand();
            String cuid = as.getProposedPresContext(pcid)
                    .getAbstractSyntaxUID();
            cmd.initCMoveRQ(1, cuid, priority, dest);
            Dimse moveRQ = aFact.newDimse(pcid, cmd, keys);
            FutureRSP rsp = a.invoke(moveRQ);
            rsp.get();
        } else {
            log.error("noPCMove");
        }
    }

    private int selectInfoModel(Association as) {
        if (infoModel.equals("PatientStudyOnly")) {
            if (patientStudyOnly.applicable(as))
                return patientStudyOnly.pcid;
            if (patientRoot.ajustKeysIfApplicable(as))
                return patientRoot.pcid;
            if (studyRoot.ajustKeysIfApplicable(as))
                return studyRoot.pcid;
        } else if (infoModel.equals("PatientRoot")) {
            if (patientRoot.ajustKeysIfApplicable(as))
                return patientRoot.pcid;
            if (studyRoot.ajustKeysIfApplicable(as))
                return studyRoot.pcid;
            if (patientStudyOnly.ajustKeysIfApplicable(as))
                return patientStudyOnly.pcid;
        } else {
            if (studyRoot.ajustKeysIfApplicable(as))
                return studyRoot.pcid;
            if (patientRoot.ajustKeysIfApplicable(as))
                return patientRoot.pcid;
            if (patientStudyOnly.ajustKeysIfApplicable(as))
                return patientStudyOnly.pcid;
        }
        return 0;
    }

    private ActiveAssociation openAssoc() throws IOException,
            GeneralSecurityException {
        Association assoc = aFact.newRequestor(newSocket(url.getHost(), url
                .getPort()));
        assoc.setAcTimeout(acTimeout);
        assoc.setDimseTimeout(dimseTimeout);
        assoc.setSoCloseDelay(soCloseDelay);
        assoc.setPackPDVs(packPDVs);
        PDU assocAC = assoc.connect(assocRQ);
        if (!(assocAC instanceof AAssociateAC)) { return null; }
        ActiveAssociation retval = aFact.newActiveAssociation(assoc, null);
        retval.start();
        return retval;
    }

    private Socket newSocket(String host, int port) throws IOException,
            GeneralSecurityException {
        if (cipherSuites != null) {
            return tls.getSocketFactory(cipherSuites).createSocket(host, port);
        } else {
            return new Socket(host, port);
        }
    }

    private static void exit(String prompt, boolean error) {
        if (prompt != null) System.err.println(prompt);
        if (error) System.err.println("try");
        //System.exit(1);
    }

    public static String maskNull(String aet) {
        return aet != null ? aet : "MAYAM";
    }

    private final void initAssocParam(Configuration cfg, DcmURL url) {
          //String[] s = ApplicationContext.databaseRef.getListenerDetails();
        acTimeout = Integer.parseInt(cfg.getProperty("ac-timeout", "5000"));
        dimseTimeout = Integer.parseInt(cfg.getProperty("dimse-timeout", "0"));
        soCloseDelay = Integer.parseInt(cfg
                .getProperty("so-close-delay", "500"));
        assocRQ.setCalledAET(url.getCalledAET());
        assocRQ.setCallingAET(maskNull("OVIYAM2"));
        assocRQ.setMaxPDULength(Integer.parseInt(cfg.getProperty("max-pdu-len",
                "16352")));
        assocRQ.setAsyncOpsWindow(aFact.newAsyncOpsWindow(Integer.parseInt(cfg
                .getProperty("max-op-invoked", "0")), 1));
        packPDVs = "true".equalsIgnoreCase(cfg
                .getProperty("pack-pdvs", "false"));
        assocRQ.addPresContext(aFact.newPresContext(PCID_ECHO,
                UIDs.Verification,
                DEF_TS));
        List tsNames = cfg.tokenize(cfg.getProperty("ts"), new LinkedList());
        String[] tsUIDs = new String[tsNames.size()];
        Iterator it = tsNames.iterator();
        for (int i = 0; i < tsUIDs.length; ++i) {
            tsUIDs[i] = UIDs.forName((String) it.next());
        }
        assocRQ.addPresContext(aFact.newPresContext(PCID_PR_MOVE,
                UIDs.PatientRootQueryRetrieveInformationModelMOVE,
                tsUIDs));
        assocRQ.addPresContext(aFact.newPresContext(PCID_SR_MOVE,
                UIDs.StudyRootQueryRetrieveInformationModelMOVE,
                tsUIDs));
        assocRQ.addPresContext(aFact.newPresContext(PCID_PSO_MOVE,
                UIDs.PatientStudyOnlyQueryRetrieveInformationModelMOVE,
                tsUIDs));
        final boolean extNeg = "true".equalsIgnoreCase(cfg
                .getProperty("ext-neg", "true"));
        if (extNeg) {
            assocRQ
                    .addExtNegotiation(aFact
                            .newExtNegotiation(UIDs.PatientRootQueryRetrieveInformationModelMOVE,
                                    RELATIONAL));
            assocRQ
                    .addExtNegotiation(aFact
                            .newExtNegotiation(UIDs.StudyRootQueryRetrieveInformationModelMOVE,
                                    RELATIONAL));
            assocRQ
                    .addExtNegotiation(aFact
                            .newExtNegotiation(UIDs.PatientStudyOnlyQueryRetrieveInformationModelMOVE,
                                    RELATIONAL));
        }
    }

    private void initTLS(Configuration cfg) {
        try {
            cipherSuites = url.getCipherSuites();
            if (cipherSuites == null) { return; }
            tls = SSLContextAdapter.getInstance();
            char[] keypasswd = cfg.getProperty("tls-key-passwd", "secret")
                    .toCharArray();
            tls.setKey(tls.loadKeyStore(MoveScu.class.getResource(cfg
                    .getProperty("tls-key", "identity.p12")), keypasswd),
                    keypasswd);
            tls
                    .setTrust(tls.loadKeyStore(MoveScu.class.getResource(cfg
                            .getProperty("tls-cacerts", "cacerts.jks")), cfg
                            .getProperty("tls-cacerts-passwd", "secret")
                            .toCharArray()));
            tls.init();
        } catch (Exception ex) {
            throw new RuntimeException(
                    "Could not initalize TLS configuration: ", ex);
        }
    }

}
