// components/MQTTDebugger.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const MQTTDebugger = () => {
  const mqttState = useSelector((state) => state.mqtt);
  const dataCenterId = useSelector((state) => state.updatedDataCenter.dataCenter);
  const dataCenterData = mqttState.data[dataCenterId];

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '15px',
      borderRadius: '8px',
      margin: '10px 0',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxHeight: '300px',
      overflowY: 'auto',
      border: '1px solid #ddd'
    }}>
      <h6 style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>📊 MQTT Debug Info</h6>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Current Data Center ID:</strong> {dataCenterId || 'Not selected'}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Last Updated:</strong> {mqttState.lastUpdated || 'No data yet'}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Total DC Data Stored:</strong> {Object.keys(mqttState.data).length}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Available Data Centers:</strong> {Object.keys(mqttState.data).join(', ') || 'None'}
      </div>

      {dataCenterData ? (
        <div style={{ 
          backgroundColor: '#e8f5e9',
          padding: '8px',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <div style={{ fontWeight: 'bold', color: 'green' }}>✓ Data Available for DC {dataCenterId}</div>
          <div>Sensor Types: {dataCenterData.sensor_types?.length || 0}</div>
          {dataCenterData.sensor_types?.map((st, idx) => (
            <div key={idx} style={{ marginLeft: '10px' }}>
              • Type {st.id}: {st.sensors?.length || 0} sensors
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffebee',
          padding: '8px',
          borderRadius: '4px',
          marginTop: '10px',
          color: 'red'
        }}>
          ✗ No data for DC {dataCenterId}
        </div>
      )}

      <div style={{ marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
        <strong>Raw Incoming Data:</strong>
        <pre style={{
          backgroundColor: '#fff',
          padding: '8px',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '150px',
          margin: '5px 0 0 0'
        }}>
          {JSON.stringify(mqttState.rawData, null, 2)}
        </pre>
      </div>

      {mqttState.error && (
        <div style={{
          backgroundColor: '#ffcdd2',
          padding: '8px',
          borderRadius: '4px',
          marginTop: '10px',
          color: '#d32f2f'
        }}>
          Error: {mqttState.error}
        </div>
      )}
    </div>
  );
};

export default MQTTDebugger;