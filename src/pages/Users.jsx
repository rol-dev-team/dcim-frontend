import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CommonButton from "../components/CommonButton"; // import at the top of your file

import {
  fetchUsers,
  fetchUser,
  updateUser,
  deleteUser,
} from "../api/userApi";
import {
  fetchUserTypes,
  fetchUserRoles,
  fetchDepartments,
} from "../api/masterDataApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [masterData, setMasterData] = useState({
    userTypes: [],
    roles: [],
    departments: [],
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 8,
    totalItems: 0,
  });
  const navigate = useNavigate();

  // Fetch all data on component mount and page change
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, userTypes, roles, departments] = await Promise.all([
          fetchUsers(),
          fetchUserTypes(),
          fetchUserRoles(),
          fetchDepartments(),
        ]);
        
        setUsers(usersData);
        setPagination(prev => ({
          ...prev,
          totalItems: usersData.length
        }));
        setMasterData({
          userTypes,
          roles,
          departments,
        });
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [pagination.currentPage]);

  // Form validation schema
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
    user_type_id: Yup.number()
      .required("User type is required")
      .typeError("Select a user type"),
    status: Yup.boolean().required("Status is required"),
    is_email: Yup.boolean(),
    is_sms: Yup.boolean(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      user_type_id: "",
      username: "",
      fullname: "",
      mobile: "",
      email: "",
      dept_id: "",
      role_id: "",
      status: true,
      is_email: false,
      is_sms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editMode) {
          const updatedUser = await updateUser(currentUserId, values);
          setUsers(users.map(user => 
            user.id === currentUserId ? updatedUser.user : user
          ));
          alert("User updated successfully");
        }
        setEditMode(false);
        formik.resetForm();
      } catch (error) {
        console.error("Error saving user:", error);
        setError(error.response?.data?.message || "Failed to save user");
      }
    },
  });

  // Handle edit button click
  const handleEdit = async (id) => {
    try {
      const user = await fetchUser(id);
      setCurrentUserId(id);
      setEditMode(true);
      
      // Convert "1"/"0" strings to booleans for checkboxes
      const userData = {
        ...user,
        status: user.status === 1,
        is_email: user.is_email === "1",
        is_sms: user.is_sms === "1",
      };
      
      formik.setValues(userData);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user data");
    }
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        setPagination(prev => ({
          ...prev,
          totalItems: prev.totalItems - 1
        }));
        alert("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user");
      }
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    formik.setFieldValue(name, checked);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({
      ...prev,
      currentPage: pageNumber
    }));
  };

  // Calculate pagination
  const indexOfLastItem = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - pagination.itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container bg-white p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
        
        
        <CommonButton
  name="addUser"
  onClick={() => navigate("/admin/settings/userregister")}
/>


      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Edit Form (shown when in edit mode) */}
      {editMode && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>Edit User</h3>
          </div>
          <div className="card-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Username</label>
                  <input
                    name="username"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("username")}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="text-danger">{formik.errors.username}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Full Name</label>
                  <input
                    name="fullname"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("fullname")}
                  />
                  {formik.touched.fullname && formik.errors.fullname && (
                    <div className="text-danger">{formik.errors.fullname}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Mobile</label>
                  <input
                    name="mobile"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("mobile")}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="text-danger">{formik.errors.mobile}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger">{formik.errors.email}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Department</label>
                  <select
                    name="dept_id"
                    className="form-select"
                    {...formik.getFieldProps("dept_id")}
                  >
                    <option value="">Select Department</option>
                    {masterData.departments.map((dept) => (
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
                  <label>Role</label>
                  <select
                    name="role_id"
                    className="form-select"
                    {...formik.getFieldProps("role_id")}
                  >
                    <option value="">Select Role</option>
                    {masterData.roles.map((role) => (
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
                  <label>User Type</label>
                  <select
                    name="user_type_id"
                    className="form-select"
                    {...formik.getFieldProps("user_type_id")}
                  >
                    <option value="">Select User Type</option>
                    {masterData.userTypes.map((type) => (
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
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-select"
                    {...formik.getFieldProps("status")}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-danger">{formik.errors.status}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Notifications</label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="is_email"
                      id="is_email"
                      className="form-check-input"
                      checked={formik.values.is_email}
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
                      checked={formik.values.is_sms}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="is_sms" className="form-check-label">
                      SMS Notifications
                    </label>
                  </div>
                </div>
              </div>
            
            
              {/* <div className="mt-3">

                <button type="submit" className="btn btn-primary me-2">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditMode(false);
                    formik.resetForm();
                  }}
                >
                  Cancel
                </button>
              </div> */}


              {/*replacing below code by tahisn ---- */}
<div className="mt-3">
  <CommonButton type="submit" name="save" />
  <CommonButton
    type="button"
    name="cancel"
    onClick={() => {
      setEditMode(false);
      formik.resetForm();
    }}
  />
</div>


            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="table-responsive mb-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>
                  {masterData.departments.find(d => d.id === user.dept_id)?.name || user.dept_id}
                </td>
                <td>
                  {masterData.roles.find(r => r.id === user.role_id)?.name || user.role_id}
                </td>
                <td>
                  <span className={`badge ${user.status ? 'bg-success' : 'bg-secondary'}`}>
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <CommonButton name="edit" onClick={() => handleEdit(user.id)} />
                    <CommonButton name="delete" onClick={() => handleDelete(user.id)} />
  
                  </div>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalItems > pagination.itemsPerPage && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </button>
            </li>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <li 
                key={number} 
                className={`page-item ${pagination.currentPage === number ? 'active' : ''}`}
              >
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${pagination.currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Users;