import React from "react";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";

const EmployeeLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <EmployeeDashboard />
    </div>
  );
};

export default EmployeeLayout;