import React from "react";
import Overview from "./views/Overview";
import UserManagement from "./views/UserManagement";

export default function AdminDashboard({ view }: any) {
  const setView = () => {};

  if (view === "users") return <UserManagement />;

  // Overview's exported type may not be recognized as a JSX component
  // Use createElement with a cast to any to avoid the TS JSX type error
  return React.createElement(Overview as any, { setView });
}