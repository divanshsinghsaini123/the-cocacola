import { GetEventsData } from "@/src/lib/strapi";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventGalleryCarousel from "../_components/EventGalleryCarousel";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const data = await GetEventsData();
    if (data?.DisablePage) return notFound();
    const event = data?.Event?.find((e: any) => e.id.toString() === id);
    // console.log(event);
    if (!event) {
        return notFound();
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-0 min-h-screen">

            <div className="bg-component rounded-none sm:rounded-3xl shadow-sm border-y sm:border border-x-0 sm:border-x border-foreground/10 overflow-hidden -mx-4 sm:mx-0 pb-6">
                <div className="p-3 md:p-8 border-b border-foreground/5">
                    <Link href="/events" className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mb-3 transition-colors text-sm">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </Link>
                    <h1 className="text-3xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-4 tracking-tight">{event.EventName}</h1>

                    {event.hasAddress && (
                        <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-full font-medium text-sm mb-2">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.EventAddress ? event.EventAddress : "Address to be announced"}
                        </div>
                    )}

                    <p className="text-sm md:text-xl text-foreground/80 leading-relaxed max-w-5xl whitespace-pre-wrap">
                        {event.EventDescription}
                    </p>
                </div>

                {event.Media && event.Media.length > 0 && (
                    <EventGalleryCarousel images={event.Media} eventName={event.EventName} />
                )}
            </div>
        </div>
    );
}
