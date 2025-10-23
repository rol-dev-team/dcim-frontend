import React from "react";

const Servers = ({ collapsed }) => {
  return (
    <div className={`content ${collapsed ? "collapsed" : ""}`}>
      <h2>Servers</h2>
      <p>This is the Servers page.</p>
    </div>
  );
};

export default Servers;