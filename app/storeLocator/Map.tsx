"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { useEffect } from "react";

// Component to handle bounds and recentering
function MapCenter({ stores, selectedStore }: { stores: any[], selectedStore: any }) {
    const map = useMap();
    useEffect(() => {
        if (selectedStore) {
            const lat = selectedStore.lat || selectedStore.latitude;
            const lng = selectedStore.lon || selectedStore.longitude;
            if (lat && lng) {
                map.setView([parseFloat(lat), parseFloat(lng)], 16, {
                    animate: true,
                    duration: 1
                });
            }
        } else if (stores.length > 0) {
            const firstStore = stores[0];
            const lat = firstStore.lat || firstStore.latitude;
            const lng = firstStore.lon || firstStore.longitude;
            if (stores.length === 1 && lat && lng) {
                map.setView([parseFloat(lat), parseFloat(lng)], 13);
            } else {
                // If there are multiple stores, fit the map view to show all of them
                const validStores = stores.filter(s => (s.lat || s.latitude) && (s.lon || s.longitude));
                if (validStores.length > 0) {
                    const bounds = L.latLngBounds(validStores.map(s => [
                        parseFloat(s.lat || s.latitude), 
                        parseFloat(s.lon || s.longitude)
                    ]));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        } else {
            // Default center onto India
            map.setView([20.5937, 78.9629], 4);
        }
    }, [stores, selectedStore, map]);
    return null;
}

export default function StoreMap({ stores, selectedStore }: { stores: any[], selectedStore: any }) {
    return (
        <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: "100%", width: "100%", zIndex: 1 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapCenter stores={stores} selectedStore={selectedStore} />
            {stores.map((store) => {
                const lat = store.lat || store.latitude;
                const lng = store.lon || store.longitude;
                if (!lat || !lng) return null;
                return (
                    <Marker 
                        key={store.id} 
                        position={[parseFloat(lat), parseFloat(lng)]}
                    >
                        <Popup>
                            <strong>{store.name}</strong><br/>
                            {store.address}<br/>
                            <span style={{color: '#666'}}>{store.city}, {store.state} {store.pincode}</span>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
