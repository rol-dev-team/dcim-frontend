import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiClient } from "../api/api-config/config";
const EditRole = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [role, setRole] = useState({ name: "" });
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoleDetails();
    }, []);

    const fetchRoleDetails = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await apiClient.get(`/roles/${id}/edit`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            setRole(response.data.role);
            setAllPermissions(response.data.all_permissions);
            setSelectedPermissions(response.data.role_permissions);
        } catch (error) {
            console.error("Error fetching role data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (permissionId) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        try {
            await apiClient.put(
                `/roles/${id}`,
                {
                    name: role.name,
                    permission: selectedPermissions,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            alert("Role updated successfully!");
            navigate("/admin/roles");
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    if (loading) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Edit Role</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Role Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={role.name}
                        onChange={(e) =>
                            setRole({ ...role, name: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Permissions</label>
                    <div className="row">
                        {allPermissions.map((perm) => (
                            <div key={perm.id} className="col-md-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={perm.id}
                                        checked={selectedPermissions.includes(
                                            perm.id
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(perm.id)
                                        }
                                    />
                                    <label className="form-check-label">
                                        {perm.name}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">
                    Update Role
                </button>
            </form>
        </div>
    );
};

export default EditRole;
