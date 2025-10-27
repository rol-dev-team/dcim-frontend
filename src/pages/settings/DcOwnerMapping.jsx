// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   fetchDataCentersForMapping,
//   fetchUsersForMapping,
//   saveDcOwnerMappings,
// } from "../../api/dcOwnerMappingApi";

// const DcOwnerMapping = () => {
//   const [dataCenters, setDataCenters] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const [dataCentersData, usersData] = await Promise.all([
//           fetchDataCentersForMapping(),
//           fetchUsersForMapping(),
//         ]);
//         setDataCenters(dataCentersData);
//         setUsers(usersData);
//       } catch (err) {
//         setError("Failed to load data. Please try again.");
//         console.error("Error loading data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // Form validation schema
//   const validationSchema = Yup.object({
//     user_id: Yup.number().required("User selection is required"),
//     data_center_ids: Yup.array()
//       .min(1, "Select at least one data center")
//       .required("Data center selection is required"),
//   });

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       user_id: "",
//       data_center_ids: [],
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         setError("");
//         setSuccess("");
//         const response = await saveDcOwnerMappings(values);
//         setSuccess(response.message);
//         formik.resetForm();
//       } catch (error) {
//         console.error("Error saving mappings:", error);
//         setError(error.response?.data?.message || "Failed to save mappings");
//       }
//     },
//   });

//   // Handle checkbox changes
//   const handleCheckboxChange = (dataCenterId) => {
//     const currentIds = formik.values.data_center_ids;
//     const newIds = currentIds.includes(dataCenterId)
//       ? currentIds.filter((id) => id !== dataCenterId)
//       : [...currentIds, dataCenterId];
//     formik.setFieldValue("data_center_ids", newIds);
//   };

//   if (loading) {
//     return <div className="text-center p-4">Loading...</div>;
//   }

//   return (
//     <div className="container bg-white p-4">
//       <h2 className="mb-4 text-center">Data Center User Mapping</h2>

//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <form onSubmit={formik.handleSubmit}>
//         <div className="row mb-4">
//           <div className="col-md-6">
//             <label htmlFor="user_id" className="form-label">
//               Select User
//             </label>
//             <select
//               id="user_id"
//               name="user_id"
//               className={`form-select ${
//                 formik.touched.user_id && formik.errors.user_id
//                   ? "is-invalid"
//                   : ""
//               }`}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.user_id}
//             >
//               <option value="">Select User</option>
//               {users.map((user) => (
//                 <option key={user.id} value={user.id}>
//                   {user.username}
//                 </option>
//               ))}
//             </select>
//             {formik.touched.user_id && formik.errors.user_id && (
//               <div className="invalid-feedback">{formik.errors.user_id}</div>
//             )}
//           </div>
//         </div>

//         <div className="row mb-4">
//           <div className="col-12">
//             <label className="form-label">Select Data Centers</label>
//             {formik.touched.data_center_ids && formik.errors.data_center_ids && (
//               <div className="text-danger mb-2">
//                 {formik.errors.data_center_ids}
//               </div>
//             )}
//             <div className="row">
//               {dataCenters.map((dataCenter) => (
//                 <div key={dataCenter.id} className="col-md-4 mb-2">
//                   <div className="form-check">
//                     <input
//                       type="checkbox"
//                       id={`dc-${dataCenter.id}`}
//                       className="form-check-input"
//                       checked={formik.values.data_center_ids.includes(
//                         dataCenter.id
//                       )}
//                       onChange={() => handleCheckboxChange(dataCenter.id)}
//                     />
//                     <label
//                       htmlFor={`dc-${dataCenter.id}`}
//                       className="form-check-label"
//                     >
//                       {dataCenter.name}
//                     </label>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="text-center">
//           <button type="submit" className="btn btn-primary">
//             Save Mappings
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DcOwnerMapping;
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchDataCentersForMapping,
  fetchUsersForMapping,
  saveDcOwnerMappings,
} from "../../api/dcOwnerMappingApi";

