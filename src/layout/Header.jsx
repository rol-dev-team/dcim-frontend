import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { RiArrowRightWideFill, RiArrowLeftWideFill } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";

import { logoutUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { errorMessage } from "../api/api-config/apiResponseMessage";
import { DynamicSelectField } from "../components/DynamicSelectField";
import {
  fetchDataCenter,
  getTabDataCenters,
  getUserDataCenters,
} from "../api/settings/dataCenterApi";
import { setDataCenterOptions } from "../redux/features/dashboard/dataCenterSlice";
import { userContext } from "../context/UserContext";
import { setTabList } from "../redux/features/dashboard/tabListSlice";
import { setUpdatedDataCenter } from "../redux/features/dashboard/updatedDataCenterSlice";


const Header = ({ username, toggleSidebar, isSidebarCollapsed, isMobile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataCenterOptions = useSelector((state) => state.dashboard.options);
  const { user } = useContext(userContext);
const[dropdown,setDropdown]=useState(false);
  const [defaultDataCenter, setDefaultDataCenter] = useState("");
  const [selectedDataCenter, setSelectedDefaultDataCenter] = useState(null);

  useEffect(() => {
    if (dataCenterOptions?.length > 0) {
      setDefaultDataCenter(dataCenterOptions?.[0]?.label);
      setSelectedDefaultDataCenter(dataCenterOptions?.[0]?.value);
       dispatch(setUpdatedDataCenter(dataCenterOptions?.[0]?.value));
    }
  }, [dataCenterOptions]);

const handleLogout = () => {
        const token = localStorage.getItem("access_token");

        logoutUser(
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(() => {
                localStorage.clear();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout error:", error);
                localStorage.clear();
                navigate("/");
            });
    };

  const handleChangePassword = () => {
    console.log("Change Password clicked");
  };

  const formik = useFormik({
    initialValues: {
      color: "",
    },
    validationSchema: Yup.object({
      color: Yup.string().required("Color is required!"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

  useEffect(() => {
    getUserDataCenters(user?.id)
      .then((res) => {
        const options = res.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        dispatch(setDataCenterOptions(options));
      })
      .catch(errorMessage);
  }, [dispatch]);

  useEffect(() => {
    if (selectedDataCenter != null) {
      getTabDataCenters(selectedDataCenter)
        .then((res) => {
          dispatch(setTabList(res.data));
        })
        .catch(errorMessage);
    }
  }, [selectedDataCenter]);

  return (
    <header
      className={`header ${isSidebarCollapsed ? "collapsed" : ""} ${
        isMobile ? "mobile" : ""
      }`}
    >
      <div className="d-flex align-items-center justify-content-between w-100 h-100">
        {/* Left: Sidebar toggle + DC name */}
        <div className="d-flex align-items-center gap-3">
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {isSidebarCollapsed ? (
              <RiArrowRightWideFill className="text-dark fw-bolder" />
            ) : (
              <RiArrowLeftWideFill className="text-dark fw-bolder" />
            )}
          </button>
          <h6 className="text-dark mb-0">{defaultDataCenter}</h6>
        </div>

        {/* Center: Form */}
        <div className="flex-grow-1 d-flex justify-content-center align-items-center mt-3">
          <form
            onSubmit={formik.handleSubmit}
            className="d-flex align-items-center"
          >
            <DynamicSelectField
              label=""
              name="dropdownFilter"
              options={dataCenterOptions}
              value={formik.values.dropdownFilter}
              onChange={(value) => {
                formik.setFieldValue("dropdownFilter", value);
                setSelectedDefaultDataCenter(value);
                dispatch(setUpdatedDataCenter(value));
                const selected = dataCenterOptions?.find(
                  (opt) => opt.value === value
                );
                if (selected) {
                  setDefaultDataCenter(selected.label);
                }
              }}
              onBlur={formik.handleBlur}
            />
          </form>
        </div>

        {/* Right: User */}
        {/* <div className="d-flex align-items-center">
          <div className="dropdown">
            <button
              className="btn btn-transparent border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserCircle size={30} className="text-success" />
            </button>
            <ul className="dropdown-menu pt-0">
              <li className="bg-secondary text-white text-center py-2">
                {username}
              </li>
              <li>
                <button className="dropdown-item" type="button">
                  Change Password
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div> */}
<div className="dropdown">
  <button
  onClick={()=>setDropdown(!dropdown)}
    id="userDropdown"
    className="btn btn-transparent border-0"
    type="button"
    
  >
    <FaUserCircle size={30} className="text-success" />
  </button>
{dropdown && (<ul className="dropdown-menu d-block pt-0">
    <li className="bg-secondary text-white text-center py-2">
      {username}
    </li>
    <li>
      <button className="dropdown-item">Change Password</button>
    </li>
    <li>
      <button className="dropdown-item" onClick={handleLogout}>
        Logout
      </button>
    </li>
  </ul>)}
  
</div>


      </div>
    </header>
  );
};

export default Header;
