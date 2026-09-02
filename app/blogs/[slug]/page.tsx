import { GetBlogsData } from "@/src/lib/strapi";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RenderRichText } from "../_components/RenderRichText";

import { Metadata } from "next";

interface BlogItem {
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

interface BlogsPageData {
    id: number;
    heading: string;
    date?: string;
    author?: string;
    DisablePage?: boolean;
    SEO?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string;
        shareImage?: any;
    };
    blog: BlogItem[];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const data = await GetBlogsData();
    const blog = data?.blog?.find((b: BlogItem) => b.slug === slug);
    const seo = data?.SEO;

    return {
        title: blog?.heading ? `${blog.heading} | Cloud 9` : seo?.metaTitle || "Blog | Cloud 9",
        description: blog?.description || seo?.metaDescription || "Read blog post on Cloud 9",
        keywords: seo?.keywords || "Cloud 9, blog",
    };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const apiData = await GetBlogsData();
    const data: BlogsPageData = apiData;

    if (!data || data?.DisablePage) return notFound();


    const blog = data?.blog?.find((b) => b.slug === slug);

    if (!blog) {
        return notFound();
    }

    const authorName = data.author || "Admin";
    const publishedDate = data.date ? new Date(data.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }) : null;

    return (
        <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 min-h-screen">
            {/* Back Button */}
            <div className="mb-3 sm:mb-6">
                <Link
                    href="/blogs"
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors text-xs sm:text-sm"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Blogs
                </Link>
            </div>

            {/* Article Container */}
            <article className="bg-component border border-foreground/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm">
                {/* Meta Header */}
                <div className="mb-4 sm:mb-8 border-b border-foreground/10 pb-4 sm:pb-8">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-foreground/60 mb-2 sm:mb-4">
                        <span className="font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                            By {authorName}
                        </span>
                        {publishedDate && (
                            <>
                                <span>•</span>
                                <span>{publishedDate}</span>
                            </>
                        )}
                    </div>

                    <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-snug sm:leading-tight mb-2 sm:mb-4">
                        {blog.heading}
                    </h1>

                    {blog.description && (
                        <p className="text-sm sm:text-lg md:text-xl text-foreground/75 leading-relaxed font-medium">
                            {blog.description}
                        </p>
                    )}
                </div>

                {/* Main Cover Image / Image Gallery */}
                {blog.images && blog.images.length > 0 && (
                    <div className="mb-6 sm:mb-10 space-y-4 sm:space-y-6">
                        <div className="relative w-full h-[220px] sm:h-[450px] md:h-[550px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
                            <Image
                                src={blog.images[0].url}
                                alt={blog.heading}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Extra Images grid if more than 1 */}
                        {blog.images.length > 1 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-2">
                                {blog.images.slice(1).map((img, idx) => (
                                    <div key={img.id || idx} className="relative h-28 sm:h-40 rounded-lg sm:rounded-xl overflow-hidden border border-foreground/10">
                                        <Image
                                            src={img.url}
                                            alt={`${blog.heading} gallery image ${idx + 2}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}


                {/* Rendered Rich Text Content */}
                <div className="prose dark:prose-invert max-w-none">
                    <RenderRichText content={blog.blogContent} />
                </div>
            </article>
        </div>
    );
}
