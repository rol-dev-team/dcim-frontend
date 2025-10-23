import React from "react";

const Reports = ({ collapsed }) => {
  return (
    <div className={`content ${collapsed ? "collapsed" : ""}`}>
      <h2>Reports</h2>
      <p>This is the Reports page.</p>
    </div>
  );
};

export default Reports;