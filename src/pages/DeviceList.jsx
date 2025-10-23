import React from "react";

const DeviceList = ({ collapsed }) => {
  return (
    <div className={`content ${collapsed ? "collapsed" : ""}`}>
      <h2 className='btn btn-info'>Device List</h2>
      <p>This is the Device List page.</p>
    </div>
  );
};

export default DeviceList;
