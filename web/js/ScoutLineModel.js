function ScoutLineModel(seriesUid) {
    this.seriesUid = seriesUid;
    this.imgPosition = null;
    this.imgOrientation = null;
    this.pixelSpacing = null;
    this.rows = null;
    this.columns = null;
    this.instanceNo = null;

    this.getImgPosition = function() {
        return this.imgPosition;
    }

    this.getImgOrientation = function() {
        return this.imgOrientation;
    }

    this.getPixelSpacing = function() {
        return this.pixelSpacing;
    }

    this.getRows = function() {
        return this.rows;
    }

    this.getColumns = function() {
        return this.columns;
    }
}

ScoutLineModel.prototype.getValues = function(slicePosition, imageType) {
    var sql = "";
    if(slicePosition == "First")
        sql = "select min(InstanceNo) as InsNumber from instance where SeriesInstanceUID='" + this.seriesUid + "' and ImageType='" + imageType + "'";
    else if(slicePosition == "Last")
        sql = "select max(InstanceNo) as InsNumber from instance where SeriesInstanceUID='" + this.seriesUid + "' and ImageType='" + imageType + "'";
    else
        return;

    var that = this;
    var myDb = initDB();
    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], function(trans, res) {
            var row = res.rows.item(0);
            that.instanceNo = row['InsNumber'];
            that.readValues();
        }, errorHandler);
    });
}

ScoutLineModel.prototype.readValues = function() {
    var sql = "select ImagePosition, ImageOrientPatient, PixelSpacing, Rows, Columns from instance where InstanceNo='" + this.instanceNo + "' and SeriesInstanceUID='" + this.seriesUid + "'";
    var that = this;
    var myDb = initDB();
    myDb.transaction(function(tx) {
        tx.executeSql(sql, [], function(trans, res) {
            var row = res.rows.item(0);
            that.imgPosition = row['ImagePosition'];
            that.imgOrientation = row['ImageOrientPatient'];
            that.pixelSpacing = row['PixelSpacing'];
            that.rows = row['Rows'];
            that.columns = row['Columns'];

           	var frames = jQuery(parent.document).find('iframe');
           	var modality;
           	for(var k=0; k<frames.length; k++) {
           		if(jQuery(frames[k]).contents().find('html').css('border') == '2px solid rgb(0, 255, 0)') {
           			modality = jQuery(frames[k]).contents().find('#modalityDiv').html();
           			break;
           		}
           	}
          	if(modality.indexOf("CT") >= 0) {
            	projectScoutLine(that);
            } else if(modality.indexOf("MR") >= 0) {
            	projectScoutLineMR(that);
            }
        }, errorHandler);
    });
}