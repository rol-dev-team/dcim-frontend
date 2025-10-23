import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { apiClient } from "../api/api-config/config";

const RoleShow = () => {
    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoleDetails();
    }, []);

    const fetchRoleDetails = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await apiClient.get(`/roles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            setRole(response.data.role);
            setPermissions(response.data.permissions);
        } catch (error) {
            console.error("Error fetching role details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Role Details</h2>
            <div className="card">
                <div className="card-body">
                    <h5>Role Name: {role?.name}</h5>
                    <hr />
                    <h6>Permissions:</h6>
                    {permissions.length > 0 ? (
                        <ul>
                            {permissions.map((permission) => (
                                <li key={permission.id}>{permission.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No permissions assigned.</p>
                    )}
                    <Link to="/admin/roles" className="btn btn-secondary mt-3">
                        Back to Roles
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoleShow;
