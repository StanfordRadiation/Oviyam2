/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.oviyam.xml.model;

import org.simpleframework.xml.Element;
import org.simpleframework.xml.Root;

/**
 * 8 Apr, 2013
 *
 * @author sathees
 */
@Root
public class Language {

    @Element(name = "lang")
    private String language;
    
    @Element(name = "country")
    private String country;
    
    @Element(name = "localeID")
    private String localeID;
    
    @Element(name = "selected")
    private boolean selected;

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getLocaleID() {
        return localeID;
    }

    public void setLocaleID(String localeID) {
        this.localeID = localeID;
    }
}
