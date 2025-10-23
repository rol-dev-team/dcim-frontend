const buttonConfigs = {
  submit: { text: "Submit", className: "btn btn-primary", type: "submit"},
  save: { text: "Save Changes", className: "btn btn-primary" , type: "submit"},
  cancel: { text: "Cancel", className: "btn btn-secondary" },
  edit: { text: "Edit", className: "btn btn-sm btn-primary" },
  delete: { text: "Delete", className: "btn btn-sm btn-danger" },
  addNew: { text: "Add New User", className: "btn btn-primary" },
  addUser: { text: "Add New User", className: "btn btn-primary" }, 
  register: { text: "Register", className: "btn btn-success", type: "submit" },
  show: { text: "Show", className: "btn btn-sm btn-info" },

upload: { text: "Upload", className: "btn btn-primary", type: "submit" }
,

  //datacenter side-bar
  addNewDataCenter: { text: "Add New Data Center", className: "btn btn-primary" },
  export: { text: "Export", className: "btn btn-success" },

 createSensor: { text: "Add New Sensor", className: "btn btn-primary text-white me-2" },
};

const CommonButton = ({
  name,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  const config = buttonConfigs[name];

  if (!config) {
    console.warn(`CommonButton: No config found for button name '${name}'`);
    return null;
  }

  return (
    <button
      type={type}
      className={`${config.className} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {config.text}
    </button>
  );
};

export default CommonButton;
