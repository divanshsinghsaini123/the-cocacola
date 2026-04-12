import { NextRequest, NextResponse } from "next/server";
import { GetStoreLocatorData } from "@/src/lib/strapi";
import { StoreLocator } from "@/src/models/StoreLocator";
import { connectDB } from "@/src/lib/mongoose";
import { isatty } from "tty";
// Haversine distance formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let lat = searchParams.get("lat");
    let lon = searchParams.get("lon");
    const pincode = searchParams.get("pincode");

    // Fetch store locator data
    const strapiData = await GetStoreLocatorData();
    if (!strapiData || !strapiData.Store) {
      return NextResponse.json({ error: "No stores data found" }, { status: 404 });
    }

    let stores = strapiData.Store;

    if (pincode) {
      // Fetch from nominatim
      await connectDB();
      const existingStore = await StoreLocator.findOne({ pincode });
      if (existingStore) {
        lat = existingStore.lat;
        lon = existingStore.lon;
      }
      else {
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData && geoData.length > 0) {
            lat = geoData[0].lat;
            lon = geoData[0].lon;
          } else {
            return NextResponse.json({ error: "Invalid pincode or no location found" }, { status: 400 });
          }
          //if found then store in database , so that we can save the api call time , 
          await StoreLocator.create({
            pincode,
            lat,
            lon,
            address: geoData[0].display_name,
            isActive: true
          });
        } else {
          return NextResponse.json({ error: "Failed to fetch geolocation data" }, { status: 500 });
        }
      }
    }

    if (lat && lon) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lon);

      stores = stores.map((store: any) => {
        const storeLat = parseFloat(store.latitude);
        const storeLng = parseFloat(store.longitude);
        let distance: number | null = null;

        if (!isNaN(storeLat) && !isNaN(storeLng)) {
          distance = getDistanceFromLatLonInKm(userLat, userLng, storeLat, storeLng);
        }

        return {
          ...store,
          distance
        };
      });

      // Sort by distance
      stores.sort((a: any, b: any) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return NextResponse.json({ stores, pageData: strapiData.PageButton });
  } catch (error: any) {
    console.error("Store Locator API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
