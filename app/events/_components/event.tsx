



import Link from "next/link";

interface EventProps {
    event: {
        id: number;
        EventName: string;
        EventDescription: string;
        hasAddress: boolean;
        EventAddress?: string;
        Image?: {
            id?: number;
            Picture: any;
            AltText?: string;
        }[];
    };
}

export default function Event({ event }: EventProps) {
    const firstImg = event.Image && event.Image.length > 0 ? event.Image[0] : null;
    const imgUrl = firstImg?.Picture?.url || firstImg?.Picture?.formats?.large?.url;

    return (
        <div className="bg-component rounded-2xl shadow-sm border border-foreground/10 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            {imgUrl && (
                <div className="relative aspect-video w-full overflow-hidden bg-background">
                    <img
                        src={imgUrl}
                        alt={firstImg.AltText}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}

            <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-foreground mb-4">{event.EventName}</h2>

                {event.hasAddress && (
                    <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-full font-medium text-sm mb-6 w-fit">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.EventAddress ? event.EventAddress : "Address to be announced"}</span>
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-foreground/10">
                    <Link href={`/events/${event.id}`} className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-[var(--component)] font-semibold rounded-xl transition-colors duration-200 shadow-sm hover:shadow">
                        Explore
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}