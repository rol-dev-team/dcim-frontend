import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { fetchDataCenter, createDataCenter, updateDataCenter } from '../../api/settings/dataCenterApi';
import { fetchDivisions, fetchOwnerTypes } from '../../api/masterDataApi';
import "../../assets/styles/DataCenter.css";

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
            owner_type_id: dataCenter.owner_type_id.toString(),
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      if (isEditMode) {
        await updateDataCenter(id, values);
      } else {
        await createDataCenter(values);
      }
      navigate('/admin/settings/datacenter-show');
    } catch (error) {
      console.error('Error saving data center:', error);
    }
  };

  return (
    <div className="add-data-center-container">
      <h2>{isEditMode ? 'Edit Data Center' : 'Add New Data Center'}</h2>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label>Name:</label>
              <Field type="text" name="name" className="form-control" />
            </div>

            <div className="form-group">
              <label>Division:</label>
              <Field as="select" name="division" className="form-control">
                <option value="">Select Division</option>
                {divisions.map((div) => (
                  <option key={div.id} value={div.name}>
                    {div.name}
                  </option>
                ))}
              </Field>
            </div>

            <div className="form-group">
              <label>Address:</label>
              <Field type="text" name="address" className="form-control" />
            </div>

            <div className="form-group">
              <label>Owner Type:</label>
              <Field as="select" name="owner_type_id" className="form-control">
                <option value="">Select Owner Type</option>
                {ownerTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </Field>
            </div>

            <div className="checkbox-group">
              <Field type="checkbox" name="email_notification" />
              <label>Email Notification</label>
            </div>

            <div className="checkbox-group">
              <Field type="checkbox" name="sms_notification" />
              <label>SMS Notification</label>
            </div>

            <div className="checkbox-group">
              <Field type="checkbox" name="status" />
              <label>Active Status</label>
            </div>

            <div className="button-group">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/admin/settings/datacenter-show')}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddDataCenter;
