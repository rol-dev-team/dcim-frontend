import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchDevices, deleteDevice } from "../../api/deviceApi";
import { usePermissions } from "../../context/PermissionContext";
import { confirmAlert } from "react-confirm-alert"; // New import
import "react-confirm-alert/src/react-confirm-alert.css"; // New import
import * as XLSX from 'xlsx'; // New import
import { saveAs } from 'file-saver'; // New import
import CommonButton from "../../components/CommonButton";

const DeviceListShow = () => {
    const permissions = usePermissions();
    const canDeleteDevice = permissions.includes("device-delete");
    const canCreateDevice = permissions.includes("device-create");
    const canEditDevice = permissions.includes("device-edit");

    // State changes for pagination
    const [allDevices, setAllDevices] = useState([]); // Stores all devices fetched
    const [currentDevices, setCurrentDevices] = useState([]); // Devices for the current page
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state for client-side
    const [currentPage, setCurrentPage] = useState(1);
    const [devicesPerPage] = useState(10); // Number of devices to show per page
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadAllDevices = async () => { // Renamed from loadDevices
            try {
                setLoading(true); // Ensure loading is set
                setError(null); // Clear previous errors
                const data = await fetchDevices();

                if (Array.isArray(data)) {
                    setAllDevices(data);
                    setTotalPages(Math.ceil(data.length / devicesPerPage));
                    setCurrentDevices(data.slice(0, devicesPerPage)); // Initialize current devices
                } else {
                    setAllDevices([]);
                    setTotalPages(1);
                    setCurrentDevices([]);
                    setError("Fetched data is not an array or is empty.");
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        loadAllDevices();
    }, []);

    // Effect to update currentDevices when currentPage or allDevices changes
    useEffect(() => {
        const indexOfLastDevice = currentPage * devicesPerPage;
        const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
        setCurrentDevices(allDevices.slice(indexOfFirstDevice, indexOfLastDevice));
    }, [currentPage, allDevices, devicesPerPage]);

    const handleDelete = (id) => { // Modified to use confirmAlert
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure you want to delete this device?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            await deleteDevice(id);
                            // Filter from allDevices and re-calculate pagination
                            const updatedAllDevices = allDevices.filter(device => device.id !== id);
                            setAllDevices(updatedAllDevices); // Update the source of truth
                            setTotalPages(Math.ceil(updatedAllDevices.length / devicesPerPage));

                            // If current page becomes empty after deletion, go to previous page
                            const newTotalPages = Math.ceil(updatedAllDevices.length / devicesPerPage);
                            if (currentPage > newTotalPages && currentPage > 1) {
                                setCurrentPage(newTotalPages);
                            } else {
                                // Re-trigger useEffect to slice current page if not changing page number
                                // This ensures the current page updates correctly if an item is deleted from it
                                setCurrentDevices(updatedAllDevices.slice(
                                    (currentPage - 1) * devicesPerPage,
                                    currentPage * devicesPerPage
                                ));
                            }

                        } catch (err) {
                            setError(err.message);
                        }
                    },
                },
                { label: "No" },
            ],
        });
    };

    // New function for pagination page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // New Export Functionality
    const handleExport = () => {
        // Prepare data for export
        const dataToExport = allDevices.map((device, index) => ({
            No: index + 1, // Sequential number
            Name: device.name,
            'Data Center': device.data_center?.name || 'N/A',
            Location: device.location,
            'Secret Key': device.secret_key || 'Not set',
            'Control Topic': device.control_topic || 'Not set', // Added back
            Status: device.status === 1 ? 'Active' : 'Inactive',
        }));

        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        // Create a workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Devices");

        // Write the workbook to a buffer
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Save the file
        try {
            saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'device_list.xlsx');
        } catch (e) {
            console.error("Error saving file:", e);
            setError("Failed to export Excel file.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            <h2>Device List</h2>
            {/* Flex container for buttons */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                {canCreateDevice && (
                    <Link
                        to="/admin/settings/devices-create"
                        className="btn btn-primary text-white me-2"
                    >
                        Add New Device
                    </Link>
                )}
                {/* Export Button */}
                <button className="btn btn-success" onClick={handleExport}>
                    Export
                </button>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th> {/* New column */}
                        <th>Name</th>
                        <th>Data Center</th>
                        <th>Location</th>
                        <th>Secret Key</th> {/* Renamed from Received Topic */}
                        <th>Control Topic</th> {/* Restored column */}
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDevices.length > 0 ? (
                        currentDevices.map((device, index) => (
                            <tr key={device.id}>
                                <td>
                                    {(currentPage - 1) * devicesPerPage + index + 1}
                                </td>
                                <td>{device.name}</td>
                                <td>{device.data_center?.name || "N/A"}</td>
                                <td>{device.location}</td>
                                <td>{device.secret_key || "Not set"}</td>
                                <td>{device.control_topic || "Not set"}</td> {/* Restored cell */}
                                <td>
                                    <span
                                        className={`badge ${
                                            device.status === 1
                                                ? "bg-success"
                                                : "bg-secondary"
                                        }`}
                                    >
                                        {device.status === 1
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>




{/* pls check here for gap issue !!!!!!!!!!!!!!!! */}


                                <td>
                                    <div className="d-flex g-2">
  {canEditDevice && (
    <Link
      to={`/admin/settings/devices-edit/${device.id}`}
      style={{ textDecoration: 'none' }}
    >
      <CommonButton name="edit" />
    </Link>
  )}
  {canDeleteDevice && (
    <CommonButton
      name="delete"
      onClick={() => handleDelete(device.id)}
    />
  )}
  </div>
</td>



                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center"> {/* Increased colspan */}
                                No devices found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        {[...Array(totalPages)].map((_, i) => (
                            <li
                                key={i}
                                className={`page-item ${
                                    currentPage === i + 1
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default DeviceListShow;