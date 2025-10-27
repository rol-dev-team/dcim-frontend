// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   fetchThresholdTypes,
//   fetchThresholdType,
//   createThresholdType,
//   updateThresholdType,
//   deleteThresholdType
// } from '../../api/thresholdTypeApi';
// import CommonButton from '../../components/CommonButton';

// const ThresholdTypes = () => {
//   const [thresholdTypes, setThresholdTypes] = useState([]);
//   const [currentThreshold, setCurrentThreshold] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     attach_sound: null, // Will hold the file object
//     url: '',
//     color: '#000000',
//     timestamp: new Date().toISOString()
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadThresholdTypes();
//   }, []);

//   const loadThresholdTypes = async () => {
//     try {
//       const data = await fetchThresholdTypes();
//       setThresholdTypes(data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'attach_sound') {
//       setFormData({
//         ...formData,
//         [name]: files[0] // Single file
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = new FormData();
//       payload.append('name', formData.name);
//       if (formData.attach_sound) {
//         payload.append('attach_sound', formData.attach_sound);
//       }
//       payload.append('url', formData.url);
//       payload.append('color', formData.color);
//       payload.append('timestamp', formData.timestamp);

//       if (isEditing && currentThreshold) {
//         await updateThresholdType(currentThreshold.id, payload);
//       } else {
//         await createThresholdType(payload);
//       }

//       loadThresholdTypes();
//       resetForm();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const threshold = await fetchThresholdType(id);
//       setCurrentThreshold(threshold);
//       setFormData({
//         name: threshold.name,
//         attach_sound: null, // Reset to null (user can upload new file if needed)
//         url: threshold.url || '',
//         color: threshold.color || '#000000',
//         timestamp: threshold.timestamp || new Date().toISOString()
//       });
//       setIsEditing(true);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this threshold type?')) {
//       try {
//         await deleteThresholdType(id);
//         loadThresholdTypes();
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       attach_sound: null,
//       url: '',
//       color: '#000000',
//       timestamp: new Date().toISOString()
//     });
//     setIsEditing(false);
//     setCurrentThreshold(null);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container mt-4">
//       {/* <h1>Threshold Types</h1> */}

//       <div className="row">
//         <div className="col-md-6">
//           <h2>{isEditing ? 'Edit Threshold Type' : 'Add New Threshold Type'}</h2>
//           <form onSubmit={handleSubmit} encType="multipart/form-data">
//             <div className="mb-3">
//               <label className="form-label">Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Attach Sound</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 name="attach_sound"
//                 accept="audio/*"
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">URL</label>
//               <input
//                 type="url"
//                 className="form-control"
//                 name="url"
//                 value={formData.url}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Color</label>
//               <input
//                 type="color"
//                 className="form-control form-control-color"
//                 name="color"
//                 value={formData.color}
//                 onChange={handleInputChange}
//               />
//             </div>



//             <div className="d-flex gap-2">
//     <CommonButton
//       name={isEditing ? 'update' : 'save'}
//       type="submit"
//     />
//     {isEditing && (
//       <CommonButton
//         name="cancel"
//         type="button"
//         onClick={resetForm}
//       />
//     )}
//   </div>


           
//           </form>
//         </div>

//         <div className="col-md-6">
//           <h2>Threshold Types List</h2>
//           <table className="table table-striped">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Color</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {thresholdTypes.map((type) => (
//                 <tr key={type.id}>
//                   <td>{type.name}</td>
//                   <td>
//                     <span
//                       className="badge"
//                       style={{ backgroundColor: type.color, color: getContrastColor(type.color) }}
//                     >
//                       {type.color}
//                     </span>
//                   </td>



//                 <td>
//   <div className="d-flex gap-2">
//     <CommonButton name="edit" onClick={() => handleEdit(type.id)} />
//     <CommonButton name="delete" onClick={() => handleDelete(type.id)} />
//   </div>
// </td>



                  
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function for text contrast
// function getContrastColor(hexColor) {
//   const r = parseInt(hexColor.substr(1, 2), 16);
//   const g = parseInt(hexColor.substr(3, 2), 16);
//   const b = parseInt(hexColor.substr(5, 2), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128 ? '#000000' : '#FFFFFF';
// }

// export default ThresholdTypes;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Upload, X } from 'lucide-react';
import {
  fetchThresholdTypes,
  fetchThresholdType,
  createThresholdType,
  updateThresholdType,
  deleteThresholdType
} from '../../api/thresholdTypeApi';

// Helper function for text contrast
function getContrastColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

