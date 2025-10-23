import React from "react";

const Settings = ({ collapsed }) => {
    return (
      <div className={`content ${collapsed ? "collapsed" : ""}`}>
      <h2>Settings</h2>
      <p>This is the Settings page.</p>
    </div>
  );
};

export default Settings;