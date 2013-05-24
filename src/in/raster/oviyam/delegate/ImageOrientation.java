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

package in.raster.oviyam.delegate;

/**
 * A class of static methods to provide descriptions of images, including image orientation
 * relative to the patient from the mathematical position and orientation attributes
 */
public class ImageOrientation {

    private static final double obliquityThresholdCosineValue = 0.8;

    /**
     * <p>Get a label describing the major axis from a unit vector (direction cosine) as found in ImageOrientationPatient.</p>
     *
     * <p>Some degree of deviation from one of the standard orthogonal axes is allowed before deciding no major axis applies and returning null.</p>
     *
     * @param   x
     * @param   y
     * @param   z
     * @return        the string describing the orientation of the vector, or null if oblique
     */
    public static final String getMajorAxisFromPatientRelativeDirectionCosine(double x,double y,double z) {
        String axis = null;

        String orientationX = x < 0 ? "R" : "L";
        String orientationY = y < 0 ? "A" : "P";
        String orientationZ = z < 0 ? "F" : "H";

        double absX = Math.abs(x);
        double absY = Math.abs(y);
        double absZ = Math.abs(z);

        // The tests here really don't need to check the other dimensions,
        // just the threshold, since the sum of the squares should be == 1.0
        // but just in case ...

        if (absX>obliquityThresholdCosineValue && absX>absY && absX>absZ) {
            axis=orientationX;
        } else if (absY>obliquityThresholdCosineValue && absY>absX && absY>absZ) {
            axis=orientationY;
        } else if (absZ>obliquityThresholdCosineValue && absZ>absX && absZ>absY) {
            axis=orientationZ;
        }

        return axis;
    }

    /**
     * <p>Get a label describing the axial, coronal or sagittal plane from row and column unit vectors (direction cosines) as found in ImageOrientationPatient.</p>
     *
     * <p>Some degree of deviation from one of the standard orthogonal planes is allowed before deciding the plane is OBLIQUE.</p>
     *
     * @param   rowX
     * @param   rowY
     * @param   rowZ
     * @param   colX
     * @param   colY
     * @param   colZ
     * @return        the string describing the plane of orientation, AXIAL, CORONAL, SAGITTAL or OBLIQUE
     */
    public static final String makeImageOrientationLabelFromImageOrientationPatient(
        double rowX,double rowY,double rowZ,
        double colX,double colY,double colZ) {
        String label = null;
        String rowAxis = getMajorAxisFromPatientRelativeDirectionCosine(rowX,rowY,rowZ);
        String colAxis = getMajorAxisFromPatientRelativeDirectionCosine(colX,colY,colZ);
        if (rowAxis != null && colAxis != null) {
            if ((rowAxis.equals("R") || rowAxis.equals("L")) && (colAxis.equals("A") || colAxis.equals("P")))
                label="AXIAL";
            else if ((colAxis.equals("R") || colAxis.equals("L")) && (rowAxis.equals("A") || rowAxis.equals("P")))
                label="AXIAL";
            else if ((rowAxis.equals("R") || rowAxis.equals("L")) && (colAxis.equals("H") || colAxis.equals("F")))
                label="CORONAL";
            else if ((colAxis.equals("R") || colAxis.equals("L")) && (rowAxis.equals("H") || rowAxis.equals("F")))
                label="CORONAL";
            else if ((rowAxis.equals("A") || rowAxis.equals("P")) && (colAxis.equals("H") || colAxis.equals("F")))
                label="SAGITTAL";
            else if ((colAxis.equals("A") || colAxis.equals("P")) && (rowAxis.equals("H") || rowAxis.equals("F"))) label="SAGITTAL";
        } else {
            label="OBLIQUE";
        }
        return label;
    }

    /**
     * <p>Get a PatientOrientation style string from a unit vector (direction cosine) as found in ImageOrientationPatient.</p>
     *
     * <p>Returns letters representing R (right) or L (left), A (anterior) or P (posterior), F (feet) or H (head).</p>
     *
     * <p>If the orientation is not precisely orthogonal to one of the major axes,
     * more than one letter is returned, from major to minor axes, with up to three
     * letters in the case of a "double oblique".</p>
     *
     * @param   x
     * @param   y
     * @param   z
     * @return        the string describing the orientation of the vector
     */
    public static final String makePatientOrientationFromPatientRelativeDirectionCosine(double x,double y,double z) {
        StringBuffer buffer = new StringBuffer();

        String orientationX = x < 0 ? "R" : "L";
        String orientationY = y < 0 ? "A" : "P";
        String orientationZ = z < 0 ? "F" : "H";

        double absX = Math.abs(x);
        double absY = Math.abs(y);
        double absZ = Math.abs(z);

        for (int i=0; i<3; ++i) {
            if (absX>.0001 && absX>absY && absX>absZ) {
                buffer.append(orientationX);
                absX=0;
            } else if (absY>.0001 && absY>absX && absY>absZ) {
                buffer.append(orientationY);
                absY=0;
            } else if (absZ>.0001 && absZ>absX && absZ>absY) {
                buffer.append(orientationZ);
                absZ=0;
            } else break;
        }

        return buffer.toString();
    }

    public static String getOrientation(String imageOrientation) {
        String imageOrientationArray[], imgOrientation[];
        imageOrientationArray = imageOrientation.split("\\\\");
        float _imgRowCosx = Float.parseFloat(imageOrientationArray[0]);
        float _imgRowCosy = Float.parseFloat(imageOrientationArray[1]);
        float _imgRowCosz = Float.parseFloat(imageOrientationArray[2]);
        float _imgColCosx = Float.parseFloat(imageOrientationArray[3]);
        float _imgColCosy = Float.parseFloat(imageOrientationArray[4]);
        float _imgColCosz = Float.parseFloat(imageOrientationArray[5]);

        imgOrientation = new String[2];
        imgOrientation[0] = makePatientOrientationFromPatientRelativeDirectionCosine(_imgRowCosx, _imgRowCosy, _imgRowCosz);
        imgOrientation[1] = makePatientOrientationFromPatientRelativeDirectionCosine(_imgColCosx, _imgColCosy, _imgColCosz);

        String plane = makeImageOrientationLabelFromImageOrientationPatient(_imgRowCosx, _imgRowCosy, _imgRowCosz, _imgColCosx, _imgColCosy, _imgColCosz);
        if(plane.equalsIgnoreCase("SAGITTAL")) {
            imgOrientation[1] = imgOrientation[1].replace("H", "S");
            imgOrientation[1] = imgOrientation[1].replace("F", "I");
        }

        return(imgOrientation[0].substring(0, Math.min(imgOrientation[0].length(), 2)) + "\\" +
                imgOrientation[1].substring(0, Math.min(imgOrientation[1].length(), 2)));

    }
}
