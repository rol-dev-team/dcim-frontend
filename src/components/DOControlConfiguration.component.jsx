import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchControllableSensors,
  fetchOperationMode,
} from "../api/modeOperation";
import {
  errorMessage,
  successMessage,
} from "../api/api-config/apiResponseMessage";
import { useSelector } from "react-redux";
import {
  getDaysOfWeek,
  getScheduleFrequency,
  storeDOSensorConfiguration,
} from "../api/controlApi";

export const DOControlConfigurationComponent = () => {
  const dataCenterId = useSelector(
    (state) => state.updatedDataCenter.dataCenter
  );

  const [operationModes, setOperationModes] = useState([]);
  const [scheduleFrequency, setScheduleFrequency] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [controllableSensors, setControllableSensors] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);

  // Load frequency, mode, days
  useEffect(() => {
    Promise.all([getScheduleFrequency(), fetchOperationMode(), getDaysOfWeek()])
      .then(([frequencies, modes, days]) => {
        setOperationModes(modes);
        setScheduleFrequency(frequencies);
        setDaysOfWeek(days);
      })
      .catch(errorMessage);
  }, []);
  // Load sensors
  useEffect(() => {
    if (dataCenterId) {
      fetchControllableSensors({ dataCenterId })
        .then(setControllableSensors)
        .catch(errorMessage);
    }
  }, [dataCenterId]);

  // Formik config
  const validationSchema = Yup.object({
    mode: Yup.string().required("Mode is required"),

    sensors: Yup.array()
      .of(Yup.number())
      .when("mode", {
        is: (mode) => ["1", "2", "3"].includes(mode),
        then: (schema) =>
          schema
            .required("At least one sensor must be selected")
            .test("sensor-limit", function (value) {
              const { mode } = this.parent;
              if (!value) return false;
              if (mode === "1") return value.length <= 1;
              return value.length <= 2;
            }),
      }),

    startWith: Yup.string().when(["mode", "sensors"], {
      is: (mode, sensors) => mode === "2" && sensors?.length === 2,
      then: (schema) => schema.required("Please select a start sensor"),
      otherwise: (schema) => schema.notRequired(),
    }),

    runningDuration: Yup.number().when("mode", {
      is: "2",
      then: (schema) =>
        schema
          .required("Running duration is required")
          .positive("Must be positive")
          .integer("Must be whole number"),
      otherwise: (schema) => schema.notRequired(),
    }),

    restDuration: Yup.number().when("mode", {
      is: "2",
      then: (schema) =>
        schema
          .required("Rest duration is required")
          .positive("Must be positive")
          .integer("Must be whole number"),
      otherwise: (schema) => schema.notRequired(),
    }),

    startTime: Yup.string().when("mode", {
      is: (mode) => mode === "2" || mode === "3",
      then: (schema) => schema.notRequired(), // optional by default
      otherwise: (schema) => schema.notRequired(),
    }),

    endTime: Yup.string().when(["mode", "startTime"], {
      is: (mode, startTime) => mode === "2" && startTime,
      then: (schema) => schema.required("End time is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    scheduleFrequency: Yup.string().when(["mode", "startTime"], {
      is: (mode, startTime) => mode === "2" && startTime,
      then: (schema) => schema.required("Schedule frequency is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    days: Yup.array().when(["mode", "startTime", "scheduleFrequency"], {
      is: (mode, startTime, freq) => mode === "2" && startTime && freq === "3",
      then: (schema) =>
        schema.min(1, "At least one day must be selected for weekly schedule"),
      otherwise: (schema) => schema.notRequired(),
    }),
    fromDate: Yup.string().when("scheduleFrequency", {
      is: "1",
      then: (schema) => schema.required("From date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    toDate: Yup.string().when("scheduleFrequency", {
      is: "1",
      then: (schema) => schema.required("To date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      mode: "",
      runningDuration: "",
      restDuration: "",
      sensors: [],
      startTime: "",
      endTime: "",
      scheduleFrequency: "",
      fromDate: "",
      toDate: "",
      days: [],
      startWith: "",
    },
    validationSchema: validationSchema,

    onSubmit: (values, { resetForm }) => {
      storeDOSensorConfiguration(values)
        .then((res) => {
          successMessage(res);
          resetForm();
          if (dataCenterId) {
            fetchControllableSensors({ dataCenterId })
              .then(setControllableSensors)
              .catch(errorMessage);
          }
        })
        .catch(errorMessage);
    },
  });

  return (
    <div className="card">
      <div className="card-header text-center bg-light mb-4 py-2 fw-bold">
        Configuration
      </div>

      <div className="card-body">
        <div className="container-fluid">
          <form className="row" onSubmit={formik.handleSubmit}>
            <div className="col-12 col-sm-8">
              {/* Operation Mode */}
              <div className="mb-3">
                <label>Mode</label>
                <select
                  className={`form-select ${
                    formik.touched.mode && formik.errors.mode
                      ? "is-invalid"
                      : ""
                  }`}
                  name="mode"
                  value={formik.values.mode}
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    const newMode = e.target.value;
                    formik.setFieldValue("mode", newMode);
                    formik.setFieldValue("sensors", []);
                    formik.setFieldValue("scheduleFrequency", "");
                    formik.setFieldValue("startWith", "");
                    setSelectedMode(newMode);
                  }}
                >
                  <option value="">Select Mode</option>
                  {operationModes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.name}
                    </option>
                  ))}
                </select>
                {formik.touched.mode && formik.errors.mode && (
                  <div className="invalid-feedback">{formik.errors.mode}</div>
                )}
              </div>
              {/* Sensor Selection */}
              <div className="d-flex gap-4 mb-3">
                <div className="">
                  {/* <label>Select Sensors</label>
                  <div className="d-flex gap-3 flex-wrap">
                    {controllableSensors
                      ?.filter((sensor) => sensor.device_id === 1)
                      .map((sensor) => (
                        <div key={sensor.id} className="form-check">
                          <input
                            type="checkbox"
                            className={`form-check-input`}
                            id={`sensor_${sensor.id}`}
                            checked={formik.values.sensors.includes(sensor.id)}
                            disabled={
                              !formik.values.sensors.includes(sensor.id) &&
                              ((formik.values.mode === "1" &&
                                formik.values.sensors.length >= 1) ||
                                (formik.values.mode !== "1" &&
                                  formik.values.sensors.length >= 2))
                            }
                            onChange={(e) => {
                              const selected = formik.values.sensors;
                              const updated = e.target.checked
                                ? [...selected, sensor.id]
                                : selected.filter((id) => id !== sensor.id);
                              formik.setFieldValue("sensors", updated);
                              formik.setFieldTouched("sensors", true);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`sensor_${sensor.id}`}
                          >
                            {sensor.location}
                          </label>
                        </div>
                      ))}
                  </div> */}
                  {Object.entries(
                    controllableSensors?.reduce((acc, sensor) => {
                      if (!acc[sensor.device_id]) {
                        acc[sensor.device_id] = [];
                      }
                      acc[sensor.device_id].push(sensor);
                      return acc;
                    }, {})
                  ).map(([deviceId, sensors]) => (
                    <div key={deviceId} className="mb-3">
                      <label className="fw-bold">
                        Device {deviceId} Sensors
                      </label>
                      <div className="d-flex gap-3 flex-wrap mt-2">
                        {sensors.map((sensor) => (
                          <div key={sensor.id} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`sensor_${sensor.id}`}
                              checked={formik.values.sensors.includes(
                                sensor.id
                              )}
                              disabled={
                                !formik.values.sensors.includes(sensor.id) &&
                                ((formik.values.mode === "1" &&
                                  formik.values.sensors.length >= 1) ||
                                  (formik.values.mode !== "1" &&
                                    formik.values.sensors.length >= 2))
                              }
                              onChange={(e) => {
                                const selected = formik.values.sensors;
                                const updated = e.target.checked
                                  ? [...selected, sensor.id]
                                  : selected.filter((id) => id !== sensor.id);
                                formik.setFieldValue("sensors", updated);
                                formik.setFieldTouched("sensors", true);
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`sensor_${sensor.id}`}
                            >
                              {sensor.location}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {formik.values.mode === "2" &&
                  formik.values.sensors.length === 2 && (
                    <div className="border border-success rounded px-3">
                      <label>Start with?</label>
                      <div className="d-flex gap-3 flex-wrap">
                        {formik.values.sensors.map((sensorId) => {
                          const sensor = controllableSensors.find(
                            (s) => s.id === sensorId
                          );
                          if (!sensor) return null;
                          return (
                            <div key={sensor.id} className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="startWith"
                                id={`startWith_${sensor.id}`}
                                value={sensor.id}
                                checked={
                                  formik.values.startWith ===
                                  sensor.id.toString()
                                }
                                onChange={() => {
                                  formik.setFieldValue(
                                    "startWith",
                                    sensor.id.toString()
                                  );
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`startWith_${sensor.id}`}
                              >
                                {sensor.location}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>

              {/* Durations */}
              {formik.values.mode === "2" && (
                <div className="d-flex gap-3 mb-3">
                  <div>
                    <label>Running Duration (mins)</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formik.touched.runningDuration &&
                        formik.errors.runningDuration
                          ? "is-invalid"
                          : ""
                      }`}
                      name="runningDuration"
                      value={formik.values.runningDuration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.runningDuration &&
                      formik.errors.runningDuration && (
                        <div className="invalid-feedback">
                          {formik.errors.runningDuration}
                        </div>
                      )}
                  </div>
                  <div>
                    <label>Rest Duration (mins)</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formik.touched.restDuration &&
                        formik.errors.restDuration
                          ? "is-invalid"
                          : ""
                      }`}
                      name="restDuration"
                      value={formik.values.restDuration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.restDuration &&
                      formik.errors.restDuration && (
                        <div className="invalid-feedback">
                          {formik.errors.restDuration}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Time Inputs */}
              {(formik.values.mode === "2" || formik.values.mode === "3") && (
                <div className="d-flex gap-3 mb-3">
                  <div>
                    <label>Start Time</label>
                    <input
                      type="time"
                      className={`form-control ${
                        formik.touched.startTime && formik.errors.startTime
                          ? "is-invalid"
                          : ""
                      }`}
                      name="startTime"
                      value={formik.values.startTime}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.startTime && formik.errors.startTime && (
                      <div className="invalid-feedback">
                        {formik.errors.startTime}
                      </div>
                    )}
                  </div>
                  <div>
                    <label>End Time</label>
                    <input
                      type="time"
                      className={`form-control ${
                        formik.touched.endTime && formik.errors.endTime
                          ? "is-invalid"
                          : ""
                      }`}
                      name="endTime"
                      value={formik.values.endTime}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.endTime && formik.errors.endTime && (
                      <div className="invalid-feedback">
                        {formik.errors.endTime}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Frequency */}
              {(formik.values.mode === "2" || formik.values.mode === "3") && (
                <div className="mb-3">
                  <label>Schedule Frequency</label>
                  <div className="d-flex gap-3 flex-wrap">
                    {scheduleFrequency.map((freq) => (
                      <div className="form-check" key={freq.id}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="scheduleFrequency"
                          id={`freq_${freq.id}`}
                          value={freq.id}
                          checked={
                            formik.values.scheduleFrequency === String(freq.id)
                          }
                          onChange={formik.handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`freq_${freq.id}`}
                        >
                          {freq.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formik.values.scheduleFrequency === "1" && (
                <div className="mb-3 d-flex gap-3">
                  <div className="">
                    <label>From</label>
                    <input
                      type="date"
                      className={`form-control ${
                        formik.touched.fromDate && formik.errors.fromDate
                          ? "is-invalid"
                          : ""
                      }`}
                      name="fromDate"
                      value={formik.values.fromDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.fromDate && formik.errors.fromDate && (
                      <div className="invalid-feedback">
                        {formik.errors.fromDate}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <label>To</label>
                    <input
                      type="date"
                      className={`form-control ${
                        formik.touched.toDate && formik.errors.toDate
                          ? "is-invalid"
                          : ""
                      }`}
                      name="toDate"
                      value={formik.values.toDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.toDate && formik.errors.toDate && (
                      <div className="invalid-feedback">
                        {formik.errors.toDate}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Weekly Days Checkbox (If Weekly Selected) */}
              {formik.values.scheduleFrequency === "3" && (
                <div className="mb-3">
                  <label>Select Days (Weekly)</label>
                  <div className="d-flex gap-3 flex-wrap">
                    {daysOfWeek.map((day) => (
                      <div className="form-check" key={day.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`day_${day.id}`}
                          name="days"
                          value={day.id}
                          checked={formik.values.days.includes(day.id)}
                          onChange={(e) => {
                            const selected = formik.values.days;
                            const updated = e.target.checked
                              ? [...selected, day.id]
                              : selected.filter((id) => id !== day.id);
                            formik.setFieldValue("days", updated);
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`day_${day.id}`}
                        >
                          {day.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formik.touched.days && formik.errors.days && (
                    <div className="text-danger">{formik.errors.days}</div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button type="submit" className="btn btn-success btn-sm">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
