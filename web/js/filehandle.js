function viewImage(fileName, container) {
	if(fileName.indexOf(".pdf") == -1) {
		jQuery(container).attr('sopUID', fileName.substring(0, fileName.indexOf('.jpg')));
	} else {
		jQuery(container).attr('sopUID', fileName.substring(0, fileName.indexOf('.jpg')));
	}

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
        fs.root.getFile(fileName, {}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    var img = document.createElement("img");
                    if(fileName.indexOf(".pdf") == -1) {
                    	img.src = reader.result;
                    }
                    if(container.name == '1.2.840.10008.5.1.4.1.1.104.1') {
                    	container.src = 'images/pdf.png';
                    } else {
                    	container.src = img.src;
                    }
                };
                reader.readAsDataURL(file);
            }, fileHandler);
        }, fileHandler);
    }, fileHandler);
}

function fileHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };

    console.log('Error: ' + msg);
}
