// import React, { useState, useEffect } from 'react';
// import { fetchDataCenters } from '../../api/settings/dataCenterApi';
// import { fetchDashboardTabs, createTabMapping, fetchExistingMappings } from '../../api/dashboardTabApi';

// const DashboardMapping = () => {
//   const [dataCenters, setDataCenters] = useState([]);
//   const [tabs, setTabs] = useState([]);
//   const [selectedDataCenter, setSelectedDataCenter] = useState('');
//   const [selectedTabs, setSelectedTabs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [existingMappings, setExistingMappings] = useState([]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const dcResponse = await fetchDataCenters();
//         setDataCenters(dcResponse);
        
//         const tabsResponse = await fetchDashboardTabs();
//         setTabs(tabsResponse);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadData();
//   }, []);

//   useEffect(() => {
//     const loadExistingMappings = async () => {
//       if (selectedDataCenter) {
//         try {
//           setLoading(true);
//           const mappings = await fetchExistingMappings(selectedDataCenter);
//           setExistingMappings(mappings);
//           setSelectedTabs(mappings.map(mapping => mapping.tab_id));
//         } catch (error) {
//           console.error('Error loading existing mappings:', error);
//           setExistingMappings([]);
//           setSelectedTabs([]);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
    
//     loadExistingMappings();
//   }, [selectedDataCenter]);

//   const handleDataCenterChange = (e) => {
//     setSelectedDataCenter(e.target.value);
//   };

