// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   fetchSensorList,
//   createSensorList,
//   updateSensorList,
//   fetchSensorTypeLists,
//   fetchTriggerTypeLists,
// } from "../../api/sensorListApi";
// import { fetchDataCenters } from "../../api/settings/dataCenterApi";
// import { fetchDevicesByDataCenter } from "../../api/deviceApi";

// const SensorForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = !!id;

//   const [formData, setFormData] = useState({
//     data_center_id: "",
//     device_id: "",
//     sensor_type_list_id: "",
//     unique_id: "",
//     trigger_type_id: "",
//     sound_status: false,
//     blink_status: false,
//     sensor_name: "", // Added sensor_name field
//     location: "",
//     status: true,
//     timestamp: new Date().toISOString(),
//   });

//   const [dataCenters, setDataCenters] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [sensorTypes, setSensorTypes] = useState([]);
//   const [triggerTypes, setTriggerTypes] = useState([]);
//   const [loading, setLoading] = useState(isEdit);
//   const [loadingData, setLoadingData] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [centers, sensorTypeList, triggerTypeList] = await Promise.all([
//           fetchDataCenters(),
//           fetchSensorTypeLists(),
//           fetchTriggerTypeLists(),
//         ]);

//         setDataCenters(centers);
//         setSensorTypes(sensorTypeList);
//         setTriggerTypes(triggerTypeList);
//         setLoadingData(false);

//         if (isEdit) {
//           await loadSensor();
//         }
//       } catch (err) {
//         setError(err.message);
//         setLoadingData(false);
//         setLoading(false);
//       }
//     };

//     loadInitialData();
//   }, [id]);

//   useEffect(() => {
//     const loadDevices = async () => {
//       if (!formData.data_center_id) {
//         setDevices([]);
//         return;
//       }
//       try {
//         const deviceList = await fetchDevicesByDataCenter(
//           formData.data_center_id
//         );
//         setDevices(deviceList);
//       } catch (err) {
//         setError(err.message);
//         setDevices([]);
//       }
//     };

//     loadDevices();
//   }, [formData.data_center_id]);

//   const loadSensor = async () => {
//     try {
//       const sensor = await fetchSensorList(id);
//       setFormData({
//         ...sensor,
//         sound_status: Boolean(sensor.sound_status),
//         blink_status: Boolean(sensor.blink_status),
//         status: Boolean(sensor.status),
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...formData,
//         sound_status: formData.sound_status ? 1 : 0,
//         blink_status: formData.blink_status ? 1 : 0,
//         status: formData.status ? 1 : 0,
//       };

//       if (!isEdit && !payload.unique_id) {
//         delete payload.unique_id;
//       }

//       if (isEdit) {
//         await updateSensorList(id, payload);
//       } else {
//         await createSensorList(payload);
//       }
//       navigate("/admin/settings/sensor-lists");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (loading || loadingData) return <div>Loading...</div>;

//   return (
//     <div className='container'>
//       <h1>{isEdit ? "Edit Sensor" : "Create New Sensor"}</h1>
//       {error && <div className='alert alert-danger'>{error}</div>}

//       <form onSubmit={handleSubmit}>
//         <div className='row'>
//           <div className='col-md-6'>
//             <div className='mb-3'>
//               <label className='form-label'>Data Center</label>
//               <select
//                 className='form-select'
//                 name='data_center_id'
//                 value={formData.data_center_id}
//                 onChange={handleChange}
//                 required>
//                 <option value=''>Select Data Center</option>
//                 {dataCenters.map((center) => (
//                   <option key={center.id} value={center.id}>
//                     {center.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className='mb-3'>
//               <label className='form-label'>Device</label>
//               <select
//                 className='form-select'
//                 name='device_id'
//                 value={formData.device_id}
//                 onChange={handleChange}
//                 required
//                 disabled={!formData.data_center_id}>
//                 <option value=''>Select Device</option>
//                 {devices.map((device) => (
//                   <option key={device.id} value={device.id}>
//                     {device.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className='mb-3'>
//               <label className='form-label'>Sensor Type</label>
//               <select
//                 className='form-select'
//                 name='sensor_type_list_id'
//                 value={formData.sensor_type_list_id}
//                 onChange={handleChange}
//                 required
//                 disabled={sensorTypes.length === 0}>
//                 <option value=''>
//                   {sensorTypes.length === 0
//                     ? "Loading sensor types..."
//                     : "Select Sensor Type"}
//                 </option>
//                 {sensorTypes.map((type) => (
//                   <option key={type.id} value={type.id}>
//                     {type.name || `Type ${type.id}`}
//                   </option>
//                 ))}
//               </select>
//               {sensorTypes.length === 0 && (
//                 <div className='text-danger small'>
//                   No sensor types available
//                 </div>
//               )}
//             </div>

