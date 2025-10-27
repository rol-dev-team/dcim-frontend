// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { apiClient } from "../api/api-config/config";

// const CreateRole = () => {
//     const [name, setName] = useState("");
//     const [allPermissions, setAllPermissions] = useState([]); // Stores all permissions fetched
//     const [currentPermissions, setCurrentPermissions] = useState([]); // Permissions to display on the current page
//     const [selectedPermissions, setSelectedPermissions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     // Client-side pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const [permissionsPerPage] = useState(50); // Number of permissions to show per page (can adjust this value)
//     const [totalPages, setTotalPages] = useState(1);

//     useEffect(() => {
//         fetchPermissions();
//     }, []);

//     const fetchPermissions = async () => {
//         try {
//             const token = localStorage.getItem("access_token");
//             const response = await apiClient.get("/roles/create", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     Accept: "application/json",
//                 },
//             });

//             // Store all fetched permissions
//             const fetchedAllPermissions = Array.isArray(response.data.permissions)
//                 ? response.data.permissions
//                 : [];
//             setAllPermissions(fetchedAllPermissions);

//             // Calculate total pages and set initial current permissions
//             setTotalPages(Math.ceil(fetchedAllPermissions.length / permissionsPerPage));
//             setCurrentPermissions(fetchedAllPermissions.slice(0, permissionsPerPage));

//         } catch (error) {
//             console.error("Error fetching permissions:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Effect to update currentPermissions when currentPage or allPermissions changes
//     useEffect(() => {
//         const indexOfLastPermission = currentPage * permissionsPerPage;
//         const indexOfFirstPermission = indexOfLastPermission - permissionsPerPage;
//         setCurrentPermissions(allPermissions.slice(indexOfFirstPermission, indexOfLastPermission));
//     }, [currentPage, allPermissions, permissionsPerPage]);


//     const handleCheckboxChange = (id) => {
//         setSelectedPermissions((prev) =>
//             prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
//         );
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem("access_token");

//         try {
//             await apiClient.post(
//                 "/roles",
//                 {
//                     name,
//                     permission: selectedPermissions,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         Accept: "application/json",
//                     },
//                 }
//             );

//             alert("Role created successfully!");
//             navigate("/admin/roles");
//         } catch (error) {
//             console.error("Error creating role:", error);
//             alert("Failed to create role.");
//         }
//     };

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     if (loading) return <div className="text-center mt-4">Loading...</div>;

//     return (
//         <div className="container mt-4">
//             <h2>Create Role</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label>Role Name</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label>Permissions</label>
//                     <div className="row">
//                         {currentPermissions.map((perm) => ( // Map over currentPermissions for display
//                             <div key={perm.id} className="col-md-4">
//                                 <div className="form-check">
//                                     <input
//                                         className="form-check-input"
//                                         type="checkbox"
//                                         value={perm.id}
//                                         // Ensure checkbox is checked if its ID is in selectedPermissions
//                                         checked={selectedPermissions.includes(perm.id)}
//                                         onChange={() =>
//                                             handleCheckboxChange(perm.id)
//                                         }
//                                     />
//                                     <label className="form-check-label">
//                                         {perm.name}
//                                     </label>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Pagination Controls - Similar Styling */}
//                 {totalPages > 1 && ( // Only show pagination if there's more than 1 page
//                     <nav className="mt-3">
//                         <ul className="pagination justify-content-center">
//                             {[...Array(totalPages)].map((_, i) => (
//                                 <li
//                                     key={i}
//                                     className={`page-item ${
//                                         currentPage === i + 1
//                                             ? "active"
//                                             : ""
//                                     }`}
//                                 >
//                                     <button
//                                         className="page-link"
//                                         onClick={() => handlePageChange(i + 1)}
//                                     >
//                                         {i + 1}
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </nav>
//                 )}

//                 <button type="submit" className="btn btn-success mt-3">
//                     Create Role
//                 </button>
                
//             </form>
//         </div>
//     );
// };

// export default CreateRole;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/api-config/config";
import { ChevronLeft, ChevronRight } from "lucide-react";

