
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

export interface ButtonComponent {
    id: number;
    buttonText: string;
    buttonLink: string;
    disablebutton: boolean;
}

// Hero Section Types
export interface HeroData {
    id: number;
    heading: string;
    description: RichTextParagraph[];
    ButtonText: string;
    ButttonLink: string | null;
    ShowButton: boolean;
    imageMobile: StrapiImage;
    imageDesktop: StrapiImage;
    button?: ButtonComponent | null;
}

// Common Item Type for lists
export interface SectionItem {
    id: number;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string | null;
    image: StrapiImage;
    button?: ButtonComponent | null;
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
export interface MoreFromCloud9Data {
    id: number;
    sectionTitle: string;
    items: SectionItem[];
}

// Main Home Page Data Type
export interface HomePageData {
    hero: HeroData;
    promosAndOffers: PromosAndOffersData;
    features: FeaturesData;
    moreFromCloud9: MoreFromCloud9Data;
    footer?: any;
    socialLinks?: any;
    NavbarImage?: StrapiImage;
    NavbarHexCode?: string;
    NavbarFontColorHexCode?: string;
    Favicon?: StrapiImage;
    sameColorNavAndFoot?: boolean;
    attributes?: HomePageData; // For handling nested structure if API returns "attributes"
    PageButton?: PageButton;
}

export interface PageButton {
    id?: number;
    FontHexColor?: string;
    BackgroundHexColor?: string;
}
