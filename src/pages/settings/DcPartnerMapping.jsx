// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   fetchDataCentersForMapping,
//   fetchPartnersForMapping,
//   saveDcPartnerMappings,
// } from "../../api/dcOwnerMappingApi";

// const DcPartnerMapping = () => {
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
//           fetchPartnersForMapping(),
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
//     partner_id: Yup.number().required("Partner selection is required"),
//     data_center_ids: Yup.array()
//       .min(1, "Select at least one data center")
//       .required("Data center selection is required"),
//   });

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       partner_id: "",
//       data_center_ids: [],
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         setError("");
//         setSuccess("");
//         const response = await saveDcPartnerMappings(values);
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
//       <h2 className="mb-4 text-center">Data Center Partner Mapping</h2>

//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <form onSubmit={formik.handleSubmit}>
//         <div className="row mb-4">
//           <div className="col-md-6">
//             <label htmlFor="partner_id" className="form-label">
//               Select Partner
//             </label>
//             <select
//               id="partner_id"
//               name="partner_id"
//               className={`form-select ${
//                 formik.touched.partner_id && formik.errors.partner_id
//                   ? "is-invalid"
//                   : ""
//               }`}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.partner_id}
//             >
//               <option value="">Select Partner</option>
//               {users.map((user) => (
//                 <option key={user.id} value={user.id}>
//                   {user.name}
//                 </option>
//               ))}
//             </select>
//             {formik.touched.partner_id && formik.errors.partner_id && (
//               <div className="invalid-feedback">{formik.errors.partner_id}</div>
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

// export default DcPartnerMapping;
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchDataCentersForMapping,
  fetchPartnersForMapping,
  saveDcPartnerMappings,
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
    // maxWidth: "80rem", // REMOVED for full-width layout
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

  // Card - REPLACED. This object now acts as a structural wrapper with NO visual properties.
  formCard: {
    padding: "0", // Remove padding
    transition: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },

  // Alerts
  alert: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
    display: 'flex',
    alignItems: 'center',
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
    gap: '0.5rem',
    fontWeight: 500,
  },
  successIcon: {
    width: '1.25rem',
    height: '1.25rem',
  },

  // Form groups (Now visual blocks sitting on the page background)
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
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // Consistent with previous non-card grids
    gap: "0.75rem", // Tighter spacing
    marginTop: '0.75rem',
  },
  checkboxCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.6rem 0.9rem",
    border: "1px solid #e5e7eb", // Thinner border
    borderRadius: "0.375rem", // Less rounded
    backgroundColor: "#fdfdfe",
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
    borderRadius: "0.125rem",
  },
  checkboxLabel: {
    fontSize: "0.9rem",
    color: "#374151",
    fontWeight: 500,
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

const DcPartnerMapping = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // --- Data Loading Logic (Unchanged) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dataCentersData, partnersData] = await Promise.all([
          fetchDataCentersForMapping(),
          fetchPartnersForMapping(),
        ]);
        setDataCenters(dataCentersData);
        setPartners(partnersData);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Formik & Handlers (Unchanged) ---
  const validationSchema = Yup.object({
    partner_id: Yup.number().required("Partner selection is required"),
    data_center_ids: Yup.array()
      .required("Data center selection is required"),
  });

  const formik = useFormik({
    initialValues: {
      partner_id: "",
      data_center_ids: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");
        const response = await saveDcPartnerMappings(values);
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

  const handleCheckboxChange = (dataCenterId) => {
    const currentIds = formik.values.data_center_ids;
    const newIds = currentIds.includes(dataCenterId)
      ? currentIds.filter((id) => id !== dataCenterId)
      : [...currentIds, dataCenterId];
    formik.setFieldValue("data_center_ids", newIds);
    formik.setFieldTouched("data_center_ids", true);
  };
  // ------------------------------------------

  if (loading && dataCenters.length === 0 && partners.length === 0) {
    return (
      <div style={{ ...styles.pageContainer, display: 'flex', justifyContent: "center", alignItems: "center" }}>
        Loading...
      </div>
    );
  }

  const selectedPartner = partners.find((p) => p.id === Number(formik.values.partner_id));
  const selectedDCs = dataCenters.filter((dc) =>
    formik.values.data_center_ids.includes(dc.id)
  );

  const isButtonDisabled = loading || !formik.values.partner_id || formik.values.data_center_ids.length === 0;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        
        {/* Header Section (Unboxed) */}
        <header style={styles.headerSection}>
          <h1 style={styles.heading}>Data Center Partner Mapping</h1>
          <p style={styles.description}>
            Assign a partner to one or multiple data centers for management and reporting.
          </p>
        </header>

        {/* Alerts positioned before the form content blocks */}
        {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
        {success && (
          <div style={{ ...styles.alert, ...styles.alertSuccess }}>
            <svg style={styles.successIcon} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        )}

        {/* Main Form Content (Replaces the visual formCard) */}
        <form onSubmit={formik.handleSubmit}>
            
            {/* 1. Partner Selection Dropdown (Individual Form Group Block) */}
            <div style={styles.formGroup}>
              <label htmlFor="partner_id" style={styles.label}>
                Select Partner
              </label>
              <select
                id="partner_id"
                name="partner_id"
                style={{
                  ...styles.select,
                  ...(formik.touched.partner_id && formik.errors.partner_id
                    ? styles.selectInvalid
                    : {}),
                }}
                onChange={formik.handleChange}
                onBlur={(e) => {
                    formik.handleBlur(e);
                    setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                value={formik.values.partner_id}
                required
              >
                <option value="">Select a partner...</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
              {formik.touched.partner_id && formik.errors.partner_id && (
                <div style={styles.errorText}>{formik.errors.partner_id}</div>
              )}
            </div>

            {/* 2. Data Center Checkboxes (Individual Form Group Block) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Data Centers</label>
              <div style={styles.grid}>
                {dataCenters.map((dataCenter) => {
                  const checked = formik.values.data_center_ids.includes(dataCenter.id);
                  return (
                    <label
                      key={dataCenter.id}
                      htmlFor={`dc-${dataCenter.id}`}
                      style={{
                        ...styles.checkboxCard,
                        ...(checked 
                            ? styles.checkboxCardChecked 
                            : {}
                        ),
                      }}
                      onMouseEnter={e => !checked && (e.currentTarget.style.borderColor = styles.checkboxCardHover.borderColor)}
                      onMouseLeave={e => !checked && (e.currentTarget.style.borderColor = '#e5e7eb')} // Revert to base border color
                    >
                      <input
                        type="checkbox"
                        id={`dc-${dataCenter.id}`}
                        checked={checked}
                        onChange={() => handleCheckboxChange(dataCenter.id)}
                        style={styles.checkbox}
                      />
                      <span style={styles.checkboxLabel}>{dataCenter.name}</span>
                    </label>
                  );
                })}
              </div>
              {formik.touched.data_center_ids && formik.errors.data_center_ids && (
                <div style={styles.errorText}>{formik.errors.data_center_ids}</div>
              )}

              {/* Preview of selection placed inside the Data Center block */}
              {(selectedPartner || selectedDCs.length > 0) && (
                <div style={styles.previewBox}>
                  {selectedPartner && (
                    <div>
                      <strong>Partner:</strong> {selectedPartner.name}
                    </div>
                  )}
                  {selectedDCs.length > 0 && (
                    <div style={{marginTop: selectedPartner ? '0.5rem' : '0'}}>
                      <strong>Data Centers:</strong>{" "}
                      {selectedDCs.map((dc) => dc.name).join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button (Action Bar outside form groups) */}
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

export default DcPartnerMapping;