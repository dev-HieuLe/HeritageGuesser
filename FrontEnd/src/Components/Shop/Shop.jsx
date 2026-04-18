import { useState, useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import { useLang } from "../../Context/languageContext";
import t from "../../translations";

const ITEMS = [
  {
    id: "keyboard",
    image: "/Shops/gift_keyboard.png",
    price: 500000,
    nameKey: "keyboard",
    descKey: "keyboardDesc",
  },
  {
    id: "mouse",
    image: "/Shops/mouse_gift.png",
    price: 200000,
    nameKey: "mouse",
    descKey: "mouseDesc",
  },
  {
    id: "tshirt",
    image: "/Shops/tshirt_gift.png",
    price: 4000,
    nameKey: "tshirt",
    descKey: "tshirtDesc",
  },
  {
    id: "tshirt2",
    image: "/Shops/tshirt2_gift.png",
    price: 4000,
    nameKey: "tshirt2",
    descKey: "tshirt2Desc",
  },
  {
    id: "starbucks",
    image: "/Shops/starbuck_gift.png",
    price: 3000,
    nameKey: "starbucks",
    descKey: "starbucksDesc",
  },
  {
    id: "keychain",
    image: "/Shops/keychain_gift.png",
    price: 1000,
    nameKey: "keychain",
    descKey: "keychainDesc",
  },
];

function formatPoints(n) {
  return n.toLocaleString();
}

export default function Shop() {
  const { user } = useContext(AuthContext);
  const { lang } = useLang();
  const tx = t[lang].shop;

  const [selected, setSelected] = useState(null); // item the user clicked
  const [mode, setMode] = useState(null); // "insufficient" | "confirm"

  const userPoints = user?.points ?? 0;

  const handleRedeem = (item) => {
    setSelected(item);
    if (userPoints < item.price) {
      setMode("insufficient");
    } else {
      setMode("confirm");
    }
  };

  const closeModal = () => {
    setSelected(null);
    setMode(null);
  };

  return (
    <div
      className="min-h-screen px-4 sm:px-8 py-10"
      style={{
        backgroundColor: "#12140e",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto mb-10">
        <p
          className="uppercase tracking-widest text-[10px] font-bold mb-2"
          style={{ color: "rgba(162,209,187,0.5)" }}
        >
          {tx.eyebrow}
        </p>
        <h1
          className="font-black text-4xl sm:text-5xl mb-2"
          style={{ color: "#e9c349", letterSpacing: "-0.03em" }}
        >
          {tx.title}
        </h1>
        <p
          className="text-[14px] mb-6"
          style={{
            color: "rgba(192,200,195,0.55)",
            maxWidth: "480px",
            lineHeight: "1.6",
          }}
        >
          {tx.subtitle}
        </p>

        {/* Points balance pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: "rgba(233,195,73,0.1)",
            border: "1px solid rgba(233,195,73,0.25)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: "#e9c349",
              fontSize: "17px",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            stars
          </span>
          <span className="font-black text-[14px]" style={{ color: "#e9c349" }}>
            {formatPoints(userPoints)} {tx.points}
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ITEMS.map((item) => {
          const canAfford = userPoints >= item.price;
          return (
            <div
              key={item.id}
              className="flex flex-col rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#1a1e18",
                border: "1px solid rgba(65,73,68,0.4)",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(233,195,73,0.35)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(65,73,68,0.4)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Image area */}
              <div
                className="relative flex items-center justify-center p-6"
                style={{ backgroundColor: "#12140e", minHeight: "200px" }}
              >
                <img
                  src={item.image}
                  alt={tx.items[item.nameKey]}
                  className="object-contain"
                  style={{ maxHeight: "160px", maxWidth: "100%" }}
                />
                {/* Price badge */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: canAfford
                      ? "rgba(233,195,73,0.15)"
                      : "rgba(65,73,68,0.5)",
                    border: `1px solid ${canAfford ? "rgba(233,195,73,0.35)" : "rgba(65,73,68,0.6)"}`,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: canAfford ? "#e9c349" : "rgba(192,200,195,0.35)",
                      fontSize: "12px",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    stars
                  </span>
                  <span
                    className="font-black text-[11px]"
                    style={{
                      color: canAfford ? "#e9c349" : "rgba(192,200,195,0.35)",
                    }}
                  >
                    {formatPoints(item.price)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-5">
                <h3
                  className="font-black text-[16px] mb-1"
                  style={{ color: "#e3e3d9" }}
                >
                  {tx.items[item.nameKey]}
                </h3>
                <p
                  className="text-[12px] mb-5 flex-1"
                  style={{ color: "rgba(192,200,195,0.5)", lineHeight: "1.5" }}
                >
                  {tx.items[item.descKey]}
                </p>
                <button
                  onClick={() => handleRedeem(item)}
                  className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95"
                  style={{
                    backgroundColor: canAfford
                      ? "#e9c349"
                      : "rgba(42,50,47,0.8)",
                    color: canAfford ? "#12140e" : "rgba(192,200,195,0.3)",
                    border: canAfford ? "none" : "1px solid rgba(65,73,68,0.4)",
                    cursor: "pointer",
                  }}
                >
                  {canAfford ? tx.redeem : tx.notEnough}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal ── */}
      {selected && mode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(8,11,8,0.85)",
            backdropFilter: "blur(12px)",
          }}
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl p-8 relative"
            style={{
              backgroundColor: "#1a1e18",
              border: "1px solid rgba(65,73,68,0.5)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-transparent border-none cursor-pointer material-symbols-outlined"
              style={{ color: "rgba(162,209,187,0.4)", fontSize: "22px" }}
            >
              close
            </button>

            {mode === "insufficient" ? (
              <>
                <div className="text-center mb-6">
                  <span
                    className="material-symbols-outlined mb-3 block"
                    style={{
                      color: "#ffb4a9",
                      fontSize: "52px",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    sentiment_dissatisfied
                  </span>
                  <h2
                    className="font-black text-[22px] mb-2"
                    style={{ color: "#ffb4a9" }}
                  >
                    {tx.modal.notEnoughTitle}
                  </h2>
                  <p
                    className="text-[13px]"
                    style={{
                      color: "rgba(192,200,195,0.6)",
                      lineHeight: "1.6",
                    }}
                  >
                    {tx.modal.notEnoughBody
                      .replace("{need}", formatPoints(selected.price))
                      .replace("{have}", formatPoints(userPoints))
                      .replace(
                        "{diff}",
                        formatPoints(selected.price - userPoints),
                      )}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-[11px]"
                  style={{
                    backgroundColor: "rgba(42,50,47,0.8)",
                    color: "#a2d1bb",
                    border: "1px solid rgba(162,209,187,0.2)",
                    cursor: "pointer",
                  }}
                >
                  {tx.modal.close}
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <img
                    src={selected.image}
                    alt={tx.items[selected.nameKey]}
                    className="mx-auto mb-4 object-contain"
                    style={{ maxHeight: "100px" }}
                  />
                  <h2
                    className="font-black text-[22px] mb-1"
                    style={{ color: "#e9c349" }}
                  >
                    {tx.modal.confirmTitle}
                  </h2>
                  <p
                    className="text-[13px] mb-1"
                    style={{ color: "rgba(192,200,195,0.6)" }}
                  >
                    {tx.items[selected.nameKey]} ·{" "}
                    <span style={{ color: "#e9c349", fontWeight: "700" }}>
                      {formatPoints(selected.price)} {tx.points}
                    </span>
                  </p>
                  <p
                    className="text-[13px] mt-3"
                    style={{
                      color: "rgba(192,200,195,0.55)",
                      lineHeight: "1.6",
                    }}
                  >
                    {tx.modal.contactIntro}
                  </p>
                </div>

                {/* Contact cards */}
                <div className="space-y-3 mb-6">
                  <a
                    href="mailto:heritageguessr@gmail.com"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-colors"
                    style={{
                      backgroundColor: "rgba(30,32,26,0.8)",
                      border: "1px solid rgba(65,73,68,0.4)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(162,209,187,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(65,73,68,0.4)")
                    }
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: "#a2d1bb",
                        fontSize: "20px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      mail
                    </span>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: "rgba(162,209,187,0.5)" }}
                      >
                        Email
                      </p>
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: "#e3e3d9" }}
                      >
                        heritageguessr@gmail.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+84123456789"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-colors"
                    style={{
                      backgroundColor: "rgba(30,32,26,0.8)",
                      border: "1px solid rgba(65,73,68,0.4)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(162,209,187,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(65,73,68,0.4)")
                    }
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: "#a2d1bb",
                        fontSize: "20px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      call
                    </span>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: "rgba(162,209,187,0.5)" }}
                      >
                        {tx.modal.phone}
                      </p>
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: "#e3e3d9" }}
                      >
                        +84 123 456 789
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://www.facebook.com/profile.php?id=61568386015819"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-colors"
                    style={{
                      backgroundColor: "rgba(30,32,26,0.8)",
                      border: "1px solid rgba(65,73,68,0.4)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(66,103,178,0.5)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(65,73,68,0.4)")
                    }
                  >
                    {/* Facebook SVG */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#4267B2"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: "rgba(162,209,187,0.5)" }}
                      >
                        Facebook
                      </p>
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: "#e3e3d9" }}
                      >
                        Heritage Guessr
                      </p>
                    </div>
                    <span
                      className="material-symbols-outlined ml-auto"
                      style={{
                        color: "rgba(162,209,187,0.3)",
                        fontSize: "16px",
                      }}
                    >
                      open_in_new
                    </span>
                  </a>
                </div>

                <p
                  className="text-center text-[11px] mb-4"
                  style={{ color: "rgba(192,200,195,0.35)", lineHeight: "1.5" }}
                >
                  {tx.modal.note}
                </p>

                <button
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-[11px]"
                  style={{
                    backgroundColor: "rgba(42,50,47,0.8)",
                    color: "#a2d1bb",
                    border: "1px solid rgba(162,209,187,0.2)",
                    cursor: "pointer",
                  }}
                >
                  {tx.modal.close}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