// ================================================
// UPDATED STYLE SYSTEM: FULL-WIDTH, NON-CARD LAYOUT
// ================================================
const styles = {
  // Layout
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc", 
    padding: "3rem 4rem", // Full-width padding
    boxSizing: 'border-box',
  },
  contentWrapper: {
    width: "100%",
    // maxWidth removed for full width
  },
  headerSection: {
    marginBottom: "2rem",
    textAlign: 'left',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb', // Simple separator line
  },
  heading: {
    fontSize: "2rem", 
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem", // Tighter spacing
    letterSpacing: '-0.02em', 
  },
  description: {
    fontSize: "1rem",
    color: "#6b7280",
    lineHeight: 1.5,
  },

  // === REMOVED FORM CARD, USING formGroup FOR CONTAINMENT ===
  // formCard is replaced by individual formGroup styling

  // Alerts
  alert: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
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

  // Form groups (Now acts as the contained "block" on the page)
  formGroup: {
    marginBottom: "2rem",
    padding: "1.5rem", // Internal padding for the block
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)', // Subtle shadow
  },
  label: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "0.75rem",
  },
  select: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    backgroundColor: "#fff",
    color: "#111827",
    fontSize: "0.95rem",
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  selectInvalid: {
    borderColor: "#ef4444",
  },
  selectFocus: {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59,130,246,0.3)',
  },
  errorText: {
    color: "#dc2626",
    fontSize: "0.85rem",
    marginTop: "0.5rem",
  },

  // Checkbox Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // Slightly wider min-width
    gap: "0.75rem", // Tighter spacing
    marginTop: '0.75rem',
  },
  checkboxCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.6rem 0.9rem", // Tighter padding
    border: "1px solid #e5e7eb", // Thinner border
    borderRadius: "0.375rem", // Less rounded
    backgroundColor: "#fdfdfe", // Off-white for unselected state
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  checkboxCardHover: {
    borderColor: '#93c5fd',
    backgroundColor: '#f9fafb',
  },
  checkboxCardChecked: {
    backgroundColor: "#ecfdf5",
    borderColor: "#10b981",
  },
  checkbox: {
    width: "1rem",
    height: "1rem",
    accentColor: "#10b981",
    borderRadius: "0.125rem", // Square checkbox
  },
  checkboxLabel: {
    fontSize: "0.9rem",
    color: "#374151",
    fontWeight: 500,
    marginLeft: '0', // Let gap handle spacing
  },
  
  // Preview
  previewBox: {
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    padding: "1rem",
    marginTop: "1.5rem",
    fontSize: "0.9rem",
    color: "#374151",
  },

  // Footer & Button
  actionBar: {
    marginTop: "2rem",
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    fontSize: "0.95rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
  },
  buttonPrimaryHover: {
    backgroundColor: '#1d4ed8',
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
    color: '#6b7280',
    cursor: 'not-allowed',
  },
};

