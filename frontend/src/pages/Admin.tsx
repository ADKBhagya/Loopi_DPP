import { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    setUsers([
      { _id: "1", email: "user1@test.com", role: "Manufacturer" },
      { _id: "2", email: "user2@test.com", role: "Logistics" },
      { _id: "3", email: "user3@test.com", role: "Retailer" },
    ]);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-8 text-green-700">LOOPI</h2>

        <nav className="space-y-2">
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
            Admin Overview
          </div>
          <div className="text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            User Management
          </div>
          <div className="text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            Blockchain Network
          </div>
          <div className="text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            System Config
          </div>
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <input
            placeholder="Search Passport ID, Batch..."
            className="border px-4 py-2 rounded-lg w-96 bg-white shadow-sm"
          />

          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
              ● MAINNET ONLINE
            </span>

            <div className="bg-green-700 text-white px-4 py-2 rounded-lg">
              Admin
            </div>
          </div>
        </div>

        {/* GREEN HEADER */}
        <div className="bg-green-700 text-white p-6 rounded-xl mb-6 flex justify-between items-center shadow-md">
          <div>
            <h2 className="text-lg font-semibold">Enterprise Infrastructure</h2>
            <p className="text-sm opacity-80">
              System Operational • Latency: 42ms • Block #8,442,109
            </p>
          </div>

          <div className="flex gap-2">
            <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-medium">
              Sync Node
            </button>
            <button className="border border-white px-4 py-2 rounded-lg">
              Secure Session
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card title="TOTAL USERS" value="1,284" />
          <Card title="ACTIVE NODES" value="4 / 5" />
          <Card title="BLOCKCHAIN TXS" value="8,442" />
          <Card title="PASSPORTS ISSUED" value="23,910" />
        </div>

        {/* ALERT */}
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span className="text-yellow-700">
            {users.length} self-registrations awaiting your approval
          </span>

          <button className="bg-yellow-500 text-white px-4 py-1 rounded-lg">
            Review Now →
          </button>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-3 gap-6">

          {/* TABLE */}
          <div className="col-span-2 bg-white p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold text-gray-700">
              Authorized User Access
            </h3>

            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b">
                <tr>
                  <th className="text-left pb-2">EMAIL</th>
                  <th className="text-left pb-2">ROLE</th>
                  <th className="text-left pb-2">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-3">{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                        Approve
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Security Event Log</h3>

            <div className="space-y-3 text-sm">
              <div className="text-red-500">Login Attempt Failure</div>
              <div className="text-yellow-500">Blockchain Sync Failure</div>
              <div className="text-green-500">New Admin Assigned</div>
              <div className="text-blue-500">Data Export Request</div>
              <div className="text-purple-500">Password Reset Triggered</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value }: any) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-400 text-xs mb-1">{title}</p>
    <h2 className="text-xl font-bold text-gray-800">{value}</h2>
  </div>
);

export default Admin;