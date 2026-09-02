import { GetBlogsData } from "@/src/lib/strapi";
import Link from "next/link";
import React from "react";
import { BlogsGrid } from "./_components/BlogsGrid";

import { Metadata } from "next";
import { notFound } from "next/navigation";

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

export interface BlogsPageData {
    id: number;
    documentId: string;
    heading: string;
    description?: string | null;
    date?: string;
    author?: string;
    DisablePage?: boolean;
    SEO?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string;
        shareImage?: any;
    };
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    blog: BlogItem[];
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await GetBlogsData();
    const seo = data?.SEO;

    return {
        title: seo?.metaTitle || "Blogs | Cloud 9",
        description: seo?.metaDescription || "Explore latest blogs and news from Cloud 9.",
        keywords: seo?.keywords || "Cloud 9, blogs, news",
    };
}

export default async function BlogsPage() {
    const apiData = await GetBlogsData();
    const data: BlogsPageData = apiData;

    if (!data || data?.DisablePage) return notFound();


    const pageHeading = data.heading;
    const pageDescription = data.description;
    const authorName = data.author;
    const publishedDate = data.date ? new Date(data.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    }) : null;

    const blogList = data.blog || [];

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            {/* Main Section Header */}
            <div className="mb-10 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4">
                    {pageHeading}
                </h1>
                {pageDescription && (
                    <p className="text-lg text-foreground/75 leading-relaxed">
                        {pageDescription}
                    </p>
                )}
            </div>

            {/* Blogs Grid with Load More */}
            <BlogsGrid
                blogList={blogList}
                authorName={authorName || "Admin"}
                publishedDate={publishedDate}
                initialCount={6}
            />

        </div>
    );
}

