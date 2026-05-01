// frontend/components/dashboard/Header.tsx

"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth/authSlice";

interface HeaderProps {
    onLogin: () => void;
    onSignup: () => void;
}

export function Header({ onLogin, onSignup }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    console.log("Header - User from Redux:", user);

    const handleLogoutClick = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        dispatch(logout());
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200"
                    : "bg-white border-b border-gray-100"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">TM</span>
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            TaskManager
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    </div>
                                </button>

                                {isProfileOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsProfileOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                <Settings className="w-4 h-4" />
                                                <span>Settings</span>
                                            </button>
                                            <button
                                                onClick={handleLogoutClick}
                                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={onLogin}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={onSignup}
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 py-4">
                    <div className="px-4 space-y-3">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center space-x-3 px-2 py-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <hr className="border-gray-100" />
                                <button className="w-full flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Settings className="w-5 h-5" />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center space-x-3 px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onLogin}
                                    className="w-full px-4 py-2 text-gray-700 font-medium text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={onSignup}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}