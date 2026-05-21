/**
 * Resolves a Strapi media path to a full URL.
 * - Absolute URLs (http/https) are returned unchanged.
 * - Local Next.js public assets (/assets, etc.) are returned unchanged.
 * - Relative Strapi paths get NEXT_PUBLIC_STRAPICONTENT_PREFIX, or STRAPI_URL as fallback.
 */
export function getStrapiMediaUrl(
    path: string | null | undefined
): string {
    if (!path) return "";

    const trimmed = path.trim();
    if (!trimmed) return "";

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    // Next.js public folder assets — do not prefix with Strapi CDN
    if (trimmed.startsWith("/assets") || trimmed.startsWith("/cola")) {
        return trimmed;
    }

    const prefix =
        process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX ||
        process.env.NEXT_PUBLIC_STRAPI_URL ||
        "";

    if (!prefix) return trimmed;

    if (prefix.endsWith("/") && trimmed.startsWith("/")) {
        return prefix + trimmed.slice(1);
    }
    if (!prefix.endsWith("/") && !trimmed.startsWith("/")) {
        return `${prefix}/${trimmed}`;
    }
    return prefix + trimmed;
}

export function isStrapiLocal(): boolean {
    const base = process.env.NEXT_PUBLIC_STRAPI_URL || "";
    return base.includes("localhost");
}
