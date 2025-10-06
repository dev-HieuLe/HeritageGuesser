import React from "react";

const heritages = [
  {
    name: "Ha Long Bay",
    type: "Natural Heritage",
    desc: "A UNESCO World Heritage site famous for its emerald waters and limestone islands.",
    duration: "2 hours",
    level: "Beginner Friendly",
  },
  {
    name: "Hoi An Ancient Town",
    type: "Cultural Heritage",
    desc: "A well-preserved example of a Southeast Asian trading port from the 15th–19th centuries.",
    duration: "1.5 hours",
    level: "Beginner Friendly",
  },
  {
    name: "My Son Sanctuary",
    type: "Cultural Heritage",
    desc: "The remains of ancient Hindu temples constructed by the Champa civilization.",
    duration: "2 hours",
    level: "Intermediate",
  },
  {
    name: "Phong Nha – Ke Bang National Park",
    type: "Natural Heritage",
    desc: "Famous for its caves and underground rivers, showcasing breathtaking karst landscapes.",
    duration: "3 hours",
    level: "Intermediate",
  },
  {
    name: "Hue Imperial City",
    type: "Cultural Heritage",
    desc: "The former imperial capital of Vietnam, home to ancient citadels and royal tombs.",
    duration: "2 hours",
    level: "Beginner Friendly",
  },
  {
    name: "Trang An Landscape Complex",
    type: "Mixed Heritage",
    desc: "A stunning blend of cultural, historical, and natural values with cave systems and temples.",
    duration: "2.5 hours",
    level: "Intermediate",
  },
];

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-[#000221] text-white py-12 px-6">
      <h1 className="text-3xl font-bold mb-10 text-center">Vietnam Heritage Study</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {heritages.map((h, index) => (
          <div
            key={index}
            className="bg-[#161b22] p-6 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <span className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full">
              {h.type}
            </span>

            <h2 className="mt-4 text-2xl font-bold">{h.name}</h2>

            <p className="mt-3 text-gray-300 text-sm leading-relaxed">{h.desc}</p>

            <div className="flex items-center justify-between mt-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <span className="material-icons text-lg">bar_chart</span>
                {h.level}
              </div>
              <div>{h.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
