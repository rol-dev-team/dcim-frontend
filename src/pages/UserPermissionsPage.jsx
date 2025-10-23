import React, { useEffect, useState } from "react";
import { getUserPermissions } from "../api/userApi";

const UserPermissionsPage = () => {
  const [allPermissions, setAllPermissions] = useState([]);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [permissionsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const data = await getUserPermissions();
        const fetchedPermissions = Array.isArray(data.permissions) ? data.permissions : [];

        setAllPermissions(fetchedPermissions);
        setTotalPages(Math.ceil(fetchedPermissions.length / permissionsPerPage));
        setCurrentPermissions(fetchedPermissions.slice(0, permissionsPerPage));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch permissions.");
        setAllPermissions([]);
        setCurrentPermissions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {
    const indexOfLast = currentPage * permissionsPerPage;
    const indexOfFirst = indexOfLast - permissionsPerPage;
    setCurrentPermissions(allPermissions.slice(indexOfFirst, indexOfLast));
  }, [currentPage, allPermissions, permissionsPerPage]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">User Permissions</h2>

      {loading ? (
        <p className="text-center">Loading permissions...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-center w-16">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Permission</th>
                </tr>
              </thead>
              <tbody>
                {currentPermissions.length > 0 ? (
                  currentPermissions.map((perm, index) => (
                    <tr key={(currentPage - 1) * permissionsPerPage + index}>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {(currentPage - 1) * permissionsPerPage + index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{perm}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="border border-gray-300 px-4 py-3 text-center text-gray-500"
                    >
                      No permissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

         {totalPages > 1 && (
  <nav className="mt-4">
    <ul className="pagination justify-content-center">
      {[...Array(totalPages)].map((_, i) => (
        <li
          key={i}
          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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

        </>
      )}
    </div>
  );
};

export default UserPermissionsPage;