//   const handleTabChange = (tabId) => {
//     setSelectedTabs(prev => 
//       prev.includes(tabId) 
//         ? prev.filter(id => id !== tabId) 
//         : [...prev, tabId]
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await createTabMapping({
//         data_center_id: selectedDataCenter,
//         tab_ids: selectedTabs
//       });
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//       const updatedMappings = await fetchExistingMappings(selectedDataCenter);
//       setExistingMappings(updatedMappings);
//     } catch (error) {
//       console.error('Error creating mapping:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Data Center Tab Mapping</h1>
      
//       <form onSubmit={handleSubmit} className="max-w-md">
//         <div className="mb-4">
//           <label htmlFor="dataCenter" className="block mb-2 font-medium">
//             Select Data Center:
//           </label>
//           <select
//             id="dataCenter"
//             value={selectedDataCenter}
//             onChange={handleDataCenterChange}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="">-- Select Data Center --</option>
//             {dataCenters.map(dc => (
//               <option key={dc.id} value={dc.id}>
//                 {dc.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedDataCenter && (
//   <>
//     <div className="mb-4">
//       <label className="block mb-2 font-medium">
//         Select Dashboard Tabs:
//       </label>
//       <div className="flex flex-wrap gap-2">
//         {tabs.map(tab => (
//           <div key={tab.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
//             <input
//               type="checkbox"
//               id={`tab-${tab.id}`}
//               checked={selectedTabs.includes(tab.id)}
//               onChange={() => handleTabChange(tab.id)}
//               className="h-4 w-4"
//             />
//             <label htmlFor={`tab-${tab.id}`} className="text-sm">
//               {tab.name}
//             </label>
//           </div>
//         ))}
//       </div>
//     </div>

//     {existingMappings.length > 0 && (
//       <div className="mb-4 p-4 bg-gray-50 rounded">
//         <h3 className="font-medium mb-2">Existing Mappings:</h3>
//         <div className="flex flex-wrap gap-2">
//           {existingMappings.map(mapping => (
//             <span 
//               key={mapping.id}
//               className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm"
//             >
//               {mapping.tab ? mapping.tab.name : `Tab ID: ${mapping.tab_id}`}
//             </span>
//           ))}
//         </div>
//       </div>
//     )}
//   </>
// )}

//         <button
//           type="submit"
//           disabled={loading || !selectedDataCenter || selectedTabs.length === 0}
//           className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//         >
//           {loading ? 'Saving...' : 'Save Mapping'}
//         </button>

//         {success && (
//           <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
//             Mapping created successfully!
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default DashboardMapping;
import React, { useState, useEffect } from 'react';
import { fetchDataCenters } from '../../api/settings/dataCenterApi';
import { fetchDashboardTabs, createTabMapping, fetchExistingMappings } from '../../api/dashboardTabApi';

// =========================================================
// === UPDATED STYLE SYSTEM: FULL-WIDTH, NON-CARD LAYOUT ===
// =========================================================

const styles = {
  // Layout
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '3rem 4rem', // Generous side padding for full width feel
    boxSizing: 'border-box',
  },
  contentWrapper: {
    width: '100%',
    // Removed maxWidth to enable true full-width spanning
  },
  headerSection: {
    marginBottom: '2rem',
    textAlign: 'left',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb', // Simple separator line
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '0.25rem',
    letterSpacing: '-0.02em',
  },
  description: {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },

  // Card is REMOVED. Form content sits directly on page background.
  formContentArea: {
    // This style replaces formCard and provides internal spacing
    padding: '0', 
    transition: 'none',
  },

  // Form groups
  formGroup: {
    marginBottom: '2rem',
    // Individual form groups will sit in a white box for contrast
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '0.75rem',
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    backgroundColor: '#fff',
    color: '#111827',
    fontSize: '0.95rem',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  selectFocus: {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59,130,246,0.3)',
  },

  // Tab Grid (Integrated into the form group styling)
  tabGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', // Wider min column width
    gap: '0.75rem', // Tighter spacing
    marginTop: '1rem', // Added margin for visual separation from the label
  },
  tabLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.6rem 0.9rem', // Refined padding
    borderRadius: '0.375rem', // Less rounded
    border: '1px solid #e5e7eb',
    backgroundColor: '#fdfdfe', // Off-white for unselected
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    boxShadow: '0 1px 1px rgba(0,0,0,0.02)',
  },
  tabLabelHover: {
    borderColor: '#93c5fd',
    backgroundColor: '#f9fafb',
  },
  tabLabelChecked: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  checkbox: {
    width: '1rem',
    height: '1rem',
    borderRadius: '0.125rem', // Square checkbox
    border: '1px solid #9ca3af',
    accentColor: '#10b981',
  },
  tabText: {
    marginLeft: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#374151',
  },

  // Mapping Section
  mappingSection: {
    borderTop: '1px solid #e5e7eb',
    marginTop: '2rem',
    paddingTop: '1.5rem',
  },
  mappingHeader: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '0.75rem',
  },
  mappingTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    fontSize: '0.8rem',
    fontWeight: 500,
    borderRadius: '9999px',
    padding: '0.3rem 0.6rem', // Tighter padding for tags
  },

  // Footer
  actionBar: {
    marginTop: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
  },
  buttonPrimaryHover: {
    backgroundColor: '#1d4ed8',
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
    color: '#6b7280',
    cursor: 'not-allowed',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '0.5rem',
    color: '#065f46',
    fontWeight: 500,
    fontSize: '0.9rem',
  },
  successIcon: {
    width: '1.25rem',
    height: '1.25rem',
  },
};

// =========================================================
// === REACT COMPONENT (MODIFIED STRUCTURE) ===
// =========================================================

