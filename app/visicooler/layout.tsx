"use client";

import React, { useState, useEffect } from "react";
import { Lock, User, ArrowRight, LogOut, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserSession {
    name: string;
    role: string;
    loginTime: number;
}

export default function VisicoolerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [nameInput, setNameInput] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [sessionUser, setSessionUser] = useState<UserSession | null>(null);

    // Super Admin Authentication State
    const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
    const [superAdminUsername, setSuperAdminUsername] = useState("");
    const [superAdminPassword, setSuperAdminPassword] = useState("");
    const [superAdminLoading, setSuperAdminLoading] = useState(false);
    const [superAdminError, setSuperAdminError] = useState<string | null>(null);

    // Session duration: 12 hours (12 * 60 * 60 * 1000)
    const SESSION_DURATION = 12 * 60 * 60 * 1000;

    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedSession = localStorage.getItem("visicooler_session");
                if (storedSession) {
                    const session: UserSession = JSON.parse(storedSession);
                    const now = Date.now();

                    // Check if session has expired
                    if (now - session.loginTime < SESSION_DURATION) {
                        setIsAuthenticated(true);
                        setSessionUser(session);
                    } else {
                        // Session expired
                        localStorage.removeItem("visicooler_session");
                        toast.error("Session expired. Please log in again.");
                    }
                }
            } catch (err) {
                console.error("Failed to parse visicooler session", err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameInput.trim()) {
            setErrorMsg("Please enter your ASM / SE Name");
            return;
        }

        setAuthLoading(true);
        setErrorMsg(null);

        try {
            const res = await fetch("/api/visicooler/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameInput }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                const session: UserSession = {
                    name: data.name,
                    role: data.role,
                    loginTime: Date.now(),
                };

                localStorage.setItem("visicooler_session", JSON.stringify(session));
                setSessionUser(session);
                setIsAuthenticated(true);
                toast.success(`Welcome back, ${data.name}!`);

            } else {
                setErrorMsg(data.error || "Authentication failed. Please verify your name.");
                toast.error("Access Denied");
            }
        } catch (err) {
            setErrorMsg("Network error. Please try again.");
            toast.error("Authentication Error");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            if (sessionUser?.role === "Superadmin") {
                await fetch("/api/admin/auth", { method: "DELETE" });
            }
        } catch (err) {
            console.error("Failed to delete admin token cookie:", err);
        }
        localStorage.removeItem("visicooler_session");
        setIsAuthenticated(false);
        setSessionUser(null);
        setNameInput("");
        toast.success("Successfully logged out");
    };

    const openSuperAdminModal = () => {
        setSuperAdminUsername("");
        setSuperAdminPassword("");
        setSuperAdminError(null);
        setShowSuperAdminModal(true);
    };

    const handleSuperAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!superAdminUsername.trim() || !superAdminPassword.trim()) {
            setSuperAdminError("Username and Password are required");
            return;
        }

        setSuperAdminLoading(true);
        setSuperAdminError(null);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: superAdminUsername,
                    password: superAdminPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                const session: UserSession = {
                    name: superAdminUsername,
                    role: "Superadmin",
                    loginTime: Date.now(),
                };

                localStorage.setItem("visicooler_session", JSON.stringify(session));
                setSessionUser(session);
                setIsAuthenticated(true);
                setShowSuperAdminModal(false);
                toast.success(`Welcome, Super Admin ${superAdminUsername}!`);
                // router.push("/visicooler/shops");
            } else {
                setSuperAdminError(data.error || "Invalid credentials.");
                toast.error("Access Denied");
            }
        } catch (err) {
            setSuperAdminError("Network error. Please try again.");
            toast.error("Authentication Error");
        } finally {
            setSuperAdminLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-red-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin"></div>
                </div>
                <p className="text-gray-400 text-sm font-semibold tracking-wider uppercase animate-pulse">
                    Securing Connection...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#07090e] bg-gradient-to-br from-[#0a0f1d] via-[#07090e] to-[#04050a] flex items-center justify-center p-4 relative overflow-hidden">
                <Toaster position="top-right" />

                {/* Modern Decorative Glows */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full filter blur-[120px] pointer-events-none"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    {/* Brand Emblem */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-red-500/20 to-red-600/5 rounded-2xl border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] mb-4 animate-bounce duration-1000">
                            <ShieldCheck className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                            Visicooler Portal
                        </h1>
                        <p className="text-gray-400 mt-2 font-medium">Field Personnel Access Verification</p>
                    </div>

                    {/* Glassmorphic Login Card */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <form onSubmit={handleLogin} className="space-y-6">

                            {/* Error Alert Display */}
                            {errorMsg && (
                                <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-200 text-sm animate-shake">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold text-red-400">Authentication Error:</span>
                                        <p className="mt-0.5 opacity-90">{errorMsg}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-300 tracking-wide uppercase">
                                    ASM or SE Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={nameInput}
                                        onChange={(e) => {
                                            setNameInput(e.target.value);
                                            setErrorMsg(null);
                                        }}
                                        placeholder="Enter your exact name..."
                                        className="block w-full pl-11 pr-4 py-3.5 border border-white/[0.08] rounded-2xl leading-5 bg-white/[0.03] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/50 sm:text-base transition-all shadow-inner"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 italic mt-1.5">
                                    We verify this name against the registered visicooler shop list.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full relative flex items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-75 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-2xl font-bold tracking-wide transition-all shadow-[0_4px_20px_rgba(220,38,38,0.25)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.4)] group"
                            >
                                {authLoading ? (
                                    <>
                                        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                                        <span>Verifying Identity...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Verify & Enter Portal</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-white/10"></div>
                                <span className="flex-shrink mx-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">Or</span>
                                <div className="flex-grow border-t border-white/10"></div>
                            </div>

                            <button
                                type="button"
                                onClick={openSuperAdminModal}
                                className="w-full relative flex items-center justify-center gap-2 overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white py-3.5 px-6 rounded-2xl font-bold tracking-wide transition-all group"
                            >
                                <Lock className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                                <span>Login as Super Admin</span>
                            </button>
                        </form>
                    </div>

                    {/* Quick Access Footer Help */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-600">
                            Need database registration? Contact your system administrator to enroll your sales name.
                        </p>
                    </div>
                </div>

                {/* Super Admin Login Modal Overlay */}
                {showSuperAdminModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
                        <div className="w-full max-w-md bg-[#0a0f1d] border border-white/[0.08] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative animate-in fade-in zoom-in duration-200">

                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setShowSuperAdminModal(false)}
                                className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center p-3 bg-red-500/10 border border-red-500/20 rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.1)] mb-3">
                                    <Lock className="w-6 h-6 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Super Admin Access</h2>
                                <p className="text-gray-400 text-xs mt-1">Enter your admin panel credentials to authorize</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSuperAdminLogin} className="space-y-4">

                                {/* Error Display */}
                                {superAdminError && (
                                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-200 text-xs animate-shake">
                                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-red-400">Error: </span>
                                            <span className="opacity-90">{superAdminError}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Username Input */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-400 tracking-wide uppercase">
                                        Username
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={superAdminUsername}
                                            onChange={(e) => {
                                                setSuperAdminUsername(e.target.value);
                                                setSuperAdminError(null);
                                            }}
                                            placeholder="Enter username"
                                            className="block w-full pl-10 pr-4 py-3 border border-white/[0.08] rounded-xl text-sm bg-white/[0.02] placeholder-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/50 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-400 tracking-wide uppercase">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={superAdminPassword}
                                            onChange={(e) => {
                                                setSuperAdminPassword(e.target.value);
                                                setSuperAdminError(null);
                                            }}
                                            placeholder="Enter password"
                                            className="block w-full pl-10 pr-4 py-3 border border-white/[0.08] rounded-xl text-sm bg-white/[0.02] placeholder-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/50 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>

                                {/* Submit button */}
                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowSuperAdminModal(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 py-3 rounded-xl text-sm font-semibold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={superAdminLoading}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-75 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_15px_rgba(220,38,38,0.2)] flex items-center justify-center gap-1.5"
                                    >
                                        {superAdminLoading ? (
                                            <>
                                                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                                                <span>Authenticating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Login</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <Toaster position="top-right" />

            {/* Ultra-Premium Session Header */}
            <div className="w-full bg-[#0a0f1d] border-b border-white/[0.06] py-3.5 px-4 sm:px-6 shadow-lg flex flex-row items-center justify-between gap-3 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20">
                        <ShieldCheck className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {sessionUser?.role}
                            </span>
                            <span className="text-sm font-semibold text-gray-200">
                                {sessionUser?.name}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium bg-green-500/5 border border-green-500/10 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 absolute"></span>
                        <span>Active Session</span>
                    </div> */}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/5 hover:border-white/10"
                    >
                        <LogOut size={13} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Page Workspace Content */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
