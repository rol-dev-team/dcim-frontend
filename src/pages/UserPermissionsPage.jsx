// import React, { useEffect, useState } from "react";
// import { getUserPermissions } from "../api/userApi";

// const UserPermissionsPage = () => {
//   const [allPermissions, setAllPermissions] = useState([]);
//   const [currentPermissions, setCurrentPermissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [permissionsPerPage] = useState(20);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         setLoading(true);
//         const data = await getUserPermissions();
//         const fetchedPermissions = Array.isArray(data.permissions) ? data.permissions : [];

//         setAllPermissions(fetchedPermissions);
//         setTotalPages(Math.ceil(fetchedPermissions.length / permissionsPerPage));
//         setCurrentPermissions(fetchedPermissions.slice(0, permissionsPerPage));
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch permissions.");
//         setAllPermissions([]);
//         setCurrentPermissions([]);
//         setTotalPages(1);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPermissions();
//   }, []);

//   useEffect(() => {
//     const indexOfLast = currentPage * permissionsPerPage;
//     const indexOfFirst = indexOfLast - permissionsPerPage;
//     setCurrentPermissions(allPermissions.slice(indexOfFirst, indexOfLast));
//   }, [currentPage, allPermissions, permissionsPerPage]);

//   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="container mx-auto mt-10 px-4">
//       <h2 className="text-2xl font-bold mb-6 text-center">User Permissions</h2>

//       {loading ? (
//         <p className="text-center">Loading permissions...</p>
//       ) : error ? (
//         <p className="text-red-600 text-center">{error}</p>
//       ) : (
//         <>
//           <div className="overflow-x-auto rounded shadow">
//             <table className="w-full border border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2 text-center w-16">#</th>
//                   <th className="border border-gray-300 px-4 py-2 text-left">Permission</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentPermissions.length > 0 ? (
//                   currentPermissions.map((perm, index) => (
//                     <tr key={(currentPage - 1) * permissionsPerPage + index}>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                         {(currentPage - 1) * permissionsPerPage + index + 1}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">{perm}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="2"
//                       className="border border-gray-300 px-4 py-3 text-center text-gray-500"
//                     >
//                       No permissions found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//          {totalPages > 1 && (
//   <nav className="mt-4">
//     <ul className="pagination justify-content-center">
//       {[...Array(totalPages)].map((_, i) => (
//         <li
//           key={i}
//           className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
//         >
//           <button
//             className="page-link"
//             onClick={() => handlePageChange(i + 1)}
//           >
//             {i + 1}
//           </button>
//         </li>
//       ))}
//     </ul>
//   </nav>
// )}

//         </>
//       )}
//     </div>
//   );
// };

// export default UserPermissionsPage;
import React, { useEffect, useState } from "react";
import { getUserPermissions } from "../api/userApi";

// ================================================
// SHARED DESIGN SYSTEM (Table/List-specific styles)
// ================================================
const styles = {
  // Layout
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "3rem 4rem", // Full-width padding
    boxSizing: 'border-box',
    width: '100%',
  },
  contentWrapper: {
    width: "100%",
    // No maxWidth for full-width layout
  },
  headerSection: {
    marginBottom: "2rem",
    textAlign: 'left',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
  },
  heading: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem",
    letterSpacing: '-0.02em',
  },

  // Loading/Error States
  messageText: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#4b5563',
    padding: '2rem 0',
  },
  errorText: {
    color: "#dc2626",
    fontSize: '1rem',
    textAlign: 'center',
    padding: '2rem 0',
  },

  // Table Container
  tableWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  // Table Head
  tableHead: {
    backgroundColor: '#f9fafb',
  },
  tableHeaderCell: {
    borderBottom: '1px solid #e5e7eb',
    padding: '0.75rem 1.5rem',
    textAlign: 'left',
    color: '#374151',
    fontWeight: 600,
    fontSize: '0.9rem',
  },

  // Table Body
  tableRow: {
    transition: 'background-color 0.15s ease',
  },
  tableRowHover: {
    backgroundColor: '#f3f4f6',
  },
  tableDataCell: {
    borderBottom: '1px solid #f3f4f6', // Lighter internal border
    padding: '0.75rem 1.5rem',
    color: '#374151',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
  indexCell: {
    width: '1%', // Ensure index column is narrow
    textAlign: 'center',
    color: '#6b7280',
    fontWeight: 500,
  },
  emptyCell: {
    textAlign: 'center',
    padding: '2rem',
    color: '#9ca3af',
  },

  // Pagination
  paginationNav: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  paginationList: {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    gap: '0.25rem',
  },
  pageButton: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.15s ease',
  },
  pageButtonHover: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  pageButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: '#ffffff',
    fontWeight: 600,
  },
};

const UserPermissionsPage = () => {
  const [allPermissions, setAllPermissions] = useState([]);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [permissionsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // --- Data Fetching Logic (Unchanged) ---
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const data = await getUserPermissions();
        const fetchedPermissions = Array.isArray(data.permissions) ? data.permissions : [];

        setAllPermissions(fetchedPermissions);
        setTotalPages(Math.ceil(fetchedPermissions.length / permissionsPerPage));
        setCurrentPermissions(fetchedPermissions.slice(0, permissionsPerPage));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch permissions.");
        setAllPermissions([]);
        setCurrentPermissions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [permissionsPerPage]);

  // --- Pagination Slice Logic (Unchanged) ---
  useEffect(() => {
    const indexOfLast = currentPage * permissionsPerPage;
    const indexOfFirst = indexOfLast - permissionsPerPage;
    setCurrentPermissions(allPermissions.slice(indexOfFirst, indexOfLast));
  }, [currentPage, allPermissions, permissionsPerPage]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  // ------------------------------------------

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        
        {/* Header Section */}
        <header style={styles.headerSection}>
          <h1 style={styles.heading}>User Permissions List</h1>
        </header>

        {loading ? (
          <p style={styles.messageText}>Loading permissions...</p>
        ) : error ? (
          <p style={styles.errorText}>{error}</p>
        ) : (
          <>
            {/* Permissions Table */}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.tableHead}>
                  <tr>
                    <th style={{ ...styles.tableHeaderCell, ...styles.indexCell }}>#</th>
                    <th style={styles.tableHeaderCell}>Permission Identifier</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPermissions.length > 0 ? (
                    currentPermissions.map((perm, index) => {
                      const absoluteIndex = (currentPage - 1) * permissionsPerPage + index;
                      return (
                        <tr
                          key={absoluteIndex}
                          style={styles.tableRow}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ ...styles.tableDataCell, ...styles.indexCell }}>
                            {absoluteIndex + 1}
                          </td>
                          <td style={styles.tableDataCell}>{perm}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        style={{ ...styles.tableDataCell, ...styles.emptyCell }}
                      >
                        No permissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav style={styles.paginationNav}>
                <ul style={styles.paginationList}>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    const isActive = currentPage === pageNumber;
                    
                    return (
                      <li key={i}>
                        <button
                          style={{
                            ...styles.pageButton,
                            ...(isActive ? styles.pageButtonActive : {}),
                          }}
                          onClick={() => handlePageChange(pageNumber)}
                          disabled={isActive}
                          onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = styles.pageButtonHover.backgroundColor)}
                          onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = styles.pageButton.backgroundColor)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserPermissionsPage;