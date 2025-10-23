import React, { useEffect, useState } from 'react';
import { fetchDataCenters, uploadSvg } from '../../api/settings/dataCenterApi';
import CommonButton from "../../components/CommonButton";

const SvgUploader = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [svgFile, setSvgFile] = useState(null);

  useEffect(() => {
    fetchDataCenters()
      .then(setDataCenters)
      .catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    setSvgFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId || !svgFile) {
      alert('Please select a data center and an SVG file.');
      return;
    }

    try {
      await uploadSvg(selectedId, svgFile);
      alert('SVG uploaded successfully.');
      setSvgFile(null);
      setSelectedId('');
    } catch (error) {
      alert('Upload failed: ' + error.message);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Select Data Center:
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {dataCenters.map(dc => (
              <option key={dc.id} value={dc.id}>
                {dc.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <br />
      <div>
        <label>
          Upload SVG:
          <input
            type="file"
            accept=".svg"
            onChange={handleFileChange}
            required
          />
        </label>
      </div>
      <br />
      <CommonButton name="upload" />

    </form>
  );
};

export default SvgUploader;
