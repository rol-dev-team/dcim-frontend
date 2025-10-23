import React from "react";
import Select from "react-select";
import { RiSearchLine } from "react-icons/ri";
import { RiFilterLine } from "react-icons/ri";

export const DynamicSelectField = ({
  name,
  options,
  value,
  onChange,
  onBlur,
  isClearable = true,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  isRtl = false,
  placeholder = "Select Data Center",
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '30px',
      minWidth: '300px', 
      maxHeight: 'auto',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, 
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }),
  };

  const searchIconComponents = {
    DropdownIndicator: () => (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center",padding:'0 5px'}}>
        <RiFilterLine size={20} className="text-secondary"/>
      </div>
    ),
  };
  return (
    <div className="mb-3">
      <Select
        name={name}
        options={options}
        value={options ? options.find(option => option.value === value) : ""}
        onChange={(option) => onChange(option ? option.value : "")}
        onBlur={onBlur}
        styles={customStyles}
        className="basic-single"
        classNamePrefix="select"
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isRtl={isRtl}
        placeholder={placeholder}
        components={searchIconComponents}
      />
    </div>
  );
};

 
