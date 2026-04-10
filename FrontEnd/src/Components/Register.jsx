import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import { useLang } from "../Context/languageContext";
import t from "../translations";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);
  const { lang, toggleLang } = useLang();
  const tx = t[lang].register;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!values.name.trim()) {
      newErrors.name = tx.errors.nameRequired;
    } else if (values.name.trim().length < 2) {
      newErrors.name = tx.errors.nameTooShort;
    } else if (values.name.trim().length > 50) {
      newErrors.name = tx.errors.nameTooLong;
    }

    if (!values.email.trim()) {
      newErrors.email = tx.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = tx.errors.emailInvalid;
    }

    if (!values.password) {
      newErrors.password = tx.errors.passwordRequired;
    } else if (values.password.length < 8) {
      newErrors.password = tx.errors.passwordTooShort;
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = tx.errors.confirmRequired;
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = tx.errors.confirmMismatch;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { confirmPassword, ...dataToSend } = values;
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/register`, dataToSend, { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/player`, { withCredentials: true })
            .then((userRes) => {
              setUser(userRes.data);
              setAuth(true);
              navigate("/");
            })
            .catch(() => navigate("/login"));
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.error || "";

        if (err.response?.status === 409) {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("email")) {
            setErrors({ email: tx.errors.emailInUse });
          } else if (lowerMsg.includes("name")) {
            setErrors({ name: tx.errors.usernameTaken });
          } else {
            setErrors({ email: tx.errors.registrationError });
          }
        } else if (err.response?.status === 400) {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("name")) {
            setErrors({ name: msg });
          } else if (lowerMsg.includes("email")) {
            setErrors({ email: msg });
          } else if (lowerMsg.includes("password")) {
            setErrors({ password: msg });
          } else {
            setErrors({ email: msg || tx.errors.invalidData });
          }
        } else {
          setErrors({ email: tx.errors.somethingWrong });
        }
      });
  };

  const fieldDefs = ["name", "email", "password", "confirmPassword"];
  const icons = { name: "person", email: "mail", password: "lock", confirmPassword: "lock_reset" };
  const types = { name: "text", email: "email", password: "password", confirmPassword: "password" };

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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#e9c349" }}>
            Heritage Guesser
          </h1>
          <p className="uppercase tracking-widest mt-1" style={{ fontSize: "10px", color: "rgba(162,209,187,0.5)" }}>
            {tx.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {fieldDefs.map((name) => {
            const f = tx.fields[name];
            return (
              <div key={name}>
                <label
                  className="block uppercase tracking-widest font-bold mb-1"
                  style={{ fontSize: "9px", color: "rgba(192,200,195,0.5)" }}
                >
                  {f.label}
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(162,209,187,0.4)", fontSize: "18px" }}
                  >
                    {icons[name]}
                  </span>
                  <input
                    type={types[name]}
                    name={name}
                    placeholder={f.placeholder}
                    value={values[name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{
                      backgroundColor: "#1e201a",
                      border: errors[name] ? "1px solid #bb0308" : "1px solid rgba(65,73,68,0.5)",
                      color: "#e3e3d9",
                      fontSize: "13px",
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                    onFocus={(e) => { if (!errors[name]) e.target.style.borderColor = "rgba(162,209,187,0.4)"; }}
                    onBlur={(e) => { if (!errors[name]) e.target.style.borderColor = "rgba(65,73,68,0.5)"; }}
                  />
                </div>
                {errors[name] && (
                  <p className="mt-1" style={{ color: "#ffb4a9", fontSize: "11px" }}>{errors[name]}</p>
                )}
              </div>
            );
          })}

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

        <div className="flex items-center gap-3 my-4" style={{ color: "rgba(65,73,68,0.6)" }}>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(65,73,68,0.4)" }} />
          <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {tx.divider}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(65,73,68,0.4)" }} />
        </div>

        <Link
          to="/login"
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
          {tx.loginLink}
        </Link>
      </div>
    </div>
  );
};

export default Signup;
