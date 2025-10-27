// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Formik, Form, Field } from 'formik';
// import { fetchDataCenter, createDataCenter, updateDataCenter } from '../../api/settings/dataCenterApi';
// import { fetchDivisions, fetchOwnerTypes } from '../../api/masterDataApi';
// import "../../assets/styles/DataCenter.css";

// const AddDataCenter = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [ownerTypes, setOwnerTypes] = useState([]);
//   const [divisions, setDivisions] = useState([]);

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [initialValues, setInitialValues] = useState({
//     name: '',
//     division: '',
//     address: '',
//     email_notification: false,
//     sms_notification: false,
//     owner_type_id: '',
//     status: true,
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const types = await fetchOwnerTypes();
//         setOwnerTypes(types);

//         const divisionsData = await fetchDivisions();
//         setDivisions(divisionsData);

//         if (id) {
//           setIsEditMode(true);
//           const dataCenter = await fetchDataCenter(id);
//           setInitialValues({
//             ...dataCenter,
//             owner_type_id: dataCenter.owner_type_id.toString(),
//           });
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//       }
//     };

//     loadData();
//   }, [id]);

//   const handleSubmit = async (values) => {
//     try {
//       if (isEditMode) {
//         await updateDataCenter(id, values);
//       } else {
//         await createDataCenter(values);
//       }
//       navigate('/admin/settings/datacenter-show');
//     } catch (error) {
//       console.error('Error saving data center:', error);
//     }
//   };

//   return (
//     <div className="add-data-center-container">
//       <h2>{isEditMode ? 'Edit Data Center' : 'Add New Data Center'}</h2>

//       <Formik
//         initialValues={initialValues}
//         enableReinitialize
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form>
//             <div className="form-group">
//               <label>Name:</label>
//               <Field type="text" name="name" className="form-control" />
//             </div>

//             <div className="form-group">
//               <label>Division:</label>
//               <Field as="select" name="division" className="form-control">
//                 <option value="">Select Division</option>
//                 {divisions.map((div) => (
//                   <option key={div.id} value={div.name}>
//                     {div.name}
//                   </option>
//                 ))}
//               </Field>
//             </div>

//             <div className="form-group">
//               <label>Address:</label>
//               <Field type="text" name="address" className="form-control" />
//             </div>

//             <div className="form-group">
//               <label>Owner Type:</label>
//               <Field as="select" name="owner_type_id" className="form-control">
//                 <option value="">Select Owner Type</option>
//                 {ownerTypes.map((type) => (
//                   <option key={type.id} value={type.id}>{type.name}</option>
//                 ))}
//               </Field>
//             </div>

//             <div className="checkbox-group">
//               <Field type="checkbox" name="email_notification" />
//               <label>Email Notification</label>
//             </div>

//             <div className="checkbox-group">
//               <Field type="checkbox" name="sms_notification" />
//               <label>SMS Notification</label>
//             </div>

//             <div className="checkbox-group">
//               <Field type="checkbox" name="status" />
//               <label>Active Status</label>
//             </div>

//             <div className="button-group">
//               <button type="submit" className="submit-btn" disabled={isSubmitting}>
//                 {isSubmitting ? 'Saving...' : 'Save'}
//               </button>
//               <button
//                 type="button"
//                 className="cancel-btn"
//                 onClick={() => navigate('/admin/settings/datacenter-show')}
//               >
//                 Cancel
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default AddDataCenter;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { ArrowLeft } from 'lucide-react'; // Import icon
import * as Yup from "yup"; // Import Yup for validation

// Assuming the Button component is in this path
import Button from '../../components/ui/Button';

// Import API functions
import { fetchDataCenter, createDataCenter, updateDataCenter } from '../../api/settings/dataCenterApi';
import { fetchDivisions, fetchOwnerTypes } from '../../api/masterDataApi';
// REMOVED: import "../../assets/styles/DataCenter.css";

// ================================================================
// 1. VALIDATION SCHEMA
// ================================================================
const DataCenterSchema = Yup.object().shape({
    name: Yup.string().max(255, "Name is too long").required("Name is required"),
    division: Yup.string().required("Division is required"),
    address: Yup.string().max(500, "Address is too long").required("Address is required"),
    owner_type_id: Yup.string().required("Owner Type is required"),
    // Checkboxes are generally booleans/numbers and don't need required() if default is set
});

// ================================================================
// 2. CSS FOR LAYOUT AND UI/UX MATCH
// Reusing the styles defined in the previous component for consistency.
// ================================================================
const buttonStyles = `
/* CSS for the Button component (replicated from previous answer) */
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

.text-danger {
    color: var(--btn-danger);
    font-size: 0.875rem; 
    margin-top: 4px;
}

/* Checkbox Grouping */
.checkbox-field-group {
    display: flex;
    flex-direction: column;
    gap: 8px; /* space-y-2 */
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


const AddDataCenter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ownerTypes, setOwnerTypes] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    division: '',
    address: '',
    email_notification: false,
    sms_notification: false,
    owner_type_id: '',
    status: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const types = await fetchOwnerTypes();
        setOwnerTypes(types);

        const divisionsData = await fetchDivisions();
        setDivisions(divisionsData);

        if (id) {
          setIsEditMode(true);
          const dataCenter = await fetchDataCenter(id);
          setInitialValues({
            ...dataCenter,
            // Ensure boolean/string types match form expectations
            owner_type_id: dataCenter.owner_type_id.toString(),
            email_notification: !!dataCenter.email_notification,
            sms_notification: !!dataCenter.sms_notification,
            status: !!dataCenter.status,
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
        // Convert booleans back to expected format (e.g., 0/1 or just send booleans if API handles it)
        // Assuming API expects booleans for now, as Formik handles checkboxes as booleans
        const dataToSend = {
            ...values,
            owner_type_id: Number(values.owner_type_id),
        };

        if (isEditMode) {
            await updateDataCenter(id, dataToSend);
        } else {
            await createDataCenter(dataToSend);
        }
        navigate('/admin/settings/datacenter-show');
    } catch (error) {
        console.error('Error saving data center:', error);
    } finally {
        setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/settings/datacenter-show');
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const formTitle = isEditMode ? 'Edit Data Center Details' : 'Data Center Registration';
  const formSubtitle = isEditMode ? 'Modify the existing data center details.' : 'Register a new data center location.';

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
                aria-label="Back to Data Centers"
              >
                {/* Back button content is empty, icon handles visual */}
              </Button>
              {formTitle}
            </h1>
            <p>{formSubtitle}</p>
          </div>
        </header>

        {/* ================================================================
            FORMIK FORM (Grid Layout)
            ================================================================ */}
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={DataCenterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="form-grid">
              
              {/* Row 1: Name and Division */}
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <Field type="text" id="name" name="name" className="form-control" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label htmlFor="division">Division:</label>
                <Field as="select" id="division" name="division" className="form-control">
                  <option value="">Select Division</option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.name}>
                      {div.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="division" component="div" className="text-danger" />
              </div>
              
              {/* Row 2: Address and Owner Type */}
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <Field type="text" id="address" name="address" className="form-control" />
                <ErrorMessage name="address" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label htmlFor="owner_type_id">Owner Type:</label>
                <Field as="select" id="owner_type_id" name="owner_type_id" className="form-control">
                  <option value="">Select Owner Type</option>
                  {ownerTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="owner_type_id" component="div" className="text-danger" />
              </div>

              {/* Row 3: Notifications and Status (Grouping them into one column) */}
              <div className="checkbox-field-group">
                  <label>Settings & Notifications:</label>
                  
                  <div className="checkbox-item">
                      <Field type="checkbox" id="email_notification" name="email_notification" />
                      <label htmlFor="email_notification">Email Notification</label>
                  </div>
                  
                  <div className="checkbox-item">
                      <Field type="checkbox" id="sms_notification" name="sms_notification" />
                      <label htmlFor="sms_notification">SMS Notification</label>
                  </div>
                  
                  <div className="checkbox-item">
                      <Field type="checkbox" id="status" name="status" />
                      <label htmlFor="status">Active Status</label>
                  </div>
              </div>
              
              {/* Empty div for the second column on this row to maintain grid alignment */}
              <div></div>

              {/* ================================================================
                  ACTIONS FOOTER (Uses new Button component)
                  ================================================================ */}
              <div className="form-actions">
                <Button
                  type="button"
                  intent="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  intent="primary"
                  loading={isSubmitting}
                  loadingText={isEditMode ? 'Updating...' : 'Saving Details...'}
                  disabled={isSubmitting || !isValid}
                >
                  {isEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

// Add Formik's ErrorMessage component for proper error handling
const ErrorMessage = ({ name, component, className }) => (
    <Field name={name}>
        {({ meta }) => meta.touched && meta.error ? (
            React.createElement(component || 'div', { className }, meta.error)
        ) : null}
    </Field>
);

export default AddDataCenter;