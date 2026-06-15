import {
    GetHomePageData,
    GetAboutUsPageData,
    GetContactUsPageData,
    GetExtraData,
    GetManufacturingData,
    GetEventsData,
    GetExtensionData,
    GetCobrandingData,
    GetBecomeOurDistributorData,
    GetBecomeOurDistributorContactUsData,
    GetBrandPageData,
    GetStoreLocatorData
} from "@/src/lib/strapi";

export const dynamic = "force-dynamic";

export default async function StatusCheck() {
    const [
        homeData,
        aboutUsData,
        contactUsData,
        extraData,
        manufacturingData,
        eventsData,
        extensionData,
        cobrandingData,
        becomeOurDistributorData,
        becomeOurDistributorContactUsData,
        brandData,
        storeLocatorData
    ] = await Promise.all([
        GetHomePageData(),
        GetAboutUsPageData(),
        GetContactUsPageData(),
        GetExtraData(),
        GetManufacturingData(),
        GetEventsData(),
        GetExtensionData(),
        GetCobrandingData(),
        GetBecomeOurDistributorData(),
        GetBecomeOurDistributorContactUsData(),
        GetBrandPageData(),
        GetStoreLocatorData()
    ]);

    const statuses = [
        { name: "Home Page", status: !!homeData },
        { name: "About Us", status: !!aboutUsData },
        { name: "Contact Us", status: !!contactUsData },
        { name: "Extra", status: !!extraData },
        { name: "Manufacturing", status: !!manufacturingData },
        { name: "Events", status: !!eventsData },
        { name: "Extension", status: !!extensionData },
        { name: "Cobranding", status: !!cobrandingData },
        { name: "Become Our Distributor", status: !!becomeOurDistributorData },
        { name: "Become Our Distributor Contact Us", status: !!becomeOurDistributorContactUsData },
        { name: "Brand Page", status: !!brandData },
        { name: "Store Locator", status: !!storeLocatorData }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Strapi API Status Check
                    </h1>
                    <p className="text-gray-500 mb-8 font-medium">
                        Real-time status of all Strapi endpoints configured in the application.
                    </p>

                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Endpoint Data Source
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Data Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {statuses.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.status ? (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                    <svg className="w-4 h-4 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Data Received
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                                    <svg className="w-4 h-4 mr-1.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    Failed / No Data
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
