import { z } from "zod";

export const AdminLoginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const BrandSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    logo: z.string().min(1, "Logo is required"),
    images: z.array(z.string()).optional(),
    descriptions: z.object({
        d1: z.string().optional(),
        d2: z.string().optional(),
        d3: z.string().optional(),
    }).optional(),
    socialLinks: z.object({
        title: z.string().optional(),
        facebook: z.string().optional(),
        x: z.string().optional(),
        instagram: z.string().optional(),
        youtube: z.string().optional(),
    }).optional(),
    youtubeVideos: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    order: z.number().optional(),
});

export const ProductSchema = z.object({
    brand: z.string().min(1, "Brand is required"),
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    description: z.string().optional(),
    summary: z.string().optional(),
    sizesAvailable: z.array(z.string()).optional(),
    nutrition: z.object({
        quantity: z.string().optional(),
        diet: z.string().optional(),
        ingredients: z.string().optional(),
        nutritionfacts: z.array(
            z.object({
                key: z.object({
                    name: z.string(),
                    amount: z.string(),
                }),
            })
        ).optional(),
    }).optional(),
    stores: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    order: z.number().optional(),
});

export const StoreSchema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.string().min(1, "Image is required"),
    link: z.string().min(1, "Link is required"),
    address: z.string().optional(),
    phone: z.string().optional(),
    modeofstore: z.string().min(1, "Mode of store is required"),
    isActive: z.boolean().optional(),
});

export const IssueSchema = z.object({
    FirstName: z.string().min(1, "First name is required"),
    LastName: z.string().optional().or(z.literal('')),
    Email: z.string().min(1, "Email is required"),
    PhoneNumber: z.string().optional().or(z.literal('')),
    PinCode: z.string().min(1, "Pin code is required"),
    Address: z.string().min(1, "Address is required"),
    City: z.string().min(1, "City is required"),
    State: z.string().min(1, "State is required"),
    ProductAvailability: z.boolean(),
    DrinkSize: z.string().min(1, "Drink size is required"),
    DefectiveQuantity: z.number().min(0, "Defective quantity must be positive"),
    ExpirationDate: z.string().min(1, "Expiration date is required"),
    ProductionCode: z.number().min(0, "Production code must be positive"),
    IssueMessage: z.string().min(1, "Issue message is required"),
    IsActive: z.boolean().optional(),
});

export const QuestionSchema = z.object({
    FirstName: z.string().min(1, "First name is required"),
    LastName: z.string().optional().or(z.literal('')),
    Email: z.string().min(1, "Email is required"),
    PhoneNumber: z.string().optional().or(z.literal('')),
    PinCode: z.string().min(1, "Pin code is required"),
    Address: z.string().min(1, "Address is required"),
    City: z.string().min(1, "City is required"),
    State: z.string().min(1, "State is required"),
    DOB: z.string().optional().or(z.literal('')),
    QuestionMessage: z.string().min(1, "Question message is required"),
    IsActive: z.boolean().optional(),
});


export const ContactusCoffilingSchema = z.object(
    {
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().min(1, "Email is required"),
        companyName: z.string().min(1, "Company name is required"),
        companyWebsite: z.string(),
        officeAddress: z.string(),
        country: z.string(),
        hasTrademark: z.boolean(),
        yearlyVolume: z.string(),
        productSize: z.string(),
        message: z.string(),
        IsActive: z.boolean().optional(),
        brandName: z.string(),
        agreedToPrivacy: z.literal(true, {
            error: "You must agree to the privacy policy",
        }),
    }
)
export const ContactUsBecomeOurDistributorSchema = z.object(
    {
        name: z.string().min(1, "Name is required"),
        email: z.string().min(1, "Email is required"),
        phone: z.string().min(1, "Phone is required"),
        pinCode: z.string().min(1, "Pin code is required"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        businessType: z.string().min(1, "Business type is required"),
        investmentPlan: z.string().min(1, "Investment plan is required"),
        isActive: z.boolean().optional(),
    }
)

export const CalculatorProductSchema = z.object({
    productname: z.string().min(1, "Product name is required"),
    states: z.array(z.string()).min(1, "At least one state is required"),
    sizeAndChanges: z.array(
        z.object({
            size: z.string().min(1, "Size is required"),
            bottlesPerCase: z.number().min(1, "Bottles per case is required"),
            bottleComponents: z.array(
                z.object({
                    name: z.string().min(1, "Component name is required"),
                    rate: z.number(),
                })
            ).default([]),
            extraComponents: z.array(
                z.object({
                    name: z.string().min(1, "Component name is required"),
                    rate: z.number(),
                })
            ).default([]),
        })
    ).optional().default([]),
});

export const ShopValidationSchema = z.object({
    outletDetails: z.object({
        shopName: z.string().min(1, "Shop name is required"),
        ownerName: z.string().min(1, "Owner name is required"),
        date: z.preprocess((arg) => {
            if (typeof arg === "string" && arg) return new Date(arg);
            return arg;
        }, z.date({ message: "Date is required" })),
        gender: z.enum(["Male", "Female", "Other"]),
        age: z.number().min(18, "Age must be at least 18").max(70, "Age must be at most 70"),
        address: z.string().min(1, "Address is required"),
        pincode: z.number().min(1, "Pincode is required"),
        area: z.string().min(1, "Area is required"),
        mobileNumber: z.string().min(1, "Mobile number is required"),
        email: z.string().optional().or(z.literal('')),
    }),
    distributorDetails: z.object({
        distributorName: z.string().min(1, "Distributor name is required"),
        accountNumber: z.number().min(1, "Account number is required"),
        hubName: z.string().min(1, "Hub name is required"),
    }),
    businessDetails: z.object({
        outletType: z.string().min(1, "Outlet type is required"),
        visibility: z.enum(["Main Road", "Internal Road", "Premium"]),
        competitors: z.boolean().optional().default(true),
        nearbyAreaFootfall: z.enum(["High", "Medium", "Low"]),
        fridgeType: z.enum(["255", "280", "360", "450", "mini"]).optional().or(z.literal('')),
        visicooler: z.array(z.string()).optional(),
        branding: z.array(z.enum(["ED", "Water", "Other"])).default([]),
    }),
    images: z.array(
        z.object({
            url: z.string().min(1, "Image URL is required"),
            uploadedAt: z.preprocess((arg) => {
                if (typeof arg === "string" && arg) return new Date(arg);
                return arg;
            }, z.date().optional()),
        })
    ).optional(),
    isActive: z.boolean().optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    asm: z.string().optional(),
    se: z.string().optional(),
    documentVerification: z.object({
        documentAttached: z.array(
            z.object({
                name: z.enum(["aadhar", "PAN", "Electricity Bill", "Shop Agreement"]),
                url: z.string().min(1, "Document URL is required")
            })
        ).optional(),
        previousThreeMonthlydata: z.array(
            z.object({
                name: z.string().optional(),
                url: z.string().min(1, "Monthly data URL is required")
            })
        ).optional()
    }).optional()
});