//             <div className='mb-3'>
//               <label className='form-label'>Unique ID</label>
//               <input
//                 type='text'
//                 className='form-control'
//                 name='unique_id'
//                 value={formData.unique_id || "Will be auto-generated"}
//                 onChange={handleChange}
//                 disabled
//               />
//             </div>
//           </div>

//           <div className='col-md-6'>
//             <div className='mb-3'>
//               <label className='form-label'>Trigger Type</label>
//               <select
//                 className='form-select'
//                 name='trigger_type_id'
//                 value={formData.trigger_type_id}
//                 onChange={handleChange}
//                 required
//                 disabled={triggerTypes.length === 0}>
//                 <option value=''>
//                   {triggerTypes.length === 0
//                     ? "Loading trigger types..."
//                     : "Select Trigger Type"}
//                 </option>
//                 {triggerTypes.map((type) => (
//                   <option key={type.id} value={type.id}>
//                     {type.name || `Type ${type.id}`}
//                   </option>
//                 ))}
//               </select>
//               {triggerTypes.length === 0 && (
//                 <div className='text-danger small'>
//                   No trigger types available
//                 </div>
//               )}
//             </div>
//             <div className='mb-3'>
//               <label className='form-label'>Sensor Name</label>
//               <input
//                 type='text'
//                 className='form-control'
//                 name='sensor_name'
//                 value={formData.sensor_name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className='mb-3'>
//               <label className='form-label'>Location</label>
//               <input
//                 type='text'
//                 className='form-control'
//                 name='location'
//                 value={formData.location}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className='mb-3 form-check'>
//               <input
//                 type='checkbox'
//                 className='form-check-input'
//                 name='sound_status'
//                 checked={formData.sound_status}
//                 onChange={handleChange}
//               />
//               <label className='form-check-label'>Sound Status</label>
//             </div>

//             <div className='mb-3 form-check'>
//               <input
//                 type='checkbox'
//                 className='form-check-input'
//                 name='blink_status'
//                 checked={formData.blink_status}
//                 onChange={handleChange}
//               />
//               <label className='form-check-label'>Blink Status</label>
//             </div>

//             <div className='mb-3 form-check'>
//               <input
//                 type='checkbox'
//                 className='form-check-input'
//                 name='status'
//                 checked={formData.status}
//                 onChange={handleChange}
//               />
//               <label className='form-check-label'>Active</label>
//             </div>
//           </div>
//         </div>
//         {/* updated by tahsin */}
//         <div className='mt-4'>
//           <button type='submit' className='btn btn-primary me-2'>
//             {isEdit ? "Update" : "Save"}
//           </button>
//           <button
//             type='button'
//             className='btn btn-secondary'
//             onClick={() => navigate("/admin/settings/sensor-lists")}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SensorForm;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Import icon
import Button from '../../components/ui/Button';

import {
  fetchSensorList,
  createSensorList,
  updateSensorList,
  fetchSensorTypeLists,
  fetchTriggerTypeLists,
} from '../../api/sensorListApi';
import { fetchDataCenters } from '../../api/settings/dataCenterApi';
import { fetchDevicesByDataCenter } from '../../api/deviceApi';

