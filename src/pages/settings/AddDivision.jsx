// import React, { useState } from 'react';
// import { useFormik } from "formik";
// import { CardComponent } from '../../components/CardComponent';
// import { divisionValidationSchema } from '../../schema/ValidationSchemas';
// import { createDivision } from '../../api/settings/divisionApi';
// import { errorMessage, successMessage } from '../../api/api-config/apiResponseMessage';

// export const AddDivision = () => {
//     const[isLoadingCreate,setIsLoadingCreate]=useState(false);

//     const formikCreateDivision = useFormik({
//         initialValues: {
//           divisionName: "", 
//         },
//         validationSchema: divisionValidationSchema,
//         onSubmit: (values, { resetForm }) => {
//           const formData = new FormData();
//           formData.append("divisionName", values.divisionName); 
          
//           setIsLoadingCreate(true);
//           createDivision(formData)
//             .then((response) => {
//               successMessage(response);
//             })
//             .catch(errorMessage)
//             .finally(() => {
//               setIsLoadingCreate(false);
//               resetForm();
//             });
//         },
//       }
//     );
//       console.log(formikCreateDivision.errors);
//       const inputFields = (
//         <form className='row' onSubmit={formikCreateDivision.handleSubmit}> 
//           <div className='col-12 col-sm-4'>
//             <div className="mb-3">
//               <input
//                 type="text"
//                 className={`form-control ${formikCreateDivision.errors.divisionName && formikCreateDivision.touched.divisionName ? 'is-invalid' : ''}`}
//                 id="divisionName" 
//                 name="divisionName" 
//                 placeholder="Name"
//                 value={formikCreateDivision.values.divisionName} 
//                 onChange={formikCreateDivision.handleChange} 
//                 onBlur={formikCreateDivision.handleBlur}
//               />
          
//               {formikCreateDivision.errors.divisionName && formikCreateDivision.touched.divisionName && (
//           <div className="invalid-feedback">
//             {formikCreateDivision.errors.divisionName}
//           </div>
//         )}
//             </div>
//           </div>
//           <div className='col-12 col-sm-2'>
//             <button type='submit' className='submit-btn'>
//               {isLoadingCreate ? 'Creating...' : 'Create'}
//             </button>
//           </div>
//         </form>
//       );
      
      
//   return (
//     <div className='container-fluid'>
//       <CardComponent title="Add New Division" inputFields={inputFields} />
//     </div>
//   )
// }
import React, { useState } from 'react';
import { useFormik } from "formik";
import { CardComponent } from '../../components/CardComponent'; // Assuming this component exists
// Assuming the Button component is in this path
import Button from '../../components/ui/Button'; 

import { divisionValidationSchema } from '../../schema/ValidationSchemas';
import { createDivision } from '../../api/settings/divisionApi';
import { errorMessage, successMessage } from '../../api/api-config/apiResponseMessage';

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
/* Styles for the inner content container if used outside CardComponent */
.simple-form-container {
    padding: 16px; 
    border-radius: 0.5rem;
}

/* Form Group for Fields (Adjusted for simple horizontal layout) */
.form-group-inline {
    display: flex;
    align-items: flex-start; /* Align error messages below input */
    gap: 16px; 
}

/* Input container for spacing/error */
.input-field-wrapper {
    flex: 1; /* Take up remaining space */
    max-width: 300px; /* Constrain width for a compact component */
}

.form-group label {
    display: block;
    font-size: 0.875rem; 
    font-weight: 500;
    color: #374151; 
    margin-bottom: 4px; 
}

.form-control {
    width: 100%;
    padding: 0.75rem; 
    border: 1px solid #d1d5db; 
    border-radius: 0.375rem; 
    box-sizing: border-box;
    font-size: 1rem;
}

/* Formik error feedback styling */
.invalid-feedback {
    color: var(--btn-danger);
    font-size: 0.875rem; 
    margin-top: 4px;
}
.form-control.is-invalid {
    border-color: var(--btn-danger);
    padding-right: calc(1.5em + 0.75rem); /* Space for optional icon */
    background-image: none; /* Remove default Bootstrap invalid icon */
}

/* Button container */
.form-action-btn {
    align-self: flex-start; /* Aligns button to the top of the input */
    padding-top: 24px; /* Matches label/input height to align button */
}
`;
// ================================================================

export const AddDivision = () => {
    const[isLoadingCreate, setIsLoadingCreate] = useState(false);

    const formikCreateDivision = useFormik({
        initialValues: {
          divisionName: "", 
        },
        validationSchema: divisionValidationSchema,
        onSubmit: (values, { resetForm }) => {
          const formData = new FormData();
          formData.append("divisionName", values.divisionName); 
          
          setIsLoadingCreate(true);
          createDivision(formData)
            .then((response) => {
              successMessage(response);
            })
            .catch(errorMessage)
            .finally(() => {
              setIsLoadingCreate(false);
              resetForm();
            });
        },
      }
    );
      
    // Redefining inputFields with new UI/UX
      const inputFields = (
        <form onSubmit={formikCreateDivision.handleSubmit}> 
            <div className='form-group-inline'>
                <div className='input-field-wrapper'>
                    <div className="form-group">
                        <label htmlFor="divisionName">Division Name</label>
                        <input
                            type="text"
                            className={`form-control ${formikCreateDivision.errors.divisionName && formikCreateDivision.touched.divisionName ? 'is-invalid' : ''}`}
                            id="divisionName" 
                            name="divisionName" 
                            placeholder="Enter new division name"
                            value={formikCreateDivision.values.divisionName} 
                            onChange={formikCreateDivision.handleChange} 
                            onBlur={formikCreateDivision.handleBlur}
                        />
                        
                        {formikCreateDivision.errors.divisionName && formikCreateDivision.touched.divisionName && (
                            <div className="invalid-feedback">
                                {formikCreateDivision.errors.divisionName}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className='form-action-btn'>
                    <Button 
                        type='submit' 
                        intent="primary"
                        loading={isLoadingCreate}
                        loadingText='Creating...'
                        disabled={isLoadingCreate || !formikCreateDivision.isValid || !formikCreateDivision.values.divisionName}
                    >
                        Create
                    </Button>
                </div>
            </div>
        </form>
      );
      
  return (
    <div className='container-fluid'>
        <style>{buttonStyles}</style>
        <style>{formLayoutStyles}</style>
      <CardComponent title="Add New Division" inputFields={inputFields} />
    </div>
  )
}