const style = {
    // === LAYOUT & BACKGROUND (True Full-Width, Non-Card) ===
    appBackground: {
        minHeight: '100vh',
        backgroundColor: '#f9fafb', // Light Gray background
        padding: '2rem 4rem', // Generous padding on all sides
        boxSizing: 'border-box',
    },
    
    // Header is separated by a subtle line, not a container
    header: {
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e5e7eb', // Simple separator line
    },
    h1: {
        fontSize: '1.875rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '0.25rem', // Tighter spacing below header
    },
    p: {
        color: '#6b7280',
        fontSize: '1rem',
    },

    // Main content area is now the direct child of the form, with no explicit card style
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem', // Generous spacing between major form groups (Name and Permissions)
    },
    
    // Input Group Styles
    inputGroup: {
        marginBottom: '1.5rem', // Spacing below each form control
    },
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        color: '#1f2937',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    },
    inputFocus: {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
        outline: 'none',
    },

    // === PERMISSIONS GRID & CHECKBOXES ===
    permissionsSection: {
        // This whole section will sit directly on the page background
        paddingTop: '0.5rem',
    },
    permissionsHeader: { // New style for the header row with Select All/Unselect All
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
    },
    permissionsActions: { // New style for the buttons group
        display: 'flex',
        gap: '0.5rem',
    },
    actionButton: { // New style for the Select/Unselect All buttons
        padding: '0.375rem 0.75rem',
        borderRadius: '0.375rem',
        fontSize: '0.75rem', // Smaller font size for utility buttons
        fontWeight: '500',
        border: '1px solid #d1d5db',
        backgroundColor: '#ffffff',
        color: '#374151',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        minWidth: '70px',
    },
    actionButtonHover: {
        backgroundColor: '#f3f4f6',
    },
    permissionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '0.75rem', // Tighter gap for better density
        marginBottom: '1.5rem',
        padding: '1rem', // Add a light padding to visually contain the grid
        backgroundColor: '#ffffff', // Use a white block only for the list of items
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
    },
    permissionLabel: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 0.75rem', // Smaller padding
        borderRadius: '0.25rem', // Smaller rounding
        border: '1px solid transparent', // Start with transparent border
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        backgroundColor: '#f9fafb', // Very light background for unselected state
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
    },
    permissionLabelHover: {
        borderColor: '#93c5fd', // Light blue hover
    },
    permissionLabelSelected: {
        backgroundColor: '#ecfdf5', // bg-green-50
        borderColor: '#34d399', // light green border
    },
    permissionText: {
        marginLeft: '0.75rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
    },
    permissionTextSelected: {
        color: '#059669', // darker green text
    },
    checkbox: {
        width: '1rem',
        height: '1rem',
        minWidth: '1rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.125rem',
        accentColor: '#10b981',
    },

    // === PAGINATION ===
    paginationContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        paddingTop: '1rem',
        marginTop: '1.5rem',
    },
    paginationButton: {
        minWidth: '38px',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        border: '1px solid #d1d5db',
        backgroundColor: '#ffffff',
        color: '#374151',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
    },
    paginationButtonActive: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        border: '1px solid #2563eb',
    },
    paginationChevron: {
        padding: '0.5rem',
        borderRadius: '0.375rem',
        border: '1px solid #d1d5db',
        backgroundColor: '#ffffff',
        color: '#374151',
        cursor: 'pointer',
    },
    disabled: {
        opacity: '0.4',
        cursor: 'not-allowed',
    },

    // === SUBMIT BUTTON & FEEDBACK ===
    actionGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem',
    },
    submitButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: '500',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease-in-out',
    },
    submitButtonDisabled: {
        backgroundColor: '#d1d5db',
        cursor: 'not-allowed',
    },
    successMessage: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#ecfdf5', // Lighter green success background
        color: '#059669',
        borderRadius: '0.375rem',
        border: '1px solid #d1fae5',
        fontSize: '0.875rem',
        fontWeight: '500',
    },
};

