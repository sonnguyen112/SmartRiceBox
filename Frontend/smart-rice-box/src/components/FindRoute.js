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
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl';
import ContentMarker from './ContentMarker';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WarehouseIcon from '@mui/icons-material/Warehouse';

export default function AlternateTimeline(props) {

  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [bound, setBound] = useState(null)
  const [markers, setMarkers] = useState(null)
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
        `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/find_route`
      )
      var responseJson = await response.json()
      console.log(responseJson)
      setData(responseJson)
      setMarkers(responseJson)
    })()
  }, [])

  useEffect(() => {
    if (data !== null&& markers !== null) {
      setLoading(false)
    }
  }, [data])


  useEffect(() => {
    if (markers !== null && data !== null) {
      var tempBound = []
      console.log(markers)
      for (var marker of markers) {
        tempBound.push([marker.position.lng, marker.position.lat])
      }
      if (tempBound.length == 1) {
        tempBound.push(tempBound[0])
      }
      console.log(tempBound)
      setBound(tempBound)
      setLoading(false)
    }
  }, [markers])

  // const data = [
  //   {
  //     "address": "135 Tran Hung Dao",
  //     "phone": "0364147637"
  //   },
  //   {
  //     "address": "135 Ly Thai To",
  //     "phone": "0909499154"
  //   }
  // ]

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
                  <TimelineConnector />
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
        fitBounds={bound.length > 0 ? bound : null}
        fitBoundsOptions={{ padding: 400 }}
      >
        <Marker
          coordinates={[106.705339, 10.753545]}
          anchor="bottom"
        >
          <div style={{ fontSize: "40px", cursor: 'pointer' }}>
            <WarehouseIcon/>
          </div>
        </Marker>
        {markers.map((marker, index) => {
          return (
            <div>
              <Marker
                coordinates={[marker.position.lng, marker.position.lat]}
                anchor="bottom"
                onClick={() => handleActiveMarker(marker.id)}>
                <div style={{ fontSize: "40px", cursor: 'pointer' }}>📍{index + 1}</div>
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

      </props.Map>
    </Stack>
  );
}