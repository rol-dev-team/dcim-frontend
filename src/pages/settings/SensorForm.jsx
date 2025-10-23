import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchSensorList,
  createSensorList,
  updateSensorList,
  fetchSensorTypeLists,
  fetchTriggerTypeLists,
} from "../../api/sensorListApi";
import { fetchDataCenters } from "../../api/settings/dataCenterApi";
import { fetchDevicesByDataCenter } from "../../api/deviceApi";

const SensorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    data_center_id: "",
    device_id: "",
    sensor_type_list_id: "",
    unique_id: "",
    trigger_type_id: "",
    sound_status: false,
    blink_status: false,
    sensor_name: "", // Added sensor_name field
    location: "",
    status: true,
    timestamp: new Date().toISOString(),
  });

  const [dataCenters, setDataCenters] = useState([]);
  const [devices, setDevices] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [triggerTypes, setTriggerTypes] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [centers, sensorTypeList, triggerTypeList] = await Promise.all([
          fetchDataCenters(),
          fetchSensorTypeLists(),
          fetchTriggerTypeLists(),
        ]);

        setDataCenters(centers);
        setSensorTypes(sensorTypeList);
        setTriggerTypes(triggerTypeList);
        setLoadingData(false);

        if (isEdit) {
          await loadSensor();
        }
      } catch (err) {
        setError(err.message);
        setLoadingData(false);
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id]);

  useEffect(() => {
    const loadDevices = async () => {
      if (!formData.data_center_id) {
        setDevices([]);
        return;
      }
      try {
        const deviceList = await fetchDevicesByDataCenter(
          formData.data_center_id
        );
        setDevices(deviceList);
      } catch (err) {
        setError(err.message);
        setDevices([]);
      }
    };

    loadDevices();
  }, [formData.data_center_id]);

  const loadSensor = async () => {
    try {
      const sensor = await fetchSensorList(id);
      setFormData({
        ...sensor,
        sound_status: Boolean(sensor.sound_status),
        blink_status: Boolean(sensor.blink_status),
        status: Boolean(sensor.status),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        sound_status: formData.sound_status ? 1 : 0,
        blink_status: formData.blink_status ? 1 : 0,
        status: formData.status ? 1 : 0,
      };

      if (!isEdit && !payload.unique_id) {
        delete payload.unique_id;
      }

      if (isEdit) {
        await updateSensorList(id, payload);
      } else {
        await createSensorList(payload);
      }
      navigate("/admin/settings/sensor-lists");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || loadingData) return <div>Loading...</div>;

  return (
    <div className='container'>
      <h1>{isEdit ? "Edit Sensor" : "Create New Sensor"}</h1>
      {error && <div className='alert alert-danger'>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-md-6'>
            <div className='mb-3'>
              <label className='form-label'>Data Center</label>
              <select
                className='form-select'
                name='data_center_id'
                value={formData.data_center_id}
                onChange={handleChange}
                required>
                <option value=''>Select Data Center</option>
                {dataCenters.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='mb-3'>
              <label className='form-label'>Device</label>
              <select
                className='form-select'
                name='device_id'
                value={formData.device_id}
                onChange={handleChange}
                required
                disabled={!formData.data_center_id}>
                <option value=''>Select Device</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='mb-3'>
              <label className='form-label'>Sensor Type</label>
              <select
                className='form-select'
                name='sensor_type_list_id'
                value={formData.sensor_type_list_id}
                onChange={handleChange}
                required
                disabled={sensorTypes.length === 0}>
                <option value=''>
                  {sensorTypes.length === 0
                    ? "Loading sensor types..."
                    : "Select Sensor Type"}
                </option>
                {sensorTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name || `Type ${type.id}`}
                  </option>
                ))}
              </select>
              {sensorTypes.length === 0 && (
                <div className='text-danger small'>
                  No sensor types available
                </div>
              )}
            </div>

            <div className='mb-3'>
              <label className='form-label'>Unique ID</label>
              <input
                type='text'
                className='form-control'
                name='unique_id'
                value={formData.unique_id || "Will be auto-generated"}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <div className='col-md-6'>
            <div className='mb-3'>
              <label className='form-label'>Trigger Type</label>
              <select
                className='form-select'
                name='trigger_type_id'
                value={formData.trigger_type_id}
                onChange={handleChange}
                required
                disabled={triggerTypes.length === 0}>
                <option value=''>
                  {triggerTypes.length === 0
                    ? "Loading trigger types..."
                    : "Select Trigger Type"}
                </option>
                {triggerTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name || `Type ${type.id}`}
                  </option>
                ))}
              </select>
              {triggerTypes.length === 0 && (
                <div className='text-danger small'>
                  No trigger types available
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Sensor Name</label>
              <input
                type='text'
                className='form-control'
                name='sensor_name'
                value={formData.sensor_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Location</label>
              <input
                type='text'
                className='form-control'
                name='location'
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-3 form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                name='sound_status'
                checked={formData.sound_status}
                onChange={handleChange}
              />
              <label className='form-check-label'>Sound Status</label>
            </div>

            <div className='mb-3 form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                name='blink_status'
                checked={formData.blink_status}
                onChange={handleChange}
              />
              <label className='form-check-label'>Blink Status</label>
            </div>

            <div className='mb-3 form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                name='status'
                checked={formData.status}
                onChange={handleChange}
              />
              <label className='form-check-label'>Active</label>
            </div>
          </div>
        </div>
        {/* updated by tahsin */}
        <div className='mt-4'>
          <button type='submit' className='btn btn-primary me-2'>
            {isEdit ? "Update" : "Save"}
          </button>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => navigate("/admin/settings/sensor-lists")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SensorForm;
