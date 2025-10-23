import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/api-config/config";

const CreateRole = () => {
    const [name, setName] = useState("");
    const [allPermissions, setAllPermissions] = useState([]); // Stores all permissions fetched
    const [currentPermissions, setCurrentPermissions] = useState([]); // Permissions to display on the current page
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Client-side pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [permissionsPerPage] = useState(50); // Number of permissions to show per page (can adjust this value)
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await apiClient.get("/roles/create", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            // Store all fetched permissions
            const fetchedAllPermissions = Array.isArray(response.data.permissions)
                ? response.data.permissions
                : [];
            setAllPermissions(fetchedAllPermissions);

            // Calculate total pages and set initial current permissions
            setTotalPages(Math.ceil(fetchedAllPermissions.length / permissionsPerPage));
            setCurrentPermissions(fetchedAllPermissions.slice(0, permissionsPerPage));

        } catch (error) {
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Effect to update currentPermissions when currentPage or allPermissions changes
    useEffect(() => {
        const indexOfLastPermission = currentPage * permissionsPerPage;
        const indexOfFirstPermission = indexOfLastPermission - permissionsPerPage;
        setCurrentPermissions(allPermissions.slice(indexOfFirstPermission, indexOfLastPermission));
    }, [currentPage, allPermissions, permissionsPerPage]);


    const handleCheckboxChange = (id) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        try {
            await apiClient.post(
                "/roles",
                {
                    name,
                    permission: selectedPermissions,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            alert("Role created successfully!");
            navigate("/admin/roles");
        } catch (error) {
            console.error("Error creating role:", error);
            alert("Failed to create role.");
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Create Role</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Role Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Permissions</label>
                    <div className="row">
                        {currentPermissions.map((perm) => ( // Map over currentPermissions for display
                            <div key={perm.id} className="col-md-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={perm.id}
                                        // Ensure checkbox is checked if its ID is in selectedPermissions
                                        checked={selectedPermissions.includes(perm.id)}
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

                {/* Pagination Controls - Similar Styling */}
                {totalPages > 1 && ( // Only show pagination if there's more than 1 page
                    <nav className="mt-3">
                        <ul className="pagination justify-content-center">
                            {[...Array(totalPages)].map((_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${
                                        currentPage === i + 1
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
                )}

                <button type="submit" className="btn btn-success mt-3">
                    Create Role
                </button>
                
            </form>
        </div>
    );
};

export default CreateRole;