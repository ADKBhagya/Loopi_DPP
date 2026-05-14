import { useEffect, useMemo, useRef, useState } from "react";
import QRScannerModal from "../../../components/qr/QRScannerModal";
import { apiFetch } from "../../../lib/api";

/* ICONS */
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";

export default function ServiceQueue() {
  const [search, setSearch] = useState("");

  const [repairPhotos, setRepairPhotos] = useState<any[]>([]);
  const [repairCertificates, setRepairCertificates] = useState<File[]>([]);
  const [totalServices, setTotalServices] = useState(0);

  const [scannerOpen, setScannerOpen] = useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showReassignModal, setShowReassignModal] =
    useState(false);

  const [selectedJob, setSelectedJob] =
    useState<any>(null);

  const [showMenu, setShowMenu] = useState("");

  const [selectedTechnician, setSelectedTechnician] =
    useState("");

  const [reassignJob, setReassignJob] =
    useState<any>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const menuRef = useRef<any>(null);

  const technicians = [
    "Erik Lund",
    "Sara Voss",
    "Mia Albers",
    "Jonas Keller",
    "Emma Fischer",
  ];

  const openDetailsModal = (job: any) => {
  setShowMenu("");
  setSelectedJob(job);
};

    const openReassignModal = (job: any) => {
    setShowMenu("");

    setSelectedTechnician(job.technician);

    setReassignJob(job);

    setShowReassignModal(true);
    };

    const closeDetailsModal = () => {
    setSelectedJob(null);
    };

    const closeReassignModal = () => {
    setShowReassignModal(false);
    setReassignJob(null);
    };

  const [jobs, setJobs] = useState<any[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState("");

  const [newJob, setNewJob] = useState({
    passport: "",
    garment: "",
    type: "Mending",
    technician: "Erik Lund",
    duration: "2h",
    price: "",
    note: "",
  });

  const loadRepairQueue = async () => {
    setQueueLoading(true);
    setQueueError("");

    try {
      const data = await apiFetch<any>("/repair-center/queue");
      setJobs(data.jobs || []);
      setTotalServices(data.stats?.totalServices || data.jobs?.length || 0);
    } catch (error) {
      console.error("Failed to load repair queue", error);
      setJobs([]);
      setTotalServices(0);
      setQueueError("Failed to load repair queue");
    } finally {
      setQueueLoading(false);
    }
  };

  useEffect(() => {
    loadRepairQueue();
  }, []);

  useEffect(() => {
    const closeMenu = (e: any) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowMenu("");
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener(
        "mousedown",
        closeMenu
      );
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (showCreateModal || scannerOpen) {
      setShowMenu("");
    }
  }, [showCreateModal, scannerOpen]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const value = search.toLowerCase();

      return (
        String(job.id || "").toLowerCase().includes(value) ||
        String(job.passport || "").toLowerCase().includes(value) ||
        String(job.type || "").toLowerCase().includes(value) ||
        String(job.technician || "").toLowerCase().includes(value)
      );
    });
  }, [jobs, search]);

  const addRepairPhotos = (files: File[]) => {
    setRepairPhotos((prev) => [...prev, ...files]);
  };

  const addRepairCertificates = (files: File[]) => {
    setRepairCertificates((prev) => [...prev, ...files]);
  };

  const createJob = async () => {
    try {
      // Validate form
      if (!newJob.passport || !newJob.garment) {
        setToast({
          message: "Please scan a QR code first",
          type: "error",
        });
        return;
      }

      if (!newJob.type) {
        setToast({
          message: "Please select a service type",
          type: "error",
        });
        return;
      }

      if (!newJob.technician) {
        setToast({
          message: "Please select a technician",
          type: "error",
        });
        return;
      }

      if (!newJob.duration) {
        setToast({
          message: "Please select duration",
          type: "error",
        });
        return;
      }

      if (!newJob.price) {
        setToast({
          message: "Please enter a price",
          type: "error",
        });
        return;
      }

      const payload = new FormData();
      Object.entries({
        ...newJob,
        service: newJob.type,
        status: "QUEUED",
      }).forEach(([key, value]) => {
        payload.append(key, String(value || ""));
      });

      repairPhotos.forEach((file) => {
        payload.append("photos", file);
      });

      repairCertificates.forEach((file) => {
        payload.append("certificates", file);
      });

      const data = await apiFetch<any>("/repair-center/queue", {
        method: "POST",
        body: payload,
      });

      if (data?.job) {
        setJobs((prev) => [data.job, ...prev]);
        setTotalServices((value) => value + 1);
        
        // Close modal and reset form
        setShowCreateModal(false);
        setRepairPhotos([]);
        setRepairCertificates([]);
        setNewJob({
          passport: "",
          garment: "",
          type: "Mending",
          technician: "Erik Lund",
          duration: "2h",
          price: "",
          note: "",
        });

        setToast({
          message: "Service record saved successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Create job error:", error);
      setToast({
        message: error instanceof Error ? error.message : "Failed to save repair job",
        type: "error",
      });
    }
  };

  const updateJob = async (jobId: string, updates: any) => {
    try {
      const data = await apiFetch<any>(`/repair-center/queue/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      setJobs((prev) =>
        prev.map((item) => (item.id === jobId ? data.job : item))
      );
      setShowMenu("");
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to update repair job",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-10">

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? "✓" : "✕"}
          </div>
          <span
            className={`text-sm font-medium ${
              toast.type === "success"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {toast.message}
          </span>
        </div>
      )}

      {/* TOP */}
      <div
        className="
          grid
          grid-cols-1
          2xl:grid-cols-[2fr_1fr]
          gap-4 sm:gap-6
        "
      >

        {/* SCAN */}
        <button
          onClick={() => setScannerOpen(true)}
          className="
            min-h-[220px]
            rounded-[26px] sm:rounded-[34px]

            bg-gradient-to-br
            from-[#166B2D]
            to-[#0D4A20]

            relative
            overflow-hidden

            flex flex-col
            items-center
            justify-center

            shadow-[0_25px_60px_rgba(22,107,45,0.28)]

            hover:scale-[1.01]
            transition-all
          "
        >

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />

          <div className="relative z-10 flex flex-col items-center px-4">

            <div
              className="
                w-16 h-16
                rounded-[22px]
                bg-white/10
                border border-white/20
                backdrop-blur-xl

                flex items-center justify-center
              "
            >
              <QrCodeScannerRoundedIcon
                style={{
                  color: "white",
                  fontSize: 30,
                }}
              />
            </div>

            <h1
              className="
                mt-6 
                text-white
                text-[22px]
                sm:text-[26px]
                font-black
                text-center
              "
            >
              SCAN QR CODE
            </h1>

            <p
              className="
                mt-3
                text-white/75
                text-[10px] sm:text-[11px]
                tracking-[0.14em]
                sm:tracking-[0.20em]
                font-black
                text-center
              "
            >
              VERIFY PASSPORT & START REPAIR
            </p>

          </div>

        </button>

        {/* STATS */}
        <div
          className="
            min-h-[220px]
            w-full

            rounded-[26px] sm:rounded-[34px]

            bg-white
            border border-[#ECECEC]

            flex flex-col
            items-center justify-center

            shadow-[0_15px_45px_rgba(0,0,0,0.05)]
          "
        >

          <div
            className="
              w-16 h-16
              rounded-[22px]
              bg-[#EEF4FF]
              text-[#2563EB]

              flex items-center justify-center
            "
          >
            <ConstructionRoundedIcon
              style={{
                fontSize: 28,
              }}
            />
          </div>

          <h2
            className="
              mt-6
              text-[20px]
              font-black
              text-[#111827]
            "
          >
            Total Services
          </h2>

          <h1
            className="
              mt-2
              text-[42px]
              font-black
              text-[#2563EB]
              leading-none
            "
          >
            {totalServices || jobs.length}
          </h1>

          <p
            className="
              mt-4
              text-[10px]
              sm:text-[11px]

              tracking-[0.16em]
              font-black

              text-[#A0A6B2]
              text-center
              px-4
            "
          >
            CERTIFIED ECO-REPAIR HUB
          </p>

        </div>

      </div>

      {/* QUEUE */}
      <section
        className="
          bg-white
          border border-[#ECECEC]

          rounded-[26px] sm:rounded-[30px]

          overflow-visible

          shadow-[0_12px_35px_rgba(0,0,0,0.04)]
        "
      >

        {/* HEADER */}
        <div
          className="
            px-4 sm:px-6
            py-5

            border-b border-[#F2F2F2]

            flex flex-col
            xl:flex-row

            xl:items-center
            xl:justify-between

            gap-4
          "
        >

          <div>

            <h2
              className="
                text-[22px]
                sm:text-[26px]
                font-black
                text-[#111827]
              "
            >
              Recent Service Queue
            </h2>

            <p className="mt-1 text-sm text-[#9CA3AF]">
              Real-time repair lifecycle management
            </p>

          </div>

          <div className="relative w-full xl:w-[260px]">

            <SearchRoundedIcon
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#9CA3AF]
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search repair queue..."
              className="
                w-full
                h-[50px]

                rounded-2xl

                border border-[#ECECEC]

                bg-[#FAFAFA]

                pl-11 pr-4

                text-sm

                outline-none

                focus:border-[#166B2D]
              "
            />

          </div>

        </div>

        {/* JOBS */}
        {queueLoading && (
          <div className="px-4 sm:px-6 py-10 text-center text-sm font-semibold text-[#9CA3AF]">
            Loading service queue...
          </div>
        )}

        {!queueLoading && queueError && (
          <div className="px-4 sm:px-6 py-10 text-center text-sm font-semibold text-[#DC2626]">
            {queueError}
          </div>
        )}

        {!queueLoading && !queueError && filteredJobs.length === 0 && (
          <div className="px-4 sm:px-6 py-10 text-center text-sm font-semibold text-[#9CA3AF]">
            No service queue jobs found
          </div>
        )}

        {!queueLoading && !queueError && filteredJobs.map((job) => (
          <div
            key={job.id}
            className="
              relative

              px-4 sm:px-6
              py-4

              border-b border-[#F5F5F5]

              flex flex-col
              lg:flex-row

              lg:items-center
              lg:justify-between

              gap-4

              hover:bg-[#FAFAFA]

              transition-all
            "
          >

            {/* LEFT */}
            <div
            className="
                flex items-start
                sm:items-center
                gap-4

                flex-1
                min-w-0
            "
            >

            <span
                className="w-3 h-3 rounded-full mt-2 sm:mt-0 shrink-0"
                style={{
                background: job.color,
                }}
            />

            <div className="min-w-0">

                <div
                className="
                    flex flex-wrap
                    items-center
                    gap-2
                "
                >

                <h3
                    className="
                    font-black
                    text-[#111827]
                    break-words
                    "
                >
                    {job.type}
                </h3>

                <GreenTag>
                    {job.passport}
                </GreenTag>

                </div>

                <p
                className="
                    mt-2
                    text-sm
                    text-[#9CA3AF]
                    break-words
                "
                >
                {job.id} · {job.technician} · {job.duration}
                </p>

            </div>

            </div>

            {/* RIGHT */}
            <div
              className="
                flex items-center
                justify-between
                lg:justify-end

                gap-3 sm:gap-5

                w-full lg:w-auto
              "
            >

              <p
                className="
                  text-sm
                  font-black
                  text-[#6B7280]
                "
              >
                {job.price}
              </p>

              <StatusChip status={job.status} />

{/* MENU BUTTON */}
<div className="relative">

<button
  type="button"
  onClick={(e) => {

    e.preventDefault();

    e.stopPropagation();

    setShowMenu(
      showMenu === job.id ? "" : job.id
    );

  }}
  disabled={showCreateModal || scannerOpen}
  className={`
    w-10 h-10

    rounded-xl

    flex items-center justify-center

    transition-all

    border border-[#ECECEC]

    bg-white

    relative

    z-10

    ${showCreateModal || scannerOpen ? "opacity-50 cursor-not-allowed" : "hover:bg-[#F3F4F6]"}
  `}
>
  <MoreVertRoundedIcon />
</button>

  {/* DROPDOWN */}
{showMenu === job.id && (

  <div
    onClick={(e) => {

      e.stopPropagation();

    }}

    className="
      absolute

      right-0
      top-[48px]

      w-[230px]

      bg-white

      rounded-[24px]

      border border-[#ECECEC]

      shadow-[0_30px_80px_rgba(0,0,0,0.18)]

      overflow-hidden

      z-50
    "
  >

    <MenuBtn
      icon={<VisibilityOutlinedIcon />}
      label="View Details"
      onClick={() => {
        openDetailsModal(job);
      }}
    />

    <MenuBtn
      icon={<AutorenewRoundedIcon />}
      label="Mark In Progress"
      onClick={() => {

        updateJob(job.id, { status: "IN PROGRESS" });
      }}
    />

    <MenuBtn
      icon={
        <AssignmentTurnedInOutlinedIcon />
      }
      label="Mark Complete"
      onClick={() => {

        updateJob(job.id, { status: "COMPLETED" });
      }}
    />

    <MenuBtn
      icon={<PersonOutlineRoundedIcon />}
      label="Reassign"
      onClick={() => {
        openReassignModal(job);
      }}
    />

  </div>

)}

</div>

            </div>

          </div>
        ))}

      </section>

      {/* QR */}
      <QRScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={async (value?: string) => {
          try {
            setScannerOpen(false);

            // Extract passport ID from scanned value
            const scannedValue = (value || "").trim();
            let lookupId = scannedValue;
            let displayPassportId = scannedValue;
            
            if (!lookupId) {
              setToast({ message: "Invalid QR code scanned", type: "error" });
              setTimeout(() => setShowCreateModal(true), 400);
              return;
            }

            // Extract ID from URL path if needed
            if (lookupId.includes("/")) {
              lookupId = lookupId.split("/").pop() || "";
            }

            // Try to fetch garment data, but proceed anyway if it fails
            let garmentName = "Unknown Garment";
            try {
              const garmentData = await apiFetch<any>(`/passport/${lookupId}`);
              const garment = garmentData?.garment;

              if (garment?.sku || garment?.batchNumber) {
                displayPassportId = garment.sku || garment.batchNumber;
              } else if (garment?._id) {
                displayPassportId = `GP-${String(garment._id).slice(-6).toUpperCase()}`;
              }

              if (garment?.productName) {
                garmentName = garment.productName;
              } else if (garment?.name) {
                garmentName = garment.name;
              }

              if (garmentData?.garment?._id) {
                lookupId = garmentData.garment._id;
              }
            } catch (fetchError) {
              console.warn("Could not fetch garment details:", fetchError);
              // Continue anyway - use the scanned ID
            }

            // Set the form with loaded or default data
            setNewJob({
              passport: displayPassportId,
              garment: garmentName,
              type: "Mending",
              technician: "Erik Lund",
              duration: "2h",
              price: "€20",
              note: "",
            });

            setToast({
              message: `QR scanned: ${displayPassportId} · ${garmentName}`,
              type: "success",
            });

            // Open modal after a brief delay to let state update
            setTimeout(() => {
              setShowCreateModal(true);
            }, 400);

          } catch (error) {
            console.error("Scan error:", error);
            setToast({
              message: "Scan failed. Please try again.",
              type: "error",
            });
          }
        }}
      />

      {/* CREATE MODAL */}
      {showCreateModal && (
        <>
          <div
            onClick={() =>
              setShowCreateModal(false)
            }
            className="
              fixed inset-0
              bg-black/40
              backdrop-blur-[4px]
              z-[9998]
            "
          />

          <div
            className="
              fixed inset-0
              z-[9999]

              flex
              items-start sm:items-center
              justify-center

              overflow-y-auto

              p-3 sm:p-5
            "
          >

            <div
              className="
                w-full
                max-w-[760px]

                max-h-[96vh]
                overflow-y-auto

                rounded-[24px] sm:rounded-[36px]

                bg-white

                border border-[#ECECEC]

                shadow-[0_40px_120px_rgba(0,0,0,0.28)]
              "
            >

              {/* HEADER */}
              <div
                className="
                  sticky top-0
                  z-20

                  bg-white

                  px-4 sm:px-7
                  py-5

                  border-b border-[#F2F2F2]

                  flex items-start
                  justify-between
                  gap-4
                "
              >

                <div className="flex gap-4">

                  <div
                    className="
                      w-12 h-12
                      rounded-2xl

                      bg-[#166B2D]
                      text-white

                      flex items-center justify-center
                    "
                  >
                    <CheckCircleRoundedIcon />
                  </div>

                  <div>

                    <h2
                      className="
                        text-[22px]
                        sm:text-[26px]
                        font-black
                        text-[#111827]
                        leading-none
                      "
                    >
                      Add Service Record
                    </h2>

                    <p
                      className="
                        mt-2
                        text-xs sm:text-sm
                        font-black

                        tracking-[0.08em]

                        text-[#16A34A]
                      "
                    >
                      {newJob.passport?.toUpperCase() || "GP-XXXX"} · {newJob.garment?.toUpperCase() || "GARMENT"}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="
                    w-11 h-11
                    rounded-xl

                    hover:bg-[#F5F5F5]

                    flex items-center justify-center
                  "
                >
                  <CloseRoundedIcon />
                </button>

              </div>

              {/* BODY */}
              <div className="p-4 sm:p-7 space-y-7">

                {/* TYPES */}
                <div>

                  <p
                    className="
                      text-[11px]
                      tracking-[0.14em]
                      font-black
                      text-[#6B7280]
                      mb-4
                    "
                  >
                    SERVICE TYPE
                  </p>

                  <div
                    className="
                      grid
                      grid-cols-2
                      sm:grid-cols-3
                      gap-3 sm:gap-4
                    "
                  >

                    {[
                      "Mending",
                      "Dyeing",
                      "Hardware",
                      "Lining",
                      "Cleaning",
                      "Alteration",
                    ].map((type) => (

                      <button
                        key={type}
                        onClick={() =>
                          setNewJob({
                            ...newJob,
                            type,
                          })
                        }
                        className={`
                          h-[58px]

                          rounded-[20px]

                          border

                          text-sm
                          font-black

                          transition-all

                          ${
                            newJob.type === type
                              ? "border-[#166B2D] bg-[#EEF7F1] text-[#166B2D]"
                              : "border-[#ECECEC] bg-[#FAFAFA] text-[#6B7280]"
                          }
                        `}
                      >
                        {type}
                      </button>

                    ))}

                  </div>

                </div>

                {/* INPUTS */}
                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-5
                  "
                >

                  <Select
                    label="TECHNICIAN"
                    value={newJob.technician}
                    onChange={(e: any) =>
                      setNewJob({
                        ...newJob,
                        technician:
                          e.target.value,
                      })
                    }
                    options={technicians}
                  />

                  <Select
                    label="EST. DURATION"
                    value={newJob.duration}
                    onChange={(e: any) =>
                      setNewJob({
                        ...newJob,
                        duration:
                          e.target.value,
                      })
                    }
                    options={[
                      "1h",
                      "2h",
                      "3h",
                      "4h",
                    ]}
                  />

                  <div>

                    <p
                      className="
                        text-[11px]
                        tracking-[0.14em]
                        font-black
                        text-[#6B7280]
                        mb-3
                      "
                    >
                      PRICE
                    </p>

                    <input
                      value={newJob.price}
                      onChange={(e) =>
                        setNewJob({
                          ...newJob,
                          price: e.target.value,
                        })
                      }
                      placeholder="€20"
                      className="
                        w-full
                        h-[58px]

                        rounded-2xl

                        border border-[#ECECEC]

                        bg-[#FAFAFA]

                        px-5

                        outline-none

                        focus:border-[#166B2D]
                      "
                    />

                  </div>

                </div>

                <Textarea
                  label="SERVICE DETAILS"
                  value={newJob.note}
                  onChange={(e: any) =>
                    setNewJob({
                      ...newJob,
                      note: e.target.value,
                    })
                  }
                />

                <div>
                  <p className="text-[11px] tracking-[0.14em] font-black text-[#6B7280] mb-3">
                    PHOTO EVIDENCE
                  </p>

                  <label className="flex items-center gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 cursor-pointer hover:border-[#166B2D] transition">
                    {repairPhotos[0] ? (
                      <img
                        src={URL.createObjectURL(repairPhotos[0])}
                        alt={repairPhotos[0].name}
                        className="w-20 h-20 rounded-xl object-cover border border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-white text-gray-400 border flex items-center justify-center">
                        <UploadRoundedIcon />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-700">
                        {repairPhotos.length
                          ? `${repairPhotos.length} photo${repairPhotos.length === 1 ? "" : "s"} selected`
                          : "Upload before / after photos"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, or WebP. Stored with this repair service record.
                      </p>
                    </div>

                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e: any) => {
                        addRepairPhotos(Array.from(e.target.files || []) as File[]);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {repairPhotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {repairPhotos.map((file: File, index: number) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="relative h-[120px] rounded-2xl overflow-hidden border border-[#ECECEC] bg-white"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setRepairPhotos((prev: File[]) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                          >
                            <CloseRoundedIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[11px] tracking-[0.14em] font-black text-[#6B7280] mb-3">
                    REPAIR CERTIFICATES
                  </p>

                  <div
                    className={`border-2 border-dashed rounded-xl p-6 transition ${
                      repairCertificates.length > 0
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:border-[#166B2D]"
                    }`}
                  >
                    <label className="cursor-pointer flex flex-col items-center justify-center">
                      <UploadRoundedIcon style={{ fontSize: 40 }} />

                      <p className="mt-2 font-semibold text-sm">
                        Upload Certificates (PDF)
                      </p>

                      <p className="text-xs text-gray-400">
                        Attach repair authorization, warranty, or quality documents
                      </p>

                      <input
                        type="file"
                        hidden
                        multiple
                        accept=".pdf,application/pdf"
                        onChange={(e: any) => {
                          addRepairCertificates(Array.from(e.target.files || []) as File[]);
                          e.target.value = "";
                        }}
                      />
                    </label>

                    {repairCertificates.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {repairCertificates.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-3 bg-white px-4 py-2 rounded-lg border"
                          >
                            <span className="text-sm text-gray-700 truncate">
                              {file.name}
                            </span>

                            <div className="flex items-center gap-2">
                              <CheckCircleRoundedIcon className="text-green-600" />
                              <button
                                type="button"
                                onClick={() => {
                                  setRepairCertificates((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <CloseRoundedIcon style={{ fontSize: 16 }} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* INFO */}
                <div
                  className="
                    rounded-[24px]

                    border border-[#F4D8A7]

                    bg-[#FFF8EA]

                    p-5
                  "
                >

                  <div className="flex gap-3">

                    <HandymanRoundedIcon
                      style={{
                        color: "#EA8A00",
                        fontSize: 20,
                      }}
                    />

                    <p
                      className="
                        text-sm
                        leading-relaxed
                        text-[#9A6700]
                      "
                    >
                      Repairs increase the product
                      circularity score.

                      <span className="font-black">
                        {" "}
                        +15 Circle Credits{" "}
                      </span>

                      will be added after blockchain
                      confirmation.
                    </p>

                  </div>

                </div>

              </div>

              {/* FOOTER */}
              <div
                className="
                  sticky bottom-0
                  z-20

                  bg-white

                  border-t border-[#F2F2F2]

                  p-4 sm:px-7

                  flex flex-col-reverse
                  sm:flex-row

                  items-stretch
                  sm:items-center

                  justify-end

                  gap-3
                "
              >

                <button
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="
                    h-[52px]

                    px-6

                    rounded-2xl

                    text-sm
                    font-bold

                    text-[#6B7280]
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={createJob}
                  className="
                    h-[56px]

                    px-7

                    rounded-2xl

                    bg-[#166B2D]
                    text-white

                    text-sm
                    font-black

                    tracking-[0.12em]

                    shadow-[0_15px_30px_rgba(22,107,45,0.25)]
                  "
                >
                  SIGN & PUSH BLOCKCHAIN
                </button>

              </div>

            </div>

          </div>
        </>
      )}

      {/* VIEW DETAILS SIDE PANEL */}
      {selectedJob && (
        <>
          <div
            onClick={() => setSelectedJob(null)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
          />

          <div className="fixed inset-y-0 right-0 z-[9999] flex">
            <div className="w-full max-w-2xl h-full bg-[#F9FAFB] flex flex-col">
              
              {/* HEADER */}
              <div className="px-6 py-5 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#EAF7EE] text-[#166B2D] flex items-center justify-center flex-shrink-0">
                      <HandymanRoundedIcon style={{ fontSize: 20 }} />
                    </div>
                    <div>
                      <h2 className="font-bold text-[20px] text-gray-900">Service Queue Details</h2>
                      <p className="text-xs text-gray-400 mt-1">Real-time repair center operations</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedJob(null)} 
                    className="text-gray-400 hover:text-gray-700 flex-shrink-0"
                  >
                    <CloseRoundedIcon />
                  </button>
                </div>

                <div className="relative">
                  <SearchRoundedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                  <input
                    placeholder="Search job ID, garment, technician..."
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm outline-none focus:border-[#166B2D]"
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto px-4 py-5">
                <div className="rounded-2xl border border-[#D4E7D7] bg-white overflow-hidden">
                  
                  {/* CARD HEADER */}
                  <div className="p-4 flex items-start justify-between border-b border-gray-100">
                    <div className="flex gap-3 flex-1 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#166B2D] mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-[15px] text-gray-800">{selectedJob.id}</p>
                          <StatusChip status={selectedJob.status} />
                        </div>
                        <p className="text-sm text-gray-400 mt-1.5">
                          {selectedJob.passport} · <span className="font-bold text-[#166B2D]">{selectedJob.garment}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-gray-300 whitespace-nowrap ml-2">{selectedJob.date}</p>
                  </div>

                  {/* EXPANDED DETAILS */}
                  <div className="p-4">
                    <div className="border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <DetailBox label="SERVICE TYPE" value={selectedJob.service || selectedJob.type} />
                        <DetailBox label="TECHNICIAN" value={selectedJob.technician} />
                        <DetailBox label="DURATION" value={selectedJob.duration} />
                        <DetailBox label="PRICE" value={selectedJob.price} />
                        <DetailBox label="PHOTOS" value={`${selectedJob.photos?.length || 0} uploaded`} />
                        <DetailBox label="CERTIFICATES" value={`${selectedJob.certificates?.length || 0} uploaded`} />
                      </div>

                      {selectedJob.note && (
                        <div className="col-span-2 mt-3">
                          <DetailBox label="NOTES" value={selectedJob.note} fullWidth />
                        </div>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={() => {
                          openReassignModal(selectedJob);
                          setSelectedJob(null);
                        }}
                        className="flex-1 h-11 rounded-xl bg-[#166B2D] text-white text-xs font-bold tracking-[2px] flex items-center justify-center gap-2 hover:bg-[#0F3D1E] transition"
                      >
                        <PersonOutlineRoundedIcon style={{ fontSize: 18 }} />
                        REASSIGN TECHNICIAN
                      </button>

                    </div>
                  </div>

                </div>

              </div>

              {/* FOOTER */}
              <div className="h-[70px] border-t border-gray-200 px-5 flex items-center justify-between bg-white flex-shrink-0">
                <p className="text-sm text-gray-400">
                  Service ID <span className="font-bold text-gray-600">{selectedJob.id}</span>
                </p>
                <p className="text-[11px] font-bold text-gray-300">
                  {selectedJob.status}
                </p>
              </div>

            </div>
          </div>
        </>
      )}

      {/* REASSIGN MODAL */}
      {showReassignModal && reassignJob && (
        <>
          <div
            onClick={closeReassignModal}
            className="fixed inset-0 bg-black/35 backdrop-blur-[3px] z-[9998]"
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-[28px] shadow-[0_28px_80px_rgba(0,0,0,0.28)] border-2 border-[#DFF6E9] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#E6F4EA] bg-[#F9FEFB]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#EAF7EE] text-[#166B2D] flex items-center justify-center flex-shrink-0">
                      <PersonOutlineRoundedIcon style={{ fontSize: 20 }} />
                    </div>

                    <div>
                      <h3 className="text-[20px] leading-none font-black text-[#111827]">Reassign Technician</h3>
                      <p className="text-xs text-[#8B95A7] mt-2">{reassignJob.id} · {reassignJob.garment}</p>
                    </div>
                  </div>

                  <button
                    onClick={closeReassignModal}
                    className="w-10 h-10 rounded-xl border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F3F4F6] flex items-center justify-center transition"
                  >
                    <CloseRoundedIcon style={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="rounded-2xl border border-[#E6F4EA] bg-[#FBFDFB] p-4">
                  <p className="text-[11px] tracking-[0.12em] font-black text-[#6B7280] mb-3">ASSIGN TO</p>

                  <select
                    value={selectedTechnician}
                    onChange={(e:any) => setSelectedTechnician(e.target.value)}
                    className="w-full h-[52px] rounded-xl border border-[#CFE8D2] bg-white px-4 text-sm font-semibold text-[#111827] outline-none focus:border-[#166B2D]"
                  >
                    <option value="">Select technician</option>
                    {technicians.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  <div className="mt-3 text-xs text-[#8B95A7]">
                    Current: <span className="font-bold text-[#166B2D]">{reassignJob.technician || "Unassigned"}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#E6F4EA] bg-white flex justify-end gap-3">
                <button
                  onClick={closeReassignModal}
                  className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm font-bold text-[#6B7280] hover:bg-[#F9FAFB]"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!selectedTechnician) { setToast({ message: 'Select a technician', type: 'error' }); return; }
                    try {
                      await updateJob(reassignJob.id, { technician: selectedTechnician });
                      setToast({ message: 'Technician reassigned', type: 'success' });
                    } catch (err) {
                      setToast({ message: err instanceof Error ? err.message : 'Failed to reassign', type: 'error' });
                    }
                    closeReassignModal();
                  }}
                  className="h-11 px-6 rounded-xl bg-[#166B2D] text-white text-xs font-black tracking-[0.12em] hover:bg-[#0F3D1E]"
                >
                  SAVE REASSIGNMENT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

      

function GreenTag({ children }: any) {
  return (
    <span
      className="
        h-6
        px-2

        rounded-lg

        bg-[#EEF7F1]
        text-[#166B2D]

        text-[10px]
        font-black

        flex items-center
      "
    >
      {children}
    </span>
  );
}

function StatusChip({ status }: any) {
  const styles: any = {
    COMPLETED: { bg: "#EAF7EE", color: "#16A34A" },
    "IN PROGRESS": { bg: "#FFF4E6", color: "#EA8A00" },
    QUEUED: { bg: "#EEF4FF", color: "#2563EB" },
  };

  return (
    <div
      className="h-8 px-4 rounded-xl text-[11px] font-black tracking-[0.10em] flex items-center whitespace-nowrap"
      style={{ background: styles[status]?.bg, color: styles[status]?.color }}
    >
      {status}
    </div>
  );
}

function MenuBtn({
  icon,
  label,
  onClick,
}: any) {

  return (
    <button
      type="button"

      onClick={(e) => {

        e.stopPropagation();

        if (onClick) {
          onClick();
        }

      }}

      className="
        w-full
        min-h-[56px]

        px-5

        flex items-center
        gap-3

        hover:bg-[#F8F8F8]

        text-sm
        font-semibold

        text-[#4B5563]

        transition-all

        active:scale-[0.98]
      "
    >

      <span className="text-[#6B7280]">
        {icon}
      </span>

      <span>
        {label}
      </span>

    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: any) {
  return (
    <div>

      <p
        className="
          text-[11px]
          tracking-[0.14em]
          font-black
          text-[#6B7280]
          mb-3
        "
      >
        {label}
      </p>

      <select
        value={value}
        onChange={onChange}
        className="
          w-full
          h-[58px]

          rounded-2xl

          border border-[#ECECEC]

          bg-[#FAFAFA]

          px-5

          outline-none

          focus:border-[#166B2D]
        "
      >

        {options.map((option: string) => (
          <option key={option}>
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>

      <p
        className="
          text-[11px]
          tracking-[0.14em]
          font-black
          text-[#6B7280]
          mb-3
        "
      >
        {label}
      </p>

      <textarea
        value={value}
        onChange={onChange}
        rows={4}
        className="
          w-full

          rounded-2xl

          border border-[#ECECEC]

          bg-[#FAFAFA]

          p-5

          outline-none
          resize-none

          focus:border-[#166B2D]
        "
      />

    </div>
  );
}

function InfoCard({ label, value }: any) {
  return (
    <div className="rounded-xl bg-[#F9F9F9] border border-[#ECECEC] p-3">
      <p className="text-[11px] text-[#9CA3AF] font-semibold">{label}</p>
      <p className="text-sm font-bold text-[#111827] mt-1.5 break-words">{value || "—"}</p>
    </div>
  );
}

function DetailBox({ label, value, fullWidth }: any) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4">
        <p className="text-[11px] tracking-[0.12em] text-[#A4AAB5] font-bold">{label}</p>
        <p className="mt-2 text-sm font-semibold text-[#111827] break-all">{value || "N/A"}</p>
      </div>
    </div>
  );
}
