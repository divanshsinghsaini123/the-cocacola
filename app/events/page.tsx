import { GetEventsData } from "@/src/lib/strapi";
import Event from "./_components/event";

export default async function EventsPage() {
    const data = await GetEventsData();
    const heading = data?.Heading;
    const description = data?.Description;
    const events = data?.Event;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6">
                    {heading}
                </h1>
                <p className="max-w-3xl mx-auto text-xl text-foreground/80 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events?.map((event: any, index: number) => (
                    <Event key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}