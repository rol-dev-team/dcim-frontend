import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import ReactAudioPlayer from 'react-audio-player';
import { Volume2, VolumeX } from "lucide-react";
import { useSelector } from 'react-redux';

import { fetchDataCenterCount } from '../api/settings/dataCenterApi';
import sound from '../assets/sounds/alarm.mp3';
import { fetchSensorThreshold, fetchSensorType, fetchStateConfig } from "../api/dashboardTabApi";
import { fetchDiagramSVG } from "../api/settings/dataCenterApi";
import { errorMessage } from '../api/api-config/apiResponseMessage';


const Home = () => {
  const dataCenterId = useSelector((state) => state.updatedDataCenter.dataCenter);
  const incommingMQTTData = useSelector((state) => state.mqtt.data);
  const [alarmSensors, setAlarmSensors] = useState([]);
    const [alarmSmokeWaterSensors, setAlarmSmokeWaterSensors] = useState([]);
  
  const [shouldPlayAlarm, setShouldPlayAlarm] = useState(false);
  const [isMuteAlarm, setIsMuteAlarm] = useState(false);
  const [showOnlyAlarms, setShowOnlyAlarms] = useState(false);
   const [totalRequiredAlarmCount, setTotalRequiredAlarmCount] = useState(0);
   const [totalAlarmedSensorIds, setTotalAlarmedSensorIds] = useState(0);
   

  

   const [sensorType, setSensorType] = useState([]);
  const [threshold, setThreshold] = useState([]);
  const [stateConfig, setStateConfig] = useState([]);
  const [diagramContent, setDiagramContent] = useState([]);
  
    // sesor Type
  const [allowedSensorIds, setAllowedSensorIds] = useState(new Set([1, 2]));
  const [allowedSmokeAndWaterSensorIds, setAllowedSmokeAndWaterSensorIds] = useState(new Set([4, 5]));
  const [allowedSLDIds, setAllowedSLDIds] = useState(new Set([3]));

   useEffect(() => {
    if(dataCenterId != null){
      Promise.all([
      fetchSensorThreshold(dataCenterId),
      fetchSensorType(dataCenterId),
      fetchStateConfig(dataCenterId),
      fetchDiagramSVG(dataCenterId)
    ])
      .then(([thresholdRes, sensorTypeRes,stateRes,diagramSvg]) => {
        setThreshold(thresholdRes);
        setSensorType(sensorTypeRes);
        setStateConfig(stateRes);
        setDiagramContent(diagramSvg.data);
        
      })
      .catch(errorMessage);
    }
  }, [dataCenterId]);

 

useEffect(()=>{
  fetchDataCenterCount()
  .then((res)=>{

})
  },[]);


  useEffect(() => {
  setAlarmSensors([]);
    if (incommingMQTTData?.length > 0 && dataCenterId && threshold.length) {
      const filteredDataCenter = incommingMQTTData.filter(item => item.dc_id === dataCenterId);
      if (filteredDataCenter.length === 0) {
      console.warn(`⚠️ No matching MQTT data found for dataCenterId: ${dataCenterId}`);
      setAlarmSensors([]);
      return;
    }
      const latest = filteredDataCenter[filteredDataCenter.length - 1];
      if (latest.dc_id === dataCenterId) {
        const matchedSensorType = {
          ...latest,
          sensor_types: (latest.sensor_types || []).filter(item =>
            allowedSensorIds?.has(item.id)
          ),
        };
  
        const enriched = {
          ...matchedSensorType,
          sensor_types: matchedSensorType.sensor_types.map(sensorType => {
            const typeThreshold = threshold.find(
              th => th.sensor_type === sensorType.id && th.dc_id === matchedSensorType.dc_id
            );
  
            const sensor_type_name = typeThreshold?.sensor_type_name || null;
  
            return {
              ...sensorType,
              sensor_type_name,
              
              sensors: sensorType.sensors
                .filter(sensor =>
                  threshold.some(th =>
                    th.sensor_id === sensor.id &&
                    th.dc_id === matchedSensorType.dc_id &&
                    th.sensor_type === sensorType.id
                  )
                )
                .map(sensor => {
                  const matchedThresholds = threshold
                    .filter(th =>
                      th.sensor_id === sensor.id &&
                      th.dc_id === matchedSensorType.dc_id &&
                      th.sensor_type === sensorType.id
                    )
                    .map(th => ({
                      threshold: th.threshold,
                      threshold_name: th.threshold_name,
                      color: th.color,
                    }));
  
                    matchedThresholds?.forEach(th => {
                    const sensorValue = Number(sensor.val);
                    const thresholdValue = Number(th.threshold);
  
                    if (th.threshold_name === "High" && sensorValue >= thresholdValue) {
                      // console.log("🔥 High threshold crossed! Adding to alarmSensors.");
  
                  setAlarmSensors(prev => [
                        ...prev,
                        {
                          sensor_id: sensor.id,
                          sensor_type: sensorType.id,
                          sensor_type_name: sensor_type_name , 
                          val: sensorValue,
                          threshold: thresholdValue,
                          threshold_name: th.threshold_name,
                          dc_id: matchedSensorType.dc_id,
                        }
                      ]);
                    }
                  });
  
  
                  return {
                    ...sensor,
                    thresholds: matchedThresholds ?? [],
                  };
                }),
            };
          }),
        };
      }
    }
  }, [incommingMQTTData, dataCenterId, threshold]);


useEffect(() => {
  if (!incommingMQTTData?.length || !dataCenterId || !stateConfig.length) return;

  const filteredDataCenter = incommingMQTTData.filter(item => item.dc_id === dataCenterId);
  if (!filteredDataCenter.length) return;

  const latest = filteredDataCenter[filteredDataCenter.length - 1];
  if (!latest?.sensor_types?.length) return;

  const filteredSensorTypes = latest.sensor_types.filter(sensorType =>
    allowedSmokeAndWaterSensorIds.has(sensorType.id)
  );
  if (!filteredSensorTypes.length) return;

  const alarmSensors = [];

  filteredSensorTypes.forEach(sensorType => {
    const sensor_type_name =
      stateConfig.find(state => state.type_id === sensorType.id)?.type_name || null;

    sensorType.sensors.forEach(sensor => {
      const matchedState = stateConfig.find(
        state =>
          state.sensor_id === sensor.id &&
          state.type_id === sensorType.id &&
          state.state_value === sensor.val
      );
      const isAlarm =
    matchedState?.state_name &&
    matchedState.state_name.toLowerCase() !== "normal";

      if (isAlarm) {
        alarmSensors.push({
          sensor_id: sensor.id,
          sensor_type: sensorType.id,
          sensor_type_name: sensor_type_name,
          val: sensor.val,
          state_name: matchedState.state_name,
          color: matchedState.color,
          location: matchedState.location,
          dc_id: latest.dc_id,
        });
      }
    });
  });

  setAlarmSmokeWaterSensors(alarmSensors);
}, [incommingMQTTData, dataCenterId, stateConfig]);


const updatedAlarmData = sensorType?.map(type => {
  const normal = alarmSensors?.filter(sensor =>
    sensor.sensor_type_name.toLowerCase() === type.sensor_type_name.toLowerCase()
  ) || [];

  const smokeWater = alarmSmokeWaterSensors?.filter(sensor =>
    sensor.sensor_type_name.toLowerCase() === type.sensor_type_name.toLowerCase()
  ) || [];

  const allSensors = [...normal, ...smokeWater];

  return {
    ...type,
    sensorId: allSensors.map(sensor => sensor.sensor_id),
    alarm: allSensors.length,
  };
});

const alarmFiltered = showOnlyAlarms
    ? updatedAlarmData?.filter(item => item.alarm > 0)
    : updatedAlarmData;

//  useEffect(() => {
//     const totalAlarmCount = updatedAlarmData?.reduce((sum, item) => sum + item.alarm, 0);
//     setShouldPlayAlarm(totalAlarmCount > 0);
//     setTotalRequiredAlarmCount(totalAlarmCount);
//   }, [updatedAlarmData]);

useEffect(() => {
  if (!Array.isArray(updatedAlarmData)) return;

  let totalCount = 0;
  const alarmedSensorIds = updatedAlarmData
    .filter(item => item.alarm > 0)
    .flatMap(item => item.sensorId);

  totalCount = alarmedSensorIds.length;

  const uniqueAlarmedSensorIds = Array.from(new Set(alarmedSensorIds));

  setShouldPlayAlarm(prev => {
    const newValue = totalCount > 0;
    return prev === newValue ? prev : newValue;
  });

  setTotalRequiredAlarmCount(prev => (prev === totalCount ? prev : totalCount));

  setTotalAlarmedSensorIds(prev => {
    if (prev.length !== uniqueAlarmedSensorIds.length ||
        prev.some((val, idx) => val !== uniqueAlarmedSensorIds[idx])) {
      return uniqueAlarmedSensorIds;
    }
    return prev;
  });
}, [updatedAlarmData]);



  return (
      <section className="alarm-dashboard">
        <div className='row mb-3'>
          <div className='col-12 col-sm-6'>
             { totalRequiredAlarmCount >0 && (<div class="alert alert-danger" role="alert">
                <Link to={`/admin/alarm-details/${dataCenterId}/${totalAlarmedSensorIds.join(",")}`}><span className='fw-bold'>{totalRequiredAlarmCount}</span> Immediate attention required
            </Link></div>) }
          </div>
          <div className='col-12 col-sm-6 text-sm-end'>
            <button className='btn btn-secondary me-2' onClick={() => setShowOnlyAlarms(prev => !prev)}>
        {showOnlyAlarms ? 'Show All' : 'Show Only Alarms'}
      </button>
<button
          onClick={() => setIsMuteAlarm(!isMuteAlarm)}
          className='btn btn-danger'
        >
          {isMuteAlarm ? (
            <>
              <VolumeX size={18} className='me-2' />
              Muted
            </>
          ) : (
            <>
              <Volume2 size={18} className='me-2' />
              Unmute
            </>
          )}
        </button>
          </div>
            
        </div>
    <div className="d-flex gap-4 flex-wrap justify-content-center">
        {alarmFiltered?.map((item,index)=>(
           
            <Link key={index} to={`/admin/alarm-details/${dataCenterId}/${item.sensorId.join(",")}`} className={`box ${item.alarm >0 ? 'alarm-highlight' : ''}`}>
                  <h5 className='fw-bold'>{item.alarm || 0}</h5>
                  <h6>{item.sensor_type_name}</h6>
                </Link>
        ))}

        {shouldPlayAlarm && (
                    <ReactAudioPlayer
                            src={sound}
                            autoPlay
                            controls
                            loop
                            muted={isMuteAlarm}
                            style={{ display: "none" }}
                          />
        )}
      </div>
  </section>
  )
}

export default Home
