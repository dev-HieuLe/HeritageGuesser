import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import { useLang } from "../Context/languageContext";
import t from "../translations";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);
  const { lang, toggleLang } = useLang();
  const tx = t[lang].login;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!values.email.trim()) newErrors.email = tx.emailRequired;
    if (!values.password.trim()) newErrors.password = tx.passwordRequired;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/login`, values, { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Success") {
          setAuth(true);
          setUser({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            level: res.data.level,
            rank: res.data.rank,
            rank_progress: res.data.rank_progress,
          });
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setErrors({ email: tx.invalidCredentials, password: tx.invalidCredentials });
        } else {
          setErrors({ email: tx.somethingWrong });
        }
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#12140e" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/loginbg.jpeg')", filter: "brightness(0.25) saturate(0.6)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(15,61,46,0.7) 100%)" }}
      />
      <div className="absolute inset-0 dong-son-bg opacity-30" />

      {/* Back to home (top-left) */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[rgba(162,209,187,0.2)] bg-transparent text-[#a2d1bb] text-[12px] font-bold uppercase tracking-[0.1em] transition-colors hover:bg-white/[0.06] hover:border-[rgba(162,209,187,0.4)]"
        style={{ textDecoration: "none" }}
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        {tx.backHome}
      </Link>

      {/* Language toggle (top-right) */}
      <button
        onClick={toggleLang}
        className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[rgba(162,209,187,0.2)] bg-transparent text-[#a2d1bb] text-[12px] font-bold uppercase tracking-[0.1em] cursor-pointer transition-colors hover:bg-white/[0.06] hover:border-[rgba(162,209,187,0.4)]"
      >
        <span className="material-symbols-outlined text-[16px]">language</span>
        {lang === "en" ? "VI" : "EN"}
      </button>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 p-5 sm:p-8 rounded-2xl"
        style={{
          backgroundColor: "rgba(18,20,14,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(65,73,68,0.5)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#e9c349" }}>
            Heritage Guesser
          </h1>
          <p className="uppercase tracking-widest mt-1" style={{ fontSize: "10px", color: "rgba(162,209,187,0.5)" }}>
            {tx.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className="block uppercase tracking-widest font-bold mb-1.5"
              style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}
            >
              {tx.emailLabel}
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(162,209,187,0.4)", fontSize: "18px" }}
              >
                mail
              </span>
              <input
                type="email"
                name="email"
                placeholder="curator@archive.vn"
                value={values.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: "#1e201a",
                  border: errors.email ? "1px solid #bb0308" : "1px solid rgba(65,73,68,0.5)",
                  color: "#e3e3d9",
                  fontSize: "13px",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
                onFocus={(e) => { if (!errors.email) e.target.style.borderColor = "rgba(162,209,187,0.4)"; }}
                onBlur={(e) => { if (!errors.email) e.target.style.borderColor = "rgba(65,73,68,0.5)"; }}
              />
            </div>
            {errors.email && (
              <p className="mt-1" style={{ color: "#ffb4a9", fontSize: "11px" }}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block uppercase tracking-widest font-bold mb-1.5"
              style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}
            >
              {tx.passwordLabel}
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(162,209,187,0.4)", fontSize: "18px" }}
              >
                lock
              </span>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: "#1e201a",
                  border: errors.password ? "1px solid #bb0308" : "1px solid rgba(65,73,68,0.5)",
                  color: "#e3e3d9",
                  fontSize: "13px",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
                onFocus={(e) => { if (!errors.password) e.target.style.borderColor = "rgba(162,209,187,0.4)"; }}
                onBlur={(e) => { if (!errors.password) e.target.style.borderColor = "rgba(65,73,68,0.5)"; }}
              />
            </div>
            {errors.password && (
              <p className="mt-1" style={{ color: "#ffb4a9", fontSize: "11px" }}>{errors.password}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" style={{ accentColor: "#bb0308" }} />
              <span style={{ color: "rgba(192,200,195,0.5)", fontSize: "12px" }}>{tx.rememberMe}</span>
            </label>
            <a href="#" style={{ color: "rgba(162,209,187,0.5)", fontSize: "12px", textDecoration: "none" }}>
              {tx.forgotPassword}
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 font-black uppercase tracking-widest transition-all active:scale-95 mt-2"
            style={{
              backgroundColor: "#bb0308",
              color: "#ffc8c0",
              borderRadius: "6px",
              fontSize: "12px",
              letterSpacing: "0.12em",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(187,3,8,0.35)",
            }}
          >
            {tx.submit}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5" style={{ color: "rgba(65,73,68,0.6)" }}>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(65,73,68,0.4)" }} />
          <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {tx.divider}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(65,73,68,0.4)" }} />
        </div>

        <Link
          to="/register"
          className="w-full block text-center py-3 font-bold uppercase tracking-widest transition-all"
          style={{
            backgroundColor: "transparent",
            color: "#a2d1bb",
            border: "1px solid rgba(162,209,187,0.25)",
            borderRadius: "6px",
            fontSize: "11px",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(162,209,187,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {tx.createAccount}
        </Link>
      </div>
    </div>
  );
};

export default Login;
