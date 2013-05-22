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

import java.io.InputStream;
import java.io.IOException;
import java.net.URL;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.StringTokenizer;

/**
 * <description> 
 *
 * @see <related>
 * @author  <a href="mailto:gunter@tiani.com">gunter zeilinger</a>
 * @version $Revision: 1.2 $ $Date: 2005/10/05 16:26:14 $
 *   
 * <p><b>Revisions:</b>
 *
 * <p><b>yyyymmdd author:</b>
 * <ul>
 * <li> explicit fix description (no line numbers but methods) go 
 *            beyond the cvs commit message
 * </ul>
 */
class Configuration extends Properties
{
   // Constants -----------------------------------------------------
   
   // Attributes ----------------------------------------------------
   
   // Static --------------------------------------------------------  
   private static String replace(String val, String from, String to) {
      return from.equals(val) ? to : val;
   }
   
   // Constructors --------------------------------------------------
   public Configuration(URL url) {
      InputStream in = null;
      try {
         load(in = url.openStream());
      } catch (Exception e) {
         throw new RuntimeException("Could not load configuration from "
               + url, e);
      } finally {
         if (in != null) {
            try { in.close(); } catch (IOException ignore) {ignore.printStackTrace();}
         }
      }
   }
   
   // Public --------------------------------------------------------
   public String getProperty(String key, String defaultValue,
                             String replace, String to) {
      return replace(getProperty(key, defaultValue), replace, to);
   }
   
   public List tokenize(String s, List result) {
      StringTokenizer stk = new StringTokenizer(s, ", ");
      while (stk.hasMoreTokens()) {
         String tk = stk.nextToken();
         if (tk.startsWith("$")) {
            tokenize(getProperty(tk.substring(1),""), result);
         } else {
            result.add(tk);
         }
      }
      return result;
   }
   
   public String[] tokenize(String s) {
      if (s == null)
         return null;
      
      List l = tokenize(s, new LinkedList());      
      return (String[])l.toArray(new String[l.size()]);
   }
       
}
