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
    name: z.string().min(1, "Name is required"),
    pincode: z.number({ message: "Pincode is required" }),
    area: z.string().min(1, "Area is required"),
    mobileNumber: z.string().min(1, "Mobile number is required"),
    email: z.string().optional().or(z.literal('')),
    visicooler: z.array(z.string()).optional(),
    images: z.array(
        z.object({
            url: z.string().min(1, "Image URL is required"),
            uploadedAt: z.date().optional(),
        })
    ).optional(),
    isActive: z.boolean().optional(),
    asm: z.string().optional(),
    se: z.string().optional(),
});