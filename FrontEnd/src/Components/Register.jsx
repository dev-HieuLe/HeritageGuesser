import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/authContext";

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

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!values.name.trim()) newErrors.name = "Name is required";
    if (!values.email.trim()) newErrors.email = "Email is required";
    if (!values.password) newErrors.password = "Password is required";
    if (!values.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { confirmPassword, ...dataToSend } = values;

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/register`, dataToSend, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/player`, {
              withCredentials: true,
            })
            .then((userRes) => {
              setUser(userRes.data);
              setAuth(true);
              navigate(`/`);
            })
            .catch(() => {
              navigate("/login");
            });
        }
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          const errorMsg = err.response.data.error?.toLowerCase() || "";
          if (errorMsg.includes("email")) {
            setErrors({ email: "Email already in use" });
          } else if (errorMsg.includes("name")) {
            setErrors({ name: "Username already taken" });
          } else {
            setErrors({ email: "Registration error" });
          }
        } else {
          setErrors({
            email: "Something went wrong. Please try again.",
          });
        }
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/loginbg.jpeg')" }}
    >
      <div className="w-full max-w-sm p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl text-white border border-gray-600">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-transparent border-b focus:outline-none placeholder-white ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-transparent border-b focus:outline-none placeholder-white ${
                errors.confirmPassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Register
          </button>
        </form>

        {/* Link to login */}
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="font-bold underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
