import { useEffect, useRef, useState } from 'react';
import type { Project } from '@shared/schema';

interface OpenStreetMapProps {
  projects: Project[];
  onProjectSelect: (project: Project | null) => void;
  selectedProject: Project | null;
}

declare global {
  interface Window {
    L: any;
  }
}

export function OpenStreetMap({ projects, onProjectSelect, selectedProject }: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      setIsLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    const map = L.map(mapRef.current).setView([24.7136, 46.6753], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const categoryColors: Record<string, string> = {
      'Environmental': '#10b981',
      'Social': '#3b82f6',
      'Infrastructure': '#f59e0b',
      'Healthcare': '#ef4444',
      'Education': '#8b5cf6',
      'Economic Development': '#06b6d4',
    };

    const markers = projects.map(project => {
      if (!project.latitude || !project.longitude) return null;

      const color = categoryColors[project.category] || '#6b7280';
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          "></div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([project.latitude, project.longitude], { icon })
        .addTo(map)
        .on('click', () => {
          onProjectSelect(project);
        });

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${project.title}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${project.category}</p>
          <p style="margin: 0; font-size: 12px; color: #999;">${project.region}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);

      return marker;
    }).filter(Boolean);

    markersRef.current = markers as any[];

    if (markers.length > 0 && projects.length > 0) {
      const validProjects = projects.filter(p => p.latitude && p.longitude);
      if (validProjects.length > 0) {
        const bounds = L.latLngBounds(
          validProjects.map(p => [p.latitude!, p.longitude!])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
      }
    }
  }, [projects, isLoaded, onProjectSelect]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !selectedProject) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    if (selectedProject.latitude && selectedProject.longitude) {
      map.setView([selectedProject.latitude, selectedProject.longitude], 12, {
        animate: true,
      });

      const marker = markersRef.current.find((m: any) => {
        const latLng = m.getLatLng();
        return latLng.lat === selectedProject.latitude && latLng.lng === selectedProject.longitude;
      });

      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedProject, isLoaded]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
      data-testid="openstreetmap-container"
    />
  );
}
