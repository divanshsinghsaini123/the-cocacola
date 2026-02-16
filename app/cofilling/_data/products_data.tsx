import { Pill, BookOpen, Atom, Ban, Coffee, Milk, Apple } from "lucide-react";

export const productsData = [
    // 1. Energy Drink
    {
        title: "ENERGY DRINK",
        subtitle: "choose your flavour",
        layout: "left" as const,
        backgroundImage: "/assets/Coffiling_page/BG1-e1706537162881.png",
        productImage: "/assets/Coffiling_page/WEB-Your_Brand_ENERGY_DRINK_3can_3D-1-e1706517266345.png",
        totalColumns: 2 as const,
        flavours: [
            {
                title: "",
                columnsNumber: 1 as const,
                items: [
                    "cola", "cranberry", "red grape",
                    "mango-orange", "watermelon",
                    "pear", "multivitamin"
                ]
            },
            {
                title: "",
                columnsNumber: 2 as const,
                items: [
                    "classic", "plum",
                    "sugarfree", "cherry",
                    "half-sugar", "blackcurrant",
                    "apple"
                ]
            }
        ],
        features: [
            {
                icon: <Pill className="w-10 h-10 text-white" />,
                text: "vitamin content"
            },
            {
                icon: <BookOpen className="w-10 h-10 text-white" />,
                text: "recipe on request"
            }
        ],
        subFeatures: [
            {
                icon: <Atom className="w-6 h-6" />,
                text: "no preservatives"
            },
            {
                icon: <Ban className="w-6 h-6" />,
                text: "no aspartame"
            }
        ]
    },
    // 2. Carbonated Soft Drink
    {
        title: "CARBONATED SOFT DRINK",
        subtitle: "choose your flavour",
        layout: "right" as const,
        backgroundImage: "/assets/Coffiling_page/BG1-2-e1706537211470.png",
        productImage: "/assets/Coffiling_page/WEB-Your_Brand_CSD_3can_3D-1-e1706538023184.png",
        totalColumns: 2 as const,
        flavours: [
            {
                columnsNumber: 1 as const,
                items: [
                    "lemon", "tonic",
                    "cola", "orange",
                    "cola-zero",
                ]
            }
            ,
            {
                columnsNumber: 2 as const,
                items: [
                    "mojito",
                    "cola-lime", "ginger",
                    "orange lemonade", "lemon lemonade"
                ]
            }
        ],

        features: [
            {
                icon: <BookOpen className="w-10 h-10 text-white" />,
                text: "recipe on request"
            }
        ],
        subFeatures: [
            {
                icon: <Atom className="w-6 h-6" />,
                text: "no preservatives"
            },
            {
                icon: <Ban className="w-6 h-6" />,
                text: "no aspartame"
            }
        ]
    },
    // 3. Ice Tea
    {
        title: "ICE TEA",
        subtitle: "choose your flavour",
        layout: "left" as const,
        backgroundImage: "/assets/Coffiling_page/BG1-e1706537162881.png",
        productImage: "/assets/Coffiling_page/WEB-Your_Brand_ICE_TEA_3can_3D-1-e1706538266147.png",
        totalColumns: 1 as const,
        flavours: [
            {
                title: "",
                columnsNumber: 1 as const,
                items: [
                    "peach",
                    "lemon",
                    "strawberry",
                    "pear",
                    "citrus green tea",
                    "citrus green tea zero",
                    "pear"
                ]
            }
        ],
        features: [
            {
                icon: <BookOpen className="w-10 h-10 text-white" />,
                text: "recipe on request"
            },
            {
                icon: <Apple className="w-10 h-10 text-white" />,
                text: "1% fruit content"
            }
        ],
        subFeatures: [
            {
                icon: <Atom className="w-6 h-6" />,
                text: "no preservatives"
            },
            {
                icon: <Ban className="w-6 h-6" />,
                text: "no aspartame"
            }
        ]
    },
    // 4. Functional Drink
    {
        title: "FUNCTIONAL DRINK, VITAMIN DRINK",
        subtitle: "choose your flavour",
        layout: "right" as const,
        backgroundImage: "/assets/Coffiling_page/BG1-2-e1706537211470.png",
        productImage: "/assets/Coffiling_page/WEB-Your_Brand_FUNCTIONAL_3can_3D-1-e1706538716809.png",
        totalColumns: 2 as const,
        flavours: [
            {
                title: "VITAMIN WATER",
                columnsNumber: 1 as const,
                items: [
                    "lemon",
                    "orange",
                    "strawberry",
                    "prickly pear",
                    "mango-passionfruit"
                ]
            },
            {
                title: "BCAA DRINK",
                columnsNumber: 1 as const,
                items: [
                    "lime",
                    "mango",
                    "raspberry",
                    "apple",
                    "cherry"
                ]
            }
        ],
        features: [
            {
                icon: <BookOpen className="w-10 h-10 text-white" />,
                text: "recipe on request"
            }
        ],
        subFeatures: [
            {
                icon: <Atom className="w-6 h-6" />,
                text: "no preservatives"
            },
            {
                icon: <Ban className="w-6 h-6" />,
                text: "no aspartame"
            }
        ]
    },
    // 5. Coffee
    {
        title: "COFFEE, ICE COFFEE, MILK COFFEE",
        subtitle: "choose your flavour",
        layout: "left" as const,
        backgroundImage: "/assets/Coffiling_page/BG2-e1706537132149.png",
        productImage: "/assets/Coffiling_page/WEB-Your_Brand_COFFEE_3can_3D-1-e1706539295813.png",
        totalColumns: 1 as const,
        flavours: [
            {
                title: "",
                columnsNumber: 1 as const,
                items: [
                    "espresso",
                    "cappuccino",
                    "latte",
                    "caramel latte",
                    "vanilla latte"
                ]
            }
        ],
        features: [
            {
                icon: <Coffee className="w-10 h-10 text-white" />,
                text: "made with arabica and robusta coffee extract"
            },
            {
                icon: <Milk className="w-10 h-10 text-white" />,
                text: "made with 75% fresh milk"
            },
            {
                icon: <BookOpen className="w-10 h-10 text-white" />,
                text: "recipe on request"
            }
        ],
        subFeatures: [
            {
                icon: <Atom className="w-6 h-6" />,
                text: "no preservatives"
            },
            {
                icon: <Ban className="w-6 h-6" />,
                text: "no aspartame"
            }
        ]
    },
    // 6. Milk Drink
    {
        title: "MILK DRINK",
        subtitle: "choose your flavour",
        layout: "right" as const,
        backgroundImage: "/assets/Coffiling_page/BG3-e1706537032453.png",
        productImage: "/assets/Coffiling_page/WEB-Your_Brand_MILK_DRINK_3can_3D-1-e1706539653833.png",
        totalColumns: 1 as const,
        flavours: [
            {
                title: "",
                columnsNumber: 1 as const,
                items: [
                    "banana",
                    "strawberry",
                    "vanilla",
                    "white-chocolate"
                ]
            }
        ],
        features: [
            {
                icon: <Milk className="w-10 h-10 text-white" />,
                text: "made with 75% fresh milk"
            },
            {
                icon: <BookOpen className="w-10 h-10 text-white" />,
                text: "recipe on request"
            }
        ],
        subFeatures: [
            {
                icon: <Atom className="w-6 h-6" />,
                text: "no preservatives"
            },
            {
                icon: <Ban className="w-6 h-6" />,
                text: "no aspartame"
            }
        ]
    }
];
