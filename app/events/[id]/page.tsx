import { GetEventsData } from "@/src/lib/strapi";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventGalleryCarousel from "../_components/EventGalleryCarousel";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const data = await GetEventsData();
    const event = data?.Event?.find((e: any) => e.id.toString() === id);

    if (!event) {
        return notFound();
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
            <Link href="/events" className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mb-8 transition-colors text-lg">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Events
            </Link>

            <div className="bg-component rounded-3xl shadow-sm border border-foreground/10 overflow-hidden">
                <div className="p-8 md:p-12 border-b border-foreground/5">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-6 tracking-tight">{event.EventName}</h1>

                    {event.hasAddress && (
                        <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-full font-medium text-sm mb-8">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.EventAddress ? event.EventAddress : "Address to be announced"}
                        </div>
                    )}

                    <p className="text-xl text-foreground/80 leading-relaxed max-w-5xl whitespace-pre-wrap">
                        {event.EventDescription}
                    </p>
                </div>

                {event.Image && event.Image.length > 0 && (
                    <EventGalleryCarousel images={event.Image} eventName={event.EventName} />
                )}
            </div>
        </div>
    );
}
