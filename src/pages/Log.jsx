import React from "react";

const Log = ({ collapsed }) => {
  return (
    <div className={`content ${collapsed ? "collapsed" : ""}`}>
      <h2>Log</h2>
      <p>This is the Log page.</p>
    </div>
  );
};

export default Log;