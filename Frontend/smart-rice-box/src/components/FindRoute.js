import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Loading from "../components/Loading"
import ReactMapboxGl, { Marker, Popup, Source, Layer } from 'react-mapbox-gl';
import ContentMarker from './ContentMarker';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { makeStyles } from '@mui/styles'

export default function AlternateTimeline(props) {

  var storage_lng = 106.694807
  var storage_lat = 10.767282

  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [bound, setBound] = useState(null)
  const [markers, setMarkers] = useState(null)
  const [activeMarker, setActiveMarker] = useState(null);
  const [geojson, setGeojson] = useState(null)

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };


  useEffect(() => {
    (async () => {
      var response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/find_route`
      )
      var responseJson = await response.json()
      console.log("Path",responseJson)
      let coords = [`${storage_lng},${storage_lat}`]
      for (let e of responseJson){
        coords.push(`${e.position.lng},${e.position.lat}`)
      }
      coords.push(`${storage_lng},${storage_lat}`)
      coords = coords.join(";")
      console.log("Coords", coords)
      var directRes = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.REACT_APP_MAP_BOX_API}`
      )
      var directResJson = await directRes.json()
      console.log("JSON",directResJson["routes"][0]["geometry"]["coordinates"])
      setGeojson({
        'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': directResJson["routes"][0]["geometry"]["coordinates"]
          }
      })
      setData(responseJson)
      setMarkers(responseJson)
    })()
  }, [])

  useEffect(() => {
    if (markers && data && geojson) {
      var tempBound = [[storage_lng, storage_lat]]
      for (var marker of markers) {
        tempBound.push([parseFloat(marker.position.lng).toFixed(6), parseFloat(marker.position.lat).toFixed(6)])
      }
      console.log(tempBound)
      setBound(tempBound)
      setLoading(false)
    }
  }, [data, markers, geojson])

  // const geojson = {
  //   'type': 'Feature',
  //   'properties': {},
  //   'geometry': {
  //     'type': 'LineString',
  //     'coordinates': [
  //       [106.694807, 10.767282],
  //       [106.694807, 12.767282],
  //     ]
  //   }
  // };
  

  return (loading ? <Loading loading={loading}></Loading> :
    <Stack>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Stack>
              <Typography>Kho</Typography>
            </Stack>
          </TimelineContent>
        </TimelineItem>
        {
          data.map((e, index) => {
            return (
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent>
                  <Stack>
                    <Typography>Địa chỉ: {e.address}</Typography>
                    <Typography>Điện thoại: {e.phone}</Typography>
                  </Stack>
                </TimelineContent>
              </TimelineItem>
            )
          })
        }
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            <Stack>
              <Typography>Kho</Typography>
            </Stack>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <props.Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        // fitBounds={bound.length > 0 ? bound : null}
        center = {[106.69102, 10.782568]}
        zoom = {[15]}
        // fitBoundsOptions={{ padding: 400 }}
      >
        <Marker
          coordinates={[storage_lng, storage_lat]}
          anchor="bottom"
        >
          <div style={{ fontSize: "40px", cursor: 'pointer' }}>

            <div style={{ fontSize: "40px", cursor: 'pointer', marginBottom: 20 }}>Kho</div>
            <div style={{ fontSize: "40px", cursor: 'pointer' }}>📍</div>
          </div>
        </Marker>
        {markers.map((marker, index) => {
          return (
            <div>
              <Marker
                coordinates={[marker.position.lng, marker.position.lat]}
                anchor="bottom"
                onClick={() => handleActiveMarker(marker.id)}>
                <Stack style={{ justifyContent: "center", alignItems: "center" }}>
                  <div style={{ fontSize: "40px", cursor: 'pointer', marginBottom: 20 }}>{index + 1}</div>
                  <div style={{ fontSize: "40px", cursor: 'pointer' }}>📍</div>
                </Stack>

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

                  {/* <ContentMarker marker={marker}></ContentMarker> */}
                  <Typography>Địa chỉ: {marker.address}</Typography>
                  <Typography>Điện thoại: {marker.phone}</Typography>
                </div>
              </Popup>}

            </div>
          )
        })}

        <Source id="route" geoJsonSource={{ type: 'geojson', data: geojson }} />
        <Layer
          id="route"
          type="line"
          sourceId="route"
          layout={{ 'line-join': 'round', 'line-cap': 'round' }}
          paint={{ 'line-color': '#0000FF', 'line-width': 8 }}
        />

      </props.Map>
    </Stack>
  );
}