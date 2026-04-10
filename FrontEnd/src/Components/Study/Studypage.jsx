import { useState } from "react";

const heritages = [
  {
    name: "Ha Long Bay",
    type: "Natural Heritage",
    typeColor: "#a2d1bb",
    typeBg: "rgba(162,209,187,0.12)",
    desc: "A UNESCO World Heritage site famous for its emerald waters and thousands of limestone islands.",
    duration: "2 hours",
    level: 2,
    levelLabel: "Beginner",
    era: "Geological",
    icon: "landscape",
  },
  {
    name: "Hoi An Ancient Town",
    type: "Cultural Heritage",
    typeColor: "#e9c349",
    typeBg: "rgba(233,195,73,0.12)",
    desc: "A well-preserved example of a Southeast Asian trading port from the 15th–19th centuries.",
    duration: "1.5 hours",
    level: 2,
    levelLabel: "Beginner",
    era: "15th Century",
    icon: "store",
  },
  {
    name: "My Son Sanctuary",
    type: "Cultural Heritage",
    typeColor: "#e9c349",
    typeBg: "rgba(233,195,73,0.12)",
    desc: "The remains of ancient Hindu temples constructed by the Champa civilization.",
    duration: "2 hours",
    level: 4,
    levelLabel: "Intermediate",
    era: "4th–14th Century",
    icon: "temple_hindu",
  },
  {
    name: "Phong Nha – Ke Bang",
    type: "Natural Heritage",
    typeColor: "#a2d1bb",
    typeBg: "rgba(162,209,187,0.12)",
    desc: "Famous for its caves and underground rivers, showcasing breathtaking karst landscapes.",
    duration: "3 hours",
    level: 4,
    levelLabel: "Intermediate",
    era: "Geological",
    icon: "explore",
  },
  {
    name: "Hue Imperial City",
    type: "Cultural Heritage",
    typeColor: "#e9c349",
    typeBg: "rgba(233,195,73,0.12)",
    desc: "The former imperial capital of Vietnam, home to ancient citadels and royal tombs.",
    duration: "2 hours",
    level: 2,
    levelLabel: "Beginner",
    era: "19th Century",
    icon: "account_balance",
  },
  {
    name: "Trang An Landscape",
    type: "Mixed Heritage",
    typeColor: "#ffb4a9",
    typeBg: "rgba(255,180,169,0.12)",
    desc: "A stunning blend of cultural, historical, and natural values with cave systems and temples.",
    duration: "2.5 hours",
    level: 4,
    levelLabel: "Intermediate",
    era: "Ancient",
    icon: "nature",
  },
];

const epochs = ["LY DYNASTY", "HUE IMPERIAL", "CHAMPA ART", "DONG SON", "POST-COLONIAL"];