// ================================================
// STYLES - COMBINED AND UPDATED FOR TWO-COLUMN GRID
// ================================================
const styles = {
  // Layout
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "3rem 4rem",
    boxSizing: 'border-box',
  },
  contentWrapper: {
    width: "100%",
  },
  headerSection: {
    marginBottom: "2rem",
    textAlign: 'left',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
  },
  heading: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem",
    letterSpacing: '-0.02em',
  },
  description: {
    fontSize: "1rem",
    color: "#6b7280",
    lineHeight: 1.5,
  },

  // Alerts
  alert: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  alertError: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  },
  alertSuccess: {
    backgroundColor: "#f0fdf4",
    color: "#047857",
    border: "1px solid #bbf7d0",
  },

  // Form Group Block (Used for both Form and List container)
  formGroupBlock: {
    // marginBottom removed from individual block to be managed by gap in grid
    padding: "32px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  
  // Form elements (inline styles for dynamic parts)
  inputStyle: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#111827',
    transition: 'all 150ms ease-in-out',
    boxSizing: 'border-box',
  },
  labelStyle: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#111827',
    marginBottom: '8px',
  },
};

const ThresholdTypes = () => {
  const [thresholdTypes, setThresholdTypes] = useState([]);
  const [currentThreshold, setCurrentThreshold] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    attach_sound: null,
    url: '',
    color: '#3b82f6',
    timestamp: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadThresholdTypes();
  }, []);

  const loadThresholdTypes = async () => {
    try {
      const data = await fetchThresholdTypes();
      setThresholdTypes(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load threshold types.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attach_sound') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file
      });
      setFileName(file ? file.name : '');
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = new FormData();
      payload.append('name', formData.name);
      if (formData.attach_sound) {
        payload.append('attach_sound', formData.attach_sound);
      }
      payload.append('url', formData.url);
      payload.append('color', formData.color);
      payload.append('timestamp', formData.timestamp);

      if (isEditing && currentThreshold) {
        await updateThresholdType(currentThreshold.id, payload);
      } else {
        await createThresholdType(payload);
      }

      await loadThresholdTypes();
      resetForm();
      setError(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || (isEditing ? 'Failed to update.' : 'Failed to create.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const threshold = await fetchThresholdType(id);
      setCurrentThreshold(threshold);
      setFormData({
        name: threshold.name,
        attach_sound: null,
        url: threshold.url || '',
        color: threshold.color || '#3b82f6',
        timestamp: threshold.timestamp || new Date().toISOString()
      });
      setFileName('');
      setIsEditing(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch threshold for editing.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this threshold type?')) {
      try {
        await deleteThresholdType(id);
        await loadThresholdTypes();
        if (currentThreshold && currentThreshold.id === id) {
            resetForm();
        }
      } catch (err) {
        setError(err.message || 'Failed to delete threshold type.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      attach_sound: null,
      url: '',
      color: '#3b82f6',
      timestamp: new Date().toISOString()
    });
    setFileName('');
    setIsEditing(false);
    setCurrentThreshold(null);
  };

  if (loading) {
    return (
      <div style={{ ...styles.pageContainer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280' }}>Loading threshold types...</div>
      </div>
    );
  }

  return (
    <>
      {/* CSS Styles for the Component - Replicating Focus/Hover States and Grid */}
      <style>
        {`
          /* Two-Column Grid */
          .grid-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px; /* gap-6 */
          }
          @media (min-width: 1024px) { /* lg breakpoint */
            .grid-container {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          /* Input Focus State */
          .input-style:focus {
            outline: none;
            border-color: transparent;
            box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6; 
          }

          /* File Upload Hover */
          .file-label-style {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px; 
            width: 100%;
            padding: 12px 16px; 
            background-color: #fff;
            border: 2px dashed #d1d5db; 
            border-radius: 8px; 
            color: #4b5563; 
            cursor: pointer;
            transition: all 150ms ease-in-out;
          }
          .file-label-style:hover {
            border-color: #60a5fa; 
            background-color: #eff6ff; 
          }

          /* Primary Button Styles */
          .btn-primary {
            flex-grow: 1;
            padding: 12px 24px; 
            background-color: #2563eb; 
            color: #fff;
            font-size: 14px; 
            font-weight: 500; 
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 150ms ease-in-out;
          }
          .btn-primary:hover {
            background-color: #1d4ed8; 
          }
          .btn-primary:focus {
            outline: none;
            box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6; 
          }
          .btn-primary:disabled {
            background-color: #d1d5db; 
            cursor: not-allowed;
            color: #6b7280; 
          }

          /* Secondary Button Styles */
          .btn-secondary {
            padding: 12px 24px;
            background-color: #fff;
            color: #374151; 
            font-size: 14px;
            font-weight: 500;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            cursor: pointer;
            transition: all 150ms ease-in-out;
          }
          .btn-secondary:hover {
            background-color: #f9fafb; 
          }
          .btn-secondary:focus {
            outline: none;
            box-shadow: 0 0 0 2px #fff, 0 0 0 4px #d1d5db; 
          }

          /* List Row/Action Hover States */
          .list-row:hover {
            background-color: #f9fafb;
          }
          
          .list-action-btn {
            padding: 8px; 
            border-radius: 8px; 
            transition: all 150ms ease-in-out;
            border: none;
            background: none;
            cursor: pointer;
          }

          .edit-btn:hover {
            background-color: #eff6ff;
          }
          .delete-btn:hover {
            background-color: #fee2e2;
          }
        `}
      </style>

      <div style={styles.pageContainer}>
        <div style={styles.contentWrapper}>
          
          {/* Header Section (Unboxed, DcOwnerMapping style) */}
          <header style={styles.headerSection}>
            <h1 style={styles.heading}>Threshold Types</h1>
            <p style={styles.description}>
              Configure threshold types with custom colors and alert sounds
            </p>
          </header>

          {/* Alerts positioned before the form content blocks */}
          {error && (
            <div style={{ ...styles.alert, ...styles.alertError }}>
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 102 0V7a1 1 0 10-2 0V6zm0 4a1 1 0 102 0v4a1 1 0 10-2 0v-4z" clipRule="evenodd" /></svg>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Error: {error}</span>
            </div>
          )}
          {success && (
            <div style={{ ...styles.alert, ...styles.alertSuccess }}>
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {isEditing ? 'Threshold updated successfully' : 'Threshold created successfully'}
              </span>
            </div>
          )}

          {/* TWO-COLUMN CONTENT GRID */}
          <div className="grid-container">

            {/* Form Section (Left Column) */}
            <div style={styles.formGroupBlock}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>
                {isEditing ? 'Edit Threshold Type' : 'Add New Threshold Type'}
              </h2>

              <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Name Input */}
                <div>
                  <label htmlFor="name" style={styles.labelStyle}>
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-style"
                    style={styles.inputStyle} // Apply base style
                    placeholder="Enter threshold name"
                    required
                  />
                </div>

                {/* Alert Sound/File Input */}
                <div>
                  <label htmlFor="attach_sound" style={styles.labelStyle}>
                    Alert Sound
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="attach_sound"
                      type="file"
                      name="attach_sound"
                      accept="audio/*"
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="attach_sound" className="file-label-style">
                      <Upload style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>
                        {fileName || (currentThreshold?.attach_sound ? 'Choose new audio file (existing sound present)' : 'Choose audio file')}
                      </span>
                    </label>
                  </div>
                  {(fileName || currentThreshold?.attach_sound) && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                      <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{fileName || `Current: ${currentThreshold.attach_sound.split('/').pop()}`}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFileName('');
                          setFormData({ ...formData, attach_sound: null });
                        }}
                        style={{ color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer' }}
                        title="Clear selection"
                      >
                        <X style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <div>
                  <label htmlFor="url" style={styles.labelStyle}>
                    URL
                  </label>
                  <input
                    id="url"
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="input-style"
                    style={styles.inputStyle}
                    placeholder="https://example.com"
                  />
                </div>

                {/* Color Input */}
                <div>
                  <label htmlFor="color" style={styles.labelStyle}>
                    Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      id="color"
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      style={{ width: '64px', height: '48px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                    />
                    <div style={{ flexGrow: 1, padding: '12px 16px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                      <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#374151' }}>{formData.color}</span>
                    </div>
                  </div>
                </div>

                {/* Form Actions (Buttons) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px' }}>
                  <button
                    type="submit"
                    disabled={saving || !formData.name.trim()}
                    className="btn-primary"
                  >
                    {saving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Section (Right Column) */}
            <div style={{...styles.formGroupBlock, padding: 0, overflow: 'hidden'}}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>
                  Threshold Types List
                </h2>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Name
                      </th>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Color
                      </th>
                      <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                    {thresholdTypes.map((type) => (
                      <tr key={type.id} className="list-row" style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 150ms ease-in-out' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{type.name}</span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span
                            style={{
                              display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: 500,
                              backgroundColor: type.color,
                              color: getContrastColor(type.color)
                            }}
                          >
                            {type.color}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => handleEdit(type.id)}
                              className="list-action-btn edit-btn"
                              style={{ color: '#2563eb' }}
                              title="Edit"
                            >
                              <Edit2 style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button
                              onClick={() => handleDelete(type.id)}
                              className="list-action-btn delete-btn"
                              style={{ color: '#dc2626' }}
                              title="Delete"
                            >
                              <Trash2 style={{ width: '16px', height: '16px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ThresholdTypes;