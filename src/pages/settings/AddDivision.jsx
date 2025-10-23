import React, { useState } from 'react';
import { useFormik } from "formik";
import { CardComponent } from '../../components/CardComponent';
import { divisionValidationSchema } from '../../schema/ValidationSchemas';
import { createDivision } from '../../api/settings/divisionApi';
import { errorMessage, successMessage } from '../../api/api-config/apiResponseMessage';

export const AddDivision = () => {
    const[isLoadingCreate,setIsLoadingCreate]=useState(false);

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
      console.log(formikCreateDivision.errors);
      const inputFields = (
        <form className='row' onSubmit={formikCreateDivision.handleSubmit}> 
          <div className='col-12 col-sm-4'>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${formikCreateDivision.errors.divisionName && formikCreateDivision.touched.divisionName ? 'is-invalid' : ''}`}
                id="divisionName" 
                name="divisionName" 
                placeholder="Name"
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
          <div className='col-12 col-sm-2'>
            <button type='submit' className='submit-btn'>
              {isLoadingCreate ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      );
      
      
  return (
    <div className='container-fluid'>
      <CardComponent title="Add New Division" inputFields={inputFields} />
    </div>
  )
}
