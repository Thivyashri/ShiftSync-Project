
import React from "react";

/**
 * variant:
 *  dark - black pill (for Days Present)
 *  danger - red pill   (for Days Absent with 2)
 *  light - light/white pill border (Days Absent = 0/1)
 *  muted - gray pill  (Late Check-ins)
 */
function CountPill({ value, variant = "dark" }) {
  return (
    <span className={"count-pill count-pill-${variant}"}>{value}</span>
  );
}

export default CountPill;