import Overview from "./views/Overview";
import UserManagement from "./views/UserManagement";

export default function AdminDashboard({ view }: any) {

  if (view === "users") return <UserManagement />;

  return <Overview />;
}