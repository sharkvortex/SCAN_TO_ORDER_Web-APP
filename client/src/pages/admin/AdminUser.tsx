import React from "react";
import { Link } from "react-router-dom";
function AdminUser() {
  return (
    <Link to={"/system/dashboard/"} className="ml-4">
      <button>กลับไปหน้า Dashboard</button>
    </Link>
  );
}

export default AdminUser;