// ================================================================
// 1. CSS FOR LAYOUT AND UI/UX MATCH
// Reusing the styles defined in the previous component for consistency.
// ================================================================
const buttonStyles = `
/* CSS for the Button component (replicated from previous answers) */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 1rem;
  min-height: 3rem;
  font-size: 0.875rem; 
  line-height: 1.25rem;
  border-radius: 0.5rem; 
  border-width: 1px;
  border-style: solid;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-weight: 600; 
}

:root {
  --btn-primary: #3b82f6; 
  --btn-secondary: #f97316; 
  --base-content: #1f2937; 
  --base-200: #f3f4f6; 
  --base-300: #e5e7eb; 
  --btn-danger: #ef4444; 
}

.btn--primary {
  background-color: var(--btn-primary);
  border-color: var(--btn-primary);
  color: white;
}
.btn--primary:hover {
  background-color: #2563eb; 
  border-color: #2563eb;
}

.btn--secondary {
  background-color: var(--base-200);
  border-color: var(--base-300);
  color: var(--base-content);
}
.btn--secondary:hover {
  background-color: var(--base-300); 
  border-color: var(--base-300);
}

.btn--ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--base-content);
}
.btn--ghost:hover {
  background-color: var(--base-200);
}

.btn[disabled], [aria-disabled="true"] {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}
.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 1s ease-in-out infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

const formLayoutStyles = `
.form-container {
    width: 100%;
    min-height: 100vh;
    padding: 24px;
    background-color: #fff;
}

/* Header Styling */
.form-header {
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.form-title-group h1 {
    font-size: 30px;
    font-weight: 800;
    color: #1f2937;
    display: flex;
    align-items: center;
}

.form-title-group p {
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
    margin-left: 40px;
}

/* Custom style for the ArrowLeft Button */
.header-back-button {
    color: #1f2937 !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    margin-left: -16px; 
    padding: 0 4px;
    min-height: 30px;
    line-height: 30px;
}
.header-back-button:hover {
    background-color: transparent !important;
    text-decoration: none;
}

/* Form Grid Layout */
.form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px 56px;
}

