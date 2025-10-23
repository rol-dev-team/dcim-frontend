import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../api/userApi";
import {
  fetchUserTypes,
  fetchUserRoles,
  fetchDepartments,
} from "../api/masterDataApi";
import CommonButton from "../components/CommonButton";


import { usePermissions } from '../context/PermissionContext';

const RegistrationForm = () => {
  const permissions = usePermissions();
  const canRegister = permissions.includes('register');

  const [errorMessage, setErrorMessage] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setIsLoading(true);
        const [userTypesData, rolesData, departmentsData] = await Promise.all([
          fetchUserTypes(),
          fetchUserRoles(),
          fetchDepartments(),
        ]);
        setUserTypes(userTypesData);
        setRoles(rolesData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching master data:", error);
        setErrorMessage("Failed to load form data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasterData();
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .max(100)
      .matches(/^[A-Za-z0-9_]+$/, "Only letters, numbers, and underscores"),
    fullname: Yup.string().required("Fullname is required").max(255),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]+$/, "Mobile must be numeric"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    dept_id: Yup.number()
      .required("Department is required")
      .typeError("Select a department"),
    role_id: Yup.number()
      .required("Role is required")
      .typeError("Select a role"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Minimum 6 characters"),
    password_confirmation: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    user_type_id: Yup.number()
      .required("User type is required")
      .typeError("Select a user type"),
  });

  const formik = useFormik({
    initialValues: {
      user_type_id: "",
      username: "",
      fullname: "",
      mobile: "",
      email: "",
      dept_id: "",
      role_id: "",
      password: "",
      password_confirmation: "",
      is_email: "0",
      is_sms: "0",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Submitting values:", values); // Debug log
        const response = await registerUser(values);
        if (response.message) {
          alert(response.message);
          formik.resetForm();
        }
      } catch (error) {
        console.error("Registration failed:", error);
        setErrorMessage("Failed to register. Try again.");
      }
    },
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? "1" : "0";
    console.log(
      `Checkbox ${name} changed. Checked: ${checked}. Setting value to: ${newValue}`
    );
    formik.setFieldValue(name, newValue);
    formik.setFieldTouched(name, true, false);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container bg-white p-4">
      <h2 className="mb-4 text-center">User Registration</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              name="username"
              type="text"
              placeholder="Username"
              className="form-control"
              {...formik.getFieldProps("username")}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-danger">{formik.errors.username}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="fullname"
              type="text"
              placeholder="Full Name"
              className="form-control"
              {...formik.getFieldProps("fullname")}
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <div className="text-danger">{formik.errors.fullname}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="mobile"
              type="text"
              placeholder="Mobile"
              className="form-control"
              {...formik.getFieldProps("mobile")}
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <div className="text-danger">{formik.errors.mobile}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="form-control"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <select
              name="dept_id"
              className="form-select"
              {...formik.getFieldProps("dept_id")}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {formik.touched.dept_id && formik.errors.dept_id && (
              <div className="text-danger">{formik.errors.dept_id}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <select
              name="role_id"
              className="form-select"
              {...formik.getFieldProps("role_id")}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {formik.touched.role_id && formik.errors.role_id && (
              <div className="text-danger">{formik.errors.role_id}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger">{formik.errors.password}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              {...formik.getFieldProps("password_confirmation")}
            />
            {formik.touched.password_confirmation &&
              formik.errors.password_confirmation && (
                <div className="text-danger">
                  {formik.errors.password_confirmation}
                </div>
              )}
          </div>
          <div className="col-md-6 mb-3">
            <select
              name="user_type_id"
              className="form-select"
              {...formik.getFieldProps("user_type_id")}
            >
              <option value="">Select User Type</option>
              {userTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {formik.touched.user_type_id && formik.errors.user_type_id && (
              <div className="text-danger">{formik.errors.user_type_id}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Notifications</label>
            <div className="form-check">
              <input
                type="checkbox"
                name="is_email"
                id="is_email"
                className="form-check-input"
                checked={formik.values.is_email === "1"}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="is_email" className="form-check-label">
                Email Notifications
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                name="is_sms"
                id="is_sms"
                className="form-check-input"
                checked={formik.values.is_sms === "1"}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="is_sms" className="form-check-label">
                SMS Notifications
              </label>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          {canRegister && (
            // <button type="submit" className="btn btn-success">
            //   Register
            // </button>
<CommonButton type="submit"  name="register" />


            )}
          
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
