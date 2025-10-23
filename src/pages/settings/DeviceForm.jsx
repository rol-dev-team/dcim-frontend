import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDevice, createDevice, updateDevice } from "../../api/deviceApi";
import { fetchDataCenters } from "../../api/settings/dataCenterApi";

const DeviceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dataCenters, setDataCenters] = useState([]);
    const [device, setDevice] = useState({
        name: "",
        data_center_id: "",
        location: "",
        secret_key: null,
        control_topic: null, // Added new field
        status: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const centers = await fetchDataCenters();
                setDataCenters(centers);

                if (id) {
                    const existingDevice = await fetchDevice(id);
                    setDevice(existingDevice);
                }
            } catch (err) {
                setError(err.message);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDevice((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateDevice(id, device);
            } else {
                await createDevice(device);
            }
            navigate("/admin/settings/devices-list");
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>{id ? "Edit" : "Create"} Device</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={device.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Data Center</label>
                    <select
                        name="data_center_id"
                        value={device.data_center_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Data Center</option>
                        {dataCenters.map((dc) => (
                            <option key={dc.id} value={dc.id}>
                                {dc.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={device.location}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Received Topic (Optional)</label>
                    <input
                        type="text"
                        name="secret_key"
                        value={device.secret_key || ""}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Leave empty if not needed"
                    />
                </div>

                {/* Added Control Topic field */}
                <div className="form-group">
                    <label>Control Topic (Optional)</label>
                    <input
                        type="text"
                        name="control_topic"
                        value={device.control_topic || ""}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Leave empty if not needed"
                    />
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        name="status"
                        value={device.status}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
                {/* ----updated by tahsin--- */}
       <button 
        type="button"
        className="btn btn-secondary ms-2"
        // onClick={handleCancel}
        onClick={() => navigate('/admin/settings/devices-list')}
        disabled={loading}
      >
        Cancel
      </button>
            </form>
        </div>
    );
};

export default DeviceForm;