@media (min-width: 768px) { 
    .form-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Form Group for Fields (Includes label and input) */
.form-group {
    margin-bottom: 0 !important;
}

.form-group label {
    display: block;
    font-size: 0.875rem; /* text-sm */
    font-weight: 500;
    color: #374151; /* gray-700 */
    margin-bottom: 4px; /* Space between label and input */
}

.form-control, .form-select {
    width: 100%;
    padding: 0.75rem; /* p-3 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    box-sizing: border-box;
    font-size: 1rem;
}

.alert-danger {
    color: var(--btn-danger);
    background-color: #fef2f2; /* red-50 */
    border: 1px solid #fca5a5; /* red-300 */
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 24px;
    grid-column: 1 / -1; /* spans both columns */
}

/* Checkbox Grouping */
.checkbox-field-group {
    display: flex;
    flex-direction: column;
    gap: 8px; /* space-y-2 */
    margin-top: 24px; /* Give a little separation */
}
.checkbox-field-group label:first-child {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px; /* space-x-2 */
}
.checkbox-item input[type="checkbox"] {
    width: 16px;
    height: 16px;
}
.checkbox-item label {
    margin-bottom: 0;
    font-weight: normal;
}
.text-danger.small {
    font-size: 0.75rem;
    margin-top: 4px;
}

/* Actions Footer */
.form-actions {
    grid-column: 1 / -1; 
    display: flex;
    justify-content: flex-end; 
    gap: 16px; 
    padding-top: 24px; 
    border-top: 1px solid #e5e7eb; 
    margin-top: 24px; 
}
`;
// ================================================================

const SensorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    data_center_id: '',
    device_id: '',
    sensor_type_list_id: '',
    unique_id: '',
    trigger_type_id: '',
    sound_status: false,
    blink_status: false,
    sensor_name: '',
    location: '',
    status: true,
    timestamp: new Date().toISOString(),
  });

  const [dataCenters, setDataCenters] = useState([]);
  const [devices, setDevices] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [triggerTypes, setTriggerTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null); // Combining loading states
  const isLoading = isSubmitting || loadingData; // --- Master Data Loading Effect ---

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [centers, sensorTypeList, triggerTypeList] = await Promise.all([
          fetchDataCenters(),
          fetchSensorTypeLists(),
          fetchTriggerTypeLists(),
        ]);

        setDataCenters(centers);
        setSensorTypes(sensorTypeList);
        setTriggerTypes(triggerTypeList);

        if (isEdit) {
          await loadSensor(centers); // Pass centers to load devices immediately
        } else {
          setLoadingData(false);
        }
      } catch (err) {
        setError('Failed to load master data: ' + err.message);
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, [id, isEdit]);

  // --- Single Sensor & Devices Loading Logic ---
  const loadSensor = async (centers) => {
    try {
      const sensor = await fetchSensorList(id);

      // Load devices based on the sensor's data_center_id
      const deviceList = await fetchDevicesByDataCenter(sensor.data_center_id);
      setDevices(deviceList);

      setFormData({
        ...sensor,
        data_center_id: String(sensor.data_center_id),
        device_id: String(sensor.device_id),
        sensor_type_list_id: String(sensor.sensor_type_list_id),
        trigger_type_id: String(sensor.trigger_type_id),
        sound_status: Boolean(sensor.sound_status),
        blink_status: Boolean(sensor.blink_status),
        status: Boolean(sensor.status),
      });
    } catch (err) {
      setError('Failed to load sensor data: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  }; // --- Devices by Data Center Effect (for manual change) ---

  useEffect(() => {
    const loadDevices = async () => {
      if (!formData.data_center_id) {
        setDevices([]);
        return;
      }
      // If we are in edit mode and the data_center_id hasn't changed, skip
      if (isEdit && String(formData.data_center_id) === String(formData.data_center_id)) return;

      try {
        const deviceList = await fetchDevicesByDataCenter(formData.data_center_id);
        setDevices(deviceList); // Reset device_id if the previously selected device is no longer in the new list
        if (!deviceList.find((d) => String(d.id) === String(formData.device_id))) {
          setFormData((prev) => ({ ...prev, device_id: '' }));
        }
      } catch (err) {
        setError('Failed to load devices: ' + err.message);
        setDevices([]);
      }
    }; // Only trigger this if data is loaded and not during initial edit load

    if (!loadingData) {
      loadDevices();
    }
  }, [formData.data_center_id, loadingData, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Special handling to reset device_id when data_center_id changes
    let newValue = type === 'checkbox' ? checked : value;
    if (name === 'data_center_id' && value !== formData.data_center_id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
        device_id: '', // Reset device when DC changes
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation (required fields)
    if (
      !formData.data_center_id ||
      !formData.device_id ||
      !formData.sensor_type_list_id ||
      !formData.trigger_type_id ||
      !formData.sensor_name ||
      !formData.location
    ) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData, // Convert back to number/string for API
        data_center_id: Number(formData.data_center_id),
        device_id: Number(formData.device_id),
        sensor_type_list_id: Number(formData.sensor_type_list_id),
        trigger_type_id: Number(formData.trigger_type_id),
        sound_status: formData.sound_status ? 1 : 0,
        blink_status: formData.blink_status ? 1 : 0,
        status: formData.status ? 1 : 0,
        // Ensure unique_id is only included if it exists and is needed by the API for update
        unique_id: formData.unique_id || undefined,
        timestamp: formData.timestamp,
      };

      if (isEdit) {
        await updateSensorList(id, payload);
      } else {
        await createSensorList(payload);
      }
      navigate('/admin/settings/sensor-lists');
    } catch (err) {
      setError('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/settings/sensor-lists');
  };

  if (loadingData) return <div className="text-center p-4">Loading Form Data...</div>;

  const formTitle = isEdit ? 'Edit Sensor Details' : 'New Sensor Registration';
  const formSubtitle = isEdit
    ? 'Modify the sensor and its device assignments.'
    : 'Register a new sensor and assign it to a device.';

  return (
    <>
      <style>{buttonStyles}</style>
      <style>{formLayoutStyles}</style>

      <div className="form-container">
        {/* ================================================================
                HEADER SECTION
                ================================================================ */}
        <header className="form-header">
          <div className="form-title-group">
            <h1>
              <Button
                type="button"
                variant="ghost"
                leftIcon={ArrowLeft}
                onClick={handleCancel}
                className="header-back-button"
                aria-label="Back to Sensor Lists"
              >
                {/* Empty children */}
              </Button>
              {formTitle}
            </h1>
            <p>{formSubtitle}</p>
          </div>
        </header>

        {error && <div className="alert-danger">{error}</div>}

        {/* ================================================================
                FORM (Grid Layout)
                ================================================================ */}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Column 1 */}
            <div className="column-fields">
              <div className="form-group">
                <label htmlFor="data_center_id">Data Center *</label>
                <select
                  id="data_center_id"
                  className="form-select"
                  name="data_center_id"
                  value={formData.data_center_id}
                  onChange={handleChange}
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

              <div className="form-group">
                <label htmlFor="device_id">Device *</label>
                <select
                  id="device_id"
                  className="form-select"
                  name="device_id"
                  value={formData.device_id}
                  onChange={handleChange}
                  required
                  disabled={!formData.data_center_id || devices.length === 0}
                >
                  <option value="">
                    {formData.data_center_id
                      ? `Select Device (${devices.length} available)`
                      : 'Select Data Center first'}
                  </option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sensor_type_list_id">Sensor Type *</label>
                <select
                  id="sensor_type_list_id"
                  className="form-select"
                  name="sensor_type_list_id"
                  value={formData.sensor_type_list_id}
                  onChange={handleChange}
                  required
                  disabled={sensorTypes.length === 0}
                >
                  <option value="">Select Sensor Type</option>
                  {sensorTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name || `Type ${type.id}`}
                    </option>
                  ))}
                </select>
                {sensorTypes.length === 0 && (
                  <div className="text-danger small">No sensor types available</div>
                )}
              </div>

              {/* <div className="form-group">
                            <label htmlFor="unique_id">Unique ID (Read-only)</label>
                            <input
                                type='text'
                                id="unique_id"
                                className='form-control'
                                name='unique_id'
                                value={formData.unique_id || "Will be auto-generated"}
                                disabled
                            />
                        </div> */}
            </div>

            {/* Column 2 */}
            <div className="column-fields">
              <div className="form-group">
                <label htmlFor="trigger_type_id">Trigger Type *</label>
                <select
                  id="trigger_type_id"
                  className="form-select"
                  name="trigger_type_id"
                  value={formData.trigger_type_id}
                  onChange={handleChange}
                  required
                  disabled={triggerTypes.length === 0}
                >
                  <option value="">Select Trigger Type</option>
                  {triggerTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name || `Type ${type.id}`}
                    </option>
                  ))}
                </select>
                {triggerTypes.length === 0 && (
                  <div className="text-danger small">No trigger types available</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="sensor_name">Sensor Name *</label>
                <input
                  type="text"
                  id="sensor_name"
                  className="form-control"
                  name="sensor_name"
                  value={formData.sensor_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Checkboxes grouped into one field area */}
              <div className="checkbox-field-group">
                <label>Alert & Status Settings</label>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="sound_status"
                    name="sound_status"
                    checked={formData.sound_status}
                    onChange={handleChange}
                  />
                  <label htmlFor="sound_status">Enable Sound Alert</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="blink_status"
                    name="blink_status"
                    checked={formData.blink_status}
                    onChange={handleChange}
                  />
                  <label htmlFor="blink_status">Enable Blink Alert</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  <label htmlFor="status">Active Status</label>
                </div>
              </div>
            </div>

            {/* ================================================================
                        ACTIONS FOOTER (Uses new Button component)
                        ================================================================ */}
            <div className="form-actions">
              <Button
                type="button"
                intent="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                intent="primary"
                loading={isSubmitting}
                loadingText={isEdit ? 'Updating Sensor...' : 'Saving Sensor...'}
                disabled={isSubmitting || loadingData}
              >
                {isEdit ? 'Update Sensor' : 'Save Sensor'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SensorForm;
