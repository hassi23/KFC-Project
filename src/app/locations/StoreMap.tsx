'use client';

import React, { useEffect, useRef } from 'react';
import type { Store } from '@prisma/client';
import type * as LType from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface StoreMapProps {
  stores: Store[];
  activeStoreId?: string | null;
}

export function StoreMap({ stores, activeStoreId }: StoreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const markersRef = useRef<Record<string, LType.Marker>>({});

  useEffect(() => {
    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const map = L.map(containerRef.current).setView([39.5, -75], 5);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      stores.forEach((store) => {
        const marker = L.marker([store.latitude, store.longitude], { icon })
          .addTo(map)
          .bindPopup(`<strong>${store.name}</strong><br/>${store.address}<br/>${store.hours}`);
        markersRef.current[store.id] = marker;
      });
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild markers when the filtered store list changes
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then((L) => {
      const map = mapRef.current;
      if (!map) return;

      Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
      markersRef.current = {};

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      stores.forEach((store) => {
        const marker = L.marker([store.latitude, store.longitude], { icon })
          .addTo(map)
          .bindPopup(`<strong>${store.name}</strong><br/>${store.address}<br/>${store.hours}`);
        markersRef.current[store.id] = marker;
      });

      if (stores.length > 0) {
        const bounds = L.latLngBounds(stores.map((s) => [s.latitude, s.longitude] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    });
  }, [stores]);

  useEffect(() => {
    if (!activeStoreId) return;
    const marker = markersRef.current[activeStoreId];
    if (marker && mapRef.current) {
      mapRef.current.setView(marker.getLatLng(), 13, { animate: true });
      marker.openPopup();
    }
  }, [activeStoreId]);

  return <div ref={containerRef} className="w-full h-full rounded-2xl z-0" />;
}
