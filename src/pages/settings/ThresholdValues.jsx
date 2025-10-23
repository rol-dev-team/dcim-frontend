import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchThresholdValues,
  fetchThresholdValue,
  createThresholdValue,
  updateThresholdValue,
  deleteThresholdValue
} from '../../api/thresholdValueApi';
import { fetchSensorsByDevice } from '../../api/sensorListApi';
import { fetchThresholdTypes } from '../../api/thresholdTypeApi';
import { fetchDataCenters } from '../../api/settings/dataCenterApi';
import { fetchDevicesByDataCenter } from '../../api/deviceApi';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import its CSS
import * as XLSX from 'xlsx'; // Import xlsx library
import { saveAs } from 'file-saver'; // Import file-saver library
import CommonButton from '../../components/CommonButton'; // Adjust path as needed

const ThresholdValues = () => {
  const [allThresholdValues, setAllThresholdValues] = useState([]); // Stores all fetched threshold values
  const [currentThresholdValues, setCurrentThresholdValues] = useState([]); // Values for the current page
  const [dataCenters, setDataCenters] = useState([]);
  const [devices, setDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [thresholdTypes, setThresholdTypes] = useState([]);
  const [currentThreshold, setCurrentThreshold] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    data_center_id: '',
    device_id: '',
    sensor_id: '',
    threshold_type_id: '',
    threshold: '',
    timestamp: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [thresholdsPerPage] = useState(5); // Number of items to show per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [valuesResponse, centers, types] = await Promise.all([
          fetchThresholdValues(),
          fetchDataCenters(),
          fetchThresholdTypes()
        ]);

        const fetchedValues = Array.isArray(valuesResponse) ? valuesResponse : [];
        setAllThresholdValues(fetchedValues);
        setTotalPages(Math.ceil(fetchedValues.length / thresholdsPerPage));
        setCurrentThresholdValues(fetchedValues.slice(0, thresholdsPerPage)); // Set initial page values

        setDataCenters(centers);
        setThresholdTypes(types);
        setLoading(false);

        // If editing, load related devices and sensors
        if (isEditing && currentThreshold) {
          const deviceResponse = await fetchDevicesByDataCenter(currentThreshold.sensor?.device?.data_center_id);
          setDevices(deviceResponse);

          const allSensors = await fetchSensorsByDevice(currentThreshold.sensor?.device_id);
          const filteredSensors = allSensors.filter(sensor => sensor.trigger_type_id === 1);
          setSensors(filteredSensors);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isEditing, currentThreshold]);

  // Effect to update currentThresholdValues when currentPage or allThresholdValues changes
  useEffect(() => {
    const indexOfLastThreshold = currentPage * thresholdsPerPage;
    const indexOfFirstThreshold = indexOfLastThreshold - thresholdsPerPage;
    setCurrentThresholdValues(allThresholdValues.slice(indexOfFirstThreshold, indexOfLastThreshold));
  }, [currentPage, allThresholdValues, thresholdsPerPage]);

  const handleDataCenterChange = async (e) => {
    const dataCenterId = e.target.value;
    setFormData({
      ...formData,
      data_center_id: dataCenterId,
      device_id: '',
      sensor_id: ''
    });

    if (dataCenterId) {
      try {
        const devices = await fetchDevicesByDataCenter(dataCenterId);
        setDevices(devices);
        setSensors([]);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setDevices([]);
      setSensors([]);
    }
  };

  const handleDeviceChange = async (e) => {
    const deviceId = e.target.value;
    setFormData({
      ...formData,
      device_id: deviceId,
      sensor_id: ''
    });

    if (deviceId) {
      try {
        const allSensors = await fetchSensorsByDevice(deviceId);
        const filteredSensors = allSensors.filter(sensor => sensor.trigger_type_id === 1);
        setSensors(filteredSensors);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setSensors([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentThreshold) {
        await updateThresholdValue(currentThreshold.id, formData);
      } else {
        await createThresholdValue(formData);
      }
      // Re-fetch all values to update the master list and trigger re-pagination
      const updatedValues = await fetchThresholdValues();
      setAllThresholdValues(updatedValues);
      setTotalPages(Math.ceil(updatedValues.length / thresholdsPerPage));
      setCurrentPage(1); // Go to first page after add/update

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const threshold = await fetchThresholdValue(id);
      setCurrentThreshold(threshold);
      setFormData({
        data_center_id: threshold.sensor?.device?.data_center_id || '',
        device_id: threshold.sensor?.device_id || '',
        sensor_id: threshold.sensor_id,
        threshold_type_id: threshold.threshold_type_id,
        threshold: threshold.threshold,
        timestamp: threshold.timestamp || new Date().toISOString()
      });
      setIsEditing(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this threshold value?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteThresholdValue(id);
              // Filter from allThresholdValues and update pagination
              const updatedAllThresholdValues = allThresholdValues.filter(value => value.id !== id);
              setAllThresholdValues(updatedAllThresholdValues);

              const newTotalPages = Math.ceil(updatedAllThresholdValues.length / thresholdsPerPage);
              setTotalPages(newTotalPages);

              // Adjust current page if needed after deletion
              if (currentPage > newTotalPages && currentPage > 1) {
                setCurrentPage(newTotalPages);
              } else if (currentThresholdValues.length === 1 && currentPage > 1 && updatedAllThresholdValues.length % thresholdsPerPage === 0) {
                 // If the last item on a page is deleted, and it was a full page, move to the previous page
                 setCurrentPage(prev => prev - 1);
              }
              // The useEffect for `currentThresholdValues` will handle slicing the new `allThresholdValues`
            } catch (err) {
              setError(err.message);
            }
          },
        },
        { label: 'No' },
      ],
    });
  };

  const resetForm = () => {
    setFormData({
      data_center_id: '',
      device_id: '',
      sensor_id: '',
      threshold_type_id: '',
      threshold: '',
      timestamp: new Date().toISOString()
    });
    setIsEditing(false);
    setCurrentThreshold(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- Export Functionality ---
  const handleExport = () => {
    // Prepare data for export
    const dataToExport = allThresholdValues.map((value, index) => ({
      No: index + 1, // Sequential number
      'Data Center': value.sensor?.data_center?.name || 'N/A',
      Device: value.sensor?.device?.name || 'N/A',
      Sensor: value.sensor?.name || `Sensor ${value.sensor_id}`,
      'Sensor Type': value.sensor?.sensor_type?.name || 'N/A',
      'Threshold Type': value.threshold_type?.name || `Type ${value.threshold_type_id}`,
      Value: value.threshold,
      Timestamp: new Date(value.timestamp).toLocaleString(), // Format timestamp nicely
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ThresholdValues");

    // Write the workbook to a buffer
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Save the file
    try {
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'threshold_values.xlsx');
    } catch (e) {
      console.error("Error saving file:", e);
      setError("Failed to export Excel file.");
    }
  };
  // --- End Export Functionality ---

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
  <div className="container mt-4">
    <div className="row">
     

      {/* 2nd Section: Threshold List */}
      
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Threshold Values List</h2>
          <button className="btn btn-success" onClick={handleExport}>
            Export
          </button>
        </div>
        {/* <div className="table-responsive">
          <table className="table table-striped table-hover">
           */}
           <div style={{ overflowX: 'auto', width: '100%' }}>
  <table className="table table-striped table-hover" style={{ minWidth: '800px' }}>

            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Data_Center</th>
                <th>Device</th>
                <th>Sensor</th>
                <th>Sensor_Type</th>
                <th>Threshold_Type</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentThresholdValues.length > 0 ? (
                currentThresholdValues.map((value, index) => (
                  <tr key={value.id}>
                    <td>{(currentPage - 1) * thresholdsPerPage + index + 1}</td>
                    <td>{value.sensor?.data_center?.name || 'N/A'}</td>
                    <td>{value.sensor?.device?.name || 'N/A'}</td>
                    <td>{value.sensor?.name || `Sensor ${value.sensor_id}`}</td>
                    <td>{value.sensor?.sensor_type?.name || 'N/A'}</td>
                    <td>{value.threshold_type?.name || `Type ${value.threshold_type_id}`}</td>
                    <td>{value.threshold}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <CommonButton name="edit" onClick={() => handleEdit(value.id)} />
                        <CommonButton name="delete" onClick={() => handleDelete(value.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No threshold values found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>



 {/* 1st Section: Threshold Form */}
      <div className="col-12 mb-4">
        <h2>{isEditing ? 'Edit Threshold Value' : 'Add New Threshold Value'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Data Center</label>
            <select
              className="form-select"
              name="data_center_id"
              value={formData.data_center_id}
              onChange={handleDataCenterChange}
              required
            >
              <option value="">Select Data Center</option>
              {dataCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Device</label>
            <select
              className="form-select"
              name="device_id"
              value={formData.device_id}
              onChange={handleDeviceChange}
              required
              disabled={!formData.data_center_id}
            >
              <option value="">Select Device</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Select Sensor (Trigger Type = Threshold)</label>
            <select
              className="form-select"
              name="sensor_id"
              value={formData.sensor_id}
              onChange={handleInputChange}
              required
              disabled={!formData.device_id || sensors.length === 0}
            >
              <option value="">
                {!formData.device_id
                  ? 'Select device first'
                  : sensors.length === 0
                  ? 'No sensors with trigger type = Threshold available'
                  : 'Select Sensor'}
              </option>
              {sensors.map((sensor) => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.name || `Sensor ${sensor.id}`}
                </option>
              ))}
            </select>
            {formData.device_id && sensors.length === 0 && (
              <div className="text-danger small">
                No sensors with trigger type = Threshold found for this device
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Threshold Type</label>
            <select
              className="form-select"
              name="threshold_type_id"
              value={formData.threshold_type_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Threshold Type</option>
              {thresholdTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Threshold Value</label>
            <input
              type="number"
              className="form-control"
              name="threshold"
              value={formData.threshold}
              onChange={handleInputChange}
              required
              step="0.01"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update' : 'Save'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </div>


    </div>
  </div>
);

};

export default ThresholdValues;