const DcOwnerMapping = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dataCentersData, usersData] = await Promise.all([
          fetchDataCentersForMapping(),
          fetchUsersForMapping(),
        ]);
        setDataCenters(dataCentersData);
        setUsers(usersData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const validationSchema = Yup.object({
    user_id: Yup.number().required("User selection is required"),
    data_center_ids: Yup.array()
      // .min(1, "Select at least one data center") // Validation will be handled by required check
      .required("Data center selection is required"),
  });

  const formik = useFormik({
    initialValues: {
      user_id: "",
      data_center_ids: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");
        const response = await saveDcOwnerMappings(values);
        setSuccess(response.message);
        formik.resetForm();
      } catch (error) {
        console.error("Error saving mappings:", error);
        setError(error.response?.data?.message || "Failed to save mappings");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCheckboxChange = (id) => {
    const currentIds = formik.values.data_center_ids;
    const updatedIds = currentIds.includes(id)
      ? currentIds.filter((dcId) => dcId !== id)
      : [...currentIds, id];
    formik.setFieldValue("data_center_ids", updatedIds);
    formik.setFieldTouched("data_center_ids", true); 
  };

  if (loading && dataCenters.length === 0 && users.length === 0) {
    return (
      <div style={{ ...styles.pageContainer, display: 'flex', justifyContent: "center", alignItems: "center" }}>
        Loading...
      </div>
    );
  }

  const selectedUser = users.find((u) => u.id === Number(formik.values.user_id));
  const selectedDCs = dataCenters.filter((dc) =>
    formik.values.data_center_ids.includes(dc.id)
  );
  
  const isButtonDisabled = loading || !formik.values.user_id || formik.values.data_center_ids.length === 0;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        
        {/* Header Section (Unboxed) */}
        <header style={styles.headerSection}>
          <h1 style={styles.heading}>Data Center Owner Mapping</h1>
          <p style={styles.description}>
            Assign users to manage one or multiple data centers efficiently.
          </p>
        </header>

        {/* Alerts positioned before the form content blocks */}
        {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
        {success && <div style={{ ...styles.alert, ...styles.alertSuccess }}>{success}</div>}

        <form onSubmit={formik.handleSubmit}>
            
            {/* 1. User dropdown (Individual Form Group Block) */}
            <div style={styles.formGroup}>
              <label htmlFor="user_id" style={styles.label}>
                Select User
              </label>
              <select
                id="user_id"
                name="user_id"
                style={{
                  ...styles.select,
                  ...(formik.touched.user_id && formik.errors.user_id
                    ? styles.selectInvalid
                    : {}),
                }}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                value={formik.values.user_id}
                required
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              {formik.touched.user_id && formik.errors.user_id && (
                <div style={styles.errorText}>{formik.errors.user_id}</div>
              )}
            </div>

            {/* 2. Data center checkboxes (Individual Form Group Block) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Data Centers</label>
              <div style={styles.grid}>
                {dataCenters.map((dc) => {
                  const checked = formik.values.data_center_ids.includes(dc.id);
                  return (
                    <label
                      key={dc.id}
                      htmlFor={`dc-${dc.id}`}
                      style={{
                        ...styles.checkboxCard,
                        ...(checked 
                            ? styles.checkboxCardChecked 
                            : {} // No explicit style for unchecked, relies on base
                        ),
                      }}
                      onMouseEnter={e => !checked && (e.currentTarget.style.borderColor = styles.checkboxCardHover.borderColor)}
                      onMouseLeave={e => !checked && (e.currentTarget.style.borderColor = '#e5e7eb')} // Revert to base border color
                    >
                      <input
                        type="checkbox"
                        id={`dc-${dc.id}`}
                        checked={checked}
                        onChange={() => handleCheckboxChange(dc.id)}
                        style={styles.checkbox}
                      />
                      <span style={styles.checkboxLabel}>{dc.name}</span>
                    </label>
                  );
                })}
              </div>
              {formik.touched.data_center_ids && formik.errors.data_center_ids && (
                <div style={styles.errorText}>{formik.errors.data_center_ids}</div>
              )}

              {/* Preview of selection placed inside the Data Center block */}
              {(selectedUser || selectedDCs.length > 0) && (
                <div style={styles.previewBox}>
                  {selectedUser && (
                    <div>
                      <strong>User:</strong> {selectedUser.username}
                    </div>
                  )}
                  {selectedDCs.length > 0 && (
                    <div style={{marginTop: selectedUser ? '0.5rem' : '0'}}>
                      <strong>Data Centers:</strong>{" "}
                      {selectedDCs.map((dc) => dc.name).join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit button (Action Bar outside form groups) */}
            <div style={styles.actionBar}>
              <button
                type="submit"
                disabled={isButtonDisabled}
                style={{
                  ...styles.button,
                  ...(isButtonDisabled
                    ? styles.buttonDisabled
                    : styles.buttonPrimary),
                }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor)}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = styles.buttonPrimary.backgroundColor)}
              >
                {loading ? 'Saving...' : 'Save Mappings'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default DcOwnerMapping;