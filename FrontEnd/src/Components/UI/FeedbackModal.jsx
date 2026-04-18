import { useState } from "react";

export default function FeedbackModal({ tx, onClose }) {
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("idle"); // idle | sending | sent

  const wordCount = (text) =>
    text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const handleSend = async () => {
    if (!feedbackText.trim() || feedbackStatus !== "idle") return;
    setFeedbackStatus("sending");
    await new Promise((r) => setTimeout(r, 800));
    setFeedbackStatus("sent");
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(8,11,8,0.80)",
        backdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-7 relative"
        style={{
          backgroundColor: "#1a1e18",
          border: "1px solid rgba(65,73,68,0.5)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none cursor-pointer material-symbols-outlined"
          style={{ color: "rgba(162,209,187,0.4)", fontSize: "22px" }}
        >
          close
        </button>

        {/* Header */}
        <p
          className="uppercase tracking-widest text-[10px] font-bold mb-1"
          style={{ color: "rgba(162,209,187,0.45)" }}
        >
          Heritage Guessr
        </p>
        <h2
          className="font-black text-[22px] mb-5"
          style={{ color: "#e3e3d9" }}
        >
          {tx.sidebar.feedback}
        </h2>

        {/* Textarea */}
        <textarea
          value={feedbackText}
          onChange={(e) => {
            const words =
              e.target.value.trim() === ""
                ? []
                : e.target.value.trim().split(/\s+/);
            if (words.length <= 100) setFeedbackText(e.target.value);
          }}
          placeholder={tx.sidebar.feedbackPlaceholder}
          rows={5}
          autoFocus
          className="w-full rounded-xl outline-none resize-none text-[13px]"
          style={{
            backgroundColor: "#12140e",
            border: "1px solid rgba(65,73,68,0.5)",
            color: "#e3e3d9",
            padding: "12px 14px",
            fontFamily: "'Be Vietnam Pro', sans-serif",
            lineHeight: "1.6",
          }}
        />

        {/* Word count */}
        <div className="flex justify-end mt-1.5 mb-4">
          <span
            style={{
              fontSize: "11px",
              color:
                wordCount(feedbackText) >= 90
                  ? "#ffb4a9"
                  : "rgba(192,200,195,0.35)",
            }}
          >
            {wordCount(feedbackText)}/100
          </span>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!feedbackText.trim() || feedbackStatus !== "idle"}
          className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95"
          style={{
            backgroundColor:
              feedbackStatus === "sent"
                ? "rgba(162,209,187,0.15)"
                : feedbackText.trim()
                  ? "#a2d1bb"
                  : "rgba(42,50,47,0.8)",
            color:
              feedbackStatus === "sent"
                ? "#a2d1bb"
                : feedbackText.trim()
                  ? "#0e1513"
                  : "rgba(192,200,195,0.3)",
            border: "none",
            cursor:
              feedbackText.trim() && feedbackStatus === "idle"
                ? "pointer"
                : "not-allowed",
          }}
        >
          {feedbackStatus === "sending"
            ? tx.sidebar.feedbackSending
            : feedbackStatus === "sent"
              ? tx.sidebar.feedbackSent
              : tx.sidebar.feedbackSend}
        </button>

        {/* Contact line */}
        <p
          className="mt-4 text-center"
          style={{
            fontSize: "11px",
            color: "rgba(192,200,195,0.4)",
            lineHeight: "1.7",
          }}
        >
          {tx.sidebar.feedbackContact}{" "}
          <a
            href="mailto:heritageguessr@gmail.com"
            style={{
              color: "#a2d1bb",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Gmail
          </a>{" "}
          {tx.sidebar.feedbackOr}{" "}
          <a
            href="https://www.facebook.com/profile.php?id=61568386015819"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#a2d1bb",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Facebook
          </a>
          .
        </p>
      </div>
    </div>
  );
}
