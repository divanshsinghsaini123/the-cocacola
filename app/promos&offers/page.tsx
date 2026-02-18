
import type { Metadata } from 'next';
import PromosAndOffersClient from './PromosClient';

export const metadata: Metadata = {
    title: "Promos & Offers",
    description: "There's always something new at The Cloud9 Beverages Company. Check out our latest promotions, sweepstakes, and special offers.",
};

export default function PromosAndOffersPage() {
    return <PromosAndOffersClient />;
}
