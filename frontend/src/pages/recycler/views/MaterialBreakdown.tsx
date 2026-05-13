import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

/* ICONS */
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

export default function MaterialBreakdown() {

  const [search, setSearch] =
    useState("");

  const [selectedId, setSelectedId] =
    useState("");
  const [apiError, setApiError] = useState("");

  const fallbackPassports = [

    {
      id: "GP-9811",
      garment: "Eco Denim Jacket",
      company: "DenimKind",
      weight: "0.82 kg",

      verified: true,
      hazardous: false,

      metrics: {
        carbon: "6.1 kg CO₂e",
        water: "18.0 L",
        recyclability: "87%",
        energy: "2.4 kWh",
      },

      materials: [

        {
          name: "Organic Cotton",
          type: "NATURAL",
          value: 78,
          barColor: "#1F6B2A",

          badge: "Extractable",
          badgeBg: "#EAF7EE",
          badgeColor: "#16A34A",
        },

        {
          name: "Elastane",
          type: "SYNTHETIC",
          value: 14,
          barColor: "#2D74DA",

          badge: "Non-Extract",
          badgeBg: "#F4F4F5",
          badgeColor: "#9CA3AF",
        },

        {
          name: "Metal Hardware",
          type: "METAL",
          value: 8,
          barColor: "#B95D10",

          badge: "Extractable",
          badgeBg: "#EAF7EE",
          badgeColor: "#16A34A",
        },

      ],
    },

    {
      id: "GP-9855",
      garment: "Linen Shirt",
      company: "Naturalia",
      weight: "0.45 kg",

      verified: true,
      hazardous: true,

      metrics: {
        carbon: "3.5 kg CO₂e",
        water: "10.1 L",
        recyclability: "65%",
        energy: "1.1 kWh",
      },

      materials: [

        {
          name: "Linen",
          type: "NATURAL",
          value: 65,
          barColor: "#1F6B2A",

          badge: "Extractable",
          badgeBg: "#EAF7EE",
          badgeColor: "#16A34A",
        },

        {
          name: "Polyester",
          type: "SYNTHETIC",
          value: 30,
          barColor: "#2D74DA",

          badge: "Non-Extract",
          badgeBg: "#F4F4F5",
          badgeColor: "#9CA3AF",
        },

        {
          name: "Dye Chemicals",
          type: "CHEMICAL",
          value: 5,
          barColor: "#DC2626",

          badge: "Non-Extract",
          badgeBg: "#F4F4F5",
          badgeColor: "#9CA3AF",
        },

      ],
    },

    {
      id: "GP-9777",
      garment: "Wool Blend Coat",
      company: "NordicWool",
      weight: "1.20 kg",

      verified: true,
      hazardous: false,

      metrics: {
        carbon: "4.8 kg CO₂e",
        water: "22.5 L",
        recyclability: "91%",
        energy: "3.6 kWh",
      },

      materials: [

        {
          name: "Merino Wool",
          type: "NATURAL",
          value: 60,
          barColor: "#1F6B2A",

          badge: "Extractable",
          badgeBg: "#EAF7EE",
          badgeColor: "#16A34A",
        },

        {
          name: "rPET Polyester",
          type: "RECYCLED",
          value: 35,
          barColor: "#7C3AED",

          badge: "Extractable",
          badgeBg: "#EAF7EE",
          badgeColor: "#16A34A",
        },

        {
          name: "Lining Cotton",
          type: "NATURAL",
          value: 5,
          barColor: "#059669",

          badge: "Extractable",
          badgeBg: "#EAF7EE",
          badgeColor: "#16A34A",
        },

      ],
    },

  ];

  const [passports, setPassports] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any>("/recycler/materials")
      .then((data) => {
        setApiError("");
        if (data.passports?.length) {
          setPassports(data.passports);
          setSelectedId(data.passports[0].id);
        }
      })
      .catch((error) => {
        console.error("Failed to load recycler materials", error);
        setApiError(error instanceof Error ? error.message : "Failed to load recycler materials");
      });
  }, []);

  const filteredPassports = useMemo(() => {

    return passports.filter((item) => {

      return (
        item.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.garment
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    });

  }, [passports, search]);

  const selectedPassport =
    passports.find(
      (item) =>
        item.id === selectedId
    );

  return (
    <div className="space-y-5 ">
      {apiError && (
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-sm font-bold text-[#B91C1C]">
          {apiError}
        </div>
      )}


      {/* CONTENT */}
      <div
        className="
          grid

          grid-cols-1
          xl:grid-cols-[340px_1fr]

          gap-4
        "
      >

        {/* LEFT */}
        <div
          className="
            bg-white

            border border-[#ECECEC]

            rounded-[22px]

            overflow-hidden

            shadow-[0_8px_25px_rgba(0,0,0,0.03)]
          "
        >

          {/* HEADER */}
          <div
            className="
              px-4
              py-4

              border-b border-[#F3F4F6]
            "
          >

            <h2
              className="
                text-[14px]

                font-black

                text-[#111827]
              "
            >
              Material Passports
            </h2>

            <p
              className="
                mt-1

                text-[10px]

                text-[#9CA3AF]
              "
            >
              3 loaded
            </p>

          </div>

          {/* LIST */}
          <div>

            {filteredPassports.map((item) => {

              const active =
                selectedId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setSelectedId(item.id)
                  }
                  className={`
                    w-full

                    h-[78px]

                    px-4

                    border-b border-[#F5F5F5]

                    flex items-center
                    justify-between

                    transition-all

                    ${
                      active
                        ? "bg-[#F7FBF8] border-[#166B2D]"
                        : "hover:bg-[#FAFAFA]"
                    }
                  `}
                  style={{
                    borderLeft: active
                      ? "2px solid #166B2D"
                      : "",
                  }}
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        w-10 h-10

                        rounded-[14px]

                        flex items-center justify-center

                        ${
                          active
                            ? "bg-[#166B2D] text-white"
                            : "bg-[#F4F6F8] text-[#A0A6B2]"
                        }
                      `}
                    >

                      <LayersRoundedIcon
                        style={{ fontSize: 18 }}
                      />

                    </div>

                    <div className="text-left">

                      <h3
                        className="
                          text-[12px]

                          font-black

                          text-[#111827]
                        "
                      >
                        {item.id}
                      </h3>

                      <p
                        className="
                          mt-1

                          text-[10px]

                          text-[#A0A6B2]
                        "
                      >
                        {item.garment}
                      </p>

                    </div>

                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2">

                    {item.hazardous && (

                      <ErrorOutlineRoundedIcon
                        style={{
                          color: "#EF4444",
                          fontSize: 15,
                        }}
                      />

                    )}

                  </div>

                </button>
              );
            })}

          </div>

        </div>

        {/* RIGHT */}
        {selectedPassport && (

          <div className="space-y-4">

            {/* MATERIAL CARD */}
            <div
              className="
                bg-white

                border border-[#ECECEC]

                rounded-[22px]

                p-4

                shadow-[0_8px_25px_rgba(0,0,0,0.03)]
              "
            >

              {/* HEADER */}
              <div
                className="
                  flex flex-col
                  xl:flex-row

                  xl:items-start
                  xl:justify-between

                  gap-3
                "
              >

                <div>

                  <h1
                    className="
                      text-[22px]

                      font-black

                      text-[#111827]
                    "
                  >
                    {selectedPassport.garment}
                  </h1>

                  <p
                    className="
                      mt-1

                      text-[10px]

                      text-[#A0A6B2]
                    "
                  >
                    {selectedPassport.id}
                    {" · "}
                    {selectedPassport.company}
                    {" · "}
                    {selectedPassport.weight}
                  </p>

                </div>

                {/* BADGES */}
                <div className="flex items-center gap-2">

                  {selectedPassport.hazardous && (

                    <div
                      className="
                        h-6

                        px-2

                        rounded-full

                        bg-[#FFF1F1]

                        text-[#EF4444]

                        text-[9px]

                        font-black

                        tracking-[0.10em]

                        flex items-center gap-1
                      "
                    >

                      <ErrorOutlineRoundedIcon
                        style={{ fontSize: 12 }}
                      />

                      HAZARDOUS

                    </div>

                  )}

                  {selectedPassport.verified && (

                    <div
                      className="
                        h-6

                        px-3

                        rounded-full

                        bg-[#EAF7EE]

                        text-[#16A34A]

                        text-[9px]

                        font-black

                        tracking-[0.10em]

                        flex items-center
                      "
                    >
                      VERIFIED
                    </div>

                  )}

                </div>

              </div>

              {/* MATERIALS */}
              <div className="mt-7 space-y-6 px-1">

                {selectedPassport.materials.map(
                  (
                    material: any,
                    index: number
                  ) => (

                    <div key={index}>

                      {/* TOP */}
                      <div
                        className="
                            flex items-center
                            justify-between

                            gap-4

                            mb-2
                        "
                        >

                        {/* LEFT */}
                        <div
                          className="
                            flex items-center gap-2
                          "
                        >

                          <div
                            className="
                              w-2 h-2

                              rounded-full
                            "
                            style={{
                              background:
                                material.barColor,
                            }}
                          />

                          <h3
                            className="
                              text-[12px]

                              font-black

                              text-[#111827]
                            "
                          >
                            {material.name}
                          </h3>

                          <p
                            className="
                              text-[9px]

                              font-black

                              text-[#A0A6B2]
                            "
                          >
                            {material.type}
                          </p>

                        </div>

                        {/* RIGHT */}
                        <div
                          className="
                            flex items-center gap-3
                          "
                        >

                          <div
                            className="
                              px-2 py-[3px]

                              rounded-[6px]

                              text-[8px]

                              font-black
                            "
                            style={{
                              background:
                                material.badgeBg,

                              color:
                                material.badgeColor,
                            }}
                          >
                            {material.badge}
                          </div>

                          <p
                            className="
                              text-[11px]

                              font-black
                            "
                            style={{
                              color:
                                material.barColor,
                            }}
                          >
                            {material.value}%
                          </p>

                        </div>

                      </div>

                      {/* BAR */}
                      <div
                        className="
                            mt-3

                            h-[6px]

                            rounded-full

                            bg-[#ECECEC]

                            overflow-hidden
                        "
                        >

                        <div
                          className="
                            h-full

                            rounded-full
                          "
                          style={{
                            width: `${material.value}%`,
                            background:
                              material.barColor,
                          }}
                        />

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* METRICS */}
            <div
              className="
                grid

                grid-cols-2
                xl:grid-cols-4

                gap-3
              "
            >

              <MetricCard
                icon={<EnergySavingsLeafRoundedIcon />}
                iconBg="#EAF7EE"
                iconColor="#22C55E"
                title="CO₂ IMPACT"
                value={
                  selectedPassport.metrics
                    .carbon
                }
              />

              <MetricCard
                icon={
                  <WaterDropRoundedIcon />
                }
                iconBg="#EEF4FF"
                iconColor="#3B82F6"
                title="WATER RECOVERED"
                value={
                  selectedPassport.metrics
                    .water
                }
              />

              <MetricCard
                icon={
                  <AutoAwesomeRoundedIcon />
                }
                iconBg="#F5EFFF"
                iconColor="#A855F7"
                title="RECYCLABILITY"
                value={
                  selectedPassport.metrics
                    .recyclability
                }
              />

              <MetricCard
                icon={<BoltRoundedIcon />}
                iconBg="#FFF4E6"
                iconColor="#F59E0B"
                title="ENERGY RECOVERED"
                value={
                  selectedPassport.metrics
                    .energy
                }
              />

            </div>

            {/* DOWNLOAD */}
            <div
              className="
                flex items-center gap-3
              "
            >

              <button
                className="
                  flex-1

                  h-[30px]

                  rounded-[12px]

                  bg-[#166B2D]

                  text-white

                  text-[10px]

                  tracking-[0.14em]

                  font-black

                  flex items-center
                  justify-center

                  gap-2

                  shadow-[0_10px_25px_rgba(22,107,45,0.18)]
                "
              >

                <DownloadRoundedIcon
                  style={{ fontSize: 14 }}
                />

                DOWNLOAD REPORT

              </button>

              <button
                className="
                  w-[30px]
                  h-[30px]

                  rounded-[10px]

                  border border-[#E5E7EB]

                  bg-white

                  flex items-center justify-center

                  text-[#9CA3AF]
                "
              >

                <OpenInNewRoundedIcon
                  style={{ fontSize: 14 }}
                />

              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

/* ===================================== */

function MetricCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
}: any) {

  return (
    <div
      className="
        h-[96px]

        bg-white

        border border-[#ECECEC]

        rounded-[18px]

        flex flex-col
        items-center
        justify-center

        shadow-[0_3px_10px_rgba(0,0,0,0.03)]

        transition-all

        hover:translate-y-[-1px]
      "
    >

      {/* ICON */}
      <div
        className="
          w-[24px]
          h-[24px]

          rounded-[8px]

          flex items-center justify-center

          mb-3
        "
        style={{
          background: iconBg,
          color: iconColor,
        }}
      >

        <div className="scale-[0.78]">
          {icon}
        </div>

      </div>

      {/* TITLE */}
      <p
        className="
          text-[8px]

          tracking-[0.16em]

          font-black

          text-[#B1B7C3]

          leading-none
        "
      >
        {title}
      </p>

      {/* VALUE */}
      <h3
        className="
          mt-3

          text-[14px]

          font-black

          text-[#111827]

          leading-none
        "
      >
        {value}
      </h3>

    </div>
  );
}
