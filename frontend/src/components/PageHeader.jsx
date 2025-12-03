import React from "react";

function PageHeader({ title, subtitle, rightSlot }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {rightSlot && <div className="page-header-right">{rightSlot}</div>}
    </header>
  );
}

export default PageHeader;