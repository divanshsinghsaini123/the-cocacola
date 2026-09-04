"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GetCampaignData } from "@/src/lib/strapi";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

interface CharacterPhoto {
    url?: string;
    name?: string;
    alternativeText?: string;
}

interface CharacterItem {
    id: number;
    characterName: string;
    characterPhoto?: CharacterPhoto;
}

interface MirzapurVotesData {
    id?: number;
    heading?: string;
    mainText?: string;
    footerText?: string;
    DisablePage?: boolean;
    logo?: {
        url?: string;
        alternativeText?: string;
    } | null;
    character?: CharacterItem[];
}

export default function MirzapurVotesPage() {
    const [votesData, setVotesData] = useState<MirzapurVotesData | null>(null);
    const [loading, setLoading] = useState(true);

    // Selected Character state
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterItem | null>(null);
    const [votedCharacter, setVotedCharacter] = useState<CharacterItem | null>(null);

    // Modal & Form states
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [instagram, setInstagram] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [voteSuccess, setVoteSuccess] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await GetCampaignData();
                if (data?.MirzapurVotes) {
                    setVotesData(data.MirzapurVotes);
                }
            } catch (err) {
                console.error("Failed to fetch MirzapurVotes data from Strapi:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();

        // Restore any saved vote from localStorage
        try {
            const saved = localStorage.getItem("mirzapur_vote_character");
            if (saved) {
                const parsed = JSON.parse(saved);
                setVotedCharacter(parsed);
                setSelectedCharacter(parsed);
            }
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    const handleSelectCharacter = (character: CharacterItem) => {
        setSelectedCharacter(character);
    };

    const handleOpenVoteModal = () => {
        if (!selectedCharacter) return;
        setFormError(null);
        setShowVoteModal(true);
    };

    const handleSubmitVote = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!selectedCharacter) {
            setFormError("Please select a character to vote.");
            return;
        }

        if (!name.trim()) {
            setFormError("Please enter your name.");
            return;
        }

        if (!phone.trim()) {
            setFormError("Please enter your phone number.");
            return;
        }

        // Validate phone (10 digits recommended)
        const cleanedPhone = phone.replace(/\D/g, "");
        if (cleanedPhone.length < 10) {
            setFormError("Please enter a valid 10-digit phone number.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/Campaigns/mirzapur-votes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: cleanedPhone,
                    instagram: instagram.trim(),
                    characterName: selectedCharacter.characterName,
                    characterId: selectedCharacter.id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit your vote.");
            }

            // Success
            setVotedCharacter(selectedCharacter);
            setVoteSuccess(true);
            try {
                localStorage.setItem("mirzapur_vote_character", JSON.stringify(selectedCharacter));
            } catch {
                // Ignore storage error
            }
        } catch (err: any) {
            console.error("Vote submission error:", err);
            setFormError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowVoteModal(false);
        setFormError(null);
        if (voteSuccess) {
            setVoteSuccess(false);
        }
    };

    // Disabled Page State
    if (!loading && votesData?.DisablePage) {
        return (
            <main className="min-h-screen bg-[#0a0505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,20,20,0.15)_0,rgba(10,5,5,1)_70%)] pointer-events-none" />
                <div className="relative z-10 text-center max-w-md">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-red-600 uppercase font-sans mb-3 drop-shadow-[0_2px_10px_rgba(220,38,38,0.5)]">
                        Coming Soon
                    </h1>
                    <p className="text-neutral-400 text-sm md:text-base">
                        The Mirzapur voting campaign is currently paused. Please check back later!
                    </p>
                </div>
            </main>
        );
    }

    const heading = votesData?.heading;
    const mainText = votesData?.mainText;
    const footerText = votesData?.footerText;
    const characters = votesData?.character || [];
    const logoUrl = votesData?.logo?.url ? getStrapiMediaUrl(votesData.logo.url) : null;

    return (
        <main className="min-h-screen bg-[#070404] text-white flex flex-col items-center justify-start py-6 sm:py-2 px-4 sm:px-6 relative overflow-x-hidden select-none">
            {/* Blood splatter / Cinematic radial background accents */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-950/20 rounded-full blur-[140px]" />
            </div>

            {/* Poster Card Container */}
            <div className="relative z-10 w-full max-w-[580px] bg-[#0c0808] border border-red-950/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(180,20,20,0.15)] p-5 pt-4 sm:p-5 sm:pt-2.5 sm:pb-4 flex flex-col">

                {/* Top Row: Mirzapur Logo Centered */}
                <header className="flex items-center justify-center pt-1 pb-3 sm:pt-0 sm:pb-1">
                    <div className="flex flex-col items-center justify-center text-center">
                        {logoUrl ? (
                            <div className="relative h-14 sm:h-14 md:h-16 w-44 sm:w-48 md:w-56 flex items-center justify-center">
                                <Image
                                    src={logoUrl}
                                    alt="Mirzapur The Movie"
                                    width={260}
                                    height={90}
                                    className="w-full h-auto object-contain max-h-16"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="text-center">
                                <span className="block font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-red-600 uppercase leading-none drop-shadow-[0_2px_12px_rgba(220,38,38,0.7)] font-sans">
                                    MIRZAPUR
                                </span>
                                <span className="block text-[10px] sm:text-[11px] tracking-[0.3em] text-neutral-300 font-bold uppercase mt-0.5">
                                    THE MOVIE
                                </span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Heading: PICK YOUR MIRZAPUR CHARACTER. */}
                <div className="py-3 sm:py-1.5 text-center">
                    <h1 className="text-xl sm:text-2xl md:text-[25px] font-black tracking-wider uppercase text-[#eee8dc] leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                        {heading}
                    </h1>
                </div>

                {/* Character Grid: 2 columns on mobile (2x3), 3 columns on desktop (3x2) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-2 bg-black/70 p-2 sm:p-2.5 rounded-xl border border-red-950/50 shadow-inner">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="aspect-[4/3] sm:aspect-square bg-neutral-900 animate-pulse rounded flex items-center justify-center text-neutral-700 text-xs"
                            >
                                Loading...
                            </div>
                        ))
                    ) : characters.length > 0 ? (
                        characters.map((char) => {
                            const isSelected = selectedCharacter?.id === char.id;
                            const isVoted = votedCharacter?.id === char.id;
                            const photoUrl = char.characterPhoto?.url
                                ? getStrapiMediaUrl(char.characterPhoto.url)
                                : null;

                            return (
                                <button
                                    type="button"
                                    key={char.id}
                                    onClick={() => handleSelectCharacter(char)}
                                    className={`relative group aspect-[4/3] sm:aspect-square overflow-hidden rounded cursor-pointer transition-all duration-300 text-left outline-none ${isSelected
                                        ? "ring-2 sm:ring-4 ring-red-600 scale-[1.02] z-20 shadow-[0_0_20px_rgba(220,38,38,0.8)]"
                                        : "hover:scale-[1.01] hover:brightness-110 ring-1 ring-neutral-800"
                                        }`}
                                >
                                    {photoUrl ? (
                                        <Image
                                            src={photoUrl}
                                            alt={char.characterName || "Mirzapur Character"}
                                            fill
                                            sizes="(max-width: 640px) 33vw, 180px"
                                            className={`object-cover object-top transition-transform duration-500 ${isSelected ? "scale-105" : "group-hover:scale-105"
                                                }`}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs">
                                            No Image
                                        </div>
                                    )}

                                    {/* Vignette / Gradient over photo */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 ${isSelected ? "opacity-90" : "opacity-60 group-hover:opacity-80"
                                            }`}
                                    />

                                    {/* Selection / Vote Badge */}
                                    {isSelected && (
                                        <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                                            {isVoted ? "VOTED" : "PICKED"}
                                        </div>
                                    )}

                                    {/* Character Name Tag at Bottom */}
                                    <div className="absolute bottom-0 inset-x-0 p-1 sm:p-1.5 text-center">
                                        <p
                                            className={`text-[11px] sm:text-xs font-black uppercase tracking-tight truncate leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${isSelected ? "text-red-400 font-extrabold" : "text-neutral-200"
                                                }`}
                                        >
                                            {char.characterName}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="col-span-3 py-10 text-center text-neutral-500 text-sm">
                            No characters available.
                        </div>
                    )}
                </div>

                {/* Vote Action Button (triggers the details modal) */}
                {selectedCharacter && (
                    <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <button
                            type="button"
                            onClick={handleOpenVoteModal}
                            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] font-black text-white uppercase tracking-wider text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>
                                {votedCharacter?.id === selectedCharacter.id
                                    ? `CHANGE VOTE TO ${selectedCharacter.characterName.toUpperCase()}`
                                    : `VOTE FOR ${selectedCharacter.characterName.toUpperCase()}`}
                            </span>
                            <span className="text-base">→</span>
                        </button>
                    </div>
                )}

                {/* Bottom Section: Main Text & Footer Text */}
                <div className="pt-6 sm:pt-3.5 pb-1 sm:pb-0 text-center flex flex-col items-center">
                    {/* WIN FREE MIRZAPUR TICKETS */}
                    <div className="font-black uppercase tracking-tight leading-tight text-red-600 text-2xl sm:text-3xl md:text-[34px] drop-shadow-[0_2px_12px_rgba(220,38,38,0.6)]">
                        {mainText?.toUpperCase().includes("WIN FREE") ? (
                            <>
                                <span className="block">WIN FREE</span>
                                <span className="block">
                                    {mainText?.replace(/win\s+free/i, "").trim()}
                                </span>
                            </>
                        ) : (
                            <span>{mainText}</span>
                        )}
                    </div>

                    {/* IF THEY SURVIVE, YOU STAND A CHANCE TO WIN A MOVIE TICKET */}
                    <div className="mt-4 sm:mt-2.5 max-w-md">
                        <p className="font-black uppercase tracking-wide text-[#ebe4d5] text-xs sm:text-sm md:text-[15px] leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                            {footerText}
                        </p>
                    </div>
                </div>

            </div>

            {/* Voting Details Dialog / Modal */}
            {showVoteModal && selectedCharacter && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0e0909] border border-red-700/60 rounded-2xl max-w-md w-full p-6 text-left shadow-[0_0_40px_rgba(220,38,38,0.5)] relative">
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            disabled={submitting}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg font-bold w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                        >
                            ✕
                        </button>

                        {voteSuccess ? (
                            /* Success Screen */
                            <div className="text-center py-4">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 text-3xl">
                                    ✓
                                </div>

                                <span className="inline-block px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                                    Vote Registered!
                                </span>

                                <h3 className="text-2xl font-black uppercase tracking-wide text-white mb-2">
                                    {selectedCharacter.characterName}
                                </h3>

                                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                                    Your vote has been saved! If{" "}
                                    <strong className="text-white">{selectedCharacter.characterName}</strong> survives,
                                    you stand a chance to win a free Mirzapur movie ticket.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            /* Entry Form */
                            <form onSubmit={handleSubmitVote} className="space-y-4">
                                <div>
                                    <span className="inline-block px-2.5 py-0.5 bg-red-600/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                                        Cast Your Vote
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                                        Enter Your Details
                                    </h2>
                                </div>

                                {/* Selected Character (Non-editable) */}
                                <div className="p-3 bg-neutral-900/90 border border-red-950/60 rounded-xl flex items-center gap-3">
                                    {selectedCharacter.characterPhoto?.url ? (
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-700">
                                            <Image
                                                src={getStrapiMediaUrl(selectedCharacter.characterPhoto.url)}
                                                alt={selectedCharacter.characterName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : null}
                                    <div className="flex-1 min-w-0">
                                        <span className="block text-[10px] font-bold text-red-500 uppercase tracking-wider">
                                            Selected Character (Non-editable)
                                        </span>
                                        <span className="block text-sm sm:text-base font-black text-white truncate">
                                            {selectedCharacter.characterName}
                                        </span>
                                    </div>
                                    <div className="px-2 py-1 bg-red-600/20 border border-red-600/30 rounded text-red-400 text-[10px] font-bold uppercase">
                                        Locked
                                    </div>
                                </div>

                                {/* Error Banner */}
                                {formError && (
                                    <div className="p-2.5 bg-red-950/60 border border-red-800 rounded-lg text-red-300 text-xs font-semibold">
                                        {formError}
                                    </div>
                                )}

                                {/* Name Field */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Rahul Sharma"
                                        required
                                        disabled={submitting}
                                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                                    />
                                </div>

                                {/* Phone Number Field */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="10-digit mobile number"
                                        required
                                        maxLength={12}
                                        disabled={submitting}
                                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                                    />
                                </div>

                                {/* Instagram Username (Optional) */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                                        <span>Instagram Username</span>
                                        <span className="text-[10px] text-neutral-500 font-normal lowercase">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                        placeholder="@yourusername"
                                        disabled={submitting}
                                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                                    />
                                </div>

                                {/* Submit Vote Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Recording Vote...</span>
                                        </>
                                    ) : (
                                        <span>Confirm & Submit Vote</span>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
