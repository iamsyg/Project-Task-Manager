// frontend/components/auth/LoginModal.tsx
"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useLogIn } from "@/hooks/auth/useLogIn";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (data: LoginData) => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword?: () => void;
}

export interface LoginData {
  email: string;
  password: string;
}

export function LogInModal({ isOpen, onClose, onSwitchToSignUp, onForgotPassword }: LoginModalProps) {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof LoginData, boolean>>>({});
  const [generalError, setGeneralError] = useState<string>("");

  const { handleLogIn } = useLogIn();

  if (!isOpen) return null;

  const validateField = (name: keyof LoginData, value: string) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear general error when user starts typing
    if (generalError) setGeneralError("");

    if (touched[name as keyof LoginData]) {
      const error = validateField(name as keyof LoginData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof LoginData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear general error
    setGeneralError("");

    const newErrors: Partial<LoginData> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof LoginData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
    });

    if (!isValid) return;

    try {
      setIsLoading(true);
      
      await handleLogIn(formData.email, formData.password);
      
      onClose(); // Close after successful login
      
    } catch (err: any) {
      console.error(err);
      // Handle different error cases
      if (err.message?.includes("User not found") || err.message?.includes("Invalid credentials")) {
        setGeneralError("Invalid email or password. Please try again.");
      } else if (err.message?.includes("Email not verified")) {
        setGeneralError("Please verify your email address before logging in.");
      } else {
        setGeneralError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (field: keyof LoginData) => {
    const hasError = errors[field] && touched[field];
    return `w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
      }`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-500 mt-1">Log in to your TaskManager account</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* General Error Message */}
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{generalError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={getInputClassName("email")}
                  style={{ paddingLeft: "2.5rem" }}
                  autoComplete="email"
                />
              </div>
              {errors.email && touched.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={getInputClassName("password")}
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </>
              )}
            </button>

            {/* Switch to Sign Up */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}