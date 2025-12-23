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

//old preview ###########

// return (
//   <div style={styles.pageContainer}>
//     {/* Header Section */}
//     <header style={styles.headerSection}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//         <div>
//           <h1 style={styles.heading}>SVG Map Preview</h1>
//           <p style={styles.description}>
//             Select a data center to view its uploaded floor map SVG.
//           </p>
//         </div>
//       </div>
//     </header>

//     {/* Select Dropdown */}
//     <div style={{ marginBottom: '20px' }}>
//       <select style={styles.inputStyle} value={selectedId} onChange={handleDataCenterChange}>
//         <option value="">-- Select Data Center --</option>
//         {dataCenters.map((dc) => (
//           <option key={dc.id} value={dc.id}>
//             {dc.name}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Preview Area */}
//     <div style={styles.previewContainer}>
//       {isLoading ? (
//         <p style={styles.emptyPreview}>Loading SVG content...</p>
//       ) : error ? (
//         <p style={{ ...styles.emptyPreview, color: '#dc2626' }}>Error: {error}</p>
//       ) : svgContent ? (
//         <div className="svg-container" dangerouslySetInnerHTML={{ __html: svgContent }} />
//       ) : (
//         <p style={styles.emptyPreview}>
//           <Eye style={{ width: '20px', height: '20px' }} />
//           No SVG to preview. Please select a data center.
//         </p>
//       )}
//     </div>
//   </div>
// );

// import React, { useEffect, useState, useRef } from 'react';
// import { Server, Eye } from 'lucide-react';
// import { fetchDataCenters, fetchSvgByDataCenter } from '../../api/settings/dataCenterApi';

// // ================================================
// // STYLES - MODERN UI KIT STYLE
// // ================================================
// const styles = {
//   // Layout
//   pageContainer: {
//     minHeight: '100vh',
//     backgroundColor: '#f8fafc',
//     padding: '3rem 4rem',
//     boxSizing: 'border-box',
//   },
//   headerSection: {
//     marginBottom: '2rem',
//     textAlign: 'left',
//     paddingBottom: '1rem',
//     borderBottom: '1px solid #e5e7eb',
//   },
//   heading: {
//     fontSize: '2rem',
//     fontWeight: 600,
//     color: '#111827',
//     marginBottom: '0.25rem',
//     letterSpacing: '-0.02em',
//   },
//   description: {
//     fontSize: '1rem',
//     color: '#6b7280',
//     lineHeight: 1.5,
//   },

//   // Select/Input element styling
//   inputStyle: {
//     maxWidth: '400px', // Constrain the select box width
//     padding: '12px 16px',
//     backgroundColor: '#fff',
//     border: '1px solid #d1d5db',
//     borderRadius: '8px',
//     color: '#111827',
//     transition: 'all 150ms ease-in-out',
//     boxSizing: 'border-box',
//     display: 'block', // Ensures it takes up its defined width
//     width: '100%',
//   },

//   // Preview container styling
//   previewContainer: {
//     marginTop: '30px',
//     backgroundColor: '#fff',
//     border: '1px solid #e5e7eb',
//     borderRadius: '8px',
//     padding: '20px',
//     minHeight: '400px', // Give the preview area a decent size
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
//     overflow: 'auto', // Allow scrolling if SVG is large
//   },
//   emptyPreview: {
//     fontSize: '1.1rem',
//     color: '#9ca3af',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//   },
// };

// const SvgPreview = () => {
//   const circlePaths = useRef([]);
//   const [dataCenters, setDataCenters] = useState([]);
//   const [selectedId, setSelectedId] = useState('');
//   const [svgContent, setSvgContent] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     fetchDataCenters()
//       .then(setDataCenters)
//       .catch((err) => {
//         console.error('Error loading data centers:', err);
//         setError('Failed to load data centers.');
//       });
//   }, []);

//   const handleDataCenterChange = async (e) => {
//     const id = e.target.value;
//     setSelectedId(id);
//     setSvgContent('');
//     setError(null);

