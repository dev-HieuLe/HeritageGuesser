import { useState, useContext, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from "../Context/authContext";
import { useLang } from "../Context/languageContext";
import t from "../translations";
import { supabase } from "../Config/supabase";

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const Signup = () => {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", recaptcha: "", general: "" });
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);
  const { lang, toggleLang } = useLang();
  const tx = t[lang].register;
  const recaptchaRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "", general: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const trimmedName = values.name.trim();
    const trimmedEmail = values.email.trim();

    if (!trimmedName) newErrors.name = tx.errors.nameRequired;
    else if (trimmedName.length < 2) newErrors.name = tx.errors.nameTooShort;
    else if (trimmedName.length > 50) newErrors.name = tx.errors.nameTooLong;
    else if (!/[a-zA-Z0-9]/.test(trimmedName)) newErrors.name = tx.errors.nameInvalidChars;

    if (!trimmedEmail) newErrors.email = tx.errors.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) newErrors.email = tx.errors.emailInvalid;

    if (!values.password) newErrors.password = tx.errors.passwordRequired;
    else if (values.password.length < 8) newErrors.password = tx.errors.passwordTooShort;
    else if (values.password.length > 128) newErrors.password = tx.errors.passwordTooLong;

    if (!values.confirmPassword) newErrors.confirmPassword = tx.errors.confirmRequired;
    else if (values.password !== values.confirmPassword) newErrors.confirmPassword = tx.errors.confirmMismatch;

    if (!isMobile) {
      const recaptchaToken = recaptchaRef.current?.getValue();
      if (!recaptchaToken) newErrors.recaptcha = lang === "en" ? "Please tick the reCAPTCHA box." : "Vui lòng xác nhận reCAPTCHA.";
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const { confirmPassword, ...dataToSend } = values;
    const recaptchaToken = isMobile ? null : recaptchaRef.current?.getValue();
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/register`, { ...dataToSend, ...(isMobile ? { type: "mobile" } : { recaptchaToken }) }, { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/player`, { withCredentials: true })
            .then((userRes) => { setUser(userRes.data); setAuth(true); navigate("/"); })
            .catch(() => navigate("/login"));
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.error || "";
        const lm = msg.toLowerCase();
        if (err.response?.status === 409) {
          if (lm.includes("email")) setErrors((prev) => ({ ...prev, email: tx.errors.emailInUse }));
          else if (lm.includes("name")) setErrors((prev) => ({ ...prev, name: tx.errors.usernameTaken }));
          else setErrors((prev) => ({ ...prev, general: tx.errors.registrationError }));
        } else if (err.response?.status === 400) {
          if (lm.includes("name") && lm.includes("letter")) setErrors((prev) => ({ ...prev, name: tx.errors.nameInvalidChars }));
          else if (lm.includes("name")) setErrors((prev) => ({ ...prev, name: tx.errors.nameTooShort }));
          else if (lm.includes("email")) setErrors((prev) => ({ ...prev, email: tx.errors.emailInvalid }));
          else if (lm.includes("password") && lm.includes("128")) setErrors((prev) => ({ ...prev, password: tx.errors.passwordTooLong }));
          else if (lm.includes("password")) setErrors((prev) => ({ ...prev, password: tx.errors.passwordTooShort }));
          else setErrors((prev) => ({ ...prev, general: tx.errors.invalidData }));
        } else if (err.response?.status === 403) {
          recaptchaRef.current?.reset();
          setErrors((prev) => ({ ...prev, recaptcha: lang === "en" ? "reCAPTCHA verification failed. Please try again." : "Xác minh reCAPTCHA thất bại. Vui lòng thử lại." }));
        } else if (err.response?.status === 500) {
          setErrors((prev) => ({ ...prev, general: tx.errors.serverError }));
        } else {
          setErrors((prev) => ({ ...prev, general: tx.errors.somethingWrong }));
        }
      });
  };

  const fields = [
    { name: "name",            type: "text",     icon: "person" },
    { name: "email",           type: "email",    icon: "mail" },
    { name: "password",        type: "password", icon: "lock" },
    { name: "confirmPassword", type: "password", icon: "lock_reset" },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: "#0d0f0b" }}>
      {/* Background */}
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
      <div
        className="relative z-10 flex flex-col justify-center items-center w-full px-6 sm:px-12 lg:px-16 py-10 pt-20 overflow-y-auto"
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

          <h2 className="font-black mb-1" style={{ fontSize: "22px", color: "#dde4e0" }}>Create account</h2>
          <p className="mb-6 text-[13px]" style={{ color: "rgba(192,200,195,0.45)" }}>
            {tx.subtitle}
          </p>

          {/* Google first */}
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
            {tx.googleSignUp}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(65,73,68,0.35)" }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(192,200,195,0.3)" }}>
              {tx.orDivider}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(65,73,68,0.35)" }} />
          </div>

          {/* Form — two-column grid for name+email, then password+confirm stacked */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {fields.map(({ name, type, icon }) => {
              const f = tx.fields[name];
              return (
                <div key={name}>
                  <label className="block mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(192,200,195,0.4)" }}>
                    {f.label}
                  </label>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "rgba(162,209,187,0.35)", fontSize: "17px" }}
                    >
                      {icon}
                    </span>
                    <input
                      type={type}
                      name={name}
                      placeholder={f.placeholder}
                      value={values[name]}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{
                        backgroundColor: "rgba(30,32,26,0.8)",
                        border: errors[name] ? "1px solid rgba(187,3,8,0.7)" : "1px solid rgba(65,73,68,0.4)",
                        color: "#e3e3d9",
                        fontSize: "13.5px",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                      onFocus={(e) => { if (!errors[name]) e.target.style.borderColor = "rgba(162,209,187,0.5)"; }}
                      onBlur={(e) => { if (!errors[name]) e.target.style.borderColor = "rgba(65,73,68,0.4)"; }}
                    />
                  </div>
                  {errors[name] && <p className="mt-1 text-[11px]" style={{ color: "#ffb4a9" }}>{errors[name]}</p>}
                </div>
              );
            })}

            {/* reCAPTCHA — desktop only */}
            {!isMobile && (
              <div className="flex flex-col items-center pt-1">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY}
                  theme="dark"
                  onChange={() => setErrors((prev) => ({ ...prev, recaptcha: "" }))}
                />
                {errors.recaptcha && (
                  <p className="mt-1.5 text-[11px]" style={{ color: "#ffb4a9" }}>{errors.recaptcha}</p>
                )}
              </div>
            )}

            {/* General error */}
            {errors.general && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px]"
                style={{ backgroundColor: "rgba(187,3,8,0.12)", border: "1px solid rgba(187,3,8,0.3)", color: "#ffb4a9" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>error</span>
                {errors.general}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 font-black uppercase tracking-widest transition-all active:scale-95"
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
          <p className="mt-5 text-center text-[13px]" style={{ color: "rgba(192,200,195,0.4)" }}>
            {lang === "en" ? "Already have an account?" : "Đã có tài khoản?"}{" "}
            <Link to="/login" style={{ color: "#a2d1bb", textDecoration: "none", fontWeight: "600" }}
              className="transition-opacity hover:opacity-80"
            >
              {tx.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
