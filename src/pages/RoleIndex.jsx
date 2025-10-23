import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { usePermissions } from "../context/PermissionContext";
// import { usePermissions } from '../PermissionContext';
import { apiClient } from "../api/api-config/config";
// axios.defaults.baseURL = 'http://182.48.80.49:8080';
import CommonButton from "../components/CommonButton"; // import at the top of your file

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });

    const permissions = usePermissions(); // 👈 Access permission context
    const canDeleteRole = permissions.includes("role-delete");
    const canCreateRole = permissions.includes("role-create");
    const canShowRole = permissions.includes("role-list");
    const canEditRole = permissions.includes("role-edit");

    useEffect(() => {
        fetchRoles(pagination.current_page);
    }, []);

    const fetchRoles = async (page = 1) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");

            const response = await apiClient.get(`/roles?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            setRoles(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
            });
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure you want to delete this role?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            const token = localStorage.getItem("access_token");
                            await apiClient.delete(`/roles/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: "application/json",
                                },
                            });
                            fetchRoles(pagination.current_page);
                        } catch (error) {
                            console.error("Error deleting role:", error);
                        }
                    },
                },
                { label: "No" },
            ],
        });
    };

    const handlePageChange = (newPage) => {
        fetchRoles(newPage);
    };

    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }
    console.log(canDeleteRole);
    console.log(permissions);
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Role Management</h2>
                {canCreateRole && (
                    <Link to="/admin/roles/create" className="btn btn-success text-white">
                        + Create New Role
                    </Link>
                )}
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {/* <tbody>
                                {roles.length > 0 ? (
                                    roles.map((role, index) => (
                                        <tr key={role.id}>
                                            <td>
                                                {(pagination.current_page - 1) *
                                                    5 +
                                                    index +
                                                    1}
                                            </td>
                                            <td>{role.name}</td>
                                            <td>
                                                {canShowRole && (
                                                    <Link
                                                        to={`/admin/roles/${role.id}`}
                                                        className="btn btn-info btn-sm me-2"
                                                    >
                                                        Show
                                                    </Link>
                                                )}

                                                {canEditRole && (
                                                    <Link
                                                        to={`/admin/roles/${role.id}/edit`}
                                                        className="btn btn-primary btn-sm me-2"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}

                                                {canDeleteRole && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                role.id
                                                            )
                                                        }
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            No roles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody> */}
                        <tbody>
  {roles.length > 0 ? (
    roles.map((role, index) => (
      <tr key={role.id}>
        <td>
          {(pagination.current_page - 1) * 5 + index + 1}
        </td>
        <td>{role.name}</td>
        <td>
          {/* Show Button */}
          {canShowRole && (
  <Link to={`/admin/roles/${role.id}`} className="me-2">
    <CommonButton name="show" />
  </Link>
)}


          {/* Edit Button using CommonButton */}
          {canEditRole && (
            <Link
              to={`/admin/roles/${role.id}/edit`}
              className="me-2"
            >
              <CommonButton name="edit" />
            </Link>
          )}

          {/* Delete Button using CommonButton */}
          {canDeleteRole && (
            <CommonButton
              name="delete"
              onClick={() => handleDelete(role.id)}
            />
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="text-center">
        No roles found.
      </td>
    </tr>
  )}
</tbody>

                        
                        
                        
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <nav className="mt-3">
                        <ul className="pagination justify-content-center">
                            {[...Array(pagination.last_page)].map((_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${
                                        pagination.current_page === i + 1
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default RoleList;