//     if (!id) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const data = await fetchSvgByDataCenter(id);
//       setSvgContent(data.svg_content || '');
//     } catch (error) {
//       console.error('Error fetching SVG:', error);
//       setError('Failed to fetch SVG for the selected data center.');
//       setSvgContent('');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!svgContent) return;
//     const paths = document.querySelectorAll('.svg-container svg path');
//     const found = [];
//     paths.forEach((path) => {
//       const d = path.getAttribute('d');
//       const id = path.getAttribute('id');
//       const isCircleLike = /c 0,100\.239\d*/.test(d) && d.includes('181.5');
//       if (isCircleLike && id) {
//         found.push(id);
//       }
//     });
//     circlePaths.current = found;
//   }, [svgContent]);

//   console.log('svgContent:', svgContent);
//   console.log('circlePaths:', circlePaths.current);

//   return (
//     <div className="min-h-screen bg-gray-100 p-12 box-border font-sans">
//       {/* Header Section */}
//       <header className="mb-8 text-left pb-4 border-b border-gray-200">
//         <h1 className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight">
//           SVG Map Preview
//         </h1>
//         <p className="text-gray-500 text-base leading-relaxed">
//           Select a data center to view its uploaded floor map SVG.
//         </p>
//       </header>

//       {/* Data Center Select */}
//       <div className="max-w-md mb-6">
//         <select
//           value={selectedId}
//           onChange={handleDataCenterChange}
//           className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
//         >
//           <option value="">-- Select Data Center --</option>
//           {dataCenters.map((dc) => (
//             <option key={dc.id} value={dc.id}>
//               {dc.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* SVG Preview Area */}
//       <div className="flex-1 min-h-[450px] bg-white border border-gray-200 rounded-lg p-5 flex justify-center items-center shadow-sm overflow-auto transition-all duration-200 ease-in-out">
//         {isLoading ? (
//           <p className="text-gray-400 text-lg">Loading SVG content...</p>
//         ) : error ? (
//           <p className="text-red-600 text-lg">{error}</p>
//         ) : svgContent ? (
//           <div
//             className="svg-container w-full max-w-full min-h-[400px] flex justify-center items-center"
//             dangerouslySetInnerHTML={{ __html: svgContent }}
//           />
//         ) : (
//           <div className="flex flex-col items-center gap-2 text-gray-400 text-lg">
//             <Eye className="w-6 h-6" />
//             <span>No SVG to preview. Please select a data center.</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SvgPreview;

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { fetchDataCenters, fetchSvgByDataCenter } from '../../api/settings/dataCenterApi';

const SvgPreview = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Data Centers
  useEffect(() => {
    fetchDataCenters()
      .then(setDataCenters)
      .catch(() => setError('Failed to load data centers.'));
  }, []);

  // Handle Data Center selection
  const handleDataCenterChange = async (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setSvgContent('');
    setError(null);
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await fetchSvgByDataCenter(id);
      setSvgContent(data.svg_content || '');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch SVG for the selected data center.');
      setSvgContent('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-12 box-border font-sans">
      {/* Header Section */}
      <header className="mb-8 text-left pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight">
          SVG Map Preview
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Select a data center to view its uploaded floor map SVG.
        </p>
      </header>

      {/* Data Center Select */}
      <div className="max-w-md mb-6">
        <select
          value={selectedId}
          onChange={handleDataCenterChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          <option value="">-- Select Data Center --</option>
          {dataCenters.map((dc) => (
            <option key={dc.id} value={dc.id}>
              {dc.name}
            </option>
          ))}
        </select>
      </div>

      {/* SVG Preview Area */}
      <div className="flex-1 min-h-[450px] bg-white border border-gray-200 rounded-lg p-5 flex justify-center items-center shadow-sm overflow-auto transition-all duration-200 ease-in-out">
        {isLoading ? (
          <p className="text-gray-400 text-lg">Loading SVG content...</p>
        ) : error ? (
          <p className="text-red-600 text-lg">{error}</p>
        ) : svgContent ? (
          <div
            className="svg-container w-full max-w-full min-h-[400px] flex justify-center items-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 text-lg">
            <Eye className="w-6 h-6" />
            <span>No SVG to preview. Please select a data center.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SvgPreview;
