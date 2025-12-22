// import React from "react";
// import GaugeComponent from "react-gauge-component";
// import { MdLocationOn } from "react-icons/md";

// const Sensor = ({ data,smokeAndwaterData }) => {
  
//   return (
//     <>
//     <div>
//       {data?.sensor_types?.map((sensorType, index) => (
//         <div key={index}>
//           <h5 className="my-3 fw-bold">{sensorType.sensor_type_name}</h5>

//           <div className="d-flex gap-3 flex-wrap mb-3">
//             {sensorType.sensors.map((sensor) => (
              
//               <div className="sensor-box" key={sensor.id}>
                
//                 <GaugeComponent
//                   type="semicircle"
//                   arc={{
//                     width: 0.2,
//                     padding: 0.005,
//                     cornerRadius: 1,
//                     subArcs: sensor.thresholds
//                       ?.sort((a, b) => a.threshold - b.threshold)
//                       .map((th) => ({
//                         limit: th.threshold,
//                         color: th.color,
//                         showTick: true,
//                         tooltip: {
//                           text: th.threshold_name,
//                         },
//                       })),
//                   }}
//                   pointer={{
//                     color: "#345243",
//                     length: 0.8,
//                     width: 15,
//                   }}
//                   labels={{
//                     valueLabel: {
//                       formatTextValue: (value) => value + " ºC",
//                       style: {
//                         fill: "#97C3AC",
//                         fontSize: 40,
//                         fontWeight: "bold",
//                       },
//                     },
//                     tickLabels: {
//                       type: "outer",
//                       defaultTickValueConfig: {
//                         formatTextValue: (value) => value + " ºC",
//                         style: { fontSize: 10 },
//                       },
//                       ticks: sensor.thresholds
//                         ?.sort((a, b) => a.threshold - b.threshold)
//                         .map((th) => ({
//                           value: th.threshold,
//                         })),
//                     },
//                   }}
//                   value={sensor.val || 0}
//                   minValue={0}
//                   maxValue={
//                     sensor.thresholds?.sort((a, b) => b.threshold - a.threshold)[0]
//                       ?.threshold || 100 
//                   }
//                 />
                
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//     <div>
//       {smokeAndwaterData?.sensor_types?.map((sensorType, index) => (
//         <div key={index}>
//           <h5 className="my-3 fw-bold">{sensorType.sensor_type_name}</h5>

//           <div className="d-flex gap-3 flex-wrap mb-3">
//             {sensorType.sensors.map((sensor) => (
              
//               <div className="sensor-box" style={{width:'150px', background: `${sensor.color}`}} key={sensor.id}>
                
//                <h5 className="text-white fw-bold">{sensor.state_name}</h5>
//                <h6 className="text-white"><MdLocationOn className="fs-4 fw-bold me-1"/>{sensor.location}</h6>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//     </>
//   );
// };

// export default Sensor;





import React, { useState, useEffect, useRef } from "react";
import GaugeComponent from "react-gauge-component";
import { MdLocationOn } from "react-icons/md";

const Sensor = ({ data, smokeAndwaterData }) => {
  // Persist data in refs so it never disappears
  const dataRef = useRef(null);
  const smokeWaterRef = useRef(null);
  
  // State to trigger re-renders
  const [displayData, setDisplayData] = useState(null);
  const [displaySmokeWaterData, setDisplaySmokeWaterData] = useState(null);

  // Update refs and state when new data arrives
  useEffect(() => {
    if (data && data.sensor_types?.length > 0) {
      dataRef.current = data;
      setDisplayData(data);
      console.log("✓ Sensor data received:", data);
      console.log("✓ Sensor types:", data.sensor_types);
      console.log("✓ First sensor type:", data.sensor_types[0]);
      if (data.sensor_types[0]) {
        console.log("✓ Sensors in first type:", data.sensor_types[0].sensors);
      }
    } else if (dataRef.current) {
      // If no new data, show last stored data
      setDisplayData(dataRef.current);
    }
  }, [data]);

  useEffect(() => {
    if (smokeAndwaterData && smokeAndwaterData.sensor_types?.length > 0) {
      smokeWaterRef.current = smokeAndwaterData;
      setDisplaySmokeWaterData(smokeAndwaterData);
      console.log("✓ Smoke/Water data received:", smokeAndwaterData);
    } else if (smokeWaterRef.current) {
      // If no new data, show last stored data
      setDisplaySmokeWaterData(smokeWaterRef.current);
    }
  }, [smokeAndwaterData]);

  return (
    <>
      {/* SENSOR DATA - Temperature, Humidity, etc */}
      <div>
        {displayData?.sensor_types?.map((sensorType, index) => (
          <div key={index}>
            <h5 className="my-3 fw-bold">{sensorType.sensor_type_name}</h5>
            <div className="d-flex gap-3 flex-wrap mb-3">
              {sensorType.sensors?.map((sensor) => (
                <div className="sensor-box" key={sensor.id}>
                  <GaugeComponent
                    type="semicircle"
                    arc={{
                      width: 0.2,
                      padding: 0.005,
                      cornerRadius: 1,
                      subArcs: sensor.thresholds
                        ?.sort((a, b) => a.threshold - b.threshold)
                        .map((th) => ({
                          limit: th.threshold,
                          color: th.color,
                          showTick: true,
                          tooltip: {
                            text: th.threshold_name,
                          },
                        })),
                    }}
                    pointer={{
                      color: "#345243",
                      length: 0.8,
                      width: 15,
                    }}
                    labels={{
                      valueLabel: {
                        formatTextValue: (value) => value + " ºC",
                        style: {
                          fill: "#97C3AC",
                          fontSize: 40,
                          fontWeight: "bold",
                        },
                      },
                      tickLabels: {
                        type: "outer",
                        defaultTickValueConfig: {
                          formatTextValue: (value) => value + " ºC",
                          style: { fontSize: 10 },
                        },
                        ticks: sensor.thresholds
                          ?.sort((a, b) => a.threshold - b.threshold)
                          .map((th) => ({
                            value: th.threshold,
                          })),
                      },
                    }}
                    value={sensor.val || 0}
                    minValue={0}
                    maxValue={
                      sensor.thresholds?.sort(
                        (a, b) => b.threshold - a.threshold
                      )[0]?.threshold || 100
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SMOKE AND WATER DATA - Status indicators */}
      <div>
        {displaySmokeWaterData?.sensor_types?.map((sensorType, index) => (
          <div key={index}>
            <h5 className="my-3 fw-bold">{sensorType.sensor_type_name}</h5>
            <div className="d-flex gap-3 flex-wrap mb-3">
              {sensorType.sensors?.map((sensor) => (
                <div
                  className="sensor-box"
                  style={{ width: "150px", background: `${sensor.color}` }}
                  key={sensor.id}
                >
                  <h5 className="text-white fw-bold">{sensor.state_name}</h5>
                  <h6 className="text-white">
                    <MdLocationOn className="fs-4 fw-bold me-1" />
                    {sensor.location}
                  </h6>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Sensor;