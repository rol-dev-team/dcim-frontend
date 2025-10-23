import React, { useEffect, useState } from 'react';
import { fetchDataCenters, fetchSvgByDataCenter } from '../../api/settings/dataCenterApi';

const SvgPreview = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    fetchDataCenters()
      .then(setDataCenters)
      .catch(console.error);
  }, []);

  const handleDataCenterChange = async (e) => {
    const id = e.target.value;
    setSelectedId(id);
    if (!id) {
      setSvgContent('');
      return;
    }

    try {
      const data = await fetchSvgByDataCenter(id);
      setSvgContent(data.svg_content);
    } catch (error) {
      console.error('Error fetching SVG:', error);
      setSvgContent('');
    }
  };

  return (
    <div>
      <h2>SVG Preview by Data Center</h2>
      <select class="form-select w-50" value={selectedId} onChange={handleDataCenterChange}>
        <option value="">-- Select Data Center --</option>
        {dataCenters.map(dc => (
          <option key={dc.id} value={dc.id}>{dc.name}</option>
        ))}
      </select>

      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        {svgContent ? (
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        ) : (
          <p>No SVG to preview.</p>
        )}
      </div>
    </div>
  );
};

export default SvgPreview;

