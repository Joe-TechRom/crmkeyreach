'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardBody,
  Image,
  Text,
  Badge,
  VStack,
  Skeleton
} from '@chakra-ui/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { supabase } from '@/lib/supabase/client'

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

export default function PropertyMapper({ clientId }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523
  })

  useEffect(() => {
    fetchProperties()
    const subscription = setupPropertySubscription()
    return () => subscription.unsubscribe()
  }, [clientId])

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('client_id', clientId)

    if (data && data.length > 0) {
      setProperties(data)
      setCenter({
        lat: data[0].latitude,
        lng: data[0].longitude
      })
    }
    setLoading(false)
  }

  const setupPropertySubscription = () => {
    return supabase
      .channel(`properties-${clientId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'properties',
          filter: `client_id=eq.${clientId}`
        }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setProperties(prev => [...prev, payload.new])
          }
          if (payload.eventType === 'DELETE') {
            setProperties(prev => prev.filter(prop => prop.id !== payload.old.id))
          }
          if (payload.eventType === 'UPDATE') {
            setProperties(prev => prev.map(prop => 
              prop.id === payload.new.id ? payload.new : prop
            ))
          }
        }
      )
      .subscribe()
  }

  return (
    <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
      <Box>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
          >
            {properties.map(property => (
              <Marker 
                key={property.id}
                position={{
                  lat: property.latitude,
                  lng: property.longitude
                }}
                title={property.address}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </Box>

      <VStack spacing={4}>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} height="200px" width="100%" />
          ))
        ) : (
          properties.map(property => (
            <Card key={property.id} width="100%">
              <CardBody>
                <Image
                  src={property.image_url || '/property-placeholder.jpg'}
                  alt={property.address}
                  borderRadius="lg"
                  fallback={<Skeleton height="200px" />}
                />
                <VStack align="start" mt={4} spacing={2}>
                  <Text fontWeight="bold">{property.address}</Text>
                  <Badge colorScheme="green">
                    ${property.price.toLocaleString()}
                  </Badge>
                  <Text fontSize="sm">
                    {property.bedrooms} beds • {property.bathrooms} baths • {property.square_feet.toLocaleString()} sqft
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {property.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))
        )}
      </VStack>
    </Grid>
  )
}
