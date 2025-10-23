import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchPartners, createPartner, updatePartner, deletePartner} from '../../api/masterDataApi';
import CommonButton from '../../components/CommonButton';

const PartnerList = () => {
  const [allPartners, setAllPartners] = useState([]); // Stores all fetched partners
  const [currentPartners, setCurrentPartners] = useState([]); // Partners for the current page
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [partnersPerPage] = useState(5); // You can adjust this number
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all partners
  const loadPartners = async () => {
    try {
      const data = await fetchPartners();
      setAllPartners(data); // Set all partners
      setTotalPages(Math.ceil(data.length / partnersPerPage)); // Calculate total pages
      setError('');
    } catch (err) {
      setError('Failed to load partners');
      console.error('Error loading partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  // Effect to slice partners for the current page whenever currentPage or allPartners changes
  useEffect(() => {
    const indexOfLastPartner = currentPage * partnersPerPage;
    const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
    setCurrentPartners(allPartners.slice(indexOfFirstPartner, indexOfLastPartner));
  }, [currentPage, allPartners, partnersPerPage]);

  // Form validation schema
  const partnerSchema = Yup.object().shape({
    name: Yup.string()
      .required('Partner name is required')
      .max(255, 'Name must be 255 characters or less')
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editingId) {
        await updatePartner(editingId, values);
      } else {
        await createPartner(values);
      }
      await loadPartners(); // Re-fetch all partners to update the list and pagination
      resetForm();
      setEditingId(null);
      setError(''); // Clear any previous errors
      setCurrentPage(1); // Go back to the first page after saving
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving partner');
      console.error('Error saving partner:', err);
    }
  };

  // Handle edit
  const handleEdit = (partner) => {
    setEditingId(partner.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(id);
        // Optimistically update the list without re-fetching all if you want,
        // but re-fetching is safer for pagination consistency.
        const updatedPartners = allPartners.filter(partner => partner.id !== id);
        setAllPartners(updatedPartners);
        setTotalPages(Math.ceil(updatedPartners.length / partnersPerPage));
        
        // Adjust current page if the last item on a page was deleted
        if (currentPage > Math.ceil(updatedPartners.length / partnersPerPage) && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else if (currentPartners.length === 1 && currentPage > 1 && updatedPartners.length % partnersPerPage === 0) {
            setCurrentPage(prev => prev - 1);
        }

        setError('');
      } catch (err) {
        setError('Failed to delete partner');
        console.error('Error deleting partner:', err);
      }
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading partners...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Partner Management</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      {/* Partner Form */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>{editingId ? 'Edit Partner' : 'Add New Partner'}</h3>
        <Formik
          initialValues={{ name: editingId ? (allPartners.find(p => p.id === editingId)?.name || '') : '' }}
          validationSchema={partnerSchema}
          onSubmit={handleSubmit}
          enableReinitialize // Important to re-initialize form when editingId changes
        >
          {({ isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="name">Partner Name:</label>
                <Field 
                  type="text" 
                  name="name" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <ErrorMessage name="name" component="div" style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }} />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ padding: '8px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Partner' : 'Add Partner')}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setError('');
                  }}
                  style={{ marginLeft: '10px', padding: '8px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>

      {/* Partners List */}
      <div>
        <h3>Partner List</h3>
        {currentPartners.length === 0 && allPartners.length === 0 ? (
          <p>No partners found</p>
        ) : currentPartners.length === 0 && allPartners.length > 0 ? (
            <p>No partners found on this page.</p> // Should ideally not happen if pagination logic is sound
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>No.</th> {/* Added for sequential numbering */}
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>

<tbody>
  {currentPartners.map((partner, index) => (
    <tr key={partner.id} style={{ borderBottom: '1px solid #ddd' }}>
      <td style={{ padding: '12px' }}>{(currentPage - 1) * partnersPerPage + index + 1}</td>
      <td style={{ padding: '12px' }}>{partner.id}</td>
      <td style={{ padding: '12px' }}>{partner.name}</td>
      <td style={{ padding: '12px' }}>
        <div className="d-flex gap-2">
          <CommonButton name="edit" onClick={() => handleEdit(partner)} />
          <CommonButton name="delete" onClick={() => handleDelete(partner.id)} />
        </div>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 15px', background: '#eee', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer',
                marginRight: '5px'
              }}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  padding: '8px 15px', background: currentPage === i + 1 ? '#007bff' : '#eee',
                  color: currentPage === i + 1 ? 'white' : 'black',
                  border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer',
                  marginRight: '5px'
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 15px', background: '#eee', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerList;