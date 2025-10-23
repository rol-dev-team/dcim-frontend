import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSensorLists, deleteSensorList } from "../../api/sensorListApi";
import { usePermissions } from "../../context/PermissionContext";
import { confirmAlert } from "react-confirm-alert"; // Import confirmAlert
import "react-confirm-alert/src/react-confirm-alert.css"; // Import its CSS
import * as XLSX from "xlsx"; // Import xlsx library
import { saveAs } from "file-saver"; // Import file-saver library
import CommonButton from "../../components/CommonButton";

const SensorList = () => {
  const permissions = usePermissions();
  const canDeleteSensor = permissions.includes("sensor-delete");
  const canCreateSensor = permissions.includes("sensor-create");
  const canEditSensor = permissions.includes("sensor-edit");

  const [allSensors, setAllSensors] = useState([]); // Stores all fetched sensors
  const [currentSensors, setCurrentSensors] = useState([]); // Sensors for the current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [sensorsPerPage] = useState(10); // Number of sensors to show per page (can be adjusted)
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadAllSensors(); // Initial load of all sensors
  }, []);

  // Effect to update currentSensors whenever currentPage or allSensors changes
  useEffect(() => {
    const indexOfLastSensor = currentPage * sensorsPerPage;
    const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage;
    setCurrentSensors(allSensors.slice(indexOfFirstSensor, indexOfLastSensor));
  }, [currentPage, allSensors, sensorsPerPage]);

  const loadAllSensors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSensorLists(); // Fetches all sensors

      if (Array.isArray(data)) {
        setAllSensors(data);
        setTotalPages(Math.ceil(data.length / sensorsPerPage));
        // Reset to first page when new data is loaded
        setCurrentPage(1);
        setCurrentSensors(data.slice(0, sensorsPerPage));
      } else {
        setAllSensors([]);
        setCurrentSensors([]);
        setTotalPages(1);
        setError("Failed to load sensors: Unexpected data format.");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this sensor?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteSensorList(id);
              // Filter from allSensors and update pagination
              const updatedAllSensors = allSensors.filter(
                (sensor) => sensor.id !== id
              );
              setAllSensors(updatedAllSensors);

              const newTotalPages = Math.ceil(
                updatedAllSensors.length / sensorsPerPage
              );
              setTotalPages(newTotalPages);

              // Adjust current page if it's now beyond the new total pages or if the current page became empty
              if (currentPage > newTotalPages && currentPage > 1) {
                setCurrentPage(newTotalPages);
              } else if (
                currentSensors.length === 1 &&
                currentPage > 1 &&
                updatedAllSensors.length % sensorsPerPage === 0
              ) {
                // If the last item on a page is deleted, and it was a full page, move to the previous page
                setCurrentPage((prev) => prev - 1);
              }
              // The useEffect for `currentSensors` will handle slicing the new `allSensors`
            } catch (err) {
              setError(err.message);
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- Export Functionality ---
  const handleExport = () => {
    // Prepare data for export
    const dataToExport = allSensors.map((sensor, index) => ({
      No: index + 1, // Sequential number
      ID: sensor.id,
      "Data Center": sensor.data_center?.name || "N/A",
      Device: sensor.device?.name || "N/A",
      "Sensor Type": sensor.sensor_type?.name || "N/A",
      Location: sensor.location,
      "Unique ID": sensor.unique_id,
      Status: sensor.status ? "Active" : "Inactive",
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sensors");

    // Write the workbook to a buffer
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Save the file
    try {
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "sensor_list.xlsx"
      );
    } catch (e) {
      console.error("Error saving file:", e);
      setError("Failed to export Excel file.");
    }
  };
  // --- End Export Functionality ---

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1>Sensor List</h1>
        <div>
          {" "}
          {/* Group buttons in a div for layout */}
          {canCreateSensor && (
            <Link to='/admin/settings/sensor-lists/create'>
              <CommonButton name='createSensor' />
            </Link>
          )}
          <CommonButton name='export' onClick={handleExport} />
        </div>
      </div>

      <table className='table table-striped'>
        <thead>
          <tr>
            <th>No</th> {/* Added index column */}
            <th>ID</th>
            <th>Data Center</th>
            <th>Device</th>
            <th>Sensor_Type</th>
            <th>Sensor Name</th>
            <th>Location</th>
            <th>Unique ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSensors.length > 0 ? (
            currentSensors.map((sensor, index) => (
              <tr key={sensor.id}>
                {/* Calculate sequential number for the current page */}
                <td>{(currentPage - 1) * sensorsPerPage + index + 1}</td>
                <td>{sensor.id}</td>
                <td>{sensor?.data_center?.name || "N/A"}</td>
                <td>{sensor?.device?.name || "N/A"}</td>
                <td>{sensor?.sensor_type?.name || "N/A"}</td>
                <td>{sensor.sensor_name || "N/A"}</td>

                <td>{sensor.location}</td>
                <td>{sensor.unique_id}</td>
                <td>
                  <span
                    className={`badge ${
                      sensor.status ? "bg-success" : "bg-secondary"
                    }`}>
                    {sensor.status ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <div className='d-flex gap-2'>
                    {canEditSensor && (
                      <Link to={`/admin/settings/sensor-edit/${sensor.id}`}>
                        <CommonButton name='edit' />
                      </Link>
                    )}
                    {canDeleteSensor && (
                      <CommonButton
                        name='delete'
                        onClick={() => handleDelete(sensor.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='9' className='text-center'>
                {" "}
                {/* Adjusted colspan */}
                No sensors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls - Similar Styling */}
      {totalPages > 1 && ( // Only show pagination if there's more than 1 page
        <nav className='mt-3'>
          <ul className='pagination justify-content-center'>
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${
                  currentPage === i + 1 ? "active" : ""
                }`}>
                <button
                  className='page-link'
                  onClick={() => handlePageChange(i + 1)}>
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

export default SensorList;
