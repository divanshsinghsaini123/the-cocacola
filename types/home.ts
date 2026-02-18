
// Basic types for strapi image formats
export interface ImageFormat {
    url: string;
    width: number;
    height: number;
}

export interface StrapiImage {
    id: number;
    url: string;
    formats: {
        large?: ImageFormat;
        medium?: ImageFormat;
        small?: ImageFormat;
        thumbnail?: ImageFormat;
    };
    data?: any;
}

export interface RichTextChild {
    text: string;
    type?: string;
    bold?: boolean;
}

export interface RichTextParagraph {
    type: 'paragraph';
    children: RichTextChild[];
}

// Hero Section Types
export interface HeroData {
    id: number;
    heading: string;
    description: RichTextParagraph[];
    ButtonText: string;
    ButttonLink: string | null;
    ShowButton: boolean;
    image: StrapiImage;
}

// Common Item Type for lists
export interface SectionItem {
    id: number;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string | null;
    image: StrapiImage;
}

// Promos and Offers Section Types
export interface PromosAndOffersData {
    id: number;
    sectionTitle: string;
    items: SectionItem[];
}

// Features Section Types
export interface FeaturesData {
    id: number;
    sectionTitle: string;
    items: SectionItem[];
}

// More from CocaCola Section Types
export interface MoreFromCocaColaData {
    id: number;
    sectionTitle: string;
    items: SectionItem[];
}

// Main Home Page Data Type
export interface HomePageData {
    hero: HeroData;
    promosAndOffers: PromosAndOffersData;
    features: FeaturesData;
    moreFromCocaCola: MoreFromCocaColaData;
    footer?: any;
    socialLinks?: any;
    NavbarImage?: any;
    attributes?: any; // For handling nested structure if API returns "attributes"
}
