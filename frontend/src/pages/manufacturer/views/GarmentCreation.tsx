import { useState } from "react";
import { createPortal } from "react-dom";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

/* ================= MAIN ================= */
export default function GarmentCreation() {

  const [showQR, setShowQR] = useState(false);
  const [selectedQR, setSelectedQR] = useState<any>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedRow, setSelectedRow] = useState<any>(null);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

      <GarmentTable
        onQRClick={(data:any) => {
          setSelectedQR(data);
          setShowQR(true);
        }}
        onMenuClick={(pos:any, data:any) => {
          setMenuPosition(pos);
          setSelectedRow(data);
          setMenuOpen(true);
        }}
      />

      {/* QR MODAL */}
      {showQR && (
        <QRModal
          data={selectedQR}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* ACTION MENU */}
      {menuOpen && (
        <ActionMenu
          position={menuPosition}
          data={selectedRow}
          onClose={() => setMenuOpen(false)}
        />
      )}

    </div>
  );
}

function GarmentTable({ onQRClick, onMenuClick }: any) {
  return (
    <table className="w-full text-sm">
      <tbody>
        <Row id="GP-9821" name="Cotton Shirt" material="Cotton" co2="1.5kg" water="2L" status="approved" onQRClick={onQRClick} onMenuClick={onMenuClick}/>
      </tbody>
    </table>
  );
}

function Row({ id, name, material, co2, water, status, onQRClick, onMenuClick }: any) {
  return (
    <tr className="border-b hover:bg-gray-50">

      <td>{id}</td>

      <td className="text-right">
        <div className="flex justify-end gap-3">

          {/* QR */}
          <QrCode2OutlinedIcon
            className="cursor-pointer"
            onClick={() => onQRClick({ id, name })}
          />

          {/* MENU */}
          <MoreVertOutlinedIcon
            className="cursor-pointer"
            onClick={(e:any) => {

              e.stopPropagation();

              const rect = e.currentTarget.getBoundingClientRect();

              onMenuClick({
                x: rect.right,
                y: rect.bottom
              }, { id, name });

            }}
          />

        </div>
      </td>

    </tr>
  );
}

function QRModal({ data, onClose }: any) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl text-center">
          <h2 className="font-bold">{data?.id}</h2>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data?.id}`}
          />

          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}

function ActionMenu({ position, onClose, data }: any) {

  return createPortal(
    <div
      className="fixed z-[9999] w-[200px] bg-white rounded-xl shadow-lg p-3"
      style={{ top: position.y, left: position.x }}
    >
      <div className="cursor-pointer p-2 hover:bg-gray-100">
        View {data?.id}
      </div>

      <div className="cursor-pointer p-2 hover:bg-gray-100">
        <ContentCopyOutlinedIcon /> Copy ID
      </div>
    </div>,
    document.body
  );
}

