// import React, { useEffect, useState } from "react";
// import moment from "moment";

// import { TableComponent } from "../../components/TableComponent";
// import { fetchOperationMode } from "../../api/modeOperation";
// import { AddButtonComponent } from "../../components/AddButtonComponent";
// import { errorMessage } from "../../api/api-config/apiResponseMessage";

// export const DOControlPage = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const divisionColumns = [
//     {
//       name: "Data Center",
//       selector: (row) => row.name,
//       wrap: true,
//     },
//     {
//       name: "Device",
//       selector: (row) => row.name,
//       wrap: true,
//     },
//     {
//       name: "Operation Mode",
//       selector: (row) => row.name,
//       wrap: true,
//     },
//     {
//       name: "Time",
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

//   return (
//     <section>
//       <div className="container-fluid">
//         <AddButtonComponent
//           text="Configure"
//           to="/admin/settings/do-control-form"
//         />
//         <div className="row">
//           <div className="col-12">
//             <TableComponent
//               data={""}
//               columns={divisionColumns}
//               isLoading={isLoading}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { Settings, PlusCircle, AlertTriangle } from 'lucide-react'; 
import { useNavigate } from "react-router-dom"; // Assuming navigation is handled via react-router-dom

// REQUIRED IMPORTS (These must exist in your project structure)
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/DataTable";
import { fetchOperationMode } from "../../api/modeOperation"; 
import { errorMessage } from "../../api/api-config/apiResponseMessage"; 

// Reusable Styles (for presentation)
const styles = {
    pageContainer: { minHeight: "100vh", backgroundColor: "#f8fafc", padding: "3rem 4rem", boxSizing: 'border-box' },
    headerSection: { marginBottom: "2rem", paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headingGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
    heading: { fontSize: "2rem", fontWeight: 600, color: "#111827", margin: 0, letterSpacing: '-0.02em' },
    description: { fontSize: "1rem", color: "#6b7280", margin: 0, lineHeight: 1.5 },
    alert: { padding: "0.75rem 1rem", borderRadius: "0.5rem", fontSize: "0.9rem", marginBottom: "1.5rem", display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500, backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" },
};
const customStyles = `
    .data-table-btn-icon { background: transparent; border: none; padding: 0.25rem; cursor: pointer; transition: background-color 0.15s ease-in-out; outline: none; box-shadow: none; display: inline-flex; align-items: center; justify-content: center; }
    .data-table-btn-icon:hover { background-color: #e5e7eb; border-radius: 0.25rem; }
    .data-table-btn-icon:focus { outline: 2px solid #6366f1; outline-offset: 2px; box-shadow: none; }
`;


export const DOControlPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

  // --- Data Fetching Logic (Fixed and Added) ---
  const fetchData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await fetchOperationMode(); 
      setData(result);
    } catch (err) {
      // Assuming errorMessage is a utility function to format errors
      setFetchError(errorMessage(err));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // ---------------------------------------------

  // --- DATATABLE COLUMN CONFIGURATION (FIXED & CONVERTED) ---
  const columns = useMemo(() => [
    { 
      key: "data_center", 
      header: "Data Center",
      // Corrected selector logic: Accessing nested name property
      render: (v, row) => row.data_center?.name || 'N/A',
    },
    { 
      key: "device", 
      header: "Device",
      // Corrected selector logic: Accessing nested name property
      render: (v, row) => row.device?.name || 'N/A',
    },
    { 
      key: "operation_mode", 
      header: "Operation Mode",
      // Corrected selector logic: Accessing nested name property
      render: (v, row) => row.operation_mode?.name || 'N/A',
    },
    { 
      key: "time", 
      header: "Time",
      // Corrected selector logic: Accessing the time property
      render: (v, row) => row.time || 'N/A',
    },
    {
      key: "created_at",
      header: "Created Date",
      isSortable: true,
      render: (created_at) => (
        <div style={{ whiteSpace: "wrap", textAlign: 'right' }}>
          {created_at ? moment(created_at).format("lll") : 'N/A'}
        </div>
      ),
    },
    {
      key: "updated_at",
      header: "Last Updated",
      isSortable: true,
      render: (updated_at) => (
        <div style={{ whiteSpace: "wrap", textAlign: 'right' }}>
          {updated_at ? moment(updated_at).format("lll") : 'N/A'}
        </div>
      ),
    },
    {
        key: "actions",
        header: "Actions",
        isSortable: false,
        render: (v, row) => (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                    className="data-table-btn-icon text-indigo-500 hover:text-indigo-700"
                    // Placeholder for edit/action handler
                    onClick={() => console.log('Edit DO Control ID:', row.id)}
                    title="Edit Configuration"
                >
                    <Settings size={16} />
                </button>
            </div>
        ),
    },
  ], []);
  // ------------------------------------------------------------------------------------------

  // --- JSX Rendering ---
  return (
    <>
      <style>{customStyles}</style>
      <div style={styles.pageContainer}>
        <div style={{ width: '100%' }}>
          
          <header style={styles.headerSection}>
            <div style={styles.headingGroup}>
              {/* <Settings style={{ width: '30px', height: '30px', color: '#3b82f6' }} /> */}
              <div>
                <h1 style={styles.heading}>DO Control Page</h1>
                <p style={styles.description}>
                  View and configure automatic and scheduled operation modes for devices.
                </p>
              </div>
            </div>
            
            <Button 
                intent="primary"
                leftIcon={PlusCircle}
                // Use the useNavigate hook for navigation
                onClick={() => navigate("/admin/settings/do-control-form")} 
            >
              Configure Mode
            </Button>
          </header>

          {fetchError && (
            <div style={styles.alert}>
              <AlertTriangle style={{ width: '20px', height: '20px' }} />
              <span>**Error:** Failed to load data. {fetchError}</span>
            </div>
          )}

          {/* DataTable Section */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <DataTable
              title="Device Operation Modes"
              data={data}
              columns={columns} 
              showId={true}
              initialPageSize={8}
              searchable={true}
              selection={false}
              isBackendPagination={false}
              emptyStateMessage="No DO Control configurations found."
              isLoading={isLoading} 
            />
          </div>

        </div>
      </div>
    </>
  );
};