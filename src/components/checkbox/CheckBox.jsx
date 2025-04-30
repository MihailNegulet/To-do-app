import React from "react";

import "./Checkbox.css";

const Checkbox = (props) => {
  const { checked, onChange, ...restProps } = props;

  const handleCheckboxChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className="round">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        {...restProps}
      />
      <label
        className={`checkbox ${checked ? "checkbox--active" : ""}`}
        htmlFor="checkbox"
      ></label>
    </div>
  );
};

export default Checkbox;
