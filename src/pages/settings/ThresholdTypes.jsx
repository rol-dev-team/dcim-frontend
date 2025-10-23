import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchThresholdTypes,
  fetchThresholdType,
  createThresholdType,
  updateThresholdType,
  deleteThresholdType
} from '../../api/thresholdTypeApi';
import CommonButton from '../../components/CommonButton';

const ThresholdTypes = () => {
  const [thresholdTypes, setThresholdTypes] = useState([]);
  const [currentThreshold, setCurrentThreshold] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    attach_sound: null, // Will hold the file object
    url: '',
    color: '#000000',
    timestamp: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadThresholdTypes();
  }, []);

  const loadThresholdTypes = async () => {
    try {
      const data = await fetchThresholdTypes();
      setThresholdTypes(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attach_sound') {
      setFormData({
        ...formData,
        [name]: files[0] // Single file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      if (formData.attach_sound) {
        payload.append('attach_sound', formData.attach_sound);
      }
      payload.append('url', formData.url);
      payload.append('color', formData.color);
      payload.append('timestamp', formData.timestamp);

      if (isEditing && currentThreshold) {
        await updateThresholdType(currentThreshold.id, payload);
      } else {
        await createThresholdType(payload);
      }

      loadThresholdTypes();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const threshold = await fetchThresholdType(id);
      setCurrentThreshold(threshold);
      setFormData({
        name: threshold.name,
        attach_sound: null, // Reset to null (user can upload new file if needed)
        url: threshold.url || '',
        color: threshold.color || '#000000',
        timestamp: threshold.timestamp || new Date().toISOString()
      });
      setIsEditing(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this threshold type?')) {
      try {
        await deleteThresholdType(id);
        loadThresholdTypes();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      attach_sound: null,
      url: '',
      color: '#000000',
      timestamp: new Date().toISOString()
    });
    setIsEditing(false);
    setCurrentThreshold(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      {/* <h1>Threshold Types</h1> */}

      <div className="row">
        <div className="col-md-6">
          <h2>{isEditing ? 'Edit Threshold Type' : 'Add New Threshold Type'}</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Attach Sound</label>
              <input
                type="file"
                className="form-control"
                name="attach_sound"
                accept="audio/*"
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">URL</label>
              <input
                type="url"
                className="form-control"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>



            <div className="d-flex gap-2">
    <CommonButton
      name={isEditing ? 'update' : 'save'}
      type="submit"
    />
    {isEditing && (
      <CommonButton
        name="cancel"
        type="button"
        onClick={resetForm}
      />
    )}
  </div>


           
          </form>
        </div>

        <div className="col-md-6">
          <h2>Threshold Types List</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {thresholdTypes.map((type) => (
                <tr key={type.id}>
                  <td>{type.name}</td>
                  <td>
                    <span
                      className="badge"
                      style={{ backgroundColor: type.color, color: getContrastColor(type.color) }}
                    >
                      {type.color}
                    </span>
                  </td>



                <td>
  <div className="d-flex gap-2">
    <CommonButton name="edit" onClick={() => handleEdit(type.id)} />
    <CommonButton name="delete" onClick={() => handleDelete(type.id)} />
  </div>
</td>



                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function for text contrast
function getContrastColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

export default ThresholdTypes;
