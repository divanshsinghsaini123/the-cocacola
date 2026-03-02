"use client";

import { useState } from "react";
import Image from "next/image";

interface VideoCardProps {
    videoUrl: string;
    index: number;
}

export default function VideoCard({ videoUrl, index }: VideoCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    let videoId = "";
    try {
        const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/)(?:.*v\/|.*u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
        if (videoIdMatch && videoIdMatch[1]) {
            videoId = videoIdMatch[1];
        }
    } catch (e) {
        console.error("Error parsing video ID", e);
    }

    if (!videoId) return null;

    // Use maxresdefault for high quality, fallback might be needed but usually fine for brand videos
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    if (isPlaying) {
        return (
            <iframe
                src={embedUrl}
                className="w-full h-full"
                title={`Brand Video ${index}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            />
        );
    }

    return (
        <div
            className="w-full h-full relative group cursor-pointer"
            onClick={() => setIsPlaying(true)}
        >
            <Image
                src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + thumbnailUrl}
                alt="Video Thumbnail"
                fill
                className="object-cover"
            />
            {/* Overlay for premium feel */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

            {/* Custom Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1" // Optical center alignment
                    >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
            </div>
        </div>
    );
}
