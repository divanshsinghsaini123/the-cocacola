type Entry = { count: number; expiresAt: number };
const store = new Map<string, Entry>();

export function rateLimit(key: string, limit: number, windowSeconds: number) {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.expiresAt < now) {
        store.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
        return { success: true, remaining: limit - 1 };
    }
    if (entry.count >= limit) {
        return { success: false, remaining: 0 };
    }
    entry.count++;
    return { success: true, remaining: limit - entry.count };
}
