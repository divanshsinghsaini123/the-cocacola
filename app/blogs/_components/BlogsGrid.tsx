"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface BlogItem {
    id: number;
    slug: string;
    heading: string;
    description: string;
    blogContent: any[];
    images?: Array<{
        id: number;
        url: string;
        alternativeText?: string;
        formats?: any;
    }>;
}

interface BlogsGridProps {
    blogList: BlogItem[];
    authorName?: string;
    publishedDate: string | null;
    initialCount?: number;
}


export function BlogsGrid({ blogList, authorName, publishedDate, initialCount = 6 }: BlogsGridProps) {
    const [visibleCount, setVisibleCount] = useState(initialCount);

    if (!blogList || blogList.length === 0) {
        return (
            <div className="text-center py-16 text-foreground/60">
                No blogs available at the moment.
            </div>
        );
    }

    const visibleBlogs = blogList.slice(0, visibleCount);
    const hasMore = visibleCount < blogList.length;

    return (
        <div>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleBlogs.map((item) => {
                    const firstImage = item.images && item.images.length > 0 ? item.images[0].url : null;

                    return (
                        <Link
                            key={item.id}
                            href={`/blogs/${item.slug}`}
                            className="group flex flex-col bg-component rounded-2xl overflow-hidden border border-foreground/10 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* First Image Thumbnail */}
                            {firstImage ? (
                                <div className="relative w-full h-56 overflow-hidden bg-foreground/5">
                                    <Image
                                        src={firstImage}
                                        alt={item.heading}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            ) : (
                                <div className="relative w-full h-56 bg-gradient-to-br from-red-600/20 to-red-900/40 flex items-center justify-center">
                                    <span className="text-foreground/40 text-sm font-medium">No Image Available</span>
                                </div>
                            )}

                            {/* Blog Card Content */}
                            <div className="p-6 flex flex-col flex-grow justify-between">
                                <div>
                                    {/* Metadata (Author & Date) */}
                                    <div className="flex items-center space-x-3 text-xs text-foreground/60 mb-3">
                                        <span className="font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                            {authorName}
                                        </span>
                                        {publishedDate && (
                                            <>
                                                <span>•</span>
                                                <span>{publishedDate}</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Heading */}
                                    <h2 className="text-xl font-bold text-foreground group-hover:text-red-600 transition-colors line-clamp-2 mb-3">
                                        {item.heading}
                                    </h2>

                                    {/* Description */}
                                    {item.description && (
                                        <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                {/* Read More Link */}
                                <div className="mt-6 flex items-center text-sm font-semibold text-red-600 group-hover:text-red-700">
                                    Read Full Blog
                                    <svg
                                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-md transition-all transform hover:scale-105"
                    >
                        Load More Blogs
                    </button>
                </div>
            )}
        </div>
    );
}