const CreateRole = () => {
    const [name, setName] = useState("");
    const [allPermissions, setAllPermissions] = useState([]);
    const [currentPermissions, setCurrentPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [permissionsPerPage] = useState(50);
    const [totalPages, setTotalPages] = useState(1);

    // --- API & State Logic (Unchanged) ---
    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await apiClient.get("/roles/create", {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const fetchedAllPermissions = Array.isArray(response.data.permissions)
                ? response.data.permissions
                : [];
            setAllPermissions(fetchedAllPermissions);
            const calculatedTotalPages = Math.ceil(fetchedAllPermissions.length / permissionsPerPage);
            setTotalPages(calculatedTotalPages);
            setCurrentPermissions(fetchedAllPermissions.slice(0, permissionsPerPage));
        } catch (error) {
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
    };

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

    // --- NEW HANDLERS FOR SELECT/UNSELECT ALL ---
    const handleSelectAll = () => {
        // Get the IDs of all permissions (not just the current page)
        const allIds = allPermissions.map(perm => perm.id);
        // Use a Set to ensure only unique IDs and merge with existing selections
        setSelectedPermissions(prev => Array.from(new Set([...prev, ...allIds])));
    };

    const handleUnselectAll = () => {
        // Clear all selected permissions
        setSelectedPermissions([]);
    };
    // --- END NEW HANDLERS ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || selectedPermissions.length === 0) return;

        const token = localStorage.getItem("access_token");

        try {
            setSaving(true);
            await apiClient.post("/roles", { name, permission: selectedPermissions }, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                navigate("/admin/roles");
            }, 1500);

        } catch (error) {
            console.error("Error creating role:", error);
            alert("Failed to create role.");
        } finally {
            setSaving(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Helper function for smart pagination display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };
    // --- End API & State Logic ---


    if (loading) {
        return (
            <div style={{...style.appBackground, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={style.p}>Loading permissions...</div>
            </div>
        );
    }

    // Determine if all permissions are currently selected to potentially disable the "Select All" button
    const allPermissionsSelected = selectedPermissions.length === allPermissions.length;


    return (
        <div style={style.appBackground}>
            
            {/* Header Section (Unboxed, with bottom border separator) */}
            <div style={style.header}>
                <h1 style={style.h1}>Create Role</h1>
                <p style={style.p}>Define a new role and assign permissions</p>
            </div>

            <form onSubmit={handleSubmit} style={style.formContainer}>
                
                {/* 1. Role Name Input Section (Individual Input Group) */}
                <div style={style.inputGroup}>
                    <label htmlFor="roleName" style={style.label}>
                        Role Name
                    </label>
                    <input
                        id="roleName"
                        type="text"
                        style={style.input}
                        onFocus={(e) => e.currentTarget.style.boxShadow = style.inputFocus.boxShadow}
                        onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                        placeholder="Enter role name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* 2. Permissions Selection Section (Uses a white container just for the grid) */}
                <div style={style.permissionsSection}>
                    
                    {/* Permissions Header with Select All/Unselect All buttons */}
                    <div style={style.permissionsHeader}>
                        <label style={style.label}>
                            Permissions
                        </label>
                        <div style={style.permissionsActions}>
                            <span style={{fontSize: '0.875rem', color: '#6b7280', marginRight: '0.5rem', whiteSpace: 'nowrap'}}>
                                {selectedPermissions.length} / {allPermissions.length} selected
                            </span>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                disabled={allPermissionsSelected}
                                style={{
                                    ...style.actionButton,
                                    ...(allPermissionsSelected ? style.disabled : {}),
                                }}
                                onMouseEnter={e => !allPermissionsSelected && (e.currentTarget.style.backgroundColor = style.actionButtonHover.backgroundColor)}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = style.actionButton.backgroundColor)}
                            >
                                Select All
                            </button>
                            <button
                                type="button"
                                onClick={handleUnselectAll}
                                disabled={selectedPermissions.length === 0}
                                style={{
                                    ...style.actionButton,
                                    ...(selectedPermissions.length === 0 ? style.disabled : {}),
                                }}
                                onMouseEnter={e => selectedPermissions.length > 0 && (e.currentTarget.style.backgroundColor = style.actionButtonHover.backgroundColor)}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = style.actionButton.backgroundColor)}
                            >
                                Unselect All
                            </button>
                        </div>
                    </div>

                    {/* Permissions Grid Container */}
                    <div style={style.permissionsGrid}>
                        {currentPermissions.map((perm) => {
                            const isChecked = selectedPermissions.includes(perm.id);
                            return (
                                <label
                                    key={perm.id}
                                    style={{
                                        ...style.permissionLabel,
                                        ...(isChecked ? style.permissionLabelSelected : {}),
                                    }}
                                    onMouseEnter={e => !isChecked && (e.currentTarget.style.borderColor = '#93c5fd')}
                                    onMouseLeave={e => !isChecked && (e.currentTarget.style.borderColor = 'transparent')}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleCheckboxChange(perm.id)}
                                        style={style.checkbox}
                                    />
                                    <span style={{
                                        ...style.permissionText,
                                        ...(isChecked ? style.permissionTextSelected : {})
                                    }}>
                                        {perm.name}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={style.paginationContainer}>
                            <button
                                type="button"
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                style={{
                                    ...style.paginationChevron,
                                    ...(currentPage === 1 ? style.disabled : {})
                                }}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {getPageNumbers().map((page, idx) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${idx}`} style={{padding: '0.5rem', color: '#9ca3af'}}>
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        style={{
                                            ...style.paginationButton,
                                            ...(currentPage === page ? style.paginationButtonActive : {})
                                        }}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}

                            <button
                                type="button"
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                style={{
                                    ...style.paginationChevron,
                                    ...(currentPage === totalPages ? style.disabled : {})
                                }}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit Button and Success Message */}
                <div style={style.actionGroup}>
                    <button
                        type="submit"
                        disabled={saving || !name.trim() || selectedPermissions.length === 0}
                        style={{
                            ...style.submitButton,
                            ...(saving || !name.trim() || selectedPermissions.length === 0 ? style.submitButtonDisabled : {})
                        }}
                    >
                        {saving ? 'Creating Role...' : 'Create Role'}
                    </button>

                    {success && (
                        <div style={style.successMessage}>
                            <svg style={{width: '1.25rem', height: '1.25rem', fill: 'currentColor'}} viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Role created successfully</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateRole;