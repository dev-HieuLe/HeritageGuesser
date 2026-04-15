import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";

const inputBase = {
  backgroundColor: "#1e201a",
  color: "#e3e3d9",
  fontSize: "13px",
  fontFamily: "'Be Vietnam Pro', sans-serif",
};

function Field({
  icon,
  type = "text",
  value,
  onChange,
  hasError,
  placeholder,
}) {
  return (
    <div className="relative">
      <span
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "rgba(162,209,187,0.4)", fontSize: "18px" }}
      >
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
        style={{
          ...inputBase,
          border: hasError
            ? "1px solid #bb0308"
            : "1px solid rgba(65,73,68,0.5)",
        }}
        onFocus={(e) => {
          if (!hasError) e.target.style.borderColor = "rgba(162,209,187,0.4)";
        }}
        onBlur={(e) => {
          if (!hasError) e.target.style.borderColor = "rgba(65,73,68,0.5)";
        }}
      />
    </div>
  );
}

function StatusLine({ status }) {
  if (!status) return null;
  return (
    <p
      className="flex items-center gap-1.5"
      style={{
        color: status.type === "success" ? "#a2d1bb" : "#ffb4a9",
        fontSize: "11px",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
        {status.type === "success" ? "check_circle" : "error"}
      </span>
      {status.msg}
    </p>
  );
}

function SaveButton({ saving, label }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="px-6 py-2.5 font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
      style={{
        backgroundColor: "#bb0308",
        color: "#ffc8c0",
        borderRadius: "6px",
        fontSize: "11px",
        border: "none",
        cursor: saving ? "not-allowed" : "pointer",
        boxShadow: "0 4px 20px rgba(187,3,8,0.30)",
      }}
    >
      {saving ? "Saving…" : label}
    </button>
  );
}

function Card({ title, icon, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "#1e201a",
        border: "1px solid rgba(65,73,68,0.4)",
      }}
    >
      <div
        className="flex items-center gap-2 mb-5"
        style={{
          borderBottom: "1px solid rgba(65,73,68,0.3)",
          paddingBottom: "14px",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ color: "#a2d1bb", fontSize: "20px" }}
        >
          {icon}
        </span>
        <h3
          className="font-black uppercase tracking-widest"
          style={{ fontSize: "11px", color: "#a2d1bb" }}
        >
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}

export default function Settings() {
  const { user, setUser, authCheckedOnce } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameStatus, setNameStatus] = useState(null);
  const [nameSaving, setNameSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [emailSaving, setEmailSaving] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwStatus, setPwStatus] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (authCheckedOnce && !user) navigate("/login", { replace: true });
  }, [authCheckedOnce, user, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const call = async (body) =>
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/update-profile`, body, {
      withCredentials: true,
    });

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!name.trim())
      return setNameStatus({ type: "error", msg: "Name cannot be empty" });
    if (name.trim() === user.name)
      return setNameStatus({ type: "error", msg: "No changes made" });
    setNameSaving(true);
    try {
      const res = await call({ name: name.trim() });
      setUser((u) => ({ ...u, name: res.data.user.name }));
      setNameStatus({ type: "success", msg: "Username updated successfully" });
    } catch (err) {
      setNameStatus({
        type: "error",
        msg: err.response?.data?.error || "Failed to update username",
      });
    } finally {
      setNameSaving(false);
    }
  };

  const handleEmailSave = async (e) => {
    e.preventDefault();
    if (!email.trim())
      return setEmailStatus({ type: "error", msg: "Email cannot be empty" });
    if (email.trim() === user.email)
      return setEmailStatus({ type: "error", msg: "No changes made" });
    setEmailSaving(true);
    try {
      const res = await call({ email: email.trim() });
      setUser((u) => ({ ...u, email: res.data.user.email }));
      setEmailStatus({ type: "success", msg: "Email updated successfully" });
    } catch (err) {
      setEmailStatus({
        type: "error",
        msg: err.response?.data?.error || "Failed to update email",
      });
    } finally {
      setEmailSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!pw.current)
      return setPwStatus({
        type: "error",
        msg: "Current password is required",
      });
    if (!pw.next)
      return setPwStatus({ type: "error", msg: "New password is required" });
    if (pw.next.length < 8)
      return setPwStatus({
        type: "error",
        msg: "Password must be at least 8 characters",
      });
    if (pw.next !== pw.confirm)
      return setPwStatus({ type: "error", msg: "Passwords do not match" });
    setPwSaving(true);
    try {
      await call({ currentPassword: pw.current, newPassword: pw.next });
      setPw({ current: "", next: "", confirm: "" });
      setPwStatus({ type: "success", msg: "Password updated successfully" });
    } catch (err) {
      setPwStatus({
        type: "error",
        msg: err.response?.data?.error || "Failed to update password",
      });
    } finally {
      setPwSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#12140e", color: "#e3e3d9" }}
    >
      {/* Header */}
      <header
        className="flex items-center px-4 sm:px-10 py-3 sm:py-5 sticky z-30 mt-10"
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
            Archive
          </p>
          <h2
            className="text-2xl font-black tracking-tight"
            style={{ color: "#a2d1bb" }}
          >
            Settings
          </h2>
        </div>
      </header>

      <main className="px-4 sm:px-10 py-10 max-w-2xl mx-auto flex flex-col gap-4">
        {/* Points summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(233,195,73,0.08) 0%, rgba(162,209,187,0.06) 100%)",
            border: "1px solid rgba(233,195,73,0.2)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{
                  background: "rgba(233,195,73,0.12)",
                  border: "1px solid rgba(233,195,73,0.25)",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: "#e9c349",
                    fontSize: "22px",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  stars
                </span>
              </div>
              <div>
                <p
                  className="uppercase tracking-widest font-bold"
                  style={{ fontSize: "9px", color: "rgba(233,195,73,0.6)" }}
                >
                  Total Points
                </p>
                <p
                  className="font-black"
                  style={{
                    fontSize: "28px",
                    color: "#e9c349",
                    lineHeight: 1.1,
                  }}
                >
                  {(user.points ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p
                style={{
                  fontSize: "10px",
                  color: "rgba(192,200,195,0.45)",
                  lineHeight: 1.7,
                }}
              >
                +5 pts — finish a game
                <br />
                +10 pts — contribute heritage
                <br />
                +5 pts — read a lesson
                <br />
                +10 pts — daily check-in
              </p>
            </div>
          </div>
        </motion.div>

        {/* Username */}
        <Card title="Change Username" icon="badge" delay={0}>
          <form onSubmit={handleNameSave} className="space-y-3">
            <Field
              icon="person"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameStatus(null);
              }}
              hasError={nameStatus?.type === "error"}
            />
            <StatusLine status={nameStatus} />
            <SaveButton saving={nameSaving} label="Save Username" />
          </form>
        </Card>

        {/* Email */}
        <Card title="Change Email" icon="mail" delay={0.08}>
          <form onSubmit={handleEmailSave} className="space-y-3">
            <Field
              icon="mail"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailStatus(null);
              }}
              hasError={emailStatus?.type === "error"}
            />
            <StatusLine status={emailStatus} />
            <SaveButton saving={emailSaving} label="Save Email" />
          </form>
        </Card>

        {/* Password */}
        <Card title="Change Password" icon="lock" delay={0.16}>
          <form onSubmit={handlePasswordSave} className="space-y-3">
            <div>
              <label
                className="block uppercase tracking-widest font-bold mb-1.5"
                style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}
              >
                Current Password
              </label>
              <Field
                icon="lock"
                type="password"
                placeholder="••••••••"
                value={pw.current}
                onChange={(e) => {
                  setPw((p) => ({ ...p, current: e.target.value }));
                  setPwStatus(null);
                }}
                hasError={pwStatus?.type === "error"}
              />
            </div>
            <div>
              <label
                className="block uppercase tracking-widest font-bold mb-1.5"
                style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}
              >
                New Password
              </label>
              <Field
                icon="key"
                type="password"
                placeholder="••••••••"
                value={pw.next}
                onChange={(e) => {
                  setPw((p) => ({ ...p, next: e.target.value }));
                  setPwStatus(null);
                }}
                hasError={pwStatus?.type === "error"}
              />
            </div>
            <div>
              <label
                className="block uppercase tracking-widest font-bold mb-1.5"
                style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}
              >
                Confirm New Password
              </label>
              <Field
                icon="key"
                type="password"
                placeholder="••••••••"
                value={pw.confirm}
                onChange={(e) => {
                  setPw((p) => ({ ...p, confirm: e.target.value }));
                  setPwStatus(null);
                }}
                hasError={pwStatus?.type === "error"}
              />
            </div>
            <StatusLine status={pwStatus} />
            <SaveButton saving={pwSaving} label="Save Password" />
          </form>
        </Card>
      </main>
    </div>
  );
}
