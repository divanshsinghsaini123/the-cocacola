"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetExtraDataQuery } from "@/src/store/slices/api";
import { SITE_CONFIG } from "@/src/config/site";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data } = useGetExtraDataQuery();

    // Password Recovery States
    const [step, setStep] = useState<"login" | "forgot" | "verify" | "reset">("login");
    const [recoveryUsername, setRecoveryUsername] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [maskedEmail, setMaskedEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Login failed");
            }

            // Success
            const data = await res.json();
            if (data.admin.role == "ecom") {
                router.push("/admin/portal");
            }

            if (data.admin.role == "Superadmin") {
                router.push("/admin/portal");
            }

            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/forgot-password/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: recoveryUsername }),
            });

            const resData = await res.json();
            if (!res.ok) {
                throw new Error(resData.error || "Failed to send verification code");
            }

            setMaskedEmail(resData.email);
            setRecoveryUsername(resData.username); // normalize username if email was provided
            setSuccessMessage(`A 6-digit code has been sent to: ${resData.email}`);
            setStep("verify");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/forgot-password/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: recoveryUsername, code }),
            });

            const resData = await res.json();
            if (!res.ok) {
                throw new Error(resData.error || "Invalid verification code");
            }

            setSuccessMessage("Code verified successfully. Please set your new password.");
            setStep("reset");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/admin/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: recoveryUsername, code, newPassword }),
            });

            const resData = await res.json();
            if (!res.ok) {
                throw new Error(resData.error || "Failed to reset password");
            }

            setSuccessMessage("Your password has been successfully reset! Please sign in.");
            // Reset states
            setRecoveryUsername("");
            setCode("");
            setNewPassword("");
            setConfirmPassword("");
            setStep("login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <div className="flex min-h-screen w-full bg-black font-sans">
            {/* Left Side - Brand Visual */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-[#121212] overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600 rounded-full blur-[120px] opacity-20" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-800 rounded-full blur-[120px] opacity-20" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="h-35 w-62 relative">
                        <Image src="/assets/Home/logo-white-large.svg" alt={SITE_CONFIG.companyName} fill className="object-contain object-left" />
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Powering the <br />
                        <span className="text-red-500">World's Favorite</span> <br />
                        Beverage Brand.
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Secure access for authorized administrators only. Manage global products, brands, and campaigns from one central hub.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-gray-500 font-medium tracking-wide">
                    {data?.data?.Copyright}
                </div>
            </div>

            {/* Right Side - Login Form & Recovery Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:rounded-l-[30px] shadow-2xl relative z-20">
                <div className="w-full max-w-[420px] space-y-8">

                    {/* STEP 1: LOGIN VIEW */}
                    {step === "login" && (
                        <>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Portal</h2>
                                <p className="mt-2 text-gray-500">Please authenticate to continue.</p>
                            </div>

                            {successMessage && (
                                <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-md text-sm font-medium">
                                    {successMessage}
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm font-medium animate-pulse">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                        placeholder="admin_user"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setError("");
                                                setSuccessMessage("");
                                                setStep("forgot");
                                            }}
                                            className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? "Authenticating..." : "Sign In to Dashboard"}
                                </button>
                            </form>
                        </>
                    )}

                    {/* STEP 2: FORGOT PASSWORD VIEW */}
                    {step === "forgot" && (
                        <>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recover Password</h2>
                                <p className="mt-2 text-gray-500">Enter your username or recovery email to search for your account.</p>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm font-medium animate-pulse">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSendCode} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Username or Email</label>
                                    <input
                                        type="text"
                                        value={recoveryUsername}
                                        onChange={(e) => setRecoveryUsername(e.target.value)}
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                        placeholder="admin_user or admin@email.com"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? "Sending Code..." : "Send Verification Code"}
                                </button>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => {
                                        setError("");
                                        setSuccessMessage("");
                                        setStep("login");
                                    }}
                                    className="w-full text-center text-sm font-bold text-gray-500 hover:text-black transition-colors py-2 disabled:opacity-50"
                                >
                                    Cancel & Return to Login
                                </button>
                            </form>
                        </>
                    )}

                    {/* STEP 3: VERIFY CODE VIEW */}
                    {step === "verify" && (
                        <>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Verify Identity</h2>
                                <p className="mt-2 text-gray-500">A verification code has been dispatched. Enter the 6-digit code below.</p>
                            </div>

                            {successMessage && (
                                <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-md text-sm font-medium">
                                    {successMessage}
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm font-medium animate-pulse">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleVerifyCode} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block">Verification Code</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-center text-2xl tracking-[8px]"
                                        placeholder="000000"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? "Verifying..." : "Verify Code"}
                                </button>

                                <div className="flex flex-col gap-2 text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        disabled={loading}
                                        className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                                    >
                                        Resend Code
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => {
                                            setError("");
                                            setSuccessMessage("");
                                            setStep("forgot");
                                        }}
                                        className="text-sm font-bold text-gray-500 hover:text-black transition-colors"
                                    >
                                        Back to Recovery Username
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* STEP 4: RESET PASSWORD VIEW */}
                    {step === "reset" && (
                        <>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Password</h2>
                                <p className="mt-2 text-gray-500">Provide a secure password for your administrator account.</p>
                            </div>

                            {successMessage && (
                                <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-md text-sm font-medium">
                                    {successMessage}
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm font-medium animate-pulse">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? "Saving Password..." : "Reset & Save Password"}
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="text-sm font-medium text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Website
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
