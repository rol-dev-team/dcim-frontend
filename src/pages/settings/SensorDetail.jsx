import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSensorList, deleteSensorList } from '../../api/sensorListApi';
import CommonButton from '../../components/CommonButton';

const SensorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSensor();
  }, [id]);

  const loadSensor = async () => {
    try {
      const data = await fetchSensorList(id);
      setSensor(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this sensor?')) {
      try {
        await deleteSensorList(id);
        navigate('/admin/settings/sensor-lists');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!sensor) return <div>Sensor not found</div>;

  return (
    <div className="container">
      
      
      <div className="d-flex justify-content-between align-items-center mb-4">
  <h1>Sensor Details</h1>
  <div>
    <Link to={`/admin/settings/sensor-lists/${id}/edit`}>
      <CommonButton name="edit" />
    </Link>
    <CommonButton name="delete" onClick={handleDelete} />
  </div>
</div>

      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5 className="card-title">Basic Information</h5>
              <p><strong>ID:</strong> {sensor.id}</p>
              <p><strong>Data Center ID:</strong> {sensor.data_center_id}</p>
              <p><strong>Device ID:</strong> {sensor.device_id}</p>
              <p><strong>Sensor Type:</strong> {sensor.sensor_type_list_id}</p>
              <p><strong>Unique ID:</strong> {sensor.unique_id}</p>
            </div>
            <div className="col-md-6">
              <h5 className="card-title">Status Information</h5>
              <p>
                <strong>Trigger Type:</strong> {sensor.trigger_type_id}
              </p>
              <p>
                <strong>Sound Status:</strong> 
                <span className={`badge ${sensor.sound_status ? 'bg-success' : 'bg-secondary'}`}>
                  {sensor.sound_status ? 'On' : 'Off'}
                </span>
              </p>
              <p>
                <strong>Blink Status:</strong> 
                <span className={`badge ${sensor.blink_status ? 'bg-success' : 'bg-secondary'}`}>
                  {sensor.blink_status ? 'On' : 'Off'}
                </span>
              </p>
              <p>
                <strong>Location:</strong> {sensor.location}
              </p>
              <p>
                <strong>Status:</strong> 
                <span className={`badge ${sensor.status ? 'bg-success' : 'bg-secondary'}`}>
                  {sensor.status ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date(sensor.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Link to="/admin/settings/sensor-lists" className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default SensorDetail;