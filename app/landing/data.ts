export interface BrandCardData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  link: string;
  bgColor: string;         // Primary theme color
  accentColor: string;     // Bright highlighting color (for titles, glow, buttons)
}

export const brandCards: BrandCardData[] = [
  {
    id: "coca-cola",
    title: "Coca-Cola",
    tagline: "Real Magic",
    description: "Experience the original, refreshing taste that has brought people together for generations. Every sip is filled with pure magic.",
    image: "/assets/Home/cococola_brand.webp",
    link: "/brands/coke", // Update based on your actual routes, e.g. /brands/coca-cola or using slug
    bgColor: "#C1121F",
    accentColor: "#FF0015"
  },
  {
    id: "sprite",
    title: "Sprite",
    tagline: "Heat Happens. Stay Cool.",
    description: "Crisp, clean, and refreshing. Sprite is the ultimate lemon-lime soda designed to quench your thirst and keep you cool.",
    image: "/assets/Home/sprite_brand.webp",
    link: "/brands/sprite",
    bgColor: "#004B23",
    accentColor: "#00FF66"
  },
  {
    id: "fanta",
    title: "Fanta",
    tagline: "More Fanta, Less Serious.",
    description: "Vibrant, bubbly, and burst with fruity orange flavor. Fanta turns any moment into a fun, colorful celebration.",
    image: "/assets/Home/fanta_brand.webp",
    link: "/brands/fanta",
    bgColor: "#F77F00",
    accentColor: "#FF8F00"
  },
  {
    id: "diet-coke",
    title: "Diet Coke",
    tagline: "Love What You Love.",
    description: "The light, sugar-free, calorie-free soda with that iconic taste. Perfect for those who love to live life on their own terms.",
    image: "/assets/Home/dietcoke_brand.webp",
    link: "/brands/diet-coke",
    bgColor: "#4A4E69",
    accentColor: "#FF3B30" // Red stripe accent
  },
  {
    id: "minute-maid",
    title: "Minute Maid",
    tagline: "Always Good, Always Ready.",
    description: "Made from real fruit, Minute Maid brings goodness in every drop. Fresh, wholesome juices that brighten up your day.",
    image: "/assets/Home/minutemade_brand.webp",
    link: "/brands/minute-maid",
    bgColor: "#E9D8A6",
    accentColor: "#FFCC00"
  },
  {
    id: "smartwater",
    title: "Smartwater",
    tagline: "Simplicity is Delicious.",
    description: "Vapor-distilled water for supreme purity, added electrolytes for a crisp, clean taste. Pure, simple, and smart.",
    image: "/assets/Home/smartwater_brand.webp",
    link: "/brands/smartwater",
    bgColor: "#0077B6",
    accentColor: "#00B4D8"
  }
];
