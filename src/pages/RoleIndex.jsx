// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import { usePermissions } from "../context/PermissionContext";
// // import { usePermissions } from '../PermissionContext';
// import { apiClient } from "../api/api-config/config";
// // axios.defaults.baseURL = 'http://182.48.80.49:8080';
// import CommonButton from "../components/CommonButton"; // import at the top of your file

// const RoleList = () => {
//     const [roles, setRoles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [pagination, setPagination] = useState({
//         current_page: 1,
//         last_page: 1,
//     });

//     const permissions = usePermissions(); // 👈 Access permission context
//     const canDeleteRole = permissions.includes("role-delete");
//     const canCreateRole = permissions.includes("role-create");
//     const canShowRole = permissions.includes("role-list");
//     const canEditRole = permissions.includes("role-edit");

//     useEffect(() => {
//         fetchRoles(pagination.current_page);
//     }, []);

//     const fetchRoles = async (page = 1) => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("access_token");

//             const response = await apiClient.get(`/roles?page=${page}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     Accept: "application/json",
//                 },
//             });

//             setRoles(response.data.data);
//             setPagination({
//                 current_page: response.data.current_page,
//                 last_page: response.data.last_page,
//             });
//         } catch (error) {
//             console.error("Error fetching roles:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = (id) => {
//         confirmAlert({
//             title: "Confirm to delete",
//             message: "Are you sure you want to delete this role?",
//             buttons: [
//                 {
//                     label: "Yes",
//                     onClick: async () => {
//                         try {
//                             const token = localStorage.getItem("access_token");
//                             await apiClient.delete(`/roles/${id}`, {
//                                 headers: {
//                                     Authorization: `Bearer ${token}`,
//                                     Accept: "application/json",
//                                 },
//                             });
//                             fetchRoles(pagination.current_page);
//                         } catch (error) {
//                             console.error("Error deleting role:", error);
//                         }
//                     },
//                 },
//                 { label: "No" },
//             ],
//         });
//     };

//     const handlePageChange = (newPage) => {
//         fetchRoles(newPage);
//     };

//     if (loading) {
//         return <div className="text-center mt-4">Loading...</div>;
//     }
//     console.log(canDeleteRole);
//     console.log(permissions);
//     return (
//         <div className="container mt-4">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h2>Role Management</h2>
//                 {canCreateRole && (
//                     <Link to="/admin/roles/create" className="btn btn-success text-white">
//                         + Create New Role
//                     </Link>
//                 )}
//             </div>

//             <div className="card">
//                 <div className="card-body">
//                     <div className="table-responsive">
//                         <table className="table table-striped">
//                             <thead>
//                                 <tr>
//                                     <th>No</th>
//                                     <th>Name</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             {/* <tbody>
//                                 {roles.length > 0 ? (
//                                     roles.map((role, index) => (
//                                         <tr key={role.id}>
//                                             <td>
//                                                 {(pagination.current_page - 1) *
//                                                     5 +
//                                                     index +
//                                                     1}
//                                             </td>
//                                             <td>{role.name}</td>
//                                             <td>
//                                                 {canShowRole && (
//                                                     <Link
//                                                         to={`/admin/roles/${role.id}`}
//                                                         className="btn btn-info btn-sm me-2"
//                                                     >
//                                                         Show
//                                                     </Link>
//                                                 )}

//                                                 {canEditRole && (
//                                                     <Link
//                                                         to={`/admin/roles/${role.id}/edit`}
//                                                         className="btn btn-primary btn-sm me-2"
//                                                     >
//                                                         Edit
//                                                     </Link>
//                                                 )}

