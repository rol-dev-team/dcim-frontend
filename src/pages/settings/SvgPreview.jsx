// import React, { useEffect, useState } from 'react';
// import { fetchDataCenters, fetchSvgByDataCenter } from '../../api/settings/dataCenterApi';

// const SvgPreview = () => {
//   const [dataCenters, setDataCenters] = useState([]);
//   const [selectedId, setSelectedId] = useState('');
//   const [svgContent, setSvgContent] = useState('');

//   useEffect(() => {
//     fetchDataCenters()
//       .then(setDataCenters)
//       .catch(console.error);
//   }, []);

//   const handleDataCenterChange = async (e) => {
//     const id = e.target.value;
//     setSelectedId(id);
//     if (!id) {
//       setSvgContent('');
//       return;
//     }

//     try {
//       const data = await fetchSvgByDataCenter(id);
//       setSvgContent(data.svg_content);
//     } catch (error) {
//       console.error('Error fetching SVG:', error);
//       setSvgContent('');
//     }
//   };

//   return (
//     <div>
//       <h2>SVG Preview by Data Center</h2>
//       <select class="form-select w-50" value={selectedId} onChange={handleDataCenterChange}>
//         <option value="">-- Select Data Center --</option>
//         {dataCenters.map(dc => (
//           <option key={dc.id} value={dc.id}>{dc.name}</option>
//         ))}
//       </select>

//       <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
//         {svgContent ? (
//           <div dangerouslySetInnerHTML={{ __html: svgContent }} />
//         ) : (
//           <p>No SVG to preview.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SvgPreview;

import React, { useEffect, useState } from 'react';
import { Server, Eye } from 'lucide-react'; 
import { fetchDataCenters, fetchSvgByDataCenter } from '../../api/settings/dataCenterApi';

// ================================================
// STYLES - MODERN UI KIT STYLE
// ================================================
const styles = {
  // Layout
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "3rem 4rem",
    boxSizing: 'border-box',
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
  description: {
    fontSize: "1rem",
    color: "#6b7280",
    lineHeight: 1.5,
  },
  
  // Select/Input element styling
  inputStyle: {
    maxWidth: '400px', // Constrain the select box width
    padding: '12px 16px',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#111827',
    transition: 'all 150ms ease-in-out',
    boxSizing: 'border-box',
    display: 'block', // Ensures it takes up its defined width
    width: '100%',
  },

  // Preview container styling
  previewContainer: {
    marginTop: '30px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    minHeight: '400px', // Give the preview area a decent size
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    overflow: 'auto', // Allow scrolling if SVG is large
  },
  emptyPreview: {
    fontSize: '1.1rem',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
};

const SvgPreview = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Data Center Fetching ---
  useEffect(() => {
    fetchDataCenters()
      .then(setDataCenters)
      .catch(err => {
        console.error('Error loading data centers:', err);
        setError('Failed to load data centers.');
      });
  }, []);

  // --- Handle Data Center Change and SVG Fetching ---
  const handleDataCenterChange = async (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setSvgContent(''); // Clear old content immediately
    setError(null);
    
    if (!id) {
      return;
    }

    setIsLoading(true);
    try {
      // Functional requirement: Call the API
      const data = await fetchSvgByDataCenter(id); 
      setSvgContent(data.svg_content || '');
    } catch (error) {
      console.error('Error fetching SVG:', error);
      setError('Failed to fetch SVG for the selected data center.');
      setSvgContent('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* Header Section */}
      <header style={styles.headerSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <div>
            <h1 style={styles.heading}>SVG Map Preview</h1>
            <p style={styles.description}>
              Select a data center to view its uploaded floor map SVG.
            </p>
          </div>
        </div>
      </header>

      {/* Select Dropdown */}
      <div style={{ marginBottom: '20px' }}>
        <select 
          style={styles.inputStyle} 
          value={selectedId} 
          onChange={handleDataCenterChange}
        >
          <option value="">-- Select Data Center --</option>
          {dataCenters.map(dc => (
            <option key={dc.id} value={dc.id}>{dc.name}</option>
          ))}
        </select>
      </div>

      {/* Preview Area */}
      <div style={styles.previewContainer}>
        {isLoading ? (
          <p style={styles.emptyPreview}>
            
            Loading SVG content...
          </p>
        ) : error ? (
          <p style={{ ...styles.emptyPreview, color: '#dc2626' }}>
            
            Error: {error}
          </p>
        ) : svgContent ? (
          // Functional requirement: Use dangerouslySetInnerHTML for SVG
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        ) : (
          <p style={styles.emptyPreview}>
            <Eye style={{ width: '20px', height: '20px' }} />
            No SVG to preview. Please select a data center.
          </p>
        )}
      </div>
    </div>
  );
};

export default SvgPreview;