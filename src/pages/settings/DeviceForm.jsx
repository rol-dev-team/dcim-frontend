// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchDevice, createDevice, updateDevice } from "../../api/deviceApi";
// import { fetchDataCenters } from "../../api/settings/dataCenterApi";

// const DeviceForm = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [dataCenters, setDataCenters] = useState([]);
//     const [device, setDevice] = useState({
//         name: "",
//         data_center_id: "",
//         location: "",
//         secret_key: null,
//         control_topic: null, // Added new field
//         status: 1,
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const centers = await fetchDataCenters();
//                 setDataCenters(centers);

//                 if (id) {
//                     const existingDevice = await fetchDevice(id);
//                     setDevice(existingDevice);
//                 }
//             } catch (err) {
//                 setError(err.message);
//             }
//         };
//         loadData();
//     }, [id]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setDevice((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             if (id) {
//                 await updateDevice(id, device);
//             } else {
//                 await createDevice(device);
//             }
//             navigate("/admin/settings/devices-list");
//         } catch (err) {
//             setError(err.message);
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container">
//             <h2>{id ? "Edit" : "Create"} Device</h2>
//             {error && <div className="alert alert-danger">{error}</div>}
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label>Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={device.name}
//                         onChange={handleChange}
//                         className="form-control"
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Data Center</label>
//                     <select
//                         name="data_center_id"
//                         value={device.data_center_id}
//                         onChange={handleChange}
//                         className="form-control"
//                         required
//                     >
//                         <option value="">Select Data Center</option>
//                         {dataCenters.map((dc) => (
//                             <option key={dc.id} value={dc.id}>
//                                 {dc.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="form-group">
//                     <label>Location</label>
//                     <input
//                         type="text"
//                         name="location"
//                         value={device.location}
//                         onChange={handleChange}
//                         className="form-control"
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Received Topic (Optional)</label>
//                     <input
//                         type="text"
//                         name="secret_key"
//                         value={device.secret_key || ""}
//                         onChange={handleChange}
//                         className="form-control"
//                         placeholder="Leave empty if not needed"
//                     />
//                 </div>

//                 {/* Added Control Topic field */}
//                 <div className="form-group">
//                     <label>Control Topic (Optional)</label>
//                     <input
//                         type="text"
//                         name="control_topic"
//                         value={device.control_topic || ""}
//                         onChange={handleChange}
//                         className="form-control"
//                         placeholder="Leave empty if not needed"
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Status</label>
//                     <select
//                         name="status"
//                         value={device.status}
//                         onChange={handleChange}
//                         className="form-control"
//                         required
//                     >
//                         <option value="1">Active</option>
//                         <option value="0">Inactive</option>
//                     </select>
//                 </div>

//                 <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading}
//                 >
//                     {loading ? "Saving..." : "Save"}
//                 </button>
//                 {/* ----updated by tahsin--- */}
//        <button
//         type="button"
//         className="btn btn-secondary ms-2"
//         // onClick={handleCancel}
//         onClick={() => navigate('/admin/settings/devices-list')}
//         disabled={loading}
//       >
//         Cancel
//       </button>
//             </form>
//         </div>
//     );
// };

// export default DeviceForm;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Import icon
import Button from '../../components/ui/Button';

import { fetchDevice, createDevice, updateDevice } from '../../api/deviceApi';
import { fetchDataCenters } from '../../api/settings/dataCenterApi';

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

const DeviceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataCenters, setDataCenters] = useState([]);
  const [device, setDevice] = useState({
    name: '',
    data_center_id: '',
    location: '',
    secret_key: '', // Initialized as empty string for input compatibility
    control_topic: '', // Initialized as empty string for input compatibility
    status: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const centers = await fetchDataCenters();
        setDataCenters(centers);

        if (isEditMode) {
          const existingDevice = await fetchDevice(id);
          setDevice({
            ...existingDevice,
            // Ensure optional fields are handled as strings for input value
            secret_key: existingDevice.secret_key || '',
            control_topic: existingDevice.control_topic || '',
            // Ensure data_center_id is treated as a string/number if API requires
            data_center_id: String(existingDevice.data_center_id),
            status: String(existingDevice.status), // Convert status to string for select value
          });
        }
      } catch (err) {
        setError('Failed to load form data: ' + err.message);
      }
    };
    loadData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic required field check (since Formik isn't used)
    if (!device.name || !device.data_center_id || !device.location) {
      setError('Name, Data Center, and Location are required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data: convert status back to number
      const dataToSend = {
        ...device,
        status: Number(device.status),
        data_center_id: Number(device.data_center_id),
        // Send null for empty optional fields if API expects it
        secret_key: device.secret_key || null,
        control_topic: device.control_topic || null,
      };

      if (isEditMode) {
        await updateDevice(id, dataToSend);
      } else {
        await createDevice(dataToSend);
      }
      navigate('/admin/settings/devices-list');
    } catch (err) {
      setError('Save failed: ' + err.message);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/settings/devices-list');
  };

  const formTitle = isEditMode ? 'Edit Device Details' : 'Device Registration';
  const formSubtitle = isEditMode
    ? 'Modify the existing device details.'
    : 'Register a new device for monitoring and control.';

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
                aria-label="Back to Devices list"
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
            {/* Row 1: Name and Data Center */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={device.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="data_center_id">Data Center</label>
              <select
                id="data_center_id"
                name="data_center_id"
                value={device.data_center_id}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select Data Center</option>
                {dataCenters.map((dc) => (
                  <option key={dc.id} value={dc.id}>
                    {dc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 2: Location and Status */}
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={device.location}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={device.status}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Row 3: Received Topic and Control Topic (Optional fields) */}
            <div className="form-group">
              <label htmlFor="secret_key">Received Topic (Optional)</label>
              <input
                type="text"
                id="secret_key"
                name="secret_key"
                value={device.secret_key}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., devices/temp_sensor/data"
              />
            </div>

            <div className="form-group">
              <label htmlFor="control_topic">Control Topic</label>
              <input
                type="text"
                id="control_topic"
                name="control_topic"
                value={device.control_topic}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="e.g., devices/temp_sensor/control"
              />
            </div>
          </div>

          {/* ================================================================
                        ACTIONS FOOTER (Uses new Button component)
                        ================================================================ */}
          <div className="form-actions">
            <Button type="button" intent="secondary" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              intent="primary"
              loading={loading}
              loadingText={isEditMode ? 'Updating...' : 'Saving...'}
              disabled={loading}
            >
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DeviceForm;
