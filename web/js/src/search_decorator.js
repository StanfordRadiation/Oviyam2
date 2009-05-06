Event.onDOMReady(function() {
	
	var inputs = document.getElementsByTagName('input');
	
	for (var i = 0; i < inputs.length; i++) {
		if(Element.hasClassName(inputs[i], 'prettysearch')) {
			
			var options = {};
			
			//these are unique autosave names for globally used
			//autosave collections
			
			//after decoration you can simply:
			//	field.setAttribute('autosave', 'autosaveName');
			
			if(Element.hasClassName(inputs[i],'applesearch')) {
				options.autosave = 'Apple.com';
			} else if (Element.hasClassName(inputs[i], 'reseller')) {
				options.autosave = 'Apple.com Reseller';
			}
			
			if(inputs[i].parentNode.tagName == 'LABEL') {
				
				var placeholderText = "";
				
				var labelElement = Element.getElementsByClassName(inputs[i].parentNode, 'prettyplaceholder')[0];
				
				//either grab text in a classed element
				if(labelElement) {
					placeholderText = labelElement.innerHTML;
				
				//or grab text from right inside the label
				} else {
					placeholderText = inputs[i].parentNode.firstChild.nodeValue;
					inputs[i].parentNode.firstChild.nodeValue = '';
				}
				
				placeholderText = placeholderText.split('\n')[0];
				options.placeholder = placeholderText;

			}
			
			AC.decorateSearchInput(inputs[i], options);
		}
	}	
});