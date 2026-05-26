"use client";

import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Password Recovery States
    const [step, setStep] = useState<"login" | "forgot" | "verify" | "reset">("login");
    const [recoveryUsername, setRecoveryUsername] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [maskedEmail, setMaskedEmail] = useState("");

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/calc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Login failed');
            } else {
                // Handle successful login (e.g., redirect to admin area)
                window.location.href = '/calc/dashboard';
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

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
            setSuccessMessage(`A verification code has been sent to: ${resData.email}`);
            setStep("verify");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

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

            setSuccessMessage("Code verified successfully. Please enter your new password.");
            setStep("reset");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
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

        setIsLoading(true);

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

            setSuccessMessage("Password successfully reset! Please sign in.");
            // Reset states
            setRecoveryUsername("");
            setCode("");
            setNewPassword("");
            setConfirmPassword("");
            setStep("login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] font-sans p-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full max-w-[400px] text-white">
                <div className="flex justify-center mb-4">
                    <Lock className="text-[#a8c0ff] w-12 h-12" />
                </div>

                {/* STEP 1: SIGN IN VIEW */}
                {step === "login" && (
                    <>
                        <h2 className="text-[1.8rem] font-bold mb-2 text-center bg-gradient-to-r from-white to-[#a8c0ff] bg-clip-text text-transparent">Sign in to Calculator</h2>
                        <p className="text-center text-[#b0c4de] mb-6 text-[0.9rem]">Please sign in to continue</p>

                        {successMessage && <p className="text-green-400 text-center mb-4 text-[0.9rem] font-medium">{successMessage}</p>}
                        {error && <p className="text-[#ff6b6b] text-center mb-4 text-[0.9rem]">{error}</p>}

                        <form onSubmit={handleSignIn}>
                            <div className="mb-6">
                                <label className="block mb-2 text-[0.85rem] text-[#e0e0e0]">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
                                />
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[0.85rem] text-[#e0e0e0]">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setError("");
                                            setSuccessMessage("");
                                            setStep("forgot");
                                        }}
                                        className="text-xs text-[#a8c0ff] hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full p-[0.9rem] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {isLoading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    </>
                )}

                {/* STEP 2: FORGOT PASSWORD VIEW */}
                {step === "forgot" && (
                    <>
                        <h2 className="text-[1.8rem] font-bold mb-2 text-center bg-gradient-to-r from-white to-[#a8c0ff] bg-clip-text text-transparent">Reset Password</h2>
                        <p className="text-center text-[#b0c4de] mb-6 text-[0.9rem]">Enter your username or recovery email</p>

                        {error && <p className="text-[#ff6b6b] text-center mb-4 text-[0.9rem]">{error}</p>}

                        <form onSubmit={handleSendCode}>
                            <div className="mb-6">
                                <label className="block mb-2 text-[0.85rem] text-[#e0e0e0]">Username or Email</label>
                                <input
                                    type="text"
                                    required
                                    value={recoveryUsername}
                                    onChange={(e) => setRecoveryUsername(e.target.value)}
                                    placeholder="Username or email address"
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full p-[0.9rem] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {isLoading ? 'Sending...' : 'Send Recovery Code'}
                            </button>

                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                    setError("");
                                    setSuccessMessage("");
                                    setStep("login");
                                }}
                                className="w-full text-center text-sm font-semibold text-[#b0c4de] hover:text-white mt-4 transition-colors disabled:opacity-50"
                            >
                                Back to Sign In
                            </button>
                        </form>
                    </>
                )}

                {/* STEP 3: VERIFY CODE VIEW */}
                {step === "verify" && (
                    <>
                        <h2 className="text-[1.8rem] font-bold mb-2 text-center bg-gradient-to-r from-white to-[#a8c0ff] bg-clip-text text-transparent">Verify Code</h2>
                        <p className="text-center text-[#b0c4de] mb-6 text-[0.9rem]">Enter the 6-digit code sent to your mail</p>

                        {successMessage && <p className="text-green-400 text-center mb-4 text-[0.9rem] font-medium">{successMessage}</p>}
                        {error && <p className="text-[#ff6b6b] text-center mb-4 text-[0.9rem]">{error}</p>}

                        <form onSubmit={handleVerifyCode}>
                            <div className="mb-6">
                                <label className="block mb-2 text-[0.85rem] text-[#e0e0e0] text-center">6-Digit Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-2xl font-bold tracking-[8px] text-center outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
                                    placeholder="000000"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full p-[0.9rem] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            <div className="flex flex-col gap-2 mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    disabled={isLoading}
                                    className="text-sm font-semibold text-[#a8c0ff] hover:underline disabled:opacity-50"
                                >
                                    Resend Code
                                </button>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => {
                                        setError("");
                                        setSuccessMessage("");
                                        setStep("forgot");
                                    }}
                                    className="text-sm font-semibold text-[#b0c4de] hover:text-white transition-colors"
                                >
                                    Change Username/Email
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* STEP 4: RESET PASSWORD VIEW */}
                {step === "reset" && (
                    <>
                        <h2 className="text-[1.8rem] font-bold mb-2 text-center bg-gradient-to-r from-white to-[#a8c0ff] bg-clip-text text-transparent">New Password</h2>
                        <p className="text-center text-[#b0c4de] mb-6 text-[0.9rem]">Create a new secure password</p>

                        {successMessage && <p className="text-green-400 text-center mb-4 text-[0.9rem] font-medium">{successMessage}</p>}
                        {error && <p className="text-[#ff6b6b] text-center mb-4 text-[0.9rem]">{error}</p>}

                        <form onSubmit={handleResetPassword}>
                            <div className="mb-6">
                                <label className="block mb-2 text-[0.85rem] text-[#e0e0e0]">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-[0.85rem] text-[#e0e0e0]">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full p-[0.9rem] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {isLoading ? 'Saving...' : 'Reset & Save Password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

