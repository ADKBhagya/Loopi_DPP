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
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function ServiceQueue() {
  const [search, setSearch] = useState("");

  const [repairPhotos, setRepairPhotos] = useState<any[]>([]);
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

  const [jobs, setJobs] = useState([
    {
      id: "REP-4404",
      passport: "GP-9855",
      garment: "Organic Hoodie",
      type: "Hem Alteration",
      technician: "Mia Albers",
      duration: "2h",
      price: "€22",
      status: "QUEUED",
      note:
        "Sleeve hem needs precision adjustment.",
      date: "2026-03-23",
      color: "#2563EB",
    },

    {
      id: "REP-4405",
      passport: "GP-9812",
      garment: "Eco Cotton Coat",
      type: "Lining",
      technician: "Jonas Keller",
      duration: "3h",
      price: "€34",
      status: "QUEUED",
      note:
        "Inner fabric requires replacement.",
      date: "2026-03-24",
      color: "#2563EB",
    },

    {
      id: "REP-4406",
      passport: "GP-9881",
      garment: "Denim Jacket",
      type: "Mending",
      technician: "Erik Lund",
      duration: "1h",
      price: "€14",
      status: "QUEUED",
      note:
        "Minor tear repair near left sleeve.",
      date: "2026-03-24",
      color: "#2563EB",
    },
  ]);

  const [newJob, setNewJob] = useState({
    passport: "GP-9821",
    garment: "Recycled Wool Blazer",
    type: "Mending",
    technician: "Erik Lund",
    duration: "2h",
    price: "€20",
    note: "",
  });

  useEffect(() => {
    apiFetch<any>("/repair-center/queue")
      .then((data) => {
        setJobs(data.jobs || []);
        setTotalServices(data.stats?.totalServices || data.jobs?.length || 0);
      })
      .catch((error) => {
        console.error("Failed to load repair queue", error);
      });
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

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const value = search.toLowerCase();

      return (
        job.id.toLowerCase().includes(value) ||
        job.passport.toLowerCase().includes(value) ||
        job.type.toLowerCase().includes(value) ||
        job.technician.toLowerCase().includes(value)
      );
    });
  }, [jobs, search]);

  const createJob = async () => {
    try {
      const data = await apiFetch<any>("/repair-center/queue", {
        method: "POST",
        body: JSON.stringify({
          ...newJob,
          service: newJob.type,
          status: "QUEUED",
        }),
      });

      setJobs((prev) => [data.job, ...prev]);
      setTotalServices((value) => value + 1);
      setShowCreateModal(false);
      setRepairPhotos([]);
      setNewJob({
        passport: "GP-9821",
        garment: "Recycled Wool Blazer",
        type: "Mending",
        technician: "Erik Lund",
        duration: "2h",
        price: "€20",
        note: "",
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create repair job");
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
      alert(error instanceof Error ? error.message : "Failed to update repair job");
    }
  };

  const removeFromQueue = (jobId: string) => {
    setJobs((prev) =>
      prev.filter((job) => job.id !== jobId)
    );

    setSelectedJob(null);

    setShowMenu("");
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-10">

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
        {filteredJobs.map((job) => (
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
  className="
    w-10 h-10

    rounded-xl

    hover:bg-[#F3F4F6]

    flex items-center justify-center

    transition-all

    border border-[#ECECEC]

    bg-white

    relative

    z-[9998]
  "
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

      z-[999999]
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
        onScan={() => {

          setScannerOpen(false);

          setTimeout(() => {
            setShowCreateModal(true);
          }, 400);

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
              backdrop-blur-[8px]
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
                      GP-9821 · RECYCLED WOOL BLAZER
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
                    md:grid-cols-2
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

                {/* PHOTOS */}
                <div>

                  <div
                    className="
                      flex flex-col sm:flex-row
                      sm:items-center
                      justify-between
                      gap-3
                      mb-4
                    "
                  >

                    <p
                      className="
                        text-[11px]
                        tracking-[0.14em]
                        font-black
                        text-[#6B7280]
                      "
                    >
                      PHOTO EVIDENCE
                    </p>

                    <label
                      className="
                        h-[40px]
                        px-4

                        rounded-xl

                        bg-[#166B2D]
                        text-white

                        text-xs
                        font-black

                        tracking-[0.10em]

                        flex items-center justify-center
                        gap-2

                        cursor-pointer
                      "
                    >

                      <AddRoundedIcon
                        style={{ fontSize: 16 }}
                      />

                      ADD PHOTOS

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e: any) => {

                          const files = Array.from(
                            e.target.files
                          );

                          setRepairPhotos((prev) => [
                            ...prev,
                            ...files,
                          ]);

                        }}
                      />

                    </label>

                  </div>

                  {repairPhotos.length === 0 ? (

                    <label
                      className="
                        h-[210px]

                        rounded-[28px]

                        border-2 border-dashed
                        border-[#D7DCE2]

                        bg-[#FAFAFA]

                        flex flex-col
                        items-center justify-center

                        cursor-pointer
                      "
                    >

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e: any) => {

                          const files = Array.from(
                            e.target.files
                          );

                          setRepairPhotos(files);

                        }}
                      />

                      <div
                        className="
                          w-16 h-16
                          rounded-2xl

                          bg-white

                          border border-[#ECECEC]

                          flex items-center justify-center
                        "
                      >
                        <UploadRoundedIcon />
                      </div>

                      <p
                        className="
                          mt-5
                          text-sm
                          font-black
                          text-[#374151]
                        "
                      >
                        Upload Before / After Photos
                      </p>

                      <p
                        className="
                          mt-2
                          text-xs
                          text-[#9CA3AF]
                        "
                      >
                        JPG, PNG · Multiple photos supported
                      </p>

                    </label>

                  ) : (

                    <div
                      className="
                        rounded-[28px]

                        border border-[#ECECEC]

                        bg-[#FAFAFA]

                        p-4
                      "
                    >

                      <div
                        className="
                          grid
                          grid-cols-2
                          sm:grid-cols-3
                          md:grid-cols-4

                          gap-3 sm:gap-4
                        "
                      >

                        {repairPhotos.map(
                          (
                            file: any,
                            index: number
                          ) => (

                            <div
                              key={index}
                              className="
                                relative

                                h-[120px]

                                rounded-2xl

                                overflow-hidden

                                border border-[#ECECEC]

                                bg-white

                                group
                              "
                            >

                              <img
                                src={URL.createObjectURL(
                                  file
                                )}
                                className="
                                  w-full h-full
                                  object-cover
                                "
                              />

                              <button
                                onClick={() => {

                                  setRepairPhotos(
                                    (prev: any) =>
                                      prev.filter(
                                        (
                                          _: any,
                                          i: number
                                        ) =>
                                          i !== index
                                      )
                                  );

                                }}
                                className="
                                  absolute
                                  top-2 right-2

                                  w-8 h-8

                                  rounded-full

                                  bg-black/60
                                  text-white

                                  flex items-center justify-center
                                "
                              >
                                <CloseRoundedIcon
                                  style={{
                                    fontSize: 16,
                                  }}
                                />
                              </button>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

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
    </div>
  );
}

/* COMPONENTS */

function StatusChip({ status }: any) {
  const styles: any = {
    COMPLETED: {
      bg: "#EAF7EE",
      color: "#16A34A",
    },

    "IN PROGRESS": {
      bg: "#FFF4E6",
      color: "#EA8A00",
    },

    QUEUED: {
      bg: "#EEF4FF",
      color: "#2563EB",
    },
  };

  return (
    <div
      className="
        h-8
        px-4

        rounded-xl

        text-[11px]
        font-black

        tracking-[0.10em]

        flex items-center
        whitespace-nowrap
      "
      style={{
        background:
          styles[status]?.bg,

        color:
          styles[status]?.color,
      }}
    >
      {status}
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