export default function StudyPage() {
  const [activeEpoch, setActiveEpoch] = useState(null);

  return (
    <div
      className="min-h-screen dot-grid"
      style={{ backgroundColor: "#12140e", color: "#e3e3d9" }}
    >
      {/* Header */}
      <header
        className="flex justify-between items-center px-4 sm:px-10 py-3 sm:py-5 sticky top-16 sm:top-[73px] z-30"
        style={{
          backgroundColor: "#12140e",
          borderBottom: "1px solid rgba(65,73,68,0.4)",
        }}
      >
        <div>
          <p
            className="uppercase tracking-widest font-bold"
            style={{ fontSize: "10px", color: "#a2d1bb" }}
          >
            Academy
          </p>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: "#a2d1bb" }}>
            Study Mode
          </h2>
          <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "13px", marginTop: "2px" }}>
            Refine your knowledge of the Imperial lineage and cultural landmarks.
          </p>
        </div>

        {/* Archival progress */}
        <div
          className="hidden md:flex flex-col gap-1 px-5 py-3 rounded-xl"
          style={{ backgroundColor: "#1e201a", border: "1px solid rgba(65,73,68,0.4)" }}
        >
          <p className="uppercase tracking-widest font-black" style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}>
            Archival Progress
          </p>
          <div className="flex items-center gap-4">
            <div>
              <p style={{ fontSize: "10px", color: "rgba(192,200,195,0.5)" }}>Knowledge Depth</p>
              <p className="font-black" style={{ color: "#a2d1bb" }}>98%</p>
            </div>
            <div style={{ width: "1px", height: "28px", backgroundColor: "rgba(65,73,68,0.5)" }} />
            <div>
              <p style={{ fontSize: "10px", color: "rgba(192,200,195,0.5)" }}>Lessons</p>
              <p className="font-black" style={{ color: "#e9c349" }}>{heritages.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="study-grid grid grid-cols-3 gap-0" style={{ paddingTop: "8px" }}>
        {/* Main content */}
        <div className="col-span-2 px-4 sm:px-10 py-5 sm:py-8">
          {/* Hero instructional card */}
          <div
            className="relative rounded-xl overflow-hidden mb-5 sm:mb-8 p-5 sm:p-8"
            style={{
              backgroundColor: "#1e201a",
              border: "1px solid rgba(65,73,68,0.4)",
            }}
          >
            {/* Decorative background pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 80% 50%, rgba(15,61,46,0.6) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <span
                className="inline-block px-3 py-1 font-black uppercase tracking-widest mb-4"
                style={{
                  backgroundColor: "#bb0308",
                  color: "#ffc8c0",
                  fontSize: "9px",
                  borderRadius: "2px",
                }}
              >
                Instructional Directive
              </span>
              <h1
                className="text-2xl sm:text-4xl font-black leading-tight mb-3"
                style={{ color: "#e3e3d9" }}
              >
                Master the{" "}
                <span style={{ color: "#e9c349" }}>Dynamics</span>
                <br />
                of Ancient Civilizations.
              </h1>
              <p
                className="max-w-lg"
                style={{ color: "rgba(192,200,195,0.7)", fontSize: "14px", lineHeight: "1.6" }}
              >
                Identify the architectural nuances and stylistic hallmarks of the Ly and Tran
                dynasties. Each correct identification deepens your Archival standing.
              </p>
              <button
                className="mt-6 flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest transition-all active:scale-95"
                style={{
                  backgroundColor: "#bb0308",
                  color: "#ffc8c0",
                  borderRadius: "4px",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  boxShadow: "0 4px 20px rgba(187,3,8,0.3)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  bolt
                </span>
                Begin Deep Dive
              </button>
            </div>
          </div>

          {/* Heritage cards grid */}
          <div className="study-cards-grid grid grid-cols-2 gap-3 sm:gap-4">
            {heritages.map((h, index) => (
              <div
                key={index}
                className="group p-5 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: "#1e201a",
                  border: "1px solid rgba(65,73,68,0.4)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#292b24";
                  e.currentTarget.style.borderColor = "rgba(162,209,187,0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1e201a";
                  e.currentTarget.style.borderColor = "rgba(65,73,68,0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: h.typeColor, fontSize: "20px" }}
                    >
                      {h.icon}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded font-black uppercase"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        backgroundColor: h.typeBg,
                        color: h.typeColor,
                      }}
                    >
                      {h.type}
                    </span>
                  </div>
                  <span
                    className="font-black uppercase"
                    style={{ fontSize: "9px", color: "#e9c349", letterSpacing: "0.1em" }}
                  >
                    LVL {String(h.level).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  className="font-black mb-2"
                  style={{ color: "#e3e3d9", fontSize: "15px", lineHeight: "1.3" }}
                >
                  {h.name}
                </h3>

                <p
                  style={{
                    color: "rgba(192,200,195,0.65)",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {h.desc}
                </p>

                {/* Footer */}
                <div
                  className="flex items-center justify-between mt-4 pt-3"
                  style={{ borderTop: "1px solid rgba(65,73,68,0.4)" }}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "rgba(192,200,195,0.4)", fontSize: "14px" }}
                    >
                      history_edu
                    </span>
                    <span style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px" }}>
                      {h.era}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "rgba(192,200,195,0.4)", fontSize: "14px" }}
                    >
                      schedule
                    </span>
                    <span style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px" }}>
                      {h.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div
          className="study-right-sidebar px-4 sm:px-6 py-5 sm:py-8 flex flex-col gap-5 sm:gap-6"
          style={{ borderLeft: "1px solid rgba(65,73,68,0.4)" }}
        >
          {/* High priority epochs */}
          <div>
            <p
              className="uppercase tracking-widest font-black mb-3"
              style={{ fontSize: "10px", color: "rgba(192,200,195,0.5)" }}
            >
              High Priority Epochs
            </p>
            <div className="flex flex-wrap gap-2">
              {epochs.map((epoch) => (
                <button
                  key={epoch}
                  onClick={() => setActiveEpoch(activeEpoch === epoch ? null : epoch)}
                  className="px-3 py-1.5 rounded font-black uppercase transition-all"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    backgroundColor: activeEpoch === epoch ? "#bb0308" : "#1e201a",
                    color: activeEpoch === epoch ? "#ffc8c0" : "rgba(162,209,187,0.7)",
                    border: activeEpoch === epoch
                      ? "1px solid #bb0308"
                      : "1px solid rgba(65,73,68,0.4)",
                    cursor: "pointer",
                  }}
                >
                  {epoch}
                </button>
              ))}
            </div>
          </div>

          {/* Featured artifact */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(233,195,73,0.2)" }}
          >
            <div
              className="h-40 flex items-center justify-center relative"
              style={{ backgroundColor: "#1a1c16" }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "80px",
                  color: "#e9c349",
                  fontVariationSettings: "'FILL' 1",
                  opacity: 0.8,
                }}
              >
                military_tech
              </span>
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at center, rgba(233,195,73,0.1) 0%, transparent 70%)",
                }}
              />
            </div>
            <div className="p-4" style={{ backgroundColor: "#1e201a" }}>
              <p
                className="uppercase tracking-widest font-black mb-1"
                style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}
              >
                Featured Artifact
              </p>
              <h4 className="font-black" style={{ color: "#e9c349", fontSize: "15px" }}>
                Golden Dragon Seal
              </h4>
              <p style={{ color: "rgba(192,200,195,0.6)", fontSize: "11px", marginTop: "4px" }}>
                Imperial insignia of the Nguyen Dynasty — the last royal family of Vietnam.
              </p>
              <div className="flex items-center gap-1 mt-3">
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#bb0308", fontSize: "14px", fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span style={{ color: "rgba(192,200,195,0.5)", fontSize: "10px" }}>
                  3.4k Curators studying
                </span>
              </div>
            </div>
          </div>

          {/* Difficulty legend */}
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: "#1e201a", border: "1px solid rgba(65,73,68,0.4)" }}
          >
            <p
              className="uppercase tracking-widest font-black mb-3"
              style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}
            >
              Difficulty Guide
            </p>
            {[
              { label: "Beginner", color: "#a2d1bb", level: "01–02" },
              { label: "Intermediate", color: "#e9c349", level: "03–05" },
              { label: "Advanced", color: "#ffb4a9", level: "06–08" },
              { label: "Expert", color: "#bb0308", level: "09–10" },
            ].map((d) => (
              <div key={d.label} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span style={{ color: "rgba(192,200,195,0.7)", fontSize: "11px" }}>
                    {d.label}
                  </span>
                </div>
                <span
                  className="font-black"
                  style={{ color: d.color, fontSize: "10px", letterSpacing: "0.1em" }}
                >
                  LVL {d.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
