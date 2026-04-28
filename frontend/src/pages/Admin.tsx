import { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/pending-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(data);
  };

  const approveUser = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPendingUsers();
  };

  const rejectUser = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPendingUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <h3>Pending User Approvals</h3>

      {users.length === 0 && <p>No pending users</p>}

      {users.map((user: any) => (
        <div key={user._id} style={{ marginBottom: "10px" }}>
          <p>{user.email} ({user.role})</p>

          <button onClick={() => approveUser(user._id)}>
            Approve
          </button>

          <button onClick={() => rejectUser(user._id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;