//                                                 {canDeleteRole && (
//                                                     <button
//                                                         onClick={() =>
//                                                             handleDelete(
//                                                                 role.id
//                                                             )
//                                                         }
//                                                         className="btn btn-danger btn-sm"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="3" className="text-center">
//                                             No roles found.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody> */}
//                         <tbody>
//   {roles.length > 0 ? (
//     roles.map((role, index) => (
//       <tr key={role.id}>
//         <td>
//           {(pagination.current_page - 1) * 5 + index + 1}
//         </td>
//         <td>{role.name}</td>
//         <td>
//           {/* Show Button */}
//           {canShowRole && (
//   <Link to={`/admin/roles/${role.id}`} className="me-2">
//     <CommonButton name="show" />
//   </Link>
// )}


//           {/* Edit Button using CommonButton */}
//           {canEditRole && (
//             <Link
//               to={`/admin/roles/${role.id}/edit`}
//               className="me-2"
//             >
//               <CommonButton name="edit" />
//             </Link>
//           )}

//           {/* Delete Button using CommonButton */}
//           {canDeleteRole && (
//             <CommonButton
//               name="delete"
//               onClick={() => handleDelete(role.id)}
//             />
//           )}
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="3" className="text-center">
//         No roles found.
//       </td>
//     </tr>
//   )}
// </tbody>

                        
                        
                        
//                         </table>
//                     </div>

//                     {/* Pagination Controls */}
//                     <nav className="mt-3">
//                         <ul className="pagination justify-content-center">
//                             {[...Array(pagination.last_page)].map((_, i) => (
//                                 <li
//                                     key={i}
//                                     className={`page-item ${
//                                         pagination.current_page === i + 1
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
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RoleList;
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { usePermissions } from "../context/PermissionContext";
import { apiClient } from "../api/api-config/config";
import DataTable from "../components/table/DataTable"; 
import Button from "../components/ui/Button"; // Use the standard Button component
import { Plus, Pencil, Trash2, Eye, Edit } from "lucide-react";
import ExportButton from "../components/ui/ExportButton"; 
import { FaFileExcel } from 'react-icons/fa'; 

// 🔑 NEW: A consolidated style block to match the modern KAM dashboard aesthetic 
// and fix the button outline issue.
const styles = {
    // Mimics p-4 lg:p-6
    container: {
        padding: '1.5rem', 
        backgroundColor: 'white',
    },
    // Header section styling
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
    },
    title: {
        fontSize: '1.875rem', 
        fontWeight: '800', 
        color: '#111827', 
        lineHeight: '2.25rem',
    },
    subtitle: {
        fontSize: '0.875rem', 
        color: '#6b7280', 
    },
    actions: {
        display: 'flex',
        gap: '0.5rem',
        paddingRight: '1.5rem',
    }
};

