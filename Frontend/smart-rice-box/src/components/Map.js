import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect } from 'react';
import ContentMarker from './ContentMarker';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import mapboxgl from 'mapbox-gl'
import Loading from "../components/Loading"

export default function MyMap(props) {

  const [markers, setMarkers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bound, setBound] = useState(null)
  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  useEffect(() => {
    (async () => {
        var response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/get_marker`
        )
        var responseJson = await response.json()
        // console.log(responseJson)

        var userIds = Object.keys(responseJson)
        var tempMarkers = []
        userIds.forEach(userId => {
            // console.log(userId)
            responseJson[userId].forEach((rice_box) => {
                // console.log(rice_box)
                tempMarkers.push({
                    id: rice_box.id,
                    name: rice_box.access_token,
                    url_dashboard: rice_box.url_dashboard,
                    position: {
                        lat: rice_box.latitude,
                        lng: rice_box.longitude
                    },
                    temperature: rice_box.current_temperature,
                    humidity: rice_box.current_humidity,
                    rice_amount: rice_box.current_rice_amount,
                    house_num_street: rice_box.house_num_street,
                    ward: rice_box.ward,
                    district: rice_box.district,
                    city: rice_box.city
                })
            })
        });
        // console.log(tempMarkers)
        setMarkers(tempMarkers)
    })()
}, [])

useEffect(() => {
  if (markers){
    var tempBound = []
    for (var marker of markers) {
      tempBound.push([marker.position.lng, marker.position.lat])
    }
    if (tempBound.length == 1){
      tempBound.push(tempBound[0])
    }
    console.log(tempBound)
    setBound(tempBound)
    setLoading(false)
  }
}, [markers])


  if (loading){
    return (
      <Loading loading={loading}></Loading>
    )
  }
  return (bound &&
    <props.Map
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        height: '100vh',
        width: '100vw'
      }}
      // fitBounds={bound.length > 0 ? bound : null}
      center = {[106.69102, 10.782568]}
      zoom = {[15]}
      // fitBoundsOptions={{padding:400}}
    >

      {markers.map(marker => {
        return (
          <div>
            <Marker
              coordinates={[marker.position.lng, marker.position.lat]}
              anchor="bottom"
              onClick={() => handleActiveMarker(marker.id)}>
              <div style={{ fontSize: "40px", cursor: 'pointer' }}>📍</div>
            </Marker>

            {activeMarker === marker.id && <Popup
              coordinates={[marker.position.lng, marker.position.lat]}
              offset={{
                'bottom': [0, -38]
              }}
              closeOnClick={true}
              onClose={() => console.log("CLode")}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={() => handleActiveMarker(null)}>
                    <CloseIcon />
                  </IconButton>
                </div>

                <ContentMarker marker={marker}></ContentMarker>
              </div>
            </Popup>}

          </div>
        )
      })}

    </props.Map>
  )
}