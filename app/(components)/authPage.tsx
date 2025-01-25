/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const appName = "TaskFlow";
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // If registration is successful, switch to login mode
      if (!isLogin) {
        setIsLogin(true);
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });
        return;
      }

      localStorage.setItem("token", data.token);
      document.cookie = `auth-token=${data.token}; path=/; Max-Age=86400; Secure; HttpOnly; SameSite=Strict`;
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Left Section - Hero Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-6">
          <CheckSquare className="w-8 h-8 text-[#A594F9]" />
          <span className="text-2xl font-bold">{appName}</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
          Stay Organized,
          <span className="block mt-2 bg-gradient-to-r from-[#A594F9] to-purple-400 bg-clip-text text-transparent">
            Be Productive
          </span>
        </h1>

        <p className="text-gray-400 text-lg lg:text-xl max-w-xl mb-8">
          {appName} helps you manage your tasks with ease. Create, organize, and
          track your todos in a beautiful and intuitive interface. Never miss a
          deadline again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="px-6 py-3 bg-[#A594F9] hover:bg-purple-400 rounded-lg flex items-center justify-center gap-2 transition-all">
            Start Organizing
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-6 py-3 border border-[#A594F9] rounded-lg flex items-center justify-center gap-2 hover:bg-[#A594F9]/10 transition-all">
            Watch Demo
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-xl xl:grid">
          {[
            ["1M+", "Active Users"],
            ["10M+", "Tasks Completed"],
            ["99%", "Satisfaction"],
          ].map(([stat, label]) => (
            <div
              key={label}
              className="text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#A594F9]">
                {stat}
              </h3>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right Section - Auth Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm">
          <div className="flex gap-4 mb-8">
            <button
              className={`flex-1 py-2 text-center rounded-lg transition-all ${
                isLogin ? "bg-[#A594F9] text-black" : "text-gray-400"
              }`}
              onClick={() => setIsLogin(true)}>
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center rounded-lg transition-all ${
                !isLogin ? "bg-[#A594F9] text-black" : "text-gray-400"
              }`}
              onClick={() => setIsLogin(false)}>
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-100/10 rounded-lg">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#A594F9] focus:ring-1 focus:ring-[#A594F9] transition-all outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#A594F9] focus:ring-1 focus:ring-[#A594F9] transition-all outline-none"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#A594F9] focus:ring-1 focus:ring-[#A594F9] transition-all outline-none"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#A594F9] hover:bg-purple-400 rounded-lg font-medium transition-all disabled:opacity-50">
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {isLogin && (
            <p className="mt-4 text-center text-sm text-gray-400">
              Forgot your password?{" "}
              <a
                href="#"
                className="text-[#A594F9] hover:underline">
                Reset it here
              </a>
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default AuthPage;
