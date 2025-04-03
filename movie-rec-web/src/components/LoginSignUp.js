import React, { useState } from "react";

export default function LoginModal({ isVisible, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify({ email: formData.email }));
        onLogin(formData.email); // Notify parent component
        onClose(); // Close modal on successful login
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();

      if (data.success) {
        setIsLogin(true); // Switch to login mode after successful sign-up
      } else {
        setError(data.message || "Sign-up failed.");
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-[#45474b] text-[#f5f7f8] p-6 rounded-lg shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-[#f5f7f8] hover:text-[#379777]"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#f5f7f8] text-[#45474b] rounded-md outline-none focus:ring focus:ring-[#379777]"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#f5f7f8] text-[#45474b] rounded-md outline-none focus:ring focus:ring-[#379777]"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2 bg-[#f5f7f8] text-[#45474b] rounded-md outline-none focus:ring focus:ring-[#379777]"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-[#379777] text-[#f5f7f8] rounded-md font-semibold text-lg hover:bg-[#28775b] transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#379777] hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
