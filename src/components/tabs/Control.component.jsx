import React, { useState, useEffect } from "react";
import { sensorControl } from "../../api/controlApi";
import {
  errorMessage,
  successMessage,
} from "../../api/api-config/apiResponseMessage";
import { useSelector } from "react-redux";

export const Control = ({ live }) => {
  const dataCenterId = useSelector(
    (state) => state.updatedDataCenter.dataCenter
  );
  const [checkedState, setCheckedState] = useState({});

  useEffect(() => {
    if (live?.sensors) {
      const initialState = {};
      live.sensors.forEach((sensor) => {
        initialState[sensor.id] = sensor.val !== 0;
      });
      setCheckedState(initialState);
    }
  }, [live]);

  const handleControl = (sensor) => {
    const sensorId = sensor.id;
    setCheckedState((prevState) => ({
      ...prevState,
      [sensorId]: !prevState[sensorId],
    }));

    sensorControl({
      dataCenterId: dataCenterId,
      sensor_id: sensorId,
      sensor_val: sensor.val,
    })
      .then((res) => {
        successMessage(res);
      })
      .catch(errorMessage);
  };

  // Group sensors by paired_sensors
  const groupSensors = () => {
    const groups = [];
    const ungrouped = [];

    const seen = new Set();

    live?.sensors.forEach((sensor) => {
      if (seen.has(sensor.id)) return;

      if (sensor.paired_status === 1 && sensor.paired_sensors) {
        const pairIds = JSON.parse(sensor.paired_sensors);
        const group = live.sensors.filter((s) => pairIds.includes(s.id));
        group.forEach((s) => seen.add(s.id));
        groups.push(group);
      } else {
        ungrouped.push(sensor);
        seen.add(sensor.id);
      }
    });

    return { groups, ungrouped };
  };

  const { groups, ungrouped } = groupSensors();
  // console.log(live);
  return (
    <div className="do-control">
      <div className="d-flex gap-3 flex-wrap mb-3">
        {groups.map((group, index) => (
          <div
            key={`group-${index}`}
            className="position-relative p-3 border border-success  d-flex gap-3 flex-wrap"
            style={{ borderWidth: "10px" }}
          >
            <div className="ribbon">
              <span>Paired</span>
            </div>

            {group.map((sensor) => (
              <div className="sensor-box" key={sensor.id}>
                <h5 className="fw-bold">{sensor.sensor_name}</h5>
                <div className="form-check form-switch custom-toggle-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id={`switch-${sensor.id}`}
                    checked={checkedState[sensor.id] || false}
                    onChange={() => handleControl(sensor)}
                    disabled={sensor.mode_type !== "Manual" ? true : false}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`switch-${sensor.id}`}
                  >
                    <span className="toggle-text on">ON</span>
                    <span className="toggle-text off">OFF</span>
                  </label>
                </div>
                <span className="badge text-bg-secondary mb-2">
                  {sensor.mode_type}
                </span>
                <h6 className="">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  {sensor.location}
                </h6>
                <div className="d-flex gap-2 justify-content-center">
                  {sensor.days?.split(",").map((item, index) => (
                    <span key={index} class="badge text-bg-secondary">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="d-flex justify-content-between my-2">
                  <span class="badge text-bg-secondary">
                    On: {sensor.on_time}
                  </span>
                  <span class="badge text-bg-secondary">
                    Off: {sensor.off_time}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span class="badge text-bg-secondary">
                    Running {sensor.runningDuration} Min
                  </span>
                  <span class="badge text-bg-secondary">
                    Rest {sensor.restDuration} Min
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
        {ungrouped.map((sensor) => (
          <div className="sensor-box" key={sensor.id}>
            <h5 className="fw-bold">{sensor.sensor_name}</h5>
            <div className="form-check form-switch custom-toggle-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id={`switch-${sensor.id}`}
                checked={checkedState[sensor.id] || false}
                onChange={() => handleControl(sensor)}
                disabled={sensor.mode_type !== "Manual" ? true : false}
              />
              <label
                className="form-check-label"
                htmlFor={`switch-${sensor.id}`}
              >
                <span className="toggle-text on">ON</span>
                <span className="toggle-text off">OFF</span>
              </label>
            </div>
            <span className="badge text-bg-secondary">{sensor.mode_type}</span>
            <h6 className="">{sensor.location}</h6>
            <div className="d-flex gap-2 justify-content-center">
              {sensor.days?.split(",").map((item, index) => (
                <span key={index} className="badge text-bg-secondary">
                  {item}
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-between my-2">
              <span className="badge text-bg-secondary">
                On: {sensor.on_time}
              </span>
              <span className="badge text-bg-secondary">
                Off: {sensor.off_time}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="badge text-bg-secondary">
                Running {sensor.runningDuration} Min
              </span>
              <span className="badge text-bg-secondary">
                Rest {sensor.restDuration} Min
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
