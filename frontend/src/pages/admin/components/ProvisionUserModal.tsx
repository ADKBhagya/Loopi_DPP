import { useEffect, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

export default function ProvisionUserModal({
  onClose,
  setToast
}: any) {
  const [status, setStatus] = useState("ACTIVE");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [nodeId, setNodeId] = useState("");
  const [toast, setToastLocal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

useEffect(() => {
  if (toast) {
    const timer = setTimeout(() => setToastLocal(null), 2500);
    return () => clearTimeout(timer);
  }
}, [toast]);
  
console.log("ROLE:", role);
console.log("NODE ID:", nodeId);

const roleMap: any = {
  ADMIN: "AD",
  AUTHORITY: "AU",
  AUDITOR: "AUD",
};

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

const generateNodeId = (role: string) => {
  const city = "Stockholm";
  const roleCode = roleMap[role.toUpperCase()] || "XX";
  const random = Math.floor(100 + Math.random() * 900);

  return `${city}-${roleCode}-${random}`;
};

useEffect(() => {
  if (role) {
    const generatedNode = generateNodeId(role);
    setNodeId(generatedNode);

    const generatedPassword = generatePassword(); 
    setTempPassword(generatedPassword);
  }
}, [role]);

  const handleProvision = async () => {
  if (loading) return; // 

  setLoading(true);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/provision-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        fullName,
        email,
        role,
        status,
        organization: nodeId,
        password: tempPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setToast({
        type: "error",
        message: data.message,
      });
      return;
    }

    setToast({
      type: "success",
      message: data.message,
    });

    onClose();

  } catch (error) {
    setToast({
      type: "error",
      message: "Provision failed",
    });
  } finally {
    setLoading(false); 
  }
};

  return (
    <div>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[60]">
        <div className="w-[560px] bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-start px-6 py-5 border-b">

            <div className="flex items-start gap-3">
              {/* ICON */}
              <div className="w-10 h-10 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center">
                <PersonAddAltOutlinedIcon fontSize="small" />
              </div>

              <div>
                <p className="text-[15px] font-semibold text-gray-800">
                  Provision New System User
                </p>
                <p className="text-xs text-gray-400">
                  Admin-controlled role assignment
                </p>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600 text-lg" onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          {/* BODY */}
          <div className="px-6 py-5 space-y-5">

            {/* WARNING */}
            <div className="flex items-start gap-2 border border-red-200 bg-red-50 text-red-500 text-xs p-4 rounded-xl">
              <LockOutlinedIcon fontSize="small" />
              <p>
                Restricted — Admin Only. Direct Manufacturer, Logistics,
                Retailer, Repair Center, or Recycler to self-registration.
              </p>
            </div>

            {/* FORM */}
            <div className="px-6 py-5 space-y-4">

              {/* NAME + EMAIL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Full Name</label>
                  <input
                    className="w-full mt-1 px-3 py-2 border border-[#1B5E20] rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <input
                    className="w-full mt-1 px-3 py-2 border border-[#1B5E20] rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@co.com"
                  />
                </div>
              </div>

              {/* ROLE + NODE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Enterprise Role</label>
                  <select 
                    className="w-full mt-1 px-3 py-2 border border-[#1B5E20] rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    value={role}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}
                  >
                    <option>Auditor</option>
                    <option>Admin</option>
                    <option>Authority</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Dept / Node ID</label>
                  <input
                    value={nodeId}
                    disabled
                    className="w-full mt-1 px-3 py-2 border border-[#1B5E20] rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

            {/* STATUS CARD */}
            <div className="border rounded-xl p-4 bg-gray-50">

              <p className="text-sm font-semibold text-gray-700">
                Account Access Status
              </p>

              <p className="text-xs text-gray-400 mb-3">
                Blockchain write permissions
              </p>

              {/* TOGGLE */}
              <div className="flex items-center gap-2 mb-3">

                {/* ACTIVE */}
                <button
                    onClick={() => setStatus("ACTIVE")}
                    className={`px-3 py-1 text-xs rounded-full font-semibold flex items-center gap-1 ${
                    status === "ACTIVE"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                    ✓ Active
                </button>

                {/* SUSPENDED */}
                <button
                    onClick={() => setStatus("SUSPENDED")}
                    className={`px-3 py-1 text-xs rounded-full font-semibold flex items-center gap-1 ${
                    status === "SUSPENDED"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                    ✕ Suspended
                </button>

                </div>

              {/* INFO */}
              <div className="flex items-start gap-2 text-xs text-blue-600">
                <InfoOutlinedIcon fontSize="small" />
                <p>
                  New user receives a secure one-time blockchain key pair
                  generation link. This action is logged in the audit trail.
                </p>
              </div>

            </div>
            
             {/* TEMP PASSWORD DISPLAY */}
            {tempPassword && (
              <div className="border rounded-xl p-4 bg-blue-50 mt-3">
                <p className="text-sm font-semibold text-blue-700">
                  Temporary Login Credentials
                </p>

                <div className="mt-2 text-xs text-gray-700 space-y-1">
                  <p>
                    <strong>Email:</strong> {email || "example@email.com"}
                  </p>
                  <p>
                    <strong>Password:</strong> {tempPassword}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(`${email} / ${tempPassword}`)
                  }
                  className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-xs"
                >
                  Copy Credentials
                </button>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center px-6 py-4 border-t">

            <span className="text-xs text-orange-500 font-medium">
              Consumes 1 Gas Credit
            </span>

            <div className="flex items-center gap-4">

              <button
                onClick={handleProvision}
                disabled={loading}
                className="bg-[#1B5E20] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow disabled:opacity-50"
              >
                {loading ? "Provisioning..." : "Save & Provision"}
              </button>
            </div>

            {toast && (
              <div
                className={`fixed top-20 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 ${
                  toast.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                {toast.message}
              </div>
            )}

            

          </div>

        </div>
      </div>
    </div>
    </div>
  );

}
