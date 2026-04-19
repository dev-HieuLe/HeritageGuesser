import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import { useLang } from "../Context/languageContext";
import t from "../translations";
import { supabase } from "../Config/supabase";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);
  const { lang, toggleLang } = useLang();
  const tx = t[lang].login;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const isMobile = window.innerWidth < 768;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!values.email.trim()) newErrors.email = tx.emailRequired;
    if (!values.password.trim()) newErrors.password = tx.passwordRequired;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const body = isMobile
      ? { ...values, type: "mobile" }
      : { ...values, recaptchaToken: executeRecaptcha ? await executeRecaptcha("login") : null };
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/login`, body, { withCredentials: true })
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
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: "#0d0f0b" }}>
      {/* Background image — full bleed behind both panels */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/loginbg.jpeg')", filter: "brightness(0.18) saturate(0.5)" }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[#a2d1bb] text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
          style={{ textDecoration: "none" }}
        >
          <span className="material-symbols-outlined text-[15px]">arrow_back</span>
          {tx.backHome}
        </Link>
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 text-[#a2d1bb] text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-70 bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">language</span>
          {lang === "en" ? "VI" : "EN"}
        </button>
      </div>

      {/* ── CENTERED FORM PANEL ── */}
      <div className="relative z-10 flex flex-col justify-center items-center w-full px-6 sm:px-12 lg:px-16 pt-20 pb-10"
        style={{
          background: "rgba(10,13,9,0.75)",
          backdropFilter: "blur(32px)",
        }}
      >
        <div className="w-full max-w-[380px] mx-auto">
          <div className="mb-8 text-center">
            <h2 className="font-black text-2xl tracking-tight" style={{ color: "#e9c349" }}>Heritage Guessr</h2>
            <p className="uppercase tracking-widest mt-1" style={{ fontSize: "10px", color: "rgba(162,209,187,0.4)" }}>
              {tx.subtitle}
            </p>
          </div>

          <h2 className="font-black mb-1" style={{ fontSize: "22px", color: "#dde4e0" }}>Sign in</h2>
          <p className="mb-8 text-[13px]" style={{ color: "rgba(192,200,195,0.45)" }}>
            {tx.subtitle}
          </p>

          {/* Google button — primary OAuth CTA at the top */}
          <button
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } })}
            className="w-full flex items-center justify-center gap-3 py-3 font-semibold transition-all active:scale-95 mb-5"
            style={{
              backgroundColor: "#fff",
              color: "#3c4043",
              borderRadius: "8px",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f3f4")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          >
            <GoogleSVG />
            {tx.googleSignIn}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5" style={{ color: "rgba(65,73,68,0.5)" }}>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(65,73,68,0.35)" }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(192,200,195,0.3)" }}>
              {tx.orDivider}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(65,73,68,0.35)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(192,200,195,0.4)" }}>
                {tx.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                placeholder="curator@archive.vn"
                value={values.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: "rgba(30,32,26,0.8)",
                  border: errors.email ? "1px solid rgba(187,3,8,0.7)" : "1px solid rgba(65,73,68,0.4)",
                  color: "#e3e3d9",
                  fontSize: "14px",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
                onFocus={(e) => { if (!errors.email) e.target.style.borderColor = "rgba(162,209,187,0.5)"; }}
                onBlur={(e) => { if (!errors.email) e.target.style.borderColor = "rgba(65,73,68,0.4)"; }}
              />
              {errors.email && <p className="mt-1.5 text-[11px]" style={{ color: "#ffb4a9" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(192,200,195,0.4)" }}>
                  {tx.passwordLabel}
                </label>
                <a href="#" className="text-[11px] transition-opacity hover:opacity-100" style={{ color: "rgba(162,209,187,0.45)", textDecoration: "none" }}>
                  {tx.forgotPassword}
                </a>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: "rgba(30,32,26,0.8)",
                  border: errors.password ? "1px solid rgba(187,3,8,0.7)" : "1px solid rgba(65,73,68,0.4)",
                  color: "#e3e3d9",
                  fontSize: "14px",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
                onFocus={(e) => { if (!errors.password) e.target.style.borderColor = "rgba(162,209,187,0.5)"; }}
                onBlur={(e) => { if (!errors.password) e.target.style.borderColor = "rgba(65,73,68,0.4)"; }}
              />
              {errors.password && <p className="mt-1.5 text-[11px]" style={{ color: "#ffb4a9" }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 font-black uppercase tracking-widest transition-all active:scale-95 mt-1"
              style={{
                backgroundColor: "#bb0308",
                color: "#ffc8c0",
                borderRadius: "8px",
                fontSize: "12px",
                letterSpacing: "0.12em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(187,3,8,0.3)",
              }}
            >
              {tx.submit}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-[13px]" style={{ color: "rgba(192,200,195,0.4)" }}>
            {lang === "en" ? "Don't have an account?" : "Chưa có tài khoản?"}{" "}
            <Link to="/register" style={{ color: "#a2d1bb", textDecoration: "none", fontWeight: "600" }}
              className="transition-opacity hover:opacity-80"
            >
              {tx.createAccount}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
