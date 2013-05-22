/**
 * @namespace HTML related.
 */
ovm.html = ovm.html || {};

/**
 * @function Get an HTML table corresponding to an input javascript array. 
 * @param input The input can be either a 1D array, 
 *               2D array, an array of objects or an object.
 */
ovm.html.appendCell = function(row, text)
{
    var cell = row.insertCell(-1);
    cell.appendChild(document.createTextNode(text));
};

/**
 * @function
 */
ovm.html.appendRowForArray = function(table, input, level, maxLevel, rowHeader)
{
    var row = null;
    // loop through
    for(var i=0; i<input.length; ++i) {
        // more to come
        if( typeof input[i] === 'number'
            || typeof input[i] === 'string'
            || input[i] === null
            || input[i] === undefined
            || level >= maxLevel ) {
            if( !row ) {
                row = table.insertRow(-1);
            }
            ovm.html.appendCell(row, input[i]);
        }
        // last level
        else {
            ovm.html.appendRow(table, input[i], level+i, maxLevel, rowHeader);
        }
    }
};

/**
 * @function
 */
ovm.html.appendRowForObject = function(table, input, level, maxLevel, rowHeader)
{
    var keys = Object.keys(input);
    var row = null;
    for( var o=0; o<keys.length; ++o ) {
        // more to come
        if( typeof input[keys[o]] === 'number' 
            || typeof input[keys[o]] === 'string'
            || input[keys[o]] === null
            || input[keys[o]] === undefined
            || level >= maxLevel ) {
            if( !row ) {
                row = table.insertRow(-1);
            }
            if( o === 0 && rowHeader) {
                ovm.html.appendCell(row, rowHeader);
            }
            ovm.html.appendCell(row, input[keys[o]]);
        }
        // last level
        else {
            ovm.html.appendRow(table, input[keys[o]], level+o, maxLevel, keys[o]);
        }
    }
    // header row
    // warn: need to create the header after the rest
    // otherwise the data will inserted in the thead...
    if( level === 2 ) {
        var header = table.createTHead();
        var th = header.insertRow(-1);
        if( rowHeader ) {
            ovm.html.appendCell(th, "");
        }
        for( var k=0; k<keys.length; ++k ) {
            ovm.html.appendCell(th, ovm.utils.capitaliseFirstLetter(keys[k]));
        }
    }
};

/**
 * @function
 */
ovm.html.appendRow = function(table, input, level, maxLevel, rowHeader)
{
    // array
    if( input instanceof Array ) {
        ovm.html.appendRowForArray(table, input, level+1, maxLevel, rowHeader);
    }
    // object
    else if( typeof input === 'object') {
        ovm.html.appendRowForObject(table, input, level+1, maxLevel, rowHeader);
    }
};

/**
 * @function
 */
ovm.html.toTable = function(input)
{
    var table = document.createElement('table');
    ovm.html.appendRow(table, input, 0, 2);
    return table;
};

/**
 * @function
 * @param term
 * @param table
 */
ovm.html.filterTable = function(term, table) {
    // de-highlight
    ovm.html.dehighlight(table);
    // split search terms
    var terms = term.value.toLowerCase().split(" ");

    // search
    var text = 0;
    var display = 0;
    for (var r = 1; r < table.rows.length; ++r) {
        display = '';
        for (var i = 0; i < terms.length; ++i) {
            text = table.rows[r].innerHTML.replace(/<[^>]+>/g, "").toLowerCase();
            if (text.indexOf(terms[i]) < 0) {
                display = 'none';
            } else {
                if (terms[i].length) {
                    ovm.html.highlight(terms[i], table.rows[r]);
                }
            }
            table.rows[r].style.display = display;
        }
    }
};

/**
 * @function Transform back each
 * <span>preText <span class="highlighted">term</span> postText</span>
 * into its original preText term postText
 * @param container The container to de-highlight.
 */
ovm.html.dehighlight = function(container) {
    for (var i = 0; i < container.childNodes.length; i++) {
        var node = container.childNodes[i];

        if (node.attributes 
                && node.attributes['class']
                && node.attributes['class'].value === 'highlighted') {
            node.parentNode.parentNode.replaceChild(
                    document.createTextNode(
                        node.parentNode.innerHTML.replace(/<[^>]+>/g, "")),
                    node.parentNode);
            // Stop here and process next parent
            return;
        } else if (node.nodeType !== 3) {
            // Keep going onto other elements
            ovm.html.dehighlight(node);
        }
    }
};

/**
 * @function Create a
 * <span>preText <span class="highlighted">term</span> postText</span>
 * around each search term
 * @param term The term to highlight.
 * @param container The container where to highlight the term.
 */
ovm.html.highlight = function(term, container) {
    for (var i = 0; i < container.childNodes.length; i++) {
        var node = container.childNodes[i];

        if (node.nodeType === 3) {
            // Text node
            var data = node.data;
            var data_low = data.toLowerCase();
            if (data_low.indexOf(term) >= 0) {
                //term found!
                var new_node = document.createElement('span');
                node.parentNode.replaceChild(new_node, node);

                var result;
                while ((result = data_low.indexOf(term)) !== -1) {
                    // before term
                    new_node.appendChild(document.createTextNode(
                                data.substr(0, result)));
                    // term
                    new_node.appendChild(ovm.html.createHighlightNode(
                                document.createTextNode(data.substr(
                                        result, term.length))));
                    // reduce search string
                    data = data.substr(result + term.length);
                    data_low = data_low.substr(result + term.length);
                }
                new_node.appendChild(document.createTextNode(data));
            }
        } else {
            // Keep going onto other elements
            ovm.html.highlight(term, node);
        }
    }
};

/**
 * @function
 */
ovm.html.createHighlightNode = function(child) {
    var node = document.createElement('span');
    node.setAttribute('class', 'highlighted');
    node.attributes['class'].value = 'highlighted';
    node.appendChild(child);
    return node;
};
