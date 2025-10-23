import React, { useState, useEffect } from 'react';
import { fetchDataCenters } from '../../api/settings/dataCenterApi';
import { fetchDashboardTabs, createTabMapping, fetchExistingMappings } from '../../api/dashboardTabApi';

const DashboardMapping = () => {
  const [dataCenters, setDataCenters] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [selectedDataCenter, setSelectedDataCenter] = useState('');
  const [selectedTabs, setSelectedTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingMappings, setExistingMappings] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dcResponse = await fetchDataCenters();
        setDataCenters(dcResponse);
        
        const tabsResponse = await fetchDashboardTabs();
        setTabs(tabsResponse);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const loadExistingMappings = async () => {
      if (selectedDataCenter) {
        try {
          setLoading(true);
          const mappings = await fetchExistingMappings(selectedDataCenter);
          setExistingMappings(mappings);
          setSelectedTabs(mappings.map(mapping => mapping.tab_id));
        } catch (error) {
          console.error('Error loading existing mappings:', error);
          setExistingMappings([]);
          setSelectedTabs([]);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadExistingMappings();
  }, [selectedDataCenter]);

  const handleDataCenterChange = (e) => {
    setSelectedDataCenter(e.target.value);
  };

  const handleTabChange = (tabId) => {
    setSelectedTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId) 
        : [...prev, tabId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createTabMapping({
        data_center_id: selectedDataCenter,
        tab_ids: selectedTabs
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      const updatedMappings = await fetchExistingMappings(selectedDataCenter);
      setExistingMappings(updatedMappings);
    } catch (error) {
      console.error('Error creating mapping:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Data Center Tab Mapping</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="dataCenter" className="block mb-2 font-medium">
            Select Data Center:
          </label>
          <select
            id="dataCenter"
            value={selectedDataCenter}
            onChange={handleDataCenterChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select Data Center --</option>
            {dataCenters.map(dc => (
              <option key={dc.id} value={dc.id}>
                {dc.name}
              </option>
            ))}
          </select>
        </div>

        {selectedDataCenter && (
  <>
    <div className="mb-4">
      <label className="block mb-2 font-medium">
        Select Dashboard Tabs:
      </label>
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <div key={tab.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <input
              type="checkbox"
              id={`tab-${tab.id}`}
              checked={selectedTabs.includes(tab.id)}
              onChange={() => handleTabChange(tab.id)}
              className="h-4 w-4"
            />
            <label htmlFor={`tab-${tab.id}`} className="text-sm">
              {tab.name}
            </label>
          </div>
        ))}
      </div>
    </div>

    {existingMappings.length > 0 && (
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Existing Mappings:</h3>
        <div className="flex flex-wrap gap-2">
          {existingMappings.map(mapping => (
            <span 
              key={mapping.id}
              className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm"
            >
              {mapping.tab ? mapping.tab.name : `Tab ID: ${mapping.tab_id}`}
            </span>
          ))}
        </div>
      </div>
    )}
  </>
)}

        <button
          type="submit"
          disabled={loading || !selectedDataCenter || selectedTabs.length === 0}
          className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save Mapping'}
        </button>

        {success && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            Mapping created successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default DashboardMapping;