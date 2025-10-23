import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DynamicSelectField from "../components/DynamicSelectField";
import { errorMessage } from "./../api/api-config/apiResponseMessage";

import {
  fetchDiagramSVG,
  getUserDataCenters,
} from "../api/settings/dataCenterApi";
import { userContext } from "../context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { SLD } from "./../components/tabs/SLD.component";
import Sensor from "./../components/tabs/Sensor.component";
import DieselGenerator from "./../components/tabs/DieselGenerator.component";
import FuelTank from "./../components/tabs/FuelTank.component";
import PAC from "./../components/tabs/PAC.component";
import UPS from "./../components/tabs/UPS.component";
import Rectifire from "./../components/tabs/Rectifire.component";
import Bettery from "./../components/tabs/Bettery.component";
import { ablyAPI } from "../api/ablyAPI";
import {
  fetchSensorThreshold,
  fetchSensorType,
  fetchStateConfig,
} from "../api/dashboardTabApi";
import { setAlarmedSensors } from "../redux/features/dashboard/alarmedSensorDataSlice";
import { Control } from "../components/tabs/Control.component";

const Dashboard = () => {
  const incommingMQTTData = useSelector((state) => state.mqtt.data);
  const { user } = useContext(userContext);
  const dispatch = useDispatch();
  const tabList = useSelector((state) => state.tablist.tabs);
  const dataCenterId = useSelector(
    (state) => state.updatedDataCenter.dataCenter
  );
  const [activeTab, setActiveTab] = useState(null);

  const [liveSensorData, setLiveSensorData] = useState(null);
  const [liveSomkeAndWaterSensorData, setLiveSomkeAndWaterSensorData] =
    useState(null);
  const [liveSLDSensorData, setLiveSLDSensorData] = useState(null);
  const [liveControlSensorData, setLiveControlSensorData] = useState(null);

  const [sensorType, setSensorType] = useState([]);
  const [threshold, setThreshold] = useState([]);
  const [stateConfig, setStateConfig] = useState([]);
  const [diagramContent, setDiagramContent] = useState([]);

  // sesor Type
  const [allowedSensorIds, setAllowedSensorIds] = useState(new Set([1, 2]));
  const [allowedSmokeAndWaterSensorIds, setAllowedSmokeAndWaterSensorIds] =
    useState(new Set([4, 5]));
  const [allowedSLDIds, setAllowedSLDIds] = useState(new Set([3]));
  const [allowedControlIds, setAllowedControlIds] = useState(new Set([6]));
  const [allowedDieselGenaratorIds, setAllowedDieselGenaratorIds] = useState(
    new Set([1, 2])
  );

  useEffect(() => {
    setActiveTab(null);
    if (tabList && tabList.length > 0) {
      setActiveTab(tabList[0].id);
    }
  }, [tabList]);

  useEffect(() => {
    if (dataCenterId != null) {
      Promise.all([
        fetchSensorThreshold(dataCenterId),
        fetchSensorType(dataCenterId),
        fetchStateConfig(dataCenterId),
        fetchDiagramSVG(dataCenterId),
      ])
        .then(([thresholdRes, sensorTypeRes, stateRes, diagramSvg]) => {
          setThreshold(thresholdRes);
          setSensorType(sensorTypeRes);
          setStateConfig(stateRes);
          setDiagramContent(diagramSvg.data);
        })
        .catch(errorMessage);
    }
  }, [dataCenterId]);

  // useEffect(() => {
  //     ablyAPI.connection.once("connected", () => {
  //       console.log("Connected to Ably!");
  //       console.log("Client ID:", ablyAPI.auth.clientId);
  //     });
  //     const channel = ablyAPI.channels.get("public:sensor-channel");
  //     channel.subscribe("event_name", (message) => {
  //       const incomingData = message.data?.comment;
  //       setIncommingMQTTData(prev => [...prev, incomingData]);

  //     });
  //     return () => {
  //       channel.unsubscribe();
  //     };
  //   }, []);

  useEffect(() => {
    if (incommingMQTTData?.length > 0 && dataCenterId && threshold.length) {
      const filteredDataCenter = incommingMQTTData.filter(
        (item) => item.dc_id === dataCenterId
      );
      if (filteredDataCenter.length === 0) {
        console.warn(
          `⚠️ No matching MQTT data found for dataCenterId: ${dataCenterId}`
        );
        setLiveSensorData([]);
        return;
      }
      const latest = filteredDataCenter[filteredDataCenter.length - 1];
      if (latest.dc_id === dataCenterId) {
        const matchedSensorType = {
          ...latest,
          sensor_types: (latest.sensor_types || []).filter((item) =>
            allowedSensorIds?.has(item.id)
          ),
        };

        const enriched = {
          ...matchedSensorType,
          sensor_types: matchedSensorType.sensor_types.map((sensorType) => {
            const typeThreshold = threshold.find(
              (th) =>
                th.sensor_type === sensorType.id &&
                th.dc_id === matchedSensorType.dc_id
            );

            const sensor_type_name = typeThreshold?.sensor_type_name || null;

            return {
              ...sensorType,
              sensor_type_name,

              sensors: sensorType.sensors
                .filter((sensor) =>
                  threshold.some(
                    (th) =>
                      th.sensor_id === sensor.id &&
                      th.dc_id === matchedSensorType.dc_id &&
                      th.sensor_type === sensorType.id
                  )
                )
                .map((sensor) => {
                  const matchedThresholds = threshold
                    .filter(
                      (th) =>
                        th.sensor_id === sensor.id &&
                        th.dc_id === matchedSensorType.dc_id &&
                        th.sensor_type === sensorType.id
                    )
                    .map((th) => ({
                      threshold: th.threshold,
                      threshold_name: th.threshold_name,
                      color: th.color,
                    }));
                  return {
                    ...sensor,
                    thresholds: matchedThresholds ?? [],
                  };
                }),
            };
          }),
        };

        setLiveSensorData(enriched);
      }
    }
  }, [incommingMQTTData, dataCenterId, threshold]);

  // useEffect(() => {
  //   if (incommingMQTTData?.length > 0 && dataCenterId && stateConfig.length) {
  //     const filteredDataCenter = incommingMQTTData.filter(item => item.dc_id === dataCenterId);
  //     if (filteredDataCenter.length === 0) {
  //     console.warn(`⚠️ No matching MQTT data found for dataCenterId: ${dataCenterId}`);
  //     setLiveSomkeAndWaterSensorData([]);
  //     return;
  //   }
  //     const latest = filteredDataCenter[filteredDataCenter.length - 1];

  //     if (latest.dc_id === dataCenterId) {
  //       const matchedSensorType = {
  //         ...latest,
  //         sensor_types: (latest.sensor_types || []).filter(item =>
  //           allowedSmokeAndWaterSensorIds?.has(item.id)
  //         ),
  //       };

  //       const enriched = {
  //         ...matchedSensorType,
  //         sensor_types: matchedSensorType.sensor_types.map(sensorType => {
  //           const stateMatch = stateConfig?.find(
  //             state =>
  //               state.type_id === sensorType.id &&
  //               sensorType.sensors.some(sensor => sensor.id === state.sensor_id)
  //           );

  //           const sensor_type_name = stateMatch?.type_name || null;

  //           return {
  //             ...sensorType,
  //             sensor_type_name,

  //             sensors: sensorType.sensors
  //               .filter(sensor =>
  //                 stateConfig.some(state =>
  //                   state.sensor_id === sensor.id &&
  //                   state.type_id === sensorType.id &&
  //                   state.state_value === sensor.val
  //                 )
  //               )
  //               .map(sensor => {
  //                 const matchedStates = stateConfig
  //                   ?.filter(state =>
  //                     state.sensor_id === sensor.id &&
  //                     state.type_id === sensorType.id &&
  //                     state.state_value === sensor.val
  //                   )
  //                   .map(state => ({
  //                     state_value: state.state_value,
  //                     state_name: state.state_name,
  //                     color: state.color,
  //                     location: state.location,
  //                   }));
  //                 return {
  //                   ...sensor,
  //                   // states: matchedStates ?? [],
  //                   ...(matchedStates && {
  //                     state_name: matchedStates[0]?.state_name,
  //                     color: matchedStates[0]?.color,
  //                     location: matchedStates[0]?.location,
  //                   }),
  //                 };
  //               }),
  //           };
  //         }),
  //       };

  //       setLiveSomkeAndWaterSensorData(enriched);
  //     }
  //   }
  // }, [incommingMQTTData, dataCenterId, stateConfig]);

  useEffect(() => {
    if (!incommingMQTTData?.length || !dataCenterId || !stateConfig.length)
      return;

    const filteredDataCenter = incommingMQTTData.filter(
      (item) => item.dc_id === dataCenterId
    );

    if (!filteredDataCenter.length) {
      console.warn(
        `⚠️ No matching MQTT data found for dataCenterId: ${dataCenterId}`
      );
      return; // Don't reset state — just skip update
    }

    const latest = filteredDataCenter[filteredDataCenter.length - 1];

    if (!latest || !latest.sensor_types?.length) return;

    const filteredSensorTypes = latest.sensor_types.filter((sensorType) =>
      allowedSmokeAndWaterSensorIds.has(sensorType.id)
    );

    if (!filteredSensorTypes.length) return; // No relevant sensor types

    const enrichedSensorTypes = filteredSensorTypes.map((sensorType) => {
      const sensor_type_name =
        stateConfig.find((state) => state.type_id === sensorType.id)
          ?.type_name || null;

      const filteredSensors = sensorType.sensors
        .filter((sensor) =>
          stateConfig.some(
            (state) =>
              state.sensor_id === sensor.id &&
              state.type_id === sensorType.id &&
              state.state_value === sensor.val
          )
        )
        .map((sensor) => {
          const matchedStates = stateConfig.filter(
            (state) =>
              state.sensor_id === sensor.id &&
              state.type_id === sensorType.id &&
              state.state_value === sensor.val
          );

          return {
            ...sensor,
            ...(matchedStates[0] && {
              state_name: matchedStates[0].state_name,
              color: matchedStates[0].color,
              location: matchedStates[0].location,
            }),
          };
        });

      return {
        ...sensorType,
        sensor_type_name,
        sensors: filteredSensors,
      };
    });
    const hasValidSensors = enrichedSensorTypes.some(
      (st) => st.sensors?.length
    );
    if (!hasValidSensors) return;

    const enriched = {
      ...latest,
      sensor_types: enrichedSensorTypes,
    };

    setLiveSomkeAndWaterSensorData(enriched);
  }, [incommingMQTTData, dataCenterId, stateConfig]);

  // SLD
  // useEffect(() => {
  //   if (incommingMQTTData?.length > 0 && dataCenterId && stateConfig.length) {
  //     const filteredDataCenter = incommingMQTTData.filter(item => item.dc_id === dataCenterId);
  //     if (filteredDataCenter.length === 0) {
  //     console.warn(`⚠️ No matching MQTT data found for dataCenterId: ${dataCenterId}`);
  //     setLiveSLDSensorData([]);
  //     return;
  //   }
  //     const latest = filteredDataCenter[filteredDataCenter.length - 1];

  //     if (latest.dc_id === dataCenterId) {
  //       const matchedSensorType = {
  //         ...latest,
  //         sensor_types: (latest.sensor_types || []).filter(item =>
  //           allowedSLDIds?.has(item.id)
  //         ),
  //       };

  //       const enriched = {
  //         ...matchedSensorType,
  //         sensor_types: matchedSensorType.sensor_types.map(sensorType => {
  //           const stateMatch = stateConfig?.find(
  //             state =>state.type_id === sensorType.id );

  //           const sensor_type_name = stateMatch?.type_name || null;

  //           return {
  //             ...sensorType,
  //             sensor_type_name,

  //             sensors: sensorType.sensors
  //               .filter(sensor =>
  //                 stateConfig.some(state =>
  //                   state.type_id === sensorType.id &&
  //                   state.state_value === sensor.val
  //                 )
  //               )
  //               .map(sensor => {
  //                 const matchedStates = stateConfig
  //                   ?.filter(state =>
  //                     state.type_id === sensorType.id &&
  //                     state.state_value === sensor.val
  //                   )
  //                   .map(state => ({
  //                     state_value: state.state_value,
  //                     state_name: state.state_name,
  //                     color: state.color,
  //                     location: state.location,
  //                   }));
  //                 return {
  //                   ...sensor,
  //                   ...(matchedStates && {
  //                     state_name: matchedStates[0]?.state_name,
  //                     color: matchedStates[0]?.color,
  //                     location: matchedStates[0]?.location,
  //                   }),
  //                 };
  //               }),
  //           };
  //         }),
  //       };

  //       setLiveSLDSensorData(enriched);
  //     }
  //   }
  // }, [incommingMQTTData, dataCenterId, stateConfig]);

  // combine two device

  useEffect(() => {
    if (incommingMQTTData?.length > 0 && dataCenterId && stateConfig.length) {
      const filteredDataCenter = incommingMQTTData.filter(
        (item) => item.dc_id === dataCenterId
      );

      if (filteredDataCenter.length === 0) {
        console.warn(
          `⚠️ No matching MQTT data found for dataCenterId: ${dataCenterId}`
        );
        setLiveSLDSensorData([]);
        return;
      }

      const sensorTypeMap = new Map();

      filteredDataCenter.forEach((device) => {
        device.sensor_types?.forEach((sensorType) => {
          if (!allowedSLDIds?.has(sensorType.id)) return;

          if (!sensorTypeMap.has(sensorType.id)) {
            sensorTypeMap.set(sensorType.id, []);
          }

          const existingSensors = sensorTypeMap.get(sensorType.id);

          sensorType.sensors?.forEach((sensor) => {
            const existsInStateConfig = stateConfig.some(
              (state) =>
                state.type_id === sensorType.id &&
                state.state_value === sensor.val
            );

            if (existsInStateConfig) {
              const index = existingSensors.findIndex(
                (s) => s.id === sensor.id
              );
              if (index !== -1) {
                existingSensors[index] = sensor; // Replace if exists
              } else {
                existingSensors.push(sensor); // Add new
              }
            }
          });
        });
      });

      const enrichedSensorTypes = [...sensorTypeMap.entries()].map(
        ([typeId, sensors]) => {
          const sensor_type_name =
            stateConfig.find((state) => state.type_id === typeId)?.type_name ||
            null;

          const enrichedSensors = sensors.map((sensor) => {
            const matched = stateConfig.find(
              (state) =>
                state.type_id === typeId && state.state_value === sensor.val
            );

            return {
              ...sensor,
              state_name: matched?.state_name || null,
              color: matched?.color || null,
              location: matched?.location || null,
            };
          });

          return {
            id: typeId,
            sensor_type_name,
            sensors: enrichedSensors,
          };
        }
      );

      setLiveSLDSensorData({
        dc_id: dataCenterId,
        sensor_types: enrichedSensorTypes,
      });
    }
  }, [incommingMQTTData, dataCenterId, stateConfig]);

  // Contrls
  useEffect(() => {
    if (incommingMQTTData?.length > 0 && dataCenterId && stateConfig.length) {
      const filteredDataCenter = incommingMQTTData.filter(
        (item) => item.dc_id === dataCenterId
      );

      if (filteredDataCenter.length === 0) {
        console.warn(
          `⚠️ No matching MQTT data found for dataCenterId: ${dataCenterId}`
        );
        setLiveControlSensorData([]);
        return;
      }

      // ✅ Step 1: Build Map of sensorTypeId -> sensors[]
      const sensorTypeMap = new Map();

      filteredDataCenter.forEach((device) => {
        device.sensor_types?.forEach((sensorType) => {
          if (!allowedControlIds?.has(sensorType.id)) return;

          if (!sensorTypeMap.has(sensorType.id)) {
            sensorTypeMap.set(sensorType.id, []);
          }

          const existing = sensorTypeMap.get(sensorType.id);

          sensorType.sensors?.forEach((sensor) => {
            // ✅ Only include sensor if it matches stateConfig
            const existsInStateConfig = stateConfig.some(
              (state) =>
                state.type_id === sensorType.id &&
                state.sensor_id === sensor.id &&
                state.state_value === sensor.val
            );

            if (existsInStateConfig) {
              const index = existing.findIndex((s) => s.id === sensor.id);
              if (index !== -1) {
                existing[index] = sensor; // Replace
              } else {
                existing.push(sensor);
              }
            }
          });
        });
      });

      // ✅ Step 2: Enrich valid sensors
      const enrichedSensorTypes = [...sensorTypeMap.entries()].map(
        ([typeId, sensors]) => {
          const sensor_type_name =
            stateConfig.find((s) => s.type_id === typeId)?.type_name || null;

          const enrichedSensors = sensors.map((sensor) => {
            const matchedState = stateConfig.find(
              (state) =>
                state.type_id === typeId &&
                state.sensor_id === sensor.id &&
                state.state_value === sensor.val
            );

            return {
              ...sensor,
              state_name: matchedState?.state_name || null,
              color: matchedState?.color || null,
              location: matchedState?.location || null,
              mode_type: matchedState?.mode_type || null,
              paired_status: matchedState?.paired_status || null,
              paired_sensors: matchedState?.paired_sensors || null,
              on_time: matchedState?.on_time || null,
              off_time: matchedState?.off_time || null,
              duration: matchedState?.duration || null,
              sensor_name: matchedState?.sensor_name || null,
              runningDuration: matchedState?.runningDuration || null,
              restDuration: matchedState?.restDuration || null,
              days: matchedState?.day_names || null,
            };
          });

          return {
            id: typeId,
            sensor_type_name,
            sensors: enrichedSensors,
          };
        }
      );

      setLiveControlSensorData({
        dc_id: dataCenterId,
        sensor_types: enrichedSensorTypes,
      });
    }
  }, [incommingMQTTData, dataCenterId, stateConfig]);

  const tabContentMap = {
    1: (
      <SLD data={diagramContent} live={liveSLDSensorData?.sensor_types?.[0]} />
    ),
    2: (
      <Sensor
        data={liveSensorData}
        smokeAndwaterData={liveSomkeAndWaterSensorData}
      />
    ),
    3: <DieselGenerator />,
    4: <FuelTank />,
    5: <PAC />,
    6: <UPS />,
    7: <Rectifire />,
    8: <Bettery />,
    9: <Control live={liveControlSensorData?.sensor_types?.[0]} />,
  };
  // console.log(threshold);
  // console.log(incommingMQTTData);
  // console.log(stateConfig);
  // console.log(liveSomkeAndWaterSensorData);
  // console.log(diagramContent);
  // console.log(updatedDataCenter);
  // console.log(liveSensorData);
  // console.log(dataCenterId);
  // console.log(liveSLDSensorData);
  // console.log(alarmSensors);
  // console.log(liveControlSensorData?.sensor_types?.[0]);
  // console.log(liveControlSensorData);

  return (
    <section>
      <div className="card">
        <div className="card-header flex-column justify-content-between align-items-center">
          <div className="d-flex  justify-content-between align-items-center"></div>
          <ul className="nav nav-tabs card-header-tabs">
            {tabList?.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link text-secondary rounded-bottom-0 fw-bold ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body" key={activeTab}>
          {tabContentMap[activeTab] || (
            <p>No content available for this tab.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
