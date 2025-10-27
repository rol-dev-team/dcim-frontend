// import React, { useEffect, useState } from 'react';
// import moment from "moment";
// import { AddButtonComponent } from '../../components/AddButtonComponent';
// import { TableComponent } from '../../components/TableComponent';
// import { errorMessage } from '../../api/api-config/apiResponseMessage';
// import { fetchAllDivisions } from '../../api/settings/divisionApi';

// export const Divisions = () => {
//   const [data,setData]=useState([]);
//   const[isLoading,setIsLoading]=useState(false);
//   const divisionColumns = [
   
//     {
//       name: "Division Name",
//       selector: (row) => row.name,
//       wrap: true,
//     },

//     {
//       name: "Created Date",
//       selector: (row) => moment(row.created_at).format("lll"),
//       cell: (row) => (
//         <div style={{ whiteSpace: "wrap" }}>
//           {moment(row.created_at).format("lll")}
//         </div>
//       ),
//     },
//     {
//       name: "Last Updated",
//       selector: (row) => moment(row.updated_at).format("lll"),
//       cell: (row) => (
//         <div style={{ whiteSpace: "wrap" }}>
//           {moment(row.updated_at).format("lll")}
//         </div>
//       ),
//     },
   
//   ];
//   useEffect(() => {
//     setIsLoading(true);
//      fetchAllDivisions()
//        .then((response) => {
//         setData(response.data);
//         console.log(response);
//        })
//        .catch(errorMessage)
//        .finally(() => {
//          setIsLoading(false);
//        });
//    }, []);

//   return (
//     <div className='container-fluid'>
//       <AddButtonComponent to="/admin/settings/add-division"/>
//       <div className='row'>
//         <div className='col-12'>
//           <TableComponent data={data} columns={divisionColumns} isLoading={isLoading}/>
//         </div>
        
//       </div>
//     </div>
//   )
// }
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react'; // Icons for buttons
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// NEW COMPONENTS IMPORT
import Button from "../../components/ui/Button"; 
import DataTable from "../../components/table/DataTable";
// Assuming you need delete functionality from an API
// import { deleteDivision } from '../../api/settings/divisionApi'; 

import { errorMessage } from '../../api/api-config/apiResponseMessage';
import { fetchAllDivisions } from '../../api/settings/divisionApi';

// ================================================================
// 1. CSS for Icon Button and Layout Consistency (Consistent with previous files)
// ================================================================
const iconButtonStyles = `
    .data-table-btn-icon {
        background: transparent;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        transition: background-color 0.15s ease-in-out;
        outline: none;
        box-shadow: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .data-table-btn-icon:hover {
        background-color: #e5e7eb; /* Light gray background on hover */
        border-radius: 0.25rem;
    }
    .data-table-btn-icon:focus {
        outline: 2px solid #6366f1; /* Custom focus ring for accessibility */
        outline-offset: 2px;
        box-shadow: none;
    }
`;

// Helper styles for the non-card layout
const pageLayoutStyles = `
    .division-list-container {
        padding: 1.5rem; /* p-6 */
        background-color: #f9fafb; /* gray-50 equivalent for background */
    }

    /* REVISED: NO CARD STYLE FOR HEADER */
    .division-list-header {
        background-color: transparent; 
        padding: 0; 
        border-radius: 0; 
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb; 
        padding-bottom: 1rem;
    }
    
    .alert-danger {
        color: #842029;
        background-color: #f8d7da;
        border-color: #f5c2c7;
        padding: 1rem 1rem;
        margin-bottom: 1rem;
        border: 1px solid transparent;
        border-radius: 0.25rem;
    }
`;
// ================================================================


export const Divisions = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // Placeholder for permissions context (Assuming all actions are allowed for this example)
    const canEditDivision = true; 
    const canDeleteDivision = true; 
    const canCreateDivision = true;

    // --- Data Loading Logic ---
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetchAllDivisions()
            .then((response) => {
                // Ensure data is an array, assuming the actual data is in response.data
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    // Handle cases where API returns non-array structure
                    setData([]);
                    setError("Failed to load divisions: Unexpected data format.");
                }
                console.log(response);
            })
            .catch((err) => {
                console.error("Fetch divisions error:", err);
                setError(errorMessage(err)); // Use your custom error handler
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // --- Action Handlers (Edit/Delete) ---
    
    // Handler for navigation to edit screen
    const handleEdit = useCallback((id) => {
        navigate(`/admin/settings/edit-division/${id}`);
    }, [navigate]);

    // Handler for deletion
    const handleDelete = useCallback((id) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete Division ID: ${id}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            // await deleteDivision(id); // Use actual API call here
                            
                            // Mock deletion success:
                            console.log(`Mock Deleting Division ID: ${id}`);
                            setData(prevData => prevData.filter(item => item.id !== id));
                        } catch (err) {
                            console.error('Failed to delete division:', err);
                            setError("Failed to delete division.");
                        }
                    },
                },
                { label: 'No' },
            ],
        });
    }, []);

    // --- DATATABLE COLUMN CONFIGURATION ---
    const divisionColumns = useMemo(() => [
        { 
            key: "name", 
            header: "Division Name", 
            isSortable: true,
            // DataTable handles wrap: true by default for text
        },
        {
            key: "created_at",
            header: "Created Date",
            isSortable: true,
            render: (value) => (
                <div style={{ whiteSpace: "wrap" }}>
                    {moment(value).format("lll")}
                </div>
            ),
        },
        {
            key: "updated_at",
            header: "Last Updated",
            isSortable: true,
            render: (value) => (
                <div style={{ whiteSpace: "wrap" }}>
                    {moment(value).format("lll")}
                </div>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            isSortable: false,
            render: (v, row) => (
                <div className="d-flex gap-2 justify-content-center">
                    {canEditDivision && (
                        <button 
                            className="data-table-btn-icon text-indigo-500 hover:text-indigo-700" 
                            onClick={() => handleEdit(row.id)} 
                            title="Edit Division"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    {canDeleteDivision && (
                        <button 
                            className="data-table-btn-icon text-red-500 hover:text-red-700" 
                            onClick={() => handleDelete(row.id)} 
                            title="Delete Division"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            ),
        },
    ], [canEditDivision, canDeleteDivision, handleEdit, handleDelete]);
    // --- END DATATABLE COLUMN CONFIGURATION ---

    return (
        // Inject the necessary CSS
        <>
            <style>{iconButtonStyles}</style>
            <style>{pageLayoutStyles}</style>

            <div className="division-list-container">
                
                {/* Header Section (Non-card look) */}
                <header className="division-list-header">
                    <h2 className="text-xl font-bold">Division List</h2>
                    
                    {/* Replaced AddButtonComponent with styled Button */}
                    {canCreateDivision && (
                        <Button
                            intent="primary"
                            leftIcon={Plus}
                            onClick={() => navigate("/admin/settings/add-division")}
                        >
                            Add New Division
                        </Button>
                    )}
                </header>

                {error && <div className="alert-danger">{error}</div>}

                {/* Replaced TableComponent with DataTable (Wrapped in a light card for visual clarity) */}
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <DataTable
                        title="Division Records"
                        data={data}
                        columns={divisionColumns}
                        showId={true} 
                        initialPageSize={10} 
                        searchable={true} 
                        selection={false}
                        isBackendPagination={false}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </>
    );
}