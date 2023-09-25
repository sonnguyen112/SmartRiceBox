import { useJsApiLoader } from "@react-google-maps/api"

const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GG_API
  })