// 🔑 NEW: CSS for the Icon Buttons to fix the border/outline issue
const iconButtonStyles = `
    .data-table-btn-icon {
        background: transparent;
        border: none;
        padding: 0.25rem; /* Small padding around the icon */
        cursor: pointer;
        transition: background-color 0.15s ease-in-out;
        /* --- FIXES THE CARTOONISH BORDER --- */
        outline: none; 
        box-shadow: none;
        /* ----------------------------------- */
    }
    .data-table-btn-icon:hover {
        background-color: #f3f4f6; /* Light gray background on hover */
        border-radius: 0.25rem;
    }
    .data-table-btn-icon:focus {
        outline: 2px solid #6366f1; /* Custom focus ring for accessibility */
        outline-offset: 2px;
        box-shadow: none;
    }
`;

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);

    const [tableParams, setTableParams] = useState({
        page: 1,
        pageSize: 10,
        search: "",
        sort: "id",
        sort_dir: "asc",
    });

    const permissions = usePermissions();
    const canDeleteRole = permissions.includes("role-delete");
    const canCreateRole = permissions.includes("role-create");
    const canShowRole = permissions.includes("role-show"); 
    const canEditRole = permissions.includes("role-edit");

    // --- Data Fetching Logic (Server-Side Pagination) ---
    const fetchRoles = useCallback(async (params) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            
            const queryParams = new URLSearchParams({
                page: params.page,
                per_page: params.pageSize,
                search: params.search,
                sort: params.sort,
                sort_dir: params.sort_dir,
            }).toString();

            const response = await apiClient.get(`/roles?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });

            setRoles(response.data.data);
            setTotalRows(response.data.total || 0); 

        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles(tableParams);
    }, [fetchRoles, tableParams]); 

    // --- Action Handlers ---
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
                                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                            });
                            fetchRoles(tableParams); 
                        } catch (error) {
                            console.error("Error deleting role:", error);
                        }
                    },
                },
                { label: "No" },
            ],
        });
    };

    const handleFilterChange = (newParams) => {
        setTableParams(prev => ({ 
            ...prev, 
            ...newParams, 
            page: 1, 
        }));
    };
    
    const handlePageSizeChange = (newSize) => {
        setTableParams(prev => ({
            ...prev,
            pageSize: newSize,
            page: 1,
        }));
    };

    const handlePageChange = (newPage) => {
        setTableParams(prev => ({
            ...prev,
            page: newPage
        }));
    };
    
    // --- DATATABLE COLUMN CONFIGURATION ---
    const columns = useMemo(() => [
        { key: "id", header: "ID", isSortable: true },
        { key: "name", header: "Role Name", isSortable: true },
        {
            key: "actions",
            header: "Actions",
            isSortable: false,
            render: (v, role) => (
                <div className="flex justify-start gap-2">
                    {canShowRole && (
                        <Link to={`/admin/roles/${role.id}`} title="Show Details">
                            <button className="data-table-btn-icon">
                                <Eye className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                            </button>
                        </Link>
                    )}
                    {canEditRole && (
                        <Link to={`/admin/roles/${role.id}/edit`} title="Edit Role">
                             <button className="data-table-btn-icon">
                                <Edit size={16} />
                            </button>
                        </Link>
                    )}
                    {canDeleteRole && (
                        <button 
                            className="data-table-btn-icon" 
                            onClick={() => handleDelete(role.id)}
                            title="Delete Role"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            ),
        },
    ], [canShowRole, canEditRole, canDeleteRole, handleDelete]);
    // --- END DATATABLE COLUMN CONFIGURATION ---

    if (loading && roles.length === 0) {
        return (
             <div style={styles.container} className="flex justify-center items-center py-20 text-gray-500">
                <p>Loading Role Management data...</p>
             </div>
        );
    }

    return (
        // 🔑 1. Apply the inline CSS styles for the icon buttons
        <>
            <style>{iconButtonStyles}</style>
            
            {/* 1. Page Container */}
            <div style={styles.container}> 
                {/* 2. Header Section */}
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            Role Management
                        </h1>
                        <p style={styles.subtitle}>
                            View and manage user roles and permissions.
                        </p>
                    </div>
                    
                    {/* 2. Right (Actions) */}
                    <div style={styles.actions}>
                        <ExportButton 
                            data={roles} 
                            columns={columns} 
                            fileName="roles_export" 
                            intent="primary" 
                            leftIcon={FaFileExcel} 
                            className="text-white bg-green-700 hover:bg-green-800 border-none"
                        >
                            Export
                        </ExportButton>
                        
                        {canCreateRole && (
                            <Link to="/admin/roles/create">
                                <Button intent="primary" leftIcon={Plus}>
                                    Add Role
                                </Button>
                            </Link>
                        )}
                    </div>
                </header>

                {/* 3. Data Presentation - DataTable */}
                <DataTable
                    title="Role List"
                    data={roles}
                    columns={columns}
                    isBackendPagination={true}
                    totalRows={totalRows}
                    page={tableParams.page}
                    pageSize={tableParams.pageSize}
                    setPage={handlePageChange} 
                    setPageSize={handlePageSizeChange} 
                    onFilterChange={handleFilterChange} 
                    initialSort={{ key: tableParams.sort, dir: tableParams.sort_dir }} 
                    searchable={true}
                    showId={true} 
                    selection={false}
                    pageSizeOptions={[5, 10, 25, 50]} 
                    initialPageSize={10}
                />
            </div>
        </>
    );
};

export default RoleList;