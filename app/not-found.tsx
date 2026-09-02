import Link from "next/link";

export default function NotFound() {
    return (
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-6 sm:py-10 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Cloud Graphic & Floating Badge */}
            <div className="mb-2 sm:mb-4 relative flex flex-col items-center">
                <div className="relative flex items-center justify-center animate-bounce">
                    {/* SVG Cloud Icon */}
                    <svg
                        className="w-24 h-24 sm:w-36 sm:h-36 text-red-600/90 filter drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                    </svg>

                    {/* Drink Icon centered inside cloud */}
                    <span className="absolute text-3xl sm:text-4xl drop-shadow-md">
                        🥤
                    </span>
                </div>

                <div className="-mt-1 bg-foreground text-background text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-red-500/50 shadow">
                    LOST IN CLOUD 9
                </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-foreground mb-2 sm:mb-3">
                4<span className="text-red-600">0</span>4
            </h1>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground mb-2 sm:mb-4 px-2">
                Looks Like You Flew Higher Than <span className="text-red-600">Cloud 9</span>!
            </h2>

            <p className="text-sm sm:text-base text-foreground/75 max-w-sm sm:max-w-md mb-6 sm:mb-8 leading-relaxed px-2">
                The page you're searching for fizzed out into the clouds or moved to another dimension.
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center justify-center gap-4 z-10">
                <Link
                    href="/"
                    className="px-6 sm:px-7 py-3 sm:py-3.5 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-bold rounded-full shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
