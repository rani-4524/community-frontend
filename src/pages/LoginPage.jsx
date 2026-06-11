import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const SERVER_URI = import.meta.env.VITE_API_URL;
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const validate = () => {
    let errorList = [];

    if (!form.email) {
      errorList.push("Email is required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      errorList.push("Invalid email format");
    }

    if (!form.password) {
      errorList.push("Password is required");
    } else if (form.password.length < 6) {
      errorList.push("Password must be at least 6 characters");
    }

    setErrors(errorList);

    if (errorList.length > 0) {
      toast.error(errorList[0]);
    }

    return errorList.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error(errors[0] || "Please check your inputs");
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URI}/user/login`, form, {
        withCredentials: true,
      });

      if (response.data.error) {
        setMessage("");
        setErrors([response.data.error.message]);
        return;
      }

      const userData = response.data.data.user;
      dispatch(login({ user: userData }));

      setErrors([]);
      toast.success("Login successful🎉");

      setForm({
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      const errorMessage = error.response?.data?.error?.info || "Login failed";
      setErrors([errorMessage]);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-black text-white px-8 py-6 ">
      <div className="max-w-7xl h-full mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="inline-block px-5 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            Welcome Back
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            Continue Your
            <br />
            <span className="text-red-500">Journey</span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg leading-8 max-w-lg">
            Reconnect with your communities, join events, and continue building
            meaningful connections.
          </p>

          <div className="mt-5 space-y-3 text-gray-300">
            <p>✓ Join your communities</p>
            <p>✓ Discover upcoming events</p>
            <p>✓ Connect with amazing people</p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
            <div className="bg-white/5 border border-white/10 rounded-2xl py-3 text-center">
              <h3 className="text-xl font-bold text-red-500">120+</h3>
              <p className="text-sm text-gray-400 mt-1">Communities</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl py-3 text-center">
              <h3 className="text-xl font-bold text-red-500">500+</h3>
              <p className="text-sm text-gray-400 mt-1">Events</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl py-3 text-center">
              <h3 className="text-xl font-bold text-red-500">2K+</h3>
              <p className="text-sm text-gray-400 mt-1">Members</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">Login</h2>

          <p className="text-gray-400 mb-8">Welcome back to CommunityHub.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleOnChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-red-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleOnChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-red-500"
            />

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-2xl font-semibold transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-400 hover:text-red-300">
              Register
            </Link>
          </p>

          {errors.length > 0 && (
            <div className="mt-5 space-y-2">
              {errors.map((err, index) => (
                <p className="text-red-400" key={index}>
                  {err}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
