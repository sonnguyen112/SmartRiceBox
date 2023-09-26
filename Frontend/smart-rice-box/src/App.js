import './App.css';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RiceBoxDetail from './pages/RiceBoxDetail';
import { useJsApiLoader } from '@react-google-maps/api';
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl';
import Login from './pages/Login';
import SignUp from './pages/Signup';

function App() {
  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: process.env.REACT_APP_GG_API
  // })

  const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAP_BOX_API
      
  });


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home Map={Map}/>}>
        </Route>
        <Route path="/detail" element={<RiceBoxDetail />}>
        </Route>
        <Route path="/login" element={<Login />}>
        </Route>
        <Route path="/signup" element={<SignUp />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
