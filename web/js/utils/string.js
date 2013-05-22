/**
 * @namespace Utils classes and functions.
 */
ovm.utils = ovm.utils || {};

/**
 * @function Capitalise the first letter of a string.
 */
ovm.utils.capitaliseFirstLetter = function(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
};
