package de.iftm.dcm4che.services;

import org.dcm4che2.data.DicomObject;

import in.raster.oviyam.util.IDataSet;

public class DcmDataSet implements IDataSet {
	
	private DicomObject _dicomObject;
	public DcmDataSet(DicomObject dicomObject)
	{
		_dicomObject = dicomObject;
	}

	@Override
	public String getString(int tag) {
		return _dicomObject.getString(tag);
	}

	@Override
	public String[] getStrings(int tag) {
		return _dicomObject.getStrings(tag);
	}

}
