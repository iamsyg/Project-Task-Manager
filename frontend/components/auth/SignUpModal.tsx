// frontend/components/auth/SignUpModal.tsx
"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import { useSignUp } from "@/hooks/auth/useSignUp";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: (data: SignUpData) => void;
  onSwitchToLogin?: () => void;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export function SignUpModal({ isOpen, onClose, onSwitchToLogin }: SignUpModalProps) {
  const [formData, setFormData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignUpData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof SignUpData, boolean>>>({});

  const { signUp } = useSignUp();

  if (!isOpen) return null;

  const validateField = (name: keyof SignUpData, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        if (value.trim().length > 50) return "Name must be less than 50 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof SignUpData]) {
      const error = validateField(name as keyof SignUpData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    // // Re-validate confirm password when password changes
    // if (name === "password" && touched.confirmPassword) {
    //   const confirmError = validateField("confirmPassword", formData.confirmPassword);
    //   setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    // }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof SignUpData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<SignUpData> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof SignUpData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
    });

    if (!isValid) return;

    try {
      setIsLoading(true);

      await signUp(formData.name, formData.email, formData.password);

      onClose(); // close AFTER success

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (field: keyof SignUpData) => {
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
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-sm text-gray-500 mt-1">Join TaskManager to start collaborating</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={getInputClassName("name")}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
              {errors.name && touched.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

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
                  placeholder="Create a password"
                  className={getInputClassName("password")}
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
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

              {/* Password strength indicator */}
              {formData.password && !errors.password && touched.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${formData.password.length >= 6
                          ? formData.password.length >= 8
                            ? "w-full bg-green-500"
                            : "w-2/3 bg-yellow-500"
                          : "w-1/3 bg-red-500"
                          }`}
                      />
                    </div>
                    <span className="text-gray-500">
                      {formData.password.length >= 8 ? "Strong" : formData.password.length >= 6 ? "Medium" : "Weak"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>

            {/* Switch to Login */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}