import React from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import FilterDropdown from "../components/FilterDropdown";
import { StatusBadge, FatiguePill } from "../components/Badges";

const DRIVERS = [
  {
    name: "Arjun Kumar",
    region: "T Nagar",
    status: { label: "Active", tone: "dark" },
    capacity: "85%",
    fatigue: "Low",
  },
  {
    name: "Priya Ramesh",
    region: "Tambaram",
    status: { label: "Active", tone: "dark" },
    capacity: "92%",
    fatigue: "Medium",
  },
  {
    name: "Karthik Raj",
    region: "Velachery",
    status: { label: "Active", tone: "dark" },
    capacity: "78%",
    fatigue: "Low",
  },
  {
    name: "Lakshmi",
    region: "Anna Nagar",
    status: { label: "On Break", tone: "gray" },
    capacity: "95%",
    fatigue: "High",
  },
  {
    name: "Ravi Shankar",
    region: "Coimbatore",
    status: { label: "Active", tone: "dark" },
    capacity: "88%",
    fatigue: "Medium",
  },
  {
    name: "Divya Narayanan",
    region: "Madurai",
    status: { label: "Active", tone: "dark" },
    capacity: "72%",
    fatigue: "Low",
  },
  {
    name: "Sanjay Iyer",
    region: "Trichy",
    status: { label: "Inactive", tone: "gray" },
    capacity: "0%",
    fatigue: "Medium",
  },
];

function DriverManagement() {
  return (
    <>
      <PageHeader
        title="Driver Management"
        subtitle="Manage your driver workforce"
        rightSlot={
          <button className="btn-primary" type="button">
            + Add Driver
          </button>
        }
      />
      <section className="card filters-card">
        <div className="filters-grid">
          <FilterDropdown label="Region" value="All Regions" />
          <FilterDropdown label="Status" value="All Statuses" />
        </div>
      </section>
      <section className="card panel">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Region</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Fatigue Level</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {DRIVERS.map((driver) => (
                <tr key={driver.name}>
                  <td>{driver.name}</td>
                  <td>{driver.region}</td>
                  <td>
                    <StatusBadge
                      label={driver.status.label}
                      tone={driver.status.tone}
                    />
                  </td>
                  <td>{driver.capacity}</td>
                  <td>
                    <FatiguePill label={driver.fatigue} />
                  </td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="View driver"
                    >
                      <FiEye />
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Edit driver"
                    >
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default DriverManagement;
