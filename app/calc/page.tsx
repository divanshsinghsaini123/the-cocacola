"use client";

import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] font-sans p-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full max-w-[400px] text-white">
                <div className="flex justify-center mb-4">
                    <Lock className="text-[#a8c0ff] w-12 h-12" />
                </div>
                <h2 className="text-[1.8rem] font-bold mb-2 text-center bg-gradient-to-r from-white to-[#a8c0ff] bg-clip-text text-transparent">Sign in to Calculator</h2>
                <p className="text-center text-[#b0c4de] mb-8 text-[0.9rem]">Please sign in to continue</p>

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
                        <label className="block mb-2 text-[0.85rem] text-[#e0e0e0]">Password</label>
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
            </div>
        </div>
    );
}

