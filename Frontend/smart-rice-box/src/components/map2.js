import React, { useState, useCallback } from 'react'
import { useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import ContentMarker from './ContentMarker';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

function Map(props) {
  const isLoaded = props.isLoadedMap
  const [map, setMap] = React.useState(null)
  const [activeMarker, setActiveMarker] = useState(null);
  const markers = props.markers
  console.log(markers)

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      console.log("Mark: ", markers)
      markers.forEach(({ position }) => bounds.extend(position));
      map.fitBounds(bounds);
    }
  }, [map, markers])


  const onLoad = useCallback((map) => setMap(map), []);


  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getIcon = () => {
    const iconMarkerRed = new window.google.maps.MarkerImage(
      "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      null,
      null,
      null,
      new window.google.maps.Size(64, 64)
    );
    return iconMarkerRed
  }

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      { /* Child components, such as markers, info windows, etc. */}
      {markers.map((marker) => {
        console.log(marker)
        return (
          <MarkerF
            icon={getIcon()}
            key={marker.id}
            position={marker.position}
            onClick={() => handleActiveMarker(marker.id)}
          >
            {activeMarker === marker.id ? (
              <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                <div>
                  <ContentMarker marker={marker}></ContentMarker>
                </div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        )
      })}
      <></>
    </GoogleMap>
  ) : <></>
}

export default React.memo(Map)