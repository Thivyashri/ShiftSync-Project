import React from "react";
import { FiChevronDown } from "react-icons/fi";

function FilterDropdown({ label, value }) {
  return (
    <div className="filter-dropdown">
      <span className="filter-label">{label}</span>
      <div className="filter-control">
        <span>{value}</span>
        <FiChevronDown className="filter-icon" />
      </div>
    </div>
  );
}

export default FilterDropdown;