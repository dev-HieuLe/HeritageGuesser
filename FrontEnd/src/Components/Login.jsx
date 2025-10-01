import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/authContext";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!values.email.trim()) newErrors.email = "Email is required";
    if (!values.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/login`, values, {
        withCredentials: true,
      })
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
          navigate(`/`);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setErrors({
            email: "Invalid email or password",
            password: "Invalid email or password",
          });
        } else {
          setErrors({ email: "Something went wrong. Please try again." });
        }
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/loginbg.jpeg')" }}
    >
      <div className="w-full max-w-sm p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl text-white border border-gray-600">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-transparent border-b focus:outline-none placeholder-white ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-transparent border-b focus:outline-none placeholder-white ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-white" />
              <span>Remember Me</span>
            </label>
            <a href="#" className="hover:underline">
              Forget Password
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Log in
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm mt-6">
          Don’t have an account{" "}
          <a href="/register" className="font-bold underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
