import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchDataCentersForMapping,
  fetchUsersForMapping,
  saveDcOwnerMappings,
} from "../../api/dcOwnerMappingApi";

const DcOwnerMapping = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch data on component mount
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
        setError("Failed to load data. Please try again.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Form validation schema
  const validationSchema = Yup.object({
    user_id: Yup.number().required("User selection is required"),
    data_center_ids: Yup.array()
      .min(1, "Select at least one data center")
      .required("Data center selection is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      user_id: "",
      data_center_ids: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError("");
        setSuccess("");
        const response = await saveDcOwnerMappings(values);
        setSuccess(response.message);
        formik.resetForm();
      } catch (error) {
        console.error("Error saving mappings:", error);
        setError(error.response?.data?.message || "Failed to save mappings");
      }
    },
  });

  // Handle checkbox changes
  const handleCheckboxChange = (dataCenterId) => {
    const currentIds = formik.values.data_center_ids;
    const newIds = currentIds.includes(dataCenterId)
      ? currentIds.filter((id) => id !== dataCenterId)
      : [...currentIds, dataCenterId];
    formik.setFieldValue("data_center_ids", newIds);
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container bg-white p-4">
      <h2 className="mb-4 text-center">Data Center User Mapping</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="user_id" className="form-label">
              Select User
            </label>
            <select
              id="user_id"
              name="user_id"
              className={`form-select ${
                formik.touched.user_id && formik.errors.user_id
                  ? "is-invalid"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user_id}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            {formik.touched.user_id && formik.errors.user_id && (
              <div className="invalid-feedback">{formik.errors.user_id}</div>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <label className="form-label">Select Data Centers</label>
            {formik.touched.data_center_ids && formik.errors.data_center_ids && (
              <div className="text-danger mb-2">
                {formik.errors.data_center_ids}
              </div>
            )}
            <div className="row">
              {dataCenters.map((dataCenter) => (
                <div key={dataCenter.id} className="col-md-4 mb-2">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id={`dc-${dataCenter.id}`}
                      className="form-check-input"
                      checked={formik.values.data_center_ids.includes(
                        dataCenter.id
                      )}
                      onChange={() => handleCheckboxChange(dataCenter.id)}
                    />
                    <label
                      htmlFor={`dc-${dataCenter.id}`}
                      className="form-check-label"
                    >
                      {dataCenter.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Save Mappings
          </button>
        </div>
      </form>
    </div>
  );
};

export default DcOwnerMapping;