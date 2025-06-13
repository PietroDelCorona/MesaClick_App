"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

declare global {
  interface Window {
    google: typeof google;
  }
}

type Location = {
  lat: number;
  lng: number;
};

type Market = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  location: Location;
};

export default function Map() {
  // Configurações constantes
  const containerStyle = useMemo(() => ({
    width: '100%',
    height: '600px'
  }), []);

  const defaultCenter = useMemo<Location>(() => ({
    lat: -23.5505,
    lng: -46.6333
  }), []);

  // Estados do componente
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearbyMarkets, setNearbyMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places']
  });

  // Obtém a localização do usuário
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        () => {
          setError('Não foi possível obter sua localização. Usando localização padrão.');
          setUserLocation(defaultCenter);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocalização não suportada. Usando localização padrão.');
      setUserLocation(defaultCenter);
      setLoading(false);
    }
  }, [defaultCenter]);

  // Busca mercados próximos usando PlacesService (versão tradicional)
  const fetchNearbyMarkets = useCallback(() => {
    if (!map || !userLocation || !window.google?.maps?.places) return;

    setLoading(true);
    
    const service = new google.maps.places.PlacesService(map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 2000,
      type: 'grocery_or_supermarket' // Busca apenas um tipo por vez
    };

    service.nearbySearch(request, (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const markets: Market[] = results.map((place: google.maps.places.PlaceResult, index: number) => ({
          id: place.place_id || `market-${index}`,
          name: place.name || 'Mercado sem nome',
          address: place.vicinity || 'Endereço não disponível',
          rating: place.rating,
          location: {
            lat: place.geometry?.location?.lat() || userLocation.lat,
            lng: place.geometry?.location?.lng() || userLocation.lng
          }
        }));
        
        setNearbyMarkets(markets);
      } else {
        console.error("Erro na busca:", status);
        setError("Erro ao carregar mercados próximos");
      }
      setLoading(false);
    });
  }, [map, userLocation]);

  // Efeitos colaterais
  useEffect(() => {
    if (isLoaded) {
      getUserLocation();
    }
  }, [isLoaded, getUserLocation]);

  useEffect(() => {
    if (userLocation && isLoaded && map) {
      fetchNearbyMarkets();
    }
  }, [userLocation, isLoaded, map, fetchNearbyMarkets]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Função para criar Size com tipagem segura
  const createMapSize = useCallback((width: number, height: number): google.maps.Size => {
    return new window.google.maps.Size(width, height);
  }, []);

  if (!isLoaded) return <div>Carregando mapa...</div>;

  return (
    <div className="relative">
      {loading && (
        <div className="absolute z-10 p-2 bg-white bg-opacity-80">
          Carregando...
        </div>
      )}
      {error && (
        <div className="absolute z-10 p-2 bg-yellow-100 text-yellow-800">
          {error}
        </div>
      )}
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            title="Sua localização"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: createMapSize(40, 40)
            }}
          />
        )}

        {nearbyMarkets.map((market) => (
          <Marker
            key={market.id}
            position={market.location}
            title={market.name}
            onClick={() => setSelectedMarket(market)}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: createMapSize(30, 30)
            }}
          />
        ))}

        {selectedMarket && (
          <InfoWindow
            position={selectedMarket.location}
            onCloseClick={() => setSelectedMarket(null)}
          >
            <div>
              <h3 className="font-bold">{selectedMarket.name}</h3>
              <p>{selectedMarket.address}</p>
              {selectedMarket.rating && (
                <p>Avaliação: {selectedMarket.rating} ★</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}