import { useState } from "react";
import AdminLayout from "./AdminLayout";

function Admin() {
  const [view, setView] = useState("overview");

  return <AdminLayout view={view} setView={setView} />;
}

export default Admin;