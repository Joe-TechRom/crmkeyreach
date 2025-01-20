'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


const mockProperties = [
  { id: 1, lat: 34.0522, lng: -118.2437, address: '123 Main St, Los Angeles, CA' },
  { id: 2, lat: 34.0689, lng: -118.4000, address: '456 Oak Ave, Los Angeles, CA' },
  { id: 3, lat: 34.0200, lng: -118.2800, address: '789 Pine Ln, Los Angeles, CA' },
];

function InteractiveMaps() {
  const { user } = useUser();
  const [map, setMap] = useState(null);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('interactive_maps', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map]);


  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Interactive Maps
      </Text>
      <MapContainer
        center={[34.0522, -118.2437]}
        zoom={10}
        style={{ height: '400px', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mockProperties.map((property) => (
          <Marker key={property.id} position={[property.lat, property.lng]}>
            <Popup>{property.address}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
}

export default InteractiveMaps;
