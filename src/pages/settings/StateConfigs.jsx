import React, { useState, useEffect } from 'react';
import {
  fetchStateConfigs,
  fetchStateConfig,
  createStateConfig,
  updateStateConfig,
  deleteStateConfig
} from '../../api/stateConfigApi';
import { fetchSensorsByDevice } from '../../api/sensorListApi';
import { fetchDataCenters } from '../../api/settings/dataCenterApi';
import { fetchDevicesByDataCenter } from '../../api/deviceApi';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import its CSS
import * as XLSX from 'xlsx'; // Import xlsx library
import { saveAs } from 'file-saver'; // Import file-saver library
import CommonButton from "../../components/CommonButton";

const StateConfigs = () => {
  const [allStateConfigs, setAllStateConfigs] = useState([]); // Stores all fetched configs
  const [currentStateConfigs, setCurrentStateConfigs] = useState([]); // Configs for the current page
  const [dataCenters, setDataCenters] = useState([]);
  const [devices, setDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    data_center_id: '',
    device_id: '',
    sensor_id: '',
    value: '',
    name: '',
    attache_sound: '',
    url: '',
    color: '#ffffff'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [configsPerPage] = useState(8); // Number of items to show per page
  const [totalPages, setTotalPages] = useState(1); // Initialize to 1

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [configsResponse, centers] = await Promise.all([
          fetchStateConfigs(),
          fetchDataCenters()
        ]);
        
        const fetchedConfigs = Array.isArray(configsResponse) ? configsResponse : [];
        setAllStateConfigs(fetchedConfigs);
        setTotalPages(Math.ceil(fetchedConfigs.length / configsPerPage));
        setCurrentStateConfigs(fetchedConfigs.slice(0, configsPerPage)); // Set initial page values

        setDataCenters(centers);
        setLoading(false);
        
        if (isEditing && currentConfig) {
          const deviceResponse = await fetchDevicesByDataCenter(currentConfig.sensor?.device?.data_center_id);
          setDevices(deviceResponse);
          
          // Filter sensors with trigger_type_id = 2 when editing
          const allSensors = await fetchSensorsByDevice(currentConfig.sensor?.device_id);
          const filteredSensors = allSensors.filter(sensor => sensor.trigger_type_id === 2);
          setSensors(filteredSensors);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isEditing, currentConfig]);

  // Effect to update currentStateConfigs when currentPage or allStateConfigs changes
  useEffect(() => {
    const indexOfLastConfig = currentPage * configsPerPage;
    const indexOfFirstConfig = indexOfLastConfig - configsPerPage;
    setCurrentStateConfigs(allStateConfigs.slice(indexOfFirstConfig, indexOfLastConfig));
  }, [currentPage, allStateConfigs, configsPerPage]);

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
        // Fetch all sensors and filter by trigger_type_id = 2
        const allSensors = await fetchSensorsByDevice(deviceId);
        const filteredSensors = allSensors.filter(sensor => sensor.trigger_type_id === 2);
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
      if (isEditing && currentConfig) {
        await updateStateConfig(currentConfig.id, formData);
      } else {
        await createStateConfig(formData);
      }
      // Re-fetch all configs to update the master list and trigger re-pagination
      const updatedConfigs = await fetchStateConfigs();
      setAllStateConfigs(updatedConfigs);
      setTotalPages(Math.ceil(updatedConfigs.length / configsPerPage));
      setCurrentPage(1); // Go to first page after add/update

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const config = await fetchStateConfig(id);
      setCurrentConfig(config);
      setFormData({
        data_center_id: config.sensor?.device?.data_center_id || '',
        device_id: config.sensor?.device_id || '',
        sensor_id: config.sensor_id,
        value: config.value,
        name: config.name,
        attache_sound: config.attache_sound || '',
        url: config.url || '',
        color: config.color || '#ffffff'
      });
      setIsEditing(true);
      
      // Ensure devices and sensors are loaded correctly for the form when editing
      if (config.sensor?.device?.data_center_id) {
        const deviceResponse = await fetchDevicesByDataCenter(config.sensor.device.data_center_id);
        setDevices(deviceResponse);
      }
      if (config.sensor?.device_id) {
        const allSensors = await fetchSensorsByDevice(config.sensor.device_id);
        const filteredSensors = allSensors.filter(sensor => sensor.trigger_type_id === 2);
        setSensors(filteredSensors);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this state configuration?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteStateConfig(id);
              // Filter from allStateConfigs and update pagination
              const updatedAllStateConfigs = allStateConfigs.filter(config => config.id !== id);
              setAllStateConfigs(updatedAllStateConfigs);

              const newTotalPages = Math.ceil(updatedAllStateConfigs.length / configsPerPage);
              setTotalPages(newTotalPages);

              // Adjust current page if needed after deletion
              if (currentPage > newTotalPages && currentPage > 1) {
                setCurrentPage(newTotalPages);
              } else if (currentStateConfigs.length === 1 && currentPage > 1 && updatedAllStateConfigs.length % configsPerPage === 0) {
                 // If the last item on a page is deleted, and it was a full page, move to the previous page
                 setCurrentPage(prev => prev - 1);
              }
              // The useEffect for `currentStateConfigs` will handle slicing the new `allStateConfigs`
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
      value: '',
      name: '',
      attache_sound: '',
      url: '',
      color: '#ffffff'
    });
    setIsEditing(false);
    setCurrentConfig(null);
    setDevices([]);
    setSensors([]);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- Export Functionality ---
  const handleExport = () => {
    // Prepare data for export
    const dataToExport = allStateConfigs.map((config, index) => ({
      No: index + 1, // Sequential number
      'Data Center': config.sensor?.device?.data_center?.name || 'N/A',
      Device: config.sensor?.device?.name || 'N/A',
      Sensor: config.sensor?.name || `Sensor ${config.sensor_id}`,
      'Sensor Type': config.sensor?.sensor_type?.name || 'N/A',
      Value: config.value,
      Name: config.name,
      'Attached Sound': config.attache_sound || 'N/A',
      URL: config.url || 'N/A',
      Color: config.color || '#ffffff',
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StateConfigs");

    // Write the workbook to a buffer
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Save the file
    try {
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'state_configurations.xlsx');
    } catch (e) {
      console.error("Error saving file:", e);
      setError("Failed to export Excel file.");
    }
  };
  // --- End Export Functionality ---

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h2>{isEditing ? 'Edit State Configuration' : 'Add New State Configuration'}</h2>
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
              <label className="form-label">Select Sensor (Trigger Type State)</label>
              <select
                className="form-select"
                name="sensor_id"
                value={formData.sensor_id}
                onChange={handleInputChange}
                required
                disabled={!formData.device_id || sensors.length === 0}
              >
                <option value="">
                  {!formData.device_id ? 'Select device first' : 
                   sensors.length === 0 ? 'No sensors with trigger type State available' : 'Select Sensor'}
                </option>
                {sensors.map((sensor) => (
                  <option key={sensor.id} value={sensor.id}>
                    {sensor.name || `Sensor ${sensor.id}`}
                  </option>
                ))}
              </select>
              {formData.device_id && sensors.length === 0 && (
                <div className="text-danger small">No sensors with trigger type State found for this device</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Value</label>
              <input
                type="number"
                className="form-control"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Attached Sound</label>
              <input
                type="text"
                className="form-control"
                name="attache_sound"
                value={formData.attache_sound}
                onChange={handleInputChange}
                placeholder="Sound file path or URL"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">URL</label>
              <input
                type="text"
                className="form-control"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="Optional URL"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Color</label>
              <div className="input-group">
                <input
                  type="color"
                  className="form-control form-control-color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  title="Choose a color"
                />
                <input
                  type="text"
                  className="form-control"
                  value={formData.color}
                  onChange={handleInputChange}
                  name="color"
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update' : 'Save'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>
        
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>State Configurations</h2>
            {/* Export Button */}
            <button className="btn btn-success" onClick={handleExport}>
              Export
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>No</th> {/* Added sequential number column */}
                  <th>Data_Center</th>
                  <th>Device</th>
                  <th>Sensor</th>
                  <th>Sensor_Type</th>
                  <th>Value</th>
                  <th>Name</th>
                  <th>Color</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStateConfigs.length > 0 ? (
                  currentStateConfigs.map((config, index) => (
                    <tr key={config.id}>
                      {/* Calculate sequential number for the current page */}
                      <td>{(currentPage - 1) * configsPerPage + index + 1}</td> 
                      <td>{config.sensor?.device?.data_center?.name || 'N/A'}</td>
                      <td>{config.sensor?.device?.name || 'N/A'}</td>
                      <td>{config.sensor?.name || `Sensor ${config.sensor_id}`}</td>
                      <td>{config.sensor?.sensor_type?.name || 'N/A'}</td>
                      <td>{config.value}</td>
                      <td>{config.name}</td>
                      <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div
                              style={{
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: config.color,
                                  border: '1px solid #ccc',
                                  borderRadius: '4px'
                              }}
                              ></div>
                              {/* <span>{config.color}</span> */}
                          </div>
                      </td>



                    <td>
                      <div className="d-flex gap-2">
  <CommonButton
    name="edit"
    onClick={() => handleEdit(config.id)}
    className="me-2"
  />
  <CommonButton
    name="delete"
    onClick={() => handleDelete(config.id)}
  />
  </div>
</td>



                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">No state configurations found.</td> {/* Adjusted colspan */}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Only show if there's more than 1 page */}
          {totalPages > 1 && (
            <nav className="mt-3"> {/* Add a top margin for spacing */}
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1
                        ? "active"
                        : ""
                    }`}
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
      </div>
    </div>
  );
};

export default StateConfigs;