const DashboardMapping = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [selectedDataCenter, setSelectedDataCenter] = useState('');
  const [selectedTabs, setSelectedTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingMappings, setExistingMappings] = useState([]);

  // --- Data & Mapping Logic (Unchanged) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dcResponse = await fetchDataCenters();
        setDataCenters(dcResponse);
        const tabsResponse = await fetchDashboardTabs();
        setTabs(tabsResponse);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadExistingMappings = async () => {
      if (selectedDataCenter) {
        try {
          setLoading(true);
          const mappings = await fetchExistingMappings(selectedDataCenter);
          setExistingMappings(mappings);
          // Only automatically select tabs if it's the *initial* load for this DC
          // Otherwise, user choices are respected
          if (mappings.length > 0) {
              setSelectedTabs(mappings.map((m) => m.tab_id));
          } else {
              setSelectedTabs([]); // Ensure tabs are cleared if no existing mappings are found
          }
        } catch (error) {
          console.error('Error loading existing mappings:', error);
          setExistingMappings([]);
          setSelectedTabs([]);
        } finally {
          setLoading(false);
        }
      } else {
        setExistingMappings([]);
        setSelectedTabs([]);
      }
    };
    loadExistingMappings();
  }, [selectedDataCenter]);

  const handleTabChange = (tabId) => {
    setSelectedTabs((prev) =>
      prev.includes(tabId)
        ? prev.filter((id) => id !== tabId)
        : [...prev, tabId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDataCenter || selectedTabs.length === 0) return;

    try {
      setLoading(true);
      await createTabMapping({
        data_center_id: selectedDataCenter,
        tab_ids: selectedTabs,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      const updatedMappings = await fetchExistingMappings(selectedDataCenter);
      setExistingMappings(updatedMappings);
      // Re-select based on the fresh data after saving
      setSelectedTabs(updatedMappings.map((m) => m.tab_id)); 
    } catch (error) {
      console.error('Error creating mapping:', error);
    } finally {
      setLoading(false);
    }
  };
  // -----------------------------------------------------------

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        
        {/* Header Section (Unboxed) */}
        <header style={styles.headerSection}>
          <h1 style={styles.heading}>Data Center Tab Mapping</h1>
          <p style={styles.description}>
            Configure which dashboard tabs are visible for each data center.
          </p>
        </header>

        <form onSubmit={handleSubmit} style={styles.formContentArea}>
          
          {/* 1. Data Center Selection (Boxed for input grouping) */}
          <div style={styles.formGroup}>
            <label htmlFor="dataCenter" style={styles.label}>
              Select Data Center
            </label>
            <select
              id="dataCenter"
              value={selectedDataCenter}
              onChange={(e) => setSelectedDataCenter(e.target.value)}
              style={styles.select}
              onFocus={(e) => e.currentTarget.style.boxShadow = styles.selectFocus.boxShadow}
              onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              required
            >
              <option value="">Choose a data center...</option>
              {dataCenters.map((dc) => (
                <option key={dc.id} value={dc.id}>
                  {dc.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Tabs Selection & Mappings */}
          {selectedDataCenter && (
            // A separate container for the tabs/mappings section
            <div style={styles.formGroup}>
                <label style={styles.label}>Dashboard Tabs</label>
                
                {/* Tab Grid */}
                <div style={styles.tabGrid}>
                  {tabs.map((tab) => {
                    const isChecked = selectedTabs.includes(tab.id);
                    return (
                      <label
                        key={tab.id}
                        style={{
                          ...styles.tabLabel,
                          ...(isChecked
                            ? styles.tabLabelChecked
                            : styles.tabLabel), // Use tabLabel base for unselected state
                        }}
                        onMouseEnter={(e) => !isChecked && (e.currentTarget.style.borderColor = styles.tabLabelHover.borderColor)}
                        onMouseLeave={(e) => !isChecked && (e.currentTarget.style.borderColor = styles.tabLabel.border.split(' ')[2])}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTabChange(tab.id)}
                          style={styles.checkbox}
                        />
                        <span style={styles.tabText}>{tab.name}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Existing mappings */}
                {existingMappings.length > 0 && (
                  <div style={styles.mappingSection}>
                    <h3 style={styles.mappingHeader}>Current Mapped Tabs</h3>
                    <div style={styles.mappingTags}>
                      {existingMappings.map((mapping) => (
                        <span key={mapping.id} style={styles.tag}>
                          {tabs.find(t => t.id === mapping.tab_id)?.name || `Tab ID: ${mapping.tab_id}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Footer actions */}
          <div style={styles.actionBar}>
            <button
              type="submit"
              disabled={
                loading || !selectedDataCenter || selectedTabs.length === 0
              }
              style={{
                ...styles.button,
                ...(loading || !selectedDataCenter || selectedTabs.length === 0
                  ? styles.buttonDisabled
                  : styles.buttonPrimary),
              }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor)}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = styles.buttonPrimary.backgroundColor)}
            >
              {loading ? 'Saving...' : 'Save Mapping'}
            </button>

            {success && (
              <div style={styles.successMessage}>
                <svg
                  style={styles.successIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Mapping saved successfully!
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardMapping;