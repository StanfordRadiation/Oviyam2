

//
//  Cookie Functions -- "Night of the Living Cookie" Version (25-Jul-96)
//
//  Written by:  Bill Dortch, hIdaho Design <bdortch@hidaho.com>
//  The following functions are released to the public domain.
//
//  This version takes a more aggressive approach to deleting
//  cookies.  Previous versions set the expiration date to one
//  millisecond prior to the current time; however, this method
//  did not work in Netscape 2.02 (though it does in earlier and
//  later versions), resulting in "zombie" cookies that would not
//  die.  deleteCookie now sets the expiration date to the earliest
//  usable date (one second into 1970), and sets the cookie's value
//  to null for good measure.
//
//  Also, this version adds optional path and domain parameters to
//  the deleteCookie function.  If you specify a path and/or domain
//  when creating (setting) a cookie**, you must specify the same
//  path/domain when deleting it, or deletion will not occur.
//
//  The fixCookieDate function must now be called explicitly to
//  correct for the 2.x Mac date bug.  This function should be
//  called *once* after a Date object is created and before it
//  is passed (as an expiration date) to setCookie.  Because the
//  Mac date bug affects all dates, not just those passed to
//  setCookie, you might want to make it a habit to call
//  fixCookieDate any time you create a new Date object:
//
//    var theDate = new Date();
//    fixCookieDate (theDate);
//
//  Calling fixCookieDate has no effect on platforms other than
//  the Mac, so there is no need to determine the user's platform
//  prior to calling it.
//
//  This version also incorporates several minor coding improvements.
//
//  **Note that it is possible to set multiple cookies with the same
//  name but different (nested) paths.  For example:
//
//    setCookie ("color","red",null,"/outer");
//    setCookie ("color","blue",null,"/outer/inner");
//
//  However, getCookie cannot distinguish between these and will return
//  the first cookie that matches a given name.  It is therefore
//  recommended that you *not* use the same name for cookies with
//  different paths.  (Bear in mind that there is *always* a path
//  associated with a cookie; if you don't explicitly specify one,
//  the path of the setting document is used.)
//  
//  Revision History:
//
//    "Toss Your Cookies" Version (22-Mar-96)
//      - Added fixCookieDate() function to correct for Mac date bug
//
//    "Second Helping" Version (21-Jan-96)
//      - Added path, domain and secure parameters to setCookie
//      - Replaced home-rolled encode/decode functions with Netscape's
//        new (then) escape and unescape functions
//
//    "Free Cookies" Version (December 95)
//
//
//  For information on the significance of cookie parameters, and
//  and on cookies in general, please refer to the official cookie
//  spec, at:
//
//      http://www.netscape.com/newsref/std/cookie_spec.html    
//
//  MODIFIED BY Dr Nic Williams
//  Added: wrapper module for functions to protect namespace
//  Changed: lowercase first letter of method names; SetCookie -> setCookie
//******************************************************************
//
// "Internal" function to return the decoded value of a cookie
//

var Cookies = {
  getCookieVal: function(offset) {
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1)
      endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
  },

  //  Function to correct for 2.x Mac date bug.  Call this function to
  //  fix a date object prior to passing it to setCookie.
  //  IMPORTANT:  This function should only be called *once* for
  //  any given date object!  See example at the end of this document.
  //
  fixCookieDate: function(date) {
    var base = new Date(0);
    var skew = base.getTime(); // dawn of (Unix) time - should be 0
    if (skew > 0)  // Except on the Mac - ahead of its time
      date.setTime (date.getTime() - skew);
  },

  //  Function to return the value of the cookie specified by "name".
  //    name - String object containing the cookie name.
  //    returns - String object containing the cookie value, or null if
  //      the cookie does not exist.
  //
  getCookie: function(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
      var j = i + alen;
      if (document.cookie.substring(i, j) == arg)
        return Cookies.getCookieVal (j);
      i = document.cookie.indexOf(" ", i) + 1;
      if (i == 0) break; 
    }
    return null;
  },
  //
  //  Function to create or update a cookie.
  //    name - String object containing the cookie name.
  //    value - String object containing the cookie value.  May contain
  //      any valid string characters.
  //    [expires] - Date object containing the expiration data of the cookie.  If
  //      omitted or null, expires the cookie at the end of the current session.
  //    [path] - String object indicating the path for which the cookie is valid.
  //      If omitted or null, uses the path of the calling document.
  //    [domain] - String object indicating the domain for which the cookie is
  //      valid.  If omitted or null, uses the domain of the calling document.
  //    [secure] - Boolean (true/false) value indicating whether cookie transmission
  //      requires a secure channel (HTTPS).  
  //
  //  The first two parameters are required.  The others, if supplied, must
  //  be passed in the order listed above.  To omit an unused optional field,
  //  use null as a place holder.  For example, to call setCookie using name,
  //  value and path, you would code:
  //
  //      setCookie ("myCookieName", "myCookieValue", null, "/");
  //
  //  Note that trailing omitted parameters do not require a placeholder.
  //
  //  To set a secure cookie for path "/myPath", that expires after the
  //  current session, you might code:
  //
  //      setCookie (myCookieVar, cookieValueVar, null, "/myPath", null, true);
  //
  setCookie: function(name,value,expires,path,domain,secure) {
    document.cookie = name + "=" + escape (value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  },
  
  //  Function to delete a cookie. (Sets expiration date to start of epoch)
  //    name -   String object containing the cookie name
  //    path -   String object containing the path of the cookie to delete.  This MUST
  //             be the same as the path used to create the cookie, or null/omitted if
  //             no path was specified when creating the cookie.
  //    domain - String object containing the domain of the cookie to delete.  This MUST
  //             be the same as the domain used to create the cookie, or null/omitted if
  //             no domain was specified when creating the cookie.
  //
  deleteCookie: function(name,path,domain) {
    if (Cookies.getCookie(name)) {
      document.cookie = name + "=" +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
  }
}

//
//  Examples - Unremark if you want to see how this code works
/*
var expdate = new Date ();
Cookies.fixCookieDate (expdate); // Correct for Mac date bug - call only once for given Date object!
expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000)); // 24 hrs from now 
Cookies.setCookie ("ccpath", "http://www.hidaho.com/colorcenter/", expdate);
Cookies.setCookie ("ccname", "hIdaho Design ColorCenter", expdate);
Cookies.setCookie ("tempvar", "This is a temporary cookie.");
Cookies.setCookie ("ubiquitous", "This cookie will work anywhere in this domain",null,"/");
Cookies.setCookie ("paranoid", "This cookie requires secure communications",expdate,"/",null,true);
Cookies.setCookie ("goner", "This cookie must die!");
document.write (document.cookie + "<br>");
Cookies.deleteCookie ("goner");
document.write (document.cookie + "<br>");
document.write ("ccpath = " + Cookies.getCookie("ccpath") + "<br>");
document.write ("ccname = " + Cookies.getCookie("ccname") + "<br>");
document.write ("tempvar = " + Cookies.getCookie("tempvar") + "<br>");
*/

